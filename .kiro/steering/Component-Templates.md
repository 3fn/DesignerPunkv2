---
inclusion: manual
---

# Component Family Templates

**Date**: 2026-01-02
**Purpose**: Ready-to-use templates for creating component schemas, inheritance patterns, and behavioral contracts
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, architecture, spec-planning
**Last Reviewed**: 2026-01-02

---

## Overview

This document provides copy-paste templates for creating new component families in the Stemma System. Templates are organized into three categories:

1. **Schema Format Templates** - YAML schemas for primitive and semantic components
2. **Inheritance Pattern Templates** - Patterns for different family structures
3. **Behavioral Contract Templates** - Contract definitions for common behaviors

**Usage**: Copy the appropriate template, replace placeholders (marked with `[PLACEHOLDER]`), and customize for your specific component.

**Related Documentation**:
- [Component Family Development Standards](./Component-Development-Standards.md) - Step-by-step process
- [Stemma System Principles](./stemma-system-principles.md) - Core architecture
- [MCP Component Family Document Template](./Component-MCP-Document-Template.md) - Documentation template

---

## Schema Format Templates

### Template 1: Primitive Base Component Schema

Use this template for foundational components that semantic variants inherit from.

**File Location**: `src/components/core/[Component-Name]/[Component-Name].schema.yaml`

```yaml
# [Component-Name] Component Schema
#
# Stemma System: [Family] Family
# Component Type: Primitive (Base)
# Naming Convention: [Family]-[Type]-Base or [Family]-Base
#
# This schema defines the behavioral contracts and properties for the
# [Component-Name] component, which serves as the foundational primitive
# for all [type] components in the [Family] family.

name: [Component-Name]
type: primitive
family: [FamilyName]
version: "1.0.0"
readiness: [placeholder | beta | production-ready]

# Component description
description: |
  [2-3 sentences describing the component's purpose and role as a primitive base.
  Explain what semantic variants will inherit from this component.]

# Reusable behaviors this component implements
behaviors:
  - [behavior1]
  - [behavior2]
  - [behavior3]
  - accessible

# Component properties (public API)
properties:
  # Required properties
  [requiredProp1]:
    type: [string | boolean | number | enum]
    required: true
    description: |
      [Description of the property and its purpose]
  
  [requiredProp2]:
    type: [string | boolean | number | enum]
    required: true
    description: |
      [Description of the property and its purpose]
  
  # Optional properties
  [optionalProp1]:
    type: [string | boolean | number | enum]
    required: false
    default: [default_value]
    description: |
      [Description of the property and its purpose]
  
  # Callback properties
  [callbackProp]:
    type: "() => void"
    required: [true | false]
    description: |
      [Description of when this callback is invoked]
  
  # Platform-specific properties
  [platformProp]:
    type: [type]
    required: false
    description: |
      [Description of the property]
    platform: [web | ios | android]
  
  # Test support
  testID:
    type: string
    required: false
    description: |
      Test identifier for automated testing. Platform-specific implementation:
      - Web: data-testid attribute
      - iOS: accessibilityIdentifier
      - Android: testTag

# Behavioral contracts - guarantees this component provides
contracts:
  [contract_name_1]:
    description: [Short description of the contract]
    behavior: |
      [Detailed description of the behavior this contract guarantees.
      Include specific implementation details and expected outcomes.]
    wcag: "[WCAG criterion number and name]"
    platforms: [web, ios, android]
    validation: |
      - [How to verify this contract is met]
      - [Additional verification steps]
      - [Platform-specific verification if needed]
  
  [contract_name_2]:
    description: [Short description of the contract]
    behavior: |
      [Detailed description of the behavior]
    wcag: "[WCAG criterion]"
    platforms: [web, ios, android]
    validation: |
      - [Verification steps]

# Design tokens this component requires
tokens:
  typography:
    - typography.[token1]
    - typography.[token2]
  color:
    - color.[token1]
    - color.[token2]
  spacing:
    - space.[token1]
    - space.[token2]
  motion:
    - motion.[token1]
  border:
    - border.[token1]
    - radius.[token1]
  accessibility:
    - accessibility.[token1]
  blend:
    - blend.[token1]

# Supported platforms
platforms:
  - web
  - ios
  - android

# Platform-specific implementation notes
platform_notes:
  web:
    element: "<[component-name]>"
    implementation: Web Component with Shadow DOM
    file: platforms/web/[ComponentName].web.ts
    notes: |
      - [Web-specific implementation note 1]
      - [Web-specific implementation note 2]
  ios:
    implementation: SwiftUI View
    file: platforms/ios/[ComponentName].ios.swift
    notes: |
      - [iOS-specific implementation note 1]
      - [iOS-specific implementation note 2]
  android:
    implementation: Jetpack Compose Composable
    file: platforms/android/[ComponentName].android.kt
    notes: |
      - [Android-specific implementation note 1]
      - [Android-specific implementation note 2]

# Semantic components that inherit from this primitive
semantic_variants:
  - name: [Family]-[Type]-[Variant1]
    extends: [What this variant adds]
    status: [planned | beta | production-ready]
  - name: [Family]-[Type]-[Variant2]
    extends: [What this variant adds]
    status: [planned | beta | production-ready]
  - name: [Family]-[Type]-[Variant3]
    extends: [What this variant adds]
    status: [planned | beta | production-ready]

# Accessibility compliance
accessibility:
  wcag_level: AA
  compliance:
    - "[WCAG criterion] - [How component meets it]"
    - "[WCAG criterion] - [How component meets it]"
    - "[WCAG criterion] - [How component meets it]"
```

