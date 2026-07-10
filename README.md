<div align="center">

<p align="center">
  <img src="docs/assets/banner.jpg" alt="Ohara banner" width="100%" />
</p>

![](https://capsule-render.vercel.app/api?type=waving&color=0F766E&height=120&section=header&text=Ohara&fontSize=42&fontColor=FAF9F6&animation=fadeIn&fontAlignY=65)

**A mobile-only, single-user read-later app.**
Save a link. Get it extracted and AI-summarized on-device. Read it later.

![React Native](https://img.shields.io/badge/React_Native-0.86-0F766E?style=flat-square&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-SDK_57-0F766E?style=flat-square&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-0F766E?style=flat-square&logo=typescript&logoColor=white)
![Platform](https://img.shields.io/badge/platform-Android-0F766E?style=flat-square&logo=android&logoColor=white)
![SQLite](https://img.shields.io/badge/storage-on--device-0F766E?style=flat-square&logo=sqlite&logoColor=white)
![Private](https://img.shields.io/badge/status-private_%2F_single--user-0F766E?style=flat-square)

<p align="center">
  <a href="#why">Why</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#project-layout">Project layout</a> •
  <a href="#running">Running</a> •
  <a href="#git-workflow">Git workflow</a>
</p>

</div>

<hr>

## Why

No backend, no account, no server bill. Everything — storage, extraction, AI enrichment, backup — runs on the phone. Built for one person's reading list, not a product.

<hr>

## Architecture

| Concern | Approach |
|---|---|
| **Storage** | On-device SQLite (`expo-sqlite`) — a single `content` table plus a `settings` table (theme, etc). |
| **Extraction** | On-device. Articles via `node-html-parser` (fetch HTML, pull `og:*` meta + main content). YouTube via the public oEmbed endpoint — no duration/transcript, since there's no client-side `yt-dlp` equivalent. |
| **AI enrichment** | Summary + topics, called directly from the app (OpenAI or Gemini, picked by `EXPO_PUBLIC_AI_PROVIDER`) using an embedded API key. Acceptable only because this is a private, single-user build — **never** distribute the APK with a real key baked in. |
| **Search & tags** | `LIKE`-based full-text search plus freeform tags, both stored as plain SQLite columns — no FTS5, no new table, sized to a personal library. |
| **Reading extras** | Scroll-position resume (fraction of content height) and a quote/note highlight list per item — not inline text-selection highlighting. |
| **Backup / sync** | Mihon-style JSON export of the whole library, and import of either a full backup or a plain `[{url, contentType?}]` list (e.g. hand-written on a PC, imported via Settings → Import from file). No server, no relay. |

Spec source of truth lives in [`openspec/specs/`](openspec/specs/). Read it before changing behavior — see [`CLAUDE.md`](CLAUDE.md).

<hr>

## Project layout

```
mobile/               Expo Router app (this is what you build/run)
  app/                screens (index, capture, content/[id], settings, stats)
  src/api/content.ts  capture/list/get/search/archive/tags — same interface pre- and post- backend removal
  src/db/             sqlite tables + repositories
  src/extraction/     article + youtube extractors, reading time
  src/ai/enrich.ts    AI summary/topics call
  src/processing/     pending -> ready pipeline, stuck-row sweep on launch
  src/backup/         export/import
backend/              retired; no longer called by the app
openspec/             specs + change history (source of truth for product behavior)
```

<hr>

## Running

<details>
<summary><strong>Setup steps</strong></summary>

```bash
cd mobile
npm install
npx expo run:android   # or run:ios
```

Requires `mobile/.env` (see `mobile/.env.example`):

```env
EXPO_PUBLIC_AI_PROVIDER=gemini      # or "openai"
EXPO_PUBLIC_GEMINI_API_KEY=
EXPO_PUBLIC_OPENAI_API_KEY=
```

> **Must be UTF-8, not UTF-16.** Notepad/PowerShell saves sometimes write UTF-16LE, which Expo can't read.

</details>

<hr>

## Git workflow

Each OpenSpec change gets its own branch off `main`, merged back with `--no-ff` once done. Never commit feature work directly to `main`. See [`CLAUDE.md`](CLAUDE.md).

<div align="center">

![](https://capsule-render.vercel.app/api?type=waving&color=0F766E&height=100&section=footer)

</div>
