## Purpose

Defines the shared visual identity (branding, design tokens, navigation chrome) applied consistently across all Ohara screens.
## Requirements
### Requirement: App branding
The system SHALL present the app under the name "Ohara" with a bookmark-themed icon and splash image, not Expo scaffold defaults.

#### Scenario: App installed on device
- **WHEN** the app is installed and viewed in the device's app drawer or home screen
- **THEN** it shows the name "Ohara" and a teal bookmark-ribbon icon on a paper-colored background

### Requirement: Consistent design tokens
The system SHALL apply a single shared set of neo-brutalist color, typography, border, and shadow tokens across all screens rather than ad hoc per-screen styling.

#### Scenario: Any screen renders
- **WHEN** any screen (feed, reader, capture, settings) renders a card, button, or interactive element
- **THEN** it uses the shared bold accent color tokens, black borders, and hard-offset shadow primitive (`BrutalCard`/`BrutalButton`) defined in `tailwind.config.js` and `src/components/ui/`

#### Scenario: Reader body text renders
- **WHEN** the reader screen displays article body text
- **THEN** the body text itself remains unbordered and unshadowed, using generous spacing and high readability, independent of the bold chrome used elsewhere on the same screen

### Requirement: Single navigation header per screen
The system SHALL show exactly one header/title per screen, not both expo-router's default route-name header and the screen's own title.

#### Scenario: Feed screen renders
- **WHEN** the feed screen is displayed
- **THEN** only the screen's own "Ohara" title is shown, with no separate "index" navigation bar above it

### Requirement: Hard-offset shadow primitive
The system SHALL render card and button shadows as a crisp, non-blurred offset layer identical across iOS and Android, rather than relying on platform-native shadow/elevation styling.

#### Scenario: A BrutalCard or BrutalButton renders
- **WHEN** a `BrutalCard` or `BrutalButton` component renders on either platform
- **THEN** a solid-color offset layer appears behind the bordered foreground content at a fixed pixel offset, with no blur

### Requirement: Folder-tab collection cards
The system SHALL render collection cards with a colored tab shape peeking above the bordered card body, distinct from content-item cards.

#### Scenario: Library screen shows collections
- **WHEN** the library/feed screen displays a list of collections
- **THEN** each collection card shows a colored folder-tab accent above a black-bordered card body with the collection name and item count

