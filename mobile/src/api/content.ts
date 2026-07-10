import {
  getAllContentRows,
  getAllTagsAndTopics,
  getContentRow,
  insertContent,
  listContentRows,
  updateContentRow,
} from "../db/contentRepository";
import { processContent } from "../processing/processContent";

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
  tags: string[];
  status: ContentStatus;
  updatedAt: string | null;
  completedAt: string | null;
  archivedAt: string | null;
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
  archived?: boolean;
  search?: string;
  tagOrTopic?: string;
}

export async function captureContent(
  url: string,
  contentType: ContentType = "other",
): Promise<CaptureContentResponse> {
  const item = insertContent(url, contentType);
  // ponytail: fire-and-forget in-app processing, no separate worker process needed for a single device
  void processContent(item.id);
  return { id: item.id, url: item.url, contentType: item.contentType, status: item.status, savedAt: item.savedAt };
}

export async function listContent(params: ListContentParams = {}): Promise<ContentItem[]> {
  return listContentRows(params);
}

export async function getContent(id: string): Promise<ContentItem> {
  const item = getContentRow(id);
  if (!item) throw new Error("Content not found");
  return item;
}

export function getAllContent(): ContentItem[] {
  return getAllContentRows();
}

export function archiveContent(id: string): void {
  updateContentRow(id, { archivedAt: new Date().toISOString() });
}

export function unarchiveContent(id: string): void {
  updateContentRow(id, { archivedAt: null });
}

export function addTag(id: string, tag: string): void {
  const item = getContentRow(id);
  if (!item || item.tags.includes(tag)) return;
  updateContentRow(id, { tags: [...item.tags, tag] });
}

export function removeTag(id: string, tag: string): void {
  const item = getContentRow(id);
  if (!item) return;
  updateContentRow(id, { tags: item.tags.filter((t) => t !== tag) });
}

export function getAllTagsAndTopicsList(): string[] {
  return getAllTagsAndTopics();
}
