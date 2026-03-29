# Task 5.1: MCP Scope Split — Leonardo Review

**Date**: 2026-03-28
**Reviewer**: Leonardo
**Draft Reviewed**: `review/task-5-1-scope-split-draft.md`
**Spec**: 086 — Component Discoverability & Metadata Infrastructure
**Verdict**: Approve with additions

---

## Requirements Coverage Check

Req 9 has 4 acceptance criteria. Here's how the draft maps:

| AC | Requirement | Draft Coverage | Status |
|----|------------|----------------|--------|
| 9.1 | Document Application MCP vs Product MCP content ownership | Scope Boundary + Content Ownership Summary tables | ✅ Covered |
| 9.2 | Document "content organization, not access control" principle | Opening section | ✅ Covered |
| 9.3 | Document readiness dependency (must be reliable before split) | Readiness Dependency section | ✅ Covered |
| 9.4 | Note experience pattern migration concern + cutover plan for 081 | Experience Pattern Migration Concern section | ✅ Covered |

The tasks.md also calls out two additional items:
- Note inline readiness as a requirement for Spec 081 → ✅ Covered (3 options listed)
- Document readiness dependency → ✅ Covered

All requirements are addressed. My review is about accuracy, completeness from the consumer perspective, and alignment with Spec 081 and the Spec 070 relationship model.

---

## Answers to Lina's Questions

### Q1: Does this boundary match how you'd naturally query?

Yes. This is exactly how I work today. When I'm specifying a screen, I query the Application MCP for component selection (`find_components`, `get_prop_guidance`, `validate_assembly`) and experience patterns (`get_experience_pattern`). The split puts component selection in one MCP and assembly guidance in another — that maps to two distinct phases of my workflow.

The one nuance: I often query `get_experience_pattern` *first* to get a starting component list, then drill into individual components via `get_component_full`. The pattern gives me the assembly; the component queries give me the details. Post-split, that's a cross-MCP workflow: Product MCP for the pattern, Application MCP for the component details. That's fine — sequential queries across MCPs are normal. But it's worth noting for Spec 081 that the most common product workflow starts in the Product MCP and immediately crosses to the Application MCP.

### Q2: Readiness dependency — which option?

**Option 3 (shared artifact)** is my preference, with a caveat.

Here's my reasoning:
- Option 1 (re-index) duplicates filesystem scanning logic. Two indexers deriving the same data from the same files is a maintenance risk — if the derivation rules change (and they will as the component catalog matures), both must update.
- Option 2 (cache at startup) creates a runtime dependency. If the Application MCP isn't running when the Product MCP starts, readiness data is unavailable. That's fragile.
- Option 3 (shared artifact) is the simplest. The Application MCP already derives readiness at index time. Export it to a JSON file. The Product MCP reads the file. No duplication, no runtime dependency.

The caveat: "shared artifact" means the Application MCP's build step must run before the Product MCP can index. That's an ordering dependency, but it's a build-time dependency (predictable, scriptable) rather than a runtime dependency (fragile). Acceptable trade-off.

HOWEVER — counter-argument: Option 3 introduces a staleness window. If a developer adds a platform implementation file and queries the Product MCP without re-running the Application MCP build, readiness data is stale. Option 2 avoids this by fetching live data. For a design system that changes infrequently (our case), staleness is low-risk. For a rapidly evolving system, Option 2 might be safer. This is a Spec 081 judgment call.

### Q3: Any product-level queries not covered after the split?

One gap I want to flag: **`validate_assembly` stays in the Application MCP** (correct — it needs the component index), but experience patterns move to the Product MCP. Today, I often do this:

1. `get_experience_pattern("settings")` → get the component tree
2. Modify the tree for my specific screen
3. `validate_assembly(modifiedTree)` → check my modifications

Post-split, step 1 is Product MCP, steps 2-3 are Application MCP. That's fine for me — I'm already making sequential queries. But platform agents who might want to validate a pattern's component tree would need to query both MCPs. The draft's access model (from Spec 070) says platform agents query Application MCP for reference — so they'd have access to `validate_assembly`. They just wouldn't have the pattern that generated the tree unless Leonardo's spec provides it. That's the current workflow anyway (platform agents get the tree from my spec, not from the MCP directly), so no actual gap.

---

## Additions Needed

### 1. Spec 081 Alignment Note

The draft should explicitly note how it relates to Spec 081's current state. Spec 081 is at design-outline stage with an activation trigger that hasn't fired (DesignerPunk must be packageable first). The scope split documented here is a *design input* to 081, not a commitment to implement on any timeline.

This matters because the draft reads like an implementation plan ("moves to Product MCP," "removes pattern/template tools"). It should be clearer that this is a boundary definition for 081 to consume when it activates.

### 2. Spec 070 Relationship Model Consistency Check

The Spec 070 MCP Relationship Model lists experience patterns and layout templates under Application MCP's "Owns" section. This scope split proposes moving them to Product MCP. That's a change to the relationship model — it should be called out explicitly as a refinement, not treated as if the relationship model already said this.

Specifically, Spec 070 says:
> Application MCP Owns: Component catalog, Component metadata, **Experience patterns**, Prop guidance, Assembly validation, **Layout templates (future — Spec 069)**

The scope split should note: "This refines the Spec 070 relationship model by moving experience patterns and layout templates from Application MCP ownership to Product MCP ownership. The rationale is [product-level concern, not component-level]. Spec 070's relationship model should be updated when Spec 081 implements the split."

### 3. What Stays vs What Moves — Explicit Criteria

The draft explains *what* moves but not the *decision criteria* for future content. When new content types are added to the Application MCP (which will happen), how do we decide whether they belong in Application MCP or Product MCP?

Proposed criteria (for Lina to validate or adjust):
- **Application MCP**: Content that describes what a component *is* and how it *works* — schemas, contracts, composition rules, selection guidance, readiness
- **Product MCP**: Content that describes how to *assemble* components into product screens — patterns, templates, screen-level guidance

The litmus test: "Does this content make sense without a product context?" If yes → Application MCP. If it assumes a product screen or user flow → Product MCP.

### 4. Documentation MCP Relationship

The draft covers Application MCP and Product MCP but doesn't mention the Docs MCP's role in the split. The Spec 070 relationship model defines a three-MCP architecture. The scope split should at minimum note that the Docs MCP is unaffected — it continues to own system knowledge (tokens, architecture, governance) and neither gains nor loses content in this split.

---

## Minor Corrections

- The Content Ownership Summary table lists "Screen specifications" under Product MCP with "✅ Owns." Screen specifications are Leonardo's output documents, not MCP-served content. They're markdown files in spec directories, not indexed by any MCP. This row should either be removed or clarified as "future — if screen specs become MCP-queryable."

---

## Summary

The scope boundary is clean and matches how I work. The readiness dependency is correctly identified. The migration concern is well-handled. The four additions above strengthen the document for Spec 081 consumption without changing the boundary itself.

The most important addition is #2 (Spec 070 consistency) — without it, there's an implicit contradiction between the relationship model and this scope split that 081 would have to resolve without context on why the change was made.
