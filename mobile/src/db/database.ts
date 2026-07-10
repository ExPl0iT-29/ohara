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

const columns = db.getAllSync<{ name: string }>("PRAGMA table_info(content);").map((c) => c.name);

if (!columns.includes("archivedAt")) {
  db.execSync("ALTER TABLE content ADD COLUMN archivedAt TEXT;");
}
if (!columns.includes("tags")) {
  db.execSync("ALTER TABLE content ADD COLUMN tags TEXT NOT NULL DEFAULT '[]';");
}
if (!columns.includes("scrollProgress")) {
  db.execSync("ALTER TABLE content ADD COLUMN scrollProgress REAL;");
}
if (!columns.includes("highlights")) {
  db.execSync("ALTER TABLE content ADD COLUMN highlights TEXT NOT NULL DEFAULT '[]';");
}
