import hashlib
import re
from typing import Optional
from urllib.parse import urlparse, urlunparse
from pydantic import BaseModel

from backend.app.fetchers.base import JobData


class NormalizedJob(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    job_type: str
    description: Optional[str] = None
    source_url: str
    source: str
    posted_date: Optional[str] = None
    expires_date: Optional[str] = None
    metadata: dict = {}
    dedup_hash: str


def _normalize_whitespace(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def _canonical_url(url: str) -> str:
    """Keep scheme, host, and path (remove query/fragment)."""
    try:
        parsed = urlparse(url)
        canonical = urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))
        return canonical
    except Exception:
        return url


def _normalize_job_type(raw: str) -> str:
    s = (raw or "").lower().strip()
    if "intern" in s:
        return "internship"
    if "contract" in s or "temporary" in s:
        return "contract"
    return "full-time"


def _hash_components(*parts: str) -> str:
    joined = "|".join(p.lower() for p in parts)
    return hashlib.sha256(joined.encode("utf-8")).hexdigest()


def compute_dedup_hash(job: JobData) -> str:
    title = _normalize_whitespace(job.title)
    company = _normalize_whitespace(job.company)
    location = _normalize_whitespace(job.location or "")
    job_type = _normalize_job_type(job.job_type)
    url = _canonical_url(job.source_url)
    return _hash_components(title, company, location, job_type, url)


def normalize(job: JobData) -> NormalizedJob:
    title = _normalize_whitespace(job.title)
    company = _normalize_whitespace(job.company)
    location = _normalize_whitespace(job.location or "") or None
    job_type = _normalize_job_type(job.job_type)
    url = _canonical_url(job.source_url)

    dedup_hash = compute_dedup_hash(job)

    metadata = dict(job.metadata or {})
    metadata.update({
        "canonical_url": url,
        "raw_job_type": job.metadata.get("raw_job_type") if job.metadata else None,
    })

    return NormalizedJob(
        title=title,
        company=company,
        location=location,
        job_type=job_type,
        description=job.description,
        source_url=url,
        source=job.source,
        posted_date=job.posted_date,
        expires_date=job.expires_date,
        metadata=metadata,
        dedup_hash=dedup_hash,
    )
