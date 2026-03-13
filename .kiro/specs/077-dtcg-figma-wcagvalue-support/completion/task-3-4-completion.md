# Task 3.4 Completion: Restore DTCGFormatGenerator.property.test.ts

**Date**: 2026-03-13
**Spec**: 077 - DTCG & Figma wcagValue Support
**Task**: 3.4 - Restore DTCGFormatGenerator.property.test.ts
**Type**: Implementation
**Status**: Complete

---

## What Changed

- Re-added `semanticColor` to expected semantic groups list
- Restored total token count threshold: 290 → 350
- Removed early-return guard on alias preservation test, added `expect(semanticColors).toBeDefined()`

## Verification

- `DTCGFormatGenerator.property.test.ts`: 18 passed, 0 failed
