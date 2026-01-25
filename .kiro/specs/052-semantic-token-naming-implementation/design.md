# Design Document: Semantic Token Naming Implementation

**Date**: January 24, 2026
**Spec**: 052 - Semantic Token Naming Implementation
**Status**: Design Phase
**Dependencies**: Spec 051 (Design Authority) — Complete
**Design Authority**: `.kiro/specs/051-semantic-token-naming-restructure/design-outline.md`

---

## Overview

This document describes the implementation approach for the semantic color token naming restructure. The **design authority** (Spec 051 design-outline.md) defines the naming model, token mappings, and architectural decisions. This document focuses on **how** to execute the implementation.

**Implementation Phases**:
1. Primitive RGBA Migration
2. Semantic Concept Token Creation
3. Platform Token Generation
4. Component Updates (Web, iOS, Android)
5. Documentation Updates
6. Test Updates

---

## Architecture

### Implementation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      IMPLEMENTATION SEQUENCE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Phase 1: Primitive RGBA Migration                                          │
│   └── src/tokens/ColorTokens.ts                                             │
│       └── Convert ~50 hex values to RGBA format                             │
│                                                                              │
│   Phase 2: Semantic Concept Token Creation                                   │
│   └── src/tokens/semantic/ColorSemanticTokens.ts                            │
│       ├── Create feedback concept tokens                                    │
│       ├── Create identity concept tokens                                    │
│       ├── Create action concept tokens                                      │
│       ├── Create contrast concept tokens                                    │
│       └── Create structure concept tokens                                   │
│                                                                              │
│   Phase 3: Platform Token Generation                                         │
│   └── npx ts-node scripts/generate-platform-tokens.ts                       │
│       ├── Verify dist/DesignTokens.web.css                                  │
│       ├── Verify dist/DesignTokens.ios.swift                                │
│       └── Verify dist/DesignTokens.android.kt                               │
│                                                                              │
│   Phase 4: Component Updates                                                 │
│   └── src/components/core/[Component]/                                      │
│       ├── [Component].web.css                                               │
│       ├── [Component].ios.swift                                             │
│       └── [Component].android.kt                                            │
│                                                                              │
│   Phase 5: Documentation Updates                                             │
│   └── .kiro/steering/                                                       │
│       ├── Token-Family-Color.md                                             │
│       ├── Token-Governance.md                                               │
│       ├── Token-Quick-Reference.md                                          │
│       └── Rosetta-System-Architecture.md                                    │
│                                                                              │
│   Phase 6: Test Updates                                                      │
│   └── src/__tests__/                                                        │
│       └── ColorTokens.test.ts                                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### File Impact Summary

| Category | Files Affected | Scope |
|----------|----------------|-------|
| Primitive Tokens | 1 | `src/tokens/ColorTokens.ts` |
| Semantic Tokens | 1-2 | `src/tokens/semantic/ColorSemanticTokens.ts` |
| Component Tokens | ~5 | `src/tokens/components/*.ts` |
| Rosetta Generators | 3 | `src/generators/*FormatGenerator.ts` |
| Components (Web) | ~8 | `src/components/core/*/[Component].web.css` |
| Components (iOS) | ~8 | `src/components/core/*/[Component].ios.swift` |
| Components (Android) | ~8 | `src/components/core/*/[Component].android.kt` |
| Steering Docs | 6 | `.kiro/steering/*.md` |
| Tests | ~5 | `src/__tests__/*.test.ts` |

---

## Components and Interfaces

### Phase 1: Primitive RGBA Migration

**File**: `src/tokens/ColorTokens.ts`

**Current Format**:
```typescript
export const ColorTokens = {
  'white-100': '#FFFFFF',
  'gray-100': '#E5E5E5',
  'purple-300': '#A855F7',
  // ...
};
```

**Target Format**:
```typescript
export const ColorTokens = {
  'white-100': 'rgba(255, 255, 255, 1)',
  'gray-100': 'rgba(229, 229, 229, 1)',
  'purple-300': 'rgba(168, 85, 247, 1)',
  // ...
};
```

