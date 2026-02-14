---
inclusion: manual
name: Component-Readiness-Status
description: Readiness status definitions, usage recommendations, and transition guidelines for Stemma System components — production ready, beta, and placeholder status indicators. Load when evaluating component maturity or making component usage decisions.
---

# Component Readiness Status System

**Date**: 2026-01-01
**Purpose**: Comprehensive readiness status definitions, usage recommendations, and transition guidelines for Stemma System components
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, architecture, spec-planning
**Last Reviewed**: 2026-01-01

---

## Overview

The Component Readiness Status System provides standardized indicators that communicate the implementation maturity and production-safety of Stemma System components. These indicators ensure developers and AI agents can make informed decisions about component usage.

**Key Principle**: Readiness status must be consistent across all documentation surfaces—Component Quick Reference, MCP documentation, component schemas, and implementations.

**Related Documentation**:
- [Stemma System Principles](./stemma-system-principles.md) - Core principles and governance
- [Component Schema Format Specification](./Component-Schema-Format.md) - Schema structure including readiness field

---

## Readiness Status Definitions

### Status Overview

| Status | Indicator | Visual | Description |
|--------|-----------|--------|-------------|
| **Production Ready** | `production-ready` | 🟢 | Fully implemented, tested, documented, safe for production |
| **Beta** | `beta` | 🟡 | Implemented but may have minor issues, safe for development |
| **Placeholder** | `placeholder` | 🔴 | Structural definition only, do NOT use |
| **Deprecated** | `deprecated` | ⚠️ | Being phased out, migrate to alternatives |

---

## Detailed Status Definitions

### 🟢 Production Ready

**Definition**: Component is fully implemented, comprehensively tested, thoroughly documented, and safe for use in production applications.

**Requirements for Production Ready Status**:

| Requirement | Description | Verification |
|-------------|-------------|--------------|
| **Full Implementation** | Component implemented across all declared platforms (web, iOS, Android) | Code review confirms all platforms |
| **Behavioral Contracts** | All declared contracts are honored | Contract verification tests pass |
| **Token Integration** | All token dependencies properly consumed | Token usage audit passes |
| **Test Coverage** | Unit tests, integration tests, and property tests exist | Test suite passes with >80% coverage |
| **Documentation** | Complete MCP documentation with usage examples | Documentation review approved |
| **Accessibility** | WCAG 2.1 AA compliance verified | Accessibility audit passes |
| **Cross-Platform Consistency** | Behavioral contracts work identically across platforms | Cross-platform validation passes |

**Usage Recommendations**:
- ✅ Safe for all development environments
- ✅ Safe for production deployment
- ✅ Recommended for new projects
- ✅ Stable API—breaking changes follow deprecation process

**Schema Declaration**:
```yaml
readiness: production-ready
```

**Visual Indicator Usage**:
```markdown
## Input-Text-Email 🟢

Production Ready component for email input with validation.
```

---

### 🟡 Beta

**Definition**: Component is implemented and functional but may have minor issues, incomplete features, or limited testing. Safe for development and testing, but use caution in production.

**Requirements for Beta Status**:

| Requirement | Description | Verification |
|-------------|-------------|--------------|
| **Core Implementation** | Primary functionality implemented on at least one platform | Code review confirms core features |
| **Basic Contracts** | Core behavioral contracts are honored | Basic contract tests pass |
| **Token Integration** | Primary token dependencies consumed | Token usage review |
| **Basic Testing** | Unit tests exist for core functionality | Core tests pass |
| **Draft Documentation** | Basic usage documentation exists | Documentation exists |

**What May Be Incomplete**:
- Secondary platform implementations
- Edge case handling
- Comprehensive test coverage
- Advanced accessibility features
- Performance optimization
- Complete documentation

**Usage Recommendations**:
- ✅ Safe for development and testing
- ⚠️ Use caution in production—evaluate specific use case
- ✅ Feedback encouraged to improve component
- ⚠️ API may change—minor breaking changes possible

**Schema Declaration**:
```yaml
readiness: beta
```

**Visual Indicator Usage**:
```markdown
## Input-Text-Search 🟡

Beta component for search input. Core functionality works, but advanced features are in development.
```

**Beta Component Expectations**:
- Report issues when discovered
- Expect updates that may require minor code changes
- Provide feedback on API design
- Consider fallback strategies for production use

---

