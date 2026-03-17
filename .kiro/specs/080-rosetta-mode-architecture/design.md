# Design Document: Rosetta Mode Architecture

**Date**: March 16, 2026
**Spec**: 080 - Rosetta Mode Architecture
**Status**: Design Phase
**Dependencies**: None (Spec 050 Nav-TabBar-Base depends on this)

---

## Overview

This document details the architecture for mode-aware token resolution in the Rosetta System. The design activates the existing `ColorTokenValue` `light`/`dark` infrastructure at the primitive level and adds semantic override files for role-remapping tokens, producing a two-level resolver that sits between Registry and Generation in the token pipeline.

**Key architectural principle**: Most tokens are mode-aware through their primitives (Level 1). Only tokens where the primitive *name* changes between modes require semantic overrides (Level 2). Component tokens are excluded from the theme system entirely — they inherit mode awareness through the resolution chain.

---

## Architecture

### Current State

The token pipeline today:

```
Definition → Validation → Registry → Generation → Platform Output
```

Relevant existing infrastructure:

- `ColorTokenValue` (src/types/PrimitiveToken.ts:45-48): Has `light` and `dark` slots, each containing `ModeThemeValues` (`{ base: string, wcag: string }`). All primitives currently store identical values in both mode slots.
- `ModeThemeResolver` (src/resolvers/ModeThemeResolver.ts): Already resolves `colorValue[mode][theme]`. Has `resolve()`, `resolveAll()`, and `validate()` methods. Currently only used for primitive-level resolution.
- `SemanticTokenRegistry.resolveColorValue()` (src/registries/SemanticTokenRegistry.ts:123-156): Already reads `ModeThemeContext` and resolves through `colorValue[context.mode][context.theme]`. This is the existing semantic→primitive→mode resolution path.
- `SemanticToken.modeInvariant` (src/types/SemanticToken.ts:64): Boolean field already exists. `SemanticTokenValidator` already flags tokens marked `modeInvariant: true` that reference mode-aware primitives.
- `SemanticToken.primitiveReferences.wcagValue` (src/types/SemanticToken.ts:53-60): Inline WCAG override. Phase 2 migrates this to theme files.
- `TokenModifier` (src/types/SemanticToken.ts:31-36): Ordered modifiers (currently only `opacity`) applied after base value resolution.
- `resolveColorTokenValue()` (src/tokens/ColorTokens.ts:2133-2164): Standalone function that resolves `token.platforms.web.value[mode][theme]`.

### Proposed Pipeline

```
Definition → Validation → Registry → Semantic Override Resolution → Generation → Platform Output
```

