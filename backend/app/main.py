import sys
import asyncio

# Configure event loop for Windows to support subprocesses
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import init_db
from app.core.config import settings
from app.api import auth, problems, submissions, skill, code_review, reviewer, image_gen, notifications, reporting

app = FastAPI(
    title="CodeMentor AI API",
    description="Backend API for the AI-Based Intelligent Code Review System",
    version="1.0.0"
)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.on_event("startup")
async def startup_event():
    print("Starting up AI CODE REVIEW SYSTEM API...")
    try:
        await init_db()
        print("Successfully initialized SQL backend.")
    except Exception as e:
        print(f"CRITICAL: FAILED TO INITIALIZE SQL DATABASE: {e}")

@app.middleware("http")
async def add_security_headers(request, call_next):
    # This ensures COOP headers are on ALL responses for Google Login
    response = await call_next(request)
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups"
    return response

# CORS MUST BE THE LAST ONE ADDED TO BE ON THE OUTSIDE OF THE RESPONSE CHAIN
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost", "http://127.0.0.1"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(problems.router, prefix="/api/problems", tags=["Problems"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["Submissions"])
app.include_router(skill.router, prefix="/api/skill", tags=["Skill Progress"])
app.include_router(reviewer.router, prefix="/api/reviewer", tags=["AI Reviewer"])
app.include_router(code_review.router, prefix="/api/code-review", tags=["Code Review"])
app.include_router(image_gen.router, prefix="/api/image-gen", tags=["Image Generation"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(reporting.router, prefix="/api/reporting", tags=["Reporting"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to CodeMentor AI API",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    health = {"status": "healthy", "database": "unknown"}
    try:
        from app.db.session import engine
        from sqlalchemy import text
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        health["database"] = "SQL - Connected"
    except Exception as e:
        health["database"] = "SQL - Disconnected"
        health["error"] = str(e)
    return health

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=5001, reload=True)
