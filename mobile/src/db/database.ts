import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("ohara.db");

db.execSync(`
  CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY NOT NULL,
    url TEXT NOT NULL,
    source TEXT NOT NULL,
    savedAt TEXT NOT NULL,
    contentType TEXT NOT NULL,
    title TEXT,
    description TEXT,
    summary TEXT,
    heroImage TEXT,
    author TEXT,
    extractedText TEXT,
    readingTime INTEGER,
    duration INTEGER,
    metadata TEXT NOT NULL DEFAULT '{}',
    topics TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL,
    updatedAt TEXT,
    completedAt TEXT
  );
`);

const hasArchivedAt = db
  .getAllSync<{ name: string }>("PRAGMA table_info(content);")
  .some((column) => column.name === "archivedAt");

if (!hasArchivedAt) {
  db.execSync("ALTER TABLE content ADD COLUMN archivedAt TEXT;");
}
