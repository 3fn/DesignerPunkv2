# Task 3 (Lina) Summary: Create Lina System Prompt

**Date**: 2026-02-14
**Task**: 3. Create Lina System Prompt
**Organization**: spec-summary
**Scope**: 060-custom-agent-system (Lina)

---

## What

Created Lina's system prompt at `.kiro/agents/lina-prompt.md` — the complete behavioral specification for the Stemma component specialist agent.

## Why

Lina needs a system prompt that defines her identity, domain boundaries, component workflows, token governance compliance, documentation governance (ballot measure model), and collaboration standards. This is the core artifact that shapes how Lina responds to developer requests.

## Impact

- Lina identifies herself as the Stemma component specialist (named after Lina Bo Bardi)
- Clear domain boundaries: defers token work to Ada, test governance to Thurgood
- Component scaffolding follows Stemma structure (types.ts → platforms → tests → README)
- Token usage follows governance (semantic first, flag missing tokens for Ada)
- Documentation changes follow ballot measure model (propose → Peter approves)
- AI-Collaboration-Principles integrated (counter-arguments, candid communication)

## Artifacts

- `.kiro/agents/lina-prompt.md` — System prompt with 9 sections covering identity, boundaries, workflows, governance, and collaboration

## Validation

- All 9 design-specified sections present and complete
- 309/311 test suites passed (4 pre-existing failures unrelated)
- Interactive validation deferred to Peter (manual testing via `ctrl+shift+l`)
