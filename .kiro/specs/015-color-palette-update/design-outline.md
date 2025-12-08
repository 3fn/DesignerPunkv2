# Design Outline: Color Palette & Display Font Update

**Date**: December 7, 2025  
**Updated**: December 8, 2025  
**Spec**: 015 - Color Palette & Display Font Update  
**Status**: Design Exploration  
**Purpose**: Explore updated color palette with clearer semantic roles, better accessibility, and refreshed display typography

---

## Overview

This spec encompasses two related visual identity updates:

### Color Palette Update
Updating the DesignerPunk color palette from 9 families to 7 families with clearer functional roles and improved semantic mapping. Key changes:
- **Remove**: Violet (redundant with purple)
- **Add**: Electric Green (success states), Hot Pink (error/danger states)
- **Reassign**: Amber for warnings (better accessibility than yellow)
- **Clarify**: Yellow's new role (attention/highlight)

### Display Font Update
Updating the display font family from Inter to Rajdhani for headings and prominent text:
- **Current**: Inter (same as body text)
- **Proposed**: Rajdhani (distinct display font with cyberpunk aesthetic)
- **Impact**: Headings, labels, buttons, and UI elements using `fontFamilyDisplay`
- **Rationale**: Stronger visual hierarchy, better brand differentiation, cyberpunk design language alignment

---

## Current State Analysis

### Current Palette (9 Families)
1. **Yellow** - Warnings (current)
2. **Amber** - Warmth/analogous harmony
3. **Purple** - Brand/primary
4. **Violet** - Secondary brand/sophisticated depth
5. **Cyan** - Success (current - not ideal)
6. **Teal** - Info
7. **Orange** - Error (current)
8. Plus: Black, Gray, White (neutrals)

### Current Semantic Mapping Issues
- **Success = Cyan**: Tech/digital association, not universally recognized as success
- **Error = Orange**: Approachable but not urgent enough
- **Warning = Yellow**: Accessibility concerns (contrast issues)
- **Violet redundancy**: "Purple but less" - unclear functional purpose

---

## Proposed Palette (7 Families)

### Accent Colors (7 Families × 5 Variants = 35 Colors)

1. **Yellow** - ⚠️ **ROLE TBD** (see Open Questions)
2. **Amber** - ⚠️ Warnings (accessibility-first)
3. **Purple** - Brand identity, primary actions
4. **Hot Pink** - Error/danger, destructive actions
5. **Cyan** - Technology, information, data
6. **Teal** - Grounding, analogous harmony
7. **Electric Green** - ✅ Success, positive states, data visualization

### Neutrals (3 Families × 5 Variants = 15 Colors)
- **Black** - Backgrounds, depth (unchanged)
- **Gray** - Surfaces, text hierarchy (unchanged)
- **White** - Text, highlights (unchanged)

**Total**: 50 colors (35 accent + 15 neutral)

---

## Semantic Token Migration Strategy

### Critical Changes Required

#### 1. Success Tokens (Cyan → Green)
**Current**:
```typescript
'color.success.strong': { value: 'cyan400' }
'color.success.subtle': { value: 'cyan100' }
```

**Proposed**:
```typescript
'color.success.strong': { value: 'green400' }  // Electric green
'color.success.subtle': { value: 'green100' }
```

**Impact**: High - Success states are used throughout UI (form validation, confirmations, status indicators)

#### 2. Error Tokens (Orange → Pink)
**Current**:
```typescript
'color.error': { value: 'orange300' }
```

**Proposed**:
```typescript
'color.error.strong': { value: 'pink400' }     // Hot pink for critical errors
'color.error.subtle': { value: 'pink100' }     // Softer pink for backgrounds
```

**Impact**: High - Error states are critical for user feedback
**Note**: Consider splitting into strong/subtle like other status tokens

#### 3. Warning Tokens (Yellow → Amber)
**Current**:
```typescript
'color.warning.strong': { value: 'yellow400' }
'color.warning.subtle': { value: 'yellow100' }
```

