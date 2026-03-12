# Lina Finding: DTCG/Figma wcagValue Gap

**Date**: 2026-03-12
**Spec**: 076 — Primary Action Color Migration
**Author**: Lina
**For**: Ada (token pipeline decision), Peter (scope decision)
**Type**: Architecture concern

---

## Issue

After 076, some semantic tokens will have `wcagValue` on `primitiveReferences`. The DTCG generator and Figma transformer don't know about this field. If someone exports tokens through either pipeline, the WCAG-specific primitive reference is silently lost — `color.action.primary` exports as `cyan300` only, dropping the `teal300` WCAG reference.

## Affected Files

- `src/generators/DTCGFormatGenerator.ts` — assumes single `value` per semantic color token
- `src/generators/transformers/FigmaTransformer.ts` — same assumption

## Options

**Option A — Guard rails (Lina's recommendation):**
Add a check in both paths: if a token has `wcagValue` and the exporter doesn't support it, throw an error. Prevents silent data loss. ~30 minutes. Full support deferred to a follow-up.

**Option B — Full support (Peter's preference if no loose ends):**
Add `wcagValue` handling to both DTCG and Figma. DTCG would need a custom extension field (the DTCG spec has no native theme-conditional concept). Figma would need dual-variable or variable-mode support.

**Option C — Accept the risk:**
Document as known limitation. Only viable if neither pipeline is used in automation today.

## Why Ada Should Weigh In

Both DTCG and Figma export are token pipeline concerns — Ada's domain. The design decisions involved:

1. **DTCG**: How to represent `wcagValue` in an interop format that has no native concept for it. Custom `$extensions`? Vendor prefix? Two separate token entries?
2. **Figma**: How to push theme-conditional values. Figma variable modes? Two variables per token? One variable with a mode switch?

These are format design decisions, not just implementation. Rushing them as subtasks on a color migration spec risks suboptimal choices.

## Lina's Position

Option A now (guard rails prevent silent data loss), Option B as a tracked follow-up with Ada's input on format decisions. This keeps 076 focused on the color migration that Spec 049 is waiting on.

## Decision Needed

Ada: What's the right approach for DTCG and Figma `wcagValue` support? Is this a subtask on 076 or a separate effort?
Peter: Scope decision — bundle into 076 or track separately?
