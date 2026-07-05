from __future__ import annotations

from yt_dlp import YoutubeDL

from ...domain.extraction import ExtractionResult


class YtDlpExtractor:
    def extract(self, url: str) -> ExtractionResult:
        opts = {"quiet": True, "no_warnings": True, "skip_download": True}
        with YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=False)

        return ExtractionResult(
            title=info.get("title"),
            description=info.get("description"),
            hero_image=info.get("thumbnail"),
            author=info.get("uploader") or info.get("channel"),
            duration=info.get("duration"),
        )
