# Implementation Plan: Component Token Architecture Cleanup

**Date**: February 4, 2026
**Spec**: 058 - Component Token Architecture Cleanup
**Status**: Implementation Planning
**Dependencies**: 
- Rosetta System Architecture (token pipeline)
- Stemma System (component architecture)

---

## Implementation Plan

This spec migrates component tokens from incorrect locations to their canonical locations per Rosetta System architecture. The implementation is organized into four parent tasks:

1. **Avatar Color Token Migration** — Move 5 tokens to Avatar component directory
2. **Badge Color Token Migration** — Create tokens.ts and move 2 tokens
3. **Chip Token Migration** — Move tokens and delete old directory
4. **Validation & Cleanup** — Update tests, verify pipeline, cleanup

---

## Task List

- [x] 1. Avatar Color Token Migration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All 5 Avatar color tokens defined in `src/components/core/Avatar/avatar.tokens.ts`
  - Tokens removed from `src/tokens/semantic/ColorTokens.ts`
  - Avatar component implementations updated to use local tokens
  - Re-exports with deprecation warnings in place
  - All Avatar-related tests pass
  
  **Primary Artifacts:**
  - `src/components/core/Avatar/avatar.tokens.ts` (updated)
  - `src/tokens/semantic/ColorTokens.ts` (tokens removed)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/058-component-token-architecture-cleanup/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/058-component-token-architecture-cleanup/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Avatar Color Token Migration"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Add color tokens to Avatar tokens file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Open `src/components/core/Avatar/avatar.tokens.ts`
    - Add `AvatarColorTokens` using `defineComponentTokens()` API
    - Define `human.background` referencing `color.identity.human`
    - Define `agent.background` referencing `color.identity.agent`
    - Define `human.icon` referencing `color.contrast.onDark`
    - Define `agent.icon` referencing `color.contrast.onDark`
    - Define `default.border` referencing `color.structure.border`
    - Include reasoning for each token
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.7_

  - [x] 1.2 Remove Avatar tokens from ColorTokens.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Open `src/tokens/semantic/ColorTokens.ts`
    - Remove `color.avatar.human.background` token definition
    - Remove `color.avatar.agent.background` token definition
    - Remove `color.avatar.human.icon` token definition
    - Remove `color.avatar.agent.icon` token definition
    - Remove `color.avatar.default.border` token definition
    - Update token count comments
    - Add re-export with deprecation warning for backward compatibility
    - _Requirements: 1.6, 4.1, 4.2_

  - [x] 1.3 Update Avatar component implementations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update Avatar web component to import from local tokens
    - Update Avatar iOS implementation if it references moved tokens
    - Update Avatar Android implementation if it references moved tokens
    - Verify Avatar renders correctly with new token imports
    - _Requirements: 4.3_

---

- [x] 2. Badge Color Token Migration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All 2 Badge color tokens defined in `src/components/core/Badge-Count-Notification/tokens.ts`
  - Tokens removed from `src/tokens/semantic/ColorTokens.ts`
  - Badge component implementations updated to use local tokens
  - Re-exports with deprecation warnings in place
  - All Badge-related tests pass
  
  **Primary Artifacts:**
  - `src/components/core/Badge-Count-Notification/tokens.ts` (new)
  - `src/tokens/semantic/ColorTokens.ts` (tokens removed)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/058-component-token-architecture-cleanup/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/058-component-token-architecture-cleanup/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Badge Color Token Migration"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Create Badge-Count-Notification tokens file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/components/core/Badge-Count-Notification/tokens.ts`
    - Add `BadgeNotificationColorTokens` using `defineComponentTokens()` API
    - Define `notification.background` referencing `pink400`
    - Define `notification.text` referencing `white100`
    - Include reasoning for each token (contrast ratio, visibility)
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 2.2 Remove Badge tokens from ColorTokens.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Open `src/tokens/semantic/ColorTokens.ts`
    - Remove `color.badge.notification.background` token definition
    - Remove `color.badge.notification.text` token definition
    - Update token count comments
    - Add re-export with deprecation warning for backward compatibility
    - _Requirements: 2.3, 4.1, 4.2_

  - [x] 2.3 Update Badge component implementations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update Badge-Count-Notification web component to import from local tokens
    - Update Badge-Count-Notification iOS implementation if needed
    - Update Badge-Count-Notification Android implementation if needed
    - Verify Badge renders correctly with new token imports
    - _Requirements: 4.3_

