## Why

AI enrichment currently reads `EXPO_PUBLIC_AI_PROVIDER`/`EXPO_PUBLIC_GEMINI_API_KEY`/`EXPO_PUBLIC_OPENAI_API_KEY` from build-time env vars, baked into the compiled app. That's acceptable for a private single-device build the developer controls, but it's a hard blocker for any public distribution (Play Store or a shared APK link): the key is trivially extractable from the built binary, and every install would silently use the developer's own key, draining their quota/billing from strangers' usage. Moving key entry to a Settings screen the user fills in themselves removes this exposure entirely — no key ships in the build, no cost falls on the developer.

## What Changes

- Settings screen gains an AI section: provider picker (Gemini/OpenAI) and an API key text input, stored on-device via the existing `settings` key-value table.
- `enrichContent()` reads the configured provider/key from `settings` instead of `process.env`.
- If no key is configured, enrichment silently no-ops (already existing failure-tolerant behavior per `ai-enrichment`'s "never revert status" requirement) — the rest of the app (extraction, reading, search, tags, archive) is fully usable with zero AI configuration.
- `.env`-based AI config remains supported as a fallback default (pre-fills the Settings fields on first load if present) so the developer's own private build keeps working without re-entering anything, but Settings values take precedence once set.

## Capabilities

### Modified Capabilities
- `ai-enrichment`: AI provider and API key are sourced from on-device settings (with `.env` as an initial fallback default) rather than exclusively from build-time env vars.

## Impact

- `mobile/src/ai/enrich.ts` — read provider/key via `getSetting("aiProvider")`/`getSetting("aiApiKey")`, falling back to `process.env.EXPO_PUBLIC_*` when no setting is stored yet.
- `mobile/app/settings.tsx` — new AI section: provider pill picker + key `TextInput`, save via `setSetting`.
- No new dependencies, no schema changes (the `settings` table already exists and is generic key-value).
- Not merged to `main` yet — stays on `feature/byok-ai-settings` per explicit instruction, since `main` is still the developer's private single-user build.
