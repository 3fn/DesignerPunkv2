# Issue: Token Completeness Test — Missing Tokens

**Date**: February 16, 2026
**Severity**: High
**Status**: Superseded
**Discovered During**: Spec 061 - Component Demo System (Task 7.4, observed in test run)
**Affects**: token-completeness.property.test.ts

---

## Summary

~~The token completeness property test reports two motion tokens referenced in the browser bundles (ESM and UMD) that don't exist in `tokens.css`:~~

~~- `motion-duration-fast`~~
~~- `motion-easing-standard`~~

**Update (Feb 17, 2026):** The scope of this issue is larger than initially reported. There are **22 missing tokens** (2 motion tokens + 20 progress tokens), not just 2.

**This issue has been superseded by a comprehensive collaborative issue document:**

👉 **See: `.kiro/issues/missing-tokens-blocking-demo-system.md`**

The new document includes:
- Full list of 22 missing tokens
- Breakdown by domain (Chip motion tokens for Lina, Progress tokens for Ada)
- Validation steps (Thurgood)
- Coordination and status tracking
- Resolution criteria

---

## Original Report (Incomplete)

**Failing Tests:**
- `all token references in ESM bundle should exist in tokens.css` (line 379)
- `all token references in UMD bundle should exist in tokens.css` (line 405)

**Originally reported missing tokens (2):**
- `motion-duration-fast`
- `motion-easing-standard`

**Actual missing tokens (22):**
- 2 motion tokens (Chip-Base)
- 20 progress tokens (Progress components)

---

## Resolution

Work on this issue is now tracked in the collaborative document: `.kiro/issues/missing-tokens-blocking-demo-system.md`

This document remains for historical reference only.
