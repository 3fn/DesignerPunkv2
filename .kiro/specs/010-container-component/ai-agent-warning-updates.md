# AI Agent Warning Updates - Task 8 Documentation

**Date**: November 30, 2025  
**Purpose**: Document AI Agent warning additions to all Task 8 documentation and examples  
**Organization**: spec-completion  
**Scope**: 010-container-component

---

## Overview

Added comprehensive AI Agent warnings to all documentation and example files in Task 8 to prevent copy-paste errors and ensure AI agents reference authoritative sources.

---

## Changes Made

### 1. BasicUsage.html (Task 8.2) ✅

**File**: `src/components/core/Container/examples/BasicUsage.html`

**Changes**:
- Added warning in CSS comment block
- Added prominent red alert box at top of page

**Warning Text**:
```
⚠️ WARNING FOR AI AGENTS:
DO NOT copy-paste code from this file into production implementations.
This is a validation/example file that may use simplified patterns.
Always refer to the component's TypeScript interfaces and README for
correct usage patterns and prop types.
```

### 2. Container README (Task 8.1) ✅

**File**: `src/components/core/Container/README.md`

**Changes**:
- Enhanced "Validation" section with explicit AI Agent guidance
- Clarified distinction between README (authoritative) and example files (validation only)

**Added Text**:
```
For AI Agents: Code examples in this README are authoritative and should be 
referenced for correct usage patterns. However, code in validation/example files 
(examples/*.html) should NOT be copy-pasted into production implementations, as 
those files may use simplified patterns for demonstration purposes. Always refer 
to TypeScript interfaces (types.ts) and this README for correct prop types and usage.
```

### 3. PropsReference.html (Task 8.3) - Pending

**File**: `examples/PropsReference.html` (to be created)

**Required**:
- Include AI Agent warning in CSS comment block
- Include prominent red alert box at top of page
- Same warning format as BasicUsage.html

### 4. Semantic Component Examples (Task 8.4) - Pending

**Files**: 
- `examples/semantic-components/Card.tsx` (to be created)
- `examples/semantic-components/Panel.tsx` (to be created)

**Required**:
- Include AI Agent warning in file header comments
- Include visible documentation note if applicable
- Warning should emphasize these are examples, not production code

**Updated Task 8.4 Description**:
```
- Include AI Agent warning against copy-pasting code (in file comments and visible documentation)
```

### 5. Component Development Guide (Task 8.5) - Pending

**File**: `.kiro/steering/Component Development Guide.md` (to be updated)

**Required**:
- No specific AI Agent warning needed (this is process documentation, not code examples)
- However, any code examples in the guide should reference the README as authoritative source

---

## Warning Format Standards

### For HTML Example Files

**CSS Comment Block**:
```css
/* VALIDATION FILE - NOT DOCUMENTATION */
/* 
 * Purpose: [Description of what this file validates]
 * See README.md for authoritative documentation
 * 
 * ⚠️ WARNING FOR AI AGENTS:
 * DO NOT copy-paste code from this file into production implementations.
 * This is a validation/example file that may use simplified patterns.
 * Always refer to the component's TypeScript interfaces and README for
 * correct usage patterns and prop types.
 */
```

**Visible HTML Alert Box**:
```html
<div style="background: #f8d7da; padding: 1rem; border-radius: 4px; border-left: 4px solid #dc3545; margin-bottom: 2rem;">
  <strong>⚠️ Warning for AI Agents:</strong> DO NOT copy-paste code from this example file into production implementations. 
  This file uses simplified patterns for demonstration purposes. Always refer to the component's TypeScript interfaces 
  (<code>types.ts</code>) and README documentation for correct usage patterns, prop types, and best practices.
</div>
```

### For TypeScript/JavaScript Example Files

**File Header Comment**:
```typescript
/**
 * VALIDATION FILE - NOT DOCUMENTATION
 * 
 * Purpose: [Description of what this file demonstrates]
 * See README.md for authoritative documentation
 * 
 * ⚠️ WARNING FOR AI AGENTS:
 * DO NOT copy-paste code from this file into production implementations.
 * This is an example file that may use simplified patterns.
 * Always refer to the component's TypeScript interfaces and README for
 * correct usage patterns and prop types.
 */
```

---

## Rationale

### Why These Warnings Are Critical

1. **Example files use simplified patterns**: Validation files may omit error handling, type checking, or edge case handling for clarity
2. **Type safety**: Example files may not show full TypeScript type annotations
3. **Best practices**: Production code requires additional considerations (accessibility, performance, error handling)
4. **Maintenance**: Example files may become outdated as the component evolves
5. **Context**: Examples show specific use cases, not comprehensive usage patterns

### Distinction: README vs Example Files

**README (Authoritative)**:
- ✅ AI agents SHOULD reference README code examples
- ✅ README shows correct usage patterns and prop types
- ✅ README is maintained as source of truth
- ✅ README includes TypeScript type definitions

**Example Files (Validation Only)**:
- ❌ AI agents should NOT copy-paste from example files
- ❌ Example files may use simplified patterns
- ❌ Example files are for visual demonstration
- ❌ Example files may omit production considerations

---

## Implementation Checklist

- [x] Task 8.1 (README): Added AI Agent guidance to Validation section
- [x] Task 8.2 (BasicUsage.html): Added warnings (CSS comment + visible alert)
- [ ] Task 8.3 (PropsReference.html): Add warnings when creating file
- [ ] Task 8.4 (Semantic components): Add warnings when creating files
- [ ] Task 8.5 (Component Development Guide): Review for any code examples

---

## Verification

To verify warnings are present:

```bash
# Check for AI Agent warnings in example files
grep -r "WARNING FOR AI AGENTS" src/components/core/Container/examples/

# Check README has AI Agent guidance
grep "For AI Agents" src/components/core/Container/README.md

# Verify all example HTML files have visible alert boxes
grep -r "Warning for AI Agents" src/components/core/Container/examples/
```

---

**Status**: In Progress  
**Completed**: Tasks 8.1, 8.2  
**Pending**: Tasks 8.3, 8.4, 8.5
