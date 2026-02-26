---
inclusion: manual
---

# Component Schema Format Specification

**Date**: 2026-01-01
**Purpose**: Formal specification for Stemma System component schema definitions
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, architecture, spec-planning
**Last Reviewed**: 2026-01-01

---

## Overview

This document defines the formal YAML schema structure for Stemma System components. All components—whether primitive or semantic—must conform to this schema format to ensure consistency, discoverability, and cross-platform compatibility.

**Related Documentation**:
- [Stemma System Principles](./stemma-system-principles.md) - Core principles and governance
- [Component Development Guide](./Component-Development-Guide.md) - Implementation guidance

---

## Schema Structure

### Complete Component Schema

Every component is defined using this YAML schema structure:

```yaml
# =============================================================================
# COMPONENT SCHEMA SPECIFICATION
# =============================================================================
# This schema defines the structure for all Stemma System components.
# All fields marked with (required) MUST be present.
# Fields marked with (optional) may be omitted.
# =============================================================================

ComponentSchema:
  # ---------------------------------------------------------------------------
  # IDENTITY SECTION (required)
  # Uniquely identifies the component within the Stemma System
  # ---------------------------------------------------------------------------
  name: string                    # (required) Component name following [Family]-[Type]-[Variant] pattern
  type: primitive | semantic      # (required) Component classification
  family: string                  # (required) Family name (FormInputs, Buttons, Containers, etc.)
  version: string                 # (optional) Schema version (default: "1.0.0")
  description: string             # (optional) Brief description of component purpose
  
  # ---------------------------------------------------------------------------
  # INHERITANCE SECTION (conditional)
  # Required for semantic components, forbidden for primitives
  # ---------------------------------------------------------------------------
  inherits: string                # (required for semantic) Parent component name (must be primitive base)
  
  # ---------------------------------------------------------------------------
  # BEHAVIORS SECTION (required)
  # Reusable behavior patterns the component implements
  # ---------------------------------------------------------------------------
  behaviors: string[]             # (required) List of behavior identifiers
                                  # Examples: focusable, validatable, float-label, dismissible
  
  # ---------------------------------------------------------------------------
  # PROPERTIES SECTION (required)
  # Component properties with type definitions and constraints
  # ---------------------------------------------------------------------------
  properties:                     # (required) Map of property definitions
    [property_name]:              # Property identifier (camelCase)
      type: PropertyType          # (required) Data type
      required: boolean           # (required) Whether property must be provided
      default: any                # (optional) Default value if not provided
      description: string         # (required) Human-readable description
      validation: ValidationRule  # (optional) Validation constraints
      platforms: string[]         # (optional) Platform-specific availability
  
  # ---------------------------------------------------------------------------
  # CONTRACTS SECTION (required)
  # Behavioral guarantees the component provides
  # ---------------------------------------------------------------------------
  contracts:                      # (required) List of behavioral contracts
    - name: string                # (required) Contract identifier (snake_case)
      description: string         # (required) What the contract guarantees
      platforms: string[]         # (required) Platforms where contract applies
      required: boolean           # (required) Whether contract is mandatory
      verification: string        # (optional) How to verify contract compliance
  
  # ---------------------------------------------------------------------------
  # TOKEN DEPENDENCIES SECTION (required)
  # Design tokens the component consumes
  # ---------------------------------------------------------------------------
  tokens: string[]                # (required) Token path patterns
                                  # Examples: typography.input.*, color.input.*, space.input.*
  
  # ---------------------------------------------------------------------------
  # PLATFORM SUPPORT SECTION (required)
  # Platforms where component is implemented
  # ---------------------------------------------------------------------------
  platforms: string[]             # (required) Supported platforms [web, ios, android]
  
  # ---------------------------------------------------------------------------
  # READINESS STATUS SECTION (required)
  # Current implementation status
  # ---------------------------------------------------------------------------
  readiness: ReadinessStatus      # (required) production-ready | beta | placeholder | deprecated
  
  # ---------------------------------------------------------------------------
  # EXTENSIONS SECTION (conditional)
  # Semantic component extensions to base functionality
  # ---------------------------------------------------------------------------
  extends:                        # (optional, semantic only) Extensions to base component
    validation: string            # (optional) Validation type extension
    autocomplete: string          # (optional) Autocomplete behavior extension
    formatting: string            # (optional) Formatting behavior extension
    keyboard: string              # (optional) Keyboard type extension (mobile)
    properties:                   # (optional) Fixed or extended property values
      [property_name]: any
  
  # ---------------------------------------------------------------------------
  # ACCESSIBILITY SECTION (optional)
  # Accessibility requirements and implementations
  # ---------------------------------------------------------------------------
  accessibility:                  # (optional) Accessibility specifications
    role: string                  # (optional) ARIA role / semantic role
    label_required: boolean       # (optional) Whether accessible label is required
    announcements: string[]       # (optional) Screen reader announcements
    keyboard_navigation: string[] # (optional) Keyboard interaction patterns
  
  # ---------------------------------------------------------------------------
  # COMPOSITION SECTION (optional)
  # How component participates in composition patterns
  # ---------------------------------------------------------------------------
  composition:                    # (optional) Composition specifications
    can_contain: string[]         # (optional) Component types this can contain
    contained_by: string[]        # (optional) Component types that can contain this
    slots: SlotDefinition[]       # (optional) Named slots for child components
```

