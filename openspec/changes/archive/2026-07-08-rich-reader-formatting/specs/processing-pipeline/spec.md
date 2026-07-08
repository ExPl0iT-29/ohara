## MODIFIED Requirements

### Requirement: Reading Time Computed From Extracted Text
The system SHALL compute `readingTime` algorithmically from `extractedText` word count, ignoring HTML markup, without any AI involvement.

#### Scenario: Reading time set after text extraction
- **WHEN** extraction produces non-empty `extractedText` for a Content entity
- **THEN** `readingTime` is set to a value derived from the word count of that text, with any HTML tags excluded from the count

## ADDED Requirements

### Requirement: Web Page Extraction Preserves Formatting
The system SHALL preserve an article's structural HTML (headings, paragraphs, links, lists, blockquotes, images) in `extractedText` when extracting web page content, sanitized to remove scripts, styles, and event-handler attributes.

#### Scenario: Web page content extracted with formatting
- **WHEN** a `pending` Content entity has contentType `blog`, `website`, `documentation`, or `other`, and extraction succeeds via the primary extractor
- **THEN** `extractedText` contains sanitized HTML preserving the article's headings, paragraphs, links, lists, blockquotes, and images
- **AND** the entity's status becomes `ready`
