from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    ism_sharif: str
    telefon: str
    hudud: Optional[str] = None
    maktab: Optional[str] = None
    yosh: Optional[int] = None
    login: str
    parol: str

class UserResponse(BaseModel):
    id: int
    ism_sharif: str
    telefon: str
    login: str
    rol: str
    created_at: datetime

    class Config:
        from_attributes = True

class OnboardingSubmit(BaseModel):
    user_id: int
    test_type: str 
    tanlangan_yonalish_id: Optional[int] = None
    natija_bali: float 

class OnboardingResponse(BaseModel):
    status: str
    message: str
    next_step: Optional[str] = None
    biriktirilgan_yonalish: Optional[str] = None

class QuizSubmit(BaseModel):
    user_id: int
    quiz_id: int
    score: float       
    time_spent: float  

class QuizResultResponse(BaseModel):
    user_id: int
    quiz_id: int
    score: float
    time_spent: float
    coeff_c: float
    xabar: str

class Token(BaseModel):
    access_token: str
    token_type: str

class LessonBase(BaseModel):
    id: int
    tartib_raqam: int
    mavzu_nomi: str
    video_url: Optional[str] = None
    pdf_url: Optional[str] = None

    class Config:
        from_attributes = True

class CourseRoadmapResponse(BaseModel):
    id: int
    nom: str
    daraja: str
    lessons: list[LessonBase] = [] 

    class Config:
        from_attributes = True