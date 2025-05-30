from fastapi import FastAPI
from backend.routers import auth
from backend.database import Base, engine
from backend.models import user, plan  # Import your models here
from dotenv import load_dotenv
import os

load_dotenv()
print(os.getenv("JWT_SECRET_KEY"))

Base.metadata.create_all(bind=engine)
print("table check")

app = FastAPI()
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Napsak Backend API"}
