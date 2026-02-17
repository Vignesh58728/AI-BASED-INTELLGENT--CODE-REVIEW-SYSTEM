from fastapi.testclient import TestClient

def test_read_progression_me(client: TestClient):
    """
    Test the /api/v1/progression/me endpoint returns correct structure.
    """
    response = client.get("/api/v1/progression/me")
    assert response.status_code == 200
    data = response.json()
    assert "user_id" in data
    assert "total_score" in data
    assert "current_status" in data

def test_failed_stage_tracking(client: TestClient):
    """
    Test the /api/v1/progression/failed-stage endpoint.
    """
    response = client.post("/api/v1/progression/failed-stage?stage_id=stage_5")
    assert response.status_code == 200
    assert response.json()["status"] == "recorded"
