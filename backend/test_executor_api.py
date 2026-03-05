import requests
import json

def test_execute():
    url = "http://localhost:5001/api/reviewer/execute"
    payload = {
        "code": "print('Hello from test script!')",
        "language": "python"
    }
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_execute()
