## Why

The backend has only ever run as `uvicorn` on a developer's own laptop, reached from a physical Android device via `adb reverse` port-forwarding over USB. This breaks the moment the cable is unplugged, `adb reverse` isn't re-run after a reconnect, or the laptop is off — which is most of the time. A real app's backend needs to be reachable from anywhere, independent of any specific developer machine being on and tethered.

## What Changes

- Deploy the FastAPI web service and the content-processing worker (`content/worker.py`) as two separate long-running services on Render, both pointed at the existing Neon Postgres database.
- Add a `render.yaml` (Render's infra-as-code blueprint) so both services are defined in-repo rather than clicked together by hand and undocumented.
- Point the mobile app's `EXPO_PUBLIC_API_URL` at the deployed Render URL instead of `http://localhost:8000`, removing the `adb reverse` dependency entirely.
- No application logic changes — this is purely a deployment/config change.

## Capabilities

### New Capabilities
(none — no new product capability; this is infrastructure)

### Modified Capabilities
(none — no API contract changes)

## Impact

- Affected code: new `backend/render.yaml`; `mobile/.env` (or `app.json`/EAS build config) gets `EXPO_PUBLIC_API_URL` pointed at the Render URL.
- Requires a Render account (user-owned; I cannot create or authorize this on your behalf) and the existing Neon `DATABASE_URL` as a Render environment variable/secret.
- Mobile app needs a rebuild once `EXPO_PUBLIC_API_URL` changes (it's baked into the JS bundle at build time).
