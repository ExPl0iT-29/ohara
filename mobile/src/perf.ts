// Rough launch-time instrumentation: __BUNDLE_START_TIME__ is set by Hermes/Metro
// as soon as the JS bundle starts executing, closest we can get to "process start"
// without touching native code. Falls back to first JS-side timestamp if unset.
const bundleStart =
  (globalThis as { __BUNDLE_START_TIME__?: number }).__BUNDLE_START_TIME__ ?? Date.now();

export function logSinceBundleStart(label: string) {
  console.log(`[perf] ${label}: ${Date.now() - bundleStart}ms since bundle start`);
}
