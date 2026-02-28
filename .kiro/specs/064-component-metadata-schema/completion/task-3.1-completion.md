# Task 3.1 Completion: Create Authoring Guide

**Date**: 2026-02-28
**Spec**: 064 — Component Metadata Schema
**Task**: 3.1 — Create authoring guide
**Status**: Complete
**Tier**: 1 (Setup)

---

## What Was Done

Created `docs/component-meta-authoring-guide.md` — the authoring guide for component-meta.yaml files.

## Contents

- Field descriptions with good/bad examples for each field
- Purpose string guidance (verb-first, agent-selection-oriented, ~30 words)
- YAML key names matching parser expectations (`when_to_use`, `when_not_to_use`, kebab-case contexts)
- Complete example: Badge-Count-Base (all fields populated with realistic content)
- Minimal example: Divider-Base (empty alternatives list)
- New component checklist (6 steps)

## Key Decisions

- Examples use real Stemma components, not hypothetical ones
- `purpose` guidance emphasizes agent decision-making over human documentation — this is the core distinction from schema.yaml `description`
- Alternatives require exact canonical names; the MCP validates these at index time

## Validation

- ✅ Guide placed at `docs/component-meta-authoring-guide.md`
- ✅ Covers requirements 9.2 (authoring guide) and 9.5 (new component checklist)
- ✅ YAML field names match parser: `purpose`, `usage.when_to_use`, `usage.when_not_to_use`, `contexts`, `alternatives[].component`, `alternatives[].reason`