---

## Field Type Definitions

### PropertyType

Valid property types for component properties:

```yaml
PropertyType:
  # Primitive Types
  - string                        # Text value
  - number                        # Numeric value (integer or float)
  - boolean                       # True/false value
  - object                        # Complex object (requires nested schema)
  - array                         # List of values (requires item type)
  
  # Enum Types (defined inline)
  - enum: [value1, value2, ...]   # Restricted set of valid values
  
  # Reference Types
  - ComponentRef                  # Reference to another component
  - TokenRef                      # Reference to a design token
  - CallbackRef                   # Reference to a callback function
```

### ValidationRule

Validation constraints for property values:

```yaml
ValidationRule:
  min: number                     # Minimum value (for numbers) or length (for strings)
  max: number                     # Maximum value (for numbers) or length (for strings)
  pattern: string                 # Regex pattern for string validation
  enum: string[]                  # Allowed values
  custom: string                  # Custom validation function name
```

### ReadinessStatus

Component readiness indicators:

```yaml
ReadinessStatus:
  - production-ready              # 🟢 Fully implemented, tested, documented
  - beta                          # 🟡 Implemented but may have minor issues
  - placeholder                   # 🔴 Structural definition only
  - deprecated                    # ⚠️ Being phased out
```

**Detailed Guidance**: For comprehensive readiness status definitions, usage recommendations, transition checklists, and consistency requirements, see [Component Readiness Status System](./Component-Readiness-Status.md).

### SlotDefinition

Named slots for component composition:

```yaml
SlotDefinition:
  name: string                    # Slot identifier
  description: string             # Slot purpose
  accepts: string[]               # Component types accepted in slot
  required: boolean               # Whether slot must be filled
  multiple: boolean               # Whether slot accepts multiple children
```

---

## Behavioral Contracts Format

### Contract Structure

Behavioral contracts define guaranteed behaviors that components provide across all platforms:

```yaml
# Contract Definition Structure
Contract:
  name: string                    # (required) Unique identifier (snake_case)
  description: string             # (required) What behavior is guaranteed
  platforms: string[]             # (required) Where contract applies
  required: boolean               # (required) Whether contract is mandatory
  verification: string            # (optional) How to verify compliance
  
  # Contract Categories
  category: ContractCategory      # (optional) Classification for organization
  
  # Contract Dependencies
  depends_on: string[]            # (optional) Other contracts this requires
  conflicts_with: string[]        # (optional) Contracts that cannot coexist
```

### Contract Categories

Contracts are organized into categories for clarity:

```yaml
ContractCategory:
  - interaction                   # User interaction behaviors (focus, click, hover)
  - validation                    # Input validation behaviors
  - animation                     # Motion and transition behaviors
  - state                         # State management behaviors
  - accessibility                 # Accessibility-related behaviors
  - composition                   # Component composition behaviors
```

### Standard Contracts Library

> **⚠️ DEPRECATED (Spec 063 — Uniform Contract System, February 2026)**
>
> This standard contracts library is superseded by the per-component `contracts.yaml` files using the uniform contract system. No component references these abstract contracts. The canonical contract format, vocabulary, and taxonomy are defined in: `.kiro/specs/063-uniform-contract-system/findings/format-specification.md`
>
> This section is retained for historical reference only. Do not use these contract names or definitions for new components.

Common contracts available for component use:

```yaml
# =============================================================================
# INTERACTION CONTRACTS
# =============================================================================

focusable:
  name: focusable
  description: Component can receive and manage keyboard focus
  platforms: [web, ios, android]
  required: true
  category: interaction
  verification: Component responds to focus events and shows focus indicator

clickable:
  name: clickable
  description: Component responds to click/tap interactions
  platforms: [web, ios, android]
  required: true
  category: interaction
  verification: Component triggers action on click/tap

hoverable:
  name: hoverable
  description: Component responds to hover state (desktop only)
  platforms: [web]
  required: false
  category: interaction
  verification: Component shows hover state on mouse enter

pressable:
  name: pressable
  description: Component shows pressed state during interaction
  platforms: [web, ios, android]
  required: false
  category: interaction
  verification: Component shows pressed state while being pressed

# =============================================================================
# VALIDATION CONTRACTS
# =============================================================================

validatable:
  name: validatable
  description: Component supports input validation with error states
  platforms: [web, ios, android]
  required: true
  category: validation
  verification: Component validates input and displays error state

validates_on_blur:
  name: validates_on_blur
  description: Validation triggers when component loses focus
  platforms: [web, ios, android]
  required: true
  category: validation
  depends_on: [validatable, focusable]
  verification: Validation runs when focus leaves component

validates_on_change:
  name: validates_on_change
  description: Validation triggers on every value change
  platforms: [web, ios, android]
  required: false
  category: validation
  depends_on: [validatable]
  verification: Validation runs on each input change

# =============================================================================
# ANIMATION CONTRACTS
# =============================================================================

provides_float_label_animation:
  name: provides_float_label_animation
  description: Label animates from placeholder to floating position on focus
  platforms: [web, ios, android]
  required: true
  category: animation
  depends_on: [focusable]
  verification: Label transitions smoothly when input receives focus

provides_transition_feedback:
  name: provides_transition_feedback
  description: State changes are animated smoothly
  platforms: [web, ios, android]
  required: false
  category: animation
  verification: State transitions use motion tokens for timing

# =============================================================================
# STATE CONTRACTS
# =============================================================================

supports_disabled_state:
  name: supports_disabled_state
  description: Component can be disabled, preventing interaction
  platforms: [web, ios, android]
  required: true
  category: state
  verification: Disabled component prevents all interaction

supports_error_states:
  name: supports_error_states
  description: Component displays error message and visual error indication
  platforms: [web, ios, android]
  required: true
  category: state
  verification: Error state shows error styling and message

supports_loading_state:
  name: supports_loading_state
  description: Component shows loading indicator during async operations
  platforms: [web, ios, android]
  required: false
  category: state
  verification: Loading state shows spinner or skeleton

# =============================================================================
# ACCESSIBILITY CONTRACTS
# =============================================================================

announces_state_changes:
  name: announces_state_changes
  description: State changes are announced to screen readers
  platforms: [web, ios, android]
  required: true
  category: accessibility
  verification: Screen reader announces state changes

supports_keyboard_navigation:
  name: supports_keyboard_navigation
  description: Component is fully operable via keyboard
  platforms: [web]
  required: true
  category: accessibility
  verification: All functionality accessible via keyboard

provides_accessible_label:
  name: provides_accessible_label
  description: Component has accessible name for assistive technology
  platforms: [web, ios, android]
  required: true
  category: accessibility
  verification: Accessible name is present and descriptive
```

### Contract Inheritance Rules

Semantic components inherit contracts from their base:

```yaml
# Contract Inheritance Behavior
InheritanceRules:
  # Rule 1: All base contracts are inherited
  - semantic_inherits_all_base_contracts: true
  
  # Rule 2: Inherited contracts cannot be removed
  - inherited_contracts_immutable: true
  
  # Rule 3: Semantic can add new contracts
  - semantic_can_extend_contracts: true
  
  # Rule 4: Contract requirements cannot be weakened
  - required_contracts_stay_required: true
  
  # Rule 5: Platform support can only be narrowed, not expanded
  - platform_support_narrowing_only: true
```

---

## Inheritance Relationship Representation

### Inheritance Structure

The Stemma System uses single inheritance with extension:

```yaml
# Inheritance Model
InheritanceModel:
  type: single-inheritance         # Each semantic has exactly one base
  direction: semantic-extends-primitive
  
  # What is inherited
  inherited:
    - behaviors                    # All base behaviors
    - properties                   # All base properties
    - contracts                    # All base contracts
    - tokens                       # All base token dependencies
  
  # What can be extended
  extensible:
    - behaviors                    # Add new behaviors
    - properties                   # Add new properties (cannot override)
    - contracts                    # Add new contracts
    - tokens                       # Add new token dependencies
  
  # What cannot be changed
  immutable:
    - base_behaviors               # Cannot remove inherited behaviors
    - base_properties              # Cannot remove inherited properties
    - base_contracts               # Cannot remove inherited contracts
    - required_status              # Cannot make required optional
```

