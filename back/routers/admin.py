from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models, oauth2
from database import get_db

router = APIRouter(
    prefix="/admin",
    tags=["Admin Panel"]
)

@router.put("/make-me-admin")
def make_me_admin(
    current_user: models.User = Depends(oauth2.get_current_user), 
    db: Session = Depends(get_db)
):
    current_user.rol = "admin"
    db.commit()
    return {"xabar": f"Tabriklaymiz, {current_user.login}! Endi siz tizimda Admin bo'ldingiz."}

@router.get("/users")
def get_all_users(
    admin_user: models.User = Depends(oauth2.get_admin_user), 
    db: Session = Depends(get_db)
):
    users = db.query(models.User).all()
    ro_yxat = []
    for u in users:
        ro_yxat.append({
            "id": u.id,
            "ism": u.ism_sharif,
            "login": u.login,
            "telefon": u.telefon,
            "rol": u.rol
        })
    return {"jami_foydalanuvchilar": len(ro_yxat), "ro_yxat": ro_yxat}

@router.get("/dashboard-stats")
def get_dashboard_stats(
    admin_user: models.User = Depends(oauth2.get_admin_user), 
    db: Session = Depends(get_db)
):
    total_users = db.query(models.User).count()
    total_completed_lessons = db.query(models.CompletedLesson).count()
    total_courses = db.query(models.Course).count()
    
    return {
        "xabar": f"Xush kelibsiz, Admin {admin_user.ism_sharif}!",
        "statistika": {
            "platformadagi_odamlar_soni": total_users,
            "o_qilgan_darslar_soni": total_completed_lessons,
            "bazadagi_kurslar_soni": total_courses
        }
    }