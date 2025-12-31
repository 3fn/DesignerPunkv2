# Design Outline: Steering Documentation Enhancements

**Date**: 2025-12-30
**Spec**: 033 - Steering Documentation Enhancements
**Status**: Design Outline
**Priority**: High (recommended next spec after 032 completion)

---

## Overview

Spec 032 (Documentation Architecture Audit) identified multiple gaps in AI agent steering documentation. This spec addresses those gaps as a cohesive cleanup effort, creating new steering documents and performing targeted audits to complete the documentation story.

**Unifying Theme**: All deliverables address the same core problem—AI agents lack the mental models and quick-reference materials needed to work effectively with the layered complexity of a design system.

---

## Origin

This spec consolidates follow-up items from Spec 032:

| Source | Gap Identified |
|--------|----------------|
| Task 3 (docs/examples/ audit) | "AI agents interact with the release system but lack a mental model of how it works" |
| Task 7 (Large Root Documents audit) | "Development Workflow covers hooks/triggers but not the system itself" |
| Task 10.3 (Token consolidation) | Token docs moved to MCP but no quick-reference for common lookups |
| Task 1 (Tokens audit) | Potential token types in codebase without documentation |
| Task 10.3 completion | Empty `docs/tokens/` directory needs cleanup |

---

## Deliverables

### D1: Release Management System Steering Doc (Priority: High)

**Problem**: AI agents interact with the release system regularly but have no mental model of how it works.

**Deliverable**: `.kiro/steering/Release Management System.md`

**Content Areas**:
- What triggers release analysis
- How completion docs feed into release notes
- Relationship: task completion → summary doc → release detection → version bump
- High-level architecture of the release pipeline
- When and why AI agents interact with the release system
- What aspects of the system are automated and/or manual

**Audience**: AI agents (not human CLI users)

**Layer**: `inclusion: manual` (MCP-queryable, keeps always-loaded context lean)

**Boundary with Development Workflow**:
- Development Workflow: *How* to trigger release detection (mechanics, commands)
- This doc: *What* the release system is, *how* the different aspects of the release system work together, and *why* it works the way it does

---

### D2: Token Documentation Gap Analysis (Priority: Medium)

**Problem**: Token docs exist for 9 token types, but the codebase may have additional token types without documentation.

**Deliverable**: `.kiro/specs/033-steering-documentation-enhancements/gap-analysis.md`

**Scope**:
- Audit `src/tokens/` to identify all token types
- Compare against existing token documentation in `.kiro/steering/`
- Document gaps (e.g., border-tokens, radius-tokens)
- Recommend: create missing docs in this spec OR defer to separate spec

**Decision Point**: If gap analysis reveals significant missing documentation, note gaps in D3 quick reference and create a follow-up spec for filling gaps. D3 proceeds with existing 9 docs regardless.

**Why D2 before D3**: Can't build a comprehensive quick reference without knowing what's missing. Gap analysis informs the complete picture.

---

### D3: Token Quick Reference (Priority: Low - depends on D2)

**Problem**: Nine token docs (~47,206 tokens total) are now MCP-only. AI agents need quick lookups without loading full reference docs.

**Deliverable**: `.kiro/steering/Token Quick Reference.md`

**Content Areas**:
- **Routing table**: Which MCP doc to query for each token type (color → color-tokens.md, spacing → spacing-tokens.md, etc.)
- **Token type overview**: Brief description of each token category's purpose
- **Common patterns**: Most frequently used token combinations
- **MCP query examples**: How to efficiently query for deeper information

**Target Size**: ~1,000-1,500 tokens (sustainable for `inclusion: always`)

**Purpose**: Route agents to the right MCP query—not duplicate token values. Answer "where do I look?" not "what's the value?"

**Inclusion**: `always` (small routing table, not full reference)

---

### D4: docs/tokens/ README (Priority: Low)

