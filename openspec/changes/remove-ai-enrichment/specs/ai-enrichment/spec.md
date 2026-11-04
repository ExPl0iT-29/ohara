## REMOVED Requirements

### Requirement: Ready Content Is Enriched With Summary And Topics
**Reason**: Ohara no longer includes AI. The embedded provider key made public distribution unsafe, and the product is now local-only with no AI.
**Migration**: None for users. Existing `summary` and `topics` values are retained in the database as legacy data but are not displayed or produced.

### Requirement: Enrichment Failure Never Reverts Extraction Status
**Reason**: There is no enrichment step that could fail.
**Migration**: None. Extraction status handling is unchanged and covered by `processing-pipeline`.

### Requirement: Active Provider Is Configurable Without Code Changes
**Reason**: There is no AI provider to configure.
**Migration**: Remove the `EXPO_PUBLIC_AI_PROVIDER` and provider key variables from build configuration.

### Requirement: Enrichment Never Blocks Or Duplicates Extraction
**Reason**: There is no enrichment step.
**Migration**: None.
