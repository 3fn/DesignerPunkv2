# Requirements Document: Primitive Radius Token Rename

**Date**: 2026-02-03
**Spec**: 055 - Primitive Radius Token Rename (radiusFull → radiusMax)
**Status**: Requirements Phase
**Dependencies**: None

---

## Introduction

The current token system has a naming collision bug where the primitive token `radiusFull` and semantic token `radiusFull` both generate the same CSS variable name `--radius-full`. This causes the semantic token to output `--radius-full: var(--radius-full)` (self-reference), which is invalid CSS.

This spec renames the **primitive** token from `radiusFull` to `radiusMax` to:
1. Eliminate the self-reference CSS bug
2. Preserve the semantic token name `radiusFull` (the public API)
3. Minimize blast radius (no component changes needed)

**Scope Boundaries**:
- **Rename**: Primitive token from `radiusFull` to `radiusMax` in `src/tokens/RadiusTokens.ts`
- **Update**: Semantic token reference from `{ value: 'radiusFull' }` to `{ value: 'radiusMax' }`
- **Keep unchanged**: Semantic token name `radiusFull`, component CSS references

---

## Glossary

- **Primitive_Token**: Base-level token with a direct value (e.g., `radiusMax = 9999px`)
- **Semantic_Token**: Higher-level token that references a primitive token for contextual meaning
- **Self_Reference_Bug**: CSS variable that references itself, causing invalid CSS output

---

## Requirements

### Requirement 1: Rename Primitive Token Definition

**User Story**: As a developer, I want the primitive radius token for 9999px to have a distinct name from the semantic token, so that CSS generation produces valid output.

#### Acceptance Criteria

1.1 WHEN the primitive RadiusTokens.ts file is updated THEN the System SHALL rename the token from `radiusFull` to `radiusMax`
1.2 WHEN the primitive token is renamed THEN the System SHALL preserve the value of 9999
1.3 WHEN the primitive token is renamed THEN the System SHALL preserve all metadata (category, mathematicalRelationship, isStrategicFlexibility)
1.4 WHEN CSS primitives are generated THEN the System SHALL produce `--radius-max: 9999px`

### Requirement 2: Update Semantic Token Reference

**User Story**: As a developer, I want the semantic `radiusFull` token to reference the renamed primitive, so that CSS generation produces valid output.

#### Acceptance Criteria

2.1 WHEN the semantic RadiusTokens.ts file is updated THEN the System SHALL change the reference from `{ value: 'radiusFull' }` to `{ value: 'radiusMax' }`
2.2 WHEN the semantic token name is checked THEN the System SHALL remain `radiusFull` (unchanged)
2.3 WHEN CSS semantics are generated THEN the System SHALL produce `--radius-full: var(--radius-max)`

### Requirement 3: Update Test Files

**User Story**: As a developer, I want all tests to reference the new primitive token name, so that the test suite passes.

#### Acceptance Criteria

3.1 WHEN radius token tests reference the primitive token THEN the System SHALL use `radiusMax` instead of `radiusFull`
3.2 WHEN tests validate the primitive token value THEN the System SHALL check `radiusMax.baseValue === 9999`
3.3 WHEN all tests are run THEN the System SHALL pass without errors related to the rename

### Requirement 4: Update Documentation

**User Story**: As a developer, I want the token documentation to reflect the new primitive name, so that documentation is accurate.

#### Acceptance Criteria

4.1 WHEN the Token-Family-Radius.md documentation is updated THEN the System SHALL replace primitive `radiusFull` references with `radiusMax`
4.2 WHEN the documentation shows the primitive token table THEN the System SHALL list `radiusMax` with value 9999px
4.3 WHEN the documentation shows the semantic token table THEN the System SHALL show `radiusFull` referencing `radiusMax`

### Requirement 5: Verify Badge Components Work

**User Story**: As a developer, I want badge components to render proper pill shapes after the fix, so that the original issue is resolved.

#### Acceptance Criteria

5.1 WHEN badge-count-base CSS uses `--radius-full` THEN the System SHALL render proper pill shapes for multi-digit counts
5.2 WHEN badge-count-notification CSS uses `--radius-full` THEN the System SHALL render proper pill shapes for multi-digit counts
5.3 WHEN the badge demo is viewed THEN the System SHALL display circular single-digit badges and pill-shaped multi-digit badges
