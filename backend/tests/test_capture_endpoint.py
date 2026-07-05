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


def test_capture_valid_url_creates_pending_content():
    response = client.post("/content", json={"url": "https://example.com/post"})
    assert response.status_code == 201
    body = response.json()
    assert body["url"] == "https://example.com/post"
    assert body["status"] == "pending"
    assert "id" in body
    assert "savedAt" in body


def test_capture_without_content_type_defaults_to_other():
    response = client.post("/content", json={"url": "https://example.com/post"})
    assert response.json()["contentType"] == "other"


def test_capture_with_content_type_honored():
    response = client.post(
        "/content", json={"url": "https://youtube.com/watch?v=abc", "contentType": "youtube"}
    )
    assert response.json()["contentType"] == "youtube"


def test_capture_malformed_url_rejected():
    response = client.post("/content", json={"url": "not-a-url"})
    assert response.status_code == 422

    with _engine.begin() as conn:
        count = conn.execute(text("SELECT count(*) FROM content")).scalar()
    assert count == 0


def test_capture_response_has_no_enrichment_fields():
    response = client.post("/content", json={"url": "https://example.com/post"})
    body = response.json()
    assert "title" not in body
    assert "summary" not in body
    assert "topics" not in body
