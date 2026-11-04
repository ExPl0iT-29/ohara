# Proposal

## Why

Ohara is going public as a free, local-only app: no accounts, no cloud, no AI. Today every build calls OpenAI or Gemini straight from the app with an API key baked into the APK. That key is extractable from any distributed build and would spend the developer's money for strangers, so it cannot ship. A backend proxy and BYOK were both considered and rejected in favour of the simplest product: a reading app whose data never leaves the phone.

## What Changes

- Remove AI enrichment from the app entirely: the `mobile/src/ai/` module, the post-extraction enrichment step, and the `EXPO_PUBLIC_AI_*` / `EXPO_PUBLIC_*_API_KEY` configuration.
- Stop showing summaries in the reader, and stop using summaries and AI topics in search and in the feed's filter chips. The feed filter becomes tags only.
- **BREAKING (for the private build):** new captures no longer get a summary or topics, and any summaries already in a private library are hidden. The data is not deleted.
- Keep the `summary` and `topics` columns and the entity fields as legacy, always-empty for new items, so existing databases, exports and imports stay compatible. No destructive migration.
- State as a product guarantee that the app has no accounts, no cloud sync, no AI provider calls, and that its only network traffic is fetching the pages the user saves.
- Update the vision, specification and README documents so they no longer promise AI behaviour the product does not have. The ADR guidance on AI stays as direction for if AI ever returns.

**Non-goals:** removing the legacy `backend/` directory or its stale specs (separate housekeeping), changing extraction, adding any replacement for summaries, dropping database columns.

## Capabilities

### New Capabilities
- `local-only-operation`: the app works entirely on-device, with no account, cloud storage, or AI provider, and discloses nothing beyond fetching user-saved URLs.

### Modified Capabilities
- `ai-enrichment`: all requirements removed; enrichment no longer exists.
- `content-search`: search matches title and body only, no longer summary.
- `tagging`: feed filtering is by user tags only, no longer AI topics.
- `home-feed-ui`: filter chip row shows tags only.
- `reader-view`: reader no longer renders a summary section.
- `content-model`: `summary` and `topics` become legacy fields that are never populated.

## Impact

- **Mobile code:** delete `mobile/src/ai/enrich.ts` and `mobile/src/components/reader/ReaderSummary.tsx`; edit `mobile/src/processing/processContent.ts`, `mobile/app/content/[id].tsx`, `mobile/app/index.tsx`, `mobile/src/api/content.ts`, `mobile/src/db/contentRepository.ts`, `mobile/app/_layout.tsx` (stale comment), `mobile/.env.example`.
- **Database:** no schema change.
- **Docs:** `PRODUCT_VISION.md`, `PRODUCT_SPECIFICATIONS.md`, `STACK.md`, README, FEATURES.md, and the Purpose lines of `tagging` and `content-search`.
- **Superseded work:** the `byok-ai-settings` branch is abandoned. The `supabase-auth` and `ai-proxy` proposal branches are kept unmerged as a record only.
- **Release:** this change is a prerequisite for any public build, because it removes the embedded key. Any key used in a private APK should still be revoked after the new build is installed.
