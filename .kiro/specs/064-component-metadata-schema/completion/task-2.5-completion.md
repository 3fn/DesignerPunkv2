# Task 2.5 Completion: ContractTokenDeriver

**Date**: 2026-02-28
**Task**: 2.5 ContractTokenDeriver
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `component-mcp-server/src/indexer/ContractTokenDeriver.ts` — `deriveContractTokenRelationships()` function
- `component-mcp-server/src/indexer/__tests__/ContractTokenDeriver.test.ts` — 6 unit tests

## Implementation Details

- Extracts token names from contract `behavior:` text via regex pattern matching
- Matches dotted notation (`motion.focusTransition`, `color.avatar.human.icon`) and camelCase primitives (`duration150`, `easingStandard`)
- Cross-references extracted names against component's schema `tokens:` list
- Scoped to `accessibility` and `animation` contract categories only
- Flags stale `motion.duration.X` and `motion.easing.X` patterns as warnings
- Skips wildcard patterns (`color.progress.*`)

## Ada Review Note

The regex-based token extraction is intentionally conservative — it matches known token name prefixes (`motion.`, `color.`, `opacity.`, `duration`, `easing`, `scale`). If new token families are added with different prefixes, the pattern will need updating. Ada should flag if this is a concern.

## Validation

**Tier 2: Standard**

- ✅ Resolved pair: token in both prose and schema list
- ✅ Gap detection: token in prose but not in schema list
- ✅ Category scoping: visual/interaction contracts skipped
- ✅ Primitive extraction: `duration150`, `easingStandard`
- ✅ Stale naming detection: `motion.duration.fast` flagged
- ✅ No-token contracts: empty results (no false positives)
- ✅ 34 tests passing across component MCP server
- ✅ `tsc --noEmit` clean
- ✅ Requirements 6.1–6.5 satisfied

## Ada Review (2026-02-28)

**Reviewer**: Ada (Rosetta token specialist)
**Verdict**: Approved. No corrections needed.

### What's right

- Category scoping (`accessibility` + `animation` only) correctly implements Q6 decision
- Regex tested against all 4 `accessibility_color_contrast` contracts and animation contracts from research — correctly extracts dotted notation, semantic tokens, and primitives
- Stale pattern detection is good defensive design
- Wildcard skip prevents false matches
- Gap detection implements "absence is the signal" pattern from Q6/Q7 decisions
- Test coverage is appropriate

### Concern: prefix-category coupling

The regex only matches known prefixes (`motion.`, `color.`, `opacity.`, `duration`, `easing`, `scale`). Missing prefixes (`accessibility.`, `blend.`) don't cause issues today because the contracts that reference them are in excluded categories (`interaction`). But the prefix list and category scope are coupled — expanding one requires expanding the other. Added a code comment documenting this.

### Known limitation: token pair semantics

Accessibility contracts care about token *pairs* (foreground on background), but the deriver outputs a flat list of individual tokens per contract. An agent can infer pairing from prose context, but programmatic contrast auditing would need explicit foreground/background pair modeling. This is a future enhancement to be driven by an actual use case, not speculative design.
