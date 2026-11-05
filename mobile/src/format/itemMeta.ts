import type { ContentItem } from "../api/content";
import { CONTENT_TYPE_LABELS } from "../constants/contentTypeLabels";

/** "www.example.com/a/b" -> "example.com". Regex, because React Native's URL lacks hostname. */
export function sourceLabel(url: string): string {
  const match = url.match(/^[a-z][a-z0-9+.-]*:\/\/([^/?#:]+)/i);
  return (match?.[1] ?? url).replace(/^www\./i, "");
}

/** Minutes to show for an item: reading time for text, duration for video. */
export function minutesLabel(item: Pick<ContentItem, "readingTime" | "duration">): string | null {
  if (item.readingTime) return `${item.readingTime} min`;
  if (item.duration) return `${Math.max(1, Math.round(item.duration / 60))} min`;
  return null;
}

/** Source, length and type, for a one-line caption under a title. */
export function metaLine(item: ContentItem): string {
  return [sourceLabel(item.url), minutesLabel(item), CONTENT_TYPE_LABELS[item.contentType]]
    .filter(Boolean)
    .join(" · ");
}

/** True for items opened but not finished, which the feed lists under "Continue reading". */
export function isInProgress(item: Pick<ContentItem, "scrollProgress" | "archivedAt">): boolean {
  const progress = item.scrollProgress ?? 0;
  return !item.archivedAt && progress > 0.02 && progress < 0.97;
}
