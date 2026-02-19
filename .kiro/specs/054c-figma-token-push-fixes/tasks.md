# Implementation Plan

## Reference

- **Bugfix Requirements**: `.kiro/specs/054c-figma-token-push-fixes/bugfix.md`
- **Design Document**: `.kiro/specs/054c-figma-token-push-fixes/design.md`
- **Issues File**: `.kiro/issues/054a-figma-token-push-issues.md` (ISSUE-1 through ISSUE-4)
- **Source Files**: `src/figma/ConsoleMCPClient.ts`, `src/figma/ConsoleMCPClientImpl.ts`, `src/figma/TokenSyncWorkflow.ts`, `src/cli/figma-push.ts`, `src/generators/transformers/FigmaTransformer.ts`

---

- [x] 1. Write bug condition exploration tests
  - **Property 1: Fault Condition** — Incremental Sync Schema Mismatches & Missing Alias/Port Cleanup
  - **Type**: Implementation
  - **Validation**: Tier 2 — Unit tests
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bugs exist
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: These tests encode the expected behavior — they will validate the fixes when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate all four bugs exist in the current code
  - **Scoped PBT Approach**: For these deterministic bugs, scope each property to the concrete failing case(s)
  - **Test file**: `src/figma/__tests__/ConsoleMCPClient.bugfix.test.ts`
  - **Test 1a — Bug 1 (batchCreate collectionId)**: Call `batchCreateVariables(fileKey, variables)` on unfixed code, capture the payload sent to `callTool`. Assert the payload contains `collectionId` (not `fileKey`). On unfixed code this FAILS because the payload contains `fileKey` instead. _Bug_Condition: `input.isIncrementalSync AND input.hasNewVariables AND payload.hasProperty("fileKey") AND NOT payload.hasProperty("collectionId")`_
  - **Test 1b — Bug 2 (batchUpdate payload shape)**: Call `batchUpdateVariables(fileKey, variables)` on unfixed code, capture the payload sent to `callTool`. Assert the payload contains `{ updates: [{ variableId, modeId, value }] }`. On unfixed code this FAILS because the payload contains `{ fileKey, variables: [{name, resolvedType, valuesByMode}] }` instead. _Bug_Condition: `input.isIncrementalSync AND input.hasUpdatedVariables AND payload.shape != "{updates: [{variableId, modeId, value}]}"`_
  - **Test 1c — Bug 3 (semantic alias creation)**: Verify that `ConsoleMCPClient` interface includes a `createVariableAliases` method. On unfixed code this FAILS because the method does not exist. _Bug_Condition: `input.hasSemanticTokens AND input.semanticToken.referencesAlias AND pushedValue.type == "rawValue"`_
  - **Test 1d — Bug 4 (port cleanup)**: Verify that `figma-push.ts` `run()` performs port cleanup before `connect()`. On unfixed code this FAILS because no cleanup occurs. _Bug_Condition: `input.isStartup AND existsProcess(ports=[9223..9232]) AND NOT input.performsPortCleanup`_
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct — it proves the bugs exist)
  - Document counterexamples found to understand root cause
  - Mark task complete when tests are written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** — Initial Setup, CLI Flags, Primitives, and Style Sync Unchanged
  - **Type**: Implementation
  - **Validation**: Tier 2 — Unit tests
  - **IMPORTANT**: Follow observation-first methodology
  - **Test file**: `src/figma/__tests__/ConsoleMCPClient.preservation.test.ts` and `src/figma/__tests__/TokenSyncWorkflow.preservation.test.ts`
  - **Test 2a — Initial Setup Preservation**: Observe `setupDesignTokens()` behavior on unfixed code — verify it calls `figma_setup_design_tokens` with `{ collectionName, modes, tokens }` payload. Write property-based test: for all valid `DesignTokenSetupPayload` inputs, `setupDesignTokens` always calls `figma_setup_design_tokens` with the same payload format. _Preservation: First-time push via `figma_setup_design_tokens` atomic setup must continue to work identically_
  - **Test 2b — Clean Flag Preservation**: Observe `run()` with `--clean` flag on unfixed code — verify it forces `initialSetup()` path. Write test: for all inputs with `--clean`, the workflow always calls `initialSetup()` regardless of existing variables. _Preservation: `--clean` flag must continue to force the initial setup path_
  - **Test 2c — Dry-Run Preservation**: Observe `run()` with `--dry-run` flag on unfixed code — verify it writes artifact and exits without syncing. Write test: for all inputs with `--dry-run`, no MCP client is created and no sync occurs. _Preservation: `--dry-run` flag must continue to transform and write artifact without syncing_
  - **Test 2d — Drift Detection Preservation**: Observe `detectDrift()` on unfixed code — verify it compares expected vs actual values and returns drift report. Write property-based test: for all variable sets where values differ, `detectDrift` reports drift. _Preservation: Drift detection must continue to block sync when drift is found_
  - **Test 2e — Primitive Value Preservation**: Observe `setupDesignTokens()` with primitive (non-alias) tokens on unfixed code — verify they are pushed with resolved values. Write property-based test: for all primitive tokens (no `aliasOf`), values are passed through unchanged. _Preservation: Primitive tokens must continue to be pushed with resolved values_
  - **Test 2f — Style Sync Preservation**: Observe `generateTextStyleCode()` and `generateEffectStyleCode()` on unfixed code — verify Plugin API code generation is unchanged. Write test: for all style definitions, generated code matches expected format. _Preservation: Text and effect style sync via Plugin API must remain unchanged_
  - **Test 2g — Desktop Bridge Retry Preservation**: Verify that `checkDesktopBridge()` retry logic (5 attempts, 3-second delays) is unchanged. _Preservation: Desktop Bridge retry logic must continue for genuinely unavailable bridges_
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 3. Fix incremental sync parameter schemas (Bugs 1 & 2)
  - **Type**: Implementation
  - **Validation**: Tier 2 — Unit tests

  - [x] 3.1 Update `ConsoleMCPClient` interface signatures
    - Update `batchCreateVariables` signature: change first parameter from `fileKey: string` to `collectionId: string`, add `modesMap?: Record<string, string>` parameter
    - Update `batchUpdateVariables` signature: change from `(fileKey: string, variables: FigmaVariable[])` to accept update tuples `{ variableId: string, modeId: string, value: unknown }[]`
    - Add `createVariableAliases(fileKey: string, aliases: { semanticName: string, primitiveName: string }[]): Promise<void>` method to interface
    - Add optional `id?: string` and `collectionId?: string` fields to `FigmaVariable` interface in `FigmaTransformer.ts`
    - _Bug_Condition: `batchCreateVariables` accepts `fileKey` instead of `collectionId`; `batchUpdateVariables` accepts `FigmaVariable[]` instead of update tuples_
    - _Expected_Behavior: Interfaces match `figma_batch_create_variables` and `figma_batch_update_variables` tool schemas_
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.2 Fix `ConsoleMCPClientImpl.batchCreateVariables` implementation
    - Replace `fileKey` with `collectionId` in the `callTool` payload to `figma_batch_create_variables`
    - Accept `modesMap` parameter and convert `valuesByMode` keys from mode names to mode IDs
    - Match the pattern already used in the overflow batch logic inside `setupDesignTokens()`
    - _Bug_Condition: `isBugCondition(input) where input.batchCreatePayload.hasProperty("fileKey") AND NOT input.batchCreatePayload.hasProperty("collectionId")`_
    - _Expected_Behavior: `callTool('figma_batch_create_variables', { collectionId, variables: [{ name, resolvedType, valuesByMode: { modeId: value } }] })`_
    - _Requirements: 2.1_

  - [x] 3.3 Fix `ConsoleMCPClientImpl.batchUpdateVariables` implementation
    - Redesign to accept pre-built update tuples `{ variableId, modeId, value }[]`
    - Pass `{ updates: [...] }` to `figma_batch_update_variables`
    - _Bug_Condition: `isBugCondition(input) where input.batchUpdatePayload.shape == "{fileKey, variables: [{name, resolvedType, valuesByMode}]}"`_
    - _Expected_Behavior: `callTool('figma_batch_update_variables', { updates: [{ variableId, modeId, value }] })`_
    - _Requirements: 2.2_

  - [x] 3.4 Update `TokenSyncWorkflow` to pass correct parameters
    - Update `batchCreateVariables` calls to pass `collectionId` and `modesMap` instead of `this.figmaFileKey`
    - Store `collectionId` and `modesMap` from initial setup response or query via `figma_get_token_values`
    - Update `batchUpdateVariables` calls to build `{ variableId, modeId, value }` tuples by querying existing variables for their IDs first
    - _Preservation: Initial setup path, drift detection, style sync must remain unchanged_
    - _Requirements: 2.1, 2.2_

  - [x] 3.5 Update existing tests for new signatures
    - Update `ConsoleMCPClient.test.ts` mock calls to match new `batchCreateVariables(collectionId, variables, modesMap)` signature
    - Update `ConsoleMCPClient.test.ts` mock calls to match new `batchUpdateVariables(updates)` signature
    - Update `TokenSyncWorkflow.sync.test.ts` mock to include new interface methods
    - Update `TokenSyncWorkflow.styles.test.ts` mock if affected
    - Update `figma-push.test.ts` mock if affected
    - Ensure all existing tests pass with new signatures
    - _Requirements: 2.1, 2.2_

  - [x] 3.6 Verify bug condition exploration tests now pass (Bugs 1 & 2)
    - **Property 1: Expected Behavior** — Incremental Batch Create Uses collectionId & Batch Update Uses variableId Tuples
    - **IMPORTANT**: Re-run the SAME tests from task 1 (tests 1a and 1b) — do NOT write new tests
    - Run bug condition exploration tests 1a and 1b from step 1
    - **EXPECTED OUTCOME**: Tests PASS (confirms bugs 1 & 2 are fixed)
    - _Requirements: 2.1, 2.2_

  - [x] 3.7 Verify preservation tests still pass
    - **Property 2: Preservation** — Initial Setup, CLI Flags, Primitives, and Style Sync Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run preservation tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all preservation tests still pass after fix