### 🔴 Placeholder

**Definition**: Component exists only as a structural definition for architectural planning. No implementation exists. Do NOT use in any code.

**What Placeholder Provides**:
- Component name following naming convention
- Family classification
- Planned behavioral contracts
- Planned token dependencies
- Architectural documentation

**What Placeholder Does NOT Provide**:
- ❌ Any implementation code
- ❌ Working functionality
- ❌ Usable component
- ❌ Tests or validation

**Usage Recommendations**:
- ❌ Do NOT use in any code
- ❌ Do NOT reference in production applications
- ✅ Use for architectural planning only
- ✅ Use to understand future component roadmap
- ✅ Use to provide feedback on planned design

**Schema Declaration**:
```yaml
readiness: placeholder
```

**Visual Indicator Usage**:
```markdown
## Avatar-User-Base 🔴

Placeholder component. Structural definition only—not implemented.
```

**Placeholder Component Expectations**:
- Component will be implemented in future development
- Schema may change based on implementation learnings
- Feedback on planned design is welcome
- Do not build dependencies on placeholder components

---

### ⚠️ Deprecated

**Definition**: Component is being phased out and should not be used for new development. Existing usage should migrate to recommended alternatives.

**Requirements for Deprecated Status**:

| Requirement | Description | Verification |
|-------------|-------------|--------------|
| **Replacement Identified** | Alternative component or pattern documented | Migration guide exists |
| **Migration Path** | Clear migration steps documented | Migration guide reviewed |
| **Deprecation Timeline** | Removal timeline communicated | Timeline documented |
| **Continued Support** | Component still works during deprecation period | Tests continue to pass |

**Usage Recommendations**:
- ❌ Do NOT use for new development
- ⚠️ Existing usage should migrate to alternatives
- ✅ Component still works during deprecation period
- ✅ Migration guidance available

**Schema Declaration**:
```yaml
readiness: deprecated
```

**Visual Indicator Usage**:
```markdown
## Input-Text-Base ⚠️

Deprecated. Migrate to semantic variants (Input-Text-Email, Input-Text-Password).
```

**Deprecated Component Expectations**:
- Component will be removed after deprecation period
- No new features will be added
- Only critical bug fixes during deprecation
- Migration support available

---

## Status Transition Guidelines

### Transition Paths

```
                    ┌─────────────────┐
                    │   Placeholder   │
                    │       🔴        │
                    └────────┬────────┘
                             │
                             │ Implementation begins
                             ▼
                    ┌─────────────────┐
                    │      Beta       │
                    │       🟡        │
                    └────────┬────────┘
                             │
                             │ All requirements met
                             ▼
                    ┌─────────────────┐
                    │ Production Ready│◄────────────────┐
                    │       🟢        │                 │
                    └────────┬────────┘                 │
                             │                          │
                             │ Replacement identified   │ Issues resolved
                             ▼                          │
                    ┌─────────────────┐                 │
                    │   Deprecated    │─────────────────┘
                    │       ⚠️        │  (rare: undeprecation)
                    └────────┬────────┘
                             │
                             │ Deprecation period ends
                             ▼
                    ┌─────────────────┐
                    │     Removed     │
                    │       ❌        │
                    └─────────────────┘
```

### Transition: Placeholder → Beta

**Trigger**: Implementation work begins on the component.

**Requirements**:
1. Core functionality implemented on at least one platform
2. Basic behavioral contracts honored
3. Primary token dependencies integrated
4. Basic unit tests created
5. Draft documentation written

**Process**:
1. Implement core functionality
2. Create basic tests
3. Write draft documentation
4. Update schema: `readiness: beta`
5. Update all documentation references
6. Human-AI checkpoint for approval

**Checklist**:
- [ ] Core implementation complete on primary platform
- [ ] Basic contracts verified
- [ ] Token integration working
- [ ] Unit tests passing
- [ ] Draft documentation exists
- [ ] Schema updated to `beta`
- [ ] MCP documentation updated
- [ ] Component Quick Reference updated (if applicable)

---

### Transition: Beta → Production Ready

**Trigger**: All production-ready requirements are met.

**Requirements**:
1. Full implementation across all declared platforms
2. All behavioral contracts honored and tested
3. Complete token integration
4. Comprehensive test coverage (>80%)
5. Complete documentation with examples
6. Accessibility compliance verified
7. Cross-platform consistency validated

