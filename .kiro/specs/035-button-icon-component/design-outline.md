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

The component includes a built-in transparent buffer on all sides to accommodate the focus ring without requiring external spacing considerations. This makes the component self-contained for accessibility.

**Focus ring values:**
- `accessibility.focus.offset` (2px)
- `accessibility.focus.width` (2px)
- Total extension per side = offset + width

| Size | Icon | Padding | Visual Circle | Focus Buffer | Total Box | Touch Target |
|------|------|---------|---------------|--------------|-----------|--------------|
| Large | `icon.size100` | `buttonIcon.inset.large` | 48 | 4/side | **56** | 56 (exceeds `tapAreaRecommended` ✓) |
| Medium | `icon.size075` | `buttonIcon.inset.medium` | 40 | 4/side | **48** | `tapAreaRecommended` ✓ |
| Small | `icon.size050` | `buttonIcon.inset.small` | 32 | 4/side | **40** | `tapAreaRecommended` (invisible extension) |

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

All sizes maintain `tapAreaRecommended` (48px) minimum touch target regardless of visual size.

- **Large (56 total)**: Touch target equals total box size (exceeds `tapAreaRecommended`)
- **Medium (48 total)**: Touch target equals total box size (meets `tapAreaRecommended` exactly)
- **Small (40 total)**: Requires invisible hit area extension to reach `tapAreaRecommended` minimum

**Semantic token rationale**: Using `tapAreaRecommended` instead of raw `space600` because:
- `tapAreaRecommended` is purpose-built for touch targets (accessibility semantic)
- Aligns with WCAG 2.5.5 and Material Design guidelines (48dp)
- Self-documenting: token name explains intent

**Implementation**: For small size, invisible hit area extends beyond the total box boundary using CSS pseudo-element or transparent padding.

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

| Purpose | Token | Primitive Reference | Value |
|---------|-------|---------------------|-------|
| Touch target minimum | `tapAreaRecommended` | — | 48px |
| Icon size (large) | `icon.size100` | fontSize100 × lineHeight100 | 24px |
| Icon size (medium) | `icon.size075` | fontSize075 × lineHeight075 | 20px |
| Icon size (small) | `icon.size050` | fontSize050 × 1.231 | 16px |
| Focus ring offset | `accessibility.focus.offset` | space025 | 2px |
| Focus ring width | `accessibility.focus.width` | borderWidth200 | 2px |
| Focus ring color | `accessibility.focus.color` | purple300 | Primary color |
| Border radius | `radiusCircle` | radiusHalf | 50% *(prerequisite - see below)* |
| Icon stroke width | `icon.strokeWidth` | borderWidth200 | 2px |

### Icon Color Tokens (Per Variant)

| Variant | State | Icon Color Token | Primitive Reference |
|---------|-------|------------------|---------------------|
| Primary | Default | `color.contrast.onPrimary` | white100 |
| Primary | Hover/Pressed | `color.contrast.onPrimary` + blend overlay | white100 |
| Secondary | Default | `color.primary` | purple300 |
| Secondary | Hover/Pressed | `color.primary` + blend overlay | purple300 |
| Tertiary | Default | `color.primary` | purple300 |
| Tertiary | Hover/Pressed | `color.primary` + blend overlay | purple300 |

### Component Tokens (New)

Component tokens are introduced only for the inset padding family because semantic tokens cannot fully support all three values (10px has no semantic equivalent).

**Principle**: Component tokens are for *families of values that semantic tokens can't fully support*. If semantic tokens cover the need, use them directly. Only introduce component tokens when you need a cohesive set where at least one value falls outside semantic coverage.

**Location**: `src/components/core/Button-Icon/buttonIcon.tokens.ts`

This follows the established pattern from Button-CTA (`Button-CTA.tokens.ts`) and Input-Text-Base (`tokens.ts`).

#### Token Definitions

```typescript
/**
 * Button-Icon Component Tokens
 * 
 * Component-specific tokens for Button-Icon inset padding.
 * Medium size (10px) has no semantic equivalent, requiring component tokens.
 * 
 * Token Naming Pattern: buttonIcon.[property].[variant]
 * 
 * Related: Button-CTA.tokens.ts, Input-Text-Base/tokens.ts
 */
export const ButtonIconTokens = {
  inset: {
    /** Large size padding (12px) - references space.inset.150 */
    large: 12,
    
    /** Medium size padding (10px) - unique value, no semantic equivalent */
    medium: 10,
    
    /** Small size padding (8px) - references space.inset.100 */
    small: 8,
  },
} as const;

export type ButtonIconInsetVariant = keyof typeof ButtonIconTokens.inset;

export function getButtonIconInset(variant: ButtonIconInsetVariant): number {
  return ButtonIconTokens.inset[variant];
}
```

