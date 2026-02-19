# Figma Token Push — Known Issues

**Date**: February 19, 2026
**Spec**: 054a - Figma Token Push
**Status**: Active

---

## Fixed Issues (This Session)

### FIX-1: `figma_get_variables` tool doesn't exist
- **Symptom**: `Could not find collection ID for "Primitives" after creation`
- **Root cause**: `ConsoleMCPClientImpl.getVariables()` called `figma_get_variables`, which doesn't exist in `figma-console-mcp`. The `setupDesignTokens` method used this to find the collection ID for overflow batches.
- **Fix**: Capture `collectionId` and `modes` map from `figma_setup_design_tokens` response instead. Changed `getVariables()` to use `figma_get_token_values`.
- **Files**: `src/figma/ConsoleMCPClientImpl.ts`

### FIX-2: Color values in rgba() format instead of hex
- **Symptom**: All color variables showed #FFFFFF in Figma
- **Root cause**: DTCG tokens use `rgba(184, 182, 200, 1)` format. `figma_setup_design_tokens` only accepts hex (`#B8B6C8`). Its `hexToRgba` converter silently failed on rgba strings.
- **Fix**: Added `rgbaToHex()` method to `FigmaTransformer.resolveDirectValue()` to convert colors at transform time.
- **Files**: `src/generators/transformers/FigmaTransformer.ts`

### FIX-3: Semantic tokens sent as alias objects
- **Symptom**: Semantics collection not appearing or values wrong
- **Root cause**: Semantic tokens were sent as `{"aliasOf": "color/green/400"}` objects. `figma_setup_design_tokens` doesn't support alias references — only raw values.
- **Fix**: Added `resolveAliasForFigma()` in `ConsoleMCPClientImpl.setupDesignTokens()` to resolve aliases to actual values by looking up primitives.
- **Files**: `src/figma/ConsoleMCPClientImpl.ts`

### FIX-4: Text styles all showing 12/Auto
- **Symptom**: All typography styles in Figma showed identical 12pt/Auto values
- **Root cause**: Two issues in `generateTextStyleCode()`:
  1. `fontFamily` was the full CSS fallback stack (`"Rajdhani, -apple-system, ..."`) — Figma's `loadFontAsync` failed silently because no font with that exact name exists
  2. `lineHeight` was a unitless ratio (e.g. `1.19`) but sent with `unit: "PIXELS"` — should be `fontSize × ratio` for pixel values
- **Fix**: Extract primary font name from fallback stack. Convert lineHeight ratio to pixel value.
- **Files**: `src/figma/TokenSyncWorkflow.ts`

---

## Open Issues

### ISSUE-1: Semantic tokens not linked as Figma variable aliases
- **Severity**: Low (values are correct, just not linked)
- **Description**: Semantic tokens are pushed with resolved values (e.g. the actual hex color) rather than as Figma variable aliases pointing to primitives. This means changing a primitive won't cascade to semantics in Figma.
- **Root cause**: `figma_setup_design_tokens` and `figma_batch_create_variables` don't support alias creation. Proper aliases require Plugin API code using `figma.variables.createVariableAlias()`.
- **Impact**: Figma variables work correctly but lack the reference relationship. Designers can't see which semantic tokens reference which primitives.
- **Proposed fix**: Use `figma_execute` with Plugin API code to create variables with alias bindings after initial setup.

### ISSUE-2: Incremental sync `batchCreateVariables` passes wrong parameters
- **Severity**: High (blocks re-push/update workflow)
- **Description**: `ConsoleMCPClient.batchCreateVariables()` passes `fileKey` but `figma_batch_create_variables` expects `collectionId`. Second push to update existing variables will fail.
- **Root cause**: Interface designed assuming tool takes `fileKey`, but actual tool requires `collectionId` (e.g. `'VariableCollectionId:123:456'`).
- **Impact**: Cannot run `figma:push` a second time to update variables. Only initial setup works.
- **Proposed fix**: Update `ConsoleMCPClient` interface and implementation to accept/resolve `collectionId`. May need to query existing collections first.

### ISSUE-3: Incremental sync `batchUpdateVariables` has wrong schema
- **Severity**: High (blocks update workflow)
- **Description**: `ConsoleMCPClient.batchUpdateVariables()` sends `{ fileKey, variables: [...] }` but `figma_batch_update_variables` expects `{ updates: [{ variableId, modeId, value }] }` — a completely different shape.
- **Root cause**: Interface designed without matching actual tool schema.
- **Impact**: Cannot update existing variable values. Same as ISSUE-2 — blocks re-push.
- **Proposed fix**: Redesign update interface to match tool's `{ variableId, modeId, value }` tuple format. Requires querying existing variables to get their IDs first.

### ISSUE-4: Port conflict with stale figma-console-mcp processes
- **Severity**: Medium (causes confusing connection failures)
- **Description**: Stale `figma-console-mcp` processes can hold port 9223, causing new instances to bind to fallback ports (9224-9232). The Desktop Bridge plugin may connect to the stale instance instead of the new one.
- **Root cause**: Previous CLI runs or other MCP clients spawn figma-console-mcp but don't always clean up the process on exit.
- **Impact**: Preflight check fails with "Desktop Bridge not available" even when the plugin is running.
- **Workaround**: Kill stale processes manually: `lsof -i :9223` then `kill <PID>`.
- **Proposed fix**: Add process cleanup to CLI startup, or check for existing instances before spawning.

---

## Notes

- The Kiro Figma Power (sidebar) is the official Figma MCP server — read-only, design inspection only. It cannot push tokens. Token push uses `figma-console-mcp` (community package) spawned as a subprocess.
- `figma-console-mcp` v1.10.1 has 56+ tools in local mode. The tool names used in our implementation are correct, but parameter schemas were not fully matched during initial development.
