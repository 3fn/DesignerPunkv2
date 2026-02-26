# Task 1 Summary: Canonical Name Mapping and Format Specification

**Date**: February 25, 2026
**Spec**: 063 - Uniform Contract System
**Task**: 1 - Canonical Name Mapping and Format Specification
**Status**: Complete

---

## What Was Done

Built the complete canonical name mapping and format specification that serve as the migration blueprint for the uniform contract system. All 113 discovered contract names across 28 Stemma components were mapped to 103 canonical `{category}_{concept}` names. The contracts.yaml canonical format was fully specified with field definitions, migration examples, and validation rules.

## Why It Matters

This is the prerequisite for migrating all 28 components to the uniform contract system. The mapping prevents mid-migration category debates by resolving all naming ambiguities upfront. The format specification gives migration a single authoritative reference for the target file structure. Without these, migration would require ad-hoc naming decisions on every component.

## Key Changes

- 113 contract names mapped to 103 canonical names (8 merges where different names described the same behavior)
- 8 edge cases resolved with documented tiebreaker reasoning, 2 confirmed by human review
- Canonical format specified: 3 header fields, 8 contract fields, 3 exclusion fields, inheritance declaration
- 4 migration scenarios documented with before/after examples
- 10 validation rules defined for migration validation tooling
- Source verification corrected the 062 audit's count from 108 to 113 (5 contracts missed in taxonomy)

## Impact

- Unblocks Task 2 (Component Migration) — all 4 subtasks can now proceed
- Establishes naming precedents that apply to all future contract creation
- Provides validation rules consumable by Task 3.4 (migration validation audit)
