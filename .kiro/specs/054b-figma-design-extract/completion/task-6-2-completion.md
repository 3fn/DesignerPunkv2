# Task 6.2 Completion: Migrate Figma-specific content from DTCG Integration Guide

**Date**: February 20, 2026
**Task**: 6.2 Migrate Figma-specific content from DTCG Integration Guide
**Spec**: 054b - Figma Design Extraction
**Status**: Complete
**Organization**: spec-completion
**Scope**: 054b-figma-design-extract

---

## What Was Done

Migrated all Figma-specific content from `.kiro/steering/DTCG-Integration-Guide.md` to the Figma Workflow Guide (`.kiro/steering/Figma-Workflow-Guide.md`), leaving the DTCG guide focused on tool-agnostic DTCG format documentation.

## Changes Made

### `.kiro/steering/DTCG-Integration-Guide.md`

1. **Updated metadata**: Changed Purpose to remove "including Figma token push workflow"; removed `054a-figma-token-push` from Scope
2. **Removed "Token Push Workflow" section**: Entire section (~150 lines) covering prerequisites, Desktop Bridge setup, CLI commands, drift detection, partial failure/resume, what gets pushed, and troubleshooting — all already present in the Figma Workflow Guide
3. **Added "Figma Integration" section**: Concise cross-reference paragraph pointing to the Figma Workflow Guide for all Figma-specific documentation
4. **Updated Related Documentation**: Replaced the link to `054a-figma-token-push/design.md` with a link to `figma-workflow-guide.md`

### Content Retained in DTCG Guide (tool-agnostic)

- DTCG Format Overview (structure, token types, aliases)
- Token Groups reference table
- DesignerPunk Extensions Schema
- DTCG Output Examples by Token Type
- Style Dictionary integration
- Tokens Studio integration
- Component developer guidance (don't consume DTCG in components)
- Configuration options

### Verification

- No Figma CLI commands, MCP setup, Desktop Bridge instructions, or authentication details remain in the DTCG guide
- The Figma Workflow Guide (created in Task 6.1) already contains comprehensive coverage of all migrated content
- No duplication between the two guides — DTCG guide references Figma guide for Figma-specific topics

## Related Documentation

- [Figma Workflow Guide](../../../../.kiro/steering/Figma-Workflow-Guide.md) — Destination for migrated content
- [DTCG Integration Guide](../../../../.kiro/steering/DTCG-Integration-Guide.md) — Source document (now tool-agnostic)
