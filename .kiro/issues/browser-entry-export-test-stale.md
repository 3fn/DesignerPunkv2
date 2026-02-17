# Issue: Browser Entry Export Test Expects Stale Export Line

**Date**: February 16, 2026
**Severity**: Low
**Status**: Resolved
**Discovered During**: Spec 061 - Component Demo System (Task 7.4, observed in test run)
**Resolved**: February 17, 2026
**Affects**: component-registration.test.ts

---

## Summary

~~The `component-registration.test.ts` test for UMD exports contains a hardcoded export line that doesn't include Chip components (`ChipBaseElement`, `ChipFilterElement`, `ChipInputElement`). The actual `browser-entry.ts` was updated to include Chip exports, but the test assertion was never updated to match.~~

**Update (Feb 17, 2026):** This issue was already resolved. The test currently includes all components (Chip, Radio, Progress) and passes. The test assertion was updated at some point after the initial issue report.

---

## Resolution

The `component-registration.test.ts` test now includes all exported components in its assertions:
- Chip components: `ChipBaseElement`, `ChipFilterElement`, `ChipInputElement`
- Radio components: `InputRadioBaseElement`, `InputRadioSetElement`
- Progress components: `ProgressIndicatorNodeBase`, `ProgressIndicatorConnectorBase`, `ProgressIndicatorLabelBase`, `ProgressPaginationBase`, `ProgressStepperBase`, `ProgressStepperDetailed`
- Container-Card: `ContainerCardBaseWeb`

The test passes successfully. No action needed.

---

## Related Issues

For current token-related test failures, see: `.kiro/issues/missing-tokens-blocking-demo-system.md`
