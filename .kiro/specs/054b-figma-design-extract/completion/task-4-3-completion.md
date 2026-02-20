# Task 4.3 Completion: Write CLI Tests

**Date**: February 20, 2026
**Task**: 4.3 Write CLI tests
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 054b-figma-design-extract

## Summary

Created `src/cli/__tests__/figma-extract.test.ts` with 22 tests covering the full CLI workflow for `figma-extract`.

## Test Coverage

### parseArgs (7 tests)
- Default values when no flags provided
- Individual flag parsing: `--file`, `--node`, `--output`
- All flags combined
- Exit 1 when `--file` has no value
- Exit 1 when `--node` has no value

### loadDTCGTokens (3 tests)
- Exit 1 when file does not exist
- Successful load and parse of valid DTCG file
- Exit 1 on invalid JSON

### run() — missing arguments (2 tests)
- Exit 1 with error message when `--file` is missing
- Exit 1 with error message when `--node` is missing

### run() — normal extraction (4 tests)
- Full workflow exits 0 on success
- Writes design-outline.md to default output path
- Writes to custom output path with `--output`
- Reports extraction results to console

### run() — human-input-required (1 test)
- Exit 1 when extraction confidence requires human input (no-match pause behavior)

### run() — error handling (2 tests)
- Rejects when MCP connection fails (connect() throws before try block)
- Exit 1 when extractDesign throws

### run() — disconnect in finally block (2 tests)
- Disconnect called on success path
- Disconnect called on failure path (extractDesign error)

### run() — port cleanup before connect (1 test)
- Verifies cleanupStalePorts is called before consoleMcp.connect() using call order tracking

## Implementation Notes

- Follows established mocking patterns from `figma-push.test.ts`
- Uses `jest.spyOn(process, 'exit')` pattern to prevent actual exits
- Mocks all external dependencies: fs, ConsoleMCPClientImpl, portCleanup, TokenTranslator, VariantAnalyzer, DesignExtractor
- Uses `mockRejectedValueOnce` (not `mockRejectedValue`) to prevent mock leakage between tests
- The `connect()` call in `run()` occurs before the try/catch block, so connection failures propagate directly rather than being caught by the error handler

## Artifacts

- `src/cli/__tests__/figma-extract.test.ts` — 22 tests, all passing

## Requirements Coverage

- Req 10 (CLI Command) — All testable conditions covered
