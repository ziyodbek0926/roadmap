"""
Pydantic schemas: the request/response contracts for the auth API.

Kept separate from the ORM models (models.py) so the wire format can evolve
independently of the DB schema, and so internal-only fields like
hashed_password can never accidentally leak into a response.
"""
import re

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator

from models import RegionEnum

PHONE_REGEX = re.compile(r"^\+?\d{9,15}$")


class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str
    region: RegionEnum

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value: str) -> str:
        if not PHONE_REGEX.match(value):
            raise ValueError("phone_number must be 9-15 digits, optionally prefixed with '+'")
        return value


class UserCreate(UserBase):
    """
    Registration payload. NOTE: intentionally has no age/date_of_birth
    field and no age-based validator -- this platform has no age
    restriction, per spec.
    """

    password: str

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("password must be at least 8 characters long")
        return value


class UserResponse(UserBase):
    """Public-facing user representation. Deliberately excludes hashed_password."""

    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """Shape of the claims we actually rely on once a JWT is decoded."""

    sub: str | None = None 
