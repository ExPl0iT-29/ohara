## Context

The original `backend-deployment` change deployed the worker as a separate Render `worker`-type service. Render's worker service type requires a paid instance — no free tier — which the user doesn't want to pay for a personal single-user app.

## Goals / Non-Goals

**Goals:**
- Zero additional cost: one free Render web service does everything.
- No change to processing behavior — same polling loop, same batch size, same interval.
- Tests must not be affected — `TestClient(app)` in the existing test suite must not start a live polling loop against the real database.

**Non-Goals:**
- Horizontal scaling of the worker independent of the web process — not needed at this scale; if it ever is, revisit the separate-service approach (and pay for it, or move to a host with a free background-job primitive like a cron trigger).

## Decisions

- **`asyncio.to_thread` for the blocking work**: the existing `process_batch`/`enrich_ready_content` functions are synchronous (SQLAlchemy ORM, sync extractors). Rather than rewrite them async, each iteration runs via `asyncio.to_thread`, keeping the event loop free for HTTP requests while the polling loop's blocking work happens on a thread pool thread.
- **`ENABLE_BACKGROUND_WORKER` env var gate**: without this, every `TestClient(app)` in the 46-test suite would trigger FastAPI's lifespan and start a real polling loop hitting the live Neon DB during tests — non-deterministic interference with test assertions about pending/processing state. Defaulting to "off" (only Render's production env sets it to `"true"`) keeps test behavior identical to before this change.
- **Kept the standalone `run()` entry point**: `python -m content.worker` still works for anyone who wants to run it as a genuinely separate process (e.g., if this later moves to a host with a free worker tier) — no code deleted, just an additional in-process path added.

## Risks / Trade-offs

- [A single Render web instance now serves both HTTP requests and the polling loop; a burst of HTTP traffic could theoretically starve the background task, or vice versa] → Acceptable at single-user scale; `asyncio.to_thread` at least prevents the polling work from blocking the event loop outright.
- [If the web process restarts (deploy, crash), the worker restarts with it — no separate lifecycle] → Acceptable; the polling loop is idempotent (picks up pending rows on the next iteration regardless of restarts).
