# Mathematical Token System - Design Document

**Date**: October 1, 2025  
**Purpose**: Technical design for foundational mathematical token system enabling cross-platform consistency  
**Priority**: Critical (Priority 1) - Must be first  
**Dependencies**: None (foundational)  
**Organization**: spec-validation  
**Scope**: mathematical-token-system

---

## Overview

The Mathematical Token System implements Token Architecture 2.0 mathematics as the foundational layer for the DesignerPunk Design System. The system operates on a business localization model where design tokens are remote workers with specialized expertise serving multiple markets (platforms) through translation services. This design ensures mathematical consistency across web, iOS, and Android while maintaining strategic flexibility for exceptional design requirements.

## Architecture

### Business Localization Model

The system architecture follows the business localization model established in the strategic framework:

- **Remote Workers**: Design tokens operate as specialized workers with mathematical expertise
- **Multiple Markets**: Each platform (web, iOS, Android) represents a distinct market with specific requirements
- **Translation Services**: Internal Translation Providers convert primitive and semantic tokens to platform-specific formats
- **Specialized Expertise**: Mathematical relationships maintained through centralized primitive and semantic token definitions

### Two-Layer Token Architecture

#### Primitive Token Layer
- **Purpose**: Foundational unitless mathematical values organized by token families
- **Scope**: Six token families (spacing, fontSize, lineHeight, radius, density, tapArea) with per-family base values
- **Usage**: Primary token type for component development with family-specific mathematical relationships
- **Validation**: Must align with per-family mathematical foundation or strategic flexibility exceptions
- **Typography Pairing**: fontSize and lineHeight tokens are exactly paired (050↔050, 100↔100, etc.) with lineHeight multipliers calculated to achieve 4pt subgrid alignment

#### Semantic Token Layer  
- **Purpose**: Contextual tokens that reference primitives with semantic meaning
- **Scope**: Semantic references (color.warning, typography.body, space.grouped.normal, space.inset.comfortable)
- **Usage**: Higher-level abstraction for specific semantic contexts
- **Validation**: Must reference valid primitive tokens, not raw values
- **Spacing Architecture**: Two-category system distinguishing layout (external relationships) from inset (internal density)

### Translation Provider Architecture

#### Unit Provider Service
- **Responsibility**: Convert unitless token values to platform-appropriate units using per-family conversion rules
- **Web Output**: Spacing/radius (×1px), Typography (÷16 = REM), LineHeight (unitless), Density (multiplier), TapArea (×1px)
- **iOS Output**: Spacing/radius/typography/tapArea (×1pt), LineHeight (unitless), Density (multiplier)
- **Android Output**: Spacing/radius/tapArea (×1dp), Typography (×1sp), LineHeight (unitless), Density (multiplier)
- **Validation**: Ensures mathematical equivalence across platforms with per-family unit application

#### Format Provider Service
- **Responsibility**: Generate platform-appropriate syntax and naming conventions
- **Web Output**: JavaScript/CSS variable format
- **iOS Output**: Swift constant declarations
- **Android Output**: Kotlin/XML resource format
- **Validation**: Ensures consistent naming patterns across platforms

#### Path Provider Service
- **Responsibility**: Organize tokens into platform-appropriate file structures
- **Output Files**: DesignTokens.web.js, DesignTokens.ios.swift, DesignTokens.android.kt
- **Structure**: Platform-optimized organization for build system integration
- **Validation**: Ensures all platforms receive complete token sets

## Components and Interfaces

### Hierarchical Spacing Semantic Token System

The spacing semantic token system uses a two-category architecture that distinguishes between external spacing (layout) and internal spacing (inset):

**Layout Tokens (External Spacing):**
Layout tokens describe spacing between elements based on their relationship hierarchy. Used for margins, gaps, and spacing between components.

**Relationship Hierarchy:**
- **grouped**: Elements within the same logical group (tightest relationships)
  - minimal (space025): Extremely tight grouping (metadata, labels)
  - tight (space050): Tight grouping (icon-label pairs)
  - normal (space100): Standard grouping (form fields in group)
  - loose (space150): Generous grouping (related cards)

- **related**: Elements that are connected but distinct (moderate relationships)
  - tight (space100): Minimal related separation
  - normal (space200): Standard related separation
  - loose (space300): Generous related separation

