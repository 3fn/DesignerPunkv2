# Consolidation Execution Checklist

**Date**: 2025-12-30
**Purpose**: Consolidated action items from Tasks 1-9 for Task 10 execution
**Organization**: spec-completion
**Scope**: 032-documentation-architecture-audit
**Status**: READY FOR EXECUTION

---

## Executive Summary

| Action Type | Count | Complexity |
|-------------|-------|------------|
| File Removals | 2 | Low |
| File Relocations | 6 | Medium |
| MCP Additions | 9 | High |
| Metadata Updates | ~25 | Low |
| Cross-Reference Updates | ~15 | Medium |
| Broken Link Fixes | 1 | Low |

**Total Files Affected**: ~34 files
**Estimated Effort**: Medium-High (primarily due to MCP additions)

---

## Action Items by Type

### 1. FILE REMOVALS (Task 10.2)

**Source**: Task 1 (Tokens Audit)

| File | Reason | Verified |
|------|--------|----------|
| `docs/tokens/token-validation-guide.md` | Empty file, no references | ✅ |
| `docs/tokens/token-validation-rules.md` | Empty file, no references | ✅ |

**Execution**: Delete files directly. Git history serves as archive.

---

### 2. FILE RELOCATIONS (Task 10.2/10.4)

**Source**: Tasks 7 & 8 (Large and Medium Root Documents)

**Create Directory First**:
- [ ] Create `docs/release-management/` subdirectory

**Files to Move**:

| Source | Destination | Source Task |
|--------|-------------|-------------|
| `docs/environment-configuration-guide.md` | `docs/release-management/environment-configuration-guide.md` | Task 7 |
| `docs/troubleshooting-guide.md` | `docs/release-management/troubleshooting-guide.md` | Task 7 |
| `docs/security-best-practices.md` | `docs/release-management/security-best-practices.md` | Task 8 |
| `docs/configuration-reference.md` | `docs/release-management/configuration-reference.md` | Task 8 |
| `docs/authentication-setup-guide.md` | `docs/release-management/authentication-setup-guide.md` | Task 8 |
| `docs/release-management-guide.md` | `docs/release-management/release-management-guide.md` | Task 8 |

**Post-Move**: Update cross-references (see Section 5)

---

### 3. MCP ADDITIONS (Task 10.3)

**Source**: Task 1 (Tokens Audit)

**Priority Order** (as confirmed):

| Priority | File | Value Assessment |
|----------|------|------------------|
| 1 | `docs/tokens/semantic-token-structure.md` | Very High Value |
| 2 | `docs/tokens/color-tokens.md` | High Value |
| 3 | `docs/tokens/blend-tokens.md` | High Value |
| 4 | `docs/tokens/shadow-tokens.md` | High Value |
| 5 | `docs/tokens/spacing-tokens.md` | High Value |
| 6 | `docs/tokens/typography-tokens.md` | High Value |
| 7 | `docs/tokens/layering-tokens.md` | High Value |
| 8 | `docs/tokens/glow-tokens.md` | Medium Value |
| 9 | `docs/tokens/motion-tokens.md` | Medium Value |

**MCP Addition Process** (per file):
1. Add metadata header with required fields (Date, Purpose, Organization, Scope, Layer, Relevant Tasks)
2. Move file to `.kiro/steering/` directory
3. Rebuild MCP index via `rebuild_index` tool
4. Verify MCP health is "healthy"

**Note**: Files remain in `docs/tokens/` but are ALSO indexed by MCP. The MCP server indexes `.kiro/steering/` AND can be configured to index other directories.

**CLARIFICATION NEEDED**: Confirm whether MCP addition means:
- A) Move files to `.kiro/steering/` (per design.md)
- B) Keep files in `docs/tokens/` and configure MCP to index that directory
- C) Create symlinks or copies

---

### 4. METADATA UPDATES (Task 10.3/10.4)

#### 4.1 Add "Last Reviewed: 2025-12-30" to Token Docs

**Source**: Task 1

| File | Action |
|------|--------|
| `docs/tokens/blend-tokens.md` | Add Last Reviewed date |
| `docs/tokens/color-tokens.md` | Add Last Reviewed date |
| `docs/tokens/glow-tokens.md` | Add Last Reviewed date |
| `docs/tokens/layering-tokens.md` | Add Last Reviewed date |
| `docs/tokens/motion-tokens.md` | Add Last Reviewed date |
| `docs/tokens/semantic-token-structure.md` | Add Last Reviewed date |
| `docs/tokens/shadow-tokens.md` | Add Last Reviewed date |
| `docs/tokens/spacing-tokens.md` | Add Last Reviewed date |
| `docs/tokens/typography-tokens.md` | Add Last Reviewed date |

#### 4.2 Add "Last Reviewed: 2025-12-30" to Examples Directory

**Source**: Task 3

All 16 files in `docs/examples/`:
- `docs/examples/README.md`
- `docs/examples/tutorials/01-first-release.md`
- `docs/examples/tutorials/02-patch-release.md`
- `docs/examples/tutorials/03-minor-release.md`
- `docs/examples/tutorials/04-major-release.md`
- `docs/examples/tutorials/05-multi-package.md`
- `docs/examples/tutorials/06-ci-cd-integration.md`
- `docs/examples/integrations/existing-project.md`
- `docs/examples/integrations/migration-guide.md`
- `docs/examples/integrations/github-actions.yml`
- `docs/examples/integrations/gitlab-ci.yml`
- `docs/examples/configurations/single-package.json`
- `docs/examples/configurations/monorepo-synchronized.json`
- `docs/examples/configurations/monorepo-independent.json`
- `docs/examples/configurations/ci-cd-github-actions.json`
- `docs/examples/configurations/development-dry-run.json`

