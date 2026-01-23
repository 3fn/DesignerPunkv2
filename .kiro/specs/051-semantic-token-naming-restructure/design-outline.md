# Semantic Token Naming Restructure - Design Outline

**Date**: January 22, 2026
**Purpose**: Capture research findings and plan for restructuring semantic color tokens to align with industry standards
**Status**: Design Outline (Pre-Requirements)
**Last Updated**: January 22, 2026
**Prerequisite**: Complete Spec 044 (Badge-Base) first as reference implementation

---

## Executive Summary

Research into industry design systems (Atlassian, Shopify Polaris, IBM Carbon, Spotify Encore, Material Design 3, Orbit/Kiwi) revealed that DesignerPunk's current semantic color token naming deviates from established patterns. This spec proposes restructuring our semantic color tokens to align with industry standards, improving discoverability, self-documentation, and cross-system familiarity.

**Key Finding**: Industry standard is **property-explicit naming** (`color.background.success`, `color.text.success`) rather than our current implicit patterns (`color.avatar.human`, `color.select.selected.strong`).

---

## Research Findings

### Industry Token Naming Patterns

#### Atlassian Design System
**Pattern**: `color.[property].[role].[emphasis].[state]`

| Token | Purpose |
|-------|---------|
| `color.background.success` | Success background |
| `color.background.success.hovered` | Success background hover state |
| `color.text.success` | Success text |
| `color.border.success` | Success border |

**Key insight**: Property first (background, text, border, icon), then role (success, warning, danger), then modifiers.

#### Shopify Polaris
**Pattern**: `color-[property]-[surface/fill]-[role]-[state]`

| Token | Purpose |
|-------|---------|
| `--p-color-bg-surface-success` | Success surface background |
| `--p-color-bg-surface-success-hover` | Success surface hover |
| `--p-color-bg-fill-success` | Success fill (more prominent) |
| `--p-color-text-success` | Success text |

**Key insight**: Explicit property (`bg`, `text`, `border`, `icon`) and distinguishes between `surface` (subtle) and `fill` (prominent) backgrounds.

#### Orbit (Kiwi)
**Pattern**: `[component][variant][property][state]`

| Token | Purpose |
|-------|---------|
| `buttonPrimaryBackground` | Primary button background |
| `buttonPrimaryBackgroundHover` | Primary button background hover |
| `buttonPrimaryForeground` | Primary button foreground (text) |

**Key insight**: Component-specific tokens with explicit `Background` and `Foreground` in the name.

#### Material Design 3
**Pattern**: `md.sys.color.[role]` (system) → `md.comp.[component].color` (component)

| Token | Purpose |
|-------|---------|
| `md.sys.color.primary` | Primary color |
| `md.sys.color.on-primary` | Content on primary |
| `md.sys.color.error` | Error color |
| `md.sys.color.on-error` | Content on error |

**Key insight**: Uses `on-[surface]` pattern for contrast colors at system level. Component tokens reference system tokens.

#### Nathan Curtis / EightShapes (Best Practice)
**Pattern**: `{category}-{concept}-{property}-{variant}-{state}`

| Token | Purpose |
|-------|---------|
| `color-feedback-success-background` | Success feedback background |
| `color-action-primary-background-hover` | Primary action background hover |
| `badge-background-color-hover` | Badge background color hover |

**Key insight**: Good tokens explain what they do. Component tokens are explicit about property.

### Key Takeaways

1. **Property is usually explicit**: Most systems include `background`, `bg`, `foreground`, `text`, `border`, or `icon` in the token name.

2. **Two main approaches**:
   - **Semantic tokens**: `color.background.success` — property-first, role-second
   - **Component tokens**: `color.badge.background.notification` — component-first, property explicit

3. **`on-` pattern is limited**: Material's `on-primary`, `on-error` pattern is for system-level tokens where the base is a standalone concept. Component tokens use direct property naming.

---

## Current State Analysis

### DesignerPunk's Current Patterns

#### Pattern 1: Purpose-Based (No Property)
```typescript
'color.primary'           // → purple300
'color.success.strong'    // → green400
'color.success.subtle'    // → green100
'color.error.strong'      // → pink400
```
**Assessment**: Acceptable for system-level semantic tokens, but `strong/subtle` is non-standard.

#### Pattern 2: Element-Based (Property Explicit)
```typescript
'color.text.default'      // → gray300
'color.text.muted'        // → gray200
'color.icon.default'      // → gray200
'color.background'        // → white100
'color.surface'           // → white200
'color.border'            // → gray100
```
**Assessment**: Good — property is explicit.

#### Pattern 3: Component-Specific (Inconsistent)
```typescript
// Avatar: Implicit background
'color.avatar.human'              // → orange300 (background)
'color.avatar.contrast.onHuman'   // → white100 (text/icon)

// Select: strong/subtle pattern
'color.select.selected.strong'    // → cyan400 (foreground)
'color.select.selected.subtle'    // → cyan100 (background)
```
**Assessment**: Inconsistent. Avatar uses implicit background; Select uses strong/subtle which inverts the typical meaning (strong = foreground, subtle = background).

