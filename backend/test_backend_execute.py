import httpx
import asyncio

async def test_backend_execute():
    url = "http://localhost:5001/api/reviewer/execute"
    
    payload = {
        "code": "print('Hello Backend')",
        "language": "python"
    }
    
    print("Testing Backend /execute (Python)...")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=10.0)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

    payload_cpp = {
        "code": "#include <iostream>\nint main() { std::cout << \"Hello C++\" << std::endl; return 0; }",
        "language": "cpp"
    }
    print("\nTesting Backend /execute (C++)...")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload_cpp, timeout=10.0)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_backend_execute())
