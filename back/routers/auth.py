from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm 
import models, schemas, oauth2 
from database import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

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

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 1. Login bo'yicha foydalanuvchini bazadan qidiramiz (Swagger username deb qabul qiladi)
    user = db.query(models.User).filter(models.User.login == form_data.username).first()
    
    # 2. Agar foydalanuvchi yo'q bo'lsa yoki parol xato bo'lsa
    if not user or not verify_password(form_data.password, user.parol_hash):
        raise HTTPException(status_code=403, detail="Login yoki parol xato kiritildi.")
    
    # 3. Hamma narsa to'g'ri bo'lsa, Token yaratamiz
    access_token = oauth2.create_access_token(data={"user_id": user.id})
    
    return {"access_token": access_token, "token_type": "bearer"}