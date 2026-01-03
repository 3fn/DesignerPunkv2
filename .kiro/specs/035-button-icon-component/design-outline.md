# Design Outline: Button-Icon Component

**Date**: 2026-01-02
**Purpose**: Design outline for circular icon-only button component
**Organization**: spec-guide
**Scope**: 035-button-icon-component
**Status**: Complete

---

## Overview

Button-Icon is a circular, icon-only interactive button component that provides accessible actions without text labels. It follows the same style matrix as CTA buttons (Primary, Secondary, Tertiary × Small, Medium, Large) while introducing icon-specific accessibility patterns and circular visual treatment.

---

## Design Decisions

### 1. Size Matrix (with Focus Ring Buffer)

The component includes a built-in 4px transparent buffer on all sides to accommodate the focus ring without requiring external spacing considerations. This makes the component self-contained for accessibility.

**Focus ring values:**
- `accessibility.focus.offset` = 2px
- `accessibility.focus.width` = 2px
- Total extension per side = 4px

| Size | Icon | Padding | Visual Circle | Focus Buffer | Total Box | Touch Target |
|------|------|---------|---------------|--------------|-----------|--------------|
| Large | 24px | 12px | 48px | 4px/side | **56px** | 56px (exceeds 48 ✓) |
| Medium | 20px | 10px | 40px | 4px/side | **48px** | 48px ✓ |
| Small | 16px | 8px | 32px | 4px/side | **40px** | 48px (invisible extension) |

**Visual circle formula**: `iconSize + (padding × 2)`
**Total box formula**: `visualCircle + (focusBuffer × 2)`

**Rationale**: By containing the focus ring buffer within the component, consumers don't need to track spacing requirements. The focus ring will never clip or overlap adjacent elements.

### 2. Style Matrix

Three visual styles matching CTA button patterns:

- **Primary**: Solid fill, high emphasis actions
- **Secondary**: Outlined/bordered, medium emphasis actions  
- **Tertiary**: Minimal/ghost, low emphasis actions

Each style includes states: default, hover, pressed, focused (no disabled state by design).

### 3. Accessibility

**Labeling approach**: `aria-label` attribute on the button element provides screen reader accessible name.

**Rationale**: This is the standard best practice for icon-only buttons—well-supported, semantic, and doesn't require extra DOM elements.

**Example**: `<button aria-label="Close menu">...</button>`

### 4. Touch Target

All sizes maintain a 48px minimum touch target regardless of visual size.

- **Large (56px total)**: Touch target equals total box size (exceeds minimum)
- **Medium (48px total)**: Touch target equals total box size (meets minimum exactly)
- **Small (40px total)**: Requires invisible hit area extension to reach 48px minimum

**Implementation**: For small size, invisible hit area extends 4px beyond the total box boundary using CSS pseudo-element or transparent padding.

**WCAG compliance**: Meets WCAG 2.5.5 (Target Size Enhanced) and 2.5.8 (Target Size Minimum).

### 5. No Disabled State

Button-Icon does not support disabled states by design.

**Rationale**:
- Disabled buttons remove affordance without explanation
- Screen reader users may not understand *why* something is disabled
- Disabled states often have poor contrast (ironic for an "accessibility" state)

**Alternative patterns**:
- Keep buttons enabled but show validation/error messaging on interaction
- Hide actions that aren't available rather than disabling them
- Use loading states when actions are in progress

### 5a. Loading State (Deferred)

**Decision**: Defer loading state to match CTA button approach.

**Rationale**: CTA button designed the `loading?: boolean` API but deferred visual implementation pending animation token system. Button-Icon will follow the same pattern—design API now, implement visual state when animation tokens exist.

**Future behavior** (when implemented):
- Spinner replaces icon
- Button remains interactive but action is suppressed
- Screen reader announces "Loading" or "Busy"

### 6. Circular Shape

Uses `radiusCircle` semantic token for true circular shape.

**Rationale**: 
- For elements where width = height, `50%` is semantically correct for creating circles
- This differs from `radiusFull` (9999px) which is designed for pills/stadiums where dimensions may vary
- Token-based approach ensures consistency across Button-Icon, Button-Media, avatars, badges, etc.

