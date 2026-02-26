from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta
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

    def save_job(self, job: NormalizedJob, embedding: Optional[List[float]] = None) -> Job:
        """
        Save a normalized job to the database.
        If dedup_hash already exists, update instead of duplicate.
        Optionally stores the vector embedding.
        """
        existing = self.db.query(Job).filter_by(dedup_hash=job.dedup_hash).first()

        if existing:
            # Update existing job
            existing.title = job.title
            existing.company = job.company
            existing.location = job.location
            existing.job_type = job.job_type
            existing.description = job.description
            existing.apply_link = job.apply_link
            existing.source = job.source
            existing.job_metadata = job.job_metadata
            existing.is_active = True
            if embedding is not None:
                existing.embedding = embedding
            self.db.commit()
            return existing

        # Create new job
        db_job = Job(
            title=job.title,
            company=job.company,
            location=job.location,
            job_type=job.job_type,
            description=job.description,
            apply_link=job.apply_link,
            source=job.source,
            dedup_hash=job.dedup_hash,
            job_metadata=job.job_metadata,
            embedding=embedding,
            is_active=True,
        )
        self.db.add(db_job)
        self.db.commit()
        self.db.refresh(db_job)
        return db_job

    def save_jobs_batch(
        self,
        jobs: List[NormalizedJob],
        embeddings: Optional[List[Optional[List[float]]]] = None,
    ) -> tuple[int, List[Job]]:
        """
        Batch save multiple normalized jobs.
        Optionally accepts a parallel list of embeddings (one per job).
        Returns (count, list_of_saved_jobs).
        """
        count = 0
        saved_jobs = []
        for idx, job in enumerate(jobs):
            try:
                emb = embeddings[idx] if embeddings and idx < len(embeddings) else None
                saved_job = self.save_job(job, embedding=emb)
                saved_jobs.append(saved_job)
                count += 1
            except Exception as e:
                logger.error(f"Error saving job {job.title}: {e}")
                continue
        return count, saved_jobs

    def get_job_by_id(self, job_id: int) -> Optional[Job]:
        """Get job by ID."""
        return self.db.query(Job).filter_by(id=job_id).first()

    def get_jobs_without_embeddings(self, limit: int = 500) -> List[Job]:
        """
        Get active jobs that don't have embeddings yet.
        Used by the backfill process.
        """
        return (
            self.db.query(Job)
            .filter_by(is_active=True)
            .filter(Job.embedding.is_(None))
            .order_by(Job.created_at.desc())
            .limit(limit)
            .all()
        )

    def update_embeddings_batch(self, job_embedding_pairs: List[tuple]) -> int:
        """
        Bulk update embeddings for jobs.
        
        Args:
            job_embedding_pairs: List of (job_id, embedding_vector) tuples.
        
        Returns:
            Number of jobs updated.
        """
        updated = 0
        for job_id, embedding in job_embedding_pairs:
            try:
                job = self.db.query(Job).filter_by(id=job_id).first()
                if job:
                    job.embedding = embedding
                    updated += 1
            except Exception as e:
                logger.error(f"Error updating embedding for job {job_id}: {e}")
                continue
        self.db.commit()
        return updated

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

    def delete_old_jobs(self, older_than_days: int = 30) -> int:
        """
        Delete jobs older than the specified number of days.
        Removes stale listings to keep the database lean.
        
        Args:
            older_than_days: Delete jobs created before this many days ago.
        
        Returns:
            Number of jobs deleted.
        """
        cutoff = datetime.utcnow() - timedelta(days=older_than_days)
        try:
            count = (
                self.db.query(Job)
                .filter(Job.created_at < cutoff)
                .delete(synchronize_session="fetch")
            )
            self.db.commit()
            logger.info(f"Deleted {count} jobs older than {older_than_days} days (before {cutoff.date()})")
            return count
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting old jobs: {e}")
            return 0
