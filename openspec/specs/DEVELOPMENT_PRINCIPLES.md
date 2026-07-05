# Ohara Development Principles

This document defines how Ohara should be engineered.

It complements the Product Vision, Design System, and Architecture Decisions.

Whenever there are multiple implementation options, choose the one that best aligns with these principles.

---

# Philosophy

Ohara is a long-term personal product.

The codebase should feel calm, intentional, and maintainable.

Optimize for correctness, clarity, and longevity rather than speed of implementation.

Every feature should be something the future codebase can support without regret.

---

# Engineering Values

Prioritize in this order:

1. Simplicity
2. Readability
3. Maintainability
4. Extensibility
5. Performance

Never sacrifice the first three for the last two unless absolutely necessary.

---

# Code Style

Write code for humans first.

Code should explain itself.

Avoid clever implementations.

Prefer explicitness over magic.

A junior developer should be able to understand every important piece of logic.

---

# Repository Structure

The repository should follow clear boundaries.

Example:

backend/
frontend/
extension/
shared/
infrastructure/
docs/

Each module should have a single responsibility.

Avoid dumping unrelated functionality into existing modules.

---

# Domain-Driven Organization

Organize around business concepts.

Good:

content/
reader/
search/
projects/
ai/

Bad:

utils/
helpers/
misc/
common/

The domain should be obvious from the folder structure.

---

# Naming

Use names that describe business meaning.

Examples:

ContentRepository

ReaderService

SearchEngine

ContentProcessor

Avoid vague names.

Examples:

Manager

Handler

Helper

Util

Processor2

ServiceImpl

---

# File Size

Prefer many small files over a few very large files.

Guidelines:

Functions:
20–40 lines preferred.

Classes:
One responsibility.

Files:
Prefer under 300 lines.

Large files should be split by responsibility.

---

# Architecture Layers

Maintain strict separation.

Presentation

↓

Application

↓

Domain

↓

Infrastructure

Business rules should never depend on frameworks.

Frameworks should depend on business logic.

---

# Business Logic

Business rules belong in the domain layer.

Never place business logic inside:

API routes

Database models

UI components

Workers

Those layers coordinate.

They should not make decisions.

---

# Dependency Direction

Dependencies should always point inward.

UI

↓

Application

↓

Domain

Infrastructure depends on Domain.

Domain depends on nothing.

---

# State Management

Single source of truth.

Avoid duplicated state.

Derived state should always be computed rather than stored when practical.

---

# API Design

Prefer REST initially.

Use consistent resource naming.

Examples:

POST /content

GET /content

GET /content/{id}

PATCH /content/{id}

DELETE /content/{id}

Avoid action-based endpoints.

Good:

PATCH /content/{id}

Bad:

POST /readArticle

---

# Database Philosophy

Design for evolution.

Prefer normalization.

Avoid premature denormalization.

Every table should represent a business concept.

Examples:

Content

Project

ReadingProgress

Topic

Recommendation

Not:

TempData

Misc

GenericObject

---

# Migrations

Database migrations are first-class citizens.

Never edit historical migrations.

Always create new migrations.

Schema evolution should be reversible.

---

# AI Integration

AI should always be behind an abstraction.

Never call LLM providers directly from business logic.

Good:

AIProvider

↓

OpenAIProvider

GeminiProvider

OllamaProvider

Bad:

Business Logic

↓

OpenAI SDK

This allows provider replacement later.

---

# Background Processing

Expensive work belongs in workers.

Examples:

Extraction

Summaries

Embeddings

Thumbnail generation

Recommendations

Never block user interactions.

---

# Errors

Errors should be meaningful.

Always fail gracefully.

Expose useful messages to the user.

Log technical details separately.

---

# Logging

Log events.

Not noise.

Useful logs:

Content Saved

Extraction Started

Extraction Completed

Summary Generated

Search Performed

Avoid logging every tiny operation.

---

# Configuration

Configuration belongs in environment variables.

Never hardcode:

API keys

URLs

Secrets

Model names

Timeouts

---

# Testing Philosophy

Test behavior.

Not implementation.

Prefer:

Unit tests

↓

Integration tests

↓

End-to-end tests

Avoid brittle tests.

---

# Performance

Optimize only after measuring.

Do not introduce complexity for hypothetical performance gains.

Prefer perceived performance over benchmark numbers.

---

# Security

Validate all input.

Escape output.

Never trust external data.

Treat every URL as untrusted.

---

# External Services

Every external dependency should be wrapped.

Examples:

Firecrawl

YouTube

LLMs

Storage

Never scatter SDK calls throughout the codebase.

---

# Documentation

Every major feature should include:

Purpose

Architecture

Tradeoffs

Future considerations

Documentation is part of the implementation.

---

# Git Philosophy

Small commits.

Meaningful commit messages.

One logical change per commit.

Avoid giant "everything" commits.

---

# OpenSpec Workflow

Every meaningful feature should follow:

Specification

↓

Discussion

↓

Approval

↓

Implementation

↓

Review

↓

Archive

Never skip specification.

---

# Decision Making

When faced with multiple solutions, ask:

Which solution is simpler?

Which solution is easier to maintain?

Which solution better supports future features?

Which solution best matches the product philosophy?

Choose that one.

---

# Technical Debt

Technical debt is acceptable only when:

It is documented.

It is isolated.

It has a clear path to removal.

Never accumulate hidden debt.

---

# Refactoring

Refactor continuously.

Do not wait until the codebase becomes difficult.

Small improvements are preferred over massive rewrites.

---

# Dependencies

Every new dependency must justify itself.

Ask:

Can we build this ourselves reasonably?

Is it actively maintained?

Does it reduce complexity?

Will it still make sense two years from now?

Avoid dependency bloat.

---

# Final Principle

Ohara should remain understandable five years from now.

Every line of code should move the project toward becoming a timeless personal library rather than a collection of clever engineering tricks.

Build software that future-you will enjoy maintaining.
