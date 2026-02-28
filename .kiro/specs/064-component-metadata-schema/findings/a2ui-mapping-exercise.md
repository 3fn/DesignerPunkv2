# A2UI Mapping Exercise Findings

**Date**: 2026-02-28
**Spec**: 064 - Component Metadata Schema
**Task**: 4.1 Phase 2 — Mapping Exercise
**Conducted by**: Thurgood
**A2UI Version**: v0.9 (Draft)
**Source**: https://a2ui.org/specification/v0.9-a2ui/

---

## Methodology

Three representative components were mapped field-by-field from DesignerPunk's assembled ComponentMetadata JSON to A2UI v0.9's component model. A fourth component (Progress-Stepper-Detailed) was evaluated specifically for the data contracts pause point.

For each field in our schema, the mapping asks:
1. Does A2UI have an equivalent concept?
2. If yes, what's the translation?
3. If no, is this a schema omission (we're missing something A2UI needs) or a renderer bridge concern (A2UI doesn't need it, or the bridge handles it)?

---

## A2UI v0.9 Component Model Summary

A2UI components are flat JSON objects in an adjacency list. Each has:
- `id` (unique instance identifier)
- `component` (type name from a catalog, e.g., "Text", "Button", "Card")
- Component-specific properties (e.g., `text`, `children`, `value`, `action`)

