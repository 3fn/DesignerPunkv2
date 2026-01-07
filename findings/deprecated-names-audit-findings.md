# Deprecated Component Names Audit Findings

**Date**: January 7, 2026
**Spec**: 039 - Deprecated Component Names Removal
**Audit Type**: Code Audit (not test failure audit)
**Summary**: 2 deprecated component names identified across 10 files (excluding spec documents)

---

## Executive Summary

This audit catalogs all references to deprecated component names (`dp-icon`, `dp-container`) in the active codebase. These deprecated names were created for backward compatibility but serve zero customers.

**Key Finding**: The deprecated name infrastructure is well-contained and can be cleanly removed with minimal risk.

| Category | Files Affected | References | Removal Complexity |
|----------|---------------|------------|-------------------|
| Production Code | 1 | 4 lines | Low |
| Component Schemas | 2 | 2 fields | Low |
| Component READMEs | 2 | 4 sections | Low |
| Test Files | 3 | 18 assertions | Medium |
| **Total** | **10** | **28** | **Low-Medium** |

---

## Detailed Reference Inventory

### Category 1: Production Code

#### File: `src/browser-entry.ts`

**Impact**: Core browser bundle entry point
**Removal Complexity**: Low

| Line | Reference | Action |
|------|-----------|--------|
| 94-95 | `// Legacy dp-icon tag requires a separate class...` | Remove comment |
| 96 | `class DpIconElement extends IconBaseElement {}` | Remove class |
| 97 | `safeDefine('dp-icon', DpIconElement);  // Legacy tag (backward compatibility)` | Remove registration |
| 101-102 | `// Legacy dp-container tag requires a separate class...` | Remove comment |
| 103 | `class DpContainerElement extends ContainerBaseWeb {}` | Remove class |
| 104 | `safeDefine('dp-container', DpContainerElement);  // Legacy tag (backward compatibility)` | Remove registration |

**Code to Remove**:
```typescript
// Legacy dp-icon tag requires a separate class (Web Components spec doesn't allow same class for multiple elements)
class DpIconElement extends IconBaseElement {}
safeDefine('dp-icon', DpIconElement);  // Legacy tag (backward compatibility)

// Legacy dp-container tag requires a separate class (Web Components spec doesn't allow same class for multiple elements)
class DpContainerElement extends ContainerBaseWeb {}
safeDefine('dp-container', DpContainerElement);  // Legacy tag (backward compatibility)
```

**Recommendation**: Remove - Clean deletion of 6 lines

---

### Category 2: Component Schemas

#### File: `src/components/core/Icon-Base/Icon-Base.schema.yaml`

**Impact**: Component schema documentation
**Removal Complexity**: Low

| Line | Reference | Action |
|------|-----------|--------|
| 250 | `legacy_element: "<dp-icon>"` | Remove field |
| 258 | `- Legacy <dp-icon> tag supported for backward compatibility` | Remove note |

**Recommendation**: Remove - Delete `legacy_element` field and related note

---

#### File: `src/components/core/Container-Base/Container-Base.schema.yaml`

**Impact**: Component schema documentation
**Removal Complexity**: Low

| Line | Reference | Action |
|------|-----------|--------|
| 332 | `legacy_element: "<dp-container>"` | Remove field |
| 339 | `- Legacy <dp-container> tag supported for backward compatibility` | Remove note |

**Recommendation**: Remove - Delete `legacy_element` field and related note

---

### Category 3: Component Documentation

#### File: `src/components/core/Icon-Base/README.md`

**Impact**: Developer documentation
**Removal Complexity**: Low

| Section | Reference | Action |
|---------|-----------|--------|
| Line 163-165 | Legacy HTML tag example | Remove example |
| "Backward Compatibility" section | Entire section about legacy imports and `<dp-icon>` tag | Remove section |

**Content to Remove**:
```markdown
## Backward Compatibility

For migration from the legacy `Icon` component:

\`\`\`typescript
// Legacy imports still work
import { Icon, createIcon, IconName, IconSize, iconSizes } from '@designerpunk/components';

// Legacy HTML tag still works
<dp-icon name="arrow-right" size="24"></dp-icon>
\`\`\`
```

