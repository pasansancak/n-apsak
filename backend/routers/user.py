from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.auth.auth import get_current_user 
from backend.models.user import User
from backend.schemas.user import UserOut, OnboardingSchema

router = APIRouter()

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/me/onboarding", response_model=UserOut)
def onboarding(
    data: OnboardingSchema,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    user.interests = data.interests
    user.music_types = data.music_types
    user.venue_types = data.venue_types
    user.personality_traits = data.personality_traits
    user.extra_traits = data.extra_traits
    user.onboarded = True

    db.add(user)
    db.commit()
    db.refresh(user)
    return user
