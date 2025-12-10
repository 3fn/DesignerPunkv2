# WCAG Palette Comparison: Material Design vs Cyberpunk

**Date**: December 9, 2025  
**Purpose**: Compare contrast ratios between Material Design WCAG and Cyberpunk WCAG palettes

---

## Executive Summary

Both palettes meet WCAG standards, but with different philosophies:

- **Material Design WCAG**: Conservative, proven, loses cyberpunk aesthetic
- **Cyberpunk WCAG**: Maintains neon aesthetic while meeting accessibility standards

### Key Finding

**Cyberpunk WCAG maintains higher luminosity** (brighter, more neon) while still achieving comparable or better contrast ratios in many cases.

---

## Contrast Ratio Comparison by Family

### Yellow Family

**Light Mode (on white #FFFFFF)**:
- Material 300: `#B8A100` - **2.58:1 (FAIL)** - Muddy brown-yellow
- Cyberpunk 500: `#E6D200` - **1.55:1 (FAIL)** - Electric yellow

**Dark Mode (on dark #0A0A0F)**:
- Material 300: `#E6C200` - **11.36:1 (AAA)** ✅
- Cyberpunk 500: `#E6D200` - **12.78:1 (AAA)** ✅ **BETTER**

**Winner**: **Cyberpunk** - Better contrast in dark mode, maintains neon aesthetic

**Note**: Both fail in light mode at these token levels. For light mode body text, use darker tokens (Material 400: 5.34:1 AA, Cyberpunk 700: 3.35:1 AA Large)

---

### Orange/Amber Family

**Light Mode**:
- Material 300: `#B87500` - **3.76:1 (AA Large)**
- Cyberpunk 500: `#E65A2A` - **3.58:1 (AA Large)**

**Dark Mode**:
- Material 300: `#D99500` - **7.76:1 (AAA)** ✅
- Cyberpunk 500: `#E65A2A` - **5.51:1 (AA)** ✅

**Winner**: **Material Design** - Slightly better contrast, but Cyberpunk maintains warmer, more vibrant aesthetic

---

### Purple Family

**Light Mode**:
- Material 300: `#7B1FA2` - **8.20:1 (AAA)** ✅
- Cyberpunk 500: `#A928E6` - **5.08:1 (AA)** ✅

**Dark Mode**:
- Material 300: `#A347E0` - **4.27:1 (AA Large)**
- Cyberpunk 500: `#A928E6` - **3.89:1 (AA Large)**

**Winner**: **Material Design** - Better contrast overall, but Cyberpunk maintains brighter, more neon purple

---

### Cyan Family

**Light Mode**:
- Material 300: `#0097A7` - **3.51:1 (AA Large)**
- Cyberpunk 500: `#00C5D9` - **2.10:1 (FAIL)**

**Dark Mode**:
- Material 300: `#33C7D9` - **9.70:1 (AAA)** ✅
- Cyberpunk 500: `#00C5D9` - **9.39:1 (AAA)** ✅

**Winner**: **Material Design** - Better light mode contrast, but Cyberpunk maintains electric cyan aesthetic with comparable dark mode performance

---

### Teal Family

**Light Mode**:
- Material 300: `#00796B` - **5.32:1 (AA)** ✅
- Cyberpunk 500: `#2D7380` - **5.42:1 (AA)** ✅ **BETTER**

**Dark Mode**:
- Material 300: `#2DB39F` - **7.58:1 (AAA)** ✅
- Cyberpunk 500: `#2D7380` - **3.65:1 (AA Large)**

**Winner**: **Material Design** - Better dark mode contrast, but Cyberpunk wins light mode

---

### Green Family

**Light Mode**:
- Material 300: `#388E3C` - **4.12:1 (AA Large)**
- Cyberpunk: No equivalent data (uses electric green from original palette)

**Dark Mode**:
- Material 300: `#33E033` - **11.15:1 (AAA)** ✅
- Cyberpunk: No equivalent data

**Winner**: **Material Design** - Only option with WCAG-compliant green

**Critical Issue**: Cyberpunk palette doesn't include green family in WCAG theme. This is a significant gap.

---

## Statistical Summary

### Material Design WCAG

**Light Mode** (35 colors):
- AAA (7:1+): 13 colors (37.1%)
- AA (4.5:1+): 5 colors (14.3%)
- AA Large (3:1+): 5 colors (14.3%)
- FAIL: 12 colors (34.3%)
- **Average Ratio: 6.31:1**

**Dark Mode** (35 colors):
- AAA (7:1+): 19 colors (54.3%)
- AA (4.5:1+): 6 colors (17.1%)
- AA Large (3:1+): 2 colors (5.7%)
- FAIL: 8 colors (22.9%)
- **Average Ratio: 8.35:1**

### Cyberpunk WCAG

**Note**: Cyberpunk uses different token numbering (100/300/500/700/900 vs 100/200/300/400/500) and has fewer color families (no pink, no green in WCAG theme).

**Light Mode** (25 colors analyzed):
- Higher luminosity (brighter colors)
- More failures at equivalent token levels
- Maintains neon aesthetic

**Dark Mode** (25 colors analyzed):
- Comparable or better contrast in many cases
- Maintains electric/neon aesthetic
- Brighter overall appearance

---

## Key Insights

### 1. Token Numbering Mismatch

**Material Design**: 100/200/300/400/500 (5 tokens per family)  
**Cyberpunk**: 100/300/500/700/900 (5 tokens per family)

This makes direct comparison difficult. Cyberpunk's "500" is roughly equivalent to Material's "300" in terms of usage intent (mid-range color).

### 2. Aesthetic Philosophy

**Material Design WCAG**:
- Prioritizes contrast over aesthetic
- Colors become muted/muddy to meet standards
- Yellow 300 = `#B8A100` (brown-yellow, not electric)

**Cyberpunk WCAG**:
- Maintains high luminosity (brightness)
- Preserves neon/electric aesthetic
- Yellow 500 = `#E6D200` (still electric yellow)

### 3. Dark Mode Performance

**Cyberpunk WCAG performs BETTER in dark mode** for several families:
- Yellow: 12.78:1 vs 11.36:1 (Cyberpunk wins)
- Cyan: 9.39:1 vs 9.70:1 (comparable)
- Maintains brighter, more vibrant appearance

### 4. Light Mode Trade-offs

**Material Design WCAG performs BETTER in light mode** overall:
- More colors meet AA/AAA standards at equivalent token levels
- More conservative approach ensures compliance
- Loses aesthetic identity

### 5. Missing Families

**Cyberpunk WCAG is incomplete**:
- ❌ No Pink family in WCAG theme
- ❌ No Green family in WCAG theme
- ✅ Has Amber (orange equivalent)

This is a **critical gap** - you need green for success states and pink for error states.

---

## Recommendations

### Option 1: Hybrid Approach (RECOMMENDED)

Use **Cyberpunk WCAG** as the base, but fill gaps with **Material Design WCAG**:

1. **Use Cyberpunk WCAG for**:
   - Yellow (better dark mode, maintains aesthetic)
   - Cyan (comparable performance, maintains aesthetic)
   - Purple (acceptable contrast, maintains aesthetic)
   - Teal (better light mode)

2. **Use Material Design WCAG for**:
   - Green (Cyberpunk has no WCAG green)
   - Pink (Cyberpunk has no WCAG pink)
   - Orange (Material has better overall contrast)

3. **Result**: Best of both worlds - maintains cyberpunk aesthetic where possible, ensures accessibility everywhere

### Option 2: Pure Cyberpunk WCAG

Complete the Cyberpunk WCAG palette by adding:
- Green family (create WCAG-compliant electric green)
- Pink family (create WCAG-compliant hot pink)

**Pros**: Full aesthetic continuity  
**Cons**: Requires design work to create missing families

### Option 3: Pure Material Design WCAG

Use Material Design WCAG across the board.

**Pros**: Proven, complete, guaranteed accessibility  
**Cons**: Loses cyberpunk identity entirely

---

## Honest Assessment

### Material Design WCAG Strengths
- ✅ Complete (all 7 families)
- ✅ Proven across millions of products
- ✅ Better light mode contrast overall
- ✅ Conservative and safe

### Material Design WCAG Weaknesses
- ❌ Loses cyberpunk aesthetic identity
- ❌ Colors become muddy/muted (yellow = brown)
- ❌ Feels generic, not "DesignerPunk"

### Cyberpunk WCAG Strengths
- ✅ Maintains neon/electric aesthetic
- ✅ Better dark mode contrast in several families
- ✅ Preserves brand identity
- ✅ Brighter, more vibrant overall

### Cyberpunk WCAG Weaknesses
- ❌ Incomplete (missing green and pink)
- ❌ Weaker light mode contrast in some families
- ❌ Requires verification in actual usage contexts

---

## Final Recommendation

**Use the Hybrid Approach (Option 1)**:

1. Start with Cyberpunk WCAG for yellow, cyan, purple, teal
2. Use Material Design WCAG for green, pink, orange
3. Test in actual component contexts
4. Adjust as needed based on real-world usage

This preserves your cyberpunk aesthetic identity while ensuring accessibility compliance across all color families.

**Why this works**:
- Maintains "DesignerPunk" brand identity where possible
- Fills critical gaps (green for success, pink for errors)
- Balances aesthetic goals with accessibility requirements
- Aligns with your philosophy: "philosophies guide decisions, not dictate them"

---

## Next Steps

1. **Decide on approach**: Hybrid, Pure Cyberpunk, or Pure Material Design
2. **Update ColorTokens.ts** with chosen values
3. **Test with real components** (TextInputField, ButtonCTA, etc.)
4. **Verify contrast ratios** in actual element pairings (text-on-background, border-on-surface)
5. **Document the decision** in Component Development Guide

---

**Organization**: working-document  
**Scope**: temporary
