## 1. Spike: pdfjs-dist under Hermes

- [x] 1.1 Install `pdfjs-dist`, try loading `legacy/build/pdf.js` with `disableWorker: true` in the RN app and calling `getTextContent()` on a small test PDF — confirm it runs under Hermes without crashing
- [x] 1.2 If it fails under Hermes: research/spike a minimal alternative pure-JS PDF text-stream parser; document the chosen path before continuing

## 2. PDF extractor

- [x] 2.1 Add `mobile/src/extraction/extractPdf.ts`: download PDF via `expo-file-system` to a temp cache file, parse with the library chosen in step 1, extract text across pages (cap at first 200 pages)
- [x] 2.2 Derive `title`: PDF metadata `info.Title` → first heading-like line of extracted text → URL filename fallback
- [x] 2.3 Compute `readingTime` via existing `computeReadingTime` on the extracted text
- [x] 2.4 Set `heroImage`/`author` to `null` (or from PDF metadata author field if present)
- [x] 2.5 Delete the temp downloaded file after extraction (success or failure)
- [x] 2.6 Throw a clear error for corrupted/unparseable PDFs (caught by existing `processContent` try/catch → `failed`)
- [x] 2.7 Throw a clear error when extracted text is empty/whitespace-only (scanned/image-only PDF) — distinct message recorded in `metadata.processingError`

## 3. Wire into processing pipeline

- [x] 3.1 Update `mobile/src/processing/processContent.ts`'s `getExtractor` to route `contentType === "pdf"` to `extractPdf`
- [x] 3.2 Add `pdfjs-dist` (or chosen alternative) to `mobile/package.json`

## 4. Verification

- [x] 4.1 `npx tsc --noEmit` clean
- [x] 4.2 On-device: capture a real PDF URL with normal text (e.g. an arxiv paper) — confirm it reaches `ready` with populated title/extractedText/readingTime
- [x] 4.3 On-device: capture a scanned/image-only PDF URL — confirm it reaches `failed` with a clear reason, no crash
- [x] 4.4 On-device: capture a broken/non-PDF URL with contentType forced to `pdf` — confirm graceful `failed`, no crash
- [x] 4.5 Sync spec delta into `openspec/specs/processing-pipeline/spec.md` and archive the change
