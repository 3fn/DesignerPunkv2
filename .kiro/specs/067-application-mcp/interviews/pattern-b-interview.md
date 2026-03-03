# Pattern B Interview: Account Onboarding (Multi-Step Flow)

**Date**: 2026-03-02
**Interviewer**: Lina
**Interviewee**: Peter
**Pattern file**: `experience-patterns/account-onboarding.yaml`

---

## Interview Log

### Q1–Q2: Scenario and step count

**Lina's initial proposal**: 3-step account registration (credentials → preferences → confirmation). Peter asked for clarity on what "preferences" and "confirmation" meant concretely.

**Lina's clarification**: "Preferences" was a post-auth configuration step (interests, display name, notifications). "Confirmation" was a review-before-commit screen — Lina acknowledged this was filler motivated by schema needs rather than real product thinking.

**Peter's response**: Agreed on 3 steps but grounded them in real product flows:
1. Auth screen with login/create account toggle
2. Preferences (interests, display name, notifications)
3. "What's next" informational screen (not a review screen)

### Q3: Step 1 — Authentication

**Peter's answer**:
- Segmented controller to toggle between Login and Create Account without page reload
- Login: username + password, "forgot password" link, optional "remember me" checkbox
- Create Account: email/phone/username + password + confirm password
- Both fieldsets wrapped in a container
- Logo/branding and optional tagline at top
- Mobile: full width. Desktop: centered, possibly split layout with supporting content

**Lina's assessment**: Rich single-step complexity. Multiple component gaps (segmented controller, link, branding). Conditional fieldset representation is a schema stretch point — no conditional/variant mechanism in PatternComponent, so both fieldsets are represented as children with visibility hints.

### Q4 (revised): Step 2 — Preferences, selection mode

**Peter's answer**: Select mode (inline toggle, not navigation).

### Q5 (revised): Step 3 — Terminal?

**Peter's answer**: Yes, terminal. No back action.

### Q6: Back navigation

**Peter's answer**: Yes, back button on step 2 (preferences → authentication). Step 3 is terminal.

### Q7: Page template

**Peter's answer**: All three pages use the same open layout page template. Structurally different from Container-Base, but page templates are out of scope for now.

### Q8: Accessibility

**Peter's answer**: No additional concerns beyond step progress and focus management.

---

## Schema Observations

1. **Multi-step sequencing works.** Three steps with different component compositions. The `steps` array handles this cleanly — each step is self-contained with its own components.
2. **Conditional content via hints.** Login and create-account fieldsets are both present in the tree with `visibility` hints indicating which is shown. The schema doesn't have a conditional mechanism — this is guidance for the consuming agent. Stretch point worth monitoring.
3. **Step navigation is per-step.** Back/forward buttons are components within each step, not a pattern-level concern. Step 2 has back + continue; step 3 has only a forward CTA. This emerged naturally.
4. **Terminal steps.** Step 3 has no back navigation. The schema doesn't need a "terminal" flag — the absence of a back-navigation component communicates this.
5. **Component reuse across steps.** Button-CTA appears in all three steps with different roles (login-submit, create-submit, continue, proceed-to-app). The `role` field differentiates them.

---

## Component Gaps Identified

1. **Segmented controller** — toggle between login/create account modes
2. **Link/text-button** — "Forgot password?" navigation
3. **Logo/branding element** — app identity at top of auth screen
4. **Text/paragraph display** — "What's next" heading and instructional content
5. **Chips-input / horizontal button set** — alternative for high-volume preference selection (noted by Peter, not used in pattern)

---

## Schema Stress Points

### Conditional fieldset representation
Both login and create-account fieldsets exist in the component tree simultaneously. The `visibility` hint tells the agent which to show based on segmented controller state. This works within the current schema but is a workaround — a true conditional mechanism would be cleaner. Monitoring for whether Pattern B is an outlier or if this recurs.

### Navigation between steps
Step transitions are implicit — the pattern defines what each step contains, not how to move between them. The consuming agent handles routing/navigation. This is consistent with the pattern philosophy (structure and guidance, not implementation).

---

## Pattern B Output

Authored at `experience-patterns/account-onboarding.yaml`.

Structure: 3 steps (authentication, preferences, whats-next), each with Container-Base page wrapper. Step 1 exercises conditional fieldsets. Step 2 exercises VerticalList-Set in select mode. Step 3 exercises content-heavy minimal-interaction layout.

Schema features exercised:
- Multiple steps with different component sets
- Deep nesting (page → fieldset → inputs)
- Conditional content via hints
- Component reuse with different roles
- Terminal step (no back navigation)
- `select` mode on VerticalList-Set (multi and single selection)

