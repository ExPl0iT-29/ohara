# Ohara

The project philosophy is defined inside:

openspec/specs/

Read every specification before implementing anything.

These documents are the source of truth.

Follow the OpenSpec workflow for all non-trivial changes.

Do not implement features that contradict the specifications.

When uncertain, ask before coding.

## Git Workflow

Each OpenSpec change/feature gets its own branch (e.g. `feature/content-model`, `feature/capture-endpoint`). Never commit feature work directly to `main`. Branch from `main` before starting implementation on a new change, and only merge back once the change's tasks are complete.
