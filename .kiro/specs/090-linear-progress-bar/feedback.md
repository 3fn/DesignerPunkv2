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

### [THURGOOD R3]

Incorporated Lina's requirements feedback:

- **F1**: `INDETERMINATE_STATIC_FILL` rationale comment noted for implementation — "Visually distinct from empty and complete states while communicating ongoing activity." No requirements change needed; this is a code comment concern.

Requirements approved. Ready to proceed to design.

---

## Design Feedback

### Context for Reviewers
Design doc translates outline + requirements into architecture, interfaces, and testing strategy. Discriminated union props, pulsing animation, fail-loudly validation, milestone announcements.

### Lina — Component Review

**Overall**: Clean, all decisions traceable, correctness properties are tight. One minor question.

**F1: `tokens.ts` — reference file vs skip.**
The component consumes only existing primitives and semantics (no component-specific tokens like `buttonIcon.inset.*`). The `tokens.ts` file would be a reference re-export, not a definition file. Some components skip this when they only consume existing tokens directly. Not a blocker — the schema's token list serves the same purpose. Create it if we want consistency across all components, skip it if we want to avoid empty-ish files.

Design approved.

### [THURGOOD R4]

Design approved. Lina's F1 (tokens.ts): create it for consistency — every component has one, indexer expects it, serves as dependency documentation even if it's just re-exports.

Ready to proceed to tasks.

---

## Tasks Feedback

### Context for Reviewers
Two-parent structure: component (scaffold → contracts → 3 platforms → tests) then documentation. All Lina tasks except MCP verification (Thurgood).

### Lina — Component Review

**Approved.** No issues. Task ordering correct, dependencies explicit, Kenya/Data review noted, shared test utils referenced, new contract concepts flagged. Ready to implement.

---

## Platform Implementation Review (Task 1.5)

### Data — Android Implementation Review

**File reviewed**: `src/components/core/Progress-Bar-Base/platforms/android/ProgressBarBase.android.kt`
**Date**: 2026-04-03

**Overall**: Noticeably cleaner than Nav-Header work. Reduced motion handled, sealed class pattern correct, token references mostly right. One blocker.

#### Blocking

**F1: Milestone announcements not implemented — contract violation.**
Contract `accessibility_milestone_announcements` requires announcements at 0/25/50/75/100%. `MILESTONES` list is defined but never used — dead code. `progressBarRangeInfo` updates on every recomposition, not at thresholds. Needs either `liveRegion = LiveRegionMode.Polite` with a text node updating only at milestones, or `View.announceForAccessibility()` triggered at threshold crossings.

#### Non-Blocking

**F2: Validation after semantics consumption.**
`require()` is inside the `when` branch, but the `semantics` block on the parent Box reads `mode.value` before validation runs. Semantics tree briefly has invalid state before the throw. Move `require` to top of composable, before the Box. Low severity — throw still happens same composition frame.

**F3: Pulse opacity magic numbers.**
`initialValue = 0.3f` and `targetValue = 1f` are unnamed. Should be named constants (e.g., `PULSE_OPACITY_MIN = 0.3f`, `PULSE_OPACITY_MAX = 1f`) for readability, matching the `INDETERMINATE_STATIC_FILL` pattern.

**F4: Easing not token-referenced.**
`tween()` defaults to `FastOutSlowInEasing`, which happens to match `DesignTokens.Easing.EasingStandard` (`CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)`). Correct by coincidence, not by reference. Should be `tween(duration, easing = DesignTokens.Easing.EasingStandard)` so the component tracks token changes.

#### What Works Well

- Sealed class `ProgressBarMode` — clean Kotlin pattern matching the TS discriminated union
- `animateFloatAsState` / `infiniteTransition` — idiomatic Compose animation
- `isReduceMotionEnabled()` via `ANIMATOR_DURATION_SCALE` — proper Android reduced motion
- Reduced motion in both modes: `tween(0)` for instant, static opacity for indeterminate
- `fillMaxWidth(fraction)` for proportional fill — clean, no GeometryReader needed
- `clip(capsule)` on track and fill — radiusFull contract satisfied
- Sizing tokens correctly referenced as `Float` with `.dp` — right pattern (unlike spacing tokens which are already `Dp`)
- Concise and readable overall

