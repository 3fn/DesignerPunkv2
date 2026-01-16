---
inclusion: manual
---

# Spacing Tokens Guide

**Date**: 2025-11-26
**Last Reviewed**: 2025-12-30
**Purpose**: Complete reference for spacing tokens with numeric naming convention and mathematical relationships
**Organization**: token-documentation
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, token-selection

---

## Overview

The DesignerPunk spacing token system provides a mathematically consistent foundation for layout and component spacing across all platforms. Spacing tokens follow an 8-unit baseline grid with strategic flexibility exceptions, using numeric naming that exposes mathematical relationships.

**Key Principles**:
- **Numeric Naming**: Token names use numbers (050, 100, 150, etc.) that represent mathematical relationships
- **Mathematical Foundation**: All values derive from base unit (space100 = 8px) with clear multipliers
- **Baseline Grid Alignment**: Primary tokens align to 8px baseline grid for vertical rhythm
- **Strategic Flexibility**: Exceptions (space075, space125, space250) for component-level needs
- **Cross-Platform Consistency**: Unitless base values convert to platform-specific units

---

## Primitive Spacing Tokens

### Base Unit System

All spacing tokens derive from a base unit of **8px** (space100):

| Token Name | Value | Mathematical Relationship | Use Case |
|------------|-------|---------------------------|----------|
| `space050` | 4px | 0.5 × base (space100) | Minimal spacing, tight padding |
| `space075` | 6px | 0.75 × base (space100) | Strategic flexibility for components |
| `space100` | 8px | 1 × base (baseline unit) | Standard spacing unit |
| `space125` | 10px | 1.25 × base (space100) | Strategic flexibility for components |
| `space150` | 12px | 1.5 × base (space100) | Comfortable spacing |
| `space200` | 16px | 2 × base (space100) | Generous spacing |
| `space250` | 20px | 2.5 × base (space100) | Strategic flexibility for components |
| `space300` | 24px | 3 × base (space100) | Spacious layouts |
| `space400` | 32px | 4 × base (space100) | Maximum spacing |
| `space500` | 40px | 5 × base (space100) | Extra large spacing |
| `space600` | 48px | 6 × base (space100) | Section separation |
| `space800` | 64px | 8 × base (space100) | Major section breaks |
| `space1000` | 80px | 10 × base (space100) | Page-level spacing |

### Baseline Grid Alignment

**8px Baseline Grid**: Primary spacing tokens (050, 100, 150, 200, 300, 400, 500, 600, 800, 1000) align to the 8px baseline grid, ensuring consistent vertical rhythm across layouts.

**4px Subgrid**: space050 (4px) provides subgrid alignment for fine-tuned spacing needs while maintaining mathematical relationships.

**Strategic Flexibility Tokens**: space075 (6px), space125 (10px), and space250 (20px) are mathematically derived exceptions that don't align to the 8px grid but maintain clear relationships to the base unit.

### Why Numeric Naming?

Numeric token names expose mathematical relationships that enable:

**Proportion Reasoning**: Developers and AI agents can calculate relationships without memorization
- "space300 is 2× space150" is immediately clear
- "space200 is 2× space100" shows the doubling pattern
- "space075 is 0.75× space100" reveals the fractional relationship

**AI-Friendly Context**: Numeric names provide unambiguous mathematical context for AI collaboration
- No subjective interpretation needed
- Clear mathematical operations possible
- Consistent reasoning across all spacing decisions

**Scalability**: Adding new tokens maintains mathematical consistency
- New tokens follow the same multiplier pattern
- Relationships remain clear as system grows
- No arbitrary naming decisions required

---

## Semantic Spacing Tokens

Semantic spacing tokens provide contextual meaning for specific layout patterns. They reference primitive spacing tokens and are organized by use case.

### Inset Spacing (Internal Padding)

Inset spacing tokens define internal spacing (padding) within containers and components. These tokens use **numeric names** that expose mathematical relationships.

**Token Structure**: `space.inset.{number}`

