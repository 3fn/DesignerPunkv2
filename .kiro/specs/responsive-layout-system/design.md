# Design Document: Responsive Layout System

**Date**: November 6, 2025
**Spec**: responsive-layout-system
**Status**: Design Phase
**Dependencies**: None (extends existing spacing token system)

---

## Overview

The Responsive Layout System introduces breakpoint tokens and grid spacing tokens that enable systematic responsive design while maintaining universal content-driven component behavior. The system provides web platforms with responsive grid enhancement capabilities while ensuring all platforms benefit from consistent mathematical spacing relationships.

The design leverages the existing mathematical token architecture and generator system, extending it with practical breakpoint values and responsive grid spacing tokens that scale appropriately with layout complexity.

---

## Architecture

### Token Architecture Overview

The system introduces two new token categories that integrate seamlessly with the existing mathematical token foundation:

```
Responsive Layout Token Architecture
    ↓
├── Breakpoint Tokens (Primitive)
│   ├── breakpointXs: 320px
│   ├── breakpointSm: 375px
│   ├── breakpointMd: 1024px
│   └── breakpointLg: 1440px
│
└── Grid Spacing Tokens (Semantic)
    ├── gridGutterXs: space200 (16px)
    ├── gridGutterSm: space250 (20px)
    ├── gridGutterMd: space300 (24px)
    ├── gridGutterLg: space400 (32px)
    ├── gridMarginXs: space300 (24px)
    ├── gridMarginSm: space350 (28px)
    ├── gridMarginMd: space400 (32px)
    └── gridMarginLg: space500 (40px)
```

### Cross-Platform Implementation Strategy

The system uses a **universal content-driven foundation** with **web-specific enhancement**:

#### **Universal Mathematical Foundation with Platform-Specific Syntax**

All platforms use the same mathematical constraints, expressed through platform-native syntax:

**Web (Lit Web Components + CSS)**:
```css
/* CSS custom properties for content-driven component sizing */
.text-input {
  min-width: var(--space-800);  /* 256px - existing spacing token */
  max-width: var(--space-1200); /* 384px - existing spacing token */
  width: 100%; /* Adapts within constraints */
}
```

```typescript
// Lit Web Component using CSS custom properties
@customElement('text-input')
export class TextInput extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-width: var(--space-800);
      max-width: var(--space-1200);
      width: 100%;
    }
  `;
}
```

**iOS (SwiftUI)**:
```swift
// Same mathematical constraints, platform-native syntax
TextField("Label", text: $text)
    .frame(minWidth: space800, maxWidth: space1200)
```

**Android (Compose)**:
```kotlin
// Same mathematical constraints, platform-native syntax
TextField(
    value = text,
    onValueChange = { text = it },
    modifier = Modifier.widthIn(min = space800.dp, max = space1200.dp)
)
```

**Key Principle**: Mathematical relationships are universal, implementation syntax is platform-specific (True Native Architecture). Web uses CSS custom properties with Lit Web Components, not React/JSX.

#### **Web-Specific Grid Enhancement**
```css
/* Web only - additional responsive grid layer */
.grid-container {
  --grid-columns: 4;
  --grid-gutter: var(--grid-gutter-xs); /* 16px */
  --grid-margin: var(--grid-margin-xs); /* 24px */
  
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  gap: var(--grid-gutter);
  margin-inline: var(--grid-margin);
}

