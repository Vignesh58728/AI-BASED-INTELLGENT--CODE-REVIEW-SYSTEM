import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_mock_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.dependencies import get_db

# Mock database URL for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def db():
    # Placeholder for actual DB setup/teardown in tests
    yield None
