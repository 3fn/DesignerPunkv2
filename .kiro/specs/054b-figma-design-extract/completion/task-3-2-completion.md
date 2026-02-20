# Task 3.2 Completion: Implement Figma Component Reading (Dual-MCP)

**Date**: February 20, 2026
**Spec**: 054b - Figma Design Extraction
**Task**: 3.2 Implement Figma component reading (dual-MCP)
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 054b-figma-design-extract

---

## Summary

Implemented `readFigmaComponent(fileKey, nodeId)` on `DesignExtractor` using a dual-MCP strategy: Kiro Figma Power as primary source, figma-console-mcp as fallback.

## Changes Made

### New Interfaces (DesignExtractor.ts)
- `KiroFigmaPowerClient` — abstraction for Kiro Figma Power MCP (testable/mockable)
- `DesignContextResponse`, `MetadataResponse`, `FigmaComponentResponse` — MCP response types
- `ExtractedComponent` — rich component representation with layout, states, properties, and source tracking
- `ExtractedLayout` — layout information (mode, spacing, padding)

### New Method: `readFigmaComponent`
- Primary path: calls `kiroPower.getDesignContext()`, parses code for component name, description, variants, states, properties, and layout
- Fallback path: calls `kiroPower.getMetadata()` + `consoleMcp.getComponent()` when primary returns empty/fails
- Falls through gracefully when Kiro Power is unavailable or returns insufficient data

### Parsing Helpers (private methods)
- `parseDesignContext()` — orchestrates extraction from design context code
- `extractComponentName()` — matches class, function, or HTML tag patterns
- `extractDescription()` — extracts from JSDoc or line comments
- `extractVariants()` — finds variant/type/size/state property assignments
- `extractStates()` — detects hover, focus, disabled, pressed, active, selected keywords
- `extractProperties()` — matches TypeScript property type patterns
- `extractLayout()` — detects flex direction, gap, padding from CSS
- `extractStatesFromMetadata()` — extracts states from metadata XML

### ConsoleMCPClient Extension
- Added `getComponent(fileKey, nodeId)` to `ConsoleMCPClient` interface
- Added `FigmaComponentData` type for the response
- Implemented `getComponent()` in `ConsoleMCPClientImpl` (calls `figma_get_component`)

### Constructor Update
- `DesignExtractor` constructor now accepts optional `kiroPower?: KiroFigmaPowerClient` as 4th parameter
- Backward compatible — existing code without Kiro Power continues to work via fallback

### Export Updates
- `index.ts` updated to export all new types: `KiroFigmaPowerClient`, `DesignContextResponse`, `MetadataResponse`, `FigmaComponentResponse`, `ExtractedComponent`, `ExtractedLayout`, `FigmaComponentData`

### Test Mock Fixes
- Added `getStyles` and `getComponent` mocks to 7 existing test files that mock `ConsoleMCPClient`

## Test Results

- 16 new tests in `DesignExtractor.readFigmaComponent.test.ts` — all passing
- 230 total tests across all figma test suites — all passing
- Coverage: primary path, fallback path, error handling, edge cases

## Error Handling

- Kiro Power failure → graceful fallback to console MCP
- Console MCP failure → throws with file key and node ID in message
- Component not found (no name) → throws descriptive error
- Metadata unavailable → continues without metadata
- Both sources fail → throws with combined context

## Requirements Addressed

- Req 1: DesignExtractor reads Figma component structure via Kiro Figma Power and figma-console-mcp
