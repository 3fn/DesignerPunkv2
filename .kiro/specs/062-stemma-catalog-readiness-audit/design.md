# Design Document: Stemma Catalog Readiness Audit

**Date**: February 25, 2026
**Spec**: 062 - Stemma Catalog Readiness Audit
**Status**: Design Phase
**Dependencies**: None

---

## Overview

This audit systematically inventories the Stemma component catalog, maps behavioral contracts across all active components, assesses contract diversity and system alignment, and produces a schema readiness recommendation with a contract system design brief.

The audit is structured as a phased evidence-gathering process with human checkpoints. Each phase builds on the previous phase's findings. The audit produces documents (findings, matrices, recommendations), not code.

---

## Architecture

### Audit Phases and Data Flow

```
Phase 1: Catalog Inventory
    → catalog-inventory.md
    → Human checkpoint
    
Phase 2: Contract Taxonomy Discovery
    → contract-taxonomy.md
    → format-divergence-summary.md
    → Human checkpoint

Phase 3: Contract Coverage Matrix + Intentional Exclusions
    → coverage-matrix.md
    → intentional-exclusions.md

Phase 4: Inheritance Mapping
    → inheritance-map.md

Phase 5: Test Coverage Overlay
    → test-coverage-overlay.md

Phase 6: Diversity & Readiness Assessment
    → readiness-recommendation.md
    → Human checkpoint

Phase 7: Contract System Design Brief + Domain Gap Flagging
    → contract-system-design-brief.md
    → domain-gap-summary.md
    → Human checkpoint
```

### Output Location

All audit deliverables go in `.kiro/specs/062-stemma-catalog-readiness-audit/findings/`.

---

## Components and Interfaces

### Evidence Sources

The audit draws evidence from these locations:

| Source | What It Provides |
|--------|-----------------|
| `src/components/core/*/` | Implemented components, platform directories |
| `src/components/core/*/*.schema.yaml` | Contract declarations per component |
| `src/components/core/*/contracts.yaml` | Dedicated contract files (Badge, Progress families) |
| `src/components/core/*/README.md` | Contract documentation in prose form |
| `src/components/core/*/__tests__/` | Test files for contract validation |
| `src/components/core/*/platforms/` | Platform implementations (web/ios/android) |
| `.kiro/steering/Component-Schema-Format.md` | Standard contracts library (16 contracts, 5 categories) |
| `.kiro/steering/Component-Inheritance-Structures.md` | Family status, inheritance trees, contract assignments |
| `.kiro/steering/Test-Behavioral-Contract-Validation.md` | 8 contract validation checklists |
| `.kiro/steering/stemma-system-principles.md` | Stemma principles, contract inheritance rules |

### Deliverable Formats