| Token Name | Primitive Reference | Value | Mathematical Relationship | Use Case |
|------------|---------------------|-------|---------------------------|----------|
| `space.inset.050` | space050 | 4px | 0.5 × base (space100) | Minimal internal spacing - compact chips, dense toolbars, tight buttons |
| `space.inset.100` | space100 | 8px | 1 × base (space100) | Compact internal spacing - small buttons, compact cards, dense forms |
| `space.inset.150` | space150 | 12px | 1.5 × base (space100) | Standard internal spacing - standard buttons, cards, form inputs |
| `space.inset.200` | space200 | 16px | 2 × base (space100) | Comfortable internal spacing - large buttons, comfortable cards, readable content |
| `space.inset.300` | space300 | 24px | 3 × base (space100) | Spacious internal spacing - hero sections, emphasized content, feature callouts |
| `space.inset.400` | space400 | 32px | 4 × base (space100) | Maximum internal spacing - landing page heroes, maximum emphasis areas |

**Component Prop Values**: When using inset tokens in component props, add the "inset" prefix for clarity:
- `padding="inset050"` → resolves to `space.inset.050` → 4px
- `padding="inset150"` → resolves to `space.inset.150` → 12px
- `padding="inset300"` → resolves to `space.inset.300` → 24px

**Why "inset" prefix in props?**
- Provides context for AI agents (clearly indicates inset padding token)
- Self-documenting code (value explains what it represents)
- Prevents confusion with other numeric values
- Consistent with token path (space.inset.150 → padding="inset150")

### Layout Spacing (Element Relationships)

Layout spacing tokens define spacing between elements based on their semantic relationship. These tokens use **density modifiers** (tight, normal, loose) that work well with the two-level semantic structure.

**Why different naming for layout vs inset?**
- Layout tokens describe relationships between elements (grouped, related, separated)
- Density modifiers (tight, normal, loose) are relative to that relationship context
- Inset tokens describe absolute padding values (numeric names are more appropriate)

#### Grouped Spacing (Tightly Related Elements)

Elements that form a cohesive unit (form fields in a group, list items, navigation links).

| Token Name | Primitive Reference | Value | Density | Use Case |
|------------|---------------------|-------|---------|----------|
| `space.grouped.minimal` | space050 | 4px | Tight | Minimal separation - compact lists, dense navigation |
| `space.grouped.tight` | space075 | 6px | Tight | Tight grouping - form field groups, compact menus |
| `space.grouped.normal` | space100 | 8px | Normal | Standard grouping - default list spacing, form groups |
| `space.grouped.loose` | space150 | 12px | Loose | Loose grouping - comfortable lists, relaxed forms |

#### Related Spacing (Contextually Connected Elements)

Elements that share context but aren't tightly grouped (related cards, sidebar sections, content blocks).

| Token Name | Primitive Reference | Value | Density | Use Case |
|------------|---------------------|-------|---------|----------|
| `space.related.tight` | space150 | 12px | Tight | Tight relationship - compact card grids, dense sidebars |
| `space.related.normal` | space200 | 16px | Normal | Standard relationship - default card spacing, content blocks |
| `space.related.loose` | space300 | 24px | Loose | Loose relationship - comfortable card grids, relaxed layouts |

#### Separated Spacing (Distinct but Related Elements)

Elements that are distinct but share a common context (page sections, major content areas).

| Token Name | Primitive Reference | Value | Density | Use Case |
|------------|---------------------|-------|---------|----------|
| `space.separated.tight` | space300 | 24px | Tight | Tight separation - compact sections, dense pages |
| `space.separated.normal` | space400 | 32px | Normal | Standard separation - default section spacing |
| `space.separated.loose` | space600 | 48px | Loose | Loose separation - generous section spacing, breathing room |

#### Sectioned Spacing (Major Page Divisions)

Major divisions between distinct page sections or content areas.

| Token Name | Primitive Reference | Value | Density | Use Case |
|------------|---------------------|-------|---------|----------|
| `space.sectioned.tight` | space600 | 48px | Tight | Tight sectioning - compact page divisions |
| `space.sectioned.normal` | space800 | 64px | Normal | Standard sectioning - default major divisions |
| `space.sectioned.loose` | space1000 | 80px | Loose | Loose sectioning - generous page divisions, maximum breathing room |

---

## Mathematical Relationships

### Base Multiplier Pattern

All spacing tokens follow a clear multiplier pattern from the base unit (space100 = 8px):

