# Design Document: Container-Card-Base Component

**Date**: January 20, 2026
**Spec**: 043 - Container-Card-Base
**Status**: Design Phase
**Dependencies**: Container-Base (existing component)

---

## Overview

Container-Card-Base is a type primitive component within the Containers family that provides card-specific styling and behaviors. It uses Container-Base internally via composition and exposes a curated subset of props appropriate for card use cases.

**Design Philosophy**: Inspired by Spotify Encore and Shopify Polaris—opinionated defaults with constrained flexibility. The base provides consistent card styling through a filtered subset of Container-Base's API; semantic variants handle content-specific layouts.

---

## Architecture

### Component Hierarchy

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
│   ├── Container-Card-Senator (Semantic - content format) [Future]
│   ├── Container-Card-Bill (Semantic - content format) [Future]
│   └── Container-Card-[ContentType] (Semantic - content format) [Future]
│
├── Container-Panel-Base (Type Primitive) [Future]
└── Container-Hero-Base (Type Primitive) [Future]
```

### Composition Pattern

Container-Card-Base uses Container-Base internally (composition, not inheritance):

```typescript
// Simplified implementation pattern
function ContainerCardBase(props: ContainerCardBaseProps) {
  const { interactive, onPress, role, ...containerProps } = props;
  
  return (
    <ContainerBase
      {...mapToContainerBaseProps(containerProps)}
      hoverable={interactive}
      // Additional interactive handling
    >
      {props.children}
    </ContainerBase>
  );
}
```

This provides:
1. **Constrained Flexibility**: Only card-appropriate options exposed
2. **Opinionated Defaults**: Sensible values without configuration
3. **Centralized Updates**: Container-Base changes propagate automatically
4. **Escape Hatch**: Developers can use Container-Base directly if needed

---

## Components and Interfaces

### Container-Base Enhancements

New props added to Container-Base:

```typescript
interface ContainerBaseProps {
  // Existing props...
  
  // NEW: Axis-level padding
  paddingVertical?: 'none' | '050' | '100' | '150' | '200' | '300' | '400';
  paddingHorizontal?: 'none' | '050' | '100' | '150' | '200' | '300' | '400';
  
  // NEW: Individual edge padding (logical properties)
  paddingBlockStart?: 'none' | '050' | '100' | '150' | '200' | '300' | '400';
  paddingBlockEnd?: 'none' | '050' | '100' | '150' | '200' | '300' | '400';
  paddingInlineStart?: 'none' | '050' | '100' | '150' | '200' | '300' | '400';
  paddingInlineEnd?: 'none' | '050' | '100' | '150' | '200' | '300' | '400';
  
