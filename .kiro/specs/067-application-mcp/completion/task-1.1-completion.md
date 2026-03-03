# Task 1.1 Completion: Define Initial Experience Pattern Schema

**Date**: 2026-03-01
**Spec**: 067 - Application MCP
**Task Type**: Architecture (Tier 3)
**Status**: Complete

---

## What Was Done

Defined the experience pattern YAML schema and created the schema reference documentation.

### Artifacts Created

1. `experience-patterns/` — new directory for system-level pattern files
2. `experience-patterns/README.md` — schema reference with field tables, validation rules, token governance convention (D9), and example

### Schema Alignment

The schema maps directly to the design.md TypeScript interfaces:

| Interface | Schema Section |
|-----------|---------------|
| `ExperiencePattern` | Top-level fields |
| `PatternStep` | PatternStep table |
| `PatternComponent` | PatternComponent table |
| `PatternAlternative` | PatternAlternative table |

### Requirements Coverage

- Requirement 3.1: All top-level fields documented ✅
- Requirement 3.2: Step fields documented ✅
- Requirement 3.3: Component fields documented ✅
- Requirement 3.4: `source` enum documented, Tier 1 scope noted ✅
- Requirement 3.5: `extends` in schema, Tier 1 non-implementation noted ✅
- Requirement 3.6: Single vs multi-step semantics documented ✅
- Requirement 3.7: Token governance convention (D9) with correct/incorrect examples ✅

### Design Decisions

- Schema documented as a README in the `experience-patterns/` directory rather than a separate steering doc — keeps the reference co-located with the pattern files
- Validation rules section documents what the PatternIndexer (Task 1.5) will enforce, establishing the contract before the indexer is built
- Example uses a generic `simple-form` pattern to illustrate structure without committing to Pattern A interview content

### What This Enables

Task 1.2 (Pattern A interview) can now fill this schema live, discovering gaps between the documented structure and actual design judgment needs.