**Proposed**:
```typescript
'color.warning.strong': { value: 'amber400' }  // Better contrast
'color.warning.subtle': { value: 'amber100' }
```

**Impact**: Medium - Improves accessibility (amber has better contrast than yellow)

#### 4. Secondary Brand Token (Violet → ?)
**Current**:
```typescript
'color.secondary': { value: 'violet300' }
```

**Options**:
- **Option A**: Map to `purple700` (darker purple for secondary)
- **Option B**: Map to `teal300` (distinct from primary)
- **Option C**: Remove secondary entirely (simplify to single brand color)

**Impact**: Medium - Secondary brand color used for secondary CTAs

#### 5. Info Tokens (Teal - Unchanged)
**Current**:
```typescript
'color.info.strong': { value: 'teal400' }
'color.info.subtle': { value: 'teal100' }
```

**Proposed**: No change (teal remains for informational states)

#### 6. Cyan Reassignment (Success → Tech/Data)
**Current**: Cyan used for success
**Proposed**: Cyan for technology, information, data contexts

**New Semantic Tokens Needed**:
```typescript
'color.tech': { value: 'cyan400' }      // Technology/digital contexts
'color.data': { value: 'cyan300' }      // Data visualization
```

**Impact**: Low - New semantic tokens, doesn't break existing usage

---

## Open Questions & Checkpoints

### ✅ Resolved: Yellow's Role - Attention/Highlight

**Decision**: Yellow serves as **Attention/Highlight** color (non-status)

**Role**: Draw attention without implying status meaning
- **Use cases**: Highlights, badges, promotional elements, featured content, "new" indicators
- **Semantic tokens**: `color.attention`, `color.highlight`
- **Distinction**: Unlike warnings (amber), yellow doesn't imply caution or risk - just "look here"

**Rationale**:
- Distinct from status colors (success/error/warning/info)
- Useful for promotional moments without status implications
- Maintains color theory balance (split-complementary with purple/green)
- Clear functional purpose that doesn't overlap with other colors

**Examples**:
- "New" badges on features
- Promotional callouts
- Highlighted search results
- Featured content cards
- Non-critical notifications that need attention

### 🟡 Secondary Decision: Hot Pink Intensity

**Question**: Is hot pink too aggressive for minor errors?

**Approach**:
- Use pink scale for intensity: `pink100` (subtle) → `pink500` (critical)
- Split semantic tokens: `color.error.subtle` vs `color.error.strong`
- Test in real UI contexts (form validation, error messages)

**Validation Needed**: Create examples showing pink at different intensities

### 🟢 Confirmed Decisions

✅ **Drop Violet**: Redundant with purple, unclear functional purpose  
✅ **Add Electric Green**: Clear success role, better than cyan  
✅ **Add Hot Pink**: Distinct error color, more urgent than orange  
✅ **Amber for Warnings**: Better accessibility than yellow  
✅ **Yellow for Attention**: Non-status highlights and promotional elements  
✅ **Keep Neutrals**: Black, Gray, White unchanged

---

## Color Theory Validation

### Split-Complementary Foundation
- **Primary**: Purple (brand)
- **Complementary**: Yellow (attention) + Green (success)
- **Analogous Extensions**: Pink (purple-adjacent), Amber (yellow-adjacent), Cyan/Teal (green-adjacent)

**Status**: ✅ Maintains color theory balance (if yellow stays)

### Semantic Clarity
- Success = Green ✅ (universal recognition)
- Error = Pink ❌ (urgent, critical)
- Warning = Amber ⚠️ (accessible, cautious)
- Info = Cyan ℹ️ (tech/digital)
- Brand = Purple 💜 (authority)

**Status**: ✅ Clear, unambiguous semantic mapping

---

## Accessibility Considerations

### WCAG 2.1 AA Compliance

**Amber vs Yellow for Warnings**:
- **Yellow on white**: Often fails contrast (3:1 ratio)
- **Amber on white**: Better contrast (4.5:1+ achievable)
- **Decision**: Amber is accessibility-first choice ✅

