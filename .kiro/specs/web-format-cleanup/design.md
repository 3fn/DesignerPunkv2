# Design Document: Web Format Cleanup

**Date**: November 9, 2025
**Spec**: web-format-cleanup
**Status**: Design Phase
**Dependencies**: None
**Related Issues**: #019, #020

---

## Overview

This design document outlines the technical approach for removing JavaScript format support from the web token generation system. The cleanup addresses technical debt introduced by misunderstood requirements during initial implementation.

**Design Goals**:
- Remove ~350 lines of unnecessary code safely
- Maintain CSS format functionality without regression
- Update tests to validate actual production behavior
- Simplify codebase to align with stakeholder intent

**Approach**: Systematic removal of JavaScript format support in three phases:
1. **Phase 1**: Remove format support from core classes (WebFormatGenerator, WebFileOrganizer)
2. **Phase 2**: Update test suites to expect CSS format only
3. **Phase 3**: Update documentation and validate no regressions

---

## Architecture

### Current State (Before Cleanup)

```
┌─────────────────────────────────────────────────────────────┐
│                  TokenFileGenerator                          │
│  constructor() {                                             │
│    this.webGenerator = new WebFormatGenerator('css');       │
│  }                                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              WebFormatGenerator                              │
│  - formats: ['css', 'javascript']  ← REMOVE                 │
│  - constructor(format: OutputFormat = 'css')  ← SIMPLIFY    │
│  - formatCSSCustomProperty()  ← KEEP                        │
│  - formatJavaScriptConstant()  ← REMOVE                     │
│  - Format conditionals throughout  ← REMOVE                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              WebFileOrganizer                                │
│  getFileName(format: OutputFormat) {  ← SIMPLIFY            │
│    switch (format) {                                         │
│      case 'javascript': return '.web.js'  ← REMOVE          │
│      case 'css': return '.web.css'  ← KEEP                  │
│    }                                                         │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

### Target State (After Cleanup)

```
┌─────────────────────────────────────────────────────────────┐
│                  TokenFileGenerator                          │
│  constructor() {                                             │
│    this.webGenerator = new WebFormatGenerator();            │
│  }                                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              WebFormatGenerator                              │
│  - formats: ['css']  ✓ CSS only                            │
│  - constructor()  ✓ No format parameter                    │
│  - formatCSSCustomProperty()  ✓ Direct call                │
│  - No format conditionals  ✓ Simplified                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              WebFileOrganizer                                │
│  getFileName() {  ✓ No format parameter                    │
│    return 'DesignTokens.web.css';  ✓ Direct return         │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### WebFormatGenerator Changes

**Current Interface**:
```typescript
export class WebFormatGenerator extends BaseFormatProvider {
  readonly platform: TargetPlatform = 'web';
  readonly formats: OutputFormat[] = ['css', 'javascript'];
  
  private outputFormat: OutputFormat;
  
  constructor(outputFormat: OutputFormat = 'css') {
    super();
    this.outputFormat = outputFormat;
  }
  
  formatToken(token: PrimitiveToken): string {
    if (this.outputFormat === 'css') {
      return this.formatCSSCustomProperty(/* ... */);
    } else {
      return this.formatJavaScriptConstant(/* ... */);
    }
  }
  
  private formatCSSCustomProperty(/* ... */): string { /* ... */ }
  private formatJavaScriptConstant(/* ... */): string { /* ... */ }
}
```

**Target Interface**:
```typescript
export class WebFormatGenerator extends BaseFormatProvider {
  readonly platform: TargetPlatform = 'web';
  readonly formats: OutputFormat[] = ['css'];
  
  constructor() {
    super();
  }
  
  formatToken(token: PrimitiveToken): string {
    return this.formatCSSCustomProperty(/* ... */);
  }
  
  private formatCSSCustomProperty(/* ... */): string { /* ... */ }
}
```

**Changes**:
- Remove `outputFormat` property
- Remove constructor parameter
- Remove `formatJavaScriptConstant()` method
- Remove all format conditionals (if/else based on format)
- Simplify `formats` array to `['css']` only
- Direct call to `formatCSSCustomProperty()` without conditionals

**Lines Removed**: ~150 lines (format conditionals, JavaScript methods, format switching logic)

---

### WebFileOrganizer Changes

**Current Interface**:
```typescript
export class WebFileOrganizer extends BasePathProvider {
  getFileName(format: OutputFormat): string {
    switch (format) {
      case 'javascript':
        return 'DesignTokens.web.js';
      case 'css':
        return 'DesignTokens.web.css';
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
  
  getBuildSystemIntegration(): BuildSystemConfig {
    return {
      importPatterns: [
        "import { tokens } from '@/tokens/DesignTokens.web.js'",
        "import tokens from '@/tokens/DesignTokens.web.js'",
        "import '@/tokens/DesignTokens.web.css'"
      ],
      // ...
    };
  }
}
```

**Target Interface**:
```typescript
export class WebFileOrganizer extends BasePathProvider {
  getFileName(): string {
    return 'DesignTokens.web.css';
  }
  
  getBuildSystemIntegration(): BuildSystemConfig {
    return {
      importPatterns: [
        "import '@/tokens/DesignTokens.web.css'"
      ],
      // ...
    };
  }
}
```

**Changes**:
- Remove `format` parameter from `getFileName()`
- Remove switch statement, return CSS filename directly
- Remove JavaScript import patterns from `getBuildSystemIntegration()`
- Update `validatePath()` to only check for `.css` extension

**Lines Removed**: ~30 lines (format switching, JavaScript import patterns)

---

### TokenFileGenerator Changes

**Current Code**:
```typescript
constructor() {
  this.webGenerator = new WebFormatGenerator('css');
  this.iosGenerator = new iOSFormatGenerator();
  this.androidGenerator = new AndroidFormatGenerator('kotlin');
}
```

**Target Code**:
```typescript
constructor() {
  this.webGenerator = new WebFormatGenerator();
  this.iosGenerator = new iOSFormatGenerator();
  this.androidGenerator = new AndroidFormatGenerator('kotlin');
}
```

**Changes**:
- Remove `'css'` argument from WebFormatGenerator constructor
- No other changes needed (already hardcoded to CSS)

**Lines Changed**: 1 line

---

## Test Updates

### Test Suites Requiring Updates

1. **TokenFileGenerator.test.ts** (Issue #019)
   - Update 4 tests expecting `.web.js` to expect `.web.css`
   - Update content expectations from `export` to `:root`
   - Lines affected: ~20 lines

2. **BuildSystemIntegration.test.ts**
   - Remove JavaScript import pattern expectations
   - Keep CSS import pattern tests
   - Lines affected: ~30 lines

3. **BuildSystemCompatibility.test.ts**
   - Remove JavaScript format compatibility tests
   - Keep CSS format compatibility tests
   - Lines affected: ~20 lines

4. **PathProviders.test.ts**
   - Update file path expectations from `.web.js` to `.web.css`
   - Remove JavaScript format validation tests
   - Lines affected: ~40 lines

5. **WebFormatGenerator tests**
   - Remove JavaScript format generation tests
   - Keep CSS format generation tests
   - Lines affected: ~50 lines

**Total Test Lines Updated/Removed**: ~160 lines

---

## Data Models

No data model changes required. Token structures remain unchanged:

```typescript
// PrimitiveToken - unchanged
interface PrimitiveToken {
  name: string;
  category: TokenCategory;
  baseValue: number;
  // ... other properties
}

// SemanticToken - unchanged
interface SemanticToken {
  name: string;
  category: SemanticCategory;
  primitiveReferences: Record<string, string>;
  // ... other properties
}

// OutputFormat - simplified
type OutputFormat = 'css';  // Was: 'css' | 'javascript'
```

**Note**: OutputFormat type simplification may be in shared types file. If other platforms use OutputFormat, keep the union type but document that web only supports 'css'.

---

## Error Handling

### Current Error Handling

```typescript
getFileName(format: OutputFormat): string {
  switch (format) {
    case 'javascript':
      return 'DesignTokens.web.js';
    case 'css':
      return 'DesignTokens.web.css';
    default:
      throw new Error(`Unsupported format for web platform: ${format}`);
  }
}
```

### Target Error Handling

```typescript
getFileName(): string {
  return 'DesignTokens.web.css';
}
```

**Changes**:
- Remove format validation (no format parameter to validate)
- Remove unsupported format error (only CSS supported)
- Simpler, no error cases

**Error Handling Strategy**: Since format is no longer configurable, there are no format-related errors to handle. If future code tries to pass a format parameter, TypeScript will catch it at compile time.

---

## Testing Strategy

### Pre-Cleanup Validation

**Before making any changes**:

1. **Run full test suite**: `npm test`
   - Document current test results
   - Identify which tests pass/fail
   - Baseline for comparison

2. **Run CSS format tests specifically**:
   ```bash
   npm test -- --testNamePattern="CSS"
   ```
   - Verify CSS format tests all pass
   - These should continue passing after cleanup

3. **Generate tokens manually**:
   ```bash
   npm run generate:tokens
   ```
   - Verify CSS output is correct
   - Save output for comparison

### During Cleanup Validation

**After each component change**:

1. **Run TypeScript compiler**: `npm run build`
   - Verify no compilation errors
   - Fix any type errors immediately

2. **Run affected tests**:
   - After WebFormatGenerator changes: Run WebFormatGenerator tests
   - After WebFileOrganizer changes: Run PathProviders tests
   - After test updates: Run updated test suite

3. **Incremental validation**:
   - Don't move to next component until current component tests pass
   - Fix issues immediately, don't accumulate failures

### Post-Cleanup Validation

**After all changes complete**:

1. **Run full test suite**: `npm test`
   - All tests should pass
   - Compare to pre-cleanup baseline

2. **Generate tokens**: `npm run generate:tokens`
   - Compare output to pre-cleanup output
   - Output should be identical

3. **Run diagnostics**: `getDiagnostics` on all modified files
   - Verify no TypeScript errors
   - Verify no linting issues

4. **Manual verification**:
   - Review generated CSS file
   - Verify CSS custom properties are valid
   - Check that :root selector is present

---

## Design Decisions

### Decision 1: Remove Format Parameter vs Make Format Constant

**Options Considered**:
1. Remove format parameter entirely
2. Keep format parameter but make it always 'css'
3. Keep format parameter but throw error if not 'css'

**Decision**: Remove format parameter entirely

**Rationale**: 
- Simplest approach - no parameter means no validation needed
- TypeScript will catch any code trying to pass format at compile time
- Aligns with "CSS-only" intent - no ambiguity
- Reduces API surface area

**Trade-offs**:
- ✅ **Gained**: Simpler API, no format validation, clearer intent
- ❌ **Lost**: Flexibility to add formats later (but not needed)
- ⚠️ **Risk**: If JavaScript format needed in future, would need to add parameter back

**Counter-Arguments**:
- **Argument**: Keeping parameter with validation would be safer
- **Response**: TypeScript provides compile-time safety, runtime validation unnecessary

---

### Decision 2: Update Tests vs Remove Tests

**Options Considered**:
1. Update JavaScript format tests to expect CSS format
2. Remove JavaScript format tests entirely
3. Keep JavaScript format tests but mark as skipped

**Decision**: Update tests where they validate real functionality, remove tests that only validate JavaScript format

**Rationale**:
- Tests validating token generation logic should be updated (still valuable)
- Tests only validating JavaScript format output should be removed (no longer relevant)
- Maintains test coverage for CSS format
- Removes tests for unused functionality

**Trade-offs**:
- ✅ **Gained**: Tests validate actual production behavior
- ❌ **Lost**: Test coverage for JavaScript format (intentional)
- ⚠️ **Risk**: Might remove tests that have value beyond format validation

**Counter-Arguments**:
- **Argument**: Keep all tests for historical reference
- **Response**: Git history preserves tests, no need to keep in active codebase

---

### Decision 3: Gradual Cleanup vs Big Bang

**Options Considered**:
1. Update all components and tests in single commit
2. Update components incrementally with tests after each
3. Update all components first, then update all tests

**Decision**: Update components incrementally with tests after each

**Rationale**:
- Easier to debug if issues arise
- Can validate each component works before moving to next
- Reduces risk of accumulating failures
- Aligns with systematic approach

**Trade-offs**:
- ✅ **Gained**: Lower risk, easier debugging, incremental validation
- ❌ **Lost**: More commits, takes longer
- ⚠️ **Risk**: Intermediate states might have some failing tests

**Counter-Arguments**:
- **Argument**: Big bang approach is faster
- **Response**: Risk of hard-to-debug failures outweighs speed benefit

---

## Implementation Order

### Phase 1: Core Component Cleanup

**Order of operations**:

1. **WebFormatGenerator** (highest impact)
   - Remove format parameter from constructor
   - Remove `outputFormat` property
   - Remove `formatJavaScriptConstant()` method
   - Remove all format conditionals
   - Update `formats` array to `['css']`
   - Run WebFormatGenerator tests, update as needed

2. **WebFileOrganizer** (depends on WebFormatGenerator)
   - Remove format parameter from `getFileName()`
   - Simplify to return CSS filename directly
   - Remove JavaScript import patterns
   - Update `validatePath()` to CSS-only
   - Run PathProviders tests, update as needed

3. **TokenFileGenerator** (uses WebFormatGenerator)
   - Remove `'css'` argument from constructor call
   - Verify no other changes needed
   - Run TokenFileGenerator tests, update as needed

### Phase 2: Test Suite Updates

**Order of operations**:

1. **TokenFileGenerator.test.ts** (Issue #019 - highest priority)
   - Update file extension expectations
   - Update content expectations
   - Verify all tests pass

2. **WebFormatGenerator tests**
   - Remove JavaScript format tests
   - Verify CSS format tests pass

3. **PathProviders.test.ts**
   - Update file path expectations
   - Remove JavaScript format validation tests

4. **BuildSystemIntegration.test.ts**
   - Remove JavaScript import pattern tests
   - Verify CSS import pattern tests pass

5. **BuildSystemCompatibility.test.ts**
   - Remove JavaScript format compatibility tests
   - Verify CSS format compatibility tests pass

### Phase 3: Documentation and Validation

**Order of operations**:

1. **Update code comments**
   - Search for "JavaScript" in comments
   - Update to reference CSS only
   - Remove format selection references

2. **Update generateTokenFiles.ts comment**
   - Change from `.web.js` to `.web.css`

3. **Final validation**
   - Run full test suite
   - Generate tokens and compare output
   - Run diagnostics on all files
   - Manual review of changes

---

## Validation Checklist

### Code Changes Validation

- [ ] WebFormatGenerator compiles without errors
- [ ] WebFileOrganizer compiles without errors
- [ ] TokenFileGenerator compiles without errors
- [ ] No TypeScript errors in any modified files
- [ ] No linting errors in any modified files

### Test Validation

- [ ] All WebFormatGenerator tests pass
- [ ] All PathProviders tests pass
- [ ] All TokenFileGenerator tests pass
- [ ] All BuildSystemIntegration tests pass
- [ ] All BuildSystemCompatibility tests pass
- [ ] Full test suite passes (`npm test`)

### Output Validation

- [ ] Generated CSS file is identical to pre-cleanup output
- [ ] CSS custom properties are valid
- [ ] :root selector is present
- [ ] No JavaScript files generated

### Documentation Validation

- [ ] All code comments updated
- [ ] No references to JavaScript format remain
- [ ] generateTokenFiles.ts comment updated

### Requirements Compliance

- [ ] Requirement 1: JavaScript format support removed ✓
- [ ] Requirement 2: WebFileOrganizer simplified to CSS-only ✓
- [ ] Requirement 3: Tests expect CSS format only ✓
- [ ] Requirement 4: Documentation reflects CSS-only approach ✓
- [ ] Requirement 5: CSS format functionality validated without regression ✓

---

## Rollback Plan

If issues arise during cleanup:

### Rollback Triggers

- Tests fail and can't be fixed quickly
- Generated CSS output differs from baseline
- TypeScript compilation errors can't be resolved
- Production token generation breaks

### Rollback Procedure

1. **Git revert**: `git revert <commit-hash>`
2. **Verify tests pass**: `npm test`
3. **Verify token generation works**: `npm run generate:tokens`
4. **Document issue**: Add to issues registry
5. **Investigate root cause**: Determine why cleanup failed
6. **Plan fix**: Update design if needed

### Prevention

- Commit after each phase completes
- Run full test suite before committing
- Validate token generation before committing
- Keep commits small and focused

---

## Success Metrics

This design is successful when:

1. ✅ All code changes compile without errors
2. ✅ All tests pass (100% pass rate)
3. ✅ Generated CSS output identical to pre-cleanup
4. ✅ ~350 lines of code removed
5. ✅ No JavaScript format references remain
6. ✅ Documentation accurately describes CSS-only approach
7. ✅ Issues #019 and #020 resolved

---

**Organization**: spec-design
**Scope**: web-format-cleanup
