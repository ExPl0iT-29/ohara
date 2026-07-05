## ADDED Requirements

### Requirement: Ready Content Is Enriched With Summary And Topics
The system SHALL generate a `summary` and `topics` list for `Content` entities that are `ready` and have `extractedText`, using the active `AIProvider`.

#### Scenario: Ready content with text gets enriched
- **WHEN** a Content entity has status `ready`, non-null `extractedText`, and null `summary`
- **THEN** the system sends the extracted text to the active AI provider
- **AND** on success, updates the entity's `summary` and `topics` fields

### Requirement: Enrichment Failure Never Reverts Extraction Status
The system SHALL leave a Content entity's status and extraction fields unchanged when AI enrichment fails, and SHALL NOT set status to `failed` due to an enrichment error.

#### Scenario: AI provider errors during enrichment
- **WHEN** the active AI provider raises an error while enriching a `ready` Content entity
- **THEN** the entity's status remains `ready`
- **AND** `summary` and `topics` remain null
- **AND** all previously extracted fields (title, extractedText, etc.) remain unchanged

### Requirement: Active Provider Is Configurable Without Code Changes
The system SHALL determine the active AI provider from configuration (not hardcoded), supporting at least `openai` and `gemini`.

#### Scenario: Provider selected via configuration
- **WHEN** the AI provider configuration specifies `openai`
- **THEN** enrichment requests are sent through the OpenAI provider implementation

#### Scenario: Provider switched via configuration
- **WHEN** the AI provider configuration specifies `gemini`
- **THEN** enrichment requests are sent through the Gemini provider implementation

### Requirement: Enrichment Never Blocks Or Duplicates Extraction
The system SHALL run enrichment as a step separate from extraction, and SHALL NOT re-run extraction as part of enrichment.

#### Scenario: Enrichment does not touch extraction fields
- **WHEN** enrichment runs for a Content entity
- **THEN** `title`, `extractedText`, `author`, `heroImage`, `duration`, and `readingTime` are not modified by the enrichment step
