# Design Outline: Documentation Architecture Audit

**Date**: 2025-12-30
**Purpose**: Audit `docs/` directory to assess coverage gaps, redundancy with steering/MCP, and consolidation opportunities
**Organization**: spec-guide
**Scope**: 032-documentation-architecture-audit

---

## Problem Statement

The `docs/` directory contains documentation that may:
1. Duplicate content already in steering docs or MCP-indexed files
2. Cover topics not addressed by steering/MCP (unique value)
3. Be stale, outdated, or no longer relevant to current architecture
4. Serve a different audience (human developers vs AI agents)

Without a systematic audit, we risk:
- Maintaining redundant documentation that drifts out of sync
- Missing opportunities to improve AI agent guidance via MCP
- Confusing developers with conflicting information sources

---

## Audit Scope

### In Scope
- `docs/architecture/` (1 file, ~646 lines)
- `docs/concepts/` (1 file, ~302 lines)
- `docs/examples/` (7 files, ~3,400 lines total)
- `docs/migration/` (2 files, ~1,055 lines)
- `docs/platform-integration/` (2 files, ~842 lines)
- `docs/testing/` (1 file, ~582 lines)
- `docs/tokens/` (11 files, ~5,600 lines total)
- Root-level standalone docs (9 files, ~6,942 lines total)

### Out of Scope
- `docs/specs/` - Task summaries tied to release system (separate concern)

---

## Document Size Analysis

Line counts obtained via `wc -l` to inform task distribution:

### Root-Level Docs (Largest Risk Area)
| File | Lines | Category |
|------|-------|----------|
| environment-configuration-guide.md | 1,459 | Large |
| troubleshooting-guide.md | 1,049 | Large |
| security-best-practices.md | 858 | Medium |
| configuration-reference.md | 845 | Medium |
| authentication-setup-guide.md | 714 | Medium |
| release-management-guide.md | 660 | Medium |
| token-system-overview.md | 657 | Medium |
| platform-conventions-guide.md | 412 | Small |
| performance-baseline.md | 288 | Small |
| **Total** | **6,942** | |

### docs/tokens/ (11 files)
| File | Lines |
|------|-------|
| semantic-token-structure.md | 756 |
| shadow-tokens.md | 728 |
| layering-tokens.md | 670 |
| motion-tokens.md | 653 |
| typography-tokens.md | 585 |
| blend-tokens.md | 490 |
| color-tokens.md | 484 |
| glow-tokens.md | 467 |
| spacing-tokens.md | 383 |
| token-validation-rules.md | 0 ⚠️ |
| token-validation-guide.md | 0 ⚠️ |
| **Total** | **~5,216** |

**Note**: Two empty files identified (`token-validation-rules.md`, `token-validation-guide.md`). No references found in codebase - safe to remove.

### docs/examples/ (7 files)
| File | Lines |
|------|-------|
| integrations/migration-guide.md | 503 |
| tutorials/05-multi-package.md | 491 |
| tutorials/04-major-release.md | 471 |
| tutorials/01-first-release.md | 456 |
| tutorials/06-ci-cd-integration.md | 388 |
| integrations/existing-project.md | 382 |
| tutorials/03-minor-release.md | 303 |
| tutorials/02-patch-release.md | 224 |
| README.md | 225 |
| **Total** | **~3,443** |

### Other Directories
| Directory | Files | Total Lines |
|-----------|-------|-------------|
| docs/architecture/ | 1 | 646 |
| docs/concepts/ | 1 | 302 |
| docs/migration/ | 2 | 1,055 |
| docs/platform-integration/ | 2 | 842 |
| docs/testing/ | 1 | 582 |

---

## Audit Framework

### Per-Document Assessment Criteria

Each document will be evaluated against:

1. **Coverage Analysis**
   - What topics does this document cover?
   - Is this covered by existing steering docs? (list specific overlaps)
   - Is this covered by MCP-indexed docs? (list specific overlaps)
   - What unique content exists that steering/MCP don't cover?

2. **Audience Assessment**
   - Primary audience: AI agents, human developers, or both?
   - If human-focused: Is duplication with steering acceptable?
   - If AI-focused: Should this be in steering or MCP instead?

