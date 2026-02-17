from typing import List
from app.schemas.ai_review import AIReviewRequest, AIReviewResponse, AIReviewItem

async def analyze_code(request: AIReviewRequest) -> AIReviewResponse:
    """
    Integration with AI model (e.g. OpenAI, Anthropic, or custom local model).
    For now, returns a mock professional review.
    """
    # Mock analysis logic following "Make them think" philosophy
    score = 85.0
    feedback = "I noticed you're using a nested loop here. Can you think of a way to achieve the same result while visiting each element only once? Look into 'Hash Maps' or 'Sets'."
    
    reviews = [
        AIReviewItem(line=10, comment="This part looks repetitive. Is there a built-in function or a different data structure that could simplify this?", severity="warning"),
        AIReviewItem(line=5, comment="Clever way of handling this edge case!", severity="info")
    ]
    
    return AIReviewResponse(
        score=score,
        feedback=feedback,
        detailed_reviews=reviews,
        status="completed"
    )
