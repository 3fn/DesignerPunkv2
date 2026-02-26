# Task 1.1 Completion: Build Complete 108→Canonical Name Mapping

**Date**: February 25, 2026
**Task**: 1.1 - Build complete 108→canonical name mapping
**Type**: Architecture
**Status**: Complete

---

## Artifacts Created

- `.kiro/specs/063-uniform-contract-system/findings/canonical-name-mapping.md` — Complete mapping from all discovered contract names to canonical `{category}_{concept}` names

---

## Architecture Decisions

### Decision 1: Source Verification Over Taxonomy Trust

Rather than relying solely on the 062 taxonomy document's contract inventory, verified every contract name against actual source files (contracts.yaml, schema YAML, READMEs). This caught 5 missing contracts and several category misattributions in the taxonomy doc.

### Decision 2: Merge Strategy for Duplicate Concepts

8 cases where different source names describe the same behavior were merged to a single canonical name (e.g., `focusable` + `keyboard_focusable` → `interaction_focusable`). Merges documented in a dedicated table for traceability.

---

## Implementation Details

### Approach

1. Read all 9 contracts.yaml files, 14 schema-inline definitions, and 6 README contract tables
2. Cross-referenced against 062 taxonomy document to identify discrepancies
3. Applied `{category}_{concept}` naming convention with tiebreaker rule for ambiguous cases
4. Documented 8 edge cases with reasoning as precedent for migration

### Key Patterns

- Accessibility is the largest category (18 contracts) — notification contracts merged in per Decision 3
- Animation is the smallest (2 contracts) — most motion behaviors are mechanisms for other contracts
- 8 merges reduce 113 source names to 103 canonical names

---

## Validation (Tier 3: Comprehensive)

### Syntax Validation
✅ Mapping document is valid Markdown with consistent table formatting
✅ All canonical names follow `{category}_{concept}` snake_case convention
✅ No `supports_`, `provides_`, or other directional prefixes in canonical names

### Functional Validation
✅ Every contract name from all 9 contracts.yaml files accounted for
✅ Every contract name from all 14 schema-inline definitions accounted for
✅ Every contract name from all 6 README contract tables accounted for
✅ Standard library contracts listed separately (deprecated, not mapped)
✅ All 10 taxonomy categories represented in the mapping

### Design Validation
✅ Tiebreaker rule applied consistently — 8 edge cases documented with reasoning
✅ Merge decisions documented with rationale for each
✅ Category assignments align with purpose-oriented definitions from Decision 3
✅ Naming convention matches Decision 2 specification exactly

### System Integration
✅ Mapping references correct component names matching catalog inventory
✅ Canonical names are compatible with contracts.yaml format (Decision 1)
✅ Edge case precedents align with design-outline decisions (Lina Flags 1-3)

### Edge Cases
✅ `float_label_animation` → `content_float_label` (animation is mechanism, not purpose)
✅ `notification_semantics` → `visual_notification_color` (per Lina Flag 2 precedent)
✅ `non_interactive` → `accessibility_non_interactive` (per design-outline precedent)
✅ `audit_trail` flagged as needing formalization from implementation (not in README contracts table)
✅ `state_styling` / `state_selected_styling` boundary case flagged for human review

### Requirements Compliance
✅ Requirement 2.1: All canonical names follow `{category}_{concept}` pattern
✅ Requirement 2.2: No `supports_`, `provides_` prefixes in canonical names
✅ Requirement 2.5: Tiebreaker rule applied for multi-category contracts
✅ Requirement 3.1: All 10 taxonomy categories used in mapping
✅ Requirement 7.1: Complete mapping from all discovered names to canonical names produced
✅ Requirement 7.2: Mapping ready for human review before migration begins
✅ Requirement 7.3: Edge cases documented with classification reasoning as precedent

### Source Verification Findings
✅ Corrected total: 113 distinct contract names (not 108)
✅ Progress-Indicator-Node-Base: 5 contracts (taxonomy said 4, missed `renders_content`)
✅ Progress-Stepper-Base: 5 contracts (taxonomy said 4, missed `progressbar_accessibility`)
✅ Progress-Stepper-Detailed: 6 contracts (taxonomy said 5, missed `list_accessibility`)
✅ Category misattributions in taxonomy doc identified and corrected against source files
