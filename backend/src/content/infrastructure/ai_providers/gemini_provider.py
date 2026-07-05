from __future__ import annotations

import json
import os
import re

from google import genai
from google.genai import types

from ...domain.ai_provider import EnrichmentResult
from .prompts import ENRICHMENT_SYSTEM_PROMPT, build_user_prompt

_FENCE_RE = re.compile(r"^```(?:json)?\s*|\s*```$", re.MULTILINE)


class GeminiProvider:
    def __init__(self, api_key: str | None = None, model: str = "gemini-1.5-flash"):
        self._client = genai.Client(api_key=api_key or os.environ["GEMINI_API_KEY"])
        self._model = model

    def enrich(self, text: str) -> EnrichmentResult:
        response = self._client.models.generate_content(
            model=self._model,
            contents=build_user_prompt(text),
            config=types.GenerateContentConfig(system_instruction=ENRICHMENT_SYSTEM_PROMPT),
        )
        raw = _FENCE_RE.sub("", response.text).strip()
        data = json.loads(raw)
        return EnrichmentResult(summary=data["summary"], topics=data["topics"])
