# Design Document: Uniform Contract System

**Date**: February 25, 2026
**Spec**: 063 - Uniform Contract System
**Status**: Design Phase
**Dependencies**: 062 - Stemma Catalog Readiness Audit (complete)

---

## Overview

This spec converges 4 existing behavioral contract documentation formats into a single uniform system optimized for AI agent consumption. The design is driven by 9 decisions made collaboratively with Peter, validated by Lina (component specialist) and Ada (token specialist).

The uniform system uses extended contracts.yaml as the sole source of truth, `{category}_{concept}` naming convention, a 10-category purpose-oriented taxonomy, explicit exclusion blocks, declare-and-resolve inheritance, and composition in schema YAML.

Full design rationale, counter-arguments, and consultation responses are documented in the design outline: `.kiro/specs/063-uniform-contract-system/design-outline.md`

---

## Architecture

### File Structure Per Component (After Migration)

```
src/components/core/[Component-Name]/
├── [Component-Name].schema.yaml    ← structural identity (props, tokens, platform, composes)
├── contracts.yaml                   ← behavioral guarantees (sole source of truth)
├── README.md                        ← documentation
└── __tests__/                       ← tests
```

contracts.yaml owns all behavioral contract data. Schema YAML owns structural identity and composition. No duplication between them.

### Canonical Format

```yaml
version: "1.0.0"
component: Component-Name
family: Family-Name

contracts:
  interaction_focusable:
    category: interaction
    description: Component receives keyboard focus
    behavior: |
      Detailed behavior description
    wcag: "2.1.1 Keyboard"
    platforms: [web, ios, android]
    validation:
      - Component receives focus via Tab key
      - Focus indicator visible
    test_approach: |
      How to test this contract
    required: true

excludes:
  state_disabled:
    reason: "If an action is unavailable, the component should not be rendered."
    category: state
    reference: "Component-Name.schema.yaml, design philosophy section"
```

### Child Component Format (With Inheritance)

```yaml
version: "1.0.0"
component: Input-Text-Email
family: Input-Text
inherits: Input-Text-Base

contracts:
  validation_email_format:
    category: validation
    description: Validates email address format
    behavior: |
      Validates input against email format rules
    wcag: "3.3.1 Error Identification"
    platforms: [web, ios, android]
    validation:
      - Valid email accepted
      - Invalid email triggers error state
    test_approach: |
      Enter valid and invalid email formats
    required: true
```

Parent contracts are resolved at read time by the metadata schema layer (spec 064). Child files are DRY — they declare inheritance and list only their own contracts.

---

## Taxonomy

10 categories with purpose-oriented definitions:

| # | Category | Definition |
|---|----------|------------|
| 1 | `layout` | Contracts governing how a component structures and arranges its content and data |
| 2 | `interaction` | Contracts governing how a component responds to user input across input methods |
| 3 | `state` | Contracts governing application-driven conditions that affect a component's availability or feedback |
| 4 | `validation` | Contracts governing a component's ability to evaluate input correctness and communicate results |
| 5 | `accessibility` | Contracts guaranteeing a component is perceivable, operable, and understandable by all users, including those using assistive technology — includes dynamic announcements and live region behaviors |
| 6 | `composition` | Contracts governing a component's relationship with its child components — what it contains, requires, or orchestrates |
| 7 | `content` | Contracts governing a component's required, conditional, or orchestrated display of data |
| 8 | `animation` | Contracts governing the motion and transitional behaviors of a component, including reduced-motion compliance |
| 9 | `visual` | Contracts governing a component's visual presentation — shape, color treatment, and appearance across states |
| 10 | `performance` | Contracts governing a component's rendering and loading behaviors |

### Classification Rules

- **Tiebreaker**: When a contract could fit multiple categories, assign to the category that best reflects its purpose for the end user
- **Animation vs. interaction**: Primary purpose determines category. User input response → interaction. Motion behavior → animation.
- **Content vs. composition**: Data display → content. Component assembly → composition.
- **Interaction note**: Category contains both capability contracts (`interaction_focusable`) and feedback contracts (`interaction_hover`). If this causes repeated confusion during migration, consider splitting into `interaction` and `feedback`.

---

## Design Decisions

### Decision 1: contracts.yaml as Sole Source of Truth
Schema YAML's `behavioral_contracts:` array removed. Eliminates sync problem. AI agents read one file for contracts.

### Decision 2: `{category}_{concept}` Naming Convention
Predictable pattern for agent read/write. No prefixes. Category field retained as redundancy for validation.

### Decision 3: 10-Category Taxonomy
Purpose-oriented definitions. Notification merged into accessibility. Shape merged into visual. Animation restored (16 components have animation behaviors).

### Decision 4: Lighter Exclusion Format
Three fields: reason, category, reference. Not full contract structure — exclusions aren't capabilities.

### Decision 5: Flat Hierarchy, Discovery Deferred
No abstract contract layer. Capability discovery deferred to metadata schema (spec 064). `{category}_{concept}` naming provides interim queryability.

### Decision 6: Declare-and-Resolve Inheritance
Child declares `inherits:`, lists only own contracts. Parent resolution at read time. Conceptual inheritance eliminated — formalize or drop.

### Decision 7: Composition in Schema YAML
Structural relationships live in schema YAML, not contracts.yaml. contracts.yaml = behavior. Schema YAML = identity.

### Decision 8: Deprecate Standard Library
Component-Schema-Format.md gets deprecation note. contracts.yaml files per component are the library. Ballot measure required.

### Decision 9: Update Governance Docs
Family list updated to 13+. Avatar reconciled. Ballot measure required.

---

## Testing Strategy

### Migration Validation (Thurgood)
- All 28 components have contracts.yaml in canonical format
- Zero naming inconsistencies across catalog
- All inheritance formally declared
- All exclusions captured in `excludes:` blocks
- Standard library deprecation applied
- Governance docs updated

### No New Behavioral Tests
Test gaps flagged in 062 audit (92% pattern matching, 2 untested components) are not addressed in this spec. This spec migrates contract documentation, not test implementations.

---

## Error Handling

### Migration Edge Cases
- **Ambiguous categorization**: Apply tiebreaker rule, document reasoning as precedent
- **Conflicting contract definitions**: When schema-inline and README disagree, prefer the more detailed source and flag the discrepancy
- **Missing contract information**: When extracting from README-only components, mark incomplete fields with `TODO` and flag for Lina review

---

## Related Documentation

- `.kiro/specs/063-uniform-contract-system/design-outline.md` — Full design rationale with counter-arguments and consultation responses
- `.kiro/specs/062-stemma-catalog-readiness-audit/findings/` — Audit findings driving this work
- `.kiro/specs/064-component-metadata-schema/design-outline.md` — Downstream consumer of this work