A2UI has NO concept of:
- Component metadata/description (purpose, when-to-use)
- Behavioral contracts or guarantees
- Token systems or design token references
- Inheritance between component types
- Platform declarations (it's renderer-agnostic by design)
- Accessibility contracts (accessibility is renderer responsibility)

A2UI DOES have:
- Component catalog (list of available component types with property schemas)
- Composition via adjacency list (parent references child by ID)
- Data binding (JSON Pointer paths to a data model)
- Actions (server events, local functions)
- Theme (primaryColor, iconUrl, agentDisplayName — minimal)
- Client-side validation functions (required, regex, email, etc.)

---

## Field-by-Field Mapping

### Component Identity Fields

| DesignerPunk Field | A2UI Equivalent | Translation | Classification |
|---|---|---|---|
| `name` | `component` (type name in catalog) | Direct — DP name becomes A2UI catalog entry name | ✅ Translates |
| `type` (type-primitive, semantic, etc.) | None | A2UI has no type hierarchy concept | Renderer bridge |
| `family` | None | A2UI has no family/grouping concept | Renderer bridge |
| `version` | None | A2UI catalogs are versioned at catalog level, not per-component | Renderer bridge |
| `readiness` | None | A2UI has no readiness/maturity concept | Renderer bridge |
| `description` | None (catalog could include descriptions) | Could be included in custom catalog as documentation | Renderer bridge |

**Assessment**: Component identity maps cleanly to A2UI's catalog model. The `name` becomes the `component` type string. Hierarchy metadata (type, family, version, readiness) is DesignerPunk-internal — A2UI doesn't need it for rendering. No schema omission.

### Properties

| DesignerPunk Field | A2UI Equivalent | Translation | Classification |
|---|---|---|---|
| `properties` (name, type, required, default, description) | Component property schema in catalog JSON | Direct — DP properties become A2UI catalog property definitions | ✅ Translates |
| Property `type` (e.g., `"'sm' | 'md' | 'lg'"`) | JSON Schema type + enum | DP union types → A2UI enum constraints | ✅ Translates |
| Property `default` | JSON Schema default | Direct | ✅ Translates |
| Property `required` | JSON Schema required array | Direct | ✅ Translates |

**Assessment**: Properties translate directly. A2UI's catalog schema uses standard JSON Schema for property definitions, which can express everything DesignerPunk's property model contains. No gap.

### Composition

| DesignerPunk Field | A2UI Equivalent | Translation | Classification |
|---|---|---|---|
| `composition.composes` | Implicit in component implementation | A2UI doesn't expose internal composition — it's a rendering detail | Renderer bridge |
| `composition.children` (allowed/prohibited) | `ChildList` type (array or template) | A2UI has no constraint validation — any component can be a child of any container | **Gap — see analysis** |
| `composition.rules` (when/then) | None | A2UI has no conditional composition constraints | **Gap — see analysis** |
| `composition.nesting.self` | None | A2UI has no self-nesting prevention | **Gap — see analysis** |

**Assessment**: This is the most significant divergence. A2UI's adjacency list model is unconstrained — any component can reference any other as a child. DesignerPunk's composition rules (allowed/prohibited children, conditional rules, self-nesting prevention) have no A2UI equivalent.

**Classification: Renderer bridge concern, NOT schema omission.** Here's why: composition constraints are authoring-time validation ("can I put this inside that?"), not rendering-time structure. The A2UI renderer receives a pre-validated component tree. The bridge's job is to produce valid trees — it uses DesignerPunk's composition rules during tree construction, then emits a flat A2UI adjacency list that's already valid. A2UI doesn't need to know the rules; it just renders what it receives.

The component MCP's `check_composition` tool serves the agent during tree construction. The A2UI stream contains the result, not the rules.

### Behavioral Contracts

| DesignerPunk Field | A2UI Equivalent | Translation | Classification |
|---|---|---|---|
| `contracts.active` | None | A2UI has no behavioral contract concept | Renderer bridge |
| `contracts.inherited` / `contracts.own` | None | A2UI has no inheritance concept | Renderer bridge |
| `contracts.excluded` | None | A2UI has no exclusion concept | Renderer bridge |
| Contract `behavior` text | None | A2UI has no behavioral description model | Renderer bridge |
| Contract `wcag` references | None | A2UI delegates accessibility to renderer | Renderer bridge |
| Contract `validation` criteria | Partially: `checks` on input components | A2UI has client-side validation functions (required, regex, email) but these are data validation, not behavioral contracts | Renderer bridge |

**Assessment**: Behavioral contracts are entirely DesignerPunk-internal. A2UI's philosophy is that the renderer handles accessibility, visual behavior, and interaction patterns. The agent uses DesignerPunk's contracts to select the right component; the A2UI stream just names the component and sets its properties. No schema omission — this is by design.

### Semantic Annotations

| DesignerPunk Field | A2UI Equivalent | Translation | Classification |
|---|---|---|---|
| `annotations.purpose` | None | A2UI has no component selection guidance | Renderer bridge |
| `annotations.usage` | None | A2UI has no usage guidance | Renderer bridge |
| `annotations.contexts` | None | A2UI has no context concept | Renderer bridge |
| `annotations.alternatives` | None | A2UI has no alternatives concept | Renderer bridge |

**Assessment**: Semantic annotations serve the agent during component selection — before any A2UI stream is generated. A2UI is a rendering protocol, not a selection protocol. The component MCP serves selection; A2UI serves rendering. No schema omission.

### Platforms

| DesignerPunk Field | A2UI Equivalent | Translation | Classification |
|---|---|---|---|
| `platforms` (web, ios, android) | None directly — A2UI is renderer-agnostic | The bridge filters components by platform based on the target renderer | Renderer bridge |

**Assessment**: A2UI doesn't declare platforms because it's designed to be rendered by any client. The bridge knows which renderer it's targeting and uses DesignerPunk's platform data to filter. No schema omission.

### Tokens

| DesignerPunk Field | A2UI Equivalent | Translation | Classification |
|---|---|---|---|
| `tokens` list | `theme` object (minimal: primaryColor, iconUrl, agentDisplayName) | A2UI's theme is extremely minimal — no token system | **Gap — see analysis** |
| `contractTokenRelationships` | None | A2UI has no token dependency concept | Renderer bridge |

**Assessment**: A2UI v0.9's theme model is intentionally minimal (3 properties). DesignerPunk's token system (hundreds of tokens across multiple families) is vastly more expressive. This is a known architectural difference, not a gap to fix.

**Classification: Renderer bridge concern.** The bridge maps DesignerPunk tokens to whatever styling mechanism the A2UI renderer supports. A2UI's `theme` could be extended via custom catalogs to accept more styling parameters, but that's a bridge design decision, not a schema omission.

### Actions and Data Binding

| DesignerPunk Field | A2UI Equivalent | Translation | Classification |
|---|---|---|---|
| Not in DesignerPunk schema | `action` (server events, local functions) | A2UI has actions; DesignerPunk schema doesn't model them | **Gap — see analysis** |
| Not in DesignerPunk schema | `value` with `path` (data binding) | A2UI has data binding; DesignerPunk schema doesn't model it | **Gap — see analysis** |

**Assessment**: A2UI has two concepts that DesignerPunk's component metadata schema does NOT model: actions (what happens when a user interacts) and data binding (how component values connect to a data model). These are runtime concerns — they describe how a specific instance of a component behaves in a specific UI, not what the component is capable of.

**Classification: NOT a schema omission.** Actions and data binding are instance-level configuration, not component-level metadata. DesignerPunk's schema describes component capabilities ("this component is pressable, supports keyboard activation"). The A2UI stream configures specific instances ("this button, when pressed, sends a 'submit_form' event with this context"). The bridge generates instance configuration from the agent's intent + DesignerPunk's capability metadata.

---

## Data Contracts Pause Point Evaluation

**Component**: Progress-Stepper-Detailed
**Question**: Can agents construct correct component invocations without formal data shapes for `StepDefinition[]`?

### What the assembled metadata provides:

```json
"steps": {
  "type": "StepDefinition[]",
  "description": "Array of step definitions with label, helperText, icon, optional. Max 8.",
  "required": true
}
```

### What A2UI would need:

In A2UI, the stepper's steps would likely be modeled as a data-bound template — a `List` or `Column` with a `ChildList` template iterating over a data model array. The agent needs to know the shape of each array item to populate the data model correctly.

### Assessment:

The description string "Array of step definitions with label, helperText, icon, optional. Max 8." tells a human (or a capable LLM) the field names. But it doesn't tell an agent:
- Which fields are required vs. optional (`label` is required, the rest are optional)
- What types each field is (`label: string`, `helperText?: string`, `icon?: string`, `optional?: boolean`)
- What constraints exist (max 8 items)

For the current 2 components with complex data shapes, an LLM agent can probably infer the shape from the description string. But this is fragile — it depends on the description being well-written and the LLM being capable of inference.

### Recommendation:

**Defer data contracts for v1.** The description strings are adequate for the 2 current components. The trigger criteria from Q9 are not met:
- Only 2 components have complex data shapes (threshold is 3)
- No tables, data grids, or tree views exist yet
- The A2UI mapping exercise doesn't reveal a hard blocker — it reveals a fragility

**However**, flag this as a known fragility. When the third component with a complex data shape is added, revisit and add `data_shapes:` to component-meta.yaml.

---

## Gap Summary

| Gap | Classification | Action |
|-----|---------------|--------|
| Composition constraints (allowed/prohibited children, conditional rules) | Renderer bridge | Bridge validates trees before emitting A2UI stream. No schema change. |
| Token system mapping | Renderer bridge | Bridge maps DP tokens to renderer styling. No schema change. |
| Actions and data binding | Not a schema concern | Instance-level configuration generated by bridge from agent intent. No schema change. |
| Data shapes for complex props | Known fragility | Defer to v1. Revisit at 3+ components with complex data shapes. |

**Schema omissions found: 0**

The DesignerPunk component metadata schema is expressive enough for A2UI v0.9 translation. All gaps are renderer bridge concerns — they describe how the bridge translates DesignerPunk metadata into A2UI streams, not missing information in the schema itself.

---

## Observations

1. **A2UI and DesignerPunk operate at different layers.** A2UI is a rendering protocol (how to display a UI). DesignerPunk's schema is a capability protocol (what components can do). The bridge translates between layers. This confirms the design outline's Q5 decision: tool-agnostic design with A2UI as validation target, not design driver.

2. **A2UI's custom catalog mechanism is the integration point.** A DesignerPunk custom catalog for A2UI would list DesignerPunk component names as A2UI component types, with property schemas derived from our `properties` field. This is a clean, mechanical translation.

3. **A2UI's adjacency list model maps well to our composition model.** Our `check_composition` tool validates the tree; the bridge emits the validated tree as a flat A2UI component list. The models are complementary, not conflicting.

4. **No A2UI-specific changes needed to the schema.** The design outline's prediction was correct: the schema is tool-agnostic and expressive enough. The A2UI-specific work lives entirely in the downstream renderer bridge spec.

---
