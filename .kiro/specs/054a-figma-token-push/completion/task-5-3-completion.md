# Task 5.3 Completion: Write CLI Tests

**Date**: February 18, 2026
**Spec**: 054a - Figma Token Push
**Task**: 5.3 Write CLI tests
**Status**: Complete
**Organization**: spec-completion
**Scope**: 054a-figma-token-push

---

## Summary

Created comprehensive unit tests for the `figma-push` CLI command covering argument parsing, token loading, and the full `run()` workflow orchestration.

## Artifacts Created

- `src/cli/__tests__/figma-push.test.ts` — 16 tests across 7 describe blocks

## Test Coverage

- **parseArgs**: Default values, --force, --dry-run, --resume N, combined flags
- **loadDTCGTokens**: Missing file (exit 1), valid file, invalid JSON (exit 1)
- **run() dry-run**: Writes figma.json, exits 0, skips sync
- **run() normal sync**: Full workflow, exit 0, correct sync options
- **run() force override**: Passes forceOverride: true
- **run() resume**: Passes resume batch number
- **run() error reporting**: Sync failure (exit 1), drift detection, preflight failure, MCP disconnect on failure

## Approach

Mocked all external dependencies (fs, FigmaTransformer, TokenSyncWorkflow, ConsoleMCPClientImpl, checkDesktopBridge) and intercepted `process.exit` to verify exit codes without terminating the test process.
