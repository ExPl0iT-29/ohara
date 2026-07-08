import type { ExtractionResult } from "./extractArticle";

interface OEmbedResponse {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
}

export async function extractYoutube(url: string): Promise<ExtractionResult> {
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const response = await fetch(oembedUrl);
  if (!response.ok) throw new Error(`YouTube oEmbed failed: ${response.status}`);
  const data: OEmbedResponse = await response.json();

  return {
    title: data.title ?? null,
    description: null,
    heroImage: data.thumbnail_url ?? null,
    author: data.author_name ?? null,
    // ponytail: no yt-dlp on-device — duration/transcript unavailable, oEmbed only gives metadata
    extractedText: null,
    duration: null,
  };
}
