import sys
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from content.domain.content import Content
from content.domain.enums import ContentStatus, ContentType


def _base_kwargs():
    return dict(
        id=uuid4(),
        url="https://example.com/post",
        source="web",
        saved_at=datetime.now(timezone.utc),
        content_type=ContentType.BLOG,
    )


def test_valid_content_type_accepted():
    content = Content(**_base_kwargs())
    assert content.content_type == ContentType.BLOG
    assert content.status == ContentStatus.PENDING


def test_invalid_content_type_rejected():
    kwargs = _base_kwargs()
    kwargs["content_type"] = "not-a-real-type"
    with pytest.raises(ValueError):
        Content(**kwargs)


def test_enrichment_fields_updatable_without_touching_capture_fields():
    content = Content(**_base_kwargs())
    original_id, original_url, original_source, original_saved_at = (
        content.id,
        content.url,
        content.source,
        content.saved_at,
    )

    content.summary = "a summary"
    content.topics = ["ai", "reading"]
    content.reading_time = 5
    content.status = ContentStatus.READY

    assert content.id == original_id
    assert content.url == original_url
    assert content.source == original_source
    assert content.saved_at == original_saved_at
    assert content.summary == "a summary"
    assert content.status == ContentStatus.READY
