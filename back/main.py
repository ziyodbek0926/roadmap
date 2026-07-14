from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # CORS ni chaqiramiz
import models
from database import engine, Base
from routers import auth, onboarding, quiz, dashboard, content, admin

# Jadvallarni yaratish
Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduTech Platform API")

origins = [
    "http://localhost:3000",      
    "http://localhost:5173",      
    "*"                           
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.include_router(auth.router)
app.include_router(onboarding.router)
app.include_router(quiz.router)
app.include_router(dashboard.router)
app.include_router(content.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"xabar": "EduTech platformasi orqa mantiqi (Backend) to'liq ishga tushdi va Frontend bilan ulanishga tayyor!"}