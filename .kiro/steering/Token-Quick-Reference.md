---
inclusion: manual
name: Token-Quick-Reference
description: Token documentation routing table — maps token types to their MCP document paths and common usage patterns. Load when selecting tokens, finding token documentation, or routing to the right token family guide.
---

# Token Quick Reference

**Date**: 2025-12-01
**Purpose**: Routing table for token documentation - helps AI agents find the right MCP document for each token type
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, token-selection, styling
**Last Reviewed**: 2026-01-25

---

## Token System Overview

For comprehensive understanding of the token system architecture, mathematical foundations, and cross-platform strategy, see:
- **Token System Overview**: `docs/token-system-overview.md`

## Purpose

This document serves as a routing table for token documentation—it helps AI agents quickly find the right MCP document for each token type without loading full reference docs. This is not a reference itself; it routes to where values are documented.

## Token Documentation Map

| Token Type | Purpose | MCP Document Path |
|------------|---------|-------------------|
| Color | Semantic color tokens organized by concept (feedback, identity, action, contrast, structure) | `.kiro/steering/Token-Family-Color.md` |
| Spacing | Layout spacing values based on 8px baseline grid (stack, inline, inset patterns) | `.kiro/steering/Token-Family-Spacing.md` |
| Typography | Font styles and sizes combining fontSize, lineHeight, fontFamily, fontWeight, letterSpacing | `.kiro/steering/Token-Family-Typography.md` |
| Shadow | Elevation shadows for depth and hierarchy (sm, md, lg, xl levels) | `.kiro/steering/Token-Family-Shadow.md` |
| Glow | Glow effects for emphasis and interactive states | `.kiro/steering/Token-Family-Glow.md` |
| Blend | Color blending and overlay effects | `.kiro/steering/Token-Family-Blend.md` |
| Layering | Z-index layers for stacking context (base, dropdown, modal, toast, tooltip) | `.kiro/steering/Token-Family-Layering.md` |
| Motion | Animation timing and easing (duration, easing curves, transitions) | `.kiro/steering/Token-Family-Motion.md` |
| Radius | Corner rounding values (none, sm, md, lg, xl, full) | `.kiro/steering/Token-Family-Radius.md` |
| Border | Border width values (none, thin, medium, thick) for form elements, cards, dividers | `.kiro/steering/Token-Family-Border.md` |
| Opacity | Transparency values for overlays, disabled states, hover effects | `.kiro/steering/Token-Family-Opacity.md` |
| Accessibility | Focus indicators, tap area sizing (WCAG compliance), icon tokens | `.kiro/steering/Token-Family-Accessibility.md` |
| Responsive | Breakpoints (xs-xxl) and density scaling (compact, normal, comfortable) | `.kiro/steering/Token-Family-Responsive.md` |
| Semantic Structure | Token architecture patterns and primitive→semantic hierarchy | `.kiro/steering/Token-Semantic-Structure.md` |

---

## Color Token Concept Lookup

Color tokens follow the **Nathan Curtis concept-first naming model**. Use this table to find the right concept for your use case:

| Concept | Purpose | Token Pattern | Use Cases |
|---------|---------|---------------|-----------|
| **Feedback** | Communicate system status | `color.feedback.{role}.{property}` | Form validation, alerts, notifications, selection states |
| **Identity** | Distinguish entity types | `color.identity.{role}` | Avatars, attribution, human vs agent distinction |
| **Action** | Visual emphasis for interactions | `color.action.{emphasis}` | Buttons, links, CTAs (primary = emphasized, secondary = de-emphasized) |
| **Contrast** | Readable content on backgrounds | `color.contrast.{surface}` | Text/icons on colored surfaces (onLight, onDark) |
| **Structure** | Visual organization and layering | `color.structure.{role}` | Canvas, surface, border colors |

### Feedback Concept Tokens

| Role | Properties | Use Case |
|------|------------|----------|
| `success` | `.text`, `.background`, `.border` | Form validation success, confirmation messages |
| `error` | `.text`, `.background`, `.border` | Form validation errors, error messages |
| `warning` | `.text`, `.background`, `.border` | Caution messages, attention-required indicators |
| `info` | `.text`, `.background`, `.border` | Help text, informational messages |
| `select` | `.text.{state}`, `.background.{state}`, `.border.{state}` | Selection states (rest, default) |

