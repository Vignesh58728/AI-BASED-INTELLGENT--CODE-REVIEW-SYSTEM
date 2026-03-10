from typing import Any, List, Optional
from fastapi import APIRouter, HTTPException
from app.crud import problems as crud_problems
from app.models.problem import ProblemModule
from app.schemas.problem import Problem
import json
import os

router = APIRouter()

# Performance cache for LeetCode JSON
_LEETCODE_CACHE = None

def get_leetcode_bank():
    global _LEETCODE_CACHE
    if _LEETCODE_CACHE is not None:
        return _LEETCODE_CACHE
        
    _LEETCODE_CACHE = {}
    try:
        # Check various locations for merged_problems.json
        paths = [
            os.path.join(os.path.dirname(__file__), "..", "..", "..", "merged_problems.json"),
            r"d:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\merged_problems.json",
            "merged_problems.json"
        ]
        for p in paths:
            if os.path.exists(p):
                print(f"DEBUG: Loading LeetCode bank from {p}...")
                with open(p, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    questions = data.get("questions", [])
                    for q in questions:
                        slug = q.get("problem_slug")
                        if slug:
                            _LEETCODE_CACHE[slug] = q
                print(f"DEBUG: Successfully loaded {len(_LEETCODE_CACHE)} LeetCode problems.")
                return _LEETCODE_CACHE
        print("DEBUG: No LeetCode bank file found in any expected location.")
    except Exception as e:
        print(f"DEBUG: Failed to load LeetCode JSON: {e}")
    return _LEETCODE_CACHE

# Load static fallback data
STATIC_SCHOOL_PROBLEMS = []
try:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    resources_path = os.path.join(current_dir, "..", "resources", "school_programs.json")
    if os.path.exists(resources_path):
        with open(resources_path, "r") as f:
            STATIC_SCHOOL_PROBLEMS = json.load(f)
        print(f"INFO: Loaded {len(STATIC_SCHOOL_PROBLEMS)} school programs from static fallback.")
    else:
        print(f"WARNING: School programs fallback file not found at {resources_path}")
except Exception as e:
    print(f"ERROR: Failed to load school programs fallback: {e}")

@router.get("/school", response_model=List[Problem])
async def read_school_problems(skip: int = 0, limit: int = 100) -> Any:
    """Retrieve problems for the School Module with robust fallback."""
    try:
        db_problems = await crud_problems.get_multi_by_module(module=ProblemModule.SCHOOL, skip=skip, limit=limit)
        if db_problems:
            return db_problems
    except Exception as e:
        print(f"Database error in read_school_problems: {e}")
    
    if not skip:
        return STATIC_SCHOOL_PROBLEMS[:limit]
    return []

@router.get("/college", response_model=List[Problem])
async def read_college_problems(skip: int = 0, limit: int = 100) -> Any:
    """Retrieve problems for the College Module."""
    try:
        return await crud_problems.get_multi_by_module(module=ProblemModule.COLLEGE, skip=skip, limit=limit)
    except Exception as e:
        print(f"DATABASE ERROR in read_college_problems: {e}")
        return []

@router.get("/it", response_model=List[Problem])
async def read_it_problems(skip: int = 0, limit: int = 100) -> Any:
    """Retrieve problems for the IT Module."""
    try:
        return await crud_problems.get_multi_by_module(module=ProblemModule.IT, skip=skip, limit=limit)
    except Exception as e:
        print(f"DATABASE ERROR in read_it_problems: {e}")
        return []

@router.get("/leetcode/all", response_model=List[dict])
async def list_leetcode_problems(skip: int = 0, limit: int = 100) -> Any:
    """List all LeetCode problems from the local JSON file."""
    try:
        bank = get_leetcode_bank()
        all_probs = []
        for slug, q in bank.items():
            all_probs.append({
                "title": q["title"],
                "titleSlug": q["problem_slug"],
                "difficulty": q["difficulty"],
                "topics": q.get("topics", [])
            })
        all_probs.sort(key=lambda x: x["title"])
        return all_probs[skip : skip + limit]
    except Exception as e:
        print(f"Error listing LeetCode problems: {e}")
        return []

@router.get("/{problem_id}", response_model=Problem)
async def read_problem(problem_id: str) -> Any:
    """Retrieve a specific problem."""
    try:
        from app.models.problem import Problem as ProblemModel, ProblemModule, DifficultyLevel
        from beanie import PydanticObjectId
        
        # 1. Handle Dynamic LeetCode/Codeforces IDs First
        is_leetcode = str(problem_id).startswith("lc-")
        is_codeforces = str(problem_id).startswith("cf-")
        
        if is_leetcode or is_codeforces:
            clean_id = str(problem_id).replace("lc-", "").replace("cf-", "")
            
            # Step A: Check DB by tags FIRST (already imported)
            try:
                existing = await ProblemModel.find_one({"tags": str(problem_id)})
                if not existing:
                    tag_name = f"leetcode-{clean_id}" if is_leetcode else f"cf-{clean_id}"
                    existing = await ProblemModel.find_one({"tags": tag_name})
                
                if existing:
                    return existing
            except Exception as e:
                print(f"DEBUG: Skipping DB lookup for {problem_id} (DB likely down): {e}")
            
            # Step B: Check local JSON bank
            if is_leetcode:
                bank = get_leetcode_bank()
                if clean_id in bank:
                    q = bank[clean_id]
                    
                    # Format description
                    desc = f"## {q['title']}\n\n{q.get('description', '')}\n\n"
                    if q.get('examples'):
                        desc += "### Examples\n"
                        for ex in q['examples']:
                            desc += f"#### Example {ex.get('example_num')}\n```text\n{ex.get('example_text')}\n```\n"
                    if q.get('constraints'):
                        desc += "### Constraints\n" + "\n".join([f"- {c}" for c in q['constraints']])
                    
                    # Snippets
                    snippets = q.get("code_snippets", {})
                    template = {"python": snippets.get("python3", snippets.get("python", "# Write your code here"))}
                    if "javascript" in snippets: template["javascript"] = snippets["javascript"]
                    if "cpp" in snippets: template["cpp"] = snippets["cpp"]
                    if "java" in snippets: template["java"] = snippets["java"]
                    
                    # Points & Difficulty
                    diff_map = {"Easy": DifficultyLevel.BEGINNER, "Medium": DifficultyLevel.INTERMEDIATE, "Hard": DifficultyLevel.ADVANCED}
                    points_map = {"Easy": 20, "Medium": 40, "Hard": 60}
                    
                    # Dictionary representation for dynamic problem
                    problem_dict = {
                        "id": str(problem_id),
                        "title": q["title"],
                        "description": desc,
                        "module": ProblemModule.COLLEGE,
                        "difficulty": diff_map.get(q["difficulty"], DifficultyLevel.INTERMEDIATE),
                        "points": points_map.get(q["difficulty"], 40),
                        "tags": ["leetcode", "algorithm", str(problem_id)] + q.get("topics", []),
                        "template_code": template
                    }
                    
                    return problem_dict

            # Step C: Fallback to AI generation
            from app.services.llm_service import generate_question
            from app.schemas.ai import AIGeneratedQuestionRequest
            
            print(f"DEBUG: Falling back to AI for {problem_id}")
            topic_str = f"LeetCode Problem: {clean_id.replace('-', ' ').title()}" if is_leetcode else f"Codeforces Problem {clean_id}"
            req = AIGeneratedQuestionRequest(topic=topic_str, difficulty="intermediate", language="python")
            ai_q = await generate_question(req)
            
            ai_dict = {
                "id": str(problem_id),
                "title": ai_q.title,
                "description": ai_q.description,
                "module": ProblemModule.COLLEGE,
                "difficulty": DifficultyLevel.INTERMEDIATE,
                "points": 50,
                "tags": [("leetcode" if is_leetcode else "codeforces"), str(problem_id)],
                "template_code": {"python": ai_q.template_code}
            }
            return ai_dict

        # 2. Try DB by ID for static problems
        try:
            PydanticObjectId(problem_id)
            db_problem = await crud_problems.get(id=problem_id)
            if db_problem:
                return db_problem
        except Exception:
            pass

        # 3. Static fallback check
        for p in STATIC_SCHOOL_PROBLEMS:
            if str(p.get("id")) == str(problem_id):
                return p
                
    except Exception as e:
        print(f"DEBUG: CRITICAL Error in read_problem for {problem_id}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
            
    raise HTTPException(status_code=404, detail=f"Problem {problem_id} not found.")
