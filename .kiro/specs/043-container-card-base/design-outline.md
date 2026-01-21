# Container-Card-Base Component - Design Outline

**Date**: January 20, 2026
**Purpose**: Capture design decisions and token requirements before creating full spec
**Status**: Design Outline (Pre-Requirements)

---

## Component Overview

Container-Card-Base is a type primitive within the Containers family that provides card-specific styling and behaviors. It exposes a curated subset of Container-Base's props appropriate for card use cases, serving as the foundation for content-format semantic variants (e.g., Container-Card-Senator, Container-Card-Bill).

**Design Philosophy**: Inspired by Spotify Encore and Shopify Polaris—opinionated defaults with constrained flexibility. The base provides consistent card styling through a filtered subset of Container-Base's API; semantic variants handle content-specific layouts.

**Key Characteristics**:
- **Type Primitive**: Within Containers family, parallel to Input-Text-Base in Form Inputs
- **Curated Subset**: Exposes card-appropriate props/values from Container-Base
- **Opinionated Defaults**: Sensible defaults for shadow, radius, background, padding
- **Optional Interactivity**: `interactive` prop adds press/hover states (not a separate type)
- **Content Agnostic**: Base accepts any children; semantic variants define content structure

---

## Architecture

### Stemma System Integration

Container-Card-Base follows the same pattern as Input-Text-Base:

```
Containers Family
│
├── Container-Base (Family Primitive)
│   │
│   │  Full API: padding, paddingVertical, paddingHorizontal,
│   │            background, shadow, border, borderColor, borderRadius,
│   │            opacity, layering, semantic, accessibilityLabel,
│   │            ignoresSafeArea, hoverable, children
│   │
│   │  Role: Foundation for type primitives; developer escape hatch
│   │
├── Container-Card-Base (Type Primitive)
│   │
│   │  Curated Subset: Exposes card-appropriate props/values
│   │  Plus Card-Specific: interactive, onPress, role
│   │
│   ├── Container-Card-Senator (Semantic - content format)
│   ├── Container-Card-Bill (Semantic - content format)
│   └── Container-Card-[ContentType] (Semantic - content format)
│
├── Container-Panel-Base (Type Primitive) [Future]
└── Container-Hero-Base (Type Primitive) [Future]
```

### Relationship to Container-Base

Container-Card-Base **uses** Container-Base internally (composition) and exposes a **curated subset** of its props. This provides:

1. **Constrained Flexibility**: Only card-appropriate options are available
2. **Opinionated Defaults**: Sensible values without configuration
3. **Centralized Updates**: Changes to Container-Base propagate to all type primitives
4. **Escape Hatch**: Developers needing full control can use Container-Base directly

### Interactive Behavior Architecture

When `interactive={true}` on Card-Base:
- Internally sets `hoverable: true` on the underlying Container-Base
- Adds press/tap handling via `onPress`
- Adds focus management and keyboard activation
- Applies appropriate ARIA role based on `role` prop

Card-Base does NOT expose `hoverable` directly—it's derived from `interactive`.

---

## Scope: Container-Base Enhancements

This spec includes enhancements to Container-Base that Container-Card-Base will then expose as curated subsets.

### New Container-Base Props

| Property | Type | Description |
|----------|------|-------------|
| `paddingVertical` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | Vertical padding (block-start + block-end) |
| `paddingHorizontal` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | Horizontal padding (inline-start + inline-end) |
| `paddingBlockStart` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | Top padding (in LTR) |
| `paddingBlockEnd` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | Bottom padding (in LTR) |
| `paddingInlineStart` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | Left padding (in LTR), right padding (in RTL) |
| `paddingInlineEnd` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | Right padding (in LTR), left padding (in RTL) |
| `borderColor` | `ColorTokenName` | Border color token |

### Padding Behavior

- `padding` sets all sides uniformly
- `paddingVertical` overrides block-start/block-end when specified
- `paddingHorizontal` overrides inline-start/inline-end when specified
- Individual edge props (`paddingBlockStart`, `paddingBlockEnd`, `paddingInlineStart`, `paddingInlineEnd`) override axis props when specified
- **Override hierarchy**: individual edges > axis props > uniform padding

**Rationale**: Typography-based padding adjustments require different vertical vs. horizontal spacing. Individual edge control enables asymmetric layouts (e.g., image bleeding to one edge). Logical property names ensure proper RTL support.

### Logical Properties Reference

