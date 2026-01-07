# Spec 039: Deprecated Component Names Removal - Design Outline

**Date**: January 7, 2026
**Status**: Draft
**Organization**: spec-guide
**Scope**: 039-deprecated-component-names-removal

---

## Problem Statement

The DesignerPunk system currently maintains backward compatibility infrastructure for deprecated component names (`dp-icon`, `dp-container`) that serve **zero customers**. This creates unnecessary burden:

1. **Technical debt with zero ROI** - Maintaining backward compatibility for non-existent users
2. **Cognitive load** - Developers must understand and navigate around legacy naming
3. **Test complexity** - Tests specifically validate deprecated name support
4. **Documentation noise** - README files explain legacy tags that shouldn't be used
5. **Build overhead** - Extra class definitions and registrations in browser bundle
6. **Architectural contradiction** - Carrying dead weight contradicts True Native philosophy of clarity and intentionality

### Current State Analysis (January 7, 2026)

**Deprecated Component Names Identified:**

| Deprecated Name | Current Name | Location |
|-----------------|--------------|----------|
| `<dp-icon>` | `<icon-base>` | Web Component registration |
| `<dp-container>` | `<container-base>` | Web Component registration |

**Infrastructure Supporting Deprecated Names:**

1. **Browser Entry (`src/browser-entry.ts`)**:
   - `DpIconElement` class extending `IconBaseElement`
   - `DpContainerElement` class extending `ContainerBaseWeb`
   - `safeDefine('dp-icon', DpIconElement)` registration
   - `safeDefine('dp-container', DpContainerElement)` registration

2. **Component Schemas**:
   - `Icon-Base.schema.yaml`: `legacy_element: "<dp-icon>"`
   - `Container-Base.schema.yaml`: `legacy_element: "<dp-container>"`

3. **Component READMEs**:
   - `Icon-Base/README.md`: Legacy tag documentation
   - `Container-Base/README.md`: Legacy tag documentation and examples

4. **Tests**:
   - `component-registration.test.ts`: Tests for `dp-icon` and `dp-container` registration
   - `umd-bundle-loading.test.ts`: Tests for deprecated names in bundle
   - `registration-idempotency.property.test.ts`: Includes deprecated names in element list

5. **Steering Documentation**:
   - `platform-implementation-guidelines.md`: References `--dp-*` CSS custom property prefix (NOTE: This is a different concern - CSS variable naming, not component naming)

**Exclusions (Historical References to Preserve):**
- Spec documents in `.kiro/specs/` - Historical record of decisions
- Completion documents - Historical record of work done

---

## Goals

### Primary Goals

1. **Comprehensive Audit** - Identify all locations where deprecated names exist
2. **Impact Assessment** - Understand what breaks when deprecated names are removed
3. **Clean Removal Plan** - Systematic approach to remove all deprecated name support
4. **Zero Customer Impact** - Confirm no customers are affected (already stated: zero customers)

### Secondary Goals

1. **Reduce Bundle Size** - Remove unnecessary class definitions
2. **Simplify Tests** - Remove tests for deprecated functionality
3. **Clean Documentation** - Remove legacy references from READMEs
4. **Establish Precedent** - Document approach for future deprecation removals

---

## Scope

### Audit-First Approach

**This spec follows the audit methodology** - diagnosis before treatment.

**Phase 1: Audit** - Catalog all deprecated name references
**Phase 2: Findings** - Document impact and removal plan
**Phase 3: Confirmation** - Human review before implementation
**Phase 4: Implementation** - Execute removal (separate tasks)

### In Scope

1. **Deprecated Component Tag Names**:
   - `dp-icon` → Remove (use `icon-base`)
   - `dp-container` → Remove (use `container-base`)

2. **Supporting Infrastructure**:
   - Browser entry class definitions
   - Browser entry registrations
   - Schema `legacy_element` fields
   - README legacy documentation
   - Test assertions for deprecated names

3. **Documentation Updates**:
   - Remove legacy tag examples from READMEs
   - Update any migration guides (if they exist)

### Out of Scope

