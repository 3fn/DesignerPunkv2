# Contract Governance & Enforcement

**Date**: 2026-03-13
**Purpose**: Ensure behavioral contracts are authored before implementation and aligned with the Concept Catalog
**Organization**: spec-guide
**Scope**: 078-contract-governance-enforcement
**Status**: Design outline — open questions unresolved

---

## Problem Statement

During Spec 049 (Nav-SegmentedChoice-Base) Task 3, Lina implemented the Web Component (Task 3.1) without first authoring `contracts.yaml`. The behavioral contracts — which define what the component *must* do — were written after the implementation, inverting the specification-then-implementation relationship. Additionally, the initial contracts used invented names rather than drawing from the Contract-System-Reference Concept Catalog (112 concepts, 10 categories).

This is not an isolated knowledge gap. Lina's prompt includes the Contract-System-Reference as a skill, and she has worked with contracts.yaml on other components. The root causes are structural:

1. **Lina's scaffolding workflow has no dedicated step for contracts.yaml.** The file appears in a directory listing (Step 3) but has no authoring step with instructions. Compare: `component-meta.yaml` has Step 5 with explicit guidance. `contracts.yaml` has nothing.

2. **The task plan (authored by Thurgood) didn't include a contracts.yaml subtask.** Schema.yaml (Task 2.3) and component-meta.yaml (Task 2.2) were explicit subtasks. Contracts.yaml was assumed, not specified.

3. **No automated check verifies contracts exist or use catalog names.** The component MCP server indexes schemas and validates component-meta, but has no awareness of contracts.yaml.

The result: implementation preceded specification, and when specification was written retroactively, it didn't align with the established naming system. Both issues were caught by Peter during review, not by any automated or process safeguard.

### Impact

- Contracts written after implementation describe what was built, not what should be built. They become documentation rather than specification.
- Non-catalog contract names break cross-component searchability. An agent searching for "all components with hover contracts" won't find `interaction_hover_inactive` when the catalog concept is `interaction_hover`.
- The correction required a dedicated task (3.1.CORRECTION), adding overhead and creating a visible process gap in the task history.

### Secondary Finding: Contract References in Task Plans

Discovered during Spec 049 Task 4.1 (iOS implementation): even after contracts.yaml was authored and the web subtasks were updated with `_Contracts:` lines, the iOS and Android subtasks in the same spec had no contract references. The contracts existed, the implementation satisfied them, but:

- The task plan didn't map subtasks to contracts, so the implementer had no checklist
- The completion docs didn't track contract coverage
- The gap was only caught when Peter asked "should any of these use contracts?"

This is a distinct failure from "contracts not authored" — it's "contracts not integrated into the workflow." The file exists but isn't used as a specification tool across all platform subtasks. Thurgood added `_Contracts:` lines to web subtasks after the 3.1.CORRECTION but didn't propagate to iOS/Android subtasks in the same task plan.

---

## Root Cause Analysis

| Cause | Layer | Who Owns It |
|-------|-------|-------------|
| No scaffolding step for contracts.yaml | Agent prompt | Peter (prompt authoring) |
| No task template requirement for contracts.yaml | Spec planning process | Thurgood (spec formalization) |
| No automated validation of contracts existence | Tooling | Ada or Lina (MCP/test infrastructure) |
| No automated validation of catalog name alignment | Tooling | Ada or Lina (MCP/test infrastructure) |
| Agent didn't consult Concept Catalog before authoring | Agent discipline | Lina (self-monitoring) |
| Implementation subtasks don't reference contracts | Spec planning process | Thurgood (task plan authoring) |
| Contract coverage not tracked in completion docs | Agent discipline | Lina (completion documentation) |

---

## Options

### Option A: Prompt Fix Only

Add a dedicated scaffolding step to Lina's prompt between types.ts (Step 2) and platform implementations (Step 3):

```
### Step 3: Author contracts.yaml
Define behavioral contracts using the Contract-System-Reference Concept Catalog.
All contract names must follow {category}_{concept} naming from the catalog.
Query the catalog via MCP before authoring:
  get_section({ path: ".kiro/steering/Contract-System-Reference.md", heading: "Concept Catalog" })
Contracts must be authored BEFORE platform implementation begins.
```

Renumber existing Steps 3–6 to 4–7.

**Pros:**
- Minimal effort (~5 minutes)
- Directly addresses the "no step" root cause
- Makes contracts a first-class workflow artifact

**Cons:**
- Relies on agent compliance — no enforcement mechanism
- Doesn't address Thurgood's task planning gap
- Doesn't catch catalog naming drift
- A future agent (or Lina in a new context window) could still skip it