#### Token Reference Summary

| Token | Value | Semantic Reference | Notes |
|-------|-------|-------------------|-------|
| `buttonIcon.inset.large` | 12 | `space.inset.150` | Aligns with semantic token |
| `buttonIcon.inset.medium` | 10 | — | Unique value (no semantic equivalent) |
| `buttonIcon.inset.small` | 8 | `space.inset.100` | Aligns with semantic token |

**Computed values** (not tokenized):
- Visual circle diameter: `iconSize + (padding × 2)`
- Total box size: `visualCircle + 8` (focus buffer)

---

## Token Verification

| Need | Value | Available? | Token/Approach | Semantic Category |
|------|-------|------------|----------------|-------------------|
| Touch target | 48 | ✅ | `tapAreaRecommended` | Accessibility |
| Icon large | 24 | ✅ | `icon.size100` | Accessibility (Icon) |
| Icon medium | 20 | ✅ | `icon.size075` | Accessibility (Icon) |
| Icon small | 16 | ✅ | `icon.size050` | Accessibility (Icon) |
| Icon stroke | 2 | ✅ | `icon.strokeWidth` | Accessibility (Icon) |
| Padding large | 12 | ✅ | `space.inset.150` | Spacing (Inset) |
| Padding medium | 10 | ❌ | Component token needed | — |
| Padding small | 8 | ✅ | `space.inset.100` | Spacing (Inset) |
| Focus offset | 2 | ✅ | `accessibility.focus.offset` | Accessibility (Focus) |
| Focus width | 2 | ✅ | `accessibility.focus.width` | Accessibility (Focus) |
| Focus color | — | ✅ | `accessibility.focus.color` | Accessibility (Focus) |
| Circle radius | — | 🔶 | `radiusCircle` *(prerequisite)* | Radius |
| Icon color (primary) | — | 🔶 | `color.contrast.onPrimary` *(prerequisite)* | Color (Contrast) |
| Icon color (secondary/tertiary) | — | ✅ | `color.primary` | Color (Brand) |
| Secondary hover bg | — | 🔶 | `color.background.primary.subtle` *(prerequisite)* | Color (Background) |
| Border default | 1 | ✅ | `borderDefault` | Border |
| Border emphasis | 2 | ✅ | `borderEmphasis` | Border |
| Hover blend | 8% | ✅ | `blend.hoverDarker` | Blend |
| Pressed blend | 12% | ✅ | `blend.pressedDarker` | Blend |
| Transition duration | 150ms | ✅ | `duration150` | Motion |

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
  
  /** Optional test ID for automated testing */
  testID?: string;
}
```

### Composition

- Uses `Icon` component internally for icon rendering
- Icon color follows same fill/contrast rules as CTA text
- Circular shape via `radiusCircle` semantic token
- Focus ring uses `accessibility.focus.*` tokens
- Icon marked as decorative (`aria-hidden="true"` on web) since button has accessible label

### Box Model (Large Size Example)

```
┌─────────────────────────────────────┐
│  focus buffer (transparent)         │
│  ┌─────────────────────────────┐    │
│  │  buttonIcon.inset.large     │    │
│  │  ┌─────────────────────┐    │    │
│  │  │                     │    │    │
│  │  │    icon.size100     │    │    │
│  │  │                     │    │    │
│  │  └─────────────────────┘    │    │
│  │  buttonIcon.inset.large     │    │
│  └─────────────────────────────┘    │
│  focus buffer (transparent)         │
└─────────────────────────────────────┘
        56 total box
        48 visual circle
