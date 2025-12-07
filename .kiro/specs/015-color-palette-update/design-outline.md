# Design Outline: Color Palette Update

**Date**: December 7, 2025  
**Spec**: 015 - Color Palette Update  
**Status**: Design Exploration  
**Purpose**: Explore updated color palette with clearer semantic roles and better accessibility

---

## Overview

Updating the DesignerPunk color palette from 9 families to 7 families with clearer functional roles and improved semantic mapping. Key changes:
- **Remove**: Violet (redundant with purple)
- **Add**: Electric Green (success states), Hot Pink (error/danger states)
- **Reassign**: Amber for warnings (better accessibility than yellow)
- **Clarify**: Yellow's new role (TBD)

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

## Design Outline Complete ✅

All critical decisions resolved:

1. ✅ **Yellow = Attention/Highlight** (non-status promotional elements)
2. ✅ **Amber = Warnings** (accessibility-first)
3. ✅ **Green = Success** (universal recognition)
4. ✅ **Pink = Error/Danger** (urgent, critical)
5. ✅ **Teal = Info** (grounding, calming)
6. ✅ **Cyan = Tech/Data** (energetic, technical)
7. ✅ **Purple = Brand** (single primary, no secondary)

**Final Token Count**: 23 semantic color tokens (down from 24 - removed `color.secondary`)

**Status**: Ready to proceed to requirements phase.

