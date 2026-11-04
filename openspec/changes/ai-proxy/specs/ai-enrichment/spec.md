## MODIFIED Requirements

### Requirement: Ready Content Is Enriched With Summary And Topics
The system SHALL generate a `summary` and `topics` list for `Content` entities that are `ready` and have `extractedText`, by requesting them from the AI proxy on behalf of a signed-in user.

#### Scenario: Ready content with text gets enriched
- **WHEN** a signed-in user's Content entity has status `ready`, non-null `extractedText`, and null `summary`, and quota is available
- **THEN** the system sends the extracted text to the AI proxy
- **AND** on success, updates the entity's `summary` and `topics` fields

#### Scenario: Signed-out user gets no enrichment
- **WHEN** the account state is `signed-out`
- **THEN** no enrichment request is made
- **AND** the entity's other fields and status are unchanged

#### Scenario: Quota exhausted
- **WHEN** the proxy responds that the allowance is used up
- **THEN** the entity's `summary` and `topics` remain null and its status remains `ready`

### Requirement: Active Provider Is Configurable Without Code Changes
The system SHALL determine the active AI provider and model from server-side configuration (not hardcoded in the app), supporting at least `openai` and `gemini`.

#### Scenario: Provider selected via configuration
- **WHEN** the server configuration specifies `openai`
- **THEN** enrichment requests are served through the OpenAI provider implementation

#### Scenario: Provider switched via configuration
- **WHEN** the server configuration specifies `gemini`
- **THEN** enrichment requests are served through the Gemini provider implementation
- **AND** no app update is required

## ADDED Requirements

### Requirement: App Ships No AI Provider Credentials
The system SHALL NOT include any AI provider key, provider URL, or model name in the distributed app.

#### Scenario: Inspecting the built app
- **WHEN** the built app bundle is inspected
- **THEN** it contains no OpenAI or Gemini key and makes no direct calls to either provider

### Requirement: Un-Summarised Items Are Backfilled Within Quota
The system SHALL, while signed in with quota remaining, enrich `ready` items that have text but no summary, newest first, a bounded number per sweep, and SHALL stop when quota is exhausted.

#### Scenario: Signing in with an existing library
- **WHEN** a user with 100 un-summarised ready items signs in with 30 requests of allowance
- **THEN** items are enriched newest first until the allowance is used or the sweep limit is reached
- **AND** the remaining items stay un-summarised without error

### Requirement: Enrichment Failures Stay Silent
The system SHALL treat any proxy error, including 401, 429, 503 and network failure, as "no summary", with no blocking dialog, and SHALL NOT mark the entity `failed`.

#### Scenario: Proxy unreachable
- **WHEN** the proxy cannot be reached while enriching a ready item
- **THEN** the item stays `ready` and readable
- **AND** the user sees no error dialog
