from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.report_service import report_service
from fastapi.responses import FileResponse
from datetime import datetime
import os

router = APIRouter()

@router.get("/weekly-report")
async def get_weekly_report(current_user: User = Depends(get_current_user)):
    """
    Generate and download the weekly performance report.
    """
    # Mock stats for now - in production these would come from the database
    stats = {
        "solved": 12,
        "rating": "85/100",
        "streak": current_user.streak_count,
        "top_skill": "Recursion"
    }
    
    report_dir = "reports"
    if not os.path.exists(report_dir):
        os.makedirs(report_dir)
        
    file_path = f"{report_dir}/report_{current_user.username}_{datetime.now().strftime('%Y%m%d')}.pdf"
    
    from datetime import datetime
    report_service.generate_weekly_pdf(current_user.full_name or current_user.username, stats, file_path)
    
    return FileResponse(
        path=file_path,
        filename=f"AIVISO_Weekly_Report_{current_user.username}.pdf",
        media_type="application/pdf"
    )

@router.get("/stats")
async def get_user_stats(current_user: User = Depends(get_current_user)):
    from app.crud import submission_crud
    from app.db.session import USE_SQL, SessionLocal
    
    stats = {
        "solved": 0,
        "easy": 0,
        "medium": 0,
        "hard": 0,
        "rating": 1200, # Base starting rating
        "streak": current_user.streak_count,
        "recent_submissions": []
    }
    
    try:
        # Get user's submissions
        subs = await submission_crud.get_by_user(str(current_user.id))
        
        unique_problems_solved = set()
        
        # Sort by most recent first
        subs_sorted = sorted(subs, key=lambda x: getattr(x, "created_at", None) or 1, reverse=True)
        
        for sub in subs_sorted:
            # Add to recent list if < 10 items
            if len(stats["recent_submissions"]) < 10:
                is_accepted = getattr(sub, "score", 0.0) >= 0.8 or getattr(sub, "status", "") == "approve"
                
                # Try to safely get problem title, otherwise fallback
                prob_title = f"Problem ID: {getattr(sub, 'problem_id', 'Unknown')}"
                if not USE_SQL:
                    # If Beanie link is resolved
                    if hasattr(sub, "problem") and hasattr(sub.problem, "title"):
                        prob_title = getattr(sub.problem, "title", prob_title)
                
                stats["recent_submissions"].append({
                    "id": str(getattr(sub, "id", "")),
                    "title": prob_title,
                    "language": getattr(sub, "language", "Unknown"),
                    "status": "Accepted" if is_accepted else "Wrong Answer",
                    "time": getattr(sub, "created_at", "Just now").strftime("%b %d, %Y") if hasattr(getattr(sub, "created_at", None), "strftime") else "Recently"
                })
            
            # Count solved for unique (if score > threshold)
            prob_id = getattr(sub, "problem_id", None)
            if hasattr(sub, "problem") and hasattr(sub.problem, "id"):
                prob_id = str(sub.problem.id)
                
            is_accepted = getattr(sub, "score", 0.0) >= 0.8 or getattr(sub, "status", "") == "approve"
            
            if is_accepted and prob_id and prob_id not in unique_problems_solved:
                unique_problems_solved.add(prob_id)
                stats["solved"] += 1
                
                # Increment rating roughly based on difficulty logic.
                stats["rating"] += 10
                
                # If we can extract difficulty, increment buckets. Otherwise bucket randomly for demo based on hash
                if hasattr(sub, "problem") and hasattr(sub.problem, "difficulty"):
                    diff = str(sub.problem.difficulty).lower()
                    if "beginner" in diff or "easy" in diff:
                        stats["easy"] += 1
                    elif "advanced" in diff or "hard" in diff:
                        stats["hard"] += 1
                    else:
                        stats["medium"] += 1
                else:
                    # Deterministic bucket assignment if no difficulty returned
                    bucket_hash = hash(prob_id) % 10
                    if bucket_hash < 4: stats["easy"] += 1
                    elif bucket_hash < 8: stats["medium"] += 1
                    else: stats["hard"] += 1
    except Exception as e:
        print(f"Error compiling user stats: {e}")
        
    return stats

