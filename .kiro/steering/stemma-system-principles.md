---
inclusion: manual
---

# Stemma System Principles

**Date**: 2026-01-01
**Purpose**: Foundational principles and governance for systematic component development across platforms
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, architecture, spec-planning
**Last Reviewed**: 2026-01-01

---

## Overview

The Stemma System establishes foundational principles and architecture governing component relationships, inheritance, and behavioral contracts across web, iOS, and Android platforms. It complements the Rosetta System (mathematical token foundation) with relational component foundation.

**Rosetta + Stemma Integration**:
- **Rosetta System**: Mathematical relationships and token hierarchy (how things look and scale)
- **Stemma System**: Family relationships and component hierarchy (how things behave and relate)
- **Together**: Complete design system foundation covering both visual consistency (Rosetta) and behavioral consistency (Stemma)

---

## Core Principles

### Principle 1: Family Inheritance Patterns

Components are organized into families with clear inheritance hierarchies:

```
Family (e.g., Form Inputs)
├── Primitive Component (Base)
│   └── Provides foundational behaviors
│   └── Named with "Base" suffix
│   └── Legitimate for coverage gaps
└── Semantic Components
    └── Inherit from primitive base
    └── Add specialized functionality
    └── Named with descriptive variants
```

**Key Rules**:
1. Every component family has exactly ONE primitive base component
2. Semantic components MUST inherit from their family's primitive base
3. Primitive components provide foundational behaviors that ALL semantic variants share
4. Semantic components extend (never replace) base behaviors

### Principle 2: Behavioral Contracts

Each component guarantees consistent behaviors across platforms through explicit contracts:

**Contract Structure**:
```yaml
contracts:
  - contract_name: provides_float_label_animation
    description: Label animates from placeholder to floating position on focus
    platforms: [web, ios, android]
    required: true
    
  - contract_name: validates_on_blur
    description: Validation triggers when field loses focus
    platforms: [web, ios, android]
    required: true
```

**Contract Rules**:
1. Contracts define WHAT behavior occurs, not HOW it's implemented
2. All platforms MUST honor the same contracts
3. Platform-specific implementations are allowed if contracts are preserved
4. Semantic components inherit ALL contracts from their base

### Principle 3: Composition Relationships

Components work together through systematic composition patterns:

**Composition Types**:
| Type | Description | Example |
|------|-------------|---------|
| **Containment** | Parent contains children | Container → Button |
| **Aggregation** | Components grouped for purpose | Form → Input + Button |
| **Association** | Components reference each other | Input → Icon (leading) |

**Composition Rules**:
1. Composition patterns are documented, not implicit
2. Token dependencies flow from container to contained
3. Behavioral contracts propagate through composition
4. Cross-family composition follows documented patterns

### Principle 4: Cross-Platform Consistency

Behavioral contracts work uniformly across web, iOS, and Android:

**Consistency Model**:
```
┌─────────────────────────────────────────────────────────┐
│                  Behavioral Contract                     │
│              (Identical across platforms)                │
├─────────────────┬─────────────────┬─────────────────────┤
│   Web (HTML)    │  iOS (SwiftUI)  │ Android (Compose)   │
│   Implementation│  Implementation │ Implementation      │
│   (Platform-    │  (Platform-     │ (Platform-          │
│    specific)    │   specific)     │  specific)          │
└─────────────────┴─────────────────┴─────────────────────┘
```

**Consistency Rules**:
1. Same property names across all platforms
2. Same behavioral contracts across all platforms
3. Platform-appropriate implementations allowed
4. Visual differences acceptable if behavior is consistent



---

## Component Family Architecture

### The 11 Component Families

