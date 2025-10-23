# Requirements Document: Typography Token Expansion

**Date**: October 22, 2025
**Spec**: typography-token-expansion
**Status**: Requirements Phase
**Dependencies**: None (extends existing typography tokens)

---

## Introduction

This specification expands the DesignerPunk typography token system to provide comprehensive size variants for body, label, code, and button text styles. The expansion maintains the mathematical foundation of the existing system while addressing real-world UI needs including floating label patterns, button size variants, and code text styling.

The expansion follows the compositional architecture principle where typography tokens define text structure (size, weight, line-height, family) while color is applied separately through color tokens. This maintains separation of concerns and prevents combinatorial explosion of tokens.

---

## Glossary

- **Typography Token**: A semantic token that combines fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing primitives to create a complete text style
- **Size Variant**: Typography tokens at different sizes (Xs, Sm, Md, Lg) using the same weight and family
- **Compositional Architecture**: Design pattern where typography structure and color appearance are defined separately and composed at usage time
- **Floating Label Pattern**: UI pattern where form labels animate from placeholder position to above the input field, requiring smaller text size
- **Platform Modifier**: Native platform APIs for inline text styling (e.g., SwiftUI `.fontWeight(.bold)`, HTML `<strong>`)
- **Strategic Flexibility**: Intentional deviation from perfect symmetry when justified by real-world constraints

---

## Requirements

### Requirement 1: Naming Consistency and Compatibility

**User Story**: As a product architect, I want consistent naming across all typography size variants so that I can predict token names and understand the size scale without consulting documentation.

#### Acceptance Criteria

1. WHEN renaming body typography tokens, THE system SHALL rename typography.bodySmall to typography.bodySm
2. WHEN renaming body typography tokens, THE system SHALL rename typography.body to typography.bodyMd
3. WHEN renaming body typography tokens, THE system SHALL rename typography.bodyLarge to typography.bodyLg
4. WHEN renaming button typography tokens, THE system SHALL rename typography.button to typography.buttonMd
5. WHEN token renames are documented, THE system SHALL provide migration guidance showing old names mapped to new names

### Requirement 2: Label Text Size Variants with Extra Small

**User Story**: As a product architect, I want label text in four sizes (extra small, small, medium, large) so that I can style form labels, UI labels, and floating labels with appropriate emphasis across all platforms.

#### Acceptance Criteria

1. WHEN defining label text styles, THE system SHALL provide typography.labelXs at fontSize050 (13px) with fontWeight500
2. WHEN defining label text styles, THE system SHALL provide typography.labelSm at fontSize075 (14px) with fontWeight500
3. WHEN defining label text styles, THE system SHALL provide typography.labelMd at fontSize100 (16px) with fontWeight500
4. WHEN defining label text styles, THE system SHALL provide typography.labelLg at fontSize125 (18px) with fontWeight500
5. WHEN label typography tokens are used, THE system SHALL pair fontSize tokens with corresponding lineHeight tokens
6. WHEN label typography tokens are generated, THE system SHALL use fontFamilyBody and letterSpacing100 for all label variants
7. WHEN typography.labelXs is used, THE system SHALL support floating label UI patterns where labels animate to smaller size

### Requirement 3: Code Text Size Variants

**User Story**: As a product architect, I want code text in three sizes (small, medium, large) so that I can display inline code, code blocks, and technical content with monospace fonts at appropriate sizes across all platforms.

#### Acceptance Criteria

1. WHEN defining code text styles, THE system SHALL provide typography.codeSm at fontSize075 (14px) with fontWeight400
2. WHEN defining code text styles, THE system SHALL provide typography.codeMd at fontSize100 (16px) with fontWeight400
3. WHEN defining code text styles, THE system SHALL provide typography.codeLg at fontSize125 (18px) with fontWeight400
4. WHEN code typography tokens are used, THE system SHALL pair fontSize tokens with corresponding lineHeight tokens
5. WHEN code typography tokens are generated, THE system SHALL use fontFamilyMono and letterSpacing100 for all code variants
6. WHEN code typography tokens are generated, THE system SHALL use tighter lineHeight ratios appropriate for monospace font readability

### Requirement 4: Button Text Size Variants

**User Story**: As a product architect, I want button text in three sizes (small, medium, large) so that I can style buttons with appropriate emphasis for different button hierarchies and contexts across all platforms.

#### Acceptance Criteria

1. WHEN defining button text styles, THE system SHALL provide typography.buttonSm at fontSize075 (14px) with fontWeight500
2. WHEN defining button text styles, THE system SHALL provide typography.buttonMd at fontSize100 (16px) with fontWeight500
3. WHEN defining button text styles, THE system SHALL provide typography.buttonLg at fontSize125 (18px) with fontWeight500
4. WHEN button typography tokens are used, THE system SHALL pair fontSize tokens with corresponding lineHeight tokens
5. WHEN button typography tokens are generated, THE system SHALL use fontFamilyBody and letterSpacing100 for all button variants
6. WHEN existing typography.button token is referenced, THE system SHALL rename it to typography.buttonMd for consistency

### Requirement 5: Compositional Color Architecture Documentation

**User Story**: As a product architect, I want clear documentation explaining why typography tokens don't include color so that I understand how to compose typography with color tokens across all platforms.

#### Acceptance Criteria

1. WHEN typography token architecture is documented, THE system SHALL explain that typography tokens define text structure without color properties
2. WHEN compositional color patterns are documented, THE system SHALL provide examples of composing typography tokens with color tokens for web, iOS, and Android
3. WHEN compositional color rationale is documented, THE system SHALL explain that including color in typography tokens would create combinatorial explosion
4. WHEN compositional color patterns are documented, THE system SHALL show recommended color pairings for common use cases (body text, labels, code, buttons)
5. WHEN typography tokens are maintained, THE system SHALL continue excluding color properties from all typography token definitions

### Requirement 6: Inline Emphasis Pattern Documentation

**User Story**: As a product architect, I want clear guidance on applying bold and italic emphasis within text so that I can use platform-appropriate semantic markup without creating emphasis typography tokens.

#### Acceptance Criteria

1. WHEN inline text emphasis is needed, THE system SHALL document platform-native modifier patterns for bold and italic styling
2. WHEN inline text emphasis is documented, THE system SHALL provide examples for web (semantic HTML), iOS (SwiftUI modifiers), and Android (Compose AnnotatedString)
3. WHEN inline text emphasis is applied, THE system SHALL NOT require separate typography tokens for emphasis variants
4. WHEN inline text emphasis is documented, THE system SHALL discourage direct use of primitive fontWeight tokens in favor of platform conventions
5. IF emphasis typography tokens were created, THEN the system would encourage non-semantic markup that harms accessibility

### Requirement 7: Strategic Flexibility in Size Scale

**User Story**: As a product architect, I want clear rationale for why labelXs exists but bodyXs/codeXs/buttonXs do not so that I understand when to add size variants versus when to use existing tokens.

#### Acceptance Criteria

1. WHEN size variants are defined, THE system SHALL provide labelXs (13px) for floating label UI patterns
2. WHEN size variants are defined, THE system SHALL NOT provide bodyXs because typography.caption and typography.legal already cover 13px body text needs
3. WHEN size variants are defined, THE system SHALL NOT provide codeXs because code text below 14px becomes difficult to read with monospace fonts
4. WHEN size variants are defined, THE system SHALL NOT provide buttonXs because accessibility guidelines recommend minimum 14px for interactive elements
5. WHEN size scale decisions are documented, THE system SHALL explain strategic flexibility rationale for asymmetric size variants


