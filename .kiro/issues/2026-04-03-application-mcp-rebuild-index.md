# Application MCP: Add rebuild_index Tool

**Date**: 2026-04-03
**Severity**: Medium
**Agent**: Lina
**Found by**: Thurgood (Spec 086 Task 5.2, v10.1.0 release)

## Problem

The Application MCP has `get_component_health` (read-only status) but no `rebuild_index` tool. When the index is stale, the only fix is restarting the MCP server. The Docs MCP has both `get_index_health` and `rebuild_index` — the Application MCP should match.

## Evidence

- Spec 086 Task 5.2: stale session showed 28 components when server had 30
- v10.1.0 release: `get_component_health` returned stale data after server restart
- Spec 091: stale index during readiness verification

## Fix

Add a `rebuild_index` tool to the Application MCP server:

1. Register tool in `application-mcp-server/src/index.ts` (same pattern as existing tools)
2. Tool calls `indexer.indexComponents(componentsDir)` — already exists, just not exposed as a tool
3. Return new health status after reindex

~20 lines of code. Same pattern as Docs MCP's `rebuild_index`.

## Priority

Before product development begins. Stale indexes during screen implementation would cause confusion and wasted debugging time.
