import hashlib
import re
from typing import Optional
from urllib.parse import urlparse, urlunparse
from pydantic import BaseModel

from app.fetchers.base import JobData


class NormalizedJob(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    job_type: str
    description: Optional[str] = None
    apply_link: Optional[str] = None
    source: str
    job_metadata: dict = {}
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


def _normalize_job_type(raw: str | None) -> str:
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
    title = _normalize_whitespace(job.title or "") or "unknown"
    company = _normalize_whitespace(job.company)
    location = _normalize_whitespace(job.location or "")
    url = _canonical_url(job.apply_link or "")
    return _hash_components(title, company, location, url)


def normalize(job: JobData) -> NormalizedJob:
    title = _normalize_whitespace(job.title or "") or "Unknown"
    company = _normalize_whitespace(job.company)
    location = _normalize_whitespace(job.location or "") or None
    canonical_url = _canonical_url(job.apply_link or "") or None

    dedup_hash = compute_dedup_hash(job)

    # Use full URL with query parameters for apply_link
    apply_link = job.apply_link or f"synthetic:{dedup_hash}"

    metadata = {
        "canonical_url": canonical_url,
    }

    return NormalizedJob(
        title=title,
        company=company,
        location=location,
        job_type="full-time",
        description=job.description,
        apply_link=apply_link,
        source=job.source,
        job_metadata=metadata,
        dedup_hash=dedup_hash,
    )
