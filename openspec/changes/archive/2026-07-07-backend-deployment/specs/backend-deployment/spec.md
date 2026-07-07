## ADDED Requirements

### Requirement: Backend runs independent of any developer machine
The system SHALL run the FastAPI web service and the content-processing worker as continuously-available services not dependent on a specific developer's laptop being powered on or tethered to a device.

#### Scenario: Phone requests content with laptop off
- **WHEN** the mobile app makes a request to the backend while the developer's laptop is off or disconnected
- **THEN** the request succeeds against the deployed backend

### Requirement: Deployment configuration is version-controlled
The system SHALL define its deployment configuration (services, build/start commands) in a repo-tracked file rather than only in a hosting provider's dashboard.

#### Scenario: Reviewing deployment setup
- **WHEN** someone inspects the repository
- **THEN** `backend/render.yaml` describes both the web and worker services' build and start commands
