# Figma Push Creates Duplicate Collections Instead of Updating

**Date**: 2026-03-14
**Discovered by**: Thurgood (investigation of Peter's report)
**Domain**: Ada (token pipeline — Figma sync)
**Severity**: High (data loss — each push creates duplicate collections in Figma)
**Status**: Open

---

## Symptom

Running `npm run figma:push` creates new variable collections every time instead of updating existing ones.

## Root Cause

Two bugs in `ConsoleMCPClientImpl.getVariables()` (line 188-221) cause the push CLI to always take the `initialSetup` path:

### Bug 1: `fileKey` not passed to MCP tool

```typescript
// Line 192 — fileKey parameter is accepted but never forwarded
const result = await this.callTool('figma_get_token_values', {
  type: 'all',
  limit: 500,
  // fileKey is missing here
});
```

The method signature accepts `fileKey: string` but doesn't include it in the tool call arguments. If `figma_get_token_values` needs the file key to identify which Figma file to query, it either errors or returns nothing.

### Bug 2: Silent error swallowing

```typescript
// Line 220-221 — all errors return empty array
} catch {
  return [];
}
```

Any failure — wrong parameters, MCP connection issue, unexpected response — silently returns `[]`. Back in `figma-push.ts`:

```typescript
const existingVariables = await mcpClient.getVariables(process.env.FIGMA_FILE_KEY ?? '');
const isInitialSetup = args.clean || existingVariables.length === 0;
```

Empty array → `isInitialSetup = true` → `initialSetup()` creates everything from scratch.

## Impact

Every push duplicates all collections and variables in the Figma file. The `sync()` path (which diffs by name and updates in place) is never reached.

## Fix

In `ConsoleMCPClientImpl.getVariables()`:

1. Pass `fileKey` to the tool call:
```typescript
const result = await this.callTool('figma_get_token_values', {
  type: 'all',
  limit: 500,
  fileKey,
});
```

2. Log errors instead of swallowing them, and re-throw so the CLI can report the actual problem:
```typescript
} catch (error) {
  console.error('⚠️  Failed to read existing Figma variables:', error);
  throw error;
}
```

The CLI can then decide whether to abort or offer a `--clean` flag explicitly, rather than silently falling through to initial setup.

## Files

- `src/figma/ConsoleMCPClientImpl.ts` — lines 188-221 (`getVariables`)
- `src/cli/figma-push.ts` — lines 199-200 (initial setup branching)

## Note

The `figma_get_token_values` tool parameter schema should be verified against the actual figma-console-mcp version to confirm the correct parameter name for the file key (may be `fileKey`, `file_key`, or passed differently). Spec 054b's design doc notes this exact concern: "Tool parameter schemas must be verified against actual figma-console-mcp."

---

## Partial Fix Applied

**Date**: 2026-03-15
**Applied by**: Ada
**Status**: Partially fixed — schema verification still needed

### Changes made (our code only)

1. **Bug 1 fix**: Added `fileKey` to the `figma_get_token_values` tool call arguments in `ConsoleMCPClientImpl.getVariables()`. Parameter name `fileKey` matches the pattern used by `figma_execute` in the same file.

2. **Bug 2 fix**: Changed silent `catch { return []; }` to `catch` with `console.warn()` + `return []`. Errors are now visible in the console but still fall through to `initialSetup` path (preserving behavior for genuinely new Figma files with no variables).

### What's NOT verified

The `fileKey` parameter name is an assumption based on our codebase's conventions. The actual `figma-console-mcp` tool schema for `figma_get_token_values` has not been verified. If Console MCP expects a different parameter name (or doesn't accept a file key at all), the call will still fail — but now visibly instead of silently.

### Next step

Peter needs to verify the `figma_get_token_values` parameter schema against the actual Console MCP / Figma Power MCP tool definitions before this fix can be considered complete.