| Prop | LTR Effect | RTL Effect | CSS Output |
|------|------------|------------|------------|
| `paddingBlockStart` | top | top | `padding-block-start` |
| `paddingBlockEnd` | bottom | bottom | `padding-block-end` |
| `paddingInlineStart` | left | right | `padding-inline-start` |
| `paddingInlineEnd` | right | left | `padding-inline-end` |

### CSS Logical Properties (Web Platform)

Web implementation uses CSS logical properties for internationalization support:

| Prop | CSS Output |
|------|------------|
| `padding` | `padding` (shorthand) |
| `paddingVertical` | `padding-block` |
| `paddingHorizontal` | `padding-inline` |
| `paddingBlockStart` | `padding-block-start` |
| `paddingBlockEnd` | `padding-block-end` |
| `paddingInlineStart` | `padding-inline-start` |
| `paddingInlineEnd` | `padding-inline-end` |

This ensures proper behavior in RTL (right-to-left) layouts.

---

## Props Inheritance from Container-Base

### Container-Base Full API (After Enhancement)

| Property | Type | Card-Base Exposes? |
|----------|------|-------------------|
| `padding` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | ✅ Subset |
| `paddingVertical` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | ✅ Subset |
| `paddingHorizontal` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | ✅ Subset |
| `paddingBlockStart` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | ✅ Subset |
| `paddingBlockEnd` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | ✅ Subset |
| `paddingInlineStart` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | ✅ Subset |
| `paddingInlineEnd` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | ✅ Subset |
| `background` | `ColorTokenName` | ✅ Subset |
| `shadow` | `ShadowTokenName` | ✅ Subset |
| `border` | `'none' \| 'default' \| 'emphasis' \| 'heavy'` | ✅ Subset |
| `borderColor` | `ColorTokenName` | ✅ Subset |
| `borderRadius` | `'none' \| 'tight' \| 'normal' \| 'loose'` | ✅ Subset |
| `opacity` | `OpacityTokenName` | ❌ No |
| `layering` | `'container' \| 'navigation' \| ...` | ❌ No |
| `semantic` | `'div' \| 'section' \| 'article' \| ...` | ✅ Subset |
| `accessibilityLabel` | `string` | ✅ Yes |
| `ignoresSafeArea` | `boolean` | ❌ No |
| `hoverable` | `boolean` | ❌ No (derived from `interactive`) |
| `children` | `any` | ✅ Yes |

---

## Container-Card-Base Props Definition

### Curated Subset from Container-Base

| Property | Container-Base Values | Card-Base Values | Default | Rationale |
|----------|----------------------|------------------|---------|-----------|
| `padding` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | `'none' \| '100' \| '150' \| '200'` | `'150'` | Cards need compact to comfortable; extreme values excluded |
| `paddingVertical` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | `'none' \| '050' \| '100' \| '150' \| '200'` | - | Typography balance may need tighter vertical |
| `paddingHorizontal` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | `'none' \| '100' \| '150' \| '200'` | - | Horizontal typically matches uniform padding |
| `paddingBlockStart` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | `'none' \| '050' \| '100' \| '150' \| '200'` | - | Individual top edge control |
| `paddingBlockEnd` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | `'none' \| '050' \| '100' \| '150' \| '200'` | - | Individual bottom edge control |
| `paddingInlineStart` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | `'none' \| '100' \| '150' \| '200'` | - | Individual start edge (left in LTR) |
| `paddingInlineEnd` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | `'none' \| '100' \| '150' \| '200'` | - | Individual end edge (right in LTR) |
| `background` | Any `ColorTokenName` | `'surface.primary' \| 'surface.secondary' \| 'surface.tertiary'` | `'surface.primary'` | Cards use surface colors only |
| `shadow` | Any `ShadowTokenName` | `'none' \| 'container'` | `'container'` | Cards use container shadow or flat |
| `border` | `'none' \| 'default' \| 'emphasis' \| 'heavy'` | `'none' \| 'default'` | `'none'` | Cards use subtle or no border |
| `borderColor` | Any `ColorTokenName` | `'border.default' \| 'border.subtle'` | `'border.default'` | Cards use default or subtle border colors |
| `borderRadius` | `'none' \| 'tight' \| 'normal' \| 'loose'` | `'normal' \| 'loose'` | `'normal'` | Cards always have rounded corners |
| `semantic` | Full list | `'div' \| 'section' \| 'article'` | `'div'` | Cards are typically div, section, or article |
| `accessibilityLabel` | `string` | `string` | - | Passed through unchanged |

