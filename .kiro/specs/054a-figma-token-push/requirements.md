# Requirements Document: Figma Token Push

**Date**: February 18, 2026
**Spec**: 054a - Figma Token Push
**Status**: Requirements Phase
**Dependencies**: Spec 053 (DTCG Token Format Generator), Spec 054 Design Outline (shared architectural context)

---

## Introduction

This spec implements the token push workflow: DesignerPunk tokens → Figma Variables and Styles. Building on Spec 053's DTCG output, this enables designers to work with DesignerPunk tokens in Figma.

**Core Value:**
- Designers work in DesignerPunk vocabulary (not raw pixel values)
- Code remains source of truth (one-way sync: Code → Figma)
- Tokens are pushed to dedicated Figma library file
- Figma is read-only for tokens (manual edits are detected and blocked)

**Workflow:**
```
Code (Rosetta) 
  → DTCG (spec 053) 
  → FigmaTransformer (this spec)
  → DesignTokens.figma.json
  → TokenSyncWorkflow (this spec)
  → Figma Variables + Styles
```

---

## Requirements

### Requirement 1: FigmaTransformer Implementation

**User Story:**
As a DesignerPunk maintainer, I need a transformer that converts DTCG tokens to Figma format, so that tokens can be synced to Figma.

**Acceptance Criteria:**
- FigmaTransformer implements ITokenTransformer interface
- Transformer is registered in TransformerRegistry
- Transformer generates DesignTokens.figma.json output
- Output includes both variable definitions and style definitions
- Transformer handles all DTCG token types (dimension, color, fontFamily, fontWeight, number, duration, shadow, typography)

**Testable Conditions:**
- GIVEN DTCG token file with primitive tokens WHEN transformer runs THEN output includes Figma variable definitions
- GIVEN DTCG token file with semantic tokens WHEN transformer runs THEN output includes alias references
- GIVEN DTCG token file with shadow tokens WHEN transformer runs THEN output includes Figma effect style definitions
- GIVEN DTCG token file with typography tokens WHEN transformer runs THEN output includes Figma text style definitions

---

### Requirement 2: Figma Variable Generation

**User Story:**
As a designer, I need DesignerPunk tokens available as Figma variables, so that I can use them in my designs.

**Acceptance Criteria:**
- Primitive tokens are converted to Figma variables
- Semantic tokens are converted to Figma variables with alias references
- Variables are organized into collections (Primitives, Semantics)
- Variables support light and dark modes (identical values for Phase 1)
- Variable naming follows Figma conventions (e.g., `space/100`, `color/purple/300`)
- Variable descriptions include token metadata (mathematical relationship, platform values)

**Testable Conditions:**
- GIVEN primitive token `space.100` WHEN transformed THEN Figma variable `space/100` is created with value 8
- GIVEN semantic token `color.primary` aliasing `purple.300` WHEN transformed THEN Figma variable `color/primary` aliases `color/purple/300`
- GIVEN any token WHEN transformed THEN variable exists in both light and dark modes with identical values
- GIVEN token with description WHEN transformed THEN Figma variable includes description

---

### Requirement 3: Figma Style Generation (Composite Tokens)

**User Story:**
As a designer, I need composite tokens (shadow, typography) available as Figma styles, so that I can apply them with one click.

**Acceptance Criteria:**
- Shadow tokens are converted to Figma effect styles
- Typography tokens are converted to Figma text styles
- Style naming follows convention (e.g., `shadow.elevation200`, `typography.heading200`)
- Style properties match token definitions exactly
- Styles include descriptions referencing source token

**Testable Conditions:**
- GIVEN shadow token `shadow.elevation200` WHEN transformed THEN Figma effect style is created with matching x, y, blur, spread, color
- GIVEN typography token `typography.heading200` WHEN transformed THEN Figma text style is created with matching fontFamily, fontSize, fontWeight, lineHeight, letterSpacing
- GIVEN composite token WHEN transformed THEN style name matches token name
- GIVEN composite token with description WHEN transformed THEN style includes description

