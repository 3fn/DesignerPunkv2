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
**Last Reviewed**: 2026-01-01

---

## Stemma System Overview

For comprehensive understanding of the Stemma System architecture, family inheritance patterns, and cross-platform strategy, see:
- **Stemma System Principles**: `.kiro/steering/stemma-system-principles.md`
- **Component Schema Format**: `.kiro/steering/component-schema-format.md`

## Purpose

This document serves as a routing table for component documentation—it helps AI agents quickly find the right MCP document for each component family without loading full reference docs. This is not a reference itself; it routes to where component details are documented.

## Component Documentation Map

| Component Family | Shared Need/Purpose | MCP Document Path | Status |
|------------------|---------------------|-------------------|--------|
| Buttons | User interaction and actions | `.kiro/steering/button-components.md` | 🟢 Production |
| Form Inputs | Data collection and validation | `.kiro/steering/form-inputs-components.md` | 🟢 Production |
| Containers | Layout and content organization | `.kiro/steering/container-components.md` | 🟢 Production |
| Icons | Visual communication | `.kiro/steering/icon-components.md` | 🟢 Production |
| Modals | Overlay interactions | `.kiro/steering/modal-components.md` | 🔴 Placeholder |
| Avatars | Identity representation | `.kiro/steering/avatar-components.md` | 🔴 Placeholder |
| Badges & Tags | Status and labeling | `.kiro/steering/badge-components.md` | 🔴 Placeholder |
| Data Displays | Information presentation | `.kiro/steering/data-display-components.md` | 🔴 Placeholder |
| Dividers | Visual separation | `.kiro/steering/divider-components.md` | 🔴 Placeholder |
| Loading | Progress indication | `.kiro/steering/loading-components.md` | 🔴 Placeholder |
| Navigation | Wayfinding | `.kiro/steering/navigation-components.md` | 🔴 Placeholder |

**Status Legend**: 🟢 Production Ready | 🟡 Beta | 🔴 Placeholder | ⚠️ Deprecated

## Naming Convention

Components follow the **[Family]-[Type]-[Variant]** pattern:
- **Primitives**: Use "Base" suffix (e.g., `Input-Text-Base`, `Button-CTA-Primary`)
- **Semantics**: Use descriptive variants (e.g., `Input-Text-Email`, `Input-Text-Password`)

## Common Composition Patterns

### Login Form
- **Form Inputs**: `Input-Text-Email`, `Input-Text-Password`
- **Buttons**: `Button-CTA-Primary` (submit)
- **Containers**: `Container-Layout-Base` (form wrapper)
- **Tokens**: `spacing-tokens.md` → stack patterns, `color-tokens.md` → form colors

### Feed Post
- **Avatars**: `Avatar-User-Base`
- **Buttons**: `Button-Icon-Base`, `Button-CTA-Secondary`
- **Data Displays**: `Display-Text-Base`, `Display-Media-Base`
- **Containers**: `Container-Card-Base`
- **Tokens**: `shadow-tokens.md` → card elevation, `spacing-tokens.md` → content spacing

### Settings Panel
- **Form Inputs**: `Input-Text-Base`, `Input-Toggle-Base`
- **Containers**: `Container-Section-Base`
- **Dividers**: `Divider-Horizontal-Base`
- **Navigation**: `Nav-List-Base`
- **Tokens**: `layering-tokens.md` → panel stacking, `radius-tokens.md` → section corners

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
get_document_summary({ path: ".kiro/steering/form-inputs-components.md" })

// Understand Button family structure
get_document_summary({ path: ".kiro/steering/button-components.md" })

// Understand Container family structure
get_document_summary({ path: ".kiro/steering/container-components.md" })

// Understand Icon family structure
get_document_summary({ path: ".kiro/steering/icon-components.md" })
```

**Returns**: Document metadata (purpose, layer, relevant tasks) plus section outline with headings.

### Stage 2: Get Specific Section

Returns targeted content (~500-2,000 tokens) for specific information needs:

```
// Get component behavioral contracts
get_section({ path: ".kiro/steering/form-inputs-components.md", heading: "Behavioral Contracts" })

// Get inheritance structure
get_section({ path: ".kiro/steering/button-components.md", heading: "Inheritance Structure" })

// Get token dependencies
get_section({ path: ".kiro/steering/container-components.md", heading: "Token Dependencies" })

// Get usage guidelines
get_section({ path: ".kiro/steering/icon-components.md", heading: "Usage Guidelines" })

// Get cross-platform notes
get_section({ path: ".kiro/steering/form-inputs-components.md", heading: "Cross-Platform Notes" })

// Get component schema definitions
get_section({ path: ".kiro/steering/button-components.md", heading: "Component Schemas" })
```

**Returns**: Section content with parent heading context for document location.

### Stage 3: Get Full Document

Returns complete content (~2,000-10,000 tokens) when comprehensive reference is required:

```
// Full Form Inputs family reference
get_document_full({ path: ".kiro/steering/form-inputs-components.md" })

// Full Button family reference
get_document_full({ path: ".kiro/steering/button-components.md" })
```

**Use sparingly**: Only when you need complete component family documentation.

### Additional MCP Tools

The `designerpunk-docs` server provides additional tools for documentation management:

```
// Get complete documentation map with all documents organized by layer
get_documentation_map()

// List cross-references in a document
list_cross_references({ path: ".kiro/steering/form-inputs-components.md" })

// Validate document metadata schema
validate_metadata({ path: ".kiro/steering/button-components.md" })

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
get_document_summary({ path: ".kiro/steering/form-inputs-components.md" })

// Step 2: Get specific component contracts
get_section({ path: ".kiro/steering/form-inputs-components.md", heading: "Input-Text-Email" })
get_section({ path: ".kiro/steering/form-inputs-components.md", heading: "Input-Text-Password" })

// Step 3: Get button for submit action
get_section({ path: ".kiro/steering/button-components.md", heading: "Button-CTA-Primary" })

// Step 4: Get container for layout
get_section({ path: ".kiro/steering/container-components.md", heading: "Container-Layout-Base" })
```

## Related Documentation

- **Primitive vs Semantic Philosophy**: `.kiro/steering/primitive-vs-semantic-usage-philosophy.md`
- **Component Readiness System**: `.kiro/steering/component-readiness-status-system.md`
- **Token Quick Reference**: `.kiro/steering/Token Quick Reference.md`
