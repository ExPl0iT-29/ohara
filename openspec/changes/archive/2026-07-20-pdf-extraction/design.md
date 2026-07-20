## Context

`processContent.ts` dispatches by `contentType` to an extractor function returning `{ title, description, heroImage, author, extractedText, duration }`. Today only `extractArticle` (HTML) and `extractYoutube` exist. PDFs need their own extractor with the same return shape.

This app runs on Expo/Hermes (no Node APIs, no native modules unless compiled in). The project already hit a real, still-partially-unresolved Windows/CMake native-build path-length wall this session (`react-native-worklets`/Reanimated) — so a **pure-JS** PDF library is strongly preferred over any native PDF module (e.g. `react-native-pdf`, which is a viewer, not a text extractor anyway, and native `react-native-pdf-text` would reintroduce the same native-build risk).

## Goals / Non-Goals

**Goals:**
- Extract raw text from a PDF given its URL, pure-JS/Hermes-compatible, no native rebuild required.
- Derive a usable title even when PDF metadata has none.
- Fail gracefully (status `failed`, reason recorded) for corrupted or text-less (scanned/image-only) PDFs, matching the existing failure contract other extractors use.

**Non-Goals:**
- OCR for scanned/image-only PDFs — out of scope, treated as a failure case.
- Rendering/thumbnailing PDF pages (`heroImage` stays `null`).
- Preserving PDF layout/structure in `extractedText` — plain concatenated text is enough (existing web extractor already produces lightly-tagged HTML-ish text, but a plain-text PDF result is acceptable given other content types already vary in richness).

## Decisions

**PDF library: `pdfjs-dist` (legacy build), worker disabled, text-only path.**
- `pdfjs-dist`'s `legacy/build/pdf.js` entry is CommonJS and avoids some browser-only assumptions in the main build.
- Text extraction (`page.getTextContent()`) does not require Canvas/DOMMatrix — only PDF *rendering* does. Since we never render, we can skip those polyfills entirely by never calling `page.render()`.
- Must set `disableWorker: true` (or use the non-worker API path) since Hermes has no Web Worker support.
- Alternative considered: native modules (`react-native-pdf-text`) — rejected, reintroduces the exact native-build fragility (CMake/path-length) this project already burned significant time on this session, for a single content type.
- Alternative considered: shelling out to a server-side PDF-to-text API — rejected, app is local-first/no-backend by design; would require a hosted service the user doesn't want to run for a personal project.
- Fallback if `pdfjs-dist` proves unworkable in practice during implementation (e.g. Hermes-incompatible syntax deep in its dependency tree): mark this explicitly as an open question resolved during implementation, not assumed solved here.

**Download step: `expo-file-system` to a temp cache file, then read as base64 → convert to the `Uint8Array`/`ArrayBuffer` `pdfjs-dist` expects.**
- Downloading first (rather than streaming into the parser) keeps the extractor simple and matches the existing extractor pattern of one `fetch`-shaped I/O step then a parse step.
- Temp file is deleted after extraction (success or failure) — no permanent PDF storage, matching the app's existing pattern of storing only extracted text/metadata, not source files.

**Title derivation order:** PDF `info.Title` metadata → first non-empty line of extracted text that looks like a heading (short, no trailing punctation) → URL filename (`document.pdf` → `document`) as last resort. Never leave title `null` if any text was extracted at all.

**Failure classification:** if `getTextContent()` across all pages yields zero non-whitespace characters, treat as `failed` with reason `"no extractable text (scanned or image-only PDF)"` — same shape as other extractor errors already recorded via `metadata.processingError`.

## Risks / Trade-offs

- [`pdfjs-dist` may be heavy for a mobile bundle / slow on-device for large PDFs] → Mitigate by capping processed pages (e.g. first 200 pages) and setting a reasonable extraction timeout; document actual bundle-size impact once installed, revisit if it's unacceptable.
- [Hermes JS engine compatibility of `pdfjs-dist`'s internals is unverified until implementation] → Flagged as the primary implementation risk; if it doesn't run under Hermes, task list must include a fallback spike (e.g. `pdf-parse`-style minimal from-scratch text-stream extractor) before considering this change done.
- [Large PDFs downloaded fully into memory/base64 could be slow or memory-heavy] → Acceptable for a personal-library-scale app (same assumption already made for LIKE-based search over FTS5 elsewhere in this codebase); revisit only if it becomes a real problem.

## Migration Plan

No data migration — this only adds a new extractor branch for an existing `contentType` value that previously always failed. Any pre-existing `pdf` entities stuck in `failed` status get naturally retried through the existing "sweep failed/stuck on launch" mechanism if the user re-triggers processing, or can be manually retried via the existing per-item Retry button (`retryContent`).

## Open Questions

- Does `pdfjs-dist` actually run under Hermes without polyfills beyond what's listed here? Resolve empirically in the first implementation task before writing the rest of the extractor.
- Is a page-count/size cap needed for very large PDFs (some linked papers/whitepapers can be 100+ pages)? Decide based on real on-device timing once the extractor works end-to-end.
