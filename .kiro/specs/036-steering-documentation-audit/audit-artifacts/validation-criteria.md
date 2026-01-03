# Validation Criteria

**Date**: 2026-01-03
**Spec**: 036 - Steering Documentation Audit
**Task**: 8.4 - Define validation criteria
**Status**: Implementation Planning Phase

---

## Overview

This document defines the validation criteria for the steering documentation audit execution phase. Validation ensures that each batch completes successfully and that the overall audit achieves its objectives.

**Validation Principles**:
1. Validate before and after each batch
2. Use MCP tools for automated validation where possible
3. Manual verification for critical changes
4. Document all validation results

---

## Success Criteria by Batch

### Batch 0: Rosetta System Content Analysis

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| All 14 token docs analyzed | Manual checklist | Analysis complete for each doc |
| Content classification documented | Review analysis artifact | Clear infrastructure/family split |
| semantic-token-structure.md classified | Decision documented | Single classification chosen |
| rosetta-system-principles.md decision made | Decision documented | Create or skip decision finalized |

**Validation Commands**:
```bash
# Verify analysis artifact exists
ls -la .kiro/specs/036-steering-documentation-audit/audit-artifacts/rosetta-analysis.md
```

---

### Batch 1: New Document Creation

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| Completion Documentation Guide.md created | File exists | Document with proper metadata |
| Process-Cross-Reference-Standards.md created | File exists | Document with proper metadata |
| rosetta-system-principles.md created (if needed) | File exists | Document with proper metadata |
| MCP indexes new documents | `get_documentation_map()` | New docs appear in map |
| Metadata valid | `validate_metadata()` | No validation errors |

**Validation Commands**:
```
# Verify documents exist and are indexed
get_documentation_map()

# Validate metadata for each new document
validate_metadata({ path: ".kiro/steering/Completion Documentation Guide.md" })
validate_metadata({ path: ".kiro/steering/Process-Cross-Reference-Standards.md" })

# Test MCP queries work
get_document_summary({ path: ".kiro/steering/Completion Documentation Guide.md" })
```

---

### Batch 2: Development Workflow Slimming

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| Token count reduced | Word/token count | ~1,980 tokens removed |
| Priming sections present | Manual review | 3-4 sentences per topic |
| MCP query directions correct | Test queries | Queries return expected content |
| No broken cross-references | `list_cross_references()` | All references resolve |
| Document still loads at session start | New session test | Document accessible |

**Validation Commands**:
```
# Verify cross-references
list_cross_references({ path: ".kiro/steering/Development Workflow.md" })

# Test MCP query directions work
get_section({ path: ".kiro/steering/Release Management System.md", heading: "Agent Hook Dependency Chains" })
get_section({ path: ".kiro/steering/File Organization Standards.md", heading: "Organization Implementation" })

# Verify document accessible
get_document_summary({ path: ".kiro/steering/Development Workflow.md" })
```

---

### Batch 3: File Organization Standards Slimming

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| Token count reduced | Word/token count | ~6,120 tokens removed |
| Cross-reference content moved | Manual review | Content in new document |
| Priming sections present | Manual review | 3-4 sentences per topic |
| MCP query directions correct | Test queries | Queries return expected content |
| No broken cross-references | `list_cross_references()` | All references resolve |
| Document still loads at session start | New session test | Document accessible |

**Validation Commands**:
```
# Verify cross-references
list_cross_references({ path: ".kiro/steering/File Organization Standards.md" })

# Test MCP query directions work
get_section({ path: ".kiro/steering/Process-Cross-Reference-Standards.md", heading: "Cross-Reference Standards" })

# Verify document accessible
get_document_summary({ path: ".kiro/steering/File Organization Standards.md" })
```

---

### Batch 4: Release Management System Expansion

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| New sections added | Manual review | 3 new sections present |
| Content matches source | Diff comparison | Content preserved accurately |
| Document structure logical | Manual review | Clear navigation |
| MCP queries work | Test queries | Sections accessible |

**Validation Commands**:
```
# Verify new sections accessible
get_section({ path: ".kiro/steering/Release Management System.md", heading: "Agent Hook Dependency Chains" })
get_section({ path: ".kiro/steering/Release Management System.md", heading: "Hook Troubleshooting" })
get_section({ path: ".kiro/steering/Release Management System.md", heading: "Manual Trigger Commands" })
```

---

### Batch 5: Validation Tiers Consolidation

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| Task-Type-Definitions.md is canonical | Manual review | Complete tier definitions |
| Spec Planning Standards updated | Manual review | Priming + MCP query |
| MCP query direction works | Test query | Returns tier definitions |
| No duplicate tier definitions | grep search | Single source of truth |

