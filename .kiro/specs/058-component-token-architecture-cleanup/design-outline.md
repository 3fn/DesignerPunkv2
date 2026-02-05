# Component Token Architecture Cleanup - Design Outline

**Date**: February 4, 2026
**Purpose**: Align component token locations with canonical Rosetta System architecture
**Status**: Design Outline (Pre-Requirements)

---

## Problem Statement

A comprehensive audit of the codebase revealed inconsistent component token architecture:

1. **Component color tokens in semantic token files** — Avatar and Badge color tokens are incorrectly placed in `src/tokens/semantic/ColorTokens.ts`
2. **Inconsistent component token file locations** — Chip tokens are in `src/tokens/components/chip.ts` (wrong directory) while other components correctly use `src/components/*/tokens.ts`
3. **Missing component tokens** — Button-CTA schema references tokens that don't exist

### Canonical Architecture (from Rosetta System)

Per the Rosetta System Architecture documentation:

| Layer | Location | Examples |
|-------|----------|----------|
| **Primitive** | `src/tokens/*.ts` | spacing, color, typography, radius |
| **Semantic** | `src/tokens/semantic/*.ts` | `space.inset.*`, `color.action.primary`, `bodyMd` |
| **Component** | `src/components/*/tokens.ts` | `buttonIcon.inset.*`, `textInput.padding.*` |

**Component tokens should live at**: `src/components/[ComponentName]/tokens.ts`

---

## Comprehensive Audit Results

### Audit Scope

All 18 semantic token files were audited for component-specific tokens:
- `AccessibilityTokens.ts` ✅ Clean
- `BlendTokens.ts` ✅ Clean (note: `color.icon.opticalBalance` is a semantic blend, not component token)
- `BorderWidthTokens.ts` ✅ Clean
- `ColorTokens.ts` ❌ Contains component tokens (Avatar, Badge)
- `ElevationTokens.ts` ✅ Clean (`elevation.container` is semantic, not component-specific)
- `GridSpacingTokens.ts` ✅ Clean
- `IconTokens.ts` ✅ Clean
- `LayeringTokens.ts` ✅ Clean
- `MotionTokens.ts` ✅ Clean (`motion.floatLabel` is semantic for text inputs generally)
- `OpacityTokens.ts` ✅ Clean
- `RadiusTokens.ts` ✅ Clean
- `ShadowTokens.ts` ✅ Clean (`shadow.container` is semantic, not component-specific)
- `SpacingTokens.ts` ✅ Clean
- `StyleTokens.ts` ✅ Clean
- `TypographyTokens.ts` ✅ Clean
- `ZIndexTokens.ts` ✅ Clean (`zIndex.container` is semantic, not component-specific)

### Tokens in Wrong Location

| Token | Current Location | Correct Location |
|-------|------------------|------------------|
| `color.avatar.human.background` | `src/tokens/semantic/ColorTokens.ts` | `src/components/core/Avatar/tokens.ts` |
| `color.avatar.agent.background` | `src/tokens/semantic/ColorTokens.ts` | `src/components/core/Avatar/tokens.ts` |
| `color.avatar.human.icon` | `src/tokens/semantic/ColorTokens.ts` | `src/components/core/Avatar/tokens.ts` |
| `color.avatar.agent.icon` | `src/tokens/semantic/ColorTokens.ts` | `src/components/core/Avatar/tokens.ts` |
| `color.avatar.default.border` | `src/tokens/semantic/ColorTokens.ts` | `src/components/core/Avatar/tokens.ts` |
| `color.badge.notification.background` | `src/tokens/semantic/ColorTokens.ts` | `src/components/core/Badge-Count-Notification/tokens.ts` |
| `color.badge.notification.text` | `src/tokens/semantic/ColorTokens.ts` | `src/components/core/Badge-Count-Notification/tokens.ts` |
| `ChipTokens` (spacing) | `src/tokens/components/chip.ts` | `src/components/core/Chip-Base/tokens.ts` |

