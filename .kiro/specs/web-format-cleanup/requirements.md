# Requirements Document: Web Format Cleanup

**Date**: November 9, 2025
**Spec**: web-format-cleanup
**Status**: Requirements Phase
**Dependencies**: None
**Related Issues**: #019, #020
**Investigation Report**: `.kiro/audits/web-format-migration-investigation.md`

---

## Introduction

The Web Format Cleanup spec addresses technical debt discovered during the architecture-separation-of-concerns spec. Investigation revealed that WebFormatGenerator was implemented with dual format support (CSS + JavaScript) based on misunderstood requirements. The stakeholder intent was always CSS-only for web token generation, making JavaScript format support unnecessary.

This spec removes JavaScript format support from the web token generation system, aligning the implementation with design intent and eliminating ~350 lines of unnecessary code and tests.

**Key Architectural Principles**:
- Align implementation with stakeholder intent (CSS-only)
- Remove unused code paths to reduce complexity
- Update tests to validate actual production behavior
- Maintain CSS format functionality without regression

---

## Glossary

- **WebFormatGenerator**: Class responsible for generating platform-specific token files for web (CSS custom properties)
- **OutputFormat**: Type defining supported output formats ('css' | 'javascript')
- **CSS Custom Properties**: CSS variables (e.g., `--space-100: 8px`) used for design tokens on web
- **JavaScript Format**: Unused format that generates JavaScript constants instead of CSS
- **WebFileOrganizer**: Class responsible for organizing web token files and build system integration
- **Production Code Path**: Code executed when generating tokens for actual use (hardcoded to CSS)
- **Technical Debt**: Unnecessary code that adds complexity without providing value

---

## Requirements

### Requirement 1: Remove JavaScript Format Support from WebFormatGenerator

**User Story**: As a developer maintaining the token generation system, I want JavaScript format support removed from WebFormatGenerator so that the codebase only contains code for the CSS format we actually use.

#### Acceptance Criteria

1. WHEN WebFormatGenerator is instantiated THEN the System SHALL only support CSS format
2. WHEN WebFormatGenerator.formats is accessed THEN the System SHALL return an array containing only 'css'
3. WHEN WebFormatGenerator constructor is called THEN the System SHALL not accept format parameter
4. WHEN token formatting methods are called THEN the System SHALL generate CSS custom properties without format conditionals
5. WHEN JavaScript-specific methods are referenced THEN the System SHALL not include formatJavaScriptConstant or related methods

---

### Requirement 2: Simplify WebFileOrganizer to CSS-Only

**User Story**: As a developer integrating the token system with build tools, I want WebFileOrganizer to only handle CSS format so that the build system configuration is clear and unambiguous.

#### Acceptance Criteria

1. WHEN WebFileOrganizer.getFileName is called THEN the System SHALL return 'DesignTokens.web.css' without format parameter
2. WHEN WebFileOrganizer.getBuildSystemIntegration is called THEN the System SHALL return import patterns for CSS only
3. WHEN build system configuration is accessed THEN the System SHALL not include JavaScript import patterns
4. WHEN file validation is performed THEN the System SHALL only validate CSS file extensions
5. WHEN directory structure is queried THEN the System SHALL reflect CSS-only organization

---

### Requirement 3: Update Tests to Expect CSS Format Only

**User Story**: As a developer running the test suite, I want all tests to validate CSS format behavior so that tests accurately reflect production code paths.

#### Acceptance Criteria

1. WHEN TokenFileGenerator tests execute THEN the System SHALL expect '.web.css' file extension
2. WHEN TokenFileGenerator tests validate content THEN the System SHALL expect ':root' selector and CSS custom properties
3. WHEN BuildSystemIntegration tests execute THEN the System SHALL not include JavaScript import pattern expectations
4. WHEN BuildSystemCompatibility tests execute THEN the System SHALL validate CSS format compatibility only
5. WHEN PathProviders tests execute THEN the System SHALL expect CSS file paths only

