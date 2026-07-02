from typing import Any
from fastapi import APIRouter, Depends
from app.schemas.ai_review import (
    AIReviewRequest, 
    AIReviewResponse, 
    ComplexityResponse,
    SuggestionResponse,
    EdgeCaseResponse,
    FixRequest,
    FixResponse,
    PlagiarismResponse,
    CodeGenRequest,
    CodeGenResponse,
    ExplainRequest,
    ExplainResponse
)
from app.schemas.ai import (
    AIChatRequest, 
    AIChatResponse, 
    AIGeneratedQuestionRequest, 
    AIGeneratedQuestionResponse,
    ChatHistorySaveRequest,
    ChatHistoryResponse
)
from app.services import llm_service, static_analyzer, bug_detector, executor
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.chat_history import ChatHistory
from datetime import datetime

router = APIRouter()

@router.post("/execute")
async def execute_code(request: AIReviewRequest):
    print(f"DEBUG: EXECUTE ROUTE CALLED with language={request.language}")
    """
    Execute the provided code and return output.
    Logs to MongoDB if user_id and problem_id are provided.
    """
    try:
        result = await executor.execute_code(request.code, request.language or "python")
        
        # Save to MongoDB if context is provided
        if hasattr(request, 'user_id') and hasattr(request, 'problem_id') and request.user_id and request.problem_id:
            from app.crud import submission_crud
            from app.schemas.submission_schema import SubmissionCreate
            
            try:
                sub_in = SubmissionCreate(
                    user_id=request.user_id,
                    problem_id=request.problem_id,
                    code=request.code,
                    language=request.language or "python",
                    score=0.0,
                    feedback=None
                )
                db_obj = await submission_crud.create(obj_in=sub_in)
                db_obj.status = result.get("status", "error")
                db_obj.output = result.get("output")
                db_obj.error_msg = result.get("error")
                await db_obj.save()
                result["submission_id"] = str(db_obj.id)
            except Exception as e:
                print(f"Failed to log execution to DB: {e}")

        return result
    except Exception as e:
        print(f"CRITICAL ERROR IN ROUTE HANDLER: {e}")
        return {"output": "", "error": f"Internal Route Error: {str(e)}", "status": "error"}

@router.post("/generate-question", response_model=AIGeneratedQuestionResponse)
async def generate_ai_question(
    request: AIGeneratedQuestionRequest
) -> Any:
    """
    Generate a dynamic AI question.
    """
    result = await llm_service.generate_question(request)
    return result

@router.post("/review", response_model=AIReviewResponse)
async def perform_code_review(
    request: AIReviewRequest
) -> Any:
    """
    Submit code for AI review.
    """
    result = await static_analyzer.analyze_code(request)
    return result

@router.post("/chat", response_model=AIChatResponse)
async def get_ai_chat_response(
    request: AIChatRequest
) -> Any:
    """
    Get a structured AI response for a chat query.
    """
    result = await llm_service.get_chat_response(request)
    return result

@router.post("/explain", response_model=ExplainResponse)
async def explain_code(
    request: ExplainRequest
) -> Any:
    """
    Explain the provided code.
    """
    result = await llm_service.explain_code(request)
    return result

@router.post("/complexity", response_model=ComplexityResponse)
async def analyze_complexity(
    request: AIReviewRequest # Reusing AIReviewRequest for code/lang
) -> Any:
    """
    Analyze the time and space complexity of the provided code.
    """
    result = await static_analyzer.analyze_complexity(request)
    return result

@router.post("/suggest", response_model=SuggestionResponse)
async def get_suggestions(
    request: ExplainRequest # Reusing ExplainRequest for code/lang
) -> Any:
    """
    AI Pair Programmer.
    """
    result = await llm_service.get_suggestions(request)
    return result

@router.post("/edge-cases", response_model=EdgeCaseResponse)
async def predict_edge_cases(
    request: AIReviewRequest # Reusing AIReviewRequest for problem context
) -> Any:
    """
    Edge Case Predictor.
    """
    result = await bug_detector.predict_edge_cases(request)
    return result
@router.post("/history/save")
async def save_chat_history(
    request: ChatHistorySaveRequest,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Save or update the chat history for the current user.
    """
    history = await ChatHistory.find_one(ChatHistory.user.id == current_user.id)
    if not history:
        history = ChatHistory(user=current_user, messages=request.messages)
    else:
        history.messages = request.messages
        history.updated_at = datetime.utcnow()
    
    await history.save()
    return {"status": "success"}

@router.get("/history", response_model=ChatHistoryResponse)
async def get_chat_history(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get the chat history for the current user.
    """
    history = await ChatHistory.find_one(ChatHistory.user.id == current_user.id)
    if not history:
        return ChatHistoryResponse(messages=[], updated_at=datetime.utcnow())
    return ChatHistoryResponse(messages=history.messages, updated_at=history.updated_at)

@router.post("/fix", response_model=FixResponse)
async def fix_code(request: FixRequest) -> Any:
    """
    Automatically fix bugs and improve code quality.
    """
    result = await llm_service.fix_code_with_llm(request.code, request.language, model=request.model or "default")
    return FixResponse(**result)

@router.post("/plagiarism", response_model=PlagiarismResponse)
async def check_plagiarism(request: AIReviewRequest) -> Any:
    """
    Check for potential plagiarism in the code.
    """
    result = await llm_service.check_plagiarism_with_llm(request.code, request.language)
    return PlagiarismResponse(**result)

@router.post("/generate-code", response_model=CodeGenResponse)
async def generate_code(request: CodeGenRequest) -> Any:
    """
    Generate code from natural language prompt.
    """
    result = await llm_service.generate_code_from_nl(request.prompt, request.language, model=request.model or "default")
    return CodeGenResponse(**result)
