# Component Cleanup Plan

**Date**: December 11, 2025
**Task**: 5.1 Audit remaining components
**Status**: Planning Complete

---

## Executive Summary

**Total Components Audited**: 28
**Total Violations Found**: 111
- **High Priority** (Colors, Spacing): 109
- **Medium Priority** (Motion): 2
- **Low Priority** (Edge Cases): 0

**Components Already Cleaned**: 2
- ButtonCTA (1 violation remaining in web)
- TextInputField (23 violations remaining)

**Components Requiring Cleanup**: 4
- Icon (34 violations)
- Container (47 violations)
- TextInputField.browser.ts (13 violations - legacy file)

---

## Priority 1: Icon Component (34 violations)

**Impact**: High - Icon is used across multiple components
**Complexity**: Medium - Mostly documentation/example violations
**Estimated Effort**: 2-3 hours

### Violations Breakdown
- **Android Platform**: 32 violations (all in documentation/examples)
  - Hard-coded size values in comments: 16.dp, 24.dp, 32.dp, 40.dp
  - Hard-coded size values in preview examples
  - All violations are in non-production code (comments, previews)

- **Web Platform**: 2 violations
  - Line 220 (backward-compatibility test): Fallback pattern `? 32 : 24`
  - Line 165 (web test): Hard-coded `8px` in test assertion

### Cleanup Strategy
1. **Android Documentation**: Update comments to reference token names instead of hard-coded values
2. **Android Preview**: Replace hard-coded dp values with token references
3. **Web Tests**: 
   - Remove fallback pattern in backward-compatibility test
   - Update test assertion to check for token reference instead of hard-coded value

### Token Mapping
- `16.dp` → `iconSize075` (or appropriate icon size token)
- `24.dp` → `iconSize100` (standard icon size)
- `32.dp` → `iconSize125` (large icon size)
- `40.dp` → `iconSize150` (extra large icon size)

---

## Priority 2: Container Component (47 violations)

**Impact**: High - Container is a foundational layout component
**Complexity**: High - Many violations in Android TokenMapping.kt
**Estimated Effort**: 4-5 hours

### Violations Breakdown
- **Android TokenMapping.kt**: 44 violations
  - Hard-coded `0.dp` values (15 occurrences) - used for "None" values
  - Hard-coded border widths: 1.dp, 2.dp, 4.dp
  - Hard-coded radius values: 4.dp, 8.dp, 16.dp
  - Hard-coded elevation values: 2.dp, 4.dp, 8.dp, 16.dp, 24.dp
  - Hard-coded color: `Color(0xFFE5E7EB)` for border

- **Web Platform**: 3 violations
  - Hard-coded `2px` for focus outline width (2 occurrences)
  - Hard-coded `2px` for high contrast border width

### Cleanup Strategy
1. **Android TokenMapping.kt**:
   - Replace `0.dp` with appropriate "none" or "minimal" token references
   - Replace border widths with border token references
   - Replace radius values with radius token references
   - Replace elevation values with elevation token references
   - Replace hard-coded color with semantic color token

2. **Web Platform**:
   - Replace focus outline width with accessibility token
   - Replace high contrast border width with border token

### Token Mapping
- `0.dp` → Keep as `0.dp` (represents "none" - legitimate use case)
- `1.dp` → `borderDefault`
- `2.dp` → `borderEmphasis` or `space.grouped.minimal`
- `4.dp` → `space.grouped.tight` or `radius050`
- `8.dp` → `space.grouped.normal` or `radius100`
- `16.dp` → `space.related.normal` or `radius200`
- `24.dp` → `space.related.loose`
- `Color(0xFFE5E7EB)` → `colorBorder` (semantic token)

### Special Considerations
- Many `0.dp` values represent "None" enum values - these are legitimate
- Documentation examples use hard-coded values for clarity - consider if these should be updated
- Elevation mapping is placeholder code - may need semantic elevation tokens

---

## Priority 3: TextInputField.browser.ts (13 violations)

**Impact**: Medium - Legacy file, may be deprecated
**Complexity**: Low - All color fallback patterns
**Estimated Effort**: 1 hour

### Violations Breakdown
- **All Color Fallbacks**: 13 violations
  - Background: `#FFFFFF`
  - Border: `#D1D5DB`
  - Primary: `#3B82F6`
  - Error: `#EF4444`
  - Success: `#10B981`
  - Text: `#000000`, `#6B7280`

