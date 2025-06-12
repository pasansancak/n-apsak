from fastapi import FastAPI
from backend.routers import auth
from backend.routers import user
from backend.database import Base, engine
from dotenv import load_dotenv
import os

load_dotenv()
print(os.getenv("JWT_SECRET_KEY"))

Base.metadata.create_all(bind=engine)
print("table check")

app = FastAPI()
app.include_router(auth.router)
app.include_router(user.router)

@app.get("/")
def read_root():
    return {"message": "Napsak Backend API"}
