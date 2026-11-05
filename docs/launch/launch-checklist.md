# Launch checklist status

Status as of 5 November 2026. **Done** = in the repo and verified here. **Ready, needs you** = prepared, but only you can do the final step (accounts, device, publishing). **N/A** = does not apply to Ohara, with the reason.

The site lives in `docs/` and is served by GitHub Pages at `https://expl0it-29.github.io/ohara/` once Pages is enabled (Settings → Pages → Branch `main`, folder `/docs`).

## App store

| Item | Status | Notes |
|---|---|---|
| App title with keywords | Done | `Ohara: Read Later & Offline` (27/30). See `store-listing.md`. |
| Subtitle | Done | Play's equivalent is the short description (77/80). |
| Description with a hook in the first 2 lines | Done | 1,773/4,000 characters, problem then promise. |
| Keywords researched and added | Done, revisit after launch | Play has no keyword field; terms are woven into title and descriptions. Volumes not measured; check Play's search-terms report after 2 weeks. Competitor names kept out (metadata policy). |
| Screenshots showing benefits | Ready, needs you | 8 captions and screens planned. Needs a release build of the chosen UI direction on a phone. |
| App preview video | Ready, needs you (optional) | 30 s storyboard in `store-listing.md`. |
| Privacy policy URL | Ready, needs you | Written. Goes live when GitHub Pages is enabled. |
| Support URL | Ready, needs you | `docs/support/` written; live with Pages. |
| App category | Ready, needs you | Recommendation: Books & Reference. Selected in Play Console. |
| Age rating | Ready, needs you | Questionnaire guidance in `store-listing.md`; target audience 18+. Completed in Play Console. |
| Feature graphic and 512 icon | Done | `docs/launch/assets/`. |

## Website

| Item | Status | Notes |
|---|---|---|
| Landing page live | Ready, needs you | `docs/index.html` built and checked at desktop and phone widths in light and dark. Live once Pages is enabled. |
| Open Graph tags | Done | og:title, og:description, og:image (1200×630), og:url, og:type, Twitter card on every page. |
| Favicon | Done | SVG plus 32 px PNG, Apple touch icon, web manifest. |
| Mobile responsive | Done | No horizontal overflow at 390 px; checked in a headless browser. |
| SSL / HTTPS | Ready, needs you | GitHub Pages serves HTTPS; tick "Enforce HTTPS" in Pages settings (and again after adding a custom domain). |
| Download / CTA button | Ready, needs you | Points to the Play listing for `com.ember.ohara`, which only resolves once the app is public. Until production, swap in the closed-testing opt-in link if you share the site early. |

## SEO

| Item | Status | Notes |
|---|---|---|
| Google Search Console | Ready, needs you | Add a URL-prefix property for the site URL; verify with the HTML-file method by committing Google's file into `docs/`. |
| Bing Webmaster Tools | Ready, needs you | Import from Search Console once verified. |
| Sitemap submitted | Ready, needs you | `docs/sitemap.xml` written; submit it in both consoles. |
| IndexNow | Done, run after deploy | Key file `docs/7837c05e38ac3fc6638b327a7755483a.txt`; run `scripts/indexnow-submit.sh` after each deploy. |
| Meta title and description | Done | Unique per page, with canonical URLs. |
| robots.txt | Done, limited | In place, but crawlers only read it at a domain root, so it takes effect with a custom domain, not on the `github.io/ohara/` path. Nothing is blocked either way. |

**Recommended:** buy a domain and point it at Pages. It makes robots.txt work, gives a cleaner store-listing URL, and lets the privacy and support URLs outlive the GitHub repo. Changing the URL means one find-and-replace of `https://expl0it-29.github.io/ohara` in `docs/`, `mobile/src/constants/links.ts` and `scripts/indexnow-submit.sh`.

## Marketing

| Item | Status | Notes |
|---|---|---|
| Launch post drafted | Done | Reddit, X thread and Product Hunt copy in `marketing-kit.md`. |
| Social media assets | Done, screenshots pending | OG image, feature graphic, icon and captions ready; screenshots after the UI is chosen. |
| Email list notified | N/A, replaced | No email list (the site collects nothing). A friends/testers announcement message is in `marketing-kit.md`. |
| Product Hunt listing prepped | Done | Name, tagline, description, topics, gallery order, first comment. |
| Friends/community ready | Ready, needs you | Ask list in `marketing-kit.md`: 10–20 honest reviewers, 5 PH commenters, closed testers. |

## Legal

| Item | Status | Notes |
|---|---|---|
| Privacy policy written and linked | Done | Linked from the app (Settings), website footer and Play listing. Now also covers the website itself. |
| Terms of service written and linked | Done | `docs/terms/`, linked from Settings and the website. No governing-law clause; add your jurisdiction if you want one. |
| Data handling documented | Done | `data-handling.md`. |
| GDPR | Done (assessed) | No personal data reaches the developer; site sets no cookies and loads no third-party resources. Not legal advice; re-assess if any service is added. |
| Cookie notice | N/A | The site sets no cookies and has no tracking, so no banner is needed. |

## Your remaining steps, in order

1. Pick the UI direction and merge it.
2. Enable GitHub Pages (`main`, `/docs`, enforce HTTPS). Optionally add a custom domain first.
3. Build the release bundle, capture the 8 screenshots, and (optionally) the preview video.
4. Create the Play Console app, paste the listing, upload graphics, complete content rating, target audience, ads and Data safety.
5. Verify the site in Google Search Console and Bing, submit the sitemap, run `scripts/indexnow-submit.sh`.
6. Follow `launch-plan.md`: internal → closed (14 days, 12+ testers) → production, then the posts in `marketing-kit.md`.
