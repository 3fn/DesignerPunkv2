---
inclusion: manual
name: Component-Schema-Format
description: Formal specification for Stemma System component schema YAML files — identity fields, property definitions, type system, inheritance declarations, composition declarations, platform notes, and validation rules. Load when creating or modifying component schema YAML files, validating schema structure, or understanding the relationship between schema YAML and contracts.yaml.
---

# Component Schema Format Specification

**Date**: 2026-02-25
**Purpose**: Formal specification for Stemma System component schema definitions
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, architecture, spec-planning
**Last Reviewed**: 2026-02-25

---

## Overview

**📖 CONDITIONAL SECTION LOADING**

**Load when**: Creating or modifying component schema YAML files, validating schema structure, adding inheritance or composition declarations, understanding the relationship between schema YAML and contracts.yaml.

**Skip when**: Working with behavioral contracts (use Contract-System-Reference.md instead), executing non-component tasks, working on tokens or test infrastructure.

### AI Agent Reading Priorities

**WHEN creating a new component schema THEN read:**
1. ✅ **Schema Structure** — top-level fields and type system
2. ✅ **Property Definitions** — public API format
3. ✅ **Inheritance** — if semantic component
4. ✅ **Validation Rules** — required fields by type
5. ❌ **SKIP**: Composition, Platform Notes (unless applicable)

**WHEN adding composition to a component THEN read:**
1. ✅ **Composition** — `composition:` format and placement
2. ❌ **SKIP**: Everything else

**WHEN validating or auditing schema files THEN read:**
1. ✅ **Validation Rules** — required fields by type, naming convention
2. ✅ **Schema Structure** — field frequency and requirements
3. ✅ **Type System** — correct type classification

**WHEN understanding schema vs. contracts split THEN read:**
1. ✅ **Overview** — schema YAML vs. contracts.yaml distinction
2. ✅ **File Location** — directory structure
3. ✅ Then query [Contract System Reference](./Contract-System-Reference.md) for the contracts side

---

This document defines the YAML schema structure for Stemma System components. Each component has a `[Component].schema.yaml` file that defines its structural identity — what it is, what properties it exposes, and how it relates to other components.

**Schema YAML vs. contracts.yaml**: Schema YAML defines structure (identity, properties, platform notes, composition). Behavioral contracts live in a separate `contracts.yaml` file. See [Contract System Reference](./Contract-System-Reference.md) for the contract format.

**Related Documentation**:
- [Contract System Reference](./Contract-System-Reference.md) — Behavioral contract format and taxonomy
- [Stemma System Principles](./stemma-system-principles.md) — Core principles and governance
- [Component Development Guide](./Component-Development-Guide.md) — Implementation guidance

---

## File Location

Schema files live alongside their component:

```
src/components/core/[Component-Name]/
├── [Component-Name].schema.yaml    ← structural identity (this format)
├── contracts.yaml                   ← behavioral guarantees (see Contract-System-Reference.md)
├── README.md
├── types.ts
├── index.ts
├── platforms/
│   ├── web/
│   ├── ios/
│   └── android/
└── __tests__/
```

---

## Schema Structure

### Top-Level Fields

Fields present across all 20 component schemas, ordered by frequency:

| Field | Required | Present In | Description |
|-------|----------|-----------|-------------|
| `name` | yes | 20/20 | Component name following `[Family]-[Type]-[Variant]` pattern |
| `type` | yes | 20/20 | Component classification (see Type System below) |
| `family` | yes | 20/20 | Stemma family name |
| `version` | yes | 20/20 | Schema version (e.g., `"1.0.0"`) |
| `readiness` | yes | 20/20 | Implementation status |
| `description` | yes | 20/20 | Multi-line description of component purpose |
| `behaviors` | yes | 20/20 | List of behavior identifiers (e.g., `focusable`, `validatable`) |
| `properties` | yes | 20/20 | Map of property definitions (public API) |
| `accessibility` | yes | 20/20 | Accessibility specifications |
| `tokens` | no | 17/20 | Design token dependencies |
| `platforms` | no | 17/20 | Supported platforms list `[web, ios, android]` |
| `platform_notes` | no | 17/20 | Platform-specific implementation notes |
| `semantic_variants` | no | 7/20 | Planned semantic variants (primitives only) |
| `inherits` | conditional | 6/20 | Parent component (semantic components only) |
| `omits` | no | 4/28 | Properties omitted from parent when inheriting |
| `composition` | no | 6/28 | Composition relationships (`internal`, `children`) |
| `inheritance` | no | 3/20 | Inheritance metadata (older schemas) |

### Type System

Four component types exist in practice:

| Type | Count | Description |
|------|-------|-------------|
| `primitive` | 7 | Family base component (e.g., Input-Text-Base, Chip-Base) |
| `semantic` | 9 | Extends a primitive with specific purpose (e.g., Input-Text-Email) |
| `type-primitive` | 3 | Type-specific base within a family (e.g., Badge-Count-Base, Badge-Label-Base) |
| `standalone` | 1 | Self-contained component with no family hierarchy (Button-CTA) |

### Readiness Status

```yaml
readiness: production-ready | development | beta | placeholder | deprecated
```

See [Component Readiness Status System](./Component-Readiness-Status.md) for detailed definitions and transition guidelines.

---

## Property Definitions

Properties define the component's public API:

```yaml
properties:
  label:
    type: string
    required: true
    description: Field label text displayed above or within input
  size:
    type: enum
    required: false
    default: md
    description: Size variant
    validation:
      enum: [sm, md, lg]
  disabled:
    type: boolean
    required: false
    default: false
    description: Whether component is disabled
  onPress:
    type: callback
    required: false
    description: Called when component is pressed
```

