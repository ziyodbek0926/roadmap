from fastapi import FastAPI
import models
from database import engine, Base
from routers import auth, onboarding, quiz 

Base.metadata.create_all(bind=engine)

app = FastAPI(title="EdTech Platform API")

app.include_router(auth.router)
app.include_router(onboarding.router)
app.include_router(quiz.router) 

@app.get("/")
def read_root():
    return {"xabar": "EdTech platformasi orqa mantiqi (Backend) ishga tushdi!"}