# Spec Feedback: Token Compliance & Motion Build Fix

**Spec**: 079-token-compliance-and-motion-build-fix
**Created**: 2026-03-14

---

## Design Outline Feedback

### Context for Reviewers
- Three related issues bundled: duplicate browser CSS output, incomplete category migration, component compliance violations → design-outline.md § "Problem Statement"
- Issue 1 root cause traced to `generateWebTokens()` dual-pass assembly → design-outline.md § "Problem Statement" Issue 1
- Option A (filter motion tokens from primitive pass) approved for Issue 1 → design-outline.md § "Options" Issue 1
- Issue 2 extends the EASING category pattern from Spec 049 Task 1.2 → design-outline.md § "Options" Issue 2
- Issue 3 has 21 violations across Avatar-Base and Button-VerticalList → design-outline.md § "Problem Statement" Issue 3
- All 4 open questions resolved → design-outline.md § "Open Questions"
- Cross-domain: Issues 1-2 are Ada's, Issue 3 is Lina's, component token creation needs Peter → design-outline.md § "Cross-Domain Notes"

---

## Requirements Feedback

### Context for Reviewers
- Requirements formalized from design outline with EARS patterns → requirements.md
- 5 requirement groups: duplicate elimination (1.x), category migration (2.x), Avatar compliance (3.x), VerticalList compliance (4.x), validation (5.x)

---

## Design Feedback

### Context for Reviewers
- Primitive pass filter approach (Option A) detailed with code sketch → design.md § "Issue 1: Primitive Pass Filter"
- Avatar component token structure with 0.5× ratio documented → design.md § "Issue 3: Component Token Structure"
- Design outline notes existing icon size comments in Avatar Android are incorrect (e.g., claims `icon.size500` = 40dp but actual value is 33dp) → design-outline.md § "Open Questions" Q2

---

## Tasks Feedback

### Context for Reviewers
- 4 parent tasks, 8 subtasks → tasks.md
- Tasks 1, 2, 3 are independent (can parallelize); Task 4 depends on all three
- Task 1 has internal dependency chain: 1.1 (enum) → 1.2 (migration) → 1.3 (filter)
- Task 2 has internal dependency: 2.1 (create tokens) → 2.2 (fix references)

---

## Review Requests

### Ada — Token & Pipeline Review

**Task 1 (Category Migration):** Confirm DURATION/SCALE migration follows the same pattern you established for EASING in Spec 049 Task 1.2. Any concerns about the `allTokens` map update or downstream consumers?

**Task 2.1 (Avatar Component Tokens):** Review the proposed avatar token structure:
```
avatar.dimension.xs = 24    avatar.icon.xs = 12
avatar.dimension.s  = 32    avatar.icon.s  = 16
avatar.dimension.m  = 40    avatar.icon.m  = 20
avatar.dimension.l  = 48    avatar.icon.l  = 24
avatar.dimension.xl = 80    avatar.icon.xl = 40
avatar.dimension.xxl = 128  avatar.icon.xxl = 64
```
Specific questions:
- Do 12dp and 64dp fit the icon size scale's mathematical progression, or are they intentional outliers that belong as component tokens only?
- The existing Avatar Android code has incorrect comments — `iconDimension = 40.dp` is labeled "references icon.size500" but `icon.size500` resolves to 33dp. Please verify actual icon token values so Lina references the correct ones in Task 2.2.
- Does the 0.5× icon-to-dimension ratio warrant a mathematical relationship annotation in the component token definition?

### Lina — Platform Implementation Review

**Tasks 2.2, 3.1, 3.2 (Platform Fixes):** You're implementing these. Please confirm:
- Does removing `.dp` from `DesignTokens.radius_100.dp` work in Jetpack Compose? The token consumption rule says tokens are pre-unitized, but verify the generated Kotlin type is already `Dp` (not a raw number that needs the extension).
- Any complications with the Preview composable fixes in Button-VerticalList-Item? Preview code sometimes uses hard-coded values intentionally for isolation from the token system.
- For the Button-VerticalList-Set bottom padding (8dp on both platforms) — which spacing token is the correct replacement? `space050` (4dp) is too small, `space100` (8dp) if it exists, or does this need Ada's input on the right token?

---

## Lina's Review Responses

**Date**: 2026-03-14
**Reviewer**: Lina

### Task 3.1 — `.dp` on `DesignTokens.radius_100.dp` is NOT double-unitizing

**Finding**: The generated `dist/android/DesignTokens.android.kt` has an inconsistency in how token families are typed:

| Token Family | Generated Type | Example | `.dp` needed? |
|---|---|---|---|
| Icon sizes | `Dp` (pre-unitized) | `val icon_size_100 = 24.dp` | No — already `Dp` |
| Elevations | `Dp` (pre-unitized) | `val elevation_container = 8.dp` | No — already `Dp` |
| Spacing | `Float` (unitless) | `const val space_150: Float = 12f` | **Yes** |
| Radius | `Float` (unitless) | `const val radius_100: Float = 8f` | **Yes** |
| Tap area | `Float` (unitless) | `const val tap_area_recommended: Float = 48f` | **Yes** |

The component code `DesignTokens.radius_100.dp` is **correct** — `radius_100` is `8f` (Float), and `.dp` is the Kotlin extension converting Float → Dp. Removing `.dp` would cause a type error.

**This means the TokenCompliance test is producing a false positive** for `DesignTokens.radius_100.dp`. The test's pattern-matching logic likely flags any `DesignTokens.*.dp` as double-unitizing, but that's only true for token families that are already generated as `Dp` (icons, elevations). For spacing/radius/tap area, `.dp` is required.

**Recommendation for Ada**: The root issue is inconsistent platform token generation. Two options:
1. **Update the Android generator** to output `Dp` for ALL dimensional token families (spacing, radius, tap area) — matching what it already does for icons and elevations. This makes consumption uniform (never need `.dp`) and the TokenCompliance test correct.
2. **Update the TokenCompliance test** to be aware of which families are pre-unitized and which aren't. Less clean but lower blast radius.

Option 1 is the right long-term fix. Option 2 is a band-aid. **Task 3.1 cannot be implemented as written until this is resolved** — removing `.dp` from radius/spacing references would break compilation.

### Task 3.1 — Preview composable hard-coded values

The `16.dp` padding and `Arrangement.spacedBy(16.dp)` in `VerticalListButtonItemPreview()` (lines 626-627) are standard Android Preview patterns. Previews are developer tooling, not shipped UI — they're intentionally decoupled from the token system for readability and isolation. **I'd push back on replacing these with token references.**

However, the `RoundedCornerShape(4.dp)` on line 609 is in `PlaceholderIcon` — a helper composable used by the actual component, not just the Preview. That one should use a token reference (`DesignTokens.radius_050` = 4f, so `RoundedCornerShape(DesignTokens.radius_050.dp)` — or just `DesignTokens.radius_050.dp` if the generator gets updated per the recommendation above).

**Recommendation**: Split Task 3.1 into:
- Fix `PlaceholderIcon` hard-coded radius → token reference (real fix)
- Fix `24.dp` icon size → `DesignTokens.icon_size_100` (real fix — icon tokens are already `Dp`)
- Leave Preview composable hard-coded values as-is (intentional pattern)

### Task 3.2 — Bottom padding token

`space_100` = 8dp. It exists. That's the correct replacement for the 8dp bottom padding on both iOS and Android.

- iOS: `.padding(.bottom, 8)` → `.padding(.bottom, DesignTokens.space100)` (verify iOS token naming convention)
- Android: `.padding(bottom = 8.dp)` → `.padding(bottom = DesignTokens.space_100.dp)` (needs `.dp` until generator is updated)

### Task 2.2 — Avatar Android

Ready to implement once Ada completes Task 2.1 (component token definitions) and confirms actual icon token values. The existing code comments are unreliable — design outline already flagged this. I'll wait for Ada's verified token mapping before touching Avatar platform files.

### Cross-cutting observation: Browser token duplicate issue

During the Safari ESM bug investigation that led to this spec, we confirmed the browser `tokens.css` outputs duration tokens twice (unitless primitives at line ~433, platform `ms` values at line ~829). The same dual-output pattern is what this spec's Task 1 addresses. Issue documented separately at `.kiro/issues/2026-03-14-browser-token-duplicate-duration-primitives.md`.

The Nav-SegmentedChoice component was using `calc(var(--duration-150) * 1ms)` which evaluated to `calc(150ms * 1ms)` — invalid CSS that Chrome tolerated but Safari rejected. Fixed by using `var(--duration-150)` directly since the cascaded browser value is already `150ms`. This reinforces why Task 1.3 (eliminating the unitless duplicates) matters — the unitless primitives in browser CSS are actively misleading to component authors.

---

## Ada's Review Responses

**Date**: 2026-03-14
**Reviewer**: Ada

### Responding to Review Requests

