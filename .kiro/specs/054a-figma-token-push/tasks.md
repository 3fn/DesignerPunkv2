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

### Task 1: FigmaTransformer Implementation (Parent)

**Type**: Architecture (Parent)
**Validation**: Tier 3 - Comprehensive
**Success Criteria:**
- FigmaTransformer generates valid Figma format output
- All DTCG token types are transformed correctly
- Output includes both variables and styles
- Transformer is registered and invocable

**Subtasks:**

- [ ] 1.1 Create FigmaTransformer class structure
  **Type**: Setup
  **Validation**: Tier 1 - Minimal
  - Create `src/generators/transformers/FigmaTransformer.ts`
  - Implement ITokenTransformer interface
  - Add config property (id, name, outputExtension)
  - Export from transformers index
  - _Requirements: Req 1_

- [ ] 1.2 Implement variable transformation
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `transformVariables()` method
  - Generate primitives collection (space, color, fontSize, etc.)
  - Generate semantics collection (with alias references)
  - Apply naming convention (`space/100`, `color/purple/300`)
  - Set mode values (identical for light/dark)
  - Add variable descriptions (mathematical relationship, platform values)
  - _Requirements: Req 2, Req 6_

- [ ] 1.3 Implement style transformation
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `transformStyles()` method
  - Generate effect styles from shadow tokens
  - Generate text styles from typography tokens
  - Apply naming convention (`shadow.elevation200`, `typography.heading200`)
  - Add style descriptions (reference source token)
  - _Requirements: Req 3_

- [ ] 1.4 Implement main transform method
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `transform()` method
  - Call `transformVariables()` and `transformStyles()`
  - Combine into FigmaTokenFile structure
  - Return TransformResult with formatted JSON
  - Collect transformation warnings
  - _Requirements: Req 1, Req 10_

- [ ] 1.5 Register transformer
  **Type**: Setup
  **Validation**: Tier 1 - Minimal
  - Add FigmaTransformer to TransformerRegistry
  - Update registry tests
  - Verify transformer is invocable
  - _Requirements: Req 1_

- [ ] 1.6 Write transformer tests
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

### Task 2: TokenSyncWorkflow Implementation (Parent)

**Type**: Architecture (Parent)
**Validation**: Tier 3 - Comprehensive
**Success Criteria:**
- TokenSyncWorkflow pushes variables and styles to Figma
- Drift detection blocks sync when variables are manually edited
- Partial failure handling provides clear recovery
- All error scenarios are handled gracefully

**Subtasks:**

- [ ] 2.1 Create TokenSyncWorkflow class structure
  **Type**: Setup
  **Validation**: Tier 1 - Minimal
  - Create `src/figma/TokenSyncWorkflow.ts`
  - Define SyncOptions, SyncResult, DriftReport interfaces
  - Add constructor (consoleMcp, figmaFileKey)
  - Export from figma index
  - _Requirements: Req 4_

- [ ] 2.2 Implement drift detection
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `detectDrift()` method
  - Compare current Figma state against expected state
  - Identify drifted variables (name, expected value, actual value)
  - Generate DriftReport with drifted variables
  - _Requirements: Req 5_

- [ ] 2.3 Implement variable sync (batch operations)
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `syncVariables()` method
  - Implement `batchCreateVariables()` (100 per batch)
  - Implement `batchUpdateVariables()` (100 per batch)
  - Handle resume from failed batch (startBatch parameter)
  - Stop on first batch failure
  - Track created/updated counts
  - _Requirements: Req 4, Req 9_

- [ ] 2.4 Implement style sync (individual operations)
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `syncStyles()` method
  - Implement `createStyle()` using Plugin API
  - Implement `updateStyle()` using Plugin API
  - Generate Plugin API code for effect styles
  - Generate Plugin API code for text styles
  - Handle style creation/update errors
  - _Requirements: Req 4_

- [ ] 2.5 Implement main sync method
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

- [ ] 2.6 Implement initial setup method
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `initialSetup()` method
  - Use `figma_setup_design_tokens` for atomic creation
  - Create collections, modes, and variables in one call
  - Handle initial setup errors
  - _Requirements: Req 4_

- [ ] 2.7 Write sync workflow tests
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

### Task 3: Console MCP Client Implementation

**Type**: Implementation
**Validation**: Tier 2 - Standard

- [ ] 3.1 Create ConsoleMCPClient class
  - Create `src/figma/ConsoleMCPClient.ts`
  - Implement `batchCreateVariables()` method
  - Implement `batchUpdateVariables()` method
  - Implement `getVariables()` method
  - Implement `execute()` method (Plugin API)
  - Handle Console MCP connection errors
  - _Requirements: Req 4_

- [ ] 3.2 Write Console MCP client tests
  - Test batch variable creation
  - Test batch variable updates
  - Test Plugin API execution
  - Test error handling (rate limits, connection failures)
  - _Requirements: Req 4_

---

### Task 4: Desktop Bridge Pre-flight Check

**Type**: Implementation
**Validation**: Tier 2 - Standard

- [ ] 4.1 Implement Desktop Bridge check
  - Create `src/figma/preflight.ts`
  - Implement `checkDesktopBridge()` function
  - Check WebSocket connection on port 9223
  - Return PreflightResult (ready, error message)
  - _Requirements: Req 8_

- [ ] 4.2 Write pre-flight tests
  - Test Desktop Bridge available
  - Test Desktop Bridge unavailable
  - Test WebSocket connection failure
  - _Requirements: Req 8_

---

### Task 5: CLI Command Implementation

**Type**: Implementation
**Validation**: Tier 2 - Standard

- [ ] 5.1 Create CLI command
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
  - Add `figma:push` script to package.json
  - Configure script to run CLI command
  - Test script execution
  - _Requirements: Req 7_

- [ ] 5.3 Write CLI tests
  - Test normal sync
  - Test force override flag
  - Test resume flag
  - Test dry-run flag
  - Test error reporting
  - Test exit codes
  - _Requirements: Req 7_

---

### Task 6: Error Reporting Implementation

**Type**: Implementation
**Validation**: Tier 2 - Standard

- [ ] 6.1 Implement drift error reporting
  - Format drift report (variable name, expected, actual)
  - Provide resolution options (revert, force override, create token)
  - _Requirements: Req 5, Req 9_

- [ ] 6.2 Implement partial failure error reporting
  - Format error report (created count, failed batch, remaining count)
  - Provide recovery command (--resume flag)
  - _Requirements: Req 9_

- [ ] 6.3 Implement Desktop Bridge error reporting
  - Format error message (setup instructions, troubleshooting link)
  - _Requirements: Req 8, Req 9_

---

### Task 7: Documentation

**Type**: Documentation
**Validation**: Tier 2 - Standard

- [ ] 7.1 Update DTCG Integration Guide
  - Add "Token Push Workflow" section to `docs/dtcg-integration-guide.md`
  - Document CLI commands (`figma:push`, flags)
  - Document drift detection and force override
  - Document Desktop Bridge setup
  - Add troubleshooting section
  - _Requirements: Req 8_

- [ ] 7.2 Update Transformer Development Guide
  - Add FigmaTransformer as example to `docs/transformer-development-guide.md`
  - Document style generation via Plugin API
  - Document naming conventions
  - _Requirements: Req 1, Req 3_

- [ ] 7.3 Create completion documentation
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
