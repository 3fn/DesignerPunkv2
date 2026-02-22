# Figma Component Generation — Exploration

**Date**: 2026-02-21
**Status**: Exploration / Proof of Concept
**Purpose**: Evaluate feasibility of automated Figma component generation for initial library setup

---

## Overview

This exploration tests whether Console MCP's `figma_execute` tool can generate useful Figma components from DesignerPunk component definitions. The goal is to accelerate initial library setup by creating component shells that designers can refine.

**Key Question**: Is automated generation faster than manual creation, or does it create more work?

---

## Approach

### Phase 1: Single Component Test

Generate `Button-CTA-Primary` with:
- Auto-layout frame (horizontal, centered)
- Token variable bindings (color, spacing, radius)
- Text style binding (typography)
- Effect style binding (shadow)

**Script**: `scripts/figma-component-generator.ts`

**Run**: `npm run figma:generate-component`

### Phase 2: Evaluation

After generation, evaluate:

| Criterion | Question | Pass/Fail |
|-----------|----------|-----------|
| **Structure** | Is the component structure logical and usable? | |
| **Token Bindings** | Are variables/styles correctly bound? | |
| **Layout** | Does auto-layout work as expected? | |
| **Refinement Time** | How long to make it production-ready? | |
| **Designer Feedback** | Would designers prefer this or manual creation? | |

### Phase 3: Decision

Based on evaluation:

**If promising (< 10 min refinement per component):**
- Extend to all Button variants
- Generate other simple components (Badge, Chip)
- Build component set generation (variants)
- Document as optional library setup workflow

**If marginal (10-30 min refinement):**
- Use only for naming/structure scaffolding
- Designers rebuild visuals manually
- Document as "not recommended"

**If not useful (> 30 min refinement):**
- Abandon automated generation
- Stick with manual Figma creation
- Document findings for future reference

---

## Current Implementation

### What Gets Generated

The exploration script generates a `Button-CTA-Primary` component with:

**Structure:**
```
Button-CTA-Primary (Component)
├─ Auto-layout: horizontal, centered
├─ Padding: space/inset/spacious (horizontal), space/inset/normal (vertical)
├─ Background: color/primary (variable binding)
├─ Corner radius: radius/100 (variable binding)
├─ Shadow: shadow.container (effect style binding)
└─ Label (Text)
   ├─ Text style: typography.bodyMd (text style binding)
   └─ Color: color/contrast/onPrimary (variable binding)
```

**Token Bindings:**
- `color/primary` → Background fill
- `color/contrast/onPrimary` → Text color
- `space/inset/spacious` → Horizontal padding
- `space/inset/normal` → Vertical padding
- `radius/100` → Corner radius
- `typography.bodyMd` → Text style
- `shadow.container` → Effect style

### What's NOT Generated

- Hover/focus/pressed states (requires variants or interactive components)
- Icon support (requires conditional logic)
- Size variants (requires component set)
- Responsive constraints (requires manual setup)
- Accessibility properties (requires manual annotation)

---

## Plugin API Capabilities Used

The script demonstrates these Plugin API features:

**Component Creation:**
- `figma.createComponent()` — Create component node
- `figma.createText()` — Create text node

**Auto-Layout:**
- `layoutMode = "HORIZONTAL"` — Horizontal auto-layout
- `primaryAxisAlignItems = "CENTER"` — Center content
- `paddingLeft/Right/Top/Bottom` — Padding values

**Variable Bindings:**
- `figma.variables.getLocalVariables()` — Find variables by name
- `boundVariables: { color: { type: 'VARIABLE_ALIAS', id } }` — Bind variable to property

**Style Bindings:**
- `figma.getLocalTextStyles()` — Find text styles
- `figma.getLocalEffectStyles()` — Find effect styles
- `textStyleId = style.id` — Bind text style
- `effectStyleId = style.id` — Bind effect style

---

## Prerequisites

Before running the exploration script:

1. **Tokens pushed to Figma**: `npm run figma:push`
2. **Figma Desktop running**: Not the browser version
3. **Desktop Bridge active**: Plugins → Development → Figma Desktop Bridge
4. **Environment variables set**: `FIGMA_FILE_KEY`, `FIGMA_ACCESS_TOKEN` in `.env`

---

## Expected Output

**Console output:**
```
🚀 Figma Component Generator (Exploration)

Generating: Button-CTA-Primary
File: <your-file-key>

📡 Connecting to Figma Desktop Bridge...

✅ Component created successfully!

Result: {
  "success": true,
  "componentId": "123:456",
  "componentName": "Button-CTA-Primary",
  "tokenBindings": {
    "background": "color/primary",
    "textColor": "color/contrast/onPrimary",
    "textStyle": "typography.bodyMd",
    "paddingHorizontal": "space/inset/spacious",
    "paddingVertical": "space/inset/normal",
    "radius": "radius/100",
    "shadow": "shadow.container"
  }
}

📋 Next steps:
  1. Open your Figma file to see the generated component
  2. Evaluate the structure, layout, and token bindings
  3. Note what needs manual refinement
  4. Decide if this approach is useful for library setup
```

**In Figma:**
- New component appears at (0, 0) on the canvas
- Component has proper auto-layout
- All token bindings are active (hover over properties to see variable names)
- Text style and effect style are applied

---

## Evaluation Criteria

### Structure Quality

**Good signs:**
- Component hierarchy makes sense
- Auto-layout works correctly
- Naming is clear and consistent

**Bad signs:**
- Nested frames are unnecessary
- Layout breaks when resizing
- Names are confusing or generic

### Token Binding Accuracy

**Good signs:**
- All expected variables are bound
- Styles are applied correctly
- Bindings survive component duplication

**Bad signs:**
- Hard-coded values instead of variables
- Wrong variables bound to properties
- Bindings break when editing

### Refinement Effort

**Acceptable (< 10 min):**
- Adjust spacing slightly
- Add constraints for responsiveness
- Polish visual details

**Marginal (10-30 min):**
- Rebuild auto-layout structure
- Rebind multiple variables
- Fix broken layout behavior

**Not useful (> 30 min):**
- Easier to start from scratch
- Generated structure is wrong
- More work than manual creation

---

## Next Steps After Evaluation

### If Promising

1. **Extend to variants**: Generate all Button-CTA variants (secondary, tertiary)
2. **Add component sets**: Generate variant component sets with properties
3. **Generate other families**: Badge, Chip, Container components
4. **Document workflow**: Add to Figma Workflow Guide as optional setup step
5. **Build CLI tool**: `npm run figma:generate-library` for full library generation

### If Not Useful

1. **Document findings**: What worked, what didn't, why
2. **Archive script**: Keep for reference but don't recommend
3. **Update Figma Workflow Guide**: Note that manual creation is preferred
4. **Focus on extraction**: Invest in improving design extraction workflow instead

---

## Related Documentation

- [Figma Workflow Guide](./../.kiro/steering/Figma-Workflow-Guide.md) — Token push and design extraction workflows
- [Component Development Guide](./../.kiro/steering/Component-Development-Guide.md) — Component implementation guidance
- [Spec 054a Design](./../.kiro/specs/054a-figma-token-push/design.md) — Token push architecture
- [Spec 054b Design](./../.kiro/specs/054b-figma-design-extract/design.md) — Design extraction architecture

---

**Status**: Ready for testing. Run `npm run figma:generate-component` and evaluate results.