| Family | Shared Need/Purpose | Primitive Base |
|--------|---------------------|----------------|
| **Buttons** | User interaction and actions | Button-Base |
| **Form Inputs** | Data collection and validation | Input-Text-Base |
| **Containers** | Layout and content organization | Container-Base |
| **Icons** | Visual communication | Icon-Base |
| **Modals** | Overlay interactions | Modal-Base |
| **Avatars** | Identity representation | Avatar-Base |
| **Badges & Tags** | Status and labeling | Badge-Base |
| **Data Displays** | Information presentation | DataDisplay-Base |
| **Dividers** | Visual separation | Divider-Base |
| **Loading** | Progress indication | Loading-Base |
| **Navigation** | Wayfinding | Nav-Base |

### Family Inheritance Structure

Each family follows this inheritance pattern:

```
[Family]-[Type]-Base (Primitive)
    │
    ├── [Family]-[Type]-[Variant1] (Semantic)
    ├── [Family]-[Type]-[Variant2] (Semantic)
    └── [Family]-[Type]-[Variant3] (Semantic)
```

**Example: Form Inputs Family**:
```
Input-Text-Base (Primitive)
    │
    ├── Input-Text-Email (Semantic)
    ├── Input-Text-Password (Semantic)
    └── Input-Text-PhoneNumber (Semantic)
```

### Behavioral Contract Inheritance

Semantic components inherit ALL contracts from their base:

```yaml
# Input-Text-Base contracts (inherited by all semantic variants)
base_contracts:
  - focusable
  - validatable
  - float_label_animation
  - error_state_display
  - disabled_state

# Input-Text-Email extends with:
extended_contracts:
  - email_format_validation
  - email_autocomplete
  - keyboard_type_email
```

---

## Governance Guidelines

### Component Development Governance

#### 1. Family Creation Governance

**When to Create a New Family**:
- Components share a common purpose that doesn't fit existing families
- At least 3 potential semantic variants are identified
- Clear primitive base behaviors can be defined

**Family Creation Process**:
1. Document shared need/purpose
2. Define primitive base behaviors
3. Identify initial semantic variants
4. Create behavioral contracts
5. Human-AI checkpoint for approval

#### 2. Component Addition Governance

**Adding Semantic Components**:
1. Verify family exists with primitive base
2. Confirm inheritance from base is appropriate
3. Define extended behaviors (not replacements)
4. Document new contracts
5. Implement across all platforms

**Adding Primitive Components**:
- Requires new family creation (see above)
- Primitive components are NEVER added to existing families
- Each family has exactly ONE primitive base

#### 3. Contract Modification Governance

**Modifying Base Contracts**:
- ⚠️ HIGH IMPACT: Affects all semantic variants
- Requires Human-AI checkpoint
- Must maintain backward compatibility
- All platforms must be updated simultaneously

**Adding Contracts to Semantic Components**:
- Lower impact: Only affects specific variant
- Document clearly in component schema
- Ensure no conflict with base contracts

### Naming Convention Governance

#### AI-Optimal Naming Pattern

The Stemma System uses a structured naming convention designed for AI agent discoverability and systematic component organization. The pattern encodes hierarchy and relationships directly in component names.

**Core Patterns**:

| Pattern | When to Use | Example |
|---------|-------------|---------|
| `[Family]-[Type]` | When Type is descriptive enough | `Button-CTA`, `Button-Icon` |
| `[Family]-Base` | Foundational component with no specific type | `Container-Base`, `Icon-Base` |
| `[Family]-[Type]-Base` | Primitive with semantic variants | `Input-Text-Base` |
| `[Family]-[Type]-[Variant]` | Semantic variant | `Input-Text-Email` |

**Key Insight**: `-Base` can be either a Type OR a Variant depending on context. It simply means "foundational."

**Decision Framework**:

| Scenario | Pattern | Example | Rationale |
|----------|---------|---------|-----------|
| **Standalone component with descriptive type** | `[Family]-[Type]` | `Button-CTA` | Type (CTA) is descriptive; no variant needed |
| **Foundational component, no specific type** | `[Family]-Base` | `Container-Base`, `Icon-Base` | Base serves as the Type - it's the foundational implementation |
| **Primitive with semantic variants** | `[Family]-[Type]-Base` | `Input-Text-Base` | Base is the Variant; semantic variants inherit from this |
| **Semantic variant** | `[Family]-[Type]-[Variant]` | `Input-Text-Email` | Variant describes specialized behavior |