**Total: 8 tokens in wrong locations**

### Tokens Already Correct

| Component | Location | Token Types | Status |
|-----------|----------|-------------|--------|
| Avatar | `src/components/core/Avatar/avatar.tokens.ts` | spacing | ✅ Correct |
| Button-Icon | `src/components/core/Button-Icon/buttonIcon.tokens.ts` | spacing | ✅ Correct |
| Button-VerticalList-Item | `src/components/core/Button-VerticalList-Item/Button-VerticalList-Item.tokens.ts` | spacing | ✅ Correct |
| Badge-Label-Base | `src/components/core/Badge-Label-Base/tokens.ts` | spacing | ✅ Correct |

### Semantic Tokens Correctly Placed (Not Component Tokens)

These tokens were reviewed and confirmed as legitimate semantic tokens:

| Token | Rationale |
|-------|-----------|
| `color.text.default/muted/subtle` | Text hierarchy - applies across all components |
| `color.icon.default` | Default icon color - applies across all components |
| `color.icon.opticalBalance` (blend) | Icon optical weight compensation - applies across all components |
| `shadow.container` | Generic container shadow - not specific to Container component |
| `elevation.container` | Generic container elevation - not specific to Container component |
| `zIndex.container` | Generic container z-index - not specific to Container component |
| `motion.floatLabel` | Text input animation - semantic pattern for all text inputs |

### Missing Tokens

| Token Reference | Referenced In | Status |
|-----------------|---------------|--------|
| `buttonCTA.minWidth.small` | Button-CTA schema | ❌ Not implemented |
| `buttonCTA.minWidth.medium` | Button-CTA schema | ❌ Not implemented |
| `buttonCTA.minWidth.large` | Button-CTA schema | ❌ Not implemented |

### Directory to Remove

| Directory | Contents | Action |
|-----------|----------|--------|
| `src/tokens/components/` | `chip.ts` only | Remove after migration |

---

## Proposed Changes

### Phase 1: Move Avatar Color Tokens

1. Add color token definitions to existing `src/components/core/Avatar/avatar.tokens.ts`
2. Update Avatar component implementations to use local tokens
3. Remove 5 tokens from `src/tokens/semantic/ColorTokens.ts`
4. Update tests

**Tokens to move:**
- `color.avatar.human.background`
- `color.avatar.agent.background`
- `color.avatar.human.icon`
- `color.avatar.agent.icon`
- `color.avatar.default.border`

### Phase 2: Move Badge Color Tokens

1. Create `src/components/core/Badge-Count-Notification/tokens.ts`
2. Move 2 `color.badge.notification.*` tokens
3. Update Badge component implementations
4. Remove tokens from `src/tokens/semantic/ColorTokens.ts`
5. Update tests

**Tokens to move:**
- `color.badge.notification.background`
- `color.badge.notification.text`

### Phase 3: Move Chip Tokens

1. Move `src/tokens/components/chip.ts` to `src/components/core/Chip-Base/tokens.ts`
2. Update Chip component implementations (Chip-Base, Chip-Filter, Chip-Input)
3. Delete `src/tokens/components/` directory
4. Update tests

**Tokens to move:**
- `ChipTokens.paddingBlock`

### Phase 4: Implement Missing Button-CTA Tokens (Optional)

1. Create `src/components/core/Button-CTA/tokens.ts`
2. Implement `buttonCTA.minWidth.*` tokens
3. Update Button-CTA implementation to use tokens
4. Or: Remove token references from schema if not needed

**Decision needed:** Are minWidth tokens actually required, or should schema be updated?

---

## Migration Strategy

### Backward Compatibility

During migration, maintain backward compatibility by:
1. Re-exporting tokens from old locations (deprecated)
2. Adding deprecation warnings
3. Updating documentation
4. Removing old exports in a future release

### Token Naming

Component tokens should follow the pattern:
- `{component}.{property}.{variant}` for component-specific tokens
- Reference semantic tokens where possible

