# Task 5 Summary: Fix Stale Port Cleanup on Startup (Bug 4)

**Date**: 2026-02-19
**Purpose**: Summary of Bug 4 fix — stale figma-console-mcp port cleanup on startup
**Organization**: spec-summary
**Scope**: 054c-figma-token-push-fixes
**Task**: 5. Fix stale port cleanup on startup (Bug 4)

## What Changed

Added stale port cleanup to `figma:push` startup. Before spawning a new `figma-console-mcp` instance, the CLI now detects and terminates stale processes on ports 9223-9232 using `lsof`. This prevents the Desktop Bridge plugin from connecting to a stale server, which previously caused "Desktop Bridge not available" errors.

## Why

When a previous `figma:push` crashed, the stale process held port 9223. New runs would bind to fallback ports (9224+), but the Desktop Bridge plugin connected to the stale instance, causing preflight failures.

## Impact

- New file: `src/figma/portCleanup.ts`
- Modified: `src/cli/figma-push.ts` (cleanup call before connect)
- All 339 test suites pass (8541 tests, 0 failures)
- Bug condition exploration test 1d confirms fix
- All preservation tests confirm no regressions
