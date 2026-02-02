from typing import Optional, List, Dict
from datetime import datetime
from pydantic import BaseModel, EmailStr


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
    posted_date: Optional[datetime] = None
    expires_date: Optional[datetime] = None
    is_active: bool
    job_metadata: dict = {}
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobListResponse(BaseModel):
    """Paginated job list response."""
    items: List[JobResponse]
    total: int
    skip: int
    limit: int
    has_more: bool


# Alert Schemas

class AlertFilters(BaseModel):
    """Filter criteria for job alerts."""
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None


class AlertCreate(BaseModel):
    """Create new alert."""
    email: EmailStr
    name: str
    filters: AlertFilters = AlertFilters()


class AlertUpdate(BaseModel):
    """Update existing alert."""
    name: Optional[str] = None
    filters: Optional[AlertFilters] = None
    is_active: Optional[bool] = None


class AlertResponse(BaseModel):
    """Alert response."""
    id: int
    email: str
    name: str
    filters: Dict
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Resume Match Schemas

class JobMatchResponse(BaseModel):
    """Single job with match score."""
    job: JobResponse
    match_score: int
    matched_keywords: int


class ResumeMatchResponse(BaseModel):
    """Resume matching results."""
    total_jobs_scored: int
    top_matches: List[JobMatchResponse]
