# ButtonCTA Confirmed Actions

**Date**: December 18, 2025
**Component**: ButtonCTA
**Platforms**: Web, iOS, Android
**Status**: Human Review Complete
**Reviewer**: Peter Michaels Allen

---

## Executive Summary

Human review of ButtonCTA audit findings complete. All 28 findings have been categorized into actionable decisions:

- **Accept**: 15 findings (implement as recommended)
- **Modify**: 8 findings (implement with modifications)
- **Reject**: 0 findings
- **Escalate**: 0 findings
- **No Action**: 5 findings (intentional differences or positive findings)

**Key Modifications**:
- Typography tokens: Use `typography.labelMd/labelLg` (medium weight) instead of `typography.bodyMd/bodyLg` (regular weight)
- Motion tokens: Document iOS-specific platform pattern for scale/animation pairing
- Height strategy: Use calculated heights with Tap Area tokens for minHeight
- minWidth tokens: Create `button.minWidth` variants using semantic size naming
- Optical balance: All platforms should use `color.icon.opticalBalance` blend token
- Disabled state: Use `blend.disabledDesaturate` token instead of opacity

---

## Holistic Issues (H1-H3)

### H1: Inconsistent Motion Token Usage
**Decision**: MODIFY
**Platform**: iOS
**Modification**:
- Use existing `scale096` (0.96) instead of hard-coded 0.97 (1% difference is imperceptible)
- Use `DesignTokens.motionButtonPress` for animation
- Document as iOS-specific platform pattern (scale + motion pairing)
- Note: Scale and animation pairing are for supporting unique iOS platform conventions

**Rationale**: iOS requires specific scale/animation pairing for platform conventions. Use existing scale token to avoid creating new token for imperceptible difference.

---

### H2: Missing Height Strategy Documentation
**Decision**: MODIFY
**Modification**:
- Heights should always be calculated (padding + lineHeight)
- Use Tap Area tokens (`tapAreaMinimum`, `tapAreaRecommended`, `tapAreaComfortable`) for minHeight
- Visual sizes (40px, 48px, 52px) are examples, not expectations
- Interactive elements can appear smaller visually but must meet tap target standards via Tap Area tokens
- Document height calculation strategy in README

**Rationale**: Calculated heights provide flexibility while Tap Area tokens ensure accessibility compliance. Visual appearance can be smaller than tap targets.

---

### H3: Inconsistent minWidth Token Approach
**Decision**: MODIFY
**Modification**:
1. Evaluate whether minWidth values should be component-specific tokens
2. If yes, create `button.minWidth` variants using semantic size variants (example: small/medium/large) for developer clarity
3. Token values should align to existing primitive tokens (compositional architecture)
4. Semantic naming (small/medium/large) can be used but must balance component needs with system conventions
5. Small, Medium, and Large don't have to align to explicit space700, space900, space1000 values

**Rationale**: Component-specific tokens with semantic naming provide clarity while maintaining compositional architecture. Naming should balance component needs with system conventions.

---

## iOS Issues (I1-I10)

### I1: Local Token Constants Instead of DesignTokens Imports
**Decision**: ACCEPT
**Action**: Remove local constants (lines 308-320), import DesignTokens module, use `DesignTokens.tokenName` pattern
**Impact**: High - Eliminates maintenance burden and token drift risk
**Note**: iOS tokens already in correct `UIColor(red:green:blue:alpha:)` format

---

### I2: Using Primitive Token Instead of Semantic colorTextOnPrimary
**Decision**: ACCEPT
**Action**: Replace `white100` with `DesignTokens.colorTextOnPrimary` (lines 249, 281)
**Impact**: Medium - Improves semantic meaning

---

### I3: Missing colorIconOpticalBalance Token Usage
**Decision**: ACCEPT
**Action**: Use `colorIconOpticalBalance` blend token for secondary/tertiary button icons
**Impact**: Medium - Icons will have proper optical weight compensation
**Note**: All platforms should leverage `color.icon.opticalBalance` blend token

---

