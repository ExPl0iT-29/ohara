## Context

Backend is fully functional: capture, extraction, AI enrichment, and read (reader-api) all work over HTTP against Neon Postgres. No frontend exists. STACK.md fixes the frontend stack already: Expo, NativeWind, React Query, Expo Router, TypeScript, pnpm.

## Goals / Non-Goals

**Goals:**
- Runnable Expo app with Expo Router file-based navigation.
- NativeWind configured and proven with one styled component.
- A typed API client (thin fetch wrapper + React Query hooks) for `POST /content`, `GET /content`, `GET /content/{id}`.
- Two placeholder screens (home/feed, reader) wired into navigation, enough for later UI changes to fill in.

**Non-Goals:**
- No real capture flow, no real reader UI, no real feed rendering — those are `capture-ui`, `reader-view`, `home-feed-ui`.
- No auth (matches backend — single-user, local-first).
- No offline support / caching strategy beyond React Query defaults.

## Decisions

- **Directory**: new `app/` at repo root (Expo Router convention — the router itself scans a folder literally named `app/`), with a sibling `mobile/` package.json holding the Expo project config, OR place the whole Expo project at repo root under `mobile/` with its own `app/` router folder inside. Chosen: `mobile/` as the Expo project root (keeps `backend/` and `mobile/` siblings, mirrors existing repo shape), with `mobile/app/` as the Expo Router folder.
- **API client**: one `mobile/src/api/client.ts` with a `fetch`-based `apiRequest` reading `EXPO_PUBLIC_API_URL` from env, plus `mobile/src/api/content.ts` exposing typed functions (`captureContent`, `getContent`, `listContent`) matching reader-api/capture-endpoint response shapes. React Query hooks (`useContentList`, `useContentItem`, `useCaptureContent`) wrap these directly — no repository/interface abstraction needed client-side (that pattern is a backend concern, not warranted for one HTTP client hitting one backend).
- **Navigation**: Expo Router with two routes — `mobile/app/index.tsx` (home/feed placeholder, calls `useContentList`) and `mobile/app/content/[id].tsx` (reader placeholder, calls `useContentItem`). Confirms the API client works end-to-end without building real UI.
- **Styling**: NativeWind installed and configured (`tailwind.config.js`, babel/metro plugin per NativeWind docs); placeholder screens use a couple of Tailwind classes to prove it's wired, not for visual polish.

## Risks / Trade-offs

- [Placeholder screens might look like "real" UI and get mistaken for done] → Mitigation: keep them minimal (plain list of titles/status, no styling beyond proving NativeWind works), proposal explicitly scopes this as shell-only.
- [Hardcoded API base URL for local dev] → Mitigation: use `EXPO_PUBLIC_API_URL` env var with a localhost default, documented in `mobile/README.md` or `.env.example`.
