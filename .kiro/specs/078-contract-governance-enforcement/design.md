# Design Document: Contract Governance & Enforcement

**Date**: 2026-03-13
**Spec**: 078 - Contract Governance & Enforcement
**Status**: Design Phase
**Dependencies**: None

---

## Overview

This spec implements four safeguard layers to ensure behavioral contracts are authored before implementation, use Concept Catalog names, and are integrated into the spec planning workflow:

1. **Prompt layer** — Lina's scaffolding workflow gets a contracts.yaml step; Component Development Guide gets a contracts section
2. **Process layer** — Process-Spec-Planning gets a required artifacts checklist and `_Contracts:` line mandate
3. **Automated layer** — Three tests: contract existence validation, catalog name validation, auto-discovery fix
4. **Documentation layer** — Stemma-referencing docs updated to reflect contracts as core Stemma

---

## Architecture

The safeguards operate at different points in the development lifecycle:

```
Spec Planning (Thurgood)          → Req 2: Task template requires contracts subtask + _Contracts: lines
    ↓
Component Scaffolding (Lina)      → Req 1: Prompt step for contracts.yaml authoring
    ↓
Implementation (Lina)             → _Contracts: lines on subtasks serve as checklist
    ↓
CI (npm test)                     → Req 3: Existence check
                                  → Req 4: Catalog name validation
                                  → Req 5: Auto-discovery in behavioral-contract-validation
    ↓
Reference Material (all agents)   → Req 7: CDG contracts section
                                  → Req 8: Stemma docs updated
```

No layer depends on another for enforcement. Each catches a different failure mode independently.

---

## Components and Interfaces

### New Test: Contract Existence Validation (Req 3)

**File**: `src/__tests__/stemma-system/contract-existence-validation.test.ts`

Scans `src/components/core/*/` for directories containing a `platforms/` subdirectory. For each, verifies a sibling `contracts.yaml` exists.

```typescript
// Pseudocode
const componentDirs = fs.readdirSync(COMPONENTS_DIR);
for (const dir of componentDirs) {
  const platformsPath = path.join(COMPONENTS_DIR, dir, 'platforms');
  if (fs.existsSync(platformsPath)) {
    const contractsPath = path.join(COMPONENTS_DIR, dir, 'contracts.yaml');
    expect(fs.existsSync(contractsPath)).toBe(true);
    // Error: "Component {dir} has platforms/ but no contracts.yaml"
  }
}
```

### New Test: Catalog Name Validation (Req 4)

**File**: `src/__tests__/stemma-system/contract-catalog-name-validation.test.ts`

Two-phase test:
1. Parse the Concept Catalog from `Contract-System-Reference.md` to build a set of known concepts per category
2. Scan all `contracts.yaml` files, extract contract names, split on `_` to get `{category}_{concept}`, and verify the concept exists in the catalog for that category

**Catalog parsing**: The Concept Catalog uses category headings (`### accessibility (22)`) followed by inline concept lists (`` `concept1` · `concept2` ``). The parser extracts category names from `###` headings and concept names from backtick-delimited strings.

**Note**: Ada's R1 feedback assumed a table format (`| category | concept | description |`), but the actual catalog format is category headings with inline concept lists. The parser must handle this format.

**Structural assertion** (Req 4 AC 4): Before validating names, assert:
- The catalog has exactly 10 category headings
- The total concept count >= 112 (baseline floor, rises as concepts are added)
- If either assertion fails, the test fails with a format-change error before attempting name validation

**Contract name splitting**: Contract names in `contracts.yaml` follow `{category}_{concept}` format. The category is the first segment before `_`. The concept is everything after the first `_`. Example: `interaction_hover` → category `interaction`, concept `hover`. Example: `accessibility_reduced_motion` → category `accessibility`, concept `reduced_motion`.

**Error format** (Req 4 AC 2): `"Component Nav-SegmentedChoice-Base: contract 'interaction_noop_active' has unrecognized concept 'noop_active' in category 'interaction'"`

### Modified Test: Behavioral Contract Validation Auto-Discovery (Req 5)

**File**: `src/__tests__/stemma-system/behavioral-contract-validation.test.ts`

**Current** (line ~68):
```typescript
const COMPONENTS = [
  'Input-Text-Base',
  'Input-Text-Email',
  // ... 7 hard-coded entries
];
```

**Changed to**:
```typescript
const COMPONENTS = fs.readdirSync(COMPONENTS_DIR).filter(dir => {
  const contractsPath = path.join(COMPONENTS_DIR, dir, 'contracts.yaml');
  return fs.existsSync(contractsPath);
});
```

No other changes to the test logic. The existing validation (cross-platform contract consistency) applies to all discovered components.

### Steering Doc Changes

**Lina's prompt** (Req 1): Add Step 3 between types.ts and platform implementation. Exact text in design-outline.md § "Option A".

**Process-Spec-Planning.md** (Req 2): Two additions:
1. "Required Artifacts for Component Specs" checklist: `contracts.yaml`, `component-meta.yaml`, `schema/`, `types.ts`
2. Implementation subtask template note: every platform implementation subtask must include `_Contracts:` lines mapping to satisfied contracts

