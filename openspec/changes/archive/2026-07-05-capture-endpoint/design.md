## Context

`content-model` gave Ohara a `Content` entity, `ContentRepository` interface, and `SqlAlchemyContentRepository`, but there is no way to reach any of it from outside a Python shell. This change adds the first HTTP surface: a single endpoint to save a URL. Per ADR-008, capture must return immediately — no extraction, no AI calls, no blocking work. Per DEVELOPMENT_PRINCIPLES.md, business logic (constructing a valid `Content`, calling the repository) belongs in an application/use-case layer, not in the FastAPI route function itself.

## Goals / Non-Goals

**Goals:**
- Give the app a real HTTP entrypoint: a runnable FastAPI server.
- Define `POST /content`: request body `{ url: str, contentType?: ContentType }`, response `{ id, url, status: "pending", savedAt }`.
- Keep the route thin — validation via Pydantic, orchestration via an application-layer `CaptureContentUseCase`, persistence via the existing repository.
- Guarantee the response returns before any processing happens (there is no processing yet, so this is trivially true, but the shape of the code must not create room to add blocking work later).

**Non-Goals:**
- No auth/session/user model — single-user local app, out of scope per product spec.
- No duplicate-URL detection or upsert semantics — every POST creates a new row; dedup is a future concern if ever needed.
- No content-type inference from the URL — if the client doesn't supply `contentType`, default to `other`; real classification is `processing-pipeline`'s job.
- No extraction, enrichment, or background job dispatch — `processing-pipeline` change picks up `pending` rows later (mechanism for that, e.g. polling vs. queue, is decided there, not here).
- No rate limiting, pagination, or listing endpoints — this change is capture-only.

## Decisions

**Route -> application use case -> repository, three thin layers.**
`backend/src/content/presentation/router.py` defines the FastAPI route and Pydantic schemas; it calls `backend/src/content/application/capture_content.py`'s `CaptureContentUseCase.execute(url, content_type)`. The use case constructs a `Content` entity (id via `uuid4()`, `saved_at` via `datetime.now(timezone.utc)`, `status=PENDING`) and calls `repository.save()`. Alternative considered: put entity construction directly in the route — rejected, mixes HTTP concerns with domain construction and makes the use case untestable without spinning up FastAPI.

**Pydantic schemas separate from the domain entity.**
`CaptureContentRequest` / `CaptureContentResponse` live in the presentation layer and map to/from `Content`; they are not the same class as the domain entity, matching the same separation already established between `Content` and `ContentModel` in `content-model`.

**URL validation via Pydantic `HttpUrl`.**
Rejects malformed URLs at the boundary with a 422 before any domain code runs. No custom validator needed — stdlib/Pydantic already does this correctly.

**Response returns 201, not 202.**
Content is fully created (a real row exists, retrievable by id) at response time — there's no separate "accepted, not yet created" state to signal, since there's no processing pipeline yet to accept into. 202 would misrepresent that the row already exists. Revisit if `processing-pipeline` later introduces a distinct queued-but-not-yet-persisted state.

**Database session per request via FastAPI dependency injection.**
Standard `Depends(get_session)` pattern, session created and closed per request. Keeps the use case decoupled from session lifecycle — it receives a `ContentRepository`, not a raw session.

## Risks / Trade-offs

- [Risk] No duplicate detection means saving the same URL twice creates two rows. → Mitigation: acceptable for a single-user app in this phase; explicit product decision needed later if it becomes annoying, not something to guess at now.
- [Risk] Defaulting unset `contentType` to `other` may hide a client bug that forgot to send it. → Mitigation: acceptable since `other` is a legitimate value per the enum in `content-model`; processing-pipeline can later reclassify.
- [Risk] No auth means any local process can POST to this endpoint. → Mitigation: matches product scope (single-user, local-first); revisit only if Ohara ever needs to be network-exposed.

## Migration Plan

No database migration — reuses the existing `content` table as-is. Deployment is just running the FastAPI app; no rollback complexity beyond stopping the server.

## Open Questions

None — scope intentionally narrow (one endpoint, no processing hookup yet).
