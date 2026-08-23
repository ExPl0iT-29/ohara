## MODIFIED Requirements

### Requirement: Consistent design tokens
The system SHALL apply a single shared set of neo-brutalist color, typography, border, and shadow tokens across all screens rather than ad hoc per-screen styling.

#### Scenario: Any screen renders
- **WHEN** any screen (feed, reader, capture, settings) renders a card, button, or interactive element
- **THEN** it uses the shared bold accent color tokens, black borders, and hard-offset shadow primitive (`BrutalCard`/`BrutalButton`) defined in `tailwind.config.js` and `src/components/ui/`

#### Scenario: Reader body text renders
- **WHEN** the reader screen displays article body text
- **THEN** the body text itself remains unbordered and unshadowed, using generous spacing and high readability, independent of the bold chrome used elsewhere on the same screen

## ADDED Requirements

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