**Component-Development-Guide.md** (Req 7): New "Behavioral Contracts Workflow" section covering: when to author, `{category}_{concept}` naming, Concept Catalog consultation via MCP, relationship to platform implementation.

**Stemma docs** (Req 8): Scan + targeted updates. Critical: `Rosetta-Stemma-Systems-Overview.md`, `Component-Primitive-vs-Semantic-Philosophy.md`. Others identified by scan.

---

## Data Models

No new data models. The existing `contracts.yaml` format and `Contract-System-Reference.md` Concept Catalog are unchanged. The tests consume these existing formats.

---

## Error Handling

### Catalog Name Validation — Edge Cases

1. **Contract name with no underscore**: Invalid format. Test fails with: `"Contract '{name}' does not follow {category}_{concept} format"`
2. **Category not in catalog**: Test fails with: `"Contract '{name}' has unrecognized category '{category}'"`
3. **Concept not in category**: Test fails with the standard error format (Req 4 AC 2)
4. **Empty contracts.yaml**: Valid — a component may have an empty contracts file during scaffolding. The existence check (Req 3) passes; the name validation (Req 4) has nothing to validate.
5. **Catalog format change**: Structural assertion (Req 4 AC 4) fails before name validation runs, with a clear message about expected format.

### Existence Check — Edge Cases

1. **Component with platforms/ but only placeholders**: Test flags it. Correct behavior — prompts contracts authoring during scaffolding (confirmed by Lina R1).
2. **Component with contracts.yaml but no platforms/**: Not flagged. The test only checks the direction "has platforms → must have contracts."

---

## Testing Strategy

| Test | File | What it validates | Req |
|------|------|-------------------|-----|
| Contract existence | `contract-existence-validation.test.ts` | Every component with `platforms/` has `contracts.yaml` | 3 |
| Catalog name validation | `contract-catalog-name-validation.test.ts` | All contract concepts exist in Concept Catalog | 4 |
| Catalog structural assertion | (same file) | Catalog has 10 categories, >= 112 concepts | 4 |
| Auto-discovery | `behavioral-contract-validation.test.ts` (modified) | Components discovered from filesystem, not hard-coded | 5 |

All tests run in `npm test`. No performance tests needed.

The one-time audit (Req 6) is a manual task, not an automated test. Lina scans existing contracts.yaml files against the catalog; Thurgood reviews classifications. Results feed into catalog updates and/or contract renames before Req 4 test is enabled.

---

## Design Decisions

### Decision 1: Separate Test Files for Existence and Name Validation

**Options Considered**: (a) One combined test file, (b) Two separate files, (c) Add to existing behavioral-contract-validation.test.ts
**Decision**: Two separate files
**Rationale**: Existence check and name validation are independent concerns. A component can exist without valid names (Req 3 passes, Req 4 fails). Separate files make failures immediately identifiable and keep each test focused.
**Trade-offs**: Three test files touching contracts instead of one. Acceptable given they test different things.

### Decision 2: Parse Markdown Directly, No Machine-Readable Extraction

**Options Considered**: (a) Parse Contract-System-Reference.md markdown, (b) Extract catalog to YAML/JSON
**Decision**: Parse markdown directly
**Rationale**: Process-first principle. One consumer (the validation test) doesn't justify a second source of truth. Structural assertion catches format drift. Extraction triggered when a second consumer needs to parse the catalog programmatically.
**Trade-offs**: Fragile coupling to markdown format. Mitigated by structural assertion that fails loudly on format changes.

### Decision 3: Errors, Not Warnings, for Non-Catalog Names

**Options Considered**: (a) Errors that fail the test, (b) Warnings that log but pass
**Decision**: Errors
**Rationale**: Both legitimate new concepts and naming mistakes require resolution. Errors enforce that resolution happens before implementation proceeds. The ballot measure dependency (author → propose → Peter approves → catalog updated → test passes) is acceptable because catalog additions are additive and fast to approve. Monitor for friction after 2-3 components.
**Trade-offs**: Creates a workflow dependency on Peter's availability for ballot measure approval. Escape valve: if friction is observed, consider a `--pending-catalog` mechanism or batch approval process.

### Decision 4: Scan as Deliverable for Stemma Doc Updates

**Options Considered**: (a) Bounded list of docs to update, (b) Open-ended "update where appropriate", (c) Scan produces list, updates are individual ballot measures
**Decision**: Option (c) — scan as deliverable
**Rationale**: The scan is bounded and completable. The updates are individually scoped as ballot measures, each with its own review. This prevents an unbounded audit while ensuring nothing is missed.
**Trade-offs**: Multiple small ballot measures instead of one large update. Acceptable — each doc change is reviewed on its own merits.

### Decision 5: Lina Performs Audit, Thurgood Reviews

**Options Considered**: (a) Thurgood performs audit, (b) Lina performs audit, (c) Automated audit
**Decision**: Lina performs, Thurgood reviews
**Rationale**: Lina has Stemma domain knowledge to classify whether a non-catalog name is a legitimate new concept or a naming mistake. Thurgood reviews the classification decisions for governance consistency. The audit is a one-time task; the automated test (Req 4) maintains it going forward.
**Trade-offs**: Cross-agent coordination for a one-time task. Acceptable given the bounded scope.
