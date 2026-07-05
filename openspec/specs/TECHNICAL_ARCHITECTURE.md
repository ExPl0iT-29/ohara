# Technical Architecture

## High-Level Architecture

Capture Layer

↓

Processing Layer

↓

Storage Layer

↓

Search Layer

↓

Android Client

---

## Capture Layer

Sources:

* Browser Extension
* Android Share Sheet

Both should submit a URL to a common backend endpoint.

POST /content

The backend should perform all processing asynchronously.

---

## Processing Pipeline

1. Fetch content
2. Detect content type
3. Extract metadata
4. Extract readable content
5. Download hero image/thumbnail where applicable
6. Generate AI summary
7. Estimate reading time
8. Extract topics
9. Generate embeddings (future)
10. Store normalized content

---

## Unified Content Model

Every saved object should share the same schema regardless of source.

Suggested fields:

* id
* url
* contentType
* title
* description
* summary
* heroImage
* author
* source
* extractedText
* readingTime
* duration
* metadata
* topics
* status
* savedAt
* updatedAt
* completedAt

Additional metadata should remain content-type specific.

---

## Architecture Principles

Content is immutable.

Derived AI metadata is replaceable.

Projects reference content.

Content never references projects directly.

AI processing should be asynchronous.

All expensive operations belong in background workers.

---

## Backend

Suggested:

* FastAPI
* PostgreSQL
* SQLAlchemy
* Background Workers
* Redis (optional)
* Object Storage for images/assets

---

## Frontend

Android-first.

The application should prioritize:

* smooth scrolling
* offline reading
* fast loading
* reader-first UI

---

## Search

Start with PostgreSQL Full Text Search.

Future:

Hybrid semantic search using embeddings.

---

## Offline Strategy

Whenever legally and technically possible:

* store extracted article text
* cache PDFs
* cache thumbnails
* cache metadata

The application should remain useful without internet access.

---

## Future Architecture

The system should be modular enough to support:

* recommendation engine
* semantic search
* local embeddings
* AI chat over library
* spaced repetition
* knowledge connections

without requiring major architectural changes.

Maintain a clean separation between:

Capture

Processing

Storage

Presentation
