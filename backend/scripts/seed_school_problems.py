import asyncio
import re
import os
import sys

# Add backend to path so we can import app
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(backend_root)

from dotenv import load_dotenv
# Load .env from backend root explicitly before importing settings
load_dotenv(os.path.join(backend_root, ".env"))

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.problem import Problem, ProblemModule, DifficultyLevel

async def seed_problems():
    print(f"Using DATABASE_URL: {settings.DATABASE_URL[:20]}...")
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.DATABASE_URL, tlsAllowInvalidCertificates=True)
    await init_beanie(
        database=client[settings.MONGODB_DB_NAME],
        document_models=[Problem]
    )

    # Clear existing school problems to avoid duplicates if re-running
    print("Clearing existing school problems...")
    await Problem.find(Problem.module == ProblemModule.SCHOOL).delete()

    source_path = os.path.join(os.path.dirname(__file__), "..", "..", "school_programs", "python_school_programs.py")
    print(f"Reading source file: {source_path}")
    
    with open(source_path, "r") as f:
        content = f.read()

    # Split into beginner, intermediate, advanced sections
    sections = {
        "beginner": re.search(r"BEGINNER LEVEL \(1–35\)(.*?)INTERMEDIATE LEVEL", content, re.DOTALL).group(1),
        "intermediate": re.search(r"INTERMEDIATE LEVEL \(36–70\)(.*?)ADVANCED LEVEL", content, re.DOTALL).group(1),
        "advanced": re.search(r"ADVANCED LEVEL \(71–100\)(.*)", content, re.DOTALL).group(1)
    }

    problems_to_insert = []

    for level, section_text in sections.items():
        # Match "# num. Title\ndef program_num():\n    body"
        # Using a regex that captures the comment title and the function body
        pattern = r"# (\d+)\. (.*?)\n(def program_\d+\(\):.*?)(?=\n# \d+\.|\Z)"
        matches = re.finditer(pattern, section_text, re.DOTALL)
        
        difficultyMap = {
            "beginner": DifficultyLevel.BEGINNER,
            "intermediate": DifficultyLevel.INTERMEDIATE,
            "advanced": DifficultyLevel.ADVANCED
        }

        for match in matches:
            num = match.group(1)
            title = match.group(2).strip()
            body = match.group(3).strip()
            
            # Clean up the body to be a good template (remove "def program_X():" and unindent)
            lines = body.split("\n")[1:] # Skip the def line
            clean_body = "\n".join([line[4:] if line.startswith("    ") else line for line in lines])

            problem = Problem(
                title=f"{num}. {title}",
                description=f"Write a Python program to {title.lower()}.",
                module=ProblemModule.SCHOOL,
                difficulty=difficultyMap[level],
                points=int(num) * 10,
                tags=[level, "python", "school"],
                template_code={"python": clean_body}
            )
            problems_to_insert.append(problem)

    print(f"Found {len(problems_to_insert)} problems to insert.")
    if problems_to_insert:
        await Problem.insert_many(problems_to_insert)
        print("Successfully seeded 100 school problems!")
    else:
        print("No problems found to seed. Check regex patterns.")

if __name__ == "__main__":
    asyncio.run(seed_problems())
