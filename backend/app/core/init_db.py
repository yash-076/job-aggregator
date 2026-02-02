import sys
from pathlib import Path

# Add parent directory to path for direct script execution
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.core.database import engine, Base
from app.models.job_model import Job


def init_db():
    """
    Create all tables in the database.
    """
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")


if __name__ == "__main__":
    init_db()
