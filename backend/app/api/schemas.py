from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator


class JobResponse(BaseModel):
    """Single job response."""
    id: int
    title: str
    company: str
    location: Optional[str] = None
    job_type: str
    description: Optional[str] = None
    apply_link: str
    source: str
    is_active: bool
    job_metadata: Union[Dict, List] = {}
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_validator('job_metadata', mode='before')
    @classmethod
    def coerce_metadata(cls, v):
        """Handle legacy data where trailing comma stored a tuple/list."""
        if isinstance(v, (list, tuple)) and len(v) == 1 and isinstance(v[0], dict):
            return v[0]
        return v if v is not None else {}

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


# Auth Schemas

class UserCreate(BaseModel):
    """Register a new user."""
    email: EmailStr
    full_name: str
    password: str


class UserLogin(BaseModel):
    """Login payload (non-OAuth form usage)."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """User response."""
    id: int
    email: EmailStr
    full_name: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """JWT access token response."""
    access_token: str
    token_type: str