### Card-Specific Props (Not from Container-Base)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `interactive` | `boolean` | `false` | Enables press/hover states, focus management, ARIA role |
| `onPress` | `() => void` | - | Press handler (only used when `interactive={true}`) |
| `role` | `'button' \| 'link'` | `'button'` | ARIA role for interactive cards (only used when `interactive={true}`) |
| `testID` | `string` | - | Test ID for automated testing |

### Role Prop Guidance

| Role | Use When | Keyboard Behavior |
|------|----------|-------------------|
| `'button'` | Card triggers an action (expand, select, like) | Enter or Space activates |
| `'link'` | Card navigates to another page/view | Enter activates (not Space) |

---

## Component API Design

### Props Interface

```typescript
interface ContainerCardBaseProps {
  // Padding (curated from Container-Base)
  padding?: 'none' | '100' | '150' | '200';
  paddingVertical?: 'none' | '050' | '100' | '150' | '200';
  paddingHorizontal?: 'none' | '100' | '150' | '200';
  paddingBlockStart?: 'none' | '050' | '100' | '150' | '200';
  paddingBlockEnd?: 'none' | '050' | '100' | '150' | '200';
  paddingInlineStart?: 'none' | '100' | '150' | '200';
  paddingInlineEnd?: 'none' | '100' | '150' | '200';
  
  // Visual styling (curated from Container-Base)
  background?: 'surface.primary' | 'surface.secondary' | 'surface.tertiary';
  shadow?: 'none' | 'container';
  border?: 'none' | 'default';
  borderColor?: 'border.default' | 'border.subtle';
  borderRadius?: 'normal' | 'loose';
  
  // Semantic HTML (curated from Container-Base, web only)
  semantic?: 'div' | 'section' | 'article';
  
  // Accessibility (passed through from Container-Base)
  accessibilityLabel?: string;
  
  // Card-specific interactivity
  interactive?: boolean;
  onPress?: () => void;
  role?: 'button' | 'link';
  
  // Standard
  children: ReactNode;
  testID?: string;
}
```

### Default Values

```typescript
const defaults = {
  padding: '150',
  // paddingVertical: undefined (uses padding)
  // paddingHorizontal: undefined (uses padding)
  background: 'surface.primary',
  shadow: 'container',
  border: 'none',
  borderColor: 'border.default',
  borderRadius: 'normal',
  semantic: 'div',
  interactive: false,
  role: 'button'  // Only applies when interactive={true}
};
```

---

## Interaction States

### Hover State (when `interactive={true}`)

- **Trigger**: Pointer device hover (web, macOS/iPadOS with trackpad)
- **Visual**: Background darkens using `blend.hoverDarker` (8% darker)
- **Transition**: Uses `motion.focusTransition` token

### Press State (when `interactive={true}`)

- **Trigger**: Mouse down / touch start
- **Visual**: Background darkens using `blend.pressedDarker` (12% darker, more pronounced than hover)
- **Transition**: Immediate on press, ease-out on release

### Focus State (when `interactive={true}`)

- **Trigger**: Keyboard focus (Tab navigation)
- **Visual**: Uses existing DesignerPunk focus ring pattern
- **Behavior**: Leverages established focus token/method from other interactive components

---

## Usage Examples

```tsx
// Default card (most common)
<ContainerCardBase>
  <Text>Card content</Text>
</ContainerCardBase>

// Typography-balanced padding (tighter vertical for line-height)
<ContainerCardBase padding="150" paddingVertical="100">
  <Text>Content with balanced padding</Text>
</ContainerCardBase>

// Flat bordered card (no shadow)
<ContainerCardBase shadow="none" border="default">
  <Text>Bordered card</Text>
</ContainerCardBase>

// Interactive card (action)
<ContainerCardBase interactive onPress={() => expandDetails()}>
  <Text>Tap to expand</Text>
</ContainerCardBase>

// Interactive card (navigation)
<ContainerCardBase interactive role="link" onPress={() => navigate('/senator/123')}>
  <Text>View Senator Profile</Text>
</ContainerCardBase>

// Edge-to-edge image card (image bleeds to left edge)
<ContainerCardBase paddingInlineStart="none">
  <HStack>
    <Image src="..." />
    <VStack padding="150">
      <Text>2x boost</Text>
      <Text>Make 3 purchases within 2 weeks</Text>
    </VStack>
  </HStack>
</ContainerCardBase>

// Edge-to-edge image card (full bleed)
<ContainerCardBase padding="none">
  <Image src="..." />
  <View style={{ padding: tokens.space.inset['150'] }}>
    <Text>Caption below image</Text>
  </View>
</ContainerCardBase>

// Nested card (secondary background)
<ContainerCardBase>
  <Text>Parent card</Text>
  <ContainerCardBase background="surface.secondary" shadow="none">
    <Text>Nested card</Text>
  </ContainerCardBase>
</ContainerCardBase>

// Custom border color
<ContainerCardBase shadow="none" border="default" borderColor="border.subtle">
  <Text>Subtle bordered card</Text>
</ContainerCardBase>
```

