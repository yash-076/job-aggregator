import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.redis import redis
from app.models.job_model import Job
from redis.exceptions import ConnectionError as RedisConnectionError

logger = logging.getLogger(__name__)


class RedisSyncService:
    """
    Syncs database dedup hashes to Redis for fast lookups.
    Runs periodically to ensure consistency.
    """

    def __init__(self, db: Session | None = None):
        self.db = db or SessionLocal()
        self.namespace = "jobs:dedup"
        self.ttl_seconds = 14 * 24 * 60 * 60  # 14 days

    async def sync_to_redis(self) -> int:
        """
        Read all dedup hashes from database and populate Redis.
        Returns count of synced hashes.
        """
        try:
            # Get all dedup hashes from database
            jobs = self.db.query(Job.dedup_hash).filter(
                Job.dedup_hash.isnot(None)
            ).all()

            synced_count = 0
            for (dedup_hash,) in jobs:
                key = f"{self.namespace}:{dedup_hash}"
                try:
                    await redis.set(key, "1", ex=self.ttl_seconds)
                    synced_count += 1
                except RedisConnectionError:
                    logger.warning("Redis unavailable during sync")
                    break

            logger.info(
                f"Synced {synced_count} dedup hashes from database to Redis"
            )
            return synced_count

        except Exception as e:
            logger.error(f"Error syncing database to Redis: {e}")
            return 0

    async def check_consistency(self) -> dict:
        """
        Check consistency between database and Redis.
        Returns report with counts.
        """
        try:
            # Count in database
            db_count = self.db.query(Job).filter(
                Job.dedup_hash.isnot(None)
            ).count()

            # Count in Redis (approximate - using KEYS pattern)
            try:
                redis_keys = await redis.keys(f"{self.namespace}:*")
                redis_count = len(redis_keys)
            except RedisConnectionError:
                logger.warning("Redis unavailable for consistency check")
                redis_count = 0

            report = {
                "database_count": db_count,
                "redis_count": redis_count,
                "consistent": db_count == redis_count,
                "timestamp": datetime.now().isoformat(),
            }

            logger.info(
                f"Consistency check: DB={db_count}, Redis={redis_count}, "
                f"Consistent={report['consistent']}"
            )

            return report

        except Exception as e:
            logger.error(f"Error checking consistency: {e}")
            return {"error": str(e)}
