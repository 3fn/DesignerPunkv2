---
inclusion: manual
---

# MCP Component Family Document Template

**Date**: 2026-01-02
**Purpose**: Template and specification for creating MCP-queryable component family documentation
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, mcp-documentation, architecture
**Last Reviewed**: 2026-01-02

---

## Overview

This document defines the standard structure for component family MCP documentation. All component family documents (e.g., `Component-Family-Form-Inputs.md`, `Component-Family-Button.md`) must follow this template to ensure:

1. **Progressive Disclosure Support**: Documents work with MCP's three-stage query workflow
2. **Consistent Structure**: AI agents can predict document organization
3. **Efficient Token Usage**: Sections are sized for targeted retrieval
4. **Cross-Platform Coverage**: All platforms documented consistently

**Related Documentation**:
- [Component Quick Reference](./Component-Quick-Reference.md) - Routing table for all families
- [Stemma System Principles](./stemma-system-principles.md) - Core architecture
- [Component Schema Format](./Component-Schema-Format.md) - YAML schema specification

---

## Document Types

### Implemented Family Documents

For families with production-ready components (Form Inputs, Buttons, Containers, Icons):

- **Full documentation** with all sections populated
- **Readiness status**: 🟢 Production Ready
- **Complete behavioral contracts** with WCAG references
- **Cross-platform implementation notes**
- **Usage examples** with code snippets

### Placeholder Family Documents

For families without implemented components (Modals, Avatars, Badges, etc.):

- **Structural documentation** with planned architecture
- **Readiness status**: 🔴 Placeholder
- **Planned components** with inheritance structure
- **Behavioral contracts** (planned, not implemented)
- **No usage examples** (not yet available)

---

## Required Metadata

All component family documents MUST include this front-matter:

```yaml
---
inclusion: manual
---
```

And this metadata header:

```markdown
# [Family Name] Components

**Date**: [Creation date]
**Purpose**: MCP-queryable documentation for [Family Name] component family
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, ui-composition, [family]-implementation
**Last Reviewed**: [Last review date]
```

---

## Required Sections

### Section 1: Family Overview

**Purpose**: High-level introduction to the component family
**Target Size**: ~200-400 tokens
**MCP Query**: `get_section({ heading: "Family Overview" })`

```markdown
## Family Overview

**Family**: [Family Name]
**Shared Need**: [What problem this family solves]
**Readiness**: [🟢 Production Ready | 🟡 Beta | 🔴 Placeholder]

### Purpose

[2-3 sentences describing the family's purpose and when to use it]

### Key Characteristics

- [Characteristic 1]
- [Characteristic 2]
- [Characteristic 3]

### Stemma System Integration

- **Primitive Base**: [Base component name]
- **Semantic Variants**: [Number] implemented, [Number] planned
- **Cross-Platform**: [web, ios, android]
```

---

### Section 2: Inheritance Structure

**Purpose**: Document the family's component hierarchy
**Target Size**: ~300-500 tokens
**MCP Query**: `get_section({ heading: "Inheritance Structure" })`

```markdown
## Inheritance Structure

### Component Hierarchy

```
[Family]-[Type]-Base (Primitive)
    │
    ├── [Family]-[Type]-[Variant1] (Semantic)
    ├── [Family]-[Type]-[Variant2] (Semantic)
    └── [Family]-[Type]-[Variant3] (Semantic)
```

### Primitive Component

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| [Name] | Primitive | [Status] | [Brief description] |

### Semantic Components

| Component | Inherits From | Status | Specialized Purpose |
|-----------|---------------|--------|---------------------|
| [Name] | [Base] | [Status] | [Purpose] |
| [Name] | [Base] | [Status] | [Purpose] |
```

---

### Section 3: Behavioral Contracts

**Purpose**: Document guaranteed behaviors across platforms
**Target Size**: ~500-1000 tokens
**MCP Query**: `get_section({ heading: "Behavioral Contracts" })`

