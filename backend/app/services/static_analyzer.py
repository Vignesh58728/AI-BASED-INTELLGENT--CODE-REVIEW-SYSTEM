from app.schemas.ai_review import (
    AIReviewRequest, 
    AIReviewResponse, 
    AIItem,
    ComplexityResponse
)
from app.services import llm_service

async def analyze_code(request: AIReviewRequest) -> AIReviewResponse:
    """Analyzes code using real AI."""
    result = await llm_service.analyze_code_with_llm(request.code, request.language, model=request.model or "default")
    
    detailed_reviews = [
        AIItem(line=item.get("line", 1), comment=item.get("comment", ""), severity=item.get("severity", "info"))
        for item in result.get("detailed_reviews", [])
    ]
    
    return AIReviewResponse(
        score=result.get("score", 0),
        feedback=result.get("feedback", ""),
        detailed_reviews=detailed_reviews,
        status="completed"
    )

async def analyze_complexity(request: AIReviewRequest) -> ComplexityResponse:
    """Calculates Big-O notation using real AI."""
    result = await llm_service.analyze_complexity_with_llm(request.code, request.language, model=request.model or "default")
    
    return ComplexityResponse(
        time_complexity=result.get("time_complexity", "O(?)"),
        space_complexity=result.get("space_complexity", "O(?)"),
        explanation=result.get("explanation", ""),
        status="completed"
    )
