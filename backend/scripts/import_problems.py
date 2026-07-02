
import json
import asyncio
import os
import sys

# Add the current directory to sys.path to allow imports from app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.problem import Problem, ProblemModule, DifficultyLevel
from datetime import datetime

# Define mapping for difficulty
DIFFICULTY_MAP = {
    "Easy": DifficultyLevel.BEGINNER,
    "Medium": DifficultyLevel.INTERMEDIATE,
    "Hard": DifficultyLevel.ADVANCED
}

def format_description(q):
    desc = f"## {q['title']}\n\n"
    desc += q.get('description', '') + "\n\n"
    
    if q.get('examples'):
        desc += "### Examples\n"
        for ex in q['examples']:
            num = ex.get('example_num', '?')
            text = ex.get('example_text', '')
            desc += f"#### Example {num}\n```text\n{text}\n```\n"
            
    if q.get('constraints'):
        desc += "### Constraints\n"
        for c in q['constraints']:
            desc += f"- {c}\n"
            
    if q.get('hints'):
        desc += "### Hints\n"
        for hint in q['hints']:
            desc += f"- {hint}\n"
            
    return desc

async def import_problems():
    print(f"Connecting to MongoDB at {settings.DATABASE_URL.split('@')[-1]}...")
    client = AsyncIOMotorClient(
        settings.DATABASE_URL, 
        tlsAllowInvalidCertificates=True,
        serverSelectionTimeoutMS=5000
    )
    
    await init_beanie(
        database=client[settings.MONGODB_DB_NAME],
        document_models=[Problem]
    )
    
    file_path = os.path.join(os.path.dirname(__file__), '..', '..', 'merged_problems.json')
    if not os.path.exists(file_path):
        file_path = r"d:\AI BASED INTELLGENT  CODE REVIEW SYSTEM\merged_problems.json"
        
    if not os.path.exists(file_path):
        print(f"File {file_path} not found!")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    questions = data.get("questions", [])
    print(f"Found {len(questions)} questions in {file_path}")
    
    count = 0
    for q in questions:
        problem_id = f"lc-{q['problem_slug']}"
        
        # Check if already imported
        existing = await Problem.find_one(Problem.tags.all([problem_id]))
        if existing:
            continue
            
        points = 20
        if q['difficulty'] == "Medium": points = 40
        elif q['difficulty'] == "Hard": points = 60
        
        # Prepare snippets
        snippets = q.get("code_snippets", {})
        template_code = {}
        if "python3" in snippets:
            template_code["python"] = snippets["python3"]
        elif "python" in snippets:
            template_code["python"] = snippets["python"]
        else:
            template_code["python"] = "# Write your code here"
            
        if "javascript" in snippets:
            template_code["javascript"] = snippets["javascript"]
        if "cpp" in snippets:
            template_code["cpp"] = snippets["cpp"]
            
        new_prob = Problem(
            title=q["title"],
            description=format_description(q),
            module=ProblemModule.COLLEGE,
            difficulty=DIFFICULTY_MAP.get(q["difficulty"], DifficultyLevel.INTERMEDIATE),
            points=points,
            tags=["leetcode", "algorithm", problem_id] + q.get("topics", []),
            template_code=template_code
        )
        
        try:
            await new_prob.insert()
            count += 1
            if count % 50 == 0:
                print(f"Imported {count} problems...")
        except Exception as e:
            print(f"Error inserting {q['title']}: {e}")

    print(f"Successfully imported {count} new problems into database.")

if __name__ == "__main__":
    asyncio.run(import_problems())