---

### Template 2: Semantic Variant Component Schema

Use this template for components that inherit from a primitive base and add specialized functionality.

**File Location**: `src/components/core/[Component-Name]/[Component-Name].schema.yaml`

```yaml
# [Component-Name] Component Schema
#
# Stemma System: [Family] Family
# Component Type: Semantic (Variant)
# Naming Convention: [Family]-[Type]-[Variant]
#
# This schema defines the behavioral contracts and properties for the
# [Component-Name] component, which extends [Base-Component] with
# [specialized functionality description].

name: [Component-Name]
type: semantic
family: [FamilyName]
inherits: [Base-Component-Name]
version: "1.0.0"
readiness: [placeholder | beta | production-ready]

# Component description
description: |
  [2-3 sentences describing the component's specialized purpose.
  Explain what it adds beyond the base component.]

# Reusable behaviors this component implements
# Note: Inherits all behaviors from base component
behaviors:
  # Inherited from base (for reference)
  # - [inherited_behavior1]
  # - [inherited_behavior2]
  # Extended behaviors
  - [extended_behavior1]
  - [extended_behavior2]

# Component properties (public API)
# Note: Inherits all properties from base component
properties:
  # Inherited properties are available but not redefined here
  # See [Base-Component-Name].schema.yaml for inherited properties
  
  # Extended properties (unique to this variant)
  [extendedProp1]:
    type: [string | boolean | number | enum]
    required: [true | false]
    default: [default_value]
    description: |
      [Description of the extended property]
  
  [extendedProp2]:
    type: [string | boolean | number | enum]
    required: [true | false]
    description: |
      [Description of the extended property]

# Behavioral contracts
# Note: Inherits all contracts from base component
contracts:
  # Inherited contracts (for reference)
  # - [inherited_contract1]: See [Base-Component-Name].schema.yaml
  # - [inherited_contract2]: See [Base-Component-Name].schema.yaml
  
  # Extended contracts (unique to this variant)
  [extended_contract_1]:
    description: [Short description of the extended contract]
    behavior: |
      [Detailed description of the specialized behavior]
    wcag: "[WCAG criterion]"
    platforms: [web, ios, android]
    validation: |
      - [Verification steps]
  
  [extended_contract_2]:
    description: [Short description]
    behavior: |
      [Detailed description]
    wcag: "[WCAG criterion]"
    platforms: [web, ios, android]
    validation: |
      - [Verification steps]

# Design tokens this component requires
# Note: Inherits all tokens from base component
tokens:
  # Inherited tokens (for reference)
  # See [Base-Component-Name].schema.yaml for inherited tokens
  
  # Additional tokens (unique to this variant)
  [category]:
    - [additional_token1]
    - [additional_token2]

# Supported platforms
platforms:
  - web
  - ios
  - android

# Platform-specific implementation notes
platform_notes:
  web:
    element: "<[component-name]>"
    implementation: Web Component extending [Base-Component]
    file: platforms/web/[ComponentName].web.ts
    notes: |
      - Extends [Base-Component] web implementation
      - [Variant-specific web note]
  ios:
    implementation: SwiftUI View extending [Base-Component]
    file: platforms/ios/[ComponentName].ios.swift
    notes: |
      - Extends [Base-Component] iOS implementation
      - [Variant-specific iOS note]
  android:
    implementation: Jetpack Compose extending [Base-Component]
    file: platforms/android/[ComponentName].android.kt
    notes: |
      - Extends [Base-Component] Android implementation
      - [Variant-specific Android note]

# Accessibility compliance
accessibility:
  wcag_level: AA
  compliance:
    # Inherits base compliance
    - "[Extended WCAG criterion] - [How variant meets it]"
```

