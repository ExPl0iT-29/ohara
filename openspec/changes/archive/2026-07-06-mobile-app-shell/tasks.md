## 1. Project scaffold

- [x] 1.1 Create Expo project at `mobile/` with TypeScript template (`create-expo-app`), using pnpm
- [x] 1.2 Install and configure Expo Router (`expo-router`), set as the app entry point
- [x] 1.3 Install and configure NativeWind (`tailwind.config.js`, babel/metro plugin)
- [x] 1.4 Install React Query (`@tanstack/react-query`) and set up `QueryClientProvider` at the app root

## 2. API client

- [x] 2.1 Add `mobile/src/api/client.ts` — fetch wrapper reading `EXPO_PUBLIC_API_URL` (default `http://localhost:8000`)
- [x] 2.2 Add `mobile/src/api/content.ts` — typed `captureContent`, `listContent`, `getContent` functions matching backend response shapes
- [x] 2.3 Add `mobile/.env.example` documenting `EXPO_PUBLIC_API_URL`

## 3. React Query hooks

- [x] 3.1 Add `useContentList` hook (wraps `listContent`)
- [x] 3.2 Add `useContentItem(id)` hook (wraps `getContent`)
- [x] 3.3 Add `useCaptureContent` mutation hook (wraps `captureContent`)

## 4. Navigation shell

- [x] 4.1 Add `mobile/app/index.tsx` — home/feed placeholder listing content titles/status via `useContentList`, NativeWind-styled
- [x] 4.2 Add `mobile/app/content/[id].tsx` — reader placeholder showing item details via `useContentItem`, NativeWind-styled
- [x] 4.3 Wire navigation: tapping an item on the feed screen routes to `content/[id]`

## 5. Verification

- [x] 5.1 Run Expo dev server, confirm app loads without errors
- [x] 5.2 Confirm feed screen fetches and displays real content from a running backend
- [x] 5.3 Confirm navigating to an item's reader screen fetches and displays that item
