from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import models, schemas
from database import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.login == user.login).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Bu login band, boshqa login tanlang.")
    
    db_phone = db.query(models.User).filter(models.User.telefon == user.telefon).first()
    if db_phone:
        raise HTTPException(status_code=400, detail="Bu telefon raqam orqali allaqachon ro'yxatdan o'tilgan.")

    hashed_password = get_password_hash(user.parol)
    
    new_user = models.User(
        ism_sharif=user.ism_sharif,
        telefon=user.telefon,
        hudud=user.hudud,
        maktab=user.maktab,
        yosh=user.yosh,
        login=user.login,
        parol_hash=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user