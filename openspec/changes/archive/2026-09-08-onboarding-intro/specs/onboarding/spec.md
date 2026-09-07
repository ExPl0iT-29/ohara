## ADDED Requirements

### Requirement: First-run intro screen
The system SHALL show a one-time intro screen on first launch explaining what Ohara does and how to add content, before the user reaches the main feed.

#### Scenario: App launched for the first time
- **WHEN** the app is launched and no `onboarding_complete` setting is stored
- **THEN** the app navigates to the onboarding screen instead of the feed

#### Scenario: Onboarding dismissed
- **WHEN** the user taps "Get started" on the onboarding screen
- **THEN** the system persists `onboarding_complete` and navigates to the feed

#### Scenario: App launched after onboarding was completed
- **WHEN** the app is launched and `onboarding_complete` is already stored
- **THEN** the app navigates directly to the feed, skipping onboarding

### Requirement: First-capture guidance
The system SHALL explain, both in onboarding and in the empty feed state, the two ways to add content: pasting a link into the Save screen, or sharing a link into Ohara from another app via the OS share sheet.

#### Scenario: Feed is empty
- **WHEN** the feed has no content and is not in a loading or error state
- **THEN** it displays a "Save a link" action alongside a mention of the share-sheet path
