import logging
from typing import List, Dict
from app.models.job_model import Job
from app.services.resume_parser import ResumeParser

logger = logging.getLogger(__name__)


class JobMatcher:
    """
    Match resume text against job descriptions using keyword overlap.
    Simple, explainable scoring (no ML/AI).
    """

    @staticmethod
    def match_jobs(resume_text: str, jobs: List[Job], top_n: int = 20) -> List[Dict]:
        """
        Score and rank jobs based on resume keyword match.
        
        Args:
            resume_text: Extracted resume text
            jobs: List of Job objects to score
            top_n: Number of top matches to return
        
        Returns:
            List of dicts with job and match_score, sorted by score descending
        """
        if not resume_text or not jobs:
            return []

        resume_keywords = ResumeParser.extract_keywords(resume_text)
        
        if not resume_keywords:
            logger.warning("No keywords extracted from resume")
            return []

        scored_jobs = []

        for job in jobs:
            score = JobMatcher._calculate_match_score(resume_keywords, job)
            scored_jobs.append({
                "job": job,
                "match_score": score,
                "matched_keywords": score  # For now, score = keyword count
            })

        # Sort by score descending
        scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)

        return scored_jobs[:top_n]

    @staticmethod
    def _calculate_match_score(resume_keywords: set, job: Job) -> int:
        """
        Calculate match score between resume keywords and job.
        
        Simple scoring:
        - Title match: weight higher
        - Description match: standard weight
        - Company/location match: bonus
        
        Returns integer score (higher = better match).
        """
        score = 0
        
        # Extract keywords from job fields
        title_keywords = ResumeParser.extract_keywords(job.title or "")
        description_keywords = ResumeParser.extract_keywords(job.description or "")
        company_keywords = ResumeParser.extract_keywords(job.company or "")
        location_keywords = ResumeParser.extract_keywords(job.location or "")
        
        # Title matches (weight: 3x)
        title_matches = resume_keywords & title_keywords
        score += len(title_matches) * 3
        
        # Description matches (weight: 1x)
        description_matches = resume_keywords & description_keywords
        score += len(description_matches)
        
        # Company matches (bonus: +2)
        company_matches = resume_keywords & company_keywords
        if company_matches:
            score += 2
        
        # Location matches (bonus: +1)
        location_matches = resume_keywords & location_keywords
        if location_matches:
            score += 1
        
        return score
