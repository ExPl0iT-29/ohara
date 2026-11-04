# Ohara — Feature Log

Ohara is a free, local-only Android read-later app: no accounts, no cloud, no AI, no ads, no analytics. Everything lives in on-device SQLite. Spec source of truth: [`openspec/specs/`](openspec/specs/). Change history: `openspec/changes/archive/`.

## What the app does

- **Capture** — "+" button on the feed, Android share sheet, duplicate-URL detection, bulk paste, retry for failed items.
- **On-device extraction** — web articles (with headings, lists, quotes and images preserved), YouTube via oEmbed, PDFs (pdf.js), public Google Docs, and stub capture for JavaScript-only pages. Reading time is computed from the text.
- **Reader** — hero image, clean typography, scroll-position resume, quote-and-note highlights per item, tap through to the source.
- **Library** — swipe to archive/unarchive, Active and Archived views, freeform tags with a tag filter row, search over title and body text, library stats, first-run onboarding.
- **Backup** — export the whole library as JSON via the share sheet; import a full backup or a plain list of links.
- **Settings** — light, dark or system theme, export and import.
- **Look** — neo-brutalist design system with light and dark modes.

## Not in the app, by design

Accounts, sync, cloud storage, AI summaries or topics, ads, analytics, payments. See `openspec/specs/local-only-operation` once the `remove-ai-enrichment` change is archived.

## History

Ohara began as a FastAPI + Postgres backend with a thin mobile client (changes 1–13 in `openspec/changes/archive/`), then moved to mobile-only with on-device SQLite (`2026-07-08-mobile-only-local-db`). The `backend/` directory is retired and not called by the app. AI summaries were removed before the public release (`remove-ai-enrichment`).