@media (min-width: 375px) {
  .grid-container {
    --grid-columns: 8;
    --grid-gutter: var(--grid-gutter-sm); /* 20px */
    --grid-margin: var(--grid-margin-sm); /* 28px */
  }
}
```

#### **Native Platform Usage**

Native platforms use dedicated native grid spacing tokens (not all 8 web tokens):

**iOS (SwiftUI)**:
```swift
// iOS - uses native grid spacing tokens
LazyVGrid(columns: [
    GridItem(.adaptive(minimum: 160), spacing: gridGutterNative) // 20px
]) {
    // Content-driven adaptive behavior
}
.padding(.horizontal, gridMarginNative) // 28px
```

**Android (Compose)**:
```kotlin
// Android - uses native grid spacing tokens
LazyVerticalGrid(
    columns = GridCells.Adaptive(minSize = 160.dp),
    verticalArrangement = Arrangement.spacedBy(gridGutterNative.dp),
    horizontalArrangement = Arrangement.spacedBy(gridGutterNative.dp),
    contentPadding = PaddingValues(gridMarginNative.dp)
) {
    // Content-driven adaptive behavior
}
```

### Semantic Grid Tokens vs Semantic Spacing Tokens

A critical distinction for both human developers and AI agents:

#### **Semantic Grid Tokens** (Page-Level Layout)
- **Purpose**: Horizontal positioning and spacing at the page/screen layout level
- **Usage**: Spacing between page-level elements, container margins at page edges
- **Examples**: 
  - Cards laid out openly on a page (use `gridGutterMd` between cards)
  - Page container margins (use `gridMarginMd` for page edges)
  - Grid-based page layouts with multiple content sections

#### **Semantic Spacing Tokens** (Component-Level Layout)
- **Purpose**: Spacing within components or grouped component collections
- **Usage**: Internal component padding, spacing between elements within components
- **Examples**:
  - Padding inside a card (use `insetMd`)
  - Cards within a carousel container (use `stackMd` between carousel items)
  - Spacing between form elements (use `stackSm`)

#### **Token Selection Decision Framework**

For AI agents and developers to make systematic token choices:

**Question 1**: Is this spacing between page-level elements laid out horizontally?
- **YES** → Use grid tokens (`gridGutterXs/Sm/Md/Lg`, `gridMarginXs/Sm/Md/Lg`)
- **NO** → Go to Question 2

**Question 2**: Is this spacing within a component or grouped component collection?
- **YES** → Use spacing tokens (`stackXs/Sm/Md/Lg`, `insetXs/Sm/Md/Lg`, `inlineXs/Sm/Md/Lg`)

**Edge Case - Grouped Component Collections**:
When multiple components are grouped within a container (carousel, tabs, accordion):
- Use **spacing tokens** (not grid tokens)
- **Rationale**: The container creates a component-level context, not page-level layout
- **Example**: Cards in carousel use `stackMd`, not `gridGutterMd`

#### **Validation Rules**

Rules that AI agents and linters can enforce:

```typescript
// Rule 1: Grid tokens should only be used in page-level contexts
if (tokenName.startsWith('grid') && context !== 'page-layout') {
  warning('Grid tokens are intended for page-level layout. Consider using spacing tokens for component-level spacing.');
}

// Rule 2: Spacing tokens should not be used for page-level grid layouts
if (tokenName.match(/^(stack|inset|inline)/) && context === 'page-grid-layout') {
  warning('Spacing tokens are intended for component-level spacing. Consider using grid tokens for page-level layouts.');
}
```

---

## Components and Interfaces

### Breakpoint Token Definitions

Breakpoint tokens follow primitive token patterns with practical device-based values:

```typescript
/**
 * Breakpoint primitive tokens for responsive behavior
 * Primarily used by web platforms for media queries and responsive grid systems
 */
export const breakpointTokens: Record<string, PrimitiveToken> = {
  breakpointXs: {
    name: 'breakpointXs',
    category: TokenCategory.BREAKPOINT,
    baseValue: 320,
    familyBaseValue: 320,
    description: 'Small mobile viewport baseline',
    mathematicalRelationship: 'Practical device-based value',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { value: 320, unit: 'px' },
      ios: { value: 320, unit: 'pt' },
      android: { value: 320, unit: 'dp' }
    }
  },

  breakpointSm: {
    name: 'breakpointSm',
    category: TokenCategory.BREAKPOINT,
    baseValue: 375,
    familyBaseValue: 320,
    description: 'iPhone standard width and large mobile',
    mathematicalRelationship: 'Practical device-based value',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { value: 375, unit: 'px' },
      ios: { value: 375, unit: 'pt' },
      android: { value: 375, unit: 'dp' }
    }
  },

  breakpointMd: {
    name: 'breakpointMd',
    category: TokenCategory.BREAKPOINT,
    baseValue: 1024,
    familyBaseValue: 320,
    description: 'Desktop and tablet landscape transition',
    mathematicalRelationship: 'Practical device-based value',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { value: 1024, unit: 'px' },
      ios: { value: 1024, unit: 'pt' },
      android: { value: 1024, unit: 'dp' }
    }
  },

  breakpointLg: {
    name: 'breakpointLg',
    category: TokenCategory.BREAKPOINT,
    baseValue: 1440,
    familyBaseValue: 320,
    description: 'Large desktop and wide screen displays',
    mathematicalRelationship: 'Practical device-based value',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { value: 1440, unit: 'px' },
      ios: { value: 1440, unit: 'pt' },
      android: { value: 1440, unit: 'dp' }
    }
  }
};
```

### Grid Spacing Token Definitions

Grid spacing tokens follow semantic token patterns and reference existing spacing tokens:

```typescript
/**
 * Grid spacing semantic tokens for responsive layout spacing
 * Reference existing mathematical spacing tokens for consistency
 */
