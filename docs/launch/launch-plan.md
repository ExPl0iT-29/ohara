# Ohara Launch Plan

Free, no ads, local-only Android read-later app. No accounts, no cloud, no AI, no analytics.
Application ID: `com.ember.ohara`.

Facts marked **(verify)** come from third-party sources or may have changed. Confirm them in Play Console Help on the day.

## 0. Sequence at a glance

```
remove-ai-enrichment ─► public-release-readiness ─► Phase 1 internal ─► Phase 2 closed ─► Phase 3 production ─► Phase 4 growth
 (no key ships)          (ID, AAB, policy, forms)      ~1 week            ≥14 days            staged rollout          ongoing
                                                                  ▲
                                         landing page + privacy URL must be live before the Data safety form
```

Nothing below starts until both OpenSpec changes are implemented, reviewed and archived.

## 1. Prerequisites (before any Play upload)

| # | Deliverable | Done when |
|---|---|---|
| 1 | Play developer account (personal, one-time fee) and identity verification | Console accessible |
| 2 | A domain you own for the landing page and privacy URL | Resolves over HTTPS |
| 3 | Public contact address (dedicated, not personal) | In policy and listing |
| 4 | Privacy page live | Loads with no login |
| 5 | Release bundle from `public-release-readiness` | Signed `.aab`, target SDK meets Play minimum (verify, API 36 as of Aug 2026) |
| 6 | Store assets: 512 icon, 1024x500 feature graphic, 4+ screenshots (aim for 6), short and full description | Listing preview complete |

## 2. Play Store release path

### Phase 1: Internal testing (about 1 week)
- Upload the first bundle to the **internal** track; add yourself and 2 to 5 trusted people.
- Goal: catch install, share-intent, import/export and crash problems on at least 3 different devices and Android versions.
- Exit when: no crash in a full walk-through, the old private library imports cleanly into `com.ember.ohara`, Data safety and content-rating forms are complete.

### Phase 2: Closed testing (minimum 14 days)
- Personal accounts created after Nov 2023 reportedly need **12 or more opted-in testers on a closed track for 14 continuous days** before production access can be requested, and Google may also look at tester engagement **(verify)**.
- Recruit 20 to 25 to leave margin for drop-outs. Sources: friends and family, a Reddit tester-swap thread, your own build-in-public followers, the Pocket-refugee audience (section 5).
- Give testers a reason to open the app: a one-line ask ("save 3 articles this week and tell me what broke") and a feedback link.
- Day 14: request production access. Reported review time is a couple of days **(verify)**.
- Exit when: access granted, zero open crash reports, at least 10 testers' feedback addressed.

### Phase 3: Production
- Staged rollout: 10% for 2 days, 50% for 2 days, then 100%, watching the Play Console crash and ANR rate between steps.
- Hold the public announcement until 100%.
- Plan one patch release within 2 weeks for whatever real users find.

## 3. ASO (App Store Optimisation)

**Positioning (one line):** "A calm read-later app that keeps everything on your phone. No account, no ads, no tracking."

**Why it can win:** Pocket shut down in July 2025 and Omnivore wound down in late 2024 **(verify both)**, so "Pocket alternative" and "Omnivore alternative" are live search intents. The privacy angle is real and verifiable (the Data safety card says "No data collected").

| Element | Plan |
|---|---|
| Title (30 chars) | `Ohara: Read Later` |
| Short description (80) | `Save links, read them clean and offline. No account, no ads, no tracking.` |
| Keywords to work into the full description naturally | read later, offline reader, save articles, Pocket alternative, reading list, bookmark, article saver, private |
| Full description | Lead with the problem (too many open tabs), then 5 bullets: one-tap share, clean reader, works offline, tags/highlights/search, export your library. Close with the privacy promise. No keyword stuffing. |
| Screenshots | 1 feed, 2 reader, 3 share-sheet capture, 4 highlights, 5 search/tags, 6 "No data collected" or export. Each with a 5-word caption. Reuse the neo-brutalist look as the visual identity. |
| Icon / feature graphic | Existing icon; feature graphic matches the banner in `docs/assets/banner.jpg` |
| Category | Books and Reference (alternative: Productivity; test via custom listings once available) |
| Ratings | Ask happy testers (Phase 2) to review at launch; add no in-app review nagging (ADR-010) |

Measure: Play Console store-listing conversion and search-term reports. Revise title and screenshots after the first 2 weeks of data.

## 4. Landing page

