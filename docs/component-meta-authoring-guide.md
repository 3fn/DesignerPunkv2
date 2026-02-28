# Component-Meta.yaml Authoring Guide

**Date**: 2026-02-28
**Purpose**: Guide for authoring component-meta.yaml files for the Stemma component catalog
**Spec**: 064 — Component Metadata Schema

---

## Overview

Each Stemma component has a `component-meta.yaml` file that provides human-authored semantic annotations. These annotations help AI agents select the right component for a given task. The component MCP server reads these files alongside `schema.yaml` and `contracts.yaml` to assemble the queryable catalog.

The key distinction: `schema.yaml` describes what a component *is* (structure, props, tokens). `component-meta.yaml` describes when and why an agent should *choose* it.

---

## File Location

Place `component-meta.yaml` in the component's root directory:

```
src/components/core/{ComponentName}/
  ├── {ComponentName}.schema.yaml
  ├── contracts.yaml
  └── component-meta.yaml        ← this file
```

---

## Fields

### purpose (required, string)

A single sentence describing when an agent should select this component. Write for agent decision-making, not for human documentation.

**Good**: Tells the agent what problem this component solves
```yaml
purpose: "Display a numeric count indicator, such as unread notifications or item quantities, in a compact badge."
```

**Bad**: Restates the schema description or implementation details
```yaml
# ❌ Too structural
purpose: "A type primitive count badge component."
# ❌ Too implementation-focused
purpose: "Renders a pill-shaped element with typography tokens and overflow truncation."
```

**Guidance**:
- Start with a verb: "Display", "Collect", "Navigate", "Group"
- Name the user-facing concept, not the implementation
- Include the primary use case in the sentence
- Keep under ~30 words

### usage (required, object)

Two lists describing when to use and when not to use this component.

```yaml
usage:
  when_to_use:
    - "Showing unread message or notification counts"
    - "Displaying item quantities in a cart or list"
  when_not_to_use:
    - "Displaying text labels or status words — use Badge-Label-Base"
    - "Interactive badges that respond to tap/click"
```

**Guidance**:
- Each entry is a concrete scenario, not a restatement of purpose
- `when_not_to_use` entries should name the alternative when one exists
- 2–5 entries per list is typical

### contexts (required, list of strings)

UI contexts where this component is typically used. Agents use this to validate that a component fits the layout they're building.

```yaml
contexts:
  - "navigation-tabs"
  - "list-items"
  - "icon-overlays"
```

**Guidance**:
- Use lowercase kebab-case
- Name the UI region or pattern, not the page
- 2–6 entries is typical

### alternatives (required, list of objects)

Other Stemma components an agent should consider instead. Each entry has `component` (canonical Stemma name) and `reason` (when to prefer the alternative).

```yaml
alternatives:
  - component: Badge-Label-Base
    reason: "When the indicator shows text labels instead of numbers"
  - component: Badge-Count-Notification
    reason: "When the count represents notifications requiring semantic color and live region announcements"
```

**Guidance**:
- `component` must be an exact canonical name (the MCP warns on invalid references)
- `reason` explains when to prefer the alternative, not what the alternative is
- Include at least one alternative when one exists; empty list `[]` is valid for unique components

---

## Complete Example: Badge-Count-Base

```yaml
purpose: "Display a numeric count indicator, such as unread notifications or item quantities, in a compact badge."

usage:
  when_to_use:
    - "Showing unread message or notification counts"
    - "Displaying item quantities in a cart or list"
    - "Numeric indicators overlaid on icons or avatars"
  when_not_to_use:
    - "Displaying text labels or status words — use Badge-Label-Base"
    - "Notification-specific counts needing semantic color — use Badge-Count-Notification"

contexts:
  - "navigation-tabs"
  - "list-items"
  - "icon-overlays"
  - "app-bars"

alternatives:
  - component: Badge-Label-Base
    reason: "When the indicator shows text labels instead of numbers"
  - component: Badge-Count-Notification
    reason: "When the count represents notifications requiring semantic color and live region announcements"
```

## Minimal Example: Divider-Base

```yaml
purpose: "Visually separate content sections with a horizontal or vertical line."

usage:
  when_to_use:
    - "Separating groups of list items"
    - "Dividing content sections within a card or page"
  when_not_to_use:
    - "Decorative spacing without semantic separation — use layout spacing tokens"

contexts:
  - "lists"
  - "cards"
  - "settings-screens"

alternatives: []
```

---

## New Component Checklist

1. Create `component-meta.yaml` in the component's directory
2. Write a `purpose` string oriented toward agent selection (verb-first, ~30 words)
3. Add 2–5 `when_to_use` and `when_not_to_use` scenarios
4. List 2–6 `contexts` where the component appears
5. Add `alternatives` referencing valid canonical component names
6. Verify the file parses: start the component MCP and check health output for warnings

---

## Future: Data Shapes (Deferred)

Component-meta.yaml does NOT currently include a `data_shapes:` field for describing complex prop structures. This was evaluated during spec 064 and deferred.

**Governance criteria for when to add `data_shapes:`** are maintained in the steering doc:

```
.kiro/steering/Component-Meta-Data-Shapes-Governance.md
```

Or query via MCP:
```
get_section({ path: ".kiro/steering/Component-Meta-Data-Shapes-Governance.md", heading: "Trigger Criteria" })
```

**Any agent creating or reviewing a component-meta.yaml should evaluate the trigger criteria in that doc.** If any criterion is met, follow the escalation process defined there.