**Conversion Rule**: `#RRGGBB` → `rgba(R, G, B, 1)` where R, G, B are decimal values.

### Phase 2: Semantic Concept Token Creation

**File**: `src/tokens/semantic/ColorSemanticTokens.ts`

**Token Structure by Concept**:

```typescript
// Feedback Concept
'color.feedback.success.text': 'green-400',
'color.feedback.success.background': 'green-100',
'color.feedback.success.border': 'green-400',
'color.feedback.error.text': 'pink-400',
'color.feedback.error.background': 'pink-100',
'color.feedback.error.border': 'pink-400',
// ... warning, info, select

// Identity Concept
'color.identity.human': 'orange-300',
'color.identity.agent': 'teal-200',

// Action Concept
'color.action.primary': 'purple-300',
'color.action.secondary': 'black-400',

// Contrast Concept
'color.contrast.onLight': 'black-500',
'color.contrast.onDark': 'white-100',

// Structure Concept
'color.structure.canvas': 'white-100',
'color.structure.surface': 'white-200',
'color.structure.border': 'gray-100',
'color.structure.border.subtle': 'rgba(229, 229, 229, 0.48)', // baked-in alpha
```

**Code Comment Requirement** (per Requirement 9):
```typescript
/**
 * Feedback Concept: Communicate system status to users
 * 
 * Design Note (Select): Select is placed under feedback as UI response to 
 * user action. If additional interaction-based use cases emerge (focus states, 
 * drag states), consider migrating to an 'interaction' concept.
 * 
 * @see .kiro/specs/051-semantic-token-naming-restructure/design-outline.md
 */
```

### Phase 3: Platform Token Generation

**Command**: `npx ts-node scripts/generate-platform-tokens.ts`

**Expected Outputs**:

| Platform | File | Format |
|----------|------|--------|
| Web | `dist/DesignTokens.web.css` | `--color-feedback-success-text: rgba(74, 222, 128, 1);` |
| iOS | `dist/DesignTokens.ios.swift` | `static let colorFeedbackSuccessText = UIColor(red: 0.29, green: 0.87, blue: 0.50, alpha: 1)` |
| Android | `dist/DesignTokens.android.kt` | `val colorFeedbackSuccessText = Color.argb(255, 74, 222, 128)` |

### Phase 4: Component Updates

**Components Requiring Updates** (from audit):

| Component | Platforms | Token Changes |
|-----------|-----------|---------------|
| Avatar | Web, iOS, Android | identity, contrast tokens |
| Button-CTA | Web, iOS, Android | action.primary, contrast.onDark |
| Button-Icon | Web, iOS, Android | action.primary, contrast.onDark |
| Button-VerticalList-Item | Web, iOS, Android | feedback.select.* tokens |
| Button-VerticalList-Set | Web, iOS, Android | feedback.error.text |
| Container-Base | Web, iOS, Android | accessibility focus token |
| Container-Card-Base | Web, iOS, Android | accessibility focus token, remove hardcoded fallback |
| Input-Text-Base | Web, iOS, Android | feedback.error.text, feedback.success.text |
| Badge-Count-Notification | Web, iOS, Android | reordered token names |

**Update Pattern (Web Example)**:
```css
/* Before */
.button-cta {
  background-color: var(--color-primary);
  color: var(--color-contrast-on-primary);
}

/* After */
.button-cta {
  background-color: var(--color-action-primary);
  color: var(--color-contrast-on-dark);
}
```

---

## Data Models

### Token Naming Pattern

**Semantic Concept Tokens**:
```
color.{concept}.{role}.{property?}.{state?}.{intensity?}
```

**Component Tokens**:
```
color.{component}.{variant}.{property}
```

### Complete Token Migration Map

See **Design Authority** (`.kiro/specs/051-semantic-token-naming-restructure/design-outline.md`) section "Complete Migration Mapping" for the authoritative token mapping table.

---

## Error Handling

### Migration Validation

1. **Pre-migration**: Verify all old token names exist in codebase
2. **Post-migration**: Verify no old token names remain
3. **Platform generation**: Verify all three platform outputs are generated
4. **Component compilation**: Verify no build errors after token updates

