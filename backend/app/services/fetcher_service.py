import logging
from typing import List
from pathlib import Path
from app.fetchers.base import JobData
from app.fetchers.career_page import CareerPageFetcher
from app.fetchers.platform import LinkedInFetcher
from app.services.normalizer import normalize, NormalizedJob
from app.services.dedup_service import DedupService

logger = logging.getLogger(__name__)

class FetcherService:
    """
    Orchestrates job fetching from multiple sources.
    """

    def __init__(self, config_dir: str = "app/configs/companies"):
        self.config_dir = Path(config_dir)

    async def fetch_all(self, include_platform: bool = True) -> List[JobData]:
        """
        Fetch jobs from all configured career pages and optionally platforms.
        """
        all_jobs = []

        # Fetch from career pages
        career_page_jobs = await self._fetch_from_career_pages()
        all_jobs.extend(career_page_jobs)
        logger.info(f"Fetched {len(career_page_jobs)} jobs from career pages")

        # Fetch from platforms
        if include_platform:
            platform_jobs = await self._fetch_from_platforms()
            all_jobs.extend(platform_jobs)
            logger.info(f"Fetched {len(platform_jobs)} jobs from platforms")

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

    async def _fetch_from_platforms(self) -> List[JobData]:
        """
        Fetch from job platforms (LinkedIn, etc.).
        """
        jobs = []

        try:
            linkedin_fetcher = LinkedInFetcher(keywords="software engineer")
            linkedin_jobs = await linkedin_fetcher.fetch()
            jobs.extend(linkedin_jobs)
            logger.info(f"Fetched {len(linkedin_jobs)} jobs from LinkedIn")
        except Exception as e:
            logger.error(f"Error fetching from LinkedIn: {e}")

        return jobs

    async def fetch_by_source(self, source: str) -> List[JobData]:
        """
        Fetch jobs from a specific source.
        """
        if source == "linkedin":
            fetcher = LinkedInFetcher()
            return await fetcher.fetch()
        
        # Try to load from career page config
        config_file = self.config_dir / f"{source}.yaml"
        if config_file.exists():
            fetcher = CareerPageFetcher(str(config_file))
            return await fetcher.fetch()
        
        logger.warning(f"Source not found: {source}")
        return []

    async def fetch_normalized_unique(self, include_platform: bool = True) -> List[NormalizedJob]:
        """
        Phase 3: Fetch, normalize, and deduplicate jobs using Redis.
        Returns a list of unique normalized jobs ready for storage.
        """
        raw_jobs = await self.fetch_all(include_platform=include_platform)
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
