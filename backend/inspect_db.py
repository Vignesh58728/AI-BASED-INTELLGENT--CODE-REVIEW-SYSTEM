
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./sql_app.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Problem(Base):
    __tablename__ = "problem"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(Text)

def inspect():
    db = SessionLocal()
    problems = db.query(Problem).all()
    for p in problems:
        print(f"ID: {p.id} | Title: {p.title}")
        print(f"Desc: {p.description}")
        print("-" * 20)
    db.close()

if __name__ == "__main__":
    inspect()
