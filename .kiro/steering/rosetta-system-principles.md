---
inclusion: manual
---

# Rosetta System Principles

**Date**: 2026-01-03
**Purpose**: Foundational principles and governance for systematic token development across platforms
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: token-development, architecture, spec-planning
**Last Reviewed**: 2026-01-03

---

## Overview

The Rosetta System establishes foundational principles and architecture governing token relationships, mathematical foundations, and cross-platform consistency across web, iOS, and Android platforms. It complements the Stemma System (relational component foundation) with mathematical token foundation.

**Rosetta + Stemma Integration**:
- **Rosetta System**: Mathematical relationships and token hierarchy (how things look and scale)
- **Stemma System**: Family relationships and component hierarchy (how things behave and relate)
- **Together**: Complete design system foundation covering both visual consistency (Rosetta) and behavioral consistency (Stemma)

---

## Core Principles

### Principle 1: Primitive→Semantic Hierarchy

Tokens are organized into a two-tier hierarchy with clear inheritance patterns:

```
Primitive Tokens (Mathematical Foundation)
├── Base-level tokens with mathematical relationships
│   └── fontSize, spacing, colors, radius, etc.
│   └── Named with numeric suffixes (space100, fontSize200)
│   └── Provide raw values for composition
└── Semantic Tokens (Purpose-Driven Compositions)
    └── Compose primitives for specific use cases
    └── Named with descriptive purposes (bodyMd, color.primary)
    └── Reference primitives by name, not value
```

**Key Rules**:
1. Semantic tokens MUST reference primitives by name (not resolved values)
2. Primitives provide mathematical foundation; semantics provide meaning
3. Cross-platform generation preserves primitive references
4. AI agents should prefer semantic tokens over primitives

### Principle 2: Mathematical Foundation

All tokens derive from mathematical relationships ensuring systematic, predictable design:

**8px Baseline Grid**:
```
Base Unit = 8px
All spacing values = Base Unit × Multiplier

spaceN = 8px × (N/100)
Where N is the token number (050, 100, 150, etc.)
```

**1.125 Modular Scale (Musical Fourth)**:
```
Base Font Size = 1rem (16px)
Scale Ratio = 1.125

fontSizeN = 1rem × 1.125^(step)
Where step is the position in the modular scale progression
```

**Mathematical Validation**:
- Spacing: Must align to 4px minimum increment (8px baseline with strategic flexibility)
- Typography: Must follow 1.125 modular scale within 5% tolerance
- Proportions: Must maintain documented ratios within 25% tolerance

### Principle 3: Cross-Platform Consistency

Token values work uniformly across web, iOS, and Android:

**Consistency Model**:
```
┌─────────────────────────────────────────────────────────┐
│                  Token Definition                        │
│              (Identical across platforms)                │
├─────────────────┬─────────────────┬─────────────────────┤
│   Web (CSS)     │  iOS (Swift)    │ Android (Kotlin)    │
│   Custom Props  │  Extensions     │ Extensions          │
│   (px, rem)     │  (pt, CGFloat)  │ (dp)                │
└─────────────────┴─────────────────┴─────────────────────┘
```

**Cross-Platform Unit Relationships**:
| Platform | Unit | Relationship |
|----------|------|--------------|
| Web | px/rem | 1rem = 16px (browser default) |
| iOS | pt | 1pt = 1-3px (density dependent) |
| Android | dp | 1dp = 1-4px (density dependent) |

**Consistency Rules**:
1. Same token names across all platforms (with platform-appropriate casing)
2. Same mathematical relationships preserved
3. Platform-appropriate unit conversions applied automatically
4. Visual consistency despite different measurement systems

### Principle 4: Strategic Flexibility

Mathematical foundation allows documented exceptions for design requirements:

**Strategic Flexibility Tokens**:
- `space075` (6px) = 8px × 0.75 - Fine-grained flexibility
- `space125` (10px) = 8px × 1.25 - Component flexibility
- `space250` (20px) = 8px × 2.5 - Large flexibility