### Inheritance Declaration

Semantic components declare inheritance using the `inherits` field:

```yaml
# Primitive Component (no inheritance)
Input-Text-Base:
  name: Input-Text-Base
  type: primitive
  family: FormInputs
  # No 'inherits' field - primitives don't inherit

# Semantic Component (inherits from primitive)
Input-Text-Email:
  name: Input-Text-Email
  type: semantic
  family: FormInputs
  inherits: Input-Text-Base        # REQUIRED for semantic components
```

### Inheritance Validation Rules

```yaml
# Validation Rules for Inheritance
InheritanceValidation:
  # Rule 1: Semantic components MUST have 'inherits' field
  semantic_requires_inherits:
    condition: type == "semantic"
    requirement: inherits field must be present
    error: "Semantic component must specify 'inherits' field"
  
  # Rule 2: Primitive components MUST NOT have 'inherits' field
  primitive_forbids_inherits:
    condition: type == "primitive"
    requirement: inherits field must be absent
    error: "Primitive component cannot have 'inherits' field"
  
  # Rule 3: 'inherits' must reference a valid primitive
  inherits_must_be_primitive:
    condition: inherits is present
    requirement: referenced component must be type primitive
    error: "Can only inherit from primitive (Base) components"
  
  # Rule 4: 'inherits' must be same family
  inherits_same_family:
    condition: inherits is present
    requirement: referenced component must be same family
    error: "Can only inherit from same family's primitive base"
  
  # Rule 5: Inherited component must exist
  inherits_must_exist:
    condition: inherits is present
    requirement: referenced component must be defined
    error: "Inherited component '[name]' not found"
```

### Resolved Schema (After Inheritance)

When processing a semantic component, inheritance is resolved:

```yaml
# Original Semantic Schema
Input-Text-Email:
  name: Input-Text-Email
  type: semantic
  family: FormInputs
  inherits: Input-Text-Base
  
  behaviors:
    - email-validation
    - email-autocomplete
  
  contracts:
    - name: validates_email_format
      description: Validates input matches email format
      platforms: [web, ios, android]
      required: true

# Resolved Schema (after inheritance processing)
Input-Text-Email (resolved):
  name: Input-Text-Email
  type: semantic
  family: FormInputs
  inherits: Input-Text-Base
  
  # Inherited from Input-Text-Base + extended
  behaviors:
    - focusable              # inherited
    - validatable            # inherited
    - float-label            # inherited
    - email-validation       # extended
    - email-autocomplete     # extended
  
  # Inherited from Input-Text-Base
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
  
  # Inherited from Input-Text-Base + extended
  contracts:
    # Inherited contracts
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
    # Extended contracts
    - name: validates_email_format
      description: Validates input matches email format
      platforms: [web, ios, android]
      required: true
  
  # Inherited from Input-Text-Base
  tokens:
    - typography.input.*
    - color.input.*
    - space.input.*
    - motion.float-label.*
    - radius.input.*
  
  platforms: [web, ios, android]
  readiness: production-ready
```

---

## Schema Validation

### Required Fields by Component Type

```yaml
# Required Fields for Primitive Components
PrimitiveRequiredFields:
  - name                          # Component identifier
  - type                          # Must be "primitive"
  - family                        # Family classification
  - behaviors                     # Behavior list (can be empty)
  - properties                    # Property definitions
  - contracts                     # Contract list
  - tokens                        # Token dependencies
  - platforms                     # Platform support
  - readiness                     # Status indicator

# Required Fields for Semantic Components
SemanticRequiredFields:
  - name                          # Component identifier
  - type                          # Must be "semantic"
  - family                        # Family classification
  - inherits                      # Parent component reference
  - behaviors                     # Extended behaviors (can be empty)
  - contracts                     # Extended contracts (can be empty)
  - platforms                     # Platform support
  - readiness                     # Status indicator
  # Note: properties and tokens are inherited, not required
```

### Validation Error Messages

