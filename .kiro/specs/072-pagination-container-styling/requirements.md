# Requirements Document: Pagination Container Styling

**Date**: 2026-03-07
**Spec**: 072 - Pagination Container Styling
**Status**: Requirements Phase
**Dependencies**: Spec 073 (Opacity Architecture Evolution) — ✅ Complete

---

## Introduction

The Figma analysis pipeline revealed visual styling gaps between the current Progress-Pagination-Base implementation and the updated Figma design. The component currently renders pagination dots with no container styling (transparent background, no padding, no border-radius). This spec adds container styling across all three platforms (web, iOS, Android) using semantic tokens exclusively.

This is a visual-only update. No behavioral contracts, component API, or test suite changes.

---

## Requirements

### Requirement 1: Container Background

**User Story**: As a user viewing pagination indicators, I want the dots displayed on a dark translucent pill, so that they remain visible and readable regardless of the content behind them.

#### Acceptance Criteria

1. The pagination container background SHALL use `color.scrim.standard` (resolves to `rgba(0, 0, 0, 0.80)`).
2. The container background SHALL be identical in light and dark modes (`color.scrim.standard` is `modeInvariant: true`).
3. WHEN rendered on web THEN the background SHALL be applied via CSS using the `color.scrim.standard` token custom property.
4. WHEN rendered on iOS THEN the background SHALL be applied via SwiftUI `.background()` modifier using `DesignTokens.colorScrimStandard`.
5. WHEN rendered on Android THEN the background SHALL be applied via Compose `.background()` modifier using `DesignTokens.colorScrimStandard`.

### Requirement 2: Container Border-Radius

**User Story**: As a user viewing pagination indicators, I want the container to have a pill shape, so that it visually groups the dots as a cohesive element.

#### Acceptance Criteria

1. The pagination container border-radius SHALL use `radius.full` (resolves to 9999px / `Capsule()` / `RoundedCornerShape(percent = 50)`).
2. The pill shape SHALL render correctly at all three size variants (sm, md, lg).
3. WHEN rendered on web THEN the border-radius SHALL be applied via CSS using the `radius.full` token custom property.
4. WHEN rendered on iOS THEN the shape SHALL be applied via `.clipShape(Capsule())`.
5. WHEN rendered on Android THEN the shape SHALL be applied via `RoundedCornerShape(percent = 50)`.

### Requirement 3: Container Padding

**User Story**: As a user viewing pagination indicators, I want consistent inset spacing between the dots and the container edge, so that the dots don't appear cramped against the pill boundary.

#### Acceptance Criteria

1. WHEN size is sm or md THEN container padding SHALL use `space.inset.075` (resolves to 6px) on all sides.
2. WHEN size is lg THEN container padding SHALL use `space.inset.100` (resolves to 8px) on all sides.
3. Padding SHALL be applied uniformly (equal on all four sides).
4. WHEN rendered on web THEN padding SHALL be applied via CSS using the appropriate `space.inset.*` token custom property.
5. WHEN rendered on iOS THEN padding SHALL be applied via SwiftUI `.padding()` modifier.
6. WHEN rendered on Android THEN padding SHALL be applied via Compose `.padding()` modifier.

### Requirement 4: Item Gap

**User Story**: As a user viewing pagination indicators, I want consistent spacing between dots, so that individual indicators are visually distinct without excessive separation.

#### Acceptance Criteria

1. WHEN size is sm or md THEN the gap between nodes SHALL use `space.grouped.tight` (resolves to 4px).
2. WHEN size is lg THEN the gap between nodes SHALL use `space.grouped.normal` (resolves to 8px).
3. Sm and md sizes SHALL share the same gap value (two spacing tiers, not three).
4. CSS custom property fallback values SHALL be removed — token resolution failures are bugs, not fallback scenarios.
5. WHEN rendered on web THEN gap SHALL be applied via CSS `gap` property.
6. WHEN rendered on iOS THEN gap SHALL use the semantic token value for the appropriate size tier.
7. WHEN rendered on Android THEN gap SHALL use the semantic token value for the appropriate size tier.

> **Ada review note**: ACs 6-7 originally referenced specific function names (`PaginationGap.value(for:)`, `paginationGap()`). Revised to specify *what* (semantic token usage) rather than *how* (implementation function names). Implementation details are in the design doc.

### Requirement 5: Documentation

**User Story**: As a design system contributor, I want the component README and schema to reflect the new container tokens, so that the living documentation stays accurate.

#### Acceptance Criteria

1. The component README SHALL list all 6 container tokens in the Token Dependencies section: `color.scrim.standard`, `radius.full`, `space.inset.075`, `space.inset.100`, `space.grouped.tight`, `space.grouped.normal`.
2. The component schema (`Progress-Pagination-Base.schema.yaml`) SHALL include all 6 container token references.
3. The README SHALL document the container styling (background, pill shape, padding, gap) with per-platform notes where behavior differs.

---

## Documentation Requirements

This spec modifies an existing component's visual styling. Per Process-Spec-Planning documentation requirements:

**Component work documentation required**:
- README update with container token dependencies (Requirement 5, AC 1, 3)
- Schema update with token references (Requirement 5, AC 2)

**Waiver**: No new component README needed (component already exists). No accessibility documentation changes (no behavioral changes). No usage example updates (API unchanged).
