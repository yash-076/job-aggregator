from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import logging

from app.core.database import get_db
from app.services.resume_parser import ResumeParser
from app.services.job_matcher import JobMatcher
from app.services.job_repository import JobRepository
from app.api.schemas import ResumeMatchResponse, JobMatchResponse, JobResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/match", tags=["resume-matching"])


@router.post("/resume", response_model=ResumeMatchResponse)
async def match_resume(
    resume: UploadFile = File(..., description="PDF resume file"),
    top_n: int = 20,
    db: Session = Depends(get_db),
) -> ResumeMatchResponse:
    """
    Upload a PDF resume and get top matching jobs.
    
    - Extracts text from PDF
    - Compares against active jobs using keyword matching
    - Returns ranked list of jobs with match scores
    """
    # Validate file type
    if not resume.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Read PDF bytes
        pdf_bytes = await resume.read()
        
        # Extract text
        resume_text = ResumeParser.extract_text_from_bytes(pdf_bytes)
        
        if not resume_text:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from PDF. Please ensure it's a valid PDF with readable text."
            )
        
        logger.info(f"Extracted {len(resume_text)} characters from resume")
        
        # Get all active jobs
        repo = JobRepository(db)
        jobs, total = repo.search_jobs(is_active=True, limit=1000)
        
        if not jobs:
            return ResumeMatchResponse(
                total_jobs_scored=0,
                top_matches=[]
            )
        
        # Match jobs
        matches = JobMatcher.match_jobs(resume_text, jobs, top_n=top_n)
        
        # Build response
        top_matches = [
            JobMatchResponse(
                job=JobResponse.model_validate(match["job"]),
                match_score=match["match_score"],
                matched_keywords=match["matched_keywords"]
            )
            for match in matches
        ]
        
        return ResumeMatchResponse(
            total_jobs_scored=len(jobs),
            top_matches=top_matches
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing resume: {e}")
        raise HTTPException(status_code=500, detail="Error processing resume")
