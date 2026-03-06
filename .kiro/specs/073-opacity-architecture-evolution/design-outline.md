# Design Outline: Opacity Architecture Evolution

**Date**: 2026-03-06
**Spec**: 073 - Opacity Architecture Evolution
**Status**: Design Outline
**Dependencies**: None (foundational infrastructure)
**Blocks**: Spec 072 (Pagination Container Styling) — scrim tokens required for pagination container background

---

## Motivation

The Progress/Pagination design analysis (analysis-progress-pagination) revealed a dark translucent container background — `rgba(0, 0, 0, 0.80)` — that cannot be expressed with the current token architecture. Semantic color tokens reference a single primitive color, but this value requires composing a color primitive (black500) with an opacity primitive (opacity1000).

This spec addresses two related architectural gaps:

1. **Opacity primitive naming** — Current naming (000–1300 with 8% base increments) is unintuitive. `opacity1000` meaning 80% requires documentation to decode. A value-based naming convention (000–100) would make tokens self-documenting.

2. **Token modifier architecture** — The `SemanticToken` interface has no mechanism for expressing "a color at a specific opacity." Introducing a modifier pattern enables composed tokens while preserving the primitive→semantic reference chain.

---

## Origin: Conversation Decisions

The following decisions were reached through discussion between Ada and Peter on 2026-03-06. They represent agreed-upon direction, not assumptions.

### Decision 1: Scrim Tokens as a Semantic Color Concept

**Agreed**: Scrims (semi-transparent overlays for readability/focus) will be a `color.scrim.*` semantic concept — not a component, not buried in the progress namespace.

**Rationale**: Scrims are cross-cutting. Modal backdrops, pagination pills, floating toolbars, and video overlays all need dark translucent surfaces. A shared semantic concept prevents value duplication across component tokens.

**Industry research** (Material Design 3, Polaris, Carbon):
- All treat scrim/overlay as a token, not a component
- Most bake opacity into the RGBA value
- Most have only 1–2 scrim values; DesignerPunk will use a graduated scale for flexibility

### Decision 2: Mode-Invariant Scrim Tokens

**Agreed**: Scrim tokens will NOT change between light/dark modes. A dark scrim dims content — swapping to a light scrim in dark mode would brighten content, defeating the purpose.

**Implication**: These will be the first mode-invariant semantic color tokens in the system. This must be explicitly annotated in token definitions and documentation to prevent future contributors from adding mode variants.

### Decision 3: Opacity Primitive Rename (000–1300 → 000–100)

**Agreed**: Rename opacity primitives so the token name directly represents the opacity percentage using three-digit zero-padded numbers. `opacity080` = 80%. Self-documenting, no lookup required. Three-digit format maintains consistency with the broader token naming system.

**Breaking change**: All existing opacity references must migrate. Semantic opacity tokens, tests, documentation, and any component references. Big-bang rename — no deprecation period.

### Decision 4: Token Modifier Architecture (Option D)

**Agreed**: Introduce a `modifiers` array on `SemanticToken` rather than dual primitive references or baked RGBA values.

**Architecture**:
```typescript
interface TokenModifier {
  type: 'opacity';  // Extensible — start with opacity only
  reference: string; // Primitive token name
}

// On SemanticToken:
modifiers?: TokenModifier[];
```

