# Task 5.1 Completion: Implement port cleanup utility

**Date**: 2026-02-19
**Purpose**: Document completion of port cleanup utility for stale figma-console-mcp processes
**Organization**: spec-completion
**Scope**: 054c-figma-token-push-fixes
**Task**: 5.1 Implement port cleanup utility

## What Was Done

Created `src/figma/portCleanup.ts` with a `cleanupStalePorts()` function that:
- Uses `lsof -ti:9223-9232` to find PIDs of stale figma-console-mcp processes
- Kills found processes with `kill <PID>`
- Handles gracefully when `lsof` is unavailable (Windows, minimal containers) by logging a warning
- Handles `lsof` exit code 1 (no matching processes) as a normal case
- Logs cleanup actions for visibility
- Returns array of cleaned-up PIDs for testability

Integrated into `src/cli/figma-push.ts`:
- Added `cleanupStalePorts()` import
- Call placed after dry-run exit point but before `ConsoleMCPClientImpl` creation and `connect()`

## Verification

- Bug condition exploration test 1d passes (2/2 assertions)
- All 16 existing figma-push.test.ts tests pass
- No diagnostics in either modified file
