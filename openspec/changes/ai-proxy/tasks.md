# Tasks

## 1. Quota schema

- [ ] 1.1 Write `supabase/migrations/*_ai_quota.sql`: `user_entitlements`, `plan_limits` (seeded free and premium), `ai_usage_events` with unique `(user_id, request_key)`, cascade deletes from `auth.users`, RLS own-row select only. Verify with SQL tests that a client can read its own rows, cannot read another user's, and cannot insert, update or delete any of the three tables.
- [ ] 1.2 Add `admit_ai_request`, `refund_ai_request` (service-role only) and `get_my_ai_usage`. Verify with SQL tests: a free user is admitted up to the limit then denied; the same key twice charges once; refund restores the count; the month boundary resets the count; calling the admit function as an authenticated client is rejected.
- [ ] 1.3 Add a concurrency test that fires parallel admits at a user with one request remaining. Verify exactly one is admitted.
- [ ] 1.4 Run the Supabase security advisor. Verify no new table lacks RLS and no function is executable by `anon`.

## 2. Enrich edge function

- [ ] 2.1 Create `supabase/functions/enrich/` with the `AIProvider` interface, `OpenAIProvider`, `GeminiProvider` and a selector driven by secrets. Verify with unit tests that each provider maps a canned response to `{summary, topics}` and that switching `AI_PROVIDER` switches the implementation.
- [ ] 2.2 Implement the server prompt, input truncation, output cap, JSON-mode calls and response validation (summary string, at most 5 topics). Verify with tests that malformed output yields an error and that client-supplied `prompt` or `model` fields are ignored.
- [ ] 2.3 Implement the handler flow from design D4 including JWT verification, the daily cap, admit, provider call with a 20 s timeout, and refund on failure. Verify with function tests for: 401 without a token, 429 with tier and reset date at the limit, 503 on provider failure with the charge refunded, 503 at the daily cap, and 200 with usage on success.
- [ ] 2.4 Verify the function neither logs nor stores article text or summary: grep the function source for log statements touching the body, and inspect the function logs after a real call.
- [ ] 2.5 Set the function secrets and deploy. Verify with curl and a real test-account token that a summary is returned and the usage count increments by one.

## 3. Mobile client

- [ ] 3.1 Rewrite `mobile/src/ai/enrich.ts` to call the proxy through the auth accessor, with the `requestKey` from design D7, mapping every non-200 and network error to `null`. Verify with unit tests for each status code, and that signed-out makes no network call.
- [ ] 3.2 Remove all provider code and the `EXPO_PUBLIC_AI_*` entries from `.env.example`. Verify by grepping the repo and the built bundle for `api.openai.com`, `generativelanguage` and the key variable names, with zero hits.
- [ ] 3.3 Add `enrichPending(limit)` per design D8, wired after sign-in and after the deferred launch reprocess, stopping on the first 401, 429 or 503. Verify with tests that it processes newest first, respects the limit, and stops on 429, and by measuring that launch time with the sweep is not slower than the current baseline in `mobile/src/perf.ts`.
- [ ] 3.4 Add the usage line to the Settings Account section via `get_my_ai_usage`. Verify on a device: shows used of allowed with reset date when signed in, and hidden when signed out.
- [ ] 3.5 Verify the existing behaviour is intact: with AI failing (airplane mode) a captured item still reaches `ready` and is readable, and is never marked `failed` by enrichment.

## 4. Key rotation and documentation

- [ ] 4.1 After the new build is installed, revoke and replace the OpenAI and Gemini keys used in earlier private APKs, and store the new keys only as Supabase function secrets. Verify the old keys return 401 from each provider and that the proxy still returns summaries.
- [ ] 4.2 Update the README architecture table (AI row), `STACK.md` AI notes, and the `supabase/README.md` with secrets, limits tuning (`plan_limits`) and the emergency switch (`AI_DAILY_CAP=0`). Verify the documented commands work as written.

## 5. Integration

- [ ] 5.1 Run end to end on a release build with a fresh account: sign in, capture articles, see summaries, hit the free limit, see calm usage text and no errors, then confirm reset behaviour by moving a usage event's period in a test database.
- [ ] 5.2 Walk every scenario in `ai-proxy`, `ai-quota` and the `ai-enrichment` delta against observed behaviour and record the result in the change notes.

## Workflow follow-up

- Archive after review. `premium-billing` becomes the only writer of `tier = 'premium'`.
- Record Play Integrity as a follow-up if abuse monitoring shows farmed accounts.
