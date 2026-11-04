# Design

## Context

The app has no network identity today: one SQLite file, a generic `settings` key-value table, and direct `fetch` calls for extraction. IDs are client-generated UUIDs. `backend/` (FastAPI) is legacy and not used by the mobile app. See proposal.md for motivation.

Constraints: Expo SDK 57 (dev build, not Expo Go), Android only, `ohara` URL scheme already registered, Android package ID about to change (see Risks). Dependencies must justify themselves (DEVELOPMENT_PRINCIPLES), and external SDKs must be wrapped in one module.

## Goals / Non-Goals

**Goals:**
- One small `auth` module that is the only code importing the Supabase SDK.
- A single observable account state that later changes (`ai-proxy`, `cloud-sync`, `premium-billing`) can read.
- Auth works across process death and offline use.
- Backend config lives in the repo (`supabase/`).

**Non-Goals:**
- Syncing or uploading any content.
- Entitlements, quotas, or plan columns. The `premium-billing` change owns those.
- Native Google One Tap sign-in.

## Decisions

### D1. Browser-based PKCE OAuth, not native Google Sign-In
Use `supabase.auth.signInWithOAuth({ provider: "google", skipBrowserRedirect: true })`, open the URL with `expo-web-browser`'s `openAuthSessionAsync`, then call `exchangeCodeForSession` with the returned code. Redirect is `ohara://auth/callback`.

*Why:* it needs no native Google module and no Android OAuth client tied to a signing-key SHA-1. With Play App Signing the SHA-1 differs between local, EAS and Play builds, which is a classic source of "works in testing, fails in production" sign-in bugs. It also keeps auth independent of the unresolved package ID.
*Alternative:* `@react-native-google-signin` + `signInWithIdToken` gives one-tap UX but adds a native dependency and the SHA-1 coupling. Revisit if sign-in conversion is poor.

### D2. Session storage in `expo-secure-store`, via a chunking adapter
Supabase sessions can exceed SecureStore's value size limit, so wrap it in a small adapter that splits values into chunks. Do not put tokens in the SQLite `settings` table: that table is plain text and sits beside user content.

*Alternative:* AsyncStorage (plaintext tokens) or an encrypted-blob scheme (more moving parts). Chunked SecureStore is the smallest correct option.

### D3. Account state as a tiny store, not a context tree
`mobile/src/auth/` exposes `getAccountState()`, a `useAccount()` hook, `signInWithGoogle()`, `signOut()`, `deleteAccount()`. State is derived from the Supabase `onAuthStateChange` event and cached in a module-level store. Nothing outside `auth/` imports `@supabase/supabase-js`, which satisfies the "wrap every external service" rule and lets `ai-proxy` and `cloud-sync` reuse the same authenticated client through one exported accessor.

### D4. Offline never signs out
`autoRefreshToken` failures from network errors are ignored. Only an explicit `signOut()` or an `SIGNED_OUT` event caused by a rejected refresh token moves state to `signed-out`. This preserves "Offline Is A Feature" (ADR-009).

### D5. Profiles table is minimal and trigger-created
`public.profiles(id uuid pk references auth.users on delete cascade, created_at timestamptz default now())`. A `security definer` trigger on `auth.users` insert creates the row, so clients never insert. RLS: `select` and `update` allowed where `auth.uid() = id`; no client `insert` or `delete`. No plan or quota columns yet.

*Why `on delete cascade`:* it makes account deletion a single `auth.admin.deleteUser`. Every later per-user table MUST also reference `auth.users(id) on delete cascade`; this is recorded as a rule for `cloud-sync` and `ai-proxy`.

### D6. Deletion is an edge function using the service role
`supabase/functions/delete-account` verifies the caller's JWT, reads `user.id` from the verified token (never from the body), and calls `auth.admin.deleteUser(user.id)`. The service-role key exists only in the function's environment. The app calls it with the user's session; the web page calls the same function.

### D7. Web deletion page is static and self-serve
A single static HTML page (`web/account-deletion/`) using the Supabase JS client from a pinned CDN version: explains the process, signs in with Google (same provider, web redirect), shows a confirm button, calls `delete-account`. Chosen over a "email us to delete" page because self-serve deletion is faster to review and cheaper to operate. It is deployed with the landing site in the launch work.

### D8. Backend config is versioned
`supabase/config.toml`, `supabase/migrations/*.sql`, `supabase/functions/`. Applied through the Supabase CLI, never by hand in the dashboard, so the schema is reproducible.

## Risks / Trade-offs

- **Google consent screen left in "Testing"** → only 100 listed test users and refresh tokens expire after 7 days. Mitigation: a task publishes the consent screen to production (basic scopes need no verification) before closed testing.
- **Package ID change** → the browser flow uses the `ohara://` scheme, not the package name, so it is unaffected. Mitigation: keep the scheme stable across the ID change.
- **Supabase free projects pause when idle** → sign-in and deletion would fail. Mitigation: move to Pro before public launch (tracked in the launch plan), and the app already tolerates auth failure by staying local.
- **PKCE verifier lost if Android kills the app during the browser hop** → sign-in fails once. Mitigation: verifier is persisted by the SDK in secure storage; failure falls back to the calm retry message.
- **Publishable key in the APK** → intended; protected by RLS. Mitigation: a verification task checks that no table in `public` is readable without RLS.
- **Deleting the account leaves local data** → could confuse users who expect a wipe. Mitigation: confirmation copy states it explicitly.

## Migration Plan

1. Create the Supabase project and Google OAuth client; set the redirect allowlist to `ohara://auth/callback`.
2. Apply migrations and deploy `delete-account`.
3. Ship the app update. Existing installs see a new Account section and are otherwise unchanged; no local migration.
4. Rollback: hide the Account section behind a build flag. No local schema changed, so nothing to undo on devices.
