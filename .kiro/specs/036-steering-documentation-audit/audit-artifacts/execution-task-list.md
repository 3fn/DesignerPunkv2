# Execution Task List

**Date**: 2026-01-03
**Spec**: 036 - Steering Documentation Audit
**Task**: 8.1 - Create detailed execution task list
**Status**: Implementation Planning Phase

---

## Overview

This document defines the detailed execution tasks based on approved recommendations from Checkpoint 2. Tasks are organized into batches with dependencies clearly defined.

**Approved Recommendations Summary**:
- 5 Consolidation Proposals (all approved)
- 6 Prefix Proposals (all approved, 43 documents)
- 2 File Split Decisions (combined approach)
- Rosetta System Alignment (included with checkpoint)
- 39 Legacy Naming Instances (to be fixed)

---

## Execution Batches

### Batch 0: Rosetta System Content Analysis (Prerequisite)

**Purpose**: Analyze token documentation to determine infrastructure vs family content split
**Dependencies**: None
**Risk Level**: Low (analysis only, no changes)
**Checkpoint**: Checkpoint 3 review before restructuring

| Task ID | Task Description | Documents Affected | Token Impact |
|---------|------------------|-------------------|--------------|
| 0.1 | Analyze semantic-token-structure.md content | 1 doc | 0 (analysis) |
| 0.2 | Analyze 13 remaining token docs for infrastructure content | 13 docs | 0 (analysis) |
| 0.3 | Document findings: infrastructure vs family content split | N/A | 0 (analysis) |
| 0.4 | Determine if rosetta-system-principles.md needed | N/A | 0 (decision) |
| 0.5 | Update Edge Case 4 classification decision | 1 doc | 0 (decision) |

**Success Criteria**:
- All 14 token docs analyzed for content type
- Clear classification: pure family, pure infrastructure, or mixed
- Decision on rosetta-system-principles.md creation
- semantic-token-structure.md classification finalized

---

### Batch 1: New Document Creation

**Purpose**: Create new documents that other batches depend on
**Dependencies**: Batch 0 (for rosetta-system-principles.md decision)
**Risk Level**: Low (additive, no existing content modified)

| Task ID | Task Description | Documents Created | Token Impact |
|---------|------------------|-------------------|--------------|
| 1.1 | Create Completion Documentation Guide.md | 1 new doc | +1,500 tokens |
| 1.2 | Create Process-Cross-Reference-Standards.md | 1 new doc | +4,000 tokens |
| 1.3 | Create rosetta-system-principles.md (if needed per Batch 0) | 0-1 new doc | +0-2,000 tokens |

**Success Criteria**:
- New documents created with proper metadata
- MCP server indexes new documents
- Documents follow Kebab-Title-Case naming

---

### Batch 2: Consolidation - Development Workflow Slimming

**Purpose**: Remove duplicated content from Development Workflow.md
**Dependencies**: Batch 1 (new documents must exist for MCP query references)
**Risk Level**: High (always-loaded document)

| Task ID | Task Description | Content Moved | Token Impact |
|---------|------------------|---------------|--------------|
| 2.1 | Replace Release Detection detailed content with priming + MCP query | ~300 lines → RMS | -1,100 tokens |
| 2.2 | Replace File Organization detailed content with priming + MCP query | ~200 lines → FOS | -720 tokens |
| 2.3 | Replace Completion Documentation content with priming + MCP query | ~50 lines → CDG | -160 tokens |
| 2.4 | Update AI Agent Reading Priorities section | N/A | ~0 |
| 2.5 | Validate all MCP query directions work | N/A | 0 |

**Success Criteria**:
- Development Workflow.md reduced by ~1,980 tokens
- All priming sections include correct MCP query syntax
- No broken cross-references
- MCP queries return expected content

---

### Batch 3: Consolidation - File Organization Standards Slimming

**Purpose**: Extract cross-reference content to new document
**Dependencies**: Batch 1 (Process-Cross-Reference-Standards.md must exist)
**Risk Level**: High (always-loaded document)

| Task ID | Task Description | Content Moved | Token Impact |
|---------|------------------|---------------|--------------|
| 3.1 | Move Cross-Reference Standards section to Process-Cross-Reference-Standards.md | ~4,000 tokens | -4,000 tokens |
| 3.2 | Move Anti-Patterns section to Process-Cross-Reference-Standards.md | ~2,000 tokens | -2,000 tokens |
| 3.3 | Move completion doc naming/organization to Completion Documentation Guide.md | ~320 tokens | -320 tokens |
| 3.4 | Add priming + MCP query directions for moved content | N/A | +200 tokens |
| 3.5 | Update AI Agent Reading Priorities section | N/A | ~0 |

