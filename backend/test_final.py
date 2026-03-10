
import asyncio
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

async def test_all():
    print("--- TESTING GROQ ---")
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        print(f"Key: {groq_key[:10]}...")
        async with httpx.AsyncClient() as client:
            try:
                # Groq can be tested via REST too
                resp = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {groq_key}"},
                    json={"model": "llama-3.3-70b-versatile", "messages": [{"role": "user", "content": "Hi"}]}
                )
                print(f"Groq Response {resp.status_code}: {resp.text[:200]}")
            except Exception as e:
                print(f"Groq Request failed: {e}")
    else:
        print("Groq key missing")

    print("\n--- TESTING OPENROUTER ---")
    or_key = os.getenv("OPENROUTER_API_KEY")
    if or_key:
        print(f"Key: {or_key[:10]}...")
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={"Authorization": f"Bearer {or_key}"},
                    json={"model": "google/gemma-3-2b-it:free", "messages": [{"role": "user", "content": "Hi"}]}
                )
                print(f"OpenRouter Response {resp.status_code}: {resp.text[:200]}")
            except Exception as e:
                print(f"OpenRouter Request failed: {e}")
    else:
        print("OpenRouter key missing")

    print("\n--- TESTING GEMINI ---")
    gem_key = os.getenv("GEMINI_API_KEY")
    if gem_key:
        print(f"Key: {gem_key[:10]}...")
        async with httpx.AsyncClient() as client:
            # Try both v1 and v1beta
            for version in ["v1", "v1beta"]:
                try:
                    url = f"https://generativelanguage.googleapis.com/{version}/models/gemini-1.5-flash:generateContent?key={gem_key}"
                    resp = await client.post(url, json={"contents": [{"role": "user", "parts": [{"text": "Hi"}]}]})
                    print(f"Gemini {version} Response {resp.status_code}: {resp.text[:200]}")
                except Exception as e:
                    print(f"Gemini {version} failed: {e}")
    else:
        print("Gemini key missing")

if __name__ == "__main__":
    asyncio.run(test_all())
