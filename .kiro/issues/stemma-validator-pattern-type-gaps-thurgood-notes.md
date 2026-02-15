# Thurgood's Notes: Stemma Validator Pattern Type Gaps

**Date**: February 14, 2026
**For**: Lina (component domain specialist)
**From**: Thurgood (test governance and audit)
**Re**: `.kiro/issues/stemma-validator-pattern-type-gaps.md`

---

## Gap 1: Batch Validation Counter (Low Priority)

This one's straightforward. The naming validator's `validateComponentNames()` summary needs a `patterns: number` field to match the new `'pattern'` component type you added.

**Current behavior**: Pattern components increment `valid` but don't get type-specific counting.

**Fix**: Add `patterns` field to summary type, increment when `result.componentType === 'pattern'`.

**No architectural decision needed** — this is just completing the implementation.

---

## Gap 2: Accessibility Validator Orchestration Handling (Medium Priority)

This one's more interesting and needs your architectural judgment.

### The Problem

The accessibility validator's `determineComponentType()` uses substring matching:
- `Input-Radio-Set` contains "input" → classified as `'input'` type
- Input types require `label` property
- But Set components are orchestration containers, not direct inputs
- They get semantics from `role="radiogroup"` and children, not from a label prop

Your stemma test passes `{ selectedValue, required, error, size }` without a label, expecting no `MISSING_ACCESSIBILITY_LABEL` error. But the validator raises one.

### Architectural Question

**Should orchestration/pattern components have their own accessibility labels, or do they inherit semantics from their role and children?**

This affects how we validate all future Set/orchestration components, not just Input-Radio-Set.

### Three Possible Approaches

#### Option 1: Recognize Orchestration Patterns as Distinct Type (Recommended)

Update `determineComponentType` in the accessibility validator to recognize "Set" variants as a distinct category that doesn't require direct labels.

**Pros:**
- Architecturally clean — orchestration containers are fundamentally different from direct inputs
- Aligns with how ARIA roles work (`role="radiogroup"` provides group semantics)
- Prevents false positives on future Set/orchestration components
- Matches the conceptual model you established in the naming validator

**Cons:**
- Requires updating the accessibility validator's type system
- Need to define what accessibility properties orchestration components *should* have (role? aria-labelledby? nothing?)
- Substring matching is already brittle — this adds another pattern to maintain

**Implementation complexity**: Medium. Need to add pattern recognition and define orchestration accessibility requirements.

#### Option 2: Add Label to Test Props (Quick Fix)

Pass a `label` prop in the stemma test to satisfy the validator.

**Pros:**
- Minimal code change
- Test passes immediately
- Doesn't require validator changes

**Cons:**
- **Semantically wrong** — if Sets shouldn't have labels, the test is lying about the component's contract
- Masks the architectural mismatch between validator and component design
- Every future Set component will need to pass a label it doesn't actually use
- Doesn't solve the problem, just hides it

**Implementation complexity**: Trivial. But I don't recommend this unless you decide Sets *should* have labels.

#### Option 3: Add 'group' Component Type to Accessibility Validator (Most Thorough)

Extend the accessibility validator with a `'group'` component type that has different label requirements (e.g., requires `role` but not `label`, or requires `aria-labelledby` instead of `label`).

**Pros:**
- Most architecturally complete — explicitly models group/container semantics
- Aligns with WCAG patterns for group labeling
- Future-proof for other group types (checkbox groups, button groups, etc.)
- Makes accessibility requirements explicit and testable

**Cons:**
- Most work — need to define group accessibility requirements, update validator logic, update tests
- Might be over-engineering if we only have one orchestration pattern right now
- Need to research WCAG group labeling requirements to get it right

**Implementation complexity**: High. But if we're building a design system with multiple orchestration patterns, this investment pays off.

---

## My Recommendation

**Option 1** (recognize orchestration patterns as distinct) is the sweet spot.

**Why?** You've already established that "Set" variants are conceptually different by adding the `'pattern'` type to the naming validator. The accessibility validator should respect that distinction. Orchestration containers manage children — they don't have direct user input, so they shouldn't be validated as if they do.

**Counter-argument**: Maybe I'm wrong. Maybe orchestration components *should* have labels for screen reader users to understand the group's purpose. `aria-labelledby` or `aria-label` on the container could provide that context. In that case, Option 3 (add 'group' type with specific requirements) might be the right call.

**What I'd need to know to decide**:
1. Do other Set/orchestration components exist or are planned? (If yes, Option 1 or 3. If no, maybe Option 2 is fine for now.)
2. What's the WCAG guidance on labeling groups vs individual inputs? (Might inform whether Sets need labels at all.)
3. What's the component's actual rendered HTML? (Does it have `role="radiogroup"`? Does it have `aria-labelledby`?)

---

## Test Infrastructure Note

This was a **pre-existing failure** masked by the earlier `componentType` test failure. Your fix exposed it, which is good — silent failures are worse than visible ones.

**Observation**: The accessibility validator's substring matching is brittle. `Input-Radio-Set` shouldn't be classified as an input just because it contains "input". If we add more orchestration patterns (Checkbox-Set, Button-Group, etc.), this pattern will break repeatedly.

**Suggestion**: Consider whether the accessibility validator should use a more robust classification strategy — maybe checking for "Set" or "Group" suffixes first, or using a component registry that maps names to types explicitly.

But that's a larger refactor. For now, handling "Set" variants as a special case in `determineComponentType` would unblock this issue.

---

## Next Steps (Your Call)

1. **Decide architectural stance**: Should orchestration components have labels?
2. **Choose fix approach**: Option 1, 2, or 3 based on that stance
3. **Implement**: Update validator and/or test as appropriate
4. **Validate**: Run `npm test -- src/validators/__tests__/StemmaPropertyAccessibilityValidator.test.ts` and `npm test -- src/components/InputRadioSet/__tests__/InputRadioSet.stemma.test.ts`

Let me know if you want me to audit the actual validator code or test files to inform your decision. I can also check if there are other Set/orchestration components in the codebase that would be affected.

— Thurgood
