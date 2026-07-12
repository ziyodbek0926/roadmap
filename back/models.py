from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base 

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    ism_sharif = Column(String, nullable=False)
    telefon = Column(String, unique=True, index=True, nullable=False)
    hudud = Column(String)
    maktab = Column(String)
    yosh = Column(Integer)
    login = Column(String, unique=True, index=True, nullable=False)
    parol_hash = Column(String, nullable=False)
    rol = Column(String, default="student")
    created_at = Column(DateTime, default=datetime.utcnow)

    directions = relationship("UserDirection", back_populates="user")
    results = relationship("UserResult", back_populates="user")

class Direction(Base):
    __tablename__ = "directions"
    
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False) 
    ta_rif = Column(Text)

    courses = relationship("Course", back_populates="direction")

class UserDirection(Base):
    __tablename__ = "user_directions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    direction_id = Column(Integer, ForeignKey("directions.id"))

    user = relationship("User", back_populates="directions")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    direction_id = Column(Integer, ForeignKey("directions.id"))
    nom = Column(String, nullable=False)
    daraja = Column(String)

    direction = relationship("Direction", back_populates="courses")
    lessons = relationship("Lesson", back_populates="course")

class Lesson(Base):
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    tartib_raqam = Column(Integer)
    mavzu_nomi = Column(String, nullable=False)
    video_url = Column(String)
    pdf_url = Column(String)

    course = relationship("Course", back_populates="lessons")
    quizzes = relationship("Quiz", back_populates="lesson")

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    nom = Column(String)
    kutilgan_vaqt = Column(Float) # T_norm (soatda)

    lesson = relationship("Lesson", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz")

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    savol_matni = Column(Text, nullable=False)
    turi = Column(String)
    qiyinchilik_darajasi = Column(Integer)

    quiz = relationship("Quiz", back_populates="questions")
    answers = relationship("Answer", back_populates="question")

class Answer(Base):
    __tablename__ = "answers"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    javob_matni = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)

    question = relationship("Question", back_populates="answers")

class UserResult(Base):
    __tablename__ = "user_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    score = Column(Float) 
    time_spent = Column(Float) 
    coeff_c = Column(Float) 
    sana = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="results")

class CompletedLesson(Base):
    __tablename__ = "completed_lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    sana = Column(DateTime, default=datetime.utcnow)