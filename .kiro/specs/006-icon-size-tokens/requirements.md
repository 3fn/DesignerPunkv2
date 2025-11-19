# Requirements Document: Icon Size Tokens

**Date**: November 18, 2025
**Spec**: 006 - Icon Size Tokens
**Status**: Requirements Phase
**Dependencies**: Spec 001 (Mathematical Token System), Spec 004 (Icon System)

---

## Introduction

The Icon Size Token system provides mathematically-derived icon sizes that create perfect optical balance with typography. Icon sizes are calculated using the formula `fontSize × lineHeight`, ensuring icons fill the vertical space of their paired text lines. This system enables automatic adaptation when typography scales change, provides clear reasoning paths for AI agents, and maintains alignment with the 4pt subgrid system through lineHeight precision targeting.

The system addresses a gap discovered during Spec 004 implementation: icon sizes were hard-coded as literal values (16, 24, 32, 40), disconnecting them from the typography system they pair with. This prevented automatic adaptation and made the relationship between icons and text implicit rather than explicit.

---

## Glossary

- **Icon Size Token**: Semantic token defining icon dimensions calculated from fontSize × lineHeight formula
- **fontSize Token**: Primitive token defining text size using 1.125 modular scale with 16px base
- **lineHeight Token**: Primitive token defining line height ratio precision-targeted for 4pt subgrid alignment
- **Computed Line Height**: Actual line height in pixels calculated as fontSize × lineHeight ratio
- **Optical Balance**: Visual harmony where icon and text have equal visual weight in composition
- **4pt Subgrid**: Vertical rhythm system where line heights align to 4-pixel increments
- **Typography Pairing**: Association between icon size and specific typography style (bodyMd, h3, etc.)
- **Formula Multiplier**: Adjustable constant in icon size calculation enabling fine-tuning
- **Baseline Grid**: 8-pixel vertical rhythm system for layout alignment
- **Token Adaptability**: Automatic propagation of changes when source tokens (fontSize, lineHeight) change
- **AI Agent Reasoning**: Ability for AI to calculate and understand token relationships through explicit formulas

---

## Requirements

### Requirement 1: Icon Size Token Formula

**User Story**: As a design system architect, I want icon sizes calculated from fontSize × lineHeight, so that icons automatically maintain optical balance with their paired typography when scales change.

#### Acceptance Criteria

1. WHEN the Icon Size Token System calculates icon sizes THEN the Icon Size Token System SHALL use the formula `iconSize = fontSize.baseValue × lineHeight.baseValue`
2. WHEN fontSize or lineHeight tokens change THEN the Icon Size Token System SHALL recalculate icon sizes automatically without manual updates
3. WHEN icon size calculation produces non-integer values THEN the Icon Size Token System SHALL round to nearest integer
4. WHEN the Icon Size Token System defines the formula THEN the Icon Size Token System SHALL make the mathematical relationship explicit in code and documentation
5. WHEN AI agents analyze icon sizes THEN the Icon Size Token System SHALL enable calculation of icon size from fontSize and lineHeight values
6. WHEN icon sizes are calculated THEN the Icon Size Token System SHALL produce sizes that align with 4pt subgrid through lineHeight precision targeting

### Requirement 2: Icon Size Token Naming

**User Story**: As a component developer, I want icon size tokens named consistently with typography tokens, so that I can easily identify which icon size pairs with which typography style.

#### Acceptance Criteria

1. WHEN the Icon Size Token System defines token names THEN the Icon Size Token System SHALL use numeric scale format `icon.sizeXXX` where XXX matches fontSize/lineHeight scale
2. WHEN typography uses fontSize100 and lineHeight100 THEN the Icon Size Token System SHALL provide icon.size100 for pairing
3. WHEN new typography scales are added THEN the Icon Size Token System SHALL support adding corresponding icon sizes without naming conflicts
4. WHEN developers reference icon sizes THEN the Icon Size Token System SHALL provide TypeScript type safety through IconSize type
5. WHEN icon size tokens are named THEN the Icon Size Token System SHALL avoid t-shirt sizing (small/medium/large) to prevent scaling problems

### Requirement 3: Typography Pairing Coverage

**User Story**: As a component developer, I want icon sizes for all typography styles, so that I can achieve optical balance regardless of which typography I'm using.

#### Acceptance Criteria

1. WHEN the Icon Size Token System provides icon sizes THEN the Icon Size Token System SHALL include sizes for all typography scales (050, 075, 100, 125, 150, 200, 300, 400, 500, 600, 700)
2. WHEN typography includes bodySm (fontSize075) THEN the Icon Size Token System SHALL provide icon.size075 calculated from fontSize075 × lineHeight075
3. WHEN typography includes bodyMd (fontSize100) THEN the Icon Size Token System SHALL provide icon.size100 calculated from fontSize100 × lineHeight100
4. WHEN typography includes display (fontSize700) THEN the Icon Size Token System SHALL provide icon.size700 calculated from fontSize700 × lineHeight700
5. WHEN multiple typography styles converge to same icon size THEN the Icon Size Token System SHALL document the convergence as mathematically derived

### Requirement 4: Cross-Platform Token Generation

**User Story**: As a platform developer, I want icon size tokens generated for web, iOS, and Android, so that I can use the same token system across all platforms.

#### Acceptance Criteria

