# Design Document: Deprecated Component Names Removal

**Date**: January 7, 2026
**Spec**: 039 - Deprecated Component Names Removal
**Status**: Design Phase
**Dependencies**: None

---

## Overview

This design describes the systematic removal of deprecated component names (`dp-icon`, `dp-container`) from the DesignerPunk codebase. The removal follows a specific order to avoid test failures during the process: tests first, then production code, then schemas, then documentation.

The audit findings in `findings/deprecated-names-audit-findings.md` identified 28 references across 10 files that need modification.

---

## Architecture

### Removal Strategy

The removal follows a dependency-aware order to ensure tests pass at each step:

```
┌─────────────────────────────────────────┐
│  Phase 1: UPDATE TESTS                  │
│  - Update test assertions               │
│  - Update test comments                 │
│  - Update component name arrays         │
│  - Run tests to verify updates          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Phase 2: REMOVE PRODUCTION CODE        │
│  - Remove class definitions             │
│  - Remove safeDefine registrations      │
│  - Remove associated comments           │
│  - Run tests to verify removal          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Phase 3: UPDATE SCHEMAS                │
│  - Remove legacy_element fields         │
│  - Remove backward compatibility notes  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Phase 4: UPDATE DOCUMENTATION          │
│  - Remove Backward Compatibility sections│
│  - Remove legacy tag examples           │
│  - Remove platform notes about legacy   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Phase 5: VALIDATION                    │
│  - Run full test suite                  │
│  - Build browser bundle                 │
│  - Verify no deprecated names remain    │
└─────────────────────────────────────────┘
```

---

## Components and Interfaces

### Files to Modify

#### Production Code (1 file)

**`src/browser-entry.ts`**

Remove:
```typescript
// Legacy dp-icon tag requires a separate class (Web Components spec doesn't allow same class for multiple elements)
class DpIconElement extends IconBaseElement {}
safeDefine('dp-icon', DpIconElement);  // Legacy tag (backward compatibility)

// Legacy dp-container tag requires a separate class (Web Components spec doesn't allow same class for multiple elements)
class DpContainerElement extends ContainerBaseWeb {}
safeDefine('dp-container', DpContainerElement);  // Legacy tag (backward compatibility)
```

#### Test Files (3 files)

**`src/__tests__/browser-distribution/component-registration.test.ts`**

Updates:
- Remove assertions expecting `dp-icon` and `dp-container`
- Update comments from "seven custom elements" to accurate count
- Remove "dual registration" references

**`src/__tests__/browser-distribution/umd-bundle-loading.test.ts`**

Updates:
- Remove assertions expecting `dp-icon` and `dp-container` in bundle content

**`src/__tests__/browser-distribution/registration-idempotency.property.test.ts`**

Updates:
- Replace `dp-icon` and `dp-container` with `icon-base` and `container-base` in COMPONENT_NAMES array

#### Schema Files (2 files)

**`src/components/core/Icon-Base/Icon-Base.schema.yaml`**

Remove:
- `legacy_element: "<dp-icon>"` field
- `- Legacy <dp-icon> tag supported for backward compatibility` note

**`src/components/core/Container-Base/Container-Base.schema.yaml`**

Remove:
- `legacy_element: "<dp-container>"` field
- `- Legacy <dp-container> tag supported for backward compatibility` note

#### Documentation Files (2 files)

**`src/components/core/Icon-Base/README.md`**

Remove:
- Entire "Backward Compatibility" section

**`src/components/core/Container-Base/README.md`**

Remove:
- Entire "Backward Compatibility" section
- Platform note about legacy tag support

---

## Design Decisions

### Decision 1: Tests First Removal Order

**Options Considered**:
1. Remove production code first, then fix tests
2. Update tests first, then remove production code
3. Remove everything simultaneously

**Decision**: Update tests first, then remove production code

**Rationale**: 
Updating tests first ensures that when we remove the production code, the tests will pass immediately. If we removed production code first, tests would fail until we updated them, creating a broken intermediate state.

**Trade-offs**:
- ✅ **Gained**: Clean intermediate states, tests pass at each step
- ❌ **Lost**: Slightly more steps in the process

### Decision 2: Preserve CSS Custom Property Prefix

**Options Considered**:
1. Remove `--dp-*` prefix along with component names
2. Keep `--dp-*` prefix unchanged

**Decision**: Keep `--dp-*` prefix unchanged

**Rationale**: 
The `--dp-*` CSS custom property prefix is the DesignerPunk namespace for CSS variables and is actively used throughout the system. It's a different concern from component tag naming and should not be conflated with this removal.

**Trade-offs**:
- ✅ **Gained**: No disruption to CSS variable system
- ❌ **Lost**: None - these are separate concerns

### Decision 3: Preserve Historical References in Specs

**Options Considered**:
1. Update all references including spec documents
2. Preserve spec documents as historical record

**Decision**: Preserve spec documents as historical record

**Rationale**: 
Spec documents represent decisions made at a point in time. Modifying them would falsify history and make it harder to understand the evolution of the system.

**Trade-offs**:
- ✅ **Gained**: Accurate historical record, traceable decisions
- ❌ **Lost**: Some outdated references remain in historical docs

---

## Error Handling

### Potential Issues

1. **Test Failures During Removal**
   - Mitigation: Follow removal order (tests first)
   - Recovery: Revert changes if tests fail unexpectedly

2. **Build Failures**
   - Mitigation: Straightforward deletion, no complex refactoring
   - Recovery: Git revert if issues arise

3. **Missed References**
   - Mitigation: Comprehensive grep search performed during audit
   - Recovery: Additional grep search after removal to verify

---

## Testing Strategy

### Validation Approach

1. **After Test Updates**: Run targeted tests to verify updates work
2. **After Production Code Removal**: Run full test suite
3. **After All Changes**: 
   - Run full test suite
   - Build browser bundle
   - Grep for deprecated names to verify complete removal

### Success Criteria

- All tests pass
- Browser bundle builds successfully
- No references to `dp-icon` or `dp-container` in active code/tests/docs
- `--dp-*` CSS custom property prefix unchanged
