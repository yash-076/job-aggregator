import logging
from typing import List
from sqlalchemy.orm import Session

from app.models.alert_model import UserAlert
from app.models.job_model import Job
from app.services.email_service import EmailService

logger = logging.getLogger(__name__)


class AlertService:
    """
    Service for matching jobs to user alerts and sending notifications.
    """

    def __init__(self, db: Session):
        self.db = db
        self.email_service = EmailService()

    def check_and_notify(self, jobs: List[Job]) -> int:
        """
        Check new jobs against all active alerts and send notifications.
        Returns count of notifications sent.
        """
        if not jobs:
            return 0

        # Get all active alerts
        alerts = self.db.query(UserAlert).filter_by(is_active=True).all()
        
        if not alerts:
            logger.info("No active alerts found")
            return 0

        notifications_sent = 0

        for alert in alerts:
            matching_jobs = self._match_jobs_to_alert(alert, jobs)
            
            if matching_jobs:
                logger.info(f"Alert '{alert.name}' matched {len(matching_jobs)} jobs")
                if self.email_service.send_job_alert(alert.email, alert.name, matching_jobs):
                    notifications_sent += 1

        return notifications_sent

    def _match_jobs_to_alert(self, alert: UserAlert, jobs: List[Job]) -> List[Job]:
        """
        Filter jobs that match alert criteria.
        """
        filters = alert.filters or {}
        matched = []

        for job in jobs:
            if self._job_matches_filters(job, filters):
                matched.append(job)

        return matched

    def _job_matches_filters(self, job: Job, filters: dict) -> bool:
        """
        Check if a job matches all specified filters.
        """
        # Title filter (case-insensitive substring match)
        if filters.get("title"):
            if filters["title"].lower() not in job.title.lower():
                return False

        # Company filter (case-insensitive substring match)
        if filters.get("company"):
            if filters["company"].lower() not in job.company.lower():
                return False

        # Location filter (case-insensitive substring match)
        if filters.get("location"):
            if not job.location or filters["location"].lower() not in job.location.lower():
                return False

        # Job type filter (exact match)
        if filters.get("job_type"):
            if job.job_type != filters["job_type"]:
                return False

        return True
