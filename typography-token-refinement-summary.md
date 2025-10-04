# Typography Token Refinement Summary

**Date**: October 4, 2025  
**Purpose**: Document the typography token pairing refinements for the Mathematical Token System  
**Organization**: working-document  
**Scope**: temporary

---

## Changes Made

### 1. Requirements Document Updates

**Updated Requirement 5.4:**
- Changed from generic lineHeight multiplication to exact fontSize/lineHeight pairing
- Added specification for 4pt subgrid alignment
- Clarified paired token usage pattern (050↔050, 100↔100, etc.)

**Updated Requirement 6 (Per-Family Mathematical Foundation):**
- Added acceptance criteria for exact fontSize/lineHeight coupling
- Added specification for multipliers rounded to thousandths
- Added tightening pattern requirement (body text: 1.5-1.556, headers: 1.143-1.4)
- Added 4pt typography subgrid alignment requirement
- Expanded from 7 to 10 acceptance criteria to cover typography pairing details

### 2. Design Document Updates

**Added Typography Token Pairing System Section:**
- Complete documentation of pairing principle
- 4pt typography subgrid explanation
- Tightening pattern rationale
- Complete token pairing table with all 11 fontSize/lineHeight pairs

**Updated Core Token Engine:**
- Enhanced FontSizeTokens description (fontSize050-fontSize700, 1.125 modular scale)
- Enhanced LineHeightTokens description (lineHeight050-lineHeight700, paired with fontSize)

**Updated Primitive Token Layer:**
- Added typography pairing note about exact coupling
- Added reference to 4pt subgrid alignment

---

## Typography Token Specification

### Complete fontSize + lineHeight Pairing

| Token | fontSize | lineHeight | Computed | 4pt Aligned | Use Case |
|-------|----------|------------|----------|-------------|----------|
| **050** | 13px | 1.538 | 20px | ✅ (4×5) | Caption/small text |
| **075** | 14px | 1.429 | 20px | ✅ (4×5) | Small text |
| **100** | 16px | 1.5 | 24px | ✅ (4×6) | Body text (base) |
| **125** | 18px | 1.556 | 28px | ✅ (4×7) | Large body text |
| **150** | 20px | 1.4 | 28px | ✅ (4×7) | H6 (smallest header) |
| **200** | 23px | 1.391 | 32px | ✅ (4×8) | H5 |
| **300** | 26px | 1.231 | 32px | ✅ (4×8) | H4 |
| **400** | 29px | 1.241 | 36px | ✅ (4×9) | H3 |
| **500** | 33px | 1.212 | 40px | ✅ (4×10) | H2 |
| **600** | 37px | 1.19 | 44px | ✅ (4×11) | H1 |
| **700** | 42px | 1.143 | 48px | ✅ (4×12) | Display text |

### Key Principles

1. **Exact Pairing**: fontSize and lineHeight tokens share the same numeric suffix
2. **4pt Subgrid**: All computed line heights align to 4pt increments
3. **Unitless Multipliers**: Work consistently across web, iOS, and Android
4. **Tightening Pattern**: Ratios decrease as font size increases (headers get tighter)
5. **Precision**: Multipliers rounded to thousandths (e.g., 1.538, 1.429, 1.391)

### Typography Hierarchy

**Body Text (Looser ratios for readability):**
- fontSize050 (13px) × lineHeight050 (1.538) = 20px
- fontSize075 (14px) × lineHeight075 (1.429) = 20px
- fontSize100 (16px) × lineHeight100 (1.5) = 24px
- fontSize125 (18px) × lineHeight125 (1.556) = 28px

**Headers (Tighter ratios for impact):**
- fontSize150 (20px) × lineHeight150 (1.4) = 28px — H6
- fontSize200 (23px) × lineHeight200 (1.391) = 32px — H5
- fontSize300 (26px) × lineHeight300 (1.231) = 32px — H4
- fontSize400 (29px) × lineHeight400 (1.241) = 36px — H3
- fontSize500 (33px) × lineHeight500 (1.212) = 40px — H2
- fontSize600 (37px) × lineHeight600 (1.19) = 44px — H1
- fontSize700 (42px) × lineHeight700 (1.143) = 48px — Display

### Cross-Platform Implementation

**Web:**
```css
font-size: 1rem;        /* fontSize100 = 16px */
line-height: 1.5;       /* lineHeight100 (unitless) */
/* Computed: 16px × 1.5 = 24px */
```

**iOS (SwiftUI):**
```swift
.font(.system(size: 16))  // fontSize100 in pt
.lineSpacing(1.5)         // lineHeight100 (unitless)
// Computed: 16pt × 1.5 = 24pt
```

**Android (Compose):**
```kotlin
fontSize = 16.sp          // fontSize100
lineHeight = 1.5.em       // lineHeight100 (unitless)
// Computed: 16sp × 1.5 = 24sp
```

---

## Rationale

### Why 4pt Subgrid for Typography?

The 4pt subgrid provides more granular control over line heights while maintaining systematic rhythm:
- Allows line heights like 20px, 28px, 36px, 44px (not possible with strict 8pt grid)
- Maintains mathematical consistency through 4pt increments
- Provides flexibility for typography without breaking systematic alignment

### Why Tighter Ratios for Headers?

Typographic best practice dictates that larger text needs tighter line-height ratios:
- Prevents headers from feeling "floaty" or disconnected
- Creates stronger visual hierarchy
- Maintains appropriate visual density at larger sizes

### Why Exact Pairing?

Exact pairing (050↔050, 100↔100) creates:
- Clear semantic relationship for AI agents and developers
- Unambiguous communication about intended usage
- Systematic approach that scales across all font sizes
- Simplified mental model (no guessing which lineHeight to use)

---

## Next Steps

The spec documents have been updated with these refinements. The implementation tasks in tasks.md remain unchanged as they already support the flexible token architecture needed for this pairing system.

When implementing:
1. Update `LineHeightTokens.ts` with the new multiplier values
2. Update `FontSizeTokens.ts` to include fontSize500, fontSize600, fontSize700
3. Update validation to check for 4pt subgrid alignment in typography
4. Update documentation to reflect the pairing principle

---

*This refinement maintains the mathematical foundation of the token system while providing the precise typography control needed for systematic vertical rhythm and visual hierarchy.*
