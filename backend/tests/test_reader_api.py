import os
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

DATABASE_URL = os.environ.get("DATABASE_URL")
pytestmark = pytest.mark.skipif(not DATABASE_URL, reason="DATABASE_URL not set")

if DATABASE_URL:
    from fastapi.testclient import TestClient
    from sqlalchemy import create_engine, text
    from sqlalchemy.orm import sessionmaker

    from main import app
    from content.presentation.dependencies import get_session

    _engine = create_engine(DATABASE_URL)
    _SessionLocal = sessionmaker(bind=_engine)

    def _override_get_session():
        session = _SessionLocal()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_session] = _override_get_session
    client = TestClient(app)


@pytest.fixture(autouse=True)
def _cleanup():
    yield
    with _engine.begin() as conn:
        conn.execute(text("DELETE FROM content"))


def _capture(url="https://example.com/post", content_type=None):
    payload = {"url": url}
    if content_type:
        payload["contentType"] = content_type
    return client.post("/content", json=payload).json()


def test_get_content_by_id_returns_full_item():
    created = _capture()
    response = client.get(f"/content/{created['id']}")
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == created["id"]
    assert body["url"] == "https://example.com/post"
    assert body["status"] == "pending"
    assert "topics" in body
    assert "metadata" in body


def test_get_content_by_id_missing_returns_404():
    response = client.get("/content/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_list_content_default_newest_first():
    first = _capture(url="https://example.com/first")
    second = _capture(url="https://example.com/second")

    response = client.get("/content")
    assert response.status_code == 200
    body = response.json()
    ids = [item["id"] for item in body]
    assert ids.index(second["id"]) < ids.index(first["id"])
    assert len(body) <= 20


def test_list_content_pagination():
    for i in range(5):
        _capture(url=f"https://example.com/item-{i}")

    page = client.get("/content", params={"limit": 2, "offset": 2}).json()
    assert len(page) == 2


def test_list_content_filter_by_status():
    _capture()
    response = client.get("/content", params={"status": "ready"})
    assert response.status_code == 200
    assert all(item["status"] == "ready" for item in response.json())


def test_list_content_filter_by_content_type():
    _capture(url="https://youtube.com/watch?v=abc", content_type="youtube")
    _capture(url="https://example.com/post")

    response = client.get("/content", params={"contentType": "youtube"})
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["contentType"] == "youtube"


def test_list_content_invalid_status_returns_422():
    response = client.get("/content", params={"status": "not-a-real-status"})
    assert response.status_code == 422