**Success Criteria**:
- File Organization Standards.md reduced to ~5,000 tokens (from 16,680)
- Cross-reference content accessible via MCP query
- No broken cross-references
- MCP queries return expected content

---

### Batch 4: Consolidation - Release Management System Expansion

**Purpose**: Add operational content moved from Development Workflow
**Dependencies**: Batch 2 (content must be removed from Dev Workflow first)
**Risk Level**: Low (manual-load document)

| Task ID | Task Description | Content Added | Token Impact |
|---------|------------------|---------------|--------------|
| 4.1 | Add Agent Hook Dependency Chains section | From Dev Workflow | +800 tokens |
| 4.2 | Add Hook Troubleshooting section | From Dev Workflow | +500 tokens |
| 4.3 | Add Manual Trigger Commands section | From Dev Workflow | +300 tokens |
| 4.4 | Update document structure and navigation | N/A | +100 tokens |

**Success Criteria**:
- Release Management System.md is comprehensive operational guide
- All troubleshooting content accessible via MCP query
- Document structure is logical and navigable

---

### Batch 5: Consolidation - Validation Tiers

**Purpose**: Make Task-Type-Definitions.md canonical for validation tiers
**Dependencies**: None
**Risk Level**: Low (manual-load documents)

| Task ID | Task Description | Documents Affected | Token Impact |
|---------|------------------|-------------------|--------------|
| 5.1 | Verify Task-Type-Definitions.md has complete tier definitions | 1 doc | 0 |
| 5.2 | Replace Spec Planning Standards tier definitions with priming + MCP query | 1 doc | -800 tokens |
| 5.3 | Update any cross-references to validation tiers | Multiple | 0 |

**Success Criteria**:
- Task-Type-Definitions.md is single source of truth for validation tiers
- Spec Planning Standards has priming + MCP query direction
- All tier references point to correct canonical source

---

### Batch 6: Consolidation - Tier Naming Collision

**Purpose**: Rename behavioral contract validation tiers
**Dependencies**: None
**Risk Level**: Low (single document, manual-load)

| Task ID | Task Description | Documents Affected | Token Impact |
|---------|------------------|-------------------|--------------|
| 6.1 | Rename "Tier 1" to "Basic Contract Validation" | 1 doc | ~0 |
| 6.2 | Rename "Tier 2" to "Extended Contract Validation" | 1 doc | ~0 |
| 6.3 | Rename "Tier 3" to "Full Contract Validation" | 1 doc | ~0 |
| 6.4 | Update any references to behavioral contract tiers | Multiple | ~0 |

**Success Criteria**:
- No "Tier 1/2/3" references in behavioral-contract-validation-framework.md
- Documentation validation keeps "Tier 1/2/3" naming
- No naming collision between validation systems

---

### Batch 7: Start Up Tasks Update

**Purpose**: Add MCP query reminder for Completion Documentation Guide
**Dependencies**: Batch 1 (Completion Documentation Guide must exist)
**Risk Level**: Medium (always-loaded document, but small change)

| Task ID | Task Description | Documents Affected | Token Impact |
|---------|------------------|-------------------|--------------|
| 7.1 | Add checklist item: "Query Completion Documentation Guide via MCP before starting any task from a Tasks doc" | 1 doc | +20 tokens |

**Success Criteria**:
- Start Up Tasks includes MCP query reminder
- Agents are directed to query completion guide before task execution

---

### Batch 8: Legacy Naming Fixes - Low Risk Documents

**Purpose**: Fix legacy naming in manual-load documents
**Dependencies**: None
**Risk Level**: Low (manual-load documents)

| Task ID | Task Description | Documents Affected | Instances |
|---------|------------------|-------------------|-----------|
| 8.1 | Fix `<dp-icon>` → `<icon-base>` in Spec Planning Standards.md | 1 doc | 1 |
| 8.2 | Fix `<dp-icon>`, `<dp-container>` in icon-components.md | 1 doc | 2 |
| 8.3 | Fix `<dp-container>` in container-components.md | 1 doc | 1 |
| 8.4 | Fix `TextInputField` in blend-tokens.md | 1 doc | 1 |
| 8.5 | Fix `TextInputField` in component-readiness-status-system.md | 1 doc | 3 |
| 8.6 | Fix "Legacy Icon" references in icon-components.md | 1 doc | 2 |

**Success Criteria**:
- All legacy naming instances replaced with Stemma equivalents
- No `<dp-icon>`, `<dp-container>`, `TextInputField`, "Legacy Icon" in affected docs
- Document meaning preserved (backward compatibility notes updated appropriately)

