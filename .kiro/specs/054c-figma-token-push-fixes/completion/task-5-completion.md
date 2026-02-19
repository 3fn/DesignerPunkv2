# Task 5 Completion: Fix Stale Port Cleanup on Startup (Bug 4)

**Date**: 2026-02-19
**Purpose**: Document completion of Bug 4 fix — stale figma-console-mcp port cleanup
**Organization**: spec-completion
**Scope**: 054c-figma-token-push-fixes
**Task**: 5. Fix stale port cleanup on startup (Bug 4)
**Type**: Implementation
**Status**: Complete

---

## Summary

Implemented stale port cleanup for `figma-console-mcp` processes on ports 9223-9232 before spawning a new MCP client instance. This prevents the Desktop Bridge plugin from connecting to stale processes, which previously caused confusing "Desktop Bridge not available" errors.

## Subtasks Completed

### 5.1 — Implement port cleanup utility
Created `src/figma/portCleanup.ts` with `cleanupStalePorts()` function that:
- Executes `lsof -ti:9223-9232` to find PIDs of stale processes
- Kills found processes with `kill <PID>`
- Handles gracefully on platforms where `lsof` is unavailable (Windows, etc.)
- Logs cleanup actions for visibility

### 5.2 — Integrate port cleanup into figma-push.ts run()
Added `cleanupStalePorts()` call in `run()` after the dry-run exit point but before creating `ConsoleMCPClientImpl` and calling `connect()`.

### 5.3 — Verify bug condition exploration test passes (Bug 4)
Re-ran test 1d from Task 1. Test now passes, confirming Bug 4 is fixed — `figma-push.ts` performs port cleanup before `connect()`.

### 5.4 — Verify preservation tests still pass
Re-ran all preservation tests (2a-2g). All pass, confirming no regressions from the port cleanup fix. Desktop Bridge retry logic (Test 2g) remains unchanged.

## Bug Condition Addressed

```
condition4 := input.isStartup
              AND existsProcess(ports=[9223..9232])
              AND NOT input.performsPortCleanup
```

After fix: stale processes on ports 9223-9232 are terminated before `connect()`, ensuring the Desktop Bridge plugin connects to the correct server.

## Validation Results

- Full test suite: 339 suites passed, 8541 tests passed, 0 failures
- Bug condition exploration test 1d: PASS (confirms fix)
- All preservation tests (2a-2g): PASS (confirms no regressions)

## Requirements Validated

- 2.4: Stale port cleanup on startup
- 3.7: Desktop Bridge retry logic unchanged

## Files Modified

- `src/figma/portCleanup.ts` (new)
- `src/cli/figma-push.ts` (integrated cleanup call)

## Related Documents

- Bugfix requirements: `.kiro/specs/054c-figma-token-push-fixes/bugfix.md`
- Design document: `.kiro/specs/054c-figma-token-push-fixes/design.md`
- Issues file: `.kiro/issues/054a-figma-token-push-issues.md` (ISSUE-4)
