# docs/ Directory MCP Inclusion — Audit and Recommendation

**Date**: 2026-02-20
**Discovered By**: Peter + AI audit
**Status**: Proposed
**Priority**: Medium
**Impact**: Documentation discoverability, AI agent context quality, metadata consistency

---

## Overview

The MCP Documentation Server currently indexes only `.kiro/steering/` (configured via `DEFAULT_STEERING_DIR` in `mcp-server/src/index.ts`). The `docs/` directory contains 8 root-level documents and multiple subdirectories with guides, specs summaries, and reference material. Many of these docs are already cross-referenced from MCP-indexed steering docs, but they aren't queryable via MCP tools (`get_section`, `get_document_summary`, etc.).

This issue captures the current state, metadata compliance gaps, and a recommendation for safely expanding MCP scope to include select `docs/` files.

---

## Current State

### MCP Server Configuration

```typescript
// mcp-server/src/index.ts
const DEFAULT_STEERING_DIR = '.kiro/steering/';
```

The server accepts `MCP_STEERING_DIR` as an environment variable override but currently only indexes a single directory. Multi-directory support would require code changes.

### docs/ Root-Level Files (8 files)

| File | Date Format | Last Reviewed | Layer | Relevant Tasks | Organization | Front Matter | MCP Candidate |
|------|-------------|---------------|-------|----------------|--------------|--------------|---------------|
| `figma-workflow-guide.md` | ✅ YYYY-MM-DD | ✅ Yes | ✅ 3 | ✅ Yes | spec-guide | ❌ None | ✅ Strong |
| `dtcg-integration-guide.md` | ✅ YYYY-MM-DD | ✅ Yes | ✅ 3 | ✅ Yes | spec-guide | ⚠️ Dead `inclusion: manual` | ✅ Strong |
| `transformer-development-guide.md` | ✅ YYYY-MM-DD | ✅ Yes | ✅ 3 | ✅ Yes | spec-guide | ⚠️ Dead `inclusion: manual` | ✅ Strong |
| `mcp-integration-guide.md` | ✅ YYYY-MM-DD | ✅ Yes | ✅ 3 | ✅ Yes | spec-guide | ⚠️ Dead `inclusion: manual` | ✅ Strong |
| `token-system-overview.md` | ✅ YYYY-MM-DD | ✅ Yes | ✅ 2 | ❌ Missing | process-standard | ❌ None | ✅ Strong |
| `platform-conventions-guide.md` | ❌ `November 8, 2025` | ❌ Missing | ❌ Missing | ❌ Missing | process-standard | ❌ None | ⚠️ Needs cleanup |
| `performance-baseline.md` | ❌ `November 22, 2025` | ❌ Uses `Last Updated` | ❌ Missing | ❌ Missing | ❌ Missing | ❌ None | ⚠️ Needs cleanup |
| `rosetta-stemma-systems-diagram.md` | ❌ Missing | ❌ Missing | ❌ Missing | ❌ Missing | ❌ Missing | ❌ None | ❌ Low priority |

### docs/examples/ (1 file)

| File | Date Format | Last Reviewed | Layer | Relevant Tasks | Organization | MCP Candidate |
|------|-------------|---------------|-------|----------------|--------------|---------------|
| `design-outline-example.md` | ✅ YYYY-MM-DD | ✅ Yes | ✅ 3 | ✅ Yes | spec-guide | ⚠️ Maybe (reference material) |

### Date Format Fix Status

The following files had their dates corrected from long-form (`February 20, 2026`) to standard (`2026-02-20`) in this session — changes staged but not yet committed:

- ✅ `docs/figma-workflow-guide.md`
- ✅ `docs/dtcg-integration-guide.md`
- ✅ `docs/transformer-development-guide.md`
- ✅ `docs/mcp-integration-guide.md`
- ✅ `docs/examples/design-outline-example.md`
- ✅ `docs/token-system-overview.md` (also fixed `Last Updated` → `Last Reviewed`)

Not yet fixed (older docs, separate cleanup):
- ❌ `docs/performance-baseline.md`
- ❌ `docs/platform-conventions-guide.md`
- ❌ `docs/rosetta-stemma-systems-diagram.md`

---

## Dead Front Matter

Three docs have YAML front matter with `inclusion: manual` that does nothing because the MCP server doesn't index `docs/`:

- `docs/dtcg-integration-guide.md`
- `docs/transformer-development-guide.md`
- `docs/mcp-integration-guide.md`

