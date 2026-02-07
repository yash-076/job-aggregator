import sys
from pathlib import Path

# Add parent directory to path for direct script execution
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sqlalchemy import inspect

from app.core.database import engine, Base
from app.models.job_model import Job
from app.models.alert_model import UserAlert
from app.models.user_model import User


def init_db():
    """
    Create missing tables (non-destructive).
    """
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()

    Base.metadata.create_all(bind=engine)

    if existing_tables:
        print("Database checked. Missing tables created if needed.")
    else:
        print("Database tables created successfully.")


if __name__ == "__main__":
    init_db()
