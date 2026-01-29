from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.services.job_repository import JobRepository
from app.api.schemas import JobResponse, JobListResponse

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=JobListResponse)
async def search_jobs(
    title: Optional[str] = Query(None, description="Job title filter"),
    company: Optional[str] = Query(None, description="Company filter"),
    location: Optional[str] = Query(None, description="Location filter"),
    job_type: Optional[str] = Query(None, description="Job type (internship, full-time, contract)"),
    source: Optional[str] = Query(None, description="Source (e.g., google_careers, linkedin)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
) -> JobListResponse:
    """
    Search jobs with optional filters.
    Returns paginated results.
    """
    repo = JobRepository(db)
    jobs, total = repo.search_jobs(
        title=title,
        company=company,
        location=location,
        job_type=job_type,
        source=source,
        skip=skip,
        limit=limit,
    )

    return JobListResponse(
        items=[JobResponse.model_validate(job) for job in jobs],
        total=total,
        skip=skip,
        limit=limit,
        has_more=(skip + limit) < total,
    )


@router.get("/{job_id}", response_model=JobResponse)
async def get_job_detail(
    job_id: int,
    db: Session = Depends(get_db),
) -> JobResponse:
    """
    Get a single job by ID.
    """
    repo = JobRepository(db)
    job = repo.get_job_by_id(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return JobResponse.model_validate(job)
