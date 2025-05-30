from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from jose import jwt
from sqlalchemy.orm import Session
import os

from ..database import get_db
from ..models.user import User

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

class GoogleLoginRequest(BaseModel):
    token: str

@router.post("/auth/google-login")
def google_login(data: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        # 1. Google'dan id_token'ı doğrula ve kullanıcı bilgilerini al
        idinfo = id_token.verify_oauth2_token(
            data.token, grequests.Request(), GOOGLE_CLIENT_ID
        )
        email = idinfo["email"]
        print(email)
        full_name = idinfo.get("name")
        profile_image = idinfo.get("picture")
        google_id = idinfo["sub"]

        # 2. Kullanıcı veritabanında var mı?
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                email=email,
                full_name=full_name,
                profile_image=profile_image,
                google_id=google_id
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # 3. JWT oluştur
        token_data = {"sub": user.email}
        jwt_token = jwt.encode(token_data, JWT_SECRET_KEY, algorithm=ALGORITHM)

        # 4. Frontend'e JWT ve kullanıcı verisi dön
        return {
            "access_token": jwt_token,
            "user": {
                "email": user.email,
                "full_name": user.full_name,
                "profile_image": user.profile_image,
            }
        }

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geçersiz Google token"
        )