**Key Distinction: Styling Props vs Behavioral Variants**

- **Styling props** (e.g., `variant="primary"`, `variant="secondary"`) are handled within a single component
- **Behavioral variants** (e.g., email validation, password masking) require separate component implementations

**Examples**:
- `Button-CTA` - Standalone component with `variant` prop for primary/secondary/tertiary styling
- `Container-Base` - Foundational container; `-Base` is the Type (no more specific type needed)
- `Icon-Base` - Foundational icon; `-Base` is the Type
- `Input-Text-Base` - Foundational text input; `-Base` is the Variant (Email, Password inherit from this)
- `Input-Text-Email` - Behavioral variant with email-specific validation and keyboard

**Pattern Segments**:

| Segment | Purpose | Format | Examples |
|---------|---------|--------|----------|
| **Family** | Groups related components by shared purpose | PascalCase noun | `Input`, `Button`, `Container`, `Avatar` |
| **Type** | Specifies the component category within family | PascalCase noun or `Base` | `Text`, `CTA`, `Base`, `User` |
| **Variant** | (Optional) Distinguishes behavioral variants or primitive status | PascalCase noun or `Base` | `Base`, `Email`, `Password` |

#### Understanding `-Base` in Context

The `-Base` suffix is flexible and context-dependent:

**As a Type** (`[Family]-Base`):
- Used when the family has no meaningful type distinction
- The component IS the foundational implementation
- Examples: `Container-Base`, `Icon-Base`, `Divider-Base`

**As a Variant** (`[Family]-[Type]-Base`):
- Used when the family has multiple types AND semantic variants exist
- Indicates this is the primitive that semantic variants inherit from
- Examples: `Input-Text-Base` (has Email, Password variants), `Avatar-User-Base` (has Profile, Thumbnail variants)

**When NOT to use `-Base`**:
- When a more descriptive Type exists: `Button-CTA` not `Button-Base`
- When naming a semantic variant: `Input-Text-Email` not `Input-Text-Base-Email`

#### Component Family Naming Examples

| Family | Primitive Component | Pattern Used | Rationale |
|--------|---------------------|--------------|-----------|
| Form Inputs | `Input-Text-Base` | `[Family]-[Type]-Base` | Has semantic variants (Email, Password, PhoneNumber) |
| Buttons | `Button-CTA` | `[Family]-[Type]` | CTA is descriptive; styling via props |
| Containers | `Container-Base` | `[Family]-Base` | No specific type needed; Base IS the type |
| Icons | `Icon-Base` | `[Family]-Base` | No specific type needed; Base IS the type |
| Modals | `Modal-Dialog-Base` | `[Family]-[Type]-Base` | Dialog is a type; may have variants |
| Avatars | `Avatar-User-Base` | `[Family]-[Type]-Base` | User is a type; has Profile, Thumbnail variants |
| Badges | `Badge-Status-Base` | `[Family]-[Type]-Base` | Status is a type; may have variants |
| Data Displays | `DataDisplay-Text-Base` | `[Family]-[Type]-Base` | Text is a type; may have variants |
| Dividers | `Divider-Base` | `[Family]-Base` | No specific type needed |
| Loading | `Loading-Spinner-Base` | `[Family]-[Type]-Base` | Spinner is a type; may have variants |
| Navigation | `Nav-Link-Base` | `[Family]-[Type]-Base` | Link is a type; may have variants |

#### Semantic Component Naming (Descriptive Variants)

**Rule**: Semantic components use descriptive variant names that indicate their specialized **behavioral** purpose.

**Semantic Naming Pattern**: `[Family]-[Type]-[DescriptiveVariant]`

