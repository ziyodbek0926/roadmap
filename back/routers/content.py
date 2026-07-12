from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, oauth2
from database import get_db

router = APIRouter(
    prefix="/content",
    tags=["Darslar va Yo'l xaritasi (Roadmap)"]
)

@router.post("/seed-roadmap")
def seed_roadmap(db: Session = Depends(get_db)):
    dasturlash = db.query(models.Direction).filter(models.Direction.nom == "Dasturlash").first()
    if not dasturlash:
        raise HTTPException(status_code=400, detail="Avval /onboarding/seed-directions orqali yo'nalishlarni qoshing!")

    # Boshlang'ich kurs
    kurs = models.Course(direction_id=dasturlash.id, nom="Python Backend Yo'l Xaritasi", daraja="Boshlang'ich")
    db.add(kurs)
    db.commit()
    db.refresh(kurs)

    darslar = [
        models.Lesson(course_id=kurs.id, tartib_raqam=1, mavzu_nomi="Internet qanday ishlaydi?", video_url="https://www.youtube.com/embed/TNQsmPf24go", pdf_url="https://example.com/internet.pdf"),
        models.Lesson(course_id=kurs.id, tartib_raqam=2, mavzu_nomi="Python Dasturlash Asoslari", video_url="https://www.youtube.com/embed/_uQrJ0TkZlc", pdf_url="https://example.com/python.pdf"),
        models.Lesson(course_id=kurs.id, tartib_raqam=3, mavzu_nomi="Ma'lumotlar bazasi (PostgreSQL)", video_url="https://www.youtube.com/embed/qw--VYLpxG4", pdf_url="https://example.com/postgres.pdf"),
    ]
    db.add_all(darslar)
    db.commit()

    return {"xabar": "Python Backend yo'l xaritasi (Roadmap) muvaffaqiyatli yaratildi!"}

# O'quvchiga o'ziga tegishli Yo'l xaritasini (Roadmap) ko'rsatish
@router.get("/my-roadmap", response_model=list[schemas.CourseRoadmapResponse])
def get_my_roadmap(
    current_user: models.User = Depends(oauth2.get_current_user), 
    db: Session = Depends(get_db)
):
    # yo'nalishini aniqlash
    user_dir = db.query(models.UserDirection).filter(models.UserDirection.user_id == current_user.id).first()
    
    if not user_dir:
        raise HTTPException(status_code=403, detail="Sizga hali yo'nalish biriktirilmagan. Onboarding testidan o'ting.")

    courses = db.query(models.Course).filter(models.Course.direction_id == user_dir.direction_id).all()
    
    return courses

@router.post("/mark-done/{lesson_id}")
def mark_lesson_done(
    lesson_id: int, 
    current_user: models.User = Depends(oauth2.get_current_user), 
    db: Session = Depends(get_db)
):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Bunday dars topilmadi.")
        
    mavjud = db.query(models.CompletedLesson).filter(
        models.CompletedLesson.user_id == current_user.id,
        models.CompletedLesson.lesson_id == lesson_id
    ).first()
    
    if mavjud:
        return {"xabar": "Siz bu darsni allaqachon tugatgan deb belgilagansiz!"}
        
    yangi_belgi = models.CompletedLesson(user_id=current_user.id, lesson_id=lesson_id)
    db.add(yangi_belgi)
    db.commit()
    
    return {"xabar": f"'{lesson.mavzu_nomi}' darsi muvaffaqiyatli tugatildi!"}

@router.get("/my-progress")
def get_my_progress(
    current_user: models.User = Depends(oauth2.get_current_user), 
    db: Session = Depends(get_db)
):
    completed = db.query(models.CompletedLesson).filter(models.CompletedLesson.user_id == current_user.id).all()
    
    progress_list = []
    for c in completed:
        dars = db.query(models.Lesson).filter(models.Lesson.id == c.lesson_id).first()
        progress_list.append({
            "lesson_id": c.lesson_id,
            "mavzu_nomi": dars.mavzu_nomi if dars else "Noma'lum",
            "tugatilgan_sana": c.sana
        })
        
    return {
        "umumiy_tugatilgan_darslar": len(progress_list), 
        "ro_yxat": progress_list
    }