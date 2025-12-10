# Task 3.1 Completion: Create ButtonCTA Cleanup-Specific Tests

**Date**: December 10, 2025
**Task**: 3.1 Create ButtonCTA cleanup-specific tests
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `src/components/core/ButtonCTA/__tests__/ButtonCTA.cleanup.test.ts` - Cleanup-specific test file for ButtonCTA token replacements

## Implementation Details

### Approach

Created a temporary test file that validates ButtonCTA components use design tokens instead of hard-coded values. The test file provides immediate feedback during the cleanup process and is marked as TEMPORARY to be deleted once cleanup is complete.

### Test Coverage

The cleanup-specific tests validate:

**iOS Platform:**
- No hard-coded `Color(red:green:blue:)` patterns
- Use of `colorPrimary` token instead of RGB values
- Use of `colorBackground` token instead of hard-coded white
- Use of `colorTextDefault` or `colorTextOnPrimary` for text colors
- Use of color tokens for icon optical balance

**Web Platform:**
- Use of CSS custom properties for colors (e.g., `var(--color-primary)`)
- No hard-coded icon size fallback patterns (e.g., `? 32 : 24`)
- Token-based icon sizing

**Android Platform:**
- No hard-coded `Color(0xRRGGBB)` patterns
- Use of `DesignTokens.color_primary` instead of hex colors
- Use of semantic color tokens for all color properties

**Cross-Platform:**
- Consistent token naming across platforms (colorPrimary, --color-primary, DesignTokens.color_primary)

### Test Structure

The test file is organized into describe blocks by platform:
1. iOS Platform tests
2. Web Platform tests
3. Android Platform tests
4. Cross-Platform Token Consistency tests

Each test checks for the absence of hard-coded values and the presence of token references.

### Temporary Nature

The test file includes clear markers that it is temporary:
- File header comment: "TEMPORARY TEST - Delete after cleanup complete"
- Test suite name: "ButtonCTA Token Cleanup - TEMPORARY"
- Purpose statement explaining these tests provide immediate feedback during cleanup

## Validation (Tier 2: Standard)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly
✅ Type annotations correct

### Functional Validation
✅ Test file executes successfully
✅ Tests correctly identify current hard-coded values in ButtonCTA
✅ Tests will pass once hard-coded values are replaced with tokens
✅ Test patterns match the violations identified in audit report

### Integration Validation
✅ Integrates with Jest test framework
✅ Uses Node.js fs module to read component files
✅ Test file location follows component test structure

### Requirements Compliance
✅ Requirement 1.1: Tests validate color token usage
✅ Requirement 1.6: Tests validate semantic token preference
✅ Requirement 8.1: Tests validate icon token usage

## Current Test Results

The tests are currently failing (as expected) because ButtonCTA still contains hard-coded values:

**iOS Violations Detected:**
- 5 hard-coded `Color(red:green:blue:)` patterns
- Lines 330, 332, 345, 356, 382 in ButtonCTA.ios.swift

**Web Violations Detected:**
- Hard-coded icon size fallback pattern: `? 32 : 24`
- Line 249 in ButtonCTA.web.ts

**Android Status:**
- ✅ No hard-coded color violations (already using DesignTokens)

These failing tests provide the immediate feedback needed for the cleanup process. Once the hard-coded values are replaced with tokens in tasks 3.2-3.4, these tests will pass.

## Next Steps

The cleanup-specific tests are now in place and ready to provide feedback for:
- Task 3.2: Replace ButtonCTA iOS hard-coded colors
- Task 3.3: Replace ButtonCTA web hard-coded values
- Task 3.4: Replace ButtonCTA Android hard-coded values

After all ButtonCTA cleanup tasks are complete and tests pass, this test file should be deleted as specified in Task 6.2.

---

**Organization**: spec-completion
**Scope**: 017-component-code-quality-sweep
