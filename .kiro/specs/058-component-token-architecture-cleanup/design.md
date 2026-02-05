# Design Document: Component Token Architecture Cleanup

**Date**: February 4, 2026
**Spec**: 058 - Component Token Architecture Cleanup
**Status**: Design Phase
**Dependencies**: 
- Rosetta System Architecture (token pipeline)
- Stemma System (component architecture)

---

## Overview

This spec migrates 8 component tokens from incorrect locations to their canonical locations per Rosetta System architecture. The migration follows a phased approach to minimize risk and maintain backward compatibility.

**Key Design Principles:**
- Component tokens live at `src/components/[ComponentName]/tokens.ts`
- Semantic tokens remain in `src/tokens/semantic/*.ts`
- Backward compatibility via re-exports with deprecation warnings
- Phased migration by component family

**Tokens to Migrate:**
- Avatar color tokens (5): `color.avatar.human.background`, `color.avatar.agent.background`, `color.avatar.human.icon`, `color.avatar.agent.icon`, `color.avatar.default.border`
- Badge color tokens (2): `color.badge.notification.background`, `color.badge.notification.text`
- Chip spacing tokens (1): `chip.paddingBlock`

---

## Architecture

### Current State (Incorrect)

```
src/tokens/
├── semantic/
│   └── ColorTokens.ts          ❌ Contains Avatar + Badge component tokens
└── components/
    └── chip.ts                 ❌ Wrong directory for component tokens

src/components/core/
├── Avatar/
│   └── avatar.tokens.ts        ✅ Has spacing tokens (correct location)
├── Badge-Count-Notification/   ❌ No tokens.ts file
└── Chip-Base/                  ❌ No tokens.ts file
```

### Target State (Correct)

```
src/tokens/
├── semantic/
│   └── ColorTokens.ts          ✅ Only semantic tokens (no component tokens)
└── components/                 ❌ DELETED

src/components/core/
├── Avatar/
│   └── avatar.tokens.ts        ✅ Has spacing + color tokens
├── Badge-Count-Notification/
│   └── tokens.ts               ✅ Has color tokens
└── Chip-Base/
    └── tokens.ts               ✅ Has spacing tokens
```

### Token Architecture Layers

| Layer | Location | Purpose | Examples |
|-------|----------|---------|----------|
| **Primitive** | `src/tokens/*.ts` | Raw values | `space075`, `orange300`, `pink400` |
| **Semantic** | `src/tokens/semantic/*.ts` | Contextual meaning | `color.identity.human`, `color.feedback.error.text` |
| **Component** | `src/components/*/tokens.ts` | Component-specific | `avatar.human.background`, `chip.paddingBlock` |

---

## Components and Interfaces

### Avatar Color Tokens (New Structure)

```typescript
// src/components/core/Avatar/avatar.tokens.ts (updated)

import { defineComponentTokens } from '../../../build/tokens';
import { colorTokens } from '../../../tokens/semantic/ColorTokens';

/**
 * Avatar color tokens - component-specific colors for Avatar variants
 * 
 * These tokens reference semantic identity and contrast tokens,
 * following the compositional architecture.
 */
export const AvatarColorTokens = defineComponentTokens({
  component: 'Avatar',
  family: 'color',
  tokens: {
    'human.background': {
      reference: colorTokens['color.identity.human'],
      reasoning: 'Avatar background for human entities - warm, approachable identity',
    },
    'agent.background': {
      reference: colorTokens['color.identity.agent'],
      reasoning: 'Avatar background for AI agent entities - distinct, technical identity',
    },
    'human.icon': {
      reference: colorTokens['color.contrast.onDark'],
      reasoning: 'Icon color on human avatar - ensures WCAG AA contrast on orange background',
    },
    'agent.icon': {
      reference: colorTokens['color.contrast.onDark'],
      reasoning: 'Icon color on agent avatar - ensures WCAG AA contrast on teal background',
    },
    'default.border': {
      reference: colorTokens['color.structure.border'],
      reasoning: 'Border color for avatar components - subtle visual definition',
    },
  },
});
```

### Badge Color Tokens (New File)

