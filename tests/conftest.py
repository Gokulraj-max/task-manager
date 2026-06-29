import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from app.main import app
from app.database import Base, get_db
from app.models import User, Task

TEST_DB_FILE = "./test_shared.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{TEST_DB_FILE}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    poolclass=NullPool,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def auth_header(client):
    client.post(
        "/register",
        json={"name": "Task User", "email": "taskuser@example.com", "password": "password123"}
    )
    login_resp = client.post(
        "/login",
        json={"email": "taskuser@example.com", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
