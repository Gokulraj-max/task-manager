def test_create_and_get_task(client, auth_header):
    create_resp = client.post(
        "/tasks",
        json={"title": "Buy groceries", "description": "Milk, eggs, and bread", "priority": "high", "due_date": "2026-07-15"},
        headers=auth_header
    )
    assert create_resp.status_code == 201
    task_id = create_resp.json()["id"]

    get_resp = client.get(f"/tasks/{task_id}", headers=auth_header)
    assert get_resp.status_code == 200
    assert get_resp.json()["title"] == "Buy groceries"
    assert get_resp.json()["status"] == "pending"
    assert get_resp.json()["due_date"] == "2026-07-15"

def test_search_and_pagination_and_sort(client, auth_header):
    client.post("/tasks", json={"title": "Amazon shopping", "description": "Order new laptop", "due_date": "2026-07-20"}, headers=auth_header)
    client.post("/tasks", json={"title": "Book flight", "description": "Trip to NY", "due_date": "2026-07-10"}, headers=auth_header)

    # Search query
    search_resp = client.get("/tasks?search=amazon", headers=auth_header)
    assert search_resp.status_code == 200
    assert search_resp.json()["total"] == 1
    assert search_resp.json()["data"][0]["title"] == "Amazon shopping"

    # Sort query by due_date asc
    sort_resp = client.get("/tasks?sort=due_date&order=asc", headers=auth_header)
    assert sort_resp.status_code == 200
    assert sort_resp.json()["data"][0]["title"] == "Book flight"

def test_mark_complete_and_delete(client, auth_header):
    create_resp = client.post("/tasks", json={"title": "Finish report"}, headers=auth_header)
    task_id = create_resp.json()["id"]

    patch_resp = client.patch(f"/tasks/{task_id}/complete", headers=auth_header)
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "completed"

    del_resp = client.delete(f"/tasks/{task_id}", headers=auth_header)
    assert del_resp.status_code == 200

    get_resp = client.get(f"/tasks/{task_id}", headers=auth_header)
    assert get_resp.status_code == 404
