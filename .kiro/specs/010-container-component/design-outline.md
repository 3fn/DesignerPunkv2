# Container Component Design Outline

**Date**: November 25, 2025
**Purpose**: Explore container component design space before formal requirements
**Organization**: spec-guide
**Scope**: 010-container-component
**Status**: Exploratory - Design thinking in progress

---

## Overview

Container is a foundational layout primitive that provides structural wrapping with optional styling. Unlike specialized components (Button, Icon), Container is an abstract primitive that serves as the building block for composition.

**Key Principle**: Container separates structure from styling through compositional architecture - styling is applied via preset variants and override props, not baked into the component.

---

## Core Concepts

### Container vs Cell Distinction

**Container**: Generic wrapper with styling options
- Used for layout structure and content grouping
- Can be styled or unstyled
- Not specific to scrollable lists

**Cell**: Container + list-specific behaviors
- Used within scrollable lists (vertical/horizontal)
- Includes list-specific features (selection, swipe actions, disclosure indicators)
- Extends Container patterns with list context

**Decision**: Build Container first as the foundation. Cell will be a separate component that extends Container patterns.

---

## Platform Analysis

### Cross-Platform Overlaps (Universal Concepts)

All platforms support these styling concepts:
- **Padding/Inset**: Internal spacing
- **Background Color**: Surface color
- **Border/Stroke**: Edge definition
- **Corner Radius**: Rounded corners
- **Shadow/Elevation**: Depth perception

### Platform Divergences

#### Web
- **Semantic HTML**: `<div>`, `<section>`, `<article>`, `<aside>`, `<main>`, `<fieldset>`
- **Box Model**: Margin, padding, border
- **Styling**: CSS classes
- **Layout**: Flexbox/Grid
- **Concerns**: Accessibility (semantic HTML), SEO, responsive breakpoints

#### iOS (SwiftUI)
- **Primitives**: `VStack`, `HStack`, `ZStack`, `Group`, `ScrollView`
- **Styling**: Modifier chains (`.padding()`, `.background()`, `.cornerRadius()`)
- **No Semantic HTML**: Accessibility via modifiers (`.accessibilityLabel()`)
- **Concerns**: Safe area insets, Dynamic Type, Dark mode, haptic feedback

#### Android (Jetpack Compose)
- **Primitives**: `Column`, `Row`, `Box`, `Surface`, `Card`
- **Styling**: Modifier chains (`.padding()`, `.background()`, `.clip()`)
- **Material Design**: Deeply integrated (Surface, elevation)
- **Concerns**: Density buckets, Material elevation, ripple effects, system bars

### Key Insight

**Styling is "class-derived" across all platforms** - the mechanism differs (CSS classes vs modifier chains), but the concept is the same: styling is applied to a base primitive through composition.

---

## Compositional Model

### The Anti-Pattern (What We're NOT Doing)

```typescript
// ❌ WRONG: Monolithic component with everything baked in
<Card title="Title" description="Description" padding={16} shadow="large" />
<ElevatedCard title="Title" description="Description" />
<OutlinedCard title="Title" description="Description" />
```

