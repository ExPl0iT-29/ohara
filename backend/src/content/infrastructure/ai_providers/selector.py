from __future__ import annotations

import logging
import os

from ...domain.ai_provider import AIProvider
from .gemini_provider import GeminiProvider
from .openai_provider import OpenAIProvider

log = logging.getLogger(__name__)

_KEY_ENV_VARS = {"openai": "OPENAI_API_KEY", "gemini": "GEMINI_API_KEY"}


def get_active_provider() -> AIProvider | None:
    provider_name = os.environ.get("AI_PROVIDER", "openai").lower()
    key_env_var = _KEY_ENV_VARS.get(provider_name)

    if key_env_var is None:
        log.warning("Unknown AI_PROVIDER '%s', enrichment disabled", provider_name)
        return None
    if not os.environ.get(key_env_var):
        log.warning("%s not set, enrichment disabled", key_env_var)
        return None

    if provider_name == "openai":
        return OpenAIProvider()
    return GeminiProvider()
