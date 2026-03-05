import asyncio
import os
import sys

# Mock settings before importing llm_service to avoid crashes
os.environ["DATABASE_URL"] = "mongodb://localhost:27017"
os.environ["GOOGLE_API_KEY"] = "mock_key"
os.environ["GROQ_API_KEY"] = "mock_key"

# Path to backend
sys.path.append(os.path.join(os.getcwd(), "backend"))

from app.services import llm_service
from app.schemas.ai import AIChatRequest

async def test_fallback():
    print("Testing Fallback Logic...")
    
    # Mock _execute_chat_provider to fail for google
    original_execute = llm_service._execute_chat_provider
    
    async def mocked_execute(provider, model, messages, request):
        if provider == "google":
            print(f"Simulating failure for {provider}...")
            raise Exception("429 RESOURCE_EXHAUSTED: Quota exceeded")
        return "Success from fallback provider!", []

    llm_service._execute_chat_provider = mocked_execute
    
    request = AIChatRequest(
        query="Hello",
        model="Gemini 2.0 Flash",
        history=[],
        language_hint="english"
    )
    
    try:
        response = await llm_service.get_chat_response(request)
        print(f"Final Response Answer: {response.answer}")
        print(f"Status: {response.status}")
        
        if "Switched to" in response.answer:
            print("VERIFICATION SUCCESS: System correctly fell back to alternative provider.")
        else:
            print("VERIFICATION FAILED: Fallback note not found in answer.")
            
    except Exception as e:
        print(f"Test crashed: {e}")
    finally:
        llm_service._execute_chat_provider = original_execute

if __name__ == "__main__":
    asyncio.run(test_fallback())