---

## Consultation Questions for Ada (Token Implications)

1. **Conditional fieldset spacing**: Two fieldsets occupy the same visual space (only one visible at a time). No spacing token implications — but should the pattern hint at transition behavior between them? Or is that purely product-specific?
2. **Branding area spacing**: The logo/tagline area at the top of the auth screen — should the pattern hint at vertical spacing between branding and the form content?

## Consultation Questions for Thurgood (Contract Coverage / Validation)

1. **Conditional fieldsets and validate_assembly**: When validating an assembly derived from this pattern, should the validator expect both fieldsets in the tree (matching the pattern) or only the active one? If both, the validator needs to understand that conditional children are valid even though only one renders.
2. **Step-level validation**: Should `validate_assembly` validate each step independently, or the entire multi-step flow as one tree? The pattern models steps as separate component trees — suggesting per-step validation.
3. **New accessibility check candidates**: "Step progress announcement" (WCAG 1.3.1) and "focus management on step transition" (WCAG 2.4.3) — are these structurally checkable, or advisory only? I lean advisory since they depend on runtime behavior.

## Thurgood's Consultation Responses (2026-03-02)

### Q1: Conditional fieldsets and validate_assembly

The validator should expect both fieldsets in the tree. The pattern represents the full component structure — both login and create-account fieldsets exist as children of the page container. Only one renders at a time, but the tree is the complete assembly.

The validator doesn't need a "conditional" concept. Both fieldsets are valid children of Container-Base. Each fieldset independently passes composition checks. The `visibility` hint is guidance for the agent's rendering logic, not a structural constraint the validator enforces. If an agent submits only the active fieldset to `validate_assembly`, that's also valid — it's a subset of the pattern, and each fieldset is independently well-formed.

No changes needed to the `AssemblyValidator` design.

### Q2: Step-level validation

Per-step validation. Each step in the pattern is a self-contained component tree rooted at a page container. The `validate_assembly` tool accepts a single `AssemblyNode` tree — an agent would validate one step at a time, not the entire multi-step flow as a single tree.

This is consistent with how the pattern models steps — separate entries in the `steps` array, each with its own `components` list. There's no cross-step composition to validate (step transitions are routing, not component nesting).

If we ever need cross-step validation (e.g., "step 2 must contain a back button if step 1 exists"), that would be a pattern-level check, not an assembly-level check. Not needed for Tier 1.

### Q3: New accessibility check candidates

Lina's instinct is correct — both are advisory.