### I4: Motion Token Not Imported
**Decision**: ACCEPT
**Action**: Import and use `DesignTokens.motionButtonPress` (line 211)
**Impact**: High - Fixes compilation issue

---

### I5: Hard-Coded minWidth Values
**Decision**: Already decided via H3 (MODIFY)
**Action**: Deferred to holistic finding H3
**Impact**: Low

---

### I6: Hard-Coded Typography Values Instead of Typography Tokens
**Decision**: MODIFY
**Modification**: Use `typography.labelMd` and `typography.labelLg` instead of `typography.bodyMd` and `typography.bodyLg`
**Rationale**: Buttons are interactive UI elements that benefit from medium weight (fontWeight500) for visual emphasis and clarity. Label tokens are semantically appropriate for UI controls.
**Action**: 
- Small/Medium: Use `DesignTokens.typographyLabelMd` (16px, fontWeight500)
- Large: Use `DesignTokens.typographyLabelLg` (18px, fontWeight500)
**Impact**: Medium - Improves button visual prominence and semantic correctness

---

### I7: Hard-Coded Spacing Values Instead of Spacing Tokens
**Decision**: ACCEPT
**Action**: Replace hard-coded values with `DesignTokens.spaceInsetXXX` references (lines 232-250)
**Impact**: Medium

---

### I8: Hard-Coded Radius Values Instead of Radius Tokens
**Decision**: ACCEPT
**Action**: Replace hard-coded values with `DesignTokens.radiusXXX` references (lines 252-260)
**Impact**: Medium

---

### I9: Hard-Coded Icon Size Values
**Decision**: ACCEPT
**Action**: Use `icon.size100` token (if Icon component is being used as it should, size should be available)
**Impact**: Low
**Note**: icon.size100 is the accurate token

---

### I10: Hard-Coded Icon-Text Spacing Values
**Decision**: ACCEPT
**Action**: Replace hard-coded values with `space.grouped.tight` and `space.grouped.normal` tokens (lines 299-307)
**Impact**: Low

---

## Android Issues (A1-A4)

### A1: Hard-Coded minWidth Values
**Decision**: Already decided via H3 (MODIFY)
**Action**: Deferred to holistic finding H3
**Impact**: Low

---

### A2: Inconsistent Typography Token Usage Pattern
**Decision**: MODIFY
**Modification**: Use `typography.labelMd` and `typography.labelLg` semantic tokens instead of constructing from primitives
**Rationale**: Same as I6 - buttons should use label tokens with medium weight for emphasis
**Action**:
- Small/Medium: Use `DesignTokens.typography_label_md` semantic token
- Large: Use `DesignTokens.typography_label_lg` semantic token
- Ensure all typography properties (fontFamily, letterSpacing) are included
**Impact**: Medium - Improves semantic meaning and includes all typography properties

---

### A3: Icon Size Token Type Mismatch
**Decision**: ACCEPT
**Action**: Change `SizeConfig.iconSize` type from `Int` to `Dp`, use tokens directly without conversion
**Impact**: Low - Eliminates unnecessary type conversions

---

### A4: Excellent Token Compliance Overall
**Decision**: No Action (Positive Finding)
**Note**: Use Android implementation as reference example for token compliance
**Impact**: Positive

---

## Web Issues (W1-W9)

### W1: Strong Token Compliance Overall
**Decision**: No Action (Positive Finding)
**Note**: Use Web implementation as reference example for token compliance excellence
**Impact**: Positive

---

### W2: Comprehensive Documentation Comments
**Decision**: No Action (Positive Finding)
**Note**: Use Web's documentation style as template for other platforms
**Impact**: Positive

---

### W3: Hard-Coded minWidth Values
**Decision**: Already decided via H3 (MODIFY)
**Action**: Deferred to holistic finding H3
**Impact**: Low

---

### W4: Hard-Coded minHeight Values
**Decision**: Already decided via H2 (MODIFY)
**Action**: Deferred to holistic finding H2
**Impact**: Low

---

