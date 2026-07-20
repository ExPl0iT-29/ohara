import type { ExtractionResult } from "./extractArticle";

const DOC_ID_PATTERN = /^https:\/\/docs\.google\.com\/document\/d\/([^/]+)/;

export function matchGoogleDocId(url: string): string | null {
  return url.match(DOC_ID_PATTERN)?.[1] ?? null;
}

function looksLikeSignInPage(text: string): boolean {
  return text.includes("<html") || text.includes("accounts.google.com");
}

export async function extractGoogleDoc(url: string): Promise<ExtractionResult> {
  const docId = matchGoogleDocId(url);
  if (!docId) throw new Error("Not a Google Docs document URL");

  const response = await fetch(`https://docs.google.com/document/d/${docId}/export?format=txt`);
  const text = await response.text();

  if (!response.ok || looksLikeSignInPage(text)) {
    throw new Error("Google Doc is not publicly viewable");
  }

  const title = text.split("\n").map((line) => line.trim()).find(Boolean) ?? null;

  return {
    title,
    description: null,
    heroImage: null,
    author: null,
    extractedText: text,
    duration: null,
  };
}
