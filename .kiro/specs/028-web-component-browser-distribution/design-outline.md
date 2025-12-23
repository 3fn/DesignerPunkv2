# Design Outline: Web Component Browser Distribution

**Date**: December 22, 2025
**Purpose**: Define how DesignerPunk delivers browser-ready web components and tokens
**Organization**: spec-guide
**Scope**: 028-web-component-browser-distribution

---

## The Core Question

**How should DesignerPunk's web distribution work as the design system scales?**

This isn't just about fixing one component that doesn't load in a browser. It's about establishing the architecture for how tokens, components, and eventually themes flow from source to browser consumption.

---

## Audience

**Primary (long-term)**: Developers and AI agents building projects with DesignerPunk

**Immediate**: Peter verifying component design execution in browsers

**Key insight**: The deliverables are the same for both audiences. We build for production quality, use for verification. No shortcuts on developer experience.

---

## Current State

### What Works
- Token generation produces CSS custom properties (`:root { --color-primary: ... }`)
- Components compile to JavaScript
- Bundled applications (Vite, Webpack) can consume the system with configuration

### What Doesn't Work
- Direct browser usage fails silently (CommonJS output incompatible with ES modules)
- No single entry point for "give me everything"
- No clear path from "I want to try this" to working demo
- Token CSS and component JS are disconnected

### The Deeper Issue

The build system was designed for **build-time consumption** (bundlers, CI pipelines) but not for **runtime consumption** (browsers, CDNs, quick prototyping). As DesignerPunk grows, this gap will widen:

- More tokens (Blend tokens, new semantic categories) = more CSS to coordinate
- More components = more JavaScript to bundle
- Theming support = more configuration to manage

---

## Vision: What Should "Browser-Ready" Mean?

### For a Developer Trying DesignerPunk

```html
<!-- This should just work -->
<link rel="stylesheet" href="/dist/browser/tokens.css">
<script type="module" src="/dist/browser/designerpunk.esm.js"></script>

<text-input-field label="Email" helper-text="Enter your email"></text-input-field>
<button-cta variant="primary">Submit</button-cta>
```

No bundler. No configuration. No "install these 5 dependencies first."

### For a Production Application

```typescript
// Tree-shakeable imports (future enhancement)
import { TextInputField } from '@designerpunk/components';

// Or full bundle for simplicity
import '@designerpunk/components';
```

### For the DesignerPunk Build System

The browser distribution should be a **natural output** of the existing build pipeline, not a separate system to maintain:

```
Token Sources (.ts)
    ↓
Token Generation (existing)
    ↓
├── Platform Outputs (iOS, Android, Web CSS) ← existing
└── Browser Bundle (NEW) ← components bundled for direct browser use
```

---

## Agreed Decisions

These decisions were made through discussion and are now locked for this spec:

### Scope: Standard Tier

| What's Included | What's Deferred |
|-----------------|-----------------|
| ESM bundle (modern browsers) | CDN setup (requires npm publish) |
| UMD bundle (script tags, legacy) | Per-component bundles |
| Token CSS (existing file) | npm publishing |
| npm `exports` field | Component renaming |
| Demo page verification | Theming system |

**Rationale**: Standard tier provides production-ready distribution without over-engineering. Per-component bundles and CDN can be added when there's demand.

### Token CSS: Use Existing File

The browser bundle will use the same `DesignTokens.web.css` that the build system already generates.

**Rationale**: 
- Single source of truth (no drift)
- Already tested and validated
- Zero additional generation logic
- Browser-specific optimizations can be a separate concern later

### Component Naming: Keep Current Names

Current custom element names remain unchanged:
- `text-input-field`
- `button-cta`
- `dp-icon`
- `dp-container`

**Rationale**: Renaming would cause test failures. Component naming consistency (`input-text-field`, `input-radio`, etc.) is a valid future improvement but belongs in a separate spec.

### Bundle Size: Track, Don't Optimize Prematurely

- **Soft ceiling**: 100KB gzipped (trigger for "time to think about splitting")
- **Expected size**: 15-30KB gzipped for current 4 components + tokens
- **Action**: Add bundle size to CI output for visibility