3. **Currency Check**
   - Last meaningful update (if detectable)
   - References to outdated patterns, APIs, or architecture?
   - Alignment with current True Native Architecture?

4. **Disposition Recommendation**
   - **Keep as-is**: Unique value, correct location, current content
   - **Update**: Valuable but needs refresh for accuracy
   - **Move to steering**: AI-focused, should be in steering system
   - **Add to MCP**: Large reference doc, good MCP candidate
   - **Consolidate**: Merge with existing steering/MCP doc
   - **Archive/Remove**: Redundant, stale, or no longer relevant

---

## Reference: Current Steering & MCP Coverage

### Steering Docs (17 total, ~127k tokens)
| Document | Key Topics | Tokens |
|----------|------------|--------|
| Core Goals | Project context, development practices, token usage | 557 |
| Development Workflow | Task completion, git practices, hooks | 16,093 |
| File Organization Standards | Metadata, cross-references, directory structure | 16,666 |
| Spec Planning Standards | Requirements, design, tasks formats | 27,135 |
| Component Development Guide | Token selection, True Native, component patterns | 11,211 |
| Test Development Standards | Test categories, patterns, anti-patterns | 9,775 |
| Test Failure Audit Methodology | Audit workflow, pattern identification | 14,845 |
| Token Resolution Patterns | Token types, validation, type safety | 3,832 |
| Cross-Platform Decision Framework | Platform-specific vs cross-platform guidance | 2,914 |
| Browser Distribution Guide | Web component loading, ESM/UMD patterns | 4,098 |
| Technology Stack | Platform technologies, CSS standards | 762 |
| BUILD-SYSTEM-SETUP | Build configuration, scripts | 1,975 |
| A Vision of the Future | Philosophical foundation | 8,856 |
| Task-Type-Definitions | Setup/Implementation/Architecture types | 3,793 |
| Personal Note | Collaboration principles | 624 |
| Start Up Tasks | Task checklist | 1,459 |
| Directional Priorities | Meta-guide for steering system | 3,066 |

### Potential Overlap Areas (Hypothesis)
- `docs/tokens/` ↔ Component Development Guide, Token Resolution Patterns
- `docs/token-system-overview.md` ↔ Core Goals token section
- `docs/testing/` ↔ Test Development Standards
- `docs/platform-integration/` ↔ Cross-Platform Decision Framework
- `docs/troubleshooting-guide.md` ↔ Development Workflow troubleshooting
- `docs/release-management-guide.md` ↔ Development Workflow, Spec Planning Standards

---

## Proposed Task Structure

Based on document sizing analysis, tasks are distributed to balance effort:

### Task 1: Audit `docs/tokens/` (~5,200 lines, 11 files)
- High priority: Recently shipped blend tokens
- Compare against: Component Development Guide, Token Resolution Patterns
- MCP candidacy: High (reference documentation)
- Quick win: Remove 2 empty files (no references found)

### Task 2: Audit `docs/architecture/` + `docs/concepts/` (~950 lines, 2 files)
- Compare against: A Vision of the Future, Core Goals
- Assess: Architectural alignment with True Native

### Task 3: Audit `docs/examples/` (~3,400 lines, 7 files)
- Assess: Are examples current? Do they reflect current patterns?
- Compare against: Component Development Guide examples
- Note: Tutorial-style content may serve different purpose than steering

### Task 4: Audit `docs/migration/` (~1,055 lines, 2 files)
- Assess: Are these still relevant migrations?
- Historical value vs active guidance

### Task 5: Audit `docs/platform-integration/` (~842 lines, 2 files)
- Compare against: Cross-Platform Decision Framework, Technology Stack
- Assess: Font setup guides - still accurate?

### Task 6: Audit `docs/testing/` (~582 lines, 1 file)
- Compare against: Test Development Standards, Test Failure Audit Methodology
- High overlap likelihood

### Task 7: Audit Large Root Docs (~2,500 lines, 2 files)
- `environment-configuration-guide.md` (1,459 lines)
- `troubleshooting-guide.md` (1,049 lines)
- These are the largest individual files - warrant dedicated attention