**Flexibility Rules**:
1. Exceptions MUST maintain 4px minimum increment compliance
2. Exceptions MUST be documented with mathematical justification
3. Exceptions provide intermediate values between baseline increments
4. Exceptions enable visual balance without breaking mathematical foundation

---

## Token Family Architecture

### The Token Families

| Family | Purpose | Primitive Examples | Semantic Examples |
|--------|---------|-------------------|-------------------|
| **Spacing** | Layout and positioning | space100, space200 | space.grouped.*, space.inset.* |
| **Typography** | Text styling | fontSize100, lineHeight150 | bodyMd, labelSm, h1 |
| **Color** | Visual identity | purple300, gray500 | color.primary, color.error |
| **Radius** | Shape definition | radius100, radius200 | radius.button, radius.card |
| **Shadow** | Depth and elevation | shadowBlur200, shadowOpacity300 | shadow.container, shadow.modal |
| **Glow** | Emphasis effects | glowBlur200, glowOpacity100 | glow.focus, glow.highlight |
| **Opacity** | Transparency | opacity050, opacity080 | opacity.disabled, opacity.hover |
| **Blend** | Color modification | blend100, blend200 | blend.hoverDarker, blend.focusSaturate |
| **Border** | Edge definition | borderWidth100, borderWidth200 | border.input, border.focus |
| **Motion** | Animation timing | duration250, easingStandard | motion.floatLabel |
| **Layering** | Stacking order | - | zIndex.modal, elevation.card |
| **Accessibility** | WCAG compliance | tapArea44, tapArea48 | accessibility.touchTarget |

### Primitive Token Structure

Every primitive token follows this structure:

```typescript
interface PrimitiveToken {
  // Identity
  name: string;           // Token name (e.g., "space100")
  value: number | string; // Raw value (e.g., 8)
  unit: string;           // Unit type (e.g., "px", "rem", "unitless")
  
  // Mathematical Foundation
  baseValue: number;      // Base unit (e.g., 8 for spacing)
  multiplier: number;     // Scale multiplier (e.g., 1.0 for space100)
  formula: string;        // Mathematical formula (e.g., "8 × 1.0")
  
  // Metadata
  category: string;       // Token category (e.g., "spacing")
  description: string;    // Human-readable description
}
```

### Semantic Token Structure

Every semantic token follows this structure:

```typescript
interface SemanticToken {
  // Identity
  name: string;                    // Token name (e.g., "bodyMd")
  category: string;                // Token category (e.g., "typography")
  context: string;                 // Usage context (e.g., "body text")
  description: string;             // Human-readable description
  
  // Primitive References (by name, not value)
  primitiveReferences: string[];   // Referenced primitives (e.g., ["fontSize100", "lineHeight150"])
  
  // Optional Composition
  composition?: {                  // For multi-property tokens
    [property: string]: string;    // Property → primitive name mapping
  };
  
  // Platform Support
  platforms: string[];             // Supported platforms ["web", "ios", "android"]
}
```

---

## Naming Convention Governance

### Primitive Token Naming

**Pattern**: `[category][scale]`

| Segment | Purpose | Format | Examples |
|---------|---------|--------|----------|
| **Category** | Groups tokens by type | camelCase noun | `space`, `fontSize`, `radius` |
| **Scale** | Indicates position in scale | 3-digit number | `050`, `100`, `200`, `300` |

**Scale Numbering System**:
```
050 = 0.5× base (half)
075 = 0.75× base (strategic flexibility)
100 = 1.0× base (standard)
125 = 1.25× base (strategic flexibility)
150 = 1.5× base
200 = 2.0× base
...
```

**Examples**:
- `space100` = 8px (1.0 × 8px base)
- `fontSize200` = 20px (1.125² × 16px base)
- `radius050` = 4px (0.5 × 8px base)

### Semantic Token Naming

**Pattern**: `[category].[context].[variant]` or `[purpose][Size]`

