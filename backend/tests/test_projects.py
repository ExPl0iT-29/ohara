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
        conn.execute(text("DELETE FROM content_project"))
        conn.execute(text("DELETE FROM project"))
        conn.execute(text("DELETE FROM content"))


def _create_project(name="Research"):
    return client.post("/projects", json={"name": name}).json()


def _capture(url="https://example.com/post"):
    return client.post("/content", json={"url": url}).json()


def test_create_project():
    response = client.post("/projects", json={"name": "Research"})
    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "Research"
    assert "id" in body
    assert "createdAt" in body


def test_list_projects():
    _create_project("A")
    _create_project("B")
    response = client.get("/projects")
    assert response.status_code == 200
    names = {p["name"] for p in response.json()}
    assert names == {"A", "B"}


def test_delete_project_leaves_content_untouched():
    project = _create_project()
    content = _capture()
    client.post(f"/projects/{project['id']}/content/{content['id']}")

    response = client.delete(f"/projects/{project['id']}")
    assert response.status_code == 204

    content_response = client.get(f"/content/{content['id']}")
    assert content_response.status_code == 200

    projects_response = client.get("/projects")
    assert projects_response.json() == []


def test_associate_content_appears_in_project_list():
    project = _create_project()
    content = _capture()

    response = client.post(f"/projects/{project['id']}/content/{content['id']}")
    assert response.status_code == 204

    listed = client.get(f"/projects/{project['id']}/content").json()
    assert len(listed) == 1
    assert listed[0]["id"] == content["id"]


def test_content_can_belong_to_multiple_projects():
    project_a = _create_project("A")
    project_b = _create_project("B")
    content = _capture()

    client.post(f"/projects/{project_a['id']}/content/{content['id']}")
    client.post(f"/projects/{project_b['id']}/content/{content['id']}")

    assert len(client.get(f"/projects/{project_a['id']}/content").json()) == 1
    assert len(client.get(f"/projects/{project_b['id']}/content").json()) == 1


def test_remove_association_does_not_delete_content():
    project = _create_project()
    content = _capture()
    client.post(f"/projects/{project['id']}/content/{content['id']}")

    response = client.delete(f"/projects/{project['id']}/content/{content['id']}")
    assert response.status_code == 204

    listed = client.get(f"/projects/{project['id']}/content").json()
    assert listed == []

    content_response = client.get(f"/content/{content['id']}")
    assert content_response.status_code == 200