**Rationale**: Current component count doesn't warrant per-component bundles. Monitor and react when needed.

---

## Key Design Decisions

### Decision 1: Token-Component Relationship

**Choice**: Separate files (tokens.css + components.js)

**Rationale**:
- Allows token customization (theming)
- Mirrors industry standard (Shoelace, etc.)
- Tokens can be cached independently
- Users can override tokens without rebuilding components

### Decision 2: Component Registration

**Choice**: Auto-register on import

When the bundle loads, custom elements register automatically. No manual `customElements.define()` required.

**Rationale**:
- Simplest developer experience
- "Just works" for the common case
- Advanced users can still import individual components if needed (future enhancement)

### Decision 3: Bundle Formats

**Choice**: ESM (primary) + UMD (compatibility)

| Format | Use Case | Target |
|--------|----------|--------|
| ESM | `<script type="module">` | Modern browsers (ES2020+) |
| UMD | `<script src="...">` | Legacy, CDN, global access |

**Rationale**: ESM is the modern standard. UMD ensures compatibility with older tooling and enables `window.DesignerPunk` access for debugging.

---

## Scalability Considerations

### As Tokens Grow

When Blend tokens, new semantic categories, or theme variants are added:

- Token CSS generation already includes new tokens automatically
- Browser bundle references the same generated file
- No manual "add this token to browser bundle" step needed

### As Components Grow

When new components are added:

- Add export to browser entry point
- Add `customElements.define()` call
- Bundle automatically includes new component

**Future enhancement**: Automate entry point generation from component registry.

### As Theming Evolves

When theme support is added:

- Token CSS uses CSS custom properties (already does)
- Consumers can override tokens with their own CSS
- Multiple theme files can coexist

---

## Integration with Existing Build System

### Current Build Pipeline

```
npm run build
    ↓
├── Token Generation (generateTokenFiles.ts)
│   ├── DesignTokens.web.css
│   ├── DesignTokens.ios.swift
│   └── DesignTokens.android.kt
│
├── TypeScript Compilation (tsc)
│   └── dist/*.js (CommonJS)
│
└── Type Definitions
    └── dist/*.d.ts
```

### Proposed Addition

```
npm run build
    ↓
├── [existing outputs unchanged]
│
└── Browser Bundle (NEW)
    ├── dist/browser/designerpunk.esm.js
    ├── dist/browser/designerpunk.esm.min.js
    ├── dist/browser/designerpunk.umd.js
    ├── dist/browser/designerpunk.umd.min.js
    └── dist/browser/tokens.css (copy of DesignTokens.web.css)
```

**Key principle**: Browser bundle is an additional output, not a replacement. Existing build outputs remain unchanged.

---

## Success Criteria

1. **Components render in browser** - Load script + CSS, see working component
2. **Tokens apply correctly** - Colors, spacing, motion all work
3. **No console errors** - Clean load without warnings
4. **Demo page works** - Visual verification possible
5. **ESM import works** - `<script type="module">` loads successfully
6. **UMD script works** - `<script src="...">` loads successfully
7. **Bundle size tracked** - Size visible in build output
8. **npm exports configured** - Package consumable by bundlers

---

## What This Spec Will NOT Do

- **npm publishing** - Separate concern, separate spec
- **CDN setup** - Requires npm publish first
- **Component renaming** - Would cause test failures, defer to future spec
- **Per-component bundles** - Not needed at current scale
- **Theming system** - Future enhancement
- **React/Vue wrappers** - Different distribution channel
- **iOS/Android changes** - Unaffected by this work

---

## Related Context

- **Issue**: `.kiro/issues/web-component-browser-distribution.md` - Discovery and immediate problem
- **Audit**: `.kiro/audits/web-format-migration-investigation.md` - Web format decisions and history
- **Spec 027**: TextInputField Animation Refactor - Where this was discovered

---

*This design outline captures the vision and agreed decisions. Requirements will define specific acceptance criteria.*
