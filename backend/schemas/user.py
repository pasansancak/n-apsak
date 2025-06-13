from pydantic import BaseModel
from typing import List, Optional

# 1. Kullanıcıya dönecek (output) şema
class UserOut(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    profile_image: Optional[str]
    cover_image: Optional[str]
    google_id: str
    interests: List[str] = []
    music_types: List[str] = []
    venue_types: List[str] = []
    personality_traits: List[str] = []
    extra_traits: List[str] = []
    onboarded: bool

    class Config:
        orm_mode = True

# 2. Onboarding input şeması (frontend'den POST ile gelecek data)
class OnboardingSchema(BaseModel):
    interests: List[str]
    music_types: List[str]
    venue_types: List[str]
    personality_traits: List[str]
    extra_traits: List[str]