- **separated**: Elements that are independent (clear separation)
  - tight (space200): Minimal separated distinction
  - normal (space300): Standard separated distinction
  - loose (space400): Generous separated distinction

- **sectioned**: Major section boundaries (strongest separation)
  - tight (space400): Minimal section boundary
  - normal (space500): Standard section boundary
  - loose (space600): Generous section boundary

**Inset Tokens (Internal Spacing):**
Inset tokens describe spacing inside containers based on density. Used for padding within components and containers.

**Density Levels:**
- **tight** (space050): High-density interfaces (compact, efficient)
- **normal** (space100): Standard-density interfaces (balanced)
- **comfortable** (space150): Low-density interfaces (generous, content-focused)
- **spacious** (space200): Very low-density interfaces (emphasis, breathing room)
- **expansive** (space300): Maximum breathing room (heroes, feature sections)

**Zero Spacing Guidance:**
For removing spacing (resets, overrides), use `0` directly rather than a token. Zero represents the absence of spacing, not a spacing value.

**AI Agent Guidance:**
- Between elements (margins, gaps)? → Use layout tokens based on relationship hierarchy
- Inside containers (padding)? → Use inset tokens based on desired density
- Removing spacing (resets)? → Use 0 directly (not a token)

### Typography Token Pairing System

The typography system implements exact pairing between fontSize and lineHeight tokens to achieve systematic vertical rhythm on a 4pt subgrid:

**Pairing Principle:**
- Each fontSize token has a corresponding lineHeight token with the same numeric suffix
- fontSize050 pairs with lineHeight050, fontSize100 pairs with lineHeight100, etc.
- LineHeight multipliers are calculated to produce line heights aligned to 4pt subgrid
- Multipliers are rounded to thousandths for precision

**4pt Typography Subgrid:**
- Typography works on a 4pt subgrid within the 8pt baseline grid system
- Valid line heights: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, etc.
- Provides granular control over vertical rhythm while maintaining systematic alignment

**Tightening Pattern:**
- Body text (050-125): Looser ratios (1.429-1.556) for optimal readability
- Headers (150-700): Tighter ratios (1.143-1.4) for visual impact and hierarchy
- Ratios decrease as font size increases to prevent headers from feeling "floaty"

**Complete Token Pairing:**

| Token | fontSize (px) | lineHeight (multiplier) | Computed (px) | 4pt Aligned | Use Case |
|-------|---------------|-------------------------|---------------|-------------|----------|
| 050 | 13 | 1.538 | 20 | ✅ (4×5) | Caption/small text |
| 075 | 14 | 1.429 | 20 | ✅ (4×5) | Small text |
| 100 | 16 | 1.5 | 24 | ✅ (4×6) | Body text (base) |
| 125 | 18 | 1.556 | 28 | ✅ (4×7) | Large body text |
| 150 | 20 | 1.4 | 28 | ✅ (4×7) | H6 (smallest header) |
| 200 | 23 | 1.391 | 32 | ✅ (4×8) | H5 |
| 300 | 26 | 1.231 | 32 | ✅ (4×8) | H4 |
| 400 | 29 | 1.241 | 36 | ✅ (4×9) | H3 |
| 500 | 33 | 1.212 | 40 | ✅ (4×10) | H2 |
| 600 | 37 | 1.19 | 44 | ✅ (4×11) | H1 |
| 700 | 42 | 1.143 | 48 | ✅ (4×12) | Display text |

### Core Token Engine

```
TokenEngine
├── PrimitiveTokenRegistry
│   ├── SpacingTokens (space050, space075, space100, space150, etc.) - Base: 8
│   ├── FontSizeTokens (fontSize050-fontSize700) - Base: 16, 1.125 modular scale
│   ├── LineHeightTokens (lineHeight050-lineHeight700) - Base: 1.5, paired with fontSize
│   ├── RadiusTokens (radius025, radius100, radius200, etc.) - Base: 8
│   ├── DensityTokens (densityCompact, densityDefault, densityComfortable) - Base: 1.0
│   └── TapAreaTokens (tapAreaMinimum, tapAreaRecommended, etc.) - Base: 44
├── SemanticTokenRegistry
│   ├── ColorTokens (color.warning, color.primary, etc.)
│   ├── TypographyTokens (typography.body, typography.h1, etc.)
│   ├── SpacingTokens (space.grouped.*, space.related.*, space.separated.*, space.sectioned.*, space.inset.*)
│   └── StyleTokens (border.stylePrimary, shadow.elevated, etc.)
└── ValidationEngine
    ├── ThreeTierValidator (Pass/Warning/Error)
    ├── PerFamilyMathematicalValidator
    ├── StrategicFlexibilityValidator
    ├── CrossPlatformConsistencyValidator
    └── UsagePatternAnalyzer
```

