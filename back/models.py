"""
SQLAlchemy ORM models: User, CourseDirection, UserProgress.
"""
import enum
from datetime import datetime

from sqlalchemy import Enum as SAEnum, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from database import Base


class RegionEnum(str, enum.Enum):
    """
    Uzbekistan's administrative regions (hudud).

    Stored as a native Postgres ENUM (via the SAEnum column below) instead
    of a free-text string so registration data stays consistent and
    filtering/grouping users by region stays cheap. SQLAlchemy persists
    enum *names* (e.g. "TOSHKENT_SHAHRI") in the DB by default -- that's
    fine, it's just an internal storage detail; the API always speaks in
    the human-readable *values* below via the Pydantic schema.
    """

    TOSHKENT_SHAHRI = "Toshkent shahri"
    TOSHKENT_VILOYATI = "Toshkent viloyati"
    ANDIJON = "Andijon"
    BUXORO = "Buxoro"
    FARGONA = "Farg'ona"
    JIZZAX = "Jizzax"
    XORAZM = "Xorazm"
    NAMANGAN = "Namangan"
    NAVOIY = "Navoiy"
    QASHQADARYO = "Qashqadaryo"
    QORAQALPOGISTON = "Qoraqalpog'iston"
    SAMARQAND = "Samarqand"
    SIRDARYO = "Sirdaryo"
    SURXONDARYO = "Surxondaryo"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)

    # phone_number is the login identifier for this platform. email is kept
    # as an optional column for future use (notifications, password reset)
    # but is not collected at registration and never used to authenticate.
    email: Mapped[str | None] = mapped_column(String(255), unique=True, index=True, nullable=True)

    phone_number: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    region: Mapped[RegionEnum] = mapped_column(SAEnum(RegionEnum, name="region_enum"), nullable=False)

    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)

    progress_entries: Mapped[list["UserProgress"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class CourseDirection(Base):
    """
    A learning track/category (e.g. "Backend Development", "Data Science")
    that content is grouped under and that UserProgress is measured against.
    """

    __tablename__ = "course_directions"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    progress_entries: Mapped[list["UserProgress"]] = relationship(back_populates="direction")


class UserProgress(Base):
    """
    One user's gamified progress (XP, level, completion %) within one
    CourseDirection. A user can progress through multiple directions, so
    this is a many-to-many join table with extra columns, not a 1:1 link.
    """

    __tablename__ = "user_progress"
    __table_args__ = (UniqueConstraint("user_id", "direction_id", name="uq_user_direction"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    direction_id: Mapped[int] = mapped_column(
        ForeignKey("course_directions.id", ondelete="CASCADE"), nullable=False
    )

    xp_points: Mapped[int] = mapped_column(default=0, nullable=False)
    current_level: Mapped[int] = mapped_column(default=1, nullable=False)
    completion_percentage: Mapped[float] = mapped_column(default=0.0, nullable=False)

    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="progress_entries")
    direction: Mapped["CourseDirection"] = relationship(back_populates="progress_entries")