**Validation Commands**:
```
# Verify canonical source accessible
get_section({ path: ".kiro/steering/Task-Type-Definitions.md", heading: "Validation Tiers" })

# Search for duplicate definitions
grep -rn "Tier 1.*Minimal\|Tier 2.*Standard\|Tier 3.*Comprehensive" .kiro/steering/
```

---

### Batch 6: Tier Naming Collision Fix

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| Behavioral contract tiers renamed | Manual review | Basic/Extended/Full naming |
| No "Tier 1/2/3" in behavioral doc | grep search | Zero matches |
| Documentation validation keeps naming | Manual review | Tier 1/2/3 preserved |
| No naming collision | grep search | Clear distinction |

**Validation Commands**:
```bash
# Verify no Tier 1/2/3 in behavioral contract doc
grep -n "Tier 1\|Tier 2\|Tier 3" .kiro/steering/behavioral-contract-validation-framework.md

# Verify new naming present
grep -n "Basic Contract\|Extended Contract\|Full Contract" .kiro/steering/behavioral-contract-validation-framework.md
```

---

### Batch 7: Start Up Tasks Update

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| MCP query reminder added | Manual review | Checklist item present |
| Document still loads correctly | New session test | Document accessible |
| Checklist order logical | Manual review | Appropriate placement |

**Validation Commands**:
```
# Verify document accessible
get_document_summary({ path: ".kiro/steering/Start Up Tasks.md" })

# Verify content includes MCP query reminder
get_document_full({ path: ".kiro/steering/Start Up Tasks.md" })
```

---

### Batch 8: Legacy Naming Fixes - Low Risk

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| All 10 instances fixed | grep search | Zero legacy matches |
| Stemma equivalents used | Manual review | Correct replacements |
| Document meaning preserved | Manual review | Context appropriate |
| No broken references | `list_cross_references()` | All references resolve |

**Validation Commands**:
```bash
# Verify no legacy naming in affected docs
grep -n "<dp-icon>\|<dp-container>\|TextInputField\|Legacy Icon" .kiro/steering/Spec\ Planning\ Standards.md
grep -n "<dp-icon>\|<dp-container>\|TextInputField\|Legacy Icon" .kiro/steering/icon-components.md
grep -n "<dp-icon>\|<dp-container>\|TextInputField\|Legacy Icon" .kiro/steering/container-components.md
grep -n "<dp-icon>\|<dp-container>\|TextInputField\|Legacy Icon" .kiro/steering/blend-tokens.md
grep -n "<dp-icon>\|<dp-container>\|TextInputField\|Legacy Icon" .kiro/steering/component-readiness-status-system.md
```

---

### Batch 9: Legacy Naming Fixes - Medium Risk

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| All 30 instances fixed | grep search | Zero legacy matches |
| DPIcon → IconBaseElement | grep search | Correct class name |
| Backward compatibility notes updated | Manual review | Context appropriate |
| Test examples correct | Manual review | Valid code examples |

**Validation Commands**:
```bash
# Verify no legacy naming in affected docs
grep -n "<dp-icon>\|<dp-container>\|TextInputField\|DPIcon" .kiro/steering/Browser\ Distribution\ Guide.md
grep -n "<dp-icon>\|<dp-container>\|TextInputField\|DPIcon" .kiro/steering/Component\ Development\ and\ Practices\ Guide.md
grep -n "DPIcon" .kiro/steering/Test\ Development\ Standards.md

# Verify correct replacements
grep -n "IconBaseElement" .kiro/steering/Test\ Development\ Standards.md
```

---

### Batch 10: Prefix Renames - Token Family

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| All 13-14 files renamed | File listing | Token-Family-*.md files exist |
| Old file names removed | File listing | No old names present |
| MCP indexes new names | `get_documentation_map()` | New names in map |
| Cross-references updated | `list_cross_references()` | All references resolve |
| MCP queries work | Test queries | Documents accessible |

**Validation Commands**:
```bash
# Verify files renamed
ls -la .kiro/steering/Token-Family-*.md

# Verify old names removed
ls -la .kiro/steering/*-tokens.md 2>/dev/null || echo "Old names removed"
```

```
# Verify MCP indexes new names
get_documentation_map()

# Test sample queries
get_document_summary({ path: ".kiro/steering/Token-Family-Color.md" })
get_document_summary({ path: ".kiro/steering/Token-Family-Typography.md" })
```

---

### Batch 11: Prefix Renames - Component Family

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| All 11 files renamed | File listing | Component-Family-*.md files exist |
| Old file names removed | File listing | No old names present |
| MCP indexes new names | `get_documentation_map()` | New names in map |
| Cross-references updated | `list_cross_references()` | All references resolve |