**Implementation**: See "Prerequisite: radiusCircle Token" section for architecture details.

---

## Token Strategy

### Semantic Tokens (Direct Usage)

| Purpose | Token | Value |
|---------|-------|-------|
| Touch target minimum | `space600` | 48px |
| Icon size (large) | `icon.size100` | 24px |
| Icon size (medium) | `icon.size075` | 20px |
| Icon size (small) | `icon.size050` | 16px |
| Focus ring offset | `accessibility.focus.offset` | 2px |
| Focus ring width | `accessibility.focus.width` | 2px |
| Focus ring color | `accessibility.focus.color` | purple300 |
| Border radius | `radiusCircle` | *(prerequisite - see below)* |

### Component Tokens (New)

Component tokens are introduced only for the padding family because semantic tokens cannot fully support all three values (10px has no semantic equivalent).

**Principle**: Component tokens are for *families of values that semantic tokens can't fully support*. If semantic tokens cover the need, use them directly. Only introduce component tokens when you need a cohesive set where at least one value falls outside semantic coverage.

| Token | Value | References |
|-------|-------|------------|
| `buttonIcon.padding.large` | 12 | → `inset.150` (semantic) |
| `buttonIcon.padding.medium` | 10 | Unique value (no semantic equivalent) |
| `buttonIcon.padding.small` | 8 | → `inset.100` (semantic) |

**Computed values** (not tokenized):
- Visual circle diameter: `iconSize + (padding × 2)`
- Total box size: `visualCircle + 8` (focus buffer)

---

## Token Verification

| Need | Value | Available? | Token/Approach |
|------|-------|------------|----------------|
| Touch target | 48 | ✅ | `space600` |
| Icon large | 24 | ✅ | `icon.size100` |
| Icon medium | 20 | ✅ | `icon.size075` |
| Icon small | 16 | ✅ | `icon.size050` |
| Padding large | 12 | ✅ | `inset.150` / `space150` |
| Padding medium | 10 | ❌ | Component token needed |
| Padding small | 8 | ✅ | `inset.100` / `space100` |
| Focus offset | 2 | ✅ | `accessibility.focus.offset` |
| Focus width | 2 | ✅ | `accessibility.focus.width` |
| Circle radius | — | 🔶 | `radiusCircle` *(prerequisite)* |

**Legend**: ✅ Available | ❌ Needs component token | 🔶 Prerequisite work required

---

## Component Architecture

### Props Interface (Conceptual)

```typescript
interface ButtonIconProps {
  /** Icon to display (managed via Icon component) */
  icon: IconName;
  
  /** Accessible label for screen readers */
  ariaLabel: string;
  
  /** Visual size variant */
  size: 'small' | 'medium' | 'large';
  
  /** Visual style variant */
  variant: 'primary' | 'secondary' | 'tertiary';
  
  /** Click handler */
  onPress: () => void;
}
```

### Composition

- Uses `Icon` component internally for icon rendering
- Icon color follows same fill/contrast rules as CTA text
- Circular shape via `radiusCircle` semantic token
- Focus ring uses `accessibility.focus.*` tokens

### Box Model (Large Size Example)

```
┌─────────────────────────────────────┐
│  4px focus buffer (transparent)     │
│  ┌─────────────────────────────┐    │
│  │  12px padding               │    │
│  │  ┌─────────────────────┐    │    │
│  │  │                     │    │    │
│  │  │    24px icon        │    │    │
│  │  │                     │    │    │
│  │  └─────────────────────┘    │    │
│  │  12px padding               │    │
│  └─────────────────────────────┘    │
│  4px focus buffer (transparent)     │
└─────────────────────────────────────┘
        56px total box
        48px visual circle
```

---

## Visual States

### State Behavior (Per Style)

| State | Primary | Secondary | Tertiary |
|-------|---------|-----------|----------|
| Default | Solid fill | Border only | Transparent |
| Hover | Darkened fill | Fill appears | Subtle fill |
| Pressed | Further darkened | Darker fill | Darker fill |
| Focused | Focus ring (accessibility tokens) | Focus ring | Focus ring |