**Why Option D over alternatives**:
- **vs. Dual reference (Option A)**: Modifiers preserve token identity (it's a color with a transformation, not an ambiguous composite). Modifier chain is ordered and explicit. Backward-compatible — `primitiveReferences.value` stays intact.
- **vs. Baked RGBA (Option B)**: Preserves the primitive→semantic reference chain. Doesn't introduce "magic values" that break Rosetta traceability.
- **vs. New composite primitives (Option C)**: Avoids combinatorial explosion of `color-opacity` primitive pairs.
- **vs. Option A specifically**: Extensible to future modifier types without combinatorial pattern-matching in the pipeline. Each modifier type has one transform function.

**Future extensibility**: The modifier pattern can accommodate blur, saturation, or other transformations if needed. Starting with `'opacity'` only.

### Decision 5: Sequencing

**Agreed**: This spec (073) must complete before Spec 072 (Pagination Container Styling) begins. The pagination container's dark translucent background requires scrim tokens, which require the modifier architecture.

---

## Scope

### In Scope

1. **Opacity primitive rename**: Migrate from 000–1300 naming to 000–100 value-based naming
2. **TokenModifier type definition**: Add `modifiers?: TokenModifier[]` to `SemanticToken` interface
3. **Mode-invariance field**: Add `modeInvariant?: boolean` to `SemanticToken` interface with validation rule
4. **Validator updates**: `PrimitiveReferenceValidator` must validate modifier references; `SemanticTokenValidator` must flag suspicious `modeInvariant` usage
5. **Generator updates**: DTCG and platform generators must resolve modifiers (apply opacity to color → RGBA output)
6. **Scrim semantic tokens**: Define `color.scrim.*` tokens using the new modifier pattern
7. **Semantic opacity token migration**: Update `opacity.subtle`, `.medium`, `.heavy`, `.ghost` to reference renamed primitives
8. **Test updates**: All opacity-related tests must migrate to new naming
9. **Documentation updates**: Token-Family-Opacity.md, Token-Family-Color.md (add scrim concept)

### Out of Scope

- Pagination component implementation (Spec 072)
- Progress Indicator Primitive component (separate spec)
- Additional modifier types beyond opacity
- Light/white-based scrims (future consideration for products using DesignerPunk)

---

## Key Architectural Considerations

### Backward Compatibility

The `modifiers` field is optional on `SemanticToken`. Existing tokens without modifiers work exactly as before. Code that reads `primitiveReferences.value` continues to function — modifiers are additive.

### Pipeline Resolution

When a semantic token has modifiers, the generator:
1. Resolves the base value from `primitiveReferences.value` (e.g., black500 → RGBA color)
2. Iterates through `modifiers` in array order
3. For `type: 'opacity'`: resolves the opacity primitive and replaces the alpha channel of the base color

This pattern already has precedent — the shadow generator merges color + opacity into RGBA (see `DTCGFormatGenerator.ts` shadow composition).

### Governance Annotation

Scrim tokens need a governance annotation indicating mode-invariance. The `modeInvariant?: boolean` field on `SemanticToken` (added in this spec alongside `modifiers`) expresses this structurally. The `SemanticTokenValidator` will flag suspicious usage — tokens referencing mode-aware primitives should not be marked `modeInvariant: true`. Documentation in Token-Family-Color.md will cover the scrim concept and mode-invariance rationale.

---

## Blast Radius Audit

A blast radius audit was conducted on 2026-03-06 (Thurgood). Full findings: `findings/opacity-rename-blast-radius.md`

**Key numbers**:
- 14 source files, ~132 references (functional code)
- 4 component platform files, 22 references (Container-Base, Avatar-Base)
- 9 test files, 221 references
- 5 steering docs, 108 references (3+ ballot measures)
- ~35 active files total, ~509 references

**Assessment**: Deterministic 1:1 mechanical rename. No scale changes — same 14 values, new names only. Achievable in 1-2 days with structured find-and-replace plus manual review for generators and composition parser.

**Watch items**: Composition parser regex patterns, generator string matching, shadow/glow opacity naming alignment.

---

## Open Questions — All Resolved

1. ~~**Opacity scale values**~~ **RESOLVED**: Pure rename only. Same 14 values, no scale changes. Three-digit zero-padded naming to stay consistent with the rest of the token system. (Peter, 2026-03-06)

   **Rename mapping**:
   ```
   opacity000  → opacity000  (0%)
   opacity100  → opacity008  (8%)
   opacity200  → opacity016  (16%)
   opacity300  → opacity024  (24%)
   opacity400  → opacity032  (32%)
   opacity500  → opacity040  (40%)
   opacity600  → opacity048  (48%)
   opacity700  → opacity056  (56%)
   opacity800  → opacity064  (64%)
   opacity900  → opacity072  (72%)
   opacity1000 → opacity080  (80%)
   opacity1100 → opacity088  (88%)
   opacity1200 → opacity096  (96%)
   opacity1300 → opacity100  (100%)
   ```

2. ~~**Scrim scale levels**~~ **RESOLVED**: Start with one scrim level at 80% opacity. The primary motivator is establishing the downstream infrastructure (modifier architecture, pipeline support). Additional levels added as design needs arise. (Peter, 2026-03-06)

3. ~~**Scrim naming convention**~~ **RESOLVED**: `color.scrim.standard` as the anchor point. Future levels use directional naming: `color.scrim.lighter01`, `color.scrim.lighter02` for lighter scrims; `color.scrim.darker01`, `color.scrim.darker02` for heavier scrims. This pattern scales in both directions without fixed vocabulary constraints. (Peter, 2026-03-06)

4. ~~**Migration strategy**~~ **RESOLVED**: Big-bang rename. No deprecation period or aliases. All ~509 references updated in one pass. Justified because all references are internal to the DesignerPunk codebase — no external consumers. (Peter, 2026-03-06)

---

## Open Questions for Ada — All Resolved

1. ~~**Concrete scrim token composition**~~ **RESOLVED**: Confirmed. The canonical token definition for `color.scrim.standard` is: (Ada, 2026-03-06)

   ```typescript
   'color.scrim.standard': {
     name: 'color.scrim.standard',
     primitiveReferences: { value: 'black500' },
     modifiers: [{ type: 'opacity', reference: 'opacity080' }],
     modeInvariant: true,
     category: SemanticCategory.COLOR,
     context: 'Derived from black500 at opacity080 (80%). Scrim tokens dim content regardless of theme.',
     description: 'Standard scrim for floating surfaces over content — pagination pills, dense overlays, floating toolbars.'
   }
   ```

   **Notes**:
   - `opacity080` uses the post-rename naming convention (not current `opacity1000`)
   - `modeInvariant: true` expresses mode-invariance structurally (see resolved question 2 below)
   - `context` field no longer duplicates mode-invariance annotation — expressed structurally instead
   - Resolved platform output: `rgba(0, 0, 0, 0.80)` / `UIColor(red: 0, green: 0, blue: 0, alpha: 0.80)` / `Color(0f, 0f, 0f, 0.80f)`
   - This definition serves as the reference example for all future modifier-based tokens

2. ~~**Mode-invariance: structured field vs context string**~~ **RESOLVED**: Add `modeInvariant?: boolean` to `SemanticToken` as part of 073. Lightweight addition — one optional field, defaults to `false`/`undefined`. (Ada, 2026-03-06)

   **Rationale**: Folding into 073 rather than a separate spec because we're already modifying `SemanticToken` to add `modifiers`. One more optional boolean is consistent with the existing pattern of optional fields (`platforms`, `_meta`, `modifiers`). The scrim token is the direct motivator — better to have a structured, queryable field than rely on agents parsing the `context` string.

   **Validation rule**: The `SemanticTokenValidator` should flag suspicious usage — a token referencing mode-aware primitives (e.g., `cyan300` which shifts between light/dark) should not be marked `modeInvariant: true`. This prevents misuse of the field on tokens that genuinely have mode variants.

   **MCP indexing**: The component MCP server can surface `modeInvariant` as a filterable property, but that's a downstream concern for Spec 072 or a separate MCP update — not 073's scope.

---

## Open Questions for Lina — All Resolved

1. ~~**Container-Base and Avatar-Base opacity references**~~ **RESOLVED**: No behavioral changes. All 22 references in the 4 component platform files are either semantic token name strings or comment annotations — none match on primitive token names. (Lina, 2026-03-06)

   **Detail**: Container-Base `resolveOpacityToken` functions (iOS `TokenMapping.swift`, Android `TokenMapping.kt`) match on semantic names (`"opacity.subtle"`, `"opacity.medium"`, etc.), not primitives. Primitive names (`opacity1100`, `opacity900`, etc.) appear only in comments (e.g., `// Maps to opacity1100 (0.88)`). Avatar-Base has a single hard-coded component token value (`opacityHeavy = 0.48` / `0.48f`) with a comment referencing `opacity600`. The rename is comment-only for all component files — zero functional risk.

   **Future note**: When the token generation system replaces placeholder constants with imports from generated files, generated constant names may include the primitive name (e.g., `DesignTokens.opacity_1100` → `DesignTokens.opacity_088`). This is a generator-side concern for Ada, not a current component concern.

2. ~~**Scrim token consumption pattern**~~ **RESOLVED**: Resolved RGBA output (`rgba(0, 0, 0, 0.80)`) works across all three platforms with no generator changes needed. (Lina, 2026-03-06)

   **Detail**: The existing generator pipeline already handles RGBA with embedded alpha for shadow color composition (`mergeShadowColor` in `DTCGFormatGenerator.ts`). Each platform generator has parsing for this format:
   - **Web**: `WebFormatGenerator` passes `rgba()` strings through directly as CSS custom property values.
   - **iOS**: `iOSFormatGenerator.rgbaStringToUIColor()` parses into `UIColor(red:green:blue:alpha:)`. Alpha preserved.
   - **Android**: `AndroidFormatGenerator.rgbaStringToColorArgb()` parses into Compose `Color(red, green, blue, alpha)`. Alpha preserved.

   No platform-specific output format changes required. Lina will verify the generated token constant for `color.scrim.standard` is available in platform-specific generated files when building the pagination container (Spec 072).

---

## Lina's Additional Observations

### Modifier Architecture Extensibility Governance (2026-03-06)

The `TokenModifier` pattern (Decision 4) is extensible to blur, saturation, and other transformations. This is both a strength and a risk — extensibility invites usage, and each new modifier type adds a transform function plus test coverage. Starting with `'opacity'` only is the right constraint. Recommend establishing a governance gate for adding future modifier types (similar to the data shapes trigger criteria model) to prevent ungoverned growth. This is an Ada/Peter concern, not a component concern.

### Mode-Invariance Queryability (2026-03-06)

Decision 2 establishes scrim tokens as mode-invariant — the first such semantic color tokens in the system. The proposed governance annotation via the `context` field on `SemanticToken` is sound. From a downstream consumer perspective: the component MCP server should surface mode-invariance as a queryable property so future agents don't accidentally wrap a scrim token in a mode-switching conditional. This is an infrastructure concern for Ada's token pipeline, flagged here as a consumer dependency for Spec 072.

---

## Files Affected

For the complete file-by-file breakdown of the opacity rename (35 active files, ~509 references across 6 tiers), see the blast radius audit: `findings/opacity-rename-blast-radius.md`

The following files are **new work** introduced by this spec (not covered by the rename audit):

### New Type Definitions
- `src/types/SemanticToken.ts` — Add `TokenModifier` interface and `modifiers` field

### New Semantic Tokens
- New: `src/tokens/semantic/color-scrim.ts` — `color.scrim.standard` token definition using modifier pattern

### Validator Updates
- `src/validators/PrimitiveReferenceValidator.ts` — Validate modifier references
- `src/validators/SemanticTokenValidator.ts` — Validate modifier types

### Documentation (Steering — requires ballot measure)
- `.kiro/steering/Token-Family-Opacity.md` — Full rewrite for new naming
- `.kiro/steering/Token-Family-Color.md` — Add Scrim Concept section
- `.kiro/steering/Token-Semantic-Structure.md` — Document modifier pattern
