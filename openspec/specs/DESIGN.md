# Ohara Design System

This document defines the visual and interaction philosophy of Ohara.

It is not a UI specification.

It is a guide for making consistent design decisions throughout the lifetime of the project.

Whenever designing a screen or component, refer to this document before implementing.

---

# Design Mission

Ohara should feel like a bold, tactile personal library — playful and confident, not quiet and beige.

It is a save-and-read app, and it should look proud of that: chunky borders, punchy color, cards that feel like physical objects you can grab.

Opening Ohara should feel energizing, like flipping through a well-organized sticker book, not like tiptoeing into a reading room.

The interface has personality. It doesn't disappear — it invites.

The goal is to make saving and reading fast, satisfying, and a little fun.

---

# Emotional Goals

Every screen should evoke:

* Energy
* Playfulness
* Confidence
* Clarity
* Delight

Avoid creating feelings of:

* Sterility
* Corporate blandness
* Visual timidity
* Overload from clutter (bold ≠ busy)

Ohara should feel like a tool the user is excited to open.

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

Neo-brutalist: thick black borders, hard offset drop shadows (no blur), bold saturated accent colors, chunky rounded-but-square shapes, confident condensed display type for headings.

Think a well-made sticker or a physical folder with a colored tab — every element should look like it has weight and could be picked up.

---

## Typography

Headings use a bold, condensed, high-contrast display face — confident, a little loud.

Body/reading text stays highly readable — the reader view is the one place restraint wins over personality (see Reader Experience below).

Generous spacing still applies. Never compress text in the reader.

---

## Color Philosophy

Bold and saturated, not muted. A small palette of confident accent colors (e.g. warm yellow, hot pink, violet, mint) used deliberately per collection/category, against a warm off-white (not stark white) base and true-black borders/text.

Dark mode should keep the same energy — bold accents against a near-black surface, not a dimmed-down version of light mode.

---

## Imagery

Every piece of content deserves a visual identity.

Whenever available:

* Hero image
* Video thumbnail
* Book cover
* PDF preview
* Repository avatar

Cards are folder-tab shaped where they represent a collection, and image-forward where they represent content. Cards should feel like physical, grabbable objects — border + hard shadow, never flat.

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

Tuckii

Pop-art / neo-brutalist web design

Duolingo (confidence, color, character)

Physical objects:

Sticker books

Folder tabs and physical filing

Zines

The goal is to create the feeling of a tactile, colorful, personal collection — not a sterile productivity tool.

---

# The Ohara Feeling

When opening Ohara, the user should feel:

"This is satisfying to use."

Not:

"This feels like a spreadsheet."

Confidence should replace timidity.

Personality should replace blandness.

If a design decision moves the product away from this feeling, it is the wrong decision.
