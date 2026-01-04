---
inclusion: manual
---

# Responsive Tokens Guide

**Date**: December 30, 2025
**Last Reviewed**: 2025-12-30
**Purpose**: Complete reference for breakpoint and density tokens enabling responsive design across platforms
**Organization**: token-documentation
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, responsive-design, token-selection

---

## Overview

The DesignerPunk responsive token system provides two complementary token families for building adaptive interfaces:

1. **Breakpoint Tokens**: Define viewport width thresholds for responsive layout changes
2. **Density Tokens**: Provide selective scaling multipliers for functional tokens (spacing, typography, tap areas)

**Key Principles**:
- **Device-Based Breakpoints**: Practical viewport widths based on real device measurements
- **Selective Density Scaling**: Density affects functional tokens while preserving aesthetic tokens
- **Cross-Platform Consistency**: Tokens work across web, iOS, and Android with platform-appropriate units
- **Mathematical Foundation**: Density tokens use clear multiplier relationships from base value 1.0

---

## Breakpoint Tokens

### Overview

Breakpoint tokens define viewport width thresholds for responsive behavior. They are primarily used by web platforms for media queries and responsive grid systems, but also inform layout decisions on native platforms.

**Base Value**: 320px (smallest mobile viewport)

**Design Philosophy**: Values are practical device-based measurements rather than mathematical progressions, reflecting real-world device widths.

### Token Reference Table

| Token Name | Value | Unit | Description | Common Devices |
|------------|-------|------|-------------|----------------|
| `breakpointXs` | 320 | px/pt/dp | Small mobile viewport baseline | Small phones, compact mode |
| `breakpointSm` | 375 | px/pt/dp | iPhone standard width and large mobile | iPhone, standard Android phones |
| `breakpointMd` | 1024 | px/pt/dp | Desktop and tablet landscape transition | iPad landscape, small laptops |
| `breakpointLg` | 1440 | px/pt/dp | Large desktop and wide screen displays | Desktop monitors, large laptops |

### Token Details

#### breakpointXs (320px)

**Purpose**: Small mobile viewport baseline

**Use Cases**:
- Minimum supported viewport width
- Compact mobile layouts
- Single-column content layouts
- Mobile-first design starting point

**Design Considerations**:
- Content must be fully functional at this width
- Navigation typically collapses to hamburger menu
- Images and media scale to full width
- Typography remains readable without horizontal scrolling

#### breakpointSm (375px)

**Purpose**: iPhone standard width and large mobile devices

**Use Cases**:
- Standard mobile phone layouts
- Slightly more generous spacing than xs
- Two-column layouts for simple content
- Mobile navigation patterns

**Design Considerations**:
- Most common mobile viewport width
- Primary target for mobile-first designs
- Touch targets remain appropriately sized
- Content density can increase slightly from xs

#### breakpointMd (1024px)

**Purpose**: Desktop and tablet landscape transition point

**Use Cases**:
- Tablet landscape orientation
- Small desktop/laptop displays
- Multi-column layouts become practical
- Desktop navigation patterns

**Design Considerations**:
- Major layout transition point
- Navigation can expand to full horizontal
- Sidebars and multi-panel layouts become viable
- Mouse/keyboard interactions become primary

#### breakpointLg (1440px)

**Purpose**: Large desktop and wide screen displays

**Use Cases**:
- Full desktop experience
- Maximum content width containers
- Complex multi-column layouts
- Dashboard and data-dense interfaces

**Design Considerations**:
- Content should not stretch infinitely
- Consider maximum content width constraints
- Generous whitespace and spacing
- Full feature set available

### Why These Specific Values?

**320px (xs)**: Represents the smallest practical mobile viewport. Ensures designs work on older/smaller devices and compact display modes.

**375px (sm)**: iPhone standard width since iPhone 6. The most common mobile viewport width globally, making it the primary mobile design target.

**1024px (md)**: iPad landscape width and common small laptop resolution. Marks the transition from mobile to desktop interaction patterns.

**1440px (lg)**: Common desktop monitor width. Represents the "full desktop experience" where all features and layouts are available.

---

## Density Tokens

### Overview

Density tokens provide selective scaling multipliers for functional tokens while leaving aesthetic tokens unchanged. This enables UI density variations (compact, default, comfortable, spacious) without breaking visual harmony.