**Process**:
1. Complete all platform implementations
2. Implement comprehensive tests
3. Complete documentation
4. Run accessibility audit
5. Run cross-platform validation
6. Update schema: `readiness: production-ready`
7. Update all documentation references
8. Human-AI checkpoint for approval

**Checklist**:
- [ ] All platforms implemented (web, iOS, Android)
- [ ] All contracts verified with tests
- [ ] Token integration complete
- [ ] Test coverage >80%
- [ ] Documentation complete with examples
- [ ] Accessibility audit passed
- [ ] Cross-platform validation passed
- [ ] Schema updated to `production-ready`
- [ ] MCP documentation updated
- [ ] Component Quick Reference updated

---

### Transition: Production Ready → Deprecated

**Trigger**: Decision to phase out component in favor of alternative.

**Requirements**:
1. Replacement component or pattern identified
2. Migration path documented
3. Deprecation timeline established
4. Stakeholder communication completed

**Process**:
1. Identify and document replacement
2. Create migration guide
3. Establish deprecation timeline
4. Communicate to stakeholders
5. Update schema: `readiness: deprecated`
6. Update all documentation with deprecation notice
7. Human-AI checkpoint for approval

**Checklist**:
- [ ] Replacement identified and documented
- [ ] Migration guide created
- [ ] Deprecation timeline established (minimum 3 months recommended)
- [ ] Stakeholder communication completed
- [ ] Schema updated to `deprecated`
- [ ] MCP documentation updated with deprecation notice
- [ ] Component Quick Reference updated with deprecation notice
- [ ] Migration guide linked from all documentation

---

### Transition: Deprecated → Removed

**Trigger**: Deprecation period ends.

**Requirements**:
1. Deprecation period completed
2. Migration support provided
3. No critical dependencies remaining
4. Final removal communication

**Process**:
1. Verify deprecation period complete
2. Confirm migration support was provided
3. Check for remaining dependencies
4. Send final removal notice
5. Remove component from codebase
6. Remove from documentation
7. Archive schema for reference

**Checklist**:
- [ ] Deprecation period complete
- [ ] Migration support provided throughout period
- [ ] No critical dependencies remaining
- [ ] Final removal notice sent
- [ ] Component removed from codebase
- [ ] Component removed from MCP documentation
- [ ] Component removed from Component Quick Reference
- [ ] Schema archived for historical reference

---

### Special Transition: Deprecated → Production Ready (Undeprecation)

**Trigger**: Decision to reverse deprecation (rare).

**Requirements**:
1. Clear justification for undeprecation
2. Issues that led to deprecation resolved
3. Stakeholder agreement

**Process**:
1. Document justification for undeprecation
2. Verify issues resolved
3. Obtain stakeholder agreement
4. Update schema: `readiness: production-ready`
5. Update all documentation
6. Communicate undeprecation

**Note**: This transition is rare and should only occur when the original deprecation decision is reversed due to changed circumstances.

---

## Consistency Requirements

### Documentation Surfaces

Readiness status MUST be consistent across all documentation surfaces:

| Surface | Location | Format |
|---------|----------|--------|
| **Component Schema** | `readiness` field | `production-ready`, `beta`, `placeholder`, `deprecated` |
| **MCP Documentation** | Metadata section | Status with indicator emoji |
| **Component Quick Reference** | Routing table | Status column with indicator |
| **Implementation Files** | JSDoc/comments | Status annotation |
| **Demo Pages** | Component cards | Visual indicator badge |

### Validation

**Automated Validation**:
- Schema validation checks `readiness` field value
- MCP documentation validation checks status consistency
- Integration tests verify status across surfaces

**Manual Validation**:
- Human-AI checkpoint on status transitions
- Documentation review includes status verification
- Release checklist includes status consistency check

---

## Usage in Component Schemas

### Schema Field Definition

```yaml
# Readiness field in component schema
readiness: ReadinessStatus  # Required field

# Valid values
ReadinessStatus:
  - production-ready  # 🟢 Fully implemented, tested, documented
  - beta              # 🟡 Implemented but may have minor issues
  - placeholder       # 🔴 Structural definition only
  - deprecated        # ⚠️ Being phased out
```

### Example Schema Declarations

**Production Ready Component**:
```yaml
Input-Text-Email:
  name: Input-Text-Email
  type: semantic
  family: FormInputs
  inherits: Input-Text-Base
  readiness: production-ready
  # ... rest of schema
```

