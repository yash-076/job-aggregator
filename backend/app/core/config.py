from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    database_url: str
    redis_url: str = "redis://localhost:6379"
    log_level: str = "INFO"
    
    # SMTP settings for email alerts
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    from_email: str = ""
    
    class Config:
        env_file = str(Path(__file__).parent.parent / ".env")


settings = Settings()