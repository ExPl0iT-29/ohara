const WORDS_PER_MINUTE = 200;

export function computeReadingTime(text: string): number {
  const wordCount = text.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