export const gridSpacingTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'gridGutterXs': {
    name: 'gridGutterXs',
    primitiveReferences: {
      spacing: 'space200' // 16px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid gutter spacing for 4-column layouts (xs breakpoint)',
    description: 'Compact gutter spacing for mobile layouts with limited screen space'
  },

  'gridGutterSm': {
    name: 'gridGutterSm',
    primitiveReferences: {
      spacing: 'space250' // 20px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid gutter spacing for 8-column layouts (sm breakpoint)',
    description: 'Standard gutter spacing for large mobile and small tablet layouts'
  },

  'gridGutterMd': {
    name: 'gridGutterMd',
    primitiveReferences: {
      spacing: 'space300' // 24px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid gutter spacing for 12-column layouts (md breakpoint)',
    description: 'Comfortable gutter spacing for desktop and tablet layouts'
  },

  'gridGutterLg': {
    name: 'gridGutterLg',
    primitiveReferences: {
      spacing: 'space400' // 32px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid gutter spacing for 16-column layouts (lg breakpoint)',
    description: 'Generous gutter spacing for large desktop and wide screen layouts'
  },

  'gridMarginXs': {
    name: 'gridMarginXs',
    primitiveReferences: {
      spacing: 'space300' // 24px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid container margin for xs breakpoint layouts',
    description: 'Compact container margins for mobile layouts'
  },

  'gridMarginSm': {
    name: 'gridMarginSm',
    primitiveReferences: {
      spacing: 'space350' // 28px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid container margin for sm breakpoint layouts',
    description: 'Standard container margins for large mobile layouts'
  },

  'gridMarginMd': {
    name: 'gridMarginMd',
    primitiveReferences: {
      spacing: 'space400' // 32px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid container margin for md breakpoint layouts',
    description: 'Comfortable container margins for desktop layouts'
  },

  'gridMarginLg': {
    name: 'gridMarginLg',
    primitiveReferences: {
      spacing: 'space500' // 40px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid container margin for lg breakpoint layouts',
    description: 'Generous container margins for large desktop layouts'
  },

  // Native platform grid spacing tokens (reference Sm-level values)
  'gridGutterNative': {
    name: 'gridGutterNative',
    primitiveReferences: {
      spacing: 'space250' // 20px - references Sm value
    },
    category: SemanticCategory.SPACING,
    context: 'Grid gutter spacing for native platforms (iOS, Android)',
    description: 'Standard gutter spacing for native adaptive layouts, equivalent to Sm-level web spacing'
  },

  'gridMarginNative': {
    name: 'gridMarginNative',
    primitiveReferences: {
      spacing: 'space350' // 28px - references Sm value
    },
    category: SemanticCategory.SPACING,
    context: 'Grid container margin for native platforms (iOS, Android)',
    description: 'Standard container margins for native adaptive layouts, equivalent to Sm-level web spacing'
  }
};
```

---

## Data Models

### Token Category Extension

The system extends the existing TokenCategory enum to include breakpoint tokens:

```typescript
export enum TokenCategory {
  // Existing categories
  SPACING = 'spacing',
  FONT_SIZE = 'fontSize',
  COLOR = 'color',
  // ... other existing categories
  
  // New category
  BREAKPOINT = 'breakpoint'
}
```

### Responsive Grid Configuration

Web-specific responsive grid configuration that uses the token system:

```typescript
interface ResponsiveGridConfig {
  breakpoint: string;     // References breakpoint token
  columns: number;        // Progressive column count
  gutter: string;         // References grid gutter token
  margin: string;         // References grid margin token
}

const responsiveGridConfigs: ResponsiveGridConfig[] = [
  {
    breakpoint: 'breakpointXs',
    columns: 4,
    gutter: 'gridGutterXs',
    margin: 'gridMarginXs'
  },
  {
    breakpoint: 'breakpointSm',
    columns: 8,
    gutter: 'gridGutterSm',
    margin: 'gridMarginSm'
  },
  {
    breakpoint: 'breakpointMd',
    columns: 12,
    gutter: 'gridGutterMd',
    margin: 'gridMarginMd'
  },
  {
    breakpoint: 'breakpointLg',
    columns: 16,
    gutter: 'gridGutterLg',
    margin: 'gridMarginLg'
  }
];
```

### Cross-Platform Output Models

Platform-specific output formats for the new tokens:

```typescript
// Web CSS Custom Properties
interface WebGridOutput {
  '--breakpoint-xs': '320px';
  '--breakpoint-sm': '375px';
  '--breakpoint-md': '1024px';
  '--breakpoint-lg': '1440px';
  '--grid-gutter-xs': '16px';
  '--grid-gutter-sm': '20px';
  '--grid-gutter-md': '24px';
  '--grid-gutter-lg': '32px';
  '--grid-margin-xs': '24px';
  '--grid-margin-sm': '28px';
  '--grid-margin-md': '32px';
  '--grid-margin-lg': '40px';
}

// iOS Swift Constants
interface iOSGridOutput {
  static let breakpointXs: CGFloat = 320;
  static let breakpointSm: CGFloat = 375;
  static let breakpointMd: CGFloat = 1024;
  static let breakpointLg: CGFloat = 1440;
  static let gridGutterXs: CGFloat = 16;
  static let gridGutterSm: CGFloat = 20;
  static let gridGutterMd: CGFloat = 24;
  static let gridGutterLg: CGFloat = 32;
  static let gridMarginXs: CGFloat = 24;
  static let gridMarginSm: CGFloat = 28;
  static let gridMarginMd: CGFloat = 32;
  static let gridMarginLg: CGFloat = 40;
}

// Android Kotlin Constants
interface AndroidGridOutput {
  val breakpointXs = 320.dp;
  val breakpointSm = 375.dp;
  val breakpointMd = 1024.dp;
  val breakpointLg = 1440.dp;
  val gridGutterXs = 16.dp;
  val gridGutterSm = 20.dp;
  val gridGutterMd = 24.dp;
  val gridGutterLg = 32.dp;
  val gridMarginXs = 24.dp;
  val gridMarginSm = 28.dp;
  val gridMarginMd = 32.dp;
  val gridMarginLg = 40.dp;
}
```

---

## Design Decisions

### Decision 1: Practical Breakpoint Values vs Mathematical Progression

**Options Considered**:
1. **Mathematical progression** - 320px → 480px → 720px → 1080px (1.5x scale)
2. **Industry standard progression** - 320px → 640px → 1024px → 1440px (doubling pattern)
3. **Device-based practical values** - 320px → 375px → 1024px → 1440px (CHOSEN)

**Decision**: Device-based practical values

**Rationale**: 
Breakpoint tokens serve as interface points with real-world device constraints and industry standards. Unlike spacing or typography tokens that benefit from mathematical relationships, breakpoint values must align with actual device categoy widths and user expectations.

The 375px breakpoint aligns with iPhone standard width, while 1024px and 1440px represent natural tablet and desktop transition points. Mathematical purity would force awkward breakpoints (368px instead of 375px) that fight against established design tool and device conventions.

**Trade-offs**:
- ✅ **Gained**: Alignment with device reality, design tool compatibility, industry standards
- ❌ **Lost**: Perfect mathematical consistency with 8px baseline grid
- ⚠️ **Risk**: Slight inconsistency with mathematical token philosophy

**Counter-Arguments**:
- **Argument**: "All tokens should follow mathematical relationships for system consistency"
- **Response**: Breakpoint tokens are interface tokens that must align with external constraints (device widths, browser behavior, design tools). Mathematical consistency is valuable for internal system tokens (spacing, typography) but counterproductive for interface tokens that must work with external systems.

### Decision 2: Grid Spacing Scales with Layout Complexity

**Options Considered**:
1. **Fixed spacing across all breakpoints** - Same gutter/margin values regardless of column count
2. **Linear scaling** - Spacing increases proportionally with screen size
3. **Complexity-based scaling** - Spacing increases with column count to prevent visual crowding (CHOSEN)

**Decision**: Complexity-based scaling

**Rationale**:
Visual hierarchy and readability require more spacing as layout complexity increases. A 16-column layout with 16px gutters would feel cramped and difficult to scan, while a 4-column layout with 32px gutters would waste valuable mobile screen space.

The scaling pattern (16px → 20px → 24px → 32px) provides appropriate visual breathing room that matches the cognitive load of each layout complexity level.

**Trade-offs**:
- ✅ **Gained**: Appropriate visual hierarchy, improved readability, optimal space usage per breakpoint
- ❌ **Lost**: Simplicity of fixed spacing values
- ⚠️ **Risk**: More complex token system with more values to maintain

**Counter-Arguments**:
- **Argument**: "Fixed spacing would be simpler and more predictable"
- **Response**: Simplicity that produces poor user experience is not valuable. The complexity is managed through systematic token references to existing spacing values, maintaining mathematical consistency while optimizing for visual hierarchy.

### Decision 3: Semantic Grid Tokens Reference Existing Spacing Tokens

**Options Considered**:
1. **New primitive spacing tokens** - Create grid-specific primitive tokens
2. **Direct pixel values** - Hard-code spacing values in grid tokens
3. **Reference existing spacing tokens** - Grid tokens reference existing mathematical spacing tokens (CHOSEN)

**Decision**: Reference existing spacing tokens

**Rationale**:
Grid spacing tokens serve semantic purposes (compact vs comfortable layouts) but should maintain mathematical consistency with the existing token system. Referencing existing spacing tokens ensures that grid spacing follows the same 8px baseline grid and mathematical relationships as all other spacing in the system.

This approach also leverages the existing token validation, generation, and cross-platform systems without requiring duplicate infrastructure.

**Trade-offs**:
- ✅ **Gained**: Mathematical consistency, system integration, reduced maintenance
- ❌ **Lost**: Grid-specific optimization flexibility
- ⚠️ **Risk**: Dependency on existing spacing token availability

**Counter-Arguments**:
- **Argument**: "Grid spacing has unique requirements that might need custom values"
- **Response**: The existing spacing token system provides sufficient granularity (space200, space250, space300, etc.) to meet grid spacing needs. If unique requirements emerge, they can be addressed by adding new primitive spacing tokens that benefit the entire system, not just grids.

### Decision 4: Web-Specific Implementation with Universal Token Availability

**Options Considered**:
1. **Web-only token generation** - Only generate breakpoint tokens for web platforms
2. **Platform-specific token sets** - Different tokens for each platform
3. **Universal availability with web-focused usage** - Generate tokens for all platforms but optimize for web usage (CHOSEN)

**Decision**: Universal availability with web-focused usage

**Rationale**:
Following the foundation-first approach, breakpoint tokens should be available across all platforms even though primarily used by web. This enables future platform expansion (MacOS window resizing, large tablet responsive behavior) without architectural changes.

Native platforms can access breakpoint values for edge cases or future responsive features while primarily relying on their platform-native adaptive systems.

**Trade-offs**:
- ✅ **Gained**: Future flexibility, architectural consistency, foundation-first approach
- ❌ **Lost**: Platform-specific optimization
- ⚠️ **Risk**: Unused tokens on native platforms

**Counter-Arguments**:
- **Argument**: "Generating unused tokens for native platforms is wasteful"
- **Response**: The token generation overhead is minimal, and the architectural flexibility gained is valuable. Native platforms may find uses for breakpoint values in edge cases, and future platform expansion is enabled without system changes.

---

## Error Handling

### Invalid Breakpoint References

**Scenario**: Component or CSS references a breakpoint token that doesn't exist

**Handling**:
- Validation during token generation should verify all breakpoint references exist
- Throw descriptive error: "Invalid breakpoint reference 'breakpointXl' - available breakpoints: xs, sm, md, lg"
- Provide suggestion for closest valid breakpoint

### Grid Spacing Token Validation

**Scenario**: Grid spacing token references a spacing token that doesn't exist

**Handling**:
- Validate that all primitive spacing token references exist during semantic token generation
- Throw descriptive error: "Grid spacing token 'gridGutterXs' references invalid spacing token 'space999'"
- Provide suggestion: "Valid spacing tokens: space200, space250, space300, space400, space500"

### Cross-Platform Generation Failures

**Scenario**: Platform-specific generation fails for breakpoint or grid spacing tokens

**Handling**:
- Catch generation errors and provide context
- Log warning with token name and platform: "Failed to generate gridGutterMd for iOS: Invalid spacing reference"
- Fall back to base values where possible
- Document platform-specific requirements and limitations

---

## Testing Strategy

### Unit Testing

**Breakpoint Token Validation**:
- Verify all breakpoint tokens have required properties
- Verify breakpoint values are practical whole numbers
- Verify naming follows t-shirt sizing conventions
- Verify cross-platform generation produces correct units

**Grid Spacing Token Validation**:
- Verify all grid spacing tokens reference existing spacing tokens
- Verify naming aligns with corresponding breakpoint tokens
- Verify semantic token structure follows existing patterns
- Verify scaling progression (xs < sm < md < lg)

**Token Integration Validation**:
- Verify integration with existing token generator system
- Verify tokens follow existing primitive and semantic token standards
- Verify mathematical validation applies appropriate tiers
- Verify cross-platform generation maintains consistency

### Integration Testing

**Web Responsive Grid System**:
- Test CSS custom property generation for all breakpoint and grid spacing tokens
- Verify media query integration with breakpoint tokens
- Test progressive column count behavior (4→8→12→16)
- Verify grid spacing scales appropriately with layout complexity

**Cross-Platform Token Generation**:
- Generate tokens for web, iOS, and Android platforms
- Verify breakpoint tokens produce appropriate units (px, pt, dp)
- Verify grid spacing tokens maintain mathematical relationships across platforms
- Test native platform usage of Sm-level grid spacing tokens

**Component Integration Testing**:
- Test content-driven component behavior with mathematical constraints
- Verify web components work within responsive grid constraints
- Test component-level sizing token patterns
- Verify elevation of component tokens to semantic tokens when patterns emerge

### Documentation Testing

**Component Development Guidance**:
- Verify guidance documentation covers mathematical min/max width constraints
- Test component sizing examples with existing spacing tokens
- Verify web-specific responsive grid usage patterns
- Test cross-platform layout consistency guidelines

**Token Usage Documentation**:
- Verify breakpoint token usage examples for web platforms
- Test grid spacing token usage across different layout complexities
- Verify native platform usage of Sm-level spacing tokens
- Test component-level token creation and elevation patterns

---

## Integration Points

### Component-Level Sizing Token Guidance

Components should use existing spacing tokens for mathematical min/max constraints. When patterns emerge across multiple components, component-level tokens can be elevated to semantic tokens.

#### **Component Sizing Approach**

**Start with existing spacing tokens**:
```typescript
// Component uses existing spacing tokens directly
<TextInput 
  minWidth={space800}   // 256px
  maxWidth={space1200}  // 384px
/>
```

**Create component-level tokens when needed**:
```typescript
// Component-level tokens for specialized variants
textInputMinWidth: space800,        // Standard text inputs
textInputMaxWidth: space1200,
phoneInputMinWidth: space600,       // Phone number inputs
phoneInputMaxWidth: space800,
emailInputMinWidth: space1000,      // Email inputs
emailInputMaxWidth: space1600,
```

**Elevate to semantic tokens when patterns emerge**:
```typescript
// If pattern emerges across multiple components
inputWidthStandard: space800,      // Discovered pattern
inputWidthNarrow: space600,        // Discovered pattern
inputWidthWide: space1200,         // Discovered pattern
```

**Decision Framework**:
1. **Start**: Use existing spacing tokens directly
2. **Component-level**: Create component-specific tokens when variants are needed
3. **Semantic**: Elevate to semantic tokens when pattern is used across 3+ components

### Existing Token System Integration

**Token Generator Integration**:
- Breakpoint tokens integrate with existing primitive token generation system (no new generator required)
- Grid spacing tokens integrate with existing semantic token generation system
- Cross-platform generation leverages existing platform-specific formatters (WebBuilder, iOSBuilder, AndroidBuilder)
- Validation system applies existing three-tier validation approach
- Token registration follows existing registry patterns (PrimitiveTokenRegistry, SemanticTokenRegistry)

**Mathematical Token System Integration**:
- Grid spacing tokens reference existing mathematical spacing tokens (space200, space250, space300, space400, space500)
- Maintains 8px baseline grid consistency through spacing token references
- Follows existing token naming and structure conventions (category.name pattern)
- Integrates with existing token validation and quality systems
- Cross-reference documentation links to existing spacing token definitions

**File Organization and Documentation Standards**:
- Token files follow existing organization patterns in `src/tokens/` directory
- Completion documentation uses spec-completion organization metadata
- Cross-reference links connect grid tokens to referenced spacing tokens
- Documentation follows existing token documentation patterns

### Web Platform Integration

**CSS Custom Properties Integration**:
- Breakpoint tokens generate CSS custom properties for media queries
- Grid spacing tokens generate CSS custom properties for grid systems
- Integration with existing CSS generation and optimization systems
- Support for existing CSS-in-JS and styled-components patterns

**Responsive Grid System Integration**:
- Progressive column count system (4→8→12→16) aligns with breakpoint tokens
- Grid spacing scales appropriately using grid spacing tokens
- CSS Grid and Flexbox implementation using token-generated custom properties
- Integration with existing component and layout systems

### Native Platform Integration

**iOS Platform Integration**:
- Breakpoint tokens available for future responsive features
- Grid spacing tokens (Sm-level) used for consistent spacing in adaptive layouts
- Integration with SwiftUI LazyVGrid and adaptive layout systems
- Support for iOS-specific layout patterns and size classes

**Android Platform Integration**:
- Breakpoint tokens available for configuration change handling
- Grid spacing tokens (Sm-level) used for consistent spacing in Compose layouts
- Integration with Jetpack Compose LazyVerticalGrid and adaptive systems
- Support for Android-specific density and configuration patterns

### Component Development Integration

**Content-Driven Component Behavior**:
- Components use existing spacing tokens for mathematical min/max constraints
- Web components work within responsive grid constraints while maintaining content-driven behavior
- Native components use Sm-level grid spacing tokens for consistent spacing
- Support for component-level sizing tokens and elevation to semantic tokens

**Cross-Platform Component Consistency**:
- Same mathematical relationships expressed through platform-appropriate patterns
- Universal content-driven behavior with web-specific grid enhancement
- Consistent spacing and sizing across all platforms using shared token foundation
- Support for platform-specific optimizations while maintaining system consistency

---

## Deliverables Summary

### Code Deliverables

1. **Breakpoint Primitive Tokens** (4 tokens)
   - `breakpointXs: 320`, `breakpointSm: 375`, `breakpointMd: 1024`, `breakpointLg: 1440`
   - File: `src/tokens/BreakpointTokens.ts`
   - Integration with existing primitive token generator

2. **Web Grid Spacing Semantic Tokens** (8 tokens)
   - `gridGutterXs/Sm/Md/Lg` (16px, 20px, 24px, 32px)
   - `gridMarginXs/Sm/Md/Lg` (24px, 28px, 32px, 40px)
   - File: `src/tokens/semantic/GridSpacingTokens.ts`
   - References existing spacing tokens (space200, space250, space300, space400, space500)

3. **Native Grid Spacing Semantic Tokens** (2 tokens)
   - `gridGutterNative: space250` (20px - Sm equivalent)
   - `gridMarginNative: space350` (28px - Sm equivalent)
   - File: `src/tokens/semantic/GridSpacingTokens.ts`
   - Used by iOS and Android for consistent page-level spacing

4. **Web Responsive Grid CSS System**
   - CSS custom properties for breakpoints and grid spacing
   - Media queries for responsive behavior
   - Progressive column count system (4→8→12→16)
   - Integration with existing CSS generation

5. **Token Generator Integration**
   - Extend existing generator to handle BREAKPOINT category
   - Integrate with existing platform-specific builders
   - Cross-platform generation for all new tokens

### Documentation Deliverables

6. **Semantic Grid vs Semantic Spacing Distinction**
   - Decision framework for token selection
   - Page-level vs component-level usage guidance
   - Edge case documentation (carousel pattern, grouped collections)
   - Validation rules for correct token usage

7. **Platform-Specific Component Sizing Syntax**
   - Web (React) syntax examples
   - iOS (SwiftUI) syntax examples
   - Android (Compose) syntax examples
   - True Native Architecture principles applied

8. **Component-Level Sizing Token Guidance**
   - When to use existing spacing tokens directly
   - When to create component-level tokens
   - When to elevate component tokens to semantic tokens
   - Pattern discovery and elevation criteria

9. **Web Responsive Grid Usage Patterns**
   - CSS custom property usage examples
   - Media query integration patterns
   - Progressive column count examples
   - Grid spacing scaling guidance

10. **Cross-Reference Documentation**
    - Links to existing spacing token definitions
    - Links to existing token generator documentation
    - Links to True Native Architecture principles
    - Links to existing validation and testing patterns

---

*This design document establishes a comprehensive responsive layout system that maintains mathematical consistency while supporting platform-appropriate layout paradigms and universal content-driven component behavior.*