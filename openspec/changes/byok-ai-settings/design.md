## Context

`enrichContent()` is the single call site reading `process.env.EXPO_PUBLIC_*` for AI config. `getSetting`/`setSetting` already exist as a generic on-device key-value store (used for `theme`). No new persistence mechanism needed — this is a read-source swap plus a Settings UI addition.

## Goals / Non-Goals

**Goals:**
- No AI key ships inside a distributed build.
- The developer's own existing private build (`main`, with `.env` set) keeps working without any manual re-entry.
- App remains fully functional with no key configured — AI is optional, not required.

**Non-Goals:**
- No key validation against the provider's API (e.g. a test call to confirm the key works) — just a non-empty check before saving. Ladder: a live validation call adds complexity and a network dependency to a settings save; a bad key just means enrichment silently fails later, which is already tolerated behavior.
- No encryption/keychain storage for the API key — same trust boundary as the rest of the on-device SQLite data (device-local, not synced anywhere except the user's own explicit export). Matches how the rest of the app already treats on-device data.
- No per-item provider override — one global provider/key, same as today.

## Decisions

- **Settings-first with `.env` as fallback default, not `.env`-only or Settings-only.** On `enrichContent()` call: `getSetting("aiApiKey")` first; if null/empty, fall back to `process.env.EXPO_PUBLIC_*`. This means the developer's current private build (`main`, real key in `.env`) needs zero changes to keep working, while any build without a `.env` key (a public release) is safe by default — Settings starts empty, AI silently no-ops until the user opts in.
- **Provider + key stored as two separate settings rows (`aiProvider`, `aiApiKey`), single key field shown at a time based on the selected provider.** Simpler UI than showing both an OpenAI and Gemini key field simultaneously; matches the existing single-active-provider model (`EXPO_PUBLIC_AI_PROVIDER` already picks one).
- **Settings screen pre-fills from `.env` on first render if a Settings value isn't already set**, so a developer opening Settings on their own private build sees their key already populated rather than a confusingly-blank field (even though the code path doesn't need it to function — this is purely to avoid "wait, is my key gone?" confusion).

## Risks / Trade-offs

- [API key stored in plain SQLite text, visible to anyone with device/backup access] → same trust model as the rest of the app's on-device data; acceptable since this is the user's own key on their own device, not a shared secret.
- [User doesn't realize AI needs a key and wonders why summaries never appear] → Settings AI section includes a one-line explanation ("optional — leave blank to skip AI summaries") so the no-key state reads as an intentional choice, not a bug.

## Open Questions

None.
