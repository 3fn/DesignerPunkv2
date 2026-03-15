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