---

### Template 3: Standalone Component Schema

Use this template for components that don't have semantic variants (styling variations via props only).

**File Location**: `src/components/core/[Component-Name]/[Component-Name].schema.yaml`

```yaml
# [Component-Name] Component Schema
#
# Stemma System: [Family] Family
# Component Type: Standalone (no behavioral variants)
# Naming Convention: [Family]-[Type]
#
# This schema defines the behavioral contracts and properties for the
# [Component-Name] component. Styling variations are handled via props,
# not separate components.

name: [Component-Name]
type: standalone
family: [FamilyName]
version: "1.0.0"
readiness: [placeholder | beta | production-ready]

# Component description
description: |
  [2-3 sentences describing the component's purpose.
  Explain that styling variations are handled via props.]

# Reusable behaviors this component implements
behaviors:
  - [behavior1]
  - [behavior2]
  - accessible
  - stateful

# Component properties (public API)
properties:
  # Core properties
  [coreProp1]:
    type: [type]
    required: true
    description: |
      [Description]
  
  # Variant properties (styling, not behavioral)
  size:
    type: "'small' | 'medium' | 'large'"
    required: false
    default: "'medium'"
    description: |
      Size variant controlling dimensions and typography.
      - small: [dimensions]
      - medium: [dimensions]
      - large: [dimensions]
  
  variant:
    type: "'primary' | 'secondary' | 'tertiary'"
    required: false
    default: "'primary'"
    description: |
      Visual variant establishing hierarchy through visual weight.
      - primary: [description]
      - secondary: [description]
      - tertiary: [description]
  
  # State properties
  disabled:
    type: boolean
    required: false
    default: false
    description: |
      When true, component is non-interactive with disabled visual styling.
  
  # Callback properties
  [callbackProp]:
    type: "() => void"
    required: true
    description: |
      [Description]
  
  # Test support
  testID:
    type: string
    required: false
    description: |
      Test identifier for automated testing.

# Behavioral contracts
contracts:
  [contract_1]:
    description: [Description]
    behavior: |
      [Detailed behavior]
    wcag: "[WCAG criterion]"
    platforms: [web, ios, android]
    validation: |
      - [Verification steps]

# Design tokens this component requires
tokens:
  typography:
    - typography.[token]
  color:
    - color.[token]
  spacing:
    - space.[token]
  motion:
    - motion.[token]
  accessibility:
    - accessibility.[token]
  blend:
    - blend.[token]
  component:
    - [componentName].[token]

# Supported platforms
platforms:
  - web
  - ios
  - android

# Platform-specific implementation notes
platform_notes:
  web:
    element: "<[component-name]>"
    implementation: Web Component with Shadow DOM
    file: platforms/web/[ComponentName].web.ts
  ios:
    implementation: SwiftUI View
    file: platforms/ios/[ComponentName].ios.swift
  android:
    implementation: Jetpack Compose Composable
    file: platforms/android/[ComponentName].android.kt

# Size variant specifications
size_variants:
  small:
    height: [number]
    touch_target: [number]
    typography: [token]
    padding: [values]
  medium:
    height: [number]
    touch_target: [number]
    typography: [token]
    padding: [values]
  large:
    height: [number]
    touch_target: [number]
    typography: [token]
    padding: [values]

# Visual variant specifications
visual_variants:
  primary:
    background: [token]
    text: [token]
    emphasis: highest
  secondary:
    background: [token]
    text: [token]
    emphasis: medium
  tertiary:
    background: [token]
    text: [token]
    emphasis: lowest

# Accessibility compliance
accessibility:
  wcag_level: AA
  compliance:
    - "[WCAG criterion] - [How component meets it]"
```

---


## Inheritance Pattern Templates

### Pattern 1: Single-Type Family with Semantic Variants