---

### Requirement 4: Update Documentation to Reflect CSS-Only Approach

**User Story**: As a developer reading the codebase documentation, I want comments and documentation to accurately describe CSS-only token generation so that I understand the system's actual behavior.

#### Acceptance Criteria

1. WHEN generateTokenFiles.ts is reviewed THEN the System SHALL include comments referencing CSS output only
2. WHEN WebFormatGenerator is documented THEN the System SHALL describe CSS custom property generation without mentioning JavaScript format
3. WHEN build system integration is documented THEN the System SHALL reference CSS import patterns only
4. WHEN code comments reference output format THEN the System SHALL not mention JavaScript format as an option
5. WHEN examples are provided THEN the System SHALL show CSS custom property usage only

---

### Requirement 5: Validate CSS Format Functionality Without Regression

**User Story**: As a developer deploying the token system, I want to ensure CSS format generation works correctly after cleanup so that production token generation is not affected.

#### Acceptance Criteria

1. WHEN all tests are executed THEN the System SHALL pass all CSS format validation tests
2. WHEN tokens are generated for web platform THEN the System SHALL produce valid CSS custom properties
3. WHEN CSS output is validated THEN the System SHALL include proper :root selector and property syntax
4. WHEN build system integration is tested THEN the System SHALL correctly import CSS custom properties
5. WHEN production token generation is executed THEN the System SHALL generate identical output to pre-cleanup implementation

---

## Out of Scope

The following items are explicitly out of scope for this spec:

- **Adding new CSS features**: This spec only removes JavaScript format, does not add CSS functionality
- **Changing CSS output format**: CSS custom property format remains unchanged
- **Modifying other platform generators**: iOS and Android generators are not affected
- **Changing token values**: Token mathematical relationships and values unchanged
- **Build system configuration changes**: Build tools configuration remains the same
- **Migration of existing projects**: No migration needed (production already CSS-only)

---

## Success Criteria

This spec is considered successful when:

1. ✅ WebFormatGenerator only supports CSS format (no JavaScript format code)
2. ✅ WebFileOrganizer only handles CSS files (no JavaScript file handling)
3. ✅ All tests pass and validate CSS format only
4. ✅ Documentation accurately describes CSS-only approach
5. ✅ Production token generation produces identical CSS output
6. ✅ Codebase reduced by ~350 lines of unnecessary code
7. ✅ Issues #019 and #020 resolved

---

## Dependencies

**None** - This spec has no dependencies on other specs or systems.

**Related Work**:
- Investigation Report: `.kiro/audits/web-format-migration-investigation.md` (Complete)
- Issue #019: TokenFileGenerator Tests Reference Outdated Web Output Format
- Issue #020: Web Format Dual Support - Intentional Feature or Incomplete Migration?

---

## Risks and Mitigations

### Risk 1: Breaking Production Code

**Risk**: Removing format parameter might break code that passes format explicitly

**Likelihood**: Low (investigation showed production hardcoded to CSS)

**Impact**: High (would break token generation)

**Mitigation**: 
- Search codebase for all WebFormatGenerator instantiations
- Verify no code passes format parameter
- Run full test suite before and after changes

### Risk 2: Test Failures

**Risk**: Tests might fail after removing JavaScript format support

**Likelihood**: High (many tests validate JavaScript format)

**Impact**: Medium (tests need updates, not production code)

**Mitigation**:
- Update tests systematically (one test suite at a time)
- Verify CSS format tests pass before removing JavaScript tests
- Keep test coverage at same level

### Risk 3: Documentation Drift

**Risk**: Missing documentation updates could confuse future developers

**Likelihood**: Medium (documentation scattered across files)

**Impact**: Low (confusion but not breakage)

**Mitigation**:
- Search for all references to JavaScript format in comments
- Update all documentation in same commit as code changes
- Review documentation as part of completion criteria

---

**Organization**: spec-requirements
**Scope**: web-format-cleanup
