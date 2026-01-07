# Requirements Document: Deprecated Component Names Removal

**Date**: January 7, 2026
**Spec**: 039 - Deprecated Component Names Removal
**Status**: Requirements Phase
**Dependencies**: None

---

## Introduction

This spec removes deprecated component names (`dp-icon`, `dp-container`) from the DesignerPunk system. These legacy aliases were created for backward compatibility but serve zero customers, creating unnecessary technical debt, cognitive load, and test complexity.

The removal follows an audit-first approach, with findings documented in `findings/deprecated-names-audit-findings.md`.

---

## Requirements

### Requirement 1: Remove Deprecated Component Registrations

**User Story**: As a developer, I want deprecated component registrations removed from the browser bundle, so that the codebase is cleaner and bundle size is reduced.

#### Acceptance Criteria

1. WHEN the browser bundle loads THEN the Build_System SHALL NOT register `dp-icon` as a Custom_Element
2. WHEN the browser bundle loads THEN the Build_System SHALL NOT register `dp-container` as a Custom_Element
3. WHEN the browser bundle loads THEN the Build_System SHALL continue to register `icon-base` as a Custom_Element
4. WHEN the browser bundle loads THEN the Build_System SHALL continue to register `container-base` as a Custom_Element

---

### Requirement 2: Update Test Assertions

**User Story**: As a developer, I want tests updated to reflect the removal of deprecated names, so that tests accurately validate current system behavior.

#### Acceptance Criteria

1. WHEN running component registration tests THEN the Test_Suite SHALL NOT expect `dp-icon` to be registered
2. WHEN running component registration tests THEN the Test_Suite SHALL NOT expect `dp-container` to be registered
3. WHEN running UMD bundle loading tests THEN the Test_Suite SHALL NOT expect deprecated names in bundle content
4. WHEN running registration idempotency tests THEN the Test_Suite SHALL use current component names (`icon-base`, `container-base`) instead of deprecated names
5. WHEN all tests complete THEN the Test_Suite SHALL pass with zero failures related to deprecated names

---

### Requirement 3: Update Component Schemas

**User Story**: As a developer, I want component schemas updated to remove legacy element references, so that documentation accurately reflects current component API.

#### Acceptance Criteria

1. WHEN reading Icon-Base schema THEN the Schema SHALL NOT contain `legacy_element` field
2. WHEN reading Container-Base schema THEN the Schema SHALL NOT contain `legacy_element` field
3. WHEN reading Icon-Base schema platform notes THEN the Schema SHALL NOT reference `dp-icon` backward compatibility
4. WHEN reading Container-Base schema platform notes THEN the Schema SHALL NOT reference `dp-container` backward compatibility

---

### Requirement 4: Update Component Documentation

**User Story**: As a developer, I want component READMEs updated to remove legacy documentation, so that documentation guides developers to use current component names only.

#### Acceptance Criteria

1. WHEN reading Icon-Base README THEN the Documentation SHALL NOT contain "Backward Compatibility" section
2. WHEN reading Container-Base README THEN the Documentation SHALL NOT contain "Backward Compatibility" section
3. WHEN reading Icon-Base README THEN the Documentation SHALL NOT contain `<dp-icon>` examples
4. WHEN reading Container-Base README THEN the Documentation SHALL NOT contain `<dp-container>` examples
5. WHEN reading Container-Base README platform notes THEN the Documentation SHALL NOT reference legacy tag support

---

### Requirement 5: Preserve CSS Custom Property Prefix

**User Story**: As a developer, I want the `--dp-*` CSS custom property prefix preserved, so that the DesignerPunk namespace for CSS variables remains unchanged.

#### Acceptance Criteria

1. WHEN reviewing CSS custom properties THEN the System SHALL continue to use `--dp-*` prefix for design tokens
2. WHEN removing deprecated component names THEN the System SHALL NOT modify CSS custom property naming

---

### Requirement 6: Preserve Historical References

**User Story**: As a developer, I want historical references in spec documents preserved, so that the project history remains accurate and traceable.

#### Acceptance Criteria

1. WHEN removing deprecated names THEN the System SHALL NOT modify spec documents in `.kiro/specs/`
2. WHEN removing deprecated names THEN the System SHALL NOT modify completion documents that reference deprecated names historically
