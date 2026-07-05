import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch
from uuid import uuid4

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from content.domain.content import Content
from content.domain.enums import ContentStatus, ContentType
from content.domain.extraction import ExtractionResult, UnsupportedContentTypeError
from content.domain.reading_time import compute_reading_time
from content.infrastructure.repository import SqlAlchemyContentRepository
from content import worker

DATABASE_URL = os.environ.get("DATABASE_URL")
pytestmark = pytest.mark.skipif(not DATABASE_URL, reason="DATABASE_URL not set")


@pytest.fixture
def repository():
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield SqlAlchemyContentRepository(session)
    session.execute(text("DELETE FROM content"))
    session.commit()
    session.close()


def _pending_content(content_type: ContentType) -> Content:
    return Content(
        id=uuid4(),
        url="https://example.com/article",
        source="api",
        saved_at=datetime.now(timezone.utc),
        content_type=content_type,
    )


def test_web_page_content_reaches_ready(repository):
    content = repository.save(_pending_content(ContentType.BLOG))

    fake_result = ExtractionResult(
        title="A Title", description="A description", extracted_text="word " * 300
    )
    with patch("content.worker.get_extractor") as mock_get_extractor:
        mock_get_extractor.return_value.extract.return_value = fake_result
        worker.process_batch(repository)

    updated = repository.get_by_id(content.id)
    assert updated.status == ContentStatus.READY
    assert updated.title == "A Title"
    assert updated.description == "A description"
    assert updated.extracted_text == fake_result.extracted_text


def test_youtube_content_reaches_ready_with_duration(repository):
    content = repository.save(_pending_content(ContentType.YOUTUBE))

    fake_result = ExtractionResult(title="A Video", duration=600)
    with patch("content.worker.get_extractor") as mock_get_extractor:
        mock_get_extractor.return_value.extract.return_value = fake_result
        worker.process_batch(repository)

    updated = repository.get_by_id(content.id)
    assert updated.status == ContentStatus.READY
    assert updated.duration == 600


def test_reading_time_computed_from_word_count(repository):
    content = repository.save(_pending_content(ContentType.BLOG))

    text_body = "word " * 400
    fake_result = ExtractionResult(title="T", extracted_text=text_body)
    with patch("content.worker.get_extractor") as mock_get_extractor:
        mock_get_extractor.return_value.extract.return_value = fake_result
        worker.process_batch(repository)

    updated = repository.get_by_id(content.id)
    assert updated.reading_time == compute_reading_time(text_body)


def test_unsupported_content_type_becomes_failed(repository):
    content = repository.save(_pending_content(ContentType.PDF))

    with patch("content.worker.get_extractor", side_effect=UnsupportedContentTypeError("no extractor")):
        worker.process_batch(repository)

    updated = repository.get_by_id(content.id)
    assert updated.status == ContentStatus.FAILED
    assert "processingError" in updated.metadata


def test_extractor_exception_fails_row_and_continues(repository):
    bad = repository.save(_pending_content(ContentType.BLOG))
    good = repository.save(_pending_content(ContentType.BLOG))

    call_count = {"n": 0}

    def fake_get_extractor(content_type):
        call_count["n"] += 1
        mock_extractor = type("M", (), {})()
        if call_count["n"] == 1:
            def raise_err(url):
                raise RuntimeError("boom")
            mock_extractor.extract = raise_err
        else:
            mock_extractor.extract = lambda url: ExtractionResult(title="ok", extracted_text="word " * 50)
        return mock_extractor

    with patch("content.worker.get_extractor", side_effect=fake_get_extractor):
        worker.process_batch(repository)

    bad_updated = repository.get_by_id(bad.id)
    good_updated = repository.get_by_id(good.id)
    assert bad_updated.status == ContentStatus.FAILED
    assert good_updated.status == ContentStatus.READY


def test_ready_content_has_no_summary_or_topics(repository):
    content = repository.save(_pending_content(ContentType.BLOG))

    fake_result = ExtractionResult(title="T", extracted_text="word " * 50)
    with patch("content.worker.get_extractor") as mock_get_extractor:
        mock_get_extractor.return_value.extract.return_value = fake_result
        worker.process_batch(repository)

    updated = repository.get_by_id(content.id)
    assert updated.summary is None
    assert updated.topics == []