**Base Value**: 1.0 (no scaling applied)

**Design Philosophy**: Density scaling applies only to functional tokens (spacing, typography, tap areas) while aesthetic tokens (radius, line height ratios) remain constant.

### Token Reference Table

| Token Name | Value | Scaling Effect | Description |
|------------|-------|----------------|-------------|
| `densityCompact` | 0.75 | -25% | Reduces functional token values by 25% |
| `densityDefault` | 1.0 | 0% | No scaling applied (baseline) |
| `densityComfortable` | 1.25 | +25% | Increases functional token values by 25% |
| `densitySpacious` | 1.5 | +50% | Increases functional token values by 50% |

### Token Details

#### densityCompact (0.75)

**Purpose**: Compact density for information-dense interfaces

**Mathematical Relationship**: `base × 0.75 = 1.0 × 0.75 = 0.75`

**Use Cases**:
- Data tables and spreadsheet-like interfaces
- Power user interfaces with many controls
- Desktop applications where screen real estate is valuable
- Dashboards with multiple widgets

**Affected Tokens**:
- Spacing tokens: Reduced by 25%
- Font size tokens: Reduced by 25%
- Tap area tokens: Reduced by 25%

**Unaffected Tokens**:
- Radius tokens: Remain constant
- Line height ratios: Remain constant
- Border widths: Remain constant

**Accessibility Note**: Compact density may reduce touch target sizes below WCAG recommendations. Use primarily for mouse/keyboard interfaces.

#### densityDefault (1.0)

**Purpose**: Default density with no scaling applied

**Mathematical Relationship**: `base × 1.0 = 1.0 × 1.0 = 1.0`

**Use Cases**:
- Standard interface density
- Balanced content and whitespace
- General-purpose applications
- Mixed input method interfaces (touch + mouse)

**Design Considerations**:
- Baseline for all density calculations
- Meets accessibility requirements for touch targets
- Appropriate for most use cases
- No transformation applied to token values

#### densityComfortable (1.25)

**Purpose**: Comfortable density with increased spacing

**Mathematical Relationship**: `base × 1.25 = 1.0 × 1.25 = 1.25`

**Use Cases**:
- Touch-primary interfaces
- Accessibility-focused designs
- Content-focused reading experiences
- Interfaces for users with motor impairments

**Affected Tokens**:
- Spacing tokens: Increased by 25%
- Font size tokens: Increased by 25%
- Tap area tokens: Increased by 25%

**Accessibility Note**: Comfortable density exceeds minimum touch target requirements, improving usability for users with motor impairments.

#### densitySpacious (1.5)

**Purpose**: Spacious density for maximum breathing room

**Mathematical Relationship**: `base × 1.5 = 1.0 × 1.5 = 1.5`

**Use Cases**:
- Large display interfaces (TV, kiosk)
- Accessibility modes for vision impairments
- Presentation and demo modes
- Interfaces requiring large touch targets

**Affected Tokens**:
- Spacing tokens: Increased by 50%
- Font size tokens: Increased by 50%
- Tap area tokens: Increased by 50%

**Design Considerations**:
- Significantly reduces content density
- May require layout adjustments
- Excellent for accessibility
- Consider for large-screen experiences

### Selective Scaling Concept

Density tokens apply **selectively** to functional tokens while preserving aesthetic tokens:

**Functional Tokens (Scaled by Density)**:
- Spacing tokens (padding, margins, gaps)
- Font size tokens (text sizing)
- Tap area tokens (touch target dimensions)

**Aesthetic Tokens (NOT Scaled)**:
- Radius tokens (corner rounding)
- Line height ratios (typography proportions)
- Border widths (visual weight)
- Shadow tokens (elevation effects)

**Why Selective Scaling?**

Aesthetic tokens define visual character and should remain consistent regardless of density. A button's corner radius should look the same whether the interface is compact or spacious. Only the functional aspects (size, spacing) should scale.