```markdown
## Behavioral Contracts

### Base Contracts (Inherited by All)

All components in this family inherit these foundational contracts:

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| [contract_name] | [Description] | [WCAG ref] | web, ios, android |
| [contract_name] | [Description] | [WCAG ref] | web, ios, android |

### Contract Details

#### [Contract Name]

**Description**: [What this contract guarantees]

**Behavior**:
[Detailed description of the behavior]

**Verification**:
- [How to verify on web]
- [How to verify on iOS]
- [How to verify on Android]

**WCAG Compliance**: [WCAG criterion and level]
```

---

### Section 4: Component Schemas

**Purpose**: Document each component's properties and API
**Target Size**: ~500-1500 tokens per component
**MCP Query**: `get_section({ heading: "[Component-Name]" })`

```markdown
## Component Schemas

### [Component-Name]

**Type**: [Primitive | Semantic]
**Status**: [🟢 Production Ready | 🟡 Beta | 🔴 Placeholder]
**Inherits**: [Parent component or "None"]

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| [name] | [type] | [Yes/No] | [default] | [description] |
| [name] | [type] | [Yes/No] | [default] | [description] |

#### Extended Contracts

[For semantic components only]

| Contract | Description | Platforms |
|----------|-------------|-----------|
| [name] | [description] | [platforms] |

#### Usage Example

```[language]
// [Platform] example
[Code example]
```
```

---

### Section 5: Token Dependencies

**Purpose**: Document design tokens consumed by family components
**Target Size**: ~300-500 tokens
**MCP Query**: `get_section({ heading: "Token Dependencies" })`

```markdown
## Token Dependencies

### Required Tokens

Components in this family consume these design tokens:

| Category | Token Pattern | Purpose |
|----------|---------------|---------|
| Typography | `typography.[family].*` | [Purpose] |
| Color | `color.[family].*` | [Purpose] |
| Spacing | `space.[family].*` | [Purpose] |
| Motion | `motion.[family].*` | [Purpose] |
| Border | `radius.[family].*` | [Purpose] |

### Token Resolution

[Explain how tokens are resolved for this family]

### Related Token Documentation

- [Token Quick Reference](./Token-Quick-Reference.md)
- [Specific token guide if applicable]
```

---

### Section 6: Usage Guidelines

**Purpose**: Provide practical guidance for using family components
**Target Size**: ~400-800 tokens
**MCP Query**: `get_section({ heading: "Usage Guidelines" })`

```markdown
## Usage Guidelines

### When to Use This Family

**Use [Family] components when**:
- [Use case 1]
- [Use case 2]
- [Use case 3]

**Do NOT use [Family] components when**:
- [Anti-pattern 1]
- [Anti-pattern 2]

### Primitive vs Semantic Selection

| Scenario | Recommended Component | Rationale |
|----------|----------------------|-----------|
| [Scenario] | [Component] | [Why] |
| [Scenario] | [Component] | [Why] |

### Common Patterns

#### [Pattern Name]

[Description of the pattern]

```[language]
// Example implementation
[Code]
```

### Accessibility Considerations

- [Consideration 1]
- [Consideration 2]
- [Consideration 3]
```

---

### Section 7: Cross-Platform Notes

**Purpose**: Document platform-specific implementation details
**Target Size**: ~300-600 tokens
**MCP Query**: `get_section({ heading: "Cross-Platform Notes" })`

```markdown
## Cross-Platform Notes

### Platform Implementations

| Platform | Technology | File Location |
|----------|------------|---------------|
| Web | Web Components | `platforms/web/[Component].web.ts` |
| iOS | SwiftUI | `platforms/ios/[Component].ios.swift` |
| Android | Jetpack Compose | `platforms/android/[Component].android.kt` |

### Platform-Specific Behaviors

#### Web

- [Web-specific note 1]
- [Web-specific note 2]

#### iOS

- [iOS-specific note 1]
- [iOS-specific note 2]

#### Android

- [Android-specific note 1]
- [Android-specific note 2]

### Behavioral Consistency

[Explain how behavioral contracts are maintained across platforms]
```