### Property Types

```yaml
# Primitive types
string | number | boolean | object | array | callback

# Enum type (restricted values)
type: enum
validation:
  enum: [value1, value2, value3]
```

---

## Inheritance

Semantic components declare inheritance with `inherits:`:

```yaml
# Primitive — no inherits field
name: Input-Text-Base
type: primitive
family: FormInput

# Semantic — inherits from primitive
name: Input-Text-Email
type: semantic
family: FormInput
inherits: Input-Text-Base
```

**Rules**:
- Semantic components MUST have `inherits:`
- Primitives MUST NOT have `inherits:`
- `inherits:` must reference a component in the same family
- Inherited properties, behaviors, and contracts cannot be removed
- Semantic components can add new properties and behaviors

---

## Composition

Components that use other components internally or orchestrate children declare `composition:`:

```yaml
# Internal composition (uses another component internally)
composition:
  internal:
    - component: Container-Base
      relationship: Uses internally for layout
  nesting:
    self: false

# Children orchestration (manages child components)
composition:
  internal:
    - component: Input-Radio-Base
      relationship: Orchestrates selection state and keyboard navigation
  children:
    requires: [Input-Radio-Base]
    allowed: [Input-Radio-Base]
    minCount: 2
  nesting:
    self: false
```

`internal` replaces the former top-level `composes:` field. `children.requires` declares required child types (presence check). `children.allowed` constrains which types can be slotted.

Placed after `readiness:` and before `description:` in the schema file. Composition is structural (what contains what); behavioral composition contracts live in contracts.yaml.

---

## Omits

Inheriting components can omit parent properties that don't apply:

```yaml
inherits: Input-Checkbox-Base
omits: [size, indeterminate, labelAlign]
```

Omitted properties are excluded from the assembled metadata. The MCP validates that omitted property names exist on the parent's property set.

---

## Behaviors

A list of behavior identifiers the component implements:

```yaml
behaviors:
  - focusable
  - validatable
  - float-label
  - accessible
```

Semantic components list both inherited and extended behaviors:

```yaml
behaviors:
  - focusable          # Inherited from Input-Text-Base
  - validatable        # Inherited from Input-Text-Base
  - float-label        # Inherited from Input-Text-Base
  - accessible         # Inherited from Input-Text-Base
  - email-validation   # Extended
  - email-autocomplete # Extended
```

Note: Behaviors are informal identifiers. The formal behavioral guarantees are in contracts.yaml.

---

## Accessibility Section

```yaml
accessibility:
  wcag_level: AA
  compliance:
    - "1.3.1 Info and Relationships"
    - "1.4.3 Contrast (Minimum)"
  aria_attributes:
    - aria-live="polite"
  platform_accessibility:
    web: "Description of web accessibility approach"
    ios: "Description of iOS accessibility approach"
    android: "Description of Android accessibility approach"
```

---

## Tokens Section

Structured by category:

```yaml
tokens:
  typography:
    - typography.labelSm
    - typography.labelMd
  color:
    - color.input.background
    - color.input.border
  spacing:
    - space.input.padding
```

---

## Platform Notes

Implementation details per platform:

```yaml
platforms: [web, ios, android]
platform_notes:
  web:
    implementation: Web Component (Custom Element)
    file: platforms/web/ComponentName.web.tsx
    notes: |
      Platform-specific implementation details
  ios:
    implementation: SwiftUI View
    file: platforms/ios/ComponentName.ios.swift
  android:
    implementation: Jetpack Compose Composable
    file: platforms/android/ComponentName.android.kt
```

---

## Semantic Variants Section

Primitives list their planned semantic variants:

```yaml
semantic_variants:
  - name: Input-Text-Email
    extends: Email validation and autocomplete
    status: production-ready
  - name: Input-Text-Password
    extends: Secure input with visibility toggle
    status: production-ready
```

---

## Validation Rules

### Required Fields by Type

| Field | primitive | semantic | type-primitive | standalone |
|-------|-----------|----------|----------------|------------|
| `name` | ✅ | ✅ | ✅ | ✅ |
| `type` | ✅ | ✅ | ✅ | ✅ |
| `family` | ✅ | ✅ | ✅ | ✅ |
| `version` | ✅ | ✅ | ✅ | ✅ |
| `readiness` | ✅ | ✅ | ✅ | ✅ |
| `description` | ✅ | ✅ | ✅ | ✅ |
| `behaviors` | ✅ | ✅ | ✅ | ✅ |
| `properties` | ✅ | ✅ | ✅ | ✅ |
| `accessibility` | ✅ | ✅ | ✅ | ✅ |
| `inherits` | ❌ | ✅ | ❌ | ❌ |

### Naming Convention

Components follow `[Family]-[Type]-[Variant]`:
- `Input-Text-Base` (primitive)
- `Input-Text-Email` (semantic)
- `Badge-Count-Base` (type-primitive)
- `Badge-Count-Notification` (semantic of type-primitive)

---

## Related Documentation

- [Contract System Reference](./Contract-System-Reference.md) — Behavioral contract format (contracts.yaml)
- [Stemma System Principles](./stemma-system-principles.md) — Core principles and governance
- [Component Readiness Status System](./Component-Readiness-Status.md) — Readiness status definitions
- [Component Development Guide](./Component-Development-Guide.md) — Implementation guidance
- [Token Quick Reference](./Token-Quick-Reference.md) — Token documentation routing
