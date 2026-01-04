---
inclusion: manual
---

# Component Quick Reference

**Date**: 2026-01-01
**Purpose**: Routing table for component documentation - helps AI agents find the right MCP document for each component family
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, ui-composition, feature-building
**Last Reviewed**: 2026-01-02

---

## Stemma System Overview

For comprehensive understanding of the Stemma System architecture, family inheritance patterns, and cross-platform strategy, see:
- **Stemma System Principles**: `.kiro/steering/stemma-system-principles.md`
- **Component Schema Format**: `.kiro/steering/Component-Schema-Format.md`

## Purpose

This document serves as a routing table for component documentation—it helps AI agents quickly find the right MCP document for each component family without loading full reference docs. This is not a reference itself; it routes to where component details are documented.

## Component Documentation Map

All 11 component families have MCP-queryable documentation. Production families have full implementation details; placeholder families have structural definitions for future development.

| Component Family | Shared Need/Purpose | MCP Document Path | Status |
|------------------|---------------------|-------------------|--------|
| Buttons | User interaction and actions | `.kiro/steering/Component-Family-Button.md` | 🟢 Production |
| Form Inputs | Data collection and validation | `.kiro/steering/Component-Family-Form-Inputs.md` | 🟢 Production |
| Containers | Layout and content organization | `.kiro/steering/Component-Family-Container.md` | 🟢 Production |
| Icons | Visual communication | `.kiro/steering/Component-Family-Icon.md` | 🟢 Production |
| Modals | Overlay interactions | `.kiro/steering/Component-Family-Modal.md` | 🔴 Placeholder |
| Avatars | Identity representation | `.kiro/steering/Component-Family-Avatar.md` | 🔴 Placeholder |
| Badges & Tags | Status and labeling | `.kiro/steering/Component-Family-Badge.md` | 🔴 Placeholder |
| Data Displays | Information presentation | `.kiro/steering/Component-Family-Data-Display.md` | 🔴 Placeholder |
| Dividers | Visual separation | `.kiro/steering/Component-Family-Divider.md` | 🔴 Placeholder |
| Loading | Progress indication | `.kiro/steering/Component-Family-Loading.md` | 🔴 Placeholder |
| Navigation | Wayfinding | `.kiro/steering/Component-Family-Navigation.md` | 🔴 Placeholder |

**Status Legend**: 🟢 Production Ready | 🟡 Beta | 🔴 Placeholder | ⚠️ Deprecated

**Family Count**: 4 Production Ready, 7 Placeholder (structural definitions for future development)

## Naming Convention

Components follow the **[Family]-[Type]-[Variant]** pattern:
- **Primitives**: Use "Base" suffix when semantic variants exist (e.g., `Input-Text-Base`, `Container-Base`, `Icon-Base`)
- **Standalone Components**: No suffix when no behavioral variants exist (e.g., `Button-CTA`)
- **Semantics**: Use descriptive variants (e.g., `Input-Text-Email`, `Input-Text-Password`)

**Key Distinction**: The `-Base` suffix indicates a primitive that serves as foundation for semantic variants. Standalone components like `Button-CTA` don't need `-Base` because styling is handled via props, not behavioral inheritance.

## Common Composition Patterns

### Login Form
- **Form Inputs**: `Input-Text-Email`, `Input-Text-Password`
- **Buttons**: `Button-CTA` (submit, variant="primary")
- **Containers**: `Container-Base` (form wrapper)
- **Tokens**: `Token-Family-Spacing.md` → stack patterns, `Token-Family-Color.md` → form colors

### Feed Post
- **Avatars**: `Avatar-Base` (planned)
- **Buttons**: `Button-CTA` (variant="secondary" for actions)
- **Data Displays**: `Display-Base` (planned)
- **Containers**: `Container-Base` (card wrapper)
- **Tokens**: `Token-Family-Shadow.md` → card elevation, `Token-Family-Spacing.md` → content spacing

### Settings Panel
- **Form Inputs**: `Input-Text-Base` (for custom inputs)
- **Containers**: `Container-Base` (section wrapper)
- **Dividers**: `Divider-Base` (planned)
- **Navigation**: `Nav-Base` (planned)
- **Tokens**: `Token-Family-Layering.md` → panel stacking, `Token-Family-Radius.md` → section corners

## MCP Query Examples

Use these MCP queries to access component documentation progressively via the `designerpunk-docs` MCP server.

### Progressive Disclosure Workflow

The MCP documentation server supports a three-stage progressive disclosure workflow that optimizes token usage:

| Stage | Tool | Token Cost | Use When |
|-------|------|------------|----------|
| 1. Summary | `get_document_summary` | ~200 tokens | Understanding document structure |
| 2. Section | `get_section` | ~500-2,000 tokens | Getting targeted information |
| 3. Full | `get_document_full` | ~2,000-10,000 tokens | Comprehensive reference needed |

