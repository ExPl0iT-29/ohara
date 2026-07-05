from __future__ import annotations

import json
import os

from openai import OpenAI

from ...domain.ai_provider import EnrichmentResult
from .prompts import ENRICHMENT_SYSTEM_PROMPT, build_user_prompt


class OpenAIProvider:
    def __init__(self, api_key: str | None = None, model: str = "gpt-4o-mini"):
        self._client = OpenAI(api_key=api_key or os.environ["OPENAI_API_KEY"])
        self._model = model

    def enrich(self, text: str) -> EnrichmentResult:
        response = self._client.chat.completions.create(
            model=self._model,
            messages=[
                {"role": "system", "content": ENRICHMENT_SYSTEM_PROMPT},
                {"role": "user", "content": build_user_prompt(text)},
            ],
            response_format={"type": "json_object"},
        )
        data = json.loads(response.choices[0].message.content)
        return EnrichmentResult(summary=data["summary"], topics=data["topics"])
