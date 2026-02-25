import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_health():
    print("Testing /health...")
    try:
        r = requests.get(f"{BASE_URL}/health")
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")
    except Exception as e:
        print(f"Error: {e}")

def test_execute():
    print("\nTesting /reviewer/execute...")
    payload = {
        "code": "print('Hello from Test')",
        "language": "python",
        "problem_id": "0",  # Frontend sends '0' (number) but schema might want str
        "user_id": None
    }
    try:
        r = requests.post(f"{BASE_URL}/reviewer/execute", json=payload)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_health()
    test_execute()
