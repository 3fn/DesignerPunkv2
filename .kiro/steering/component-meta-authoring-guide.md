---
inclusion: manual
name: component-meta-authoring-guide
description: Guide for authoring component-meta.yaml files — field descriptions, examples, controlled vocabulary, and new component checklist. Load when creating or editing component metadata.
---

# Component-Meta.yaml Authoring Guide

**Date**: 2026-03-28
**Purpose**: Guide for authoring component-meta.yaml files for the Stemma component catalog
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, mcp-documentation
**Spec**: 064 — Component Metadata Schema, 086 — Component Discoverability & Metadata Infrastructure
**Last Reviewed**: 2026-03-28

---

## Overview

Each Stemma component has a `component-meta.yaml` file that provides semantic annotations for agent-driven component selection. The Application MCP server reads these files alongside `schema.yaml` and `contracts.yaml` to assemble the queryable catalog.

The key distinction: `schema.yaml` describes what a component *is* (structure, props, tokens). `component-meta.yaml` describes when and why an agent should *choose* it.

### Authoring Model: Hybrid Extraction

Component metadata uses a hybrid authoring model:

- **`purpose` and `contexts`**: Authored in Component-Family steering docs as `### [Component] — Metadata` blocks. Extracted by `npm run extract:meta`. These are single-source — edit the family doc, run the script.
- **`usage` and `alternatives`**: The extraction script derives these from family doc selection tables and Usage Guidelines sections. When hand-authored content in the existing meta file is richer (more `when_to_use` entries), the script preserves it. These fields may be hand-edited directly in `component-meta.yaml` when derived content is insufficient.

**Workflow**: Author purpose + contexts in the family doc → run `npm run extract:meta` → review the generated diff → hand-edit usage/alternatives if the derived content is too generic.

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

**Source**: Extracted from family doc `### [Component] — Metadata` block. Do not edit directly in meta file — edit the family doc and run `npm run extract:meta`.

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

**Source**: Derived by extraction script from family doc selection tables and Usage Guidelines. Preserved from existing meta file when hand-authored content is richer. May be hand-edited directly when derived content is too generic.

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

**Source**: Extracted from family doc `### [Component] — Metadata` block. Do not edit directly in meta file — edit the family doc and run `npm run extract:meta`.

UI contexts where this component is typically used. Values MUST come from the controlled vocabulary (see below).

```yaml
contexts:
  - "navigation-tabs"
  - "list-items"
  - "icon-overlays"
```

**Guidance**:
- MUST use values from the Controlled Vocabulary section below
- 2–6 entries is typical
- The extraction script warns on non-vocabulary values
- To add a new context value, use the ballot measure process (propose in conversation, Peter approves)

### alternatives (required, list of objects)

**Source**: Derived by extraction script from family doc selection tables. Preserved from existing meta file when hand-authored content is richer. May be hand-edited directly.

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
  - "list-items"
  - "modals"
  - "settings-screens"

alternatives: []
```

---

## Controlled Vocabulary

Context values are a closed set. Using canonical values ensures `find_components({ context: "..." })` queries return predictable results. Consumer search terms show what product architects actually search for — use them to decide which context fits your component.

To propose a new value, use the ballot measure process: propose in conversation, Peter approves, then add to this list and the extraction script's validation array.

| Context Value | Consumer Search Terms |
|--------------|----------------------|
| `forms` | form fields, data collection, input groups, registration, login, checkout |
| `dashboards` | stat cards, summary statistics, overview page, home screen metrics |
| `settings-screens` | preferences, options, configuration, account settings |
| `navigation-tabs` | tab bar, bottom navigation, primary navigation, navigation bar |
| `content-feeds` | news feed, activity stream, scrollable list, content list |
| `onboarding-flows` | welcome screens, setup wizard, first-run experience, tutorial |
| `filter-bars` | filter chips, content filtering, search refinement |
| `list-items` | row items, cell content, list entries, menu items |
| `icon-overlays` | badge on icon, notification dot, status indicator, notification bell |
| `profile-sections` | user info, account details, avatar display, user profiles |
| `product-cards` | product card, catalog items, shopping grid, content preview |
| `app-bars` | top bar, header, navigation bar, app shell |
| `modals` | dialog, popup, overlay, sheet, bottom sheet |
| `empty-states` | no data, zero state, first-time experience, placeholder content |

**Selection guidance**: Pick the context that matches the UI region where the component appears, not the page it's on. A Button-CTA in a dialog footer is `modals`, not `forms` (unless it's also used in forms — then list both).

---

## New Component Checklist

1. Add a `### [Component-Name] — Metadata` block to the component's family doc (`.kiro/steering/Component-Family-*.md`) in the `## Component Metadata` section
2. Write a `purpose` string oriented toward agent selection (verb-first, ~30 words)
3. List `contexts` using controlled vocabulary values (comma-separated)
4. Run `npm run extract:meta` to generate the `component-meta.yaml` file
5. Review the generated file — if `usage` or `alternatives` are too generic, hand-edit them directly
6. Verify the file parses: rebuild the Application MCP and check health output for warnings

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
