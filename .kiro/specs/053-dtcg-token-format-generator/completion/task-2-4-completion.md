# Task 2.4 Completion: Shadow Token Generation with Opacity Merge

**Date**: February 17, 2026
**Spec**: 053 - DTCG Token Format Generator
**Task**: 2.4 Implement shadow token generation with opacity merge
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 053-dtcg-token-format-generator

---

## Summary

Implemented `generateShadowTokens()` in DTCGFormatGenerator to transform semantic shadow compositions into DTCG `shadow` type tokens. Each shadow token resolves its primitive references (offsetX, offsetY, blur, opacity, color), merges color+opacity into a single RGBA value using `mergeShadowColor()`, and outputs a DTCG-compliant shadow composite.

## Implementation Details

### Changes Made

**`src/generators/DTCGFormatGenerator.ts`**:
- Added imports for shadow primitive tokens: `shadowBlur`, `shadowOffsetX`, `shadowOffsetY`, `shadowOpacityTokens` and semantic `shadowTokens`
- Replaced `generateShadowTokens()` stub with full implementation iterating over all semantic shadow tokens
- Added `resolveShadowPrimitive()` helper to handle dot-notation primitive names (e.g., `shadowOffsetX.000` → key `000`)
- Shadow color alpha is replaced (not multiplied) with shadow opacity per Design Decision 3
- `spread` set to `0px` for all shadows per Requirement 5.4
- Android elevation included in `$extensions.designerpunk.platforms.android.elevation`
- Primitive references included in `$extensions.designerpunk.primitiveRefs`

### Key Design Decisions

- Shadow opacity overrides color alpha (replace, not multiply) — matches Design Decision 3
- Dot-notation primitive names resolved via `resolveShadowPrimitive()` helper
- Shadow group keys strip `shadow.` prefix (e.g., `shadow.container` → `container` in DTCG group)

## Validation

- All 320 test suites pass (8244 tests)
- No TypeScript diagnostics
- Shadow tokens generate correct DTCG shadow composite values with merged color+opacity

## Requirements Validated

- 5.1: Shadow color and opacity merged into single DTCG color value (alpha replaced)
- 5.2: Semantic colors with embedded opacity — shadow opacity overrides
- 5.3: Shadow compositions output as DTCG shadow type with offsetX, offsetY, blur, spread, color
- 5.4: Spread set to 0px for all shadows
- 5.5: Android elevation included in extensions
