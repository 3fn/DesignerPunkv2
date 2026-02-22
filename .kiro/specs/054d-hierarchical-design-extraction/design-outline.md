# Design Outline: Component Analysis Extraction

**Date**: 2026-02-22
**Status**: Conceptual Direction
**Context**: Evolved from Progress/Pagination COMPONENT_SET investigation
**Relevant Contexts**: Spec 054a, Spec 054b, Spec 054c

---

## Problem Statement

The Figma design extraction pipeline currently produces a "design-outline" — a flat, single-component document that maps one Figma node to one output. This works for leaf components but breaks down for composed components and multi-component specs.

The core issues:

1. **Single-component scope**: The pipeline extracts one Figma node at a time. A spec that covers Progress/Pagination, Progress Indicator Primitive, and Connector has no way to capture all three in a unified analysis.

2. **Flat token output**: Token matches are dumped into a flat table with no indication of which node they belong to. A composed component's parent spacing, child spacing, and grandchild color bindings all land in the same undifferentiated list.

3. **No classification of extracted data**: Every token match is treated equally. There's no distinction between "this is a known semantic token," "this matched a primitive but has no semantic," and "we couldn't identify this at all."

4. **Design-outline conflates extraction with specification**: The current design-outline tries to be both "what did Figma tell us" and "what should we build." These are different concerns that should be separated.

---

## Proposed Change: From Design-Outline to Component Analysis

### The Concept

Introduce a **component analysis** as an intermediate artifact between Figma extraction and the design-outline. The component analysis is purely descriptive — it captures what was found, categorized by identification confidence. The design-outline remains the human-authored specification artifact, now informed by one or more component analyses.

### Information Flow

```
Current:  Figma Node → Design-Outline → Spec
Proposed: Figma Node(s) → Component Analysis (per component) → Review → Design-Outline → Spec
```

The key shift: a design-outline can be informed by multiple component analyses. A Progress/Pagination spec would have analyses for the Pagination container, the Progress Indicator Primitive, and potentially the Connector — all feeding into one design-outline.

---

## Three-Tier Classification

Every extracted detail falls into one of three categories:

### Semantic Identified
Token matches where both the semantic token and its primitive reference are known and confirmed.

Example: `padding-top` → `semanticSpace.inset.075` (primitive: `space.space075`) ✅

These are ready to use. No human intervention needed unless the semantic mapping is wrong for the context.

### Primitive Identified
Token matches where a primitive token was found but no semantic token exists or the semantic mapping is uncertain.

Example: Child `padding` = 2 → matches `space.space025` but no semantic token covers "child instance inset padding."

These are opportunities. A primitive match with no semantic could indicate:
- A missing semantic token that should be created
- A value that's intentionally primitive (no semantic intent)
- A candidate for a new component token

### Unidentified
Values extracted from Figma that couldn't be matched to any known token — primitive or semantic.

Example: `boundVariable: VariableID:1224:14083` that isn't in the token values response and can't be resolved via Plugin API.

These are flags for human review. They might indicate:
- Figma variables not yet mapped to the token system
- Design values that exist outside the token system
- Extraction pipeline gaps that need fixing

---

## Multi-Component Scope

A single component analysis captures one Figma component's full tree. But a spec can reference multiple analyses.

### Example: Progress/Pagination Spec

The spec scope includes three components:

1. **Progress/Pagination** (COMPONENT_SET) — The composed container
   - Component analysis captures: layout, spacing, composition pattern (5× child instances), variant definitions (Sm/Md/Lg)

2. **Progress Indicator Primitive** (COMPONENT) — The repeated child
   - Component analysis captures: states (Incomplete, Current), sizes (Sm, Md, Lg), color bindings per state, Show Label toggle

3. **Connector** (if applicable) — The element between indicators
   - Component analysis captures: whatever tokens/properties it carries

Each gets its own analysis. The design-outline then synthesizes all three into a coherent component specification.

