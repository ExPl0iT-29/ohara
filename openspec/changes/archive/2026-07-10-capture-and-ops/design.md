## Context

Capture is a single-URL form (`app/capture.tsx`) backed by `captureContent()` which inserts a row and fires `processContent()` fire-and-forget. `local-backup`'s `importBackup()` already parses a plain `{url, contentType?}` list format for the PC-import path — bulk paste in the app should produce the same capture calls per line, not a separate code path. `processContent()` already exists as the single entry point for extraction+enrichment; retry just needs to call it again on a `failed` row.

## Goals / Non-Goals

**Goals:**
- Don't silently duplicate a URL that's already saved.
- Paste a batch of links once instead of one at a time.
- Give a failed item a way back to `pending` without re-typing the URL.
- See library size/composition at a glance.

**Non-Goals:**
- No merge/dedup UI for existing duplicates already in the library — detection is only at capture time, going forward.
- No URL normalization (e.g. stripping tracking params, trailing slashes) before duplicate comparison — exact string match only; revisit only if it causes real false negatives.
- No fuzzy/partial stats (e.g. reading-time totals, streaks) — count/breakdown/oldest-unread only, per the proposal's scope.

## Decisions

- **Duplicate check: exact `url = ?` match via a new `findContentByUrl`, called on submit before `captureContent`.** Simplest correct check (ladder: does it need to exist at all — yes, but no more than exact match). If found, show "Already saved" with a button to navigate to `/content/{id}` instead of the save button; do not block the user from saving anyway if they explicitly want a second copy — but default flow steers them to the existing item.
- **Bulk paste: reuse the existing single `TextInput` upgraded to `multiline`, split on `\n`, filter blank lines, call `captureContent` per line (skip content-type picker when multiple lines are present — bulk items just use the default `"other"` type, matching `local-backup`'s plain-list import behavior which also has no per-item type).** No new screen, no new component — same form, same mutation, called in a loop. Avoids a second capture code path.
- **Retry: `retryContent(id)` just calls `processContent(id)` again.** `processContent` already resets to `"processing"` at its start and handles both extraction and enrichment — a `failed` item retried this way behaves identically to a fresh capture's first attempt. No new processing logic needed.
- **Stats: computed via a handful of `SELECT COUNT(*)`/`GROUP BY`/`ORDER BY savedAt` queries in `contentRepository.ts`, not cached or materialized.** Library is small (personal use); computing on screen-open is cheap and always correct, no invalidation logic to get wrong.

## Risks / Trade-offs

- [Exact-match duplicate detection misses near-duplicate URLs (`http` vs `https`, trailing slash, `?utm_source=...`)] → accepted; normalizing is a rabbit hole (which params are "tracking" is content-dependent) and out of scope until it's a real annoyance.
- [Bulk paste has no per-item content-type control] → matches existing PC-import behavior already shipped in `local-backup`; user can still open the capture screen per-URL if they want to set a type.

## Open Questions

None.