---

## Behavioral Contracts

### Base Contracts (All Cards)

| Contract | Description | Platforms |
|----------|-------------|-----------|
| `provides_visual_boundary` | Card has clear visual separation from background | web, ios, android |
| `provides_consistent_padding` | Content has consistent internal spacing | web, ios, android |
| `provides_rounded_corners` | Card has rounded corners per token | web, ios, android |

### Interactive Contracts (when `interactive={true}`)

| Contract | Description | Platforms |
|----------|-------------|-----------|
| `provides_hover_feedback` | Background darkens on hover (8% via blend token) | web |
| `provides_press_feedback` | Background darkens on press (12% via blend.pressedDarker, no scale) | web, ios, android |
| `provides_focus_indication` | Visible focus ring using established focus pattern | web, ios, android |
| `supports_keyboard_activation` | Enter activates; Space activates if `role="button"` | web |
| `applies_aria_role` | Applies `role="button"` or `role="link"` based on prop | web |

---

## Token Requirements

Container-Card-Base uses existing semantic tokens directly — no component-level tokens needed.

### Default Semantic Tokens

| Purpose | Token | Value |
|---------|-------|-------|
| Default padding | `space.inset.150` | 12px equivalent |
| Default background | `color.surface.primary` | Primary surface color |
| Default shadow | `shadow.container` | Container shadow |
| Default border radius | `radius.normal` | Normal corner radius |
| Default border color | `color.border.default` | Default border color |
| Subtle border color | `color.border.subtle` | Subtle border color |

### Interaction Tokens (Inherited from Container-Base)

| Purpose | Token | Value |
|---------|-------|-------|
| Hover feedback | `blend.hoverDarker` | 8% darker |
| Press feedback | `blend.pressedDarker` | 12% darker |
| State transition | `motion.focusTransition` | 150ms ease-out |

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Add directional padding to Container-Base | Typography balance needs vary; benefits all container types |
| 2 | Add individual edge padding props | Enables asymmetric layouts (e.g., image bleeding to one edge) |
| 3 | Use CSS logical properties (web) | Internationalization support for RTL layouts |
| 4 | Use logical property names in API | Semantic honesty; avoids confusion in RTL contexts |
| 5 | Curated subset of Container-Base props | Constrained flexibility; only card-appropriate options |
| 6 | Separate props for shadow/border (not variants) | Avoid semantic types based on aesthetic attributes |
| 7 | `interactive` as prop, not type | Interactivity is orthogonal to content |
| 8 | `interactive` derives `hoverable` internally | Card-Base doesn't expose `hoverable`; it's an implementation detail |
| 9 | Press feedback = darken 12% (no scale) | More pronounced than hover (8%); avoids layout shift |
| 10 | `role` prop for ARIA semantics | Allows button vs link distinction for accessibility |
| 11 | Default semantic = `<div>` | Semantically neutral; developers opt into `<section>`/`<article>` |
| 12 | Opinionated defaults | Good card with zero props |
| 13 | Follows Input-Text-Base pattern | Consistent with Stemma architecture |
| 14 | No disabled state | DesignerPunk does not support disabled states |
| 15 | Add `borderColor` prop | Allows customization when border is visible |

---

## Documentation Requirements

This spec requires updates to documentation to ensure AI agents and developers can discover and use the new architecture.

### Standards to Follow

Implementation and documentation must follow these established standards:

| Standard | Purpose | MCP Query |
|----------|---------|-----------|
| **Component Development Guide** | Token selection, component patterns, implementation guidance | `get_section({ path: ".kiro/steering/Component-Development-Guide.md", heading: "Token Selection Decision Framework" })` |
| **Component MCP Document Template** | Structure for component family documentation | `get_document_full({ path: ".kiro/steering/Component-MCP-Document-Template.md" })` |
| **Test Development Standards** | Test patterns, categories, validation requirements | `get_section({ path: ".kiro/steering/Test-Development-Standards.md", heading: "Test Categories" })` |
| **Stemma System Principles** | Component hierarchy, naming conventions, behavioral contracts | `get_section({ path: ".kiro/steering/stemma-system-principles.md", heading: "Component Schema Format" })` |

