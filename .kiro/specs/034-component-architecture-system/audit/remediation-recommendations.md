# Remediation Recommendations for Stemma System Compliance

**Date**: 2026-01-01
**Purpose**: Document specific remediation steps for each component with effort estimates
**Organization**: spec-validation
**Scope**: 034-component-architecture-system
**Task**: 2.4 Create remediation recommendations
**Requirements**: R3

---

## Executive Summary

This document provides detailed remediation recommendations for migrating existing components (TextInputField, ButtonCTA, Container, Icon) to Stemma System compliance. Recommendations are aligned with the approved priorities from Task 2.3 Human-AI Checkpoint:

- **Approach**: Test-first methodology (TextInputField first, then apply lessons to others)
- **Scope**: Full remediation of all 4 components
- **Deliverables**: Renamed components, YAML schemas, formalized contracts, updated tests, demo page updates

**Total Estimated Effort**: 16-22 hours across Tasks 4 and 6

---

## Remediation Strategy Overview

### Test-First Approach

```
Phase 1: Test Migration (Task 4)
├── TextInputField → Input-Text-Base
├── Validate migration pattern
├── Capture lessons learned
└── Document reusable checklist

Phase 2: Apply Lessons (Task 6)
├── ButtonCTA → Button-CTA-Primary
├── Container → Container-Layout-Base
├── Icon → Icon-Feather-Base
└── Apply validated patterns from Phase 1
```

### Migration Checklist (Per Component)

Each component migration includes:

1. [ ] Human-AI check-in to align on approach
2. [ ] Rename component files/directories
3. [ ] Update web element registration
4. [ ] Create YAML schema with formal contracts
5. [ ] Update/migrate tests
6. [ ] Update demo page consumer
7. [ ] Validate cross-platform consistency
8. [ ] Document migration in completion doc

---

## Component 1: TextInputField → Input-Text-Base

**Task**: 4 (Test Migration)
**Priority**: High (validates pattern for subsequent migrations)
**Complexity**: High (most complex component)

### Findings Addressed

| Finding ID | Description | Remediation |
|------------|-------------|-------------|
| F1.3 | Name doesn't follow pattern | Rename to `Input-Text-Base` |
| F1.4 | Web element prefix inconsistent | Change `<text-input-field>` to `<input-text-base>` |
| F2.4 | 9 implicit contracts | Formalize in YAML schema |
| F2.5 | No YAML schema | Create `Input-Text-Base.schema.yaml` |

### Remediation Steps

#### Step 4.1: Rename Component Files/Directories

**Current Structure**:
```
src/components/core/TextInputField/
├── TextInputField.ts
├── TextInputField.styles.ts
├── stateManagement.ts
├── index.ts
└── __tests__/
    └── *.test.ts
```

**Target Structure**:
```
src/components/core/Input-Text-Base/
├── Input-Text-Base.ts
├── Input-Text-Base.styles.ts
├── stateManagement.ts
├── index.ts
├── Input-Text-Base.schema.yaml
└── __tests__/
    └── *.test.ts
```

**Actions**:
1. Rename directory: `TextInputField` → `Input-Text-Base`
2. Rename main file: `TextInputField.ts` → `Input-Text-Base.ts`
3. Rename styles file: `TextInputField.styles.ts` → `Input-Text-Base.styles.ts`
4. Update all internal imports
5. Update index.ts exports

**Effort**: 1-2 hours

#### Step 4.2: Update Web Element Registration

**Current**:
```typescript
customElements.define('text-input-field', TextInputField);
```

**Target**:
```typescript
customElements.define('input-text-base', InputTextBase);
```

**Actions**:
1. Update element registration in main component file
2. Update class name from `TextInputField` to `InputTextBase`
3. Update any internal references to element name

**Effort**: 30 minutes

#### Step 4.3: Create YAML Schema

**Target File**: `src/components/core/Input-Text-Base/Input-Text-Base.schema.yaml`

