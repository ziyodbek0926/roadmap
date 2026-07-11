from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db

router = APIRouter(
    prefix="/quiz",
    tags=["Test & Koeffitsient (C)"]
)

@router.post("/seed-quiz")
def seed_quiz(db: Session = Depends(get_db)):
    yangi_test = models.Quiz(nom="Dasturlash - 1-Hafta imtihoni", kutilgan_vaqt=2.0)
    db.add(yangi_test)
    db.commit()
    db.refresh(yangi_test)
    return {"xabar": f"Test yaratildi! Quiz ID: {yangi_test.id}, Kutilgan vaqt (T_norm): 2.0 soat"}

@router.post("/submit", response_model=schemas.QuizResultResponse)
def submit_quiz_result(data: schemas.QuizSubmit, db: Session = Depends(get_db)):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == data.quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Bunday ID ga ega test topilmadi.")
    
    if data.time_spent <= 0:
        raise HTTPException(status_code=400, detail="Sarflangan vaqt 0 dan katta bo'lishi kerak.")

    t_norm = quiz.kutilgan_vaqt
    nisbat = t_norm / data.time_spent
    bonus_cheklovi = min(1.2, nisbat) 
    
    coeff_c = data.score * bonus_cheklovi

    if coeff_c < 40.0:
        xabar_matni = "Sizning natijalaringiz tahlil qilindi. Bu yo'nalish sizga biroz murakkablik qilayotgan bo'lishi mumkin. Natijangiz past."
    else:
        xabar_matni = "Ajoyib natija! O'zlashtirish ko'rsatkichi normada."

    yangi_natija = models.UserResult(
        user_id=data.user_id,
        quiz_id=data.quiz_id,
        score=data.score,
        time_spent=data.time_spent,
        coeff_c=coeff_c
    )
    db.add(yangi_natija)
    db.commit()

    return {
        "user_id": data.user_id,
        "quiz_id": data.quiz_id,
        "score": data.score,
        "time_spent": data.time_spent,
        "coeff_c": round(coeff_c, 2), 
        "xabar": xabar_matni
    }