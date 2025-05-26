from fastapi import FastAPI
from backend.database import Base, engine
from backend.models import user, plan  # <-- Bunu ekle

Base.metadata.create_all(bind=engine)
print("table check")

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Napsak Backend API"}
