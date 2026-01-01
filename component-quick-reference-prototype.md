# Component Quick Reference

**Date**: 2025-12-31
**Purpose**: Master reference for component families, relationships, and usage patterns
**Organization**: working-document
**Scope**: 034-component-architecture-system

## Component System Overview

For comprehensive understanding of the component architecture, behavioral contracts, and cross-platform strategy, see:
- **Component Architecture System**: `.kiro/specs/034-component-architecture-system/design-outline.md`

## Purpose

This document serves as a routing table for component documentation—it helps AI agents quickly find the right MCP document for each component family without loading full reference docs. This is not a reference itself; it routes to where component details are documented.

## Component Documentation Map

| Component Family | Shared Need/Purpose | MCP Document Path |
|------------------|---------------------|-------------------|
| Buttons | User interaction and actions | `.kiro/steering/button-components.md` |
| Form Inputs | Data collection and validation | `.kiro/steering/form-input-components.md` |
| Containers | Content organization and layout | `.kiro/steering/container-components.md` |
| Icons | Asset distribution and visual communication | `.kiro/steering/icon-components.md` |
| Modals | Overlay and focus management | `.kiro/steering/modal-components.md` |
| Avatars | Identity representation | `.kiro/steering/avatar-components.md` |
| Badges & Tags | Status and labeling | `.kiro/steering/badge-components.md` |
| Data Displays | Information presentation | `.kiro/steering/data-display-components.md` |
| Dividers | Content separation | `.kiro/steering/divider-components.md` |
| Loading | Progress indication | `.kiro/steering/loading-components.md` |
| Navigation | Wayfinding and structure | `.kiro/steering/navigation-components.md` |

## Common Composition Patterns

These are frequently used component combinations for common UI scenarios:

### Login Form
- **Form Inputs**: `form-input-components.md` → Input-Email, Input-Password
- **Buttons**: `button-components.md` → ButtonCTA (primary variant)
- **Containers**: `container-components.md` → Simple container
- **Tokens**: Typography (body, label), Spacing (inset, stack), Color (primary, error), Accessibility (focus, tap areas)

### Feed Post
- **Avatars**: `avatar-components.md` → AvatarUser
- **Buttons**: `button-components.md` → ButtonIcon, ButtonMedia
- **Data Displays**: `data-display-components.md` → Text content, media display
- **Containers**: `container-components.md` → Card container
- **Tokens**: Shadow (elevation), Radius (card corners), Spacing (inset, stack), Color (surface, text)

### Modal Dialog
- **Modals**: `modal-components.md` → Dialog
- **Buttons**: `button-components.md` → ButtonCTA (confirm/cancel)
- **Form Inputs**: `form-input-components.md` → Various inputs
- **Tokens**: Shadow (xl elevation), Layering (modal z-index), Opacity (backdrop), Motion (enter/exit)

### Navigation Header
- **Navigation**: `navigation-components.md` → TabBar, Menu
- **Buttons**: `button-components.md` → ButtonIcon
- **Avatars**: `avatar-components.md` → AvatarUser
- **Tokens**: Color (navigation background), Spacing (inline spacing), Typography (navigation labels)

### Data Table
- **Data Displays**: `data-display-components.md` → Table
- **Buttons**: `button-components.md` → ButtonIcon (row actions)
- **Badges**: `badge-components.md` → StatusBadge
- **Tokens**: Border (table lines), Spacing (cell padding), Typography (data text), Color (alternating rows)

### Interactive States
- **Buttons**: `button-components.md` → hover, active, focus behaviors
- **Form Inputs**: `form-input-components.md` → validation states, focus indicators
- **Tokens**: Color (state colors), Motion (transition timing), Accessibility (focus rings)

## MCP Query Examples

Use these MCP queries to access component documentation progressively:

### Get Document Summary
Returns metadata and outline (~200 tokens) to understand component family structure:

```
get_document_summary({ path: ".kiro/steering/button-components.md" })
get_document_summary({ path: ".kiro/steering/form-input-components.md" })
get_document_summary({ path: ".kiro/steering/container-components.md" })
```

### Get Specific Section
Returns targeted content (~2,000 tokens) for specific information:

```
// Get component inheritance structures
get_section({ path: ".kiro/steering/form-input-components.md", heading: "Family Inheritance" })
get_section({ path: ".kiro/steering/button-components.md", heading: "Component Hierarchy" })

// Get specific component details
get_section({ path: ".kiro/steering/form-input-components.md", heading: "Input-Email" })
get_section({ path: ".kiro/steering/button-components.md", heading: "ButtonCTA" })
get_section({ path: ".kiro/steering/container-components.md", heading: "PD-Container" })

// Get usage guidelines
get_section({ path: ".kiro/steering/button-components.md", heading: "Usage Guidelines" })
get_section({ path: ".kiro/steering/form-input-components.md", heading: "Validation Patterns" })

// Get behavioral contracts
get_section({ path: ".kiro/steering/form-input-components.md", heading: "Behavioral Contracts" })
get_section({ path: ".kiro/steering/button-components.md", heading: "Interaction Patterns" })

// Get token dependencies
get_section({ path: ".kiro/steering/button-components.md", heading: "Token Dependencies" })
get_section({ path: ".kiro/steering/form-input-components.md", heading: "Token Integration" })
```

### Get Full Document
Returns complete content (2,000-15,000 tokens) when comprehensive reference needed:

```
get_document_full({ path: ".kiro/steering/button-components.md" })
```

### Recommended Workflow

1. **Start with this Component Quick Reference** to identify which component families you need
2. **Query component family summary** to understand structure and available components
3. **Query specific sections** for targeted component details, usage guidelines, or behavioral contracts
4. **Query full family documentation** only when comprehensive reference is required