from dataclasses import dataclass
from backend.app.core.redis import redis


@dataclass
class DedupService:
    namespace: str = "jobs:dedup"
    ttl_seconds: int = 14 * 24 * 60 * 60  # keep dedup memory for 14 days

    async def is_duplicate(self, dedup_hash: str) -> bool:
        key = f"{self.namespace}:{dedup_hash}"
        exists = await redis.exists(key)
        return bool(exists)

    async def mark_seen(self, dedup_hash: str) -> None:
        key = f"{self.namespace}:{dedup_hash}"
        # set key with TTL so memory doesn't grow forever
        await redis.set(key, "1", ex=self.ttl_seconds)
