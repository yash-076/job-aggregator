from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class UserAlert(Base):
    __tablename__ = "user_alerts"

    id = Column(Integer, primary_key=True, index=True)
    
    # User email for notifications
    email = Column(String(255), nullable=False, index=True)
    
    # Alert name/description
    name = Column(String(255), nullable=False)
    
    # Filter criteria (all optional, stored as JSON for flexibility)
    filters = Column(JSON, default=dict)
    # Example filters: {"title": "engineer", "company": "google", "location": "san francisco", "job_type": "full-time"}
    
    # Alert status
    is_active = Column(Boolean, default=True, index=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<UserAlert(id={self.id}, email='{self.email}', name='{self.name}')>"
