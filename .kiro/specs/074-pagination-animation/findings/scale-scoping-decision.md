# Cross-Component Scoping Decision: Scale Animation on Node-Base

**Date**: 2026-03-07
**Context**: Task 3.1 (scale-based sizing) changes Node-Base CSS from `width`/`height` animation to `transform: scale()`. Node-Base is shared by Pagination-Base, Stepper-Base, and Stepper-Detailed. Steppers render content inside nodes (checkmarks, icons) that should not be scaled. The scale behavior must be scoped to pagination only.
**Decision needed from**: Ada (token/schema implications), Lina (component architecture), Peter (final call)
**Peter's lean**: Option B

---

## The Problem

Changing Node-Base's `.node` from `width`/`height` to `transform: scale()` globally would affect all consumers. Steppers use `current` state with content inside the node — scaling the entire node would distort checkmarks and icons. We need a way to apply scale behavior only when Pagination-Base is the consumer.

---

## Option A: Scope via `content="none"` selector

Pagination-Base already sets `content="none"` on all its nodes. Use this existing attribute to scope the scale CSS.

```css
/* Default: width/height sizing (steppers) */
.node { width: var(...); height: var(...); }

/* Scale sizing when no content (pagination dots) */
:host([content="none"]) .node {
  width: var(--progress-node-size-{size}-current);
  height: var(--progress-node-size-{size}-current);
  transform: scale(0.80); /* inactive */
}
:host([content="none"]) .node--current {
  transform: scale(1.0);
}
```

**Pros**:
- No new attributes — uses existing semantic distinction
- Zero API surface change to Node-Base
- Works today because pagination is the only `content="none"` consumer

**Cons**:
- Couples animation behavior to a content attribute — semantic mismatch
- If a future component uses `content="none"` without wanting scale, it gets scale behavior silently
- Fragile: the correlation between "no content" and "needs scale" is coincidental, not intentional

---

## Option B: Explicit `layout` attribute on Node-Base

Add an optional `layout` attribute to Node-Base. When `layout="fixed"`, the node uses a fixed layout box at current-state size and scales down for inactive states. When absent (default), current width/height behavior is preserved.

```css
/* Default: width/height sizing (steppers, backward compatible) */
.node { width: var(...); height: var(...); }

/* Fixed layout: scale-based sizing (pagination) */
:host([layout="fixed"]) .node {
  width: var(--progress-node-size-{size}-current);
  height: var(--progress-node-size-{size}-current);
  transform: scale(0.80); /* inactive */
}
:host([layout="fixed"]) .node--current {
  transform: scale(1.0);
}
```

Pagination-Base `_render()` adds: `node.setAttribute('layout', 'fixed')`

**Pros**:
- Explicit intent — self-documenting contract between consumer and primitive
- No semantic mismatch — `layout="fixed"` means "fixed layout box with scale"
- Future-proof: any consumer that needs this behavior can opt in
- Default behavior unchanged — zero risk to existing stepper consumers

**Cons**:
- Adds a 6th observed attribute to Node-Base (currently has 5: state, size, content, icon, test-id)
- Adds API surface to a shared primitive for what is currently a single consumer's need
- Requires schema update to `Progress-Indicator-Node-Base.schema.yaml`

---

## Option C: Inline styles from Pagination-Base JS

Keep Node-Base unchanged. Pagination-Base applies `transform: scale()` and fixed dimensions via inline `style` attributes in `_render()`.

```ts
// In Pagination-Base _render()
node.style.width = `${currentSize}px`;
node.style.height = `${currentSize}px`;
node.style.transform = isCurrentNode ? 'scale(1.0)' : `scale(${ratio})`;
```

**Pros**:
- Zero changes to Node-Base — no new attributes, no CSS changes, no schema update
- Animation refinement stays entirely within the consumer that needs it

**Cons**:
- Inline styles override Node-Base's CSS — breaks the token-based styling contract
- Hard-coded pixel values in JS instead of CSS custom property references
- The CSS `transition` on `.node` would need to include `transform`, which is still a Node-Base CSS change — so this isn't truly zero-touch on Node-Base
- Animation logic split between JS (inline styles) and CSS (transition declaration) — harder to maintain