The new step — Semantic Override Resolution — sits between Registry and Generation. It:
1. Loads semantic dark override file
2. For each semantic color token, checks if a dark override exists
3. If override exists: produces a modified token with the override's `primitiveReferences` for dark mode
4. If no override: passes the token through unchanged (primitive's own `light`/`dark` values handle mode differentiation)
5. Passes two fully resolved token sets (light, dark) to generators

### Two-Level Resolution

**Level 1 — Primitive mode values (no code changes to resolution path)**:

The existing `ModeThemeResolver.resolve()` and `SemanticTokenRegistry.resolveColorValue()` already read `colorValue[mode][theme]`. Activating Level 1 requires only data changes — populating distinct `dark` slot values in color primitives. The resolution code path is unchanged.

**Level 2 — Semantic override (new code)**:

A new `SemanticOverrideResolver` that:
1. Loads `src/tokens/themes/dark/SemanticOverrides.ts`
2. Validates all override keys exist in the semantic token registry (R4 AC1)
3. For dark mode resolution: swaps `primitiveReferences` on overridden tokens before passing to existing resolution
4. For light mode resolution: passes tokens through unchanged

**Pre-requisite fix — `resolveColorValue()` priority chain**: The existing `SemanticTokenRegistry.resolveColorValue()` (line 133-135) reads `primitiveReferences.default || .color || Object.values()[0]`. It does not explicitly check `.value`, which is the key used by simple overrides (`{ value: 'cyan100' }`). The `Object.values()[0]` fallback works but depends on object key insertion order — fragile. Fix: add `.value` explicitly to the priority chain before the `Object.values()` fallback. One-line change, eliminates a class of subtle bugs. (Ada R4 F20, Lina F25)

**Pre-requisite fix — `ModeThemeResolver.validate()` hex pattern**: The existing `validate()` method uses `/^#[0-9A-Fa-f]{6}$/` but all primitives store `rgba()` strings (324 occurrences, zero hex values). This will reject all primitives with distinct dark values. Fix: update regex to accept `rgba()` format or remove format check. (Ada R4 F19)

Override replaces the entire `primitiveReferences` object — no partial merge. This handles structural changes (composite `{ color, opacity }` → simple `{ value }`) cleanly.

**Modifier inheritance semantics**: If an override includes `modifiers` (even an empty `[]`), the override's modifiers replace the base token's modifiers. If an override omits the `modifiers` key entirely, the base token's modifiers are inherited. This distinction is meaningful: `modifiers: []` explicitly clears all modifiers (e.g., removing an opacity modifier when switching from composite to solid), while omitting `modifiers` preserves the base behavior. This prevents the composite→solid case from incorrectly inheriting an opacity modifier.

---

## Components and Interfaces

### SemanticOverride Type

```typescript
// src/tokens/themes/types.ts

import type { TokenModifier } from '../types/SemanticToken.js';

/**
 * A semantic override entry. Replaces the entire primitiveReferences
 * (and optionally modifiers) for a semantic token in a specific mode.
 */
export interface SemanticOverride {
  primitiveReferences: Record<string, string>;
  modifiers?: TokenModifier[];
}

/**
 * A semantic override file maps semantic token names to their overrides.
 * Every key MUST exist in the base semantic token registry.
 */
export type SemanticOverrideMap = Record<string, SemanticOverride>;
```

### SemanticOverrideResolver

```typescript
// src/resolvers/SemanticOverrideResolver.ts

import type { SemanticToken } from '../types/SemanticToken.js';
import type { SemanticOverrideMap } from '../tokens/themes/types.js';
import type { SemanticTokenRegistry } from '../registries/SemanticTokenRegistry.js';

export class SemanticOverrideResolver {
  constructor(
    private registry: SemanticTokenRegistry,
    private darkOverrides: SemanticOverrideMap
  ) {}

  /**
   * Validate that all override keys exist in the base registry.
   * Fails with descriptive error if any key is orphaned. (R4 AC1)
   */
  validate(): ValidationResult { /* ... */ }

  /**
   * Resolve a semantic token for a given mode.
   * - Light mode: returns token unchanged (base = light per Decision #4)
   * - Dark mode: if override exists, returns token with swapped primitiveReferences
   *              if no override, returns token unchanged (Level 1 handles it)
   */
  resolve(token: SemanticToken, mode: 'light' | 'dark'): SemanticToken { /* ... */ }

  /**
   * Resolve all semantic tokens for both modes.
   * Returns two complete token sets for generators.
   */
  resolveAll(tokens: SemanticToken[]): {
    light: SemanticToken[];
    dark: SemanticToken[];
  } { /* ... */ }
}
```

### Dark Theme File (Complete with Fallback)

```typescript
// src/tokens/themes/dark/SemanticOverrides.ts

import type { SemanticOverrideMap } from '../types.js';

/**
 * Dark mode theme file — complete inventory of all semantic color tokens.
 *
 * POPULATED entries: tokens with dark mode overrides (different primitive
 * name or structural change). These are exported in the map.
 *
 * COMMENTED-OUT entries: tokens handled by primitive dark values (Level 1)
 * or not yet designed for dark mode. These fall back to base automatically.
 *
 * Generated by theme file generator. Populated incrementally as component
 * dark mode designs are finalized.
 */
export const darkSemanticOverrides: SemanticOverrideMap = {
  // --- POPULATED: Nav-TabBar-Base tokens (dark values from Figma analysis) ---

  // Active icon — cyan500 in light, cyan100 in dark (role remapping)
  'color.action.primary': {
    primitiveReferences: { value: 'cyan100' }
  },

  // Composite → simple structural change
  'color.structure.border.subtle': {
    primitiveReferences: { value: 'gray500' },
    modifiers: []  // explicitly clear opacity modifier for solid dark value
  },

  // --- FALLBACK: Level 1 tokens (primitive handles mode) ---
  // 'color.structure.surface': base → white100 (primitive carries dark value)
  // 'color.structure.background': base → white200 (primitive carries dark value)

  // --- FALLBACK: Not yet designed for dark mode ---
  // 'color.feedback.success': base → green500
  // 'color.feedback.warning': base → yellow500
  // 'color.feedback.error': base → red500

  // ... all ~56 semantic color tokens listed (populated or commented-out)
};
```

### Primitive Data Changes (Level 1)

No interface changes needed. `ColorTokenValue` already has the right shape. Activation is a data task — populating distinct `dark` slot values.

Example before (current — inert):
```typescript
white100: {
  platforms: {
    web: {
      value: {
        light: { base: 'rgba(255, 255, 255, 1)', wcag: 'rgba(255, 255, 255, 1)' },
        dark: { base: 'rgba(255, 255, 255, 1)', wcag: 'rgba(255, 255, 255, 1)' }  // identical
      }
    }
  }
}
```

Example after (activated):
```typescript
white100: {
  platforms: {
    web: {
      value: {
        light: { base: 'rgba(255, 255, 255, 1)', wcag: 'rgba(255, 255, 255, 1)' },
        dark: { base: 'rgba(24, 34, 40, 1)', wcag: 'rgba(24, 34, 40, 1)' }  // distinct dark value
      }
    }
  }
}
```

### Generator Changes

Generators already receive resolved color values through `resolveColorTokenValue()` and `SemanticTokenRegistry.resolveColorValue()`. The change is that generators must now produce output for both modes.

**Web (TokenFileGenerator)**: Currently generates single CSS custom properties. Must generate `light-dark()` values:

```css
/* Before */
--color-surface-primary: rgba(255, 255, 255, 1);

/* After */
:root { color-scheme: light dark; }
--color-surface-primary: light-dark(rgba(255,255,255,1), rgba(24,34,40,1));
```

**iOS (TokenFileGenerator)**: Must generate dynamic `UIColor` or Asset Catalog entries with light/dark variants.

**Android (TokenFileGenerator)**: Must generate `lightColorScheme` and `darkColorScheme` objects.

**DTCG (DTCGFormatGenerator)**: Must emit mode contexts in the `$extensions.modes` structure, extending the existing `wcagValue` modes pattern (Spec 077).

### Pipeline Integration Point

The `SemanticOverrideResolver` integrates into `TokenFileGenerator` (src/generators/TokenFileGenerator.ts) or `TokenEngine` (src/TokenEngine.ts) — whichever orchestrates the generation step. The resolver runs once before generation, producing two token sets that generators iterate over.

---

## Data Models

### Resolution Flow

```
Semantic Token
  │
  ├─ [Level 2 check] Does dark override exist?
  │   ├─ YES → swap primitiveReferences for dark mode
  │   └─ NO  → use base primitiveReferences
  │
  ├─ Resolve primitive reference for current mode
  │   └─ primitiveToken.platforms.web.value[mode][theme]
  │      (existing ModeThemeResolver path)
  │
  ├─ Apply modifiers (opacity composition)
  │   └─ TokenModifier[] applied in order after base resolution
  │
  └─ Output: resolved color string per mode × theme
```

### Resolution Matrix

| | base theme | WCAG theme |
|---|---|---|
| **light mode** | `primitive.light.base` | `primitive.light.wcag` |
| **dark mode** | `primitive.dark.base` | `primitive.dark.wcag` |

For Level 2 tokens, the primitive reference is swapped before this matrix is applied.

### Fallback Chain

1. Semantic dark override → if absent, use base semantic `primitiveReferences`
2. Primitive dark value → if absent or identical to light, use light value
3. WCAG theme value → if absent, use base theme value (existing `wcagValue` behavior, Phase 1)

---

## Correctness Properties

1. **Deterministic resolution**: Given the same token, mode, and theme, the resolver always produces the same output.
2. **Override isolation**: A dark override for token A does not affect token B's resolution.
3. **Fallback safety**: Every resolution path terminates with a valid color string. Missing dark values produce light values, never null or error.
4. **Structural replacement**: Override replaces entire `primitiveReferences` — no partial merge, no key-level patching.
5. **Modifier inheritance**: Override with `modifiers` key (even `[]`) replaces base modifiers. Override without `modifiers` key inherits base modifiers.
6. **Registry constraint**: Every override key must exist in the base registry. Orphaned overrides are build failures.
7. **Component exclusion**: Component tokens are never processed by the override resolver. They resolve through their semantic/primitive references.
8. **Backward compatibility**: Tokens without dark overrides and primitives without distinct dark values produce identical output to the pre-mode-architecture pipeline.

---

## Error Handling

| Error Condition | Behavior | Requirement |
|----------------|----------|-------------|
| Override key not in base registry | Build failure with descriptive error | R4 AC1 |
| Override references nonexistent primitive | Build failure with descriptive error | R3 AC4 |
| Primitive missing dark slot | Fall back to light value (no error) | R5 AC1 |
| No semantic override for dark mode | Use base primitiveReferences (no error) | R5 AC2 |
| Invalid ColorTokenValue structure | `ModeThemeResolver.validate()` returns false (existing behavior) | — |
| Token marked `modeInvariant` references mode-aware primitive | Validation warning (existing `SemanticTokenValidator` behavior) | — |
| Token exists in base but has no entry in theme file | Build warning (theme file out of sync) | R5 AC5 |

---

## Testing Strategy

### Layer 1: Resolver Unit Tests

- `SemanticOverrideResolver.validate()`: orphaned keys detected, valid overrides pass
- `SemanticOverrideResolver.validate()`: component token name in override file rejected (key not in semantic registry — tests correctness property #7 explicitly)
- `SemanticOverrideResolver.resolve()`: override swaps primitiveReferences for dark, passes through for light, handles structural replacement (composite → simple), handles empty override map
- `SemanticOverrideResolver.resolve()`: modifier inheritance — override with `modifiers: []` clears base modifiers, override without `modifiers` key inherits base modifiers
- `SemanticOverrideResolver.resolveAll()`: produces correct light and dark token sets
- Pre-requisite: `ModeThemeResolver.validate()` accepts `rgba()` format (fix hex-only regex)
- Pre-requisite: `resolveColorValue()` explicitly checks `.value` key in priority chain

### Layer 2: Mode Parity Validation (CI, on token file changes)

- For each semantic color token: verify both light and dark resolve to valid primitive references
- Report tokens using fallback values (no distinct dark definition) — audit report, not build failure
- Report Level 1 vs Level 2 classification
- Distinguish: commented-out entry in theme file (intentional fallback, audit report) vs no entry at all (theme file out of sync, build warning)

### Layer 3: Generator Integration Tests

- Web: `light-dark()` output format correct
- iOS: dynamic color output format correct
- Android: color scheme output format correct
- Mode-invariant tokens: single value output (optimization)

### Layer 4: Backward Compatibility Regression

- Run full pipeline with current (identical light/dark) primitive data
- Verify output matches pre-architecture output exactly — zero diff
- This validates correctness property #8 and ensures all 28 existing components continue working unchanged

### Layer 5: Phase 2 Regression Snapshots

- Pre-migration: snapshot all resolved values across light×dark × base×wcag matrix
- Post-migration: verify identical output at semantic AND component token levels
- WCAG cyan→teal swap: verify correct resolution through theme file mechanism

### Existing Test Compatibility

- `ModeThemeResolver` tests (src/resolvers/): unchanged — Level 1 uses existing resolution path
- `SemanticTokenValidator` `modeInvariant` tests (src/__tests__/spec073-opacity-architecture.test.ts): unchanged
- `wcagValue` infrastructure tests (src/generators/__tests__/WcagValueInfrastructure.test.ts): unchanged in Phase 1, updated in Phase 2
- DTCG export tests (src/generators/__tests__/WcagValueExportSupport.test.ts): extended with mode context

---

## Design Decisions

### Decision 1: Extend Existing ModeThemeResolver Rather Than Replace

**Choice**: Level 1 resolution uses the existing `ModeThemeResolver` and `SemanticTokenRegistry.resolveColorValue()` code paths. No changes to these classes.

**Rationale**: The resolution logic already works — `colorValue[mode][theme]` is correct. The gap is data (identical light/dark values), not code. Adding a new resolver class for Level 1 would duplicate working logic.

**Counter-argument**: The existing `ModeThemeResolver.validate()` requires hex format (`#RRGGBB`), but primitives store rgba strings. This validation may need updating. However, that's a bug fix, not an architecture change.

### Decision 2: SemanticOverrideResolver as Separate Class

**Choice**: Level 2 is a new `SemanticOverrideResolver` class, not an extension of `SemanticTokenRegistry` or `ModeThemeResolver`.

**Rationale**: Single responsibility. The override resolver does one thing: swap primitiveReferences based on mode. It doesn't resolve primitives, apply modifiers, or validate token structure. Those remain in their existing classes.

### Decision 3: Override File as TypeScript Export

**Choice**: `src/tokens/themes/dark/SemanticOverrides.ts` exports a typed `SemanticOverrideMap`.

**Rationale**: Compile-time type safety. The TypeScript compiler catches structural errors (wrong key names, missing required fields) before the build even runs. Consistent with all other token definitions in the system. (OQ-1 resolution)

### Decision 4: Generators Receive Two Token Sets

**Choice**: The resolver produces two complete token sets (light, dark). Generators iterate both and produce mode-aware output.

**Rationale**: Generators don't need mode logic — they just format values. The resolver handles all mode decisions. This keeps generators simple and testable.

**Counter-argument**: Two full token sets doubles the memory footprint during generation. For ~56 color tokens this is negligible. If the token count grows to thousands, consider a lazy resolution approach. Not a concern at current scale.

### Decision 5: No Explicit Light Theme File

**Choice**: Base semantic token definitions are the light theme. No `src/tokens/themes/light/` directory.

**Rationale**: An explicit light file would either re-export base (ceremony) or be empty (misleading). The resolver has no light override step. Tests call the resolver with `mode: 'light'` and `mode: 'dark'` — they don't read source files. (OQ-2 resolution, confirmed by all three reviewers)

---

**Organization**: spec-guide
**Scope**: 080-rosetta-mode-architecture