One static page, free hosting (GitHub Pages or Vercel), on the owned domain.

Sections, in order: hero (one-line promise + Play badge) → 3 screenshots → "Why Ohara" (3 points: yours alone, offline, calm) → how it works in 3 steps → FAQ (Pocket import? how do I back up? is it really free? how do you pay for it?) → privacy link → contact.

Required pages: `/privacy` (from `public-release-readiness`). No analytics script, to keep the "no tracking" claim consistent; use the host's built-in aggregate stats if any.

Build order: domain, then privacy page, then landing page. Publish the privacy page first because Data safety needs it.

## 5. Build in public, Reddit, Product Hunt, X

### Cadence (starts 4 weeks before production)
| When | Action |
|---|---|
| Weeks -4 to -1 | X devlog: 2 to 3 short posts a week (screenshot or 20 s screen recording + what changed + what you learned). Pin a post linking the landing page. |
| Phase 2 | Post "Looking for closed testers" on X and in the relevant Reddit tester-swap threads. |
| Phase 3 | Launch posts (below), one platform per day. |
| After | Weekly changelog post; reply to every review and issue. |

### Reddit
- Spend 2 to 3 weeks genuinely participating first (answering read-later and productivity questions); then post.
- Read each subreddit's self-promotion rules before posting; many require a flair or restrict promotion to a weekly thread, and some ban it outright.
- Candidate communities (check rules): r/androidapps, r/Android (usually only discussion-style), r/SideProject, r/productivity, r/PKMS, plus communities that formed around Pocket's shutdown.
- Post as a story, not an ad: "Pocket shut down, so I built a read-later app that never leaves your phone" with screenshots, the Play link in the body, and an honest list of what it does not do (no sync, no AI).
- One post per community, spaced across days. Reply to every comment within the first 2 hours.

### Product Hunt
- Launch **after** Phase 3 reaches 100% so the link works for everyone.
- Prepare the gallery (6 images, one 30 to 60 s demo video), tagline, first comment explaining why it was built, and a short maker story. Launch at 12:01 am Pacific on a Tuesday to Thursday.
- Line up 10 to 20 people who will genuinely comment on launch day; do not buy or trade upvotes.

### X
- Launch thread: problem, 3 screenshots, the privacy promise, link. Pin it.
- Tag relevant indie-dev and read-later accounts only where it is relevant; no mass tagging.

### Other, lower effort
Hacker News "Show HN" once the landing page is solid (privacy-first, local-only tends to land well; follow the Show HN rules), and a short post on Indie Hackers.

## 6. Pricing hypothesis

**Hypothesis: free and ad-free is a growth strategy, not a revenue one.**

- Running cost is about the one-time Play registration fee **(verify amount)**, a domain (roughly the price of one coffee a month), and $0 hosting. There is no backend, so cost does not grow with users.
- Revenue plan for v1 is none. Success is installs, retention and reviews, not money.
- Optional later: a tip link (GitHub Sponsors or Ko-fi) on the **landing page only**. Do not put external payment or donation links inside the app, since Play's payments policy can be strict about this; check the policy before ever adding one.
- Re-open pricing only if there is a real signal: more than a few thousand active installs with strong retention. At that point the candidate is a one-time paid unlock for a clear premium feature, which still needs no accounts or backend. Any model that needs accounts or sync is a new product decision and a new OpenSpec change.

## 7. Success metrics (no in-app analytics)

Use Play Console only: installs, uninstall rate, day-7 and day-30 retention, crash and ANR rate, rating, store-listing conversion. Targets are hypotheses to revisit after the first month: rating 4.3 or higher, crash-free sessions 99.5% or higher, day-7 retention 20% or higher. No streaks or guilt mechanics (ADR-010).

## 8. Risks

| Risk | Mitigation |
|---|---|
| Can't reach 12 closed testers | Start recruiting at Phase 1; use tester-swap threads and your devlog audience |
| Production access rejected | Fix whatever Google cites, keep testers engaged, resubmit |
| Reddit removes or shadow-bans a post | Participate first, follow each sub's rules, one post per sub |
| Day-one crash on an unusual device | Internal and closed phases on varied devices; staged rollout |
| Policy and app drift out of sync | Disclosure check required on every future change (see `privacy-disclosure` spec) |
| Brand clash or confusion around "Ohara" | Search Play and the web before creating the listing |
| Listing says "Pocket alternative" and draws a takedown or complaint | Describe it as an alternative in prose; avoid the Pocket logo or name in the title or icon |