#### Summary

| Issue | Severity | Blocking? |
|-------|----------|-----------|
| F1: Milestone announcements missing | Contract violation | Yes |
| F2: Validation ordering | Low | No |
| F3: Pulse opacity magic numbers | Readability | No |
| F4: Easing not token-referenced | Token-first gap | No |

---

### Kenya — iOS Implementation Review (Task 1.4)

**File reviewed**: `src/components/core/Progress-Bar-Base/platforms/ios/ProgressBarBase.ios.swift`
**Date**: 2026-04-03

**Overall: Clean structure, correct visual model, but three issues that won't compile and two contract gaps.**

#### Issue 1 (Won't Compile): `DesignTokens.duration150` doesn't exist at that path

The token reference:
```swift
static let animationDuration: Double = DesignTokens.duration150 / 1000
```

Two problems here:

1. `duration150` is nested inside `DesignTokens.Duration` — the correct path is `DesignTokens.Duration.duration150`. There's no top-level `DesignTokens.duration150`.

2. The value is already in seconds (`TimeInterval = 0.15`). Dividing by 1000 produces `0.00015` seconds — effectively zero animation. The Chip family components (ChipFilter, ChipBase, ChipInput) use the token directly without division and work correctly.

**Fix**: `DesignTokens.Duration.duration150` (no division). Or better, use the semantic motion token `DesignTokens.MotionFocusTransition.duration` which is purpose-built for quick state transitions.

**Note**: This same bug exists in `NavTabBarBase.ios.swift` and `NavHeaderPage.ios.swift`. Worth a codebase-wide fix — flagging for Leonardo to escalate.

#### Issue 2 (Won't Compile): `DesignTokens.size050` / `size100` / `size150` don't exist

The sizing token references:
```swift
case .sm: return DesignTokens.size050
case .md: return DesignTokens.size100
case .lg: return DesignTokens.size150
```

The generated `DesignTokens.ios.swift` has these as `DesignTokens.size050`, `DesignTokens.size100`, `DesignTokens.size150` — and they do exist in the context I have. Let me verify this is actually fine...

Looking again at the generated file: `public static let size050: CGFloat = 4`, `public static let size100: CGFloat = 8`, `public static let size150: CGFloat = 12`. These are top-level on `DesignTokens`. This is correct — retracted.

#### Issue 3 (Won't Compile): `.infinity` is not a valid `CGFloat` for `RoundedRectangle(cornerRadius:)`

```swift
RoundedRectangle(cornerRadius: .infinity)
```

`RoundedRectangle(cornerRadius:)` takes a `CGFloat`. While `CGFloat.infinity` is technically valid Swift, it's not the token-first approach. The spec says `radiusFull` (capsule shape), and the token exists: `DesignTokens.radiusFull` = 9999. Other components in the codebase don't use `.infinity` for capsule shapes.

**Fix**: `RoundedRectangle(cornerRadius: DesignTokens.radiusFull)` — or better, use SwiftUI's `Capsule()` shape which is semantically what we want and avoids the corner radius question entirely.

Using `Capsule()` would be:
```swift
Capsule().fill(ProgressBarTokens.trackColor)
Capsule().fill(fillColor)
```

Cleaner, more idiomatic, and the shape is self-documenting.

#### Issue 4 (Contract Gap): Milestone announcements not implemented

The contract `accessibility_milestone_announcements` requires announcements at 0%, 25%, 50%, 75%, 100%. The `MILESTONES` array and `lastAnnouncedMilestone` state are declared but never used — no code calls any announcement logic.

The web implementation has `_announceMilestone()` with `aria-live` region toggling. The iOS equivalent would use `UIAccessibility.post(notification:argument:)`:

```swift
private func announceMilestone(for value: Double) {
    let percentage = Int(value * 100)
    for milestone in MILESTONES where percentage >= milestone && lastAnnouncedMilestone < milestone {
        lastAnnouncedMilestone = milestone
        UIAccessibility.post(notification: .announcement, argument: "\(milestone)%")
    }
}
```

Called from an `.onChange(of: mode)` or value observer. This is the same gap Data flagged on Android — Lina may have stubbed the milestone tracking across both native platforms.

#### Issue 5 (Contract Gap): Indeterminate pulse uses wrong easing and duration

The pulse animation:
```swift
withAnimation(.easeInOut(duration: ProgressBarTokens.animationDuration).repeatForever(autoreverses: true)) {
    pulseOpacity = 1.0
}
```

Two problems:
- `ProgressBarTokens.animationDuration` is `duration150 / 1000` (Issue 1) — effectively zero
- The contract specifies `duration350` and `easingStandard` for the indeterminate pulse, not `duration150` and `.easeInOut`

Should use `DesignTokens.Duration.duration350` for the pulse cycle and `DesignTokens.Easing.easingStandard` for the curve. The semantic motion token `MotionSettleTransition` (350ms, decelerate) is close but not exact — the pulse wants `easingStandard`, not `easingDecelerate`. So raw duration + easing tokens are appropriate here:

```swift
withAnimation(
    DesignTokens.Easing.easingStandard
        .speed(1.0 / DesignTokens.Duration.duration350)
        .repeatForever(autoreverses: true)
) {
    pulseOpacity = 1.0
}
```

#### Issue 6 (Minor): Indeterminate fill width is static regardless of reduced motion

```swift
case .indeterminate:
    return reduceMotion ? trackWidth * INDETERMINATE_STATIC_FILL : trackWidth * INDETERMINATE_STATIC_FILL
```

Both branches return the same value. This is correct behavior (the fill width is always 0.33 — it's the *opacity* that animates), but the ternary is dead code. Simplify to:

```swift
case .indeterminate:
    return trackWidth * INDETERMINATE_STATIC_FILL
```

#### What's Good

- **Discriminated union via Swift enum** (`ProgressBarMode`) is the right pattern — clean, type-safe, matches the TypeScript discriminated union.
- **GeometryReader for proportional fill** — correct approach for a width-relative fill in SwiftUI.
- **Token-driven sizing** via `ProgressBarTokens.height(for:)` switch — clean, follows the Progress-Node pattern.
- **Color token mapping** is correct: pending → track, completed → determinate fill, current → indeterminate fill. Consistent with the rest of the Progress family.
- **Reduced motion** via `@Environment(\.accessibilityReduceMotion)` — correct SwiftUI API.
- **Value validation** via `precondition` — correct for fail-loudly. Matches the spec's error message format.
- **Accessibility value** with percentage string for determinate and "Loading" for indeterminate — correct per contract.
- **`INDETERMINATE_STATIC_FILL` as a module-level constant** — matches the types.ts pattern.

#### Summary

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | Won't compile | `DesignTokens.duration150` wrong path + `/1000` bug | `DesignTokens.Duration.duration150` (no division) |
| 2 | ~~Won't compile~~ | ~~Sizing tokens~~ | Retracted — tokens exist at top level |
| 3 | Token-first gap | `.infinity` instead of `radiusFull` token (or `Capsule()`) | Use `Capsule()` or `DesignTokens.radiusFull` |
| 4 | Contract violation | Milestone announcements declared but never called | Implement `UIAccessibility.post` announcement logic |
| 5 | Contract gap | Wrong easing (`.easeInOut`) and duration (`duration150`) for pulse | Use `duration350` + `easingStandard` per contract |
| 6 | Dead code | Identical ternary branches in indeterminate fill width | Remove ternary, return single expression |

Issue 1 is a compile blocker. Issue 4 is an accessibility contract violation. Issues 3 and 5 are token/contract gaps. Issue 6 is cosmetic. Solid foundation — the visual model, type safety, and composition are all correct.
