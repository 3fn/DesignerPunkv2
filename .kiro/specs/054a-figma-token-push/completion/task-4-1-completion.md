# Task 4.1 Completion: Implement Desktop Bridge Check

**Date**: February 18, 2026
**Task**: 4.1 Implement Desktop Bridge check
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 054a-figma-token-push

---

## What Was Done

Implemented the Desktop Bridge pre-flight check that verifies the Figma Desktop Bridge plugin is running before attempting token sync.

## Artifacts Created/Modified

### Created
- `src/figma/preflight.ts` — `checkDesktopBridge()` function and `PreflightResult` interface

### Modified
- `src/figma/ConsoleMCPClient.ts` — Added `getStatus()` method and `ConsoleMCPStatus` interface to the client contract
- `src/figma/ConsoleMCPClientImpl.ts` — Implemented `getStatus()` via `figma_get_status` MCP tool call
- `src/figma/index.ts` — Exported `checkDesktopBridge`, `PreflightResult`, and `ConsoleMCPStatus`
- `src/figma/__tests__/TokenSyncWorkflow.batch.test.ts` — Added `getStatus` to mock
- `src/figma/__tests__/TokenSyncWorkflow.drift.test.ts` — Added `getStatus` to mock
- `src/figma/__tests__/TokenSyncWorkflow.styles.test.ts` — Added `getStatus` to mock
- `src/figma/__tests__/TokenSyncWorkflow.sync.test.ts` — Added `getStatus` to mock

## Implementation Approach

- Extended `ConsoleMCPClient` interface with `getStatus(): Promise<ConsoleMCPStatus>` to call `figma_get_status` MCP tool
- `checkDesktopBridge()` accepts a `ConsoleMCPClient` instance (dependency injection for testability)
- Checks `transport.websocket.available === true` in the status response
- Returns `PreflightResult` with `ready: boolean` and optional `error` string
- Error messages include Desktop Bridge plugin manifest path and step-by-step setup instructions
- Two error paths: bridge unavailable (status returned but WS not available) and connection failure (exception thrown)

## Validation

- All 328 test suites pass (8404 tests, 0 failures)
- No diagnostics in any modified or created files
- Existing mock factories updated to include `getStatus` — no regressions

## Requirements Satisfied

- Req 8: Desktop Bridge Dependency — Pre-flight check verifies Desktop Bridge availability before sync
