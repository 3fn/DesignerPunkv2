# Design Outline: Release Management System Steering Documentation

**Date**: 2025-12-30
**Spec**: 033 - Release Management System Steering Documentation
**Status**: Captured from Spec 032 Follow-Up
**Priority**: High (recommended next spec after 032 completion)

---

## Origin

This spec was identified as a follow-up item during Spec 032 (Documentation Architecture Audit). Multiple audit tasks surfaced the same gap:

- **Task 3** (docs/examples/ audit): "AI agents interact with the release system but lack a mental model of how it works"
- **Task 7** (Large Root Documents audit): "Development Workflow covers hooks/triggers but not the system itself"

The audit confirmed that Release Management System IS part of design system operations, but the existing documentation serves human developers (step-by-step tutorials, operational guides) rather than AI agents (conceptual understanding).

---

## Problem Statement

AI agents interact with the release system regularly:
- Creating completion documents that feed into release notes
- Triggering release detection via summary documents
- Following task completion workflows that involve release hooks

However, there is no steering documentation that gives AI agents a mental model of:
- What triggers release analysis
- How completion docs feed into release notes
- The relationship between task completion → summary doc → release detection → version bump
- When and why AI agents interact with the release system

Development Workflow mentions release detection hooks in conditional sections but doesn't provide conceptual understanding.

---

## Scope Discussion (from Spec 032 Task 10.1)

**Why this wasn't included in Spec 032:**

1. **Scope discipline**: Spec 032's purpose was *audit and consolidate* existing documentation. Creating new content is a different kind of work.

2. **Proper requirements gathering**: A steering doc for AI agents is high-impact. Questions that deserve their own requirements phase:
   - What mental model do AI agents need?
   - What's the right boundary between this doc and Development Workflow?
   - Should it be Layer 1 (always loaded) or Layer 2 (conditional)?
   - How does it relate to the tutorials kept in `docs/examples/`?

3. **Cohesive release system audit**: A dedicated spec can audit *all* release system documentation holistically - not just what Spec 032 happened to touch. It can look at:
   - The tutorials in `docs/examples/`
   - The operational docs in `docs/release-management/` (after 032 consolidation)
   - The hooks documentation in Development Workflow
   - And design a coherent information architecture

---

## Key Design Questions

1. **What mental model do AI agents need?**
   - High-level architecture of the release pipeline
   - Key concepts: completion docs, summary docs, release triggers, version bumps
   - Decision points where AI agents make choices

2. **What's the right boundary with Development Workflow?**
   - Development Workflow covers *how* to trigger release detection (the mechanics)
   - This doc should cover *what* the release system is and *why* it works the way it does

3. **What layer should this be?**
   - Layer 1 (always loaded): If release system understanding is essential for all tasks
   - Layer 2 (conditional): If only needed when working on release-related tasks
   - Likely Layer 2 with conditional loading when task completion is involved

4. **How does it relate to existing docs?**
   - `docs/examples/tutorials/`: Human-facing step-by-step guides (keep separate)
   - `docs/release-management/`: Human-facing operational docs (keep separate)
   - This doc: AI-facing conceptual understanding (new)

---

## Input from Spec 032

The following Spec 032 artifacts provide context for this spec:

- `confirmed-examples-actions.md` - Decision to keep tutorials separate from AI steering
- `confirmed-large-root-actions.md` - Decision on two-tier approach (steering for AI, operational for humans)
- `confirmed-medium-root-actions.md` - Confirmation that release management is in-scope for design system operations
- `consolidation-execution-checklist.md` - Documents the follow-up item

After Spec 032 Task 10 completes, the release management documentation will be organized as:
- `docs/release-management/` - 6 operational docs for human developers
- `docs/examples/` - 16 tutorial files for human developers
- `.kiro/steering/` - (gap) No release system steering doc for AI agents

---

## Proposed Deliverable

**Primary Artifact**: `.kiro/steering/Release Management System.md`

**Purpose**: Explain release system mental model for AI agents

**Proposed Content Areas** (to be refined in requirements phase):
- What triggers release analysis
- How completion docs feed into release notes
- Relationship between task completion → summary doc → release detection → version bump
- High-level architecture of the release pipeline
- When and why AI agents interact with the release system

**Audience**: AI agents (not human CLI users)

---

## Scope Extension: Token Quick Reference (from Spec 032 Follow-Up)

**Origin**: During Spec 032 Task 10.3 completion review, a token documentation sustainability issue was identified.

### Problem Statement

