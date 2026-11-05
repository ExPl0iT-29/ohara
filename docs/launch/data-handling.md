# Data handling record

What data Ohara touches, where it lives, and the resulting legal position. This is a factual record for the privacy policy and Play Data safety form, not legal advice; have it reviewed if you add any service.

## App

| Data | Where it lives | Who can access it | Leaves the device? |
|---|---|---|---|
| Saved URLs, extracted text, titles, images (URLs), metadata | SQLite database on the phone | The user | No |
| Tags, highlights, notes, reading progress, archive state | Same database | The user | No |
| Settings (theme, onboarding flag) | Same database | The user | No |
| Export file | Wherever the user sends it via the share sheet | The user and whoever they share it with | Only when the user exports it |
| Android Auto Backup copy | The user's Google account, if Android backup is on | The user (Google operates it) | Yes, by the OS, not the app |

**Network requests by the app:** the saved page's own URL, YouTube's public oEmbed endpoint for video metadata, Google Docs' public text export for shared docs, and images referenced by saved pages. No analytics, crash reporting, advertising or AI endpoints. There is no developer-operated server.

**Retention and deletion:** data stays until the user deletes items, clears app storage or uninstalls. The developer holds no copy, so there is nothing to delete on request.

## Website (`docs/`, GitHub Pages)

- Static files only. No cookies, no local storage, no analytics, no third-party fonts or scripts.
- GitHub (host) may log IP addresses for operation and security under its own privacy statement.

## Assessments

| Topic | Position |
|---|---|
| Play Data safety | "No data collected" and "No data shared". On-device processing that never leaves the device does not count as collection under Google's guidance. |
| GDPR | The developer does not receive or process personal data from the app, so it is not a controller for app data. The website sets no cookies and runs no analytics; the host's server logs are the host's processing. Keep the privacy policy accurate and re-assess if anything is added. |
| Cookie notice | Not needed: the website sets no cookies and uses no tracking. The app stores data on the device only to provide the service the user asked for. |
| Terms of service | Written at `docs/terms/` (personal use, copyright responsibility for saved content, no warranty). No governing-law clause; add one for your jurisdiction if you want it. |
| Children | Target audience declared as 18+; no data collected from anyone. |

## Triggers for review

Update this file, the privacy policy and the Data safety form **before release** if a change adds any of: accounts, analytics, crash reporting, ads, cloud storage or sync, AI services, a newsletter or contact form, or website analytics.
