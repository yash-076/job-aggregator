from typing import Optional, List
from pydantic import BaseModel


class JobResponse(BaseModel):
    """Single job response."""
    id: int
    title: str
    company: str
    location: Optional[str] = None
    job_type: str
    description: Optional[str] = None
    source_url: str
    source: str
    posted_date: Optional[str] = None
    expires_date: Optional[str] = None
    is_active: bool
    metadata: dict = {}
    created_at: str
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class JobListResponse(BaseModel):
    """Paginated job list response."""
    items: List[JobResponse]
    total: int
    skip: int
    limit: int
    has_more: bool
