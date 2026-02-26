import json
import logging
from typing import List
from app.core.redis import redis
from app.models.job_model import Job

logger = logging.getLogger(__name__)

EMAIL_QUEUE_KEY = "email_queue"
# Max emails to process in one batch to avoid timeouts
MAX_BATCH_SIZE = 5


class EmailQueueService:
    """
    Service for queuing and processing email alerts asynchronously.
    Prevents blocking of main requests/scheduler jobs.
    """

    MAX_BATCH_SIZE = 5

    @staticmethod
    async def queue_email(to_email: str, alert_name: str, jobs: List[Job]) -> bool:
        """
        Queue an email for sending instead of sending immediately.
        Returns True if queued successfully.
        """
        try:
            # Serialize jobs to JSON (only store essential fields)
            jobs_data = [
                {
                    "title": job.title,
                    "company": job.company,
                    "location": job.location,
                    "job_type": job.job_type,
                    "source": job.source,
                    "apply_link": job.apply_link,
                }
                for job in jobs
            ]

            task = {
                "to_email": to_email,
                "alert_name": alert_name,
                "jobs": jobs_data,
            }

            # Push to Redis queue
            await redis.rpush(EMAIL_QUEUE_KEY, json.dumps(task))
            logger.info(f"Queued email for {to_email} with {len(jobs)} jobs")
            return True

        except Exception as e:
            logger.error(f"Error queuing email for {to_email}: {e}")
            return False

    @staticmethod
    async def get_queue_size() -> int:
        """Get current queue size."""
        return await redis.llen(EMAIL_QUEUE_KEY)

    @staticmethod
    async def peek_queue(count: int = 1) -> List[dict]:
        """Peek at items in queue without removing them."""
        try:
            items = await redis.lrange(EMAIL_QUEUE_KEY, 0, count - 1)
            return [json.loads(item) for item in items] if items else []
        except Exception as e:
            logger.error(f"Error peeking queue: {e}")
            return []

    @staticmethod
    async def pop_queue() -> dict | None:
        """Remove and return the first item from queue."""
        try:
            item = await redis.lpop(EMAIL_QUEUE_KEY)
            if item:
                return json.loads(item)
        except Exception as e:
            logger.error(f"Error popping from queue: {e}")
        return None
