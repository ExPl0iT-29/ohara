# Ohara

Mobile-only, single-user read-later app. Save a link, get it extracted and AI-summarized on-device, read it later — light/dark/system themed. No backend.

## Architecture

- **Storage**: on-device SQLite (`expo-sqlite`), single `content` table + a `settings` table (theme, etc).
- **Extraction**: on-device. Articles via `node-html-parser` (fetch HTML, pull `og:*` meta + main content). YouTube via the public oEmbed endpoint (no duration/transcript — no client-side yt-dlp equivalent).
- **AI enrichment**: summary + topics, called directly from the app (OpenAI or Gemini, picked by `EXPO_PUBLIC_AI_PROVIDER`) using an embedded API key. Acceptable only because this is a private, single-user build — never distribute the APK with a real key baked in.
- **Backup / sync**: Mihon-style JSON export of the whole library, and import of either a full backup or a plain `[{url, contentType?}]` list (e.g. hand-written on a PC, imported via Settings → Import from file). No server, no relay.

Spec source of truth lives in `openspec/specs/`. Read it before changing behavior — see `CLAUDE.md`.

## Project layout

```
mobile/               Expo Router app (this is what you build/run)
  app/                screens (index, capture, content/[id], settings)
  src/api/content.ts  capture/list/get — same interface pre- and post- backend removal
  src/db/             sqlite tables + repositories
  src/extraction/      article + youtube extractors, reading time
  src/ai/enrich.ts     AI summary/topics call
  src/processing/      pending -> ready pipeline, stuck-row sweep on launch
  src/backup/          export/import
backend/              retired; no longer called by the app
openspec/             specs + change history (source of truth for product behavior)
```

## Running

```
cd mobile
npm install
npx expo run:android   # or run:ios
```

Requires `mobile/.env` (see `mobile/.env.example`):

```
EXPO_PUBLIC_AI_PROVIDER=gemini      # or "openai"
EXPO_PUBLIC_GEMINI_API_KEY=
EXPO_PUBLIC_OPENAI_API_KEY=
```

Must be UTF-8, not UTF-16 — Notepad/PowerShell saves sometimes write UTF-16LE, which Expo can't read.

## Git workflow

Each OpenSpec change gets its own branch off `main`, merged back with `--no-ff` once done. Never commit feature work directly to `main`. See `CLAUDE.md`.