### Translation Provider Services

```
TranslationProviders
├── UnitProvider
│   ├── WebUnitConverter (baseValue → REM)
│   ├── iOSUnitConverter (baseValue → points)
│   └── AndroidUnitConverter (baseValue → dp)
├── FormatProvider
│   ├── WebFormatGenerator (JS/CSS variables)
│   ├── iOSFormatGenerator (Swift constants)
│   └── AndroidFormatGenerator (Kotlin/XML resources)
└── PathProvider
    ├── WebFileOrganizer
    ├── iOSFileOrganizer
    └── AndroidFileOrganizer
```

### Validation System Interface

```
ValidationSystem
├── ThreeTierValidator
│   ├── PassValidator (primitive tokens, semantic tokens, strategic flexibility)
│   ├── WarningValidator (mathematically valid but problematic)
│   └── ErrorValidator (violates mathematical relationships)
├── UsageAnalyzer
│   ├── StrategicFlexibilityTracker (≥80% appropriate usage)
│   ├── SemanticTokenUsageTracker
│   └── PrimitiveTokenFallbackTracker
└── ContaminationPrevention
    ├── AIAgentRestrictions (approval required for new flexibility tokens)
    └── ProcessBasedControls
```

## Data Models

### Primitive Token Model

```typescript
interface PrimitiveToken {
  name: string;                    // e.g., "space100", "fontSize125", "lineHeight100"
  category: TokenCategory;         // spacing | fontSize | lineHeight | radius | density | tapArea
  baseValue: number;              // unitless base value (varies per family)
  familyBaseValue: number;        // base value for the token family (e.g., 8 for spacing)
  description: string;             // mathematical meaning and usage
  mathematicalRelationship: string; // relationship to family base value
  baselineGridAlignment: boolean;  // true for 8-unit alignment (spacing/radius families)
  isStrategicFlexibility: boolean; // true for strategic flexibility exceptions
  isPrecisionTargeted: boolean;    // true for precision multipliers (lineHeight, tapArea)
  platforms: PlatformValues;       // generated platform-specific values
}

interface PlatformValues {
  web: { value: number; unit: 'px' | 'rem' | 'unitless' };
  ios: { value: number; unit: 'pt' | 'unitless' };
  android: { value: number; unit: 'dp' | 'sp' | 'unitless' };
}
```

### Semantic Token Model

```typescript
interface SemanticToken {
  name: string;                    // e.g., "color.warning" or "space.tight"
  primitiveReference: string;      // e.g., "red100" or "space050"
  category: SemanticCategory;      // color | spacing | border | shadow
  context: string;                 // semantic meaning or usage context
  description: string;             // contextual meaning
  primitiveToken: PrimitiveToken;  // resolved primitive token
}
```

### Validation Result Model

```typescript
interface ValidationResult {
  level: 'Pass' | 'Warning' | 'Error';
  token: string;
  message: string;
  rationale: string;
  suggestions?: string[];
  mathematicalReasoning: string;
}
```

### Translation Output Model

```typescript
interface TranslationOutput {
  platform: 'web' | 'ios' | 'android';
  filePath: string;
  content: string;
  format: 'javascript' | 'swift' | 'kotlin' | 'xml';
  tokenCount: number;
  validationStatus: 'valid' | 'invalid';
}
```

## Error Handling

### Token Definition Errors

**Invalid Baseline Grid Alignment**:
- **Detection**: Primitive tokens not aligned to 8-unit baseline grid (except strategic flexibility)
- **Response**: Error validation with correction suggestions
- **Recovery**: Suggest nearest valid baseline grid value

**Mathematical Relationship Violations**:
- **Detection**: Semantic tokens that don't compose from valid primitives
- **Response**: Error validation with mathematical reasoning
- **Recovery**: Provide valid primitive composition alternatives

