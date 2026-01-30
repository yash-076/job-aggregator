from abc import ABC, abstractmethod
from typing import List
from pydantic import BaseModel


class JobData(BaseModel):
    """
    Unified raw job format.
    """
    title: str | None
    company: str
    location: str | None = None
    description: str | None = None
    apply_link: str | None = None
    source: str  # e.g., "career_page", "adzuna_api"


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