### Architecture Documentation

Update `Component-Family-Container.md` to document:

1. **Type Primitive Pattern**: Explain how Container-Card-Base introduces the type primitive layer between Container-Base and semantic variants
2. **Inheritance Hierarchy**: Update the component hierarchy diagram to show:
   ```
   Container-Base (Family Primitive)
   └── Container-Card-Base (Type Primitive)
       └── Container-Card-[Variant] (Semantic)
   ```
3. **Curated Subset Model**: Document the pattern where type primitives expose filtered subsets of the family primitive's API
4. **Interactive Behavior**: Document how `interactive` prop derives `hoverable` internally

### Props Mapping Documentation

Create a props mapping reference showing the relationship between Container-Base and Container-Card-Base:

| Container-Base Prop | Card-Base Exposes | Card-Base Values | Notes |
|---------------------|-------------------|------------------|-------|
| `padding` | ✅ Subset | `'none' \| '100' \| '150' \| '200'` | Excludes extreme values |
| `paddingVertical` | ✅ Subset | `'none' \| '050' \| '100' \| '150' \| '200'` | Includes '050' for typography |
| `paddingHorizontal` | ✅ Subset | `'none' \| '100' \| '150' \| '200'` | Matches uniform padding range |
| `paddingBlockStart` | ✅ Subset | `'none' \| '050' \| '100' \| '150' \| '200'` | Individual top edge |
| `paddingBlockEnd` | ✅ Subset | `'none' \| '050' \| '100' \| '150' \| '200'` | Individual bottom edge |
| `paddingInlineStart` | ✅ Subset | `'none' \| '100' \| '150' \| '200'` | Individual start edge (left in LTR) |
| `paddingInlineEnd` | ✅ Subset | `'none' \| '100' \| '150' \| '200'` | Individual end edge (right in LTR) |
| `background` | ✅ Subset | Surface colors only | `surface.primary/secondary/tertiary` |
| `shadow` | ✅ Subset | Container or flat | `none/container` |
| `border` | ✅ Subset | `'none' \| 'default'` | Excludes emphasis/heavy |
| `borderColor` | ✅ Subset | `'border.default' \| 'border.subtle'` | Card-appropriate colors |
| `borderRadius` | ✅ Subset | `'normal' \| 'loose'` | Cards always rounded |
| `semantic` | ✅ Subset | `'div' \| 'section' \| 'article'` | Card-appropriate elements |
| `accessibilityLabel` | ✅ Pass-through | `string` | Unchanged |
| `opacity` | ❌ No | - | Not card-appropriate |
| `layering` | ❌ No | - | Not card-appropriate |
| `ignoresSafeArea` | ❌ No | - | Not card-appropriate |
| `hoverable` | ❌ Derived | - | Derived from `interactive` |

### Card-Specific Props (Not from Container-Base)

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `interactive` | `boolean` | `false` | Enables hover/press/focus states |
| `onPress` | `() => void` | - | Press handler |
| `role` | `'button' \| 'link'` | `'button'` | ARIA role for interactive cards |
| `testID` | `string` | - | Test automation |

### Files to Update

| File | Update Required |
|------|-----------------|
| `.kiro/steering/Component-Family-Container.md` | Add Container-Card-Base section, update hierarchy, add props mapping |
| `.kiro/steering/Component-Quick-Reference.md` | Add Container-Card-Base to component routing table |
| `src/components/core/Container-Base/README.md` | Document new props (paddingVertical, paddingHorizontal, borderColor), update examples |

---

## Semantic Variants (Future Specs)

| Variant | Purpose |
|---------|---------|
| `Container-Card-Senator` | Display senator information |
| `Container-Card-Bill` | Display bill information |
| `Container-Card-Media` | Image + caption pattern |
| `Container-Card-Profile` | Avatar + name + bio pattern |

---

## Next Steps

1. ✅ Design outline created
2. ✅ Review with Peter (all decisions confirmed)
3. ⏳ Create requirements.md
4. ⏳ Create design.md
5. ⏳ Create tasks.md

---

**Organization**: spec-guide
**Scope**: 043-container-card-base