```typescript
// Example: Density scaling function
function applyDensityScaling(
  tokenValue: number, 
  densityMultiplier: number, 
  tokenCategory: TokenCategory
): number {
  const functionalTokens = [
    TokenCategory.SPACING, 
    TokenCategory.FONT_SIZE, 
    TokenCategory.TAP_AREA
  ];
  
  if (functionalTokens.includes(tokenCategory)) {
    return tokenValue * densityMultiplier;
  }
  
  // Aesthetic tokens remain unchanged
  return tokenValue;
}
```

---

## Cross-Platform Usage

### Breakpoint Tokens

#### Web (CSS Custom Properties)

```css
:root {
  --breakpoint-xs: 320px;
  --breakpoint-sm: 375px;
  --breakpoint-md: 1024px;
  --breakpoint-lg: 1440px;
}

/* Media query usage */
@media (min-width: 320px) {
  /* xs and up styles */
}

@media (min-width: 375px) {
  /* sm and up styles */
}

@media (min-width: 1024px) {
  /* md and up styles */
}

@media (min-width: 1440px) {
  /* lg and up styles */
}

/* Container queries (modern approach) */
@container (min-width: 320px) {
  /* Component-level responsive styles */
}
```

#### iOS (Swift)

```swift
struct DesignTokens {
    struct Breakpoints {
        static let xs: CGFloat = 320
        static let sm: CGFloat = 375
        static let md: CGFloat = 1024
        static let lg: CGFloat = 1440
    }
}

// Usage with GeometryReader
struct ResponsiveView: View {
    var body: some View {
        GeometryReader { geometry in
            if geometry.size.width >= DesignTokens.Breakpoints.lg {
                LargeDesktopLayout()
            } else if geometry.size.width >= DesignTokens.Breakpoints.md {
                TabletLayout()
            } else if geometry.size.width >= DesignTokens.Breakpoints.sm {
                MobileLayout()
            } else {
                CompactMobileLayout()
            }
        }
    }
}
```

#### Android (Kotlin)

```kotlin
object DesignTokens {
    object Breakpoints {
        const val xs = 320  // dp
        const val sm = 375  // dp
        const val md = 1024 // dp
        const val lg = 1440 // dp
    }
}

// Usage with WindowSizeClass (Jetpack Compose)
@Composable
fun ResponsiveLayout(windowSizeClass: WindowSizeClass) {
    when {
        windowSizeClass.widthSizeClass == WindowWidthSizeClass.Expanded -> {
            LargeDesktopLayout()
        }
        windowSizeClass.widthSizeClass == WindowWidthSizeClass.Medium -> {
            TabletLayout()
        }
        else -> {
            MobileLayout()
        }
    }
}
```

### Density Tokens

#### Web (CSS Custom Properties)

```css
:root {
  --density-compact: 0.75;
  --density-default: 1.0;
  --density-comfortable: 1.25;
  --density-spacious: 1.5;
}

/* Apply density to spacing */
.container {
  --current-density: var(--density-default);
  padding: calc(var(--spacing-md) * var(--current-density));
  gap: calc(var(--spacing-sm) * var(--current-density));
}

/* Density variants */
.container--compact {
  --current-density: var(--density-compact);
}

.container--comfortable {
  --current-density: var(--density-comfortable);
}

.container--spacious {
  --current-density: var(--density-spacious);
}
```

#### iOS (Swift)

```swift
struct DesignTokens {
    struct Density {
        static let compact: CGFloat = 0.75
        static let `default`: CGFloat = 1.0
        static let comfortable: CGFloat = 1.25
        static let spacious: CGFloat = 1.5
    }
}

// Usage with environment value
struct DensityEnvironmentKey: EnvironmentKey {
    static let defaultValue: CGFloat = DesignTokens.Density.default
}

extension EnvironmentValues {
    var density: CGFloat {
        get { self[DensityEnvironmentKey.self] }
        set { self[DensityEnvironmentKey.self] = newValue }
    }
}

struct DensityAwareView: View {
    @Environment(\.density) var density
    
    var body: some View {
        VStack(spacing: DesignTokens.Spacing.md * density) {
            // Content with density-scaled spacing
        }
        .padding(DesignTokens.Spacing.lg * density)
    }
}
```

#### Android (Kotlin)

