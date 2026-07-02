import re
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from app.schemas.ai_review import CodeReviewSubmitRequest, CodeReviewSubmitResponse, TestCase
from app.schemas.ai import AIChatRequest
from app.services import executor, llm_service

router = APIRouter()

def run_strict_checks(code: str, test_cases: List[TestCase], required_functions: Optional[List[str]] = None):
    # 1. Detect Hardcoding
    for tc in test_cases:
        expected = tc.expectedOutput.strip()
        if len(expected) > 2:
            escaped = re.escape(expected)
            hardcode_pattern = rf"['\"`]{escaped}['\"`]"
            if re.search(hardcode_pattern, code, re.IGNORECASE):
                return False, "Hard Coding", "Do not hardcode the expected outputs."

    # 2. Check required functions
    if required_functions:
        for func in required_functions:
            if func not in code:
                return False, "Requirement not met", f"Required function '{func}' is missing."

    # 3. Detect unnecessary lines
    lines = code.split('\n')
    if len(lines) > 200 and len(code) > 5000:
        return False, "Unnecessary code", "Code is too verbose or contains unnecessary lines."

    return True, None, None

async def predict_review_necessity(code: str, problem_context: str) -> str:
    """Stage 2: Determine if a review is necessary using llm_service."""
    system_prompt = "Role: Teacher. Task: Determine if a review is necessary for student code."
    prompt = (
        f"Instruction: Before reviewing the [SubmittedCode], determine whether a review is necessary. "
        f"Respond 'yes' if the [SubmittedCode] contains mistakes or improvements are needed. "
        f"Respond 'no_correct' if the [SubmittedCode] is already correct and matches the [Solution], "
        f"meaning no review is needed. Respond 'no_meaningless' if the [SubmittedCode] is too simple "
        f"(e.g., 'print()', single numbers, random characters) and does not attempt to solve the [Python-Problem]. "
        f"Respond with only one of the three options: 'yes', 'no_correct', or 'no_meaningless'.\n\n"
        f"[Python-Problem]: {problem_context}\n"
        f"[SubmittedCode]: {code}"
    )

    request = AIChatRequest(
        query=prompt,
        model="llama 3.3",
        history=[]
    )
    
    try:
        response = await llm_service.get_chat_response(request)
        if response.status == "failed":
            return "proceed"
            
        answer = response.answer.strip().lower()
        if "no_correct" in answer: return "no_correct"
        if "no_meaningless" in answer: return "no_meaningless"
    except Exception as e:
        print(f"Prediction Error: {e}")
        
    return "proceed"

async def generate_review_comments(code: str, error: str, context: str):
    """Stage 3: Generate detailed review comments using llm_service."""
    system_prompt = (
        "Role: Teacher\n"
        "Style&Tone: Vocabulary suitable for primary and secondary school students.\n"
        "Instruction: Include [Example][/Example], [RNP][/RNP], [RC][/RC], and [R][/R]. "
        "Add 'Code to fix' comment to incorrect lines. Reply to [RC][/RC] with commented [Code]. "
        "Respond with [R][/R] within three sentences.\n"
        "Restriction: Do not directly modify or show fixed code in [RC][/RC] and [R][/R]."
    )
    prompt = (
        f"[PythonProblem]: {context}\n"
        f"[SubmittedCode]:\n{code}\n\n"
        f"Test Case Error: {error}\n\n"
        f"Please provide your review following the instructions."
    )

    request = AIChatRequest(
        query=prompt,
        model="llama 3.3",
        history=[]
    )
    # Note: We can't pass system_prompt directly to get_chat_response yet, 
    # but llm_service uses provider-specific prompts. 
    # For now, we prepend it to the query or rely on llm_service defaults.
    # To keep it consistent, we'll put it in the query.
    request.query = f"{system_prompt}\n\n{prompt}"
    
    response = await llm_service.get_chat_response(request)
    return response.answer

@router.post("/submit", response_model=CodeReviewSubmitResponse)
async def submit_code_review(request: CodeReviewSubmitRequest):
    passed_check, check_type, check_msg = run_strict_checks(
        request.code, request.testCases, request.requiredFunctions
    )
    if not passed_check:
        return CodeReviewSubmitResponse(
            status="rejected",
            type=check_type,
            message=check_msg,
            reviewStatus="no_meaningless"
        )

    # Execution
    test_results = []
    all_passed = True
    
    for tc in request.testCases:
        execution_code = request.code + f"\n\nprint({tc.input})"
        res = await executor.execute_python_code(execution_code)
        
        actual = res.get("output", "").strip()
        error = res.get("error", "").strip()
        passed = actual == tc.expectedOutput.strip()
        
        test_results.append({
            "input": tc.input,
            "expected": tc.expectedOutput,
            "actual": actual,
            "error": error,
            "passed": passed,
            "executor_status": res.get("status")
        })
        
        if not passed:
            all_passed = False
            break 

    # Review Necessity Stage
    if all_passed:
        review_action = "no_correct"
    else:
        clean_code = re.sub(r'\s+', '', request.code)
        if len(clean_code) < 15:
            review_action = "no_meaningless"
        else:
            review_action = await predict_review_necessity(request.code, request.problemContext)

    ai_review = None
    if review_action == "proceed":
        error_info = f"Failed test case {test_results[-1]['input']}. Expected {test_results[-1]['expected']}, got {test_results[-1]['actual']}."
        ai_review = await generate_review_comments(request.code, error_info, request.problemContext)

    return CodeReviewSubmitResponse(
        status="passed" if all_passed else "failed",
        runResult={"testCaseResults": test_results},
        aiReview=ai_review,
        reviewStatus=review_action
    )

@router.post("/review")
async def review_simple(request: dict):
    if "code" not in request:
        raise HTTPException(status_code=400, detail="Missing 'code' in request")
    
    code = request["code"]
    system_prompt = "Role: Senior Engineer. Task: Review the [SubmittedCode] line by line. For each line, provide detailed feedback on correctness, style, and performance. Format the output clearly with the line number and code snippet, followed by your review."
    
    chat_request = AIChatRequest(
        query=f"{system_prompt}\n\n[SubmittedCode]:\n{code}",
        model="llama 3.3",
        history=[]
    )

    response = await llm_service.get_chat_response(chat_request)
    return {"feedback": response.answer}
