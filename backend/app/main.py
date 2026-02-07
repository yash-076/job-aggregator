from fastapi import FastAPI
from contextlib import asynccontextmanager
import logging
from fastapi.middleware.cors import CORSMiddleware
import os

from app.core.config import settings
from app.core.scheduler import start_background_scheduler, stop_background_scheduler
from app.core.init_db import init_db
from app.api.job_routes import router as jobs_router
from app.api.alert_routes import router as alerts_router
from app.api.match_routes import router as match_router

logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)

# CORS origins from environment
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000"
).split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup: create tables, initialize DB, start background scheduler.
    Shutdown: cleanup and stop scheduler.
    """
    try:
        logger.info("Starting up...")
        init_db()  # Initialize database schema only if empty
        logger.info("Database initialized successfully.")
        start_background_scheduler()
        logger.info("Background scheduler started.")
    except Exception as e:
        logger.error(f"Startup failed: {e}", exc_info=True)
        raise
    
    yield
    
    try:
        logger.info("Shutting down...")
        stop_background_scheduler()
        logger.info("Background scheduler stopped.")
    except Exception as e:
        logger.error(f"Shutdown error: {e}", exc_info=True)


app = FastAPI(
    title="Job Aggregator API",
    description="Backend for job aggregation platform",
    version="0.1.0",
    lifespan=lifespan,
)

# Enable CORS with environment-based origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(jobs_router)
app.include_router(alerts_router)
app.include_router(match_router)


@app.get("/", operation_id="default_page")
async def default_page():
    """Health check endpoint."""
    return {"status": "healthy", "message": "Server is Running"}


@app.api_route("/health", methods=["GET", "HEAD"], operation_id="health_check")
async def health_check():
    """Health check for load balancers and monitoring (supports GET and HEAD)."""
    return {"status": "ok"}
