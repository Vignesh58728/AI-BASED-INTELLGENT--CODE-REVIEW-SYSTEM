import httpx
import asyncio
import json

async def test_execution(port):
    url = f"http://localhost:{port}/api/reviewer/execute"
    payload = {
        "code": "print('Hello from test script on port ' + str(" + str(port) + "))",
        "language": "python",
        "problem_id": "0"
    }
    
    print(f"Testing {url}")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=20.0)
            print(f"Status Code: {response.status_code}")
            print(f"Response Body: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error on port {port}: {e}")

async def main():
    await test_execution(5000)
    print("-" * 20)
    await test_execution(5001)

if __name__ == "__main__":
    asyncio.run(main())
