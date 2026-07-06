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


def _insert(url, title=None, extracted_text=None, summary=None, topics=None):
    with _engine.begin() as conn:
        conn.execute(
            text(
                """
                INSERT INTO content (id, url, source, saved_at, content_type, status, title, extracted_text, summary, metadata, topics)
                VALUES (gen_random_uuid(), :url, 'api', now(), 'blog', 'ready', :title, :extracted_text, :summary, '{}', :topics)
                """
            ),
            {
                "url": url,
                "title": title,
                "extracted_text": extracted_text,
                "summary": summary,
                "topics": topics or "[]",
            },
        )


def test_search_matches_title():
    _insert("https://example.com/a", title="Rust ownership explained")
    _insert("https://example.com/b", title="Cooking pasta")

    response = client.get("/content/search", params={"q": "ownership"})
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["title"] == "Rust ownership explained"


def test_search_matches_extracted_text():
    _insert("https://example.com/a", title="Untitled", extracted_text="deep dive into kubernetes networking")

    response = client.get("/content/search", params={"q": "kubernetes"})
    assert len(response.json()) == 1


def test_search_matches_topics():
    _insert("https://example.com/a", title="Piece", topics='["distributed-systems", "raft"]')

    response = client.get("/content/search", params={"q": "raft"})
    assert len(response.json()) == 1


def test_search_no_matches_returns_empty():
    _insert("https://example.com/a", title="Something else entirely")

    response = client.get("/content/search", params={"q": "nonexistentterm"})
    assert response.status_code == 200
    assert response.json() == []


def test_search_blank_query_returns_empty():
    _insert("https://example.com/a", title="Anything")

    response = client.get("/content/search", params={"q": ""})
    assert response.json() == []


def test_search_ranks_more_relevant_result_first():
    _insert("https://example.com/a", title="Just mentions python once", extracted_text="python")
    _insert(
        "https://example.com/b",
        title="Python python python everywhere",
        extracted_text="python python python python python",
    )

    response = client.get("/content/search", params={"q": "python"})
    body = response.json()
    assert len(body) == 2
    assert body[0]["url"] == "https://example.com/b"
