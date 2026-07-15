## 1. Google Docs extractor

- [ ] 1.1 Add `mobile/src/extraction/extractGoogleDoc.ts`: given a doc URL, extract the doc id via regex, fetch `https://docs.google.com/document/d/<id>/export?format=txt`
- [ ] 1.2 Detect non-public docs (non-OK response, or body looks like an HTML sign-in/request-access page rather than plain text) and throw a clear error
- [ ] 1.3 Derive `title` from the first non-empty line of the exported text
- [ ] 1.4 Compute `readingTime` via existing `computeReadingTime`
- [ ] 1.5 Set `heroImage`/`author` to `null`

## 2. Wire into processing pipeline

- [ ] 2.1 Update `mobile/src/processing/processContent.ts`: change `getExtractor` to accept `(url, contentType)`, check the Google Docs URL pattern first and route to `extractGoogleDoc` regardless of `contentType`, otherwise fall back to existing dispatch
- [ ] 2.2 Update `processContent`'s call site to pass `item.url` into `getExtractor`

## 3. Verification

- [ ] 3.1 `npx tsc --noEmit` clean
- [ ] 3.2 On-device: capture a real public Google Doc link (any `contentType`) — confirm it reaches `ready` with populated title/extractedText/readingTime
- [ ] 3.3 On-device: capture a private/restricted Google Doc link — confirm it reaches `failed` with a clear "not publicly viewable" reason, no crash
- [ ] 3.4 Sync spec delta into `openspec/specs/processing-pipeline/spec.md` and archive the change