**Hot Pink for Errors**:
- **Concern**: Might be too vibrant for extended reading
- **Mitigation**: Use pink scale (100-500) for intensity control
- **Validation**: Test with WCAG contrast checker

**Electric Green for Success**:
- **Concern**: "Matrix green" might have accessibility issues
- **Mitigation**: Ensure green400+ meets 4.5:1 contrast on white
- **Validation**: Test across color blindness simulations

---

## Token Architecture Impact

### Primitive Token Changes

**New Primitive Families Needed**:
1. **Green Family** (5 variants: green100-green500)
   - Base: Electric green (#00FF00 range, adjusted for accessibility)
   - Scale: Modular progression maintaining mathematical relationships

2. **Pink Family** (5 variants: pink100-pink500)
   - Base: Hot pink (#FF1493 range, adjusted for accessibility)
   - Scale: Modular progression maintaining mathematical relationships

**Removed Primitive Family**:
- **Violet Family** (violet100-violet500) - No longer needed

**Modified Primitive Families**:
- **Amber Family**: Simplified hex values, better saturation progression

### Semantic Token Changes

**Total Semantic Color Tokens**:
- **Current**: 19 tokens (16 original + 3 glow)
- **Proposed**: 24 tokens (18 semantic + 3 tech/data + 3 glow)

**New Semantic Tokens**:
- `color.success.strong` (green400) - replaces cyan
- `color.success.subtle` (green100) - replaces cyan
- `color.error.strong` (pink400) - replaces orange
- `color.error.subtle` (pink100) - new
- `color.tech` (cyan400) - new role for cyan
- `color.data` (cyan300) - new role for cyan
- `color.attention` (yellow400) - attention/highlight (non-status)
- `color.highlight` (yellow300) - lighter attention variant
- `glow.neonGreen` (green500) - new glow color
- `glow.neonPink` (pink500) - new glow color

**Removed Semantic Tokens**:
- `color.secondary` (violet300) - IF we remove secondary brand concept

**Modified Semantic Tokens**:
- `color.warning.strong` (amber400) - was yellow400
- `color.warning.subtle` (amber100) - was yellow100

---

## Migration Complexity Assessment

### High Impact (Breaking Changes)
1. **Success color change** (cyan → green)
   - Components using `color.success.*` will change appearance
   - Visual regression testing required
   - User perception shift (cyan → green for success)

2. **Error color change** (orange → pink)
   - Error states will be more aggressive/urgent
   - May require intensity adjustments (pink100 vs pink400)
   - User perception shift (orange → pink for errors)

### Medium Impact (Semantic Shifts)
1. **Warning color change** (yellow → amber)
   - Improved accessibility (positive change)
   - Subtle visual shift (yellow → amber)
   - Less disruptive than success/error changes

2. **Secondary brand removal** (violet → ?)
   - Need to decide mapping (purple700, teal300, or remove)
   - Affects secondary CTAs and UI elements

### Low Impact (New Additions)
1. **Cyan reassignment** (success → tech/data)
   - New semantic tokens, doesn't break existing
   - Expands color vocabulary

2. **Yellow role** (IF kept)
   - New semantic tokens for attention/highlight
   - Doesn't affect existing tokens

---

## Implementation Considerations

### Build System Impact
- **Token generation**: Add green/pink families, remove violet
- **Cross-platform**: Generate green/pink for web/iOS/Android
- **Validation**: Update baseline grid validation for new colors
- **Tests**: Update color token tests for new families

### Component Impact
- **Audit needed**: Which components use `color.success.*`, `color.error`, `color.warning.*`
- **Visual regression**: Test all components with new colors
- **Documentation**: Update component READMEs with new color usage

### Design Tool Impact
- **Figma/Sketch**: Update color libraries with new palette
- **Style guides**: Update documentation with new semantic mapping
- **Examples**: Create new color usage examples

---

## Next Steps

### Before Requirements Phase
1. **Decide yellow's role** (Options A-D above)
2. **Validate hot pink intensity** (create examples)
3. **Choose secondary brand mapping** (purple700, teal300, or remove)
4. **Test accessibility** (WCAG contrast for amber, pink, green)

### Requirements Phase
- Formalize decisions into EARS requirements
- Define acceptance criteria for each color change
- Specify migration requirements for semantic tokens

### Design Phase
- Document primitive token specifications (green/pink families)
- Define semantic token mappings
- Create migration guide for existing components

### Implementation Phase
- Update primitive color tokens
- Update semantic color tokens
- Migrate existing components
- Update documentation and examples

---

## Observations & Learnings

### What's Working
- **Functional clarity**: Each color has a clear job (success, error, warning, etc.)
- **Accessibility-first**: Amber for warnings improves WCAG compliance
- **Semantic precision**: Better for AI agent collaboration (unambiguous color roles)

### What Needs Resolution
- **Yellow's purpose**: Critical decision before proceeding
- **Pink intensity**: Need real-world testing to validate approach
- **Secondary brand**: Decide mapping or removal strategy

### Design Philosophy Alignment
- **Mathematical foundation**: New colors must follow modular scale
- **Cross-platform unity**: Green/pink must work across web/iOS/Android
- **AI collaboration**: Clear semantic roles enable reliable AI usage

---

## Final Semantic Mapping Summary

### Complete Color Vocabulary (7 Accent Families)

1. **Yellow** → Attention/Highlight (non-status)
   - `color.attention` (yellow400)
   - `color.highlight` (yellow300)

2. **Amber** → Warnings (accessibility-first)
   - `color.warning.strong` (amber400)
   - `color.warning.subtle` (amber100)

3. **Purple** → Brand/Primary
   - `color.primary` (purple300)

4. **Hot Pink** → Error/Danger
   - `color.error.strong` (pink400)
   - `color.error.subtle` (pink100)

5. **Cyan** → Technology/Data
   - `color.tech` (cyan400)
   - `color.data` (cyan300)
   - `color.info.strong` (cyan400) - keep for backward compatibility
   - `color.info.subtle` (cyan100) - keep for backward compatibility

6. **Teal** → Informational (grounding)
   - `color.info.strong` (teal400) - OR migrate to cyan
   - `color.info.subtle` (teal100) - OR migrate to cyan

7. **Electric Green** → Success
   - `color.success.strong` (green400)
   - `color.success.subtle` (green100)

**Note**: Need to decide if info tokens stay with teal or migrate to cyan (see Open Questions below)

### Glow Colors (3 Tokens)
- `glow.neonPurple` (purple500)
- `glow.neonCyan` (cyan500)
- `glow.neonYellow` (yellow500)
- `glow.neonGreen` (green500) - NEW
- `glow.neonPink` (pink500) - NEW

### Text & Surfaces (7 Tokens - Unchanged)
- `color.text.default` (gray300)
- `color.text.muted` (gray200)
- `color.text.subtle` (gray100)
- `color.text.onPrimary` (white100)
- `color.background` (white100)
- `color.surface` (white200)
- `color.border` (gray100)

**Total**: 24 semantic color tokens (up from 19)

---

## Remaining Open Questions

### ✅ Resolved: Info Token Assignment

**Decision**: **Keep Teal for Info** - Teal's grounding quality is distinct from cyan's tech/data energy

**Rationale**:
- Teal provides calming, grounding quality for informational states
- Distinct from cyan's energetic tech/data associations
- Info states benefit from teal's approachability vs cyan's technical feel
- Maintains clear separation: cyan = tech/data, teal = general information

**Semantic Tokens**:
- `color.info.strong` (teal400) - unchanged
- `color.info.subtle` (teal100) - unchanged

### ✅ Resolved: Secondary Brand Token

**Decision**: **Remove `color.secondary` entirely** - Simplify to single brand color

**Rationale**:
- Most design systems use single primary brand color
- Secondary actions can use `purple700` directly without semantic abstraction
- Reduces token complexity and decision fatigue
- Components can reference purple variants directly when needed

**Migration Strategy**:
- Remove `color.secondary` semantic token
- Update components using `color.secondary` to use `purple700` directly
- Document in migration guide

---

---

## Display Font Family Update

### Current State

**fontFamilyDisplay Token**:
```typescript
fontFamilyDisplay: {
    platforms: generateFontFamilyPlatformValues(
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    )
}
```

**Current Usage**:
- Same font stack as `fontFamilyBody` (Inter)
- No visual distinction between body text and display text
- Headings blend with body content
- Lacks strong visual hierarchy
- **No font files currently in project** - Inter loads from system fonts via fallback

**Problem**: Inter is excellent for body text but doesn't provide enough differentiation for display purposes. The system needs a distinct display font that:
- Creates clear visual hierarchy
- Aligns with cyberpunk/tech aesthetic
- Maintains readability at large sizes
- Works across all platforms

### Why This Update is Simple

**Token Architecture Advantage**: The existing token system makes this update remarkably simple:

1. **Single primitive token change**: Only `fontFamilyDisplay` needs updating
2. **Zero semantic token changes**: All 15 typography tokens already reference `fontFamilyDisplay`
3. **Automatic component inheritance**: Components use semantic tokens, so they automatically get Rajdhani
4. **No component code changes**: Token system handles the font change completely

**What Actually Changes**:
```typescript
// Before (in FontFamilyTokens.ts)
fontFamilyDisplay: {
    platforms: generateFontFamilyPlatformValues(
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    )
}

// After (in FontFamilyTokens.ts)
fontFamilyDisplay: {
    platforms: generateFontFamilyPlatformValues(
        'Rajdhani, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    )
}
```

That's it. One line change. Everything else is adding font files and configuring font loading.

### Proposed Change: Rajdhani

**Implementation Simplicity**:
This is a **single primitive token change** - only `fontFamilyDisplay` needs updating. All 15 semantic typography tokens (headings, labels, buttons) already reference `fontFamilyDisplay`, so they'll automatically inherit Rajdhani once the primitive token is updated.

**New fontFamilyDisplay Token**:
```typescript
fontFamilyDisplay: {
    platforms: generateFontFamilyPlatformValues(
        'Rajdhani, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    )
}
```

**Rajdhani Characteristics**:
- **Style**: Geometric sans-serif with tech/cyberpunk aesthetic
- **Weights**: Available in 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Design**: Clean, modern, slightly condensed letterforms
- **Readability**: Excellent at display sizes (headings, labels, buttons)
- **Aesthetic**: Aligns with DesignerPunk's cyberpunk/tech design language

**Font Files to Add**:

Both Inter and Rajdhani font files will be stored in the project to ensure consistent cross-platform rendering:

```
src/assets/fonts/
  inter/
    Inter-Regular.ttf
    Inter-Regular.woff
    Inter-Regular.woff2
    Inter-Medium.ttf
    Inter-Medium.woff
    Inter-Medium.woff2
    Inter-SemiBold.ttf
    Inter-SemiBold.woff
    Inter-SemiBold.woff2
    Inter-Bold.ttf
    Inter-Bold.woff
    Inter-Bold.woff2
  rajdhani/
    Rajdhani-Regular.ttf
    Rajdhani-Regular.woff
    Rajdhani-Regular.woff2
    Rajdhani-Medium.ttf
    Rajdhani-Medium.woff
    Rajdhani-Medium.woff2
    Rajdhani-SemiBold.ttf
    Rajdhani-SemiBold.woff
    Rajdhani-SemiBold.woff2
    Rajdhani-Bold.ttf
    Rajdhani-Bold.woff
    Rajdhani-Bold.woff2
```

**File Format Strategy**:
- **TTF**: For iOS/Android native platforms
- **WOFF/WOFF2**: For web (WOFF2 preferred for better compression)
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700)

### Impact Analysis

#### Typography Token Changes

**Affected Semantic Typography Tokens**:
All typography tokens using `fontFamilyDisplay` will change appearance:

1. **Heading Tokens** (6 tokens):
   - `typography.h1` → Rajdhani
   - `typography.h2` → Rajdhani
   - `typography.h3` → Rajdhani
   - `typography.h4` → Rajdhani
   - `typography.h5` → Rajdhani
   - `typography.h6` → Rajdhani

2. **Label Tokens** (4 tokens):
   - `typography.labelXs` → Rajdhani
   - `typography.labelSm` → Rajdhani
   - `typography.labelMd` → Rajdhani
   - `typography.labelLg` → Rajdhani

3. **Button Tokens** (3 tokens):
   - `typography.buttonSm` → Rajdhani
   - `typography.buttonMd` → Rajdhani
   - `typography.buttonLg` → Rajdhani

4. **UI Tokens** (2 tokens):
   - `typography.caption` → Rajdhani
   - `typography.overline` → Rajdhani

**Total Impact**: 15 semantic typography tokens will use Rajdhani instead of Inter

#### Component Impact

**High Impact Components** (Direct usage of display typography):
- **ButtonCTA**: Uses `typography.buttonMd` (Rajdhani)
- **TextInputField**: Uses `typography.labelMd` for labels (Rajdhani)
- **Container**: May use heading tokens for titles (Rajdhani)
- **Future components**: Any component using heading/label/button typography

**Visual Changes**:
- Buttons will have more distinctive, tech-forward appearance
- Form labels will be more prominent and readable
- Headings will create stronger visual hierarchy
- UI elements will feel more cohesive with cyberpunk aesthetic

#### Platform Considerations

**Web**:
- Font files need to be hosted and loaded via `@font-face`
- Fallback to system fonts if Rajdhani fails to load
- Consider font loading performance (FOUT/FOIT strategies)

**iOS**:
- Custom font files need to be bundled in app
- Update Info.plist with font file references
- Fallback to SF Pro Display if Rajdhani unavailable

**Android**:
- Custom font files need to be in `assets/fonts/` directory
- Load fonts programmatically or via XML
- Fallback to Roboto if Rajdhani unavailable

### Font Loading Strategy

#### Web Implementation

**@font-face Declarations** (both Inter and Rajdhani):

```css
/* Inter - Body Font */
@font-face {
    font-family: 'Inter';
    src: url('/assets/fonts/inter/Inter-Regular.woff2') format('woff2'),
         url('/assets/fonts/inter/Inter-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Inter';
    src: url('/assets/fonts/inter/Inter-Medium.woff2') format('woff2'),
         url('/assets/fonts/inter/Inter-Medium.woff') format('woff');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Inter';
    src: url('/assets/fonts/inter/Inter-SemiBold.woff2') format('woff2'),
         url('/assets/fonts/inter/Inter-SemiBold.woff') format('woff');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Inter';
    src: url('/assets/fonts/inter/Inter-Bold.woff2') format('woff2'),
         url('/assets/fonts/inter/Inter-Bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}

/* Rajdhani - Display Font */
@font-face {
    font-family: 'Rajdhani';
    src: url('/assets/fonts/rajdhani/Rajdhani-Regular.woff2') format('woff2'),
         url('/assets/fonts/rajdhani/Rajdhani-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Rajdhani';
    src: url('/assets/fonts/rajdhani/Rajdhani-Medium.woff2') format('woff2'),
         url('/assets/fonts/rajdhani/Rajdhani-Medium.woff') format('woff');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Rajdhani';
    src: url('/assets/fonts/rajdhani/Rajdhani-SemiBold.woff2') format('woff2'),
         url('/assets/fonts/rajdhani/Rajdhani-SemiBold.woff') format('woff');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Rajdhani';
    src: url('/assets/fonts/rajdhani/Rajdhani-Bold.woff2') format('woff2'),
         url('/assets/fonts/rajdhani/Rajdhani-Bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}
```

**Font Loading Performance**:
- Use `font-display: swap` to prevent invisible text (FOIT)
- WOFF2 format provides ~30% better compression than WOFF
- Consider preloading critical font weights (Medium, SemiBold)
- Fallback fonts in token stack ensure graceful degradation

#### iOS Implementation

**Info.plist Configuration** (both Inter and Rajdhani):
```xml
<key>UIAppFonts</key>
<array>
    <!-- Inter - Body Font -->
    <string>Inter-Regular.ttf</string>
    <string>Inter-Medium.ttf</string>
    <string>Inter-SemiBold.ttf</string>
    <string>Inter-Bold.ttf</string>
    <!-- Rajdhani - Display Font -->
    <string>Rajdhani-Regular.ttf</string>
    <string>Rajdhani-Medium.ttf</string>
    <string>Rajdhani-SemiBold.ttf</string>
    <string>Rajdhani-Bold.ttf</string>
</array>
```

**SwiftUI Usage**:
```swift
// Display text (headings, labels, buttons)
Text("Heading")
    .font(.custom("Rajdhani", size: 24))
    .fontWeight(.semibold)

// Body text (paragraphs, descriptions)
Text("Body content")
    .font(.custom("Inter", size: 16))
    .fontWeight(.regular)
```

#### Android Implementation

**Font Directory Structure**:
```
app/src/main/res/font/
    inter_regular.ttf
    inter_medium.ttf
    inter_semibold.ttf
    inter_bold.ttf
    rajdhani_regular.ttf
    rajdhani_medium.ttf
    rajdhani_semibold.ttf
    rajdhani_bold.ttf
```

**Jetpack Compose Usage**:
```kotlin
// Define font families
val interFamily = FontFamily(
    Font(R.font.inter_regular, FontWeight.Normal),
    Font(R.font.inter_medium, FontWeight.Medium),
    Font(R.font.inter_semibold, FontWeight.SemiBold),
    Font(R.font.inter_bold, FontWeight.Bold)
)

val rajdhaniFamily = FontFamily(
    Font(R.font.rajdhani_regular, FontWeight.Normal),
    Font(R.font.rajdhani_medium, FontWeight.Medium),
    Font(R.font.rajdhani_semibold, FontWeight.SemiBold),
    Font(R.font.rajdhani_bold, FontWeight.Bold)
)

// Display text (headings, labels, buttons)
Text(
    text = "Heading",
    fontFamily = rajdhaniFamily,
    fontWeight = FontWeight.SemiBold
)

// Body text (paragraphs, descriptions)
Text(
    text = "Body content",
    fontFamily = interFamily,
    fontWeight = FontWeight.Normal
)
```

### Migration Complexity Assessment

#### Low Impact (Single Token Change)
- **Primitive token change**: Update `fontFamilyDisplay` from `'Inter, ...'` to `'Rajdhani, ...'`
- **Semantic tokens**: Zero changes needed (already reference `fontFamilyDisplay`)
- **Components**: Automatically inherit Rajdhani through token system
- **Implementation**: Literally one line change in `FontFamilyTokens.ts`

#### Medium Impact (Font File Addition)
- **Add font files**: Both Inter and Rajdhani to `src/assets/fonts/`
- **Web**: Create @font-face declarations for both fonts
- **iOS**: Bundle font files, update Info.plist with both fonts
- **Android**: Add font files to res/font/, configure both font families
- **Note**: This is additive work, not migration - no existing code changes

#### High Impact (Visual Regression)
- **All components**: Visual appearance changes for headings, labels, buttons
- **Testing needed**: Visual regression tests for all affected components
- **Documentation**: Update component examples and screenshots
- **User perception**: Noticeable brand refresh across all display typography

### Design Philosophy Alignment

**Mathematical Foundation**: ✅ Font family tokens are categorical (not mathematical), so no mathematical validation needed

**Cross-Platform Unity**: ✅ Same Rajdhani font across all platforms maintains visual consistency

**AI Collaboration**: ✅ Clear semantic role (`fontFamilyDisplay` = Rajdhani) enables unambiguous AI usage

**Cyberpunk Aesthetic**: ✅ Rajdhani's geometric, tech-forward design aligns with DesignerPunk's visual identity

### Open Questions

#### ✅ Resolved: Font Weight Mapping

**Question**: Which Rajdhani weights should we use for different typography tokens?

**Decision**:
- **Headings (h1-h6)**: SemiBold (600) for prominence
- **Labels**: Medium (500) for readability
- **Buttons**: SemiBold (600) for emphasis
- **Caption/Overline**: Regular (400) for subtlety

**Rationale**: Matches existing weight hierarchy in typography tokens

#### ✅ Resolved: Font File Storage Location

**Decision**: Store font files in `src/assets/fonts/` organized by font family

**Directory Structure**:
```
src/assets/fonts/
  inter/          # Body font
  rajdhani/       # Display font
```

**Rationale**:
- **True Native Architecture**: Fonts are part of design system source, not just web assets
- **Cross-platform**: iOS/Android need fonts bundled in app, not served from public directory
- **Token system alignment**: Assets that are part of token system should live in `src/`
- **Build system control**: Bundler can optimize font loading (subset, compress, etc.)

#### 🟡 Pending: Font Loading Performance

**Question**: Should we preload Rajdhani fonts or load on-demand?

**Options**:
- **Option A**: Preload critical weights (SemiBold, Medium) for faster initial render
- **Option B**: Load all weights on-demand to reduce initial bundle size
- **Option C**: Subset fonts to include only needed characters (Latin + numbers)

**Recommendation**: Start with Option A (preload critical weights), optimize later if needed

#### 🟡 Pending: Fallback Font Testing

**Question**: How do we ensure graceful degradation if fonts fail to load?

**Approach**:
- Test fallback font stack on all platforms
- Ensure system fonts provide acceptable appearance
- Document fallback behavior in component READMEs
- Both Inter and Rajdhani have system font fallbacks in token stack

---

## Combined Update Strategy

### Phase 1: Color Palette Update
1. Add green/pink primitive token families
2. Remove violet primitive token family
3. Update semantic color tokens (success, error, warning)
4. Migrate existing components to new color tokens
5. Visual regression testing for color changes

### Phase 2: Display Font Update
1. Add Rajdhani font files to project
2. Update `fontFamilyDisplay` primitive token
3. Configure font loading for web/iOS/Android
4. Visual regression testing for typography changes
5. Update component documentation and examples

### Phase 3: Combined Validation
1. Test components with both color and font changes
2. Verify cross-platform consistency
3. Validate accessibility (WCAG contrast with new colors + Rajdhani)
4. Update design system documentation

### Benefits of Combined Update
- **Single migration**: Components update once for both changes
- **Cohesive refresh**: Color and typography changes feel intentional together
- **Reduced disruption**: One visual regression cycle instead of two
- **Brand evolution**: Complete visual identity refresh in one release

---

## Design Outline Complete ✅

### Color Palette Decisions Resolved:

1. ✅ **Yellow = Attention/Highlight** (non-status promotional elements)
2. ✅ **Amber = Warnings** (accessibility-first)
3. ✅ **Green = Success** (universal recognition)
4. ✅ **Pink = Error/Danger** (urgent, critical)
5. ✅ **Teal = Info** (grounding, calming)
6. ✅ **Cyan = Tech/Data** (energetic, technical)
7. ✅ **Purple = Brand** (single primary, no secondary)

**Final Color Token Count**: 23 semantic color tokens (down from 24 - removed `color.secondary`)

### Display Font Decisions Resolved:

1. ✅ **Rajdhani for Display** (headings, labels, buttons, UI elements)
2. ✅ **Inter for Body** (body text, paragraphs - unchanged)
3. ✅ **Font Weight Mapping** (SemiBold for headings/buttons, Medium for labels)
4. ✅ **Cross-Platform Strategy** (same font across web/iOS/Android)

**Typography Token Impact**: 15 semantic typography tokens will use Rajdhani

### Combined Update Benefits:

- **Cohesive Visual Refresh**: Color and typography changes complement each other
- **Single Migration**: Components update once for both changes
- **Stronger Brand Identity**: Cyberpunk aesthetic reinforced through both color and typography
- **Better Hierarchy**: New colors + distinct display font create clearer visual structure

**Status**: Ready to proceed to requirements phase for combined color palette + display font update.

