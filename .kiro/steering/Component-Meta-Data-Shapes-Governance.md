---
inclusion: manual
name: Component-Meta-Data-Shapes-Governance
description: Governance criteria for adding data_shapes to component-meta.yaml. Load when creating new components with complex data props, reviewing component-meta.yaml files, or auditing component metadata completeness.
---

# Component Metadata: Data Shapes Governance

**Date**: 2026-02-28
**Last Reviewed**: 2026-02-28
**Purpose**: Define trigger criteria and escalation process for adding formal data shape descriptions to component-meta.yaml
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-creation, component-audit, spec-creation

## AI Agent Reading Priorities

**Note**: This section intentionally uses the same heading as other steering documents because each document provides reading priorities specific to its content. This structural pattern enables progressive disclosure and helps AI agents navigate to relevant sections efficiently.

**Layer Context**: This is a Layer 3 (Specific Implementations) document that provides governance criteria for a specific component metadata feature. It's conditionally loaded when creating or reviewing components with complex data props.

**WHEN creating a new component with array or object props THEN read:**
1. ✅ **Trigger Criteria** — evaluate whether the threshold for adding data_shapes has been met
2. ✅ **Current Status** — check how many components already have complex data shapes

**WHEN auditing component metadata completeness THEN read:**
1. ✅ **Trigger Criteria** — check if any criteria are now met
2. ✅ **Escalation Process** — follow the ballot measure process if criteria are met

**WHEN authoring component-meta.yaml THEN read:**
- `docs/component-meta-authoring-guide.md` for field descriptions, examples, and the new component checklist

---

## Background

Component-meta.yaml currently has four fields: `purpose`, `usage`, `contexts`, `alternatives`. A `data_shapes:` field for describing complex prop structures (e.g., `StepDefinition[]`) was evaluated during the A2UI mapping exercise (spec 064, task 4.1) and deferred because only 2 of 28 components have complex data shapes.

This document defines when and how to add `data_shapes:` support.

---

## Trigger Criteria

**Any agent creating or reviewing a component-meta.yaml MUST evaluate these criteria.** If any single criterion is met, initiate the escalation process below.

1. **Three or more components** have props typed as structured arrays or objects (e.g., `SomeInterface[]`, `Record<string, SomeType>`) where the schema.yaml `description` string is insufficient for an agent to construct correct data
2. **A new component is added** with nested data structures — tables, data grids, tree views, or any prop expecting an array of structured objects with 3+ fields
3. **An agent reports** that it cannot construct correct component invocations because the prop description string is insufficient to infer the required data shape

---

## Current Status

| Component | Prop | Type | Description Adequate? |
|-----------|------|------|----------------------|
| Progress-Stepper-Detailed | `steps` | `StepDefinition[]` | Yes — "label, helperText, icon, optional. Max 8." |
| Progress-Stepper-Base | `errorSteps` | `number[]` | Yes — simple array of indices |

**Last updated**: 2026-02-28 (spec 064 completion)

**Update instruction**: When a new component with complex data props is added, update this table. If the count reaches 3 or the description is inadequate, trigger escalation.

---

## Escalation Process

When a trigger criterion is met:

1. **Document the evidence** — which criterion was met, which components are affected, why the description string is insufficient
2. **Draft a ballot measure proposal** for Peter that includes:
   - The trigger criterion that was met
   - The affected components and their complex props
   - The proposed `data_shapes:` format (see below)
   - Impact assessment: which files change, which agents are affected
3. **Present to Peter** for approval, modification, or rejection
4. **If approved**: Add `data_shapes:` to the component-meta.yaml authoring guide, update affected component-meta.yaml files, update the component MCP parser

---

## Proposed data_shapes: Format

When the trigger criteria are met, the proposed addition to component-meta.yaml:

```yaml
data_shapes:
  StepDefinition:
    description: "A single step in a multi-step flow"
    fields:
      label:
        type: string
        required: true
        description: "Primary label text for the step"
      helperText:
        type: string
        required: false
        description: "Optional helper text displayed below the label"
      icon:
        type: string
        required: false
        description: "Optional icon name for current/incomplete/error states"
      optional:
        type: boolean
        required: false
        description: "Whether this step is optional"
```

This format mirrors the existing `properties:` structure in schema.yaml for consistency.

---

## Related Documentation

- `docs/component-meta-authoring-guide.md` — Field descriptions, examples, and new component checklist for authoring component-meta.yaml files
- `.kiro/specs/064-component-metadata-schema/design-outline.md` — Design decision Q9 (data contracts deferral)
- `.kiro/specs/064-component-metadata-schema/findings/a2ui-mapping-exercise.md` — A2UI mapping exercise findings including data contracts pause point evaluation

---
