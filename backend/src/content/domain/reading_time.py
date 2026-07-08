import re

_WORDS_PER_MINUTE = 200
_TAG_RE = re.compile(r"<[^>]+>")


def compute_reading_time(text: str) -> int:
    word_count = len(_TAG_RE.sub(" ", text).split())
    return max(1, round(word_count / _WORDS_PER_MINUTE))
