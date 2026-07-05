from __future__ import annotations

from ...domain.enums import ContentType
from ...domain.extraction import ContentExtractor, UnsupportedContentTypeError
from .firecrawl_extractor import FirecrawlExtractor
from .readability_extractor import ReadabilityExtractor, WebPageExtractor
from .yt_dlp_extractor import YtDlpExtractor

_web_extractor = WebPageExtractor(primary=ReadabilityExtractor(), fallback=FirecrawlExtractor())
_youtube_extractor = YtDlpExtractor()

EXTRACTOR_REGISTRY: dict[ContentType, ContentExtractor] = {
    ContentType.BLOG: _web_extractor,
    ContentType.WEBSITE: _web_extractor,
    ContentType.DOCUMENTATION: _web_extractor,
    ContentType.OTHER: _web_extractor,
    ContentType.YOUTUBE: _youtube_extractor,
}


def get_extractor(content_type: ContentType) -> ContentExtractor:
    extractor = EXTRACTOR_REGISTRY.get(content_type)
    if extractor is None:
        raise UnsupportedContentTypeError(f"No extractor registered for content type: {content_type.value}")
    return extractor