All deliverables are markdown documents. Matrices use markdown tables. The coverage matrix uses the three-state notation:
- ✅ Contract implemented
- ⚠️ Contract gap (should exist but doesn't)
- 🚫 Intentional exclusion (design decision)
- `—` Not applicable to this component

---

## Data Models

### Catalog Inventory Entry

```yaml
component:
  name: "Button-CTA"
  family: "Buttons"
  type: "primitive"  # primitive | semantic
  platforms:
    web: true
    ios: true
    android: true
  contract_format: "schema-inline"  # schema-inline | contracts-yaml | undocumented
  has_tests: true
```

### Contract Taxonomy Entry

```yaml
contract:
  name: "focusable"
  category: "interaction"
  in_standard_library: true
  components_using: ["Button-CTA", "Input-Text-Base", "Chip-Base"]
  naming_variants: ["focusable", "keyboard_focusable"]
```

### Coverage Matrix Cell

```yaml
cell:
  component: "Chip-Base"
  contract: "supports_disabled_state"
  status: "exclusion"  # implemented | gap | exclusion | not_applicable
  evidence: "Chip-Base explicitly states: 'NO DISABLED STATES — if an action is unavailable, the component should not be rendered.'"
```

---

## Error Handling

### Ambiguous Contract Classification

When a component's contract documentation is ambiguous (e.g., a behavior is described in the README but not formalized in the schema or contracts.yaml):
- Document the ambiguity in the coverage matrix with a note
- Do not assume implementation — mark as ⚠️ with explanation
- Flag for Lina to clarify during domain gap review

### Missing Platform Implementations

When a component declares platform support but the platform directory is empty or contains only stubs:
- Document as "declared but not verified" in the catalog inventory
- Do not count toward platform parity in the readiness assessment
- Flag in the domain gap summary

### Conflicting Documentation

When the standard library, schema, and README disagree about a component's contracts:
- Document all three sources and the conflict
- Use the most specific source (component-level) as the primary evidence
- Note the conflict in the format divergence summary

---

## Testing Strategy

This is an audit spec — it produces documents, not code. There are no automated tests to write.

Validation is through human checkpoint reviews at the end of Phases 1, 2, 6, and 7. Each checkpoint verifies:
- Findings are evidence-based (traceable to specific files)
- Matrices are complete (no components or contracts missing)
- Recommendations include counter-arguments
- Domain gaps are correctly attributed to the right agent

---

## Design Decisions

### Decision 1: Phased Evidence Gathering with Human Checkpoints

**Options Considered**:
1. Single-pass audit producing all deliverables at once
2. Phased audit with checkpoints after every phase
3. Phased audit with checkpoints at key decision points (Phases 1, 2, 6, 7)

**Decision**: Option 3 — phased with selective checkpoints

**Rationale**: Checkpoints after every phase would slow the audit unnecessarily for phases that are mechanical (3, 4, 5). Checkpoints at Phases 1 and 2 catch inventory and taxonomy errors early before the matrix is built on them. Checkpoints at Phases 6 and 7 ensure the recommendation and design brief have human review before being treated as inputs to downstream work.

**Trade-offs**: Phases 3-5 proceed without explicit human review, which means errors in the matrix, inheritance map, or test overlay could propagate to the readiness assessment. Mitigated by the Phase 6 checkpoint reviewing all prior deliverables.

### Decision 2: Three-State Coverage Notation (✅ ⚠️ 🚫)

**Options Considered**:
1. Binary (present/absent)
2. Three-state (implemented/gap/exclusion)
3. Four-state (implemented/gap/exclusion/not-applicable)

**Decision**: Option 3 — four-state, with `—` for not-applicable

**Rationale**: Lina's consultation identified that intentional exclusions (Chips' "no disabled states") must be distinguished from gaps. Binary notation would treat design decisions as bugs. The not-applicable state handles cases where a contract category doesn't apply to a component family (e.g., `validates_on_blur` for Icon-Base).

**Trade-offs**: Four states require judgment calls about what's "intentional exclusion" vs. "gap." Mitigated by requiring evidence (documented design rationale) for every 🚫 classification.

### Decision 3: Discover Taxonomy from Components, Not Standard Library

**Options Considered**:
1. Use the standard library's 16 contracts and 5 categories as the matrix columns
2. Discover the real taxonomy from component implementations

**Decision**: Option 2 — discover from components

**Rationale**: Lina's analysis found 11 contract categories in use vs. 5 in the standard library. Using the standard library as the baseline would miss 6 categories (content, shape, composition, performance, visual, layout) and produce a matrix that understates the system's actual behavioral surface.

**Trade-offs**: Discovery is more work than using a predefined list. The discovered taxonomy may be messy (overlapping categories, inconsistent naming). This is acceptable — the audit's job is to surface reality, not impose order. The contract system design brief (Requirement 7) is where order gets proposed.

### Decision 4: Platform Parity as Declared vs. Actual

**Options Considered**:
1. Trust platform declarations in schemas
2. Verify platform implementations exist in platform directories
3. Verify platform implementations are functional (run tests)

**Decision**: Option 2 — verify existence, not functionality

**Rationale**: Verifying functionality would require running platform-specific tests (XCTest for iOS, Compose tests for Android), which is out of scope for this audit. Verifying that platform directories contain non-stub implementations is sufficient to assess declared vs. actual coverage.

**Trade-offs**: A platform directory could contain non-functional code that passes the existence check. This is a known limitation — the test coverage overlay (Requirement 5) partially mitigates this by showing which platforms have test coverage.
