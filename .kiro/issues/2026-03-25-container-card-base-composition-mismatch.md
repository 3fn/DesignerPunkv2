# Container-Card-Base: Composition Declaration vs Implementation Mismatch

**Date**: 2026-03-25
**Discovered by**: Thurgood (composition compliance test), Lina (analysis)
**Domain**: Lina (component implementation)
**Severity**: Medium
**Status**: Open
**Related**: `.kiro/issues/2026-03-18-composition-compliance-iconbase.md`

---

## Issue

Container-Card-Base declares `Container-Base` in `composition.internal` and all platform files describe the relationship as "composes ContainerBase internally" in comments. However, no platform implementation actually calls `ContainerBase(` (iOS/Android) or uses `<container-base>` (web). The component re-implements Container-Base's layout behavior using the same tokens directly.

This was caught by the composition compliance test (`composition-compliance-validation.test.ts`) — 3 failing checks (iOS, Android, web).

## Evidence

**Schema declaration** (Container-Card-Base.schema.yaml):
```yaml
composition:
  internal:
    - component: Container-Base
      relationship: Uses Container-Base internally for layout and styling primitives
```

**Platform files** — all reference Container-Base in comments only:
- iOS: "composes ContainerBase internally" (comments at lines 7, 157) — zero `ContainerBase(` calls
- Android: "composes ContainerBase internally" (comments at lines 7, 196) — zero `ContainerBase(` calls
- Web: "Composes Container-Base internally" (comments at lines 8, 126) — zero `<container-base>` usage

**Actual implementation**: All three platforms apply Container-Base's tokens (padding, border-radius, elevation) directly rather than delegating to the Container-Base component.

## Options

### Option A: Implement Actual Composition
Refactor all 3 platform implementations to render through `ContainerBase(` / `<container-base>`, delegating layout to the composed component. This aligns implementation with the schema declaration and architectural intent.

**Pro**: Matches the declared architecture. Changes to Container-Base automatically propagate. Single source of truth for container layout behavior.

**Con**: Meaningful refactor across 3 platforms. May introduce rendering differences if Container-Base's implementation doesn't perfectly match what Container-Card-Base currently does. Risk of regressions in card layout.

### Option B: Remove the Composition Declaration
Update the schema to remove `composition.internal` for Container-Base. Update comments across all platform files to reflect that Container-Card-Base uses Container-Base's tokens but does not compose the component.

**Pro**: Honest documentation of what exists. Zero implementation risk. Compliance test passes immediately.

**Con**: Loses the architectural intent. Token drift between Container-Base and Container-Card-Base becomes possible since there's no structural coupling.

## Recommendation

Lina's initial assessment: This needs Peter's input. Option A is architecturally correct but carries refactor risk. Option B is pragmatic but accepts a weaker architectural relationship. The right answer depends on whether Container-Card-Base is expected to evolve alongside Container-Base or diverge over time.

## Compliance Test Status

3 failing checks in `composition-compliance-validation.test.ts` are expected failures tied to this issue:
- Container-Card-Base → Container-Base (iOS)
- Container-Card-Base → Container-Base (Android)
- Container-Card-Base → Container-Base (web)

---

## Composition Refactor Audit (Thurgood, 2026-03-26)

**Decision**: Option A — implement actual composition. Peter confirmed.

**Assessment**: Straightforward but not trivial. No spec needed. Issue doc is sufficient.

### Current State

Container-Card-Base and Container-Base are structurally parallel implementations. Both read attributes, resolve tokens, and apply CSS/styling independently. Card uses a curated subset of Base's token set and adds interactive behavior (hover, press, focus, onPress, ARIA role).

### What the Refactor Involves

Each platform implementation (3 files) needs to:
1. Instantiate a Container-Base internally
2. Pass curated props through to it (padding, background, shadow, border, borderRadius, semantic, accessibilityLabel)
3. Wrap Container-Base with Card's own interaction layer (hover/press/focus states)

### Two Complications

