---
inclusion: manual
---

# Build System Setup

**Date**: 2025-10-25
**Updated**: November 19, 2025  
**Last Reviewed**: 2025-12-15
**Purpose**: Document the build system configuration for DesignerPunk v2  
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: debugging, validation
**Context**: Added during Task 3.2 completion to prevent stale JavaScript issues. Updated during TypeScript error resolution to reflect restored type safety enforcement.

## AI Agent Reading Priorities

**Note**: This section intentionally uses the same heading as other steering documents because each document provides reading priorities specific to its content. This structural pattern enables progressive disclosure and helps AI agents navigate to relevant sections efficiently.

**Layer Context**: This is a Layer 3 (Specific Implementations) document that provides specialized troubleshooting and build system guidance. It's conditionally loaded when experiencing build issues, TypeScript errors, or testing generated output files.

**WHEN experiencing build errors THEN Read:**
- Troubleshooting section for specific error patterns
- "When to Build" section to understand build requirements
- Type Safety Enforcement section for TypeScript error context

**WHEN testing generated output files THEN Read:**
- "When to Build" section (MUST build before testing output)
- Build Verification section to understand what's checked
- Development Workflow section for proper testing sequence

**WHEN encountering TypeScript compilation errors THEN Read:**
- Type Safety Enforcement section (errors must be fixed, not bypassed)
- Troubleshooting: "Build fails with TypeScript errors"
- Best Practices for type safety

**WHEN seeing "method not found" or stale JavaScript errors THEN Read:**
- Troubleshooting: "Method not found errors"
- How It Works: TypeScript Compilation vs Test Execution
- Solution: Run `npm run build` to recompile

**SKIP when:**
- Normal development without build issues
- Running tests (ts-jest handles compilation automatically)
- Component development following established patterns
- No TypeScript errors or build failures

---

## Overview

**Note**: This section intentionally uses the same heading as other steering documents because each document provides an overview of its specific system or process. This structural pattern enables consistent navigation across documentation.

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
- **Enforces type safety**: Build fails if TypeScript errors are present

**Important**: The build system now enforces full type safety. If there are TypeScript errors in your code, the build will fail. This is expected and correct behavior - TypeScript errors must be fixed before the build can succeed. This ensures type safety is maintained throughout the codebase.

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

**Symptom**: `npm run build` shows TypeScript errors and exits with non-zero code

**Cause**: There are TypeScript errors in the codebase that must be fixed

**Solution**: This is expected and correct behavior. TypeScript errors must be fixed before the build can succeed:

1. Review the error messages from `npm run build`
2. Fix the TypeScript errors in the reported files
3. Run `npm run build` again to verify the fixes
4. Once all errors are resolved, the build will succeed

**Note**: The build system enforces type safety to prevent runtime errors and maintain code quality. If you see TypeScript errors, they indicate real issues that need to be addressed.

### Issue: Tests pass but generated files are wrong

**Symptom**: Tests pass but generated output doesn't include expected content

**Cause**: Tests use ts-jest (latest source) but scripts use compiled JavaScript (potentially stale)

**Solution**: Always run `npm run build` before testing generated output

## Type Safety Enforcement

### Current State

The build system now enforces full TypeScript type safety:
- All TypeScript errors must be resolved before build succeeds
- No workarounds or non-blocking configurations
- Clean builds ensure type safety throughout the codebase

### Benefits

- **Runtime Safety**: Catch type errors at compile time, not runtime
- **Code Quality**: Maintain high code quality standards
- **IDE Experience**: Accurate autocomplete and error highlighting
- **Refactoring Confidence**: Type system catches breaking changes

### Best Practices

1. **Fix errors immediately**: Don't let TypeScript errors accumulate
2. **Use strict types**: Avoid `any` types when possible
3. **Validate after changes**: Run `npm run build` to verify type safety
4. **Leverage IDE**: Use TypeScript language server for real-time feedback

## Future Improvements

### Option 1: Separate Build Configs
Create separate `tsconfig.json` files for different parts of the codebase:
- `tsconfig.tokens.json` - Just token generation code
- `tsconfig.release.json` - Release analysis code

### Option 2: Go Full ts-node
Remove `dist/` entirely and use ts-node everywhere (simpler but slower)

## Related Files

- `package.json` - Build scripts configuration
- `tsconfig.json` - TypeScript compiler configuration
- `verify-build.js` - Build verification script
- `.kiro/specs/semantic-token-generation/completion/task-3-2-completion.md` - Context for why this was added

---

**Organization**: process-standard
**Scope**: cross-project
