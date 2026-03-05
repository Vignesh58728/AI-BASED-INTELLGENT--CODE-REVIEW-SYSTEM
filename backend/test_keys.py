import asyncio
import os
from dotenv import load_dotenv
from groq import AsyncGroq
import httpx

load_dotenv()

async def test_groq():
    key = os.getenv("GROQ_API_KEY")
    print(f"Testing Groq with key: {key[:10]}...")
    if not key:
        print("Groq key missing!")
        return
    model = "llama-3.3-70b-versatile"
    try:
        client = AsyncGroq(api_key=key)
        completion = await client.chat.completions.create(
            messages=[{"role": "user", "content": "Hi"}],
            model=model
        )
        print(f"Groq Success ({model}): {completion.choices[0].message.content[:50]}...")
    except Exception as e:
        print(f"Groq Failed ({model}): {e}")

async def test_gemini_native():
    key = os.getenv("GEMINI_API_KEY")
    print(f"Testing Gemini Native with key: {key[:10]}...")
    if not key:
        print("Gemini key missing!")
        return
    model = "gemini-1.5-flash"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
    payload = {"contents": [{"role": "user", "parts": [{"text": "Hi"}]}]}
    try:
        async with httpx.AsyncClient(timeout=45) as http:
            response = await http.post(url, json=payload)
            if response.status_code == 200:
                data = response.json()
                answer = data["candidates"][0]["content"]["parts"][0]["text"]
                print(f"Gemini Native Success: {answer[:50]}...")
            else:
                print(f"Gemini Native Failed: {response.status_code} - {response.text[:200]}")
    except Exception as e:
        print(f"Gemini Native Exception: {e}")

if __name__ == "__main__":
    asyncio.run(test_groq())
    asyncio.run(test_gemini_native())
