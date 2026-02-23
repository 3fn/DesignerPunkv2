# Task 5 Completion: --url Flag and Screenshot Fix

**Date**: 2026-02-23
**Task**: 5. Support --url flag and fix screenshot capture
**Type**: Bug Fix + Enhancement
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 054d-hierarchical-design-extraction

## Summary

Added `--url` flag to `figma-extract` CLI and fixed three screenshot capture issues:
1. `getComponentImage` was passing `fileKey` but `figma_get_component_image` expects `fileUrl`
2. COMPONENT_SET nodes can't be rendered — now screenshots each variant child instead
3. Image URLs were returned but never downloaded to disk — now saves to `analysis/images/`

## Changes

1. **`src/figma/ConsoleMCPClient.ts`** — Changed `getComponentImage` parameter from `fileKey` to `fileUrl`.

2. **`src/figma/ConsoleMCPClientImpl.ts`** — Now passes `fileUrl` to `figma_get_component_image` MCP tool.

3. **`src/figma/DesignExtractor.ts`**:
   - Added `fs`, `path`, `https`, `http` imports
   - `captureComponentScreenshot` accepts `fileUrl` instead of `fileKey`
   - `captureComponentScreenshot` downloads image to disk via `downloadFile` helper
   - `extractComponentAnalysis` accepts optional `fileUrl` parameter (falls back to constructing URL from fileKey)
   - COMPONENT_SET detection: screenshots each variant child instead of the unrenderable set node

4. **`src/cli/figma-extract.ts`** — Added `parseFigmaUrl()` helper, `--url` flag support, and `fileUrl` field to `FigmaExtractArgs`.

5. **`src/cli/__tests__/figma-extract.test.ts`** — Updated assertion for 4th `fileUrl` argument.

6. **`src/figma/__tests__/DesignExtractor.captureComponentScreenshot.test.ts`** — Mock `downloadFile` to prevent HTTP calls in tests.

## Usage

```bash
# New: paste Figma URL directly
npm run figma:extract -- --url "https://www.figma.com/design/KEY/NAME?node-id=1230-112"

# New: URL + extra nodes
npm run figma:extract -- --url "https://www.figma.com/design/KEY/NAME?node-id=1-2" --node "3:4"

# Existing: still works
npm run figma:extract -- --file KEY --node 1:2
```

## Verified

- Live extraction of Progress Indicator Primitive COMPONENT_SET
- Screenshot downloaded to `analysis/images/` as PNG
- Image URL from Figma S3 CDN (expires after 30 days)

## Test Results

512 tests passing across 31 figma/CLI test suites, 0 regressions.