### Cleanup Strategy
1. **Verify File Status**: Check if this is a legacy file that should be removed
2. **If Active**: Remove all fallback values, fail loudly when tokens missing
3. **If Legacy**: Mark for deletion or document as deprecated

### Token Mapping
- `#FFFFFF` → `var(--color-background)`
- `#D1D5DB` → `var(--color-border)`
- `#3B82F6` → `var(--color-primary)`
- `#EF4444` → `var(--color-error)`
- `#10B981` → `var(--color-success-strong)`
- `#000000` → `var(--color-text-default)`
- `#6B7280` → `var(--color-text-muted)`

---

## Priority 4: ButtonCTA Web (1 violation)

**Impact**: Low - Single violation in production code
**Complexity**: Low - Simple fallback pattern
**Estimated Effort**: 15 minutes

### Violations Breakdown
- **Line 252**: Fallback pattern `? 32 : 24` for icon size

### Cleanup Strategy
1. Replace fallback pattern with explicit error handling
2. Fail loudly when icon size token is missing

### Token Mapping
- `32` → `iconSize125` (large)
- `24` → `iconSize100` (medium/small)

---

## Priority 5: TextInputField Remaining (23 violations)

**Impact**: Medium - Already partially cleaned
**Complexity**: Medium - Mix of fallback patterns and hard-coded values
**Estimated Effort**: 2-3 hours

### Violations Breakdown
- **iOS Platform**: 2 violations
  - Fallback pattern for opacity: `? 1 : 0`
  - Hard-coded motion duration: `0.15`

- **Android Platform**: 8 violations
  - Hard-coded `0.dp` for label offset
  - Hard-coded `150.dp` for radius (should be token reference)
  - Hard-coded `4.dp` for label padding
  - Hard-coded `24.dp` for icon sizes (3 occurrences)

### Cleanup Strategy
1. **iOS**: Remove fallback patterns, use motion tokens
2. **Android**: Replace hard-coded values with token references

### Token Mapping
- `0.15` → `motionFocus`
- `150.dp` → `radius150` (already a token name, just needs proper reference)
- `4.dp` → `space.grouped.tight`
- `24.dp` → `iconSize100`

---

## Implementation Order

### Phase 1: Quick Wins (1-2 hours)
1. ButtonCTA web (1 violation) - 15 min
2. TextInputField.browser.ts status check - 15 min
3. Icon web tests (2 violations) - 30 min

### Phase 2: Documentation Updates (2-3 hours)
1. Icon Android documentation (32 violations) - 2-3 hours

### Phase 3: Production Code (6-8 hours)
1. TextInputField remaining (23 violations) - 2-3 hours
2. Container web (3 violations) - 1 hour
3. Container Android TokenMapping (44 violations) - 4-5 hours

### Phase 4: Verification (1 hour)
1. Re-run audit script
2. Verify zero violations
3. Run test suite
4. Update component READMEs

---

## Risk Assessment

### Low Risk
- Icon documentation updates (non-production code)
- ButtonCTA web (single violation)
- TextInputField.browser.ts (may be legacy)

### Medium Risk
- Icon web tests (test code changes)
- TextInputField remaining (partially cleaned)
- Container web (focus/accessibility styles)

### High Risk
- Container Android TokenMapping (44 violations, complex mapping logic)
  - Risk: Breaking token mapping for all Container instances
  - Mitigation: Thorough testing, incremental changes, verify each mapping

---

## Success Criteria

1. **Zero Violations**: Audit script reports 0 violations
2. **All Tests Pass**: Full test suite passes
3. **READMEs Updated**: All component READMEs document token usage
4. **No Fallback Patterns**: All fallback patterns removed
5. **Fail Loudly**: Components error when tokens missing

---

## Notes

### Legitimate Hard-Coded Values
Some hard-coded values are legitimate and should NOT be replaced:
- `0.dp` for "None" enum values (represents absence of spacing/border)
- Test assertions checking specific rendered values
- Platform-specific constants (e.g., iOS 44pt minimum touch target)

### Token Gaps Identified
During cleanup, we may identify missing tokens:
- Icon size tokens (if not already defined)
- Accessibility focus tokens (width, offset, color)
- Elevation/layering semantic tokens (Android)

### Documentation Strategy
- Update component READMEs with "Token Consumption" section
- Document any primitive token usage with rationale
- Note platform-specific considerations

---

*This cleanup plan provides a systematic approach to eliminating all remaining hard-coded values while prioritizing by impact and complexity.*
