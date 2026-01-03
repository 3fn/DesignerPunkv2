# Task 8.4 Completion: Define Validation Criteria

**Date**: 2026-01-03
**Task**: 8.4 - Define validation criteria
**Type**: Documentation
**Validation**: Tier 1 - Minimal
**Status**: Complete

---

## What Was Done

Created comprehensive validation criteria document defining:

1. **Success Criteria for Each Batch (0-17)**
   - Specific validation methods for each batch
   - Expected results for each criterion
   - Validation commands (MCP tools and bash)

2. **MCP Health Checks**
   - Standard health check procedure
   - Post-rename health check procedure
   - Recovery procedure for failed health checks
   - Expected response format and failure indicators

3. **Reference Integrity Checks**
   - Hard reference validation (markdown links)
   - Soft reference validation (prose mentions)
   - MCP query reference validation
   - Cross-reference tool validation using MCP

4. **Supporting Materials**
   - Validation checklist template for each batch
   - Validation frequency table
   - Notes on when to escalate issues

---

## Artifact Created

- `.kiro/specs/036-steering-documentation-audit/audit-artifacts/validation-criteria.md`

---

## Key Validation Patterns

### Per-Batch Validation
- Pre-execution: MCP health, backup (if high-risk), capture cross-references
- Post-execution: Success criteria, MCP health, cross-references, MCP queries, commit

### MCP Health Check
```
get_index_health()
```
Expected: `status: "healthy"`, no errors, correct document count

### Reference Integrity
```bash
# Hard references
grep -rn "\[.*\](.*\.md)" .kiro/steering/

# Legacy naming (should return zero)
grep -rn "<dp-icon>\|<dp-container>\|TextInputField\|DPIcon" .kiro/steering/
```

### Cross-Reference Validation
```
list_cross_references({ path: ".kiro/steering/[document].md" })
```

---

## Validation Frequency Summary

| Validation Type | When Applied |
|-----------------|--------------|
| MCP Health Check | Every batch |
| Cross-Reference Check | Every batch |
| Legacy Naming Search | Batches 8, 9, 17 |
| Session Start Test | Batches 2, 3, 15, 16 |
| Token Count Measurement | Batches 2, 3, 17 |
| Full MCP Query Test | Batches 10-16, 17 |

---

## Notes

- Validation criteria align with batch execution plan and rollback strategy
- High-risk batches (2, 3, 15, 16) require additional session start testing
- MCP index rebuild required after all rename batches
- Validation results should be documented in batch completion docs
