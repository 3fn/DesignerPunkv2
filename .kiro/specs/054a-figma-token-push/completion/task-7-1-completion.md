# Task 7.1 Completion: Update DTCG Integration Guide

**Date**: February 18, 2026
**Task**: 7.1 Update DTCG Integration Guide
**Spec**: 054a - Figma Token Push
**Status**: Complete
**Organization**: spec-completion
**Scope**: 054a-figma-token-push

---

## What Was Done

Added a comprehensive "Token Push Workflow" section to `docs/dtcg-integration-guide.md` covering the full Figma token push workflow.

## Sections Added

1. **Token Push Workflow** — Overview with workflow diagram (Code → DTCG → FigmaTransformer → Figma)
2. **Prerequisites** — Figma Desktop, Node.js 18+, figma-console-mcp, access token
3. **Desktop Bridge Setup** — 4-step guide: import plugin manifest, run plugin, configure .env, verify connection
4. **CLI Commands** — All flags documented (`--force`, `--resume N`, `--dry-run`) with exit codes
5. **Drift Detection and Force Override** — Explanation with example error output and resolution options
6. **Partial Failure and Resume** — Batch failure handling with example error output and recovery command
7. **What Gets Pushed** — Table mapping token types to Figma artifacts with naming conventions
8. **Troubleshooting** — Four subsections:
   - Desktop Bridge not connecting
   - Port conflicts (9223-9232)
   - Multiple MCP server instances
   - Plugin connection errors

## Documentation Accuracy

All content was verified against the actual implementation:
- CLI flags match `src/cli/figma-push.ts` `parseArgs()` implementation
- Desktop Bridge manifest path matches `node_modules/figma-console-mcp/figma-desktop-bridge/manifest.json`
- Port range (9223-9232) matches the manifest's `networkAccess.allowedDomains`
- Error messages match `src/figma/error-reporting.ts` formatters
- Environment variables match `.env.example`
- npm script matches `package.json` (`figma:push`)

## Files Modified

- `docs/dtcg-integration-guide.md` — Added Token Push Workflow section, updated metadata (scope, last reviewed date), added related documentation link

## Requirements Addressed

- Req 8 (Desktop Bridge Dependency) — Setup documentation, pre-flight check explanation, troubleshooting guide