### W5: Optical Balance CSS Filter Approximation
**Decision**: MODIFY
**Modification**: All platforms should use `color.icon.opticalBalance` blend token (blend200 LIGHTER = 8% lighter)
**Rationale**: Blend token exists and should be used consistently across platforms instead of CSS filter approximation
**Action**: Apply blend to base color (not CSS filter approximation)
**Impact**: Medium - Ensures consistent optical balance across platforms

---

### W6: Disabled State Opacity Not Tokenized
**Decision**: MODIFY
**Modification**: Use `blend.disabledDesaturate` token (12% less saturated) instead of hard-coded `opacity: 0.5`
**Rationale**: Blend token exists for disabled states and should be used for consistency
**Action**: Replace `opacity: 0.5` with `blend.disabledDesaturate` application
**Impact**: Medium - Proper disabled state appearance using desaturation
**Note**: Not addressing whether disabled states should exist (out of scope for this audit)

---

### W7: Hard-Coded Border Width in Secondary Button
**Decision**: ACCEPT
**Action**: Replace `1px` with `var(--border-border-default)` token (line 174)
**Impact**: Medium

---

### W8: Hard-Coded Values in Print Styles
**Decision**: MODIFY
**Modification**: Use `color.print.default` semantic token instead of `#000`
**Action**:
- Replace `color: #000` with `color: var(--color-print-default)`
- Replace `border: 1px solid #000` with `border: var(--border-border-default) solid var(--color-print-default)`
**Rationale**: Semantic token exists specifically for print media
**Impact**: Low - Print styles are edge cases but should use tokens

---

### W9: Hard-Coded Border Widths in High Contrast Mode
**Decision**: ACCEPT
**Action**: Replace hard-coded `2px` and `3px` with appropriate tokens (line 378)
**Impact**: Low - High contrast mode is edge case but should use tokens

---

## Intentional Differences (D1-D3)

### D1: Platform-Specific Interaction Patterns
**Decision**: ACCEPT (No Action)
**Rationale**: Follows platform conventions and user expectations
**Note**: Documented in design document Decision 4

---

### D2: Icon Integration Approach
**Decision**: ACCEPT (No Action)
**Rationale**: Each platform uses its native component architecture
**Note**: All achieve same visual result with proper token usage

---

### D3: Typography Implementation
**Decision**: ACCEPT (No Action)
**Rationale**: Each platform uses its native typography system while maintaining visual consistency

---

## Implementation Priority

### High Priority (Compilation/Critical Issues)
1. **I1**: Remove local token constants and import DesignTokens (iOS)
2. **I4**: Fix motionButtonPress token usage (iOS compilation issue)

### Medium Priority (Token Compliance)
3. **I2**: Use colorTextOnPrimary semantic token (iOS)
4. **I3**: Use colorIconOpticalBalance blend token (iOS)
5. **I6**: Use typography.labelMd/labelLg tokens (iOS)
6. **I7**: Use spacing tokens (iOS)
7. **I8**: Use radius tokens (iOS)
8. **A2**: Use typography.labelMd/labelLg semantic tokens (Android)
9. **W5**: Use color.icon.opticalBalance blend token (Web)
10. **W6**: Use blend.disabledDesaturate token (Web)
11. **W7**: Use border.borderDefault token (Web)
12. **W8**: Use color.print.default token (Web)

### Low Priority (Minor Issues)
13. **I9**: Use icon.size100 token (iOS)
14. **I10**: Use grouped spacing tokens (iOS)
15. **A3**: Fix icon size type conversion (Android)
16. **W9**: Use tokens for high contrast mode (Web)

### Spec-Level Changes (Requires Design Updates)
17. **H1**: Document iOS motion pattern, use scale096 token
18. **H2**: Document height calculation strategy with Tap Area tokens
19. **H3**: Create button.minWidth tokens with semantic naming

---

## Next Steps

1. **Update Design Document**: Incorporate H1, H2, H3 modifications into design.md
2. **Create Missing Tokens**: If button.minWidth tokens are needed (H3 decision pending)
3. **Implementation**: Address findings in priority order
4. **Verification**: Run tests and verify cross-platform consistency
5. **Documentation**: Update Component Development Guide with patterns learned

---

*Human review completed December 18, 2025. Ready for implementation phase.*
