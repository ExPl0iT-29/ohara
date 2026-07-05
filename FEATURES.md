# Ohara — Feature Log

Tracks every OpenSpec change: what it does, where it lives, and current status.

## Built (backend)

### 1. content-model
Unified `Content` domain entity used for every saved item (blog, website, doc, PDF, paper, YouTube, GitHub, book, tweet, Reddit, other). Defines which fields are immutable at capture (`id`, `url`, `source`, `savedAt`) vs. replaceable by later processing (`title`, `summary`, `topics`, `readingTime`, `status`, etc.). Persisted via SQLAlchemy + Alembic migration to a Postgres `content` table (JSONB for `metadata`/`topics`, DB-level enums for `contentType`/`status`). No relationship to projects — content never references a project (ADR-002).
**Archived:** `openspec/changes/archive/2026-07-05-content-model/`

### 2. capture-endpoint
`POST /content` — the only way to save a URL into Ohara. Accepts a URL (+ optional `contentType`), creates a `Content` row in `pending` status, returns immediately (201) with no processing performed. No auth (single-user, local-first app). Malformed URLs rejected at the boundary. First runnable FastAPI app (`backend/src/main.py`).
**Archived:** `openspec/changes/archive/2026-07-05-capture-endpoint/`

### 3. processing-pipeline
Background worker that picks up `pending` content and actually extracts it: web pages via Readability (HTML fetch + parse, with Firecrawl as a fallback for thin/JS-heavy pages), YouTube via `yt-dlp`. Populates `title`, `description`, `heroImage`, `author`, `extractedText`, `duration`, and an algorithmic `readingTime` (word count based, no AI). Content types without an extractor yet (`pdf`, `paper`, `github`, `book`, `tweet`, `reddit`) fail gracefully to `failed` status with a reason, rather than hanging forever. One bad row never stops the worker from processing the rest.
**Status:** implemented, archiving now

### 4. ai-enrichment
Adds the AI layer on top of extracted text: `summary` + `topics`, via a swappable `AIProvider` interface (OpenAI or Gemini, chosen by `AI_PROVIDER` env var; Ollama reserved for later). Runs as a second worker pass after extraction — never blocks or duplicates extraction, and a failed/missing AI call never reverts a `ready` item back to `failed`. Reading works with or without AI ("AI is invisible infrastructure" per PRODUCT_VISION.md).
**Archived:** `openspec/changes/archive/2026-07-06-ai-enrichment/`

## Not built yet (planned)

### 5. reader-api
GET endpoints to actually retrieve saved content — single item and list. Currently you can only write (`POST /content`); there's no way to read anything back over HTTP yet.

### 6. home-feed
Feed/list logic on top of reader-api — sorting by savedAt, filtering by status/type. May end up folded into reader-api rather than being its own change.

### 7. mobile-app-shell
Expo/React Native project scaffold, navigation, API client. Zero frontend code exists yet — everything so far is backend-only.

### 8. reader-view
The actual reading screen — the core of the product experience per PRODUCT_VISION.md.

### 9. capture-ui
Save-URL flow from inside the app itself (today, capture only works via raw `POST /content`).

### 10. home-feed-ui
List/feed screen in the app, consuming reader-api/home-feed.

## Deferred (not urgent, per original roadmap)

- **projects** — contextual overlays over content (never own content, per ADR-002)
- **search** — full-text/semantic search over saved content
- **recommendations** — surfacing related/suggested content

## Stack in use so far

- Backend: FastAPI, SQLAlchemy, Alembic, Pydantic (Python, `uv`)
- DB: Postgres on Neon (project "Ohara", region ap-southeast-1)
- Extraction: `readability-lxml`, `yt-dlp`, `requests`; Firecrawl as optional fallback (needs `FIRECRAWL_API_KEY`)
- AI: `openai` SDK, `google-genai` SDK
- Tests: `pytest`, `httpx`/`fastapi.testclient` — 22 passing, run against the real Neon DB (no local Postgres needed)