### Problems with Current Approach

1. **Implicit vs Explicit**: `color.avatar.human` doesn't tell you it's a background color
2. **Inverted Semantics**: `strong/subtle` in Select means foreground/background, but in status tokens (success, error) it means prominent/subtle of the same property
3. **Inconsistent Patterns**: Avatar, Select, and status tokens all use different patterns
4. **Discoverability**: Developers must read documentation to understand what each token applies to

---

## Proposed Restructure

### New Naming Convention

**System-Level Semantic Tokens**: `color.[property].[role].[modifier]`
**Component-Level Tokens**: `color.[component].[property].[variant].[state]`

### Property Values
| Property | Description |
|----------|-------------|
| `background` | Background fill colors |
| `text` | Text/label colors |
| `icon` | Icon colors |
| `border` | Border/stroke colors |

### Migration Examples

#### Avatar Tokens
| Current | Proposed |
|---------|----------|
| `color.avatar.human` | `color.avatar.background.human` |
| `color.avatar.agent` | `color.avatar.background.agent` |
| `color.avatar.contrast.onHuman` | `color.avatar.icon.human` |
| `color.avatar.contrast.onAgent` | `color.avatar.icon.agent` |
| `color.avatar.border` | `color.avatar.border.default` |

#### Select Tokens
| Current | Proposed |
|---------|----------|
| `color.select.selected.strong` | `color.select.text.selected` |
| `color.select.selected.subtle` | `color.select.background.selected` |
| `color.select.notSelected.strong` | `color.select.text.default` |
| `color.select.notSelected.subtle` | `color.select.background.default` |

#### Badge Tokens (New - Spec 044)
Already using new pattern:
- `color.badge.background.notification` → `pink400`
- `color.badge.text.notification` → `white100`

### Status Tokens (Future Consideration)
| Current | Proposed |
|---------|----------|
| `color.success.strong` | `color.feedback.success` (or keep as-is) |
| `color.success.subtle` | `color.background.success` |
| `color.error.strong` | `color.feedback.error` (or keep as-is) |
| `color.error.subtle` | `color.background.error` |

**Note**: Status tokens may need deeper analysis. The `strong/subtle` pattern works differently here (both are the same "success" concept at different intensities) vs component tokens where we need distinct background/text.

---

## Scope

### In Scope
- Restructure component-specific color tokens (Avatar, Select)
- Update Rosetta token generation pipeline
- Update all component implementations referencing renamed tokens
- Update documentation and steering files
- Create migration guide for consumers

### Out of Scope (Future Specs)
- Restructuring system-level status tokens (success, warning, error, info)
- Adding new token categories
- Dark mode token variations

---

## Implementation Considerations

### Rosetta Pipeline Updates
- Token naming validation rules
- Generation templates for new naming pattern
- Backward compatibility layer (if needed)

### Breaking Changes
This is a breaking change for any external consumers using our tokens directly. Mitigation options:
1. **Deprecation period**: Keep old names as aliases for 1-2 releases
2. **Migration script**: Provide automated find/replace tooling
3. **Documentation**: Clear migration guide with before/after examples

### Testing Strategy
- Unit tests for token existence and values
- Integration tests for component token consumption
- Visual regression tests for components using renamed tokens

---

## Dependencies

- **Spec 044 (Badge-Base)**: Must complete first as reference implementation using new pattern
- **Rosetta System**: May require updates to token generation pipeline

---

## Success Criteria

1. All component-specific color tokens follow `color.[component].[property].[variant]` pattern
2. Token names are self-documenting (property is explicit)
3. Rosetta generates tokens with new naming convention
4. All components updated to use new token names
5. Migration guide published for external consumers
6. No visual regressions in component rendering

---

## References

- [Atlassian Design System - Color](https://atlassian.design/foundations/color/)
- [Shopify Polaris - Color Tokens](https://polaris.shopify.com/design/colors/color-tokens)
- [Naming Tokens in Design Systems - Nathan Curtis](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676)
- [Smart Interface Design Patterns - Token Naming](https://smart-interface-design-patterns.com/articles/naming-design-tokens/)
- [Orbit Design Tokens](https://orbit.kiwi/foundation/design-tokens/component-specific/)

---

## Next Steps

1. ✅ **Research captured** — Industry patterns documented
2. ✅ **Badge as reference** — Spec 044 will use new pattern
3. ⏳ **Create requirements.md** — After Spec 044 completion
4. ⏳ **Create design.md** — Detailed migration plan
5. ⏳ **Create tasks.md** — Implementation tasks

---

**Organization**: spec-guide
**Scope**: 051-semantic-token-naming-restructure
