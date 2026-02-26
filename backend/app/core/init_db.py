import sys
from pathlib import Path

# Add parent directory to path for direct script execution
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

import logging
from sqlalchemy import inspect, text

from app.core.database import engine, Base
from app.models.job_model import Job
from app.models.alert_model import UserAlert
from app.models.user_model import User

logger = logging.getLogger(__name__)


def _run_migrations():
    """
    Run lightweight schema migrations for new columns on existing tables.
    Each migration is idempotent (checks before altering).
    """
    with engine.connect() as conn:
        # Migration: Add 'embedding' JSON column to jobs table
        result = conn.execute(text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name='jobs' AND column_name='embedding'"
        ))
        if not result.fetchone():
            logger.info("Running migration: adding 'embedding' column to 'jobs' table...")
            conn.execute(text("ALTER TABLE jobs ADD COLUMN embedding JSON"))
            conn.commit()
            logger.info("Migration complete: 'embedding' column added.")
        else:
            logger.debug("Migration check: 'embedding' column already exists, skipping.")


def init_db():
    """
    Create missing tables (non-destructive), then run column migrations.
    """
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()

    Base.metadata.create_all(bind=engine)

    if existing_tables:
        print("Database checked. Missing tables created if needed.")
    else:
        print("Database tables created successfully.")

    # Run schema migrations for new columns on existing tables
    _run_migrations()


if __name__ == "__main__":
    init_db()