Use when a family has one type of component with multiple semantic variants.

**Example**: Form Inputs (Input-Text-Base → Input-Text-Email, Input-Text-Password)

```
[Family]-[Type]-Base (Primitive)
    │
    ├── [Family]-[Type]-[Variant1] (Semantic)
    │   └── Extends: [specialized functionality]
    │
    ├── [Family]-[Type]-[Variant2] (Semantic)
    │   └── Extends: [specialized functionality]
    │
    └── [Family]-[Type]-[Variant3] (Semantic)
        └── Extends: [specialized functionality]
```

**Naming Convention**: `[Family]-[Type]-Base` for primitive, `[Family]-[Type]-[Variant]` for semantic

**When to Use**:
- Family has one primary type (e.g., text inputs)
- Multiple semantic variants share the same base behaviors
- Variants add specialized validation, formatting, or functionality

**Template Table**:

| Component | Type | Inherits | Status | Description |
|-----------|------|----------|--------|-------------|
| [Family]-[Type]-Base | Primitive | - | [Status] | Foundational [type] with base behaviors |
| [Family]-[Type]-[Variant1] | Semantic | [Family]-[Type]-Base | [Status] | [Specialized purpose] |
| [Family]-[Type]-[Variant2] | Semantic | [Family]-[Type]-Base | [Status] | [Specialized purpose] |
| [Family]-[Type]-[Variant3] | Semantic | [Family]-[Type]-Base | [Status] | [Specialized purpose] |

---

### Pattern 2: Multi-Type Family with Shared Base

Use when a family has multiple types that share some common behaviors.

**Example**: Form Inputs with multiple input types (Text, Select, Checkbox)

```
[Family]-Base (Abstract/Shared Behaviors)
    │
    ├── [Family]-[Type1]-Base (Primitive)
    │   ├── [Family]-[Type1]-[Variant1] (Semantic)
    │   └── [Family]-[Type1]-[Variant2] (Semantic)
    │
    ├── [Family]-[Type2]-Base (Primitive)
    │   ├── [Family]-[Type2]-[Variant1] (Semantic)
    │   └── [Family]-[Type2]-[Variant2] (Semantic)
    │
    └── [Family]-[Type3]-Base (Primitive)
        └── [Family]-[Type3]-[Variant1] (Semantic)
```

**Naming Convention**: 
- Shared base: `[Family]-Base` (if needed)
- Type primitives: `[Family]-[Type]-Base`
- Semantic variants: `[Family]-[Type]-[Variant]`

**When to Use**:
- Family has multiple distinct types (e.g., text inputs, select inputs, checkboxes)
- Types share some common behaviors but have type-specific behaviors
- Each type may have its own semantic variants

**Template Table**:

| Component | Type | Inherits | Status | Description |
|-----------|------|----------|--------|-------------|
| [Family]-[Type1]-Base | Primitive | - | [Status] | Foundational [type1] component |
| [Family]-[Type1]-[Variant1] | Semantic | [Family]-[Type1]-Base | [Status] | [Purpose] |
| [Family]-[Type2]-Base | Primitive | - | [Status] | Foundational [type2] component |
| [Family]-[Type2]-[Variant1] | Semantic | [Family]-[Type2]-Base | [Status] | [Purpose] |

---

### Pattern 3: Simple Family with Base Only

Use when a family has a foundational component without semantic variants (yet).

**Example**: Containers (Container-Base), Icons (Icon-Base)

```
[Family]-Base (Primitive)
    │
    ├── [Future: [Family]-[Variant1]] (Semantic) [PLANNED]
    ├── [Future: [Family]-[Variant2]] (Semantic) [PLANNED]
    └── [Future: [Family]-[Variant3]] (Semantic) [PLANNED]
```

**Naming Convention**: `[Family]-Base` for primitive

**When to Use**:
- Family provides foundational functionality
- Semantic variants are planned but not yet implemented
- Primitive usage is legitimate for coverage gaps

**Template Table**:

| Component | Type | Inherits | Status | Description |
|-----------|------|----------|--------|-------------|
| [Family]-Base | Primitive | - | [Status] | Foundational [family] component |
| [Family]-[Variant1] | Semantic | [Family]-Base | 🔴 Planned | [Planned purpose] |
| [Family]-[Variant2] | Semantic | [Family]-Base | 🔴 Planned | [Planned purpose] |

---

### Pattern 4: Standalone Component (No Variants)

