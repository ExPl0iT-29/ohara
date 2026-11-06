# Handoff for Claude

Context for the next Claude session working on Ohara. Written 6 November 2026. Read this, then `CLAUDE.md` and every file in `openspec/specs/` before changing anything.

## What Ohara is now

A **free, Android-only, local-only read-later app**. No accounts, no cloud, no AI, no ads, no analytics. Everything (storage, extraction, search, backup) runs on the phone in SQLite. Application ID `com.ember.ohara` (permanent once uploaded to Play). The owner is preparing the first Google Play release.

The owner explicitly decided against accounts, Supabase, an AI proxy and BYOK. **Do not reintroduce AI, accounts, sync or any network service** unless the owner asks; if they do, the privacy policy, `docs/launch/data-handling.md` and the Play Data safety answers must change first (see the `privacy-disclosure` spec).

## Repository map

| Path | What it is |
|---|---|
| `mobile/` | Expo SDK 57 / React Native 0.86 app (Expo Router, NativeWind v4, React Query, expo-sqlite) |
| `mobile/android/` | **Committed** native project. Built with Gradle only. **Never run `expo prebuild`**: it would overwrite manual edits (signing, fonts, window colours) |
| `mobile/src/theme/tokens.js` | Single source of every colour and font family (Tailwind and `useTheme()` both read it) |
| `mobile/src/components/ui/` | Primitives every screen uses: `Button`, `Card`, `Chip`, `Tag`, `TextField`, `Notice`, `TextButton`, `Divider`, `Fab`, `Screen` |
| `mobile/src/constants/links.ts` | Public URLs for privacy, terms, support |
| `docs/` | Public website for GitHub Pages: landing, `privacy/`, `terms/`, `support/`, 404, sitemap, robots, IndexNow key, OG image |
| `docs/launch/` | Launch plan, store listing copy, marketing kit, data-handling record, checklist status, Play graphics |
| `scripts/indexnow-submit.sh` | Pings IndexNow after a site deploy |
| `openspec/` | Specs (source of truth) and changes. Use the CLI via `npx -y @fission-ai/openspec@latest` (not installed globally); set `OPENSPEC_TELEMETRY=0` |
| `backend/` | **Retired** FastAPI code, not used by the app. Several main specs (`backend-deployment`, `worker-in-web-process`, `search`, `recommendations`, `projects`) still describe it; cleanup not done |

## Workflow rules (from `CLAUDE.md` and the owner)

- One branch per OpenSpec change, branched from `main`; never commit feature work to `main` directly.
- Owner's pattern so far: open a PR per branch and merge it with a merge commit when asked.
- Commit trailer and PR footer: follow the attribution reminder in your session.
- Run `npx tsc --noEmit` and `npx expo export --platform android --output-dir <scratch>` in `mobile/` before pushing; both currently pass on `main`.
- Validate OpenSpec changes with `openspec validate <name> --strict`. MODIFIED requirements must keep every existing scenario name, or validation fails.

## Done and merged to `main`

| PR | What |
|---|---|
| ExPl0iT-29/ohara#3 | Gitignore local files (`/*.png` root only) |
| ExPl0iT-29/ohara#4 | Removed AI enrichment and embedded keys; legacy `summary`/`topics` columns kept but never shown or written |
| ExPl0iT-29/ohara#5 | App ID `com.ember.ohara`, version code 1, blocked storage/overlay permissions, privacy policy, Settings About section |
| ExPl0iT-29/ohara#6, #7 | Launch plan |
| ExPl0iT-29/ohara#8 | Gradle-only builds from committed `mobile/android/`; upload key read from `OHARA_UPLOAD_*` Gradle properties or env (see `mobile/android/SIGNING.md`), debug-signed fallback with a warning |
| ExPl0iT-29/ohara#9, #10 | Theme layer (tokens, `useTheme`, font-role classes) and primitives that own their text; onboarding copy fixed; dark-mode highlight contrast fixed |
| ExPl0iT-29/ohara#11 | Website in `docs/`, store listing kit, marketing kit, terms, support, data-handling record; Settings links terms and support and scrolls |

## Waiting on the owner

### 1. UI direction choice (three unmerged branches)

