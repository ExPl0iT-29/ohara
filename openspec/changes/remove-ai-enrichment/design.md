# Design

## Context

AI enrichment lives in `mobile/src/ai/enrich.ts` and is invoked once from `processContent` after a successful extraction. Its output is written to the `summary` and `topics` columns, which are then read by the reader (`ReaderSummary`), by search (`summary LIKE ?`), and by the feed's tag/topic chips (`getAllTagsAndTopics`). Backups serialise whole rows, so the two columns travel in exports. See proposal.md for why AI is leaving.

## Goals / Non-Goals

**Goals:**
- No AI code, configuration or credentials in the shipped app.
- No visible trace of AI in the UI.
- Existing databases, exports and imports keep working unchanged.

**Non-Goals:**
- Dropping the `summary` / `topics` columns.
- Building any non-AI replacement for summaries.
- Cleaning up the legacy `backend/` directory.

## Decisions

### D1. Delete the AI code outright; do not feature-flag it
Remove `mobile/src/ai/`, the enrichment call in `processContent`, and the env variables. *Alternative:* keep the code behind a disabled flag so AI can return. Rejected: it leaves a dormant path that still has to be kept compiling and secret-free, contradicts the simplicity-first principle, and git history preserves it if ever needed. The ADR guidance on provider abstraction remains the direction if AI returns.

### D2. Keep the columns and entity fields as legacy
`summary` and `topics` stay in the table, in the repository mapping, and in export/import. New items always have `summary = null` and `topics = []`. *Why:* dropping columns needs a SQLite table rebuild, risks data loss on a user's only copy of their library, and would break importing older backups. A dormant nullable column costs nothing. The write path simply never sets them.

### D3. Hide, do not delete, existing summaries and topics
Legacy values (for example in the developer's private library) are neither displayed nor searchable. *Alternative:* keep displaying existing summaries read-only. Rejected: it gives two classes of item in the reader (some with a summary, most without), keeps a UI branch alive for data the app can no longer produce, and makes search results depend on invisible text. Hiding keeps the product consistent and the data is still in the file for export.

### D4. Rename rather than special-case the topic helpers
`getAllTagsAndTopics` becomes a tags-only helper and its API wrapper `getAllTagsAndTopicsList` is renamed to match, so no function name still promises topics. The search clause drops `summary LIKE ?`, and the tag filter clause drops `topics LIKE ?`.

### D5. Processing ends at extraction
`processContent` sets `status: "ready"` after extraction and returns. The launch-time stuck-content reprocess and the existing deferred scheduling stay as they are; only the stale comment mentioning AI enrichment in `_layout.tsx` is updated.

### D6. Vision and specification documents change minimally
`PRODUCT_VISION.md` ("AI Should Work Quietly") and `PRODUCT_SPECIFICATIONS.md` ("AI Features") describe behaviour the product no longer has. Mark AI as "not part of the current product" rather than rewriting the philosophy. ADR-004 and ADR-011 stay untouched as guidance for if AI is ever reintroduced. These edits touch the project's philosophy documents, so they are called out for explicit review.

## Risks / Trade-offs

- **Private library loses visible summaries** → accepted; data remains in the DB and in exports.
- **A missed code path still reads `summary`/`topics`** → verification greps the app for both names and type-checks, so any leftover use of the deleted helper fails the build.
- **Search quality drops slightly without summary text** → summaries were the only AI-sourced search text and were optional; title and body remain.
- **Embedded key already exists in earlier private APKs** → removing the code does not revoke it. Revoke the key at the provider once the new build is installed.
- **Spec drift in stale backend specs** (`search`, `recommendations`, `projects`, `backend-deployment`, `worker-in-web-process`) still mention topics → out of scope; flagged for a separate housekeeping change.

## Migration Plan

1. Land the code and doc changes on this branch.
2. Build and install on the existing private device over the current install (same database). Verify the library opens, old items read normally, and new captures reach `ready`.
3. Revoke the OpenAI and Gemini keys from earlier builds.
4. Rollback: revert the branch; no data was changed, so older builds still read the same database.
