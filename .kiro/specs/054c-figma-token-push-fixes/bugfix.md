# Bugfix Requirements Document

## Introduction

The Figma token push workflow (`npm run figma:push`) works correctly for first-time setup via `figma_setup_design_tokens`, but the incremental sync path (second and subsequent pushes) is broken due to parameter schema mismatches in `ConsoleMCPClientImpl`. Additionally, semantic tokens are pushed with resolved values instead of Figma variable aliases, and stale `figma-console-mcp` processes cause port conflicts that produce confusing connection failures.

The `--clean` flag workaround (delete everything and re-push) is not sustainable because designers must reassign all variable/style bindings to assets in Figma after deletion. These issues collectively block the iterative token update workflow that designers depend on.

Reference: `.kiro/issues/054a-figma-token-push-issues.md` (ISSUE-1 through ISSUE-4)

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN `figma:push` runs a second time (incremental sync) and calls `ConsoleMCPClient.batchCreateVariables()` THEN the system passes `fileKey` to `figma_batch_create_variables` which expects `collectionId`, causing the call to fail

1.2 WHEN `figma:push` runs a second time (incremental sync) and calls `ConsoleMCPClient.batchUpdateVariables()` THEN the system sends `{ fileKey, variables: [{ name, resolvedType, valuesByMode, description }] }` but `figma_batch_update_variables` expects `{ updates: [{ variableId, modeId, value }] }`, causing the call to fail

1.3 WHEN semantic tokens (e.g. `color.primary`) are pushed to Figma via `figma_setup_design_tokens` THEN the system resolves aliases to raw values (e.g. hex color) instead of creating Figma variable aliases via `figma.variables.createVariableAlias()`, so changing a primitive does not cascade to semantics in Figma

1.4 WHEN a previous `figma-console-mcp` process is still running and holding port 9223 THEN the system starts a new instance on a fallback port (9224-9232) and the Desktop Bridge plugin connects to the stale instance, causing preflight checks to fail with "Desktop Bridge not available"

### Expected Behavior (Correct)

2.1 WHEN `figma:push` runs a second time (incremental sync) and new variables need to be created THEN the system SHALL pass `collectionId` (obtained from initial setup response or by querying existing collections) to `figma_batch_create_variables` along with properly formatted variable definitions including `valuesByMode` keyed by mode ID

2.2 WHEN `figma:push` runs a second time (incremental sync) and existing variables need to be updated THEN the system SHALL query existing variables via `figma_get_token_values` to obtain their `variableId` values, then send `{ updates: [{ variableId, modeId, value }] }` to `figma_batch_update_variables`

2.3 WHEN semantic tokens that reference primitives are pushed to Figma THEN the system SHALL create Figma variable aliases using `figma_execute` with Plugin API code (`figma.variables.createVariableAlias()`) so that changing a primitive value cascades to all referencing semantic tokens

2.4 WHEN `figma:push` starts up THEN the system SHALL detect and terminate stale `figma-console-mcp` processes on ports 9223-9232 before spawning a new instance, ensuring the Desktop Bridge plugin connects to the correct server

### Unchanged Behavior (Regression Prevention)

3.1 WHEN `figma:push` runs for the first time (no existing variables) THEN the system SHALL CONTINUE TO use `figma_setup_design_tokens` for atomic initial setup, creating collections, modes, and variables in a single call

3.2 WHEN `figma:push` runs with `--clean` flag THEN the system SHALL CONTINUE TO force the initial setup path, ignoring existing variables

3.3 WHEN `figma:push` runs with `--dry-run` flag THEN the system SHALL CONTINUE TO transform tokens and write the intermediate artifact without syncing to Figma

3.4 WHEN `figma:push` runs with `--force` flag THEN the system SHALL CONTINUE TO override drift detection and proceed with sync

3.5 WHEN primitive tokens (non-alias values like hex colors, numbers) are pushed THEN the system SHALL CONTINUE TO push them with resolved values as before

3.6 WHEN text styles and effect styles are synced via `figma_execute` Plugin API THEN the system SHALL CONTINUE TO create/update styles using the existing `generateTextStyleCode()` and `generateEffectStyleCode()` methods

3.7 WHEN the Desktop Bridge is genuinely unavailable (not installed or not running) THEN the system SHALL CONTINUE TO show the existing setup instructions with retry logic (5 attempts, 3-second delays)

3.8 WHEN drift is detected between expected and actual variable values THEN the system SHALL CONTINUE TO block sync and report drifted variables with resolution instructions