#### 4.3 Add "Last Reviewed: 2025-12-30" to Relocated Files

**Source**: Tasks 7 & 8

All 6 files being relocated to `docs/release-management/`:
- Add Last Reviewed date
- Add "Audit Decision: Keep - operational docs for Release Management System" note

#### 4.4 Optional Metadata Fix

**Source**: Task 6

| File | Action |
|------|--------|
| `docs/testing/test-infrastructure-guide.md` | Fix metadata mismatch (`process-standard` → appropriate value) |

---

### 5. CROSS-REFERENCE UPDATES (Task 10.4)

#### 5.1 Add Cross-References to Token Docs

**Source**: Task 1

For all 9 token docs, add cross-references to:
- Component Development Guide
- Token Resolution Patterns

#### 5.2 Fix Broken Cross-Reference

**Source**: Task 5

| File | Action |
|------|--------|
| `docs/platform-integration/ios-font-setup.md` | Remove broken reference to `../web-font-loading.md` |

#### 5.3 Update References to Relocated Files

**Source**: Tasks 7 & 8

Search for and update any references to:
- `docs/environment-configuration-guide.md` → `docs/release-management/environment-configuration-guide.md`
- `docs/troubleshooting-guide.md` → `docs/release-management/troubleshooting-guide.md`
- `docs/security-best-practices.md` → `docs/release-management/security-best-practices.md`
- `docs/configuration-reference.md` → `docs/release-management/configuration-reference.md`
- `docs/authentication-setup-guide.md` → `docs/release-management/authentication-setup-guide.md`
- `docs/release-management-guide.md` → `docs/release-management/release-management-guide.md`

#### 5.4 Optional Cross-Reference Addition

**Source**: Task 6

| File | Action |
|------|--------|
| `docs/testing/test-infrastructure-guide.md` | Add brief note pointing to Test Development Standards |

---

### 6. CONTENT UPDATES (Task 10.4)

#### 6.1 Document Rajdhani-Light.ttf Availability

**Source**: Task 5

| File | Action |
|------|--------|
| `docs/platform-integration/android-font-setup.md` | Add note that Rajdhani-Light.ttf (300 weight) exists but is not actively used |
| `docs/platform-integration/ios-font-setup.md` | Add note that Rajdhani-Light.ttf (300 weight) exists but is not actively used |

---

## Conflict Analysis

**No conflicting recommendations identified.**

All confirmed actions are consistent across tasks:
- ✅ Task 1 (Tokens): Remove 2 empty files, add 9 to MCP
- ✅ Task 2 (Architecture/Concepts): Keep both files, no changes
- ✅ Task 3 (Examples): Keep all 16 files, add metadata
- ✅ Task 4 (Migration): Keep both files, metadata already updated
- ✅ Task 5 (Platform Integration): Keep both files, minor fixes
- ✅ Task 6 (Testing): Keep file, optional updates
- ✅ Task 7 (Large Root): Keep and relocate 2 files
- ✅ Task 8 (Medium Root): Keep 5 files, relocate 4
- ✅ Task 9 (Small Root): Keep both files, no changes

**Consistency Verified**:
- Release Management System confirmed as in-scope (Tasks 3, 7, 8)
- Two-tier approach confirmed: steering docs for AI, operational docs for humans
- MCP additions limited to token reference docs (high value for AI agents)

---

## Follow-Up Items (Out of Scope)

These items were identified during the audit but are NOT part of Task 10:

1. **NEW SPEC NEEDED**: Create MCP steering doc for Release Management System
   - Identified in: Tasks 3, 7
   - Purpose: Mental model for AI agents
   - Location: `.kiro/steering/Release Management System.md`

2. **Documentation Gap Analysis**: Missing token documentation
   - Identified in: Task 1
   - Examples: `border-tokens.md`, `radius-tokens.md`
   - Consider separate spec to identify and create missing docs

---

## Task 10 Subtask Scope Evaluation

Based on the consolidated actions, here is the recommended scope for remaining subtasks:

### Task 10.2: Execute File Removals
- **Scope**: 2 file deletions + 6 file relocations
- **Complexity**: Low-Medium
- **Recommendation**: Keep as-is, straightforward execution

### Task 10.3: Execute MCP Additions
- **Scope**: 9 token docs to add to MCP
- **Complexity**: High (requires metadata headers, index rebuild, health verification)
- **Recommendation**: May need clarification on MCP addition process (move vs. configure)

### Task 10.4: Update Cross-References
- **Scope**: ~15 cross-reference updates across multiple files
- **Complexity**: Medium
- **Recommendation**: Keep as-is, includes broken link fix and relocated file references

### Task 10.5: Create Consolidation Summary
- **Scope**: Summary document + final verification
- **Complexity**: Low
- **Recommendation**: Keep as-is

---

## Execution Order Recommendation

1. **Task 10.2**: File removals and relocations (creates clean structure)
2. **Task 10.4**: Cross-reference updates (fixes broken links, updates relocated file refs)
3. **Task 10.3**: MCP additions (adds token docs to MCP with metadata)
4. **Task 10.5**: Consolidation summary (documents all changes, final verification)

**Rationale**: Execute structural changes first (removals, relocations), then fix references, then add to MCP (which may require files to be in final locations), then summarize.

---

*Checklist compiled from confirmed actions documents on 2025-12-30*
*Ready for Task 10.2-10.5 execution*
