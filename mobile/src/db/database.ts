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

// SCHEMA_VERSION gates the column migration checks below. Bump it whenever a new
// ADD COLUMN is introduced; once a device's user_version reaches it, the PRAGMA
// table_info + per-column checks are skipped entirely on every future launch.
const SCHEMA_VERSION = 1;

const { user_version: currentVersion } = db.getFirstSync<{ user_version: number }>(
  "PRAGMA user_version;",
)!;

if (currentVersion < SCHEMA_VERSION) {
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
  if (!columns.includes("isStub")) {
    db.execSync("ALTER TABLE content ADD COLUMN isStub INTEGER NOT NULL DEFAULT 0;");
  }

  db.execSync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
}
