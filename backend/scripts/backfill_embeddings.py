#!/usr/bin/env python
"""
One-time migration script to backfill embeddings for existing jobs
that don't have vector embeddings stored yet.

Usage:
    cd backend
    python -m scripts.backfill_embeddings

This is safe to run multiple times — it only processes jobs where
embedding IS NULL.
"""
import sys
from pathlib import Path

# Add parent directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

import asyncio
import logging
from app.core.database import SessionLocal, engine, Base
from app.core.config import settings
from app.services.job_repository import JobRepository
from app.services.embedding_service import EmbeddingService

logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)

# How many jobs to process per batch (matches embed-batch call size)
BATCH_SIZE = settings.embedding_batch_size


async def main():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    logger.info("Database ready")

    db = SessionLocal()
    embedding_service = EmbeddingService()
    total_updated = 0

    try:
        repo = JobRepository(db)

        while True:
            # Fetch a batch of jobs missing embeddings
            jobs_missing = repo.get_jobs_without_embeddings(limit=BATCH_SIZE)

            if not jobs_missing:
                logger.info("No more jobs without embeddings. Backfill complete.")
                break

            logger.info(f"Processing batch of {len(jobs_missing)} jobs...")

            # Build texts for embedding
            texts = [
                EmbeddingService.build_job_text(job.title or "", job.description or "")
                for job in jobs_missing
            ]

            # Call the embedding microservice
            embeddings = await embedding_service.embed_batch(texts)

            if embeddings is None:
                logger.error(
                    "Embedding service returned None (unavailable or error). "
                    "Stopping backfill. Re-run this script when the service is back."
                )
                break

            # Pair job IDs with their embeddings and update DB
            pairs = [
                (job.id, emb)
                for job, emb in zip(jobs_missing, embeddings)
                if emb is not None
            ]

            if pairs:
                updated = repo.update_embeddings_batch(pairs)
                total_updated += updated
                logger.info(f"Updated {updated} jobs in this batch (total: {total_updated})")
            else:
                logger.warning("No valid embeddings returned for this batch, stopping.")
                break

    finally:
        db.close()

    logger.info(f"Backfill complete. Total jobs updated with embeddings: {total_updated}")


if __name__ == "__main__":
    asyncio.run(main())
