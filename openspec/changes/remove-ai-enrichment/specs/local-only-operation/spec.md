# Spec Delta

## Purpose

Guarantees that Ohara works entirely on the user's device with no account, cloud storage, or AI provider, so the privacy and data-safety story is simply that nothing leaves the phone except fetching the pages the user chose to save.

## ADDED Requirements

### Requirement: No Account Or Sign-In
The system SHALL NOT offer, request, or require an account, sign-in, or user identity for any feature.

#### Scenario: Fresh install
- **WHEN** a user installs the app and opens it
- **THEN** every feature is available with no sign-in prompt of any kind

### Requirement: Library Stays On The Device
The system SHALL store the user's library, tags, highlights, reading progress and settings only in on-device storage, and SHALL NOT transmit them to any server operated by or for the app's developer.

#### Scenario: Using the app for a session
- **WHEN** a user captures, reads, tags and highlights items
- **THEN** no library content or user data is sent to any developer-operated server

### Requirement: No AI Provider Calls
The system SHALL NOT send saved content or any user data to an AI provider, and SHALL NOT contain AI provider credentials.

#### Scenario: Capturing an article
- **WHEN** a user captures a link and extraction completes
- **THEN** the item becomes `ready` with no summary or topics generated
- **AND** no request is made to an AI provider

#### Scenario: Inspecting the built app
- **WHEN** the built app bundle is inspected
- **THEN** it contains no OpenAI or Gemini key and no calls to either provider

### Requirement: Network Use Is Limited To Fetching Saved Pages
The system SHALL make network requests only to retrieve the content a user chose to save (the saved URL itself and the public endpoints needed to read it, such as a video's oEmbed data or a Google Doc's text export), and SHALL NOT include analytics, advertising, or tracking requests.

#### Scenario: Auditing network traffic
- **WHEN** the app's network traffic is observed across capture, reading, search and backup
- **THEN** every request targets a user-saved URL or a public read endpoint for it
- **AND** no analytics, advertising, or tracking request appears

### Requirement: Backup Is User-Initiated And Local
The system SHALL export and import the library only as a file the user explicitly shares or selects, and SHALL NOT back up automatically to any developer-operated service.

#### Scenario: Exporting the library
- **WHEN** a user triggers export
- **THEN** the library is written to a file handed to the platform share sheet and goes nowhere else
