# Spec 050: Nav-TabBar-Base — Design Outline Feedback

**Date**: 2026-03-13
**Reviewer**: Thurgood
**Round**: R1

> **Note (2026-03-14)**: Component renamed from Nav-BottomTabs-Base to Nav-TabBar-Base. Web-first header navigation split to separate spec (Nav-Header-Base, TBD). Feedback below still applies to the renamed component.

---

## Overall Assessment

The outline captures the right component concept and has solid accessibility thinking. However, nearly every token reference is fictional — the placeholder notice is accurate. The API design makes assumptions about patterns (callback props, JSX-style usage) that don't match DesignerPunk's Web Component / True Native architecture. Needs significant revision before formalization.

---

## Critical Issues

### F1. Token References Are Almost Entirely Fictional

Of ~14 token references in the outline, only 2 exist in the system:
- ✅ `space050` — exists
- ✅ `icon.size200` — exists

Everything else is invented:
- ❌ `color.surface.primary` → actual: `color.structure.surface.primary`
- ❌ `color.border.subtle` → actual: `color.structure.border.subtle`
- ❌ `color.interactive.primary` → no `interactive` concept exists; closest: `color.action.primary`
- ❌ `color.interactive.primaryPressed` → doesn't exist; no pressed-state color tokens in the system
- ❌ `color.content.tertiary` → no `content` concept; closest: `color.text.subtle` or `color.icon.default`
- ❌ `color.content.disabled` → doesn't exist; no disabled-state color tokens currently
- ❌ `color.feedback.error.emphasis` → actual: `color.feedback.error.text` or `color.feedback.error.background`
- ❌ `white100` → not a token name in the system
- ❌ `fontSize.xs`, `fontSize.xxs` → typography uses composite semantic tokens (`typography.caption`, `typography.labelXs`)
- ❌ `fontWeight.medium` → no standalone fontWeight semantic tokens
- ❌ `shadow.sm` → actual shadow tokens: `shadow.container`, `shadow.navigation`, etc.
- ❌ `motion.duration.fast` → actual motion tokens: `motion.selectionTransition`, `motion.focusTransition`, etc.

**Action**: Full token pass required. Ada should review and map to actual tokens.

### F2. Component Token Proposal Is Premature

The outline proposes 9 new `bottomTabs.*` semantic tokens. Per Token Governance, these would be component tokens (requiring human approval), not semantic tokens. And the outline shouldn't propose token creation — that happens during implementation after Ada reviews what exists.

**Action**: Remove the "New Semantic Tokens" section. Replace with a note that component tokens will be defined during implementation per Token Governance.

### F3. API Design Doesn't Match Architecture

The props interface uses React-style patterns (`onTabChange` callback, JSX usage examples). DesignerPunk uses Web Components with attributes/properties for web, SwiftUI for iOS, and Jetpack Compose for Android. The API should follow the `types.ts` pattern used by other components.

**Action**: Revise API to match DesignerPunk's attribute-based Web Component pattern. Reference Nav-SegmentedChoice-Base's `types.ts` as the model.

### F4. Platform Implementations Are Too Detailed for a Design Outline

Full HTML/CSS/Swift/Kotlin implementations don't belong in a design outline. These are implementation details that belong in the design doc or the actual platform files. The outline should describe behavior and visual specs, not code.

**Action**: Replace platform implementation code with behavioral descriptions. Keep platform-specific notes (safe area handling, Material 3 base) but remove code blocks.

---

## Moderate Issues

### F5. Hard-Coded Pixel Values

Multiple hard-coded values that should reference tokens:
- `56px` height → needs a spacing or sizing token reference
- `64px` min width, `168px` max width → need token references
- `16px` badge min size, `18px` badge with count → need token references
- `44px` touch target → should reference `tapAreaRecommended` if it exists
- `1px` border → should reference `borderWidth` tokens

**Action**: Map all pixel values to existing tokens or flag as needing new tokens.

### F6. Badge Integration Unclear

The outline includes badge support but DesignerPunk already has Badge components (Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base). Should BottomTabs compose with existing Badge components rather than implementing its own badge rendering?

**Action**: Clarify whether badges are composed from existing Badge family components or rendered internally. Composition is preferred per Stemma principles.

### F7. Missing Behavioral Contracts

No `contracts.yaml` mentioned. Per Spec 078, contracts must be authored before platform implementation. The outline should identify expected behavioral contracts.

**Action**: Add a section listing expected behavioral contracts using `{category}_{concept}` naming from the Concept Catalog.

---

## Minor Issues

### F8. Family Count Inconsistency

The outline says "3-5 tabs recommended" in design decisions but doesn't enforce this. Should this be a validation contract or just guidance?

### F9. Future Variants Are Speculative

Nav-BottomTabs-Floating, Nav-BottomTabs-Minimal, Nav-BottomTabs-Adaptive are listed but have no design basis. Fine to mention as future direction but shouldn't influence the base component design.

### F10. Missing Nav Family Context

No reference to the Navigation family doc or Nav-SegmentedChoice-Base as a sibling component. The outline should acknowledge its place in the Nav family hierarchy.

---

## Recommended Revision Order

1. **Ada**: Full token mapping pass — replace all fictional tokens with actual system tokens
2. **Peter**: API design revision — align with Web Component attribute pattern
3. **Lina**: Badge composition decision + behavioral contracts identification
4. **Thurgood**: Re-review after revisions, then formalize to requirements/design/tasks
