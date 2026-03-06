# Lina Spec Review: 073 — Opacity Architecture Evolution

**Date**: 2026-03-06
**Reviewer**: Lina (Stemma Component Specialist)
**Documents Reviewed**: requirements.md, design.md, tasks.md
**Verdict**: Ready to execute. No blocking issues.

---

## Requirements Review

### No Issues

- **Requirement 1 (Opacity Primitive Rename)**: Straightforward. AC 1.6 correctly reflects my earlier audit — component platform files need comment-only updates, no functional changes.
- **Requirement 5 (Validator Updates)**: Well-scoped. Catches invalid configurations at definition time.
- **Requirement 7 (Documentation Updates)**: Ballot measure grouping is sensible.

### Positive Observations

- **Requirement 3 (Mode-Invariance Field)**: The structured `modeInvariant?: boolean` field is the right approach. The design outline originally proposed using the `context` field as free-text annotation — I flagged that the MCP server should surface mode-invariance as a queryable property. The structured field solves this cleanly. AC 3.4 (validator flags suspicious `modeInvariant: true` on mode-aware primitives) is a good safety net.

- **Requirement 4 (Scrim Semantic Token)**: ACs 4.4–4.6 specify exact platform output formats, which makes them directly testable. Verified that the iOS generator's `rgbaStringToUIColor()` and Android generator's `rgbaStringToColorArgb()` already produce the specified formats. No generator changes needed for platform output formatting — only for modifier resolution upstream.

- **Requirement 6, AC 1**: "resolve modifiers in order" — the ordering guarantee matters for future composability. Good that it's explicit even though there's only one modifier type today.

- **Requirement 8 (Modifier Extensibility Governance)**: Originated from my observation in the design outline review. The formalized criteria (multiple components need it, no existing pattern covers it, mathematically composable) are reasonable gates.

---

## Design Review

### No Issues

- Backward compatibility approach is clean — both `modifiers` and `modeInvariant` are optional fields.
- Scrim token definition example is complete and clear. The `context` field carrying a human-readable explanation alongside the structured `modeInvariant` field is good belt-and-suspenders documentation.
- Decision 3 (structured field over context string) trade-off is honestly stated.

### Minor Suggestion

The pipeline resolution section describes only the `type: 'opacity'` path. The error handling table correctly specifies "Error (fail-fast)" for unknown modifier types, but someone reading only the pipeline resolution steps could miss this. Consider adding an explicit step: "if modifier type is unrecognized, throw error." Not blocking — the error table covers it.

---

## Tasks Review

### Task 1.3 — My Task

Comment-only updates to Container-Base and Avatar-Base platform files (22 references). Tier 2 validation is appropriate. Depends on Task 1.2 (rename) completing first so I'm updating comments to match final names.

### Dependency Ordering

The ordering is sound:
- 1.1 (interface) → 1.2 (rename) → 1.3 (component comments) flows naturally
- 1.4 (validators) and 1.5 (generators) can parallel with 1.2/1.3 — they're additive features, not rename-dependent
- 1.6 (scrim token) depends on 1.1 + 1.5
- 1.7 (tests) spans everything
- 1.8 and 1.9 are tail-end

### Soft Recommendation: Consider Splitting Task 1.7

Task 1.7 bundles rename test migration (221 refs across 9 files) with new feature tests (modifier validation, generator resolution, scrim integration). If something breaks, isolating whether it's a missed rename or a new feature bug becomes harder.

Potential split:
- **1.7a**: Rename test migration — update 221 refs, run suite, confirm zero failures
- **1.7b**: New feature tests — modifier, mode-invariance, scrim integration

This lets the rename be verified clean before new test code is layered on. HOWEVER — this is Ada's domain, and she may prefer a single pass since she'll have full context. Deferring to her preference; flagging the risk only.

---

## Component Impact Summary

| Component | Files | Refs | Change Type | Risk |
|-----------|-------|------|-------------|------|
| Container-Base | iOS TokenMapping.swift, Android TokenMapping.kt | 20 | Comment-only | None |
| Avatar-Base | iOS Avatar.swift, Android Avatar.kt | 2 | Comment-only | None |

All 22 references are either semantic token name strings in comments or hard-coded component token values with primitive name annotations. Zero functional code changes required.

---

## Downstream Dependency: Spec 072

I'll be the first consumer of `color.scrim.standard` when building the pagination container (Spec 072). My readiness depends on:

1. The generated token constant for `color.scrim.standard` being available in platform-specific generated files (`DesignTokens.swift`, `DesignTokens.kt`, CSS custom properties)
2. The `modeInvariant` property being queryable via the component MCP server so I can verify consumption correctness

Both are Ada's deliverables in this spec. No action needed from me beyond Task 1.3 until Spec 072 begins.