**Form Inputs Family Examples** (behavioral variants with distinct validation/keyboard):
| Component | Inherits From | Specialized Purpose |
|-----------|---------------|---------------------|
| `Input-Text-Email` | `Input-Text-Base` | Email validation + autocomplete |
| `Input-Text-Password` | `Input-Text-Base` | Secure input + password toggle |
| `Input-Text-PhoneNumber` | `Input-Text-Base` | Phone formatting + international validation |
| `Input-Text-Search` | `Input-Text-Base` | Search functionality + clear button |
| `Input-Text-URL` | `Input-Text-Base` | URL validation + protocol handling |

**Buttons Family Examples** (standalone components with styling props):
| Component | Type | Specialized Purpose |
|-----------|------|---------------------|
| `Button-CTA` | Standalone | Call-to-action with `variant` prop (primary/secondary/tertiary) |
| `Button-Icon-Close` | Standalone | Close/dismiss action icon button |
| `Button-Icon-Menu` | Standalone | Menu toggle action icon button |

**Note**: Button components use `[Family]-[Type]` pattern because styling variations (primary, secondary, tertiary) are handled via props, not separate component implementations.

**Avatars Family Examples**:
| Component | Inherits From | Specialized Purpose |
|-----------|---------------|---------------------|
| `Avatar-User-Profile` | `Avatar-User-Base` | User profile display |
| `Avatar-User-Thumbnail` | `Avatar-User-Base` | Compact user representation |
| `Avatar-Group-Stack` | `Avatar-Group-Base` | Stacked group display |

#### Naming Validation Rules

The following validation rules MUST be enforced for all component names:

**Rule 1: Pattern Compliance**
```
VALID:   [Family]-[Type]-[Variant]   (3 segments)
VALID:   [Family]-[Type]             (2 segments)
VALID:   [Family]-Base               (2 segments, Base as Type)
INVALID: [Family][Type][Variant]     (missing hyphens)
INVALID: [family]-[type]-[variant]   (lowercase)
INVALID: [Type]-[Variant]            (missing Family)
```

**Rule 2: PascalCase Enforcement**
```
VALID:   Input-Text-Email
VALID:   Container-Base
VALID:   Button-CTA
INVALID: input-text-email            (all lowercase)
INVALID: INPUT-TEXT-EMAIL            (all uppercase)
INVALID: Input-text-Email            (inconsistent case)
INVALID: input_text_email            (underscores)
```

**Rule 3: Base Usage (Flexible)**
```
VALID:   Container-Base              (Base as Type - foundational component)
VALID:   Icon-Base                   (Base as Type - foundational component)
VALID:   Input-Text-Base             (Base as Variant - primitive with semantic variants)
INVALID: Input-Text-BaseEmail        (Base not as suffix when used as Variant)
INVALID: Input-Text-EmailBase        (Base combined with variant name)
```

**Rule 4: Hyphen Separator Requirement**
```
VALID:   Input-Text-PhoneNumber      (hyphens between segments)
VALID:   Container-Base              (hyphens between segments)
INVALID: InputTextPhoneNumber        (no separators)
INVALID: Input_Text_PhoneNumber      (underscores)
INVALID: Input.Text.PhoneNumber      (dots)
```

**Rule 5: Segment Count Validation**
```
VALID:   Input-Text-Base             (3 segments)
VALID:   Input-Text-Email            (3 segments)
VALID:   Button-CTA                  (2 segments)
VALID:   Container-Base              (2 segments, Base as Type)
VALID:   Icon-Base                   (2 segments, Base as Type)
INVALID: Input-Text-Email-Validated  (4 segments - too many)
INVALID: TextInput                   (1 segment - missing structure)
```

**Rule 6: Reserved Keywords**
```
RESERVED: Base     (for foundational components - as Type or Variant)
RESERVED: Abstract (not used - use Base instead)
RESERVED: Core     (not used - use Base instead)
RESERVED: Default  (not used - use Base instead)
```

