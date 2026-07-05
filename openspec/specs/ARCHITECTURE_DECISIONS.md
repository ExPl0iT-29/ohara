# Ohara Architecture Decision Records (ADR)

This document records the major architectural decisions behind Ohara.

Its purpose is not to describe implementation.

Its purpose is to preserve **why** decisions were made.

Future development should respect these decisions unless there is a compelling reason to change them.

---

# ADR-001

## Ohara is Content-First

### Decision

Content is the primary entity within the system.

Everything else exists to enrich, organize, or provide context around content.

---

### Why

People discover content naturally.

They do not naturally think in folders or projects.

The first thought is:

> "This looks interesting."

not

> "Which project does this belong to?"

The application should preserve that natural workflow.

---

### Consequences

Projects reference content.

Content never belongs exclusively to projects.

Every feature should begin with the content model.

---

# ADR-002

## Projects Are Context

### Decision

Projects are optional overlays.

They provide context rather than organization.

---

### Why

The same article may become useful across multiple projects over time.

Knowledge changes meaning depending on context.

Projects should not restrict future reuse.

---

### Consequences

A content item may belong to:

* zero projects
* one project
* many projects

Removing a project never removes content.

---

# ADR-003

## Unified Content Model

### Decision

Every supported source is represented by the same internal Content model.

Examples include:

* blogs
* PDFs
* books
* YouTube
* GitHub
* documentation
* Reddit
* research papers

---

### Why

Users think in terms of knowledge, not file types.

Different content sources should feel consistent inside the application.

---

### Consequences

Source-specific metadata remains optional.

Core fields remain consistent.

The UI works with Content rather than individual source types.

---

# ADR-004

## AI Is Infrastructure

### Decision

AI is an implementation detail.

It should enrich the experience rather than become the experience.

---

### Why

Users open Ohara to read.

Not to interact with AI.

AI should remove work.

Never create work.

---

### Consequences

AI runs asynchronously.

The UI remains usable even when AI is unavailable.

Metadata produced by AI is replaceable.

---

# ADR-005

## Reading Is The Primary Workflow

### Decision

Everything ultimately exists to improve reading.

---

### Why

The application succeeds only if the user consumes more content.

Collecting links without reading them is failure.

---

### Consequences

The Reader screen receives the highest design priority.

Reader mode is considered core functionality.

---

# ADR-006

## Search Is Memory

### Decision

Search is designed to retrieve knowledge rather than locate files.

---

### Why

Users often remember ideas.

Not titles.

Not URLs.

Not publication dates.

Search should behave like memory.

---

### Consequences

Search indexes:

* titles
* extracted text
* summaries
* topics
* metadata

Future semantic search should improve retrieval rather than replace traditional search.

---

# ADR-007

## Capture Must Be Instant

### Decision

Saving content should require minimal effort.

---

### Why

The current competitor is leaving a browser tab open.

If Ohara introduces friction, users will return to tabs.

---

### Consequences

Capture should eventually support:

* browser extension
* Android share sheet
* direct URL paste
* API

Saving should never require categorization.

---

# ADR-008

## Processing Is Asynchronous

### Decision

Expensive work occurs in background workers.

---

### Why

Users should never wait for:

* extraction
* summarization
* embedding generation
* thumbnail processing

Saving should feel immediate.

---

### Consequences

Capture API returns quickly.

Background jobs perform enrichment.

The UI updates automatically as processing completes.

---

# ADR-009

## Offline Is A Feature

### Decision

Whenever legally and technically possible, Ohara stores enough information for offline reading.

---

### Why

Reading often happens:

* while travelling
* during commutes
* in places with unreliable connectivity

The library should remain available.

---

### Consequences

Prefer storing:

* extracted article text
* thumbnails
* metadata
* cached PDFs (where appropriate)

---

# ADR-010

## Calm Over Productivity

### Decision

The interface should prioritize calmness over productivity metrics.

---

### Why

Unread counters often create guilt.

Stress reduces reading.

Curiosity increases reading.

---

### Consequences

Avoid:

* streaks
* achievement systems
* excessive badges
* pressure-based notifications

Encourage exploration instead.

---

# ADR-011

## Local Intelligence Before Cloud Dependence

### Decision

Design the system so that AI capabilities can progressively move closer to the user.

---

### Why

Today, cloud models may provide extraction, summaries, and recommendations.

Tomorrow, lightweight or local models may handle some of these tasks, improving privacy, responsiveness, and cost.

The architecture should not assume permanent dependence on any single AI provider.

---

### Consequences

Separate AI providers behind clear interfaces.

Keep prompts, embeddings, and enrichment pipelines modular.

Avoid coupling business logic directly to vendor-specific APIs.

---

# ADR-012

## Build For Longevity

### Decision

Ohara should remain useful for years, not months.

---

### Why

A personal library grows continuously.

The architecture should support tens of thousands of saved items without requiring redesign.

The application should become more valuable as the library expands.

---

### Consequences

Favor maintainability over shortcuts.

Choose technologies with mature ecosystems.

Keep domain models stable.

Treat migrations as first-class citizens.

---

# ADR-013

## Beauty Is Functional

### Decision

Visual design is a functional part of the product.

Not decoration.

---

### Why

People are more likely to read when content feels inviting.

Good typography, whitespace, imagery, and thoughtful layout reduce friction and encourage engagement.

A beautiful interface directly supports the product's mission.

---

### Consequences

Reader experience receives continuous attention.

Design consistency is considered part of product quality.

Compromises that make the interface feel cluttered should be avoided, even if they expose more information.

---

# ADR-014

## The Browser Is Discovery. Ohara Is Understanding.

### Decision

The browser remains the place for exploration.

Ohara becomes the place for learning.

---

### Why

Trying to replace the browser creates unnecessary complexity.

Instead, Ohara complements it by becoming the destination for intentional reading and long-term knowledge.

---

### Consequences

Discovery workflows stay lightweight.

Consumption workflows receive the majority of design and engineering effort.

---

# Final Principle

Whenever uncertainty arises, return to the core question:

**Does this decision help transform curiosity into lasting knowledge?**

If the answer is yes, it is probably aligned with Ohara.

If not, reconsider the design.
