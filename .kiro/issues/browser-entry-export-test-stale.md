# Issue: Browser Entry Export Test Expects Stale Export Line

**Date**: February 16, 2026
**Severity**: Medium
**Status**: Open
**Discovered During**: Spec 061 - Component Demo System (Task 7.4, observed in test run)
**Affects**: component-registration.test.ts

---

## Summary

The `component-registration.test.ts` test for UMD exports contains a hardcoded export line that doesn't include Chip components (`ChipBaseElement`, `ChipFilterElement`, `ChipInputElement`). The actual `browser-entry.ts` was updated to include Chip exports, but the test assertion was never updated to match.

---

## Failing Test

**File**: `src/__tests__/browser-distribution/component-registration.test.ts` (line 197)

**Expected** (in test):
```
export { InputTextBase, InputTextEmail, InputTextPassword, InputTextPhoneNumber, ButtonCTA, IconBaseElement, ButtonIcon, ContainerBaseWeb, ButtonVerticalListItem, ButtonVerticalListSet, AvatarBaseElement, BadgeLabelBase, BadgeCountBase, BadgeCountNotification, InputCheckboxBaseElement, InputCheckboxLegalElement }
```

**Actual** (in browser-entry.ts):
```
export { InputTextBase, InputTextEmail, InputTextPassword, InputTextPhoneNumber, ButtonCTA, IconBaseElement, ButtonIcon, ContainerBaseWeb, ButtonVerticalListItem, ButtonVerticalListSet, AvatarBaseElement, BadgeLabelBase, BadgeCountBase, BadgeCountNotification, InputCheckboxBaseElement, InputCheckboxLegalElement, ChipBaseElement, ChipFilterElement, ChipInputElement }
```

---

## Root Cause

When Chip components were added to the browser bundle, the test assertion was not updated to include the new exports. The test uses a string-match approach (`toContain`) against the full export line, so any addition to the export list breaks the assertion.

---

## Fix

Update line 197 in `component-registration.test.ts` to include the Chip exports in the expected string.

---

## Related Specs

- Spec 047 or similar (Chip component bundle registration)
