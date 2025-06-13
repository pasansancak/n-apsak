from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from jose import jwt
from sqlalchemy.orm import Session
import os
from datetime import datetime, timedelta
from ..database import get_db
from ..models.user import User

router = APIRouter()

class GoogleLoginRequest(BaseModel):
    token: str
    client_type: str

@router.post("/auth/google-login")
def google_login(data: GoogleLoginRequest, db: Session = Depends(get_db)):
    GOOGLE_CLIENT_ID_IOS = os.getenv("EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS")
    GOOGLE_CLIENT_ID_ANDROID = os.getenv("EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    if not all([GOOGLE_CLIENT_ID_IOS, GOOGLE_CLIENT_ID_ANDROID, JWT_SECRET_KEY]):
        print("Env değişkenleri eksik!")
        raise HTTPException(status_code=500, detail="Sunucu yapılandırması eksik")

    try:
        if data.client_type == "ios":
            google_client_id = GOOGLE_CLIENT_ID_IOS
        elif data.client_type == "android":
            google_client_id = GOOGLE_CLIENT_ID_ANDROID
        else:
            raise Exception("Bilinmeyen client_type")

        idinfo = id_token.verify_oauth2_token(
            data.token, grequests.Request(), google_client_id
        )
        user = db.query(User).filter(User.email == idinfo["email"]).first()
        if not user:
            user = User(
                email=idinfo["email"],
                full_name=idinfo.get("name"),
                profile_image=idinfo.get("picture"),
                google_id=idinfo["sub"]
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        expire = datetime.utcnow() + timedelta(days=90)
        token_data = {"sub": user.email, "exp": int(expire.timestamp())}
        jwt_token = jwt.encode(token_data, JWT_SECRET_KEY, algorithm="HS256")

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
