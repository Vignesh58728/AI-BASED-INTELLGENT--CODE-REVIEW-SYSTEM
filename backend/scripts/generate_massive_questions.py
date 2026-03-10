import asyncio
import json
import os
import random
from typing import List, Dict, Any
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
import sys

# Add the parent directory to sys.path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.problem import Problem, ProblemModule, DifficultyLevel
from app.services import llm_service
from app.core.config import settings
from app.schemas.ai import AIGeneratedQuestionRequest

# List of topics to generate questions for
TOPICS = {
    ProblemModule.SCHOOL: [
        "Math Basics", "String Manipulation", "Logical Thinking", "Pattern Printing",
        "List Operations", "Basic Dictionaries", "File Handling Basics", "Date and Time",
        "Conditional Logic", "Looping Mastery", "Unit Conversion", "Simple Games"
    ],
    ProblemModule.COLLEGE: [
        "Linked Lists", "Binary Trees", "Sorting Algorithms", "Search Algorithms",
        "Stack and Queues", "Dynamic Programming", "Graph Theory", "Greedy Algorithms",
        "Recursion", "Backtracking", "Bit Manipulation", "Object Oriented Design",
        "DBMS Queries", "Operating System Concepts", "Networking Protocols"
    ],
    ProblemModule.IT: [
        "React Design Patterns", "Node.js REST APIs", "Database Optimization",
        "Docker and Containers", "Kubernetes Orchestration", "Cloud Architecture AWS",
        "Cyber Security Fundamentals", "Network Security", "DevOps Pipelines",
        "System Design", "Microservices", "Serverless Functions", "Auth Systems"
    ]
}

DIFFICULTIES = [DifficultyLevel.BEGINNER, DifficultyLevel.INTERMEDIATE, DifficultyLevel.ADVANCED]

async def generate_and_save_question(module: ProblemModule, topic: str, difficulty: DifficultyLevel, semaphore: asyncio.Semaphore):
    async with semaphore:
        print(f"Generating: [{module.value}] {topic} ({difficulty.value})...")
        try:
            req = AIGeneratedQuestionRequest(
                topic=topic,
                difficulty=difficulty.value,
                language="python" if module == ProblemModule.SCHOOL else "multi"
            )
            
            # Use the existing LLM service
            ai_q = await llm_service.generate_question(req)
            
            if ai_q.status == "completed":
                # Create the problem document
                problem = Problem(
                    title=ai_q.title,
                    description=ai_q.description,
                    module=module,
                    difficulty=difficulty,
                    points=20 if difficulty == DifficultyLevel.BEGINNER else (40 if difficulty == DifficultyLevel.INTERMEDIATE else 60),
                    tags=[module.value, topic.lower().replace(" ", "-")],
                    template_code={"python": ai_q.template_code}
                )
                
                # Check if it already exists by title
                existing = await Problem.find_one(Problem.title == problem.title)
                if not existing:
                    await problem.insert()
                    print(f"✅ Saved: {problem.title}")
                else:
                    print(f"⏭️ Skipped (already exists): {problem.title}")
            else:
                print(f"❌ Failed to generate: {topic}")
        except Exception as e:
            print(f"⚠️ Error generating {topic}: {e}")

async def main():
    # Initialize DB
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    await init_beanie(database=client[settings.MONGODB_DB_NAME], document_models=[Problem])
    
    # We'll use a semaphore to avoid hitting rate limits too hard (run 5 parallel requests)
    semaphore = asyncio.Semaphore(5)
    
    tasks = []
    
    # Let's generate a batch. To get to 1000, you can run this multiple times or increase the target.
    # For this demo, we will generate 2 per topic/difficulty combo.
    target_count = 1000
    current_count = await Problem.count()
    to_generate = target_count - current_count
    
    print(f"Current count: {current_count}. Target: {target_count}. Remaining: {to_generate}")
    
    if to_generate <= 0:
        print("Target already reached!")
        return

    # Loop through modules and topics
    for module, topics in TOPICS.items():
        for topic in topics:
            for diff in DIFFICULTIES:
                # Add multiple variations per topic to reach higher numbers
                for _ in range(5): # Generate 5 variations per topic/difficulty
                    tasks.append(generate_and_save_question(module, topic, diff, semaphore))
                    if len(tasks) >= to_generate:
                        break
                if len(tasks) >= to_generate:
                    break
            if len(tasks) >= to_generate:
                break
        if len(tasks) >= to_generate:
            break

    print(f"Queued {len(tasks)} generations.")
    await asyncio.gather(*tasks)
    print("Generation complete!")

if __name__ == "__main__":
    asyncio.run(main())
