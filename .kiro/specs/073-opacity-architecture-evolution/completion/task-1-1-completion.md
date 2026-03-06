# Task 1.1 Completion: Add TokenModifier Interface and modeInvariant Field to SemanticToken

**Date**: 2026-03-06
**Task**: 1.1 Add TokenModifier interface and modeInvariant field to SemanticToken
**Type**: Architecture
**Status**: Complete

---

## Artifacts Created

- `src/types/SemanticToken.ts` (modified) — Added `TokenModifier` interface, `modifiers` field, `modeInvariant` field
- `src/types/index.ts` (modified) — Added `TokenModifier` to barrel export

## Architecture Decisions

### 1. TokenModifier as a Separate Interface (Not Inline Type)

**Options considered:**
- (A) Inline type on the field: `modifiers?: { type: 'opacity'; reference: string }[]`
- (B) Separate exported interface: `TokenModifier`

**Chosen**: (B) — Separate interface. Validators, generators, and tests will all need to reference this type independently. An inline type would force repeated type assertions or `SemanticToken['modifiers'][number]` gymnastics.

**Trade-off**: Adds one more exported type to the public API surface. Acceptable given the type will be consumed across the pipeline.

### 2. Field Placement After primitiveReferences

**Rationale**: `modifiers` and `modeInvariant` are both value-resolution concerns. Placing them immediately after `primitiveReferences` groups all value-related fields together, before the organizational fields (`category`, `context`, `description`). This matches the mental model: "what is this token's value?" is answered by `primitiveReferences` + `modifiers`, then "what does it mean?" by `category` + `context`.

### 3. String Literal Union for type Field

`type: 'opacity'` uses a string literal type rather than an enum. This keeps the interface lightweight and avoids a new enum for a single value. When future modifier types are added (per Requirement 8 governance gate), the union expands: `type: 'opacity' | 'scale' | ...`.

**Counter-argument**: An enum would provide runtime validation. However, the validator pipeline already handles runtime checks — the TypeScript type is for compile-time safety only.

## Implementation Details

```typescript
export interface TokenModifier {
  type: 'opacity';
  reference: string;  // primitive token name
}

// Added to SemanticToken:
modifiers?: TokenModifier[];
modeInvariant?: boolean;
```

Both fields are optional, ensuring full backward compatibility — no existing token definitions require changes.

## Validation (Tier 3: Comprehensive)

### Syntax Validation
- ✅ TypeScript compilation passes (`tsc --noEmit` — zero errors)

### Functional Validation
- ✅ Full test suite passes: 290 suites, 7435 tests, 0 failures
- ✅ No existing token definitions affected (both fields optional)

### Design Validation
- ✅ `TokenModifier` interface matches design.md specification
- ✅ `modifiers` field type matches design.md (`TokenModifier[]`)
- ✅ `modeInvariant` field type matches design.md (`boolean`)
- ✅ Field placement is logical (value-resolution group)

### System Integration
- ✅ Barrel export updated — `TokenModifier` accessible via `import { TokenModifier } from './types'`
- ✅ No downstream compilation errors (validators, generators, tests all compile)

### Edge Cases
- ✅ Tokens without `modifiers` or `modeInvariant` compile and behave identically to pre-change (backward compat)
- ✅ `TokenModifier` type constrains `type` to `'opacity'` only at compile time

## Requirements Compliance

| Requirement | Status | Evidence |
|-------------|--------|----------|
| 2.1 — `modifiers` field on SemanticToken | ✅ Met | `modifiers?: TokenModifier[]` added |
| 2.2 — TokenModifier with `type` and `reference` | ✅ Met | Interface exported with both fields |
| 2.3 — Backward compatibility (no modifiers = identical) | ✅ Met | 7435 tests pass unchanged |
| 3.1 — `modeInvariant` field on SemanticToken | ✅ Met | `modeInvariant?: boolean` added |
| 3.2 — `modeInvariant: true` means identical across modes | ✅ Met | Field defined; enforcement deferred to Task 1.4 (validator) |
| 3.3 — `undefined`/`false` = existing behavior | ✅ Met | Optional field, no behavioral change when absent |

## Lessons Learned

- Clean task. The existing `SemanticToken` interface was well-structured for extension — no refactoring needed to accommodate the new fields.
- The barrel export update is easy to forget. Worth checking on every type-level change.

## Integration Points

- **Task 1.4** (validators) will consume `TokenModifier` to validate modifier references
- **Task 1.5** (generators) will read `modifiers` array during value resolution
- **Task 1.6** (scrim token) will be the first token to use both `modifiers` and `modeInvariant`
- **Task 1.8** (tests) will assert type constraints and field behavior
