## 1. Data model

- [ ] 1.1 Add `isStub` column to `mobile/src/db/database.ts` (additive migration, default `0`, same pattern as `archivedAt`/`tags`/`scrollProgress`/`highlights`)
- [ ] 1.2 Extend `ContentRow`, `rowToItem`, `updateContentRow` in `mobile/src/db/contentRepository.ts` for `isStub`
- [ ] 1.3 Extend `ContentItem` in `mobile/src/api/content.ts` with `isStub: boolean`

## 2. Extractor change

- [ ] 2.1 In `mobile/src/extraction/extractArticle.ts`, no fetch/scrape logic changes needed — the extractor already returns `extractedText: null` when body scrape is empty; expose that state to the caller
- [ ] 2.2 In `mobile/src/processing/processContent.ts`, after extraction succeeds, set `isStub: true` when `result.extractedText` is null/empty (regardless of whether meta fields are present), `isStub: false` otherwise

## 3. Reader UI

- [ ] 3.1 In `mobile/app/content/[id].tsx`, when `status === "ready" && isStub`, render title/description/heroImage plus a prominent "Open original link" button, skip the reader body entirely
- [ ] 3.2 Confirm archive/tag/highlight controls remain available for stub items (no special-casing needed there — they operate on the entity regardless of `isStub`)

## 4. Spec correction

- [ ] 4.1 Confirm `openspec/specs/processing-pipeline/spec.md`'s "Unsupported Content Types Fail Gracefully" requirement no longer implies `tweet`/`reddit`/etc. always fail outright (superseded by the new stub-success path when meta tags exist)

## 5. Verification

- [ ] 5.1 `npx tsc --noEmit` clean
- [ ] 5.2 On-device: capture an X/Twitter post URL — confirm it reaches `ready` with `isStub: true`, title/description populated from meta tags, reader shows preview + "Open original link"
- [ ] 5.3 On-device: capture a public Notion page URL — confirm same stub behavior
- [ ] 5.4 On-device: capture a normal blog URL — confirm `isStub` stays `false` and full reader experience is unaffected
- [ ] 5.5 Sync spec deltas into `openspec/specs/processing-pipeline/spec.md` and `openspec/specs/reader-view/spec.md`, archive the change