1. **CSS Custom Property Prefix (`--dp-*`)** - This is a different naming concern (token variables, not component tags). The `--dp-` prefix for CSS custom properties is the established DesignerPunk namespace and should NOT be removed.

2. **Spec Documents** - Historical references in `.kiro/specs/` are preserved as historical record.

3. **Component Renaming** - Not renaming any current components, just removing deprecated aliases.

4. **Breaking Changes for Customers** - N/A (zero customers using deprecated names).

---

## Key Decisions

### Decision 1: Audit-First, Then Remove

**Approach**: Complete audit before any code changes

**Rationale**:
- Follows established audit methodology (Spec 029 pattern)
- Ensures nothing is missed
- Enables informed decisions about edge cases
- Separates diagnosis from treatment

### Decision 2: Preserve Historical References in Specs

**Approach**: Do NOT modify spec documents that reference deprecated names

**Rationale**:
- Specs are historical record of decisions made at the time
- Modifying specs would falsify history
- Future readers should understand the evolution
- Only active code and documentation should be updated

### Decision 3: CSS Custom Property Prefix is NOT Deprecated

**Approach**: The `--dp-*` CSS custom property prefix is NOT part of this removal

**Rationale**:
- `--dp-` is the DesignerPunk namespace for CSS variables
- This is different from component tag naming
- CSS variables are actively used and correct
- Only component tag aliases (`dp-icon`, `dp-container`) are deprecated

### Decision 4: Clean Removal (No Deprecation Warnings)

**Approach**: Remove deprecated names completely, no deprecation warnings

**Rationale**:
- Zero customers using deprecated names
- No migration period needed
- Deprecation warnings would add complexity for no benefit
- Clean removal is simpler and cleaner

---

## Architecture

### Audit Workflow

```
┌─────────────────────────────────────────┐
│  1. AUDIT (Catalog All References)      │
│  - Search codebase for deprecated names │
│  - Catalog each reference location      │
│  - Categorize: code / test / docs       │
│  - Identify dependencies                │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  2. FINDINGS DOCUMENT                   │
│  - Complete reference inventory         │
│  - Impact assessment per location       │
│  - Removal order (dependencies)         │
│  - Risk assessment                      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  3. HUMAN CONFIRMATION                  │
│  - Review findings                      │
│  - Confirm removal approach             │
│  - Approve implementation plan          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  4. IMPLEMENTATION                      │
│  - Remove browser entry registrations   │
│  - Update schemas                       │
│  - Update READMEs                       │
│  - Update tests                         │
│  - Validate all tests pass              │
└─────────────────────────────────────────┘
```

### Reference Inventory (Initial Findings)

**Category 1: Browser Entry (Production Code)**
| File | Reference | Action |
|------|-----------|--------|
| `src/browser-entry.ts` | `class DpIconElement extends IconBaseElement {}` | Remove |
| `src/browser-entry.ts` | `safeDefine('dp-icon', DpIconElement)` | Remove |
| `src/browser-entry.ts` | `class DpContainerElement extends ContainerBaseWeb {}` | Remove |
| `src/browser-entry.ts` | `safeDefine('dp-container', DpContainerElement)` | Remove |

**Category 2: Component Schemas**
| File | Reference | Action |
|------|-----------|--------|
| `Icon-Base.schema.yaml` | `legacy_element: "<dp-icon>"` | Remove field |
| `Container-Base.schema.yaml` | `legacy_element: "<dp-container>"` | Remove field |

**Category 3: Component Documentation**
| File | Reference | Action |
|------|-----------|--------|
| `Icon-Base/README.md` | Legacy tag example and explanation | Remove section |
| `Container-Base/README.md` | Legacy tag example and explanation | Remove section |

**Category 4: Tests**
| File | Reference | Action |
|------|-----------|--------|
| `component-registration.test.ts` | Multiple `dp-icon` and `dp-container` assertions | Update tests |
| `umd-bundle-loading.test.ts` | `dp-icon` and `dp-container` bundle checks | Update tests |
| `registration-idempotency.property.test.ts` | `dp-icon` and `dp-container` in element list | Update tests |