### Rollback Strategy

Since this is a clean break with no external consumers:
- Git provides rollback capability
- No deprecation aliases needed
- If issues found, revert commits and fix

---

## Testing Strategy

### Evergreen Tests (Permanent)

**Token Value Tests**:
```typescript
describe('Semantic Color Tokens', () => {
  it('should resolve feedback.success.text to correct RGBA value', () => {
    expect(resolveToken('color.feedback.success.text')).toBe('rgba(74, 222, 128, 1)');
  });
});
```

**Platform Output Tests**:
```typescript
describe('Platform Token Generation', () => {
  it('should generate valid CSS custom properties', () => {
    const css = generateWebTokens();
    expect(css).toContain('--color-feedback-success-text: rgba(');
  });
  
  it('should generate valid Swift constants', () => {
    const swift = generateiOSTokens();
    expect(swift).toContain('UIColor(red:');
  });
  
  it('should generate valid Kotlin constants', () => {
    const kotlin = generateAndroidTokens();
    expect(kotlin).toContain('Color.argb(');
  });
});
```

### Component Tests

**Test behavior, not implementation** (per Test Development Standards):
```typescript
// ✅ Good - Tests behavior
it('should render button with correct background color', () => {
  const button = createButtonCTA({ variant: 'primary' });
  // Test visual output, not token name used
});

// ❌ Bad - Tests implementation detail
it('should use color.action.primary token', () => {
  // Don't test specific token names in component tests
});
```

### Temporary Tests (Retire After Migration)

```typescript
/**
 * TEMPORARY TEST - Delete after Spec 052 migration complete
 * Validates no old token names remain in codebase
 */
describe('Migration Validation', () => {
  it('should not have any references to color.primary', () => {
    // Grep codebase for old token names
  });
});
```

---

## Design Decisions

### Decision 1: Clean Break (No Deprecation Aliases)

**Options Considered**:
1. Deprecation aliases with 2-release transition period
2. Clean break with immediate removal of old names

**Decision**: Clean break

**Rationale**: No external consumers exist. Deprecation aliases add complexity without benefit.

**Trade-offs**: None — this is the ideal time for breaking changes.

### Decision 2: RGBA at Primitive Level

**Options Considered**:
1. Convert to RGBA at semantic token level
2. Convert to RGBA at primitive token level (chosen)
3. Convert to RGBA at generation time

**Decision**: Convert at primitive level

**Rationale**: 
- One conversion cascades through entire hierarchy
- Primitives define raw values including format
- Semantics define meaning by reference
- Cleaner architecture

**Trade-offs**: All primitives change format, but this is a one-time migration.

### Decision 3: Build Sequencing

**Options Considered**:
1. Update tokens and components simultaneously
2. Update tokens first, generate, then update components (chosen)

**Decision**: Sequential — tokens first, then generation, then components

**Rationale**: Components consume generated tokens. Generation must complete before components can reference new token names.

**Trade-offs**: Requires explicit sequencing in task execution.

---

## Implementation Notes

### Sequencing Dependencies

```
Token Definitions → Platform Generation → Component Updates → Tests → Documentation
```

**Critical**: Run `npx ts-node scripts/generate-platform-tokens.ts` after token definition changes and before component updates.

### Platform-Specific Considerations

**Web**: CSS custom properties with `rgba()` format
**iOS**: UIColor with normalized RGB values (0-1 range)
**Android**: Color.argb with integer RGB values (0-255 range)

### MCP Documentation Rebuild

After steering documentation updates, rebuild MCP indexes:
```bash
# MCP server will auto-rebuild on file changes
# Verify via: get_index_health()
```

---

## References

- **Design Authority**: `.kiro/specs/051-semantic-token-naming-restructure/design-outline.md`
- **Component Audit**: `findings/component-token-audit-051.md`
- **Rosetta Architecture**: `.kiro/steering/Rosetta-System-Architecture.md` (MCP)
- **Test Development Standards**: `.kiro/steering/Test-Development-Standards.md` (MCP)
