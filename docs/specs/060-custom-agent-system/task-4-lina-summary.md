# Task 4 (Lina) Summary: Create Lina User-Triggered Hooks

**Date**: 2026-02-14
**Task**: 4. Create Lina User-Triggered Hooks
**Organization**: spec-summary
**Scope**: 060-custom-agent-system (Lina)

---

## What

Created four user-triggered hooks for Lina's component-specific validation workflows: Stemma Compliance Check, Component Token Audit, Component Scaffold Validation, and Platform Parity Check.

## Why

Lina needs on-demand validation tools that check component health across multiple dimensions — behavioral contracts, token governance, scaffold completeness, and platform parity. These hooks are manually triggered (not automatic) to give Peter control over when validation runs.

## Impact

- Stemma Compliance Check validates behavioral contracts and inheritance patterns against Stemma family definitions
- Component Token Audit identifies hard-coded values and verifies token governance compliance (semantic-first)
- Component Scaffold Validation checks structure completeness (types.ts, platforms, tests, README) and Component-Family doc existence
- Platform Parity Check verifies web/iOS/Android implementations exist and are in sync
- All hooks query MCP documentation for current standards before analyzing code

## Artifacts

- `.kiro/hooks/lina-stemma-compliance-check.kiro.hook`
- `.kiro/hooks/lina-component-token-audit.kiro.hook`
- `.kiro/hooks/lina-component-scaffold-validation.kiro.hook`
- `.kiro/hooks/lina-platform-parity-check.kiro.hook`

## Validation

- All hooks use `userTriggered` type with `askAgent` action
- 309/311 test suites passed (2 pre-existing failures unrelated)

