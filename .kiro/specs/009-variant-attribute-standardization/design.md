# Design Document: Variant Attribute Standardization

**Date**: November 25, 2025
**Spec**: 009 - Variant Attribute Standardization
**Status**: Design Phase
**Dependencies**: 
- Spec 005 (ButtonCTA Component) - Component implementation uses `style` attribute

---

## Overview

This design outlines the approach for standardizing component variant attributes from `style` to `variant` across the DesignerPunk design system. The change is a straightforward find-and-replace refactoring that touches multiple layers: web component implementation, TypeScript types, documentation, examples, and tests.

**Key Principle**: This is a mechanical refactoring with no functional changes. The component behavior remains identical - only the attribute name changes.

---

## Architecture

### Affected Layers

```
┌─────────────────────────────────────────┐
│  Component Development Guide            │  ← Standards documentation
│  (Establishes variant as standard)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  ButtonCTA Component                    │
│  ┌─────────────────────────────────┐   │
│  │ Web Component (*.web.tsx)       │   │  ← Implementation
│  │ - getAttribute('variant')       │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ TypeScript Types (types.ts)     │   │  ← Type definitions
│  │ - variant: 'primary' | ...      │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Documentation & Examples               │
│  - README.md                            │  ← User-facing docs
│  - HTML Canary Examples                │  ← Validation examples
│  - TypeScript Examples                 │  ← Code examples
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Test Suite                             │
│  - Component Tests                     │  ← Test code
│  - Validation Scripts                  │  ← Automated validation
└─────────────────────────────────────────┘
```

### Change Propagation

The change flows top-down through the system:
1. **Standards**: Update Component Development Guide to establish `variant` as standard
2. **Implementation**: Update web component to read `variant` attribute
3. **Types**: Update TypeScript interfaces to use `variant` property
4. **Documentation**: Update all docs and examples to use `variant`
5. **Tests**: Update test code to use `variant` attribute

---

## Components and Interfaces

### ButtonCTA Web Component

**Current Implementation** (using `style`):
```typescript
// src/components/core/ButtonCTA/platforms/web/ButtonCTA.web.tsx
class ButtonCTA extends HTMLElement {
  connectedCallback() {
    const style = this.getAttribute('style') || 'primary';
    // Apply styling based on style attribute
  }
}
```

**New Implementation** (using `variant`):
```typescript
// src/components/core/ButtonCTA/platforms/web/ButtonCTA.web.tsx
class ButtonCTA extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute('variant') || 'primary';
    // Apply styling based on variant attribute
  }
}
```

### TypeScript Types

**Current Types** (using `style`):
```typescript
// src/components/core/ButtonCTA/types.ts
export interface ButtonCTAProps {
  label: string;
  style?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  disabled?: boolean;
}
```

**New Types** (using `variant`):
```typescript
// src/components/core/ButtonCTA/types.ts
export interface ButtonCTAProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  disabled?: boolean;
}
```

---

## Data Models

No data model changes required. This is purely an interface/attribute naming change.

---

## Error Handling

### Potential Issues

**Issue 1: Missed Occurrences**
- **Risk**: Some `style` references might be missed during find-replace
- **Mitigation**: Use grep/search to verify all occurrences are updated
- **Validation**: Run validation script to check HTML examples

**Issue 2: Test Failures**
- **Risk**: Tests might fail if not all test code is updated
- **Mitigation**: Run full test suite after changes
- **Validation**: All tests must pass before completion

**Issue 3: Documentation Drift**
- **Risk**: Documentation might become inconsistent if some files are missed
- **Mitigation**: Systematic review of all documentation files
- **Validation**: Manual review of README and Component Development Guide

---

## Testing Strategy

### Unit Tests

Update all ButtonCTA component tests to use `variant` attribute:

```typescript
// Before
it('should render with primary style', () => {
  const button = document.createElement('button-cta');
  button.setAttribute('style', 'primary');
  // assertions
});

// After
it('should render with primary variant', () => {
  const button = document.createElement('button-cta');
  button.setAttribute('variant', 'primary');
  // assertions
});
```

### HTML Canary Validation

Update all HTML canary examples and ensure validation script passes:

```html
<!-- Before -->
<button-cta label="Primary Action" style="primary"></button-cta>

<!-- After -->
<button-cta label="Primary Action" variant="primary"></button-cta>
```

