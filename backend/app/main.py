import sys
import asyncio

# Configure event loop for Windows to support subprocesses
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import init_db
from app.core.config import settings
from app.api import auth, problems, submissions, skill, code_review, reviewer, image_gen, notifications, reporting

app = FastAPI(
    title="CodeMentor AI API",
    description="Backend API for the AI-Based Intelligent Code Review System",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    print("Starting up CodeMentor AI API and connecting to MongoDB...")
    try:
        print(f"Connecting to MongoDB at {settings.DATABASE_URL.split('@')[-1]}...") # Log host only for safety
        await init_db()
        print("Successfully connected to MongoDB.")
    except Exception as e:
        print(f"CRITICAL: FAILED TO CONNECT TO MONGODB: {e}")
        print("Possible causes: IP not whitelisted, invalid credentials, or network issues.")
        print("Server starting without database connection. Some features will use static fallbacks.")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=5001, reload=True)