---

### Batch 9: Legacy Naming Fixes - Medium Risk Documents

**Purpose**: Fix legacy naming in larger documents with more instances
**Dependencies**: None
**Risk Level**: Medium (more instances, more complex context)

| Task ID | Task Description | Documents Affected | Instances |
|---------|------------------|-------------------|-----------|
| 9.1 | Fix `<dp-icon>`, `<dp-container>`, `TextInputField` in Browser Distribution Guide.md | 1 doc | 8 |
| 9.2 | Fix `<dp-icon>`, `<dp-container>`, `TextInputField` in Component Development and Practices Guide.md | 1 doc | 7 |
| 9.3 | Fix `DPIcon` → `IconBaseElement` in Test Development Standards.md | 1 doc | 15 |

**Success Criteria**:
- All legacy naming instances replaced with Stemma equivalents
- Backward compatibility examples updated appropriately
- Test examples use correct class names

---

### Batch 10: Prefix Renames - Token Family (Lowest Risk)

**Purpose**: Apply Token-Family- prefix to token specification documents
**Dependencies**: Batch 0 (classification must be finalized)
**Risk Level**: Low (conditional-load documents, clear pattern)

| Task ID | Task Description | Old Name | New Name |
|---------|------------------|----------|----------|
| 10.1 | Rename accessibility-tokens.md | accessibility-tokens.md | Token-Family-Accessibility.md |
| 10.2 | Rename blend-tokens.md | blend-tokens.md | Token-Family-Blend.md |
| 10.3 | Rename border-tokens.md | border-tokens.md | Token-Family-Border.md |
| 10.4 | Rename color-tokens.md | color-tokens.md | Token-Family-Color.md |
| 10.5 | Rename glow-tokens.md | glow-tokens.md | Token-Family-Glow.md |
| 10.6 | Rename layering-tokens.md | layering-tokens.md | Token-Family-Layering.md |
| 10.7 | Rename motion-tokens.md | motion-tokens.md | Token-Family-Motion.md |
| 10.8 | Rename opacity-tokens.md | opacity-tokens.md | Token-Family-Opacity.md |
| 10.9 | Rename radius-tokens.md | radius-tokens.md | Token-Family-Radius.md |
| 10.10 | Rename responsive-tokens.md | responsive-tokens.md | Token-Family-Responsive.md |
| 10.11 | Rename shadow-tokens.md | shadow-tokens.md | Token-Family-Shadow.md |
| 10.12 | Rename spacing-tokens.md | spacing-tokens.md | Token-Family-Spacing.md |
| 10.13 | Rename typography-tokens.md | typography-tokens.md | Token-Family-Typography.md |
| 10.14 | Rename semantic-token-structure.md (if classified as family) | semantic-token-structure.md | Token-Family-Semantic-Structure.md |
| 10.15 | Update all cross-references to renamed files | Multiple | N/A |
| 10.16 | Re-index MCP server | N/A | N/A |

**Success Criteria**:
- All token family docs have Token-Family- prefix
- All cross-references updated
- MCP server indexes renamed files correctly
- MCP queries work with new names

---

### Batch 11: Prefix Renames - Component Family (Low Risk)

**Purpose**: Apply Component-Family- prefix to component specification documents
**Dependencies**: None
**Risk Level**: Low (conditional-load documents, clear pattern)

| Task ID | Task Description | Old Name | New Name |
|---------|------------------|----------|----------|
| 11.1 | Rename avatar-components.md | avatar-components.md | Component-Family-Avatar.md |
| 11.2 | Rename badge-components.md | badge-components.md | Component-Family-Badge.md |
| 11.3 | Rename button-components.md | button-components.md | Component-Family-Button.md |
| 11.4 | Rename container-components.md | container-components.md | Component-Family-Container.md |
| 11.5 | Rename data-display-components.md | data-display-components.md | Component-Family-Data-Display.md |
| 11.6 | Rename divider-components.md | divider-components.md | Component-Family-Divider.md |
| 11.7 | Rename form-inputs-components.md | form-inputs-components.md | Component-Family-Form-Inputs.md |
| 11.8 | Rename icon-components.md | icon-components.md | Component-Family-Icon.md |
| 11.9 | Rename loading-components.md | loading-components.md | Component-Family-Loading.md |
| 11.10 | Rename modal-components.md | modal-components.md | Component-Family-Modal.md |
| 11.11 | Rename navigation-components.md | navigation-components.md | Component-Family-Navigation.md |
| 11.12 | Update all cross-references to renamed files | Multiple | N/A |
| 11.13 | Re-index MCP server | N/A | N/A |

