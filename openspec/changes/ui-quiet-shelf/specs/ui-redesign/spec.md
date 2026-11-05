## MODIFIED Requirements

### Requirement: Consistent design tokens
The system SHALL apply a single shared set of Quiet Shelf colour, typography, spacing and hairline tokens across all screens, defined in `src/theme/tokens.js` and the primitives in `src/components/ui/`, rather than ad hoc per-screen styling.

#### Scenario: Any screen renders
- **WHEN** any screen (feed, reader, capture, settings) renders a card, button, or interactive element
- **THEN** it uses the shared tokens and primitives: flat surfaces outlined by hairlines, a single teal accent, Instrument Sans for interface text and Literata for titles

#### Scenario: Reader body text renders
- **WHEN** the reader screen displays article body text
- **THEN** the body text is set in Literata at 18sp with a 30sp line height, unboxed and unshadowed

#### Scenario: Dark mode
- **WHEN** the device or the in-app theme setting is dark
- **THEN** every screen uses the dark palette, including the native window background, with no light flash on launch

## REMOVED Requirements

### Requirement: Hard-offset shadow primitive
**Reason**: Quiet Shelf uses flat surfaces and hairlines; hard offset shadows belonged to the neo-brutalist look.
**Migration**: None for users. `Button` and `Card` keep their APIs.

### Requirement: Folder-tab collection cards
**Reason**: The mobile app has no collection screen, and Quiet Shelf does not draw folder tabs.
**Migration**: None. `Card` still accepts `tabColor` for compatibility and ignores it.
