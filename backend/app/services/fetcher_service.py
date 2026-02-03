import logging
from typing import List
from pathlib import Path
from app.fetchers.base import JobData
from app.fetchers.career_page import CareerPageFetcher
from app.fetchers.adzuna_api import AdzunaApiFetcher
from app.services.normalizer import normalize, NormalizedJob
from app.services.dedup_service import DedupService

logger = logging.getLogger(__name__)

class FetcherService:
    """
    Orchestrates job fetching from multiple sources.
    """

    def __init__(self, config_dir: str = "app/configs/companies"):
        self.config_dir = Path(config_dir)

    async def fetch_all(self) -> List[JobData]:
        """
        Fetch jobs from all configured career pages and public APIs.
        """
        all_jobs = []

        # Fetch from career pages
        career_page_jobs = await self._fetch_from_career_pages()
        all_jobs.extend(career_page_jobs)
        logger.info(f"Fetched {len(career_page_jobs)} jobs from career pages")

        api_jobs = await self._fetch_from_public_apis()
        all_jobs.extend(api_jobs)
        logger.info(f"Fetched {len(api_jobs)} jobs from public APIs")

        return all_jobs

    async def _fetch_from_career_pages(self) -> List[JobData]:
        """
        Fetch from all YAML configured career pages.
        """
        jobs = []
        
        if not self.config_dir.exists():
            logger.warning(f"Config directory not found: {self.config_dir}")
            return jobs

        yaml_files = list(self.config_dir.glob('*.yaml'))
        logger.info(f"Found {len(yaml_files)} career page configs")

        for config_file in yaml_files:
            try:
                fetcher = CareerPageFetcher(str(config_file))
                company_jobs = await fetcher.fetch()
                jobs.extend(company_jobs)
                logger.info(f"Fetched {len(company_jobs)} jobs from {fetcher.company}")
            except Exception as e:
                logger.error(f"Error fetching from {config_file}: {e}")
                continue

        return jobs

    async def _fetch_from_public_apis(self) -> List[JobData]:
        """
        Fetch from public job APIs (e.g., Adzuna).
        Supports multiple job queries from config.
        """
        from app.core.config import settings
        
        jobs: List[JobData] = []
        
        # Parse queries from config (comma-separated)
        queries = [q.strip() for q in settings.adzuna_job_queries.split(",") if q.strip()]
        
        for query in queries:
            try:
                logger.info(f"Fetching Adzuna jobs for: {query}")
                adzuna = AdzunaApiFetcher(query=query)
                adzuna_jobs = await adzuna.fetch()
                jobs.extend(adzuna_jobs)
                logger.info(f"Fetched {len(adzuna_jobs)} jobs for query '{query}'")
            except Exception as e:
                logger.error(f"Error fetching from Adzuna API for query '{query}': {e}")

        return jobs

    async def fetch_normalized_unique(self) -> List[NormalizedJob]:
        """
        Phase 3: Fetch, normalize, and deduplicate jobs using Redis.
        Returns a list of unique normalized jobs ready for storage.
        """
        raw_jobs = await self.fetch_all()
        dedup = DedupService()
        unique: List[NormalizedJob] = []

        for job in raw_jobs:
            nj = normalize(job)
            # Check dedup using Redis TTL-backed memory
            if not await dedup.is_duplicate(nj.dedup_hash):
                unique.append(nj)
                await dedup.mark_seen(nj.dedup_hash)

        logger.info(f"Normalized {len(raw_jobs)} jobs -> {len(unique)} unique jobs")
        return unique