**Task 1 (Category Migration):** Confirmed — DURATION and SCALE migration follows the exact same pattern as EASING in Spec 049 Task 1.2. The steps are: (1) add to `TokenCategory` enum, (2) update token definitions, (3) add to `allTokens` map in `index.ts`, (4) update test fixtures. No concerns about downstream consumers — the DTCG generator, Figma transformer, and validators all iterate `getAllPrimitiveTokens()` which is category-agnostic. The `allTokens` map is only used for category-based lookups, and adding new entries doesn't affect existing ones.

**Task 2.1 (Avatar Component Tokens) — CORRECTION:**

I need to correct my earlier analysis. My `ts-node` check returned raw `baseValue` (the pre-rounding calculation input), not the resolved platform output. The actual Android platform values are:

| Icon Token | baseValue (raw) | Android Output (rounded) |
|---|---|---|
| `icon.size050` | 13 | **16dp** |
| `icon.size075` | 14 | **20dp** |
| `icon.size100` | 16 | **24dp** |
| `icon.size500` | 33 | **40dp** |

The icon size pipeline applies `Math.round()` to the `fontSize × lineHeight` calculation, then the Android builder outputs the rounded value as `Dp`. The Avatar code's comments ("references icon.size100" for 24dp, "references icon.size500" for 40dp) were **correct** — I was wrong to flag them as aspirational.

**Revised Avatar icon mapping:**

| Avatar | Icon needed | Existing token | Match? |
|---|---|---|---|
| XS (24dp) | 12dp | — | ❌ Gap (component token needed) |
| S (32dp) | 16dp | `icon.size050` = 16dp | ✅ Direct reference |
| M (40dp) | 20dp | `icon.size075` = 20dp | ✅ Direct reference |
| L (48dp) | 24dp | `icon.size100` = 24dp | ✅ Direct reference |
| XL (80dp) | 40dp | `icon.size500` = 40dp | ✅ Direct reference |
| XXL (128dp) | 64dp | — | ❌ Gap (component token needed) |

This means only 2 component tokens are needed for icon sizes (`avatar.icon.xs` = 12dp, `avatar.icon.xxl` = 64dp), not 6. The other 4 can reference existing icon tokens directly. The 0.5× ratio still holds as a design relationship, but the implementation is simpler.

**Do 12dp and 64dp fit the icon size scale?** No — and they shouldn't. The icon size scale is derived from typography (fontSize × lineHeight). 12dp and 64dp are avatar-specific values driven by the avatar dimension scale, not the type scale. They belong as component tokens. 12dp is below the smallest icon token (16dp), and 64dp is above the largest (48dp). Both are multiples of 4, so they conform to the baseline grid.

**Does the 0.5× ratio warrant a mathematical annotation?** Yes — it's a clean, intentional relationship. The component token definition should document it: "avatar icon size = avatar dimension × 0.5". This makes the relationship discoverable and auditable.

**Avatar dimension tokens:** The 6 avatar dimensions (24, 32, 40, 48, 80, 128) still need component tokens. These don't map to any existing token family semantically. All are multiples of 8 (conforming to baseline grid) except 24 (multiple of 4, still grid-aligned). Component tokens are the right home.

### Responding to Lina's Findings

**Android generator type inconsistency:** Lina is right — this is a real issue. The Android generator outputs `Dp` for icon sizes and elevations but `Float` for spacing, radius, and tap area. This inconsistency means `.dp` is required for some families and forbidden for others.

I agree with Lina's assessment: **Option 1 (update Android generator to output `Dp` for all dimensional families) is the right long-term fix.** It makes consumption uniform and the TokenCompliance test correct.

HOWEVER — this is a larger change than this spec scoped. Updating the Android generator to output `Dp` for spacing/radius/tap area would affect every Android component file that consumes these tokens. Every `DesignTokens.space_100.dp` becomes `DesignTokens.space_100` (removing `.dp`). That's a codebase-wide migration.

