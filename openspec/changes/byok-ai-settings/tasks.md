## 1. AI config source

- [ ] 1.1 In `mobile/src/ai/enrich.ts`, read `getSetting("aiProvider")`/`getSetting("aiApiKey")` first, falling back to `process.env.EXPO_PUBLIC_AI_PROVIDER`/`EXPO_PUBLIC_GEMINI_API_KEY`/`EXPO_PUBLIC_OPENAI_API_KEY` when the setting is null/empty
- [ ] 1.2 Keep existing try/catch/no-op-on-failure behavior unchanged

## 2. Settings UI

- [ ] 2.1 Add an AI section to `mobile/app/settings.tsx`: provider pill picker (Gemini/OpenAI), API key `TextInput` (secure/masked entry), one-line "optional — leave blank to skip AI summaries" explanation
- [ ] 2.2 Pre-fill the key field from `process.env.EXPO_PUBLIC_*` if no `aiApiKey` setting exists yet, so an existing private build's key shows up without re-entry
- [ ] 2.3 Save via `setSetting("aiProvider", ...)` / `setSetting("aiApiKey", ...)` on change/blur, non-empty check only (no live validation call)

## 3. Verification

- [ ] 3.1 `npx tsc --noEmit` clean
- [ ] 3.2 On-device: with no `.env` key and nothing set in Settings, capture and read an article — confirm extraction/reading works and no summary appears (no crash, no failed status)
- [ ] 3.3 On-device: enter a real key in Settings, capture a new article, confirm summary/topics populate
- [ ] 3.4 On-device: confirm existing `.env`-configured key still works without any Settings changes (fallback path)
- [ ] 3.5 Sync spec deltas into `openspec/specs/` and archive the change per the established workflow
- [ ] 3.6 Do NOT merge `feature/byok-ai-settings` into `main` — leave it as a standalone branch per explicit instruction
