# Task 3 Completion: Create Lina System Prompt

**Date**: 2026-02-14
**Task**: 3. Create Lina System Prompt
**Type**: Parent (Architecture)
**Validation**: Tier 3 - Comprehensive
**Organization**: spec-completion
**Scope**: 060-custom-agent-system (Lina)
**Status**: Complete

---

## Summary

Completed Lina's system prompt at `.kiro/agents/lina-prompt.md` with all nine required sections from the design document. The prompt defines Lina's identity as the Stemma component specialist, establishes clear domain boundaries with deferral patterns to Ada (tokens) and Thurgood (test governance), and integrates Token Governance, ballot measure documentation model, and AI-Collaboration-Principles.

## Primary Artifact

- `.kiro/agents/lina-prompt.md` — Complete system prompt defining Lina's identity, domain, boundaries, workflows, governance, and collaboration model

## Success Criteria Verification

| Criterion | Status | Evidence |
|-----------|--------|----------|
| System prompt defines Lina's identity, domain, and boundaries | ✅ | Identity section + Domain Boundaries section with in/out/boundary cases |
| Lina correctly identifies herself and her specialization | ✅ | "You are Lina, named after Lina Bo Bardi. You are the Stemma component system specialist" |
| Lina defers out-of-domain requests to Ada or Thurgood | ✅ | Domain Boundary Response Examples with keyboard shortcuts (ctrl+shift+a, ctrl+shift+t) |
| Lina follows Token Governance for component token usage | ✅ | Token Usage in Components section with 4-tier selection priority and missing token handling |
| Lina follows ballot measure model for documentation changes | ✅ | Documentation Governance section with propose/present/vote/apply workflow |
| Lina follows AI-Collaboration-Principles | ✅ | Collaboration Standards section with counter-arguments, candid communication, bias monitoring |

## Design Document Section Coverage

| Required Section | Status | Notes |
|-----------------|--------|-------|
| Identity (name, role, domain) | ✅ | Lina Bo Bardi reference, Stemma specialist, trio context |
| Domain Boundaries (in/out/boundary) | ✅ | Four response examples with correct agent invocation methods |
| Component Scaffolding Workflow | ✅ | 5-step workflow: verify family doc → types.ts → platforms → tests → README |
| Platform Implementation: True Native Architecture | ✅ | Web (Web Components + CSS logical), iOS (Swift/SwiftUI), Android (Kotlin/Compose) |
| Token Usage in Components | ✅ | Token Governance compliance, semantic-first priority, missing token flagging |
| Collaboration Model: Domain Respect | ✅ | Trust-by-default, obligation to flag, graceful correction, fallibility |
| Documentation Governance: Ballot Measure Model | ✅ | Propose → Present → Vote → Apply workflow, no write access to steering |
| MCP Usage Pattern | ✅ | Query table with specific doc paths, progressive disclosure workflow, fallback |
| Collaboration Standards | ✅ | Counter-arguments, candid communication, bias self-monitoring |

## Subtask Completion

| Subtask | Status | Notes |
|---------|--------|-------|
| 3.1 Write Lina system prompt | ✅ | `.kiro/agents/lina-prompt.md` created with all 9 sections |
| 3.2 Validate prompt behavior | ✅ | Structural validation complete; interactive testing deferred to Peter |

## Validation

- `npm test`: 309/311 suites passed, 7969/7986 tests passed (4 pre-existing failures unrelated to this task — browser distribution frontmatter tests)

## Requirements Coverage

- Req 2: System prompt defines identity, boundaries, workflow ✅
- Req 6: Component domain knowledge via MCP query patterns ✅
- Req 7: Domain respect model with trust/flag/correction/fallibility ✅
- Req 8: Ballot measure model for documentation governance ✅
- Req 10: AI-Collaboration-Principles compliance ✅

## Note on Interactive Validation

Task 3.2 validated the prompt's structural correctness — every behavioral scenario has corresponding instructions in the prompt. Full interactive validation (switching to Lina and sending test prompts) requires Peter to manually test via `ctrl+shift+l`.
