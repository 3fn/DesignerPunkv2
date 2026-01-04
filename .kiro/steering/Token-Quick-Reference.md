---
inclusion: manual
---

# Token Quick Reference

**Date**: 2025-12-01
**Purpose**: Routing table for token documentation - helps AI agents find the right MCP document for each token type
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, token-selection, styling
**Last Reviewed**: 2026-01-01

---

## Token System Overview

For comprehensive understanding of the token system architecture, mathematical foundations, and cross-platform strategy, see:
- **Token System Overview**: `docs/token-system-overview.md`

## Purpose

This document serves as a routing table for token documentation—it helps AI agents quickly find the right MCP document for each token type without loading full reference docs. This is not a reference itself; it routes to where values are documented.

## Token Documentation Map

| Token Type | Purpose | MCP Document Path |
|------------|---------|-------------------|
| Color | Semantic color palette for UI elements (primary, secondary, error, success, warning, info) | `.kiro/steering/Token-Family-Color.md` |
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

## Common Patterns

These are frequently used token combinations for common UI scenarios:

### Button Component
- **Typography**: `Token-Family-Typography.md` → label sizes (labelSm, labelMd, labelLg)
- **Spacing**: `Token-Family-Spacing.md` → inset patterns for padding
- **Color**: `Token-Family-Color.md` → primary, secondary, error semantic colors
- **Radius**: `Token-Family-Radius.md` → button radius (typically md)
- **Border**: `Token-Family-Border.md` → button borders (thin for outlined variants)

### Card Component
- **Shadow**: `Token-Family-Shadow.md` → elevation (sm, md for cards)
- **Radius**: `Token-Family-Radius.md` → card radius (lg)
- **Spacing**: `Token-Family-Spacing.md` → inset and stack patterns
- **Border**: `Token-Family-Border.md` → card borders (thin)
- **Color**: `Token-Family-Color.md` → surface and background colors

### Form Input
- **Typography**: `Token-Family-Typography.md` → body sizes for input text
- **Border**: `Token-Family-Border.md` → input borders (thin, medium for focus)
- **Radius**: `Token-Family-Radius.md` → input radius (sm, md)
- **Spacing**: `Token-Family-Spacing.md` → inset for padding
- **Accessibility**: `Token-Family-Accessibility.md` → focus indicators, tap areas

### Modal/Dialog
- **Shadow**: `Token-Family-Shadow.md` → elevation (xl for modals)
- **Layering**: `Token-Family-Layering.md` → modal z-index layer
- **Opacity**: `Token-Family-Opacity.md` → backdrop overlay
- **Radius**: `Token-Family-Radius.md` → modal radius (lg, xl)
- **Motion**: `Token-Family-Motion.md` → enter/exit animations

### Interactive States
- **Opacity**: `Token-Family-Opacity.md` → disabled states, hover effects
- **Color**: `Token-Family-Color.md` → hover, active, focus colors
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
// Get spacing scale values
get_section({ path: ".kiro/steering/Token-Family-Spacing.md", heading: "Spacing Scale" })

// Get semantic color definitions
get_section({ path: ".kiro/steering/Token-Family-Color.md", heading: "Semantic Colors" })

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
2. **Query document summary** to understand structure
3. **Query specific sections** for targeted information
4. **Query full document** only when comprehensive reference is required
