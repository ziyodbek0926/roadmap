"""
Centralized application configuration, loaded from environment variables (.env).

Every module that needs a secret or a connection string imports `settings`
from here instead of reading os.environ directly -- one validated source of
truth, and secrets never get hardcoded into the modules that use them.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/edutech_db"

    SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION"  
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 

    FRONTEND_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
