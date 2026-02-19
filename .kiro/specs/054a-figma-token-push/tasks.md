# Implementation Plan: Figma Token Push

**Date**: February 18, 2026
**Spec**: 054a - Figma Token Push
**Status**: Implementation Planning
**Dependencies**: Spec 053 (DTCG Token Format Generator), Spec 054 Design Outline (shared architectural context)

---

## Implementation Plan

This spec implements the token push workflow in three phases:

1. **Phase 1: FigmaTransformer** — Convert DTCG tokens to Figma format
2. **Phase 2: TokenSyncWorkflow** — Push tokens to Figma via Console MCP
3. **Phase 3: CLI and Documentation** — User-facing command and guides

**Estimated Timeline:** 2-3 weeks

---

## Task List

- [x] 1. FigmaTransformer Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - FigmaTransformer generates valid Figma format output
  - All DTCG token types are transformed correctly
  - Output includes both variables and styles
  - Transformer is registered and invocable
  
  **Primary Artifacts:**
  - `src/generators/transformers/FigmaTransformer.ts`
  - `src/generators/__tests__/FigmaTransformer.variables.test.ts`
  - `src/generators/__tests__/FigmaTransformer.styles.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/054a-figma-token-push/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/054a-figma-token-push/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Run tests: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: FigmaTransformer Implementation"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Create FigmaTransformer class structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/generators/transformers/FigmaTransformer.ts`
    - Implement ITokenTransformer interface
    - Add config property (id, name, outputExtension)
    - Export from transformers index
    - _Requirements: Req 1_

  - [x] 1.2 Implement variable transformation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `transformVariables()` method
    - Generate primitives collection (space, color, fontSize, etc.)
    - Generate semantics collection (with alias references)
    - Apply naming convention (`space/100`, `color/purple/300`)
    - Set mode values (identical for light/dark)
    - Add variable descriptions (mathematical relationship, platform values)
    - _Requirements: Req 2, Req 6_

  - [x] 1.3 Implement style transformation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `transformStyles()` method
    - Generate effect styles from shadow tokens
    - Generate text styles from typography tokens
    - Apply naming convention (`shadow.elevation200`, `typography.heading200`)
    - Add style descriptions (reference source token)
    - _Requirements: Req 3_

  - [x] 1.4 Implement main transform method
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `transform()` method
    - Call `transformVariables()` and `transformStyles()`
    - Combine into FigmaTokenFile structure
    - Return TransformResult with formatted JSON
    - Collect transformation warnings
    - _Requirements: Req 1, Req 10_

  - [x] 1.5 Register transformer
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add FigmaTransformer to TransformerRegistry
    - Update registry tests
    - Verify transformer is invocable
    - _Requirements: Req 1_

  - [x] 1.6 Write transformer tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test primitive token transformation
    - Test semantic token transformation (aliases)
    - Test shadow token transformation (effect styles)
    - Test typography token transformation (text styles)
    - Test mode mapping (identical values)
    - Test naming conventions
    - _Requirements: All_

---

- [x] 2. TokenSyncWorkflow Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - TokenSyncWorkflow pushes variables and styles to Figma
  - Drift detection blocks sync when variables are manually edited
  - Partial failure handling provides clear recovery
  - All error scenarios are handled gracefully
  
  **Primary Artifacts:**
  - `src/figma/TokenSyncWorkflow.ts`
  - `src/figma/__tests__/TokenSyncWorkflow.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/054a-figma-token-push/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/054a-figma-token-push/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Run tests: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: TokenSyncWorkflow Implementation"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Create TokenSyncWorkflow class structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/figma/TokenSyncWorkflow.ts`
    - Define SyncOptions, SyncResult, DriftReport interfaces
    - Add constructor (consoleMcp, figmaFileKey)
    - Export from figma index
    - _Requirements: Req 4_

  - [x] 2.2 Implement drift detection
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `detectDrift()` method
    - Compare current Figma state against expected state
    - Identify drifted variables (name, expected value, actual value)
    - Generate DriftReport with drifted variables
    - _Requirements: Req 5_

  - [x] 2.3 Implement variable sync (batch operations)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `syncVariables()` method
    - Implement `batchCreateVariables()` (100 per batch)
    - Implement `batchUpdateVariables()` (100 per batch)
    - Handle resume from failed batch (startBatch parameter)
    - Stop on first batch failure
    - Track created/updated counts
    - _Requirements: Req 4, Req 9_

  - [x] 2.4 Implement style sync (individual operations)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `syncStyles()` method
    - Implement `createStyle()` using Plugin API
    - Implement `updateStyle()` using Plugin API
    - Generate Plugin API code for effect styles
    - Generate Plugin API code for text styles
    - Handle style creation/update errors
    - _Requirements: Req 4_

  - [x] 2.5 Implement main sync method
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `sync()` method
    - Get current Figma state
    - Run drift detection (block if drift found, unless force override)
    - Calculate diff (toCreate, toUpdate, toDelete)
    - Call `syncVariables()` with resume support
    - Call `syncStyles()`
    - Return SyncResult with counts and errors
    - _Requirements: Req 4, Req 5, Req 9_

  - [x] 2.6 Implement initial setup method
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `initialSetup()` method
    - Use `figma_setup_design_tokens` for atomic creation
    - Create collections, modes, and variables in one call
    - Handle initial setup errors
    - _Requirements: Req 4_

  - [x] 2.7 Write sync workflow tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test drift detection (variables edited in Figma)
    - Test force override (sync proceeds despite drift)
    - Test partial failure (stop on first batch error)
    - Test resume from failed batch
    - Test batch operations (100 per batch)
    - Test style creation/update
    - _Requirements: All_