- [x] 4. Fix semantic token alias creation (Bug 3)
  - **Type**: Implementation
  - **Validation**: Tier 2 — Unit tests

  - [x] 4.1 Implement `ConsoleMCPClientImpl.createVariableAliases`
    - Accept a list of `{ semanticName, primitiveName }` pairs
    - Generate Plugin API code that finds both variables by name using `figma.variables.getLocalVariables()`
    - Create alias via `figma.variables.createVariableAlias(primitiveVariable)`
    - Set semantic variable's value to the alias for each mode
    - Execute via `figma_execute`
    - _Bug_Condition: `input.hasSemanticTokens AND input.semanticToken.referencesAlias AND pushedValue.type == "rawValue"`_
    - _Expected_Behavior: `callTool('figma_execute', { fileKey, code })` where code uses `figma.variables.createVariableAlias()`_
    - _Requirements: 2.3_

  - [x] 4.2 Add alias creation step to `TokenSyncWorkflow`
    - After variable sync completes, identify semantic tokens that reference primitives (tokens with `aliasOf` in their original DTCG definition or in the FigmaVariable data)
    - Call `consoleMcp.createVariableAliases()` to create Figma variable aliases linking semantics to primitives
    - Add to both `initialSetup()` (after `setupDesignTokens`) and `sync()` (after variable sync)
    - _Preservation: Primitive tokens must continue to be pushed with resolved values_
    - _Requirements: 2.3_

  - [x] 4.3 Verify bug condition exploration test now passes (Bug 3)
    - **Property 1: Expected Behavior** — Semantic Tokens Create Figma Variable Aliases
    - **IMPORTANT**: Re-run the SAME test from task 1 (test 1c) — do NOT write a new test
    - Run bug condition exploration test 1c from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug 3 is fixed)
    - _Requirements: 2.3_

  - [x] 4.4 Verify preservation tests still pass
    - **Property 2: Preservation** — Primitive Values and Style Sync Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run preservation tests from step 2 (especially 2a, 2e, 2f)
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)