### Why This Matters

With the current pipeline, extracting Progress/Pagination gives you the parent's black fill and spacing but misses the children's white/cyan fills, their state properties, and their internal padding. You'd have to run separate extractions for Progress Indicator Primitive and manually stitch the results together.

With component analyses, each extraction is self-contained and complete. The design-outline author (human or AI) has the full picture across all components in scope.

---

## Hierarchical Extraction Within Each Analysis

Each component analysis preserves the full node tree from Figma. This is the technical extraction improvement from the original 054d investigation — it's still needed, but now it feeds into component analyses rather than directly into design-outlines.

### What the Tree Captures

Using Progress/Pagination "Property 1=Sm" variant as example:

```
COMPONENT "Property 1=Sm" (1230:99)
│  Layout: HORIZONTAL, padding: 6/6/6/6, itemSpacing: 4, cornerRadius: 50
│  Fill: black @ 0.8 opacity (unbound)
│  Tokens: [Semantic] padding → semanticSpace.inset.075, itemSpacing → semanticSpace.grouped.tight
│
├─ INSTANCE "Progress Indicator Primitive" × 4 (State=Incomplete, Size=Sm)
│  │  Layout: HORIZONTAL, padding: 2/2/2/2
│  │  Tokens: [Primitive] padding → space.space025 (no semantic)
│  │  Properties: Show Label=false, State=Incomplete, Size=Sm
│  │
│  └─ FRAME "Node"
│     Fill: white (r:1,g:1,b:1) — boundVariable: VariableID:1224:14083
│     Tokens: [Unidentified] fill → VariableID:1224:14083 (not in token values)
│     cornerRadius: 50
│
└─ INSTANCE "Progress Indicator Primitive" × 1 (State=Current, Size=Sm)
   │  Layout: HORIZONTAL, padding: (not specified — differs from siblings)
   │  Properties: Show Label=false, State=Current, Size=Sm
   │
   └─ FRAME "Node"
      Fill: cyan (r:0,g:0.94,b:1) — boundVariable: VariableID:1224:14345
      Tokens: [Unidentified] fill → VariableID:1224:14345 (not in token values)
      cornerRadius: 50
```

Each node carries its own token classification. The tree structure shows composition. Repeated instances are grouped with counts and their property differences called out.

---

## What This Changes in the Pipeline

### New: Component Analysis Output

The extraction pipeline produces a `ComponentAnalysis` instead of (or in addition to) a `DesignOutline`. The analysis contains:

- **Component identity**: Name, type, Figma ID, variant definitions
- **Node tree**: Hierarchical structure with token usage per node
- **Three-tier classification**: Every extracted value categorized as Semantic, Primitive, or Unidentified
- **Composition patterns**: Grouped repeated instances with property variations
- **Unresolved bindings**: List of Figma variable IDs that couldn't be resolved

### Changed: Design-Outline Becomes a Synthesis

The design-outline is no longer auto-generated from a single extraction. It's authored (by human or AI) using one or more component analyses as input. The design-outline retains its current sections (variants, states, token usage, accessibility, contracts) but is now informed by richer, multi-component data.

### Preserved: Existing Flat Output

For backward compatibility, the existing flat `TokenUsage` and `DesignOutline` interfaces remain. Simple leaf components that don't need the full analysis can still use the current pipeline. The component analysis is an addition, not a replacement.

---

## Relationship to Existing Investigation

The original 054d design-outline documented real extraction bugs that still need fixing regardless of this architectural shift:

| Finding | Still Relevant? | Where It Fits |
|---------|----------------|---------------|
| `componentPropertyDefinitions` vs `variantProperties` field mismatch | Yes | Extraction fix — feeds into component analysis |
| Children's `componentProperties` not walked | Yes | Tree extraction — each node's properties captured |
| Deep fills not collected from grandchild FRAME nodes | Yes | Tree extraction — fills at every depth |
| Bound variable IDs not in `figma_get_token_values` | Yes | Unidentified tier — flagged for resolution |
| `resolveUnknownVariableIds` partial fix | Yes | Resolution step before classification |
| Flat `TokenUsage` losing node context | Yes | Solved by tree structure in component analysis |