  // NEW: Border color
  borderColor?: ColorTokenName;
}
```

**Padding Override Hierarchy:**
1. Individual edges (`paddingBlockStart`, etc.) override axis props
2. Axis props (`paddingVertical`, `paddingHorizontal`) override uniform `padding`
3. Uniform `padding` is the base

**Logical Properties Reference:**

| Prop | LTR Effect | RTL Effect |
|------|------------|------------|
| `paddingBlockStart` | top | top |
| `paddingBlockEnd` | bottom | bottom |
| `paddingInlineStart` | left | right |
| `paddingInlineEnd` | right | left |

### Container-Card-Base Interface

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
  
  // Semantic HTML (web only)
  semantic?: 'div' | 'section' | 'article';
  
  // Accessibility
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

### Props Mapping: Container-Base → Card-Base

| Container-Base Prop | Card-Base Exposes | Card-Base Values | Default |
|---------------------|-------------------|------------------|---------|
| `padding` | ✅ Subset | `'none' \| '100' \| '150' \| '200'` | `'150'` |
| `paddingVertical` | ✅ Subset | `'none' \| '050' \| '100' \| '150' \| '200'` | - |
| `paddingHorizontal` | ✅ Subset | `'none' \| '100' \| '150' \| '200'` | - |
| `paddingBlockStart` | ✅ Subset | `'none' \| '050' \| '100' \| '150' \| '200'` | - |
| `paddingBlockEnd` | ✅ Subset | `'none' \| '050' \| '100' \| '150' \| '200'` | - |
| `paddingInlineStart` | ✅ Subset | `'none' \| '100' \| '150' \| '200'` | - |
| `paddingInlineEnd` | ✅ Subset | `'none' \| '100' \| '150' \| '200'` | - |
| `background` | ✅ Subset | `'surface.primary' \| 'surface.secondary' \| 'surface.tertiary'` | `'surface.primary'` |
| `shadow` | ✅ Subset | `'none' \| 'container'` | `'container'` |
| `border` | ✅ Subset | `'none' \| 'default'` | `'none'` |
| `borderColor` | ✅ Subset | `'border.default' \| 'border.subtle'` | `'border.default'` |
| `borderRadius` | ✅ Subset | `'normal' \| 'loose'` | `'normal'` |
| `semantic` | ✅ Subset | `'div' \| 'section' \| 'article'` | `'div'` |
| `accessibilityLabel` | ✅ Pass-through | `string` | - |
| `opacity` | ❌ No | - | - |
| `layering` | ❌ No | - | - |
| `ignoresSafeArea` | ❌ No | - | - |
| `hoverable` | ❌ Derived | - | Derived from `interactive` |

---

## Data Models

### Behavioral Contracts

#### Base Contracts (All Cards)

| Contract | Description | Platforms |
|----------|-------------|-----------|
| `provides_visual_boundary` | Card has clear visual separation from background | web, ios, android |
| `provides_consistent_padding` | Content has consistent internal spacing | web, ios, android |
| `provides_rounded_corners` | Card has rounded corners per token | web, ios, android |

#### Interactive Contracts (when `interactive={true}`)

| Contract | Description | Platforms |
|----------|-------------|-----------|
| `provides_hover_feedback` | Background darkens on hover (8% via blend token) | web |
| `provides_press_feedback` | Background darkens on press (12% via blend.pressedDarker, no scale) | web, ios, android |
| `provides_focus_indication` | Visible focus ring using established focus pattern | web, ios, android |
| `supports_keyboard_activation` | Enter activates; Space activates if `role="button"` | web |
| `applies_aria_role` | Applies `role="button"` or `role="link"` based on prop | web |

### Token Dependencies

Container-Card-Base uses existing semantic tokens directly — no component-level tokens needed.

#### Default Semantic Tokens

| Purpose | Token | Value |
|---------|-------|-------|
| Default padding | `space.inset.150` | 12px equivalent |
| Default background | `color.surface.primary` | Primary surface color |
| Default shadow | `shadow.container` | Container shadow |
| Default border radius | `radius.normal` | Normal corner radius |
| Default border color | `color.border.default` | Default border color |
| Subtle border color | `color.border.subtle` | Subtle border color |

#### Interaction Tokens (from Container-Base)

| Purpose | Token | Value |
|---------|-------|-------|
| Hover feedback | `blend.hoverDarker` | 8% darker |
| Press feedback | `blend.pressedDarker` | 12% darker |
| State transition | `motion.focusTransition` | 150ms ease-out |

---

## Platform Implementations

### Web (Web Components)

```typescript
// container-card-base.web.ts
class ContainerCardBase extends HTMLElement {
  static get observedAttributes() {
    return ['padding', 'padding-vertical', 'padding-horizontal', 
            'padding-block-start', 'padding-block-end',
            'padding-inline-start', 'padding-inline-end',
            'background', 'shadow', 'border', 'border-color', 
            'border-radius', 'semantic', 'interactive', 'role'];
  }
  
  // Uses CSS logical properties for padding
  private applyPadding() {
    const padding = this.getAttribute('padding') || '150';
    const paddingVertical = this.getAttribute('padding-vertical');
    const paddingHorizontal = this.getAttribute('padding-horizontal');
    const paddingBlockStart = this.getAttribute('padding-block-start');
    const paddingBlockEnd = this.getAttribute('padding-block-end');
    const paddingInlineStart = this.getAttribute('padding-inline-start');
    const paddingInlineEnd = this.getAttribute('padding-inline-end');
    
    // Base: uniform padding
    this.style.padding = `var(--space-inset-${padding})`;
    
    // Axis overrides
    if (paddingVertical) {
      this.style.paddingBlock = `var(--space-inset-${paddingVertical})`;
    }
    if (paddingHorizontal) {
      this.style.paddingInline = `var(--space-inset-${paddingHorizontal})`;
    }
    
    // Individual edge overrides (highest priority)
    if (paddingBlockStart) {
      this.style.paddingBlockStart = `var(--space-inset-${paddingBlockStart})`;
    }
    if (paddingBlockEnd) {
      this.style.paddingBlockEnd = `var(--space-inset-${paddingBlockEnd})`;
    }
    if (paddingInlineStart) {
      this.style.paddingInlineStart = `var(--space-inset-${paddingInlineStart})`;
    }
    if (paddingInlineEnd) {
      this.style.paddingInlineEnd = `var(--space-inset-${paddingInlineEnd})`;
    }
  }
}
```

### iOS (SwiftUI)

```swift
// ContainerCardBase.ios.swift
struct ContainerCardBase<Content: View>: View {
    var padding: CardPadding = .p150
    var paddingVertical: CardPadding? = nil
    var paddingHorizontal: CardPadding? = nil
    var paddingBlockStart: CardPadding? = nil
    var paddingBlockEnd: CardPadding? = nil
    var paddingInlineStart: CardPadding? = nil
    var paddingInlineEnd: CardPadding? = nil
    var background: CardBackground = .surfacePrimary
    var shadow: CardShadow = .elevationLow
    var border: CardBorder = .none
    var borderColor: CardBorderColor = .default
    var borderRadius: CardRadius = .normal
    var interactive: Bool = false
    var role: CardRole = .button
    var onPress: (() -> Void)? = nil
    var accessibilityLabel: String? = nil
    @ViewBuilder var content: () -> Content
    
