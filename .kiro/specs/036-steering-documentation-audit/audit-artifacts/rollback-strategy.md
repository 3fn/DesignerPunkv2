# Rollback Strategy

**Date**: 2026-01-03
**Spec**: 036 - Steering Documentation Audit
**Task**: 8.3 - Define rollback strategy
**Status**: Implementation Planning Phase

---

## Overview

This document defines the rollback strategy for the steering documentation audit execution phase. The strategy ensures that any issues discovered during execution can be safely reversed without data loss or system instability.

**Key Principles**:
1. Git-based version control as primary rollback mechanism
2. Incremental commits at natural breakpoints
3. MCP re-indexing after any rollback
4. Reference validation before and after changes

---

## Git-Based Rollback Approach

### Commit Strategy

Each batch will be committed separately to enable granular rollback:

```bash
# Commit pattern for each batch
git add .
git commit -m "Batch N: [Batch Name] - [Brief Description]"
git push origin main
```

**Commit Message Format**:
```
Batch [N]: [Batch Name]

Changes:
- [Change 1]
- [Change 2]
- [Change 3]

Documents affected: [count]
Token impact: [+/-] [amount] tokens
```

### Rollback Commands

#### Rollback Single Batch (Most Recent)

```bash
# View recent commits to identify batch commit
git log --oneline -10

# Soft reset (keeps changes staged, allows review)
git reset --soft HEAD~1

# Hard reset (discards all changes from last commit)
git reset --hard HEAD~1

# Force push to remote (if already pushed)
git push --force origin main
```

#### Rollback Multiple Batches

```bash
# Identify the commit hash to rollback to
git log --oneline -20

# Reset to specific commit (keeps changes staged)
git reset --soft <commit-hash>

# Reset to specific commit (discards changes)
git reset --hard <commit-hash>

# Force push to remote
git push --force origin main
```

#### Rollback Specific Files Only

```bash
# Restore specific file from previous commit
git checkout HEAD~1 -- .kiro/steering/[filename].md

# Restore multiple files
git checkout HEAD~1 -- .kiro/steering/file1.md .kiro/steering/file2.md

# Commit the restoration
git add .
git commit -m "Rollback: Restore [files] from Batch N"
git push origin main
```

### Backup Branch Strategy

For high-risk batches (2, 3, 15, 16), create a backup branch before execution:

```bash
# Before high-risk batch
git checkout -b backup/pre-batch-[N]
git checkout main

# Execute batch...

# If rollback needed, restore from backup
git checkout backup/pre-batch-[N] -- .kiro/steering/
git add .
git commit -m "Rollback: Restore from pre-batch-[N] backup"
git push origin main
```

**High-Risk Batches Requiring Backup Branches**:
- Batch 2: Development Workflow Slimming (always-loaded)
- Batch 3: File Organization Standards Slimming (always-loaded)
- Batch 15: Process- Prefix Renames (always-loaded documents)
- Batch 16: Meta-Guide Updates (critical navigation)

---

## MCP Re-Index Procedure

After any rollback, the MCP server index must be rebuilt to reflect the restored state.

### Standard Re-Index

```bash
# Using MCP tool
get_index_health()  # Check current status

# If index shows stale data
rebuild_index()     # Force complete re-index

# Verify re-index completed
get_index_health()  # Should show "healthy" status
```

### Re-Index Verification Steps

1. **Check Index Health**:
   ```
   get_index_health()
   ```
   Expected: `status: "healthy"`, no errors

2. **Verify Document Count**:
   ```
   get_documentation_map()
   ```
   Expected: 55 documents (or adjusted count based on new documents created)

3. **Test Sample Queries**:
   ```
   get_document_summary({ path: ".kiro/steering/Development Workflow.md" })
   get_section({ path: ".kiro/steering/Core Goals.md", heading: "Core Project Context" })
   ```
   Expected: Correct content returned

4. **Verify Cross-References**:
   ```
   list_cross_references({ path: ".kiro/steering/Development Workflow.md" })
   ```
   Expected: All references resolve correctly

### Re-Index After Rename Rollback

If rolling back a rename batch, additional steps are required:

```bash
# 1. Perform git rollback (restores old file names)
git reset --hard <pre-rename-commit>

# 2. Force MCP re-index
rebuild_index()

# 3. Verify old file names are indexed
get_documentation_map()

# 4. Test queries with old file names
get_document_summary({ path: ".kiro/steering/[old-filename].md" })
```

---

## Reference Validation Steps

### Pre-Change Validation

Before executing any batch, capture the current state:

```bash
# 1. Document current cross-reference state
list_cross_references({ path: ".kiro/steering/Development Workflow.md" })
list_cross_references({ path: ".kiro/steering/File Organization Standards.md" })
list_cross_references({ path: ".kiro/steering/00-Steering Documentation Directional Priorities.md" })

# 2. Capture current MCP index health
get_index_health()

# 3. Record current document count
get_documentation_map()
```

### Post-Change Validation

After executing any batch:

```bash
# 1. Verify MCP index health
get_index_health()
# Expected: status "healthy", no errors or warnings

# 2. Verify document count
get_documentation_map()
# Expected: Correct count (55 + new documents - any removed)

# 3. Validate cross-references for modified documents
list_cross_references({ path: ".kiro/steering/[modified-file].md" })
# Expected: All references resolve, no broken links

# 4. Test MCP queries for renamed/modified documents
get_document_summary({ path: ".kiro/steering/[new-or-modified-file].md" })
# Expected: Correct content returned

# 5. Grep for broken references (hard references)
grep -r "\[.*\](.*\.md)" .kiro/steering/ | grep -v "node_modules"
# Review output for any broken links
```

### Reference Integrity Checks

#### Hard References (Markdown Links)

```bash
# Find all markdown links in steering docs
grep -rn "\[.*\](.*\.md)" .kiro/steering/

# Check for links to old file names after rename
grep -rn "old-filename.md" .kiro/steering/

# Verify no broken links exist
# (Manual review of grep output)
```

#### Soft References (Prose Mentions)

```bash
# Search for document mentions by old name
grep -rn "Development Workflow" .kiro/steering/
grep -rn "File Organization Standards" .kiro/steering/

# After rename, search for old names that should be updated
grep -rn "[old-document-name]" .kiro/steering/
```

#### MCP Query References

```bash
# Find all MCP query examples in steering docs
grep -rn "get_document_summary\|get_section\|get_document_full" .kiro/steering/

# Verify paths in MCP queries match current file names
# (Manual review of grep output)
```

---

## Rollback Decision Matrix

| Issue Type | Severity | Rollback Scope | Action |
|------------|----------|----------------|--------|
| Single file corruption | Low | File only | `git checkout HEAD~1 -- [file]` |
| Broken cross-references | Medium | Batch | `git reset --hard HEAD~1` |
| MCP index failure | Medium | Re-index only | `rebuild_index()` |
| Always-loaded doc broken | High | Batch + backup | Restore from backup branch |
| Multiple batches affected | High | Multiple batches | Reset to last known good commit |
| Session start failure | Critical | All changes | Reset to pre-execution state |

---

## Rollback Procedures by Batch Type

### Low Risk Batches (1, 4, 5, 6, 7, 8, 10, 11, 12)

```bash
# Standard rollback
git reset --hard HEAD~1
git push --force origin main
rebuild_index()
get_index_health()
```

### Medium Risk Batches (9, 13, 14)

```bash
# Rollback with extra validation
git reset --hard HEAD~1
git push --force origin main
rebuild_index()
get_index_health()

# Verify cross-references
list_cross_references({ path: ".kiro/steering/[affected-file].md" })

# Test MCP queries
get_document_summary({ path: ".kiro/steering/[affected-file].md" })
```

### High Risk Batches (2, 3, 15, 16)

```bash
# Rollback from backup branch
git checkout backup/pre-batch-[N] -- .kiro/steering/
git add .
git commit -m "Rollback: Restore from pre-batch-[N] backup"
git push origin main

# Full re-index
rebuild_index()

# Comprehensive validation
get_index_health()
get_documentation_map()

# Test always-loaded documents
get_document_summary({ path: ".kiro/steering/Development Workflow.md" })
get_document_summary({ path: ".kiro/steering/File Organization Standards.md" })
get_document_summary({ path: ".kiro/steering/00-Steering Documentation Directional Priorities.md" })

# Verify session start behavior (manual test)
# Start new Kiro session and verify steering docs load correctly
```

---

## Emergency Rollback Procedure

If critical issues are discovered that affect system stability:

### Step 1: Stop Execution
- Do not proceed with any further batches
- Document the issue and current state

### Step 2: Identify Last Known Good State
```bash
git log --oneline -20
# Identify the commit before issues began
```

### Step 3: Full Rollback
```bash
# Reset to last known good state
git reset --hard <last-good-commit>
git push --force origin main
```

### Step 4: Rebuild MCP Index
```bash
rebuild_index()
get_index_health()
```

### Step 5: Validate System State
```bash
# Verify all documents accessible
get_documentation_map()

# Test critical documents
get_document_summary({ path: ".kiro/steering/Development Workflow.md" })
get_document_summary({ path: ".kiro/steering/File Organization Standards.md" })
get_document_summary({ path: ".kiro/steering/Core Goals.md" })
get_document_summary({ path: ".kiro/steering/00-Steering Documentation Directional Priorities.md" })
```

### Step 6: Document Incident
- Record what went wrong
- Identify root cause
- Update execution plan to prevent recurrence
- Request human review before resuming

---

## Rollback Testing

Before beginning execution, test the rollback procedure:

### Test 1: Single File Rollback
```bash
# Make a test change
echo "test" >> .kiro/steering/test-rollback.md
git add .
git commit -m "Test: Rollback test"

# Rollback
git reset --hard HEAD~1

# Verify file restored
cat .kiro/steering/test-rollback.md  # Should not exist or be unchanged
```

### Test 2: MCP Re-Index
```bash
# Check current health
get_index_health()

# Force re-index
rebuild_index()

# Verify health restored
get_index_health()
```

### Test 3: Reference Validation
```bash
# Capture current state
list_cross_references({ path: ".kiro/steering/Development Workflow.md" })

# Verify all references resolve
# (Manual review)
```

---

## Notes

- Always create backup branches before high-risk batches
- Commit after each batch to enable granular rollback
- Re-index MCP after any rollback involving file renames
- Test rollback procedure before beginning execution
- Document any issues encountered during rollback for future reference
- Human review required before resuming after emergency rollback
