# Task 3.2 Completion: Classify Redundancy as Harmful or Priming

**Date**: 2026-01-03
**Task**: 3.2 Classify redundancy as harmful or priming
**Type**: Documentation
**Status**: Complete
**Organization**: spec-completion
**Scope**: 036-steering-documentation-audit

---

## Summary

Classified all 8 redundant topics identified in Task 3.1 as either harmful redundancy (consolidation candidates) or intentional priming (acceptable). Applied the priming guidelines from Requirements 3.3-3.4: purpose-based (what/why vs how) + ~3-4 sentences max.

---

## Classification Results

### Intentional Priming (Acceptable) - 3 Topics

| Topic | Rationale |
|-------|-----------|
| Task Completion Workflow | Secondary documents provide checklist/context priming, not detailed duplication |
| Token Selection | Well-structured hierarchy with routing in Quick Reference, specialization in token guides |
| MCP Query Patterns | Domain-specific examples add unique value, not content duplication |

### Harmful Redundancy (Consolidation Candidates) - 5 Topics

| Topic | Primary Issue | Proposed Action |
|-------|--------------|-----------------|
| Validation Tiers | Task-Type-Definitions.md duplicates Spec Planning Standards.md | Replace with priming + MCP query |
| Release Detection | Development Workflow.md and Release Management System.md both explain same system | Human decision required on canonical source |
| File Organization | Development Workflow.md duplicates File Organization Standards.md (~200 lines) | Replace with priming + MCP query |
| Completion Documentation | Fragmented across 5 documents with no single source of truth | Consolidate into Spec Planning Standards.md |
| Summary Documents | Same fragmentation issue as completion docs | Consolidate with completion documentation |

---

## Priming Guidelines Applied

**Purpose-Based Guideline (Primary):**
- **Priming** = Enough context to understand *what* and *why* to query, but not *how* to do the thing
- **MCP Query** = The actual detailed guidance on *how*

**Length Guideline (Suggestive):**
- Priming should be ~3-4 sentences max before directing to MCP query
- If content exceeds this, it likely belongs in the canonical source

---

## Key Findings

1. **Development Workflow.md is the primary source of harmful redundancy**
   - Contains ~1,300 tokens of duplicated content
   - File organization (~800 tokens), release detection (~300 tokens), completion docs (~200 tokens)

2. **Completion/Summary documentation fragmentation is a significant issue**
   - No single source of truth
   - Agents must consult 4-5 documents to understand the full workflow

3. **Token documentation hierarchy is well-structured**
   - Good example of intentional priming done right
   - Token Quick Reference routes to specific guides without duplicating content

---

## Human Decisions Required at Checkpoint 2

1. **Release Detection Canonical Source**: Which document should be authoritative?
2. **Completion Documentation Consolidation**: Consolidate into Spec Planning Standards.md or create new document?
3. **Validation Tier Naming Collision**: Rename behavioral-contract-validation-framework.md tiers?

---

## Estimated Token Savings

| Topic | Estimated Savings |
|-------|------------------|
| Validation Tiers | ~400 tokens |
| Release Detection | ~300 tokens |
| File Organization | ~800 tokens |
| Completion Documentation | ~200 tokens |
| Summary Documents | ~600 tokens |
| **Total** | **~2,300 tokens** |

---

## Artifacts Updated

- `.kiro/specs/036-steering-documentation-audit/audit-artifacts/redundancy-analysis.md` - Updated with detailed classifications and rationale

---

## Validation (Tier 1 - Minimal)

- ✅ All 8 topics classified as harmful or priming
- ✅ Priming guidelines applied (purpose-based + length)
- ✅ Rationale documented for each classification
- ✅ Recommendations documented for consolidation candidates
- ✅ Human decision points identified

---

## Requirements Validated

- **3.2**: Redundant content classified as harmful redundancy or intentional priming ✅
- **3.3**: Harmful redundancy documented with proposed canonical sources ✅
- **3.4**: Intentional priming documented as acceptable ✅