```yaml
# Schema Validation Errors
ValidationErrors:
  missing_required_field:
    message: "Required field '[field]' is missing"
    severity: error
    
  invalid_type_value:
    message: "Field 'type' must be 'primitive' or 'semantic', got '[value]'"
    severity: error
    
  invalid_readiness_value:
    message: "Field 'readiness' must be one of: production-ready, beta, placeholder, deprecated"
    severity: error
    
  semantic_missing_inherits:
    message: "Semantic component must specify 'inherits' field"
    severity: error
    
  primitive_has_inherits:
    message: "Primitive component cannot have 'inherits' field"
    severity: error
    
  invalid_inherits_reference:
    message: "Inherited component '[name]' not found or is not a primitive"
    severity: error
    
  invalid_property_type:
    message: "Property '[name]' has invalid type '[type]'"
    severity: error
    
  contract_missing_platforms:
    message: "Contract '[name]' must specify platforms"
    severity: error
    
  invalid_platform:
    message: "Invalid platform '[platform]'. Must be: web, ios, or android"
    severity: error
    
  naming_convention_violation:
    message: "Component name '[name]' does not follow [Family]-[Type]-[Variant] pattern"
    severity: error
```

---

## Complete Schema Examples

### Example 1: Primitive Component (Input-Text-Base)

```yaml
Input-Text-Base:
  # Identity
  name: Input-Text-Base
  type: primitive
  family: FormInputs
  version: "1.0.0"
  description: Foundational text input component with core behaviors
  
  # Behaviors
  behaviors:
    - focusable
    - validatable
    - float-label
  
  # Properties
  properties:
    label:
      type: string
      required: true
      description: Field label text displayed above or within input
    value:
      type: string
      required: false
      default: ""
      description: Current input value
    placeholder:
      type: string
      required: false
      description: Placeholder text shown when input is empty
    disabled:
      type: boolean
      required: false
      default: false
      description: Whether input is disabled and non-interactive
    error:
      type: string
      required: false
      description: Error message to display below input
    maxLength:
      type: number
      required: false
      description: Maximum character length allowed
      validation:
        min: 1
    helperText:
      type: string
      required: false
      description: Helper text displayed below input
  
  # Contracts
  contracts:
    - name: provides_float_label_animation
      description: Label animates from placeholder to floating position on focus
      platforms: [web, ios, android]
      required: true
      category: animation
      verification: Label transitions with motion.float-label.* tokens
    
    - name: validates_on_blur
      description: Validation triggers when field loses focus
      platforms: [web, ios, android]
      required: true
      category: validation
      verification: Validation function called on blur event
    
    - name: supports_error_states
      description: Displays error message and visual error indication
      platforms: [web, ios, android]
      required: true
      category: state
      verification: Error styling applied when error prop is set
    
    - name: supports_disabled_state
      description: Prevents interaction when disabled
      platforms: [web, ios, android]
      required: true
      category: state
      verification: All interactions blocked when disabled=true
    
    - name: announces_state_changes
      description: State changes announced to screen readers
      platforms: [web, ios, android]
      required: true
      category: accessibility
      verification: ARIA live regions or native announcements used
  
  # Token Dependencies
  tokens:
    - typography.input.label
    - typography.input.value
    - typography.input.placeholder
    - typography.input.helper
    - typography.input.error
    - color.input.background
    - color.input.border
    - color.input.text
    - color.input.placeholder
    - color.input.error
    - color.input.disabled
    - space.input.padding
    - space.input.gap
    - motion.float-label.duration
    - motion.float-label.easing
    - radius.input.default
  
  # Platform Support
  platforms: [web, ios, android]
  
  # Readiness
  readiness: production-ready
  
  # Accessibility
  accessibility:
    role: textbox
    label_required: true
    announcements:
      - error_state_change
      - validation_result
    keyboard_navigation:
      - tab_to_focus
      - escape_to_blur
  
  # Composition
  composition:
    can_contain: []
    contained_by: [Container-Form-Base, Container-Base]
    slots: []
```

### Example 2: Semantic Component (Input-Text-Email)

```yaml
Input-Text-Email:
  # Identity
  name: Input-Text-Email
  type: semantic
  family: FormInputs
  version: "1.0.0"
  description: Email input with validation and autocomplete
  
  # Inheritance
  inherits: Input-Text-Base
  
  # Extended Behaviors (in addition to inherited)
  behaviors:
    - email-validation
    - email-autocomplete
  
  # Extended Contracts (in addition to inherited)
  contracts:
    - name: validates_email_format
      description: Validates input matches email format (RFC 5322)
      platforms: [web, ios, android]
      required: true
      category: validation
      verification: Email regex validation on blur
    
    - name: provides_email_autocomplete
      description: Suggests email addresses from device/browser
      platforms: [web, ios, android]
      required: true
      category: interaction
      verification: Autocomplete suggestions appear on focus
    
    - name: uses_email_keyboard
      description: Shows email-optimized keyboard on mobile
      platforms: [ios, android]
      required: true
      category: interaction
      verification: Keyboard includes @ and .com shortcuts
  
  # Extensions
  extends:
    validation: email_format
    autocomplete: email
    keyboard: email
    properties:
      inputType: "email"          # Fixed value for HTML input type
  
  # Platform Support
  platforms: [web, ios, android]
  
  # Readiness
  readiness: production-ready
```

