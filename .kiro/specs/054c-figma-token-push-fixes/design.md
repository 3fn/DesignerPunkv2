# Figma Token Push Fixes — Bugfix Design

## Overview

The Figma token push workflow (`npm run figma:push`) has four bugs that block the iterative token update workflow. The incremental sync path fails because `batchCreateVariables` passes `fileKey` instead of `collectionId`, and `batchUpdateVariables` sends the wrong payload shape entirely. Semantic tokens are pushed with resolved hex values instead of Figma variable aliases, breaking cascade updates. Stale `figma-console-mcp` processes cause port conflicts that produce confusing "Desktop Bridge not available" errors.

This design formalizes the fault conditions, hypothesizes root causes from code analysis, and plans targeted fixes to each of the four issues while preserving the working initial setup path, `--clean`, `--dry-run`, `--force` flags, style sync, and drift detection.

## Glossary

- **Bug_Condition (C)**: The set of conditions that trigger the four bugs — incremental sync calls with wrong schemas, semantic alias resolution to raw values, and stale port conflicts
- **Property (P)**: Correct behavior — `collectionId`-based batch create, `{variableId, modeId, value}` batch update, Figma variable aliases for semantics, clean port state on startup
- **Preservation**: Initial setup via `figma_setup_design_tokens`, `--clean`/`--dry-run`/`--force` flags, primitive value push, style sync, drift detection, Desktop Bridge retry logic
- **ConsoleMCPClientImpl**: The MCP client in `src/figma/ConsoleMCPClientImpl.ts` that wraps `figma-console-mcp` tool calls
- **TokenSyncWorkflow**: The orchestrator in `src/figma/TokenSyncWorkflow.ts` that manages sync flow, drift detection, and batch operations
- **figma-console-mcp**: Community MCP server (v1.10.1) spawned as subprocess, providing 56+ Figma tools
- **collectionId**: Figma's internal ID for a variable collection (e.g. `VariableCollectionId:123:456`), returned by `figma_setup_design_tokens`
- **modeId**: Figma's internal ID for a collection mode (e.g. `1:0`), returned in the modes map from setup

## Bug Details

### Fault Condition

The bugs manifest across four distinct conditions during the `figma:push` workflow. The common thread is that the incremental sync path (second+ push) was built against assumed tool schemas rather than the actual `figma-console-mcp` API.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type FigmaPushContext
  OUTPUT: boolean

  // Bug 1: batchCreate passes fileKey instead of collectionId
  condition1 := input.isIncrementalSync
                AND input.hasNewVariables
                AND input.batchCreatePayload.hasProperty("fileKey")
                AND NOT input.batchCreatePayload.hasProperty("collectionId")

  // Bug 2: batchUpdate sends wrong payload shape
  condition2 := input.isIncrementalSync
                AND input.hasUpdatedVariables
                AND input.batchUpdatePayload.shape == "{fileKey, variables: [{name, resolvedType, valuesByMode}]}"
                AND input.batchUpdatePayload.shape != "{updates: [{variableId, modeId, value}]}"

  // Bug 3: Semantic aliases resolved to raw values
  condition3 := input.hasSemanticTokens
                AND input.semanticToken.referencesAlias == true
                AND input.pushedValue.type == "rawValue"
                AND input.pushedValue.type != "variableAlias"

  // Bug 4: Stale process holds port
  condition4 := input.isStartup
                AND existsProcess(ports=[9223..9232])
                AND NOT input.performsPortCleanup

  RETURN condition1 OR condition2 OR condition3 OR condition4
