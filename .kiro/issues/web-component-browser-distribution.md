# Issue: Web Component Browser Distribution

**Date**: December 22, 2025
**Severity**: High
**Status**: Open
**Discovered During**: Spec 027 - TextInputField Animation Refactor (Task 5.2 Manual Verification)
**Affects**: All web components (TextInputField, ButtonCTA, Icon, Container)

---

## Summary

Web components cannot be used directly in browser environments without complex build tooling. The current build outputs CommonJS modules that are incompatible with browser ES module imports, resulting in components that silently fail to render.

---

## Problem Description

### Observed Behavior

When loading `ActualComponentPreview.html` in a browser:
1. The HTML page renders headings and descriptions
2. `<text-input-field>` custom elements appear as empty/invisible
3. No JavaScript errors in console (silent failure)
4. Component simply doesn't register or render

### Root Cause

The build system outputs CommonJS format:
```javascript
// dist/components/core/TextInputField/platforms/web/TextInputField.browser.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextInputField = void 0;
// ...
```

But HTML files attempt ES Module imports:
```html
<script type="module">
  import { TextInputField } from '/dist/.../TextInputField.browser.js';
</script>
```

**CommonJS `exports` is not valid in browser ES modules.** The browser silently fails because `exports` is undefined in module scope.

### Additional Issues

1. **No UMD bundle** - No universal module that works with `<script>` tags
2. **No CDN-ready distribution** - Cannot use from unpkg/jsdelivr
3. **Dependency resolution** - Components import from other files the browser can't resolve
4. **CSS custom properties** - Require manual setup of design tokens

---

## Impact Assessment

### Developer Experience Impact

| Scenario | Current State | Expected State |
|----------|---------------|----------------|
| Quick prototyping | ❌ Doesn't work | ✅ Single script tag |
| CDN usage | ❌ Not possible | ✅ unpkg/jsdelivr ready |
| Bundled apps | ⚠️ Works with config | ✅ Works with config |
| HTML demos | ❌ Silent failure | ✅ Just works |

### Affected Components

- `TextInputField` - Confirmed broken
- `ButtonCTA` - Likely affected (same build system)
- `Icon` - Likely affected
- `Container` - Likely affected

### Business Impact

- **Adoption barrier**: Developers can't easily try the design system
- **Documentation gap**: Demo pages don't work
- **Trust erosion**: Silent failures create poor first impressions

---

## Technical Analysis

### Current Build Pipeline

```
TypeScript Source (.ts)
    ↓
tsc (TypeScript Compiler)
    ↓
CommonJS Output (.js)
    ↓
❌ Browser incompatible
```

### Required Build Pipeline

```
TypeScript Source (.ts)
    ↓
Bundler (esbuild/rollup/vite)
    ↓
Multiple Outputs:
├── ESM Bundle (.esm.js) - For modern browsers
├── UMD Bundle (.umd.js) - For script tags
├── CommonJS (.cjs) - For Node.js/bundlers
└── Type Definitions (.d.ts)
```

### Comparison with Industry Standards

| Library | Browser Usage | Setup Required |
|---------|---------------|----------------|
| Shoelace | `<script src="cdn">` | None |
| Lit | `<script type="module">` | None |
| Material Web | `<script type="module">` | None |
| **DesignerPunk** | ❌ Doesn't work | Bundler + config |

---

## Proposed Solutions

### Option A: Add Browser Bundle Build Step (Recommended)

Add esbuild or rollup to create browser-ready bundles:

```javascript
// esbuild.config.js
import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['src/components/core/TextInputField/platforms/web/TextInputField.web.ts'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/browser/text-input-field.esm.js',
});
```

**Pros**: Industry standard, proper tree-shaking, source maps
**Cons**: Additional build complexity, new dependency

### Option B: Inline Dependencies in Browser Build

Modify the existing `.browser.ts` files to be truly standalone:

```typescript
// TextInputField.browser.ts
// Inline ALL dependencies, no imports
class TextInputField extends HTMLElement {
  // Complete implementation with no external deps
}
customElements.define('text-input-field', TextInputField);
```

**Pros**: No new build tools needed
**Cons**: Code duplication, harder to maintain

### Option C: Use Import Maps

Provide import maps for browser resolution:

```html
<script type="importmap">
{
  "imports": {
    "@designerpunk/": "/dist/"
  }
}
</script>
```

**Pros**: Modern standard, no bundling
**Cons**: Requires import map setup, not all browsers support

---

## Recommended Action Plan

### Phase 1: Immediate (Spec 027 Completion)
- [x] Document issue (this file)
- [ ] Create working inline demo for manual verification
- [ ] Note limitation in component README

### Phase 2: Short-term (New Spec)
- [ ] Create spec for "Web Component Browser Distribution"
- [ ] Evaluate bundler options (esbuild recommended for speed)
- [ ] Implement ESM browser bundle build step
- [ ] Update demo HTML files to use new bundles

### Phase 3: Medium-term
- [ ] Publish to npm with proper `exports` field
- [ ] Set up CDN distribution (unpkg/jsdelivr)
- [ ] Create "Getting Started" documentation
- [ ] Add browser bundle to CI/CD

---

## Workarounds

### For Demo/Testing (Current)

Inline the component code directly in HTML:

```html
<script>
  class TextInputField extends HTMLElement {
    // Full implementation inline
  }
  customElements.define('text-input-field', TextInputField);
</script>
```

### For Production Apps

Use a bundler (Vite, Webpack) that handles CommonJS→ESM conversion:

```javascript
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@designerpunk/components']
  }
}
```

---

## Related Issues

- None currently documented

## Related Specs

- Spec 027: TextInputField Animation Refactor (discovered during)
- Spec 013: TextInputField (original component)
- Spec 005: ButtonCTA (likely affected)

---

## References

- [Web Components Best Practices](https://web.dev/custom-elements-best-practices/)
- [Shoelace Distribution](https://shoelace.style/getting-started/installation)
- [Lit Starter Kits](https://lit.dev/docs/tools/starter-kits/)
- [esbuild Documentation](https://esbuild.github.io/)

---

*This issue was discovered during manual browser verification of the TextInputField animation refactor. The animation refactor itself (CSS transition-delay) is correct and tests pass - this is a separate infrastructure issue affecting all web components.*
