# Task 6.1 Completion: Create Figma Workflow Guide

**Date**: February 20, 2026
**Task**: 6.1 Create Figma Workflow Guide
**Type**: Documentation
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 054b-figma-design-extract

---

## Summary

Created `docs/figma-workflow-guide.md` — a comprehensive developer-facing guide covering both the token push (054a) and design extraction (054b) workflows.

## Artifacts Created

- `docs/figma-workflow-guide.md` — Complete Figma Workflow Guide

## Document Structure

The guide covers all sections specified in Requirement 11:

1. **Overview** — Bidirectional integration description, prerequisites
2. **MCP Setup** — figma-console-mcp, Kiro Figma Power, Desktop Bridge plugin setup, authentication (PAT)
3. **Token Push Workflow** — CLI usage (`npm run figma:push`), all flags (`--force`, `--resume`, `--dry-run`, `--clean`), drift detection, partial failure/resume, what gets pushed
4. **Design Extraction Workflow** — Design-to-spec-to-code 5-phase diagram, CLI usage (`npm run figma:extract`), all arguments (`--file`, `--node`, `--output`), confidence flag interpretation, token translation approach, design outline sections, component token suggestions, mode validation
5. **Troubleshooting** — MCP connection issues, Desktop Bridge not running, authentication failures, no-match token values, missing Component-Family docs, DTCG token file not found
6. **Related Documentation** — Cross-references to DTCG Integration Guide, Token Governance, Component Development Guide, Spec Planning Standards, Token System Overview, and spec design docs

## Validation

- All CLI arguments and flags verified against actual implementations (`src/cli/figma-extract.ts`, `src/cli/figma-push.ts`)
- Exit codes documented accurately from source
- Confidence flag definitions match DesignExtractor implementation
- Tolerance rules match TokenTranslator implementation
- Cross-references use relative paths from `docs/` directory

## Requirements Traceability

- **Req 11**: All acceptance criteria addressed — CLI documentation, confidence flag interpretation, troubleshooting, workflow diagram, cross-references
