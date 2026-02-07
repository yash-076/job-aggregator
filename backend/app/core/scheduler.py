import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app.services.redis_sync_service import RedisSyncService
from app.services.fetcher_service import FetcherService
from app.services.job_repository import JobRepository
from app.services.alert_service import AlertService
from app.services.email_service import EmailService
from app.services.email_queue_service import EmailQueueService
from app.core.database import SessionLocal

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def sync_redis_job():
    """Background job to sync database to Redis every hour."""
    logger.info("Starting Redis sync job...")
    sync_service = RedisSyncService()
    await sync_service.sync_to_redis()
    await sync_service.check_consistency()


async def fetch_and_save_job():
    """Background job to fetch and save jobs every 2 hours."""
    logger.info("Starting fetch and save job...")
    try:
        fetcher = FetcherService()
        unique_jobs = await fetcher.fetch_normalized_unique()
        
        if unique_jobs:
            db = SessionLocal()
            try:
                repo = JobRepository(db)
                saved_count, saved_jobs = repo.save_jobs_batch(unique_jobs)
                logger.info(f"Fetch and save job completed: {saved_count} jobs saved")
                
                # Check alerts and queue notifications (non-blocking)
                if saved_count > 0 and saved_jobs:
                    logger.info("Checking alerts...")
                    alert_service = AlertService(db)
                    notifications_queued = alert_service.check_and_notify(saved_jobs)
                    logger.info(f"Queued {notifications_queued} alert notifications")
            finally:
                db.close()
        else:
            logger.info("No unique jobs to save")
    except Exception as e:
        logger.error(f"Error in fetch and save job: {e}")


async def process_email_queue_job():
    """Background job to process email queue every 5 minutes."""
    try:
        queue_size = EmailQueueService.get_queue_size()
        if queue_size == 0:
            return

        logger.info(f"Processing email queue ({queue_size} emails)...")
        email_service = EmailService()
        processed = 0

        # Process up to MAX_BATCH_SIZE emails at a time to avoid timeouts
        while processed < EmailQueueService.MAX_BATCH_SIZE:
            task = EmailQueueService.pop_queue()
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

    # Add job to fetch and save every 2 hours
    scheduler.add_job(
        fetch_and_save_job,
        IntervalTrigger(hours=2),
        id="fetch_and_save_job",
        name="Fetch and save jobs every 2 hours",
    )

    # Add job to process email queue every 5 minutes
    scheduler.add_job(
        process_email_queue_job,
        IntervalTrigger(minutes=5),
        id="email_queue_job",
        name="Process email queue every 5 minutes",
    )

    scheduler.start()
    logger.info("Background scheduler started")


def stop_background_scheduler():
    """Stop the background scheduler."""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Background scheduler stopped")
