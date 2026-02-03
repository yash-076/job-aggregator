from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON
from sqlalchemy.sql import func
from app.core.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    
    # Job identity
    title = Column(String(255), nullable=False, index=True)
    company = Column(String(255), nullable=False, index=True)
    location = Column(String(255))
    
    # Job type: internship, full-time, contract
    job_type = Column(String(50), nullable=False, index=True)
    
    # Description
    description = Column(Text)
    
    # URL to original posting
    apply_link = Column(String(2048), unique=True, nullable=False)
    
    # Source identifier (e.g., "career_page", "adzuna_api")
    source = Column(String(100), nullable=False, index=True)
    
    # Deduplication hash
    dedup_hash = Column(String(64), unique=True, index=True)
    
    # Metadata
    posted_date = Column(DateTime(timezone=True))
    expires_date = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True, index=True)
    
    # Additional fields (skills, requirements, etc.)
    job_metadata = Column(JSON, default=lambda: {})
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Job(id={self.id}, title='{self.title}', company='{self.company}')>"
