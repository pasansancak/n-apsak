from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    profile_image = Column(String, nullable=True)
    google_id = Column(String, unique=True, index=True, nullable=False)

    plans = relationship("Plan", back_populates="user")
