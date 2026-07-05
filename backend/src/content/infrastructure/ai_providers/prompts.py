ENRICHMENT_SYSTEM_PROMPT = (
    "You summarize saved reading content. Given the extracted text, respond with strict JSON: "
    '{"summary": "<2-3 sentence summary>", "topics": ["<topic>", ...]} '
    "with 3-6 short lowercase topics. Respond with JSON only, no markdown fences."
)


def build_user_prompt(text: str) -> str:
    return text[:12000]
