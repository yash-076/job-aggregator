from dataclasses import dataclass
import logging

from redis.exceptions import ConnectionError as RedisConnectionError

from app.core.redis import redis

logger = logging.getLogger(__name__)


@dataclass
class DedupService:
    namespace: str = "jobs:dedup"
    ttl_seconds: int = 14 * 24 * 60 * 60  # keep dedup memory for 14 days

    async def is_duplicate(self, dedup_hash: str) -> bool:
        """Check if hash exists in Redis. Falls back to False if Redis is down."""
        key = f"{self.namespace}:{dedup_hash}"
        try:
            exists = await redis.exists(key)
            return bool(exists)
        except RedisConnectionError as e:
            logger.warning("Redis unavailable; skipping dedup check: %s", e)
            # Return False so the job is processed (database dedup will catch it)
            return False

    async def mark_seen(self, dedup_hash: str) -> None:
        """Mark hash as seen in Redis. Non-critical if Redis is down."""
        key = f"{self.namespace}:{dedup_hash}"
        try:
            await redis.set(key, "1", ex=self.ttl_seconds)
        except RedisConnectionError as e:
            logger.warning("Redis unavailable; skipping dedup mark: %s", e)