    var body: some View {
        ContainerBase(
            padding: padding,
            paddingVertical: paddingVertical,
            paddingHorizontal: paddingHorizontal,
            paddingBlockStart: paddingBlockStart,
            paddingBlockEnd: paddingBlockEnd,
            paddingInlineStart: paddingInlineStart,
            paddingInlineEnd: paddingInlineEnd,
            background: background.token,
            shadow: shadow.token,
            border: border.token,
            borderColor: borderColor.token,
            borderRadius: borderRadius.token,
            hoverable: interactive
        ) {
            content()
        }
        .if(interactive) { view in
            view.onTapGesture { onPress?() }
        }
        .accessibilityLabel(accessibilityLabel ?? "")
        .accessibilityAddTraits(interactive ? (role == .button ? .isButton : .isLink) : [])
    }
}
```

### Android (Jetpack Compose)

```kotlin
// ContainerCardBase.android.kt
@Composable
fun ContainerCardBase(
    modifier: Modifier = Modifier,
    padding: CardPadding = CardPadding.P150,
    paddingVertical: CardPadding? = null,
    paddingHorizontal: CardPadding? = null,
    paddingBlockStart: CardPadding? = null,
    paddingBlockEnd: CardPadding? = null,
    paddingInlineStart: CardPadding? = null,
    paddingInlineEnd: CardPadding? = null,
    background: CardBackground = CardBackground.SurfacePrimary,
    shadow: CardShadow = CardShadow.ElevationLow,
    border: CardBorder = CardBorder.None,
    borderColor: CardBorderColor = CardBorderColor.Default,
    borderRadius: CardRadius = CardRadius.Normal,
    interactive: Boolean = false,
    role: CardRole = CardRole.Button,
    onPress: (() -> Unit)? = null,
    accessibilityLabel: String? = null,
    testTag: String? = null,
    content: @Composable () -> Unit
) {
    ContainerBase(
        modifier = modifier
            .semantics {
                accessibilityLabel?.let { contentDescription = it }
                if (interactive) {
                    this.role = if (role == CardRole.Button) Role.Button else Role.Link
                }
            }
            .testTag(testTag ?: ""),
        padding = padding.toContainerPadding(),
        paddingVertical = paddingVertical?.toContainerPadding(),
        paddingHorizontal = paddingHorizontal?.toContainerPadding(),
        paddingBlockStart = paddingBlockStart?.toContainerPadding(),
        paddingBlockEnd = paddingBlockEnd?.toContainerPadding(),
        paddingInlineStart = paddingInlineStart?.toContainerPadding(),
        paddingInlineEnd = paddingInlineEnd?.toContainerPadding(),
        background = background.token,
        shadow = shadow.token,
        border = border.token,
        borderColor = borderColor.token,
        borderRadius = borderRadius.token,
        hoverable = interactive,
        onClick = if (interactive) onPress else null
    ) {
        content()
    }
}
```

---

## Interaction States

### Hover State (when `interactive={true}`)

- **Trigger**: Pointer device hover (web, macOS/iPadOS with trackpad)
- **Visual**: Background darkens using `blend.hoverDarker` (8% darker)
- **Transition**: Uses `motion.focusTransition` token (150ms ease-out)
- **Implementation**: Leverages Container-Base's `hoverable` prop

### Press State (when `interactive={true}`)

- **Trigger**: Mouse down / touch start
- **Visual**: Background darkens using `blend.pressedDarker` (12% darker, more pronounced than hover)
- **Transition**: Immediate on press, ease-out on release
- **Rationale**: No scale transform to avoid layout shift; 12% provides clear action confirmation

### Focus State (when `interactive={true}`)

- **Trigger**: Keyboard focus (Tab navigation)
- **Visual**: Uses existing DesignerPunk focus ring pattern
- **Implementation**: Leverages established focus token/method from other interactive components

---

## Error Handling

### Invalid Prop Values

| Scenario | Behavior |
|----------|----------|
| Invalid `padding` value | Fall back to default (`'150'`) |
| Invalid `background` value | Fall back to default (`'surface.primary'`) |
| `onPress` without `interactive={true}` | `onPress` is ignored |
| `role` without `interactive={true}` | `role` is ignored |

### Development Warnings

| Scenario | Warning |
|----------|---------|
| `onPress` provided but `interactive={false}` | "onPress will be ignored when interactive is false" |
| `role` provided but `interactive={false}` | "role will be ignored when interactive is false" |

---

## Testing Strategy

### Unit Tests

| Test Category | Coverage |
|---------------|----------|
| Default rendering | Verify default props applied correctly |
| Prop variations | Test each prop value renders correctly |
| Interactive states | Test hover, press, focus states |
| Keyboard activation | Test Enter/Space behavior based on role |
| Accessibility | Test ARIA attributes applied correctly |

### Integration Tests

| Test Category | Coverage |
|---------------|----------|
| Container-Base composition | Verify props pass through correctly |
| Token resolution | Verify tokens resolve to correct values |
| Cross-platform consistency | Verify same behavior across platforms |

### Accessibility Tests

| Test Category | Coverage |
|---------------|----------|
| Focus indication | Verify visible focus ring (WCAG 2.4.7) |
| Keyboard operability | Verify keyboard activation (WCAG 2.1.1) |
| Role announcement | Verify screen reader announces role correctly |

---

## Design Decisions

### Decision 1: Composition over Inheritance

**Options Considered**:
1. Extend Container-Base class
2. Compose Container-Base internally
3. Duplicate Container-Base code

**Decision**: Compose Container-Base internally

**Rationale**: Composition provides cleaner separation of concerns. Card-Base can filter props before passing to Container-Base without modifying Container-Base's interface.

**Trade-offs**: Slight runtime overhead from prop mapping; mitigated by simplicity and maintainability.

---

### Decision 2: Curated Subset Model

**Options Considered**:
1. Expose all Container-Base props
2. Expose curated subset with constrained values
3. Create entirely separate prop interface

**Decision**: Expose curated subset with constrained values

**Rationale**: Provides opinionated guidance while maintaining flexibility. Developers get "pit of success" defaults; power users can use Container-Base directly.

**Trade-offs**: Some flexibility lost; acceptable for card use cases.

---

### Decision 3: Interactive as Prop, Not Type

**Options Considered**:
1. Separate `InteractiveCard` component
2. `interactive` prop on Card-Base
3. Detect interactivity from `onPress` presence

**Decision**: `interactive` prop on Card-Base

**Rationale**: Interactivity is orthogonal to content. A senator card might be interactive or static depending on context. Separate component would cause combinatorial explosion.

**Trade-offs**: Slightly more complex prop interface; acceptable for flexibility gained.

---

### Decision 4: CSS Logical Properties

**Options Considered**:
1. Physical properties (`padding-top`, `padding-left`)
2. Logical properties (`padding-block`, `padding-inline`)

**Decision**: Logical properties for web platform

**Rationale**: Internationalization support for RTL layouts. Modern CSS best practice.

**Trade-offs**: Older browser support; acceptable given target browser matrix.

---

### Decision 5: Press Feedback Without Scale

**Options Considered**:
1. Darken + scale down (like iOS buttons)
2. Darken only (like Material Design)
3. Ripple effect (Material Design)

**Decision**: Darken only, no scale

**Rationale**: Scale transforms can cause layout shift in card grids. Darken provides clear feedback without visual disruption.

**Trade-offs**: Less "tactile" feel; acceptable for layout stability.

---

### Decision 6: Role Prop for ARIA Semantics

**Options Considered**:
1. Always use `role="button"`
2. Detect from `onPress` behavior
3. Explicit `role` prop

**Decision**: Explicit `role` prop with `'button'` default

**Rationale**: Developer knows intent better than component. Navigation cards should be links; action cards should be buttons. Explicit prop prevents incorrect assumptions.

**Trade-offs**: Additional prop to configure; acceptable for accessibility correctness.

---

## Documentation Updates Required

### Files to Update

| File | Update Required |
|------|-----------------|
| `Component-Family-Container.md` | Add Container-Card-Base section, update hierarchy, add props mapping |
| `Component-Quick-Reference.md` | Add Container-Card-Base to component routing table |
| `Container-Base/README.md` | Document new props (paddingVertical, paddingHorizontal, paddingBlockStart, paddingBlockEnd, paddingInlineStart, paddingInlineEnd, borderColor) |

### Standards to Follow

| Standard | Purpose |
|----------|---------|
| Component Development Guide | Token selection, component patterns |
| Component MCP Document Template | Documentation structure |
| Test Development Standards | Test patterns and categories |
| Stemma System Principles | Component hierarchy and contracts |

---

## Related Documents

- [Requirements](./requirements.md) — Functional and non-functional requirements
- [Design Outline](./design-outline.md) — Initial design exploration
- [Component-Family-Container.md](../../steering/Component-Family-Container.md) — Container family documentation
- [Stemma System Principles](../../steering/stemma-system-principles.md) — Component architecture standards
