import asyncio
import sys
import os

# Add backend to path to import app.services.executor
sys.path.append(os.path.join(os.getcwd(), "backend"))

async def main():
    from app.services.executor import execute_code
    
    code = "def add(a, b): return a + b\nprint(add(1, 2))"
    print(f"Executing code:\n{code}")
    
    result = await execute_code(code, "python")
    print(f"\nResult: {result}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    asyncio.run(main())
