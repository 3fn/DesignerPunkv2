# Task 6.2 Completion: Propose Consolidation Targets

**Date**: 2026-01-03
**Task**: 6.2 Propose consolidation targets
**Type**: Documentation
**Status**: Complete
**Organization**: spec-completion
**Scope**: 036-steering-documentation-audit

---

## What Was Done

Developed comprehensive consolidation proposals for all harmful redundancy identified in the Discovery Phase, including:

1. **Validation Tiers Consolidation** - Proposal to replace duplicated tier definitions in Task-Type-Definitions.md with priming + MCP query to Spec Planning Standards.md

2. **Release Detection Consolidation** - Proposal to move operational troubleshooting from Development Workflow.md to Release Management System.md, keeping only priming in Development Workflow

3. **File Organization Consolidation** - Proposal to remove duplicated file organization content from Development Workflow.md, directing to File Organization Standards.md via MCP

4. **Completion Documentation Consolidation** - Proposal to create new Completion Documentation Guide.md consolidating fragmented guidance from 5 documents

5. **Tier Naming Collision Resolution** - Proposal to rename behavioral contract validation tiers to "Basic/Extended/Full Contract Validation" to eliminate collision with documentation validation tiers

---

## Key Deliverables

### Consolidation Proposals Added to redundancy-analysis.md

Each proposal includes:
- **Canonical Source**: Designated authoritative document
- **Current State**: Analysis of existing content distribution
- **Proposed Changes**: Specific changes per document with token impact
- **Priming Templates**: Ready-to-use replacement text
- **Estimated Token Savings**: Quantified impact

### Token Impact Summary

| Proposal | Net Token Impact |
|----------|------------------|
| 1. Validation Tiers | -400 tokens |
| 2. Release Detection | -300 tokens |
| 3. File Organization | -720 tokens |
| 4. Completion Docs | +1,040 tokens |
| 5. Tier Naming | ~0 tokens |
| **TOTAL** | **-380 tokens** |

### Session Start Load Impact

- **Current**: 39,124 tokens
- **Projected**: 36,844 tokens
- **Reduction**: -2,280 tokens (-5.8%)

### MCP Query Directions

| Topic | MCP Query |
|-------|-----------|
| Validation Tiers | `get_section({ path: ".kiro/steering/Spec Planning Standards.md", heading: "Validation Tiers" })` |
| Release Detection | `get_document_full({ path: ".kiro/steering/Release Management System.md" })` |
| File Organization | `get_section({ path: ".kiro/steering/File Organization Standards.md", heading: "Organization Implementation" })` |
| Completion Documentation | `get_document_full({ path: ".kiro/steering/Completion Documentation Guide.md" })` |

---

## Validation (Tier 2 - Standard)

- ✅ Proposals address all harmful redundancy identified in Task 3.2
- ✅ Each proposal includes canonical source designation
- ✅ MCP query directions provided for all priming opportunities
- ✅ Token impact quantified for each proposal
- ✅ Priming templates ready for implementation
- ✅ Proposals align with human decisions approved at Checkpoint 1

---

## Requirements Traceability

- **Requirement 3.3**: Harmful redundancy documented with canonical sources ✅
- **Requirement 3.7**: MCP query directions proposed for priming opportunities ✅

---

## Notes

- All proposals pending human approval at Checkpoint 2
- Completion Documentation Guide.md is a new document to be created
- Net token reduction is modest (-380) but session start load reduction is significant (-2,280 tokens, -5.8%)
- The Completion Documentation consolidation adds tokens overall but provides significant value through single source of truth
