# Composition Compliance: Slot-Based Composition Not Modeled

**Date**: 2026-04-01
**Severity**: Medium — tech debt, not blocking
**Agent**: Lina
**Found by**: Lina (self-identified during Spec 088 pre-release fix)

## Problem

The composition compliance test (`composition-compliance-validation.test.ts`) validates that platform files reference their declared `composition.internal` components via string matching (tag names, function calls). This works for components that directly import and render their composed children (e.g., Nav-TabBar-Base imports Icon-Base).

Nav-Header-Page declares Icon-Base and Button-Icon as `composition.internal` in its schema, but the web implementation uses **slot-based composition** — consumers place Icon-Base and Button-Icon into named slots. The web platform file never imports or references these components.

To pass the compliance test, composition reference comments were added:
```typescript
// Composition: nav-header-base, icon-base (via slot), button-icon (via slot)
```

This is string-matching theater, not real composition validation.

## Root Cause

The schema's `composition.internal` doesn't distinguish between:
1. **Direct composition** — the component imports and renders the child (TabBar → Icon-Base)
2. **Slot-based composition** — the component provides slots; the consumer places the child (Header-Page → slots for Button-Icon)

The compliance test assumes all `composition.internal` is direct. Slot-based composition is a valid pattern but isn't modeled.

## Options

1. **Schema change**: Add `composition.slotted` or `composition.external` for consumer-provided children. Update compliance test to skip slotted composition for web string matching.
2. **Test change**: Teach the compliance test to recognize slot-based composition (check for `<slot name="...">` patterns that correspond to the declared children).
3. **Schema + test**: Model the distinction in the schema AND validate slots in the test.

## Affected Components

- Nav-Header-Page (web): Icon-Base, Button-Icon declared as internal but slotted
- Nav-Header-App (web): Nav-Header-Base declared as internal, composed via nested element (works but fragile)
- Potentially future components using slot-based patterns

## Current Workaround

Composition reference comments in platform files. These should be removed when the proper fix lands.

## Related

- `.kiro/issues/2026-04-01-web-component-test-registration.md` (if created — the beforeAll registration workaround is a separate but related issue)
