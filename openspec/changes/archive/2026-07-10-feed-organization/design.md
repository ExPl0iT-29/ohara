## Context

The app has no icon library (`@expo/vector-icons` or similar) — every existing button/pill uses plain text (see `capture.tsx`'s content-type pills). The feed and content model are on-device SQLite only, no migration framework, one existing table (`content`) already shipped to a real device with real data (per `mobile-only-local-db`).

## Goals / Non-Goals

**Goals:**
- Distinguish content types at a glance on the feed without adding a new dependency.
- Let the user archive/unarchive content and hide archived items by default.
- Don't lose or corrupt existing on-device data when adding the new column.

**Non-Goals:**
- No new icon/asset library — text/emoji marker only, consistent with the rest of the UI's plain-text pill style.
- No "archive all read" bulk action, no auto-archive-on-read — explicit user action only per item.
- No change to `local-backup`'s JSON shape beyond `archivedAt` riding along as a normal field (already handled generically by full-entity export/import).

## Decisions

- **Type marker: short text label, not an emoji or icon font.** Ladder step 4 (already-installed dependency) doesn't offer an icon set; step 3 (native feature) doesn't apply; adding `@expo/vector-icons` for ~11 static glyphs is disproportionate. A `CONTENT_TYPE_LABELS: Record<ContentType, string>` map (e.g. `youtube: "YouTube"`, `pdf: "PDF"`, `paper: "Paper"`) rendered as a small pill next to the status badge matches the existing `FeedStatusBadge` pattern exactly — reuse that component's visual language instead of inventing a new one.
- **`archivedAt: string | null` column, not a boolean `archived`.** Consistent with the rest of the schema's timestamp-of-event convention (`savedAt`, `completedAt`), and it's free audit info (when was this archived) at no extra cost.
- **Migration: `ALTER TABLE content ADD COLUMN archivedAt TEXT` guarded by a `PRAGMA table_info` check, run alongside the existing `CREATE TABLE IF NOT EXISTS` in `database.ts`.** There's no migration framework and adding one for a single nullable column is overkill (ladder step 1: does this need to exist). `ALTER TABLE ... ADD COLUMN` is a no-op-safe, additive SQLite operation; guarding on `table_info` avoids a duplicate-column error on repeat launches.
- **Filter lives in the query layer (`listContent({ archived: boolean })`), not client-side array filtering.** `listContentRows` already takes params and builds a WHERE clause; adding `archivedAt IS NULL` / `archivedAt IS NOT NULL` is one more clause, and keeps `useContentList`'s polling/refetch logic untouched.
- **Active/Archived toggle: two pill buttons above the list on `index.tsx`, mirroring the existing `capture.tsx` pill pattern** — no new UI primitive.

## Risks / Trade-offs

- [Existing installs have no `archivedAt` column] → `ALTER TABLE ... ADD COLUMN` on next launch, guarded by a column-existence check so it's idempotent and safe to run on every app start (cheap: one `PRAGMA table_info` read).
- [Adding a filter param changes `ListContentParams`] → additive/optional field, default `archived: false` preserves current "show everything" call sites that don't pass it... actually current default must become "show active only" per the proposal, so any caller not passing the param gets active-only — only one caller exists (`useContentList`), so this is a one-line update, not a breaking ripple.

## Open Questions

None — scope is small enough that the above decisions fully resolve it.
