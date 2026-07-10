## ADDED Requirements

### Requirement: Duplicate URL Detection On Capture
The system SHALL check whether an entered URL already exists in the library before capturing it, and if so, offer to open the existing item instead of creating a new one.

#### Scenario: Entering a URL already in the library
- **WHEN** a user enters a URL that matches an existing Content item's `url` exactly
- **THEN** the capture screen shows that the item already exists and offers a way to open it, instead of immediately saving a duplicate

#### Scenario: Entering a new URL
- **WHEN** a user enters a URL that does not match any existing Content item
- **THEN** the capture screen proceeds with the normal save flow, with no duplicate notice

### Requirement: Bulk URL Capture
The system SHALL let a user paste multiple newline-separated URLs into the capture screen and capture each as a separate Content item.

#### Scenario: Pasting multiple URLs
- **WHEN** a user pastes several URLs separated by newlines into the capture input and confirms
- **THEN** the app captures each non-empty line as a separate Content item

#### Scenario: Blank lines in a multi-URL paste are ignored
- **WHEN** a pasted block of URLs contains blank lines
- **THEN** the blank lines are skipped and do not produce empty or invalid Content items