- [x] 5. Fix stale port cleanup on startup (Bug 4)
  - **Type**: Implementation
  - **Validation**: Tier 2 — Unit tests

  - [x] 5.1 Implement port cleanup utility
    - Create `src/figma/portCleanup.ts` (or add to `figma-push.ts`)
    - Execute `lsof -ti:9223-9232` to find PIDs of stale `figma-console-mcp` processes
    - Kill found processes with `kill <PID>`
    - Handle gracefully on platforms where `lsof` is unavailable (Windows, etc.)
    - Log cleanup actions for visibility (e.g. "Killed stale process on port 9223")
    - _Bug_Condition: `input.isStartup AND existsProcess(ports=[9223..9232]) AND NOT input.performsPortCleanup`_
    - _Expected_Behavior: Stale processes terminated before `connect()`_
    - _Requirements: 2.4_

  - [x] 5.2 Integrate port cleanup into `figma-push.ts` `run()`
    - Call port cleanup BEFORE creating `ConsoleMCPClientImpl` and calling `connect()`
    - Add after the dry-run exit point but before pre-flight checks
    - _Requirements: 2.4_

  - [x] 5.3 Verify bug condition exploration test now passes (Bug 4)
    - **Property 1: Expected Behavior** — Stale Port Cleanup on Startup
    - **IMPORTANT**: Re-run the SAME test from task 1 (test 1d) — do NOT write a new test
    - Run bug condition exploration test 1d from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug 4 is fixed)
    - _Requirements: 2.4_

  - [x] 5.4 Verify preservation tests still pass
    - **Property 2: Preservation** — Desktop Bridge Retry Logic Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run preservation tests from step 2 (especially 2g)
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)

- [ ] 6. Checkpoint — Ensure all tests pass
  - **Type**: Implementation
  - **Validation**: Tier 1 — Full test suite
  - Run `npm test` to verify all tests pass (existing + new bugfix tests)
  - Verify all 4 bug condition exploration tests (1a-1d) now PASS
  - Verify all preservation tests (2a-2g) still PASS
  - Verify all existing tests in `ConsoleMCPClient.test.ts`, `TokenSyncWorkflow.sync.test.ts`, `TokenSyncWorkflow.styles.test.ts`, and `figma-push.test.ts` still PASS
  - Ensure no regressions introduced
  - Ask the user if questions arise
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