```kotlin
object DesignTokens {
    object Density {
        const val compact = 0.75f
        const val default = 1.0f
        const val comfortable = 1.25f
        const val spacious = 1.5f
    }
}

// Usage with CompositionLocal
val LocalDensity = compositionLocalOf { DesignTokens.Density.default }

@Composable
fun DensityAwareLayout(content: @Composable () -> Unit) {
    val density = LocalDensity.current
    
    Column(
        modifier = Modifier.padding(
            (DesignTokens.Spacing.lg * density).dp
        ),
        verticalArrangement = Arrangement.spacedBy(
            (DesignTokens.Spacing.md * density).dp
        )
    ) {
        content()
    }
}

// Provide density at app level
@Composable
fun App() {
    CompositionLocalProvider(
        LocalDensity provides DesignTokens.Density.comfortable
    ) {
        MainContent()
    }
}
```

---

## Responsive Design Patterns

### Mobile-First Approach

Start with the smallest breakpoint and progressively enhance:

```css
/* Base styles (xs and up) */
.component {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-sm);
}

/* sm and up */
@media (min-width: 375px) {
  .component {
    padding: var(--spacing-md);
  }
}

/* md and up */
@media (min-width: 1024px) {
  .component {
    flex-direction: row;
    padding: var(--spacing-lg);
  }
}

/* lg and up */
@media (min-width: 1440px) {
  .component {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Adaptive vs Responsive Strategies

**Responsive Design** (Fluid):
- Content flows and adapts within breakpoint ranges
- Uses relative units (%, rem, vw)
- Smooth transitions between sizes

**Adaptive Design** (Discrete):
- Distinct layouts at each breakpoint
- Uses fixed layouts optimized for each range
- Clear transitions at breakpoint boundaries

**Recommendation**: Use responsive design within breakpoint ranges, with adaptive layout changes at breakpoint boundaries.

### Density-Aware Components

Build components that respond to density context:

```typescript
// React example with density context
interface DensityContextValue {
  density: number;
  scaledSpacing: (baseValue: number) => number;
  scaledFontSize: (baseValue: number) => number;
}

const DensityContext = createContext<DensityContextValue>({
  density: 1.0,
  scaledSpacing: (v) => v,
  scaledFontSize: (v) => v,
});

function DensityProvider({ 
  density = 1.0, 
  children 
}: { 
  density?: number; 
  children: React.ReactNode 
}) {
  const value = useMemo(() => ({
    density,
    scaledSpacing: (baseValue: number) => baseValue * density,
    scaledFontSize: (baseValue: number) => baseValue * density,
  }), [density]);
  
  return (
    <DensityContext.Provider value={value}>
      {children}
    </DensityContext.Provider>
  );
}

// Usage in component
function Card({ children }: { children: React.ReactNode }) {
  const { scaledSpacing } = useContext(DensityContext);
  
  return (
    <div style={{ 
      padding: scaledSpacing(16),
      gap: scaledSpacing(8)
    }}>
      {children}
    </div>
  );
}
```

### Combining Breakpoints and Density

Breakpoints and density can work together for comprehensive responsive design:

```typescript
// Configuration combining both systems
const responsiveConfig = {
  // Breakpoint-based layout changes
  breakpoints: {
    xs: { columns: 1, sidebar: false },
    sm: { columns: 1, sidebar: false },
    md: { columns: 2, sidebar: true },
    lg: { columns: 3, sidebar: true },
  },
  
  // Density-based spacing/sizing
  density: {
    compact: 0.75,    // Data-dense interfaces
    default: 1.0,     // Standard interfaces
    comfortable: 1.25, // Touch-friendly
    spacious: 1.5,    // Accessibility mode
  }
};

// Apply both in component
function ResponsiveGrid({ density = 'default' }) {
  const breakpoint = useBreakpoint();
  const densityValue = responsiveConfig.density[density];
  const layoutConfig = responsiveConfig.breakpoints[breakpoint];
  
  return (
    <Grid 
      columns={layoutConfig.columns}
      gap={baseGap * densityValue}
    >
      {/* Content */}
    </Grid>
  );
}
```

---

## Accessibility Considerations

### Touch Target Sizing

Density scaling affects touch target sizes. Ensure accessibility compliance:

| Density | Scaling | 44pt Base Target | WCAG Compliance |
|---------|---------|------------------|-----------------|
| Compact | 0.75× | 33pt | ⚠️ Below minimum |
| Default | 1.0× | 44pt | ✅ Meets minimum |
| Comfortable | 1.25× | 55pt | ✅ Exceeds minimum |
| Spacious | 1.5× | 66pt | ✅ Exceeds minimum |

**Recommendation**: Use compact density only for mouse/keyboard interfaces. For touch interfaces, use default or higher density.

### Responsive Typography

Ensure text remains readable across breakpoints:

```css
/* Responsive font sizing */
html {
  font-size: 14px; /* xs */
}

