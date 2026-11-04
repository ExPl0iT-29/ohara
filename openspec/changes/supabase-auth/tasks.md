# Tasks

## 1. Backend foundation

- [ ] 1.1 Create the Supabase project, enable the Google provider with a Google Cloud OAuth web client, and add `ohara://auth/callback` to the redirect allowlist. Verify by listing the provider as enabled in the dashboard and completing a manual browser sign-in that returns a code.
- [ ] 1.2 Add `supabase/config.toml` and initialise the CLI layout. Verify `supabase db lint` runs against it.
- [ ] 1.3 Write `supabase/migrations/*_profiles.sql`: `profiles` table, RLS policies (own-row select/update only), and the `security definer` trigger on `auth.users`. Verify with SQL tests that user A cannot select or update user B's row, an anonymous request gets no rows, and a new auth user gets a profile.
- [ ] 1.4 Run the Supabase security advisor against the project. Verify there are no tables in `public` without RLS.
- [ ] 1.5 Publish the Google OAuth consent screen to production with basic scopes only. Verify an account that is not on any test-user list can sign in.

## 2. Mobile auth module

- [ ] 2.1 Add `@supabase/supabase-js`, `expo-web-browser`, `expo-secure-store`, `react-native-url-polyfill`, and `.env.example` entries for the Supabase URL and publishable key. Verify the app builds and starts with signed-out behaviour unchanged.
- [ ] 2.2 Implement the chunked SecureStore storage adapter in `mobile/src/auth/`. Verify with unit tests that values over the size limit round-trip and that deleting removes all chunks.
- [ ] 2.3 Implement the Supabase client wrapper, the account-state store and `useAccount()`, per design D3 and D4. Verify with unit tests that a network-failed refresh keeps `signed-in`, while a `SIGNED_OUT` event from a rejected token yields `signed-out`.
- [ ] 2.4 Implement `signInWithGoogle()` (PKCE via `openAuthSessionAsync`, `exchangeCodeForSession`), treating user cancel as a silent no-op. Verify on a device: success signs in, cancel leaves state unchanged, airplane mode shows the retry message.
- [ ] 2.5 Add the `auth/callback` route so the deep link resolves. Verify the callback does not render a not-found screen when the browser returns.
- [ ] 2.6 Verify a signed-in session survives force-close and reopen on a device, and that no local content row changes during sign-in or sign-out (compare a content-table checksum before and after).

## 3. Settings account UI

- [ ] 3.1 Add the Account section to `mobile/app/settings.tsx` in the existing neo-brutalist style: signed-out shows Sign in with Google plus one line on what an account is for; signed-in shows the email and Sign out. Verify both states by screenshot on a device.
- [ ] 3.2 Confirm the onboarding flow has no sign-in gate. Verify a fresh install reaches the library without any account prompt.

## 4. Account deletion

- [ ] 4.1 Implement `supabase/functions/delete-account`: verify the JWT, use the token's user id only, call `auth.admin.deleteUser`. Verify with function tests that a missing or invalid token is rejected, a body-supplied user id is ignored, and a valid call removes the user and their profile.
- [ ] 4.2 Add Delete account to Settings with a confirmation stating deletion is permanent and that on-device content is kept; wire it to the function, then sign out. Verify on a device that cancel deletes nothing, confirm removes the auth user and profile, and the local library is intact.
- [ ] 4.3 Build the static `web/account-deletion/` page (explanation, Google sign-in, confirm, call the function). Verify end to end with a test account on a desktop browser, and that the page loads when signed-out.

## 5. Documentation

- [ ] 5.1 Update `openspec/specs/PRODUCT_SPECIFICATIONS.md` "Primary User" to say each person owns a private library, with social, sharing and collaboration still non-goals. Verify the diff touches only that section.
- [ ] 5.2 Update the README architecture table and "Why" section to describe optional accounts, and add a short `supabase/README.md` covering project setup, running migrations and deploying functions. Verify a fresh reader can follow the steps as written.

## 6. Integration

- [ ] 6.1 Run the full flow on a release build: fresh install, sign in, restart, airplane-mode reopen, sign out, sign in again, delete the account. Verify each spec scenario in `user-auth` and `account-deletion` against observed behaviour.
- [ ] 6.2 Inspect the built bundle for secrets. Verify it contains the Supabase URL and publishable key only, with no service-role key or AI key.

## Workflow follow-up

- Resolve the Android package ID (tracked in `public-release-compliance`) before the first Play upload; auth does not depend on it.
- Archive this change after review, then start `ai-proxy`, which depends on the account state and Supabase project created here.
