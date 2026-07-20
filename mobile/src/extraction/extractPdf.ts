import * as FileSystem from "expo-file-system/legacy";
import type { ExtractionResult } from "./extractArticle";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.js";

const MAX_PAGES = 200;

function filenameFromUrl(url: string): string | null {
  const last = url.split("?")[0].split("/").filter(Boolean).pop();
  return last ? decodeURIComponent(last) : null;
}

export async function extractPdf(url: string): Promise<ExtractionResult> {
  const cachePath = `${FileSystem.cacheDirectory}pdf-${Date.now()}.pdf`;

  try {
    const download = await FileSystem.downloadAsync(url, cachePath);
    if (download.status !== 200) {
      throw new Error(`Failed to download PDF (status ${download.status})`);
    }

    const base64 = await FileSystem.readAsStringAsync(cachePath, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const data = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    let doc;
    try {
      doc = await getDocument({ data, isEvalSupported: false }).promise;
    } catch {
      throw new Error("PDF is corrupted or could not be parsed");
    }

    const info = (await doc.getMetadata().catch(() => null))?.info as
      | { Title?: string; Author?: string }
      | undefined;

    const pageCount = Math.min(doc.numPages, MAX_PAGES);
    const pageTexts: string[] = [];
    for (let i = 1; i <= pageCount; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      pageTexts.push(
        content.items.map((item) => ("str" in item ? item.str : "")).join(" ")
      );
    }
    const extractedText = pageTexts.join("\n\n").trim();

    if (!extractedText) {
      throw new Error("PDF has no extractable text (likely scanned/image-only)");
    }

    const firstLine = extractedText.split("\n").map((line) => line.trim()).find(Boolean) ?? null;
    const title = info?.Title?.trim() || firstLine || filenameFromUrl(url);

    return {
      title,
      description: null,
      heroImage: null,
      author: info?.Author?.trim() || null,
      extractedText,
      duration: null,
    };
  } finally {
    await FileSystem.deleteAsync(cachePath, { idempotent: true });
  }
}
