# Build System Setup

**Date**: October 25, 2025  
**Purpose**: Document the build system configuration for DesignerPunk v2  
**Context**: Added during Task 3.2 completion to prevent stale JavaScript issues

---

## Overview

This project uses a hybrid TypeScript compilation approach:
- **Development**: Uses `ts-node` and `ts-jest` for direct TypeScript execution
- **Distribution**: Compiles to JavaScript in `dist/` for runtime usage

## Available Scripts

### Build Scripts

```bash
# Compile TypeScript to JavaScript (dist/)
npm run build

# Compile TypeScript in watch mode (auto-recompile on changes)
npm run build:watch

# Verify compiled JavaScript works correctly
npm run build:verify
```

### Test Scripts

```bash
# Run all tests (uses ts-jest, no build needed)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## How It Works

### TypeScript Compilation

The `build` script runs `tsc --skipLibCheck` which:
- Compiles all TypeScript files in `src/` to JavaScript in `dist/`
- Skips type checking for node_modules (faster compilation)
- Generates source maps and declaration files
- Exits with code 0 even if there are errors in unrelated code (non-blocking)

**Note**: There are currently TypeScript errors in the `release-analysis` module that don't affect token generation. The build script uses `|| echo 'Build completed with errors (non-blocking)'` to allow compilation to complete for the working modules.

### Test Execution

Tests use `ts-jest` which:
- Compiles TypeScript on-the-fly during test execution
- No pre-compilation needed
- Always uses the latest TypeScript source

### Build Verification

The `build:verify` script (`verify-build.js`) checks that:
- Compiled JavaScript can be loaded
- Classes can be instantiated
- Semantic token methods are present
- iOS generation includes semantic tokens correctly

## When to Build

### You MUST build when:
- Testing generated output files (e.g., `DesignTokens.ios.swift`)
- Running scripts that import from `dist/` (e.g., custom test scripts)
- Preparing for distribution or deployment
- After making changes to generator or formatter code

### You DON'T need to build when:
- Running tests with `npm test` (ts-jest handles compilation)
- Using CLI tools that use ts-node (e.g., `npm run release:analyze`)
- Making changes and running tests immediately

## Development Workflow

### Standard Development (Recommended)

```bash
# 1. Make changes to TypeScript files
# 2. Run tests (no build needed)
npm test

# 3. If testing generated output, build first
npm run build
node your-test-script.js
```

### Active Development with Watch Mode

```bash
# Terminal 1: Keep TypeScript compiling
npm run build:watch

# Terminal 2: Run tests or scripts
npm test
# or
node your-test-script.js
```

## Troubleshooting

### Issue: "Method not found" errors when running scripts

**Symptom**: Script fails with errors like `formatSingleReferenceToken is not a function`

**Cause**: Compiled JavaScript in `dist/` is out of date

**Solution**: Run `npm run build` to recompile

### Issue: Build fails with TypeScript errors

**Symptom**: `npm run build` shows TypeScript errors

**Cause**: There are TypeScript errors in the codebase (currently in `release-analysis` module)

**Solution**: The build script is configured to be non-blocking. Check if your changes compiled:
```bash
npm run build
npm run build:verify
```

If `build:verify` passes, your code compiled successfully despite errors in other modules.

### Issue: Tests pass but generated files are wrong

**Symptom**: Tests pass but generated output doesn't include expected content

**Cause**: Tests use ts-jest (latest source) but scripts use compiled JavaScript (potentially stale)

**Solution**: Always run `npm run build` before testing generated output

## Future Improvements

### Option 1: Fix TypeScript Errors
Fix the TypeScript errors in `release-analysis` module to enable clean builds

### Option 2: Separate Build Configs
Create separate `tsconfig.json` files for different parts of the codebase:
- `tsconfig.tokens.json` - Just token generation code
- `tsconfig.release.json` - Release analysis code

### Option 3: Go Full ts-node
Remove `dist/` entirely and use ts-node everywhere (simpler but slower)

## Related Files

- `package.json` - Build scripts configuration
- `tsconfig.json` - TypeScript compiler configuration
- `verify-build.js` - Build verification script
- `.kiro/specs/semantic-token-generation/completion/task-3-2-completion.md` - Context for why this was added

---

**Organization**: process-documentation  
**Scope**: cross-project