```

---

## Visual States

### State Behavior (Per Style)

| State | Primary | Secondary | Tertiary |
|-------|---------|-----------|----------|
| Default | `color.primary` fill | `borderDefault` border, transparent bg | Transparent bg |
| Hover | `color.primary` + `blend.hoverDarker` fill | `color.background.primary.subtle` bg, `borderEmphasis` border + `blend.hoverDarker`, icon + `blend.hoverDarker` | Icon + `blend.hoverDarker` |
| Pressed | `color.primary` + `blend.pressedDarker` fill | `color.background.primary.subtle` bg, `borderEmphasis` border + `blend.pressedDarker`, icon + `blend.pressedDarker` | Icon + `blend.pressedDarker` |
| Focused | Focus ring (`accessibility.focus.*` tokens) | Focus ring | Focus ring |

### Detailed State Tokens

#### Primary Variant
| State | Background | Border | Icon Color |
|-------|------------|--------|------------|
| Default | `color.primary` | — | `color.contrast.onPrimary` |
| Hover | `color.primary` + `blend.hoverDarker` | — | `color.contrast.onPrimary` |
| Pressed | `color.primary` + `blend.pressedDarker` | — | `color.contrast.onPrimary` |

#### Secondary Variant
| State | Background | Border | Icon Color |
|-------|------------|--------|------------|
| Default | transparent | `borderDefault` (1px), `color.primary` | `color.primary` |
| Hover | `color.background.primary.subtle` | `borderEmphasis` (2px), `color.primary` + `blend.hoverDarker` | `color.primary` + `blend.hoverDarker` |
| Pressed | `color.background.primary.subtle` | `borderEmphasis` (2px), `color.primary` + `blend.pressedDarker` | `color.primary` + `blend.pressedDarker` |

#### Tertiary Variant
| State | Background | Border | Icon Color |
|-------|------------|--------|------------|
| Default | transparent | — | `color.primary` |
| Hover | transparent | — | `color.primary` + `blend.hoverDarker` |
| Pressed | transparent | — | `color.primary` + `blend.pressedDarker` |

### Secondary Border Shift Handling

The secondary variant border changes from `borderDefault` (1px) to `borderEmphasis` (2px) on hover/pressed. To prevent layout shift:

**Web Implementation:**
```css
/* Reserve 2px border space, simulate 1px with inset box-shadow */
.button-icon--secondary {
  border: var(--border-emphasis) solid transparent;
  box-shadow: inset 0 0 0 var(--border-default) var(--color-primary);
}

