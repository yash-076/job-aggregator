from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from urllib.parse import urlparse

from app.core.config import settings


def _is_postgres_database(url: str) -> bool:
    return urlparse(url).scheme.startswith("postgresql")


engine_kwargs = {
    "echo": False,
    "pool_pre_ping": settings.db_pool_pre_ping,
    "pool_recycle": settings.db_pool_recycle_seconds,
    "pool_size": settings.db_pool_size,
    "max_overflow": settings.db_max_overflow,
    "pool_timeout": settings.db_pool_timeout_seconds,
    "pool_use_lifo": settings.db_pool_use_lifo,
}

if _is_postgres_database(settings.database_url):
    connect_args = {
        "connect_timeout": settings.db_connect_timeout_seconds,
        "keepalives": settings.db_keepalives,
        "keepalives_idle": settings.db_keepalives_idle,
        "keepalives_interval": settings.db_keepalives_interval,
        "keepalives_count": settings.db_keepalives_count,
    }
    if settings.db_sslmode:
        connect_args["sslmode"] = settings.db_sslmode

    engine_kwargs["connect_args"] = connect_args

engine = create_engine(settings.database_url, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """
    Dependency for FastAPI to get DB session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