**Key Principle**: Start with summaries, drill into sections, only load full documents when necessary.

### Stage 1: Get Document Summary

Returns metadata and outline (~200 tokens) to understand document structure before loading full content:

```
// Understand Form Inputs family structure
get_document_summary({ path: ".kiro/steering/Component-Family-Form-Inputs.md" })

// Understand Button family structure
get_document_summary({ path: ".kiro/steering/Component-Family-Button.md" })

// Understand Container family structure
get_document_summary({ path: ".kiro/steering/Component-Family-Container.md" })

// Understand Icon family structure
get_document_summary({ path: ".kiro/steering/Component-Family-Icon.md" })
```

**Returns**: Document metadata (purpose, layer, relevant tasks) plus section outline with headings.

### Stage 2: Get Specific Section

Returns targeted content (~500-2,000 tokens) for specific information needs:

```
// Get component behavioral contracts
get_section({ path: ".kiro/steering/Component-Family-Form-Inputs.md", heading: "Behavioral Contracts" })

// Get inheritance structure
get_section({ path: ".kiro/steering/Component-Family-Button.md", heading: "Inheritance Structure" })

// Get token dependencies
get_section({ path: ".kiro/steering/Component-Family-Container.md", heading: "Token Dependencies" })

// Get usage guidelines
get_section({ path: ".kiro/steering/Component-Family-Icon.md", heading: "Usage Guidelines" })

// Get cross-platform notes
get_section({ path: ".kiro/steering/Component-Family-Form-Inputs.md", heading: "Cross-Platform Notes" })

// Get component schema definitions
get_section({ path: ".kiro/steering/Component-Family-Button.md", heading: "Component Schemas" })

// Get placeholder family planned characteristics
get_section({ path: ".kiro/steering/Component-Family-Modal.md", heading: "Planned Characteristics" })
```

**Returns**: Section content with parent heading context for document location.

### Stage 3: Get Full Document

Returns complete content (~2,000-10,000 tokens) when comprehensive reference is required:

```
// Full Form Inputs family reference
get_document_full({ path: ".kiro/steering/Component-Family-Form-Inputs.md" })

// Full Button family reference
get_document_full({ path: ".kiro/steering/Component-Family-Button.md" })
```

**Use sparingly**: Only when you need complete component family documentation.

### Additional MCP Tools

The `designerpunk-docs` server provides additional tools for documentation management:

```
// Get complete documentation map with all documents organized by layer
get_documentation_map()

// List cross-references in a document
list_cross_references({ path: ".kiro/steering/Component-Family-Form-Inputs.md" })

// Validate document metadata schema
validate_metadata({ path: ".kiro/steering/Component-Family-Button.md" })

// Check documentation index health
get_index_health()

// Rebuild index if corrupted or out of sync
rebuild_index()
```

### Recommended Workflow

**For Component Selection:**
1. **Start with this Quick Reference** to identify which component family you need
2. **Query document summary** to understand the family's structure and available sections
3. **Query specific sections** for behavioral contracts, inheritance, or token dependencies
4. **Query full document** only when building complex compositions requiring comprehensive reference

**For Building UI Compositions:**
1. **Identify components** from Common Composition Patterns above
2. **Query behavioral contracts** for each component to understand interactions
3. **Query token dependencies** to ensure consistent styling
4. **Cross-reference with Token Quick Reference** for token-specific guidance

**Example: Building a Login Form:**
```
// Step 1: Get Form Inputs overview
get_document_summary({ path: ".kiro/steering/Component-Family-Form-Inputs.md" })

// Step 2: Get specific component contracts
get_section({ path: ".kiro/steering/Component-Family-Form-Inputs.md", heading: "Input-Text-Email" })
get_section({ path: ".kiro/steering/Component-Family-Form-Inputs.md", heading: "Input-Text-Password" })

// Step 3: Get button for submit action
get_section({ path: ".kiro/steering/Component-Family-Button.md", heading: "Button-CTA" })

// Step 4: Get container for layout
get_section({ path: ".kiro/steering/Component-Family-Container.md", heading: "Container-Base" })
```

## Related Documentation

- **Primitive vs Semantic Philosophy**: `.kiro/steering/Component-Primitive-vs-Semantic-Philosophy.md`
- **Component Readiness System**: `.kiro/steering/Component-Readiness-Status.md`
- **Token Quick Reference**: `.kiro/steering/Token-Quick-Reference.md`
- **MCP Component Family Document Template**: `.kiro/steering/Component-MCP-Document-Template.md` - Template for creating new family documentation