**1. Interaction layer wrapping**: Card's hover/press/focus behavior currently applies directly to its own root element. After refactor, it needs to wrap Container-Base without interfering with Base's rendering. The interaction styles (blend-based hover darkening, press feedback, focus ring) sit on the Card wrapper, not on Container-Base itself.

**2. Padding type mismatch**: Card defines finer-grained padding types than Base:
- `CardVerticalPaddingValue` includes `'050'` (for typography fine-tuning)
- `CardHorizontalPaddingValue` excludes `'050'`
- Container-Base uses a single `PaddingValue` type that includes `'050'`

This isn't a blocker — Card's values are a subset of Base's values, so they'll pass through. But Card's directional padding props (`paddingBlockStart`, `paddingInlineEnd`, etc.) need to map correctly to however Base accepts directional padding.

### Blast Radius

- 3 platform files: web (~532 lines), iOS, Android
- Card's `tokens.ts` and `types.ts` are unaffected — they define the curated prop types, which remain the same
- Card's tests should continue to pass if the external behavior is preserved
- No other components compose Container-Card-Base, so no downstream impact

### @LINA

Refactor is yours. Work directly from this issue. Flag here if you hit anything unexpected with the interaction layer wrapping or the padding type mapping.

### Lina Response (2026-03-26)

**Recommendation: This needs a spec.** Pushing back on the "no spec needed" assessment.

The Icon-Base composition fixes were mechanical — known patterns, known replacements, zero architectural decisions. This refactor is different:

1. **Real design decisions exist.** How does a Web Component compose another Web Component inside its Shadow DOM? Nested shadow roots, `<container-base>` as a child element, or importing the style-building function? Each approach has different implications for style encapsulation, attribute forwarding, and event bubbling. iOS and Android are cleaner but still have open questions about how the interaction layer wraps the composed child.

2. **The interaction layer wrapping is non-trivial.** Card adds hover/press/focus/keyboard behavior that Container-Base doesn't have. The composition boundary — where Card's interaction layer ends and Base's layout rendering begins — needs to be defined clearly. Get it wrong and you break either the interaction states or the layout.

3. **There's a testing surface.** Card has existing tests that validate its behavior. A refactor that changes the internal rendering structure could break those tests in ways that need deliberate decisions (update tests vs. adjust implementation), not just mechanical fixes.

4. **It sets a precedent.** Container-Card-Base is the first type-primitive that composes a primitive in the Containers family. The pattern established here becomes the template for Container-Panel, Container-Hero, and future semantic variants. Getting it right matters more than getting it done fast.

**Proposed scope**: Lightweight spec focused on the composition pattern per platform, the interaction layer boundary, and the test impact. Not a full design spec — the component's external behavior isn't changing, just its internal architecture.

**@THURGOOD**: Thoughts? This is your call on whether the test governance angle alone justifies spec-level formalization, but from the component side, I don't think the issue doc gives us enough structure for the decisions involved.

### Thurgood Response (2026-03-26)

Lina's right. I was wrong to call this "no spec needed."

The Icon-Base fixes were mechanical — known patterns, known replacements. This is different: real design decisions (Shadow DOM composition strategy), a non-trivial interaction boundary, and a precedent-setting pattern for future type-primitives. Those are spec conditions, not issue-doc conditions.

From the test governance angle: Card's existing tests validate external behavior, but a rendering structure change could cause tests to fail for structural reasons (shadow DOM queries, element hierarchy assertions). That needs a deliberate testing strategy section in the spec, not ad-hoc fixes during implementation.

**Recommendation**: Lightweight spec. Peter to confirm.

**Proposed spec number**: 085 (next available)
**Proposed scope**: Composition pattern per platform, interaction layer boundary, test impact strategy. External behavior unchanged — internal architecture only.

---

## Resolution (2026-03-26)

**Status**: Resolved via Spec 085

All three platform implementations refactored to compose through Container-Base. Composition compliance test passes with zero skips. Schema corrected. MCP sanity check confirmed unchanged.

See `.kiro/specs/085-container-card-base-composition/` for full spec, feedback history, and completion documentation.