**Note**: Specific color tokens to be determined during full design phase, following CTA button patterns.

---

## Prerequisite: radiusCircle Token (Approach 1)

### Decision

Create a `radiusCircle` token using platform-specific output values. This requires extending the token type system to support percentage-based units.

**Rationale**: While Button-Icon could use platform-native circle handling in isolation, future components (Button-Media, circular avatars, circular badges) will also need circular shapes. Investing in proper token architecture now avoids doubling effort later with migration overhead.

### Token Architecture Changes Required

#### 1. Extend PlatformValues Units (`src/types/PrimitiveToken.ts`)

```typescript
export interface PlatformValues {
  web: { 
    value: number | string | ColorTokenValue; 
    unit: 'px' | 'rem' | 'unitless' | 'fontFamily' | 'fontWeight' | 'em' | 'hex' | '%'  // Add '%'
  };
  ios: { 
    value: number | string | ColorTokenValue; 
    unit: 'pt' | 'unitless' | 'fontFamily' | 'fontWeight' | 'em' | 'hex' | 'shape'  // Add 'shape'
  };
  android: { 
    value: number | string | ColorTokenValue; 
    unit: 'dp' | 'sp' | 'unitless' | 'fontFamily' | 'fontWeight' | 'em' | 'hex' | 'percent'  // Add 'percent'
  };
}
```

#### 2. Add Primitive Token (`src/tokens/RadiusTokens.ts`)

```typescript
radiusHalf: {
  name: 'radiusHalf',
  category: TokenCategory.RADIUS,
  baseValue: 50,  // Represents 50%
  familyBaseValue: RADIUS_BASE_VALUE,
  description: 'Half radius (50%) - creates perfect circles when width equals height',
  mathematicalRelationship: 'percentage = 50% (half of element dimension)',
  baselineGridAlignment: false,
  isStrategicFlexibility: true,
  isPrecisionTargeted: false,
  platforms: {
    web: { value: 50, unit: '%' },
    ios: { value: 'Circle', unit: 'shape' },
    android: { value: 50, unit: 'percent' }
  }
}
```

#### 3. Add Semantic Token (`src/tokens/semantic/RadiusTokens.ts`)

```typescript
/**
 * Circle radius for perfectly circular elements.
 * 
 * References: radiusHalf (50%)
 * 
 * Use cases:
 * - Circular buttons: Icon-only buttons with circular shape
 * - Circular avatars: Round profile images
 * - Circular badges: Round notification indicators
 * - Any element where width = height and circular shape is desired
 * 
 * Visual style: Perfect circle (when width equals height)
 * 
 * Platform output:
 * - Web: 50% (border-radius percentage)
 * - iOS: Circle shape (SwiftUI .clipShape(Circle()))
 * - Android: 50 percent (Compose RoundedCornerShape(50))
 * 
 * Note: Unlike radiusFull (9999px for pills/stadiums), radiusCircle 
 * creates true circles only when the element has equal width and height.
 */
export const radiusCircle = { value: 'radiusHalf' } as RadiusSemanticToken;
```

#### 4. Update Platform Generators

Platform generators need to handle the new unit types:

- **Web generator**: Output `50%` when unit is `'%'`
- **iOS generator**: Output `.clipShape(Circle())` when unit is `'shape'` and value is `'Circle'`
- **Android generator**: Output `RoundedCornerShape(50)` when unit is `'percent'`

### Distinction: radiusCircle vs radiusFull

| Aspect | radiusCircle | radiusFull |
|--------|--------------|------------|
| **Value** | 50% | 9999px |
| **Use case** | True circles (width = height) | Pills/stadiums (any dimensions) |
| **Behavior** | Adapts to element size | Always fully rounded |
| **Example** | Button-Icon, avatars | CTA buttons, tags, chips |

### Implementation Estimate

- **Type system changes**: ~30 min
- **Primitive token**: ~15 min
- **Semantic token**: ~15 min
- **Generator updates**: ~1-2 hours (depends on generator complexity)
- **Tests**: ~1 hour
- **Total**: 2-4 hours

