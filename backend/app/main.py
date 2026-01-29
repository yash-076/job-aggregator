from fastapi import FastAPI
from contextlib import asynccontextmanager
import logging

from app.core.database import engine, Base
from app.core.config import settings
from app.api.job_routes import router as jobs_router
from app.api.alert_routes import router as alerts_router

logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup: create tables if not exist.
    Shutdown: cleanup if needed.
    """
    logger.info("Starting up...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables ensured.")
    yield
    logger.info("Shutting down...")


app = FastAPI(
    title="Job Aggregator API",
    description="Backend for job aggregation platform",
    version="0.1.0",
    lifespan=lifespan,
)

# Include routers
app.include_router(jobs_router)
app.include_router(alerts_router)


@app.get("/")
async def default_page():
    return "Server is Running"

@app.get("/health")
async def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
