# Spec Delta

## Purpose

Defines the server-side endpoint through which the app obtains AI summaries and topics, so no provider key ever ships in the app and the server controls cost and abuse.

## ADDED Requirements

### Requirement: Authenticated Access Only
The system SHALL accept enrichment requests only from callers with a valid signed-in session and SHALL reject all others without calling any AI provider.

#### Scenario: Valid session
- **WHEN** a signed-in user sends article text to the enrichment endpoint
- **THEN** the system returns a summary and topics

#### Scenario: Missing or invalid session
- **WHEN** a request carries no session or an invalid one
- **THEN** the system responds 401 and makes no provider call

### Requirement: Server Owns Prompt And Limits
The system SHALL construct the prompt, choose the model, truncate input to a maximum length, and cap output length on the server, and SHALL ignore any prompt, model or limit supplied by the client.

#### Scenario: Client supplies its own prompt
- **WHEN** a request body includes a prompt or model field
- **THEN** the system ignores those fields and uses the server-defined prompt and model

#### Scenario: Oversized input
- **WHEN** the supplied text exceeds the server's maximum input length
- **THEN** the system truncates it to the maximum before calling the provider

### Requirement: Fixed Response Shape
The system SHALL return only a `summary` string and a `topics` list of at most five strings, and SHALL return an error rather than free-form model output when the provider response cannot be parsed into that shape.

#### Scenario: Provider returns malformed output
- **WHEN** the provider's response cannot be parsed into summary and topics
- **THEN** the system responds with an error and the request is not charged

### Requirement: Provider And Model Are Server Configuration
The system SHALL select the AI provider and model from server-side configuration, supporting at least OpenAI and Gemini, and SHALL allow switching without releasing a new app version.

#### Scenario: Provider switched by configuration
- **WHEN** the server's provider setting changes from `gemini` to `openai`
- **THEN** subsequent requests are served by OpenAI with no app update

### Requirement: Article Text Is Not Retained
The system SHALL NOT persist or log the submitted article text or the generated summary on the server.

#### Scenario: Inspecting server records after a request
- **WHEN** an enrichment request completes
- **THEN** no database row or log line contains the submitted text or the generated summary

### Requirement: Provider Failure Is Contained
The system SHALL return a clear error status when the provider fails or times out, and SHALL NOT expose provider error details, keys or internal configuration to the client.

#### Scenario: Provider outage
- **WHEN** the provider returns an error or times out
- **THEN** the system responds with a generic service-unavailable error
- **AND** the response contains no provider key or raw provider message