**Schema Content**:
```yaml
name: Input-Text-Base
type: primitive
family: FormInputs
version: 1.0.0
readiness: production-ready

description: |
  Base text input component providing foundational text input behaviors.
  Serves as the primitive base for semantic text input variants.

behaviors:
  - focusable
  - validatable
  - float-label

properties:
  id:
    type: string
    required: true
    description: Unique identifier for accessibility association
  label:
    type: string
    required: true
    description: Label text displayed above input
  value:
    type: string
    required: true
    default: ""
    description: Current input value
  onChange:
    type: function
    required: true
    description: Callback when value changes
  type:
    type: enum
    values: [text, email, password, tel, url]
    required: false
    default: text
    description: Input type for keyboard and validation hints
  placeholder:
    type: string
    required: false
    description: Placeholder text when empty
  helperText:
    type: string
    required: false
    description: Helper text below input
  errorMessage:
    type: string
    required: false
    description: Error message when validation fails
  isSuccess:
    type: boolean
    required: false
    default: false
    description: Success state indicator
  showInfoIcon:
    type: boolean
    required: false
    default: false
    description: Show info icon in trailing position
  readOnly:
    type: boolean
    required: false
    default: false
    description: Prevents editing but allows selection
  required:
    type: boolean
    required: false
    default: false
    description: Marks field as required
  maxLength:
    type: number
    required: false
    description: Maximum character length
  autocomplete:
    type: string
    required: false
    description: Autocomplete hint for browsers
  disabled:
    type: boolean
    required: false
    default: false
    description: Disables all interaction

contracts:
  - name: focusable
    description: Can receive keyboard focus
    platforms: [web, ios, android]
    required: true
  - name: float_label_animation
    description: Label animates from placeholder to floating position on focus
    platforms: [web, ios, android]
    required: true
  - name: validates_on_blur
    description: Validation triggers when focus leaves the field
    platforms: [web, ios, android]
    required: true
  - name: error_state_display
    description: Shows error message and error styling when validation fails
    platforms: [web, ios, android]
    required: true
  - name: success_state_display
    description: Shows success styling when isSuccess is true
    platforms: [web, ios, android]
    required: true
  - name: disabled_state
    description: Prevents all interaction when disabled is true
    platforms: [web, ios, android]
    required: true
  - name: trailing_icon_display
    description: Shows contextual trailing icons based on state
    platforms: [web, ios, android]
    required: true
  - name: focus_ring
    description: WCAG 2.4.7 focus visible indicator
    platforms: [web, ios, android]
    required: true
  - name: reduced_motion_support
    description: Respects prefers-reduced-motion setting
    platforms: [web, ios, android]
    required: true

tokens:
  typography:
    - typography.labelMd.*
    - typography.labelMdFloat.*
    - typography.input.*
    - typography.caption.*
  color:
    - color.text.default
    - color.text.muted
    - color.primary
    - color.error.strong
    - color.success.strong
    - color.border
    - color.background
  spacing:
    - space.inset.100
    - space.grouped.tight
    - space.grouped.minimal
  motion:
    - motion.floatLabel.*
    - motion.focusTransition.*
  border:
    - border.default
    - radius.150
  icon:
    - icon.size100
  accessibility:
    - accessibility.tapArea.recommended
    - accessibility.focus.*
  blend:
    - blend.focusSaturate
    - blend.disabledDesaturate

platforms:
  web:
    element: input-text-base
    implementation: Web Component
  ios:
    implementation: SwiftUI View
  android:
    implementation: Jetpack Compose
```

**Effort**: 1-2 hours

#### Step 4.4: Update/Migrate Tests

**Actions**:
1. Update test file imports to use new component name
2. Update test descriptions to reference `Input-Text-Base`
3. Update any element selectors from `text-input-field` to `input-text-base`
4. Verify all existing tests pass with renamed component
5. Add schema validation test (optional)

**Effort**: 1-2 hours

#### Step 4.5: Update Demo Page

**Current**:
```html
<text-input-field
  id="email"
  label="Email"
  value="${email}"
  @change="${handleChange}"
></text-input-field>
```