All three are built from `main`, keep every feature, pass type-check and JS bundling, each has its own OpenSpec change and DESIGN.md rewrite, and each **merges cleanly into current `main`** (checked 6 Nov). Merge only the one the owner picks; then close the other two and archive nothing from them.

| Branch | OpenSpec change | Summary |
|---|---|---|
| `feature/ui-quiet-shelf` | `ui-quiet-shelf` | Calm editorial. Literata + Instrument Sans (bundled), hairlines, teal accent, Continue reading section, reader progress line |
| `feature/ui-material-expressive` | `ui-material-expressive` | Material 3 Expressive. System Roboto, tonal teal, shape-morphing buttons, shape-coded thumbnails, Continue card, bottom nav, extended FAB |
| `feature/ui-refined-brutalism` | `ui-refined-brutalism` | Today's identity tightened. Bricolage Grotesque + Literata (bundled), 2.5dp lines, one shadow depth per level, colour by content type, dark-mode borders fixed |

Mockups the owner saw: https://claude.ai/artifact/MsdY7G83YhiFF2aGH7ZmRP

After the merge: capture Play screenshots from that build (plan and captions in `docs/launch/store-listing.md`).

### 2. Owner-only steps

- Enable GitHub Pages: `main`, folder `/docs`, enforce HTTPS. Until then the in-app privacy/terms/support links 404.
- Create an upload keystore per `mobile/android/SIGNING.md`; build with `cd mobile/android && ./gradlew bundleRelease`.
- Revoke the OpenAI and Gemini keys that shipped in earlier private APKs.
- Play Console: create app (`com.ember.ohara`), Play App Signing, internal track, listing, content rating, target audience 18+, ads "no", Data safety "no data collected".
- Search Console and Bing verification, submit `docs/sitemap.xml`, run `scripts/indexnow-submit.sh`.
- Optional: buy a domain; then replace `https://expl0it-29.github.io/ohara` in `docs/`, `mobile/src/constants/links.ts` and `scripts/indexnow-submit.sh`.
- Developer contact email for the Play listing is not chosen yet (do not use or publish the owner's personal email).

## Not verified (be honest about these)

- **No Gradle build has ever run.** The cloud environment blocks `dl.google.com`, so the Android SDK cannot be installed. Everything native is unverified: `app/build.gradle` signing block, `MainApplication.kt` font registration (`ReactFontManager.getInstance().addCustomFont`, used on the Quiet Shelf and refined brutalism branches), `res/font/*.xml`, `values-night` colours, merged-manifest permissions. To fix: the owner can add `dl.google.com` (and `maven.google.com`) to the environment's allowed hosts, or run the build locally and share errors.
- Nothing has run on a device or emulator: share intent, scroll restore, reader progress, swipe actions, fonts, both themes.
- Third-party claims to re-check on the day: Play's 12-testers/14-days closed-test rule for personal accounts, target API 36 minimum, Pocket (July 2025) and Omnivore (late 2024) shutdown dates, competitor-names wording in Play's metadata policy.

## Open OpenSpec changes (not archived)

| Change | Tasks done | Remaining |
|---|---|---|
| `remove-ai-enrichment` | 5/12 | Device checks, bundle inspection for keys, key revocation |
| `public-release-readiness` | 3/17 | Gradle bundle, manifest audit, device migration test, Pages, Play Console steps |
| `gradle-native-build` | 5/6 | First real `assembleDebug` / `bundleRelease` |
| `ui-theme-foundation` | 8/9 | Device visual comparison |

Archive each with `/opsx:archive` only after its remaining tasks are genuinely done.

## Branches to leave alone

`feature/supabase-auth`, `feature/ai-proxy`, `feature/byok-ai-settings`: abandoned proposals kept as a record. Do not merge. Merged feature branches remain on the remote; deleting them is the owner's call.

## Known follow-ups worth suggesting (not requested)

- Housekeeping change to retire the stale backend specs and the `backend/` directory.
- The feed's swipe interaction reveals buttons rather than archiving past a threshold, which differs from the `home-feed-ui` "Archive Toggle On Feed Item" scenarios; pre-existing, unresolved.
- Glyph icons (⚙ ↗ ⇣) in the Material branch should become a real icon set if that direction wins.
