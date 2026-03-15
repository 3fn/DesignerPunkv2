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
