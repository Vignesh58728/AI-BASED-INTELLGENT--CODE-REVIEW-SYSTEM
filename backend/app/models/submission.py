from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base

class Submission(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    problem_id = Column(Integer, ForeignKey("problem.id"))
    
    code = Column(Text)
    language = Column(String)
    
    score = Column(Float, default=0.0)
    feedback = Column(Text) # AI Feedback
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="submissions")
    problem = relationship("Problem", back_populates="submissions")