---

### Requirement 4: Token Sync Workflow

**User Story:**
As a DesignerPunk maintainer, I need a sync workflow that pushes tokens to Figma, so that designers have access to the latest tokens.

**Acceptance Criteria:**
- Sync workflow reads DesignTokens.figma.json
- Sync workflow connects to Figma via Console MCP (NPX mode + Desktop Bridge)
- Sync workflow creates/updates Figma variables using batch APIs
- Sync workflow creates/updates Figma styles using Plugin API
- Sync workflow reports progress (created, updated, deleted counts)
- Sync workflow handles errors gracefully (partial failure, recovery)

**Testable Conditions:**
- GIVEN DesignTokens.figma.json WHEN sync runs THEN variables are created in Figma
- GIVEN existing variables in Figma WHEN sync runs with updated tokens THEN variables are updated
- GIVEN batch of 100 variables WHEN sync runs THEN batch API is used (not individual calls)
- GIVEN sync failure on batch 3 of 5 WHEN error occurs THEN batches 1-2 remain applied and error report shows recovery command

---

### Requirement 5: Drift Detection

**User Story:**
As a DesignerPunk maintainer, I need drift detection that blocks sync when Figma variables have been manually edited, so that code remains source of truth.

**Acceptance Criteria:**
- Sync workflow compares current Figma state against last-known pushed state
- Sync workflow detects when variables have been manually edited in Figma
- Sync workflow blocks sync when drift is detected
- Sync workflow reports which variables drifted and how
- Sync workflow provides force override option (`--force` flag)

**Testable Conditions:**
- GIVEN variable `space/100` with value 8 in code WHEN Figma has value 10 THEN sync blocks and reports drift
- GIVEN drift detected WHEN sync runs with `--force` flag THEN sync proceeds and overwrites Figma values
- GIVEN no drift WHEN sync runs THEN sync proceeds normally
- GIVEN drift report WHEN displayed THEN shows variable name, expected value, actual value

---

### Requirement 6: Mode Mapping

**User Story:**
As a designer, I need tokens available in both light and dark modes, so that Figma's mode structure is ready for future theme support.

**Acceptance Criteria:**
- All tokens are pushed to both light and dark modes
- Light and dark mode values are identical (Phase 1)
- Mode structure supports future theme-aware tokens without requiring changes

**Testable Conditions:**
- GIVEN token `space.100` with value 8 WHEN transformed THEN light mode has value 8 AND dark mode has value 8
- GIVEN semantic token `color.primary` WHEN transformed THEN light mode aliases `color/purple/300` AND dark mode aliases `color/purple/300`

---

### Requirement 7: CLI Command

**User Story:**
As a DesignerPunk maintainer, I need a CLI command to trigger token push, so that I can sync tokens on demand.

**Acceptance Criteria:**
- CLI command `npm run figma:push` triggers sync workflow
- CLI command supports `--force` flag to override drift detection
- CLI command supports `--resume N` flag to resume from failed batch
- CLI command reports sync results (created, updated, deleted, errors)
- CLI command exits with error code on failure

**Testable Conditions:**
- GIVEN CLI command `npm run figma:push` WHEN executed THEN sync workflow runs
- GIVEN drift detected WHEN `npm run figma:push --force` executed THEN sync proceeds with override
- GIVEN sync failed on batch 3 WHEN `npm run figma:push --resume 3` executed THEN sync resumes from batch 3
- GIVEN sync success WHEN command completes THEN exit code is 0
- GIVEN sync failure WHEN command completes THEN exit code is non-zero

---

### Requirement 8: Desktop Bridge Dependency

**User Story:**
As a DesignerPunk maintainer, I need clear setup documentation for Desktop Bridge, so that I can configure the Plugin API dependency.

**Acceptance Criteria:**
- Documentation explains Desktop Bridge purpose (Plugin API access for styles)
- Documentation provides setup instructions (install plugin, run in Figma Desktop)
- Pre-flight check verifies Desktop Bridge is running before sync
- Pre-flight check reports clear error if Desktop Bridge is not available
- Documentation includes troubleshooting guide for common issues

