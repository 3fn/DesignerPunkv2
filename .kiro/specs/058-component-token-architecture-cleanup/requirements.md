# Requirements Document: Component Token Architecture Cleanup

**Date**: February 4, 2026
**Spec**: 058 - Component Token Architecture Cleanup
**Status**: Requirements Phase
**Dependencies**: 
- Rosetta System Architecture (token pipeline)
- Stemma System (component architecture)

---

## Introduction

This specification addresses architectural inconsistencies in component token placement discovered during a comprehensive audit. Component tokens for Avatar, Badge, and Chip are incorrectly located in semantic token files or a non-canonical directory, violating the Rosetta System architecture which mandates component tokens live at `src/components/*/tokens.ts`.

The cleanup ensures all component tokens follow the canonical architecture, improving maintainability, discoverability, and consistency across the design system.

---

## Requirements

### Requirement 1: Avatar Color Token Migration

**User Story**: As a design system maintainer, I want Avatar color tokens to live in the Avatar component directory, so that component tokens are co-located with their components per Rosetta System architecture.

#### Acceptance Criteria

1. WHEN Avatar color tokens are migrated THEN `color.avatar.human.background` SHALL be defined in `src/components/core/Avatar/avatar.tokens.ts`
2. WHEN Avatar color tokens are migrated THEN `color.avatar.agent.background` SHALL be defined in `src/components/core/Avatar/avatar.tokens.ts`
3. WHEN Avatar color tokens are migrated THEN `color.avatar.human.icon` SHALL be defined in `src/components/core/Avatar/avatar.tokens.ts`
4. WHEN Avatar color tokens are migrated THEN `color.avatar.agent.icon` SHALL be defined in `src/components/core/Avatar/avatar.tokens.ts`
5. WHEN Avatar color tokens are migrated THEN `color.avatar.default.border` SHALL be defined in `src/components/core/Avatar/avatar.tokens.ts`
6. WHEN Avatar color tokens are migrated THEN they SHALL be removed from `src/tokens/semantic/ColorTokens.ts`
7. WHEN Avatar color tokens are migrated THEN they SHALL reference semantic tokens (`color.identity.human`, `color.identity.agent`, `color.contrast.onDark`) where appropriate

---

### Requirement 2: Badge Color Token Migration

**User Story**: As a design system maintainer, I want Badge color tokens to live in the Badge component directory, so that component tokens are co-located with their components per Rosetta System architecture.

#### Acceptance Criteria

1. WHEN Badge color tokens are migrated THEN `color.badge.notification.background` SHALL be defined in `src/components/core/Badge-Count-Notification/tokens.ts`
2. WHEN Badge color tokens are migrated THEN `color.badge.notification.text` SHALL be defined in `src/components/core/Badge-Count-Notification/tokens.ts`
3. WHEN Badge color tokens are migrated THEN they SHALL be removed from `src/tokens/semantic/ColorTokens.ts`
4. WHEN Badge color tokens are migrated THEN they SHALL use `defineComponentTokens()` API

---

### Requirement 3: Chip Token Migration

**User Story**: As a design system maintainer, I want Chip tokens to live in the Chip-Base component directory, so that component tokens follow the canonical `src/components/*/tokens.ts` pattern.

#### Acceptance Criteria

1. WHEN Chip tokens are migrated THEN `chip.paddingBlock` SHALL be defined in `src/components/core/Chip-Base/tokens.ts`
2. WHEN Chip tokens are migrated THEN the file `src/tokens/components/chip.ts` SHALL be deleted
3. WHEN Chip tokens are migrated THEN the directory `src/tokens/components/` SHALL be deleted (if empty)
4. WHEN Chip tokens are migrated THEN Chip-Base, Chip-Filter, and Chip-Input implementations SHALL import from the new location
5. WHEN Chip tokens are migrated THEN they SHALL maintain the same `defineComponentTokens()` structure

---

### Requirement 4: Backward Compatibility

**User Story**: As a developer consuming the design system, I want token migrations to not break my existing imports, so that I can upgrade without immediate code changes.

#### Acceptance Criteria

1. WHEN tokens are migrated THEN re-exports from old locations SHALL be provided with deprecation warnings
2. WHEN tokens are migrated THEN deprecation warnings SHALL indicate the new import location
3. WHEN tokens are migrated THEN existing component implementations SHALL continue to work
4. WHEN tokens are migrated THEN all existing tests SHALL pass

---

### Requirement 5: Test Updates

**User Story**: As a developer, I want tests to reflect the new token architecture, so that tests validate the correct behavior.

#### Acceptance Criteria

1. WHEN Avatar color tokens are migrated THEN `ColorTokens.test.ts` token count expectations SHALL be updated
2. WHEN Badge color tokens are migrated THEN `ColorTokens.test.ts` token count expectations SHALL be updated
3. WHEN Chip tokens are migrated THEN any tests referencing `src/tokens/components/chip.ts` SHALL be updated
4. WHEN all migrations are complete THEN `npm test` SHALL pass with no failures
5. WHEN new tests are created THEN they SHALL follow Test Development Standards (`.kiro/steering/Test-Development-Standards.md`)
6. WHEN new tests are created THEN they SHALL be categorized as evergreen tests (permanent behavior verification)
7. WHEN new tests are created THEN they SHALL NOT test implementation details (specific file paths, import syntax)

---

### Requirement 6: Token Rebuild

**User Story**: As a design system maintainer, I want tokens rebuilt after migration, so that platform outputs reflect the new canonical locations.

#### Acceptance Criteria

1. WHEN all migrations are complete THEN the token build pipeline SHALL be executed
2. WHEN tokens are rebuilt THEN web CSS output SHALL include component tokens from new locations
3. WHEN tokens are rebuilt THEN iOS Swift output SHALL include component tokens from new locations
4. WHEN tokens are rebuilt THEN Android Kotlin output SHALL include component tokens from new locations
5. WHEN tokens are rebuilt THEN semantic token outputs SHALL NOT include removed component tokens

---

### Requirement 7: Documentation Updates

**User Story**: As a developer, I want documentation to reflect the correct token locations, so that I can find and use tokens correctly.

#### Acceptance Criteria

1. WHEN tokens are migrated THEN component documentation SHALL reference the new token locations
2. WHEN tokens are migrated THEN any steering documentation referencing old locations SHALL be updated

---

## Success Criteria

1. All Avatar color tokens (5) live in `src/components/core/Avatar/avatar.tokens.ts`
2. All Badge color tokens (2) live in `src/components/core/Badge-Count-Notification/tokens.ts`
3. All Chip tokens (1) live in `src/components/core/Chip-Base/tokens.ts`
4. No component tokens remain in `src/tokens/semantic/*.ts`
5. `src/tokens/components/` directory is deleted
6. All tests pass and follow Test Development Standards
7. Backward compatibility maintained via re-exports
8. Token build pipeline executed and platform outputs regenerated
9. Platform outputs (CSS, Swift, Kotlin) reflect new token locations

---

## Out of Scope

- Button-CTA minWidth tokens (schema references non-existent tokens — separate decision needed)
- Creating new component tokens
- Modifying semantic token definitions (only removing misplaced component tokens)
- Platform implementation changes (only import path updates)

---

**Organization**: spec-validation
**Scope**: 058-component-token-architecture-cleanup
