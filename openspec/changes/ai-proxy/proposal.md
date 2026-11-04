# Proposal

## Why

AI summaries and topics are called straight from the app with an OpenAI or Gemini key baked into the APK. That key is extractable from any distributed build, and every install would spend the developer's money. A public release needs the key to live on a server, with per-user limits so a free tier is sustainable and premium can offer more. The BYOK route was rejected; this is its replacement. `supabase-auth` supplies the verified identity this change relies on.

## What Changes

- Add a Supabase Edge Function `enrich` that verifies the caller's session, enforces a monthly quota by tier, calls OpenAI or Gemini behind a provider interface, and returns `{ summary, topics }`.
- The **server owns the prompt, model name, input size cap and output cap**. The client sends only article text, so the proxy cannot be used as a general-purpose LLM.
- Add tiered quotas (`free`, `premium`) stored in a database table, so limits can be tuned without an app release. Retries of the same request never double-charge.
- Add a minimal entitlements table holding each user's tier (default `free`). `premium-billing` will be the only writer of `premium`.
- Add a global daily request cap as a spend circuit breaker.
- Mobile `enrichContent()` calls the proxy instead of a provider. Signed-out users get no AI. Quota exhaustion degrades silently to "no summary" and the Settings screen shows usage.
- Backfill: when signed in with quota available, items that are `ready` with text but no summary are enriched newest-first, a few per sweep.
- **BREAKING:** remove `EXPO_PUBLIC_AI_PROVIDER`, `EXPO_PUBLIC_GEMINI_API_KEY`, `EXPO_PUBLIC_OPENAI_API_KEY` and every provider call from the app. The existing private build stops summarising until signed in.
- Rotate and revoke the provider keys that shipped in any earlier private APK.

**Non-goals:** payments and setting `premium` (`premium-billing`), Play Integrity attestation (flagged as a follow-up), semantic search or embeddings, any change to extraction, which stays on-device.

## Capabilities

### New Capabilities
- `ai-proxy`: authenticated server-side enrichment endpoint with provider abstraction, server-owned prompt and limits, and no storage of article text.
- `ai-quota`: per-tier monthly AI allowance, idempotent charging, global spend cap, and usage visibility to the user.

### Modified Capabilities
- `ai-enrichment`: enrichment now requires a signed-in account and goes through the proxy; provider and model are server configuration.

## Impact

- **Backend:** `supabase/functions/enrich/`, migrations for `user_entitlements`, `plan_limits`, `ai_usage_events`, and a quota RPC, all with row-level security and cascade delete from `auth.users`. Secrets: provider keys and `AI_PROVIDER` as function secrets only.
- **Mobile:** `mobile/src/ai/enrich.ts` rewritten to use the authenticated client from `mobile/src/auth/`; Settings gains an AI usage line; `.env.example` loses the AI key entries.
- **Privacy:** article text now leaves the device to Supabase and a model provider. Disclosure belongs in `public-release-compliance`.
- **Depends on:** `supabase-auth` (identity, Supabase project, `supabase/` layout).
- **Cost:** about $0.0004 per summary at current small-model prices (verify at implementation time), so free-tier worst case is cents per user per month.
