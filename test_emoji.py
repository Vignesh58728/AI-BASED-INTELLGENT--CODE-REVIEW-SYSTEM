import httpx
import asyncio
import json

async def test_execution_emoji():
    url = "http://localhost:5001/api/reviewer/execute"
    payload = {
        "code": "print('Hello world with emoji 🐍')",
        "language": "python",
        "problem_id": "0"
    }
    
    print(f"Testing {url} with emoji payload")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=20.0)
            print(f"Status Code: {response.status_code}")
            print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error during request: {e}")

if __name__ == "__main__":
    asyncio.run(test_execution_emoji())
