import asyncio
import logging
from backend.app.services.fetcher_service import FetcherService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def test_fetchers():
    """
    Test fetching from all sources.
    """
    service = FetcherService()
    
    # Fetch all jobs
    jobs = await service.fetch_all(include_platform=False)  # Disable LinkedIn for now
    
    logger.info(f"\n{'='*60}")
    logger.info(f"Total jobs fetched: {len(jobs)}")
    logger.info(f"{'='*60}\n")
    
    for job in jobs[:5]:  # Show first 5
        logger.info(f"Title: {job.title}")
        logger.info(f"Company: {job.company}")
        logger.info(f"Location: {job.location}")
        logger.info(f"Type: {job.job_type}")
        logger.info(f"URL: {job.source_url}")
        logger.info(f"Source: {job.source}")
        logger.info("-" * 60)


if __name__ == "__main__":
    asyncio.run(test_fetchers())
