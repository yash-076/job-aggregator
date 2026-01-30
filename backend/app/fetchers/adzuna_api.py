import logging
from typing import List

import httpx

from app.core.config import settings
from app.fetchers.base import BaseFetcher, JobData

logger = logging.getLogger(__name__)


class AdzunaApiFetcher(BaseFetcher):
    """
    Public Adzuna Jobs API fetcher (JSON-based).
    https://developer.adzuna.com/overview
    """

    def __init__(self, query: str = "software engineer", location: str | None = None):
        self.query = query
        self.location = location
        self.app_id = settings.adzuna_app_id
        self.app_key = settings.adzuna_app_key
        self.country = settings.adzuna_country
        self.base_url = settings.adzuna_base_url

    async def fetch(self) -> List[JobData]:
        if not self.app_id or not self.app_key:
            logger.warning("Adzuna API credentials not configured; skipping")
            return []

        url = f"{self.base_url}/jobs/{self.country}/search/1"
        params = {
            "app_id": self.app_id,
            "app_key": self.app_key,
            "what": self.query,
        }
        if self.location:
            params["where"] = self.location

        jobs: List[JobData] = []

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(
                    url,
                    params=params,
                    headers={"Accept": "application/json"},
                )
                response.raise_for_status()
                data = response.json()

            for item in data.get("results", []):
                title = item.get("title")
                company = (item.get("company") or {}).get("display_name")
                location = (item.get("location") or {}).get("display_name")
                description = item.get("description")
                apply_link = item.get("redirect_url")

                if not company:
                    continue

                jobs.append(
                    JobData(
                        title=title,
                        company=company,
                        location=location,
                        description=description,
                        apply_link=apply_link,
                        source="adzuna_api",
                    )
                )

        except httpx.HTTPError as e:
            logger.error(f"Adzuna HTTP error: {e}")
        except Exception as e:
            logger.error(f"Adzuna unexpected error: {e}")

        return jobs
