from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models, oauth2
from database import get_db

router = APIRouter(
    prefix="/dashboard",
    tags=["Shaxsiy Kabinet"]
)

@router.get("/profile")
def get_user_profile(
    current_user: models.User = Depends(oauth2.get_current_user), 
    db: Session = Depends(get_db)
):
    user_dir = db.query(models.UserDirection).filter(models.UserDirection.user_id == current_user.id).first()
    yo_nalish_nomi = "Hali yo'nalish tanlanmagan. Iltimos, Onboarding testini ishlang."
    
    if user_dir:
        direction = db.query(models.Direction).filter(models.Direction.id == user_dir.direction_id).first()
        if direction:
            yo_nalish_nomi = direction.nom

    natijalar = db.query(models.UserResult).filter(models.UserResult.user_id == current_user.id).all()
    
    history = []
    for n in natijalar:
        history.append({
            "quiz_id": n.quiz_id,
            "score": n.score,
            "sarflangan_vaqt": n.time_spent,
            "c_koeffitsienti": n.coeff_c
        })

    return {
        "xabar": "Shaxsiy kabinetga xush kelibsiz!",
        "o_quvchi": {
            "id": current_user.id,
            "ism": current_user.ism_sharif,
            "telefon": current_user.telefon,
            "rol": current_user.rol
        },
        "biriktirilgan_yonalish": yo_nalish_nomi,
        "test_natijalari": history
    }