# Task 3.5 Completion: Transform Guard Rail Tests

**Date**: 2026-03-13
**Spec**: 077 - DTCG & Figma wcagValue Support
**Task**: 3.5 - Transform guard rail tests
**Type**: Implementation
**Status**: Complete

---

## What Changed

- Renamed `WcagValueExportGuardRails.test.ts` → `WcagValueExportSupport.test.ts`
- DTCG test: "should omit semanticColor" → "should include semanticColor with modes.wcag"
- Figma test: "should throw when wcagValue" → "should populate valuesByMode.wcag"
- Figma fixture updated: `wcagValue: 'purple500'` → `modes: { wcag: '{color.purple500}' }`
- Token fixtures preserved, only assertions changed
- Old file deleted

## Verification

- `WcagValueExportSupport.test.ts`: 4 passed, 0 failed
