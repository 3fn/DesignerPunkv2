# Task 3.1 Completion: Write Lina System Prompt

**Date**: 2026-02-14
**Task**: 3.1 — Write Lina system prompt
**Type**: Architecture
**Validation**: Tier 3 - Comprehensive
**Organization**: spec-completion
**Scope**: 060-custom-agent-system (Lina)

---

## What Was Done

Created `.kiro/agents/lina-prompt.md` — the system prompt that defines Lina's identity, domain expertise, workflow patterns, and collaboration model as the Stemma component specialist.

## Artifact Created

- `.kiro/agents/lina-prompt.md`

## Sections Implemented

| Section | Purpose | Requirements |
|---------|---------|-------------|
| Identity | Name, role, domain, team context | Req 2.1 |
| Domain Boundaries | In scope, out of scope, boundary cases with response examples | Req 2.2, 2.3, 7.3 |
| Component Scaffolding Workflow | types.ts → platforms → tests → README, Component-Family doc check | Req 2.5, 6.1, 6.6 |
| Platform Implementation | True Native Architecture — web/iOS/Android with CSS logical properties | Req 2.6, 6.2 |
| Token Usage in Components | Token Governance compliance, semantic-first selection, missing token flagging | Req 2.7, 6.4, 7.4 |
| Collaboration Model: Domain Respect | Trust-by-default, obligation to flag, graceful correction, fallibility | Req 7.1–7.9 |
| Documentation Governance: Ballot Measure Model | Propose, present, vote, apply | Req 8.1–8.6 |
| MCP Usage Pattern | 13-entry query reference table, progressive disclosure workflow, fallback | Req 2.4, 6.5 |
| Collaboration Standards | Counter-arguments, candid communication, bias self-monitoring | Req 10.1–10.5 |
| Testing Practices | Owned vs not-owned test domains, Jest commands | Req 7.10–7.12 |

## Design Decisions

- Followed Ada's prompt structure as the established pattern for consistency across the agent trio
- Included four domain boundary response examples (token creation, test governance, missing token, cross-domain) matching the design document's error handling section
- Added a concrete component directory structure example in the scaffolding workflow, reflecting the actual project structure (schema.yaml, tokens.ts, examples/)
- Included CSS logical properties examples in the Platform Implementation section per Technology Stack steering doc
- Added a Testing Practices section (not in the original design outline but present in Ada's prompt) for completeness and consistency

## Validation

- All nine sections from the design document specification are present
- Specific MCP doc paths are referenced in the MCP Usage Pattern table (13 entries)
- Domain boundary response examples included (4 examples)
- Requirements 2, 6, 7, 8, 10 are addressed
- Structural parity with Ada's prompt maintained
