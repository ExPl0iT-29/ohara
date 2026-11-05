## MODIFIED Requirements

### Requirement: Consistent design tokens
The system SHALL apply a single shared set of neo-brutalist color, typography, line, and shadow tokens across all screens rather than ad hoc per-screen styling.

#### Scenario: Any screen renders
- **WHEN** any screen (feed, reader, capture, settings) renders a card, button, or interactive element
- **THEN** it uses the shared bold accent colours, 2.5dp lines and hard-offset shadows defined in `src/theme/tokens.js`, `tailwind.config.js` and the primitives in `src/components/ui/`

#### Scenario: Reader body text renders
- **WHEN** the reader screen displays article body text
- **THEN** the body text itself remains unbordered and unshadowed, set in Literata at 17sp with a 29sp line height, independent of the bold chrome used elsewhere on the same screen

#### Scenario: Dark mode lines stay visible
- **WHEN** the theme is dark
- **THEN** lines and shadows use the dark line and shadow tokens, so borders remain visible against the dark surface

### Requirement: Hard-offset shadow primitive
The system SHALL render card and button shadows as a crisp, non-blurred offset layer identical across iOS and Android, rather than relying on platform-native shadow/elevation styling, with one fixed depth per element level.

#### Scenario: A BrutalCard or BrutalButton renders
- **WHEN** a `Card`, `Button`, `IconButton` or the FAB renders on either platform
- **THEN** a solid-colour offset layer appears behind the bordered foreground at its level's fixed offset (4dp for cards and the FAB, 3dp for buttons, 2dp for icon buttons), with no blur

#### Scenario: Flat elements
- **WHEN** a chip, text field or notice renders
- **THEN** it has a line but no offset shadow
