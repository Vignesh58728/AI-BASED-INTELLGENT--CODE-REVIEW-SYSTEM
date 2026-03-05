import httpx
import asyncio
import base64
import os
from dotenv import load_dotenv

load_dotenv()

async def test_judge0():
    api_key = os.getenv("JUDGE0_API_KEY")
    host = "judge0-ce.p.rapidapi.com"
    url = f"https://{host}/submissions"
    
    headers = {
        "x-rapidapi-key": api_key,
        "x-rapidapi-host": host,
        "Content-Type": "application/json"
    }
    
    code = "print('Hello from Judge0')"
    encoded_code = base64.b64encode(code.encode('utf-8')).decode('utf-8')
    
    payload = {
        "language_id": 71,  # Python
        "source_code": encoded_code,
        "stdin": ""
    }
    
    print(f"Testing Judge0 with key: {api_key[:5]}...{api_key[-5:]}")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers, params={"wait": "true", "base64_encoded": "true"}, timeout=10.0)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 201:
                data = response.json()
                stdout = base64.b64decode(data.get("stdout") or "").decode('utf-8')
                print(f"STDOUT: {stdout}")
            else:
                print("Failed to run code via Judge0.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_judge0())
