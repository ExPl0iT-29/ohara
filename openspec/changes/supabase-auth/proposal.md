# Proposal

## Why

Ohara is going public. Today it is a private, single-user, account-less build, so there is no way to tell users apart, grant them AI quota, sync their library, or bill them. Every later public-launch change (`ai-proxy`, `cloud-sync`, `premium-billing`) needs a verified user identity first. Play Store policy also requires in-app account deletion and a public deletion URL as soon as accounts exist.

## What Changes

- Add **optional** Google sign-in through Supabase Auth. Signed-out remains exactly today's behaviour: fully local, no AI, no account.
- Add an account state (`signed-out` / `signed-in`) with a persisted session that survives restarts and works offline.
- Add a `profiles` table in Supabase with row-level security (`auth.uid() = id`), created automatically at first sign-in. This is the anchor that per-user data in later changes hangs off.
- Add an Account section to Settings: sign in, sign out, delete account.
- Add in-app account deletion plus a public web page for deletion requests (both required by Play), backed by one server-side delete function that removes the auth user and cascades all of that user's cloud rows.
- Signing in, signing out, or deleting the account never modifies or deletes on-device content.
- Update `PRODUCT_SPECIFICATIONS.md` so "single user only" means each person owns a private library, not that the product has one user. Social, sharing and collaboration stay non-goals.
- Introduce a repo-tracked `supabase/` directory for migrations and edge functions, so backend config is version-controlled.

**Non-goals:** syncing library data (`cloud-sync`), the AI proxy and quotas (`ai-proxy`), subscriptions (`premium-billing`), any non-Google provider, email/password, anonymous accounts.

## Capabilities

### New Capabilities
- `user-auth`: optional Google sign-in, persisted session, signed-in/signed-out account state, per-user profile with row-level security, and the guarantee that auth never touches local data.
- `account-deletion`: user-initiated deletion of the account and all cloud data, available in-app and through a public web page.

### Modified Capabilities

None. `PRODUCT_SPECIFICATIONS.md` is a product document, not a capability spec, so its wording change is a task, not a delta.

## Impact

- **Mobile:** new `mobile/src/auth/` module, new Settings section, new deep link route for the OAuth callback. New dependencies: `@supabase/supabase-js`, `expo-web-browser`, `expo-secure-store`, `react-native-url-polyfill`.
- **Backend:** new Supabase project, Google OAuth provider, `supabase/migrations/` (profiles table, RLS, new-user trigger), `supabase/functions/delete-account/`.
- **Web:** one small static account-deletion page, deployed with the landing site later.
- **Config:** `EXPO_PUBLIC_SUPABASE_URL` and the publishable anon key are embedded in the app. This is safe by design because row-level security enforces access, and it is not the AI key that this whole effort removes.
- **Docs:** `PRODUCT_SPECIFICATIONS.md`, README architecture table.
- **Legacy `backend/`:** untouched here. Its retirement is separate housekeeping.
