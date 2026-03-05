import httpx
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def test_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    model = "gemini-1.5-flash"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    payload = {
        "contents": [{"parts": [{"text": "Hello, how are you?"}]}]
    }
    
    print(f"Testing Gemini with key: {api_key[:5]}...{api_key[-5:]}")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=10.0)
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                print("Gemini API is working!")
                print(f"Response: {response.json()['candidates'][0]['content']['parts'][0]['text']}")
            else:
                print(f"Gemini API failed: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
