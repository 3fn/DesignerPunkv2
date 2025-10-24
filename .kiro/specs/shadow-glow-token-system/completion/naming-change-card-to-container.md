# Naming Change: shadow.card → shadow.container

**Date**: October 24, 2025
**Type**: Design Decision
**Status**: Complete

---

## Decision

Changed semantic shadow token name from `shadow.card` to `shadow.container` to align with DesignerPunk design system philosophy and industry best practices.

## Rationale

### Design System Philosophy

From `preserved-knowledge/true-native-architecture-concepts.md`:

**"Function Over Form: Component names describe purpose (Container) rather than appearance (Card)"**

Key principles:
- **Domain Clarity**: "Container vs. Card avoids payment/gaming confusion" (Card has multiple meanings)
- **Design Evolution**: Names remain valid through visual redesigns and theme changes
- **Cross-Platform Consistency**: Same component names work across web, iOS, and Android
- **Mathematical Integration**: Component names support token consumption and validation patterns

### Industry Alignment

Shopify Polaris is moving away from "Card" terminology in favor of "Section" and other semantic names, recognizing the same issues with component-specific naming.

### Semantic Clarity

- **Container**: Describes purpose (something that contains content)
- **Card**: Describes appearance (a card-like visual treatment)

Container is more semantically accurate for a shadow token that can be applied to any contained element, not just "card" components.

## Files Updated

1. ✅ `src/tokens/semantic/ShadowTokens.ts` - Changed token name and descriptions
2. ✅ `.kiro/specs/shadow-glow-token-system/design.md` - Updated design documentation
3. ✅ `.kiro/specs/shadow-glow-token-system/tasks.md` - Updated task descriptions
4. ✅ `.kiro/specs/shadow-glow-token-system/completion/task-3-1-completion.md` - Updated completion doc

## Changes Made

### Before
```typescript
'shadow.card': {
  name: 'shadow.card',
  primitiveReferences: { /* ... */ },
  context: 'Standard card shadow with noon lighting and moderate quality',
  description: 'Card shadow with no horizontal offset, 4px vertical offset, 12px blur, moderate opacity'
}
```

### After
```typescript
'shadow.container': {
  name: 'shadow.container',
  primitiveReferences: { /* ... */ },
  context: 'Standard container shadow with noon lighting and moderate quality',
  description: 'Container shadow with no horizontal offset, 4px vertical offset, 12px blur, moderate opacity'
}
```

## Impact

- **Breaking Change**: No - this was implemented in Task 3.1 and changed immediately
- **API Surface**: Token name changed from `shadow.card` to `shadow.container`
- **Validation**: All diagnostics pass, no syntax errors
- **Documentation**: All spec documents updated to reflect new naming

## Benefits

1. **Alignment with Design Philosophy**: Follows established DesignerPunk naming principles
2. **Semantic Accuracy**: Name describes purpose (container) not appearance (card)
3. **Domain Clarity**: Avoids confusion with payment/gaming "card" terminology
4. **Future-Proof**: Name remains valid through visual redesigns
5. **AI Collaboration**: Unambiguous terminology for AI agent understanding

## Counter-Arguments Considered

**Argument**: "Card is more familiar to developers"
**Response**: Familiarity with problematic patterns doesn't justify perpetuating them. Container is equally familiar and more semantically accurate.

**Argument**: "This creates inconsistency with other design systems"
**Response**: Other design systems (like Shopify) are moving away from "card" for the same reasons. We're aligning with industry evolution, not creating inconsistency.

**Argument**: "We already implemented shadow.card"
**Response**: We caught this immediately after Task 3.1 implementation. Changing now is trivial compared to carrying technical debt.

## Lessons Learned

1. **Preserved Knowledge Value**: Having documented design philosophy in preserved-knowledge enabled quick validation of naming decisions
2. **Early Validation**: Questioning naming decisions immediately after implementation prevents technical debt
3. **Systematic Skepticism**: Applying counter-arguments helped validate the decision was sound
4. **Industry Awareness**: Tracking industry trends (Shopify's evolution) provides validation for design decisions

---

**Organization**: spec-completion
**Scope**: shadow-glow-token-system
