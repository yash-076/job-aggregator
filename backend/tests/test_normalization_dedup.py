import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

import asyncio
from backend.app.fetchers.base import JobData
from backend.app.services.normalizer import normalize, compute_dedup_hash
from backend.app.services.dedup_service import DedupService


async def _demo():
    job1 = JobData(
        title="Software Engineer",
        company="Acme Corp",
        location="San Francisco, CA",
        description="Build things",
        apply_link="https://jobs.example.com/listing/123?utm_source=abc",
        source="career_page",
    )

    job2 = JobData(
        title="Software   Engineer",
        company="Acme Corp",
        location="San Francisco, CA",
        description="Build things",
        apply_link="https://jobs.example.com/listing/123?utm_campaign=xyz",
        source="career_page",
    )

    n1 = normalize(job1)
    n2 = normalize(job2)

    assert n1.apply_link == n2.apply_link  # canonicalized
    assert n1.dedup_hash == n2.dedup_hash  # same content -> same hash

    dedup = DedupService(ttl_seconds=60)
    assert not await dedup.is_duplicate(n1.dedup_hash)
    await dedup.mark_seen(n1.dedup_hash)
    assert await dedup.is_duplicate(n2.dedup_hash)

    print("Normalization & dedup demo passed.")


if __name__ == "__main__":
    asyncio.run(_demo())
