import { enrichContent } from "../ai/enrich";
import { extractArticle } from "../extraction/extractArticle";
import { extractGoogleDoc, matchGoogleDocId } from "../extraction/extractGoogleDoc";
import { extractYoutube } from "../extraction/extractYoutube";
import { computeReadingTime } from "../extraction/readingTime";
import { getContentRow, updateContentRow } from "../db/contentRepository";
import type { ContentType } from "../api/content";

function getExtractor(url: string, contentType: ContentType) {
  if (matchGoogleDocId(url)) return extractGoogleDoc;
  return contentType === "youtube" ? extractYoutube : extractArticle;
}

export async function processContent(id: string): Promise<void> {
  const item = getContentRow(id);
  if (!item) return;

  updateContentRow(id, { status: "processing" });

  try {
    const extractor = getExtractor(item.url, item.contentType);
    const result = await extractor(item.url);

    updateContentRow(id, {
      title: result.title,
      description: result.description,
      heroImage: result.heroImage,
      author: result.author,
      extractedText: result.extractedText,
      duration: result.duration,
      readingTime: result.extractedText ? computeReadingTime(result.extractedText) : null,
      status: "ready",
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    updateContentRow(id, {
      status: "failed",
      metadata: { processingError: error instanceof Error ? error.message : String(error) },
    });
    return;
  }

  const refreshed = getContentRow(id);
  if (refreshed?.extractedText) {
    const enrichment = await enrichContent(refreshed.extractedText);
    if (enrichment) {
      updateContentRow(id, { summary: enrichment.summary, topics: enrichment.topics });
    }
  }
}

export async function reprocessStuckContent(): Promise<void> {
  const { getAllContentRows } = await import("../db/contentRepository");
  const stuck = getAllContentRows().filter((item) => item.status === "pending" || item.status === "processing");
  for (const item of stuck) {
    await processContent(item.id);
  }
}
