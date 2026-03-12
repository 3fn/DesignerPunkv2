# Task 1.3 Completion: Infrastructure Tests

**Date**: 2026-03-12
**Spec**: 076 - Primary Action Color Migration
**Task**: 1.3 - Infrastructure tests
**Type**: Implementation
**Status**: Complete

---

## What Changed

### New File: `src/generators/__tests__/WcagValueInfrastructure.test.ts`

5 tests covering the `wcagValue` infrastructure across all 3 platforms:

1. **Web: WCAG override block** — Verifies `:root[data-theme="wcag"]` block is generated with correct `var(--purple-500)` reference when a token has `wcagValue: 'purple500'`
2. **Web: standard value preserved** — Verifies the main `:root` block still references `teal-400` (the standard `value`), not the `wcagValue`
3. **iOS: WCAG override lines** — Verifies `_wcag` suffixed static lets with `purple500` reference
4. **Android: WCAG override lines** — Verifies `_wcag` suffixed vals with `purple_500` reference
5. **Backward compatibility** — Verifies no WCAG blocks are generated on any platform when no tokens have `wcagValue` (uses real token registry)

### Test Strategy

Uses `jest.mock('../../tokens/semantic')` with a flag-controlled mock to inject a test token (`color.feedback.info.text` with `wcagValue: 'purple500'`) into the real token pipeline. This intercepts the import before `TokenFileGenerator` binds it, which `jest.spyOn` cannot do with CommonJS destructured imports.

## Validation

- All 5 new tests pass
- Full generator/provider/validator suite: 249 suites pass
- No mock leakage — backward compatibility test uses real tokens
- 1 pre-existing failure (`mcp-component-integration.test.ts`) unrelated

## Requirements Covered

- 1.1: `primitiveReferences` supports `wcagValue` key ✅
- 1.2: `wcagValue` references valid primitive tokens ✅
- 1.3: WCAG theme uses `wcagValue` primitive when present ✅
- 1.4: Web generator outputs correct primitive per theme context ✅
- 1.5: iOS generator outputs correct primitive per theme context ✅
- 1.6: Android generator outputs correct primitive per theme context ✅
- 1.7: Tokens without `wcagValue` fall back to `value` ✅