**Recommendation**: Remove - Delete entire "Backward Compatibility" section

---

#### File: `src/components/core/Container-Base/README.md`

**Impact**: Developer documentation
**Removal Complexity**: Low

| Section | Reference | Action |
|---------|-----------|--------|
| Line 215 | Platform note about legacy tag | Remove note |
| Line 259-267 | "Backward Compatibility" section | Remove section |

**Content to Remove**:
```markdown
## Backward Compatibility

The legacy `<dp-container>` tag continues to work for backward compatibility. New implementations should use `<container-base>` following Stemma System naming conventions.

\`\`\`html
<!-- Legacy (still works) -->
<dp-container padding="200">Content</dp-container>

<!-- New Stemma System naming (recommended) -->
<container-base padding="200">Content</container-base>
\`\`\`
```

**Recommendation**: Remove - Delete "Backward Compatibility" section and platform note

---

### Category 4: Test Files

#### File: `src/__tests__/browser-distribution/component-registration.test.ts`

**Impact**: Browser distribution tests
**Removal Complexity**: Medium (requires updating test expectations)

| Line | Reference | Action |
|------|-----------|--------|
| 46 | `expect(bundleContent).toContain('dp-icon');` | Remove assertion |
| 48 | `expect(bundleContent).toContain('dp-container');` | Remove assertion |
| 54 | Comment: `// Includes dual registration for Icon (dp-icon + icon-base)...` | Update comment |
| 59 | `expect(bundleContent).toMatch(/safeDefine\s*\(\s*['"]dp-icon['"]/);` | Remove assertion |
| 61 | `expect(bundleContent).toMatch(/safeDefine\s*\(\s*['"]dp-container['"]/);` | Remove assertion |
| 135 | Comment: `// Includes dual registration for Icon (dp-icon + icon-base)...` | Update comment |
| 139 | `expect(registeredElements.has('dp-icon')).toBe(true);` | Remove assertion |
| 141 | `expect(registeredElements.has('dp-container')).toBe(true);` | Remove assertion |
| 183 | Comment: `// Includes dual registration for Icon (dp-icon + icon-base)...` | Update comment |
| 189 | `expect(content).toContain("safeDefine('dp-icon', IconBaseElement)");` | Remove assertion |
| 191 | `expect(content).toContain("safeDefine('dp-container', ContainerBaseWeb)");` | Remove assertion |

**Test Updates Required**:
1. Remove 8 assertions expecting deprecated names
2. Update 3 comments referencing "dual registration" and "seven custom elements"
3. Update test descriptions from "seven custom elements" to "five custom elements" (or appropriate count)

**Recommendation**: Update tests - Remove deprecated name assertions, update comments and counts

---

#### File: `src/__tests__/browser-distribution/umd-bundle-loading.test.ts`

**Impact**: UMD bundle loading tests
**Removal Complexity**: Low

| Line | Reference | Action |
|------|-----------|--------|
| 130 | `expect(bundleContent).toContain('dp-icon');` | Remove assertion |
| 131 | `expect(bundleContent).toContain('dp-container');` | Remove assertion |

**Recommendation**: Update tests - Remove 2 assertions

---

#### File: `src/__tests__/browser-distribution/registration-idempotency.property.test.ts`

**Impact**: Property-based tests for registration idempotency
**Removal Complexity**: Medium

| Line | Reference | Action |
|------|-----------|--------|
| 42 | `'dp-icon',` in COMPONENT_NAMES array | Remove from array |
| 43 | `'dp-container',` in COMPONENT_NAMES array | Remove from array |

**Code to Update**:
```typescript
// Before
const COMPONENT_NAMES = [
  'input-text-base',
  'button-cta',
  'dp-icon',
  'dp-container',
];

// After
const COMPONENT_NAMES = [
  'input-text-base',
  'button-cta',
  'icon-base',
  'container-base',
];
```

**Recommendation**: Update tests - Replace deprecated names with current names in COMPONENT_NAMES array

---

### Category 5: Steering Documentation (NO ACTION)

#### File: `.kiro/steering/platform-implementation-guidelines.md`

**Reference**: `--dp-*` CSS custom property prefix

