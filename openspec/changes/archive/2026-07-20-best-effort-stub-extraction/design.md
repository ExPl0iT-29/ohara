## Context

`extractArticle` already pulls `og:title`/`og:description`/`og:image`/`author` via `meta()` before attempting the body scrape (`article`/`main`/`body` tag walk). For JS-rendered sites (X posts, Notion public pages, Scribd) the body scrape naturally returns nothing (`parts.length === 0` → `extractedText: null`) since the real content only exists after client-side JS runs, which a plain `fetch` never executes. Today `processContent` still marks these `ready` even with `extractedText: null` (it doesn't check `extractedText` before setting `ready`) — so functionally, meta-rich-but-body-empty pages already technically succeed today, just as an unlabeled, empty-looking reader experience. The gap is: (1) no clear signal to the user that "this is just a preview, not the full text," and (2) the existing `processing-pipeline` spec text incorrectly implies certain contentTypes (`tweet`, `reddit`, etc.) always fail, which isn't actually enforced in code and creates a stale/misleading spec vs. sibling changes (`pdf-extraction`, `google-docs-extraction`) that do add real dedicated extractors for their content types.

## Goals / Non-Goals

**Goals:**
- Give the user an honest, clearly-labeled "preview only" result instead of an empty-looking reader for meta-rich/body-empty pages.
- Correct the spec so it reflects what's actually achievable generically (title/description/image preview) rather than a blanket "fails" for content types that in practice often do have usable meta tags.

**Non-Goals:**
- Headless-browser / JS rendering to get real X/Notion/Scribd body text — explicitly out of scope; this app has no server and isn't adding one for this.
- Per-site scrapers (e.g. an X API integration, a Notion API integration) — out of scope; this is a generic fallback, not source-specific integrations.
- Retroactively reprocessing existing failed/empty entities — user can already do this manually via the existing Retry button.

## Decisions

**Detection: `isStub = true` whenever `extractedText` comes back null/empty AND at least one of `title`/`description`/`heroImage` was found via meta tags.** This is a pure function of the existing extractor output — no new fetch calls, no site-specific logic.
- Alternative considered: keep `isStub` per-source (hardcode for x.com/notion.site/scribd.com domains) — rejected, brittle and unnecessary; the content-based check ("did we get a body or not") generalizes to any future JS-heavy site without a code change.

**Status remains `ready`, not a new status value.** A stub is a successful, if minimal, capture — not a failure and not a distinct pipeline state. Only the new `isStub` boolean changes downstream rendering.
- Alternative considered: new `status: "stub"` value — rejected; would ripple through every status-based filter (`getPresentContentTypes`, stats, list filters) for no real behavioral gain over a boolean flag on an already-`ready` item.

**Reader UI for `isStub` items:** show title, description, hero image, and a prominent "Open original link" button; omit the reader body entirely rather than showing an empty scroll view. Archive/tag/highlight features remain available (a stub is still a fully real library entry, just without in-app readable text).

**Migration for existing entities:** `isStub` defaults to `false` for all existing rows (additive column, same pattern as prior columns this session) — no reprocessing triggered automatically; existing empty-`extractedText`-but-`ready` items simply display as before until reprocessed (retroactive backfill is not attempted, consistent with the Non-Goals above).

## Risks / Trade-offs

- [Some legitimately-failed extractions (network error mid-fetch, non-HTML response) could be misclassified as a "stub" if they happen to leave stale meta values] → Not a real risk: this check only runs on the success path (extractor returned normally); actual thrown errors still go through the existing `catch` → `failed` path unchanged.
- [Meta-tag-only preview could look sparse for pages with no OG tags at all] → Acceptable; in that case `title`/`description`/`heroImage` are all null too and the item is nearly indistinguishable from today's already-existing "extracted nothing but didn't fail" case — this change only adds the explicit flag, not a new failure mode.

## Migration Plan

Additive `isStub` column defaulting to `0`/`false`. No backfill. No breaking change to existing statuses or filters.

## Open Questions

None.
