## Why

Google Docs links shared with "anyone with the link can view" currently get routed through the generic HTML extractor, which hits Google's login/JS shell and returns empty or garbage `extractedText` — even though Google exposes a plain-text export endpoint for public docs that a simple fetch can use.

## What Changes

- Detect `docs.google.com/document/d/<id>/...` URLs at capture/processing time (independent of the user-picked `contentType`, since a user might tag a Google Doc as "documentation" or "other").
- Add a Google Docs extractor that fetches `https://docs.google.com/document/d/<id>/export?format=txt`, extracts the doc title from the first line (or a `<title>` fallback fetch of the normal doc URL), and computes `readingTime` from the extracted text like other content types.
- If the export endpoint returns non-text content (HTML login/sharing wall — meaning the doc isn't publicly viewable), mark the entity `failed` with a reason indicating the doc isn't public.

## Capabilities

### New Capabilities
(none — modifies the existing processing-pipeline capability)

### Modified Capabilities
- `processing-pipeline`: adds Google Docs URL detection and a dedicated extraction path, plus a new failure scenario for non-public docs.

## Impact

- `mobile/src/extraction/` — new `extractGoogleDoc.ts`
- `mobile/src/processing/processContent.ts` — `getExtractor` gains URL-pattern-based detection (checked before falling back to `contentType`-based dispatch)
- `openspec/specs/processing-pipeline/spec.md` — requirement delta
