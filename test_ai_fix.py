import requests
import json
import time

BASE_URL = "http://127.0.0.1:5000/api"

def test_health():
    print("Testing Health Endpoint...")
    try:
        response = requests.get(f"http://127.0.0.1:5000/health")
        print(f"Health: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Health Check Failed: {e}")

def test_code_review_submit():
    print("\nTesting Endpoints...")
    payload = {
        "code": "def add(a, b):\n    return a + b",
        "problemContext": "Write a function to add two numbers.",
        "testCases": [
            {"input": "add(1, 2)", "expectedOutput": "3"}
        ],
        "requiredFunctions": ["add"]
    }
    try:
        start = time.time()
        response = requests.post(f"{BASE_URL}/code-review/submit", json=payload)
        end = time.time()
        print(f"Submit Code Review: {response.status_code} (Took {end-start:.2f}s)")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Submit Failed: {e}")

def test_ai_chat():
    print("\nTesting AI Chat...")
    payload = {
        "query": "Hello, who are you?",
        "model": "llama 3.3",
        "history": []
    }
    try:
        start = time.time()
        # Note: Chat endpoint usually requires auth, let's see if it works without for a simple test 
        # (if it's not protected by Depends(get_current_user))
        response = requests.post(f"{BASE_URL}/code-review/review", json={"code": "print('hello')"})
        end = time.time()
        print(f"Simple Review Chat: {response.status_code} (Took {end-start:.2f}s)")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Chat Failed: {e}")

if __name__ == "__main__":
    test_health()
    test_code_review_submit()
    test_ai_chat()
