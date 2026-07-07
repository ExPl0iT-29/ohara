## ADDED Requirements

### Requirement: App branding
The system SHALL present the app under the name "Ohara" with a bookmark-themed icon and splash image, not Expo scaffold defaults.

#### Scenario: App installed on device
- **WHEN** the app is installed and viewed in the device's app drawer or home screen
- **THEN** it shows the name "Ohara" and a teal bookmark-ribbon icon on a paper-colored background

### Requirement: Consistent design tokens
The system SHALL apply a single shared set of color, typography, and radius tokens across all screens rather than ad hoc per-screen styling.

#### Scenario: Any screen renders
- **WHEN** any screen (feed, reader, capture) renders text, backgrounds, or interactive elements
- **THEN** it uses the shared `paper`/`ink`/`brand`/`line`/`danger`/`amber` color tokens and `display`/`title`/`body`/`caption` type scale defined in `tailwind.config.js`

### Requirement: Single navigation header per screen
The system SHALL show exactly one header/title per screen, not both expo-router's default route-name header and the screen's own title.

#### Scenario: Feed screen renders
- **WHEN** the feed screen is displayed
- **THEN** only the screen's own "Ohara" title is shown, with no separate "index" navigation bar above it