### Option B: Prompt Fix + Task Template Enforcement

Option A, plus update the spec planning process so that any spec creating a new component requires a contracts.yaml subtask in the scaffolding parent task.

This would be a note in Thurgood's spec planning standards (Process-Spec-Planning.md) or a checklist item in the task template.

**Pros:**
- Addresses both root causes (prompt + task planning)
- Low effort (prompt change + steering doc update)
- Two independent safeguards — if one is missed, the other catches it

**Cons:**
- Still relies on agent compliance at two points
- No automated enforcement
- Steering doc update requires ballot measure

### Option C: Prompt Fix + Automated Validation

Option A, plus automated checks:

1. **Existence check**: A test (or component MCP health check) that verifies every component directory with `platforms/` also has `contracts.yaml`. Similar to how the demo-system test caught the missing demo file.

2. **Catalog name validation**: A test that reads each `contracts.yaml`, extracts contract names, and verifies each name's concept portion exists in the Concept Catalog. Non-catalog names produce a warning (not a failure — new concepts are legitimate, but should be flagged for review).

**Pros:**
- Automated — catches drift regardless of agent discipline
- The existence check would have caught the 049 gap immediately
- The name validation would have flagged the invented names
- Consistent with existing patterns (demo-system test, MCP health checks)

**Cons:**
- More implementation effort (new test suite or MCP extension)
- The Concept Catalog is in a steering doc (markdown), not structured data — parsing it for validation requires either extracting it to a machine-readable format or parsing the markdown
- Name validation needs to distinguish "legitimately new concept" from "invented name that should use catalog" — this is a judgment call that's hard to automate

### Option D: All Three (Prompt + Task Template + Automated) ← Recommended

Layer all three safeguards:

1. **Prompt fix** — makes contracts a first-class scaffolding step (prevents the "I didn't think about it" failure)
2. **Task template enforcement** — makes contracts a required subtask in spec planning (prevents the "it wasn't in the plan" failure)
3. **Automated validation** — catches drift when both process safeguards fail (prevents the "it slipped through" failure)

**Pros:**
- Defense in depth — three independent layers
- Each layer is low-to-moderate effort individually
- Matches the project's existing pattern of process + automation

**Cons:**
- Most total effort
- Risk of over-engineering for a problem that may not recur after the prompt fix
- The automated catalog name validation is the hardest piece and may not justify its cost if the prompt fix is sufficient

---

## Open Questions

1. **Is the prompt fix alone sufficient?** The root cause was a missing workflow step. Adding the step might be enough. The catalog naming issue is secondary — it's about consulting a reference, which the step would instruct. Counter-argument: the demo-system test proves that automated checks catch things agents miss, even when the knowledge is available.

2. **Should the Concept Catalog be extracted to a machine-readable format?** Currently it's a markdown list in a steering doc. Automated validation would need to parse it. Extracting to YAML or JSON would make validation trivial but creates a second source of truth. Alternatively, the validation could parse the markdown directly (fragile but avoids duplication).

3. **Where does the existence check live?** Options: (a) a new test file in the component test infrastructure, (b) a component MCP health check extension, (c) a pre-commit hook. The demo-system test pattern (property-based test that scans directories) is the closest precedent.

4. **Should non-catalog names be errors or warnings?** New concepts are legitimate (Nav-SegmentedChoice-Base introduced `interaction_noop_active` and `animation_initial_render`). Hard failures would block legitimate new concepts. Warnings with a "confirm this is intentional" gate might be the right balance.

5. **Does Thurgood's task planning process need a formal checklist?** Or is a note in Process-Spec-Planning.md sufficient? The current spec planning standards don't have a "required artifacts per component" checklist.

6. **Should every implementation subtask require `_Contracts:` lines?** The web subtasks got them after the 3.1.CORRECTION, but iOS/Android subtasks in the same spec didn't. This suggests the task template should mandate that every implementation subtask maps to the contracts it satisfies — not just that contracts.yaml exists as a scaffolding artifact. This is the difference between "contracts exist" and "contracts are used as a specification tool."

---

## Dependencies

- **Contract-System-Reference.md** — the Concept Catalog that names must align with
- **Lina's prompt** (`lina-prompt.md`) — the scaffolding workflow that needs the new step
- **Process-Spec-Planning.md** — Thurgood's spec planning standards (if Option B/D)
- **Component MCP server** — if automated validation is added as a health check (Option C/D)

---

## Origin

- Discovered: Spec 049, Task 3.1 — Lina implemented Web Component without contracts.yaml
- Corrected: Spec 049, Task 3.1.CORRECTION — contracts authored retroactively, then reworked for catalog alignment
- Peter identified the gap during review and requested this spec