### Identity Concept Tokens

| Token | Use Case |
|-------|----------|
| `color.identity.human` | Human entity visual identity (warm, approachable) |
| `color.identity.agent` | AI agent visual identity (distinct, technical) |

### Action Concept Tokens

| Token | Use Case |
|-------|----------|
| `color.action.primary` | Emphasized actions - hero CTAs, main buttons |
| `color.action.secondary` | De-emphasized actions - list items, repetitive actions |

**Note**: `primary`/`secondary` represent visual emphasis, not action type. Use `primary` for single, focused instances; `secondary` for repetitive instances to avoid UI over-saturation.

### Contrast Concept Tokens

| Token | Use Case |
|-------|----------|
| `color.contrast.onLight` | Dark content on light backgrounds |
| `color.contrast.onDark` | Light content on dark/colored backgrounds |

### Structure Concept Tokens

| Token | Use Case |
|-------|----------|
| `color.structure.canvas` | Base canvas - page backgrounds |
| `color.structure.surface` | Elevated surface - cards, containers |
| `color.structure.border` | Standard borders - UI element borders, dividers |
| `color.structure.border.subtle` | Semi-transparent borders (baked-in alpha) |

### Component Tokens

Component tokens follow the pattern `color.{component}.{variant}.{property}`:

| Component | Tokens | References |
|-----------|--------|------------|
| Avatar | `color.avatar.{human\|agent}.{background\|icon}` | Identity, Contrast concepts |
| Badge | `color.badge.notification.{background\|text}` | Direct primitive references |

---

## Common Patterns

These are frequently used token combinations for common UI scenarios:

### Button Component
- **Typography**: `Token-Family-Typography.md` → label sizes (labelSm, labelMd, labelLg)
- **Spacing**: `Token-Family-Spacing.md` → inset patterns for padding
- **Color**: `Token-Family-Color.md` → `color.action.primary`, `color.action.secondary`, `color.contrast.onDark`
- **Radius**: `Token-Family-Radius.md` → button radius (typically md)
- **Border**: `Token-Family-Border.md` → button borders (thin for outlined variants)

### Card Component
- **Shadow**: `Token-Family-Shadow.md` → elevation (sm, md for cards)
- **Radius**: `Token-Family-Radius.md` → card radius (lg)
- **Spacing**: `Token-Family-Spacing.md` → inset and stack patterns
- **Border**: `Token-Family-Border.md` → card borders (thin)
- **Color**: `Token-Family-Color.md` → `color.structure.surface`, `color.structure.border`

### Form Input
- **Typography**: `Token-Family-Typography.md` → body sizes for input text
- **Border**: `Token-Family-Border.md` → input borders (thin, medium for focus)
- **Radius**: `Token-Family-Radius.md` → input radius (sm, md)
- **Spacing**: `Token-Family-Spacing.md` → inset for padding
- **Color**: `Token-Family-Color.md` → `color.feedback.error.text`, `color.feedback.success.text` for validation
- **Accessibility**: `Token-Family-Accessibility.md` → focus indicators, tap areas

### Alert/Notification
- **Color**: `Token-Family-Color.md` → Feedback concept tokens:
  - Success: `color.feedback.success.{text|background|border}`
  - Error: `color.feedback.error.{text|background|border}`
  - Warning: `color.feedback.warning.{text|background|border}`
  - Info: `color.feedback.info.{text|background|border}`
- **Radius**: `Token-Family-Radius.md` → alert radius (md)
- **Spacing**: `Token-Family-Spacing.md` → inset patterns

### Avatar Component
- **Color**: `Token-Family-Color.md` → Identity and Contrast concepts:
  - Human: `color.avatar.human.background`, `color.avatar.human.icon`
  - Agent: `color.avatar.agent.background`, `color.avatar.agent.icon`
  - Border: `color.avatar.default.border`
- **Radius**: `Token-Family-Radius.md` → full (circular)

### Modal/Dialog
- **Shadow**: `Token-Family-Shadow.md` → elevation (xl for modals)
- **Layering**: `Token-Family-Layering.md` → modal z-index layer
- **Opacity**: `Token-Family-Opacity.md` → backdrop overlay
- **Radius**: `Token-Family-Radius.md` → modal radius (lg, xl)
- **Motion**: `Token-Family-Motion.md` → enter/exit animations
- **Color**: `Token-Family-Color.md` → `color.structure.surface` for modal background