```typescript
// src/components/core/Badge-Count-Notification/tokens.ts (new)

import { defineComponentTokens } from '../../../build/tokens';

/**
 * Badge-Count-Notification color tokens
 * 
 * Component-specific colors for notification badges.
 * Uses pink400 background with white text for high-visibility alerts.
 */
export const BadgeNotificationColorTokens = defineComponentTokens({
  component: 'BadgeNotification',
  family: 'color',
  tokens: {
    'notification.background': {
      reference: 'pink400',  // Direct primitive reference
      reasoning: 'High-visibility alert background with 6.33:1 contrast ratio against white text',
    },
    'notification.text': {
      reference: 'white100',  // Direct primitive reference
      reasoning: 'White text for WCAG AA contrast compliance on pink background',
    },
  },
});
```

### Chip Tokens (Relocated)

```typescript
// src/components/core/Chip-Base/tokens.ts (moved from src/tokens/components/chip.ts)

import { defineComponentTokens } from '../../../build/tokens';
import { spacingTokens } from '../../../tokens/SpacingTokens';

/**
 * Chip component tokens
 * 
 * Platform-agnostic token definitions for the Chip component family.
 * Uses the defineComponentTokens() API for pipeline integration.
 */
export const ChipTokens = defineComponentTokens({
  component: 'Chip',
  family: 'spacing',
  tokens: {
    'paddingBlock': {
      reference: spacingTokens.space075,
      reasoning: 'Block padding achieving 32px visual height with buttonSm typography. 6px padding × 2 + 20px content = 32px.',
    },
  },
});
```

---

## Data Models

### Tokens Being Removed from ColorTokens.ts

```typescript
// These tokens will be REMOVED from src/tokens/semantic/ColorTokens.ts

// Avatar tokens (5)
'color.avatar.human.background'    // → src/components/core/Avatar/avatar.tokens.ts
'color.avatar.agent.background'    // → src/components/core/Avatar/avatar.tokens.ts
'color.avatar.human.icon'          // → src/components/core/Avatar/avatar.tokens.ts
'color.avatar.agent.icon'          // → src/components/core/Avatar/avatar.tokens.ts
'color.avatar.default.border'      // → src/components/core/Avatar/avatar.tokens.ts

// Badge tokens (2)
'color.badge.notification.background'  // → src/components/core/Badge-Count-Notification/tokens.ts
'color.badge.notification.text'        // → src/components/core/Badge-Count-Notification/tokens.ts
```

### Semantic Tokens Remaining (Correctly Placed)

These tokens were audited and confirmed as legitimate semantic tokens:

| Token | Rationale |
|-------|-----------|
| `color.identity.human` | Semantic identity concept - used by Avatar and potentially other components |
| `color.identity.agent` | Semantic identity concept - used by Avatar and potentially other components |
| `color.text.default/muted/subtle` | Text hierarchy - applies across all components |
| `color.icon.default` | Default icon color - applies across all components |
| `shadow.container` | Generic container shadow - not specific to Container component |
| `elevation.container` | Generic container elevation - not specific to Container component |
| `zIndex.container` | Generic container z-index - not specific to Container component |

---

## Error Handling

### Migration Errors

| Scenario | Behavior | Mitigation |
|----------|----------|------------|
| Import from old location | Deprecation warning + re-export | Backward compatibility maintained |
| Missing token reference | Build error | Verify all references before removing |
| Test failures | CI blocks merge | Update tests as part of migration |

### Backward Compatibility Strategy

```typescript
// src/tokens/semantic/ColorTokens.ts (after migration)

// Re-export for backward compatibility (deprecated)
export { AvatarColorTokens } from '../../components/core/Avatar/avatar.tokens';
export { BadgeNotificationColorTokens } from '../../components/core/Badge-Count-Notification/tokens';

// Deprecation warning (logged once per session)
console.warn(
  '[DEPRECATED] Avatar color tokens have moved to src/components/core/Avatar/avatar.tokens.ts. ' +
  'Update your imports to avoid future breaking changes.'
);
```

---

## Testing Strategy

### Test Updates Required

