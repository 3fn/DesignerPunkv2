# Rosetta Mode Architecture — Design Outline

**Date**: March 16, 2026
**Purpose**: Capture design decisions and architectural direction for mode-aware token resolution in the Rosetta System
**Status**: Design Outline (Pre-Requirements)
**Catalyst**: Spec 050 (Nav-TabBar-Base) blocked — component requires mode-differentiated semantic tokens that the system cannot currently express

---

## Problem Statement

DesignerPunk's token system has three resolution dimensions:

1. **Platform** (web, iOS, Android) — resolved at build time via platform generators ✓
2. **Theme** (base, WCAG) — resolved via `wcagValue` on `primitiveReferences` ✓
3. **Mode** (light, dark) — infrastructure exists at primitive level but is unused; no mechanism at semantic level ✗

The primitive `ColorTokenValue` structure already has `light` and `dark` keys with `ModeThemeValues` (`{ base: string, wcag: string }`), but all primitives currently store identical values in both mode slots. The keys exist but are inert.

Semantic tokens reference primitives by name (`primitiveReferences: { value: 'gray100' }`), and that reference resolves to the same value regardless of mode. There is no way to express "use `white100` in light mode and `gray400` in dark mode" at the semantic level.

### Immediate Impact

Spec 050 (Nav-TabBar-Base) requires mode-differentiated values for:
- Container background: `white100` (light) / `gray400` (dark)
- Icon colors: `cyan500`/`gray300` (light) / `cyan100`/`gray100` (dark)
- Gradient center colors: `cyan100` (light) / `cyan500` (dark)
- Indicator dot: `cyan500` (light) / `cyan100` (dark)
- Top stroke: `white200` (light) / `gray500` (dark)