1. **"Step progress announcement"** (WCAG 1.3.1) — runtime behavior. The checker can't verify that "Step 2 of 3" is announced. It could check that a Progress-Stepper-Base or Progress-Pagination-Base component exists in the tree, but this pattern doesn't use one (the progress announcement is left to the agent's implementation). Advisory only.

2. **"Focus management on step transition"** (WCAG 2.4.3) — runtime behavior. Focus movement happens during navigation, not in the static tree. Advisory only.

No new structural check candidates from Pattern B.

Running total remains 3 structural checks across all interviews:
- Form container has accessible name (Pattern A)
- Form has submit action (Pattern A)
- Page has heading or accessible name (Pattern C)

### Component reference verification

Verified all component names in `account-onboarding.yaml` against the catalog. 9 unique components referenced, all 9 exist:
- Button-CTA ✅
- Button-Icon ✅
- Button-VerticalList-Item ✅
- Button-VerticalList-Set ✅
- Container-Base ✅
- Input-Checkbox-Base ✅
- Input-Text-Base ✅
- Input-Text-Email ✅
- Input-Text-Password ✅

Also verified all 3 pattern files — every component reference across all patterns resolves to a catalog entry.

### Pattern cross-references

`account-onboarding.yaml` references `simple-form` and `settings-screen` in alternatives — both exist. All 3 patterns now cross-reference each other correctly. The forward-reference issue from Pattern A (`simple-form` → `multi-step-flow`) needs updating — the pattern was named `account-onboarding`, not `multi-step-flow`.

**Finding**: `simple-form.yaml` line 30 references `pattern: multi-step-flow` in alternatives. The actual pattern name is `account-onboarding`. This needs to be corrected — either update the reference in `simple-form.yaml` or rename the pattern. Flagging for Lina.

### Schema stress test assessment

Pattern B exercised the most complex structural scenarios:
- 3 steps with different component compositions ✅
- Deep nesting (page → fieldset → inputs, 4 levels) ✅
- Conditional content via hints (dual fieldsets) ✅
- Component reuse with different roles (Button-CTA × 4, Input-Text-Password × 2) ✅
- Terminal step (no back navigation) ✅
- `select` mode on VerticalList-Set (both single and multi) ✅

The schema held up across all three patterns. No new fields needed beyond the Pattern A additions (`children`, `optional`).

### Conditional fieldset observation

The dual-fieldset approach (both present, visibility toggled) is a workaround for the lack of a conditional mechanism in the schema. Lina correctly identified this as a stretch point. For Tier 1, it works — the pattern communicates intent, the agent handles the logic. If conditional content recurs in future patterns, a schema-level mechanism (e.g., `condition` field on PatternComponent) may be warranted. Worth tracking but not blocking.

### No blocking concerns

All three interviews complete. Schema validated against 3 structurally diverse patterns. 3 structural accessibility checks identified. Ready for Task 3.2 (AccessibilityChecker) rewrite and implementation.

---

## Ada's Consultation Responses (2026-03-02)

### Q1: Conditional fieldset transition behavior

Don't hint at transitions. The toggle between login and create-account fieldsets is a runtime interaction — how it transitions (fade, slide, instant swap) is product-specific and platform-specific. The pattern correctly captures the structure (both fieldsets exist, visibility hints indicate which is active) without prescribing the transition.

If we were to hint at transitions, we'd reference motion tokens (`motion.focusTransition` or similar). But the segmented controller is itself a component gap — hinting at motion tokens for a component that doesn't exist is premature.

### Q2: Branding area spacing

Don't hint at specific spacing. The branding area is a component gap (logo/branding element not in catalog). Spacing between a gap component and the form content depends on the branding component's own sizing and visual weight, which we can't know until it exists. When the branding component is built, the pattern should be updated with appropriate spacing guidance.

### Token issue: `space.stack.300` in settings-screen.yaml

While reviewing all three patterns together, caught an incorrect token reference in settings-screen.yaml. The `sectionSpacing` hint references `space.stack.300` and `space.stack.200` — these tokens don't exist. The semantic spacing system uses `space.layout.separated.normal` (→ `space300` / 24px) and `space.layout.separated.tight` (→ `space200` / 16px).

Corrected hint:
```yaml
sectionSpacing: "Use space.layout.separated.normal (24px) between sections. Sections are independent content groups. For dense mobile layouts, space.layout.separated.tight (16px)."
```

### Token issue: `simple-form.yaml` alternative reference

`simple-form.yaml` references `multi-step-flow` in alternatives. The actual pattern is named `account-onboarding`. Should be updated or removed.

### Cross-pattern observations

- **D9 compliance**: Clean across all three patterns except the `space.stack` error noted above.
- **Hint format consistency**: Padding hints and `componentGap` convention consistent across all three files.
- **`optional` field**: First use across all patterns — remember-me checkbox in account-onboarding. Semantically correct.
- **Conditional content via `visibility` hints**: Works as a workaround. If conditional content recurs in future patterns, a schema-level mechanism would be cleaner. Worth tracking.
- **Schema held up**: Three structurally different patterns required no schema changes beyond Pattern A additions.

### No open questions from Ada.

---

## Lina's Response to Consultation Feedback (2026-03-02)

### On Ada's responses

- **Transition behavior**: Agreed — don't hint. Runtime/product-specific.
- **Branding spacing**: Agreed — can't hint at spacing for a component that doesn't exist yet.
- **Token fix applied**: Updated `settings-screen.yaml` — `space.stack.300`/`space.stack.200` → `space.layout.separated.normal`/`space.layout.separated.tight`. Good catch.
- **Cross-reference fix applied**: Updated `simple-form.yaml` — `multi-step-flow` → `account-onboarding`.

### On Thurgood's responses

- **Per-step validation**: Confirmed. `validate_assembly` validates individual steps, not the whole flow. Will implement accordingly in Task 3.1.
- **Advisory checks**: Step progress and focus management are advisory only. Running total stays at 3 structural checks.
- **Component reference verification**: All 9 components in Pattern B resolve. All 3 patterns verified — 100% catalog resolution.
- **Conditional fieldset**: Agreed — workaround is fine for Tier 1. Track for future schema evolution.
- **Stale cross-reference**: Fixed `simple-form.yaml` alternatives.

### All three patterns complete

- `simple-form.yaml` — single-step form (Pattern A)
- `settings-screen.yaml` — non-form layout (Pattern C)
- `account-onboarding.yaml` — multi-step flow (Pattern B)

Schema stable. No changes needed beyond Pattern A additions. 3 structural accessibility checks identified. Ready for Task 2 and Task 3.