---

- [ ] 3. Console MCP Client Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - ConsoleMCPClient successfully connects to Console MCP server
  - All MCP tool calls work correctly (batch operations, execute)
  - Error handling provides clear messages for connection failures
  
  **Primary Artifacts:**
  - `src/figma/ConsoleMCPClient.ts`
  - `src/figma/__tests__/ConsoleMCPClient.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/054a-figma-token-push/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/054a-figma-token-push/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Run tests: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Console MCP Client Implementation"`
  - Verify: Check GitHub for committed changes

  - [ ] 3.1 Create ConsoleMCPClient class
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Install `@modelcontextprotocol/sdk` as dependency
    - Create `src/figma/ConsoleMCPClient.ts`
    - Use `StdioClientTransport` to spawn Console MCP subprocess (`npx figma-console-mcp@latest`)
    - Implement `batchCreateVariables()` method (calls `figma_batch_create_variables` tool)
    - Implement `batchUpdateVariables()` method (calls `figma_batch_update_variables` tool)
    - Implement `getVariables()` method (calls `figma_get_variables` tool)
    - Implement `execute()` method (calls `figma_execute` tool for Plugin API)
    - Handle Console MCP connection errors
    - _Requirements: Req 4_

  - [ ] 3.2 Write Console MCP client tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test batch variable creation
    - Test batch variable updates
    - Test Plugin API execution
    - Test error handling (rate limits, connection failures)
    - _Requirements: Req 4_

---

- [ ] 4. Desktop Bridge Pre-flight Check

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - Pre-flight check correctly detects Desktop Bridge availability
  - Error messages provide clear setup instructions
  - Check completes quickly without blocking
  
  **Primary Artifacts:**
  - `src/figma/preflight.ts`
  - `src/figma/__tests__/preflight.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/054a-figma-token-push/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/054a-figma-token-push/task-4-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Run tests: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Desktop Bridge Pre-flight Check"`
  - Verify: Check GitHub for committed changes

  - [ ] 4.1 Implement Desktop Bridge check
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/figma/preflight.ts`
    - Implement `checkDesktopBridge()` function
    - Check WebSocket connection on port 9223
    - Return PreflightResult (ready, error message)
    - _Requirements: Req 8_

  - [ ] 4.2 Write pre-flight tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test Desktop Bridge available
    - Test Desktop Bridge unavailable
    - Test WebSocket connection failure
    - _Requirements: Req 8_

---

- [ ] 5. CLI Command Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - CLI command successfully orchestrates full token push workflow
  - All flags work correctly (--force, --resume, --dry-run)
  - Error reporting is clear and actionable
  - Exit codes are correct for success and failure
  
  **Primary Artifacts:**
  - `src/cli/figma-push.ts`
  - `src/cli/__tests__/figma-push.test.ts`
  - `package.json` (figma:push script)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/054a-figma-token-push/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/054a-figma-token-push/task-5-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Run tests: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: CLI Command Implementation"`
  - Verify: Check GitHub for committed changes

  - [ ] 5.1 Create CLI command
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/cli/figma-push.ts`
    - Parse command-line arguments (--force, --resume, --dry-run)
    - Load DTCG tokens from `dist/DesignTokens.dtcg.json`
    - Run FigmaTransformer
    - Write `dist/DesignTokens.figma.json`
    - Run pre-flight check
    - Run TokenSyncWorkflow
    - Report results (created, updated, errors)
    - Exit with appropriate code (0 on success, 1 on failure)
    - _Requirements: Req 7_

  - [ ] 5.2 Add npm script
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add `figma:push` script to package.json
    - Configure script to run CLI command
    - Test script execution
    - _Requirements: Req 7_

  - [ ] 5.3 Write CLI tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test normal sync
    - Test force override flag
    - Test resume flag
    - Test dry-run flag
    - Test error reporting
    - Test exit codes
    - _Requirements: Req 7_

---

- [ ] 6. Error Reporting Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - All error scenarios produce clear, actionable messages
  - Error messages include resolution steps
  - Error formatting is consistent across all error types
  
  **Primary Artifacts:**
  - `src/figma/error-reporting.ts`
  - `src/figma/__tests__/error-reporting.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/054a-figma-token-push/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/054a-figma-token-push/task-6-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Run tests: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Error Reporting Implementation"`
  - Verify: Check GitHub for committed changes

  - [ ] 6.1 Implement drift error reporting
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Format drift report (variable name, expected, actual)
    - Provide resolution options (revert, force override, create token)
    - _Requirements: Req 5, Req 9_

  - [ ] 6.2 Implement partial failure error reporting
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Format error report (created count, failed batch, remaining count)
    - Provide recovery command (--resume flag)
    - _Requirements: Req 9_

  - [ ] 6.3 Implement Desktop Bridge error reporting
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Format error message (setup instructions, troubleshooting link)
    - _Requirements: Req 8, Req 9_

