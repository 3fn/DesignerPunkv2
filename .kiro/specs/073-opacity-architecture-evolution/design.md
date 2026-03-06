# Design Document: Opacity Architecture Evolution

**Date**: 2026-03-06
**Spec**: 073 - Opacity Architecture Evolution
**Status**: Design Phase
**Dependencies**: None (foundational infrastructure)

---

## Overview

This spec delivers four changes to the DesignerPunk token system:

1. Rename opacity primitives from unintuitive 000–1300 naming to self-documenting 000–100 percentage-based naming
2. Add a `modifiers` array to `SemanticToken` enabling composed tokens (color + opacity)
3. Add a `modeInvariant` boolean to `SemanticToken` for structured mode-invariance annotation
4. Define `color.scrim.standard` as the first modifier-based semantic token

All changes are additive to the `SemanticToken` interface (backward compatible). The opacity rename is a breaking change handled via big-bang migration across ~35 active files.

---

## Architecture

### SemanticToken Interface Changes

```typescript
// New type — src/types/SemanticToken.ts
interface TokenModifier {
  type: 'opacity';  // Extensible — start with opacity only
  reference: string; // Primitive token name (e.g., 'opacity080')
}

// Added to existing SemanticToken interface:
interface SemanticToken {
  // ... existing fields unchanged ...
  modifiers?: TokenModifier[];
  modeInvariant?: boolean;
}
```

Both fields are optional. Existing tokens without them behave identically to the current system.

### Generator Pipeline Resolution

When a semantic token has modifiers, the resolution pipeline extends:

```
1. Resolve base value:  primitiveReferences.value → resolved color (e.g., black500 → rgb(0,0,0))
2. For each modifier in order:
   a. If modifier type is unrecognized → throw error (fail-fast, no silent fallthrough)
   b. type: 'opacity' → resolve reference (e.g., opacity080 → 0.80)
   c. Apply: replace alpha channel of base color → rgba(0, 0, 0, 0.80)
3. Format for platform (web: rgba(), iOS: UIColor, Android: Color)
```

This extends the existing pattern in `DTCGFormatGenerator.ts` where `mergeShadowColor` already composes color + opacity into RGBA for shadow tokens.

### Opacity Rename Mapping

Deterministic 1:1 rename. No scale changes.

```
opacity000  → opacity000  (0%)      opacity700  → opacity056  (56%)
opacity100  → opacity008  (8%)      opacity800  → opacity064  (64%)
opacity200  → opacity016  (16%)     opacity900  → opacity072  (72%)
opacity300  → opacity024  (24%)     opacity1000 → opacity080  (80%)
opacity400  → opacity032  (32%)     opacity1100 → opacity088  (88%)
opacity500  → opacity040  (40%)     opacity1200 → opacity096  (96%)
opacity600  → opacity048  (48%)     opacity1300 → opacity100  (100%)
```

Shadow and glow opacity primitives follow the same pattern (e.g., `shadowOpacity1000` → `shadowOpacity080`).

---

## Components and Interfaces

### TokenModifier Interface

```typescript
interface TokenModifier {
  type: 'opacity';
  reference: string;
}
```

- `type`: Discriminated union, starting with `'opacity'` only. Future types require governance gate approval.
- `reference`: Must be a valid primitive token name in the referenced family. Validated by `PrimitiveReferenceValidator`.

### Scrim Token Definition

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

Platform output:
- Web: `rgba(0, 0, 0, 0.80)`
- iOS: `UIColor(red: 0, green: 0, blue: 0, alpha: 0.80)`
- Android: `Color(0f, 0f, 0f, 0.80f)`

### Validator Changes

**PrimitiveReferenceValidator**:
- Extend to validate `modifiers[].reference` in addition to `primitiveReferences.value`
- Verify referenced primitive exists and belongs to the correct family (opacity modifier → opacity primitive)

**SemanticTokenValidator**:
- Add rule: if `modeInvariant: true` and `primitiveReferences.value` references a mode-aware primitive, flag as warning

---

## Data Models

No new data models beyond the `TokenModifier` interface. The `SemanticToken` interface gains two optional fields. All existing token data structures remain unchanged.

---

## Error Handling

| Condition | Handler | Severity |
|-----------|---------|----------|
| Modifier references non-existent primitive | `PrimitiveReferenceValidator` | Error |
| Modifier references wrong-family primitive | `PrimitiveReferenceValidator` | Error |
| `modeInvariant: true` on mode-aware token | `SemanticTokenValidator` | Warning |
| Unknown modifier type | Generator pipeline | Error (fail-fast) |
| Modifier on token with no base value | Generator pipeline | Error |

---

## Testing Strategy

### Rename Migration Testing

- All existing opacity tests updated with new names — test suite must pass with zero failures after rename
- Full test suite run (`npm test`) serves as the primary verification that no references were missed
- A missed rename produces a silent failure (undefined token lookup), so test coverage is the safety net

### New Feature Testing

- `TokenModifier` type validation tests (Ada's domain)
- `modeInvariant` field validation tests (Ada's domain)
- Generator modifier resolution tests — verify RGBA output for each platform (Ada's domain)
- `PrimitiveReferenceValidator` modifier reference tests (Ada's domain)
- `SemanticTokenValidator` mode-invariance suspicious usage tests (Ada's domain)
- `color.scrim.standard` integration test — end-to-end from definition to platform output (Ada's domain)

### Test Governance Note

All tests listed above are token-specific (Ada's domain). Thurgood audits that they exist and pass; Ada writes them.

---

## Design Decisions

### Decision 1: Big-Bang Rename Over Deprecation

**Options considered**:
- A) Deprecation period with aliases (old names still work, warnings emitted)
- B) Big-bang rename (all references updated in one pass)

**Chosen**: B — Big-bang rename.

**Rationale**: All ~509 references are internal to the DesignerPunk codebase. No external consumers. A deprecation period adds complexity (alias mapping, warning infrastructure) for zero benefit. The rename is deterministic and the test suite catches any missed references.

**Trade-off**: If a reference is missed, it fails silently (undefined lookup). Mitigated by comprehensive test coverage.

### Decision 2: Modifier Array Over Dual Reference

**Options considered**:
- A) Dual primitive references (`primitiveReferences: { value: 'black500', opacity: 'opacity080' }`)
- B) Baked RGBA values (no primitive reference for opacity)
- C) New composite primitives (`blackAtOpacity080`)
- D) Modifier array on SemanticToken

**Chosen**: D — Modifier array.

**Rationale**: Preserves token identity (it's a color with a transformation). Extensible to future modifier types without combinatorial pattern-matching. Backward compatible — `primitiveReferences.value` unchanged. Each modifier type has one transform function in the pipeline.

**Trade-off**: More complex than dual reference for the single opacity use case. Justified by extensibility and clean separation of concerns.

### Decision 3: Structured modeInvariant Field Over Context String

**Options considered**:
- A) Free-text annotation in `context` field
- B) Structured `modeInvariant?: boolean` field

**Chosen**: B — Structured field.

**Rationale**: Machine-queryable. MCP server can expose as filterable property. Agents don't need to parse free text. Consistent with existing optional fields pattern (`platforms`, `_meta`, `modifiers`).

**Trade-off**: Adds a field to `SemanticToken` that only applies to a small number of tokens initially. Justified because the field is optional and the alternative (context string parsing) is fragile.
