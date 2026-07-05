import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from content.domain.content import Content
from content.domain.enums import ContentStatus, ContentType
from content.infrastructure.repository import SqlAlchemyContentRepository

DATABASE_URL = os.environ.get("DATABASE_URL")

pytestmark = pytest.mark.skipif(not DATABASE_URL, reason="DATABASE_URL not set")


@pytest.fixture
def session():
    engine = create_engine(DATABASE_URL)
    with Session(engine) as s:
        yield s


def _new_content():
    return Content(
        id=uuid4(),
        url="https://example.com/article",
        source="web",
        saved_at=datetime.now(timezone.utc),
        content_type=ContentType.BLOG,
    )


def test_round_trip_save_and_get_by_id(session):
    repo = SqlAlchemyContentRepository(session)
    content = _new_content()

    saved = repo.save(content)
    fetched = repo.get_by_id(content.id)

    assert fetched is not None
    assert fetched.id == saved.id
    assert fetched.url == saved.url
    assert fetched.source == saved.source
    assert fetched.content_type == saved.content_type
    assert fetched.status == ContentStatus.PENDING


def test_update_enrichment_leaves_capture_fields_untouched(session):
    repo = SqlAlchemyContentRepository(session)
    content = _new_content()
    repo.save(content)

    original_id, original_url, original_source, original_saved_at = (
        content.id,
        content.url,
        content.source,
        content.saved_at,
    )

    updated = repo.update_enrichment(
        content.id,
        summary="a generated summary",
        topics=["ai", "reading"],
        reading_time=5,
        status=ContentStatus.READY,
    )

    assert updated.id == original_id
    assert updated.url == original_url
    assert updated.source == original_source
    assert updated.saved_at == original_saved_at
    assert updated.summary == "a generated summary"
    assert updated.topics == ["ai", "reading"]
    assert updated.reading_time == 5
    assert updated.status == ContentStatus.READY


def test_update_enrichment_rejects_capture_fields(session):
    repo = SqlAlchemyContentRepository(session)
    content = _new_content()
    repo.save(content)

    with pytest.raises(ValueError):
        repo.update_enrichment(content.id, url="https://changed.example.com")