---

### Section 8: Related Documentation (Optional)

**Purpose**: Link to related resources
**Target Size**: ~100-200 tokens
**MCP Query**: `get_section({ heading: "Related Documentation" })`

```markdown
## Related Documentation

- [Component Quick Reference](./Component-Quick-Reference.md) - Family routing table
- [Stemma System Principles](./stemma-system-principles.md) - Architecture overview
- [Component Schema Format](./Component-Schema-Format.md) - YAML schema specification
- [Token Quick Reference](./Token-Quick-Reference.md) - Token documentation
- [Specific related guide] - [Description]
```

---

## Progressive Disclosure Support

### Query Workflow

MCP documents support three-stage progressive disclosure:

| Stage | Tool | Returns | Token Cost |
|-------|------|---------|------------|
| 1. Summary | `get_document_summary` | Metadata + section outline | ~200 tokens |
| 2. Section | `get_section` | Targeted section content | ~300-1500 tokens |
| 3. Full | `get_document_full` | Complete document | ~2000-5000 tokens |

### Section Sizing Guidelines

To optimize progressive disclosure:

| Section | Target Size | Rationale |
|---------|-------------|-----------|
| Family Overview | 200-400 tokens | Quick orientation |
| Inheritance Structure | 300-500 tokens | Hierarchy understanding |
| Behavioral Contracts | 500-1000 tokens | Core reference |
| Component Schemas | 500-1500 tokens each | Detailed API |
| Token Dependencies | 300-500 tokens | Integration reference |
| Usage Guidelines | 400-800 tokens | Practical guidance |
| Cross-Platform Notes | 300-600 tokens | Platform specifics |

### Heading Conventions

For reliable `get_section` queries, use consistent heading patterns:

```markdown
## Family Overview           # Top-level section
## Inheritance Structure     # Top-level section
## Behavioral Contracts      # Top-level section
## Component Schemas         # Top-level section
### [Component-Name]         # Individual component (queryable)
## Token Dependencies        # Top-level section
## Usage Guidelines          # Top-level section
## Cross-Platform Notes      # Top-level section
## Related Documentation     # Top-level section
```

---

## Implemented Family Template

Use this complete template for families with production-ready components:

```markdown
---
inclusion: manual
---

# [Family Name] Components

**Date**: [Date]
**Purpose**: MCP-queryable documentation for [Family Name] component family
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, ui-composition, [family]-implementation
**Last Reviewed**: [Date]

---

## Family Overview

**Family**: [Family Name]
**Shared Need**: [Problem solved]
**Readiness**: 🟢 Production Ready

### Purpose

[Description]

### Key Characteristics

- [Characteristic 1]
- [Characteristic 2]
- [Characteristic 3]

### Stemma System Integration

- **Primitive Base**: [Base component]
- **Semantic Variants**: [Count] implemented
- **Cross-Platform**: web, ios, android

---

## Inheritance Structure

[Full inheritance documentation]

---

## Behavioral Contracts

[Full contracts documentation]

---

## Component Schemas

[Full schema documentation for each component]

---

## Token Dependencies

[Full token documentation]

---

## Usage Guidelines

[Full usage documentation]

---

## Cross-Platform Notes

[Full platform documentation]

---

## Related Documentation

[Links to related docs]
```

---

## Placeholder Family Template

Use this template for families without implemented components:

```markdown
---
inclusion: manual
---

# [Family Name] Components

**Date**: [Date]
**Purpose**: Structural documentation for [Family Name] component family (placeholder)
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, architecture-planning
**Last Reviewed**: [Date]

---

## Family Overview

**Family**: [Family Name]
**Shared Need**: [Problem solved]
**Readiness**: 🔴 Placeholder

> ⚠️ **Placeholder Status**: This family is structurally defined but not yet implemented. 
> Do not use these components in production. This documentation describes planned architecture.

### Purpose

[Description of what this family will provide]

### Planned Characteristics

- [Planned characteristic 1]
- [Planned characteristic 2]
- [Planned characteristic 3]

### Stemma System Integration

- **Primitive Base**: [Planned base component]
- **Semantic Variants**: [Count] planned
- **Cross-Platform**: web, ios, android (planned)

---

## Inheritance Structure

### Planned Component Hierarchy

```
[Family]-[Type]-Base (Primitive) [PLANNED]
    │
    ├── [Family]-[Type]-[Variant1] (Semantic) [PLANNED]
    ├── [Family]-[Type]-[Variant2] (Semantic) [PLANNED]
    └── [Family]-[Type]-[Variant3] (Semantic) [PLANNED]
```

### Planned Components

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| [Name] | Primitive | 🔴 Planned | [Description] |
| [Name] | Semantic | 🔴 Planned | [Description] |

---

## Behavioral Contracts

### Planned Base Contracts

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| [contract] | [Description] | [WCAG] | web, ios, android |

> **Note**: These contracts are planned but not yet implemented or validated.

---

## Token Dependencies

### Planned Token Requirements

| Category | Token Pattern | Purpose |
|----------|---------------|---------|
| [Category] | `[pattern]` | [Purpose] |

> **Note**: Token patterns are planned and may change during implementation.

---

## Usage Guidelines

> ⚠️ **Not Available**: Usage guidelines will be documented when components are implemented.

### Planned Use Cases

- [Planned use case 1]
- [Planned use case 2]

---

## Cross-Platform Notes

> ⚠️ **Not Available**: Platform-specific notes will be documented when components are implemented.

### Planned Platform Support

- Web: Web Components
- iOS: SwiftUI
- Android: Jetpack Compose

---

## Related Documentation

- [Component Quick Reference](./Component-Quick-Reference.md) - Family routing table
- [Stemma System Principles](./stemma-system-principles.md) - Architecture overview

---

*This is a placeholder document. Full documentation will be created when the [Family Name] family is implemented.*
```

---

## Validation Checklist

Before publishing a component family document, verify:

### Metadata Validation

- [ ] Front-matter includes `inclusion: manual`
- [ ] All required metadata fields present
- [ ] Layer is set to 3 (domain-specific)
- [ ] Relevant Tasks include appropriate tags

### Section Validation

- [ ] All required sections present
- [ ] Section headings match template exactly (for MCP queries)
- [ ] Section sizes within target ranges
- [ ] No orphaned content outside sections

### Content Validation

- [ ] Readiness status matches actual implementation
- [ ] All components listed in Inheritance Structure
- [ ] Behavioral contracts have WCAG references
- [ ] Token dependencies are accurate
- [ ] Cross-platform notes cover all platforms

### Progressive Disclosure Validation

- [ ] Document summary provides useful overview
- [ ] Individual sections are self-contained
- [ ] Component schemas are queryable by name
- [ ] Full document is under 5000 tokens

### MCP Integration Validation

- [ ] Document indexed by MCP server (run `get_index_health`)
- [ ] Summary query returns expected metadata
- [ ] Section queries return expected content
- [ ] Cross-references resolve correctly

---

## MCP Health Check

After creating or updating component family documents:

```javascript
// 1. Check index health
get_index_health()

// 2. Rebuild if needed (stale index warning)
rebuild_index()

// 3. Verify document is indexed
get_document_summary({ path: ".kiro/steering/Component-Family-[FamilyName].md" })

// 4. Test section queries
get_section({ path: ".kiro/steering/Component-Family-[FamilyName].md", heading: "Family Overview" })
get_section({ path: ".kiro/steering/Component-Family-[FamilyName].md", heading: "Behavioral Contracts" })
```

---

*This template ensures consistent, MCP-queryable documentation for all component families in the Stemma System.*
