
import requests
import json

url = "http://localhost:5001/api/reviewer/chat"
payload = {
    "query": "Hello, how are you?",
    "model": "default",
    "history": [],
    "file_context": None,
    "language_hint": "english",
    "use_web_search": False
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload, timeout=40)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
