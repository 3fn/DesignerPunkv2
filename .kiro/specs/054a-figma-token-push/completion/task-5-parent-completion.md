# Task 5 Completion: CLI Command Implementation

**Date**: February 18, 2026
**Task**: 5. CLI Command Implementation
**Type**: Parent (Implementation)
**Status**: Complete
**Organization**: spec-completion
**Scope**: 054a-figma-token-push

---

## Summary

Implemented the `figma:push` CLI command that orchestrates the full token push workflow: loading DTCG tokens, transforming to Figma format, running pre-flight checks, and syncing to Figma via Console MCP.

## Artifacts

| Artifact | Path | Purpose |
|----------|------|---------|
| CLI command | `src/cli/figma-push.ts` | Main CLI entry point |
| CLI tests | `src/cli/__tests__/figma-push.test.ts` | Unit tests for CLI |
| npm script | `package.json` (`figma:push`) | User-facing command |

## Implementation Details

### CLI Command (`src/cli/figma-push.ts`)

- Parses `--force`, `--resume N`, and `--dry-run` flags
- Loads DTCG tokens from `dist/DesignTokens.dtcg.json`
- Runs FigmaTransformer and writes `dist/DesignTokens.figma.json`
- Runs Desktop Bridge pre-flight check before sync
- Executes TokenSyncWorkflow with appropriate options
- Reports results with clear success/failure messaging
- Exits with code 0 on success, 1 on failure
- Properly disconnects MCP client in finally block

### npm Script

```json
"figma:push": "npx ts-node src/cli/figma-push.ts"
```

### Test Coverage

- `parseArgs()`: defaults, individual flags, combined flags
- `loadDTCGTokens()`: missing file, valid file, invalid JSON
- `run()` dry-run: writes figma.json, exits 0, skips sync
- `run()` normal sync: full workflow, exits 0
- `run()` force override: passes `forceOverride: true`
- `run()` resume: passes batch number to sync
- Error reporting: sync failures, drift detection, preflight failures
- Resource cleanup: MCP client disconnects even on failure

## Validation

- All 335 test suites pass (8490 tests)
- All subtasks (5.1, 5.2, 5.3) completed prior to parent validation

## Related Documentation

- [Requirements](../requirements.md) — Req 7 (CLI Command)
- [Design](../design.md) — CLI Command Implementation section
