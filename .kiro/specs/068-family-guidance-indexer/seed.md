# Spec 068: Family Guidance Indexer

**Status**: Seed (captured from 067 discussion, not yet designed)
**Date**: 2026-03-02
**Origin**: Pattern B interview discussion — Peter asked whether Component-Family docs could accelerate the application MCP

---

## Problem

The application MCP (067) provides component selection, pattern serving, and assembly validation. But it lacks family-level intelligence — the knowledge captured in Component-Family docs about when to use which family member, prop guidance, and common composition patterns. This knowledge exists in 13 family docs as human-authored prose and tables but isn't machine-queryable.

## Key Findings (from 067 discussion)

### What family docs already contain (machine-useful)

- **"When to Use" / "When NOT to Use"** — structured bullet lists per family
- **"Primitive vs Semantic Selection"** — decision tables mapping scenarios → recommended components with rationale (Form-Inputs, Container)
- **Prop guidance** — emphasis variant selection (Button), padding override hierarchy (Container)
- **Common Patterns** — code examples showing cross-family composition (login form, settings panel, card patterns)
- **Inheritance hierarchies** — component status, relationships, planned variants

### What's NOT machine-parseable yet

- Structure varies between docs (custom sections, different table formats)
- Common Patterns are code examples, not structured data
- No consistent schema across the 13 family docs

### Revised timeline assessment

Originally estimated 2 specs away from family-doc-level MCP sophistication. After auditing Button, Form-Inputs, and Container docs: the content is rich enough already. The gap is an indexer + structured data format, not content authoring.

## Proposed Approach

1. Design a family guidance YAML schema (what structured data each family doc should contain)
2. Author YAML blocks inline in 2-3 family docs to validate the schema (interview-driven, same as 067 patterns)
3. Build Family Guidance Indexer that parses YAML blocks from family docs
4. Implement `get_prop_guidance` tool (deferred from 067 as D6)
5. Roll out structured YAML blocks to remaining family docs

### Key decision: YAML inline vs companion files

Peter's preference: start with YAML blocks inline in the family docs to ensure alignment with prose. Extract to companion files only if there's a compelling reason later. This avoids drift between structured data and the prose it mirrors.

### Ballot measure consideration

Family docs are steering docs — changes go through the ballot measure model. Adding YAML blocks to 13 docs is a significant documentation change that benefits from Peter's review. Schema design should be spec-level, not improvised per doc.

## Scope (rough, to be refined during design phase)

- Family guidance YAML schema definition
- YAML blocks authored in 3 family docs (Button, Form-Inputs, Container — already audited)
- Family Guidance Indexer (parses YAML from markdown)
- `get_prop_guidance` MCP tool
- Rollout to remaining 10 family docs

## Dependencies

- Spec 067 (Application MCP) — must be complete first
- Component-Family docs (13 exist, all production-ready content)

## Agents

- Lina (lead — component domain, indexer implementation)
- Ada (consult — token references in prop guidance)
- Thurgood (consult — schema validation, test governance)
