# Task 4.1 Completion: Create CLI Command

**Date**: February 20, 2026
**Task**: 4.1 Create CLI command
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Spec**: 054b - Figma Design Extraction
**Organization**: spec-completion
**Scope**: 054b-figma-design-extract

---

## Summary

Created `src/cli/figma-extract.ts` — the CLI entry point for the Figma design extraction workflow.

## What Was Done

- Created CLI command with argument parsing (`--file`, `--node`, `--output`)
- Validates required arguments (`--file` and `--node`), exits with error and usage hint if missing
- Loads DTCG tokens from `dist/DesignTokens.dtcg.json` with error handling
- Runs stale port cleanup via `cleanupStalePorts()` before connecting (lesson from 054c ISSUE-4)
- Initializes `ConsoleMCPClientImpl`, `TokenTranslator`, `VariantAnalyzer`, `DesignExtractor`
- Runs `extractor.extractDesign(fileKey, nodeId)` and generates markdown
- Writes output to specified path (default `./design-outline.md`)
- Reports extraction results: confidence summary, exact/approximate/no-match counts, review items
- Exit code 0 on success, 1 on failure or when human input is required
- Calls `consoleMcp.disconnect()` in finally block (lesson from 054c)
- `StubMCPDocClient` used for VariantAnalyzer in CLI mode (DesignerPunk MCP may not be available)

## Design Decisions

- Followed the same patterns as `src/cli/figma-push.ts` for consistency (exported `run()`, `parseArgs()`, `loadDTCGTokens()`, bootstrap guard)
- Used a `StubMCPDocClient` that returns null for all queries — VariantAnalyzer handles null gracefully with ⚠️ confidence flags, so extraction still works without the documentation MCP server
- Created output directory if it doesn't exist (defensive for `--output` paths with subdirectories)

## Artifacts

- `src/cli/figma-extract.ts` — CLI command implementation

## Related

- [Design: CLI Command Implementation](../../054b-figma-design-extract/design.md) — CLI section
- [Requirements: Req 10](../../054b-figma-design-extract/requirements.md) — CLI Command requirement
- [figma-push.ts](../../../src/cli/figma-push.ts) — Pattern reference
