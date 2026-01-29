from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    database_url: str
    redis_url: str
    log_level: str = "INFO"
    
    class Config:
        env_file = str(Path(__file__).parent.parent / ".env")


settings = Settings()