```
space050 = space100 × 0.5  = 4px
space075 = space100 × 0.75 = 6px   (strategic flexibility)
space100 = space100 × 1    = 8px   (base unit)
space125 = space100 × 1.25 = 10px  (strategic flexibility)
space150 = space100 × 1.5  = 12px
space200 = space100 × 2    = 16px
space250 = space100 × 2.5  = 20px  (strategic flexibility)
space300 = space100 × 3    = 24px
space400 = space100 × 4    = 32px
space500 = space100 × 5    = 40px
space600 = space100 × 6    = 48px
space800 = space100 × 8    = 64px
space1000 = space100 × 10  = 80px
```

### Doubling Pattern

Many tokens follow a doubling pattern for easy mental calculation:

```
space050 (4px)  → space100 (8px)   → 2× increase
space100 (8px)  → space200 (16px)  → 2× increase
space200 (16px) → space400 (32px)  → 2× increase
space400 (32px) → space800 (64px)  → 2× increase
```

### Proportional Relationships

Tokens maintain clear proportional relationships:

```
space300 = 2 × space150 = 3 × space100
space600 = 2 × space300 = 3 × space200
space150 = 1.5 × space100 = 3 × space050
```

---

## Cross-Platform Usage

### Unitless Base Values

Spacing tokens use unitless base values that convert to platform-specific units:

**Base Value**: 8 (unitless)

**Platform Conversion**:
- **Web**: 8px
- **iOS**: 8pt
- **Android**: 8dp

### Platform-Specific Output

#### Web (CSS Custom Properties)

```css
:root {
  /* Primitive Spacing Tokens */
  --space-050: 4px;
  --space-100: 8px;
  --space-150: 12px;
  --space-200: 16px;
  --space-300: 24px;
  --space-400: 32px;
  
  /* Semantic Inset Spacing */
  --space-inset-050: var(--space-050);
  --space-inset-100: var(--space-100);
  --space-inset-150: var(--space-150);
  --space-inset-200: var(--space-200);
  --space-inset-300: var(--space-300);
  --space-inset-400: var(--space-400);
  
  /* Semantic Layout Spacing */
  --space-grouped-normal: var(--space-100);
  --space-related-normal: var(--space-200);
  --space-separated-normal: var(--space-400);
}
```

#### iOS (Swift)

```swift
struct DesignTokens {
    // Primitive Spacing Tokens
    static let space050: CGFloat = 4
    static let space100: CGFloat = 8
    static let space150: CGFloat = 12
    static let space200: CGFloat = 16
    static let space300: CGFloat = 24
    static let space400: CGFloat = 32
    
    // Semantic Inset Spacing
    static let spaceInset050 = space050
    static let spaceInset100 = space100
    static let spaceInset150 = space150
    static let spaceInset200 = space200
    static let spaceInset300 = space300
    static let spaceInset400 = space400
    
    // Semantic Layout Spacing
    static let spaceGroupedNormal = space100
    static let spaceRelatedNormal = space200
    static let spaceSeparatedNormal = space400
}
```

#### Android (Kotlin)

```kotlin
object DesignTokens {
    // Primitive Spacing Tokens
    val space_050 = 4.dp
    val space_100 = 8.dp
    val space_150 = 12.dp
    val space_200 = 16.dp
    val space_300 = 24.dp
    val space_400 = 32.dp
    
    // Semantic Inset Spacing
    val space_inset_050 = space_050
    val space_inset_100 = space_100
    val space_inset_150 = space_150
    val space_inset_200 = space_200
    val space_inset_300 = space_300
    val space_inset_400 = space_400
    
    // Semantic Layout Spacing
    val space_grouped_normal = space_100
    val space_related_normal = space_200
    val space_separated_normal = space_400
}
```

---

## Usage Guidelines

### When to Use Primitive Tokens

Use primitive spacing tokens when:
- No semantic token exists for your use case
- Building component-level tokens that reference primitives
- Creating new semantic spacing patterns

**Example**:
```typescript
// Component-level token referencing primitive
export const buttonTokens = {
  paddingX: 'space150',  // Reference primitive directly
  paddingY: 'space100'
};
```

### When to Use Semantic Tokens

Use semantic spacing tokens for:
- Layout spacing between elements (grouped, related, separated, sectioned)
- Component internal padding (inset tokens)
- Standard spacing patterns in UI development

**Example**:
```typescript
// Layout using semantic tokens
<Stack spacing="space.grouped.normal">  {/* 8px between grouped items */}
  <FormField />
  <FormField />
</Stack>

// Component using inset token
<Button padding="inset150">  {/* 12px internal padding */}
  Submit
</Button>
```

