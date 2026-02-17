# CodeMentor AI Backend

Production-ready FastAPI backend for the AI-Based Intelligent Code Review System.

## Structure
- `app/`: Core application logic
  - `api/`: API endpoints (v1)
  - `core/`: Configuration, security, and dependencies
  - `crud/`: Database operations
  - `models/`: SQLAlchemy ORM models
  - `schemas/`: Pydantic validation schemas
  - `services/`: Business logic services
- `alembic/`: Database migrations
- `tests/`: Automated tests
- `workers/`: Background task workers (Celery/Redis)
- `docker/`: Dockerization files

## Setup
### Local Development
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set environment variables in `.env`.
4. Run the app:
   ```bash
   uvicorn app.main:app --reload
   ```

## Features
- JWT Authentication
- Progress Tracking (92/100 scores)
- Stage Unlock Logic
- AI-Powered Code Reviews (CodeMentor AI)
- 3-hour Exam Timer Logic
