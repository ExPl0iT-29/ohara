# Design

## Context

`mobile/src/ai/enrich.ts` calls OpenAI or Gemini directly with `EXPO_PUBLIC_*` keys and hardcoded model names (`gpt-4o-mini`, `gemini-2.0-flash`). `processContent` runs it once after extraction. The legacy FastAPI `AIProvider` abstraction in `backend/` is unused by the app. `supabase-auth` provides the Supabase project, the `supabase/` directory and an authenticated client behind `mobile/src/auth/`. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- No provider credential, model name or prompt in the app.
- Per-tier monthly limits that can be retuned without a release.
- Cost bounded even under abuse.
- AI stays "quiet" (ADR-004): every failure degrades to "no summary".

**Non-Goals:**
- Setting `premium` (owned by `premium-billing`).
- Device attestation (see D9).
- Streaming responses, chat, or embeddings.

## Decisions

### D1. Supabase Edge Function, provider interface inside it
`supabase/functions/enrich/` (Deno, TypeScript) holds an `AIProvider` interface with `OpenAIProvider` and `GeminiProvider`, selected by the `AI_PROVIDER` secret, with model names in secrets too. This keeps ADR-011 (providers behind an interface) and the "no hardcoded model names" rule, and removes a host: JWT verification and the database are in the same platform.
*Alternative:* revive FastAPI on Render. Rejected in exploration: extra paid always-on host, cold starts, hand-written JWT checks.

### D2. Schema: entitlements, limits, usage events
- `user_entitlements(user_id pk → auth.users on delete cascade, tier check in ('free','premium'), updated_at)`. A missing row means `free`, so no trigger change to `profiles` is needed.
- `plan_limits(tier pk, monthly_ai_requests int, max_input_chars int)`, seeded with a hypothesis (free 30, premium 1000) that the launch plan's cost model will confirm or change.
- `ai_usage_events(id, user_id → auth.users on delete cascade, request_key text, period date, created_at, unique(user_id, request_key))`.
- RLS on all three: users may `select` only their own rows; **no** insert, update or delete policy for clients. Writes happen only through service-role code paths.

Counting rows (not a mutable counter) makes refunds a delete, makes idempotency a unique constraint, and gives an audit trail without storing any content.

### D3. Atomic admit/refund via two SQL functions
`admit_ai_request(user, key)` runs in one transaction: take `pg_advisory_xact_lock(hashtext(user))`; if the key already exists, return admitted without a second charge; otherwise count events in the current UTC month, compare with the tier's limit, insert the event if under, and return `{admitted, used, limit, resets_at}`. `refund_ai_request(user, key)` deletes the event. Both are `security definer` and executable only by `service_role`. The per-user advisory lock is what stops parallel requests from exceeding the limit.

### D4. Request flow

```
app ──JWT + {text, requestKey}──► enrich (edge fn)
                                   │ 1 verify JWT → user id
                                   │ 2 daily global cap? ── yes ─► 503
                                   │ 3 admit_ai_request ── denied ─► 429 {tier, resetsAt}
                                   │ 4 truncate text, build server prompt
                                   │ 5 provider.summarize (timeout 20s)
                                   │     └ fail/unparseable ─► refund ─► 503
                                   ▼
                               200 {summary, topics, usage}
```

No step writes the article text or summary anywhere.

### D5. Server-owned prompt and structured output
The prompt, the input cap (`max_input_chars`, starting at the current 8000) and an output token cap live in the function. Providers are called in JSON mode (`response_format` for OpenAI, `responseMimeType: application/json` for Gemini), and the result is validated to `{summary: string, topics: string[≤5]}`. This stops the endpoint being reused as a free general LLM and removes the current regex-extraction fragility.

### D6. Global daily cap by counting events
A `AI_DAILY_CAP` secret is compared with the number of `ai_usage_events` created since UTC midnight (indexed on `created_at`). No extra table. Set well above expected load so it only trips under abuse.

### D7. Client wiring
`enrich.ts` uses the authenticated accessor from `mobile/src/auth/` to invoke `enrich`. `requestKey` is `contentId` plus a short SHA-256 of the text (`expo-crypto`, already a dependency), so a retry is free but re-summarising changed text is a new request. Any non-200 maps to `null`. A 429 additionally records "quota exhausted until <date>" in memory so the backfill sweep stops without more calls.

### D8. Backfill sweep
After sign-in, and at launch after the existing deferred stuck-content reprocess, run `enrichPending(limit)` over `ready`, text-bearing, summary-less items newest first (default 5 per sweep, so launch cost stays low, matching the earlier launch-time optimisation). Stop on first 429/401/503.

### D9. No device attestation in v1
Play Integrity would block scripted abuse but needs Play Console linkage, fails on dev builds, and cannot be tested before the first upload. Compensating controls: sign-in required, per-user quota, global daily cap, and a per-call cost of a fraction of a cent. Worst case with 1,000 farmed free accounts is about $12 a month at current prices (verify at implementation). Revisit if monitoring shows farming.

### D10. Usage visibility
`get_my_ai_usage()` returns used, limit and reset for `auth.uid()` only. Settings shows "AI summaries 12 / 30 this month". Calm wording, no countdown or guilt (ADR-010).

## Risks / Trade-offs

- **Retry of an already-successful key re-calls the provider without charge** → rare because summaries are stored; bounded by the global cap.
- **One attacker trips the global cap for everyone** → cap set far above normal load; per-user quota limits what any single account can add; an alert fires at 80% of the cap.
- **Article text transits Supabase and a model provider** → privacy disclosure and policy are owned by `public-release-compliance`; the function does not log or store text (spec-enforced).
- **Provider model deprecations** (Gemini 2.0 Flash may already be near end of life) → model is a secret, so swapping is a config change.
- **Edge Function cold start or timeout** → client treats it as "no summary" and the sweep retries later.
- **Existing private build loses AI** → acceptable; sign in restores it.
- **Seed limits are guesses** → stored in `plan_limits`, tuned after the cost model and closed-testing usage data.

## Migration Plan

1. Apply migrations and set function secrets (`AI_PROVIDER`, provider keys, model names, `AI_DAILY_CAP`).
2. Deploy `enrich` and verify with curl and a test account.
3. Ship the app build that calls the proxy and has no provider keys.
4. After that build is installed, **revoke and rotate** the OpenAI and Gemini keys used in earlier private APKs.
5. Rollback: set `AI_DAILY_CAP=0` to disable AI instantly; the app degrades to no summaries.

## Open Questions

- Final free and premium allowances: decided after the cost model in the launch plan and closed-testing data; the schema does not change.