---

- [ ] 7. Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - All user-facing documentation is complete and accurate
  - Documentation includes examples and troubleshooting
  - Developer documentation covers implementation details
  
  **Primary Artifacts:**
  - `docs/dtcg-integration-guide.md` (updated)
  - `docs/transformer-development-guide.md` (updated)
  - `.kiro/specs/054a-figma-token-push/completion/` (task completion docs)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/054a-figma-token-push/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/054a-figma-token-push/task-7-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Run tests: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 7 Complete: Documentation"`
  - Verify: Check GitHub for committed changes

  - [ ] 7.1 Update DTCG Integration Guide
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Add "Token Push Workflow" section to `docs/dtcg-integration-guide.md`
    - Document CLI commands (`figma:push`, flags)
    - Document drift detection and force override
    - Document Desktop Bridge setup
    - Add troubleshooting section
    - _Requirements: Req 8_

  - [ ] 7.2 Update Transformer Development Guide
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Add FigmaTransformer as example to `docs/transformer-development-guide.md`
    - Document style generation via Plugin API
    - Document naming conventions
    - _Requirements: Req 1, Req 3_

  - [ ] 7.3 Create completion documentation
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Create task completion docs in `.kiro/specs/054a-figma-token-push/completion/`
    - Document implementation approach
    - Document key decisions
    - Document integration points
    - _Requirements: All_

---

## Validation Strategy

### Tier 1: Minimal (Setup Tasks)

**Tasks:** 1.1, 1.5, 2.1

**Validation:**
- Syntax validation (TypeScript compiles)
- Artifact verification (files exist)
- Basic structure validation (exports correct)

---

### Tier 2: Standard (Implementation Tasks)

**Tasks:** 1.2, 1.3, 1.4, 1.6, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 4.1, 4.2, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3

**Validation:**
- Syntax validation (TypeScript compiles)
- Functional validation (unit tests pass)
- Integration validation (connects with Console MCP)
- Requirements compliance (acceptance criteria met)

---

### Tier 3: Comprehensive (Architecture & Parent Tasks)

**Tasks:** 1 (parent), 2 (parent)

**Validation:**
- All Tier 2 validations
- Design validation (extensibility, maintainability)
- System integration (end-to-end workflow works)
- Edge cases (drift detection, partial failures, errors)
- Success criteria verification (all subtasks integrate correctly)

---

## Testing Checklist

### Unit Tests

- [ ] FigmaTransformer transforms all token types correctly
- [ ] Variable naming conventions are correct
- [ ] Style naming conventions are correct
- [ ] Mode mapping generates identical values
- [ ] Drift detection identifies edited variables
- [ ] Batch operations chunk correctly (100 per batch)
- [ ] Partial failure stops on first error
- [ ] Resume skips completed batches
- [ ] Plugin API code generation is correct
- [ ] Pre-flight check detects Desktop Bridge

### Integration Tests

- [ ] End-to-end sync to test Figma file
- [ ] Variables created correctly in Figma
- [ ] Styles created correctly in Figma
- [ ] Drift detection blocks sync
- [ ] Force override proceeds despite drift
- [ ] Resume continues from failed batch
- [ ] Error reporting provides clear guidance

---

## Post-Completion Steps

1. **Run tests**: `npm test` (verify all tests pass)
2. **Test CLI**: `npm run figma:push -- --dry-run` (verify output)
3. **Test sync**: `npm run figma:push` (verify sync to test Figma file)
4. **Commit changes**: `./.kiro/hooks/commit-task.sh "Figma Token Push"`
5. **Create summary**: `docs/specs/054a-figma-token-push/task-1-summary.md` (parent task only)
6. **Trigger release detection**: Summary doc creation triggers automatic detection

---

## Dependencies

- **Spec 053**: DTCG Token Format Generator must be complete
- **Console MCP**: NPX mode + Desktop Bridge must be configured
- **Figma Access Token**: Personal access token must be configured
- **Figma File**: Dedicated token library file must exist

---

## Related Documentation

- [Requirements](./requirements.md) — What this spec must accomplish
- [Design](./design.md) — How this spec is implemented
- [Design Outline](../../054-figma-console-mcp-integration/design-outline.md) — Shared architectural context
- [Process-Task-Type-Definitions](.kiro/steering/Process-Task-Type-Definitions.md) — Task type classification guidance

---

**Organization**: spec-guide
**Scope**: 054a-figma-token-push
