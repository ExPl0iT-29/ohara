## Context

`backend/src/main.py` (FastAPI app) and `backend/src/content/worker.py` (polling background processor for content extraction/AI enrichment) have only ever been run manually via `uvicorn`/`python -m content.worker` on a developer laptop. Nothing describes how to run them anywhere else.

## Goals / Non-Goals

**Goals:**
- Both processes (web API, worker) running continuously on infrastructure independent of any developer's machine.
- Reachable over the public internet from the phone, with no USB/adb dependency.
- Deployment config lives in the repo (`render.yaml`), not just clicked together in a dashboard from memory.

**Non-Goals:**
- Autoscaling, multi-region, or high-availability setup — a single instance of each service is enough for current (personal/single-user) usage.
- CI/CD pipeline automation — manual deploys via Render's GitHub integration are sufficient for now.
- Migrating away from Neon — Postgres hosting is unaffected, only where the FastAPI/worker processes run changes.

## Decisions

- **Render, two services**: a `web` service (`uvicorn main:app`) and a `worker` service (`python -m content.worker`), both using the same `backend/` root and Python runtime, both reading `DATABASE_URL` from a Render environment variable pointing at the same Neon connection string already in use. Chosen over Vercel because the worker is a long-running polling process, not a request/response function — doesn't fit serverless.
- **`uv` for dependency install**: the repo already uses `uv.lock`; Render's build command runs `pip install uv && uv sync --frozen` rather than exporting to `requirements.txt`, keeping one source of truth for dependencies.
- **`render.yaml` blueprint**: defines both services declaratively so the deployment is reproducible and versioned, rather than manually configured per-service in Render's UI with no record of the settings.
- **Mobile config**: `EXPO_PUBLIC_API_URL` set via `mobile/.env` (gitignored, per-environment) to the Render web service's public URL. Since Expo bakes `EXPO_PUBLIC_*` vars into the JS bundle at build time, changing it requires a rebuild — same as any other native/config change, not different from the `adb reverse` situation in that regard, but no longer requires the laptop or a cable at *runtime*.

## Risks / Trade-offs

- [Render's free tier can spin down idle web services, causing a cold-start delay on the first request after inactivity] → Acceptable for personal use; upgrade to a paid instance if this becomes annoying.
- [I cannot create the Render account or click "Deploy" myself — no Render API/MCP tool available in this session] → `render.yaml` prepares everything; the user connects their GitHub repo to Render and clicks deploy once, using their own account.
