import { parse } from "node-html-parser";

export interface ExtractionResult {
  title: string | null;
  description: string | null;
  heroImage: string | null;
  author: string | null;
  extractedText: string | null;
  duration: number | null;
}

const CONTENT_TAGS = ["h1", "h2", "h3", "p", "img", "blockquote", "ul", "ol"];

function meta(root: ReturnType<typeof parse>, ...names: string[]): string | null {
  for (const name of names) {
    const el =
      root.querySelector(`meta[property="${name}"]`) ?? root.querySelector(`meta[name="${name}"]`);
    const content = el?.getAttribute("content");
    if (content) return content;
  }
  return null;
}

export async function extractArticle(url: string): Promise<ExtractionResult> {
  const response = await fetch(url, { headers: { "User-Agent": "Ohara/1.0" } });
  const html = await response.text();
  const root = parse(html, { blockTextElements: { script: false, style: false } });

  const title = meta(root, "og:title") ?? root.querySelector("title")?.text?.trim() ?? null;
  const description = meta(root, "og:description", "description");
  const heroImage = meta(root, "og:image");
  const author = meta(root, "author", "article:author");

  const article = root.querySelector("article") ?? root.querySelector("main") ?? root.querySelector("body");
  const parts: string[] = [];
  if (article) {
    for (const tag of article.querySelectorAll(CONTENT_TAGS.join(","))) {
      if (tag.tagName?.toLowerCase() === "img") {
        const src = tag.getAttribute("src");
        if (src) parts.push(`<img src="${src}" />`);
        continue;
      }
      const text = tag.text?.trim();
      if (text) parts.push(`<${tag.tagName.toLowerCase()}>${text}</${tag.tagName.toLowerCase()}>`);
    }
  }

  return {
    title,
    description,
    heroImage,
    author,
    extractedText: parts.length ? parts.join("\n") : null,
    duration: null,
  };
}
