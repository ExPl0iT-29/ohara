# Ohara Design System

This document defines the visual and interaction philosophy of Ohara.

It is not a UI specification.

It is a guide for making consistent design decisions throughout the lifetime of the project.

Whenever designing a screen or component, refer to this document before implementing.

---

# Design Mission

Ohara should feel like it was made for Android: familiar in the hand, expressive in the details.

It is a save-and-read app built on Google's Material 3 Expressive language, so navigation, buttons and lists behave the way Android users already expect, while shape, colour and motion give it a personality of its own.

Opening Ohara should feel effortless and a little delightful, never unfamiliar.

The goal is to make saving and reading fast, trustworthy and pleasant.

**Current direction: Material Expressive.**

---

# Emotional Goals

Every screen should evoke:

* Familiarity
* Ease
* Responsiveness
* Warmth
* Delight in small moments

Avoid creating feelings of:

* Generic template apps
* Visual noise
* Unfamiliar navigation
* Motion for its own sake

Ohara should feel like a well-made first-party Android app.

---

# Core Design Principles

## 1. Content Is The Hero

The content itself is always the largest visual element.

UI should support content, never compete with it.

Articles should be visually inviting.

Images are part of the reading experience.

Typography matters more than decorative graphics.

---

## 2. Reduce Cognitive Load

The user should rarely think about:

* folders
* organization
* settings
* tags
* workflows

The application should make intelligent decisions automatically.

The user should simply choose something interesting and start reading.

---

## 3. Every Screen Has One Job

Avoid multi-purpose screens.

Examples:

Home
→ Find something to read.

Reader
→ Read.

Search
→ Rediscover.

Library
→ Browse everything.

Projects
→ Provide context.

Every screen should have a primary purpose.

---

## 4. Progressive Disclosure

Only reveal complexity when needed.

The default interface should remain simple.

Advanced metadata, AI features, projects, and relationships should stay out of the way until requested.

---

# Visual Identity

## Personality

Material 3 Expressive. Tonal surfaces instead of borders, large rounded containers (24–28dp), a deliberate variety of shapes, spring motion, and standard Android patterns: a search bar at the top, filter chips, a navigation bar, and an extended floating action button.

Shape carries meaning: each content type has its own thumbnail silhouette (circle for video, arch for PDFs and papers, leaf for articles, squircle for docs and code), so the list reads at a glance.

---

## Typography

Android's own Roboto, so nothing is bundled and text matches the system. Headlines are set heavy (800) and large; body and reading text are 16–17sp with generous line height. Labels are sentence case.

Never compress text in the reader.

---

## Color Philosophy

A Material 3 tonal palette generated from a teal seed (#006A60). Primary for the main actions and progress, primary container for selection and the reader header, tertiary (warm yellow) for the Save button and highlights, error red only for failures.

Dark mode uses the matching dark tonal roles (primary #84D5C6 on #0E1513), not a dimmed light theme.

---

## Imagery

Every piece of content deserves a visual identity.

Whenever available:

* Hero image
* Video thumbnail
* Book cover
* PDF preview
* Repository avatar

Thumbnails are cropped into the content type's shape; without an image, the shape is filled with its tonal colour and the type's initial. The latest unfinished item gets a large Continue card.

Avoid walls of text.

---

# Motion

Motion should communicate continuity.

Never use animation for decoration.

Transitions should make navigation feel natural.

Scrolling should remain buttery smooth.

Animations should be subtle and calm.

---

# Cards

Content cards are the heart of Ohara.

Every card should quickly answer:

What is this?

Why should I care?

How much time will it take?

Suggested structure:

Hero Image

↓

Title

↓

One-line Summary

↓

Reading Time

↓

Source

↓

Content Type

↓

Status

Cards should invite interaction.

---

# Reader Experience

The Reader is the most important screen.

Everything else exists to get here.

Requirements:

Beautiful typography

Comfortable margins

Reader mode whenever possible

Minimal distractions

Reading progress

Easy return to previous position

Optional offline access

Reading should always feel better than opening the original webpage.

---

# Home Screen

The Home screen should never become a dashboard.

Avoid statistics.

Avoid charts.

Avoid productivity metrics.

Instead present:

Continue Reading

Recommended Today

Recently Saved

Quick Reads

Deep Reads

Videos

Papers

Finished Recently

The question being answered is:

"What should I read now?"

---

# Search

Search is memory.

Not filtering.

Search should feel like asking your own brain.

Examples:

"marketing"

"pricing"

"agents"

"postgres"

"Karpathy"

Results should prioritize relevance over chronology.

---

# Projects

Projects are contextual overlays.

They should never dominate the interface.

The library always remains the primary experience.

Projects help connect knowledge.

They do not organize it.

---

# Empty States

Empty states should encourage curiosity.

Avoid:

"No items found."

Prefer:

"Your library is waiting."

or

"Every great library begins with a single page."

---

# AI

AI should never feel noisy.

Avoid:

Popups

Chat bubbles everywhere

Constant suggestions

Instead:

Quiet summaries

Related content

Topic extraction

Recommendations

Automatic enrichment

AI should feel invisible.

---

# Performance

The interface should feel instant.

Immediate feedback matters more than raw benchmark speed.

Background work should stay in the background.

Never block reading while AI is processing.

---

# Accessibility

Readable fonts.

Large touch targets.

High contrast.

Support dynamic text sizes where practical.

Reading should be comfortable for long sessions.

---

# Things We Never Want

Dashboard syndrome

Too many buttons

Complex navigation

Tiny cards

Walls of metadata

Unread badges everywhere

Artificial gamification

Achievement systems

Streaks

The application should never make the user feel guilty for not reading.

---

# Inspirations

Products:

Android 16 system apps

Google Play Books

Gmail and Google Keep (Material 3 Expressive)

The goal is an app that feels native to Android and still has its own voice.

---

# The Ohara Feeling

When opening Ohara, the user should feel:

"This just works, and it's nice to use."

Not:

"Where is everything?"

Familiarity should replace friction.

Expressive details should replace blandness.

If a design decision breaks an Android convention without a clear reading benefit, it is the wrong decision.