---

- [ ] 3. Chip Token Migration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Chip token defined in `src/components/core/Chip-Base/tokens.ts`
  - `src/tokens/components/chip.ts` deleted
  - `src/tokens/components/` directory deleted
  - Chip-Base, Chip-Filter, Chip-Input implementations updated
  - All Chip-related tests pass
  
  **Primary Artifacts:**
  - `src/components/core/Chip-Base/tokens.ts` (new)
  - `src/tokens/components/chip.ts` (deleted)
  - `src/tokens/components/` (deleted)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/058-component-token-architecture-cleanup/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/058-component-token-architecture-cleanup/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Chip Token Migration"`
  - Verify: Check GitHub for committed changes

  - [ ] 3.1 Create Chip-Base tokens file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/components/core/Chip-Base/tokens.ts`
    - Copy `ChipTokens` definition from `src/tokens/components/chip.ts`
    - Update import paths for `defineComponentTokens` and `spacingTokens`
    - Maintain same token structure and reasoning
    - _Requirements: 3.1, 3.5_

  - [ ] 3.2 Update Chip component implementations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update Chip-Base web component to import from local tokens
    - Update Chip-Filter to import from Chip-Base tokens
    - Update Chip-Input to import from Chip-Base tokens
    - Update iOS implementations if they reference chip tokens
    - Update Android implementations if they reference chip tokens
    - _Requirements: 3.4_

  - [ ] 3.3 Delete old Chip tokens file and directory
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Delete `src/tokens/components/chip.ts`
    - Delete `src/tokens/components/` directory
    - Verify no other files exist in the directory before deletion
    - _Requirements: 3.2, 3.3_

---

- [ ] 4. Validation & Cleanup

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - ColorTokens.test.ts updated with correct token count
  - All tests pass (`npm test`) and follow Test Development Standards
  - Token build pipeline executed and platform outputs regenerated
  - No component tokens remain in semantic token files
  - Documentation updated where needed
  
  **Primary Artifacts:**
  - `src/tokens/semantic/__tests__/ColorTokens.test.ts` (updated)
  - Platform output verification
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/058-component-token-architecture-cleanup/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/058-component-token-architecture-cleanup/task-4-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Validation & Cleanup"`
  - Verify: Check GitHub for committed changes

  - [ ] 4.1 Update ColorTokens test expectations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Open `src/tokens/semantic/__tests__/ColorTokens.test.ts`
    - Update expected token count (remove 7 tokens)
    - Update any assertions that reference moved tokens
    - Run ColorTokens tests to verify updates
    - _Requirements: 5.1, 5.2_

  - [ ] 4.2 Update any Chip token tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Search for tests referencing `src/tokens/components/chip.ts`
    - Update import paths to new location
    - Run Chip-related tests to verify updates
    - _Requirements: 5.3_

  - [ ] 4.3 Run full test suite
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test` to verify all tests pass
    - Ensure any new tests follow Test Development Standards
    - Verify tests are categorized as evergreen (permanent behavior verification)
    - Verify tests do NOT test implementation details (file paths, import syntax)
    - Fix any remaining test failures
    - Document any unexpected issues
    - _Requirements: 5.4, 5.5, 5.6, 5.7_

  - [ ] 4.4 Rebuild tokens and verify platform outputs
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run token build pipeline to regenerate all platform outputs
    - Verify web CSS output includes component tokens from new locations
    - Verify iOS Swift output includes component tokens from new locations
    - Verify Android Kotlin output includes component tokens from new locations
    - Verify semantic token outputs no longer include removed component tokens
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 4.5 Update documentation
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Update design-outline.md to mark spec complete
    - Update any steering documentation referencing old token locations
    - Verify Component-Family-Chip.md references correct token location
    - _Requirements: 7.1, 7.2_

---

## Requirements Traceability

| Requirement | Tasks |
|-------------|-------|
| R1: Avatar Color Token Migration | 1.1, 1.2, 1.3 |
| R2: Badge Color Token Migration | 2.1, 2.2, 2.3 |
| R3: Chip Token Migration | 3.1, 3.2, 3.3 |
| R4: Backward Compatibility | 1.2, 2.2 |
| R5: Test Updates | 4.1, 4.2, 4.3 |
| R6: Token Rebuild | 4.4 |
| R7: Documentation Updates | 4.5 |

---

**Organization**: spec-validation
**Scope**: 058-component-token-architecture-cleanup
