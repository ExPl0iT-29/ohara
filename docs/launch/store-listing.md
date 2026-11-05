# Google Play store listing

Ready-to-paste copy and answers for Play Console. App ID `com.ember.ohara`. Character counts were checked with a script.

> **App Store terms vs Play.** Play has no "subtitle" and no keyword field. The **short description** (80 characters) plays the subtitle's role, and keywords only count when they appear naturally in the title, short description and full description. Google's metadata policy forbids misleading or repetitive keywords and, per its published guidance, other apps' names in the listing, so **Pocket, Omnivore and Instapaper are not mentioned here**. Use those comparisons on the website, Reddit and Product Hunt instead.

## Text

| Field | Limit | Copy | Length |
|---|---|---|---|
| App name | 30 | `Ohara: Read Later & Offline` | 27 |
| Short description | 80 | `Save articles, videos and PDFs, then read them clean and offline. No account.` | 77 |
| Full description | 4000 | below | 1773 |

### Full description

The first two lines show before "More", so they carry the hook: the problem (too many tabs) and the promise (clean, offline).

```text
Stop keeping dozens of tabs open. Share a link to Ohara and it becomes a clean, quiet page you can read anywhere, even offline.

Ohara is a free read-later app for people who save more than they read. It turns articles, YouTube videos, PDFs and public Google Docs into a calm reading list that lives on your phone. No account, no ads, no tracking.

SAVE IN ONE TAP
• Share from Chrome, YouTube, Reddit or any app's share menu
• Or paste a link, or paste several at once to save a batch
• Ohara spots links you have already saved

READ WITHOUT DISTRACTIONS
• Clean reader view without pop-ups, cookie banners or sidebars
• Headings, lists, quotes and images kept, set for long reading
• Picks up exactly where you stopped
• Reading time for every article
• Light and dark mode

KEEP WHAT MATTERS
• Save quotes with your own notes on any article
• Tag items your way and filter by tag or type
• Search titles and full text across your whole library
• Archive what you have finished; your reading list stays short

OFFLINE BY DESIGN
Once an article is prepared, its text is stored on your phone, so your bookmarks are ready on the train, on a flight or anywhere without signal.

PRIVATE BY DEFAULT
Your library never leaves your device. There is no sign-up, no server holding your reading list, no analytics and no ads. Export your whole library to a single file whenever you like, and import it on a new phone.

WORKS WITH
Blogs, news articles, newsletters, documentation, YouTube videos, PDFs, research papers and public Google Docs. Pages that only load through scripts or behind a login are kept with their title, image and a link to the original.

FREE
Ohara is free, with no subscription and no in-app purchases.

Questions or bugs? Visit the support page linked below.
```

## Keywords

No paid keyword tool was used, so volumes are not measured. The list comes from the language used by the read-later category and the problems the app solves. Re-check after launch in **Play Console → Grow → Store performance → search terms**, which shows the real terms people used to find Ohara, and adjust the title and short description once.

| Priority | Keyword | Where it appears |
|---|---|---|
| Primary | read later | title, full description |
| Primary | offline reading / read offline | title, short description, full description |
| Primary | save articles | short description, full description |
| Secondary | reading list | full description |
| Secondary | reader view / clean reader | full description |
| Secondary | bookmarks, save links | full description |
| Secondary | PDF reader, YouTube videos | short description, full description |
| Long tail | no account, private, no ads | short description, full description |
| Long tail | highlights, notes, tags | full description |

## Graphics

| Asset | Requirement | File |
|---|---|---|
| App icon | 512 × 512 PNG | `docs/launch/assets/play-icon-512.png` |
| Feature graphic | 1024 × 500 PNG/JPG | `docs/launch/assets/play-feature-graphic.png` |
| Phone screenshots | at least 2, up to 8; portrait 9:16 recommended (check current limits in Play Console) | **to capture**, see below |

### Screenshot plan (benefits, not features)

Capture from a release build of the chosen UI direction, with a real library of 8 to 12 well-known articles. Each screenshot gets a short caption above the device frame stating the benefit.

| # | Screen | Caption |
|---|---|---|
| 1 | Reader, mid-article, progress visible | Read it clean. No pop-ups, no clutter. |
| 2 | Feed with a mix of articles, a video and a PDF | Everything you meant to read, in one calm place. |
| 3 | Share sheet from Chrome with Ohara selected | Save from any app in one tap. |
| 4 | Reader in dark mode | Easy on the eyes, day or night. |
| 5 | Highlights with a note | Keep the lines worth remembering. |
| 6 | Search results | Find anything you've saved, even mid-article. |
| 7 | Airplane mode with an article open | Works offline, on every commute. |
| 8 | Settings → About ("No account, no ads, no tracking") | Your library stays on your phone. |

### Preview video (optional, YouTube link)

30 seconds, no voice-over, captions burned in:
1. 0–4 s: a browser with too many tabs. Caption: "Too many tabs?"
2. 4–10 s: Share → Ohara. Caption: "Save from any app."
3. 10–18 s: the article opens clean, scroll. Caption: "Read it clean."
4. 18–24 s: airplane mode on, still reading. Caption: "Even offline."
5. 24–30 s: logo and "Free. No account. No ads."

## Links and contact

| Field | Value |
|---|---|
| Privacy policy | https://expl0it-29.github.io/ohara/privacy/ |
| Website | https://expl0it-29.github.io/ohara/ |
| Support URL (in description / website) | https://expl0it-29.github.io/ohara/support/ |
| Developer email | **you choose**: a dedicated address, shown publicly on the listing |

## Category, ads and content

| Item | Answer |
|---|---|
| App or game | App |
| Category | **Books & Reference** (alternative: News & Magazines; check where comparable read-later apps sit and pick the one with the most relevant neighbours) |
| Tags | Up to 5 in Play Console; choose reading, productivity and news-related tags offered there |
| Contains ads | No |
| In-app purchases | No |
| Target audience | **18 and over** (keeps the app out of the Families programme; it does not restrict who can download it) |
| Data safety | No data collected, no data shared (see `data-handling.md`) |
| Account deletion | Not applicable: the app has no accounts |

### Content rating (IARC questionnaire)

Answer as a reference / reading app. Ohara has no violence, sexual content, gambling, drugs or user-to-user communication of its own. One question needs care: it **does display web content the user chooses**, like a browser. Answer that honestly; the expected result is the lowest age rating, possibly with an "unrestricted internet" style notice. Do not under-declare it.