### Interactive States
- **Opacity**: `Token-Family-Opacity.md` → disabled states, hover effects
- **Color**: `Token-Family-Color.md` → `color.feedback.select.*` for selection states
- **Motion**: `Token-Family-Motion.md` → transition timing
- **Accessibility**: `Token-Family-Accessibility.md` → focus ring tokens

### Responsive Layout
- **Responsive**: `Token-Family-Responsive.md` → breakpoints for layout changes
- **Spacing**: `Token-Family-Spacing.md` → responsive spacing adjustments
- **Typography**: `Token-Family-Typography.md` → responsive font scaling

## MCP Query Examples

Use these MCP queries to access token documentation progressively:

### Get Document Summary
Returns metadata and outline (~200 tokens) to understand document structure:

```
get_document_summary({ path: ".kiro/steering/Token-Family-Color.md" })
get_document_summary({ path: ".kiro/steering/Token-Family-Spacing.md" })
get_document_summary({ path: ".kiro/steering/Token-Family-Typography.md" })
```

### Get Specific Section
Returns targeted content (~2,000 tokens) for specific information:

```
// Get color concept tokens by category
get_section({ path: ".kiro/steering/Token-Family-Color.md", heading: "Feedback Concept" })
get_section({ path: ".kiro/steering/Token-Family-Color.md", heading: "Identity Concept" })
get_section({ path: ".kiro/steering/Token-Family-Color.md", heading: "Action Concept" })
get_section({ path: ".kiro/steering/Token-Family-Color.md", heading: "Contrast Concept" })
get_section({ path: ".kiro/steering/Token-Family-Color.md", heading: "Structure Concept" })

// Get component-specific color tokens
get_section({ path: ".kiro/steering/Token-Family-Color.md", heading: "Component Tokens" })

// Get primitive color families
get_section({ path: ".kiro/steering/Token-Family-Color.md", heading: "Primitive Color Families" })

// Get spacing scale values
get_section({ path: ".kiro/steering/Token-Family-Spacing.md", heading: "Spacing Scale" })

// Get typography composition patterns
get_section({ path: ".kiro/steering/Token-Family-Typography.md", heading: "Typography Composition" })

// Get shadow elevation levels
get_section({ path: ".kiro/steering/Token-Family-Shadow.md", heading: "Shadow Scale" })

// Get radius values
get_section({ path: ".kiro/steering/Token-Family-Radius.md", heading: "Primitive Radius Tokens" })

// Get border width values
get_section({ path: ".kiro/steering/Token-Family-Border.md", heading: "Primitive Border Width Tokens" })

// Get opacity values
get_section({ path: ".kiro/steering/Token-Family-Opacity.md", heading: "Primitive Opacity Tokens" })

// Get breakpoint values
get_section({ path: ".kiro/steering/Token-Family-Responsive.md", heading: "Breakpoint Tokens" })

// Get tap area requirements
get_section({ path: ".kiro/steering/Token-Family-Accessibility.md", heading: "Tap Area Tokens" })
```

### Get Full Document
Returns complete content (2,000-15,000 tokens) when comprehensive reference needed:

```
get_document_full({ path: ".kiro/steering/Token-Family-Color.md" })
```

### Recommended Workflow

1. **Start with this Quick Reference** to identify which token docs you need
2. **Use the Color Token Concept Lookup** to find the right concept for your use case
3. **Query document summary** to understand structure
4. **Query specific sections** for targeted information
5. **Query full document** only when comprehensive reference is required

### Color Token Selection Decision Tree

```
What are you building?
├─ Status/Feedback UI (alerts, validation, notifications)
│   └─ Use: color.feedback.{success|error|warning|info}.{text|background|border}
├─ Selection/Toggle UI (checkboxes, radio, tabs)
│   └─ Use: color.feedback.select.{text|background|border}.{rest|default}
├─ Entity Distinction (avatars, attribution)
│   └─ Use: color.identity.{human|agent}
├─ Interactive Elements (buttons, links)
│   └─ Use: color.action.{primary|secondary}
├─ Content on Colored Backgrounds
│   └─ Use: color.contrast.{onLight|onDark}
└─ Page Structure (backgrounds, surfaces, borders)
    └─ Use: color.structure.{canvas|surface|border}
```