Run validation script to verify:
```bash
node scripts/validate-examples.js
```

### Integration Testing

No integration tests required - this is a refactoring with no functional changes. Existing tests verify behavior remains unchanged.

---

## Design Decisions

### Decision 1: Clean Break (No Backward Compatibility)

**Options Considered**:
1. Support both `style` and `variant` with deprecation warning
2. Clean break - only support `variant`
3. Alias `style` to `variant` internally

**Decision**: Clean break - only support `variant`

**Rationale**: 
- No external users yet (only two components in early development)
- Simpler implementation (no dual attribute support code)
- Cleaner codebase going forward
- Avoids technical debt from supporting deprecated attributes

**Trade-offs**:
- ✅ **Gained**: Simpler code, no deprecation management, clean API
- ❌ **Lost**: No graceful migration period (not needed - no external users)
- ⚠️ **Risk**: Any internal prototypes break immediately (acceptable - easy to fix)

**Counter-Arguments**:
- **Argument**: "Supporting both temporarily would be safer"
- **Response**: With no external users and only two components, the overhead of dual support isn't justified. Clean break is simpler and we can fix any issues immediately.

### Decision 2: Update Component Development Guide

**Options Considered**:
1. Update guide after implementation
2. Update guide before implementation
3. Don't update guide (just fix components)

**Decision**: Update guide as part of implementation

**Rationale**:
- Establishes `variant` as the standard pattern for future components
- Provides clear guidance for developers
- Documents the rationale (IDE warnings, industry standards)
- Prevents future components from using `style` attribute

**Trade-offs**:
- ✅ **Gained**: Clear standards, prevents future mistakes, documents rationale
- ❌ **Lost**: Slightly more work (minimal - just documentation update)

### Decision 3: Systematic File-by-File Approach

**Options Considered**:
1. Global find-replace across all files
2. Systematic file-by-file updates with verification
3. Automated script to perform replacements

**Decision**: Systematic file-by-file updates with verification

**Rationale**:
- Ensures no unintended replacements (e.g., CSS `style` properties)
- Allows verification at each step
- Catches edge cases that automated replacement might miss
- Provides clear audit trail of changes

**Trade-offs**:
- ✅ **Gained**: Accuracy, verification, catches edge cases
- ❌ **Lost**: Takes slightly longer than global find-replace
- ⚠️ **Risk**: Human error in manual updates (mitigated by testing)

---

## Implementation Approach

### Phase 1: Standards Documentation
1. Update Component Development Guide
2. Add `variant` as standard attribute pattern
3. Document rationale (IDE warnings, industry standards)
4. Add anti-pattern warning against using `style` for variants

### Phase 2: ButtonCTA Component
1. Update web component implementation
2. Update TypeScript types
3. Update internal variable names for consistency
4. Verify no references to `style` attribute remain

### Phase 3: Documentation
1. Update ButtonCTA README
2. Update all HTML canary examples
3. Update TypeScript examples
4. Verify all documentation is consistent

### Phase 4: Tests
1. Update component test files
2. Update validation scripts if needed
3. Run full test suite
4. Verify all tests pass

### Phase 5: Icon Component (If Applicable)
1. Check if Icon component uses variant patterns
2. If yes, apply same updates as ButtonCTA
3. If no, document for future reference

---

## Migration Guidance

For any internal prototypes or examples using the old `style` attribute:

**Find-Replace Pattern**:
```
Find:    style="primary"
Replace: variant="primary"

Find:    style="secondary"
Replace: variant="secondary"

Find:    style="danger"
Replace: variant="danger"

Find:    style=
Replace: variant=
```

**Verification**:
```bash
# Search for any remaining style attribute usage
grep -r 'style="primary"' src/components/core/ButtonCTA/
grep -r 'style="secondary"' src/components/core/ButtonCTA/
grep -r 'style="danger"' src/components/core/ButtonCTA/
```

---

## Success Criteria

This design is successful when:

1. All ButtonCTA code uses `variant` attribute (verified by grep search)
2. All TypeScript types use `variant` property (verified by compilation)
3. All documentation uses `variant` attribute (verified by manual review)
4. All tests pass with `variant` attribute (verified by test suite)
5. Component Development Guide establishes `variant` as standard (verified by review)
6. No IDE warnings appear for attribute naming conflicts (verified manually)
