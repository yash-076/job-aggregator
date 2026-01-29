import logging
import httpx
from typing import List
from datetime import datetime
from app.fetchers.base import BaseFetcher, JobData

logger = logging.getLogger(__name__)


class LinkedInFetcher(BaseFetcher):
    """
    Fetcher for LinkedIn Jobs API (public data).
    Uses LinkedIn jobs search endpoint.
    """

    BASE_URL = "https://www.linkedin.com/jobs-guest/jobs/api/searchWithCurrentFilters"
    
    def __init__(self, keywords: str = "software engineer", location: str = "United States"):
        self.keywords = keywords
        self.location = location
        self.source = "linkedin"

    async def fetch(self) -> List[JobData]:
        """
        Fetch jobs from LinkedIn.
        """
        jobs = []
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            params = {
                'keywords': self.keywords,
                'location': self.location,
                'pageNum': 0,
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(self.BASE_URL, params=params, headers=headers)
                response.raise_for_status()
                
                # Parse HTML response
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(response.text, 'lxml')
                
                # Extract job cards
                job_cards = soup.find_all('div', class_='base-card')
                
                for card in job_cards:
                    try:
                        job_data = self._parse_job_card(card)
                        if job_data:
                            jobs.append(job_data)
                    except Exception as e:
                        logger.warning(f"Error parsing LinkedIn job card: {e}")
                        continue
        
        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching from LinkedIn: {e}")
        except Exception as e:
            logger.error(f"Unexpected error in LinkedInFetcher: {e}")
        
        return jobs

    def _parse_job_card(self, card) -> JobData | None:
        """
        Parse a single LinkedIn job card.
        """
        try:
            title_elem = card.find('h3', class_='base-search-card__title')
            company_elem = card.find('h4', class_='base-search-card__subtitle')
            location_elem = card.find('span', class_='job-search-card__location')
            link_elem = card.find('a', class_='base-card__full-link')
            
            if not title_elem or not company_elem:
                return None
            
            title = title_elem.get_text(strip=True)
            company = company_elem.get_text(strip=True)
            location = location_elem.get_text(strip=True) if location_elem else None
            source_url = link_elem.get('href', '') if link_elem else ''
            
            if not source_url:
                return None
            
            # LinkedIn doesn't expose job type in HTML easily, default to full-time
            job_type = 'full-time'
            
            return JobData(
                title=title,
                company=company,
                location=location,
                job_type=job_type,
                description=None,  # Would require additional request
                source_url=source_url,
                source=self.source,
                posted_date=datetime.now().isoformat(),
            )
        
        except Exception as e:
            logger.debug(f"Error parsing LinkedIn job card: {e}")
            return None
