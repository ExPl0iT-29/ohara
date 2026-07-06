## Context

`mobile/app/content/[id].tsx` currently calls `useContentItem(id)` (React Query wrapper around `getContent(id)` from `mobile/src/api/content.ts`) and dumps `title`, `status`, `summary`, `extractedText` as plain `<Text>` nodes with no typography treatment, no handling of `pending`/`processing`/`failed` states beyond generic loading/error, and no use of `heroImage`, `author`, `readingTime`, or `description`. `ContentItem` (from reader-api) already carries everything needed: `title`, `description`, `summary`, `heroImage`, `author`, `extractedText`, `readingTime`, `topics`, `status`, `contentType`, `url`, `source`. Styling is via NativeWind (Tailwind classes on RN components). Navigation is Expo Router file-based routing; this screen is reached from the (still-placeholder) feed at `mobile/app/index.tsx`.

DESIGN.md establishes the Reader as the most important screen: content-as-hero, generous typography, calm/no-guilt empty and pending states, AI as invisible/optional. This design is scoped to the single reader screen only — no navigation changes, no offline/progress features (explicitly deferred, see Non-Goals).

## Goals / Non-Goals

**Goals:**
- Render a genuinely readable article view: hero image, title, byline (author/source/reading time), optional AI summary, then full body text in comfortable reading typography.
- Cover every `ContentStatus` value (`pending`, `processing`, `ready`, `failed`) plus the two React Query states (`isLoading`, `error`/not-found) with a distinct, calm treatment for each — never a raw null or an alarming error screen for normal in-progress states.
- Make summary/topics genuinely optional in layout — their absence shifts nothing else out of place or leaves visible gaps.
- Keep this a pure frontend, presentation-layer change: no new API calls beyond the existing `getContent(id)`.

**Non-Goals:**
- Reading progress tracking / "resume where you left off" (DESIGN.md mentions it, but it needs persistence design of its own — separate future change).
- Offline caching of article text/images (DESIGN.md's "optional offline access" — separate future change, needs its own storage design).
- Feed/list screen redesign (`mobile/app/index.tsx`) — out of scope, covered by `home-feed-ui`.
- Capture/save UI — covered by `capture-ui`.
- Dark mode theming system — reader should respect whatever theme mechanism the app shell already has (or plain light styling if none exists yet); introducing a new theming system is out of scope.
- Rich text / markdown rendering of `extractedText` — treated as plain readable text (extraction already normalizes to text per processing-pipeline spec).

## Decisions

**Component structure**: Split the screen into small presentational pieces under `mobile/src/components/reader/` (e.g. `ReaderHeader`, `ReaderBody`, `ReaderStatusNotice`) rather than one large inline JSX blob, so each state (pending/processing/failed/ready) and each content block (metadata vs. body) stays independently readable and testable. Rationale: the placeholder's flat structure is exactly what produced the current dump-everything behavior; alternative of keeping it monolithic was rejected because it doesn't scale to 4+ distinct states cleanly.

**Status handling as an explicit switch, not implicit null-checks**: Branch first on `data.status` (`pending` | `processing` | `failed` | `ready`) after the item is found, rather than inferring state from which fields happen to be null. Rationale: `extractedText` being null is the reliable signal for "no body yet," but conflating that with network `error` (not-found/network failure) was the placeholder's bug — a `pending` item and a genuine 404 both fell into the same generic paths. Alternative considered: keep relying on field presence only — rejected because `failed` content still has partial fields (title, url) that should render, which pure null-checking doesn't express well.

**`failed` status still renders available metadata**: Per proposal, apply the "AI is invisible infrastructure" principle transitively — a `failed` extraction still has `title`/`url`/`source` from capture, so show those plus a calm notice and a link to open the original `url`, instead of an error screen. Rationale: directly required by PRODUCT_VISION.md ("reading first") and by the proposal's explicit failed-status handling requirement.

**Typography via NativeWind utility classes, no new dependency**: Use Tailwind's built-in `prose`-like spacing/leading utilities (`leading-relaxed`, `max-w-*` equivalents via `className` width constraints, `text-lg`/`text-base` scale) already available through NativeWind, rather than pulling in a markdown/rich-text renderer. Rationale: `extractedText` is plain text (Non-Goal: rich rendering), so a dedicated body-text component with fixed font scale/line-height/max-width classes is sufficient and keeps the dependency footprint at zero. Alternative (a full "reader mode" library) rejected as overkill for plain-text content and against Non-Goals.

**Hero image via RN `Image`/Expo `Image` with graceful fallback**: If `heroImage` is null, header layout collapses gracefully (no broken image icon, no reserved blank box) rather than reserving fixed space. Rationale: matches DESIGN.md's "Cards should feel alive" / avoid dead visual placeholders, and keeps content types without hero images (e.g. `github`, `tweet`) from looking broken.

## Risks / Trade-offs

- [Long `extractedText` (e.g. long-form articles/videos with transcripts) could make the `ScrollView` heavy] → Not addressed in this change (virtualization is a performance concern, not correctness); acceptable given current content sizes, revisit if real usage shows jank.
- [No design system/theme tokens exist yet in `mobile/src/` beyond raw Tailwind defaults] → This change uses plain Tailwind neutral/warm-gray classes matching DESIGN.md's "warm neutrals, soft grays" guidance directly, rather than waiting on a shared theme file; if a shared theme is introduced later, these classes are straightforward to swap.
- [`readingTime` may be null for content types where it isn't computed, or before processing completes] → Byline component omits the reading-time chip entirely when null rather than showing "0 min" or placeholder text.
- [Distinguishing `pending` vs `processing` may be a distinction without a difference for the reader UI] → Both get the same "still being prepared" notice copy in this change; if product feedback later wants them differentiated, that's a low-risk follow-up.

## Migration Plan

Purely additive/replacement UI change to one screen and new component files; no data migration. Roll out by replacing `mobile/app/content/[id].tsx` directly — if issues arise, revert the single file (no backend or schema coupling, so rollback is a simple git revert).

## Open Questions

- Exact visual polish (specific color tokens, font family choice) is left to implementation time / a future design pass — this design fixes structure and behavior, not final pixel values, consistent with DESIGN.md being a philosophy doc rather than a UI spec.
- Whether "open original URL" for `failed` content opens in an in-app browser or the system browser is an implementation detail deferred to tasks/build time.