**Category 5: Steering Documentation**
| File | Reference | Action |
|------|-----------|--------|
| `platform-implementation-guidelines.md` | `--dp-*` CSS prefix | NO ACTION (different concern) |

**Category 6: Spec Documents (Historical - NO ACTION)**
| File | Reference | Action |
|------|-----------|--------|
| Various specs in `.kiro/specs/` | Historical references | PRESERVE (historical record) |

---

## Implementation Strategy

### Phase 1: Audit (This Design-Outline)

**Goal**: Complete inventory of all deprecated name references

**Tasks:**
1. ✅ Search codebase for `dp-icon` and `dp-container`
2. ✅ Categorize references by type (code/test/docs/specs)
3. ✅ Identify dependencies between references
4. ✅ Document findings in this design-outline

### Phase 2: Findings Document

**Goal**: Create detailed removal plan

**Deliverable**: `findings/deprecated-names-audit-findings.md`

Contents:
- Complete reference inventory with file paths and line numbers
- Impact assessment for each removal
- Recommended removal order
- Risk assessment

### Phase 3: Human Confirmation

**Goal**: Review and approve removal plan

**Confirmation Points:**
- Is the inventory complete?
- Is the removal order correct?
- Any edge cases to consider?
- Approve proceeding to implementation

### Phase 4: Implementation

**Goal**: Execute removal in correct order

**Removal Order** (dependencies considered):
1. **Tests First** - Update tests to not expect deprecated names
2. **Browser Entry** - Remove class definitions and registrations
3. **Schemas** - Remove `legacy_element` fields
4. **Documentation** - Remove legacy sections from READMEs
5. **Validation** - Run full test suite, confirm all pass

---

## Success Criteria

### Audit Phase Success
- All deprecated name references cataloged
- References categorized by type
- Dependencies identified
- Findings document created

### Implementation Success
- All deprecated name registrations removed from browser entry
- All deprecated name tests updated or removed
- All deprecated name documentation removed
- All tests pass
- Bundle size reduced (measurable)
- No references to `dp-icon` or `dp-container` in active code/tests/docs

### Overall Success
- Zero deprecated component name support in codebase
- Historical references in specs preserved
- CSS custom property prefix (`--dp-*`) unchanged
- Clean, simplified codebase

---

## Risks and Mitigations

### Risk 1: Hidden Dependencies

**Risk**: There may be references not found by grep search

**Mitigation:**
- Use multiple search patterns
- Check build output for deprecated names
- Run tests to catch any missed references
- Manual review of browser entry and related files

### Risk 2: Test Failures After Removal

**Risk**: Tests may fail in unexpected ways after removal

**Mitigation:**
- Update tests before removing code
- Run tests after each removal step
- Have clear rollback plan (git revert)

### Risk 3: Documentation Inconsistency

**Risk**: Some documentation may still reference deprecated names

**Mitigation:**
- Comprehensive search of all markdown files
- Exclude spec documents (historical)
- Review all component READMEs

---

## Dependencies

### Depends On
- ✅ No active customers using deprecated names (confirmed by Peter)
- ✅ Current component names (`icon-base`, `container-base`) are stable

### Enables
- Cleaner codebase
- Reduced bundle size
- Simplified testing
- Precedent for future deprecation removals

---

## Open Questions

### Questions for Confirmation Phase

1. **Are there any other deprecated names?**
   - Initial search found only `dp-icon` and `dp-container`
   - Should we search for other `dp-*` patterns?

2. **Should we measure bundle size reduction?**
   - Before/after comparison would quantify benefit
   - Is this worth the effort?

3. **Any external documentation to update?**
   - Are there external docs, wikis, or guides that reference deprecated names?

---

## References

- **Audit Methodology**: `.kiro/steering/Test-Failure-Audit-Methodology.md`
- **Browser Entry**: `src/browser-entry.ts`
- **Icon-Base Schema**: `src/components/core/Icon-Base/Icon-Base.schema.yaml`
- **Container-Base Schema**: `src/components/core/Container-Base/Container-Base.schema.yaml`

---

**Status**: Ready for review and confirmation to proceed with findings document