### Strategic Flexibility Tokens

Use strategic flexibility tokens (space075, space125, space250) when:
- Component-level spacing needs don't align to 8px grid
- Fine-tuning visual balance requires off-grid values
- Mathematical relationships are more important than grid alignment

**Example**:
```typescript
// Component token using strategic flexibility
export const chipTokens = {
  paddingX: 'space125',  // 10px - strategic flexibility for compact chips
  paddingY: 'space075'   // 6px - strategic flexibility for tight vertical spacing
};
```

**Important**: Strategic flexibility tokens should be used appropriately (≥80% of usage should be justified by component-level needs). Overuse indicates the baseline grid may need adjustment.

---

## Grid Spacing Tokens

Grid spacing tokens define gutter and margin values for responsive grid layouts. These semantic tokens reference primitive spacing tokens for consistency with the 8px baseline grid.

### Overview

Grid spacing serves two primary purposes:
- **Grid Gutter**: Spacing between grid columns
- **Grid Margin**: Container margins at page edges

**Platform Strategy**:
- **Web**: Uses breakpoint-specific tokens (Xs/Sm/Md/Lg) for responsive grid systems
- **Native (iOS/Android)**: Uses dedicated native tokens for consistent adaptive layouts

### Web Grid Gutter Tokens

Grid gutter tokens define spacing between columns at different breakpoints. Values scale with layout complexity to maintain visual hierarchy.

| Token Name | Primitive Reference | Value | Breakpoint | Column Count | Use Case |
|------------|---------------------|-------|------------|--------------|----------|
| `gridGutterXs` | space200 | 16px | xs | 4 columns | Compact gutter for mobile layouts with limited screen space |
| `gridGutterSm` | space250 | 20px | sm | 8 columns | Standard gutter for large mobile and small tablet layouts |
| `gridGutterMd` | space300 | 24px | md | 12 columns | Comfortable gutter for desktop and tablet layouts |
| `gridGutterLg` | space400 | 32px | lg | 16 columns | Generous gutter for large desktop and wide screen layouts |

**Scaling Pattern**: Grid gutter increases with column count to prevent visual crowding as layout complexity grows.

### Web Grid Margin Tokens

Grid margin tokens define container margins at page edges for different breakpoints.

| Token Name | Primitive Reference | Value | Breakpoint | Use Case |
|------------|---------------------|-------|------------|----------|
| `gridMarginXs` | space300 | 24px | xs | Compact container margins for mobile layouts |
| `gridMarginSm` | space300 | 24px | sm | Standard container margins for large mobile layouts |
| `gridMarginMd` | space400 | 32px | md | Comfortable container margins for desktop layouts |
| `gridMarginLg` | space500 | 40px | lg | Generous container margins for large desktop layouts |

**Note**: `gridMarginSm` currently references `space300` (24px). The design specification calls for `space350` (28px), but this token doesn't exist in the primitive spacing scale yet.

### Native Platform Grid Tokens

Native platforms (iOS, Android) use dedicated grid tokens that reference Sm-level values for consistent adaptive layouts.

| Token Name | Primitive Reference | Value | Platform | Use Case |
|------------|---------------------|-------|----------|----------|
| `gridGutterNative` | space250 | 20px | iOS, Android | Standard gutter spacing for native adaptive layouts |
| `gridMarginNative` | space300 | 24px | iOS, Android | Standard container margins for native adaptive layouts |

**Why Sm-level values?**: Native platforms use adaptive layouts rather than responsive breakpoints. Sm-level values provide a balanced default that works well across device sizes.

### Grid Spacing Patterns

#### Responsive Grid Layout (Web)

```css
/* CSS Grid with responsive gutters and margins */
.grid-container {
  display: grid;
  padding-left: var(--grid-margin-xs);
  padding-right: var(--grid-margin-xs);
  gap: var(--grid-gutter-xs);
  grid-template-columns: repeat(4, 1fr);
}

@media (min-width: 600px) {
  .grid-container {
    padding-left: var(--grid-margin-sm);
    padding-right: var(--grid-margin-sm);
    gap: var(--grid-gutter-sm);
    grid-template-columns: repeat(8, 1fr);
  }
}

@media (min-width: 900px) {
  .grid-container {
    padding-left: var(--grid-margin-md);
    padding-right: var(--grid-margin-md);
    gap: var(--grid-gutter-md);
    grid-template-columns: repeat(12, 1fr);
  }
}

@media (min-width: 1200px) {
  .grid-container {
    padding-left: var(--grid-margin-lg);
    padding-right: var(--grid-margin-lg);
    gap: var(--grid-gutter-lg);
    grid-template-columns: repeat(16, 1fr);
  }
}
```