#### Validation Error Messages

When naming validation fails, provide clear guidance:

| Violation | Error Message | Correction |
|-----------|---------------|------------|
| Missing hyphens | "Component name must use hyphens between segments" | Add hyphens between segments |
| Wrong case | "Component name must use PascalCase for all segments" | Capitalize first letter of each word |
| Too many segments | "Component name should have 2-3 segments maximum" | Simplify naming |
| Reserved keyword misuse | "'[keyword]' is reserved. Use 'Base' for foundational components" | Replace with appropriate name |

#### AI Agent Benefits

The naming convention provides specific benefits for AI agent workflows:

**1. Predictable Name Inference**
```
Given: "I need an email input component"
Infer: Input-Text-Email (Family: Input, Type: Text, Variant: Email)

Given: "I need a primary action button"
Infer: Button-CTA-Primary (Family: Button, Type: CTA, Variant: Primary)
```

**2. Auto-Completion Grouping**
```
Type: "Input-"
Shows: Input-Text-Base, Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber...

Type: "Button-"
Shows: Button-CTA-Base, Button-CTA-Primary, Button-Icon-Close, Button-Icon-Menu...
```

**3. Inheritance Discovery**
```
Component: Input-Text-Email
Base:      Input-Text-Base (replace variant with "Base")
Family:    All components starting with "Input-"
```

**4. Self-Documenting Hierarchy**
```
Name: Avatar-User-Profile
├── Family: Avatar (identity representation)
├── Type: User (user-specific avatar)
└── Variant: Profile (profile display use case)
```

#### Naming Convention Quick Reference

| Question | Answer |
|----------|--------|
| What pattern do I use? | See decision framework above - depends on whether Type is descriptive or Base is needed |
| How do I name a foundational component with no specific type? | `[Family]-Base` (e.g., `Container-Base`, `Icon-Base`) |
| How do I name a primitive with semantic variants? | `[Family]-[Type]-Base` (e.g., `Input-Text-Base`) |
| How do I name a standalone with descriptive type? | `[Family]-[Type]` (e.g., `Button-CTA`) |
| How do I name a semantic variant? | `[Family]-[Type]-[Variant]` (e.g., `Input-Text-Email`) |
| What case do I use? | PascalCase for all segments |
| What separator do I use? | Hyphens (`-`) between segments |
| How many segments? | 2 or 3 depending on pattern |
| Can I use underscores? | No, only hyphens |
| Is "Base" reserved? | Yes, for foundational components - can be Type or Variant |

### Readiness Status Governance

| Status | Indicator | Description | Usage Recommendation |
|--------|-----------|-------------|---------------------|
| **Production Ready** | 🟢 | Fully implemented, tested, documented | Safe for all development |
| **Beta** | 🟡 | Implemented but may have minor issues | Safe for development, caution in production |
| **Placeholder** | 🔴 | Structural definition only | Do NOT use - architectural planning only |
| **Deprecated** | ⚠️ | Being phased out | Migrate to recommended alternatives |

**Status Transition Rules**:
1. New components start as Placeholder or Beta
2. Production Ready requires: full implementation, tests, documentation
3. Deprecation requires: migration path documented, replacement identified
4. Status changes require Human-AI checkpoint

**Detailed Guidance**: For comprehensive readiness status definitions, usage recommendations, transition checklists, and consistency requirements, see [Component Readiness Status System](./component-readiness-status-system.md).



---

## Component Schema Format

**Detailed Specification**: For the complete formal schema specification including validation rules, inheritance resolution, and tooling integration, see [Component Schema Format Specification](./component-schema-format.md).

### YAML Schema Structure

Every component is defined using this schema format:

