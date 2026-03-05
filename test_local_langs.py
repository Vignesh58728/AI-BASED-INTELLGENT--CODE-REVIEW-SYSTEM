import httpx
import asyncio
import json

async def test_execution(lang, code):
    url = "http://localhost:5001/api/reviewer/execute"
    payload = {
        "code": code,
        "language": lang,
        "problem_id": "0"
    }
    
    print(f"Testing {lang}...")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=20.0)
            print(f"Status Code: {response.status_code}")
            print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error for {lang}: {e}")

async def main():
    await test_execution("python", "print('Hello Python')")
    print("-" * 20)
    await test_execution("javascript", "console.log('Hello JS')")

if __name__ == "__main__":
    asyncio.run(main())
