from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_
import logging

from app.models.job_model import Job
from app.services.normalizer import NormalizedJob

logger = logging.getLogger(__name__)


class JobRepository:
    """
    Service layer for job database operations.
    """

    def __init__(self, db: Session):
        self.db = db

    def save_job(self, job: NormalizedJob) -> Job:
        """
        Save a normalized job to the database.
        If dedup_hash already exists, update instead of duplicate.
        """
        existing = self.db.query(Job).filter_by(dedup_hash=job.dedup_hash).first()

        if existing:
            # Update existing job
            existing.title = job.title
            existing.company = job.company
            existing.location = job.location
            existing.job_type = job.job_type
            existing.description = job.description
            existing.source_url = job.apply_link
            existing.source = job.source
            existing.metadata = job.metadata
            existing.is_active = True
            self.db.commit()
            return existing

        # Create new job
        db_job = Job(
            title=job.title,
            company=job.company,
            location=job.location,
            job_type=job.job_type,
            description=job.description,
            source_url=job.apply_link,
            source=job.source,
            dedup_hash=job.dedup_hash,
            metadata=job.metadata,
            is_active=True,
        )
        self.db.add(db_job)
        self.db.commit()
        self.db.refresh(db_job)
        return db_job

    def save_jobs_batch(self, jobs: List[NormalizedJob]) -> tuple[int, List[Job]]:
        """
        Batch save multiple normalized jobs.
        Returns (count, list_of_saved_jobs).
        """
        count = 0
        saved_jobs = []
        for job in jobs:
            try:
                saved_job = self.save_job(job)
                saved_jobs.append(saved_job)
                count += 1
            except Exception as e:
                logger.error(f"Error saving job {job.title}: {e}")
                continue
        return count, saved_jobs

    def get_job_by_id(self, job_id: int) -> Optional[Job]:
        """Get job by ID."""
        return self.db.query(Job).filter_by(id=job_id).first()

    def search_jobs(
        self,
        title: Optional[str] = None,
        company: Optional[str] = None,
        location: Optional[str] = None,
        job_type: Optional[str] = None,
        source: Optional[str] = None,
        is_active: bool = True,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[List[Job], int]:
        """
        Search jobs with optional filters.
        Returns (results, total_count).
        """
        query = self.db.query(Job).filter_by(is_active=is_active)

        if title:
            query = query.filter(Job.title.ilike(f"%{title}%"))
        if company:
            query = query.filter(Job.company.ilike(f"%{company}%"))
        if location:
            query = query.filter(Job.location.ilike(f"%{location}%"))
        if job_type:
            query = query.filter_by(job_type=job_type)
        if source:
            query = query.filter_by(source=source)

        total = query.count()
        jobs = query.order_by(Job.created_at.desc()).offset(skip).limit(limit).all()

        return jobs, total
