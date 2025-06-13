from sqlalchemy.orm import relationship
from backend.database import Base
from sqlalchemy import Column, Integer, String, Boolean, JSON

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    profile_image = Column(String, nullable=True)
    cover_image = Column(String, nullable=True)
    google_id = Column(String, unique=True, index=True, nullable=False)

    interests = Column(JSON, default=[])
    music_types = Column(JSON, default=[])
    venue_types = Column(JSON, default=[])
    personality_traits = Column(JSON, default=[])
    extra_traits = Column(JSON, default=[])

    onboarded = Column(Boolean, default=False)

    plans = relationship("Plan", back_populates="user")