### Task 8: Audit Medium Root Docs (~3,734 lines, 5 files)
- `security-best-practices.md` (858 lines)
- `configuration-reference.md` (845 lines)
- `authentication-setup-guide.md` (714 lines)
- `release-management-guide.md` (660 lines)
- `token-system-overview.md` (657 lines)
- Note: Some may be irrelevant to design system (auth, security)

### Task 9: Audit Small Root Docs (~700 lines, 2 files)
- `platform-conventions-guide.md` (412 lines)
- `performance-baseline.md` (288 lines)

### Task 10: Consolidation & MCP Integration
- Execute recommendations from Tasks 1-9
- Add approved docs to MCP index
- Archive/remove deprecated docs
- Update cross-references

---

## Effort Estimation

| Task | Lines | Files | Estimated Effort |
|------|-------|-------|------------------|
| 1. docs/tokens/ | 5,200 | 11 | Medium-High |
| 2. architecture + concepts | 950 | 2 | Low |
| 3. docs/examples/ | 3,400 | 7 | Medium |
| 4. docs/migration/ | 1,055 | 2 | Low |
| 5. docs/platform-integration/ | 842 | 2 | Low |
| 6. docs/testing/ | 582 | 1 | Low |
| 7. Large root docs | 2,500 | 2 | Medium |
| 8. Medium root docs | 3,734 | 5 | Medium-High |
| 9. Small root docs | 700 | 2 | Low |
| 10. Consolidation | Varies | Varies | Depends on findings |
| **Total** | **~19,000** | **34** | |

---

## Deliverables

### Per-Task Deliverables
- Audit findings document with per-file assessment
- Disposition recommendations with rationale
- List of specific overlaps with steering/MCP

### Final Deliverables
- Updated `docs/` directory structure
- MCP index updates (if any docs added)
- Steering updates (if any docs moved)
- Archive of removed/deprecated docs

---

## Success Criteria

1. Every doc in scope has a documented disposition decision
2. No undocumented redundancy between `docs/` and steering/MCP
3. MCP index includes all appropriate reference documentation
4. Clear audience distinction: steering for AI, docs for humans (where applicable)
5. All retained docs are current and accurate
6. Empty/orphaned files removed

---

## Quick Wins Identified

1. **Remove empty files** (Task 1):
   - `docs/tokens/token-validation-rules.md` (0 lines, no references)
   - `docs/tokens/token-validation-guide.md` (0 lines, no references)

---

## Design Decisions

### 1. Documentation Audience Policy

**Decision**: No formal "docs for humans" vs "steering for AI" separation.

**Rationale**: AI agents are the primary developers, so documentation should prioritize their needs. However, documentation should be inclusive and accessible to both AI and human developers. The audit will naturally surface which docs serve which audience better, but we won't enforce a rigid separation.

### 2. MCP Inclusion Threshold

**Decision**: Value-based assessment, not token count or frequency.

**Rationale**: The question for MCP candidacy is: "Does this improve understanding and enhance ability to maintain, enhance, and/or leverage this design system?" Some small docs may be high-value; some large docs may be noise. Token count is a constraint (large docs benefit from MCP's progressive disclosure), but value drives the decision.

### 3. Archived Document Handling

**Decision**: Delete rather than archive to a separate folder.

**Rationale**: Git history serves as the archive. A dedicated archive folder tends to become a graveyard nobody visits. If we're confident something should go, it should go. Recovery via GitHub is always possible if needed.

### 4. Documentation Maintenance Schedule

**Decision**: Rely on existing MCP health monitoring; no additional schedule needed.

**Rationale**: The MCP server already has health monitoring that detects stale files (currently showing "degraded" status with 1 stale file). This reactive approach (detect drift) is sufficient. The audit may recommend enhancements if gaps are found, but we won't pre-commit to a maintenance schedule.

### 5. Relevance of auth/security docs

**Decision**: Let the audit be the arbiter.

**Rationale**: Initial assumption was these might be boilerplate, but brief review suggests they may cover release management specifics. The detailed audit (Task 8) will assess actual content and make an informed recommendation.

---

## Open Questions

*All original open questions have been resolved as Design Decisions above.*
