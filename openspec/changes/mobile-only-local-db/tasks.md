## Tasks

- [x] Add local SQLite schema and repository (`src/db/database.ts`, `src/db/contentRepository.ts`)
- [x] Rewrite `src/api/content.ts` to be SQLite-backed while keeping the same exported types/functions (zero screen changes needed)
- [x] On-device article extraction via `node-html-parser` (title/description/heroImage/author/body as sanitized HTML)
- [x] On-device YouTube metadata via public oEmbed endpoint
- [x] On-device AI enrichment (OpenAI/Gemini direct calls, embedded key)
- [x] Local processing orchestrator (`processContent`) replacing the remote worker; runs inline after capture
- [x] Sweep-and-retry stuck `pending`/`processing` rows on app launch (in case app was killed mid-extraction)
- [x] Short-poll refetch in `useContentList`/`useContentItem` while items are in-flight (was relying on remote worker latency + manual refresh before)
- [x] Mihon-style JSON export (`Settings` screen) of the full local library
- [x] JSON import: full-backup format (upsert) and plain `[{url, contentType?}]` format (insert + process) — the PC-to-mobile sync path
- [x] Typecheck clean, native rebuild (new native modules: `expo-sqlite`, `expo-crypto`, `expo-document-picker`, `expo-file-system`, `expo-sharing`), manual on-device verification