The technical extraction work is the same. The difference is what it produces and how it's consumed.

---

## Resolved Decisions

### 1. Analysis Format: Dual Output (JSON + Markdown)

The component analysis produces two files per component:

- **JSON** (`{component-name}-analysis.json`): The structured extraction data — node tree, token matches with classifications, composition patterns, unresolved bindings. This is the machine-readable source of truth.
- **Markdown** (`{component-name}-analysis.md`): The human-readable analysis layer — summaries, classification breakdowns, observations, and decision points. Generated from or alongside the JSON, not independently authored.

The JSON is authoritative. The Markdown references and interprets it. If they drift, the JSON wins.

### 2. Analysis Storage: Spec Directory with Dedicated Subdirectory

Component analyses live in `.kiro/specs/[spec-name]/analysis/`, paralleling the existing `.kiro/specs/[spec-name]/completion/` pattern.

```
.kiro/specs/054d-hierarchical-design-extraction/
├── design-outline.md
├── requirements.md
├── analysis/
│   ├── progress-pagination-analysis.json
│   ├── progress-pagination-analysis.md
│   ├── progress-indicator-primitive-analysis.json
│   └── progress-indicator-primitive-analysis.md
└── completion/
    └── ...
```

Each component in scope gets its own JSON + Markdown pair. Discoverable, consistent with existing organization patterns.

### 3. Automation Boundary: Human-AI Collaborative

- **Fully automated**: Figma extraction → JSON data → three-tier classification → composition detection
- **AI-assisted, human-directed**: Markdown analysis generation, design-outline drafting, scope recommendations
- **Human-owned**: Final design-outline decisions, semantic token creation decisions, scope confirmation

The extraction and classification is mechanical. The synthesis into a design-outline is where human judgment and AI collaboration meet — Ada and Lina can help draft, but Peter makes the calls on what matters and what doesn't.

### 4. Scope Declaration: Human-Driven with Analysis-Surfaced Dependencies

Scope is declared by the human (Peter), not by the pipeline. A spec's scope can include components and/or tokens — the analysis artifact works for both. A component analysis captures a Figma component's tree and token usage. A token analysis could capture how a specific primitive or semantic token is used, where it appears, and whether it needs new semantics or component-level references.

The workflow:

1. Peter generates analyses for one or more Figma components and/or tokens
2. The analysis naturally surfaces dependencies — e.g., extracting Progress/Pagination reveals 5× Progress Indicator Primitive instances with unresolved bindings, or a token analysis reveals a primitive used across multiple components without a semantic
3. The analysis flags these as potential scope additions: "This component depends on Progress Indicator Primitive — consider including it in scope" or "This primitive appears in 4 components without a semantic — consider creating one"
4. Peter decides whether to add it, ignore it, or defer it
5. AI agents may note when scope feels too expansive, but the decision is Peter's

This keeps scope declaration lightweight and organic rather than requiring upfront formal declarations. The analysis does the discovery work; the human makes the judgment calls.

---

## What Needs to Change (Summary)

1. **New data model**: `ComponentAnalysis` type with hierarchical node tree, three-tier classification, and composition patterns
2. **Extraction pipeline update**: Walk the full Figma node tree, classify each extracted value, preserve node context
3. **Bound variable resolution**: Batch-resolve unknown variable IDs, classify failures as Unidentified
4. **Analysis output**: Generate component analysis documents (format TBD)
5. **Design-outline evolution**: Update the design-outline to reference component analyses rather than being the direct extraction output
6. **Multi-component support**: Allow specs to declare multiple components in scope, each with its own analysis

This is the scope for spec 054d.
