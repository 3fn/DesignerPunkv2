# Task 2.9 Completion: Blend Token Completeness Audit

**Date**: 2026-03-01
**Spec**: 066 - Schema Completion and Contract Audit Resolution
**Lead**: Lina
**Validation**: Tier 2 - Standard

---

## Audit Methodology

Three-layer scan across all 28 component schemas:

1. **Web TS utility methods** — `hoverColor()`, `pressedColor()`, `disabledColor()`, `focusColor()`, `iconLighter()` calls in platform TS files
2. **CSS custom properties** — `var(--blend-*)` references in platform CSS files
3. **Android explicit refs** — `blend.*` string literals in Kotlin files

This approach catches both direct token references AND programmatic blend utility usage (lesson from Task 2.6 audit — grep for string literals alone misses utility API calls).

## Findings

### No Missing Blend Tokens
Every component that uses blend operations has them correctly listed in its schema. Zero gaps.

### Over-Declaration in 3 Inherited Schemas (informational)
Three Input-Text children list parent blend tokens as their own:
- **Input-Text-Email**: lists blend.focusSaturate, blend.disabledDesaturate (inherited from Input-Text-Base)
- **Input-Text-Password**: same
- **Input-Text-PhoneNumber**: same

These are pre-066 schemas written before the `resolvedTokens` model. The MCP's `resolvedTokens.composed` now handles inheritance assembly, making this over-declaration redundant but not incorrect.

### Components Using Blend Tokens (12 of 28)
| Component | Blend Tokens |
|-----------|-------------|
| Button-CTA | hoverDarker, pressedDarker, disabledDesaturate, iconLighter |
| Button-Icon | hoverDarker, pressedDarker |
| Button-VerticalList-Item | hoverDarker, pressedDarker |
| Chip-Base | hoverDarker, pressedDarker |
| Chip-Filter | hoverDarker, pressedDarker |
| Chip-Input | hoverDarker, pressedDarker |
| Container-Base | hoverDarker |
| Container-Card-Base | hoverDarker, pressedDarker |
| Icon-Base | iconLighter |
| Input-Checkbox-Base | hoverDarker, pressedDarker |
| Input-Radio-Base | hoverDarker, pressedDarker |
| Input-Text-Base | focusSaturate, disabledDesaturate |

## Decision Pending
~~Whether to remove inherited blend tokens from Input-Text-Email/Password/PhoneNumber schemas for consistency with new schema convention (own tokens only). Deferred to Peter.~~

**Resolved**: Removed inherited blend tokens (blend.focusSaturate, blend.disabledDesaturate) from Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber per Ada's recommendation and Peter's approval. Schemas now consistently declare only own tokens.

## Validation

- Component MCP tests: 7 suites, 70 tests, 70 passed
- Main project tests: 290 suites, 7437 total, 7436 passed (1 pre-existing failure)

## Ada Review (2026-03-01)

**Reviewer**: Ada (Rosetta token specialist)
**Verdict**: Audit methodology and findings confirmed. No token gaps.

### Verification

Spot-checked 3 of the 8 new schemas (Input-Radio-Base, Button-Icon, Input-Checkbox-Base) — blend tokens present and correct. Verified Input-Text-Email over-declaration claim — confirmed: declares `inherits: Input-Text-Base` and lists parent's `blend.focusSaturate`, `blend.disabledDesaturate` as own tokens.

### Over-declaration recommendation

Remove inherited blend tokens from Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber. The `resolvedTokens` model exists specifically so schemas don't duplicate parent tokens. Leaving the over-declaration creates a mixed convention (some inherited schemas list parent tokens, others don't). The removal is a 3-line delete across 3 files, low risk.

Counter-argument: those schemas are pre-066 and working. Touching them for cosmetic consistency adds churn. Deferring to a future cleanup pass is defensible. Peter's call.
