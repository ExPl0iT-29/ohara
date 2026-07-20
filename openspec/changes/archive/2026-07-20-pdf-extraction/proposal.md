## Why

Users capture direct PDF links (papers, whitepapers, guides) into Ohara today, but `contentType: "pdf"` has no extractor — it's explicitly listed as unsupported and always marked `failed`. This means a whole class of the user's saved reading material never becomes readable in-app.

## What Changes

- Add a real PDF text extractor: download the PDF via `expo-file-system`, extract text with a pure-JS/RN-compatible library, derive a title (PDF metadata title, falling back to filename), and compute `readingTime` from the extracted text the same way web content does.
- Remove `pdf` from the "Unsupported Content Types Fail Gracefully" list in `processing-pipeline` spec.
- Add new scenarios: successful PDF extraction, and graceful failure for corrupted or scanned/image-only (no extractable text) PDFs — `failed` status with reason recorded, no crash.
- `heroImage` and `author` remain `null` for PDFs (already nullable for other content types).

## Capabilities

### New Capabilities
(none — this modifies the existing processing-pipeline capability)

### Modified Capabilities
- `processing-pipeline`: `contentType: "pdf"` moves from the unsupported/always-failed list to a supported extractor with its own success/failure scenarios.

## Impact

- `mobile/src/extraction/` — new `extractPdf.ts`
- `mobile/src/processing/processContent.ts` — `getExtractor` routes `pdf` to the new extractor
- `mobile/package.json` — new PDF-text-extraction dependency (RN-compatible, chosen in design.md)
- `openspec/specs/processing-pipeline/spec.md` — requirement delta
