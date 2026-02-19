# Task 5.2 Completion: Add npm script

**Date**: February 18, 2026
**Spec**: 054a - Figma Token Push
**Task**: 5.2 Add npm script
**Type**: Setup
**Status**: Complete
**Organization**: spec-completion
**Scope**: 054a-figma-token-push

---

## What Was Done

Added `figma:push` npm script to package.json that runs the CLI command via `npx ts-node src/cli/figma-push.ts`.

## Artifacts Modified

- `package.json` — Added `figma:push` script entry

## Validation

- `npm run` lists `figma:push` with correct command
- `package.json` passes JSON validation
- `npm run figma:push` executes successfully through transform phase, failing only at pre-flight check due to missing Figma access token (expected)

## Usage

```bash
npm run figma:push                  # Normal sync
npm run figma:push -- --force       # Override drift detection
npm run figma:push -- --resume 3    # Resume from batch 3
npm run figma:push -- --dry-run     # Transform only, no sync
```

---

**Requirements**: Req 7 (CLI Command)
