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

---

## Requirements Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

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
