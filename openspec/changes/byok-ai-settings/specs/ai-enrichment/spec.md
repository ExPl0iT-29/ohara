## MODIFIED Requirements

### Requirement: Active Provider Is Configurable Without Code Changes
The system SHALL determine the active AI provider and API key from on-device settings configured by the user in the app, supporting at least `openai` and `gemini`, falling back to build-time configuration only when no on-device setting has been saved.

#### Scenario: Provider selected via on-device settings
- **WHEN** a user selects `openai` as the AI provider in the app's Settings screen and saves an API key
- **THEN** enrichment requests are sent through the OpenAI provider implementation using that saved key

#### Scenario: Provider switched via on-device settings
- **WHEN** a user selects `gemini` as the AI provider in the app's Settings screen and saves an API key
- **THEN** enrichment requests are sent through the Gemini provider implementation using that saved key

#### Scenario: No on-device setting saved yet
- **WHEN** no AI provider/key has been saved in on-device settings
- **THEN** the system falls back to any build-time `EXPO_PUBLIC_*` configuration present, or performs no enrichment if neither is present

### Requirement: Enrichment Is Optional And The App Remains Fully Usable Without It
The system SHALL NOT require an AI provider or API key to be configured for any core function (capture, extraction, reading, search, tagging, archiving) to work.

#### Scenario: No AI key configured
- **WHEN** a user has not configured any AI provider or API key, in settings or via build-time configuration
- **THEN** captured content is still extracted and readable, and enrichment is silently skipped without error or degraded status