**Target**:
```html
<input-text-base
  id="email"
  label="Email"
  value="${email}"
  @change="${handleChange}"
></input-text-base>
```

**Actions**:
1. Update all `<text-input-field>` elements to `<input-text-base>`
2. Update any JavaScript references to the component
3. Verify demo page functionality

**Effort**: 30 minutes - 1 hour

#### Step 4.6: Update iOS Implementation

**Actions**:
1. Rename `TextInputField.swift` → `InputTextBase.swift`
2. Update struct name from `TextInputField` to `InputTextBase`
3. Update preview provider
4. Update any internal references

**Effort**: 30 minutes - 1 hour

#### Step 4.7: Update Android Implementation

**Actions**:
1. Rename `TextInputField.kt` → `InputTextBase.kt`
2. Update composable function name
3. Update preview annotations
4. Update any internal references

**Effort**: 30 minutes - 1 hour

#### Step 4.8: Capture Lessons Learned

**Document**:
- What worked well in the migration
- Challenges encountered and solutions
- Reusable patterns for subsequent migrations
- Checklist refinements for Task 6

**Effort**: 30 minutes

### Total Effort: TextInputField Migration

| Step | Description | Effort |
|------|-------------|--------|
| 4.1 | Rename files/directories | 1-2 hours |
| 4.2 | Update web element registration | 30 minutes |
| 4.3 | Create YAML schema | 1-2 hours |
| 4.4 | Update/migrate tests | 1-2 hours |
| 4.5 | Update demo page | 30 min - 1 hour |
| 4.6 | Update iOS implementation | 30 min - 1 hour |
| 4.7 | Update Android implementation | 30 min - 1 hour |
| 4.8 | Capture lessons learned | 30 minutes |
| **Total** | | **6-10 hours** |

---

## Component 2: ButtonCTA → Button-CTA-Primary

**Task**: 6.1 (Apply Lessons)
**Priority**: High
**Complexity**: Medium

### Findings Addressed

| Finding ID | Description | Remediation |
|------------|-------------|-------------|
| F1.1 | Name doesn't follow pattern | Rename to `Button-CTA-Primary` |
| F1.4 | Web element prefix inconsistent | Change `<button-cta>` to `<button-cta-primary>` |
| F2.2 | 7 implicit contracts | Formalize in YAML schema |
| F2.5 | No YAML schema | Create `Button-CTA-Primary.schema.yaml` |

### Remediation Steps

#### Step 6.1.1: Rename Component Files/Directories

**Current Structure**:
```
src/components/core/ButtonCTA/
├── ButtonCTA.ts
├── ButtonCTA.styles.ts
├── index.ts
└── __tests__/
```

**Target Structure**:
```
src/components/core/Button-CTA-Primary/
├── Button-CTA-Primary.ts
├── Button-CTA-Primary.styles.ts
├── index.ts
├── Button-CTA-Primary.schema.yaml
└── __tests__/
```

**Effort**: 1 hour (applying lessons from TextInputField)

#### Step 6.1.2: Update Web Element Registration

**Current**: `<button-cta>`
**Target**: `<button-cta-primary>`

**Effort**: 15 minutes

#### Step 6.1.3: Create YAML Schema

**Contracts to Formalize**:
- `focusable`
- `pressable`
- `hover_state` (web only)
- `pressed_state`
- `disabled_state`
- `loading_state`
- `focus_ring`

**Effort**: 1 hour (using TextInputField schema as template)

#### Step 6.1.4: Update Tests, Demo Page, iOS, Android

**Effort**: 1.5 hours (applying lessons from TextInputField)

### Total Effort: ButtonCTA Migration

| Step | Description | Effort |
|------|-------------|--------|
| 6.1.1 | Rename files/directories | 1 hour |
| 6.1.2 | Update web element registration | 15 minutes |
| 6.1.3 | Create YAML schema | 1 hour |
| 6.1.4 | Update tests, demo, iOS, Android | 1.5 hours |
| **Total** | | **3-4 hours** |