These fall into two categories:
- **Value differentiation**: same primitive, different mode value (e.g., a gray that's lighter in light mode, darker in dark mode) — handled by activating the primitive's `light`/`dark` slots
- **Role remapping**: different primitive entirely per mode (e.g., `cyan500` in light → `cyan100` in dark) — requires semantic-level override

### Systemic Impact

Any component with light/dark visual differentiation will hit this same wall. This is not a Nav-TabBar-specific problem — it's a system-level gap.

---

## Scope

### In Scope

- Activate mode-aware primitive values (populate distinct `dark` slot values for color primitives)
- Design and implement semantic override files for role-remapping tokens
- Build two-level resolver (primitive mode resolution + semantic override for role remapping)
- Update platform generators to consume resolved mode-aware output
- Update DTCG export to support mode contexts
- Update documentation MCP to reflect mode architecture
- Update component MCP to reflect mode-aware token resolution
- Full audit of all ~56 semantic color tokens to determine override needs
- Theme file generation tooling for drift prevention
- Unify `wcagValue` pattern into the theme file architecture (Phase 2)

### Out of Scope

- Additional modes beyond light/dark (high contrast, compact, etc.) — architecture should support them, but implementation is deferred
- Component-level mode overrides — component tokens inherit mode awareness from the primitive and semantic layers below them; no component-level theme files needed (revisit if a component genuinely requires a different semantic concept per mode)
- Component-level mode forcing (e.g., forcing a component to light mode in a dark context) — future enhancement
- Runtime mode switching logic in platform implementations — platforms handle this natively

### Phasing

**Phase 1: Mode-Aware Primitives + Semantic Override Architecture**
- Activate primitive `dark` slots: populate distinct dark mode values for color primitives (full palette audit)
- Design semantic override file format (complete theme with fallback, DTCG Resolver-aligned)
- Build two-level resolver:
  - Level 1: Primitive mode resolution — read mode-appropriate value from primitive's `light`/`dark` slot
  - Level 2: Semantic override — for role-remapping tokens, swap the primitive reference before resolving
- Fallback behavior: absent dark values fall back to light values at both levels (graceful degradation, not build failure)
- Hard constraint: theme override files cannot introduce new token names — build-time validation against base token registry
- Create semantic dark theme file listing all semantic color tokens (populated entries for tokens identified in audit, fallback entries for the rest)
- Insert resolution step into the token pipeline (between Registry and Generation)
- Update platform generators to output mode-aware values:
  - Web: CSS `light-dark()` function or `prefers-color-scheme` media queries
  - iOS: Asset catalog with light/dark variants or `UIColor` dynamic providers
  - Android: `lightColorScheme`/`darkColorScheme`
- Build theme file generation tooling (CI-integrated drift prevention)
- Update DTCG export with mode contexts
- Update documentation MCP with mode architecture
- Update component MCP to reflect mode-aware token resolution
- Validate with Nav-TabBar-Base tokens as proof case (must include at least one composite-reference token)

**Phase 2: Unify Mode + Theme Resolution (wcagValue Migration)**
- Migrate `wcagValue` pattern into the theme file architecture
- Collapse mode (light/dark) and theme (base/WCAG) into a single resolver mechanism
- Theme files become the sole conditional resolution system — no more inline `wcagValue` on `primitiveReferences`
- Full resolution matrix expressed as theme contexts: `light-base`, `light-wcag`, `dark-base`, `dark-wcag`
- Migrate all existing semantic tokens that use `wcagValue` (currently 7 tokens) to theme file overrides
- WCAG cyan→teal action color swap serves as concrete validation case (same pattern as mode override)
- Update `SemanticToken` interface — remove `wcagValue` from `primitiveReferences`, simplify to single `value` key
- Update all generators, tests, and documentation
- Validate no behavioral regression — resolved values must match pre-migration output for all mode × theme combinations

---

## Architecture

### Current Pipeline

```
Definition → Validation → Registry → Generation → Platform Output
```

No mode awareness. Semantic tokens resolve to a single primitive, which outputs a single value per platform. The primitive `ColorTokenValue` structure has `light`/`dark` slots but they contain identical values.

### Proposed Pipeline

```
Definition → Validation → Registry → Mode Resolution → Generation → Platform Output
```

Mode Resolution is a new step with a two-level resolver:

1. **Level 1 — Primitive mode resolution**: Read the mode-appropriate value from the primitive's `light`/`dark` slot. This handles the common case where a semantic token references the same primitive name in both modes, but the primitive carries different values per mode.

2. **Level 2 — Semantic override (role remapping)**: For the smaller set of tokens where the primitive *name itself* changes between modes, a semantic override file swaps the primitive reference before Level 1 resolution occurs.

Most semantic tokens are handled entirely by Level 1. Level 2 is the exception — only needed when a component's dark mode design uses a fundamentally different color role (e.g., Nav-TabBar-Base active icon: `cyan500` in light → `cyan100` in dark).

### Two-Level Resolution Flow

```
For each semantic token, for each mode (light, dark):
  1. Check semantic override file for this token + mode
     → If override exists: use override's primitiveReferences
     → If no override: use base semantic token's primitiveReferences
  2. Resolve each primitive reference for the current mode
     → Read primitive's ColorTokenValue[mode][theme] slot
     → If primitive has no distinct dark value: fall back to light value
  3. Apply modifiers (e.g., opacity composition) to resolved values
  4. Pass resolved values to generators
```

### Fallback Behavior

Fallback operates at both levels (D2):

- **Primitive level**: If a primitive's `dark` slot is absent or identical to `light`, the light value is used. This is graceful degradation — a missing dark value produces the light value, which is always valid (just not optimized for dark mode).
- **Semantic level**: If no semantic override exists for a token in dark mode, the base semantic token's primitive reference is used, which then resolves per the primitive level above.
- **Omission is not an error** — it's a fallback. Mode parity testing produces an audit report ("these tokens are using fallback values — is that intentional?"), not a build failure.
- **Structural errors fail loudly**: a theme override referencing a nonexistent token or primitive is a build failure (D3).

### Hard Constraints

- **D3: Theme overrides cannot introduce new tokens.** Every key in a theme override file must exist in the base token registry. Build-time validation enforces this. This applies to both primitive and semantic theme files. Prevents theme files from becoming shadow token systems.
- **Component tokens are excluded from theme overrides.** Component tokens reference semantic tokens (or primitives), and mode awareness flows up through the resolution chain. No component-level theme files. If a component ever needs a different semantic *concept* per mode (not just a different value), that's a signal to revisit the semantic layer, not to add component overrides.

### Theme File Architecture (Complete Theme with Fallback)

Base semantic tokens define light mode values (the default). Dark theme files list every semantic color token — populated entries have dark overrides, unpopulated entries (commented out) fall back to base. The template generator produces the file skeleton; entries are populated incrementally as component dark mode designs are finalized.

```
src/tokens/
├── semantic/
│   └── ColorTokens.ts              ← base definitions (light mode values)
├── themes/
│   ├── dark/
│   │   └── SemanticOverrides.ts     ← complete token inventory (populated + fallback entries)
│   └── (future themes here)
└── resolver/
    └── ModeResolver.ts              ← two-level resolver
```

**Key insight**: Most semantic tokens are handled at the primitive level (Level 1) — the primitive carries mode differentiation in its `light`/`dark` slots. The dark theme file still lists all tokens for visibility and governance, but only a subset have populated override values. The exported `SemanticOverrideMap` contains only populated entries; the resolver falls back naturally for absent keys.

**Example — Level 1 (primitive handles it):**

Semantic token (unchanged between modes):
```typescript
'color.structure.surface': {
  primitiveReferences: { value: 'white100' }
}
```

Primitive `white100` carries mode-aware values:
```typescript
white100: {
  platforms: {
    web: {
      value: {
        light: { base: 'rgba(255, 255, 255, 1)', wcag: 'rgba(255, 255, 255, 1)' },
        dark: { base: 'rgba(24, 34, 40, 1)', wcag: 'rgba(24, 34, 40, 1)' }
      }
    }
  }
}
```

Resolved light: `rgba(255, 255, 255, 1)`. Resolved dark: `rgba(24, 34, 40, 1)`. No semantic override needed.

**Example — Level 2 (semantic override for role remapping):**

Base semantic token:
```typescript
'color.action.primary': {
  primitiveReferences: { value: 'cyan500' }
}
```

Dark semantic override (different primitive name):
```typescript
'color.action.primary': {
  primitiveReferences: { value: 'cyan100' }
}
```

Resolved light: `cyan500`'s light value. Resolved dark: `cyan100`'s dark value.

**Example — Opacity composition interaction (OQ-3):**

Base semantic token (composite):
```typescript
'color.structure.border.subtle': {
  primitiveReferences: { color: 'gray100', opacity: 'opacity048' }
}
```

If the dark mode design uses a solid color instead of a composite, the dark override replaces the entire `primitiveReferences` object:
```typescript
'color.structure.border.subtle': {
  primitiveReferences: { value: 'gray500' }
}
```

Override merge semantics: the override replaces the entire `primitiveReferences` object, not individual keys within it. This is simpler and safer — no partial merge ambiguity.

### Theme File Generation (D4)

A build-time tooling step (separate from the token pipeline) generates the dark theme file skeleton from the current base token set:

- Every semantic color token key listed — populated entries exported, unpopulated entries commented out with base primitive reference
- When tokens are added to base, the generator regenerates and the new token appears as a commented-out entry
- CI regenerates and compares against the existing theme file to flag:
  - New tokens needing dark mode evaluation (new commented-out entries)
  - Orphaned overrides from deleted tokens (populated entries for removed base tokens)

This is a standalone tooling step, not part of the token resolution pipeline. It runs alongside the pipeline in CI.

### Component Token Resolution

Component tokens are not part of the theme override system. They inherit mode awareness through the resolution chain:

1. Component token `navTabBar.icon.color.active` → references semantic `color.action.primary`
2. Semantic `color.action.primary` → has dark override? If yes, swap to `cyan100`. If no, use base `cyan500`.
3. Primitive `cyan100` or `cyan500` → read `dark` slot value

The component token never changes. Mode differentiation happens below it. Component tokens must still follow governance rules: they reference existing primitive or semantic tokens, and those references must be valid in all modes.

If a component token would need to reference *semantic token A* in light mode and *semantic token B* in dark mode, that's not a component-level problem — it means the semantic layer is missing a token that encodes that mode-aware role. The fix is always to add the right semantic token (with a dark override), keeping the component layer as a pure naming/aliasing layer.

**Future extension point**: Component-level mode forcing (e.g., an always-light modal overlay in a dark context) is not supported by the current architecture but is not prevented by it. When needed, the mechanism would be a pinned mode context passed into the resolver at the component level, overriding the system mode.

### Platform Output

| Platform | Light/Dark Mechanism | DesignerPunk Output |
|----------|---------------------|---------------------|
| **Web** | CSS `light-dark()` function + `color-scheme` property | `--color-surface: light-dark(rgba(255,255,255,1), rgba(24,34,40,1));` |
| **iOS** | Asset catalog or dynamic `UIColor` with `traitCollection` | Color assets with light/dark variants, or `UIColor { traitCollection in ... }` |
| **Android** | `lightColorScheme()` / `darkColorScheme()` in Compose | Two color scheme objects, tokens mapped to `MaterialTheme.colorScheme` |

### Relationship to WCAG Theming

The existing `wcagValue` pattern is a form of conditional resolution (theme-based). Mode resolution is analogous but orthogonal — mode and theme are independent dimensions.

The full resolution matrix becomes:

| | base theme | WCAG theme |
|---|---|---|
| **light mode** | light + base | light + WCAG |
| **dark mode** | dark + base | dark + WCAG |

**Phase 1** introduces mode resolution alongside the existing `wcagValue` mechanism. Both coexist — mode is resolved via theme files, WCAG via inline `wcagValue`. This is intentionally transitional.

**Phase 2** unifies them. Theme files become the sole conditional resolution system. The resolution matrix is expressed as four theme contexts (`light-base`, `light-wcag`, `dark-base`, `dark-wcag`), and `wcagValue` is removed from `primitiveReferences` entirely. This eliminates having two different conditional resolution mechanisms and gives us a single, extensible pattern for any future dimension.

---

## Industry Research Summary

### Design System Patterns

| System | Approach | Key Insight |
|--------|----------|-------------|
| **Carbon (IBM)** | Theme-as-value-swap. Four complete theme files (White, g10, g90, g100). Token names stable, values swapped per theme. | Proven at scale. Simple mental model. Duplication across theme files. |
| **Polaris (Shopify)** | Semantic color tokens with scheme-dependent values. Tokens abstract color roles. | Role-based tokens are the abstraction layer; values change underneath. |
| **Atlassian** | CSS custom properties with `data-color-mode` attribute. Tokens have light/dark values activated by CSS selectors. | Web-first approach. Clean CSS integration. |
| **Material Design 3** | `lightColorScheme()` / `darkColorScheme()` in Compose. Dynamic color from wallpaper. | Platform-native resolution. Scheme objects are the theme. |

### Platform-Native Mechanisms

| Platform | Mechanism | Maturity |
|----------|-----------|----------|
| **CSS** | `light-dark()` function + `color-scheme` property | Baseline since May 2024. All major browsers. |
| **iOS** | Asset catalogs with appearance variants; dynamic `UIColor` | Mature since iOS 13 (2019). |
| **Android** | `isSystemInDarkTheme()` + `lightColorScheme`/`darkColorScheme` | Mature in Compose. |

### W3C DTCG Resolver Module (October 2025)

The Design Tokens Community Group published a stable Resolver specification that directly addresses mode/theme resolution:
- **Sets**: base token collections (always included)
- **Modifiers**: conditional overrides with named contexts (e.g., `light`, `dark`)
- **Resolution order**: sets + modifiers composed in defined order; last value wins
- **Inputs**: runtime context selection (e.g., `{ "mode": "dark" }`)

Our proposed architecture aligns with this spec's concepts. We should evaluate whether to adopt the DTCG Resolver file format (`.resolver.json`) for interoperability, or use our own TypeScript-native format that follows the same principles.

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Keep industry-standard `light`/`dark` naming | Zero translation layer at platform boundaries. CSS `light-dark()`, iOS, Android APIs map directly. No onboarding friction. Figma uses "Day"/"Night" as variant labels but that's a Figma convention, not a system constraint. |
| 2 | Mode-aware primitives as primary resolution mechanism | Activates existing `ColorTokenValue` `light`/`dark` infrastructure. Primitives carry their own mode values — semantic tokens reference primitive names without mode branching for the common case. Most tokens are handled at the primitive level. |
| 3 | Complete theme files with fallback | Dark theme file lists every semantic color token. Populated entries have dark overrides; unpopulated entries fall back to base. Template generator produces the file skeleton. Entries populated incrementally as component dark mode designs are finalized. Override replaces entire `primitiveReferences` object (no partial merge). |
| 4 | Light mode as default/base | Matches current system behavior (all existing values are effectively light mode). Minimizes migration — existing tokens become the light base without changes. |
| 5 | Fallback to base for absent theme values | Missing dark values produce light values (graceful degradation). Omission is not an error. Mode parity testing is an audit report, not a build failure. Structural errors (nonexistent token/primitive references) still fail loudly. |
| 6 | Theme overrides cannot introduce new tokens | Every key in a theme override must exist in the base token registry. Build-time validation. Prevents shadow token systems. Applies to both primitive and semantic overrides. |
| 7 | Component tokens excluded from theme overrides | Component tokens inherit mode awareness through the resolution chain (component → semantic → primitive). No component-level theme files. If a component token would need to reference *semantic token A* in light mode and *semantic token B* in dark mode, that's a signal the semantic layer is missing a mode-aware token — the fix is to add the right semantic token with a dark override, not to add component-level theme files. Component layer remains a pure naming/aliasing layer. |
| 8 | Theme file generation for drift prevention | CI-integrated tooling generates the dark theme file skeleton from base tokens, flags new tokens needing evaluation and orphaned overrides. Standalone tooling step, not part of the resolution pipeline. |
| 9 | Mode resolution as pipeline step | Clean separation of concerns. Two-level resolver sits between Registry and Generation. Generators receive fully resolved token sets per mode. |
| 10 | Platform-native output for mode switching | Web uses `light-dark()`, iOS uses dynamic colors, Android uses color schemes. Don't reinvent what platforms already do well. |
| 11 | Formal Rosetta system concept | Mode resolution is a fundamental property of how tokens resolve to values — it belongs in Rosetta alongside the mathematical foundation and token hierarchy. |
| 12 | Adding new mode/theme dimensions requires a spec | New dimensions (high contrast, compact, brand variants) multiply the theme file surface. Each new dimension is an architecture decision requiring a spec and Peter's approval, not a token-level decision. |

---

## MCP and Documentation Impact

### Documentation MCP (`@designerpunk-docs`)

- Rosetta System Architecture doc needs updated pipeline diagram showing Mode Resolution step
- Rosetta System Principles doc needs new principle or sub-principle for mode resolution
- New steering doc: Token Mode Architecture (or section within existing Rosetta docs)
- DTCG Integration Guide needs mode context export documentation
- Token Family docs for Color need mode-aware examples
- Token Quick Reference needs mode-aware lookup guidance

### Component MCP (`component-mcp-server/`)

- Component `resolvedTokens` should indicate mode-aware resolution via classification annotations
- `getComponent()` responses should classify each color token as `level-1`, `level-2`, or `mode-invariant`
- Schema validation should recognize mode-awareness annotations

---

## Open Questions

### Peter

- ~~**OQ-1**: Theme file format?~~ **Resolved** — TypeScript. Consistent with existing token definitions, compile-time type safety, no parsing overhead. DTCG alignment is at the export boundary, not internals. See feedback.md § "ADA R1."
- ~~**OQ-2**: Explicit light theme file or implicit "base = light"?~~ **Decided: implicit** — base semantic definitions are the light theme. No explicit light file. Pending Thurgood's input on whether test ergonomics favor an explicit file. Low-stakes, easy to add later. See feedback.md § "ADA R1."

### Ada

- ~~**OQ-3**: How does mode resolution interact with the opacity composition pattern?~~ **Resolved** — override replaces entire `primitiveReferences` object. Composition happens after primitive mode resolution. Documented in Architecture § "Opacity composition interaction."
- ~~**OQ-4**: Migration path for existing semantic color tokens?~~ **Resolved** — full audit of all ~56 semantic color tokens per Peter's direction (D6). Thoroughness over speed.

### Lina

- ~~**OQ-5**: How do component tokens reference mode-aware semantic tokens?~~ **Resolved** — component tokens are excluded from theme overrides. They inherit mode awareness through the resolution chain. No component-level changes needed. Documented in Architecture § "Component Token Resolution" and Decision #7.

### Thurgood

- ~~**OQ-6**: Test strategy for mode resolution?~~ **Resolved** — layered approach per Thurgood R1/F5, scoped by two-level resolver architecture per D7. Mode parity test is an audit report (not build failure). Structural errors are build failures. Details in feedback.md § "THURGOOD R1" F5.

---

## Next Steps

1. ✅ **All open questions resolved** — OQ-1 through OQ-6
2. ✅ **requirements.md formalized** — 11 requirements, EARS format
3. ✅ **design.md created** — two-level resolver, 8 correctness properties, 5 testing layers
4. ✅ **tasks.md created** — 11 parent tasks, 33 subtasks, Phase 1 + Phase 2
5. ⏳ **Begin implementation** — Task 1 (pre-requisite fixes) → Ada

---

**Organization**: spec-guide
**Scope**: 080-rosetta-mode-architecture
