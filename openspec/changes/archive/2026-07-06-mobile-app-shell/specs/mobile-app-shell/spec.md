## ADDED Requirements

### Requirement: Expo project scaffold
The system SHALL provide a runnable Expo (React Native + TypeScript) project at `mobile/`, using Expo Router for file-based navigation.

#### Scenario: App starts
- **WHEN** a developer runs the Expo dev server from `mobile/`
- **THEN** the app builds and loads without errors on at least one platform (iOS/Android/web simulator)

### Requirement: Typed API client
The system SHALL provide a typed API client for the backend's capture and reader endpoints (`POST /content`, `GET /content`, `GET /content/{id}`), reading the API base URL from an environment variable.

#### Scenario: List content
- **WHEN** the app calls the list-content client function
- **THEN** it returns a typed array matching the reader-api `GET /content` response shape

#### Scenario: Get single content item
- **WHEN** the app calls the get-content client function with an id
- **THEN** it returns a typed object matching the reader-api `GET /content/{id}` response shape, or a not-found result for a missing id

### Requirement: React Query integration
The system SHALL expose React Query hooks (`useContentList`, `useContentItem`, `useCaptureContent`) wrapping the API client for use in screens.

#### Scenario: Hook fetches on mount
- **WHEN** a screen renders a component using `useContentList`
- **THEN** the hook triggers a `GET /content` request and exposes loading/data/error state

### Requirement: Baseline navigation shell
The system SHALL provide two placeholder screens wired into Expo Router navigation: a home/feed screen and a reader screen, styled with NativeWind.

#### Scenario: Navigate from feed to reader
- **WHEN** a user selects a content item on the home/feed placeholder screen
- **THEN** the app navigates to the reader placeholder screen for that item's id
