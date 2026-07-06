## Why

Zero frontend code exists yet — everything so far is backend-only (content-model, capture-endpoint, processing-pipeline, ai-enrichment, reader-api). Every remaining UI feature (reader-view, capture-ui, home-feed-ui) needs a running app to live in first: navigation, an API client, and project scaffolding.

## What Changes

- New Expo (React Native + TypeScript) app under `app/` (or `mobile/`, TBD in design), using Expo Router for navigation.
- NativeWind wired up for styling.
- React Query wired up for server state, with a typed API client hitting the backend's `reader-api` (`GET /content`, `GET /content/{id}`) and `capture-endpoint` (`POST /content`).
- Baseline navigation shell: a home/feed screen placeholder and a reader screen placeholder, enough structure for reader-view/capture-ui/home-feed-ui to build into.
- No real feature UI yet — this change is scaffolding only.

## Capabilities

### New Capabilities
- `mobile-app-shell`: Expo project scaffold — navigation shell, typed API client, base screens (empty/placeholder), styling setup.

### Modified Capabilities
(none — purely additive, no backend requirement changes)

## Impact

- New top-level frontend directory (Expo project) alongside `backend/`.
- Depends on already-implemented `reader-api` and `capture-endpoint` backend routes.
- Package manager: `pnpm` (per STACK.md).
