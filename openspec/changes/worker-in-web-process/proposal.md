## Why

Render's free tier covers a `web` service but not a `worker` (background) service — Render started asking for payment when deploying the two-service `render.yaml` from the `backend-deployment` change. Rather than pay for a second always-on process for a single-user app, the content-processing loop can run as a background asyncio task inside the same FastAPI process.

## What Changes

- `content/worker.py` gains `run_forever_async()`, an async version of the existing polling loop (`run()`), running the same sync DB/extraction work via `asyncio.to_thread` so it doesn't block the event loop.
- `main.py` starts this task in FastAPI's `lifespan`, gated behind `ENABLE_BACKGROUND_WORKER=true` so it does **not** start during tests (`TestClient` instantiation would otherwise spin up a live polling loop against the real Neon DB mid-test).
- `render.yaml` drops the separate `worker` service — one `web` service now runs everything.
- The standalone `run()` / `python -m content.worker` entry point is kept as-is for local dev convenience; nothing forces using the in-process version outside of `ENABLE_BACKGROUND_WORKER=true`.

## Capabilities

### Modified Capabilities
- `backend-deployment`: single Render service instead of two; `ENABLE_BACKGROUND_WORKER` env var controls whether the content-processing loop runs in-process.

## Impact

- Affected code: `backend/src/content/worker.py`, `backend/src/main.py`, `backend/render.yaml`.
- No API contract changes. No new dependencies (uses stdlib `asyncio`).
