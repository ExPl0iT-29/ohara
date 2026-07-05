from __future__ import annotations

import os

import requests

from ...domain.extraction import ExtractionResult


class FirecrawlExtractor:
    _API_URL = "https://api.firecrawl.dev/v1/scrape"

    def __init__(self, api_key: str | None = None, timeout: int = 30):
        self._api_key = api_key or os.environ.get("FIRECRAWL_API_KEY")
        self._timeout = timeout

    def extract(self, url: str) -> ExtractionResult:
        if not self._api_key:
            raise RuntimeError("FIRECRAWL_API_KEY not configured")

        response = requests.post(
            self._API_URL,
            json={"url": url, "formats": ["markdown"]},
            headers={"Authorization": f"Bearer {self._api_key}"},
            timeout=self._timeout,
        )
        response.raise_for_status()
        data = response.json().get("data", {})
        metadata = data.get("metadata", {})

        return ExtractionResult(
            title=metadata.get("title"),
            description=metadata.get("description"),
            hero_image=metadata.get("ogImage"),
            author=metadata.get("author"),
            extracted_text=data.get("markdown"),
        )