---

## Component 3: Container → Container-Layout-Base

**Task**: 6.2 (Apply Lessons)
**Priority**: High
**Complexity**: Low-Medium

### Findings Addressed

| Finding ID | Description | Remediation |
|------------|-------------|-------------|
| F1.2 | Name doesn't follow pattern | Rename to `Container-Layout-Base` |
| F1.4 | Web element prefix inconsistent | Change `<dp-container>` to `<container-layout-base>` |
| F2.3 | 7 implicit contracts | Formalize in YAML schema |
| F2.5 | No YAML schema | Create `Container-Layout-Base.schema.yaml` |

### Remediation Steps

#### Step 6.2.1: Rename Component Files/Directories

**Current Structure**:
```
src/components/core/Container/
├── Container.ts
├── Container.styles.ts
├── index.ts
└── __tests__/
```

**Target Structure**:
```
src/components/core/Container-Layout-Base/
├── Container-Layout-Base.ts
├── Container-Layout-Base.styles.ts
├── index.ts
├── Container-Layout-Base.schema.yaml
└── __tests__/
```

**Effort**: 1 hour

#### Step 6.2.2: Update Web Element Registration

**Current**: `<dp-container>`
**Target**: `<container-layout-base>`

**Effort**: 15 minutes

#### Step 6.2.3: Create YAML Schema

**Contracts to Formalize**:
- `contains_children`
- `applies_padding`
- `applies_background`
- `applies_shadow`
- `applies_border`
- `applies_radius`
- `hover_state` (web only)

**Effort**: 45 minutes

#### Step 6.2.4: Update Tests, Demo Page, iOS, Android

**Effort**: 1 hour

### Total Effort: Container Migration

| Step | Description | Effort |
|------|-------------|--------|
| 6.2.1 | Rename files/directories | 1 hour |
| 6.2.2 | Update web element registration | 15 minutes |
| 6.2.3 | Create YAML schema | 45 minutes |
| 6.2.4 | Update tests, demo, iOS, Android | 1 hour |
| **Total** | | **3 hours** |

---

## Component 4: Icon → Icon-Feather-Base

**Task**: 6.3 (Apply Lessons)
**Priority**: High
**Complexity**: Low-Medium

### Findings Addressed

| Finding ID | Description | Remediation |
|------------|-------------|-------------|
| F1.5 | Name doesn't follow pattern | Rename to `Icon-Feather-Base` |
| F1.4 | Web element prefix inconsistent | Change `<dp-icon>` to `<icon-feather-base>` |
| F2.6 | 5 implicit contracts | Formalize in YAML schema |
| F2.5 | No YAML schema | Create `Icon-Feather-Base.schema.yaml` |

### Remediation Steps

#### Step 6.3.1: Rename Component Files/Directories

**Current Structure**:
```
src/components/core/Icon/
├── Icon.ts
├── Icon.styles.ts
├── index.ts
└── __tests__/
```

**Target Structure**:
```
src/components/core/Icon-Feather-Base/
├── Icon-Feather-Base.ts
├── Icon-Feather-Base.styles.ts
├── index.ts
├── Icon-Feather-Base.schema.yaml
└── __tests__/
```

**Effort**: 1 hour

#### Step 6.3.2: Update Web Element Registration

**Current**: `<dp-icon>`
**Target**: `<icon-feather-base>`

**Effort**: 15 minutes

#### Step 6.3.3: Create YAML Schema

**Contracts to Formalize**:
- `renders_svg`
- `color_inheritance`
- `size_variants`
- `optical_balance`
- `accessibility_hidden`

**Effort**: 45 minutes

#### Step 6.3.4: Update Tests, Demo Page, iOS, Android

**Effort**: 1 hour

### Total Effort: Icon Migration

| Step | Description | Effort |
|------|-------------|--------|
| 6.3.1 | Rename files/directories | 1 hour |
| 6.3.2 | Update web element registration | 15 minutes |
| 6.3.3 | Create YAML schema | 45 minutes |
| 6.3.4 | Update tests, demo, iOS, Android | 1 hour |
| **Total** | | **3 hours** |

