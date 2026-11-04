# Spec Delta

## Purpose

Lets a user permanently delete their account and all cloud data from inside the app or from a public web page, as Google Play requires for apps that create accounts.

## ADDED Requirements

### Requirement: In-App Account Deletion
The system SHALL let a signed-in user delete their account from Settings after an explicit confirmation that states the deletion is permanent.

#### Scenario: User confirms deletion
- **WHEN** a signed-in user taps Delete account and confirms
- **THEN** the account and all of that user's cloud data are permanently deleted
- **AND** the app becomes signed-out

#### Scenario: User backs out
- **WHEN** a signed-in user taps Delete account and cancels the confirmation
- **THEN** nothing is deleted and the account stays signed-in

### Requirement: Deletion Removes All Cloud Data
The system SHALL delete the auth user and every cloud record owned by that user in the same operation, including records added by later features.

#### Scenario: Cloud records removed
- **WHEN** an account is deleted
- **THEN** no profile or other row owned by that user id remains in the database

#### Scenario: Deleted user cannot sign back into old data
- **WHEN** the same Google account signs in again after deletion
- **THEN** it is treated as a brand-new account with an empty profile

### Requirement: Deletion Leaves On-Device Content
The system SHALL NOT delete on-device content when an account is deleted, and the confirmation SHALL say so.

#### Scenario: Local library after deletion
- **WHEN** an account with a local library of 200 items is deleted
- **THEN** all 200 items remain on the device

### Requirement: Deletion Is Authenticated And Server-Enforced
The system SHALL perform deletion server-side for the user identified by a verified session, and SHALL NOT allow one user to delete another's account.

#### Scenario: Request without a valid session
- **WHEN** a deletion request arrives with no valid session
- **THEN** the request is rejected and nothing is deleted

#### Scenario: Request targets another user
- **WHEN** a deletion request includes a user id different from the session's user
- **THEN** the system ignores the supplied id and acts only on the session's user

### Requirement: Public Deletion Page
The system SHALL provide a public HTTPS page that explains what is deleted and lets a person delete their account without installing the app.

#### Scenario: Deleting from the web
- **WHEN** a person opens the deletion page, signs in with Google, and confirms
- **THEN** the same server-side deletion runs and the page confirms completion

#### Scenario: Page is reachable without an account
- **WHEN** anyone opens the deletion URL while signed-out
- **THEN** the page loads and explains the process
