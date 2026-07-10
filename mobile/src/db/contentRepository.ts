import * as Crypto from "expo-crypto";

import type { ContentItem, ContentStatus, ContentType, ListContentParams } from "../api/content";
import { db } from "./database";

interface ContentRow {
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
  metadata: string;
  topics: string;
  tags: string;
  status: ContentStatus;
  updatedAt: string | null;
  completedAt: string | null;
  archivedAt: string | null;
  scrollProgress: number | null;
  highlights: string;
}

function rowToItem(row: ContentRow): ContentItem {
  return {
    ...row,
    metadata: JSON.parse(row.metadata),
    topics: JSON.parse(row.topics),
    tags: JSON.parse(row.tags),
    highlights: JSON.parse(row.highlights),
  };
}

export function insertContent(url: string, contentType: ContentType): ContentItem {
  const id = Crypto.randomUUID();
  const savedAt = new Date().toISOString();
  db.runSync(
    `INSERT INTO content (id, url, source, savedAt, contentType, status) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, url, "mobile", savedAt, contentType, "pending"],
  );
  return rowToItem({
    id,
    url,
    source: "mobile",
    savedAt,
    contentType,
    title: null,
    description: null,
    summary: null,
    heroImage: null,
    author: null,
    extractedText: null,
    readingTime: null,
    duration: null,
    metadata: "{}",
    topics: "[]",
    tags: "[]",
    status: "pending",
    updatedAt: null,
    completedAt: null,
    archivedAt: null,
    scrollProgress: null,
    highlights: "[]",
  });
}

export function listContentRows(params: ListContentParams = {}): ContentItem[] {
  const { limit = 20, offset = 0, status, contentType, archived = false, search, tagOrTopic } = params;
  const clauses: string[] = [];
  const args: (string | number)[] = [];
  if (status) {
    clauses.push("status = ?");
    args.push(status);
  }
  if (contentType) {
    clauses.push("contentType = ?");
    args.push(contentType);
  }
  clauses.push(archived ? "archivedAt IS NOT NULL" : "archivedAt IS NULL");
  if (search) {
    clauses.push("(title LIKE ? OR summary LIKE ? OR extractedText LIKE ?)");
    const needle = `%${search}%`;
    args.push(needle, needle, needle);
  }
  if (tagOrTopic) {
    clauses.push("(tags LIKE ? OR topics LIKE ?)");
    const needle = `%"${tagOrTopic}"%`;
    args.push(needle, needle);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = db.getAllSync<ContentRow>(
    `SELECT * FROM content ${where} ORDER BY savedAt DESC LIMIT ? OFFSET ?`,
    [...args, limit, offset],
  );
  return rows.map(rowToItem);
}

export function getContentRow(id: string): ContentItem | null {
  const row = db.getFirstSync<ContentRow>(`SELECT * FROM content WHERE id = ?`, [id]);
  return row ? rowToItem(row) : null;
}

export function getAllContentRows(): ContentItem[] {
  return db.getAllSync<ContentRow>(`SELECT * FROM content ORDER BY savedAt DESC`).map(rowToItem);
}

export function getAllTagsAndTopics(): string[] {
  const rows = db.getAllSync<{ tags: string; topics: string }>(
    `SELECT tags, topics FROM content WHERE archivedAt IS NULL`,
  );
  const values = new Set<string>();
  for (const row of rows) {
    for (const value of JSON.parse(row.tags) as string[]) values.add(value);
    for (const value of JSON.parse(row.topics) as string[]) values.add(value);
  }
  return [...values].sort();
}

export function getPresentContentTypes(): ContentType[] {
  const rows = db.getAllSync<{ contentType: ContentType }>(
    `SELECT DISTINCT contentType FROM content WHERE archivedAt IS NULL ORDER BY contentType`,
  );
  return rows.map((row) => row.contentType);
}

export function findContentRowByUrl(url: string): ContentItem | null {
  const row = db.getFirstSync<ContentRow>(`SELECT * FROM content WHERE url = ?`, [url]);
  return row ? rowToItem(row) : null;
}

export interface LibraryStats {
  total: number;
  byStatus: Record<string, number>;
  byContentType: Record<string, number>;
  oldestUnread: { id: string; title: string | null; url: string; savedAt: string } | null;
}

export function getLibraryStats(): LibraryStats {
  const total = db.getFirstSync<{ count: number }>(`SELECT COUNT(*) as count FROM content`)?.count ?? 0;
  const statusRows = db.getAllSync<{ status: string; count: number }>(
    `SELECT status, COUNT(*) as count FROM content GROUP BY status`,
  );
  const typeRows = db.getAllSync<{ contentType: string; count: number }>(
    `SELECT contentType, COUNT(*) as count FROM content GROUP BY contentType`,
  );
  const oldestUnread = db.getFirstSync<{ id: string; title: string | null; url: string; savedAt: string }>(
    `SELECT id, title, url, savedAt FROM content WHERE archivedAt IS NULL AND status != 'ready' ORDER BY savedAt ASC LIMIT 1`,
  );
  return {
    total,
    byStatus: Object.fromEntries(statusRows.map((r) => [r.status, r.count])),
    byContentType: Object.fromEntries(typeRows.map((r) => [r.contentType, r.count])),
    oldestUnread: oldestUnread ?? null,
  };
}

export function updateContentRow(id: string, fields: Partial<ContentItem>): void {
  const keys = Object.keys(fields) as (keyof ContentItem)[];
  if (keys.length === 0) return;

  const assignments = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => {
    const value = fields[key];
    if (key === "metadata" || key === "topics" || key === "tags" || key === "highlights") return JSON.stringify(value);
    return value as string | number | null;
  });

  db.runSync(`UPDATE content SET ${assignments}, updatedAt = ? WHERE id = ?`, [
    ...values,
    new Date().toISOString(),
    id,
  ]);
}

export function upsertContentRow(item: ContentItem): void {
  db.runSync(
    `INSERT INTO content (id, url, source, savedAt, contentType, title, description, summary, heroImage, author, extractedText, readingTime, duration, metadata, topics, tags, status, updatedAt, completedAt, archivedAt, scrollProgress, highlights)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       url=excluded.url, source=excluded.source, savedAt=excluded.savedAt, contentType=excluded.contentType,
       title=excluded.title, description=excluded.description, summary=excluded.summary, heroImage=excluded.heroImage,
       author=excluded.author, extractedText=excluded.extractedText, readingTime=excluded.readingTime,
       duration=excluded.duration, metadata=excluded.metadata, topics=excluded.topics, tags=excluded.tags, status=excluded.status,
       updatedAt=excluded.updatedAt, completedAt=excluded.completedAt, archivedAt=excluded.archivedAt,
       scrollProgress=excluded.scrollProgress, highlights=excluded.highlights`,
    [
      item.id,
      item.url,
      item.source,
      item.savedAt,
      item.contentType,
      item.title,
      item.description,
      item.summary,
      item.heroImage,
      item.author,
      item.extractedText,
      item.readingTime,
      item.duration,
      JSON.stringify(item.metadata),
      JSON.stringify(item.topics),
      JSON.stringify(item.tags),
      item.status,
      item.updatedAt,
      item.completedAt,
      item.archivedAt,
      item.scrollProgress,
      JSON.stringify(item.highlights),
    ],
  );
}