**Assessment**: This is the DesignerPunk namespace for CSS custom properties, NOT deprecated component names. The `--dp-` prefix for CSS variables is correct and actively used.

**Recommendation**: NO ACTION - This is a different concern (CSS variable naming, not component tag naming)

---

### Category 6: Spec Documents (NO ACTION - Historical)

Multiple spec documents reference deprecated names as historical record:
- `.kiro/specs/028-web-component-browser-distribution/design-outline.md`
- `.kiro/specs/028-web-component-browser-distribution/requirements.md`
- `.kiro/specs/028-web-component-browser-distribution/design.md`
- `.kiro/specs/cross-platform-build-system/completion/task-5.3-completion.md`
- `.kiro/specs/cross-platform-build-system/completion/task-5-completion.md`

**Recommendation**: NO ACTION - Preserve as historical record per design-outline decision

---

## Impact Assessment

### Bundle Size Impact

**Current State**: Browser bundle includes:
- 2 extra class definitions (`DpIconElement`, `DpContainerElement`)
- 2 extra `safeDefine()` calls
- Associated comments

**Expected Reduction**: ~200-300 bytes (minified) - minimal but measurable

### Test Suite Impact

**Current State**: 18 test assertions validate deprecated name support
**After Removal**: Tests will need updating but will be simpler and more focused

### Documentation Impact

**Current State**: 2 README files have "Backward Compatibility" sections
**After Removal**: Cleaner documentation without legacy cruft

---

## Removal Order (Dependencies Considered)

The removal must follow this order to avoid test failures during the process:

### Phase 1: Update Tests First
1. `registration-idempotency.property.test.ts` - Update COMPONENT_NAMES array
2. `component-registration.test.ts` - Remove deprecated assertions, update comments
3. `umd-bundle-loading.test.ts` - Remove deprecated assertions

### Phase 2: Remove Production Code
4. `src/browser-entry.ts` - Remove class definitions and registrations

### Phase 3: Update Schemas
5. `Icon-Base.schema.yaml` - Remove `legacy_element` field and note
6. `Container-Base.schema.yaml` - Remove `legacy_element` field and note

### Phase 4: Update Documentation
7. `Icon-Base/README.md` - Remove "Backward Compatibility" section
8. `Container-Base/README.md` - Remove "Backward Compatibility" section and platform note

### Phase 5: Validation
9. Run full test suite to confirm all tests pass
10. Build browser bundle to confirm no errors
11. Verify bundle no longer contains deprecated names

---

## Risk Assessment

### Risk 1: Hidden Dependencies
**Risk Level**: Low
**Mitigation**: Comprehensive grep search performed; no hidden references found outside documented locations

### Risk 2: Test Failures During Removal
**Risk Level**: Low
**Mitigation**: Update tests before removing code (Phase 1 before Phase 2)

### Risk 3: Build Failures
**Risk Level**: Very Low
**Mitigation**: Removal is straightforward deletion; no complex refactoring required

### Risk 4: Documentation Inconsistency
**Risk Level**: Low
**Mitigation**: All documentation locations identified and included in removal plan

---

## Recommendations Summary

| Category | Recommendation | Priority |
|----------|---------------|----------|
| Production Code | Remove | High |
| Component Schemas | Remove | Medium |
| Component READMEs | Remove | Medium |
| Test Files | Update | High (do first) |
| Steering Docs (`--dp-*`) | NO ACTION | N/A |
| Spec Documents | NO ACTION (historical) | N/A |

---

## Success Criteria

After implementation:
- [ ] No references to `dp-icon` in active code/tests/docs (excluding specs)
- [ ] No references to `dp-container` in active code/tests/docs (excluding specs)
- [ ] All tests pass
- [ ] Browser bundle builds successfully
- [ ] Bundle does not contain deprecated names (verified by grep)
- [ ] `--dp-*` CSS custom property prefix unchanged

---

## Next Steps

1. **Human Confirmation**: Review this findings document
2. **Create Implementation Tasks**: Based on confirmed findings
3. **Execute Removal**: Follow the removal order specified above
4. **Validate**: Run full test suite and verify bundle

---

**Status**: Ready for human confirmation
