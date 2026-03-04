# Task 3.3 Completion: Implement `get_prop_guidance` MCP tool

**Date**: 2026-03-04
**Spec**: 068 - Family Guidance Indexer
**Task Type**: Implementation (Subtask)
**Tier**: 2 (Standard)
**Agent**: Lina

---

## Changes

- `component-mcp-server/src/index.ts` — registered `get_prop_guidance` tool with `component` (required) and `verbose` (optional, default false) parameters
- `component-mcp-server/src/query/QueryEngine.ts` — added `getGuidance()` method with verbose filtering

## Tool Behavior

- Accepts `component` (component name or family name) and optional `verbose` (boolean, default false)
- When `verbose=false`: strips `rationale` from selection rules and `description` from patterns (empty string)
- When `verbose=true`: returns full guidance including rationale and descriptions
- Returns clear "no guidance available" error for unknown components/families

## Integration Spot-Check

- Health: healthy | 28 components, 3 patterns, 3 guidance families
- `getGuidance('Buttons', false)` → family=Buttons, rationale stripped ✅
- `getGuidance('Input-Text-Email', true)` → family=Form Inputs, rationale present ✅
- `getGuidance('Unknown-Thing')` → "No guidance available" error ✅

## Test Results

- 11 suites, 132 tests, all passing
- TypeScript compilation clean
