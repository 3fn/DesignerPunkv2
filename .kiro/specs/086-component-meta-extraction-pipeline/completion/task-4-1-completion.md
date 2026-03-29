# Task 4.1 Completion: Configure Platform Agent Knowledge Bases

**Date**: 2026-03-28
**Task**: 4.1 Configure platform agent knowledge bases
**Type**: Setup
**Validation**: Tier 1 - Minimal
**Agent**: Peter
**Status**: Complete

---

## Changes Made

Updated `.kiro/agents/sparky.json`, `.kiro/agents/kenya.json`, `.kiro/agents/data.json`:

1. **Platform Resource Map** — Added `file://.kiro/steering/Platform-Resource-Map.md` to all three agents for directory navigation reference
2. **Platform token output** — Added generated token files as `file://` resources per platform:
   - Sparky: `dist/web/DesignTokens.web.css`, `dist/ComponentTokens.web.css`, `dist/browser/demo-styles.css`
   - Kenya: `dist/ios/DesignTokens.ios.swift`, `dist/ComponentTokens.ios.swift`
   - Data: `dist/android/DesignTokens.android.kt`, `dist/ComponentTokens.android.kt`

## Design Deviation

The original Design Decision 5 specified `knowledgeBase` resources with `includePatterns` for platform-filtered component source indexing. Investigation against Kiro's agent configuration reference revealed that `includePatterns` is not a supported field — knowledge base resources only support `type`, `source`, `name`, `description`, `indexType`, and `autoUpdate`.

**Alternatives evaluated:**
- Broad `src/components/core` knowledge base (indexes all 3 platforms — opposite of intended scoping)
- `agentSpawn` hook with filtered `find` command (per-conversation token cost for what the resource map provides)
- Custom MCP tool for platform-filtered source (scope creep)
- Kiro `/knowledge` CLI with `--include` patterns (supports filtering, but experimental and warrants its own strategy)

**Implemented approach:** Platform Resource Map (`file://`) for navigation + generated token output (`file://`) for immediate token reference. This gives platform agents what they need most — token values in context and a path reference for everything else.

**Future path:** Spec 087 (Agent Knowledge Base Strategy) explores using Kiro's `/knowledge` CLI feature for searchable, platform-filtered source access across all agents. The `/knowledge` feature supports `--include`/`--exclude` patterns and per-agent isolation — the exact capability the original design assumed would be in the JSON config.

See Design Decision 5 implementation note in `design.md` for full rationale.

## Requirements Coverage

| Requirement | AC | Status | Notes |
|-------------|-----|--------|-------|
| Req 6.1 | Platform agents have knowledge base configured | ✅ (adapted) | Token output as `file://` resources + resource map; filtered component source deferred to Spec 087 |

## Validation

- ✅ All referenced `dist/` files exist
- ✅ Platform Resource Map exists and is queryable
- ✅ Agent configs are valid JSON
