import sys
from pathlib import Path

# Add parent directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

import asyncio
import logging
from app.services.fetcher_service import FetcherService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def test_fetchers():
    """
    Test fetching from all sources.
    """
    service = FetcherService()
    
    # Fetch all jobs
    jobs = await service.fetch_all()
    
    logger.info(f"\n{'='*60}")
    logger.info(f"Total jobs fetched: {len(jobs)}")
    logger.info(f"{'='*60}\n")
    
    for job in jobs[:5]:  # Show first 5
        logger.info(f"Title: {job.title}")
        logger.info(f"Company: {job.company}")
        logger.info(f"Location: {job.location}")
        logger.info(f"Apply Link: {job.apply_link}")
        logger.info(f"Source: {job.source}")
        logger.info("-" * 60)


if __name__ == "__main__":
    asyncio.run(test_fetchers())