**Testable Conditions:**
- GIVEN Desktop Bridge not running WHEN sync starts THEN pre-flight check fails with clear error message
- GIVEN Desktop Bridge running WHEN sync starts THEN pre-flight check passes
- GIVEN WebSocket connection on port 9223 WHEN pre-flight check runs THEN connection is verified

---

### Requirement 9: Error Handling and Recovery

**User Story:**
As a DesignerPunk maintainer, I need clear error reporting and recovery guidance, so that I can resolve sync failures.

**Acceptance Criteria:**
- Sync reports what succeeded before failure (created/updated counts)
- Sync reports what failed (batch number, error message)
- Sync provides recovery command (e.g., `npm run figma:push --resume 3`)
- Sync stops on first batch failure (doesn't continue with remaining batches)
- Sync logs detailed error information for debugging

**Testable Conditions:**
- GIVEN sync fails on batch 3 WHEN error occurs THEN report shows "Created: 200 variables (batches 1-2), Failed: Batch 3 of 5"
- GIVEN sync failure WHEN error report displayed THEN includes recovery command
- GIVEN rate limit error WHEN sync fails THEN error message suggests waiting and retrying

---

### Requirement 10: Output Artifact

**User Story:**
As a DesignerPunk maintainer, I need an intermediate Figma format file, so that I can audit token transformations before sync.

**Acceptance Criteria:**
- FigmaTransformer generates `dist/DesignTokens.figma.json`
- Output file includes variable definitions and style definitions
- Output file is human-readable (formatted JSON)
- Output file can be reviewed before sync (dry-run capability)

**Testable Conditions:**
- GIVEN transformer runs WHEN complete THEN `dist/DesignTokens.figma.json` exists
- GIVEN output file WHEN opened THEN JSON is formatted with indentation
- GIVEN output file WHEN reviewed THEN includes both variables and styles sections

---

## Documentation Requirements

### User-Facing Documentation

1. **Figma Integration Guide** (update existing `.kiro/steering/DTCG-Integration-Guide.md`)
   - Add section on token push workflow
   - Document CLI commands (`figma:push`, flags)
   - Document drift detection and force override
   - Document Desktop Bridge setup

2. **Transformer Development Guide** (update existing `.kiro/steering/Transformer-Development-Guide.md`)
   - Add FigmaTransformer as example implementation
   - Document style generation via Plugin API

### Internal Documentation

1. **054a Design Document** (`design.md`)
   - FigmaTransformer architecture
   - TokenSyncWorkflow implementation
   - Style management via Plugin API
   - Partial failure handling strategy
   - Naming conventions (variables vs styles)

2. **054a Tasks Document** (`tasks.md`)
   - Task breakdown with validation tiers
   - Implementation sequence
   - Testing strategy

---

## Success Criteria

This spec is complete when:

1. ✅ FigmaTransformer generates valid Figma format output
2. ✅ Token sync workflow pushes variables and styles to Figma
3. ✅ Drift detection blocks sync when Figma variables are manually edited
4. ✅ CLI command `npm run figma:push` works with all flags
5. ✅ Desktop Bridge pre-flight check validates Plugin API availability
6. ✅ Error handling provides clear recovery guidance
7. ✅ All requirements have passing tests
8. ✅ Documentation is complete and accurate

---

## Out of Scope

The following are explicitly out of scope for this spec:

1. **Design extraction** (Figma → design-outline.md) — Covered in Spec 054b
2. **Bidirectional sync** (Figma → Code) — Explicitly rejected in design outline
3. **Automated CI/CD sync** — Future enhancement
4. **Component token sync** — Evaluate after Phase 1
5. **Theme-aware mode mapping** — Future enhancement (Phase 1 uses identical values)
6. **Penpot/Pencil.io transformers** — Future ITokenTransformer implementations

---

**Organization**: spec-guide
**Scope**: 054a-figma-token-push
