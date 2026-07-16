"""
Async SQLAlchemy engine, session factory, and declarative base.

CORE RULE #2 mandates async/await throughout the FastAPI app, so this uses
the asyncio extension (create_async_engine + AsyncSession) rather than the
classic sync Session -- a sync engine would block the event loop on every
query and defeat the point of an async framework.
"""
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False, future=True)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False, 
    autoflush=False,
)


class Base(DeclarativeBase):
    """Shared declarative base every ORM model inherits from."""

    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields one session per request and closes it
    afterwards regardless of whether the request succeeded or raised.
    """
    async with AsyncSessionLocal() as session:
        yield session
