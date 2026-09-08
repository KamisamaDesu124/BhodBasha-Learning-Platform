import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import Optional

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    APP_NAME: str = "BhodBasha"
    APP_TAGLINE: str = "Knowledge that speaks your language, even offline."
    BHODBASHA_ENV: str = "development"
    BHODBASHA_SECRET_KEY: str = "bhodbasha_super_secret_jwt_key_for_offline_first_stem_platform_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for offline/hybrid support

    # Database: Defaults to SQLite for immediate local zero-dependency run, supports asyncpg PostgreSQL
    BHODBASHA_DATABASE_URL: str = "sqlite+aiosqlite:///./bhodbasha.db"
    REDIS_URL: str = "redis://localhost:6379/0"

    # Deterministic Mock Providers for Demo Mode
    MOCK_PROVIDERS: bool = True

    # Supabase Auth Settings
    NEXT_PUBLIC_SUPABASE_URL: Optional[str] = "https://demo-bhodbasha.supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Optional[str] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-anon-key-bhodbasha"
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-service-role-key-bhodbasha"
    SUPABASE_JWT_SECRET: Optional[str] = "demo-supabase-jwt-secret-bhodbasha"

    # AI & Localization Provider Keys (Optional)
    WHISPER_MODEL: str = "base"
    BHASHINI_USER_ID: Optional[str] = None
    BHASHINI_API_KEY: Optional[str] = None
    BHASHINI_INFERENCE_URL: str = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
    OPENAI_API_KEY: Optional[str] = None

    # Media Storage
    MEDIA_STORAGE_DIR: str = str(BASE_DIR / "media_storage")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()

# Ensure media directory exists
os.makedirs(settings.MEDIA_STORAGE_DIR, exist_ok=True)
os.makedirs(os.path.join(settings.MEDIA_STORAGE_DIR, "assets"), exist_ok=True)
os.makedirs(os.path.join(settings.MEDIA_STORAGE_DIR, "packages"), exist_ok=True)
os.makedirs(os.path.join(settings.MEDIA_STORAGE_DIR, "audio"), exist_ok=True)