**Strategic Flexibility Overuse**:
- **Detection**: Usage patterns below 80% appropriate usage threshold
- **Response**: Warning validation with semantic token guidance
- **Recovery**: Suggest semantic token alternatives for common use cases

### Cross-Platform Consistency Errors

**Platform-Specific Mathematical Constraints**:
- **Detection**: Platform limitations preventing exact mathematical equivalence
- **Response**: Document constraint and provide closest valid alternative
- **Recovery**: Maintain proportional relationships within platform constraints

**Translation Provider Failures**:
- **Detection**: Unit, Format, or Path Provider unable to generate platform output
- **Response**: Clear error messages with fallback options
- **Recovery**: Graceful degradation to manual platform file generation

### AI Agent Restriction Violations

**Unauthorized Flexibility Token Creation**:
- **Detection**: AI agent attempts to create new strategic flexibility tokens
- **Response**: Block action and require human approval
- **Recovery**: Provide existing strategic flexibility alternatives

**Contamination Vector Introduction**:
- **Detection**: AI agent attempts to create code examples in documentation
- **Response**: Block action and enforce concept-based documentation
- **Recovery**: Provide concept-based documentation templates

## Testing Strategy

### Mathematical Consistency Testing

**Cross-Platform Equivalence Validation**:
- **Test**: Generate tokens for all platforms and verify mathematical relationships
- **Assertion**: Proportional consistency maintained within acceptable tolerance
- **Coverage**: All semantic tokens across all platforms

**Baseline Grid Compliance Testing**:
- **Test**: Validate all primitive tokens align to 8-unit baseline grid
- **Assertion**: All non-strategic-flexibility tokens are 8-unit multiples
- **Coverage**: Complete primitive token registry

**Strategic Flexibility Usage Testing**:
- **Test**: Analyze usage patterns across component development
- **Assertion**: ≥80% appropriate usage of strategic flexibility tokens
- **Coverage**: Real-world component development scenarios

### Translation Provider Testing

**Unit Conversion Accuracy**:
- **Test**: Verify mathematical accuracy of platform unit conversions
- **Assertion**: Web REM, iOS points, Android dp maintain mathematical relationships
- **Coverage**: All token values across all unit conversions

**Format Generation Validation**:
- **Test**: Verify platform-appropriate syntax and naming conventions
- **Assertion**: Generated files compile/parse correctly on target platforms
- **Coverage**: All platform formats and file structures

**File Organization Testing**:
- **Test**: Verify platform-appropriate file structures and organization
- **Assertion**: Build systems can integrate files without coordination complexity
- **Coverage**: All platform file outputs and directory structures

### Validation System Testing

**Three-Tier Validation Accuracy**:
- **Test**: Verify Pass/Warning/Error classifications for known token usage patterns
- **Assertion**: Validation levels match expected mathematical reasoning
- **Coverage**: All validation scenarios and edge cases

**Contamination Prevention Testing**:
- **Test**: Verify AI agent restrictions and process-based controls
- **Assertion**: Unauthorized actions blocked, contamination vectors prevented
- **Coverage**: All AI agent interaction scenarios

### Performance Testing

**Token Generation Performance**:
- **Test**: Measure token constant generation time for typical token sets
- **Assertion**: Process completes in <5ms for typical token sets
- **Coverage**: Various token set sizes and complexity levels

**Build Integration Performance**:
- **Test**: Measure impact on build times and runtime performance
- **Assertion**: No significant impact on build times or runtime performance
- **Coverage**: Integration with various build systems and deployment scenarios

### Integration Testing

**Build System Integration**:
- **Test**: Verify seamless integration with cross-platform build systems
- **Assertion**: Build systems can select appropriate platform files automatically
- **Coverage**: Integration with F2 Cross-Platform Build System

**Component Development Integration**:
- **Test**: Verify component developers can use tokens without mathematical inconsistencies
- **Assertion**: Semantic token composition patterns work as designed
- **Coverage**: Integration with F3 Component Architecture Framework

**Validation Framework Integration**:
- **Test**: Verify integration with D1 Mathematical Validation Framework
- **Assertion**: Validation results provide clear guidance and mathematical reasoning
- **Coverage**: Integration with validation workflows and development processes

---

*This design document provides the technical foundation for implementing the Mathematical Token System as the foundational layer of the DesignerPunk Design System, ensuring mathematical consistency across platforms while maintaining strategic flexibility and contamination prevention.*