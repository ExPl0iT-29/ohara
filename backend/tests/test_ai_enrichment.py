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

from content.domain.ai_provider import EnrichmentResult
from content.domain.content import Content
from content.domain.enums import ContentStatus, ContentType
from content.infrastructure.ai_providers.gemini_provider import GeminiProvider
from content.infrastructure.ai_providers.openai_provider import OpenAIProvider
from content.infrastructure.ai_providers.selector import get_active_provider
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


def _ready_content(extracted_text: str | None = "word " * 50) -> Content:
    content = Content(
        id=uuid4(),
        url="https://example.com/article",
        source="api",
        saved_at=datetime.now(timezone.utc),
        content_type=ContentType.BLOG,
    )
    content.title = "A Title"
    content.extracted_text = extracted_text
    content.status = ContentStatus.READY
    return content


def test_ready_content_gets_enriched(repository):
    content = repository.save(_ready_content())

    fake_result = EnrichmentResult(summary="a summary", topics=["ai", "reading"])
    with patch("content.worker.get_active_provider") as mock_get_provider:
        mock_get_provider.return_value.enrich.return_value = fake_result
        worker.enrich_ready_content(repository)

    updated = repository.get_by_id(content.id)
    assert updated.summary == "a summary"
    assert updated.topics == ["ai", "reading"]
    assert updated.status == ContentStatus.READY


def test_provider_error_leaves_content_unchanged(repository):
    content = repository.save(_ready_content())

    with patch("content.worker.get_active_provider") as mock_get_provider:
        mock_get_provider.return_value.enrich.side_effect = RuntimeError("boom")
        worker.enrich_ready_content(repository)

    updated = repository.get_by_id(content.id)
    assert updated.status == ContentStatus.READY
    assert updated.summary is None
    assert updated.topics == []
    assert updated.title == "A Title"
    assert updated.extracted_text == content.extracted_text


def test_get_active_provider_selects_openai(monkeypatch):
    monkeypatch.setenv("AI_PROVIDER", "openai")
    monkeypatch.setenv("OPENAI_API_KEY", "fake-key")
    provider = get_active_provider()
    assert isinstance(provider, OpenAIProvider)


def test_get_active_provider_selects_gemini(monkeypatch):
    monkeypatch.setenv("AI_PROVIDER", "gemini")
    monkeypatch.setenv("GEMINI_API_KEY", "fake-key")
    provider = get_active_provider()
    assert isinstance(provider, GeminiProvider)


def test_enrichment_does_not_modify_extraction_fields(repository):
    content = repository.save(_ready_content())
    original_title = content.title
    original_text = content.extracted_text

    fake_result = EnrichmentResult(summary="a summary", topics=["x"])
    with patch("content.worker.get_active_provider") as mock_get_provider:
        mock_get_provider.return_value.enrich.return_value = fake_result
        worker.enrich_ready_content(repository)

    updated = repository.get_by_id(content.id)
    assert updated.title == original_title
    assert updated.extracted_text == original_text
    assert updated.author is None
    assert updated.hero_image is None
    assert updated.duration is None
    assert updated.reading_time is None
