from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    database_url: str
    redis_url: str = "redis://localhost:6379"
    log_level: str = "INFO"

    # JWT auth
    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_days: int = 7
    
    # SMTP settings for email alerts
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    from_email: str = ""

    # Adzuna API settings
    adzuna_app_id: str = ""
    adzuna_app_key: str = ""
    adzuna_country: str = ""
    adzuna_base_url: str = "https://api.adzuna.com/v1/api"
    adzuna_job_queries: str = "software engineer,python developer,data scientist"  # comma-separated

    # Embedding microservice settings
    embedding_service_url: str = ""
    embedding_api_key: str = ""
    embedding_batch_size: int = 50  # max texts per embed-batch call
    
    class Config:
        env_file = str(Path(__file__).parent.parent / ".env")
        extra = "ignore"  # Ignore extra fields

settings = Settings()