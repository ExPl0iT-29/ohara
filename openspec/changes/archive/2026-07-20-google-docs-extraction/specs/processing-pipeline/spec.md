## ADDED Requirements

### Requirement: Google Docs URLs Are Detected And Extracted Regardless Of Content Type
The system SHALL detect URLs matching the Google Docs document pattern (`docs.google.com/document/d/<id>/...`) and extract them via the Google Docs export path, independent of the entity's `contentType` field.

#### Scenario: Public Google Doc extracted
- **WHEN** a `pending` Content entity's URL matches the Google Docs document pattern and the doc is publicly viewable
- **THEN** the system fetches the doc's plain-text export, sets `extractedText` to that text, derives `title` from its first line, and computes `readingTime` from it
- **AND** the entity's status becomes `ready`

#### Scenario: Non-public Google Doc fails gracefully
- **WHEN** a `pending` Content entity's URL matches the Google Docs document pattern and the doc is not publicly viewable
- **THEN** the entity's status becomes `failed`
- **AND** the failure reason indicates the doc is not publicly viewable
