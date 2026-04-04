# Spec Feedback: Native Implementation Modernization

**Spec**: 093-native-implementation-modernization
**Created**: 2026-04-03

---

## Design Outline Feedback

### Context for Reviewers

Lina developed this outline to address systemic patterns from Spec 091's native readiness sweep. 5 code fixes, 2 design decisions, 3 deferred. ~2 days estimated effort. Ada input requested on iOS easing consumption API.

### Ada — Token Review

**Issue 1 (P1 Easing) — iOS consumption API confirmed.**

The generated Swift output provides two levels:

- **Semantic motion tokens** (preferred): `DesignTokens.MotionFocusTransition.easing` returns an `Animation` (`Animation.timingCurve(0.4, 0.0, 0.2, 1)`). Duration is a separate `TimeInterval`.
- **Raw easing tokens**: `DesignTokens.Easing.easingStandard` — also an `Animation`.

Recommended consumption pattern:

```swift
// When a semantic motion token matches the use case (preferred):
withAnimation(DesignTokens.MotionFocusTransition.easing) { ... }

// When combining easing + duration from separate tokens:
withAnimation(DesignTokens.Easing.easingStandard.speed(1.0 / DesignTokens.Duration.duration150)) { ... }
```

The `.speed()` modifier adjusts the animation's duration relative to its default (1 second for `timingCurve`). It's verbose but correct — SwiftUI's `withAnimation` takes an `Animation`, not separate easing + duration parameters.

**Trade-off to acknowledge**: The current hard-coded `.easeInOut(duration:)` is simpler code for a subtle visual difference (symmetric vs asymmetric easing). The spec should be explicit that we're choosing token correctness over code simplicity. Right call for a design system, but worth documenting.

**Issue 2 (Button-CTA Android) — `minWidth` values need investigation.**

The outline says `minWidth` and `touchTargetHeight` should derive from sizing/accessibility tokens. Specifics:

- `touchTargetHeight` (48, 56): 48 = `size600` or `tapAreaRecommended`, 56 = `size700`. Covered.
- `minWidth` (56, 72, 80): 56 = `size700` ✅, 80 = `size1000` ✅, but **72 is not on the sizing scale** (not a multiple of 8). This value may need to remain a component constant, or we need to verify whether 72 is the correct design intent.

**Action**: Lina to verify which Button-CTA hard-coded values map to existing tokens before requirements assume full tokenization. Some may legitimately remain as component constants.

**Issues 5, 6, 7 — No token concerns.** Agree with all three resolutions. No new tokens needed for this spec.

**No new tokens needed.** All fixes use existing tokens or existing patterns.

### Data — Android Review

**Date**: 2026-04-03

**Overall**: Well-scoped, correctly prioritized. Right issues identified, good fix-vs-defer boundaries. A few observations.

**F1: Issue 2 (Button-CTA config types) is the most impactful fix.**
The `Int` → `Dp`/`TextUnit` change eliminates the `.toInt()` → `.dp` round-trip I flagged in feedback-button-android.md (C1). Prevents future bugs — anyone reading the config sees `Dp` types, not raw numbers. Ada's catch on `minWidth = 72` not being on the sizing scale is important and needs resolution before implementation.

**F2: Issue 6 (ripple vs blend) — agree with documenting as deliberate distinction.**
I flagged this as C5 in feedback-button-android.md, but Lina's framing is better: ripple for circular icon buttons (spatial feedback), blend for shaped surfaces (uniform darkening). Defensible design choice. Documenting in the Button family doc prevents future reviewers from re-flagging.

**F3: Issue 7 (LocalDesignTokens removal) — strongly agree.**
Flagged as C9 in feedback-button-android.md. Outlier pattern, adds complexity, no benefit. Every other component uses `DesignTokens.*` directly.

**F4: Two blocking component bugs appear untracked.**
- **Button-VerticalList-Set**: `error("Invalid selection")` inside `semantics {}` throws `IllegalStateException` when `error = true` — app crash. Flagged as C10 (blocking) in feedback-button-android.md.
- **Input-Text-Base**: `(String) -> Void` should be `(String) -> Unit` — Java/Kotlin type mismatch. Flagged as C1 (blocking) in feedback-forminput-android.md.

Neither appears in this spec's fix list or deferred list. The spec's scope ("systemic patterns, not individual bugs") is a reasonable framing — these are component-specific, not cross-cutting. But they need to be tracked somewhere. **Are they being fixed in Spec 091 Phase 2 (Task 3.2 / 3.4)?** If so, no action needed here. If not, they need to be added to either this spec or a tracking issue.

**F5: Traceability suggestion.**
The spec references "Spec 091 cross-cutting issues tracker" as origin. The actual evidence lives in the per-family feedback docs (`feedback-button-android.md`, `feedback-container-android.md`, etc.). Referencing specific feedback docs per issue would help Lina verify she's addressed everything.

**F6: Effort estimate is reasonable.** 2 days for focused cleanup. iOS easing (9 files) is the bulk. No new architecture, no new tokens.

### Kenya — iOS Review

**Date**: 2026-04-03

**Overall: Well-scoped, right priorities. One concern about the easing fix approach, one agreement, one gap.**

#### F1: Issue 1 (P1 Easing) — the `.speed()` pattern is correct but ugly. Worth it anyway.

Ada confirmed the consumption API. The recommended pattern:
```swift
withAnimation(DesignTokens.Easing.easingStandard.speed(1.0 / DesignTokens.Duration.duration150)) { ... }
```

This is verbose compared to:
```swift
withAnimation(.easeInOut(duration: 0.15)) { ... }
```