**Beta Component**:
```yaml
Input-Text-Search:
  name: Input-Text-Search
  type: semantic
  family: FormInputs
  inherits: Input-Text-Base
  readiness: beta
  # ... rest of schema
```

**Placeholder Component**:
```yaml
Avatar-User-Base:
  name: Avatar-User-Base
  type: primitive
  family: Avatars
  readiness: placeholder
  # ... structural definition only
```

**Deprecated Component**:
```yaml
Input-Text-Base:
  name: Input-Text-Base
  type: primitive
  family: FormInputs
  readiness: deprecated
  deprecation:
    replacement: Input-Text-Email, Input-Text-Password
    migration_guide: "./migration/input-text-base-to-semantic-variants.md"
    removal_date: "2026-06-01"
  # ... rest of schema
```

---

## MCP Documentation Integration

### Status in MCP Metadata

```yaml
# MCP document metadata
metadata:
  family: FormInputs
  purpose: Data collection and validation
  readiness: production-ready  # Family-level readiness
  
  components:
    - name: Input-Text-Base
      readiness: production-ready
    - name: Input-Text-Email
      readiness: production-ready
    - name: Input-Text-Search
      readiness: beta
```

### MCP Query Examples

**Query component readiness**:
```
get_section({ 
  path: ".kiro/steering/Component-Family-Form-Inputs.md", 
  heading: "Component Readiness" 
})
```

**Response includes**:
- Component name
- Current readiness status
- Status indicator emoji
- Usage recommendations
- Migration guidance (if deprecated)

---

## Component Quick Reference Integration

### Routing Table Format

```markdown
## Component Documentation Map

| Component Family | Shared Need/Purpose | Status | MCP Document Path |
|------------------|---------------------|--------|-------------------|
| Buttons | User interaction and actions | 🟢 | `.kiro/steering/Component-Family-Button.md` |
| Form Inputs | Data collection and validation | 🟢 | `.kiro/steering/Component-Family-Form-Inputs.md` |
| Containers | Layout and content organization | 🟢 | `.kiro/steering/Component-Family-Container.md` |
| Icons | Visual communication | 🔴 | `.kiro/steering/Component-Family-Icon.md` |
| Modals | Overlay interactions | 🔴 | `.kiro/steering/Component-Family-Modal.md` |
| Avatars | Identity representation | 🔴 | `.kiro/steering/Component-Family-Avatar.md` |
| Badges & Tags | Status and labeling | 🔴 | `.kiro/steering/Component-Family-Badge.md` |
| Data Displays | Information presentation | 🔴 | `.kiro/steering/Component-Family-Data-Display.md` |
| Dividers | Visual separation | 🔴 | `.kiro/steering/Component-Family-Divider.md` |
| Loading | Progress indication | 🔴 | `.kiro/steering/Component-Family-Loading.md` |
| Navigation | Wayfinding | 🔴 | `.kiro/steering/Component-Family-Navigation.md` |
```

---

## AI Agent Decision Framework

### Component Selection Based on Readiness

```
Need a component?
    │
    ├── Is component Production Ready (🟢)?
    │   └── YES → Use component confidently
    │
    ├── Is component Beta (🟡)?
    │   ├── For development/testing → Use with awareness of limitations
    │   └── For production → Evaluate specific use case, consider alternatives
    │
    ├── Is component Placeholder (🔴)?
    │   └── Do NOT use → Wait for implementation or use alternative
    │
    └── Is component Deprecated (⚠️)?
        └── Do NOT use for new code → Use recommended replacement
```

### Reporting Readiness Issues

When AI agents encounter readiness-related issues:

1. **Inconsistent Status**: Report if status differs across documentation surfaces
2. **Missing Status**: Report if component lacks readiness indicator
3. **Incorrect Status**: Report if component behavior doesn't match claimed status
4. **Stale Deprecation**: Report if deprecated component past removal date

---

## Related Documentation

- [Stemma System Principles](./stemma-system-principles.md) - Core principles and governance
- [Component Schema Format Specification](./Component-Schema-Format.md) - Schema structure
- [Component Quick Reference](./Component-Quick-Reference.md) - Component routing table

---

*This document establishes the comprehensive readiness status system for Stemma System components, ensuring clear communication of component maturity and production-safety across all documentation surfaces.*
