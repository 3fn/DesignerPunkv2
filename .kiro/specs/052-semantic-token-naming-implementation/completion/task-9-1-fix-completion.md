# Task 9.1.FIX Completion: Update component references from `color.border.subtle` to `color.structure.border.subtle`

**Date**: January 25, 2026
**Purpose**: Document completion of bug fix task updating component token references
**Organization**: spec-completion
**Scope**: 052-semantic-token-naming-implementation
**Task**: 9.1.FIX Update component references from `color.border.subtle` to `color.structure.border.subtle`

## Summary

Updated all component references from the old `color.border.subtle` token name to the new `color.structure.border.subtle` token name per Spec 052 semantic token naming restructure.

## Changes Made

### Container-Base Component

**Android Platform:**
- `ContainerBase.android.kt`: Updated example comment and `resolveContainerBaseBorderColor()` switch case
- `TokenMapping.kt`: Updated `resolveBorderColor()` example, switch cases in both `resolveBorderColor()` and `resolveColorToken()`, and token constant comment

**iOS Platform:**
- `ContainerBase.ios.swift`: Updated example comment and `resolveContainerBaseBorderColor()` switch case
- `TokenMapping.swift`: Updated token constant comment

**Web Platform:**
- `token-mapping.ts`: Updated JSDoc example comment

**Documentation:**
- `Container-Base.schema.yaml`: Updated borderColor common values and token references
- `README.md`: Updated all code examples and token documentation

**Tests:**
- `ContainerBase.test.ts`: Updated test expectations for border color token mapping

### Container-Card-Base Component

**Android Platform:**
- `ContainerCardBase.android.kt`: Updated `CardBorderColor` enum comment, `mapCardBorderColorToColor()` comment, and token constant reference

**iOS Platform:**
- `ContainerCardBase.ios.swift`: Updated `CardBorderColor` enum comment, `mapCardBorderColorToColor()` comment, and token constant comment

**TypeScript:**
- `tokens.ts`: Updated `cardBorderColorTokenMap` mapping

**Documentation:**
- `Container-Card-Base.schema.yaml`: Updated token references
- `README.md`: Updated border color token table

**Tests:**
- `ContainerCardBase.test.ts`: Updated test expectations for border color token mapping

## Validation

- All 165 Container component tests pass
- No remaining `color.border.subtle` references in component files

## Requirements Addressed

- **2.5**: Border color token naming consistency
- **6.6**: Container-Base focus outline uses accessibility token
- **6.7**: Container-Card-Base focus outline uses accessibility token