```yaml
ComponentSchema:
  # Identity
  name: string                    # Component name following naming convention
  type: primitive | semantic      # Component type
  family: string                  # Family name (FormInputs, Buttons, etc.)
  
  # Inheritance (semantic components only)
  inherits: string               # Parent component name
  
  # Behaviors
  behaviors: string[]            # Reusable behaviors (focusable, validatable, etc.)
  
  # Properties
  properties:
    [property_name]:
      type: string | boolean | number | enum
      required: boolean
      default: any
      description: string
  
  # Contracts
  contracts:
    - name: string
      description: string
      platforms: string[]
      required: boolean
  
  # Token Dependencies
  tokens: string[]               # Required design tokens
  
  # Platform Support
  platforms: string[]            # Supported platforms [web, ios, android]
  
  # Status
  readiness: ReadinessStatus     # production-ready | beta | placeholder | deprecated
  
  # Extensions (semantic components only)
  extends:
    validation: string
    autocomplete: string
    formatting: string
    properties: object
```

### Example: Input-Text-Base Schema

```yaml
Input-Text-Base:
  name: Input-Text-Base
  type: primitive
  family: FormInputs
  
  behaviors:
    - focusable
    - validatable
    - float-label
  
  properties:
    label:
      type: string
      required: true
      description: Field label text
    value:
      type: string
      required: false
      default: ""
      description: Current input value
    placeholder:
      type: string
      required: false
      description: Placeholder text when empty
    disabled:
      type: boolean
      required: false
      default: false
      description: Whether input is disabled
    error:
      type: string
      required: false
      description: Error message to display
  
  contracts:
    - name: provides_float_label_animation
      description: Label animates from placeholder to floating position on focus
      platforms: [web, ios, android]
      required: true
    - name: validates_on_blur
      description: Validation triggers when field loses focus
      platforms: [web, ios, android]
      required: true
    - name: supports_error_states
      description: Displays error message and visual error indication
      platforms: [web, ios, android]
      required: true
    - name: supports_disabled_state
      description: Prevents interaction when disabled
      platforms: [web, ios, android]
      required: true
  
  tokens:
    - typography.input.*
    - color.input.*
    - space.input.*
    - motion.float-label.*
    - radius.input.*
  
  platforms: [web, ios, android]
  readiness: production-ready
```

### Example: Input-Text-Email Schema (Semantic)

```yaml
Input-Text-Email:
  name: Input-Text-Email
  type: semantic
  family: FormInputs
  inherits: Input-Text-Base
  
  behaviors:
    # Inherits: focusable, validatable, float-label
    - email-validation
    - email-autocomplete
  
  properties:
    # Inherits all Input-Text-Base properties
    # No additional properties needed
  
  contracts:
    # Inherits all Input-Text-Base contracts
    - name: validates_email_format
      description: Validates input matches email format
      platforms: [web, ios, android]
      required: true
    - name: provides_email_autocomplete
      description: Suggests email addresses from device/browser
      platforms: [web, ios, android]
      required: true
    - name: uses_email_keyboard
      description: Shows email-optimized keyboard on mobile
      platforms: [ios, android]
      required: true
  
  extends:
    validation: email_format
    autocomplete: email
    properties:
      type: "email"  # Fixed value
  
  tokens:
    # Inherits all Input-Text-Base tokens
  
  platforms: [web, ios, android]
  readiness: production-ready
```

---

## Primitive vs Semantic Usage Philosophy

**Detailed Guidance**: For comprehensive decision frameworks, examples, and anti-patterns, see [Primitive vs Semantic Usage Philosophy](./primitive-vs-semantic-usage-philosophy.md).

### Key Distinction from Token Philosophy

**Token Usage**: Primitives are discouraged; always prefer semantic tokens
**Component Usage**: Primitives are LEGITIMATE for coverage gaps

### When to Use Primitive Components

| Scenario | Use Primitive? | Rationale |
|----------|---------------|-----------|
| Semantic variant exists | ❌ No | Use the semantic variant |
| No semantic variant exists | ✅ Yes | Legitimate coverage gap |
| Building custom functionality | ✅ Yes | Base provides foundation |
| Prototyping new patterns | ✅ Yes | Validate before creating semantic |

