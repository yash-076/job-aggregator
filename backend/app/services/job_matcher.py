import logging
import numpy as np
from typing import List, Dict, Optional
from app.models.job_model import Job
from app.services.resume_parser import ResumeParser

logger = logging.getLogger(__name__)

# Hybrid scoring weights
SEMANTIC_WEIGHT = 0.7
KEYWORD_WEIGHT = 0.3


class JobMatcher:
    """
    Match resume text against job descriptions using a hybrid approach:
    - Cosine similarity on vector embeddings (semantic)
    - Keyword overlap score (lexical)
    
    Falls back to keyword-only when embeddings are unavailable.
    """

    # ── Hybrid matching (primary) ────────────────────────────────

    @staticmethod
    def match_jobs_hybrid(
        resume_text: str,
        resume_embedding: Optional[List[float]],
        jobs: List[Job],
        top_n: int = 20,
    ) -> List[Dict]:
        """
        Score and rank jobs using a blend of semantic + keyword matching.
        
        Args:
            resume_text: Extracted resume text (for keyword scoring).
            resume_embedding: Embedding vector of the resume (can be None).
            jobs: List of Job objects to score.
            top_n: Number of top matches to return.
        
        Returns:
            List of dicts with job, match_score (0-100), keyword_score,
            and semantic_score, sorted descending.
        """
        if not resume_text or not jobs:
            return []

        resume_keywords = ResumeParser.extract_keywords(resume_text)

        # -- Compute raw keyword scores ---------------------------------
        keyword_scores: List[float] = []
        for job in jobs:
            ks = JobMatcher._calculate_keyword_score(resume_keywords, job)
            keyword_scores.append(float(ks))

        # Normalize keyword scores to 0-1 range
        max_ks = max(keyword_scores) if keyword_scores else 1.0
        norm_keyword = [s / max_ks if max_ks > 0 else 0.0 for s in keyword_scores]

        # -- Compute cosine similarity scores ---------------------------
        has_resume_emb = resume_embedding is not None and len(resume_embedding) > 0
        cosine_scores: List[float] = []

        for job in jobs:
            if has_resume_emb and job.embedding:
                cs = JobMatcher._cosine_similarity(resume_embedding, job.embedding)
                cosine_scores.append(cs)
            else:
                # No embedding available – will rely only on keyword score
                cosine_scores.append(0.0)

        # -- Blend into final score -------------------------------------
        scored_jobs = []
        for idx, job in enumerate(jobs):
            job_has_emb = bool(job.embedding)

            if has_resume_emb and job_has_emb:
                # Full hybrid score
                final = (
                    SEMANTIC_WEIGHT * cosine_scores[idx]
                    + KEYWORD_WEIGHT * norm_keyword[idx]
                )
            else:
                # Fallback: keyword-only (normalized to 0-1)
                final = norm_keyword[idx]

            scored_jobs.append({
                "job": job,
                "match_score": round(final * 100, 2),      # 0-100 scale
                "keyword_score": round(norm_keyword[idx] * 100, 2),
                "semantic_score": round(cosine_scores[idx] * 100, 2),
            })

        scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)
        return scored_jobs[:top_n]

    # ── Legacy keyword-only matching (kept for backward compat) ──

    @staticmethod
    def match_jobs(resume_text: str, jobs: List[Job], top_n: int = 20) -> List[Dict]:
        """
        Score and rank jobs based on resume keyword match only.
        Kept as a fallback / backward-compatible entry point.
        """
        if not resume_text or not jobs:
            return []

        resume_keywords = ResumeParser.extract_keywords(resume_text)
        if not resume_keywords:
            logger.warning("No keywords extracted from resume")
            return []

        scored_jobs = []
        for job in jobs:
            score = JobMatcher._calculate_keyword_score(resume_keywords, job)
            scored_jobs.append({
                "job": job,
                "match_score": score,
                "matched_keywords": score,
            })

        scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)
        return scored_jobs[:top_n]

    # ── Scoring helpers ──────────────────────────────────────────

    @staticmethod
    def _cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
        """
        Compute cosine similarity between two vectors.
        Returns a float in [-1, 1]; typically [0, 1] for positive embeddings.
        """
        a = np.array(vec_a, dtype=np.float64)
        b = np.array(vec_b, dtype=np.float64)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))

    @staticmethod
    def _calculate_keyword_score(resume_keywords: set, job: Job) -> int:
        """
        Calculate match score between resume keywords and job.
        
        Simple scoring:
        - Title match: weight higher
        - Description match: standard weight
        - Company/location match: bonus
        
        Returns integer score (higher = better match).
        """
        if not resume_keywords:
            return 0

        score = 0
        
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