Use when a component has styling variations via props but no behavioral variants.

**Example**: Button-CTA (primary/secondary/tertiary via `variant` prop)

```
[Family]-[Type] (Standalone)
    │
    └── Styling via props: variant, size, etc.
        ├── variant="primary"
        ├── variant="secondary"
        └── variant="tertiary"
```

**Naming Convention**: `[Family]-[Type]` (no `-Base` suffix needed)

**When to Use**:
- Component has styling variations, not behavioral variations
- All variations share identical behavioral contracts
- Props control visual appearance, not functionality

**Template Table**:

| Component | Type | Inherits | Status | Description |
|-----------|------|----------|--------|-------------|
| [Family]-[Type] | Standalone | - | [Status] | [Description] with styling via props |

---

### Pattern 5: Family with Status Variants

Use when semantic variants represent different states or statuses.

**Example**: Badges (Badge-Status-Success, Badge-Status-Warning, Badge-Status-Error)

```
[Family]-[Type]-Base (Primitive)
    │
    ├── [Family]-[Type]-Success (Semantic)
    │   └── Extends: success-specific styling and semantics
    │
    ├── [Family]-[Type]-Warning (Semantic)
    │   └── Extends: warning-specific styling and semantics
    │
    ├── [Family]-[Type]-Error (Semantic)
    │   └── Extends: error-specific styling and semantics
    │
    └── [Family]-[Type]-Info (Semantic)
        └── Extends: info-specific styling and semantics
```

**Naming Convention**: `[Family]-[Type]-[Status]` for semantic variants

**When to Use**:
- Variants represent semantic states (success, warning, error, info)
- Each variant has specific accessibility requirements
- Status affects both styling AND behavior (e.g., ARIA roles)

---

## Behavioral Contract Templates

### Contract Category 1: Interaction Contracts

#### Focusable Contract

```yaml
focusable:
  description: Can receive keyboard focus
  behavior: |
    Component can receive focus via Tab key navigation.
    Focus state is visually indicated with a focus ring.
    Focus is managed appropriately when disabled state changes.
  wcag: "2.1.1 Keyboard, 2.4.7 Focus Visible"
  platforms: [web, ios, android]
  validation: |
    - Tab key moves focus to component
    - Focus state is visually distinct with focus ring
    - Focus ring meets 3:1 contrast ratio
    - Disabled components are not focusable
```

#### Pressable Contract

```yaml
pressable:
  description: Responds to press/click events
  behavior: |
    Component responds to click, tap, Enter key, and Space key.
    Press triggers the callback when not disabled.
    Platform-appropriate feedback is provided during press.
  wcag: "2.1.1 Keyboard"
  platforms: [web, ios, android]
  validation: |
    - Click/tap triggers callback
    - Enter key triggers callback
    - Space key triggers callback
    - Callback not called when disabled
```

#### Hoverable Contract

```yaml
hoverable:
  description: Visual feedback on hover (pointer devices only)
  behavior: |
    On pointer devices, component shows visual feedback when mouse
    hovers over the component. Uses blend.hoverDarker token.
    Hover state not shown when disabled.
  wcag: "1.4.13 Content on Hover or Focus"
  platforms: [web, ios, android]
  validation: |
    - Visual feedback shown on mouse enter
    - Visual feedback removed on mouse leave
    - Hover uses blend.hoverDarker token
    - Hover state not shown when disabled
    - iOS: Only on macOS/iPadOS with pointer
    - Android: Only on desktop/ChromeOS with pointer
```

---

### Contract Category 2: State Contracts

#### Disabled State Contract

```yaml
disabled_state:
  description: Prevents interaction when disabled
  behavior: |
    When disabled, component:
    - Cannot receive focus
    - Cannot be interacted with
    - Uses desaturated colors (blend.disabledDesaturate)
    - Shows cursor: not-allowed (web)
    - Communicates disabled state to assistive technology
  wcag: "4.1.2 Name, Role, Value"
  platforms: [web, ios, android]
  validation: |
    - Component cannot receive focus when disabled
    - Interactions do not trigger callbacks when disabled
    - Visual styling indicates disabled state
    - aria-disabled="true" set (web)
    - Disabled state announced to screen readers
```

#### Error State Contract

