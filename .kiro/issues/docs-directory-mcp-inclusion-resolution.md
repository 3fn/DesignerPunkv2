# Figma Integration Docs Migration to Steering

**Date**: 2026-02-21
**Action**: Moved referenced docs to steering for MCP accessibility
**Status**: Complete

---

## Changes Made

### 1. Files Moved

```bash
docs/dtcg-integration-guide.md → .kiro/steering/DTCG-Integration-Guide.md
docs/figma-workflow-guide.md → .kiro/steering/Figma-Workflow-Guide.md
docs/transformer-development-guide.md → .kiro/steering/Transformer-Development-Guide.md
docs/mcp-integration-guide.md → .kiro/steering/MCP-Integration-Guide.md
docs/rosetta-stemma-systems-diagram.md → .kiro/steering/Rosetta-Stemma-Systems-Overview.md
```

**Rationale**: All five docs are either cross-referenced from steering docs or fill gaps in MCP-queryable content. Moving to steering makes them MCP-queryable without expanding MCP server scope or creating duplication.

### 2. Metadata Updated

All five files updated with proper metadata and front matter:

**Layer 2 (Frameworks and Patterns) — Manual Inclusion:**
- DTCG-Integration-Guide.md
- Figma-Workflow-Guide.md
- Transformer-Development-Guide.md
- MCP-Integration-Guide.md

**Layer 1 (Core Principles) — Always Inclusion:**
- Rosetta-Stemma-Systems-Overview.md

All files now have:
- Proper front matter (`inclusion: manual` or `inclusion: always`)
- Complete metadata (Date, Last Reviewed, Purpose, Organization, Scope, Layer, Relevant Tasks)
- Updated cross-references to steering paths

### 3. Cross-References Updated

**Steering docs (4 files):**
- Rosetta-System-Architecture.md
- Token-Quick-Reference.md
- Token-Governance.md
- DTCG-Integration-Guide.md

**Spec docs (multiple files across 053, 054a, 054b):**
- All references updated from `docs/` paths to `.kiro/steering/` paths

### 4. 00-Steering Documentation Updated

Added five new entries:

**Layer 2 (Manual Inclusion):**
- Figma-Workflow-Guide.md — Figma integration workflow (push + extraction)
- DTCG-Integration-Guide.md — DTCG format specification
- Transformer-Development-Guide.md — Building custom token transformers
- MCP-Integration-Guide.md — Programmatic DTCG token consumption

**Layer 1 (Always Inclusion):**
- Rosetta-Stemma-Systems-Overview.md — Visual architecture overview with Mermaid diagrams

---

## Result

**Single source of truth**: No duplication, steering docs are authoritative and MCP-queryable

**Proper layering**: All four docs are Layer 2 (Frameworks and Patterns) with manual inclusion

**MCP accessibility**: Agents can now query these docs via:
```
get_section({ path: ".kiro/steering/Figma-Workflow-Guide.md", heading: "..." })
get_section({ path: ".kiro/steering/DTCG-Integration-Guide.md", heading: "..." })
get_section({ path: ".kiro/steering/Transformer-Development-Guide.md", heading: "..." })
get_section({ path: ".kiro/steering/MCP-Integration-Guide.md", heading: "..." })
get_document_full({ path: ".kiro/steering/Rosetta-Stemma-Systems-Overview.md" })
```

**No MCP server changes**: Works with existing single-directory configuration

---

## Files Not Moved

None — all candidate docs from `docs/` root have been moved to steering.

**Remaining in docs/:**
- `docs/examples/` — Reference examples
- `docs/specs/` — Task summaries (release detection artifacts)
- `docs/releases/` — Release notes
- Other subdirectories not evaluated for MCP inclusion

---

## Files Modified

- `.kiro/steering/DTCG-Integration-Guide.md` (moved + metadata updated)
- `.kiro/steering/Figma-Workflow-Guide.md` (moved + metadata updated)
- `.kiro/steering/Transformer-Development-Guide.md` (moved + metadata updated)
- `.kiro/steering/MCP-Integration-Guide.md` (moved + metadata updated)
- `.kiro/steering/Rosetta-Stemma-Systems-Overview.md` (moved + metadata added + prose explanations added)
- `.kiro/steering/00-Steering Documentation Directional Priorities.md` (appended 5 entries)
- `.kiro/steering/Rosetta-System-Architecture.md` (cross-references updated)
- `.kiro/steering/Token-Quick-Reference.md` (cross-references updated)
- `.kiro/steering/Token-Governance.md` (cross-references updated)
- Multiple spec docs in `.kiro/specs/` (cross-references updated)

---

**Organization**: process-completion
**Scope**: documentation-organization