Example:
```typescript
// src/components/core/Avatar/tokens.ts
export const AvatarColorTokens = defineComponentTokens({
  component: 'Avatar',
  family: 'color',
  tokens: {
    'human.background': {
      reference: semanticColorTokens['color.identity.human'],
      reasoning: 'Avatar background for human entities',
    },
    // ...
  },
});
```

---

## Impact Assessment

### Files Affected

**Token Files to Modify**:
- `src/tokens/semantic/ColorTokens.ts` — Remove 7 component tokens (Avatar: 5, Badge: 2)
- `src/tokens/components/chip.ts` — Delete (move contents)

**Token Files to Create/Update**:
- `src/components/core/Avatar/avatar.tokens.ts` — Add color tokens (file exists, add color family)
- `src/components/core/Badge-Count-Notification/tokens.ts` — Create new file
- `src/components/core/Chip-Base/tokens.ts` — Create new file (move from components/)

**Component Files to Update**:
- Avatar platform implementations (iOS, Android, Web) — Update imports
- Badge-Count-Notification platform implementations — Update imports
- Chip-Base, Chip-Filter, Chip-Input platform implementations — Update imports

**Test Files to Update**:
- `src/tokens/semantic/__tests__/ColorTokens.test.ts` — Update token count expectations
- Component test files — Update if they reference moved tokens

**Documentation to Update**:
- Token Family Color guide (if exists)
- Component documentation

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing imports | Medium | High | Re-export from old locations with deprecation warnings |
| Test failures | High | Low | Update tests as part of migration |
| Documentation drift | Medium | Medium | Update docs in same PR |
| Build pipeline issues | Low | Medium | Verify pipeline handles new locations |

### Scope Confirmation

**In Scope:**
- Avatar color tokens (5 tokens)
- Badge color tokens (2 tokens)
- Chip spacing tokens (1 token)
- Directory cleanup (`src/tokens/components/`)

**Out of Scope (Confirmed Clean):**
- All other semantic token files (audited, no component tokens found)
- Semantic tokens that reference components in descriptions (legitimate)
- Generic semantic tokens like `shadow.container`, `elevation.container`, `zIndex.container`

---

## Design Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Move tokens to component directories | Aligns with canonical Rosetta System architecture |
| 2 | Use `defineComponentTokens()` API | Consistent with existing component token patterns |
| 3 | Maintain backward compatibility | Prevents breaking changes for consumers |
| 4 | Phase migration by component | Reduces risk, allows incremental validation |
| 5 | Optional Button-CTA tokens | May not be needed if schema is updated |
| 6 | Delete `src/tokens/components/` directory | Eliminates architectural confusion |
| 7 | Add color tokens to existing Avatar file | Avatar already has `avatar.tokens.ts` for spacing |

---

## Success Criteria

1. All component tokens live in `src/components/*/tokens.ts`
2. No component tokens in `src/tokens/semantic/*.ts`
3. `src/tokens/components/` directory deleted
4. All tests pass
5. Documentation updated
6. Backward compatibility maintained via re-exports (if needed)
7. Build pipeline generates correct platform outputs

---

## Audit Methodology

The comprehensive audit followed this process:

1. **Grep search for component-prefixed tokens** in all semantic token files
2. **Manual review** of each semantic token file for component-specific patterns
3. **Verification** that generic tokens (container, text, icon) are legitimately semantic
4. **Cross-reference** with Rosetta System Architecture documentation via MCP
5. **Inventory** of existing correct component token locations

---

## Next Steps

1. ✅ **Design outline created** — Architecture documented
2. ✅ **Comprehensive audit completed** — All semantic files checked
3. ✅ **Create requirements.md** — EARS format
4. ✅ **Create design.md** — Detailed migration plan
5. ✅ **Create tasks.md** — Implementation plan
6. ⏳ **Execute tasks** — Implement migration

---

**Organization**: spec-guide
**Scope**: 058-component-token-architecture-cleanup
