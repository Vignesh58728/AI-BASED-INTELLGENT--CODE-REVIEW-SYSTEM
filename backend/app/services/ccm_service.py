import json
from typing import Dict, Any, Optional
from app.services import llm_service
from app.models.submission import Submission
from app.models.problem import Problem

class CCMService:
    @staticmethod
    async def evaluate_submission(submission: Submission, problem: Problem) -> Dict[str, Any]:
        """
        Performs the 3-step evaluation flow:
        1. Correctness: Is the code correct?
        2. Mistakes: Are there any mistakes (hardcoded, unnecessary code)?
        3. Logic: Does the code have meaningful logic?
        """
        code = submission.code
        language = submission.language
        problem_desc = problem.description
        
        # Build evaluation prompt based on the requirements
        eval_prompt = (
            f"Problem Description: {problem_desc}\n\n"
            f"Language: {language}\n"
            f"Code to Evaluate:\n{code}\n\n"
            "Evaluate this code in 3 steps:\n"
            "1. CORRECTNESS: Is it factually correct and solving the problem?\n"
            "2. MISTAKES: Are there logical mistakes, hardcoded answers (e.g., print('expected_output')), or unnecessary/redundant code?\n"
            "3. LOGIC: Is the logic meaningful and efficient?\n\n"
            "Return a JSON object with:\n"
            "- 'is_correct': boolean\n"
            "- 'has_meaningful_logic': boolean\n"
            "- 'detected_issues': list of strings\n"
            "- 'feedback': detailed feedback string\n"
            "- 'score': float (0-100)\n"
            "- 'action': one of ['approve', 'reject', 'request_correction']"
        )
        
        try:
            messages = [
                {
                    "role": "system", 
                    "content": "You are the Code Check Module (CCM). Your goal is to detect flaws that simple I/O tests miss."
                },
                {"role": "user", "content": eval_prompt}
            ]
            
            # Use the specialized internal helper for JSON responses
            response_text = await llm_service._get_adhoc_google_response(messages, json_mode=True)
            eval_result = json.loads(response_text)
            
            # Record results in the submission object
            submission.ccm_status = "completed" if eval_result.get("is_correct") else "rejected"
            submission.ccm_feedback = eval_result.get("feedback")
            submission.ccm_score = eval_result.get("score", 0.0)
            
            if eval_result.get("action") == "request_correction":
                submission.ccm_status = "rejected"
                submission.ccm_feedback = f"INCOMPLETE OR MEANINGLESS CODE: {submission.ccm_feedback}\nPlease submit the full corrected code."
            
            return eval_result
            
        except Exception as e:
            submission.ccm_status = "error"
            submission.ccm_feedback = f"CCM Evaluation failed: {str(e)}"
            return {"is_correct": False, "error": str(e), "action": "error"}

ccm_service = CCMService()
