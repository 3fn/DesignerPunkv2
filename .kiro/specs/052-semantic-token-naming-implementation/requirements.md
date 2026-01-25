# Requirements Document: Semantic Token Naming Implementation

**Date**: January 24, 2026
**Spec**: 052 - Semantic Token Naming Implementation
**Status**: Requirements Phase
**Dependencies**: Spec 051 (Design Authority + Component Audit) — Complete
**Design Authority**: `.kiro/specs/051-semantic-token-naming-restructure/design-outline.md`

---

## Introduction

This spec implements the semantic color token naming restructure defined in Spec 051. The design outline establishes the Nathan Curtis concept-first naming model and provides complete migration mappings validated through a 15-component audit.

**Scope**: Execute all token migrations across the Rosetta pipeline, update components on all three platforms (Web, iOS, Android), and update all related documentation. This includes migrating primitive color tokens to RGBA format and updating the Rosetta pipeline for cross-platform output.

**Platforms**: Web (CSS), iOS (Swift), Android (Kotlin)

**Why Now**: No external consumers exist yet, making this the ideal time for breaking changes with zero migration burden.

---

## Requirements

### Requirement 1: Primitive Color Token RGBA Migration

**User Story**: As a design system maintainer, I want primitive color tokens in RGBA format, so that alpha channel support is native and cross-platform color APIs map directly.

#### Acceptance Criteria

1. WHEN a primitive color token is defined THEN the system SHALL store the value in RGBA format (`rgba(r, g, b, a)`)
2. WHEN a semantic token references a primitive THEN the system SHALL inherit the RGBA format automatically
3. WHEN generating platform output THEN the Rosetta pipeline SHALL produce:
   - Web: `rgba(r, g, b, a)` CSS format
   - iOS: `UIColor(red: r/255, green: g/255, blue: b/255, alpha: a)` format
   - Android: `Color.argb(a, r, g, b)` or `0xAARRGGBB` format
4. WHEN a token requires transparency THEN the system SHALL support baked-in alpha values (e.g., `rgba(128, 128, 128, 0.48)`)

---

### Requirement 2: Semantic Concept Token Creation

**User Story**: As a developer, I want semantic tokens organized by concept (feedback, identity, action, contrast, structure), so that token discovery is intuitive and AI agents can reason about token purpose.

#### Acceptance Criteria

1. WHEN the Feedback concept is implemented THEN the system SHALL provide tokens:
   - `color.feedback.{success|error|warning|info}.{text|background|border}`
   - `color.feedback.select.{text|background|border}.{rest|default}`
2. WHEN the Identity concept is implemented THEN the system SHALL provide tokens:
   - `color.identity.human` (orange300)
   - `color.identity.agent` (teal200)
3. WHEN the Action concept is implemented THEN the system SHALL provide tokens:
   - `color.action.primary` (purple300)
   - `color.action.secondary` (black400)
4. WHEN the Contrast concept is implemented THEN the system SHALL provide tokens:
   - `color.contrast.onLight` (black500)
   - `color.contrast.onDark` (white100)
5. WHEN the Structure concept is implemented THEN the system SHALL provide tokens:
   - `color.structure.canvas` (white100)
   - `color.structure.surface` (white200)
   - `color.structure.border` (gray100)
   - `color.structure.border.subtle` (rgba(gray100, 0.48))

---

### Requirement 3: Component Token Migration

**User Story**: As a component developer, I want component tokens to follow the `{component}.{variant}.{property}` pattern and reference semantic tokens, so that component styling is consistent and maintainable.

#### Acceptance Criteria

1. WHEN Avatar component tokens are migrated THEN the system SHALL provide:
   - `color.avatar.human.background` → references `color.identity.human`
   - `color.avatar.agent.background` → references `color.identity.agent`
   - `color.avatar.human.icon` → references `color.contrast.onDark`
   - `color.avatar.agent.icon` → references `color.contrast.onDark`
   - `color.avatar.default.border` → references gray100
2. WHEN Badge component tokens are migrated THEN the system SHALL reorder to:
   - `color.badge.notification.background` (from `color.badge.background.notification`)
   - `color.badge.notification.text` (from `color.badge.text.notification`)

---

### Requirement 4: Existing Token Migration (Clean Break)