```yaml
error_state:
  description: Shows error message and styling
  behavior: |
    When in error state, component displays:
    - Error color styling (color.error)
    - Error icon (if applicable)
    - Error message (if provided)
    Error state is communicated to assistive technology.
  wcag: "3.3.1 Error Identification, 1.4.1 Use of Color"
  platforms: [web, ios, android]
  validation: |
    - Error styling applied when in error state
    - Error icon appears (if applicable)
    - Error message displayed and associated via aria-describedby
    - Error state announced to screen readers
    - Error indication not solely through color
```

#### Success State Contract

```yaml
success_state:
  description: Shows success styling
  behavior: |
    When in success state, component displays:
    - Success color styling (color.success.strong)
    - Success icon (if applicable)
    Success state provides positive feedback to user.
  wcag: "1.4.1 Use of Color"
  platforms: [web, ios, android]
  validation: |
    - Success styling applied when in success state
    - Success icon appears (if applicable)
    - Success indication not solely through color
```

#### Loading State Contract

```yaml
loading_state:
  description: Shows loading indicator during async operations
  behavior: |
    When in loading state, component:
    - Shows loading spinner or indicator
    - Prevents interaction (similar to disabled)
    - Maintains dimensions to prevent layout shift
    - Communicates loading state to assistive technology
  wcag: "4.1.3 Status Messages"
  platforms: [web, ios, android]
  validation: |
    - Loading indicator displayed
    - Interaction prevented during loading
    - Component dimensions maintained
    - Loading state announced to screen readers
```

---

### Contract Category 3: Accessibility Contracts

#### Focus Ring Contract

```yaml
focus_ring:
  description: WCAG 2.4.7 focus visible indicator
  behavior: |
    When focused via keyboard, component displays:
    - 2px focus ring (accessibility.focus.width)
    - 2px offset (accessibility.focus.offset)
    - Primary color (accessibility.focus.color)
    Focus ring visible in all states.
    Uses :focus-visible (web) for keyboard-only focus indication.
  wcag: "2.4.7 Focus Visible"
  platforms: [web, ios, android]
  validation: |
    - Focus ring appears on keyboard focus
    - Focus ring meets 3:1 contrast ratio
    - Focus ring visible in all component states
    - Focus ring uses :focus-visible for keyboard-only (web)
```

#### Reduced Motion Support Contract

```yaml
reduced_motion_support:
  description: Respects prefers-reduced-motion
  behavior: |
    When user has reduced motion preference:
    - Animations are disabled or minimized
    - State changes occur instantly without animation
    - Functionality remains unchanged
  wcag: "2.3.3 Animation from Interactions"
  platforms: [web, ios, android]
  validation: |
    - Animations disabled when prefers-reduced-motion: reduce
    - State changes still occur, just without animation
    - Functionality unchanged with reduced motion
```

#### Screen Reader Hidden Contract (Decorative)

```yaml
accessibility_hidden:
  description: Decorative elements hidden from assistive technology
  behavior: |
    Decorative elements are hidden from assistive technology.
    Parent elements provide accessible context through
    text content or aria-label attributes.
    Platform-specific implementation:
    - Web: aria-hidden="true"
    - iOS: .accessibilityHidden(true)
    - Android: contentDescription = null
  wcag: "1.1.1 Non-text Content"
  platforms: [web, ios, android]
  validation: |
    - Element not announced by screen readers
    - Element not included in accessibility tree
    - Parent elements provide accessible context
```

---

### Contract Category 4: Visual Contracts

#### Float Label Animation Contract

```yaml
float_label_animation:
  description: Label animates on focus
  behavior: |
    Label smoothly transitions from placeholder position inside component
    to floated position above component when focused or filled.
    Animation uses motion token for timing.
    Animation respects prefers-reduced-motion.
  wcag: "2.3.3 Animation from Interactions"
  platforms: [web, ios, android]
  validation: |
    - Label animates from inside to above on focus
    - Label stays floated when component has content
    - Animation respects prefers-reduced-motion
    - Animation timing matches motion token
```

#### Pressed State Visual Contract

```yaml
pressed_state:
  description: Visual feedback when pressed
  behavior: |
    Component shows visual feedback during active press/click.
    Uses blend.pressedDarker token for color change.
    Platform-specific feedback patterns:
    - Web: Background color change
    - iOS: Scale animation with haptic feedback
    - Android: Ripple effect with haptic feedback
  wcag: "2.4.7 Focus Visible"
  platforms: [web, ios, android]
  validation: |
    - Visual feedback shown during press
    - Feedback uses blend.pressedDarker token
    - Platform-appropriate animation/effect applied
    - Pressed state not shown when disabled
```

