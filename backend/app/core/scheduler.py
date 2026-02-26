import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app.services.redis_sync_service import RedisSyncService
from app.services.fetcher_service import FetcherService
from app.services.job_repository import JobRepository
from app.services.alert_service import AlertService
from app.services.email_service import EmailService
from app.services.email_queue_service import EmailQueueService
from app.services.embedding_service import EmbeddingService
from app.models.alert_model import UserAlert
from app.core.database import SessionLocal

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def sync_redis_job():
    """Background job to sync database to Redis every hour."""
    logger.info("Starting Redis sync job...")
    sync_service = RedisSyncService()
    await sync_service.sync_to_redis()
    await sync_service.check_consistency()


async def _generate_and_store_embeddings(saved_jobs, repo):
    """
    Generate embeddings for newly saved jobs and store them in the DB.
    If the embedding service is unavailable, logs a warning and skips.
    The backfill task will pick them up later.
    """
    if not saved_jobs:
        return

    embedding_service = EmbeddingService()
    texts = [
        EmbeddingService.build_job_text(job.title or "", job.description or "")
        for job in saved_jobs
    ]

    embeddings = await embedding_service.embed_batch(texts)

    if embeddings is None:
        logger.warning(
            f"Embedding service unavailable. {len(saved_jobs)} jobs saved without embeddings "
            "(backfill will handle them later)."
        )
        return

    pairs = [
        (job.id, emb)
        for job, emb in zip(saved_jobs, embeddings)
        if emb is not None
    ]
    if pairs:
        updated = repo.update_embeddings_batch(pairs)
        logger.info(f"Stored embeddings for {updated} jobs")


async def fetch_and_save_job():
    """Background job to fetch and save jobs every hour.
    Embeddings are NOT generated here — the backfill job running
    every minute will pick up new jobs and generate embeddings
    incrementally, avoiding timeouts on free-tier services.
    """
    logger.info("Starting fetch and save job...")
    try:
        fetcher = FetcherService()
        unique_jobs = await fetcher.fetch_normalized_unique()
        
        if unique_jobs:
            db = SessionLocal()
            try:
                repo = JobRepository(db)
                saved_count, saved_jobs = repo.save_jobs_batch(unique_jobs)
                logger.info(f"Fetch and save job completed: {saved_count} jobs saved (embeddings deferred to backfill)")
                
                # Check alerts and queue notifications (async)
                if saved_count > 0 and saved_jobs:
                    logger.info("Checking alerts...")
                    alert_service = AlertService(db)
                    alerts = db.query(UserAlert).filter_by(is_active=True).all()

                    if not alerts:
                        logger.info("No active alerts found, skipping email queue")
                        return
                    
                    notifications_queued = 0
                    for alert in alerts:
                        matching_jobs = alert_service._match_jobs_to_alert(alert, saved_jobs)
                        if matching_jobs:
                            logger.info(f"Alert '{alert.name}' matched {len(matching_jobs)} jobs")
                            if await EmailQueueService.queue_email(alert.email, alert.name, matching_jobs):
                                notifications_queued += 1

                    if notifications_queued > 0:
                        logger.info(f"Queued {notifications_queued} alert notifications")
                    else:
                        logger.info("No alert matches found, email queue not triggered")
            finally:
                db.close()
        else:
            logger.info("No unique jobs to save")
    except Exception as e:
        logger.error(f"Error in fetch and save job: {e}")


async def backfill_embeddings_job():
    """
    Background job that runs every minute to incrementally generate
    embeddings for jobs that don't have them yet.

    Processes a small batch each run (BACKFILL_BATCH_SIZE) to stay
    within free-tier timeout limits. Over successive runs every
    minute, all jobs will eventually get embeddings.
    """
    BACKFILL_BATCH_SIZE = 1  # process one job per minute to avoid free-tier timeouts

    try:
        db = SessionLocal()
        try:
            repo = JobRepository(db)
            jobs_missing = repo.get_jobs_without_embeddings(limit=BACKFILL_BATCH_SIZE)

            if not jobs_missing:
                # Nothing to do — all jobs have embeddings
                return

            logger.info(f"Backfill: processing {len(jobs_missing)} jobs without embeddings...")
            await _generate_and_store_embeddings(jobs_missing, repo)
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Error in backfill embeddings job: {e}")


async def process_email_queue_job():
    """Background job to process email queue every 5 minutes."""
    try:
        queue_size = await EmailQueueService.get_queue_size()
        if queue_size == 0:
            return

        logger.info(f"Processing email queue ({queue_size} emails)...")
        email_service = EmailService()
        processed = 0

        # Process up to MAX_BATCH_SIZE emails at a time to avoid timeouts
        while processed < EmailQueueService.MAX_BATCH_SIZE:
            task = await EmailQueueService.pop_queue()
            if not task:
                break

            try:
                # Send the email
                to_email = task["to_email"]
                alert_name = task["alert_name"]
                jobs_data = task["jobs"]

                # Reconstruct minimal job objects for email body
                class JobData:
                    def __init__(self, data):
                        self.title = data["title"]
                        self.company = data["company"]
                        self.location = data["location"]
                        self.job_type = data["job_type"]
                        self.source = data["source"]
                        self.apply_link = data["apply_link"]

                jobs = [JobData(job) for job in jobs_data]
                email_service.send_job_alert(to_email, alert_name, jobs)
                processed += 1

            except Exception as e:
                logger.error(f"Error processing email task: {e}")
                processed += 1

        logger.info(f"Email queue job completed: {processed} emails sent")

    except Exception as e:
        logger.error(f"Error in email queue job: {e}")


async def cleanup_old_jobs():
    """
    Background job to delete jobs older than 30 days.
    Runs once a month to keep the database lean.
    """
    logger.info("Starting old jobs cleanup...")
    try:
        db = SessionLocal()
        try:
            repo = JobRepository(db)
            deleted = repo.delete_old_jobs(older_than_days=30)
            logger.info(f"Old jobs cleanup complete: {deleted} jobs removed")
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Error in old jobs cleanup: {e}")


def start_background_scheduler():
    """Start the APScheduler for background tasks."""
    if scheduler.running:
        return

    # Add job to run every 1 hour
    scheduler.add_job(
        sync_redis_job,
        IntervalTrigger(hours=1),
        id="redis_sync_job",
        name="Sync Redis with Database every 1 hour",
    )

    # Add job to fetch and save every 1 hour
    scheduler.add_job(
        fetch_and_save_job,
        IntervalTrigger(hours=1),
        id="fetch_and_save_job",
        name="Fetch and save jobs every 1 hour",
    )

    # Add job to backfill missing embeddings every 1 minute
    scheduler.add_job(
        backfill_embeddings_job,
        IntervalTrigger(minutes=1),
        id="backfill_embeddings_job",
        name="Backfill missing job embeddings every 1 minute",
    )

    # Add job to process email queue every 5 minutes
    scheduler.add_job(
        process_email_queue_job,
        IntervalTrigger(minutes=5),
        id="email_queue_job",
        name="Process email queue every 5 minutes",
    )

    # Add job to clean up old jobs every 30 days
    scheduler.add_job(
        cleanup_old_jobs,
        IntervalTrigger(days=30),
        id="cleanup_old_jobs",
        name="Delete jobs older than 30 days (monthly)",
    )

    scheduler.start()
    logger.info("Background scheduler started")


def stop_background_scheduler():
    """Stop the background scheduler."""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Background scheduler stopped")
