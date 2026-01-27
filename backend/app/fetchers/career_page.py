import logging
import httpx
from bs4 import BeautifulSoup
from typing import List
import yaml
from pathlib import Path

from backend.app.fetchers.base import BaseFetcher, JobData

logger = logging.getLogger(__name__)


class CareerPageFetcher(BaseFetcher):
    """
    Generic fetcher for company career pages using YAML configs.
    """

    def __init__(self, config_path: str):
        """
        Initialize with path to YAML config.
        """
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        
        self.company = self.config.get('company')
        self.base_url = self.config.get('base_url')
        self.job_url = self.config.get('job_url')
        self.selectors = self.config.get('selectors', {})
        self.source = self.config.get('source', self.company.lower().replace(' ', '_'))

    async def fetch(self) -> List[JobData]:
        """
        Fetch and parse jobs from career page.
        """
        jobs = []
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(self.job_url)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'lxml')
                job_elements = soup.select(self.selectors.get('job_container', ''))
                
                for element in job_elements:
                    try:
                        job_data = self._parse_job(element)
                        if job_data:
                            jobs.append(job_data)
                    except Exception as e:
                        logger.warning(f"Error parsing job element: {e}")
                        continue
        
        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching from {self.job_url}: {e}")
        except Exception as e:
            logger.error(f"Unexpected error in CareerPageFetcher: {e}")
        
        return jobs

    def _parse_job(self, element) -> JobData | None:
        """
        Parse a single job element from the page.
        """
        try:
            title_elem = element.select_one(self.selectors.get('title', ''))
            location_elem = element.select_one(self.selectors.get('location', ''))
            job_type_elem = element.select_one(self.selectors.get('job_type', ''))
            link_elem = element.select_one(self.selectors.get('link', ''))
            description_elem = element.select_one(self.selectors.get('description', ''))
            
            if not title_elem or not link_elem:
                return None
            
            title = title_elem.get_text(strip=True)
            location = location_elem.get_text(strip=True) if location_elem else None
            job_type = job_type_elem.get_text(strip=True) if job_type_elem else "full-time"
            source_url = link_elem.get('href', '')
            description = description_elem.get_text(strip=True) if description_elem else None
            
            # Make absolute URL if needed
            if source_url and not source_url.startswith('http'):
                source_url = self.base_url.rstrip('/') + '/' + source_url.lstrip('/')
            
            return JobData(
                title=title,
                company=self.company,
                location=location,
                job_type=self._normalize_job_type(job_type),
                description=description,
                source_url=source_url,
                source=self.source,
                metadata={'raw_job_type': job_type}
            )
        
        except Exception as e:
            logger.debug(f"Error parsing job element: {e}")
            return None

    def _normalize_job_type(self, raw_type: str) -> str:
        """
        Normalize job type to standard values.
        """
        raw_type = raw_type.lower().strip()
        
        if 'intern' in raw_type:
            return 'internship'
        elif 'contract' in raw_type or 'temporary' in raw_type:
            return 'contract'
        else:
            return 'full-time'