---

## Questions for Reviewers

### For Ada — ✅ Answered
- ~~Does adding `layout` to Node-Base's observed attributes have any token governance implications?~~ No impact. See Ada's assessment below.
- ~~Is there a naming concern?~~ Yes. Ada recommends `sizing="scale"` over `layout="fixed"`. See Ada's assessment below.

### For Lina
- From a component architecture perspective, is a 6th attribute on Node-Base acceptable for this use case?
- Does Option B's `:host([layout="fixed"])` selector pattern align with how other DesignerPunk primitives handle consumer-specific behavior?
- Any concerns about the schema update to `Progress-Indicator-Node-Base.schema.yaml`?

---

## Thurgood's Assessment

Option B is the most sustainable. Option A works today but creates a fragile implicit coupling. Option C breaks the token-based styling contract. Option B adds minimal API surface with explicit, self-documenting intent and zero risk to existing consumers.

The "single consumer" concern is valid but not disqualifying — primitives should expose capabilities that make sense for their domain, even if only one consumer uses them initially. A node that can declare its layout strategy is a reasonable primitive capability.

---

## Lina's Assessment

**Agrees with Option B.**

**On the 6th attribute**: Not a complexity concern. The question is whether the attribute belongs on the primitive conceptually — and it does. A node knowing whether its layout box is fixed or fluid is a legitimate primitive concern, not pagination-specific logic leaking into the primitive. It's a layout strategy the primitive owns and consumers opt into.

**On `:host([layout="fixed"])` pattern**: Aligns with existing DesignerPunk Shadow DOM patterns. Node-Base already uses `:host([content="none"])` for dot-only rendering. Same selector pattern, same principle.

**On naming**: Push back on `layout="fixed"` — collision risk with CSS `position: fixed`. Recommend `sizing="scale"`. It describes what it does (sizing strategy uses scale transforms instead of dimension changes), is short, unambiguous, and doesn't collide with any CSS keyword. `box="stable"` is too abstract. `animate-size="transform"` is too implementation-specific.

**On schema update**: Straightforward — optional string enum prop, default absent. MCP picks it up automatically.

**Reject Option A**: The `content="none"` coupling is exactly the kind of implicit contract that causes bugs six months later when someone adds a minimal-dot stepper variant. The correlation is coincidental today and will break silently.

**Reject Option C**: Inline styles overriding token-based CSS is a governance violation. And you'd still need to touch Node-Base CSS for the `transition` property — so it's not truly zero-touch.

**Implementation detail to flag**: The scale ratio is per-size-variant (sm: 12/16=0.75, md: 16/20=0.8, lg: 20/24=0.833). These derive from token values. Options: hardcode in CSS per variant, or compute via `calc(var(--base) / var(--current))`. The `calc()` approach is more maintainable but requires unitless values for `transform: scale()` — which our tokens now provide via references. Worth confirming the math works in CSS before implementing.

---

## Ada's Assessment (2026-03-07)

**Token governance**: No impact. The attribute controls *how* existing tokens are applied (scale vs width/height), not *which* tokens. The same `--progress-node-size-*-current` and `--progress-node-size-*` tokens are consumed either way. No new tokens needed.

**Option recommendation**: Option B. Agree with Thurgood. Option A's implicit coupling between `content="none"` and scale behavior is the kind of correlation that causes bugs when a future consumer uses `content="none"` without expecting scale. Option C breaks the token-based styling contract — non-starter.

**Naming**: Recommend `sizing="scale"` over `layout="fixed"`.

- `fixed` collides with CSS `position: fixed`. In a design system where developers live in CSS, that's a real confusion vector.
- `layout` is vague — doesn't communicate what about the layout differs.
- `sizing="scale"` says exactly what it does: scale-based sizing instead of dimension-based. The attribute name describes the domain, the value describes the strategy. Extends naturally if a third strategy is ever needed (e.g., `sizing="flex"`).
- Minor counter-argument: `sizing` overlaps with CSS `box-sizing`, but `box-sizing` takes `content-box`/`border-box` — the value `scale` disambiguates.