**Success Criteria**:
- All component family docs have Component-Family- prefix
- All cross-references updated
- MCP server indexes renamed files correctly

---

### Batch 12: Prefix Renames - Token Infrastructure (Low Risk)

**Purpose**: Apply Token- prefix to token infrastructure documents
**Dependencies**: Batch 0 (classification must be finalized)
**Risk Level**: Low (manual-load documents, small count)

| Task ID | Task Description | Old Name | New Name |
|---------|------------------|----------|----------|
| 12.1 | Rename Token Quick Reference.md | Token Quick Reference.md | Token-Quick-Reference.md |
| 12.2 | Rename Token Resolution Patterns.md | Token Resolution Patterns.md | Token-Resolution-Patterns.md |
| 12.3 | Rename semantic-token-structure.md (if classified as infrastructure) | semantic-token-structure.md | Token-Semantic-Structure.md |
| 12.4 | Update all cross-references to renamed files | Multiple | N/A |
| 12.5 | Re-index MCP server | N/A | N/A |

**Success Criteria**:
- All token infrastructure docs have Token- prefix
- All cross-references updated
- MCP server indexes renamed files correctly

---

### Batch 13: Prefix Renames - Component Infrastructure (Medium Risk)

**Purpose**: Apply Component- prefix to component infrastructure documents
**Dependencies**: None
**Risk Level**: Medium (includes Layer 2 documents)

| Task ID | Task Description | Old Name | New Name |
|---------|------------------|----------|----------|
| 13.1 | Rename Component Development and Practices Guide.md | Component Development and Practices Guide.md | Component-Development-Guide.md |
| 13.2 | Rename Component Quick Reference.md | Component Quick Reference.md | Component-Quick-Reference.md |
| 13.3 | Rename component-family-development-standards.md | component-family-development-standards.md | Component-Development-Standards.md |
| 13.4 | Rename component-family-inheritance-structures.md | component-family-inheritance-structures.md | Component-Inheritance-Structures.md |
| 13.5 | Rename component-family-templates.md | component-family-templates.md | Component-Templates.md |
| 13.6 | Rename component-readiness-status-system.md | component-readiness-status-system.md | Component-Readiness-Status.md |
| 13.7 | Rename component-schema-format.md | component-schema-format.md | Component-Schema-Format.md |
| 13.8 | Rename mcp-component-family-document-template.md | mcp-component-family-document-template.md | Component-MCP-Document-Template.md |
| 13.9 | Rename primitive-vs-semantic-usage-philosophy.md | primitive-vs-semantic-usage-philosophy.md | Component-Primitive-vs-Semantic-Philosophy.md |
| 13.10 | Update all cross-references to renamed files | Multiple | N/A |
| 13.11 | Re-index MCP server | N/A | N/A |

**Success Criteria**:
- All component infrastructure docs have Component- prefix
- All cross-references updated
- MCP server indexes renamed files correctly

---

### Batch 14: Prefix Renames - Test Documentation (Medium Risk)

**Purpose**: Apply Test- prefix to testing documentation
**Dependencies**: Batch 6 (tier naming collision must be resolved first)
**Risk Level**: Medium (includes Layer 2 documents)

| Task ID | Task Description | Old Name | New Name |
|---------|------------------|----------|----------|
| 14.1 | Rename Test Development Standards.md | Test Development Standards.md | Test-Development-Standards.md |
| 14.2 | Rename Test Failure Audit Methodology.md | Test Failure Audit Methodology.md | Test-Failure-Audit-Methodology.md |
| 14.3 | Rename behavioral-contract-validation-framework.md | behavioral-contract-validation-framework.md | Test-Behavioral-Contract-Validation.md |
| 14.4 | Update all cross-references to renamed files | Multiple | N/A |
| 14.5 | Re-index MCP server | N/A | N/A |

**Success Criteria**:
- All test docs have Test- prefix
- All cross-references updated
- MCP server indexes renamed files correctly

---

### Batch 15: Prefix Renames - Process Documentation (High Risk)

**Purpose**: Apply Process- prefix to process/workflow documentation
**Dependencies**: Batches 2, 3 (consolidation must be complete first)
**Risk Level**: High (includes 2 always-loaded documents)