.button-icon--secondary:hover {
  border-color: var(--color-primary-hover); /* blend.hoverDarker applied */
  box-shadow: none;
}
```

**iOS/Android:** Use platform-native overlay/stroke approaches that don't affect layout, animating stroke width.

### Animation Tokens

Uses same animation tokens as Button-CTA for consistency:
- Transition duration: `duration150`
- Easing: `ease-in-out` (standard)

---

## Prerequisite: Token Rename (color.text.onPrimary → color.contrast.onPrimary)

### Decision

Rename `color.text.onPrimary` to `color.contrast.onPrimary` for semantic accuracy.

**Rationale**: "Contrast" is semantically accurate for both text and icons:
1. **Semantic accuracy**: "Contrast" describes the relationship (content on primary background)
2. **WCAG alignment**: WCAG uses "contrast" terminology
3. **Future-proof**: Works for any content type (text, icons, other elements)
4. **Single token**: No duplication for text vs icon

### Token Definition

```typescript
// SemanticColorTokens.ts
'color.contrast.onPrimary': {
  name: 'color.contrast.onPrimary',
  primitiveReferences: { value: 'white100' },
  category: SemanticCategory.COLOR,
  context: 'Content color for text/icons on primary-colored backgrounds',
  description: 'White content for use on primary color backgrounds (buttons, badges, chips)'
}
```

**Purpose**: Content color (text/icons) on primary-colored backgrounds
**Value**: `white100` (primitive)
**Migration**: Update CTA button to use `color.contrast.onPrimary`

### Implementation Estimate

- **Token rename**: ~15 min
- **CTA button update**: ~15 min
- **Documentation update**: ~15 min
- **Total**: ~45 min

### Files to Modify

1. `src/tokens/semantic/ColorTokens.ts` - Rename token
2. `src/components/core/Button-CTA/` - Update references
3. `.kiro/steering/Token-Family-Color.md` - Update documentation

---

## Prerequisite: New Semantic Token (color.background.primary.subtle)

### Decision

Create `color.background.primary.subtle` semantic token for subtle primary-tinted backgrounds.

**Rationale**: Secondary button hover state needs a subtle purple tint background. This token is reusable for:
- Secondary button hover states
- Selected list items
- Hover states on cards/containers
- Any UI element needing a subtle primary tint

### Token Definition

```typescript
// SemanticColorTokens.ts
'color.background.primary.subtle': {
  name: 'color.background.primary.subtle',
  primitiveReferences: { value: 'purple100' },
  category: SemanticCategory.COLOR,
  context: 'Subtle primary-tinted background for hover states and selections',
  description: 'Light purple background for secondary button hover, selected items, and subtle emphasis'
}
```

**Purpose**: Subtle primary-tinted background
**Value**: `purple100` (primitive)

### Implementation Estimate

- **Token creation**: ~15 min
- **Documentation update**: ~15 min
- **Total**: ~30 min

### Files to Modify

1. `src/tokens/semantic/ColorTokens.ts` - Add token
2. `.kiro/steering/Token-Family-Color.md` - Update documentation

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
| **Value** | 50% | 9999 |
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

Icon color follows the same pattern as CTA button text color, using semantic color tokens:

| Style | Icon Color Token | Primitive Reference | Rationale |
|-------|------------------|---------------------|-----------|
| Primary | `color.contrast.onPrimary` | white100 | White icon on filled background |
| Secondary | `color.primary` | purple300 | Primary color icon on transparent/bordered |
| Tertiary | `color.primary` | purple300 | Primary color icon on transparent |

**State variations** (hover, pressed) apply the same blend tokens as CTA:
- Hover: `blend.hoverDarker` overlay
- Pressed: `blend.pressedDarker` overlay

**Semantic token rationale**: Using `color.contrast.onPrimary` and `color.primary` instead of raw color values because:
- Self-documenting: token names explain the semantic purpose
- Theme-aware: tokens adapt to light/dark mode automatically
- Consistent: matches CTA button text color pattern

---

## Platform-Specific Implementation Notes

### Web
- Use `<button>` element with `aria-label` attribute
- `border-radius: 50%` via `radiusCircle` token
- Focus ring via `:focus-visible` pseudo-class using `accessibility.focus.*` tokens
- Touch target extension via transparent padding or pseudo-element to meet `tapAreaRecommended`
- Icon color via `color.contrast.onPrimary` (primary) or `color.primary` (secondary/tertiary)
- Icon marked as decorative (`aria-hidden="true"`)
- Hover/pressed states via CSS pseudo-classes with `blend.hoverDarker`/`blend.pressedDarker`

### iOS
- SwiftUI `Button` with `.clipShape(Circle())`
- `.accessibilityLabel()` for screen reader support
- `.frame(minWidth: tapAreaRecommended, minHeight: tapAreaRecommended)` for touch target
- Icon color via `DesignTokens.colorContrastOnPrimary` or `DesignTokens.colorPrimary`
- Icon marked as decorative (accessibility handled by button label)
- Scale animation on press (0.97) — platform-specific interaction pattern

### Android
- Compose `IconButton` or custom `Button` with `CircleShape`
- `contentDescription` for accessibility
- `Modifier.sizeIn(minWidth = tapAreaRecommended.dp, minHeight = tapAreaRecommended.dp)` for touch target
- Icon tint via `DesignTokens.color_contrast_on_primary` or `DesignTokens.color_primary`
- Icon marked as decorative (accessibility handled by button contentDescription)
- Material ripple effect — platform-specific interaction pattern

**Note**: Press animations are platform-specific behaviors, not cross-platform requirements. Each platform uses its native interaction pattern (scale on iOS, ripple on Android, CSS transitions on web).

---

## Comparison with CTA Button

| Aspect | CTA Button | Button-Icon |
|--------|------------|-------------|
| Shape | Rounded rectangle (`radius100`-`radius200`) | Circle (`radiusCircle`) |
| Content | Text + optional icon | Icon only |
| Labeling | Visible text | `aria-label` (hidden) |
| Sizes | 40/48/56 height | 32/40/48 visual circle |
| Touch target | Height-based | May need invisible extension to `tapAreaRecommended` |
| Disabled state | Supported | Not supported (by design) |
| Focus ring | Same tokens | Same tokens + focus buffer |
| Icon color | `color.contrast.onPrimary` / `color.primary` | Same tokens |

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
3. **Prerequisite 1**: Rename `color.text.onPrimary` → `color.contrast.onPrimary` (~45 min)
   - Rename token in `SemanticColorTokens.ts`
   - Update CTA button to use new token name
   - Update Token-Family-Color.md documentation
4. **Prerequisite 2**: Create `color.background.primary.subtle` semantic token (~30 min)
   - Add token to `SemanticColorTokens.ts` (references `purple100`)
   - Update Token-Family-Color.md documentation
5. **Prerequisite 3**: Create `radiusHalf` primitive + `radiusCircle` semantic tokens (~2-4 hours)
   - Modify `PrimitiveToken.ts` to add `'%'`, `'shape'`, `'percent'` units
   - Add `radiusHalf` primitive token (50% value)
   - Add `radiusCircle` semantic token (references `radiusHalf`)
   - Update platform generators
   - Add tests
6. **Prerequisite 4**: Create `buttonIcon.inset.*` component tokens (~30 min)
   - Create `src/components/core/Button-Icon/buttonIcon.tokens.ts`
   - Define `buttonIcon.inset.large` (12px, references `inset.150`)
   - Define `buttonIcon.inset.medium` (10px, unique value)
   - Define `buttonIcon.inset.small` (8px, references `inset.100`)
7. Create full requirements.md with EARS-format acceptance criteria
8. Create design.md with detailed specifications
9. Create tasks.md with implementation plan