| File | Change |
|------|--------|
| `src/tokens/semantic/__tests__/ColorTokens.test.ts` | Update token count: remove 7 tokens |
| Component tests | Update imports if referencing moved tokens |

### Validation Approach

1. **Pre-migration**: Run `npm test` to establish baseline
2. **Per-phase**: Run targeted tests after each component migration
3. **Post-migration**: Run full `npm test` to verify no regressions

### Test Categories

**Evergreen Tests** (behavior verification):
- Token values resolve correctly from new locations
- Component implementations use correct token values
- Platform outputs generate correctly

**What NOT to Test**:
- Specific file paths (implementation detail)
- Import statement syntax (implementation detail)

---

## Design Decisions

### Decision 1: Add Color Tokens to Existing Avatar File

**Options Considered**:
1. Create separate `avatar.color.tokens.ts` file
2. Add to existing `avatar.tokens.ts` file
3. Create new `tokens.ts` file (rename existing)

**Decision**: Add to existing `avatar.tokens.ts` file

**Rationale**:
- Avatar already has `avatar.tokens.ts` for spacing tokens
- Single file for all Avatar tokens improves discoverability
- Follows pattern of other components with multiple token families

**Trade-offs**:
- File grows larger (but still manageable)
- Mixed token families in one file

---

### Decision 2: Delete src/tokens/components/ Directory

**Options Considered**:
1. Keep directory for future component tokens
2. Delete directory entirely
3. Rename to deprecated/

**Decision**: Delete directory entirely

**Rationale**:
- Directory violates canonical architecture
- Only contained chip.ts (now moved)
- Keeping it invites future misuse
- Clear signal that component tokens go in component directories

**Trade-offs**:
- No fallback location for edge cases
- Must update any documentation referencing this directory

---

### Decision 3: Re-export for Backward Compatibility

**Options Considered**:
1. Breaking change (no re-exports)
2. Re-exports with deprecation warnings
3. Re-exports without warnings

**Decision**: Re-exports with deprecation warnings

**Rationale**:
- Prevents breaking existing consumers
- Deprecation warnings guide migration
- Allows gradual adoption
- Standard practice for API migrations

**Trade-offs**:
- Maintains old code paths temporarily
- Consumers may ignore warnings

---

### Decision 4: Component Tokens Reference Semantic Tokens

**Options Considered**:
1. Component tokens reference primitives directly
2. Component tokens reference semantic tokens
3. Mixed approach based on use case

**Decision**: Component tokens reference semantic tokens where appropriate

**Rationale**:
- Maintains token hierarchy (primitive → semantic → component)
- Avatar colors should reference `color.identity.*` semantic tokens
- Enables theme-aware behavior through semantic layer
- Badge colors reference primitives (no semantic equivalent exists)

**Trade-offs**:
- Additional indirection for some tokens
- Must ensure semantic tokens exist before component tokens

---

## Platform Implementation Notes

### Import Path Updates

**Web Components**:
```typescript
// Before
import { colorTokens } from '../../../tokens/semantic/ColorTokens';
const avatarBg = colorTokens['color.avatar.human.background'];

// After
import { AvatarColorTokens } from './avatar.tokens';
const avatarBg = AvatarColorTokens['human.background'];
```

**iOS/Android**:
- Token generation pipeline handles new locations automatically
- No platform-specific code changes required
- Generated constants maintain same names

### Build Pipeline

The Rosetta token pipeline already supports component tokens in `src/components/*/tokens.ts`. No pipeline changes required.

---

## Requirements Traceability

| Requirement | Design Section |
|-------------|----------------|
| R1: Avatar Color Token Migration | Components and Interfaces (Avatar), Data Models |
| R2: Badge Color Token Migration | Components and Interfaces (Badge), Data Models |
| R3: Chip Token Migration | Components and Interfaces (Chip), Decision 2 |
| R4: Backward Compatibility | Error Handling, Decision 3 |
| R5: Test Updates | Testing Strategy |
| R6: Documentation Updates | (tasks.md - post-implementation) |

---

**Organization**: spec-validation
**Scope**: 058-component-token-architecture-cleanup
