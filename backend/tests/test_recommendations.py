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


def _insert(url, topics, status="ready"):
    with _engine.begin() as conn:
        row = conn.execute(
            text(
                """
                INSERT INTO content (id, url, source, saved_at, content_type, status, title, metadata, topics)
                VALUES (gen_random_uuid(), :url, 'api', now(), 'blog', :status, :url, '{}', :topics)
                RETURNING id
                """
            ),
            {"url": url, "status": status, "topics": topics},
        )
        return str(row.scalar())


def test_related_items_share_a_topic():
    source_id = _insert("https://example.com/a", '["rust", "systems"]')
    _insert("https://example.com/b", '["rust", "networking"]')
    _insert("https://example.com/c", '["cooking"]')

    response = client.get(f"/content/{source_id}/related")
    assert response.status_code == 200
    urls = {item["url"] for item in response.json()}
    assert urls == {"https://example.com/b"}


def test_more_overlap_ranks_first():
    source_id = _insert("https://example.com/a", '["rust", "systems", "networking"]')
    _insert("https://example.com/b", '["rust"]')
    _insert("https://example.com/c", '["rust", "systems", "networking"]')

    response = client.get(f"/content/{source_id}/related")
    body = response.json()
    assert body[0]["url"] == "https://example.com/c"


def test_source_item_excluded_from_own_results():
    source_id = _insert("https://example.com/a", '["rust"]')

    response = client.get(f"/content/{source_id}/related")
    urls = [item["url"] for item in response.json()]
    assert "https://example.com/a" not in urls


def test_no_topics_returns_empty():
    source_id = _insert("https://example.com/a", "[]")
    _insert("https://example.com/b", '["rust"]')

    response = client.get(f"/content/{source_id}/related")
    assert response.json() == []


def test_nonexistent_content_returns_404():
    response = client.get("/content/00000000-0000-0000-0000-000000000000/related")
    assert response.status_code == 404
