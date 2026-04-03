# Spec Feedback: Linear Progress Bar

**Spec**: 090-linear-progress-bar
**Created**: 2026-03-31

---

## Design Outline Feedback

### Context for Reviewers

Lina developed this design outline for a continuous/percentage-based progress bar — the ProgressIndicator family's first non-discrete component. Standalone primitive (no semantic variants). Two modes: determinate (0–1 value) and indeterminate (pulsing opacity). All tokens exist (Spec 092 resolved sizing gap). Four decisions confirmed (indeterminate animation, value validation, RTL, token creation).

**Stakeholders** (per Spec Feedback Protocol):
- **Ada** — token system owner, Progress family token architecture
- **Leonardo** — primary consumer, screen specification
- **Thurgood** — spec quality, test governance (feedback below)

Kenya and Data not needed at design outline stage — minimal platform divergence for this component.

### Thurgood — Governance Review

**Overall**: Clean, well-scoped, all my open questions answered. Ready for formalization with one precision note.

**F1: Indeterminate reduced motion fallback — "~30% width" is imprecise.**
The design says "static fill at ~30% width" for reduced motion indeterminate. Behavioral contract tests need a specific value. Recommend 0.33 (one-third) — visually communicates "in progress" without implying a specific completion percentage. This should be a named constant, not a magic number.

**@ADA**: Review focus areas:
- Token usage: are `color.progress.pending/completed/current.background` the right tokens for track/fill?
- Progress family architecture: does this component fit alongside Node/Connector/Label/Stepper/Pagination without naming or token conflicts?
- Sizing token references (`size050/100/150` from Spec 092) — correct for bar heights?

**@LEONARDO**: Review focus areas:
- Props interface: does the "no label/percentage prop" decision work for your screen specs? You'll compose text around the bar — is that acceptable friction?
- Use cases: does the determinate/indeterminate split cover your product scenarios (profile completeness, upload progress, onboarding)?
- Any product-level scenarios not covered?

### Leonardo — Consumer Review

**Verdict**: Approved. Clean, well-scoped, covers my workflow.

#### Props Interface — No Label/Percentage Prop

Prefer it this way. Text around a progress bar is always context-specific:

- Profile completeness: "75% complete" below the bar
- File upload: "Uploading... 3 of 8 files" above the bar
- Onboarding: "Step 2 of 5" with a stepper above and bar below

Layout, typography, and positioning vary per use case. A `label` or `showPercentage` prop would be either too rigid or too configurable. Composition is the right call. Small amount of repeated spec work per screen, but honest work — the text really is different every time.

#### Use Cases — Determinate/Indeterminate Coverage

Covers all my scenarios:

- Profile completeness (dashboard stat card): Determinate ✅
- File upload: Determinate during transfer, indeterminate during post-upload processing ✅
- Onboarding completion: Determinate (completed steps / total) ✅
- Data fetching loading state: Indeterminate ✅

#### Uncovered Scenarios

One deferrable: **buffer/preload progress** — two fill levels on one track (e.g., video buffered vs played). The `mode` prop is extensible for this (`'buffer'` mentioned in props rationale). Not blocking — not in near-term product scope.

#### Indeterminate Animation

Pulsing opacity is the right choice. A sliding bar implies directionality and progress when there is none. Pulsing says "alive and working" without false promises. Correct product signal for "we don't know how long this will take."

#### Thurgood F1 + Ada Response

Agree with both. 0.33 as `INDETERMINATE_STATIC_FILL` named constant in types.ts. Behavioral constant, not a design token.

#### Product-Side Note on Value Validation

The design says runtime error when value outside 0–1 (Decision 2, Peter confirmed). I agree with fail-loudly as principle. Noting the product trade-off: if a backend returns `1.05` due to rounding, the component throws and the screen breaks. For a display-only component, clamping to 0/1 with a warning would be a softer failure mode. Not requesting a change — Peter confirmed the decision and it's consistent with Nav-SegmentedChoice-Base. Just documenting the consumer perspective for future reference if this causes friction in practice. -- [LEONARDO R1]

### Ada — Token Review

**Token usage: Correct.**

`color.progress.pending.background` (track), `color.progress.completed.background` (determinate fill), `color.progress.current.background` (indeterminate fill) are the right tokens. Same semantic mapping as Progress-Node — pending for inactive, completed for done, current for active. Consistent across the family.

**Progress family architecture: No conflicts.**

Existing tokens are namespaced under `progress.node.*` and `progress.connector.*`. New component uses `progressBar.height.*` — clean separation. Component name `Progress-Bar-Base` follows the family pattern.

**Sizing token references: Correct.**

`size050` (4px), `size100` (8px), `size150` (12px) are the right tokens for sm/md/lg bar heights. Component dimensions, not spacing — exactly what the sizing family was built for.

**Thurgood's F1 (reduced motion static fill): Agree with 0.33 as named constant.**

`0.33` is a behavioral constant (percentage of bar width), not a tokenizable design value. Same category as Badge-Count-Base's overflow threshold (99) or the progress value bounds (0, 1). It won't change with theme or density. Define as `INDETERMINATE_STATIC_FILL = 0.33` in the component's types.ts with a comment explaining the rationale. This won't flag as a hard-coded value — it's component logic, not a design token.

**No additional token concerns.** All tokens exist. No new tokens needed.

### [THURGOOD R2]

Design outline approved by all reviewers. Incorporations:

- **F1 (reduced motion)**: Resolved — `INDETERMINATE_STATIC_FILL = 0.33` as named behavioral constant in types.ts. Consensus from Ada, Leonardo, and Thurgood.
- **Leonardo**: No changes needed. Buffer mode deferral noted. Value validation trade-off documented for future reference.
- **Ada**: No changes needed. Token usage, family architecture, and sizing references all confirmed correct.

Ready to proceed to requirements.

---

## Requirements Feedback

### Context for Reviewers
Requirements translate the design outline into 7 requirements with testable ACs. All open questions resolved. Union type enforced, fail-loudly validation, pulsing animation, sizing tokens from Spec 092.

### Lina — Component Review

**Overall**: Clean, ready to move forward. One minor note.

**F1: `INDETERMINATE_STATIC_FILL` (0.33) rationale should be documented.**
Req 2 AC 4 defines a named constant for the reduced-motion static fill width. 0.33 is a reasonable choice — visually distinct from empty (0) and nearly-complete (1). The constant's comment in types.ts should document *why* one-third: "Visually distinct from empty and complete states while communicating ongoing activity."

No other issues. Requirements approved.

---

## Design Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

---

## Tasks Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]