---

### Contract Category 5: Validation Contracts

#### Validates On Blur Contract

```yaml
validates_on_blur:
  description: Validation triggers on blur
  behavior: |
    Validation state is evaluated when component loses focus.
    Error or success state is applied based on validation result.
    Validation callback is invoked with current value.
  wcag: "3.3.1 Error Identification"
  platforms: [web, ios, android]
  validation: |
    - Blur event triggers validation callback
    - Error state applied when validation fails
    - Success state applied when validation succeeds
    - Validation result communicated to assistive technology
```

#### Custom Validation Contract

```yaml
custom_validation:
  description: Supports custom validation function
  behavior: |
    Component accepts a custom validation function that receives
    the current value and returns a validation result.
    Custom validation integrates with error/success state display.
  wcag: "3.3.1 Error Identification"
  platforms: [web, ios, android]
  validation: |
    - Custom validator function is called with current value
    - Validation result determines error/success state
    - Custom error messages are displayed when provided
```

---

### Contract Category 6: Content Contracts

#### Contains Children Contract

```yaml
contains_children:
  description: Can contain child components
  behavior: |
    Component can contain any child components or content.
    Children are rendered inside the component with applied styling.
    Platform-specific implementation:
    - Web: Uses <slot> element for content projection
    - iOS: Uses @ViewBuilder for child content
    - Android: Uses Composable content lambda
  wcag: "1.3.1 Info and Relationships"
  platforms: [web, ios, android]
  validation: |
    - Child content renders inside component
    - Component styling does not affect child styling
    - Children maintain their own accessibility properties
```

#### Renders SVG Contract

```yaml
renders_svg:
  description: Renders inline SVG with correct attributes
  behavior: |
    Component renders an inline SVG element with:
    - Correct viewBox attribute
    - Appropriate fill/stroke attributes
    - Proper sizing based on size prop
    SVG content is loaded based on name from internal map.
  wcag: N/A
  platforms: [web, ios, android]
  validation: |
    - SVG element renders with correct viewBox
    - Stroke/fill attributes match specification
    - Content matches requested name
    - Fallback provided if name not found
```

---

## Quick Reference: Template Selection

### Schema Template Selection

| Scenario | Template | Example |
|----------|----------|---------|
| Foundational component with semantic variants | Primitive Base | Input-Text-Base |
| Component extending a primitive base | Semantic Variant | Input-Text-Email |
| Component with styling props, no behavioral variants | Standalone | Button-CTA |

### Inheritance Pattern Selection

| Scenario | Pattern | Example |
|----------|---------|---------|
| One type with multiple semantic variants | Single-Type Family | Form Inputs (Text) |
| Multiple types sharing some behaviors | Multi-Type Family | Form Inputs (Text, Select, Checkbox) |
| Foundational component, variants planned | Simple Family | Containers |
| Styling variations via props only | Standalone | Buttons |
| Variants represent semantic states | Status Variants | Badges |

### Contract Selection by Behavior

| Behavior Needed | Contract(s) to Include |
|-----------------|------------------------|
| Keyboard navigation | focusable, focus_ring |
| Click/tap interaction | pressable, pressed_state |
| Mouse hover feedback | hoverable |
| Disabled state | disabled_state |
| Error handling | error_state, validates_on_blur |
| Success feedback | success_state |
| Loading indication | loading_state |
| Animation support | reduced_motion_support |
| Decorative elements | accessibility_hidden |
| Form validation | validates_on_blur, custom_validation |
| Container behavior | contains_children |
| Icon rendering | renders_svg, accessibility_hidden |

---

## Related Documentation

- [Component Family Development Standards](./Component-Development-Standards.md) - Step-by-step process
- [Stemma System Principles](./stemma-system-principles.md) - Core architecture and governance
- [MCP Component Family Document Template](./Component-MCP-Document-Template.md) - Documentation template
- [Component Family Inheritance Structures](./Component-Inheritance-Structures.md) - All family structures
- [Component Quick Reference](./Component-Quick-Reference.md) - Family routing table

---

*These templates provide ready-to-use starting points for creating new component families in the Stemma System. Copy, customize, and follow the Component Family Development Standards for complete implementation guidance.*
