# Task 4.2 Completion: Add npm script

**Date**: February 20, 2026
**Task**: 4.2 Add npm script
**Spec**: 054b - Figma Design Extraction
**Type**: Setup
**Validation**: Tier 1 - Minimal
**Organization**: spec-completion
**Scope**: 054b-figma-design-extract

## What Was Done

Added `figma:extract` npm script to package.json, following the same `npx ts-node` pattern used by the existing `figma:push` script.

## Script Added

```json
"figma:extract": "npx ts-node src/cli/figma-extract.ts"
```

## Verification

- Script registered in package.json: ✅
- `npm run figma:extract` runs and prints usage when no arguments provided: ✅
- Exits with error code and usage message for missing `--file` argument: ✅
- Matches existing CLI script patterns (`figma:push`, `release:analyze`, etc.): ✅

## Requirements Coverage

- **Req 10**: CLI command `npm run figma:extract` triggers extraction workflow ✅
