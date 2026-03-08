# Lina: Wire Split Timing Properties for Peter's Experimentation

**Date**: 2026-03-07
**For**: Lina (component implementation)
**Priority**: Quick turnaround — Peter is waiting to A/B test timing feels
**Context**: Peter wants to experiment with split timing: scale at 250ms, color+slide at 350ms. The Node-Base `sizing="scale"` CSS currently uses one set of custom properties for all transitions. We need separate properties so Peter can tune each independently via DevTools.

---

## What's Needed

In the `:host([sizing="scale"]) .node` CSS block, split the `transition` declaration to use separate custom properties for scale vs. color:

```css
:host([sizing="scale"]) .node {
  /* ... existing fixed layout box rules ... */
  transition: transform var(--motion-selection-transition-duration) var(--motion-selection-transition-easing),
              background-color var(--motion-color-transition-duration, var(--motion-selection-transition-duration))
                              var(--motion-color-transition-easing, var(--motion-selection-transition-easing));
}
```

The `var(--motion-color-transition-duration, var(--motion-selection-transition-duration))` fallback pattern means:
- By default, color uses the same timing as scale (no change from current behavior)
- Peter can override just `--motion-color-transition-duration` and `--motion-color-transition-easing` in DevTools to test different feels

The slide `translateX` timing in Pagination-Base `_render()` should similarly read from a `--motion-slide-transition-duration` / `--motion-slide-transition-easing` property (with same fallback pattern), or use the same color properties if we want color and slide to always match.

## After Wiring

Rebuild the bundle (`npm run build`) so Peter can test in the demo by pasting overrides in DevTools:

```css
/* In DevTools on progress-indicator-node-base elements */
--motion-color-transition-duration: 350ms;
--motion-color-transition-easing: cubic-bezier(0.4, 0.0, 0.2, 1);  /* easingStandard */
```

Then swap easing to compare:
```css
--motion-color-transition-easing: cubic-bezier(0.0, 0.0, 0.2, 1);  /* easingDecelerate */
```

## Important

- This is experimentation scaffolding, not final architecture
- The custom property names are temporary — once Peter picks the feel, Ada will create a proper semantic token and we'll reference that instead
- Don't touch the default (non-`sizing="scale"`) transition — steppers stay unchanged
- Reduced motion rule should cover both properties
