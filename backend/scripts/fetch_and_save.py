#!/usr/bin/env python
"""
Fetch jobs from all sources, normalize, deduplicate, and save to database.
"""
import sys
from pathlib import Path

# Add parent directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

import asyncio
import logging
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, engine, Base
from app.core.config import settings
from app.services.fetcher_service import FetcherService
from app.services.job_repository import JobRepository
from app.services.alert_service import AlertService

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
        saved_count, saved_jobs = repo.save_jobs_batch(jobs)
        logger.info(f"Saved {saved_count} jobs to database")
        
        # Check alerts and send notifications
        if saved_count > 0 and saved_jobs:
            logger.info("Checking alerts...")
            alert_service = AlertService(db)
            notifications_sent = alert_service.check_and_notify(saved_jobs)
            logger.info(f"Sent {notifications_sent} alert notifications")
    finally:
        db.close()


if __name__ == "__main__":
    asyncio.run(main())