END FUNCTION
```

### Examples

- **Bug 1**: Second `figma:push` with 5 new tokens → `batchCreateVariables` sends `{fileKey: "abc123", variables: [...]}` → `figma_batch_create_variables` rejects because it expects `{collectionId: "VariableCollectionId:1:2", variables: [...]}`
- **Bug 2**: Second `figma:push` with 10 changed tokens → `batchUpdateVariables` sends `{fileKey: "abc123", variables: [{name, resolvedType, valuesByMode}]}` → `figma_batch_update_variables` rejects because it expects `{updates: [{variableId: "VariableID:3:4", modeId: "1:0", value: "#FF0000"}]}`
- **Bug 3**: Semantic token `color.primary` references `color/blue/500` → pushed as `"#3B82F6"` instead of a `VariableAlias` → changing `color/blue/500` in Figma does NOT cascade to `color.primary`
- **Bug 4**: Previous `figma:push` crashed, leaving process on port 9223 → new run spawns on 9224 → Desktop Bridge plugin connects to stale 9223 → preflight fails with "Desktop Bridge not available"
- **Edge case**: First `figma:push` (no existing variables) → uses `figma_setup_design_tokens` → works correctly (not affected by bugs 1-2)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- First-time push via `figma_setup_design_tokens` atomic setup must continue to work identically
- `--clean` flag must continue to force the initial setup path
- `--dry-run` flag must continue to transform and write artifact without syncing
- `--force` flag must continue to override drift detection
- Primitive tokens (non-alias hex colors, numbers) must continue to be pushed with resolved values
- Text style and effect style sync via `generateTextStyleCode()` and `generateEffectStyleCode()` must remain unchanged
- Desktop Bridge retry logic (5 attempts, 3-second delays) must continue for genuinely unavailable bridges
- Drift detection comparing expected vs actual variable values must continue to block sync when drift is found

**Scope:**
All inputs that do NOT involve incremental sync parameter formatting, semantic alias creation, or CLI startup port management should be completely unaffected by this fix. This includes:
- Initial setup path (first push or `--clean`)
- Dry-run mode
- Style sync operations
- Drift detection logic
- Token transformation (FigmaTransformer)
- DTCG token loading and parsing

## Hypothesized Root Cause

Based on code analysis of the actual source files:

1. **Bug 1 — Wrong parameter in `batchCreateVariables`**: `ConsoleMCPClientImpl.batchCreateVariables()` (line ~160) passes `fileKey` as the first property to `figma_batch_create_variables`. The tool expects `collectionId`. The interface `ConsoleMCPClient.batchCreateVariables(fileKey, variables)` was designed assuming the tool takes a file key, but the actual tool requires a collection ID. Notably, the overflow batch logic inside `setupDesignTokens()` already correctly uses `collectionId` — the fix pattern exists in the same file.

2. **Bug 2 — Wrong payload shape in `batchUpdateVariables`**: `ConsoleMCPClientImpl.batchUpdateVariables()` (line ~175) sends `{fileKey, variables: [{name, resolvedType, valuesByMode, description}]}` but `figma_batch_update_variables` expects `{updates: [{variableId, modeId, value}]}`. This is a fundamental schema mismatch — the tool needs per-variable-per-mode update tuples with Figma's internal `variableId`, not the variable definition objects. The workflow must first query existing variables via `figma_get_token_values` to obtain their IDs.

3. **Bug 3 — Semantic aliases resolved to raw values**: `ConsoleMCPClientImpl.setupDesignTokens()` intentionally resolves aliases via `resolveAliasForFigma()` because `figma_setup_design_tokens` doesn't support alias references. However, no post-setup step exists to create proper Figma variable aliases. The `figma_execute` tool can run Plugin API code including `figma.variables.createVariableAlias()`, but this capability is never invoked for semantic-to-primitive linking.

4. **Bug 4 — No port cleanup on startup**: `figma-push.ts` creates a `ConsoleMCPClientImpl` and calls `connect()` without first checking for stale processes on ports 9223-9232. The `ConsoleMCPClientImpl.connect()` method spawns `figma-console-mcp` as a subprocess but doesn't clean up existing instances. When a stale process holds port 9223, the new instance binds to a fallback port, and the Desktop Bridge plugin connects to the wrong server.

## Correctness Properties

Property 1: Fault Condition — Incremental Batch Create Uses collectionId

_For any_ incremental sync where new variables need to be created, the fixed `batchCreateVariables` SHALL pass `collectionId` (not `fileKey`) to `figma_batch_create_variables` along with properly formatted variable definitions including `valuesByMode` keyed by mode ID.

**Validates: Requirements 2.1**

Property 2: Fault Condition — Incremental Batch Update Uses variableId Tuples

_For any_ incremental sync where existing variables need to be updated, the fixed `batchUpdateVariables` SHALL query existing variables to obtain their `variableId` values, then send `{ updates: [{ variableId, modeId, value }] }` to `figma_batch_update_variables`.

**Validates: Requirements 2.2**

Property 3: Fault Condition — Semantic Tokens Create Figma Variable Aliases

_For any_ semantic token that references a primitive token, the fixed workflow SHALL create a Figma variable alias using `figma_execute` with Plugin API code (`figma.variables.createVariableAlias()`), so that changing the primitive cascades to the semantic in Figma.

**Validates: Requirements 2.3**

Property 4: Fault Condition — Stale Port Cleanup on Startup

_For any_ CLI startup, the fixed `figma:push` SHALL detect and terminate stale `figma-console-mcp` processes on ports 9223-9232 before spawning a new instance.

**Validates: Requirements 2.4**

Property 5: Preservation — Initial Setup Path Unchanged

_For any_ first-time push (no existing variables) or `--clean` push, the fixed code SHALL produce the same behavior as the original code, preserving the atomic `figma_setup_design_tokens` setup path including collection creation, mode creation, and variable creation in a single call.

**Validates: Requirements 3.1, 3.2**

Property 6: Preservation — CLI Flags and Drift Detection Unchanged

_For any_ input using `--dry-run`, `--force`, or drift detection, the fixed code SHALL produce the same behavior as the original code, preserving dry-run artifact generation, force override of drift, and drift blocking with resolution instructions.

**Validates: Requirements 3.3, 3.4, 3.8**

Property 7: Preservation — Primitive Values and Style Sync Unchanged

_For any_ primitive token push or style sync operation, the fixed code SHALL produce the same behavior as the original code, preserving resolved value push for primitives and Plugin API style creation/update via `generateTextStyleCode()` and `generateEffectStyleCode()`.

**Validates: Requirements 3.5, 3.6, 3.7**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:


**File**: `src/figma/ConsoleMCPClient.ts` (interface)

**Changes**:
1. **Update `batchCreateVariables` signature**: Change first parameter from `fileKey: string` to `collectionId: string` to match `figma_batch_create_variables` schema. Add `modesMap` parameter for mode ID resolution.
2. **Update `batchUpdateVariables` signature**: Change from `(fileKey: string, variables: FigmaVariable[])` to accept update tuples `{ variableId: string, modeId: string, value: unknown }[]` matching `figma_batch_update_variables` schema.
3. **Add `createVariableAliases` method**: New method to create Figma variable aliases for semantic tokens via `figma_execute` with Plugin API code.

---

**File**: `src/figma/ConsoleMCPClientImpl.ts` (implementation)

**Function**: `batchCreateVariables`

**Specific Changes**:
1. **Fix parameter mapping**: Replace `fileKey` with `collectionId` in the `callTool` payload. Accept `collectionId` and `modesMap` as parameters. Convert `valuesByMode` keys from mode names to mode IDs using the modes map.

**Function**: `batchUpdateVariables`

**Specific Changes**:
2. **Redesign payload shape**: Accept pre-built update tuples `{ variableId, modeId, value }[]` instead of `FigmaVariable[]`. Pass `{ updates: [...] }` to `figma_batch_update_variables`.

**Function**: New `createVariableAliases`

**Specific Changes**:
3. **Implement alias creation**: Accept a list of `{ semanticName, primitiveName }` pairs. Generate Plugin API code that:
   - Finds both variables by name using `figma.variables.getLocalVariables()`
   - Creates an alias via `figma.variables.createVariableAlias(primitiveVariable)`
   - Sets the semantic variable's value to the alias for each mode
   - Execute via `figma_execute`

---

**File**: `src/figma/TokenSyncWorkflow.ts` (orchestration)

**Function**: `syncVariables`

**Specific Changes**:
4. **Store and pass collectionId**: The workflow needs access to `collectionId` and `modesMap` for each collection. These are returned by `figma_setup_design_tokens` during initial setup. For incremental sync, query `figma_get_token_values` to discover collection IDs from existing variables, or store them from the initial setup response.

**Function**: `batchCreateVariables`

**Specific Changes**:
5. **Pass collectionId instead of fileKey**: Update the call to `consoleMcp.batchCreateVariables()` to pass `collectionId` and `modesMap` instead of `this.figmaFileKey`.

**Function**: `batchUpdateVariables`

**Specific Changes**:
6. **Build update tuples**: Before calling `consoleMcp.batchUpdateVariables()`, query existing variables to get their `variableId` values. For each variable to update, build `{ variableId, modeId, value }` tuples for each mode. Pass these tuples instead of `FigmaVariable[]`.

**Function**: `sync` (or new post-sync step)

**Specific Changes**:
7. **Add alias creation step**: After variable sync completes, identify semantic tokens that reference primitives (tokens with `aliasOf` in their original DTCG definition). Call `consoleMcp.createVariableAliases()` to create Figma variable aliases linking semantics to primitives.

---

**File**: `src/cli/figma-push.ts` (CLI entry point)

**Function**: `run` (or new helper)

**Specific Changes**:
8. **Add port cleanup on startup**: Before creating `ConsoleMCPClientImpl` and calling `connect()`, execute `lsof -ti:9223-9232` to find PIDs of stale processes, then `kill` them. Handle gracefully on platforms where `lsof` is unavailable. Log cleanup actions for visibility.

---

**File**: `src/generators/transformers/FigmaTransformer.ts` (data model)

**Specific Changes**:
9. **Extend FigmaVariable with optional id fields**: Add optional `id?: string` and `collectionId?: string` fields to `FigmaVariable` interface so that variables returned from `figma_get_token_values` can carry their Figma-assigned IDs for use in update operations.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bugs on unfixed code, then verify the fixes work correctly and preserve existing behavior. This project uses Jest (not Vitest).

### Exploratory Fault Condition Checking

**Goal**: Surface counterexamples that demonstrate the bugs BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write unit tests that mock the MCP `callTool` method and verify the exact payloads being sent to each tool. Run these tests on the UNFIXED code to observe the schema mismatches.

**Test Cases**:
1. **batchCreate Schema Test**: Call `batchCreateVariables` and capture the payload sent to `callTool` — verify it sends `fileKey` instead of `collectionId` (will demonstrate bug on unfixed code)
2. **batchUpdate Schema Test**: Call `batchUpdateVariables` and capture the payload — verify it sends `{fileKey, variables}` instead of `{updates: [{variableId, modeId, value}]}` (will demonstrate bug on unfixed code)
3. **Semantic Alias Test**: Run `setupDesignTokens` with a semantic token referencing a primitive — verify the pushed value is a raw hex string, not a variable alias (will demonstrate bug on unfixed code)
4. **Port Cleanup Test**: Verify that `run()` does NOT call any port cleanup before `connect()` (will demonstrate bug on unfixed code)

**Expected Counterexamples**:
- `batchCreateVariables` payload contains `fileKey` property instead of `collectionId`
- `batchUpdateVariables` payload contains `variables` array with `{name, resolvedType, valuesByMode}` objects instead of `updates` array with `{variableId, modeId, value}` tuples
- Semantic token values are resolved hex strings, not alias references
- No process cleanup occurs before MCP client connection

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed functions produce the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := fixedFunction(input)
  ASSERT expectedBehavior(result)
END FOR
```

