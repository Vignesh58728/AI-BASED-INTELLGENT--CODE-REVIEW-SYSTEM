import sys
import os
import asyncio

# Mock settings
class Settings:
    JUDGE0_API_KEY = "dummy"

settings = Settings()

# Add backend to path to import executor
sys.path.append(os.path.abspath("backend"))

from app.services.executor import _run_python, _get_process_result

async def test_local_python():
    code = "print('Hello world from local test')"
    print(f"Testing local python execution with code: {code}")
    
    # We need to mock sys.executable to ensure it's valid
    print(f"Using sys.executable: {sys.executable}")
    
    try:
        res = await _run_python(code)
        print("Result:")
        import json
        print(json.dumps(res, indent=2))
    except Exception as e:
        print(f"Exception: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_local_python())