Ada's right to flag the trade-off: token correctness over code simplicity. For a design system, that's the right call — but I want to push back slightly on the "raw easing + duration" pattern being the default recommendation.

**Most of the 9 files should use semantic motion tokens, not raw easing + duration.** Looking at the actual usage:

- Checkbox-Base/Radio-Base: press animation → `MotionButtonPress`, selection animation → `MotionSelectionTransition`
- Chip-Base/Filter/Input: press animation → `MotionButtonPress`
- VerticalList-Item: selection animation → `MotionSelectionTransition`
- Pagination-Base: selection → `MotionSelectionTransition`, settle → `MotionSettleTransition`
- Nav-TabBar-Base: tab switch → could be `MotionSelectionTransition`
- Container-Card-Base: focus → `MotionFocusTransition` (already fixed in 091)

These all have semantic motion tokens that match. The clean pattern is:
```swift
withAnimation(DesignTokens.MotionSelectionTransition.easing) { ... }
```

The `.speed()` pattern should be the fallback for cases where no semantic motion token matches — which may be zero files in this batch.

**Recommendation**: The spec should specify semantic motion token mapping per file, not just "replace `.easeInOut` with token easing." This prevents Lina from defaulting to the verbose `.speed()` pattern when a cleaner semantic token exists.

#### F2: Issue 6 (Ripple vs Blend) — agree with documenting as deliberate distinction.

From my iOS perspective, this isn't even a question — iOS doesn't have ripple. SwiftUI uses scale transforms (Button-Icon) and color blends (Button-CTA, cards) for press feedback. The ripple vs blend distinction is Android-specific.

Documenting it in the Button family doc is the right call. It prevents future reviewers (including me) from flagging it as an inconsistency when it's a platform-appropriate choice.

#### F3: Data's F4 — blocking component bugs need tracking.

Data flagged two blocking bugs that aren't in this spec:
- Button-VerticalList-Set: `error("Invalid selection")` crash inside `semantics {}`
- Input-Text-Base: type mismatch

These are component-specific, not systemic — so they don't fit this spec's "systemic patterns" scope. But they need to be tracked. If they're being fixed in Spec 091 Task 3.2/3.4, that's fine. If not, they need `.kiro/issues/` entries at minimum. **Peter should confirm tracking.**

#### F4: Deferred items 8-10 are correctly deferred.

Container-Card-Base duplicated padding (8), `indication = null` (9), and Container-Base file size (10) are all architectural concerns, not modernization. Mixing them in would expand a 2-day cleanup into a multi-week refactor. Right call to defer.

**Counter-argument to myself**: Item 8 (duplicated padding) could cause bugs if someone modifies the padding logic in one place but not the other. But the duplication is in the preview/test path, not the production rendering path — Card delegates to Base for actual layout. The risk is low.

#### F5: Effort estimate is reasonable.

2 days for 9 iOS files + 5 Android files + 1 doc update. The iOS easing changes are the bulk, and they're mechanical once the semantic motion token mapping is established. No new architecture, no new tokens.

---

## Requirements Feedback

### Ada — Token Review

**Approved.** No corrections needed.

**Req 1 (iOS easing):** AC 2 and AC 3 (no `.speed()` fallback — create semantic motion tokens if needed) is a stronger position than my design outline suggestion. Agree with it. Cleaner long-term than verbose workarounds. AC 4 (not zero-visual-change) is important and honest — easing curves will intentionally change. Kenya's F1 is right that most files should map to existing semantic motion tokens, not raw easing.

**Req 2 (Button-CTA Android):** AC 5 adds `size900` (72px) to `SizingTokens.ts` — my domain. Correction to my earlier feedback: 72 IS a multiple of 8 (8 × 9). Baseline grid aligned, documented design value. Single consumer, but consistent with Spec 092's approach (size700/size800 added preemptively with zero consumers). Token creation approved by Peter.

**Reqs 3–6:** No token concerns. All use existing tokens or are documentation changes.

### Lina — Component Review

**Approved.** One note on agent assignment.

**F1: Req 2 AC 5 (`size900` creation) is Ada's domain.**
The task plan should make this dependency explicit: Ada creates `size900` before I tokenize `minWidth = 72` in Button-CTA. Same pattern as Spec 092 → 090 dependency.

No other issues. Requirements are ready for design/tasks.

**Note:** Req 1 AC 1 lists 8 files (correct). Design outline said "9+" — the 9th (Nav-Header-Page) was already fixed in Spec 091. No discrepancy, just different counting.

Ready for design.

---

## Design Feedback

### Ada — Token Review

**Approved.** No corrections.

- `size900` creation correctly scoped as my task
- Semantic motion token mappings verified against generated output (`MotionButtonPress`, `MotionSelectionTransition` both exist)
- Correctness properties 1 and 2 are strong grep-verifiable gates — scoped to component platform files, won't false-positive on `src/tokens/platforms/ios/MotionTokens.swift` (which already uses `Animation.timingCurve`)

### Lina — Component Review

**Approved.** One minor scope note.

**F1: Correctness Property #1 should scope to production code, not preview blocks.**
Preview code (`PreviewProvider` blocks) may legitimately use SwiftUI built-in easing for demo purposes. The grep should exclude preview sections to avoid false positives. Minor — the property is correct in intent, just needs scoping in the verification step.

Ready for tasks.

---

## Tasks Feedback

### Lina — Component Review

**Approved.** No issues. Task breakdown matches requirements 1:1, subtasks right-sized, iOS easing batched by family for review efficiency, dependencies correct. Ready to implement.
