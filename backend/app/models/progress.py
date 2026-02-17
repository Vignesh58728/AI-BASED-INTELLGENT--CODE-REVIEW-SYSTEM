from sqlalchemy import Column, Integer, ForeignKey, JSON, String
from sqlalchemy.orm import relationship
from app.models.base import Base

class Progress(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), unique=True)
    
    # Track completion across modules
    # Format: {"school": {"beginner": 100, "intermediate": 50, ...}, "college": {...}}
    scores = Column(JSON, default=dict)
    
    # Track which stage is currently locked/unlocked
    # failed_stage can be used to track where the user stopped last
    failed_stage = Column(String, nullable=True)
    current_module = Column(String, default="school")
    current_stage = Column(String, default="beginner")
    
    # Relationships
    owner = relationship("User", back_populates="progress")
