## 1. Render blueprint

- [ ] 1.1 Add `backend/render.yaml` defining a `web` service (uvicorn) and a `worker` service (content processor), both using `uv` for install
- [ ] 1.2 Document required environment variables (`DATABASE_URL`, any AI provider API keys the enrichment pipeline needs)

## 2. User-side deployment (manual, requires user's Render account)

- [ ] 2.1 User connects GitHub repo to Render, deploys via the blueprint
- [ ] 2.2 User sets `DATABASE_URL` (and AI provider keys) as Render environment variables/secrets
- [ ] 2.3 Confirm both services are live (web responds, worker log shows polling)

## 3. Point mobile app at deployed backend

- [ ] 3.1 Add `EXPO_PUBLIC_API_URL` to `mobile/.env` pointing at the Render web service URL
- [ ] 3.2 Rebuild release APK with the new env var baked in
- [ ] 3.3 Confirm the app works fully disconnected from the laptop (no adb reverse, no USB) — feed loads, capture saves

## 4. Verification

- [ ] 4.1 `GET /content` against the deployed URL returns 200 from a machine that isn't the dev laptop
- [ ] 4.2 Save a link on the phone with laptop closed/disconnected — confirm it appears in the feed after processing
