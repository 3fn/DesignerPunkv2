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
| Color | Semantic color palette for UI elements (primary, secondary, error, success, warning, info) | `.kiro/steering/color-tokens.md` |
| Spacing | Layout spacing values based on 8px baseline grid (stack, inline, inset patterns) | `.kiro/steering/spacing-tokens.md` |
| Typography | Font styles and sizes combining fontSize, lineHeight, fontFamily, fontWeight, letterSpacing | `.kiro/steering/typography-tokens.md` |
| Shadow | Elevation shadows for depth and hierarchy (sm, md, lg, xl levels) | `.kiro/steering/shadow-tokens.md` |
| Glow | Glow effects for emphasis and interactive states | `.kiro/steering/glow-tokens.md` |
| Blend | Color blending and overlay effects | `.kiro/steering/blend-tokens.md` |
| Layering | Z-index layers for stacking context (base, dropdown, modal, toast, tooltip) | `.kiro/steering/layering-tokens.md` |
| Motion | Animation timing and easing (duration, easing curves, transitions) | `.kiro/steering/motion-tokens.md` |
| Radius | Corner rounding values (none, sm, md, lg, xl, full) | `.kiro/steering/radius-tokens.md` |
| Border | Border width values (none, thin, medium, thick) for form elements, cards, dividers | `.kiro/steering/border-tokens.md` |
| Opacity | Transparency values for overlays, disabled states, hover effects | `.kiro/steering/opacity-tokens.md` |
| Accessibility | Focus indicators, tap area sizing (WCAG compliance), icon tokens | `.kiro/steering/accessibility-tokens.md` |
| Responsive | Breakpoints (xs-xxl) and density scaling (compact, normal, comfortable) | `.kiro/steering/responsive-tokens.md` |
| Semantic Structure | Token architecture patterns and primitive→semantic hierarchy | `.kiro/steering/semantic-token-structure.md` |

## Common Patterns

These are frequently used token combinations for common UI scenarios:

### Button Component
- **Typography**: `typography-tokens.md` → label sizes (labelSm, labelMd, labelLg)
- **Spacing**: `spacing-tokens.md` → inset patterns for padding
- **Color**: `color-tokens.md` → primary, secondary, error semantic colors
- **Radius**: `radius-tokens.md` → button radius (typically md)
- **Border**: `border-tokens.md` → button borders (thin for outlined variants)

### Card Component
- **Shadow**: `shadow-tokens.md` → elevation (sm, md for cards)
- **Radius**: `radius-tokens.md` → card radius (lg)
- **Spacing**: `spacing-tokens.md` → inset and stack patterns
- **Border**: `border-tokens.md` → card borders (thin)
- **Color**: `color-tokens.md` → surface and background colors

### Form Input
- **Typography**: `typography-tokens.md` → body sizes for input text
- **Border**: `border-tokens.md` → input borders (thin, medium for focus)
- **Radius**: `radius-tokens.md` → input radius (sm, md)
- **Spacing**: `spacing-tokens.md` → inset for padding
- **Accessibility**: `accessibility-tokens.md` → focus indicators, tap areas

### Modal/Dialog
- **Shadow**: `shadow-tokens.md` → elevation (xl for modals)
- **Layering**: `layering-tokens.md` → modal z-index layer
- **Opacity**: `opacity-tokens.md` → backdrop overlay
- **Radius**: `radius-tokens.md` → modal radius (lg, xl)
- **Motion**: `motion-tokens.md` → enter/exit animations

### Interactive States
- **Opacity**: `opacity-tokens.md` → disabled states, hover effects
- **Color**: `color-tokens.md` → hover, active, focus colors
- **Motion**: `motion-tokens.md` → transition timing
- **Accessibility**: `accessibility-tokens.md` → focus ring tokens

### Responsive Layout
- **Responsive**: `responsive-tokens.md` → breakpoints for layout changes
- **Spacing**: `spacing-tokens.md` → responsive spacing adjustments
- **Typography**: `typography-tokens.md` → responsive font scaling

## MCP Query Examples

Use these MCP queries to access token documentation progressively:

### Get Document Summary
Returns metadata and outline (~200 tokens) to understand document structure:

```
get_document_summary({ path: ".kiro/steering/color-tokens.md" })
get_document_summary({ path: ".kiro/steering/spacing-tokens.md" })
get_document_summary({ path: ".kiro/steering/typography-tokens.md" })
```

### Get Specific Section
Returns targeted content (~2,000 tokens) for specific information:

```
// Get spacing scale values
get_section({ path: ".kiro/steering/spacing-tokens.md", heading: "Spacing Scale" })

// Get semantic color definitions
get_section({ path: ".kiro/steering/color-tokens.md", heading: "Semantic Colors" })

// Get typography composition patterns
get_section({ path: ".kiro/steering/typography-tokens.md", heading: "Typography Composition" })

// Get shadow elevation levels
get_section({ path: ".kiro/steering/shadow-tokens.md", heading: "Shadow Scale" })

// Get radius values
get_section({ path: ".kiro/steering/radius-tokens.md", heading: "Primitive Radius Tokens" })

// Get border width values
get_section({ path: ".kiro/steering/border-tokens.md", heading: "Primitive Border Width Tokens" })

// Get opacity values
get_section({ path: ".kiro/steering/opacity-tokens.md", heading: "Primitive Opacity Tokens" })

// Get breakpoint values
get_section({ path: ".kiro/steering/responsive-tokens.md", heading: "Breakpoint Tokens" })

// Get tap area requirements
get_section({ path: ".kiro/steering/accessibility-tokens.md", heading: "Tap Area Tokens" })
```

### Get Full Document
Returns complete content (2,000-15,000 tokens) when comprehensive reference needed:

```
get_document_full({ path: ".kiro/steering/color-tokens.md" })
```

### Recommended Workflow

1. **Start with this Quick Reference** to identify which token docs you need
2. **Query document summary** to understand structure
3. **Query specific sections** for targeted information
4. **Query full document** only when comprehensive reference is required
