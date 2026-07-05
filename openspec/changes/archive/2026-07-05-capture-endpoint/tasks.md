## 1. Application Layer

- [x] 1.1 Create `backend/src/content/application/` module
- [x] 1.2 Implement `CaptureContentUseCase` (constructs `Content` entity with generated id/savedAt/pending status, defaults `contentType` to `other` when not supplied, calls `ContentRepository.save()`)

## 2. Presentation Layer

- [x] 2.1 Create `backend/src/content/presentation/` module
- [x] 2.2 Define `CaptureContentRequest` Pydantic schema (`url: HttpUrl`, `contentType: ContentType | None`)
- [x] 2.3 Define `CaptureContentResponse` Pydantic schema (`id`, `url`, `contentType`, `status`, `savedAt`)
- [x] 2.4 Implement `POST /content` FastAPI route calling `CaptureContentUseCase`, returning 201 with `CaptureContentResponse`

## 3. Wiring

- [x] 3.1 Create FastAPI app entrypoint (`backend/src/main.py`) registering the content router
- [x] 3.2 Add `get_session` dependency (per-request DB session) and repository provider wiring session -> `SqlAlchemyContentRepository` -> use case

## 4. Verification

- [x] 4.1 Write test: `POST /content` with valid URL creates a `pending` Content and returns 201 with expected fields
- [x] 4.2 Write test: `POST /content` without `contentType` defaults to `other`
- [x] 4.3 Write test: `POST /content` with `contentType` supplied honors it
- [x] 4.4 Write test: `POST /content` with malformed URL returns validation error and creates no row
- [x] 4.5 Write test: response from `POST /content` contains no enrichment fields (title/summary/topics absent or null)
