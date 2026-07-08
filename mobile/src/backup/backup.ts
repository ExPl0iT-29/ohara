import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { getAllContent } from "../api/content";
import { insertContent, upsertContentRow } from "../db/contentRepository";
import { processContent } from "../processing/processContent";
import type { ContentType } from "../api/content";

const BACKUP_FILE = `${FileSystem.cacheDirectory}ohara-backup.json`;

export async function exportBackup(): Promise<void> {
  const items = getAllContent();
  await FileSystem.writeAsStringAsync(BACKUP_FILE, JSON.stringify(items, null, 2));
  await Sharing.shareAsync(BACKUP_FILE, { mimeType: "application/json" });
}

interface PcLinkEntry {
  url: string;
  contentType?: ContentType;
}

function isFullBackup(entries: unknown[]): entries is Array<Record<string, unknown>> {
  return entries.length > 0 && typeof entries[0] === "object" && entries[0] !== null && "status" in (entries[0] as object);
}

export async function importBackup(): Promise<{ imported: number }> {
  const picked = await DocumentPicker.getDocumentAsync({ type: "application/json" });
  if (picked.canceled) return { imported: 0 };

  const raw = await FileSystem.readAsStringAsync(picked.assets[0].uri);
  const entries: unknown[] = JSON.parse(raw);
  if (!Array.isArray(entries)) throw new Error("Backup file must be a JSON array");

  if (isFullBackup(entries)) {
    // Full Ohara backup export — upsert as-is, already processed
    for (const entry of entries) upsertContentRow(entry as never);
    return { imported: entries.length };
  }

  // PC-added links — plain {url, contentType?} entries, insert as pending and process
  for (const entry of entries as PcLinkEntry[]) {
    const item = insertContent(entry.url, entry.contentType ?? "other");
    void processContent(item.id);
  }
  return { imported: entries.length };
}
