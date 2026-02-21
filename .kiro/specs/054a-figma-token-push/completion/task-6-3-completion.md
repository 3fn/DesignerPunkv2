# Task 6.3 Completion: Desktop Bridge Error Reporting

**Date**: February 18, 2026
**Task**: 6.3 Implement Desktop Bridge error reporting
**Organization**: spec-completion
**Scope**: 054a-figma-token-push
**Status**: Complete

## What Was Done

Added `formatDesktopBridgeError()` to `src/figma/error-reporting.ts` with:
- `DesktopBridgeErrorInfo` interface (`type: 'unavailable' | 'connection_error'`, optional `errorMessage`)
- Two message variants: bridge unavailable vs connection error with underlying message
- Setup instructions (plugin manifest path, WebSocket port, re-run command)
- Troubleshooting link to `.kiro/steering/DTCG-Integration-Guide.md#desktop-bridge-setup`
- Fallback to "unavailable" heading when connection_error has no message

## Tests Added

3 test cases in `src/figma/__tests__/error-reporting.test.ts`:
1. Unavailable bridge with setup instructions
2. Connection error with underlying error message
3. Fallback when connection_error has no message

## Validation

- All 335 test suites pass (8490 tests)
- No diagnostics errors in either file

## Requirements Coverage

- Req 8 (Desktop Bridge Dependency): Setup instructions and manifest path
- Req 9 (Error Handling): Actionable error messages with troubleshooting link
