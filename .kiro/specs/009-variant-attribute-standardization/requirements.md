# Requirements Document: Variant Attribute Standardization

**Date**: November 25, 2025
**Spec**: 009 - Variant Attribute Standardization
**Status**: Requirements Phase
**Dependencies**: 
- Spec 005 (ButtonCTA Component) - Component implementation uses `style` attribute
- Spec 004 (Icon System) - May use variant patterns

---

## Introduction

This specification addresses the standardization of component variant attributes from `style` to `variant` across the DesignerPunk design system. The current `style` attribute conflicts with the standard HTML `style` attribute, causing IDE warnings and potential developer confusion. The change aligns with industry standards (Material Design, Shoelace, Adobe Spectrum) and establishes a consistent pattern for future components.

**Scope**: This is a refactoring specification focused on renaming and documentation updates. No new functionality is being added - only attribute naming is changing.

**Timing Rationale**: With only two components currently implemented (ButtonCTA and Icon), this is the optimal time to make this change before the pattern proliferates across more components.

---

## Glossary

- **Variant**: A visual or semantic variation of a component (e.g., primary, secondary, danger)
- **Web Component**: Custom HTML element using Shadow DOM (e.g., `<button-cta>`)
- **Attribute**: HTML attribute used to configure component behavior or appearance
- **Component Development Guide**: Documentation defining component development standards
- **HTML Canary Validation**: Living HTML examples that validate component behavior

---

## Requirements

### Requirement 1: ButtonCTA Component Attribute Rename

**User Story**: As a developer using ButtonCTA, I want to use the `variant` attribute instead of `style`, so that I avoid IDE warnings and follow web component best practices.

#### Acceptance Criteria

1. WHEN a developer uses `<button-cta variant="primary">`, THEN the component SHALL render with primary styling
2. WHEN a developer uses `<button-cta variant="secondary">`, THEN the component SHALL render with secondary styling
3. WHEN a developer uses `<button-cta variant="danger">`, THEN the component SHALL render with danger styling
4. WHEN the web component implementation reads attributes, THEN it SHALL read from `variant` attribute instead of `style` attribute
5. WHEN TypeScript types are defined, THEN the interface SHALL use `variant` property instead of `style` property

### Requirement 2: Documentation Updates

**User Story**: As a developer learning the design system, I want accurate documentation that uses `variant` attribute, so that I can implement components correctly without confusion.

#### Acceptance Criteria

1. WHEN a developer reads ButtonCTA README, THEN all examples SHALL use `variant` attribute
2. WHEN a developer reads ButtonCTA API reference, THEN the attribute SHALL be documented as `variant`
3. WHEN a developer views HTML canary examples, THEN all examples SHALL use `variant` attribute
4. WHEN a developer reads Component Development Guide, THEN variant attribute SHALL be referenced as the standard pattern
5. WHEN a developer views TypeScript examples, THEN all code SHALL use `variant` property

### Requirement 3: Test Suite Updates

**User Story**: As a developer running tests, I want all tests to pass with the `variant` attribute, so that I can verify component behavior is unchanged.

#### Acceptance Criteria

1. WHEN ButtonCTA tests execute, THEN all tests SHALL use `variant` attribute in test code
2. WHEN ButtonCTA tests execute, THEN all tests SHALL pass with same assertions as before
3. WHEN validation script runs, THEN HTML canary examples SHALL validate successfully
4. WHEN TypeScript compilation runs, THEN no type errors SHALL occur related to variant attribute

### Requirement 4: Icon Component Consistency

**User Story**: As a developer using Icon component, I want consistent attribute naming across all components, so that I can learn the design system patterns once.

#### Acceptance Criteria

1. WHEN Icon component uses variant patterns, THEN it SHALL use `variant` attribute (not `style`)
2. WHEN Icon component documentation exists, THEN it SHALL reference `variant` attribute
3. WHEN Icon component examples exist, THEN they SHALL use `variant` attribute

### Requirement 5: Component Development Standards

**User Story**: As a developer creating new components, I want clear guidance on attribute naming, so that I follow established patterns from the start.

#### Acceptance Criteria

1. WHEN Component Development Guide discusses variant attributes, THEN it SHALL specify `variant` as the standard attribute name
2. WHEN Component Development Guide provides examples, THEN examples SHALL use `variant` attribute
3. WHEN Component Development Guide explains rationale, THEN it SHALL reference industry standards (Material, Shoelace, Spectrum)
4. WHEN Component Development Guide lists anti-patterns, THEN it SHALL explicitly warn against using `style` attribute for variants

### Requirement 6: Backward Compatibility Consideration

**User Story**: As a developer maintaining the design system, I want to understand the impact of this change, so that I can communicate breaking changes appropriately.

#### Acceptance Criteria

1. WHEN this change is implemented, THEN it SHALL be documented as a breaking change
2. WHEN this change is implemented, THEN the old `style` attribute SHALL NOT be supported (clean break)
3. WHEN this change is documented, THEN migration guidance SHALL be provided (find-replace pattern)
4. WHEN this change is communicated, THEN the rationale SHALL be clearly explained (IDE warnings, industry standards)

---

## Out of Scope

The following are explicitly out of scope for this specification:

- Adding new variant types (e.g., new color variants)
- Changing variant behavior or styling
- Modifying component functionality beyond attribute naming
- Supporting both `style` and `variant` attributes simultaneously
- Automated migration tooling for external consumers
- Changes to iOS or Android platform implementations (web component only)

---

## Success Criteria

This specification is successful when:

1. All ButtonCTA code uses `variant` attribute instead of `style`
2. All documentation accurately reflects `variant` attribute usage
3. All tests pass with `variant` attribute
4. Component Development Guide establishes `variant` as the standard pattern
5. No IDE warnings appear for attribute naming conflicts
6. Icon component (if applicable) uses consistent `variant` naming
