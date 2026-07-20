## Context

`processContent.ts`'s `getExtractor(contentType)` currently dispatches purely on the user-chosen `contentType` field. Google Docs don't have their own `contentType` — a user would tag one as `documentation` or `other`, both of which route to the generic HTML extractor, which can't render Google's JS-heavy doc-viewer shell.

Google exposes a plain, unauthenticated-when-public export endpoint (`/export?format=txt`) for any Doc shared as "anyone with the link can view" — no API key, no OAuth, just a fetch.

## Goals / Non-Goals

**Goals:**
- Detect Google Docs URLs by pattern, not by relying on the user to pick a specific `contentType`.
- Extract real plain text from public Google Docs via the export endpoint.
- Fail gracefully and informatively when a doc isn't publicly viewable.

**Non-Goals:**
- Authenticated access to private docs (no OAuth flow) — out of scope for a personal, no-backend app.
- Preserving Google Docs formatting/structure (tables, images, headings-as-HTML) — plain text is enough, consistent with this app's "simplest thing that works at personal-library scale" bias (see the existing LIKE-vs-FTS5 search decision).
- Google Sheets/Slides — this change covers Docs (`/document/`) only.

## Decisions

**Detection is URL-pattern-based, checked before `contentType` dispatch.** `getExtractor` becomes `getExtractor(url, contentType)`: if the URL matches `/^https:\/\/docs\.google\.com\/document\/d\/([^/]+)/`, use the Google Docs extractor regardless of `contentType`. Otherwise fall back to existing `contentType`-based dispatch (youtube vs. generic article).
- Alternative considered: add a new `contentType: "google-doc"` and require the user to pick it manually — rejected, adds friction; URL-sniffing is strictly better UX and the app already sniffs URLs for duplicate detection (`findByUrl`).

**Export endpoint: `https://docs.google.com/document/d/<id>/export?format=txt`.**
- A plain `fetch` (same pattern as `extractArticle`'s `fetch(url, ...)`) — no auth headers needed for public docs.
- Response is plain text directly (`response.text()`), no HTML parsing needed at all for the body.

**Public-vs-private detection:** if the response isn't OK, or the response body looks like Google's HTML sign-in/request-access page (contains `<html` or `accounts.google.com` markers) rather than the expected plain text, treat as failure with reason `"Google Doc is not publicly viewable"`. This mirrors the existing "PDF has no extractable text" failure-shape pattern from the sibling `pdf-extraction` change — consistent failure semantics across extractors.

**Title:** first non-empty line of the exported text is almost always the doc's title (Google's plain-text export puts the title as the first line) — use that directly, no extra request needed.

## Risks / Trade-offs

- [Google could change or remove the unauthenticated export endpoint's behavior at any time — it's not a documented public API] → Accept the risk; this is a personal-scale, low-stakes convenience feature, not a system depended on for correctness. If it breaks, the doc simply fails gracefully like any other unsupported source, no worse than today.
- [False-positive URL match on non-Doc Google URLs] → Regex anchored to `/document/d/<id>` specifically avoids matching Sheets/Slides/Forms/Drive-file URLs, which have different path shapes.
- [Very long docs could produce a very large plain-text blob] → Same acceptable trade-off as PDFs/web articles; no cap needed at personal-library scale.

## Migration Plan

No data migration. Existing Google Docs entities previously captured under `documentation`/`other` and left with empty/garbage `extractedText` will only benefit from this on next reprocess (via existing Retry button) — no automatic re-extraction is triggered by this change.

## Open Questions

- None — the export-endpoint approach is well-established prior art (commonly used for public Doc scraping); no spike needed before implementation.
