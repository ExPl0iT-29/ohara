# Spec Delta

## Purpose

Defines how much AI each user may use, how usage is counted fairly, and how the service protects itself from runaway spend, so a free tier stays sustainable and premium can offer more.

## ADDED Requirements

### Requirement: Tiered Monthly Allowance
The system SHALL give each user a monthly count of AI enrichments determined by their tier (`free` or `premium`), read from server-side configuration that can change without an app release.

#### Scenario: New user is on the free tier
- **WHEN** an account is created
- **THEN** the user's tier is `free` and the free allowance applies

#### Scenario: Premium user has a larger allowance
- **WHEN** a user's tier is `premium`
- **THEN** the premium allowance applies, which is larger than the free allowance

#### Scenario: Limits retuned
- **WHEN** an operator changes the allowance for a tier in configuration
- **THEN** the new value applies to the next request with no app update

### Requirement: Quota Exhaustion Is Rejected Cleanly
The system SHALL respond 429 with the user's tier and reset date when the allowance is used up, and SHALL NOT call any AI provider for that request.

#### Scenario: Free user at the limit
- **WHEN** a free-tier user who has used their full monthly allowance sends a request
- **THEN** the system responds 429 including tier and reset date
- **AND** no provider call is made

### Requirement: Usage Is Counted Per Calendar Month
The system SHALL count usage per user per calendar month in UTC, and SHALL reset the count at the start of each month.

#### Scenario: Month rollover
- **WHEN** a new calendar month begins
- **THEN** a user's used count is zero

### Requirement: Retries Are Not Double-Charged
The system SHALL charge at most once for requests that carry the same request key from the same user within a month.

#### Scenario: Client retries after a timeout
- **WHEN** the client resends a request with the same request key
- **THEN** the usage count increases by one in total, not two

### Requirement: Failed Requests Are Not Charged
The system SHALL NOT count a request against the allowance when the provider fails or its output cannot be parsed.

#### Scenario: Provider error refunds the charge
- **WHEN** the provider fails after a request was admitted
- **THEN** the user's used count is the same as before the request

### Requirement: Concurrent Requests Cannot Exceed The Allowance
The system SHALL enforce the allowance atomically so concurrent requests cannot collectively exceed it.

#### Scenario: Parallel requests at the boundary
- **WHEN** a user with one request remaining sends several requests simultaneously
- **THEN** exactly one is admitted and the others receive 429

### Requirement: Global Daily Spend Cap
The system SHALL stop calling AI providers for all users once a configured daily request ceiling is reached, responding with a service-unavailable status until the next UTC day.

#### Scenario: Daily ceiling reached
- **WHEN** total admitted requests for the UTC day reach the configured ceiling
- **THEN** further requests are rejected with 503 and no provider call is made

### Requirement: Users Can See Their Usage
The system SHALL let a signed-in user read only their own used count, allowance and reset date, and the app SHALL display them in Settings.

#### Scenario: Viewing usage
- **WHEN** a signed-in user opens Settings
- **THEN** they see used and allowed AI summaries for the current month and the reset date

#### Scenario: Reading another user's usage
- **WHEN** a user queries usage records belonging to another user
- **THEN** the database returns no rows

### Requirement: Entitlement Data Is Not Client-Writable
The system SHALL allow only server-side processes to change a user's tier, and SHALL reject any client attempt to write tier, limits or usage.

#### Scenario: Client tries to upgrade itself
- **WHEN** a signed-in client attempts to set its own tier to `premium`
- **THEN** the write is rejected and the tier is unchanged