Nine token documentation files were moved to `.kiro/steering/` with MCP access:
- semantic-token-structure.md (~8,809 tokens)
- color-tokens.md (~5,210 tokens)
- blend-tokens.md (~3,944 tokens)
- shadow-tokens.md (~6,317 tokens)
- spacing-tokens.md (~3,885 tokens)
- typography-tokens.md (~4,798 tokens)
- layering-tokens.md (~4,946 tokens)
- glow-tokens.md (~3,997 tokens)
- motion-tokens.md (~5,300 tokens)

**Total: ~47,206 tokens** - unsustainable for `inclusion: always`

These docs are set to `inclusion: manual`, which works with MCP progressive disclosure. However, AI agents working on component development need quick token lookups without loading entire reference docs.

### Proposed Solution: Token Quick Reference

Create a lightweight "Token Quick Reference" steering doc (~1,000-1,500 tokens) with:

1. **Quick Reference Tables** - Token name → value → use case for each token type
2. **MCP Query Guidance** - Which doc to query for deeper information
3. **Common Patterns** - Most frequently used token combinations

**Inclusion**: `always` (small enough to be sustainable)

**Purpose**: Answer 80% of token questions without loading full reference docs. For the 20% requiring deep dives, agents query specific MCP sections.

### Design Questions

1. **What belongs in quick reference vs full docs?**
   - Quick reference: Token names, values, primary use cases
   - Full docs: Platform examples, mathematical relationships, migration guides, design rationale

2. **How to structure for maximum efficiency?**
   - Tables optimized for scanning
   - Grouped by token type (color, spacing, typography, etc.)
   - Cross-references to MCP sections for deep dives

3. **Should this be part of Spec 033 or a separate spec?**
   - Argument for 033: Both address "AI agent mental models" gap
   - Argument for separate: Different domains (release system vs token system)
   - **Recommendation**: Include in 033 as a secondary deliverable - both are "steering doc gaps identified by 032"

---

## Scope Extension: Token Documentation Gap Analysis (from Spec 032 Follow-Up)

**Origin**: During Spec 032 Task 1 (Tokens Audit), a documentation gap was identified.

### Problem Statement

The token documentation audit revealed that while 9 token docs exist and were moved to MCP, there are token types in the codebase that lack corresponding documentation:

**Potentially Missing Token Docs**:
- `border-tokens.md` - Border width and style tokens
- `radius-tokens.md` - Border radius tokens
- Other token types that may exist in implementation but lack documentation

### Proposed Solution

Include a task in Spec 033 to:
1. Audit the token implementation files in `src/tokens/` to identify all token types
2. Compare against existing token documentation in `.kiro/steering/`
3. Create a gap analysis report
4. Optionally create missing token documentation (or defer to separate spec)

### Design Questions

1. **Should missing docs be created in this spec or deferred?**
   - Argument for 033: Complete the token documentation story
   - Argument for separate: Keep 033 focused on steering docs
   - **Recommendation**: Include gap analysis in 033, defer doc creation to separate spec if significant

2. **What's the minimum viable token doc?**
   - Quick reference entry in Token Quick Reference
   - Full reference doc in `.kiro/steering/`
   - Both?

---

## Scope Extension: Empty docs/tokens/ Directory Cleanup (from Spec 032 Follow-Up)

**Origin**: After Spec 032 Task 10.3 completion, the `docs/tokens/` directory is now empty.

### Current State

All 9 token documentation files were moved to `.kiro/steering/` for MCP integration. The 2 empty files were deleted. The `docs/tokens/` directory now contains no files.

### Options

1. **Remove the empty directory**
   - Cleaner directory structure
   - Avoids confusion about where token docs live

2. **Add a README explaining the change**
   - Provides context for anyone looking for token docs
   - Points to `.kiro/steering/` and MCP access
   - Preserves the directory for potential future use

3. **Leave as-is**
   - Minimal change
   - May cause confusion

### Recommendation

Option 2 (Add README) - Include a simple task in Spec 033 to add a README.md to `docs/tokens/` explaining:
- Token documentation has moved to `.kiro/steering/` for MCP integration
- How to access token docs via MCP
- Why the change was made (Spec 032 audit decision)

---

## Next Steps

1. ✅ Complete Spec 032 Task 10 (consolidation) - DONE
2. Begin Spec 033 requirements phase
3. Use Spec 032 audit findings as input to requirements
4. Include all scope extensions as deliverables:
   - Primary: Release Management System steering doc
   - Secondary: Token Quick Reference
   - Tertiary: Token documentation gap analysis
   - Tertiary: docs/tokens/ README

---

*This outline captures context from Spec 032 to inform future spec development. Full requirements, design, and tasks to be developed when this spec is prioritized.*