| Task ID | Task Description | Old Name | New Name |
|---------|------------------|----------|----------|
| 15.1 | Rename Development Workflow.md | Development Workflow.md | Process-Development-Workflow.md |
| 15.2 | Rename File Organization Standards.md | File Organization Standards.md | Process-File-Organization.md |
| 15.3 | Rename Spec Planning Standards.md | Spec Planning Standards.md | Process-Spec-Planning.md |
| 15.4 | Rename Task-Type-Definitions.md | Task-Type-Definitions.md | Process-Task-Type-Definitions.md |
| 15.5 | Update meta-guide (00-Steering Documentation Directional Priorities.md) | 1 doc | N/A |
| 15.6 | Update all cross-references to renamed files | Multiple | N/A |
| 15.7 | Re-index MCP server | N/A | N/A |
| 15.8 | Validate always-loaded documents work correctly | N/A | N/A |

**Success Criteria**:
- All process docs have Process- prefix
- Meta-guide updated with new file names
- All cross-references updated
- MCP server indexes renamed files correctly
- Always-loaded documents load correctly at session start

---

### Batch 16: Meta-Guide Updates

**Purpose**: Update meta-guide to reflect all changes
**Dependencies**: All previous batches
**Risk Level**: High (always-loaded, critical navigation document)

| Task ID | Task Description | Documents Affected | Changes |
|---------|------------------|-------------------|---------|
| 16.1 | Update Tier 1 document references with new names | 1 doc | File name updates |
| 16.2 | Update Tier 2 MCP query examples with new paths | 1 doc | Path updates |
| 16.3 | Add Completion Documentation Guide to Tier 2 | 1 doc | New entry |
| 16.4 | Add Process-Cross-Reference-Standards.md to Tier 2 | 1 doc | New entry |
| 16.5 | Update MCP query examples throughout | 1 doc | Path updates |
| 16.6 | Validate all MCP query directions work | N/A | Testing |

**Success Criteria**:
- All file references use new names
- All MCP query examples use correct paths
- New documents are discoverable via meta-guide
- AI agents can navigate to all documents

---

### Batch 17: Final Validation

**Purpose**: Comprehensive validation of all changes
**Dependencies**: All previous batches
**Risk Level**: N/A (validation only)

| Task ID | Task Description | Validation Type |
|---------|------------------|-----------------|
| 17.1 | Verify MCP index health | `get_index_health()` |
| 17.2 | Verify all 55 documents indexed | `get_documentation_map()` |
| 17.3 | Verify zero legacy naming instances | grep search |
| 17.4 | Verify all cross-references resolve | `list_cross_references()` |
| 17.5 | Verify session start load reduced | Token count measurement |
| 17.6 | Verify MCP queries work for all new documents | Manual testing |
| 17.7 | Document final token counts and savings | Audit artifact update |

**Success Criteria**:
- MCP index healthy
- All documents indexed and queryable
- Zero legacy naming instances
- All cross-references valid
- Session start load reduced by target amount

---

## Task Dependencies Graph

```
Batch 0 (Rosetta Analysis)
    ↓
Batch 1 (New Documents) ←────────────────────────────────────┐
    ↓                                                        │
Batch 2 (Dev Workflow Slim) ─────────────────────────────────┤
    ↓                                                        │
Batch 3 (File Org Slim) ─────────────────────────────────────┤
    ↓                                                        │
Batch 4 (RMS Expansion) ←── Batch 2                          │
                                                             │
Batch 5 (Validation Tiers) ──────────────────────────────────┤
                                                             │
Batch 6 (Tier Naming) ───────────────────────────────────────┤
    ↓                                                        │
Batch 7 (Start Up Tasks) ←── Batch 1                         │
                                                             │
Batch 8 (Legacy Low Risk) ───────────────────────────────────┤
                                                             │
Batch 9 (Legacy Med Risk) ───────────────────────────────────┤
                                                             │
Batch 10 (Token-Family-) ←── Batch 0                         │
                                                             │
Batch 11 (Component-Family-) ────────────────────────────────┤
                                                             │
Batch 12 (Token-) ←── Batch 0                                │
                                                             │
Batch 13 (Component-) ───────────────────────────────────────┤
                                                             │
Batch 14 (Test-) ←── Batch 6                                 │
                                                             │
Batch 15 (Process-) ←── Batches 2, 3                         │
    ↓                                                        │
Batch 16 (Meta-Guide) ←── All previous batches ──────────────┘
    ↓
Batch 17 (Final Validation)
```

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total Batches | 18 (0-17) |
| Total Tasks | 107 |
| Documents Created | 2-3 |
| Documents Renamed | 43 |
| Legacy Instances Fixed | 39 |
| Estimated Token Savings (Session Start) | ~11,000 tokens |

---

## Notes

- Batch 0 must complete before Checkpoint 3 review
- Batches can be parallelized where dependencies allow
- Always-loaded document changes (Batches 2, 3, 15, 16) require extra validation
- MCP re-indexing required after each rename batch
- Rollback strategy defined in Task 8.3

