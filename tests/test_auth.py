def test_register_user(client):
    response = client.post(
        "/register",
        json={"name": "Alice Smith", "email": "alice@example.com", "password": "securepassword123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "alice@example.com"
    assert data["name"] == "Alice Smith"
    assert "id" in data
    assert "password" not in data

def test_login_user(client):
    client.post(
        "/register",
        json={"name": "Bob", "email": "bob@example.com", "password": "mypassword"}
    )
    response = client.post(
        "/login",
        json={"email": "bob@example.com", "password": "mypassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_user_profile(client):
    client.post(
        "/register",
        json={"name": "Charlie", "email": "charlie@example.com", "password": "charliepass"}
    )
    login_resp = client.post(
        "/login",
        json={"email": "charlie@example.com", "password": "charliepass"}
    )
    token = login_resp.json()["access_token"]
    
    profile_resp = client.get(
        "/profile",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert profile_resp.status_code == 200
    assert profile_resp.json()["email"] == "charlie@example.com"