**Specific checks:**
- `batchCreateVariables` sends `{collectionId, variables: [{name, resolvedType, valuesByMode: {modeId: value}}]}`
- `batchUpdateVariables` sends `{updates: [{variableId, modeId, value}]}`
- Semantic tokens result in `figma_execute` calls with `createVariableAlias` Plugin API code
- Port cleanup kills stale processes before `connect()`

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed functions produce the same result as the original functions.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalFunction(input) = fixedFunction(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for initial setup, dry-run, style sync, and drift detection, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Initial Setup Preservation**: Verify `initialSetup()` still calls `figma_setup_design_tokens` with the same payload format (collection name, modes, tokens with resolved values)
2. **Clean Flag Preservation**: Verify `--clean` still forces the initial setup path regardless of existing variables
3. **Dry-Run Preservation**: Verify `--dry-run` still writes artifact and exits without syncing
4. **Drift Detection Preservation**: Verify drift detection still compares expected vs actual values and blocks sync when drift is found
5. **Primitive Value Preservation**: Verify primitive tokens (non-alias) are still pushed with resolved hex/number values
6. **Style Sync Preservation**: Verify text and effect style sync via Plugin API remains unchanged

### Unit Tests

- Test `batchCreateVariables` sends correct `{collectionId, variables}` payload to `figma_batch_create_variables`
- Test `batchUpdateVariables` sends correct `{updates: [{variableId, modeId, value}]}` payload to `figma_batch_update_variables`
- Test `createVariableAliases` generates correct Plugin API code with `createVariableAlias`
- Test port cleanup function finds and kills stale processes
- Test port cleanup handles no stale processes gracefully
- Test port cleanup handles `lsof` unavailability gracefully
- Test `syncVariables` correctly resolves `collectionId` for batch create calls
- Test `syncVariables` correctly builds update tuples with `variableId` from queried variables
- Test alias creation step identifies semantic tokens that reference primitives

### Property-Based Tests

- Generate random sets of `FigmaVariable` objects and verify `batchCreateVariables` always includes `collectionId` (never `fileKey`) in the payload
- Generate random variable update scenarios and verify `batchUpdateVariables` always produces `{updates: [{variableId, modeId, value}]}` tuples
- Generate random mixes of primitive and semantic tokens and verify primitives are pushed with resolved values while semantics trigger alias creation
- Generate random initial-setup payloads and verify the `figma_setup_design_tokens` call format is unchanged

### Integration Tests

- Test full incremental sync flow: initial setup → modify tokens → second push with batch create/update
- Test semantic alias creation end-to-end: push primitives and semantics → verify alias Plugin API calls are made
- Test port cleanup → connect → preflight → sync flow
- Test `--clean` flag still performs full initial setup even when variables exist
- Test resume from batch N works with the new `collectionId`-based batch create