#### Native Adaptive Layout (iOS)

```swift
struct GridContainer: View {
    var body: some View {
        LazyVGrid(
            columns: adaptiveColumns,
            spacing: DesignTokens.gridGutterNative
        ) {
            // Grid content
        }
        .padding(.horizontal, DesignTokens.gridMarginNative)
    }
    
    private var adaptiveColumns: [GridItem] {
        [GridItem(.adaptive(minimum: 150, maximum: 300))]
    }
}
```

#### Native Adaptive Layout (Android)

```kotlin
@Composable
fun GridContainer(content: @Composable () -> Unit) {
    LazyVerticalGrid(
        columns = GridCells.Adaptive(minSize = 150.dp),
        contentPadding = PaddingValues(horizontal = DesignTokens.gridMarginNative),
        horizontalArrangement = Arrangement.spacedBy(DesignTokens.gridGutterNative),
        verticalArrangement = Arrangement.spacedBy(DesignTokens.gridGutterNative)
    ) {
        // Grid content
    }
}
```

### Grid Spacing Mathematical Relationships

Grid spacing tokens maintain clear relationships with the primitive spacing scale:

```
Grid Gutter Progression:
gridGutterXs (16px) = space200 = 2 × space100
gridGutterSm (20px) = space250 = 2.5 × space100
gridGutterMd (24px) = space300 = 3 × space100
gridGutterLg (32px) = space400 = 4 × space100

Grid Margin Progression:
gridMarginXs (24px) = space300 = 3 × space100
gridMarginSm (24px) = space300 = 3 × space100
gridMarginMd (32px) = space400 = 4 × space100
gridMarginLg (40px) = space500 = 5 × space100
```

**Pattern**: Both gutter and margin values increase by approximately 1× base unit per breakpoint level, maintaining proportional relationships as layouts scale.

### When to Use Grid Spacing Tokens

**Use grid spacing tokens when**:
- Building responsive grid layouts with consistent column spacing
- Defining container margins that scale with viewport size
- Creating adaptive layouts for native platforms

**Use other spacing tokens when**:
- Spacing within components (use inset tokens)
- Spacing between related elements (use layout spacing tokens)
- Custom spacing needs outside grid context (use primitive tokens)

---

## Migration from Old Names

If you're migrating from the old subjective naming convention, see the [Inset Token Renaming Migration Guide](../../.kiro/specs/011-inset-token-renaming/migration-guide.md) for complete mapping tables and migration instructions.

**Quick Reference**:
- `tight` → `050` (token name) / `inset050` (prop value)
- `normal` → `100` (token name) / `inset100` (prop value)
- `comfortable` → `150` (token name) / `inset150` (prop value)
- `spacious` → `200` (token name) / `inset200` (prop value)
- `expansive` → `300` (token name) / `inset300` (prop value)
- `generous` → `400` (token name) / `inset400` (prop value)

---

## Related Documentation

- **Spacing Token Source**: `src/tokens/SpacingTokens.ts` - Primitive spacing token definitions
- **Semantic Spacing Source**: `src/tokens/semantic/SpacingTokens.ts` - Semantic spacing token definitions
- **Grid Spacing Source**: `src/tokens/semantic/GridSpacingTokens.ts` - Grid spacing semantic token definitions
- **Token System Overview**: `docs/token-system-overview.md` - Complete token system reference
- **Inset Token Renaming Spec**: `.kiro/specs/011-inset-token-renaming/design.md` - Design decisions for numeric naming
- **Migration Guide**: `.kiro/specs/011-inset-token-renaming/migration-guide.md` - Migration from old to new names
- **Mathematical Token System**: `.kiro/specs/mathematical-token-system/design.md` - Mathematical foundations
- **Component Development Guide**: `./Component-Development-Guide.md` - Token usage in component development
- **Token Resolution Patterns**: `./Token-Resolution-Patterns.md` - Strategic guidance on token type selection and validation

---

*This guide provides complete reference for spacing tokens with numeric naming convention and mathematical relationships that enable proportion reasoning and AI-human collaboration.*
