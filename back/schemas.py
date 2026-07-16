"""
Pydantic schemas: the request/response contracts for the auth API.

Kept separate from the ORM models (models.py) so the wire format can evolve
independently of the DB schema, and so internal-only fields like
hashed_password can never accidentally leak into a response.
"""
import re
from typing import Annotated

from pydantic import AfterValidator, BaseModel, ConfigDict, EmailStr, field_validator

from models import RegionEnum

PHONE_REGEX = re.compile(r"^\+?\d{9,15}$")


def _validate_phone_number(value: str) -> str:
    if not PHONE_REGEX.match(value):
        raise ValueError("phone_number must be 9-15 digits, optionally prefixed with '+'")
    return value


# Shared annotated type so both registration and login validate phone_number
# the same way without duplicating the field_validator on each model.
PhoneNumber = Annotated[str, AfterValidator(_validate_phone_number)]


class UserBase(BaseModel):
    full_name: str
    phone_number: PhoneNumber
    region: RegionEnum

    # Not collected at registration and not used for login -- see models.User.email.
    email: EmailStr | None = None


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
    phone_number: PhoneNumber
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """Shape of the claims we actually rely on once a JWT is decoded."""

    sub: str | None = None 
