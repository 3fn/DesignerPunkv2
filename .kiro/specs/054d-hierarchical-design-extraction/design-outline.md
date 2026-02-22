# Design Outline: Component Analysis Extraction

**Date**: 2026-02-22
**Status**: Conceptual Direction
**Context**: Evolved from Progress/Pagination COMPONENT_SET investigation
**Relevant Contexts**: Spec 054a, Spec 054b, Spec 054c

---

## Current State

The Figma design extraction pipeline (Spec 054b) reads Figma components and auto-generates `design-outline.md` documents with:

- Token translation via `TokenTranslator` (binding-first, value-fallback matching)
- Variant mapping recommendations via `VariantAnalyzer` (Option A vs B with rationale)
- Component token suggestions via `detectComponentTokenDecisions` (illustrative suggestions for repeated primitive usage)
- Behavioral contract detection (interactive vs static classification)
- Platform parity detection (web-only interaction flags)
- Mode validation (light/dark discrepancy detection)
- Confidence flags (✅ exact, ⚠️ approximate, ❌ no-match)

**What works:**
- The extraction pipeline already gets hierarchical node tree data from Figma (COMPONENT_SET → COMPONENT → INSTANCE → FRAME with all properties, bindings, and fills at every depth)
- Token translation with confidence flags is solid
- Variant analysis with Component-Family doc queries provides valuable context

**What's broken:**
- The design-outline output is **flat** — token matches lose node context (which node did this token come from?)
- The design-outline is **auto-generated** — it conflates extraction (what Figma has) with specification (what code should be)
- The design-outline is **single-component** — composed components with multiple child instances can't be analyzed together
- Recommendations are **mixed with data** — variant mapping suggestions and component token ideas are presented alongside raw extraction data, creating confirmation bias risk

---

## Problem Statement

The core issues:

1. **Flat token output loses node context**: Token matches are dumped into a flat table with no indication of which node they belong to. A composed component's parent spacing, child spacing, and grandchild color bindings all land in the same undifferentiated list.

2. **No classification of extracted data**: Every token match is treated equally. There's no distinction between "this is a known semantic token," "this matched a primitive but has no semantic," and "we couldn't identify this at all."

3. **Design-outline conflates extraction with specification**: The current auto-generated design-outline tries to be both "what did Figma tell us" and "what should we build." These are different concerns that should be separated.

4. **Single-component scope**: The pipeline extracts one Figma node at a time. A spec that covers Progress/Pagination, Progress Indicator Primitive, and Connector has no way to capture all three in a unified analysis.

5. **Figma structure ≠ code structure**: The extraction assumes Figma component structure maps to optimal code structure, but designers often structure components for visual convenience, not code architecture. Recommendations based on Figma structure can create confirmation bias.

---

## Proposed Change: Component Analysis as Descriptive Artifact

### The Concept

Introduce a **component analysis** as a purely descriptive artifact that replaces the auto-generated design-outline. The component analysis captures what was found in Figma, categorized by identification confidence, with hierarchical node context preserved.

**The design-outline becomes a human-authored specification document** created AFTER reviewing one or more component analyses. It's no longer auto-generated.

### Information Flow

```
Current:  Figma Node → Auto-Generated Design-Outline (conflates extraction + specification)

Proposed: Figma Node(s) → Component Analysis (descriptive, per component)
                        ↓
          Human/AI Review (Ada, Lina, Thurgood validate recommendations)
                        ↓
          Human-Authored Design-Outline (prescriptive, synthesis)
```

**Key distinction:** The component analysis says "here's what Figma has." The design-outline says "here's what we're building."

### What Gets Deprecated

- `generateDesignOutlineMarkdown()` method and auto-generation logic
- Auto-generated behavioral contract text ("No interaction — static display component")
- Platform parity prescriptive recommendations ("use touch-based alternative")

### What Gets Preserved (with Validation Requirements)

The following recommendations stay in the component analysis but are explicitly framed as **validation-required**:

- **Variant mapping recommendations** (Option A vs B with rationale, conflict detection)
- **Component token suggestions** (illustrative suggestions for repeated primitive usage)
- **Mode validation** (light/dark discrepancy detection)
- **Platform parity detection** (which interactions exist, which platforms support them)
- **Component screenshots** (visual reference via `figma_get_component_image`)

All recommendations include:
- Prominent disclaimers that Figma structure ≠ optimal code structure
- Validation prompts requiring domain specialist review
- Explicit warnings against confirmation bias

Component screenshots are captured at 2x scale and stored in `analysis/images/` with URLs embedded in the Markdown analysis for visual reference during review.

---

## Analysis Limitations and Validation Requirements

### Critical Disclaimer

**This analysis is based on Figma component structure as designed. The optimal code structure may differ.**

Figma structure reflects how designers organized components for visual convenience and design system consistency. Code structure reflects how developers implement components for optimal API surface, composition patterns, and use case coverage.

**Common divergences:**

| Figma Shows | Code Might Need |
|-------------|-----------------|
| 3 size variants (Sm, Md, Lg) | A `size` prop accepting any token value |
| 5 child INSTANCE nodes composed by designer | A `steps` prop with parent managing composition |
| Separate variants for each state | A single component with `state` prop |
| Repeated primitive token usage | Consolidated semantic or component token |
| Flat property structure | Nested prop groups for related values |

### Validation Requirements

**All recommendations require validation by domain specialists without confirmation bias:**

- **Ada (Token Governance)**: Validate token classifications, evaluate component token suggestions, confirm semantic vs primitive decisions
- **Lina (Component Architecture)**: Validate variant mapping recommendations, evaluate composition patterns, confirm behavioral contracts
- **Thurgood (Spec Quality)**: Validate completeness, testability, cross-platform considerations

**Do not accept recommendations without critical review.** The analysis surfaces patterns in the Figma design; it does not prescribe the optimal implementation.

### Validation Questions to Ask

**For every recommendation:**
- Does the Figma structure match the intended code API?
- Are there use cases the Figma design doesn't cover?
- Should code support combinations or variations not shown in Figma?
- Is the recommendation based on designer convenience or code architecture?
- What are the counter-arguments against this recommendation?

---

## Three-Tier Classification

Every extracted detail falls into one of three categories:

### Semantic Identified
Token and component matches where both the semantic and primitive references are known and confirmed.

Example: `padding-top` → `semanticSpace.inset.075` (primitive: `space.space075`) ✅

These are ready to use. No human intervention needed unless the semantic mapping is wrong for the context.

### Primitive Identified
Token and component matches where a primitive reference was found but no semantic token exists or the semantic mapping is uncertain.

Example: Child `padding` = 2 → matches `space.space025` but no semantic token covers "child instance inset padding."

These are opportunities. A primitive match with no semantic could indicate:
- A missing semantic token that should be created
- A value that's intentionally primitive (no semantic intent)
- A candidate for a new component token

### Unidentified
Values extracted from Figma that couldn't be matched to any known token or component — primitive or semantic.

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

### New: Component Analysis Output (Replaces Auto-Generated Design-Outline)

The extraction pipeline produces a `ComponentAnalysis` artifact containing:

- **Component identity**: Name, type, Figma ID, variant definitions
- **Node tree**: Hierarchical structure with token usage per node
- **Three-tier classification**: Every extracted value categorized as Semantic Identified, Primitive Identified, or Unidentified
- **Composition patterns**: Grouped repeated instances with property variations
- **Unresolved bindings**: List of Figma variable IDs that couldn't be resolved
- **Validation-required recommendations**: Variant mapping, component token suggestions, mode validation, platform parity detection (all with disclaimers)

### Deprecated: Auto-Generated Design-Outline

The following are removed from the extraction pipeline:

- `generateDesignOutlineMarkdown()` method
- Auto-generated behavioral contract text
- Platform parity prescriptive recommendations
- Any logic that tries to prescribe code structure from Figma structure

### Changed: Design-Outline Becomes Human-Authored

The design-outline is **no longer auto-generated**. It's authored by humans (with AI assistance) AFTER reviewing component analyses.

**Workflow:**
1. Generate component analysis for each Figma component in scope
2. Ada, Lina, Thurgood review analyses and validate recommendations
3. Collaboratively author design-outline synthesizing findings
4. Design-outline proceeds to requirements.md, design.md, tasks.md per existing spec planning workflow

The design-outline retains its current sections (variants, states, token usage, accessibility, contracts) but is now informed by validated analysis data rather than being mechanically generated.

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
│   ├── progress-indicator-primitive-analysis.md
│   └── images/
│       ├── progress-pagination-sm.png
│       ├── progress-pagination-md.png
│       └── progress-indicator-primitive-incomplete.png
└── completion/
    └── ...
```

Each component in scope gets its own JSON + Markdown pair. Component screenshots are stored in `analysis/images/` and embedded in the Markdown analysis. Discoverable, consistent with existing organization patterns.

### 3. Automation Boundary: Extraction is Mechanical, Synthesis is Collaborative

- **Fully automated**: Figma extraction → JSON data → three-tier classification → composition detection → dual output generation
- **Validation-required**: Recommendations (variant mapping, component token suggestions) presented with disclaimers and validation prompts
- **Human-owned**: Design-outline authoring, semantic token creation decisions, component architecture decisions, scope confirmation

The extraction and classification is mechanical. The synthesis into a design-outline is where human judgment and AI collaboration meet — Ada, Lina, and Thurgood review the analysis, validate recommendations, and collaboratively author the design-outline.

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

## What Needs to Change (Implementation Scope)

This is a **medium-sized refactor** focused on output format and classification, not a rewrite of the extraction pipeline.

**What stays the same:**
- Extraction pipeline (DesignExtractor, TokenTranslator, VariantAnalyzer)
- Token translation logic (binding-first, value-fallback matching)
- Confidence flags (✅ exact, ⚠️ approximate, ❌ no-match)
- Tolerance rules for approximate matches
- Component-Family doc queries for context

**What changes:**

1. **Add three-tier classification** to TokenTranslator
   - Classify each match as Semantic Identified, Primitive Identified, or Unidentified
   - Semantic Identified: both semantic and primitive tokens confirmed
   - Primitive Identified: primitive token matched, no semantic exists or uncertain
   - Unidentified: no token match found

2. **Add boundVariable resolution**
   - Batch-resolve unknown variable IDs via figma-console-mcp
   - Classify resolution failures as Unidentified
   - Associate resolved/unresolved bindings with node context

3. **Add composition pattern detection**
   - Group repeated INSTANCE children by component name
   - Detect property variations within groups
   - Surface composition patterns at every tree level

4. **Build ComponentAnalysis data structure**
   - Hierarchical node tree with classifications per node
   - Variant definitions, composition patterns, unresolved bindings
   - Validation-required recommendations with disclaimers

5. **Build dual output generators**
   - JSON output: structured data (authoritative source of truth)
   - Markdown output: human-readable with tier indicators, validation prompts

6. **Deprecate design-outline auto-generation**
   - Remove `generateDesignOutlineMarkdown()` method
   - Remove auto-generated behavioral contract text
   - Remove platform parity prescriptive recommendations

7. **Update CLI and workflow**
   - `figma:extract` generates component analysis (JSON + Markdown)
   - Capture component screenshots via `figma_get_component_image` (2x scale PNG)
   - Store screenshots in `.kiro/specs/[spec-name]/analysis/images/`
   - Embed screenshot URLs in Markdown analysis
   - Design-outline is authored separately after analysis review
   - Multi-component specs generate multiple analyses in `.kiro/specs/[spec-name]/analysis/`

This is the scope for spec 054d.
