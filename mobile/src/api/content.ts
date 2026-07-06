import { apiRequest } from "./client";

export type ContentType =
  | "blog"
  | "website"
  | "documentation"
  | "pdf"
  | "paper"
  | "youtube"
  | "github"
  | "book"
  | "tweet"
  | "reddit"
  | "other";

export type ContentStatus = "pending" | "processing" | "ready" | "failed";

export interface ContentItem {
  id: string;
  url: string;
  source: string;
  savedAt: string;
  contentType: ContentType;
  title: string | null;
  description: string | null;
  summary: string | null;
  heroImage: string | null;
  author: string | null;
  extractedText: string | null;
  readingTime: number | null;
  duration: number | null;
  metadata: Record<string, unknown>;
  topics: string[];
  status: ContentStatus;
  updatedAt: string | null;
  completedAt: string | null;
}

export interface CaptureContentResponse {
  id: string;
  url: string;
  contentType: ContentType;
  status: ContentStatus;
  savedAt: string;
}

export interface ListContentParams {
  limit?: number;
  offset?: number;
  status?: ContentStatus;
  contentType?: ContentType;
}

export function captureContent(url: string, contentType?: ContentType) {
  return apiRequest<CaptureContentResponse>("/content", {
    method: "POST",
    body: JSON.stringify({ url, contentType }),
  });
}

export function listContent(params: ListContentParams = {}) {
  const query = new URLSearchParams();
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.offset !== undefined) query.set("offset", String(params.offset));
  if (params.status) query.set("status", params.status);
  if (params.contentType) query.set("contentType", params.contentType);

  const queryString = query.toString();
  return apiRequest<ContentItem[]>(`/content${queryString ? `?${queryString}` : ""}`);
}

export function getContent(id: string) {
  return apiRequest<ContentItem>(`/content/${id}`);
}
