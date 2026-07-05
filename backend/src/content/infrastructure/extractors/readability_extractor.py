from __future__ import annotations

import re

import requests
from readability import Document

from ...domain.extraction import ContentExtractor, ExtractionResult

_MIN_TEXT_LENGTH = 200
_TAG_RE = re.compile(r"<[^>]+>")


class ReadabilityExtractor:
    """Fetches HTML directly and parses it with Readability. No JS rendering."""

    def __init__(self, timeout: int = 15):
        self._timeout = timeout

    def extract(self, url: str) -> ExtractionResult:
        response = requests.get(url, timeout=self._timeout, headers={"User-Agent": "Ohara/1.0"})
        response.raise_for_status()

        doc = Document(response.text)
        title = doc.short_title() or None
        summary_html = doc.summary()
        extracted_text = _TAG_RE.sub(" ", summary_html)
        extracted_text = re.sub(r"\s+", " ", extracted_text).strip() or None

        return ExtractionResult(
            title=title,
            extracted_text=extracted_text,
        )


class WebPageExtractor:
    """Tries Readability first; falls back to Firecrawl only for thin results."""

    def __init__(self, primary: ContentExtractor, fallback: ContentExtractor):
        self._primary = primary
        self._fallback = fallback

    def extract(self, url: str) -> ExtractionResult:
        result = self._primary.extract(url)
        if self._is_thin(result):
            try:
                return self._fallback.extract(url)
            except Exception:
                return result
        return result

    def _is_thin(self, result: ExtractionResult) -> bool:
        return not result.extracted_text or len(result.extracted_text) < _MIN_TEXT_LENGTH
