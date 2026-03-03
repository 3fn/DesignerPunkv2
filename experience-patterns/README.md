# Experience Pattern Schema Reference

**Date**: 2026-03-01
**Spec**: 067 - Application MCP
**Purpose**: Define the YAML schema for experience patterns — multi-component assembly templates that teach agents how to build common experiences.

---

## Overview

Experience patterns are authored YAML files that describe how to assemble DesignerPunk components for specific use cases. They provide component selection, roles, configuration hints, and assembly-level accessibility guidance.

Patterns exist in two layers:
- **System-level** (`source: system`) — universal to DesignerPunk, ships with the design system
- **Project-level** (`source: project`) — product-specific, authored per project (future, not Tier 1)

---

## Schema

### Top-Level Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Unique identifier for the pattern. Kebab-case. Must match filename (e.g., `simple-form` → `simple-form.yaml`). |
| `source` | enum | ✅ | `system` or `project`. Tier 1 implements system only. |
| `extends` | string | ❌ | Name of a system pattern this pattern extends. Schema supports it; Tier 1 does not resolve inheritance. |
| `description` | string | ✅ | What this pattern is for. One or two sentences. |
| `category` | string | ✅ | Grouping category (e.g., `forms`, `onboarding`, `navigation`, `settings`). |
| `tags` | string[] | ❌ | Additional discovery keywords. Defaults to empty array. |
| `steps` | PatternStep[] | ✅ | Ordered sequence of steps. Single-step patterns have one entry. |
| `accessibility` | string[] | ❌ | Assembly-level accessibility requirements beyond individual component contracts. |
| `alternatives` | PatternAlternative[] | ❌ | Other patterns that serve similar purposes. |

### PatternStep

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Step identifier. Kebab-case. |
| `purpose` | string | ✅ | What this step accomplishes. |
| `layout` | string | ❌ | Layout hint (e.g., `vertical-stack`, `horizontal-row`, `grid`). Advisory, not enforced. |
| `components` | PatternComponent[] | ✅ | Ordered list of components in this step. |

### PatternComponent

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `component` | string | ✅ | DesignerPunk component name (e.g., `Input-Text-Email`). Must match a component in the catalog. |
| `role` | string | ✅ | Semantic role within the pattern (e.g., `form-field`, `primary-action`, `consent`, `navigation`, `container`). Not a fixed enum — roles converge on common names across patterns. |
| `optional` | boolean | ❌ | Whether this component is optional in the pattern. Defaults to `false` — all components are required unless explicitly marked `optional: true`. |
| `hints` | Record<string, unknown> | ❌ | Prop value guidance as key-value pairs. Recommendations, not configuration. Defaults to empty object. |
| `children` | PatternComponent[] | ❌ | Nested child components. Used when a component contains other components (e.g., Container-Base wrapping form fields). Recursive — children follow the same schema. |

### PatternAlternative

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pattern` | string | ✅ | Name of the alternative pattern. |
| `reason` | string | ✅ | When to use the alternative instead. |

---

## Token Governance Convention (D9)

Hints reference prop values and semantic intent only — **never raw pixel, color, or spacing values**.

```yaml
# ✅ CORRECT — semantic intent and prop values
hints:
  label: "Describe what the email will be used for"
  requiresExplicitConsent: true
  variant: primary

# ✅ CORRECT — token name for visual property
hints:
  iconSize: "icon.size100"

# ❌ WRONG — raw values
hints:
  iconSize: "24px"
  color: "#333333"
  spacing: "16"
```

If a hint needs to reference a visual property, use token names.

---

## Validation Rules

The PatternIndexer validates each file during indexing:

1. Required top-level fields present: `name`, `source`, `description`, `category`, `steps`
2. `source` is `system` or `project`
3. `steps` is a non-empty array
4. Each step has required fields: `name`, `purpose`, `components`
5. `components` is a non-empty array per step
6. Each component has required fields: `component`, `role`
7. `optional`, if present, is a boolean
8. `children`, if present, follow the same component validation rules (recursive)

Files that fail validation produce a warning and are skipped — they do not fail the entire index.

---

## Example

```yaml
name: simple-form
source: system
description: Single-step form collecting user input with a submit action, wrapped in an accessible fieldset container.
category: forms
tags: [form, single-step, data-collection, fieldset]

steps:
  - name: collect-and-submit
    purpose: Collect user input and submit
    layout: vertical-stack
    components:
      - component: Container-Base
        role: form-container
        hints:
          semantic: fieldset
          accessibilityLabel: "Describe the form's purpose for screen readers"
          padding: "Use space.inset tokens. 200 (16px) is a reasonable default for standalone forms. Compact embedded forms may use 100 or 150."
        children:
          - component: Input-Text-Email
            role: form-field
            hints:
              label: "Describe what the collected data will be used for"

          - component: Button-CTA
            role: submit-action
            hints:
              variant: primary
              label: "Action verb — Subscribe, Submit, Save, etc."

accessibility:
  - "Fieldset must have an accessible name via accessibilityLabel (WCAG 1.3.1)"
  - "Focus order follows visual order, block-start to block-end (WCAG 2.4.3)"
  - "Form must have a submit action (WCAG 3.2.2)"

alternatives:
  - pattern: multi-step-flow
    reason: "When the form has too many fields for a single view"
```

---

## Directory Structure

```
experience-patterns/          ← system-level patterns (Tier 1)
  README.md                   ← this file
  simple-form.yaml
  non-form-layout.yaml
  multi-step-flow.yaml

project-patterns/             ← project-level patterns (future, not Tier 1)
```
