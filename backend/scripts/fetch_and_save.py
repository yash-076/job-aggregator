#!/usr/bin/env python
"""
Fetch jobs from all sources, normalize, deduplicate, and save to database.
"""
import asyncio
import logging
from sqlalchemy.orm import Session

from backend.app.core.database import SessionLocal, engine, Base
from backend.app.core.config import settings
from backend.app.services.fetcher_service import FetcherService
from backend.app.services.job_repository import JobRepository

logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)


async def main():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    logger.info("Database ready")

    # Fetch normalized, unique jobs
    fetcher = FetcherService()
    logger.info("Fetching jobs...")
    jobs = await fetcher.fetch_normalized_unique(include_platform=False)
    logger.info(f"Fetched {len(jobs)} unique jobs")

    if not jobs:
        logger.warning("No jobs fetched, exiting")
        return

    # Save to database
    db: Session = SessionLocal()
    try:
        repo = JobRepository(db)
        saved_count = repo.save_jobs_batch(jobs)
        logger.info(f"Saved {saved_count} jobs to database")
    finally:
        db.close()


if __name__ == "__main__":
    asyncio.run(main())
