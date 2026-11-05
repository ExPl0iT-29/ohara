#!/usr/bin/env bash
# Tell IndexNow search engines (Bing, Yandex, Seznam, Naver and others) that the site changed.
# Run after each deploy of docs/. The key file lives at docs/7837c05e38ac3fc6638b327a7755483a.txt, so keyLocation is set
# explicitly and every URL must sit under https://expl0it-29.github.io/ohara/.
set -euo pipefail

HOST="expl0it-29.github.io"
BASE="https://${HOST}/ohara"
KEY="7837c05e38ac3fc6638b327a7755483a"

curl -sS -o /dev/null -w "IndexNow: HTTP %{http_code}\n" \
  -H "Content-Type: application/json; charset=utf-8" \
  -X POST "https://api.indexnow.org/indexnow" \
  --data @- <<JSON
{
  "host": "${HOST}",
  "key": "${KEY}",
  "keyLocation": "${BASE}/${KEY}.txt",
  "urlList": [
    "${BASE}/",
    "${BASE}/support/",
    "${BASE}/privacy/",
    "${BASE}/terms/"
  ]
}
JSON
# 200 or 202 means accepted. 403: key file not reachable yet. 422: URL or keyLocation outside the host.
