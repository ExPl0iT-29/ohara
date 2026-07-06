## Purpose

Optional contextual overlays over content (ADR-002). Projects never own content — a content item may belong to zero, one, or many projects, and deleting a project never deletes or modifies content.

## Requirements

### Requirement: Create a project
The system SHALL expose `POST /projects` to create a project with a required `name`.

#### Scenario: Create with valid name
- **WHEN** a client posts `{"name": "Research"}` to `POST /projects`
- **THEN** the system creates a project and returns it with a generated id and `createdAt`

### Requirement: List projects
The system SHALL expose `GET /projects` returning all projects.

#### Scenario: List existing projects
- **WHEN** a client requests `GET /projects`
- **THEN** the system returns all created projects

### Requirement: Delete a project without deleting its content
The system SHALL expose `DELETE /projects/{projectId}` to delete a project, and SHALL NOT delete, modify, or otherwise affect any content item previously associated with that project.

#### Scenario: Delete a project with associated content
- **WHEN** a client deletes a project that has content associated with it
- **THEN** the project and its associations are removed, and every previously-associated content item still exists unchanged and is retrievable via `GET /content/{id}`

### Requirement: Associate content with a project
The system SHALL expose `POST /projects/{projectId}/content/{contentId}` to associate an existing content item with a project. A content item MAY be associated with zero, one, or many projects.

#### Scenario: Associate content with a project
- **WHEN** a client posts to `POST /projects/{projectId}/content/{contentId}` for an existing project and content item
- **THEN** the association is created and the content item appears in that project's content list

#### Scenario: Associate the same content with multiple projects
- **WHEN** a content item is associated with two different projects
- **THEN** the content item appears in both projects' content lists, and the underlying content row is unaffected by either association

### Requirement: Remove a content-project association
The system SHALL expose `DELETE /projects/{projectId}/content/{contentId}` to remove an association without deleting the content item.

#### Scenario: Remove an association
- **WHEN** a client deletes the association between a project and a content item
- **THEN** the content item no longer appears in that project's content list, but the content item itself still exists unchanged

### Requirement: List a project's associated content
The system SHALL expose `GET /projects/{projectId}/content` returning the full content items associated with a project.

#### Scenario: List content in a project
- **WHEN** a client requests `GET /projects/{projectId}/content` for a project with associated content
- **THEN** the system returns the full content items (same shape as reader-api's content response) for every content item associated with that project
