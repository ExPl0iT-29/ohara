_WORDS_PER_MINUTE = 200


def compute_reading_time(text: str) -> int:
    word_count = len(text.split())
    return max(1, round(word_count / _WORDS_PER_MINUTE))
