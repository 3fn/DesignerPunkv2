# Task 2.3 Completion: Rename Existing Experience Patterns

**Date**: 2026-03-22
**Spec**: 083 — Application MCP Guidance Completeness
**Agent**: Lina
**Validation Tier**: 2 — Standard

---

## What Was Done

Renamed two existing experience patterns for naming consistency. Convention: pattern names describe the *thing*, not the *container* — consistent with `simple-form`.

| Old name | New name | Files changed |
|----------|----------|---------------|
| `settings-screen` | `settings` | filename, `name:` field |
| `account-onboarding` | `onboarding` | filename, `name:` field, `alternatives` reference |

### Cross-references updated

- `experience-patterns/simple-form.yaml` — alternatives: `account-onboarding` → `onboarding`
- `experience-patterns/onboarding.yaml` — alternatives: `settings-screen` → `settings`
- `family-guidance/progress.yaml` — relatedPatterns: `account-onboarding` → `onboarding`
- `family-guidance/button.yaml` — relatedPatterns: `account-onboarding` → `onboarding`
- `family-guidance/form-inputs.yaml` — relatedPatterns: `settings-screen` → `settings`
- `family-guidance/badges.yaml` — relatedPatterns: `settings-screen` → `settings`

### Not renamed

- `settings-screens` context values in component-meta.yaml files (7 files) — these are UI context strings, not pattern name references

### Historical docs

Per Spec 082 precedent, historical completion docs and release notes preserve original names.

## Artifacts

- Renamed: `experience-patterns/settings-screen.yaml` → `experience-patterns/settings.yaml`
- Renamed: `experience-patterns/account-onboarding.yaml` → `experience-patterns/onboarding.yaml`
- Modified: 4 cross-reference files (simple-form.yaml, progress.yaml, button.yaml, form-inputs.yaml, badges.yaml)

## Validation

- Before/after grep: no stale `settings-screen` or `account-onboarding` pattern references in live files
- Full Application MCP suite: 14 suites, 143 tests, all passing
