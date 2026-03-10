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
