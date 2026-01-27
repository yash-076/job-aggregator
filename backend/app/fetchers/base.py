from abc import ABC, abstractmethod
from typing import List
from pydantic import BaseModel


class JobData(BaseModel):
    """
    Normalized job data schema.
    """
    title: str
    company: str
    location: str | None = None
    job_type: str  # internship, full-time, contract
    description: str | None = None
    source_url: str
    source: str  # e.g., "google_careers", "linkedin"
    posted_date: str | None = None
    expires_date: str | None = None
    metadata: dict = {}


class BaseFetcher(ABC):
    """
    Abstract base class for all job fetchers.
    """

    @abstractmethod
    async def fetch(self) -> List[JobData]:
        """
        Fetch jobs and return normalized job data.
        """
        pass