**Validation Commands**:
```bash
# Verify files renamed
ls -la .kiro/steering/Component-Family-*.md

# Verify old names removed
ls -la .kiro/steering/*-components.md 2>/dev/null || echo "Old names removed"
```

```
# Verify MCP indexes new names
get_documentation_map()

# Test sample queries
get_document_summary({ path: ".kiro/steering/Component-Family-Button.md" })
get_document_summary({ path: ".kiro/steering/Component-Family-Icon.md" })
```

---

### Batch 12: Prefix Renames - Token Infrastructure

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| All 2-3 files renamed | File listing | Token-*.md files exist |
| Old file names removed | File listing | No old names present |
| MCP indexes new names | `get_documentation_map()` | New names in map |
| Cross-references updated | `list_cross_references()` | All references resolve |

**Validation Commands**:
```bash
# Verify files renamed
ls -la .kiro/steering/Token-Quick-Reference.md
ls -la .kiro/steering/Token-Resolution-Patterns.md
```

```
# Verify MCP indexes new names
get_documentation_map()

# Test queries
get_document_summary({ path: ".kiro/steering/Token-Quick-Reference.md" })
```

---

### Batch 13: Prefix Renames - Component Infrastructure

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| All 9 files renamed | File listing | Component-*.md files exist |
| Old file names removed | File listing | No old names present |
| MCP indexes new names | `get_documentation_map()` | New names in map |
| Cross-references updated | `list_cross_references()` | All references resolve |

**Validation Commands**:
```bash
# Verify files renamed
ls -la .kiro/steering/Component-Development-Guide.md
ls -la .kiro/steering/Component-Quick-Reference.md
ls -la .kiro/steering/Component-Development-Standards.md
```

```
# Verify MCP indexes new names
get_documentation_map()

# Test queries
get_document_summary({ path: ".kiro/steering/Component-Development-Guide.md" })
```

---

### Batch 14: Prefix Renames - Test Documentation

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| All 3 files renamed | File listing | Test-*.md files exist |
| Old file names removed | File listing | No old names present |
| MCP indexes new names | `get_documentation_map()` | New names in map |
| Cross-references updated | `list_cross_references()` | All references resolve |

**Validation Commands**:
```bash
# Verify files renamed
ls -la .kiro/steering/Test-Development-Standards.md
ls -la .kiro/steering/Test-Failure-Audit-Methodology.md
ls -la .kiro/steering/Test-Behavioral-Contract-Validation.md
```

```
# Verify MCP indexes new names
get_documentation_map()

# Test queries
get_document_summary({ path: ".kiro/steering/Test-Development-Standards.md" })
```

---

### Batch 15: Prefix Renames - Process Documentation

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| All 4 files renamed | File listing | Process-*.md files exist |
| Old file names removed | File listing | No old names present |
| MCP indexes new names | `get_documentation_map()` | New names in map |
| Cross-references updated | `list_cross_references()` | All references resolve |
| Always-loaded docs work | New session test | Documents load correctly |
| Meta-guide references updated | Manual review | Correct file names |

**Validation Commands**:
```bash
# Verify files renamed
ls -la .kiro/steering/Process-Development-Workflow.md
ls -la .kiro/steering/Process-File-Organization.md
ls -la .kiro/steering/Process-Spec-Planning.md
ls -la .kiro/steering/Process-Task-Type-Definitions.md
```

```
# Verify MCP indexes new names
get_documentation_map()

# Test queries
get_document_summary({ path: ".kiro/steering/Process-Development-Workflow.md" })
get_document_summary({ path: ".kiro/steering/Process-File-Organization.md" })

# Verify always-loaded behavior (manual test in new session)
```

---

### Batch 16: Meta-Guide Updates

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| All file references updated | Manual review | New names used |
| MCP query examples updated | Manual review | Correct paths |
| New documents listed | Manual review | CDG and PCRS in Tier 2 |
| All MCP queries work | Test queries | Expected content returned |
| Navigation complete | Manual review | All docs discoverable |

**Validation Commands**:
```
# Verify meta-guide accessible
get_document_summary({ path: ".kiro/steering/00-Steering Documentation Directional Priorities.md" })

# Test all MCP query examples from meta-guide
# (Execute each query example to verify paths are correct)
```

---

### Batch 17: Final Validation

| Criterion | Validation Method | Expected Result |
|-----------|-------------------|-----------------|
| MCP index healthy | `get_index_health()` | status: "healthy" |
| All documents indexed | `get_documentation_map()` | 55+ documents |
| Zero legacy naming | grep search | Zero matches |
| All cross-references valid | `list_cross_references()` | All resolve |
| Session start load reduced | Token measurement | ~11,000 tokens saved |
| All MCP queries work | Comprehensive testing | All queries succeed |