**Problems**:
- Rigid structure (can't change content without changing component)
- Variant explosion (need new component for every styling variation)
- Styling baked in (can't separate structure from aesthetics)

### The Compositional Approach (What We ARE Doing)

```typescript
// ✅ CORRECT: Base container + preset variants
<Container variant="elevated">
  <h3>Title</h3>
  <p>Description</p>
</Container>

<Container variant="outlined">
  <h3>Title</h3>
  <p>Description</p>
</Container>
```

**Benefits**:
- Flexible structure (any content)
- Preset variants for common patterns
- Styling applied through composition
- Override props for edge cases

---

## Variant System Design

### Problem: Configuration Explosion

Containers could have many styling dimensions:
- Padding variants: none, tight, normal, comfortable, spacious (5 options)
- Background variants: none, surface, elevated (3 options)
- Border variants: none, default, emphasis (3 options)
- Shadow variants: none, sunrise, noon, dusk, midnight (5 options)
- Border radius variants: none, subtle, rounded (3 options)

**Potential combinations**: 5 × 3 × 3 × 5 × 3 = **675 combinations**

**This is unmanageable** if we try to create a variant for every combination.

### Solution: Preset Variants + Override Props

#### Primary API: Preset Variants (90% of usage)

```typescript
<Container variant="elevated">
  {/* content */}
</Container>
```

**Preset variants** are pre-composed combinations of tokens that represent common patterns.

#### Secondary API: Override Props (10% of usage)

```typescript
<Container variant="elevated" padding="tight">
  {/* Override the preset's padding */}
</Container>
```

**Override props** allow customization of specific properties without creating new variants.

#### Tertiary API: Full Custom (1% of usage)

```typescript
<Container 
  padding="comfortable"
  background="surface"
  borderRadius="rounded"
  shadow="dusk"
>
  {/* Fully custom composition */}
</Container>
```

**Full custom** is possible but discouraged - use preset variants when possible.

---

## Naming Convention System

### The Challenge

As the system grows, variant names could become chaotic:
```typescript
// ❌ BAD: Naming chaos
'cardElevated'
'cardWithBorder'
'elevatedCardTight'
'cardElevatedBorderedTight'
```

**This is unmaintainable** - no clear pattern, hard to predict what exists.

### The Solution: Systematic Naming Convention

#### Layer 1: Base Semantic Names (Core Presets)

**Philosophy**: Name describes visual/semantic intent, not implementation.

```typescript
// Core presets (5-7 maximum)
'null'      // No styling (pure layout)
'inset'     // Just padding
'surface'   // Background + padding
'elevated'  // Card-like (shadow + background + padding)
'outlined'  // Border instead of shadow
```

**Naming Rules**:
- Single word (no compounds)
- Describes visual intent or semantic meaning
- Implementation-agnostic

#### Layer 2: Modifier Suffixes (Systematic Variations)

**Philosophy**: Variations of base presets use systematic suffixes.

```typescript
// Density modifiers
'elevated'        // Default (comfortable padding)
'elevated-tight'  // Tighter padding
'elevated-loose'  // Looser padding

// Emphasis modifiers
'surface'         // Default
'surface-subtle'  // Less prominent
'surface-bold'    // More prominent

// State modifiers
'outlined'           // Default
'outlined-active'    // Active state
'outlined-disabled'  // Disabled state
```

**Naming Rules**:
- Base name + hyphen + modifier
- Modifiers are predefined: `tight`, `loose`, `subtle`, `bold`, `active`, `disabled`
- Maximum one modifier per variant

#### Layer 3: Semantic Compounds (Rare, Explicit Combinations)

**Philosophy**: New combinations need clear semantic meaning and design approval.

```typescript
// ❌ BAD: Implementation-based name
'elevatedWithBorder'
'shadowAndBorder'

// ✅ GOOD: New semantic name
'framed'  // Elevated + border (picture frame metaphor)
'inset-bordered'  // Inset + border (form field metaphor)
```

**Naming Rules**:
- Must have clear semantic meaning
- Approved through design review
- Documented with use case rationale

### Naming Convention Matrix

| Pattern | Example | When to Use |
|---------|---------|-------------|
| **Base** | `elevated` | Core preset (90% of usage) |
| **Base-Density** | `elevated-tight` | Need different padding |
| **Base-Emphasis** | `surface-subtle` | Need different prominence |
| **Base-State** | `outlined-active` | Need state variation |
| **Semantic Compound** | `framed` | New meaningful combination |

### Forbidden Patterns

| Pattern | Example | Why Forbidden |
|---------|---------|---------------|
| **Implementation** | `shadowedWithBorder` | Describes implementation, not intent |
| **Multiple Modifiers** | `elevated-tight-bold` | Too specific, use override props |
| **Arbitrary Compounds** | `elevatedOutlined` | No clear semantic meaning |

---

## Governance: Preventing Variant Explosion

### Rule 1: Start with 5 Core Presets

```typescript
const CORE_VARIANTS = [
  'null',      // No styling
  'inset',     // Padding only
  'surface',   // Background + padding
  'elevated',  // Shadow + background + padding (the "card")
  'outlined'   // Border + background + padding
] as const;
```

**These cover 90% of use cases.** Don't add more without strong justification.

### Rule 2: Modifiers Must Be Pre-Approved

```typescript
// Allowed modifiers (defined once, used everywhere)
const DENSITY_MODIFIERS = ['tight', 'loose'] as const;
const EMPHASIS_MODIFIERS = ['subtle', 'bold'] as const;
const STATE_MODIFIERS = ['active', 'disabled', 'hover'] as const;
```

**This limits growth** - you can't create arbitrary modifiers.

### Rule 3: New Semantic Compounds Require Design Review

Every new semantic compound variant needs:
- Clear semantic name
- Use case rationale
- Token composition
- Design team approval
- Documentation

### Rule 4: Override Props for Everything Else

```typescript
// ❌ DON'T: Create 'elevated-tight-with-heavy-border'
<Container variant="elevated-tight-with-heavy-border">

// ✅ DO: Use override props
<Container variant="elevated" padding="tight" border="heavy">
```

**This prevents variant explosion** - edge cases use overrides, not new variants.

---

## Scalability Strategy

### Phase 1: Launch with Core Variants (5 variants)
```
null, inset, surface, elevated, outlined
```

### Phase 2: Add Density Modifiers (15 variants)
```
Core 5 + (5 × 2 density modifiers) = 15 total
```

### Phase 3: Add Semantic Compounds as Needed (Slow Growth)
```
15 + framed + inset-bordered + ... = ~20 total over time
```

### Phase 4: Override Props Handle Everything Else
```
Edge cases use override props, not new variants
```

**Expected outcome**: ~20 variants after years of use, not hundreds.

---

## Token Requirements

### Existing Tokens (Already Available)

**Spacing**:
- `space.inset.tight` (8px)
- `space.inset.normal` (12px)
- `space.inset.comfortable` (16px)
- `space.inset.spacious` (24px)
- `space.inset.expansive` (32px)
- `space.inset.generous` (48px)

**Colors**:
- `color.surface` (background surface)
- `color.background` (page background)

**Borders**:
- `border.default` (1px)
- `border.emphasis` (2px)
- `border.heavy` (4px)

**Shadows**:
- `shadow.sunrise` (subtle elevation)
- `shadow.noon` (medium elevation)
- `shadow.dusk` (prominent elevation)
- `shadow.midnight` (maximum elevation)

**Border Radius**:
- `radius050` (4px)
- `radius100` (8px)
- `radius150` (12px)
- `radius200` (16px)

### New Tokens Needed

**Component-Level Tokens** (Container/tokens.ts):

```typescript
export const containerVariants = {
  null: {},
  
  inset: {
    padding: 'space.inset.normal'
  },
  
  surface: {
    padding: 'space.inset.comfortable',
    background: 'color.surface'
  },
  
  elevated: {
    padding: 'space.inset.comfortable',
    background: 'color.surface',
    borderRadius: 'radius100',
    shadow: 'shadow.dusk'
  },
  
  outlined: {
    padding: 'space.inset.comfortable',
    background: 'color.surface',
    borderRadius: 'radius100',
    border: 'border.default'
  }
};
```

**These are component-level tokens** that reference semantic/primitive tokens. They define preset combinations, not new token values.

---

## Component API (Preliminary)

### TypeScript Interface

```typescript
// Core variants (the foundation)
type CoreVariant = 'null' | 'inset' | 'surface' | 'elevated' | 'outlined';

// Approved modifiers
type DensityModifier = 'tight' | 'loose';
type EmphasisModifier = 'subtle' | 'bold';
type StateModifier = 'active' | 'disabled' | 'hover';

// Approved semantic compounds (grows slowly over time)
type SemanticCompound = 'framed' | 'inset-bordered';

// Complete variant type (TypeScript enforces the convention)
type ContainerVariant = 
  | CoreVariant
  | `${CoreVariant}-${DensityModifier}`
  | `${CoreVariant}-${EmphasisModifier}`
  | `${CoreVariant}-${StateModifier}`
  | SemanticCompound;

interface ContainerProps {
  // Primary API: preset variants
  variant?: ContainerVariant;
  
  // Override props (optional)
  padding?: 'none' | 'tight' | 'normal' | 'comfortable' | 'spacious' | 'expansive' | 'generous';
  background?: 'none' | 'surface' | 'background';
  border?: 'none' | 'default' | 'emphasis' | 'heavy';
  borderRadius?: 'none' | 'subtle' | 'rounded' | 'large';
  shadow?: 'none' | 'sunrise' | 'noon' | 'dusk' | 'midnight';
  
  // Content
  children: ReactNode | View | Composable;
}
```

### Platform-Specific Extensions

**Web**:
```typescript
interface WebContainerProps extends ContainerProps {
  semantic?: 'div' | 'section' | 'article' | 'aside' | 'main' | 'fieldset';
  ariaLabel?: string;
}
```

**iOS**:
```swift
struct ContainerModifiers {
  var ignoresSafeArea: Bool = false
  var accessibilityLabel: String?
}
```

**Android**:
```kotlin
data class ContainerModifiers(
  val elevation: Dp? = null,  // Material elevation
  val contentDescription: String? = null
)
```

---

## Open Questions

### 1. Semantic HTML Handling (Web)

**Question**: Should Container handle semantic HTML concerns?

**Option A**: Container is purely presentational
```html
<section> <!-- Semantic HTML -->
  <dp-container variant="elevated"> <!-- Styling -->
    ...
  </dp-container>
</section>
```

**Option B**: Container handles semantics
```html
<dp-container variant="elevated" semantic="section">
  ...
</dp-container>
```

**Consideration**: Option A is cleaner for web, but iOS/Android don't have semantic HTML. This might be a platform-specific concern handled in web implementation.

### 2. Default Variant

**Question**: What should the default variant be if none is specified?

**Option A**: `null` (no styling)
- Pro: Explicit styling required
- Con: Verbose for common cases

**Option B**: `surface` (background + padding)
- Pro: Sensible default for most use cases
- Con: Implicit styling might be unexpected

**Option C**: Required prop (no default)
- Pro: Forces explicit decision
- Con: More verbose

### 3. Responsive Variants (Web)

**Question**: Should variants support responsive breakpoints?

```typescript
// Responsive variant syntax?
<Container variant={{ mobile: 'inset', tablet: 'surface', desktop: 'elevated' }}>
```

**Consideration**: This adds complexity but might be necessary for responsive design. Could be web-specific.

### 4. Cell Component Relationship

**Question**: How does Cell extend Container?

**Option A**: Cell is a separate component that uses Container internally
```typescript
<Cell> <!-- Wraps Container -->
  <Container variant="elevated">
    ...
  </Container>
</Cell>
```

**Option B**: Cell extends Container props
```typescript
<Cell variant="elevated" selectable swipeable>
  ...
</Cell>
```

**Consideration**: Need to explore Cell requirements before deciding.

---

## Design Decisions (To Be Formalized)

### Decision 1: Preset Variants + Override Props

**Options Considered**:
1. Preset variants only (opinionated, inflexible)
2. Individual props only (flexible, unmanageable)
3. Preset variants + override props (balanced)

**Decision**: Preset variants + override props

**Rationale**: 
- Preset variants handle 90% of cases with simple API
- Override props provide flexibility for edge cases
- Prevents variant explosion while maintaining flexibility

**Trade-offs**:
- ✅ Gained: Simple API for common cases, flexibility for edge cases
- ❌ Lost: Some API complexity from override props
- ⚠️ Risk: Developers might overuse override props instead of creating proper variants

### Decision 2: Systematic Naming Convention

**Options Considered**:
1. Free-form naming (flexible, chaotic)
2. Strict naming convention (structured, scalable)
3. Utility classes (composable, web-specific)

**Decision**: Systematic naming convention with governance

**Rationale**:
- Clear rules prevent naming chaos
- TypeScript enforces convention
- Design review prevents ad-hoc additions
- Scales to ~20 variants over time

**Trade-offs**:
- ✅ Gained: Predictable, manageable variant system
- ❌ Lost: Some flexibility in naming
- ⚠️ Risk: Governance process might slow down variant additions

---

## REVISED ARCHITECTURE (Final Direction)

### The Key Insight: Container as Primitive Capability Provider

**Container is a layout primitive that exposes styling capabilities for building semantic components.**

```
Layer 1: Container (Primitive)
  - Exposes capabilities (shadow, border, padding, background, radius, opacity, zIndex)
  - No design opinions or preset variants
  - Platform-agnostic API
  - Exported for advanced use (Option B)

Layer 2: Semantic Components (Card, Panel, Hero, etc.)
  - Use Container with specific prop combinations
  - Encode design decisions
  - Provide semantic meaning
  - Primary API for application developers

Layer 3: Application Code
  - Uses semantic components (Card, Panel, Hero)
  - Rarely uses Container directly (advanced cases only)
```

### Container's Job: Expose Capabilities

Container provides these styling capabilities through props:

**1. Padding (Inset Spacing)**
```typescript
padding?: 'none' | 'tight' | 'normal' | 'comfortable' | 'spacious' | 'expansive' | 'generous'
```
Maps to: `space.inset.*` tokens

**2. Background (Fill)**
```typescript
background?: 'none' | 'surface' | 'canvas' | 'gradient'
```
Maps to: `color.surface`, `color.background`, gradient tokens (TBD)

**3. Shadow (Elevation)**
```typescript
shadow?: 'none' | 'sunrise' | 'noon' | 'dusk' | 'midnight'
```
Maps to: `shadow.*` tokens

**4. Border (Outline)**
```typescript
border?: 'none' | 'default' | 'emphasis' | 'heavy'
```
Maps to: `border.*` tokens

**5. Border Radius**
```typescript
borderRadius?: 'none' | 'subtle' | 'rounded' | 'large'
```
Maps to: `radius050`, `radius100`, `radius150`, `radius200`

**6. Opacity**
```typescript
opacity?: 'none' | 'subtle' | 'medium' | 'heavy' | 'intense'
```
Maps to: `opacity.*` tokens

**7. Z-Index (Layering)**
```typescript
zIndex?: 'base' | 'dropdown' | 'sticky' | 'overlay' | 'modal' | 'popover' | 'tooltip'
```
Maps to: `zIndex.*` tokens

**Note**: Blend modes excluded - too specialized for core container capability.

### Semantic Components Leverage Container

```typescript
// Card component (semantic)
function Card({ children }) {
  return (
    <Container 
      padding="comfortable"
      background="surface"
      shadow="dusk"
      borderRadius="rounded"
    >
      {children}
    </Container>
  );
}

// Panel component (semantic)
function Panel({ children }) {
  return (
    <Container 
      padding="spacious"
      background="canvas"
      border="default"
      borderRadius="subtle"
    >
      {children}
    </Container>
  );
}

// Hero component (semantic)
function Hero({ children }) {
  return (
    <Container 
      padding="expansive"
      background="gradient"
      shadow="none"
    >
      {children}
    </Container>
  );
}
```

### Why This Architecture Works

**✅ Clear Separation of Concerns**
- Container = capabilities (what CAN be styled)
- Semantic components = design decisions (what SHOULD be styled)
- Application code = usage (what IS styled)

**✅ Maximum Flexibility**
- Semantic components can be redesigned without changing Container
- New semantic components can be created without modifying Container
- Container capabilities can be expanded without breaking semantic components

**✅ Aligns with Token System**
- Container props map directly to tokens
- No hard-coded values
- Mathematical relationships preserved

**✅ Platform-Agnostic**
- Container API works across web, iOS, Android
- Platform implementations handle native rendering
- Semantic components work everywhere

**✅ Exported for Advanced Use (Option B)**
- Semantic components use Container (primary use)
- Application developers CAN use Container for custom cases (escape hatch)
- Container is both building block and advanced tool

### Revised Container API

```typescript
interface ContainerProps {
  // Core styling capabilities (all optional)
  padding?: 'none' | 'tight' | 'normal' | 'comfortable' | 'spacious' | 'expansive' | 'generous';
  background?: 'none' | 'surface' | 'canvas' | 'gradient';
  shadow?: 'none' | 'sunrise' | 'noon' | 'dusk' | 'midnight';
  border?: 'none' | 'default' | 'emphasis' | 'heavy';
  borderRadius?: 'none' | 'subtle' | 'rounded' | 'large';
  
  // Layering capabilities (optional)
  opacity?: 'none' | 'subtle' | 'medium' | 'heavy' | 'intense';
  zIndex?: 'base' | 'dropdown' | 'sticky' | 'overlay' | 'modal' | 'popover' | 'tooltip';
  
  // Content
  children: ReactNode | View | Composable;
  
  // Platform-specific (optional)
  semantic?: 'div' | 'section' | 'article' | 'aside' | 'main';  // Web only
  accessibilityLabel?: string;  // iOS/Android
}
```

**No preset variants** - Container exposes capabilities, semantic components provide presets.

---

## Next Steps

1. **Create formal requirements document** with EARS format
2. **Define gradient token system** (needed for `background="gradient"`)
3. **Design platform-specific implementations** (web, iOS, Android)
4. **Build semantic component examples** (Card, Panel, Hero)
5. **Create validation strategy**
6. **Build HTML canary examples**

---

## Observations & Learnings

### Key Insights

1. **Container is a primitive capability provider** - Not a designed component with preset variants
2. **Semantic components encode design decisions** - Card, Panel, Hero use Container with specific props
3. **Two-layer architecture** - Primitives (Container) + Semantics (Card, Panel, Hero)
4. **Platform differences handled in implementations** - Container API is platform-agnostic
5. **Composition is powerful** - Separating capabilities from design enables flexibility

### Challenges Identified

1. **Gradient token system** - Need to define gradient tokens for `background="gradient"`
2. **Semantic HTML question** - How to handle web-specific semantic concerns (resolved: `semantic` prop)
3. **Platform-specific features** - Safe areas (iOS), Material elevation (Android), responsive design (web)
4. **Cell relationship** - Cell will likely extend Container with list-specific behaviors
5. **Documentation strategy** - Need to communicate that Container is advanced use, semantic components are primary

### Design Philosophy Alignment

This design aligns with DesignerPunk principles:
- ✅ **Compositional architecture**: Capabilities exposed separately, combined by semantic components
- ✅ **Token-based**: All styling references tokens, no hard-coded values
- ✅ **Mathematical consistency**: Tokens maintain mathematical relationships
- ✅ **Cross-platform**: True Native Architecture with platform-specific implementations
- ✅ **AI-friendly**: Clear capability props map to tokens, semantic components provide clear intent
- ✅ **Primitive → Semantic layering**: Container provides primitives, semantic components provide meaning

### Design Decisions Finalized

**Decision 1: Container as Primitive Capability Provider**

**Options Considered**:
1. Container with preset variants (elevated, outlined, surface)
2. Container with atomic composition (paddingNormal.elevationLow)
3. Container as primitive capability provider (individual props, no variants)

**Decision**: Container as primitive capability provider

**Rationale**:
- Container is a building block for semantic components, not a user-facing component
- Semantic components (Card, Panel, Hero) provide the "presets"
- Maximum flexibility for creating new semantic components
- Clear separation: primitives (Container) vs semantics (Card, Panel, Hero)

**Trade-offs**:
- ✅ Gained: Maximum flexibility, clear architecture, no variant explosion
- ❌ Lost: Convenience of preset variants in Container itself
- ⚠️ Risk: Application developers might misuse Container directly instead of semantic components

**Decision 2: Export Container for Advanced Use (Option B)**

**Options Considered**:
1. Container is internal (not exported) - only semantic components use it
2. Container is exported (advanced use) - semantic components use it, but available for custom cases

**Decision**: Export Container for advanced use (Option B)

**Rationale**:
- Semantic components are the primary API for application developers
- Container provides escape hatch for custom cases not covered by semantic components
- Transparency - developers can see how semantic components are built
- Flexibility - advanced users can create custom combinations

**Trade-offs**:
- ✅ Gained: Flexibility, transparency, escape hatch for edge cases
- ❌ Lost: Some API simplicity (two ways to achieve similar results)
- ⚠️ Risk: Developers might overuse Container instead of creating proper semantic components

**Decision 3: No Blend Modes in Container**

**Options Considered**:
1. Include blend modes as container capability
2. Exclude blend modes (too specialized)

**Decision**: Exclude blend modes

**Rationale**:
- Blend modes are too specialized for core container capability
- More likely needed for image overlays and special effects
- Can be added later if pattern emerges
- Keeps Container API focused on core layout capabilities

**Trade-offs**:
- ✅ Gained: Simpler API, focused capabilities
- ❌ Lost: Blend mode capability (can be added later if needed)

---

**Status**: Architecture finalized. Ready to create formal requirements document.
