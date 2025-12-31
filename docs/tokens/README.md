# Token Documentation

Token documentation has moved to `.kiro/steering/` for MCP integration.

## Why the Change

Spec 032 (Documentation Architecture Audit) consolidated token documentation into the steering system to enable progressive disclosure via MCP. This architectural decision:

- Enables AI agents to query token documentation efficiently through the MCP Documentation Server
- Supports progressive disclosure (summary → section → full document)
- Reduces context overhead by loading only what's needed
- Integrates token guidance with the broader steering documentation system

## How to Access Token Docs

### For AI Agents

Query via MCP using progressive disclosure:

```javascript
// Step 1: Get document summary (~200 tokens)
get_document_summary({ path: ".kiro/steering/color-tokens.md" })

// Step 2: Get specific section (~2,000 tokens)
get_section({ path: ".kiro/steering/color-tokens.md", heading: "Semantic Colors" })

// Step 3: Get full document (only if needed)
get_document_full({ path: ".kiro/steering/color-tokens.md" })
```

See `.kiro/steering/Token Quick Reference.md` for the complete routing table that maps token types to their documentation.

### For Human Developers

Token documentation files are located in `.kiro/steering/`:

**Core Token Documentation:**
- `color-tokens.md` - Semantic color palette for UI elements
- `spacing-tokens.md` - Layout spacing values (stack, inline, inset patterns)
- `typography-tokens.md` - Font styles and sizes
- `shadow-tokens.md` - Elevation shadows for depth and hierarchy
- `glow-tokens.md` - Glow effects for emphasis and interactive states
- `blend-tokens.md` - Color blending and overlay effects
- `layering-tokens.md` - Z-index layers for stacking context
- `motion-tokens.md` - Animation timing and easing

**Layout & Structure:**
- `radius-tokens.md` - Corner rounding values
- `border-tokens.md` - Border width values

**Effects & Interaction:**
- `opacity-tokens.md` - Transparency values for overlays and states
- `accessibility-tokens.md` - Focus indicators, tap areas, icon tokens

**Responsive Design:**
- `responsive-tokens.md` - Breakpoints and density scaling

**Architecture:**
- `semantic-token-structure.md` - Token architecture patterns and hierarchy
- `Token Quick Reference.md` - Routing table for all token documentation
- `Token Resolution Patterns.md` - Token resolution and selection patterns

## Reference

This documentation consolidation was implemented as part of **Spec 032: Documentation Architecture Audit**. For details on the architectural decision, see:
- `.kiro/specs/032-documentation-architecture-audit/design.md`