**Problem**: After Spec 032, `docs/tokens/` is empty. This may confuse developers looking for token documentation.

**Deliverable**: `docs/tokens/README.md`

**Content**:
- Explanation that token docs moved to `.kiro/steering/` for MCP integration
- How to access token docs via MCP
- Why the change was made (Spec 032 audit decision)

**Effort**: Trivial (~15 minutes)

---

## Design Questions

### Architecture Questions

1. **What mental model do AI agents need for the release system?**
   - High-level pipeline architecture
   - Key concepts and their relationships
   - Decision points where AI agents make choices

2. **What belongs in Token Quick Reference vs full docs?**
   - Quick reference: **Routing table** - which doc to query for each token type
   - Quick reference: Token type overviews, common patterns, MCP query examples
   - Full docs: Actual token values, platform examples, mathematical relationships, migration guides, design rationale

### Boundary Questions

3. **What's the right boundary between Release Management System doc and Development Workflow?**
   - Development Workflow: Mechanics (commands, hooks, triggers)
   - Release Management System: Concepts (what, why, relationships)

4. **How does Release Management System doc relate to existing docs?**
   - `docs/examples/tutorials/`: Human-facing step-by-step guides (keep separate)
   - `docs/release-management/`: Human-facing operational docs (keep separate)
   - This doc: AI-facing conceptual understanding (new)

### Layer Questions

5. **What layer should Release Management System doc be?**
   - Layer 1 (always loaded): If essential for all tasks
   - Layer 2 (conditional): If only needed for release-related tasks
   - `inclusion: manual`: MCP-queryable when needed
   - **Recommendation**: `inclusion: manual` - conceptual understanding queryable via MCP, keeps always-loaded context lean

6. **What layer should Token Quick Reference be?**
   - **Recommendation**: `inclusion: always` - small routing table (~1,000-1,500 tokens) that helps agents find the right MCP query

### Scope Questions

7. **Should missing token docs be created in this spec or deferred?**
   - **Recommendation**: Include gap analysis, defer doc creation if significant

---

## Input from Spec 032

The following Spec 032 artifacts provide context:

- `confirmed-examples-actions.md` - Decision to keep tutorials separate from AI steering
- `confirmed-large-root-actions.md` - Decision on two-tier approach (steering for AI, operational for humans)
- `confirmed-medium-root-actions.md` - Confirmation that release management is in-scope for design system operations
- `consolidation-execution-checklist.md` - Documents the follow-up items

**Post-032 Documentation State**:
- `docs/release-management/` - 6 operational docs for human developers
- `docs/examples/` - 16 tutorial files for human developers
- `.kiro/steering/` - 9 token docs (MCP-only), no release system doc, no token quick reference

---

## Success Criteria

1. **D1 Complete**: AI agents have a mental model of the release system without reading operational docs
2. **D2 Complete**: Gap analysis identifies any missing token documentation
3. **D3 Complete**: AI agents can route to the right MCP query for token questions
4. **D4 Complete**: `docs/tokens/` directory has clear signposting to new location
5. **Meta-guide Updated**: `00-Steering Documentation Directional Priorities.md` includes entries for D1 and D3

---

## Implementation Constraints

### Meta-guide Update Constraint

**CRITICAL**: Updates to `00-Steering Documentation Directional Priorities.md` MUST be made via bash commands (grep, sed, echo, etc.). AI agents MUST NOT read that file directly—it contains extensive AI agent instructions that will immediately hit context caps.

**Approach**: Use targeted bash commands to:
1. Identify insertion points (grep for section markers)
2. Append new entries at appropriate locations
3. Verify changes without reading full file

---

## Next Steps

1. ✅ Design outline restructured for cohesive spec
2. Begin requirements phase
3. Use design questions to inform acceptance criteria
4. Prioritize deliverables in task planning

---

*This outline captures the unified scope for Spec 033. Full requirements, design, and tasks to be developed.*
