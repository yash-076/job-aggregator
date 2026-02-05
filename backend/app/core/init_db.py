import sys
from pathlib import Path

# Add parent directory to path for direct script execution
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sqlalchemy import inspect

from app.core.database import engine, Base
from app.models.job_model import Job


def init_db():
    """
    Create all tables only when database is empty.
    """
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    if existing_tables:
        print("Database already initialized. Skipping table creation.")
        return

    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")


if __name__ == "__main__":
    init_db()
