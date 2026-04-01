# Web Component Test Registration Fragility

**Date**: 2026-04-01
**Severity**: Low — workaround in place, not blocking
**Agent**: Lina
**Found by**: Lina (Spec 088 pre-release test debugging)

## Problem

Web Component tests in jsdom fail when `document.body.innerHTML = ''` is used in `afterEach` cleanup. This destroys jsdom's custom element registry, causing subsequent tests to create generic `HTMLElement` instances instead of the registered custom element class.

Additionally, ES module side-effect imports (`import './Component.web'` which calls `customElements.define`) don't reliably register elements across jsdom test environments. A `beforeAll` with explicit `require()` fallback is needed.

## Current Workaround

```typescript
// Cleanup: removeChild instead of innerHTML
afterEach(() => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

// Registration: explicit fallback
beforeAll(() => {
  if (!customElements.get('my-component')) {
    require('../platforms/web/MyComponent.web');
  }
});
```

## Proper Fix

Create a shared test utility (`src/__tests__/helpers/web-component-test-utils.ts`) that:
1. Provides a `cleanupDOM()` function using `removeChild` (not `innerHTML`)
2. Provides a `registerComponents(...names)` function that ensures registration
3. Documents the jsdom gotcha for future Web Component test authors

## Affected Tests

- `Nav-Header-Page/__tests__/NavHeaderPage.test.ts` (workaround applied)
- Potentially all future Web Component tests
- Nav-TabBar-Base tests work by coincidence (no cross-component imports, no innerHTML cleanup)