**Options:**
1. Remove front matter now (it's dead config)
2. Keep it as forward-looking for when MCP scope expands (but it could confuse agents into thinking these are MCP-queryable)
3. Move these files to `.kiro/steering/` (makes them MCP-queryable immediately, but changes their location)

**Recommendation**: Option 1 (remove) or Option 2 (keep) depending on timeline for MCP expansion. If expansion is imminent, keep. If deferred, remove to avoid confusion.

---

## Cross-Reference Overlap Risk

Multiple steering docs already cross-reference `docs/` files. If `docs/` files are added to MCP, there's a risk of conflicting guidance between:

### Potential Conflicts to Audit Before Inclusion

| Steering Doc | docs/ File | Overlap Area | Risk |
|-------------|-----------|--------------|------|
| `Token-Governance.md` | `dtcg-integration-guide.md` | Token format, DTCG extensions | Low — different scope (governance vs format spec) |
| `Token-Quick-Reference.md` | `dtcg-integration-guide.md` | Token type mapping | Medium — both describe token types, could diverge |
| `Rosetta-System-Architecture.md` | `token-system-overview.md` | Pipeline architecture | Medium — both describe token flow, different granularity |
| `Rosetta-System-Architecture.md` | `transformer-development-guide.md` | Generation subsystem | Low — architecture vs implementation guide |
| `Component-Development-Guide.md` | `figma-workflow-guide.md` | Component token decisions | Low — different phases (implementation vs extraction) |
| `Token-Governance.md` | `figma-workflow-guide.md` | Token creation governance | Medium — extraction suggests tokens, governance controls creation |

### Specific Concerns

1. **Token type descriptions**: `Token-Quick-Reference.md` and `dtcg-integration-guide.md` both describe token types. If both are MCP-queryable, an agent could get slightly different descriptions of the same token type depending on which doc it queries.

2. **Pipeline architecture**: `Rosetta-System-Architecture.md` and `token-system-overview.md` both describe the token pipeline. The steering doc is more detailed; the docs/ file is a higher-level overview. An agent might get confused about which is authoritative.

3. **Token governance in extraction context**: `figma-workflow-guide.md` describes how extraction surfaces token suggestions with "pending Ada review." `Token-Governance.md` defines the formal governance framework. If both are queryable, an agent needs to understand the extraction doc defers to governance, not replaces it.

---

## Recommendation: Phased Inclusion

### Phase 1: Metadata Cleanup (Do Now)

1. ✅ Fix date formats on the 6 docs (done this session)
2. Fix remaining metadata gaps on `platform-conventions-guide.md` and `performance-baseline.md`
3. Decide on front matter: remove or keep on the 3 docs that have it
4. Add missing `Relevant Tasks` to `token-system-overview.md`

### Phase 2: Conflict Audit (Before MCP Expansion)

Before adding any `docs/` files to MCP, audit each candidate for:
- Overlapping content with existing steering docs
- Contradictory guidance or outdated information
- Clear scope boundaries (what each doc is authoritative for)

Add explicit scope declarations to each doc:
```markdown
**Authoritative For**: DTCG format specification, tool integration patterns
**Defers To**: Token-Governance.md for token creation decisions, Rosetta-System-Architecture.md for pipeline internals
```

### Phase 3: MCP Server Changes (Implementation)

Two approaches for multi-directory support:

**Option A: Multiple directory configuration**
```typescript
// Support comma-separated directories
const DEFAULT_DIRS = '.kiro/steering/,docs/';
```
Pros: Simple, flexible. Cons: All docs/ files get indexed, including subdirectories.

**Option B: Explicit file list**
```typescript
// Allowlist specific docs/ files
const ADDITIONAL_DOCS = [
  'docs/figma-workflow-guide.md',
  'docs/dtcg-integration-guide.md',
  'docs/transformer-development-guide.md',
  'docs/mcp-integration-guide.md',
  'docs/token-system-overview.md',
];
```
Pros: Precise control, no accidental inclusion. Cons: Manual maintenance.

**Option C: Glob pattern support**
```typescript
// Support glob patterns
const INDEX_PATTERNS = ['.kiro/steering/*.md', 'docs/*.md'];
```
Pros: Flexible, excludes subdirectories by default. Cons: More complex implementation.

**Recommendation**: Option C (glob patterns) provides the best balance of flexibility and control. It indexes root-level `docs/` files without pulling in `docs/specs/`, `docs/releases/`, etc.

### Phase 4: Steering Doc Updates (After Inclusion)

Once `docs/` files are MCP-queryable:
1. Update `00-Steering Documentation Directional Priorities.md` to list new MCP-accessible docs
2. Add MCP query examples to each newly-included doc
3. Update cross-references to use MCP query patterns where appropriate

---

## Files Not Recommended for MCP Inclusion

| Directory | Reason |
|-----------|--------|
| `docs/specs/` | Task summaries — release detection artifacts, not reference docs |
| `docs/releases/` | Release notes — historical records, not guidance |
| `docs/architecture/` | Needs audit — may overlap with steering architecture docs |
| `docs/testing/` | Needs audit — may overlap with Test Development Standards |
| `docs/migration/` | Historical migration guides — low ongoing value |
| `docs/examples/` | Reference examples — possibly useful but low priority |

---

## Open Questions

1. **Timeline**: When do you want to tackle MCP expansion? This affects whether to remove or keep the dead front matter.
2. **Scope**: Should we include all 5 strong candidates, or start with a subset?
3. **Authority model**: Should `docs/` files be explicitly marked as "defers to" steering docs, or should they be treated as equal authority?
4. **Subdirectory docs**: Should `docs/architecture/`, `docs/testing/`, etc. be audited for inclusion, or are those out of scope?

---

## Related Documentation

- [MCP Server Source](../../mcp-server/src/index.ts) — Current directory configuration
- [Steering Documentation Directional Priorities](../../.kiro/steering/00-Steering%20Documentation%20Directional%20Priorities.md) — MCP document registry
- [Process-File-Organization](../../.kiro/steering/Process-File-Organization.md) — File organization standards
- [Token-Quick-Reference](../../.kiro/steering/Token-Quick-Reference.md) — Cross-references docs/ files
- [Token-Governance](../../.kiro/steering/Token-Governance.md) — Cross-references docs/ files
- [Rosetta-System-Architecture](../../.kiro/steering/Rosetta-System-Architecture.md) — Cross-references docs/ files