**Validation Commands**:
```
# MCP health check
get_index_health()

# Document count
get_documentation_map()

# Cross-reference validation for key documents
list_cross_references({ path: ".kiro/steering/Process-Development-Workflow.md" })
list_cross_references({ path: ".kiro/steering/Process-File-Organization.md" })
list_cross_references({ path: ".kiro/steering/00-Steering Documentation Directional Priorities.md" })
```

```bash
# Legacy naming search (should return zero results)
grep -rn "<dp-icon>\|<dp-container>\|TextInputField\|DPIcon\|Legacy Icon" .kiro/steering/
```

---

## MCP Health Checks

### Standard Health Check (After Every Batch)

```
# Check index health
get_index_health()
```

**Expected Response**:
```json
{
  "status": "healthy",
  "errors": [],
  "warnings": [],
  "metrics": {
    "documentCount": 55,
    "sectionCount": [varies],
    "crossReferenceCount": [varies],
    "indexSize": [varies]
  }
}
```

**Failure Indicators**:
- `status: "degraded"` - Some issues, may need attention
- `status: "failed"` - Critical issues, requires `rebuild_index()`
- Non-empty `errors` array - Specific issues to address
- `documentCount` mismatch - Missing or extra documents

### Post-Rename Health Check

After any batch that renames files:

```
# 1. Rebuild index to pick up new names
rebuild_index()

# 2. Verify health
get_index_health()

# 3. Verify document count
get_documentation_map()

# 4. Test queries with new names
get_document_summary({ path: ".kiro/steering/[new-name].md" })
```

### Recovery Procedure

If health check fails:

```
# 1. Attempt rebuild
rebuild_index()

# 2. Check health again
get_index_health()

# 3. If still failing, check for:
#    - Invalid file names
#    - Corrupted markdown
#    - Missing metadata
#    - Syntax errors in documents

# 4. If issues persist, rollback per rollback-strategy.md
```

---

## Reference Integrity Checks

### Hard Reference Validation

Hard references are markdown links: `[text](path.md)`

```bash
# Find all hard references in steering docs
grep -rn "\[.*\](.*\.md)" .kiro/steering/

# Check for references to old file names (after renames)
grep -rn "old-filename.md" .kiro/steering/

# Verify no broken links (manual review of grep output)
```

### Soft Reference Validation

Soft references are prose mentions of document names.

```bash
# Search for document mentions
grep -rn "Development Workflow\|File Organization Standards" .kiro/steering/

# After renames, search for old names that should be updated
grep -rn "[old-document-name]" .kiro/steering/
```

### MCP Query Reference Validation

MCP query references appear in documentation as examples.

```bash
# Find all MCP query examples
grep -rn "get_document_summary\|get_section\|get_document_full" .kiro/steering/

# Verify paths in queries match current file names
# (Manual review of grep output)
```

### Cross-Reference Tool Validation

Use MCP tools to validate cross-references:

```
# Check cross-references for key documents
list_cross_references({ path: ".kiro/steering/Development Workflow.md" })
list_cross_references({ path: ".kiro/steering/File Organization Standards.md" })
list_cross_references({ path: ".kiro/steering/00-Steering Documentation Directional Priorities.md" })
list_cross_references({ path: ".kiro/steering/Core Goals.md" })
```

**Expected**: All referenced documents exist and are accessible.

---

## Validation Checklist Template

Use this checklist for each batch:

```markdown
## Batch [N] Validation Checklist

**Batch Name**: [Name]
**Date**: [Date]
**Validator**: [Agent/Human]

### Pre-Execution
- [ ] MCP index healthy
- [ ] Backup branch created (if high-risk)
- [ ] Cross-references captured

### Post-Execution
- [ ] All success criteria met
- [ ] MCP index healthy
- [ ] Cross-references valid
- [ ] MCP queries work
- [ ] No broken links
- [ ] Changes committed

### Issues Found
- [List any issues]

### Resolution
- [How issues were resolved]

### Sign-off
- [ ] Batch validated and approved
```

---

## Validation Frequency

| Validation Type | Frequency | Batches |
|-----------------|-----------|---------|
| MCP Health Check | Every batch | All |
| Cross-Reference Check | Every batch | All |
| Legacy Naming Search | Batches 8, 9, 17 | Legacy fixes, Final |
| Session Start Test | Batches 2, 3, 15, 16 | Always-loaded changes |
| Token Count Measurement | Batches 2, 3, 17 | Consolidation, Final |
| Full MCP Query Test | Batches 10-16, 17 | Renames, Final |

---

## Notes

- Always run MCP health check after any batch
- Rebuild MCP index after rename batches
- Manual session start test required for always-loaded document changes
- Document all validation results in completion docs
- Escalate to human review if validation fails repeatedly
