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
        key = f"{self.namespace}:{dedup_hash}"
        try:
            exists = await redis.exists(key)
            return bool(exists)
        except RedisConnectionError as e:
            logger.warning("Redis unavailable; skipping dedup check: %s", e)
            return False

    async def mark_seen(self, dedup_hash: str) -> None:
        key = f"{self.namespace}:{dedup_hash}"
        # set key with TTL so memory doesn't grow forever
        try:
            await redis.set(key, "1", ex=self.ttl_seconds)
        except RedisConnectionError as e:
            logger.warning("Redis unavailable; skipping dedup mark: %s", e)
