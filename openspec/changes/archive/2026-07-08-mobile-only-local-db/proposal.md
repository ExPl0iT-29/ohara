## Why

Ohara is single-user. The FastAPI + Neon backend added real ongoing cost: a hosting provider to fight with (Render/Fly/Railway all gate free tiers behind card verification), `adb reverse` tunneling that dropped constantly during development, and a background worker process to keep alive just to extract and enrich content that only ever has one reader. None of that complexity buys anything a single phone can't do itself.

## What Changes

- All content storage moves to on-device SQLite (`expo-sqlite`). No remote database, no Render/Neon dependency for the app to function.
- Content extraction (readability-style HTML parsing, YouTube metadata) runs on-device via `node-html-parser` and YouTube's public oEmbed endpoint, replacing the Python `readability-lxml`/`yt-dlp`/Firecrawl worker pipeline.
- AI enrichment (summary/topics) calls OpenAI/Gemini directly from the app using an embedded API key (`EXPO_PUBLIC_*` env vars baked into the build) — acceptable since the APK is private, never distributed.
- A Mihon-style JSON export/import (`Settings` screen) replaces any need for server-side backup; also doubles as the mechanism for importing links saved from a PC (a plain `[{url, contentType?}]` JSON file, no server round-trip).
- `capture-endpoint` and `reader-api` (the FastAPI HTTP contract) are retired — capture and reads go straight to local SQLite, no HTTP hop.
- The `backend/` FastAPI project and its Render deployment are no longer required for the app to function. Left in the repo as-is (not deleted) — deprovisioning Render/Neon is a separate decision for the user to make.

## Impact

- Affected specs: `content-model` (storage), `processing-pipeline` (extraction/enrichment now on-device), `capture-endpoint` (REMOVED — no HTTP capture), `reader-api` (REMOVED — no HTTP reads)
- Affected code: `mobile/src/db/*`, `mobile/src/extraction/*`, `mobile/src/ai/enrich.ts`, `mobile/src/processing/processContent.ts`, `mobile/src/api/content.ts` (rewritten, same exported interface — screens/hooks untouched), `mobile/src/backup/*`, `mobile/app/settings.tsx`
- Out of scope: deleting `backend/`, deprovisioning Render/Neon, migrating existing Render-hosted data (there was none of the user's own besides test saves)
