from backend.app.core.database import engine, Base
from backend.app.models.job_model import Job


def init_db():
    """
    Create all tables in the database.
    """
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")


if __name__ == "__main__":
    init_db()
