# Ohara Design System

This document defines the visual and interaction philosophy of Ohara.

It is not a UI specification.

It is a guide for making consistent design decisions throughout the lifetime of the project.

Whenever designing a screen or component, refer to this document before implementing.

---

# Design Mission

Ohara should feel like a modern personal library.

Not a productivity application.

Not an AI dashboard.

Not a bookmark manager.

Opening Ohara should feel similar to entering a quiet reading room.

The interface should disappear behind the content.

The user should never feel overwhelmed.

The goal is to make reading irresistible.

---

# Emotional Goals

Every screen should evoke:

* Calm
* Curiosity
* Warmth
* Focus
* Trust

Avoid creating feelings of:

* Stress
* Urgency
* Information overload
* Productivity guilt

Ohara should never pressure the user.

Instead it should quietly invite them back.

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

Imagine a blend of:

Apple Books

*

Kindle

*

Linear's simplicity

*

Arc Browser's polish

*

The atmosphere of an old library

Without copying any of them.

---

## Typography

Typography is the primary design element.

Prioritize readability over uniqueness.

Headings should feel confident.

Body text should disappear into the reading experience.

Line length should encourage long-form reading.

Generous spacing is mandatory.

Never compress text.

---

## Color Philosophy

Colors should support reading.

Avoid overly saturated interfaces.

Prefer:

Warm neutrals

Soft grays

Muted accent colors

Natural surfaces

Dark mode should feel like reading under warm light rather than looking at a terminal.

---

## Imagery

Every piece of content deserves a visual identity.

Whenever available:

* Hero image
* Video thumbnail
* Book cover
* PDF preview
* Repository avatar

Cards should feel alive.

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

Apple Books

Readwise Reader

Arc Browser

Linear

Notion (simplicity only)

Kindle

Physical spaces:

Libraries

Bookstores

Reading rooms

University archives

Museums

The goal is to create the feeling of wandering through a thoughtfully curated library rather than managing digital files.

---

# The Ohara Feeling

When opening Ohara, the user should feel:

"I've been looking forward to reading."

Not:

"I have so much to catch up on."

Curiosity should replace guilt.

Reading should replace collecting.

Knowledge should replace clutter.

If a design decision moves the product away from this feeling, it is the wrong decision.