---

## Effort Summary

### By Task

| Task | Component | Effort | Notes |
|------|-----------|--------|-------|
| Task 4 | TextInputField → Input-Text-Base | 6-10 hours | Test migration, includes lessons learned |
| Task 6.1 | ButtonCTA → Button-CTA-Primary | 3-4 hours | Apply lessons |
| Task 6.2 | Container → Container-Layout-Base | 3 hours | Apply lessons |
| Task 6.3 | Icon → Icon-Feather-Base | 3 hours | Apply lessons |
| **Total** | | **15-20 hours** | |

### By Activity Type

| Activity | Total Effort | Notes |
|----------|--------------|-------|
| File/Directory Renaming | 4-5 hours | Includes all platforms |
| Web Element Registration | 1 hour | Simple updates |
| YAML Schema Creation | 3.5-4.5 hours | First schema takes longer |
| Test Updates | 3-4 hours | Mostly import/selector changes |
| Demo Page Updates | 1-2 hours | Simple element name changes |
| iOS/Android Updates | 2-4 hours | Struct/function renaming |
| Documentation | 1 hour | Lessons learned, completion docs |
| **Total** | **15.5-21.5 hours** | |

---

## Risk Assessment

### Low Risk Items

| Item | Risk Level | Mitigation |
|------|------------|------------|
| File renaming | Low | Git handles renames well |
| Import updates | Low | IDE refactoring tools |
| Test updates | Low | Mostly mechanical changes |

### Medium Risk Items

| Item | Risk Level | Mitigation |
|------|------------|------------|
| Web element registration | Medium | Test in demo page immediately |
| Cross-platform consistency | Medium | Validate on all platforms after each migration |

### Mitigated by Test-First Approach

| Risk | Mitigation |
|------|------------|
| Unknown migration issues | TextInputField migration reveals issues first |
| Pattern validation | Lessons learned inform subsequent migrations |
| Effort estimation accuracy | Actual Task 4 effort refines Task 6 estimates |

---

## Dependencies

### Task 4 Dependencies

- Task 1 complete (Stemma System Foundation)
- Task 2.1-2.3 complete (Audit and approved priorities)
- Task 2.4 complete (This document)
- Task 2.5 complete (Approved remediation scope)

### Task 6 Dependencies

- Task 4 complete (Test migration with lessons learned)
- Task 5 complete (Semantic components use Input-Text-Base)

---

## Success Criteria

### Per Component

- [ ] Component renamed following `[Family]-[Type]-[Variant]` pattern
- [ ] Web element registered with family-based prefix
- [ ] YAML schema created with all contracts formalized
- [ ] All existing tests pass with renamed component
- [ ] Demo page updated and functional
- [ ] iOS implementation renamed and functional
- [ ] Android implementation renamed and functional
- [ ] Cross-platform behavioral consistency verified

### Overall

- [ ] All 4 components migrated to Stemma naming
- [ ] All 28 implicit contracts formalized in YAML schemas
- [ ] F1.4 (prefix inconsistency) resolved by family-based prefixes
- [ ] Lessons learned documented for future migrations
- [ ] No regression in functionality or accessibility

---

## Alignment with Approved Priorities

This remediation plan aligns with the approved priorities from Task 2.3:

| Approved Decision | Implementation |
|-------------------|----------------|
| Full remediation scope | All 4 components included |
| Test-first approach | TextInputField first (Task 4), others follow (Task 6) |
| Icon component inclusion | Icon included in Task 6 |
| Migration order | TextInputField → ButtonCTA → Container → Icon |
| Human-AI check-ins | Subtask 4.0 and 6.0 for alignment |
| Web element prefix resolution | Family name becomes prefix |

---

*This remediation recommendations document provides the foundation for Task 2.5 (Human-AI Checkpoint: Approve remediation scope) and subsequent implementation in Tasks 4 and 6.*
