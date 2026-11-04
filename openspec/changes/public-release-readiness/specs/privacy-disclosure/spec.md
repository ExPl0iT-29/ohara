# Spec Delta

## Purpose

Ensures the app's public privacy policy, in-app access to it, and Play Data safety declaration are accurate and consistent with the local-only behaviour, so users and Google can trust what the app says it does.

## ADDED Requirements

### Requirement: Public Privacy Policy
The system SHALL have a privacy policy published at a stable public HTTPS URL that is reachable without installing the app or signing in.

#### Scenario: Opening the policy URL
- **WHEN** anyone opens the policy URL in a browser
- **THEN** the policy loads with no login or app required

### Requirement: Policy States What Actually Happens
The policy SHALL state that the app has no accounts, collects no personal data, sends no library data to the developer or any third party, stores everything on the device, and contacts only the sites the user chooses to save.

#### Scenario: Reading the policy
- **WHEN** a person reads the policy
- **THEN** it states that no data is collected or shared
- **AND** it explains that saving a link makes the device request that page from its own website
- **AND** it explains that backups are files the user chooses to export

### Requirement: Policy Covers Deletion And Contact
The policy SHALL explain that all data is removed by clearing app data or uninstalling, and SHALL give a developer contact address.

#### Scenario: A user wants their data gone
- **WHEN** a person looks in the policy for how to delete their data
- **THEN** it tells them to clear app data or uninstall, and that the developer holds no copy

### Requirement: In-App Link To The Policy
The system SHALL show an About and privacy entry in Settings that opens the policy URL.

#### Scenario: Opening the policy from Settings
- **WHEN** a user taps the privacy entry in Settings
- **THEN** the policy opens in the system browser

#### Scenario: Policy cannot be opened
- **WHEN** the system cannot open the policy URL (for example no browser or no connection)
- **THEN** the app shows a calm message with the policy address, without crashing

### Requirement: Data Safety Declaration Matches Behaviour
The Play Data safety declaration SHALL state that the app collects and shares no user data, and SHALL stay consistent with the privacy policy and with `local-only-operation`.

#### Scenario: Comparing declaration and policy
- **WHEN** the Data safety answers are compared with the policy
- **THEN** both say no data is collected or shared

### Requirement: Disclosure Is Reviewed Before Data Handling Changes
The project SHALL treat any change that adds accounts, analytics, crash reporting, advertising, cloud storage, or AI as requiring an updated policy and Data safety declaration before release.

#### Scenario: A future change adds a network service
- **WHEN** a proposed change introduces any off-device data flow
- **THEN** its tasks include updating the policy and Data safety answers before release
