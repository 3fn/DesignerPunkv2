# Spec 088 Pre-Release Test Failures

**Date**: 2026-03-31
**Severity**: High — blocks v10.1.0 release
**Agent**: Lina
**Found by**: Thurgood (pre-release test run)

## Failing Tests (6 suites, 11 failures)

### 1. Composition Compliance (5 failures)
- Nav-Header-App → Nav-Header-Base (web)
- Nav-Header-Page → Nav-Header-Base (web)
- Nav-Header-Page → Icon-Base (android, ios, web)
- Nav-Header-Page → Button-Icon (android, web)

Likely cause: schema composition declarations don't match actual implementation imports, or platform files missing expected composition patterns.

### 2. Behavioral Contract Validation (1 failure)
- "all schemas should have required fields"

Likely cause: one of the three new schemas is missing a required field.

### 3. Demo System (1 failure)
- "every web component family has a corresponding demo file"

Navigation family needs a demo file for the header components.

### 4. Token Compliance (1 failure)
- "should not contain undocumented hard-coded spacing values"

Likely cause: hard-coded dp/px values in header implementations instead of token references. Data flagged `48.dp` in the Android primitive review — may not have been fully resolved across all files.

### 5. NavHeaderPage Test (1 failure)
- Direct test failure in `Nav-Header-Page/__tests__/NavHeaderPage.test.ts`

### 6. Contract Catalog (1 failure)
- `Nav-Header-App: accessibility_no_heading` — **RESOLVED by Thurgood** (added `no_heading` to concept catalog, 131 concepts)

## Action

Fix items 1-5. Item 6 is resolved. All fixes needed before v10.1.0 release.