1. WHEN the Icon Size Token System generates tokens THEN the Icon Size Token System SHALL produce web tokens as TypeScript constants
2. WHEN the Icon Size Token System generates tokens THEN the Icon Size Token System SHALL produce iOS tokens as Swift CGFloat constants
3. WHEN the Icon Size Token System generates tokens THEN the Icon Size Token System SHALL produce Android tokens as Kotlin Dp constants
4. WHEN icon sizes are generated for platforms THEN the Icon Size Token System SHALL maintain numeric equivalence (24px = 24pt = 24dp)
5. WHEN platform tokens are generated THEN the Icon Size Token System SHALL include documentation comments with formula and typography pairing

### Requirement 5: Type Safety

**User Story**: As a component developer, I want TypeScript to enforce valid icon sizes, so that I catch invalid size references at compile-time instead of runtime.

#### Acceptance Criteria

1. WHEN the Icon Size Token System defines icon sizes THEN the Icon Size Token System SHALL provide IconSize TypeScript type derived from token values
2. WHEN developers use Icon component THEN the Icon Size Token System SHALL enforce IconSize type for size prop
3. WHEN developers type icon sizes THEN the Icon Size Token System SHALL provide TypeScript autocomplete with valid token references
4. WHEN developers use invalid icon size THEN the Icon Size Token System SHALL produce compile-time error before code runs
5. WHEN icon sizes are added or removed THEN the Icon Size Token System SHALL update IconSize type automatically

### Requirement 6: Icon Component Integration

**User Story**: As a component developer, I want Icon component to accept icon size tokens, so that I can use the token system with existing Icon API.

#### Acceptance Criteria

1. WHEN Icon component receives size prop THEN Icon component SHALL accept icon size token values
2. WHEN icon size tokens are used THEN Icon component SHALL render icons at calculated sizes
3. WHEN Icon component API is updated THEN Icon component SHALL maintain existing size prop interface (accepts numeric values)
4. WHEN Icon component uses tokens THEN Icon component SHALL work correctly across web, iOS, and Android platforms
5. WHEN Spec 004 Icon component is updated THEN Icon component SHALL integrate token system without breaking existing API

### Requirement 7: Documentation and AI Reasoning

**User Story**: As an AI agent, I want explicit documentation of the fontSize × lineHeight formula, so that I can reason about icon size selection and calculate appropriate sizes for new contexts.

#### Acceptance Criteria

1. WHEN the Icon Size Token System documents tokens THEN the Icon Size Token System SHALL include formula explanation in code comments
2. WHEN the Icon Size Token System documents tokens THEN the Icon Size Token System SHALL include typography pairing examples for each size
3. WHEN the Icon Size Token System documents tokens THEN the Icon Size Token System SHALL include calculated values with formula breakdown
4. WHEN AI agents analyze icon sizes THEN the Icon Size Token System SHALL enable reasoning about which size pairs with which typography
5. WHEN the Icon Size Token System documents tokens THEN the Icon Size Token System SHALL explain optical balance rationale and 4pt subgrid alignment

### Requirement 8: Formula Adjustability

**User Story**: As a design system architect, I want the ability to adjust the icon size formula, so that I can fine-tune optical balance if visual testing reveals issues.

#### Acceptance Criteria

1. WHEN the Icon Size Token System implements the formula THEN the Icon Size Token System SHALL support optional multiplier constant for fine-tuning
2. WHEN formula multiplier is adjusted THEN the Icon Size Token System SHALL recalculate all icon sizes automatically
3. WHEN formula multiplier is 1.0 THEN the Icon Size Token System SHALL use pure fontSize × lineHeight calculation
4. WHEN formula multiplier differs from 1.0 THEN the Icon Size Token System SHALL document the adjustment and rationale
5. WHEN visual testing identifies optical balance issues THEN the Icon Size Token System SHALL enable adjustment without changing formula structure

### Requirement 9: Token Metadata

**User Story**: As a design system maintainer, I want icon size tokens to include metadata about their calculation, so that I can understand and validate the token system.

#### Acceptance Criteria

1. WHEN the Icon Size Token System defines tokens THEN the Icon Size Token System SHALL include source fontSize and lineHeight references in metadata
2. WHEN the Icon Size Token System defines tokens THEN the Icon Size Token System SHALL include calculated value in metadata
3. WHEN the Icon Size Token System defines tokens THEN the Icon Size Token System SHALL include typography pairing context in metadata
4. WHEN the Icon Size Token System defines tokens THEN the Icon Size Token System SHALL include 4pt subgrid alignment status in metadata
5. WHEN the Icon Size Token System defines tokens THEN the Icon Size Token System SHALL include formula explanation in metadata

---

## Future Enhancements (Not in Initial Scope)

The following features are explicitly excluded from this initial implementation but may be added in future iterations:

### Context-Specific Multipliers
- Different multipliers for buttons vs inline text vs headings
- Automatic multiplier selection based on usage context
- Per-typography-scale multiplier overrides

### Dynamic Icon Sizing
- Icons that scale with viewport size
- Responsive icon sizes for different breakpoints
- Fluid icon sizing between breakpoints

### Icon Size Validation
- Runtime validation that icon size matches paired typography
- Development-mode warnings for mismatched pairings
- Automated visual regression testing for optical balance

### Advanced Typography Pairing
- Automatic icon size selection based on typography context
- Smart defaults for common icon-text patterns
- Typography-aware icon component variants

---

*This requirements document defines the scope and acceptance criteria for the Icon Size Token system, focusing on mathematically-derived sizes that create optical balance with typography while maintaining adaptability and AI-friendly reasoning.*