### Decision Framework

```
Need a component?
    │
    ├── Does semantic variant exist?
    │   ├── YES → Use semantic variant
    │   └── NO → Continue...
    │
    ├── Is this a common pattern?
    │   ├── YES → Consider creating semantic variant
    │   └── NO → Use primitive (legitimate)
    │
    └── Using primitive for coverage gap?
        └── Document the gap for future semantic creation
```

### Primitive Usage is Expected

Unlike tokens (where primitive usage indicates a problem), primitive component usage is:
- **Expected** during early development
- **Legitimate** for coverage gaps
- **Appropriate** for custom functionality
- **Temporary** until semantic variants are created

**The goal**: Reduce primitive usage over time by creating semantic variants for common patterns, NOT by avoiding primitives entirely.



---

## Composition Patterns

### Common Composition Patterns

#### Login Form Pattern

```yaml
LoginForm:
  composition_type: aggregation
  components:
    - Input-Text-Email
    - Input-Text-Password
    - Button-CTA (primary, submit)
    - Container-Base (layout)
  
  token_dependencies:
    - space.stack.* (vertical spacing)
    - space.inset.* (form padding)
  
  behavioral_contracts:
    - form_validation_on_submit
    - field_validation_on_blur
    - submit_button_disabled_until_valid
```

#### Feed Post Pattern

```yaml
FeedPost:
  composition_type: aggregation
  components:
    - Avatar-User
    - Button-Icon (like, comment, share)
    - DataDisplay-Text (content)
    - Container-Base (card layout)
  
  token_dependencies:
    - space.inline.* (horizontal spacing)
    - space.stack.* (vertical spacing)
    - radius.card.* (container radius)
    - shadow.card.* (elevation)
  
  behavioral_contracts:
    - avatar_links_to_profile
    - actions_provide_feedback
    - content_supports_expansion
```

### Composition Rules

1. **Token Flow**: Container tokens apply to contained components
2. **Contract Propagation**: Parent contracts don't override child contracts
3. **Event Bubbling**: Events propagate from child to parent
4. **State Sharing**: Shared state is explicit, not implicit

---

## Cross-Platform Implementation Guidelines

### Platform-Specific Considerations

| Aspect | Web | iOS | Android |
|--------|-----|-----|---------|
| **Component Format** | Web Components | SwiftUI Views | Jetpack Compose |
| **Token Consumption** | CSS Custom Properties | Swift Extensions | Kotlin Extensions |
| **Event Handling** | DOM Events | SwiftUI Actions | Compose Callbacks |
| **Accessibility** | ARIA attributes | VoiceOver support | TalkBack support |

### Behavioral Contract Implementation

**Same Contract, Different Implementation**:

```
Contract: provides_float_label_animation

Web Implementation:
  - CSS transitions on label element
  - Transform and opacity changes
  - 200ms duration using motion tokens

iOS Implementation:
  - SwiftUI withAnimation
  - offset and opacity modifiers
  - 200ms duration using motion tokens

Android Implementation:
  - Compose animateFloatAsState
  - offset and alpha modifiers
  - 200ms duration using motion tokens
```

### Cross-Platform Validation

**Validation Checklist**:
- [ ] Same property names across platforms
- [ ] Same behavioral contracts honored
- [ ] Same token dependencies used
- [ ] Accessibility requirements met per platform
- [ ] Visual differences are platform-appropriate (not contract violations)

---

## Integration with Existing Systems

### Rosetta System Integration

The Stemma System complements Rosetta by handling different concerns:

| Concern | System | Responsibility |
|---------|--------|----------------|
| Visual consistency | Rosetta | Token values, scales, relationships |
| Behavioral consistency | Stemma | Component contracts, inheritance |
| Mathematical foundation | Rosetta | Modular scales, baseline grids |
| Relational foundation | Stemma | Family hierarchies, composition |

### Token System Integration

Components consume tokens through the established token hierarchy:

