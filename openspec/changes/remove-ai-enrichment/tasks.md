# Tasks

## 1. Remove the AI code path

- [x] 1.1 Delete `mobile/src/ai/enrich.ts` and remove the enrichment import and block from `mobile/src/processing/processContent.ts`. Verify `cd mobile && npx tsc --noEmit` passes and a grep for `enrichContent` returns nothing.
- [x] 1.2 Remove `EXPO_PUBLIC_AI_PROVIDER`, `EXPO_PUBLIC_GEMINI_API_KEY` and `EXPO_PUBLIC_OPENAI_API_KEY` from `mobile/.env.example` and update the stale AI comment in `mobile/app/_layout.tsx`. Verify a repo-wide grep for `EXPO_PUBLIC_`, `openai` and `gemini` finds no app code or config (docs and history excepted).
- [ ] 1.3 Capture a new article on a device or emulator. Verify it reaches `ready` with `summary` null and `topics` empty, and that airplane mode no longer matters to its final status.

## 2. Remove AI from the UI and queries

- [ ] 2.1 Delete `mobile/src/components/reader/ReaderSummary.tsx` and its use in `mobile/app/content/[id].tsx`. Verify the reader renders an item that has a legacy summary without any summary block or gap.
- [ ] 2.2 Drop `summary LIKE ?` from the search clause and `topics LIKE ?` from the tag filter clause in `mobile/src/db/contentRepository.ts`; make the chip helper tags-only and rename `getAllTagsAndTopics` and `getAllTagsAndTopicsList` accordingly. Verify `npx tsc --noEmit` passes, searching for text found only in a legacy summary returns nothing, and legacy topics no longer appear as chips.
- [ ] 2.3 Verify the legacy columns still round-trip: export a library containing an item with a non-empty summary and topics, import it into a clean install, and compare the two rows. Verify the values are identical and the database schema is unchanged.

## 3. Documentation

- [x] 3.1 Update `PRODUCT_VISION.md` ("AI Should Work Quietly") and `PRODUCT_SPECIFICATIONS.md` ("AI Features") to mark AI as not part of the current product, leaving ADR-004 and ADR-011 unchanged. Verify the diff touches only those sections and flag it in the PR description for review.
- [x] 3.2 Update `STACK.md` (remove the AI section), the README tagline, architecture table and "Why", and `FEATURES.md` (mark AI enrichment removed). Verify no README or FEATURES line still describes on-device AI summarisation or an embedded key.
- [x] 3.3 Edit the Purpose lines of `openspec/specs/tagging/spec.md` and `openspec/specs/content-search/spec.md` so they no longer mention AI topics or summaries. Verify with grep that neither file contains "AI-generated".

## 4. Integration

- [ ] 4.1 Run a release build over an existing private install. Verify the old library opens, old items read normally, search and tag filters work, backup export and import work, and new captures are extracted with no network calls to OpenAI or Gemini (check with a proxy or logcat).
- [ ] 4.2 Inspect the built bundle. Verify it contains no provider key and no `api.openai.com` or `generativelanguage` strings.
- [ ] 4.3 Walk each scenario in the `local-only-operation` spec and the modified specs against observed behaviour and note the result in the PR.

## Workflow follow-up

- After the new build is installed, revoke the OpenAI and Gemini keys used in earlier private APKs.
- Archive this change after review. Then proceed with `public-release-readiness`.
