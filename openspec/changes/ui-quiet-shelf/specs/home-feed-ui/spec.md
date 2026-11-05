## ADDED Requirements

### Requirement: Continue Reading Section
The system SHALL list started-but-unfinished items under a "Continue reading" heading above other items in the unfiltered Active feed, and SHALL show a single list without that heading when archived, searching or filtering.

#### Scenario: Library with a started article
- **WHEN** the Active feed has no search or filter and one item has reading progress between 2% and 97%
- **THEN** that item appears under "Continue reading" and the others under "Recently saved"

#### Scenario: Searching
- **WHEN** the user enters a search query
- **THEN** results appear in one list with no "Continue reading" heading

### Requirement: Feed Rows Show Source, Length And Progress
The system SHALL show each feed item's source domain, reading time or duration when known, content type, and, for started items, a progress line.

#### Scenario: Started article with reading time
- **WHEN** an item from `www.paulgraham.com` with a 45 minute reading time is 60% read
- **THEN** its row shows "paulgraham.com · 45 min · Blog" (or its type) and a progress line about 60% full
