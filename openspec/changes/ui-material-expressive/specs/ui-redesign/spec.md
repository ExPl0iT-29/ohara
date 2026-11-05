## MODIFIED Requirements

### Requirement: Consistent design tokens
The system SHALL apply a single shared set of Material 3 tonal colour, typography and shape tokens across all screens, defined in `src/theme/tokens.js` and the primitives in `src/components/ui/`, rather than ad hoc per-screen styling.

#### Scenario: Any screen renders
- **WHEN** any screen (feed, reader, capture, settings) renders a card, button, or interactive element
- **THEN** it uses the shared tonal surfaces, large rounded shapes and system Roboto from the shared tokens and primitives

#### Scenario: Reader body text renders
- **WHEN** the reader screen displays article body text
- **THEN** the body text is set at 17sp with a 28sp line height, outside any container

#### Scenario: Dark mode
- **WHEN** the device or the in-app theme setting is dark
- **THEN** every screen uses the dark tonal roles, including the native window background

## REMOVED Requirements

### Requirement: Hard-offset shadow primitive
**Reason**: Material Expressive uses tonal surfaces and native elevation; hard offset shadows belonged to the neo-brutalist look.
**Migration**: None for users. `Button` and `Card` keep their APIs.

### Requirement: Folder-tab collection cards
**Reason**: The mobile app has no collection screen, and this direction does not draw folder tabs.
**Migration**: None. `Card` still accepts `tabColor` and ignores it.
