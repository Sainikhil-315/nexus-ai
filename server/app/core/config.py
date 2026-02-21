# app/core/config.py
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Clerk
    CLERK_SECRET_KEY: str
    CLERK_PUBLISHABLE_KEY: str
    
    # Database
    DATABASE_URL: str
    
    # Redis (optional)
    REDIS_URL: str = "redis://localhost:6379"
    
    # Celery (optional)
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # Anthropic (optional)
    ANTHROPIC_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings()