# Release signing

Release builds read the Play **upload key** from Gradle properties or environment variables. Never commit the keystore or passwords; `*.jks` and `*.keystore` (except the template's `app/debug.keystore`) stay out of git.

## One-time: create an upload key

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore ~/keys/ohara-upload.jks \
  -alias ohara-upload -keyalg RSA -keysize 2048 -validity 10000
```

Back the file and passwords up somewhere safe outside the repo. With Play App Signing enabled, a lost upload key can be reset from Play Console, but the app signing key itself is held by Google.

## Point Gradle at it

Add to `~/.gradle/gradle.properties` (your user-level file, not the repo's):

```properties
OHARA_UPLOAD_STORE_FILE=/absolute/path/to/ohara-upload.jks
OHARA_UPLOAD_STORE_PASSWORD=...
OHARA_UPLOAD_KEY_ALIAS=ohara-upload
OHARA_UPLOAD_KEY_PASSWORD=...
```

The same four names also work as environment variables (useful in CI).

If they are missing, `assembleRelease`/`bundleRelease` still succeed but sign with the debug key and print a warning. Such builds install locally but Play will reject them.
