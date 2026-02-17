from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, progression, school, college, it, ai

app = FastAPI(
    title="CodeMentor AI API",
    description="Backend API for the AI-Based Intelligent Code Review System",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust to specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(progression.router, prefix="/api/v1/progression", tags=["Progression"])
app.include_router(school.router, prefix="/api/v1/school", tags=["School Module"])
app.include_router(college.router, prefix="/api/v1/college", tags=["College Module"])
app.include_router(it.router, prefix="/api/v1/it", tags=["IT Module"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Code Review"])

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
