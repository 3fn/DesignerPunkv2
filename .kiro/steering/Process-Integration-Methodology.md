---
inclusion: manual
---

# Integration Methodology

**Date**: 2026-02-25
**Purpose**: Repeatable methodology for building 3rd-party integrations in DesignerPunk
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: architecture, integrations
**Status**: DRAFT — Hypothesis based on DTCG and agentic UI work. Refine after additional implementations.

---

## Scope

This methodology applies to **3rd-party integrations without explicit install** — integrations with external tools, protocols, or services that DesignerPunk connects to via API, protocol, or generated output, where the other side can change independently.

Examples this applies to:
- DTCG → Figma token sync
- Component catalog schema → A2UI renderer
- Future protocol integrations (design tools, agentic UI protocols, IDE tooling)

Examples this does NOT apply to:
- npm dependencies installed and controlled within the project
- Internal subsystem integrations where both sides are in the same codebase
- One-off scripts or utilities with no external consumer

The distinction: when you don't control both sides, coupling is a liability. When you do, the indirection layer may be over-engineering.

---

## The Core Pattern

Never build an integration directly against your internal representation. Always intermediate with a schema layer.

```
Internal System → Canonical Schema → Integration Transformer → External Tool/Protocol
```

This keeps integrations decoupled from internals, makes the system extensible without rearchitecting, and provides a clear place to validate correctness. The schema is the stable contract; integrations are transformers on top of it.

**Precedents in DesignerPunk:**
- Rosetta token system → DTCG JSON schema → Figma token sync
- Stemma component catalog → Component metadata schema → A2UI renderer (in progress)

---

## Methodology Steps

### Step 1: Research Standards and Best Practices

Before designing a schema, research whether a relevant standard already exists.

- Search for ratified or widely-adopted standards in the integration domain
- Evaluate whether conforming to an existing standard is preferable to inventing a new schema
- Document what was found, what was considered, and why the chosen approach was selected
- Aligning with an existing standard reduces maintenance burden and increases interoperability

The DTCG decision was sound partly because DTCG was a ratified standard — conforming to it rather than inventing a proprietary schema was the right call. That research step is what surfaces those opportunities.

### Step 2: Define the Canonical Schema

Design a tool-agnostic, internal schema that captures the system's knowledge in structured, machine-readable form.

- The schema should be expressive enough to satisfy the known integration target(s)
- The schema should not be coupled to any specific external tool's format
- Structural parts should be derivable from the system's source of truth (generated, not manually maintained)
- Semantic parts that require human judgment should be captured as annotations in the source definitions

### Step 3: Validate Against a Real Integration Target

Use a specific, real integration target as the validation proof-of-concept for the schema's expressiveness.

- If the schema can produce valid output for the target, it's likely expressive enough for other integrations
- If it can't, the schema needs refinement before building additional integrations
- The validation target should be chosen for its representativeness, not just convenience

### Step 4: Build the Integration as a Transformer

Implement the integration as a transformer that reads the canonical schema and produces the target format.

- The transformer should have no knowledge of DesignerPunk internals — only the schema
- The transformer is the thing that changes when the external tool changes, not the schema
- Each integration target gets its own transformer

### Step 5: Governance Gate

Before shipping, confirm:
- The schema is documented and versioned
- The transformer is tested against the schema (not against internals)
- The integration target's format is documented with a reference to the version tested against
- A human has reviewed and approved the schema (not just the transformer)

---

## Schema Design Principles

- **Tool-agnostic**: The schema should not assume any specific consumer
- **Generated where possible**: Structural facts should be derived from source definitions, not maintained separately
- **Human-annotated for semantics**: Contextual meaning that can't be inferred from code requires explicit human authorship
- **Versioned**: Schema changes should be tracked; breaking changes require explicit versioning
- **Validated**: The schema should have tests that verify it accurately represents the system

---

## Counter-Arguments to This Methodology

**"The indirection layer adds complexity for simple integrations."**
Agreed — which is why this methodology is scoped to 3rd-party integrations without explicit install. For integrations you control on both sides, direct coupling is fine.

**"Standards research slows down development."**
The cost of building against a non-standard schema and then discovering a better standard exists is higher than the research cost. One day of research can prevent months of migration work.

**"The schema will need to change as the system evolves."**
Yes. That's why it's versioned and why the governance gate exists. Schema evolution is manageable; tight coupling to external tools is not.

---

## Known Limitations of This Draft

This methodology is based on two implementations (DTCG and agentic UI). It should be treated as a hypothesis until validated against additional integrations. Specific areas likely to need refinement:

- The right granularity for schema versioning
- How to handle breaking changes in external tool formats
- Whether the governance gate needs more structure as the team grows
- Edge cases for integrations that are partially 3rd-party (e.g., tools with both installed and protocol-based components)

**Planned refinement trigger**: After the A2UI renderer bridge is complete and at least one additional integration is built, revisit this document with lessons learned.

---

## Related Documentation

- `.kiro/docs/agentic-ui-strategy.md` — Strategic context for the agentic UI integration
- `.kiro/steering/DTCG-Integration-Guide.md` — DTCG format specification (first implementation)
- `.kiro/steering/Figma-Workflow-Guide.md` — Figma integration workflow (first integration transformer)