**User Story**: As a design system maintainer, I want existing tokens migrated to the new naming model with old names removed, so that the codebase is clean and consistent.

#### Acceptance Criteria

1. WHEN a token is migrated THEN the old token name SHALL be removed (no deprecation aliases)
2. WHEN migrating tokens THEN the following mappings SHALL be applied:
   - `color.primary` → `color.action.primary`
   - `color.contrast.onPrimary` → `color.contrast.onDark`
   - `color.avatar.human` → `color.identity.human`
   - `color.avatar.agent` → `color.identity.agent`
   - `color.error.strong` → `color.feedback.error.text`
   - `color.error.subtle` → `color.feedback.error.background`
   - `color.success.strong` → `color.feedback.success.text`
   - `color.success.subtle` → `color.feedback.success.background`
   - `color.warning.strong` → `color.feedback.warning.text`
   - `color.warning.subtle` → `color.feedback.warning.background`
   - `color.info.strong` → `color.feedback.info.text`
   - `color.info.subtle` → `color.feedback.info.background`
   - `color.select.selected.strong` → `color.feedback.select.text.rest`
   - `color.select.selected.subtle` → `color.feedback.select.background.rest`
   - `color.select.notSelected.strong` → `color.feedback.select.text.default`
   - `color.select.notSelected.subtle` → `color.feedback.select.background.default`
   - `color.background` → `color.structure.canvas`
   - `color.surface` → `color.structure.surface`
   - `color.border` → `color.structure.border`
3. WHEN migration is complete THEN no references to old token names SHALL exist in the codebase or documentation

---

### Requirement 5: Platform Token Generation (Build Sequencing)

**User Story**: As a developer, I want platform tokens generated before component updates begin, so that components can consume the new token names immediately.

#### Acceptance Criteria

1. WHEN token definitions are updated in source files THEN the platform token generation script SHALL be run before any component updates begin
2. WHEN platform tokens are generated THEN the following command SHALL be executed:
   ```bash
   npx ts-node scripts/generate-platform-tokens.ts
   ```
3. WHEN generation completes THEN the following outputs SHALL be verified in `dist/`:
   - `DesignTokens.web.css` — CSS custom properties with new token names
   - `DesignTokens.ios.swift` — Swift constants with new token names
   - `DesignTokens.android.kt` — Kotlin constants with new token names
4. WHEN RGBA format is implemented THEN platform outputs SHALL use correct format:
   - Web: `rgba(r, g, b, a)` CSS format
   - iOS: `UIColor(red: r/255, green: g/255, blue: b/255, alpha: a)` format
   - Android: `Color.argb(a, r, g, b)` or `0xAARRGGBB` format
5. WHEN component tokens are updated THEN `ComponentTokens.*.{css|swift|kt}` files SHALL also be regenerated

**Reference**: See `Rosetta-System-Architecture.md` on MCP for pipeline documentation.

---

### Requirement 6: Component Updates (All Platforms)

**User Story**: As a component developer, I want all 15 audited components updated on all platforms (Web, iOS, Android) to use the new token names, so that the codebase is consistent with the naming model across the entire design system.

#### Acceptance Criteria

1. WHEN Avatar component is updated THEN it SHALL use new semantic and component tokens on Web, iOS, and Android
2. WHEN Button-CTA component is updated THEN it SHALL use `color.action.primary` and `color.contrast.onDark` on all platforms
3. WHEN Button-Icon component is updated THEN it SHALL use `color.action.primary` and `color.contrast.onDark` on all platforms
4. WHEN Button-VerticalList-Item component is updated THEN it SHALL use `color.feedback.select.*` tokens on all platforms
5. WHEN Button-VerticalList-Set component is updated THEN it SHALL use `color.feedback.error.text` on all platforms
6. WHEN Container-Base component is updated THEN it SHALL use `--accessibility-focus-color` for focus outline (Web) and equivalent tokens on iOS/Android
7. WHEN Container-Card-Base component is updated THEN it SHALL:
   - Use `--accessibility-focus-color` for focus outline (Web) and equivalent tokens on iOS/Android
   - Remove hard-coded `#A855F7` fallback on all platforms