```
Rosetta Token System
    │
    ├── Primitive Tokens (spacing, color, typography)
    │       │
    │       └── Semantic Tokens (button.*, input.*, card.*)
    │               │
    │               └── Component Token Files (tokens.ts)
    │                       │
    │                       └── Stemma Components
    │                               │
    │                               └── Platform Implementations
```

### MCP Documentation Integration

Stemma System documentation is accessible via MCP:

```
get_document_summary({ path: ".kiro/steering/stemma-system-principles.md" })
get_section({ path: ".kiro/steering/stemma-system-principles.md", heading: "Component Schema Format" })
```

---

## Architectural Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DesignerPunk Design System                        │
├─────────────────────────────────┬───────────────────────────────────────┤
│         ROSETTA SYSTEM          │           STEMMA SYSTEM               │
│    (Mathematical Foundation)    │     (Relational Foundation)           │
├─────────────────────────────────┼───────────────────────────────────────┤
│                                 │                                       │
│  ┌─────────────────────────┐   │   ┌─────────────────────────────┐    │
│  │   Primitive Tokens      │   │   │    Component Families       │    │
│  │   - spacing             │   │   │    - Buttons                │    │
│  │   - color               │   │   │    - Form Inputs            │    │
│  │   - typography          │   │   │    - Containers             │    │
│  │   - motion              │   │   │    - Icons                  │    │
│  └──────────┬──────────────┘   │   │    - Modals                 │    │
│             │                   │   │    - Avatars                │    │
│             ▼                   │   │    - Badges & Tags          │    │
│  ┌─────────────────────────┐   │   │    - Data Displays          │    │
│  │   Semantic Tokens       │   │   │    - Dividers               │    │
│  │   - button.*            │   │   │    - Loading                │    │
│  │   - input.*             │   │   │    - Navigation             │    │
│  │   - card.*              │   │   └─────────────┬───────────────┘    │
│  └──────────┬──────────────┘   │                 │                     │
│             │                   │                 ▼                     │
│             │                   │   ┌─────────────────────────────┐    │
│             │                   │   │   Behavioral Contracts      │    │
│             │                   │   │   - focusable               │    │
│             │                   │   │   - validatable             │    │
│             │                   │   │   - float-label             │    │
│             │                   │   │   - error-state             │    │
│             │                   │   └─────────────┬───────────────┘    │
│             │                   │                 │                     │
└─────────────┼───────────────────┼─────────────────┼─────────────────────┘
              │                   │                 │
              ▼                   │                 ▼
┌─────────────────────────────────┴─────────────────────────────────────┐
│                     Component Implementations                          │
├───────────────────┬───────────────────┬───────────────────────────────┤
│       Web         │       iOS         │          Android              │
│   (Web Components)│   (SwiftUI)       │      (Jetpack Compose)        │
│                   │                   │                               │
│  Tokens: CSS      │  Tokens: Swift    │  Tokens: Kotlin               │
│  Custom Props     │  Extensions       │  Extensions                   │
└───────────────────┴───────────────────┴───────────────────────────────┘
```

---

## Related Documentation

- [Primitive vs Semantic Usage Philosophy](./primitive-vs-semantic-usage-philosophy.md) - Comprehensive decision guidance for component selection
- [Component Schema Format Specification](./component-schema-format.md) - Formal schema structure and validation rules
- [Component Readiness Status System](./component-readiness-status-system.md) - Comprehensive readiness status definitions and transition guidelines
- [Component Development and Practices Guide](./Component Development and Practices Guide.md) - Token selection and component patterns
- [Token Quick Reference](./Token Quick Reference.md) - Token documentation routing
- [Cross-Platform vs Platform-Specific Decision Framework](./Cross-Platform vs Platform-Specific Decision Framework.md) - Platform decision guidance

---

*This document establishes the Stemma System as the relational foundation for component development, complementing the Rosetta System's mathematical foundation to create a complete design system architecture.*
