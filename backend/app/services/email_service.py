import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List

from app.core.config import settings
from app.models.job_model import Job

logger = logging.getLogger(__name__)


class EmailService:
    """
    Simple SMTP email service for job alerts.
    """

    def __init__(self):
        self.smtp_host = settings.smtp_host
        self.smtp_port = settings.smtp_port
        self.smtp_user = settings.smtp_user
        self.smtp_password = settings.smtp_password
        self.from_email = settings.from_email

    def send_job_alert(self, to_email: str, alert_name: str, jobs: List[Job]) -> bool:
        """
        Send email alert with matching jobs.
        """
        if not self.smtp_user or not self.smtp_password or not self.from_email:
            logger.warning("SMTP credentials not configured, skipping email")
            return False

        try:
            # Build email content
            subject = f"Job Alert: {alert_name} - {len(jobs)} new match(es)"
            body = self._build_email_body(alert_name, jobs)

            # Create message
            msg = MIMEMultipart("alternative")
            msg["From"] = self.from_email
            msg["To"] = to_email
            msg["Subject"] = subject

            html_part = MIMEText(body, "html")
            msg.attach(html_part)

            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)

            logger.info(f"Sent alert email to {to_email} with {len(jobs)} jobs")
            return True

        except Exception as e:
            logger.error(f"Error sending email to {to_email}: {e}")
            return False

    def _build_email_body(self, alert_name: str, jobs: List[Job]) -> str:
        """
        Build HTML email body with job listings.
        """
        html = f"""
        <html>
        <body>
            <h2>Job Alert: {alert_name}</h2>
            <p>You have {len(jobs)} new job match(es):</p>
            <hr>
        """

        for job in jobs:
            html += f"""
            <div style="margin-bottom: 20px;">
                <h3>{job.title}</h3>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location or 'N/A'}</p>
                <p><strong>Type:</strong> {job.job_type}</p>
                <p><strong>Source:</strong> {job.source}</p>
                <p><a href="{job.apply_link}" target="_blank">View Job</a></p>
            </div>
            <hr>
            """

        html += """
        </body>
        </html>
        """
        return html
