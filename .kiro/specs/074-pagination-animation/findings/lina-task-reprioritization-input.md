# Lina: Task Reprioritization Input for Spec 074

**Date**: 2026-03-07
**For**: Thurgood (task planning), Peter (decision-making)
**Context**: Spec 074 Task 3 underwent an architectural pivot mid-implementation. The original task list (3.1–3.5) no longer reflects reality. This doc captures my assessment of what's done, what's broken, what's blocking, and what order I'd recommend.

---

## Current State

### Completed and Working
- **3.1 Scale-based sizing** ✅ — `sizing="scale"` on Node-Base, working across all size variants
- **3.2 Web slide animation** ✅ — but replaced: now uses render-all-dots + translateX centering instead of the original per-node buffer approach
- **Web demo verified by Peter** ✅ — dots render correctly, centering works, clip-path hides edge slivers

### Not Started
- **3.3 iOS** — still uses windowed `ForEach`, needs full rewrite to native scroll
- **3.4 Android** — still uses windowed `Row`, needs full rewrite to native scroll
- **3.5 Rebuild + final verification** — blocked on 3.3/3.4

### Broken / Out of Date
- **Design outline (Task 3)** — describes the buffer model, per-node translateX, and Option B scoping. No longer accurate for web. Still accurate for iOS/Android until those are updated.
- **Task descriptions in tasks.md** — 3.2 describes buffer-based slide, 3.3/3.4 describe fixes to the old model
- **`performance_virtualization` contract** — describes windowed rendering, web no longer does this
- **Component README** — not yet updated for the new architecture
- **Demo page text** — still says "only 5 dots render" in the Virtualized and Large Page Count sections

### Unresolved from Before the Pivot
- **Split timing** — Peter wants 250ms scale / 350ms color+slide. Experimental CSS properties are wired in Node-Base but no semantic token exists yet. Blocked on Peter's DevTools experimentation → Ada creates token.
- **2 token-completeness test failures** — caused by the experimental `--motion-color-transition-*` properties. Not blocking functionality but blocking a clean test run.

---

## Recommended Priority Order

### Priority 1: Documentation Accuracy (unblocks everything else)
1. **Update design outline for Task 3** — replace buffer model description with render-all-dots + translateX centering. This is the source of truth that iOS/Android implementation will follow.
2. **Update tasks.md** — rewrite 3.2 description (done, new approach), rewrite 3.3/3.4 descriptions (native scroll centering), add any new subtasks.

**Why first**: If Ada or Thurgood review against the old design outline, they'll be working from wrong assumptions. iOS/Android implementation will also follow the design outline.

### Priority 2: Contract and Test Alignment (Thurgood's domain)
3. **Update `performance_virtualization` contract** — web no longer virtualizes. The contract needs to describe the new rendering model or be split per-platform until iOS/Android catch up.
4. **Behavioral audit of web implementation** — verify the new approach against existing behavioral contracts. Flag any contracts that need new assertions.

**Why second**: Contracts are the shared truth layer. If they're wrong, test coverage is meaningless.

### Priority 3: Token Review (Ada's domain)
5. **Ada reviews hardcoded JS ↔ token mapping** — confirm the stride/gap/padding values match their token sources. Flag if any are wrong or if tokens are likely to change.
6. **Ada reviews padding split** — `padding-block` vs `padding-inline` using different token tiers. Is this the right approach or should there be a component token?
7. **Decide on split-timing path** — Peter experiments with timing, Ada creates semantic token, or we back out the experimental properties and defer.

**Why third**: Token correctness matters, but the current values work. This is validation, not blocking.

### Priority 4: Native Platform Implementation (Lina's domain)
8. **iOS implementation** — `ScrollViewReader` + `scrollTo(anchor: .center)`, remove `calculateVisibleWindow`
9. **Android implementation** — `ScrollState` + `animateScrollTo()`, remove `calculateVisibleWindow`

**Why fourth**: Web is working and verified. Native can follow the updated design outline. No point implementing native until the design outline and contracts are accurate.

### Priority 5: Cleanup
10. **Remove `calculateVisibleWindow` from types.ts** — once all platforms are updated (keep unit tests if Thurgood wants them as regression tests for the algorithm, even if unused)
11. **Update component README**
12. **Update demo page text** — remove "only 5 dots render" language
13. **Resolve token-completeness test failures** — either create the split-timing tokens or remove the experimental properties

### Priority 6: Final Verification (Task 3.5)
14. **Rebuild bundle**
15. **Full behavioral audit** (Thurgood)
16. **Peter demo verification** on all three platforms
17. **Commit**

---

## Risks and Concerns

**Hardcoded pixel values**: This is the thing that worries me most long-term. The JS has `stride = 24` and the CSS has `width: var(--progress-node-size-lg-current)` which resolves to `var(--space-300)` which resolves to `24px`. If Ada changes `space-300` from 24px to 28px, the CSS updates automatically but the JS doesn't. The component silently breaks. I don't have a clean solution for this right now — reading computed styles at render time is expensive and fragile. But it should be on our radar.

**Clip-path 2px magic number**: Works today, but it's not derived from anything. If dot sizes or padding change, 2px might not be enough (or might be too much). Low risk given our size variants are stable, but worth noting.

**Split timing deferral risk**: The experimental properties are in Node-Base CSS, which is shared by Pagination and Steppers. The `sizing="scale"` scoping means they only affect pagination dots, but the properties themselves are visible in the cascade. If we defer split timing too long, we should back out the experimental properties to keep the codebase clean.

**Platform divergence during transition**: Web uses render-all-dots, iOS/Android still use windowing. This is fine temporarily but makes cross-platform behavioral testing harder. Thurgood should be aware that platform parity assertions may need to be relaxed until Priority 4 is complete.