@media (min-width: 375px) {
  html {
    font-size: 16px; /* sm - base */
  }
}

@media (min-width: 1024px) {
  html {
    font-size: 16px; /* md - maintain base */
  }
}

@media (min-width: 1440px) {
  html {
    font-size: 18px; /* lg - slightly larger */
  }
}
```

### Reduced Motion

Respect user preferences for reduced motion in responsive transitions:

```css
/* Smooth breakpoint transitions */
.responsive-element {
  transition: padding 200ms ease, gap 200ms ease;
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .responsive-element {
    transition: none;
  }
}
```

### High Contrast Mode

Ensure responsive layouts work in high contrast mode:

```css
@media (prefers-contrast: high) {
  /* Ensure borders and separators remain visible */
  .responsive-grid {
    border: 2px solid currentColor;
  }
}
```

---

## Usage Guidelines

### When to Use Breakpoint Tokens

Use breakpoint tokens for:
- Media query definitions
- Layout structure changes (columns, sidebars)
- Navigation pattern switches
- Content visibility changes

**Example**:
```typescript
// Layout changes at breakpoints
const layout = useBreakpoint({
  xs: { columns: 1, showSidebar: false },
  sm: { columns: 1, showSidebar: false },
  md: { columns: 2, showSidebar: true },
  lg: { columns: 3, showSidebar: true },
});
```

### When to Use Density Tokens

Use density tokens for:
- User preference settings (compact/comfortable modes)
- Accessibility accommodations
- Context-specific density (data tables vs content pages)
- Platform-specific defaults (desktop vs mobile)

**Example**:
```typescript
// Density based on user preference
const userDensity = useUserPreference('density'); // 'compact' | 'default' | 'comfortable' | 'spacious'
const densityValue = densityTokens[userDensity];

// Apply to functional tokens
const scaledPadding = basePadding * densityValue;
const scaledFontSize = baseFontSize * densityValue;
```

### AI Agent Token Selection Guidance

When implementing responsive design:

1. **Need layout changes at viewport widths?**
   → Use breakpoint tokens
   → xs (320), sm (375), md (1024), lg (1440)

2. **Need to scale spacing/typography uniformly?**
   → Use density tokens
   → compact (0.75), default (1.0), comfortable (1.25), spacious (1.5)

3. **Building data-dense interface?**
   → Consider `densityCompact` (0.75)
   → Only for mouse/keyboard interfaces

4. **Building touch-primary interface?**
   → Use `densityDefault` (1.0) or `densityComfortable` (1.25)
   → Ensures adequate touch targets

5. **Building accessibility mode?**
   → Use `densityComfortable` (1.25) or `densitySpacious` (1.5)
   → Larger targets and text

6. **Combining breakpoints and density?**
   → Breakpoints control layout structure
   → Density controls spacing/sizing within layouts
   → Both can be applied simultaneously

---

## Related Documentation

- **Breakpoint Token Source**: `src/tokens/BreakpointTokens.ts` - Breakpoint token definitions
- **Density Token Source**: `src/tokens/DensityTokens.ts` - Density token definitions
- **Token System Overview**: `docs/token-system-overview.md` - Complete token system reference
- **Spacing Tokens Guide**: `./Token-Family-Spacing.md` - Spacing tokens affected by density
- **Typography Tokens Guide**: `./Token-Family-Typography.md` - Typography tokens affected by density
- **Accessibility Tokens Guide**: `./Token-Family-Accessibility.md` - Tap area tokens affected by density
- **Component Development Guide**: `./Component-Development-Guide.md` - Token usage in component development

---

*This guide provides complete reference for responsive tokens enabling adaptive interfaces across platforms with breakpoint-based layouts and density-based scaling.*