My recommendation: **add this as a new issue or a future spec, not scope-creep into 079.** For this spec, update the TokenCompliance test to be aware of which families are pre-unitized (Lina's Option 2). It's a band-aid, but it unblocks the compliance fixes without a codebase-wide migration. The generator fix can be a follow-up spec that addresses the root cause systematically.

The `.dp` false positive on `DesignTokens.radius_100.dp` should be removed from the violation count. Task 3.1 needs to be revised — it cannot remove `.dp` from radius/spacing references without breaking compilation.

**Preview composable values:** Lina's pushback is reasonable. I'd accept her recommendation: fix `PlaceholderIcon` (production code) and the icon size reference, leave Preview hard-coded values as-is. This aligns with the Q1 resolution ("fix them") but with a pragmatic carve-out for Preview-only code that Lina correctly identified as intentionally decoupled.

**Revised violation count:** The original 21 violations should be re-audited given:
- The `.dp` false positive (at least 1 violation removed)
- Preview composable carve-out (several violations reclassified)
- Correct icon token mapping (4 of 6 icon violations are direct token references, not gaps)

[@THURGOOD] Can you re-audit the violation list with these corrections? The TokenCompliance test's `.dp` pattern needs updating before we can trust the count. → design-outline.md § "Problem Statement" Issue 3

### Issue 4: Android Generator Type Consistency — Scope Addition

**Date**: 2026-03-14

Peter has directed that the Android generator type inconsistency should be fixed in this spec, not deferred. Rationale: DesignerPunk is approaching product integration, and accumulating band-aids increases the cost of cleanup later. Fixing the generator now means compliance fixes are done against the correct output — each file touched once, not twice.

**What changes:**

The Android generator (`AndroidBuilder`) currently outputs `Float` for spacing, radius, and tap area families but `Dp` for icon sizes and elevations. This inconsistency means component code must know which families need `.dp` and which don't — a latent confusion vector.

The fix: update `AndroidBuilder` to output `Dp` for ALL dimensional token families (spacing, radius, tap area), matching what it already does for icons and elevations.

**Generator change (Ada's domain):** Small — update the formatting logic in `AndroidBuilder` for spacing, radius, and tap area to output `val` with `.dp` suffix instead of `const val` with `Float` type. Same pattern already used for icon sizes and elevations.

**Consumer migration (Lina's domain):** Mechanical but broad — every Android component file that does `DesignTokens.space_XXX.dp` or `DesignTokens.radius_XXX.dp` or `DesignTokens.tap_area_XXX.dp` needs the `.dp` removed. Find-and-replace pattern across all 29 components.

**Risk to verify:** If any Android component does arithmetic with token values (e.g., `DesignTokens.space_100 * 2`), changing from `Float` to `Dp` would break that — `Dp` doesn't support `* Int` the same way. [@LINA] Can you check whether any Android component files use spacing/radius/tap area tokens in arithmetic expressions? This determines whether the migration is purely mechanical or has edge cases. → design-outline.md § "Cross-Domain Notes"

**Impact on existing tasks:**
- Task 3.1 (VerticalList compliance) and Task 2.2 (Avatar compliance) become dependent on the generator fix — they should be done against the new output
- The TokenCompliance test's `.dp` false positive resolves itself — no band-aid needed
- The `DesignTokens.radius_100.dp` violation becomes a real violation (`.dp` genuinely unnecessary after the generator fix)

**Impact on design outline:** Needs a new Issue 4 section and the Options/Open Questions updated to reflect this scope addition. The design outline should be revised before formalization proceeds.

---

## Lina's Response to Ada's Issue 4 Question

**Date**: 2026-03-14
**Reviewer**: Lina

### Arithmetic on spacing/radius/tap area tokens in Android files

**Ada asked**: Can you check whether any Android component files use spacing/radius/tap area tokens in arithmetic expressions?

**Answer: No arithmetic found.** Searched all 29 component Android files for multiplication, division, addition, or subtraction on `DesignTokens.space_*`, `DesignTokens.radius_*`, and `DesignTokens.tap_area_*`. Zero hits. The migration from `Float` to `Dp` output is purely mechanical — find-and-replace to remove `.dp` suffixes.

### Bigger finding: Only 2 components use `.dp` — the other 27 don't

| Pattern | Component Count |
|---|---|
| `DesignTokens.space_*.dp` (with `.dp`) | **2** — Button-VerticalList-Item (4 refs), Button-VerticalList-Set (1 ref) |
| `DesignTokens.space_*` (without `.dp`) | **27** — every other component |

The 27 components WITHOUT `.dp` are assigning `Float` values to `Dp`-typed variables (e.g., `val paddingBlock: Dp = DesignTokens.space_075`). This would be a compile error in real Kotlin. Since these are reference implementations validated by static analysis (not compiled), the type mismatch is invisible.

**This means the codebase is already written as if the generator outputs `Dp`.** The 2 VerticalList components are the outliers — they added `.dp` because they were written more carefully (or later). When Ada updates the generator to output `Dp`, the 27 components need zero changes. Only the 5 `.dp` references in the 2 VerticalList files need the suffix removed.

**Bottom line**: The generator fix is even lower-risk than expected. The "codebase-wide migration" Ada was concerned about is actually a 5-line change across 2 files.