### Example 3: Semantic Component (Input-Text-Password)

```yaml
Input-Text-Password:
  # Identity
  name: Input-Text-Password
  type: semantic
  family: FormInputs
  version: "1.0.0"
  description: Secure password input with visibility toggle
  
  # Inheritance
  inherits: Input-Text-Base
  
  # Extended Behaviors
  behaviors:
    - secure-input
    - password-toggle
  
  # Extended Properties
  properties:
    showPassword:
      type: boolean
      required: false
      default: false
      description: Whether password is visible (toggle state)
    minLength:
      type: number
      required: false
      default: 8
      description: Minimum password length for validation
    requireStrength:
      type: enum
      required: false
      default: none
      description: Password strength requirement level
      validation:
        enum: [none, weak, medium, strong]
  
  # Extended Contracts
  contracts:
    - name: provides_secure_input
      description: Input value is masked by default
      platforms: [web, ios, android]
      required: true
      category: state
      verification: Characters displayed as dots/asterisks
    
    - name: supports_password_toggle
      description: User can toggle password visibility
      platforms: [web, ios, android]
      required: true
      category: interaction
      verification: Toggle button reveals/hides password
    
    - name: prevents_autocomplete
      description: Browser/device autocomplete is disabled
      platforms: [web, ios, android]
      required: true
      category: interaction
      verification: autocomplete="new-password" or equivalent
  
  # Extensions
  extends:
    validation: password_strength
    autocomplete: new-password
    keyboard: default
    properties:
      inputType: "password"
  
  # Platform Support
  platforms: [web, ios, android]
  
  # Readiness
  readiness: production-ready
  
  # Accessibility
  accessibility:
    role: textbox
    label_required: true
    announcements:
      - password_visibility_change
      - strength_indicator_change
```

---

## Schema File Organization

### Directory Structure

Component schemas are organized by family:

```
src/components/
├── schemas/
│   ├── index.yaml                    # Schema registry
│   ├── form-inputs/
│   │   ├── Input-Text-Base.yaml
│   │   ├── Input-Text-Email.yaml
│   │   ├── Input-Text-Password.yaml
│   │   └── Input-Text-PhoneNumber.yaml
│   ├── buttons/
│   │   ├── Button-CTA-Base.yaml
│   │   ├── Button-CTA-Primary.yaml
│   │   └── Button-Icon-Base.yaml
│   └── containers/
│       ├── Container-Base.yaml
│       └── Container-Form-Base.yaml
```

### Schema Registry

Central registry of all component schemas:

```yaml
# src/components/schemas/index.yaml
SchemaRegistry:
  version: "1.0.0"
  families:
    FormInputs:
      primitive: Input-Text-Base
      semantics:
        - Input-Text-Email
        - Input-Text-Password
        - Input-Text-PhoneNumber
    Buttons:
      primitive: Button-CTA-Base
      semantics:
        - Button-CTA-Primary
        - Button-CTA-Secondary
        - Button-CTA-Destructive
    Containers:
      primitive: Container-Base
      semantics:
        - Container-Form-Base
```

---

## Integration with Tooling

### Schema Validation Tool

```bash
# Validate a single schema
npm run schema:validate -- src/components/schemas/form-inputs/Input-Text-Email.yaml

# Validate all schemas
npm run schema:validate:all

# Generate resolved schemas (with inheritance applied)
npm run schema:resolve -- Input-Text-Email
```

### IDE Integration

Schema files support:
- YAML syntax highlighting
- Schema validation on save
- Auto-completion for field names
- Inheritance resolution preview

---

## Related Documentation

- [Stemma System Principles](./stemma-system-principles.md) - Core principles and governance
- [Component Readiness Status System](./Component-Readiness-Status.md) - Comprehensive readiness status definitions and transition guidelines
- [Component Development Guide](./Component-Development-Guide.md) - Implementation guidance
- [Token Quick Reference](./Token-Quick-Reference.md) - Token documentation routing

---

*This specification defines the formal schema structure for all Stemma System components, ensuring consistency and enabling automated validation and tooling support.*