8. WHEN Input-Text-Base component is updated THEN it SHALL use `color.feedback.error.text` and `color.feedback.success.text` on all platforms
9. WHEN Badge-Count-Notification component is updated THEN it SHALL use reordered token names on all platforms
10. WHEN platform-specific issues are encountered THEN they SHALL be documented and resolved per-platform as needed

---

### Requirement 7: Documentation Updates

**User Story**: As a developer, I want documentation updated to reflect the new naming model, so that I can discover and use tokens correctly.

#### Acceptance Criteria

1. WHEN steering documentation is updated THEN the following SHALL reflect new token names and concepts:
   - `Token-Family-Color.md` — Complete rewrite for concept-based organization
   - `Token-Governance.md` — Updated examples using new token names
   - `Token-Quick-Reference.md` — Updated with new concept-based organization
   - `Rosetta-System-Architecture.md` — Updated for RGBA pipeline changes
2. WHEN component steering documentation is updated THEN the following SHALL reference new token names:
   - `Component-Family-Avatar.md` — Updated for identity/contrast tokens
   - `Component-Family-Button.md` — Updated for action/feedback tokens
3. WHEN component READMEs are updated THEN they SHALL reference new token names
4. WHEN MCP documentation server indexes are rebuilt THEN they SHALL reflect updated steering content

---

### Requirement 8: Test Updates (Per Test Development Standards)

**User Story**: As a developer, I want tests that verify token behavior and contracts, so that the migration is validated without creating brittle implementation-dependent tests.

#### Acceptance Criteria

1. WHEN token tests are created/updated THEN they SHALL be **evergreen tests** that:
   - Verify tokens resolve to correct RGBA values (behavior)
   - Verify semantic tokens reference correct primitives (contract)
   - Survive future refactoring without breaking
2. WHEN component tests are updated THEN they SHALL:
   - Test that components render correctly (behavior)
   - NOT test specific token names used internally (implementation detail)
   - Verify visual output matches expected design (contract)
3. WHEN RGBA format is validated THEN tests SHALL:
   - Confirm correct platform-specific output format (web, iOS, Android)
   - Verify alpha channel values are preserved
4. WHEN all tests pass THEN there SHALL be no visual regressions in component rendering
5. WHEN migration-specific validation is needed THEN **temporary tests** SHALL:
   - Be clearly marked with retirement criteria
   - Be deleted after migration is verified complete
   - NOT become permanent maintenance burden

---

### Requirement 9: Code Comments for Design Decisions

**User Story**: As a future maintainer, I want design decisions documented in code comments, so that architectural intent is preserved.

#### Acceptance Criteria

1. WHEN `color.feedback.select.*` tokens are defined THEN a code comment SHALL note: "Select is placed under feedback as UI response to user action. If additional interaction-based use cases emerge (focus states, drag states), consider migrating to an 'interaction' concept."
2. WHEN concept tokens are defined THEN code comments SHALL reference the design authority document

---

## Success Criteria

- [ ] All ~50 primitive color tokens migrated to RGBA format
- [ ] Rosetta pipeline generates correct platform-specific RGBA output (web, iOS, Android)
- [ ] All semantic concept tokens created (feedback, identity, action, contrast, structure)
- [ ] All component tokens migrated to new pattern
- [ ] Platform token generation script run and outputs verified (`dist/DesignTokens.*.{css|swift|kt}`)
- [ ] All 15 components updated to use new tokens on all platforms (Web, iOS, Android)
- [ ] `color.structure.border.subtle` implemented with baked-in alpha
- [ ] All old token names removed (clean break, no deprecation aliases)
- [ ] All tests passing (evergreen tests for behavior/contracts)
- [ ] All steering documentation updated (Token-Family-Color, Token-Governance, Token-Quick-Reference, Rosetta-System-Architecture)
- [ ] Component steering documentation updated (Component-Family-Avatar, Component-Family-Button)
- [ ] MCP documentation server indexes rebuilt
- [ ] No visual regressions on any platform
- [ ] Design decision comments added to code

---

## References

- **Design Authority**: `.kiro/specs/051-semantic-token-naming-restructure/design-outline.md`
- **Component Audit**: `findings/component-token-audit-051.md`
- **Audit Findings**: `findings/semantic-token-naming-audit-findings.md`
