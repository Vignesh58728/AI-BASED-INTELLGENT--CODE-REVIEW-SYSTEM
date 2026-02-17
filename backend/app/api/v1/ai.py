from typing import Any
from fastapi import APIRouter, Depends
from app.schemas.ai_review import AIReviewRequest, AIReviewResponse
from app.services import ai_service

router = APIRouter()

@router.post("/review", response_model=AIReviewResponse)
async def perform_code_review(
    request: AIReviewRequest
) -> Any:
    """
    Submit code for AI review.
    """
    result = await ai_service.analyze_code(request)
    return result
