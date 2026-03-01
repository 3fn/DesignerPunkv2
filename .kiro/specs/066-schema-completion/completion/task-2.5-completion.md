# Task 2.5 Completion: Input-Checkbox-Base Schema

**Date**: 2026-03-01
**Spec**: 066 - Schema Completion and Contract Audit Resolution
**Lead**: Lina
**Validation**: Tier 2 - Standard

---

## What Changed

### Created `Input-Checkbox-Base.schema.yaml`
- 13 properties from types.ts: checked, indeterminate, label, size, labelAlign, labelTypography, helperText, errorMessage, onChange, id, testID, name, value
- 22 tokens across 9 categories (color, icon, accessibility, motion, blend, border, radius, scale, typography)
- Blend tokens: blend.hoverDarker (border hover), blend.pressedDarker (ripple/press)
- Parent for Input-Checkbox-Legal (Legal will use omits in 2.6)

## Validation

- Component MCP tests: 7 suites, 70 tests, 70 passed
- Main project tests: 290 suites, 7437 tests, 7437 passed