| Pattern | When to Use | Examples |
|---------|-------------|----------|
| `[category].[context]` | Categorical tokens | `color.primary`, `shadow.container` |
| `[category].[context].[variant]` | Tokens with variants | `space.grouped.tight`, `space.inset.normal` |
| `[purpose][Size]` | Typography tokens | `bodyMd`, `labelSm`, `h1` |

**Examples**:
- `color.primary` - Primary brand color
- `space.grouped.tight` - Tight spacing for grouped elements
- `bodyMd` - Medium body text style
- `shadow.modal` - Shadow for modal overlays

### Platform-Specific Naming Conventions

| Platform | Convention | Prefix | Example |
|----------|-----------|--------|---------|
| Web | kebab-case | `--` | `--font-size-100` |
| iOS | camelCase | none | `fontSize100` |
| Android | snake_case | none | `font_size_100` |

### Naming Validation Rules

**Rule 1: Primitive Pattern Compliance**
```
VALID:   space100, fontSize200, radius050
INVALID: spacing100 (wrong category name)
INVALID: space-100 (wrong separator)
INVALID: Space100 (wrong case)
```

**Rule 2: Semantic Pattern Compliance**
```
VALID:   color.primary, space.grouped.tight, bodyMd
INVALID: colorPrimary (missing dot separator for categorical)
INVALID: body-md (wrong separator for typography)
```

**Rule 3: Scale Number Format**
```
VALID:   050, 075, 100, 125, 150, 200, 300, 400, 500, 600
INVALID: 50, 75, 1, 10 (wrong digit count)
INVALID: 110, 190 (non-standard scale position)
```

---

## Mathematical Relationships

### Spacing Mathematics

**8px Baseline Grid**:
```
Base Unit = 8px
General Formula: spaceN = 8px × (N/100)

Standard Progression:
space050 = 8px × 0.5 = 4px
space100 = 8px × 1.0 = 8px
space150 = 8px × 1.5 = 12px
space200 = 8px × 2.0 = 16px
space300 = 8px × 3.0 = 24px
space400 = 8px × 4.0 = 32px

Strategic Flexibility:
space075 = 8px × 0.75 = 6px
space125 = 8px × 1.25 = 10px
space250 = 8px × 2.5 = 20px
```

### Typography Mathematics

**1.125 Modular Scale**:
```
Base Font Size = 16px (1rem)
Scale Ratio = 1.125 (musical fourth)

Progression:
fontSize050 = 16px × (1/1.125)² ≈ 13px
fontSize075 = 16px × (1/1.125) ≈ 14px
fontSize100 = 16px × 1.0 = 16px (base)
fontSize125 = 16px × 1.125 = 18px
fontSize150 = 16px × 1.125² ≈ 20px
fontSize200 = 16px × 1.125³ ≈ 23px
fontSize300 = 16px × 1.125⁵ ≈ 29px
```

**Line Height Relationships**:
```
Optimal Ratios by Font Size:
- Small text (12-14px): 1.25-1.333
- Body text (16-18px): 1.5-1.556
- Large text (20px+): 1.125-1.405
```

### Radius Mathematics

**8px Baseline Alignment**:
```
Base Unit = 8px
General Formula: radiusN = 8px × (N/100)

Progression:
radius025 = 8px × 0.25 = 2px
radius050 = 8px × 0.5 = 4px
radius075 = 8px × 0.75 = 6px (strategic flexibility)
radius100 = 8px × 1.0 = 8px
radius150 = 8px × 1.5 = 12px
radius200 = 8px × 2.0 = 16px
radiusFull = 9999px (pill shape)
```

### Validation Tolerances

**Three-Tier Validation System**:
| Tier | Deviation | Status |
|------|-----------|--------|
| Pass | ≤ 5% | Strict compliance |
| Warning | 5-25% | Acceptable flexibility |
| Error | > 25% | Significant violation |

---

## Cross-Token Relationships

### Token Dependencies

Semantic tokens depend on primitives through documented relationships:

```
Typography Token Dependencies:
bodyMd
├── fontSize: fontSize100 (16px)
├── lineHeight: lineHeight150 (1.5)
├── fontFamily: fontFamilyBody
├── fontWeight: fontWeight400
└── letterSpacing: letterSpacingNormal

Shadow Token Dependencies:
shadow.container
├── offsetX: shadowOffsetMorning.x
├── offsetY: shadowOffsetMorning.y
├── blur: shadowBlur200
├── opacity: shadowOpacity200
└── color: shadowBlack100
```

### Cross-Family Relationships

Some tokens have relationships across families:

| Relationship | Description | Example |
|--------------|-------------|---------|
| **Typography ↔ Spacing** | Line height affects vertical rhythm | lineHeight150 aligns to 8px grid |
| **Color ↔ Opacity** | Transparency modifies colors | color.primary + opacity.hover |
| **Shadow ↔ Layering** | Elevation implies shadow depth | elevation.card → shadow.container |
| **Blend ↔ Color** | Blend modifies base colors | darkerBlend(color.primary, blend.hoverDarker) |

### Composition Patterns

**Typography Composition**:
```typescript
const bodyMd = {
  fontSize: 'fontSize100',      // 16px
  lineHeight: 'lineHeight150',  // 1.5
  fontFamily: 'fontFamilyBody', // system-ui
  fontWeight: 'fontWeight400',  // 400
  letterSpacing: 'letterSpacingNormal' // 0
};
```

**Shadow Composition**:
```typescript
const shadowContainer = {
  offsetX: 'shadowOffsetMorning.x',  // 2px
  offsetY: 'shadowOffsetMorning.y',  // 4px
  blur: 'shadowBlur200',             // 8px
  opacity: 'shadowOpacity200',       // 0.2
  color: 'shadowBlack100'            // rgba(0,0,0,1)
};
```

---

## Governance Guidelines

### Token Development Governance

#### 1. Primitive Token Creation

**When to Create a New Primitive**:
- Mathematical relationship can be defined
- Value fits within existing scale system
- Multiple semantic tokens will reference it

**Primitive Creation Process**:
1. Define mathematical formula
2. Verify baseline grid alignment
3. Document scale position
4. Add to appropriate token file
5. Human-AI checkpoint for approval

#### 2. Semantic Token Creation

**When to Create a New Semantic**:
- Specific use case requires composition
- Multiple components will use the same composition
- Purpose-driven naming improves clarity

**Semantic Creation Process**:
1. Identify primitive dependencies
2. Define composition structure
3. Document usage context
4. Add to appropriate semantic file
5. Verify cross-platform generation

#### 3. Token Modification Governance

**Modifying Primitive Tokens**:
- ⚠️ HIGH IMPACT: Affects all dependent semantics
- Requires Human-AI checkpoint
- Must maintain mathematical relationships
- All platforms must be regenerated

**Modifying Semantic Tokens**:
- Lower impact: Only affects specific use case
- Document clearly in token file
- Ensure no conflict with existing semantics

### Token Usage Philosophy

#### Semantic Tokens Preferred

Unlike components (where primitive usage is legitimate for coverage gaps), token usage follows a stricter hierarchy:

| Scenario | Use Semantic? | Rationale |
|----------|--------------|-----------|
| Semantic exists for use case | ✅ Yes | Always prefer semantic |
| No semantic exists | ⚠️ Consider | Create semantic or document gap |
| Building new semantic | ✅ Use primitives | Semantics compose primitives |
| One-off exception | ⚠️ Document | Primitive usage should be rare |

**Decision Framework**:
```
Need a token value?
    │
    ├── Does semantic token exist?
    │   ├── YES → Use semantic token
    │   └── NO → Continue...
    │
    ├── Is this a common pattern?
    │   ├── YES → Create semantic token
    │   └── NO → Continue...
    │
    └── Using primitive directly?
        └── Document the exception and rationale
```

**The goal**: Minimize primitive usage in components by creating semantic tokens for all common patterns.

---

## Integration with Existing Systems

### Stemma System Integration

The Rosetta System complements Stemma by handling different concerns:

| Concern | System | Responsibility |
|---------|--------|----------------|
| Visual consistency | Rosetta | Token values, scales, relationships |
| Behavioral consistency | Stemma | Component contracts, inheritance |
| Mathematical foundation | Rosetta | Modular scales, baseline grids |
| Relational foundation | Stemma | Family hierarchies, composition |

### Component Token Consumption

Components consume tokens through the established hierarchy:

```
Rosetta Token System
    │
    ├── Primitive Tokens (spacing, color, typography)
    │       │
    │       └── Semantic Tokens (button.*, input.*, card.*)
    │               │
    │               └── Component Token Files (tokens.ts)
    │                       │
    │                       └── Stemma Components
    │                               │
    │                               └── Platform Implementations
```

### MCP Documentation Integration

Rosetta System documentation is accessible via MCP:

```
get_document_summary({ path: ".kiro/steering/rosetta-system-principles.md" })
get_section({ path: ".kiro/steering/rosetta-system-principles.md", heading: "Mathematical Relationships" })
```

---

## Architectural Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DesignerPunk Design System                        │
├─────────────────────────────────┬───────────────────────────────────────┤
│         ROSETTA SYSTEM          │           STEMMA SYSTEM               │
│    (Mathematical Foundation)    │     (Relational Foundation)           │
├─────────────────────────────────┼───────────────────────────────────────┤
│                                 │                                       │
│  ┌─────────────────────────┐   │   ┌─────────────────────────────┐    │
│  │   Primitive Tokens      │   │   │    Component Families       │    │
│  │   - spacing             │   │   │    - Buttons                │    │
│  │   - color               │   │   │    - Form Inputs            │    │
│  │   - typography          │   │   │    - Containers             │    │
│  │   - motion              │   │   │    - Icons                  │    │
│  └──────────┬──────────────┘   │   │    - Modals                 │    │
│             │                   │   │    - Avatars                │    │
│             ▼                   │   │    - Badges & Tags          │    │
│  ┌─────────────────────────┐   │   │    - Data Displays          │    │
│  │   Semantic Tokens       │   │   │    - Dividers               │    │
│  │   - button.*            │   │   │    - Loading                │    │
│  │   - input.*             │   │   │    - Navigation             │    │
│  │   - card.*              │   │   └─────────────┬───────────────┘    │
│  └──────────┬──────────────┘   │                 │                     │
│             │                   │                 ▼                     │
│             │                   │   ┌─────────────────────────────┐    │
│             │                   │   │   Behavioral Contracts      │    │
│             │                   │   │   - focusable               │    │
│             │                   │   │   - validatable             │    │
│             │                   │   │   - float-label             │    │
│             │                   │   │   - error-state             │    │
│             │                   │   └─────────────┬───────────────┘    │
│             │                   │                 │                     │
└─────────────┼───────────────────┼─────────────────┼─────────────────────┘
              │                   │                 │
              ▼                   │                 ▼
┌─────────────────────────────────┴─────────────────────────────────────┐
│                     Component Implementations                          │
├───────────────────┬───────────────────┬───────────────────────────────┤
│       Web         │       iOS         │          Android              │
│   (Web Components)│   (SwiftUI)       │      (Jetpack Compose)        │
│                   │                   │                               │
│  Tokens: CSS      │  Tokens: Swift    │  Tokens: Kotlin               │
│  Custom Props     │  Extensions       │  Extensions                   │
└───────────────────┴───────────────────┴───────────────────────────────┘
```

---

## Related Documentation

- [Stemma System Principles](./stemma-system-principles.md) - Relational foundation for component development
- [Token System Overview](../docs/token-system-overview.md) - Master document mapping token files
- [Token Quick Reference](./Token-Quick-Reference.md) - Token documentation routing
- [Token Architecture 2.0 Mathematics](../preserved-knowledge/token-architecture-2-0-mathematics.md) - Detailed mathematical formulas
- [Component Development and Practices Guide](./Component Development and Practices Guide.md) - Token selection and component patterns

---

*This document establishes the Rosetta System as the mathematical foundation for token development, complementing the Stemma System's relational foundation to create a complete design system architecture.*
