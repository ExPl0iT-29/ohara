# Ohara Design System

This document defines the visual and interaction philosophy of Ohara.

It is not a UI specification.

It is a guide for making consistent design decisions throughout the lifetime of the project.

Whenever designing a screen or component, refer to this document before implementing.

---

# Design Mission

Ohara should feel like a quiet, well-lit reading room you carry in your pocket.

It is a save-and-read app, and the reading is the product: the interface steps back so the words can come forward.

Opening Ohara should feel like opening a good book, not like opening an inbox.

The interface is calm and precise. It does not perform; it makes reading easy.

The goal is to make saving effortless and reading genuinely better than the original web page.

**Current direction: Quiet Shelf** (calm editorial).

---

# Emotional Goals

Every screen should evoke:

* Calm
* Focus
* Clarity
* Trust
* Quiet pleasure

Avoid creating feelings of:

* Urgency or guilt
* Clutter
* Decoration for its own sake
* Visual noise around the text

Ohara should feel like a place the user wants to spend twenty minutes.

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

Calm editorial. Hairline rules instead of borders, flat surfaces instead of shadows, generous margins, one accent colour used sparingly. Closer to a well-set book or a good magazine than to an app dashboard.

---

## Typography

Two faces, bundled with the app (both SIL OFL):

* **Literata** for titles and reading. It was designed for long-form reading on screens (it is the Google Play Books typeface). Reader body text is 18sp with a 30sp line height.
* **Instrument Sans** for interface text: labels, captions, buttons, metadata.

Small uppercase eyebrows (letter-spaced) label sections and sources. Never compress text in the reader.

---

## Color Philosophy

Muted and deliberate. A cool paper white (#F6F7F4) base, deep blue-grey ink (#1F2A2E), and a single teal accent (#2F6F73) for links, progress, selection and primary actions. Status colours (amber, red) appear only where something needs attention.

Dark mode is its own palette, not an inversion: near-black green-grey surfaces (#121616), soft off-white text, and a lighter teal (#7FC4C0) so the accent keeps its contrast.

---

## Imagery

Every piece of content deserves a visual identity.

Whenever available:

* Hero image
* Video thumbnail
* Book cover
* PDF preview
* Repository avatar

In the feed, imagery is a small square thumbnail beside the title, never a banner that pushes text down. Without an image, the content type's initial sits on a pale teal tile. In the reader, the hero image follows the title.

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

Matter

Instapaper

Google Play Books

Print:

Well-set books and literary magazines

The goal is a calm, typographic, personal library that makes reading feel unhurried.

---

# The Ohara Feeling

When opening Ohara, the user should feel:

"I can finally read this properly."

Not:

"Another feed to get through."

Calm should replace urgency.

Typography should replace decoration.

If a design decision makes the text harder to read or the screen louder, it is the wrong decision.
