from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db

router = APIRouter(
    prefix="/onboarding",
    tags=["Onboarding & Dynamic Test"]
)

@router.post("/seed-directions")
def seed_directions(db: Session = Depends(get_db)):
    yo_nalishlar = ["Dasturlash", "Dizayn", "SMM & Copywriting", "Project Management"]
    for y in yo_nalishlar:
        mavjud = db.query(models.Direction).filter(models.Direction.nom == y).first()
        if not mavjud:
            db.add(models.Direction(nom=y, ta_rif=f"{y} yo'nalishi"))
    db.commit()
    return {"xabar": "Asosiy yo'nalishlar bazaga qo'shildi!"}

@router.post("/submit", response_model=schemas.OnboardingResponse)
def submit_test(data: schemas.OnboardingSubmit, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi.")

    if data.test_type == "texnik":
        if data.natija_bali >= 60.0:
            tavsiya_id = data.tanlangan_yonalish_id
            xabar = "Tabriklaymiz! Siz texnik testdan o'tdingiz va tanlagan yo'nalishingizga qabul qilindingiz."
            keyingi_qadam = "dashboard"
        else:
            return schemas.OnboardingResponse(
                status="fail",
                message="Texnik testdan o'ta olmadingiz. Sizni aniqroq yo'naltirishimiz uchun Aptitude testni ishlang.",
                next_step="aptitude_test"
            )

    elif data.test_type == "aptitude":
        if data.natija_bali >= 80:
            tavsiya_id = db.query(models.Direction).filter(models.Direction.nom == "Dasturlash").first().id
        elif data.natija_bali >= 60:
            tavsiya_id = db.query(models.Direction).filter(models.Direction.nom == "Dizayn").first().id
        elif data.natija_bali >= 40:
            tavsiya_id = db.query(models.Direction).filter(models.Direction.nom == "Project Management").first().id
        else:
            tavsiya_id = db.query(models.Direction).filter(models.Direction.nom == "SMM & Copywriting").first().id
        
        xabar = "Aptitude test tahlil qilindi. Qobiliyatlaringizga eng mos yo'nalish tavsiya etildi."
        keyingi_qadam = "dashboard"
    
    else:
        raise HTTPException(status_code=400, detail="Noto'g'ri test turi.")

    eski_yozuv = db.query(models.UserDirection).filter(models.UserDirection.user_id == user.id).first()
    if not eski_yozuv:
        db.add(models.UserDirection(user_id=user.id, direction_id=tavsiya_id))
        db.commit()

    dir_name = db.query(models.Direction).filter(models.Direction.id == tavsiya_id).first().nom

    return schemas.OnboardingResponse(
        status="success",
        message=xabar,
        next_step=keyingi_qadam,
        biriktirilgan_yonalish=dir_name
    )