### Files to Modify

1. `src/types/PrimitiveToken.ts` - Add new unit types (`'%'`, `'shape'`, `'percent'`)
2. `src/tokens/RadiusTokens.ts` - Add `radiusHalf` primitive token
3. `src/tokens/semantic/RadiusTokens.ts` - Add `radiusCircle` semantic token (references `radiusHalf`) + update exports
4. Platform generators (location TBD) - Handle new units
5. Tests for radius tokens - Add coverage for new tokens

---

## Icon Color Strategy

Icon color follows the same pattern as CTA button text color:

| Style | Icon Color | Rationale |
|-------|------------|-----------|
| Primary | `color.text.onPrimary` | White icon on filled background |
| Secondary | `color.primary` | Primary color icon on transparent/bordered |
| Tertiary | `color.primary` | Primary color icon on transparent |

**State variations** (hover, pressed) apply the same blend tokens as CTA:
- Hover: `blend.hoverDarker` overlay
- Pressed: `blend.pressedDarker` overlay

---

## Platform-Specific Implementation Notes

### Web
- Use `<button>` element with `aria-label` attribute
- `border-radius: 50%` via `radiusCircle` token
- Focus ring via `:focus-visible` pseudo-class
- Touch target extension via transparent padding or pseudo-element
- Hover/pressed states via CSS pseudo-classes

### iOS
- SwiftUI `Button` with `.clipShape(Circle())`
- `.accessibilityLabel()` for screen reader support
- `.frame(minWidth: 48, minHeight: 48)` for touch target
- Scale animation on press (0.97) — platform-specific interaction pattern

### Android
- Compose `IconButton` or custom `Button` with `CircleShape`
- `contentDescription` for accessibility
- `Modifier.sizeIn(minWidth = 48.dp, minHeight = 48.dp)` for touch target
- Material ripple effect — platform-specific interaction pattern

**Note**: Press animations are platform-specific behaviors, not cross-platform requirements. Each platform uses its native interaction pattern (scale on iOS, ripple on Android, CSS transitions on web).

---

## Comparison with CTA Button

| Aspect | CTA Button | Button-Icon |
|--------|------------|-------------|
| Shape | Rounded rectangle (`radius100`-`radius200`) | Circle (`50%`) |
| Content | Text + optional icon | Icon only |
| Labeling | Visible text | `aria-label` (hidden) |
| Sizes | 40/48/56px height | 32/40/48px visual circle |
| Touch target | Height-based | May need invisible extension |
| Disabled state | Supported | Not supported (by design) |
| Focus ring | Same tokens | Same tokens + 4px buffer |

---

## Open Questions

1. ~~**Percentage token support**: Does the token system support percentage-based values for `radiusCircle`?~~ **Resolved**: Implement Approach 1 - extend token type system with platform-specific percentage/shape units. Primitive: `radiusHalf`, Semantic: `radiusCircle`.

2. ~~**Icon color tokens**~~: ✅ **Resolved** - follows CTA text color pattern per variant/state.

3. ~~**Loading state**~~: ✅ **Resolved** - Deferred to match CTA button approach (API designed, visual implementation pending animation tokens).

4. ~~**Press animation**~~: ✅ **Resolved** - Platform-specific behavior (scale on iOS, ripple on Android, CSS on web).

**All open questions resolved. Ready for requirements phase.**

---

## Next Steps

1. ✅ Review and approve this design outline
2. ✅ Investigate percentage token support - **Decision: Approach 1 (platform-specific output)**
3. **Prerequisite**: Create `radiusHalf` primitive + `radiusCircle` semantic tokens (extends type system, ~2-4 hours)
   - Modify `PrimitiveToken.ts` to add `'%'`, `'shape'`, `'percent'` units
   - Add `radiusHalf` primitive token (50% value)
   - Add `radiusCircle` semantic token (references `radiusHalf`)
   - Update platform generators
   - Add tests
4. Create full requirements.md with EARS-format acceptance criteria
5. Create design.md with detailed specifications
6. Create tasks.md with implementation plan
