---
inclusion: manual
---

# Platform Implementation Guidelines

**Date**: 2026-01-02
**Purpose**: Guidelines for maintaining cross-platform behavioral consistency while allowing platform-appropriate optimizations
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, cross-platform-validation, testing
**Last Reviewed**: 2026-01-02

---

## Overview

This document provides guidelines for implementing Stemma System components across web, iOS, and Android platforms. It establishes rules for maintaining behavioral consistency while allowing platform-specific optimizations that enhance the native user experience.

**Key Principle**: Behavioral contracts define WHAT behavior occurs. Platform implementations define HOW that behavior is achieved using platform-native patterns.

---

## Guidelines for Maintaining Consistency

### 1. Behavioral Contract Compliance

Every platform implementation MUST honor all behavioral contracts defined in the component schema.

**Compliance Checklist**:
```yaml
behavioral_contract_compliance:
  required:
    - All contracts in schema are implemented
    - Trigger conditions are identical across platforms
    - State transitions follow same logical flow
    - Observable outcomes are functionally equivalent
    - Accessibility semantics are preserved
    
  verification:
    - Run behavioral contract validation tests
    - Verify cross-platform consistency tests pass
    - Document any platform-specific considerations
```

**Example - Float Label Animation Contract**:
```
Contract: provides_float_label_animation

All platforms MUST:
✅ Animate label from placeholder to floating position on focus
✅ Animate label back when unfocused AND empty
✅ Keep label floated when value is present
✅ Respect prefers-reduced-motion preference
✅ Use motion.floatLabel token for duration

Platforms MAY vary:
✓ Animation implementation (CSS, SwiftUI, Compose)
✓ Easing curve (within visual similarity)
✓ Exact pixel positioning (within tolerance)
```

### 2. Property Name Consistency

All platforms MUST use identical property names for component APIs.

**Property Naming Rules**:
| Rule | Example | Rationale |
|------|---------|-----------|
| Same property names | `label`, `value`, `disabled` | AI agents can predict API |
| Same property types | `disabled: boolean` | Consistent behavior |
| Same default values | `disabled: false` | Predictable defaults |
| Same required status | `label: required` | Consistent validation |

**Cross-Platform Property Example**:
```typescript
// Web (TypeScript)
interface InputTextBaseProps {
  label: string;        // required
  value?: string;       // optional, default: ""
  placeholder?: string; // optional
  disabled?: boolean;   // optional, default: false
  error?: string;       // optional
}
```

```swift
// iOS (Swift)
struct InputTextBase: View {
  let label: String           // required
  var value: String = ""      // optional, default: ""
  var placeholder: String?    // optional
  var disabled: Bool = false  // optional, default: false
  var error: String?          // optional
}
```

```kotlin
// Android (Kotlin)
@Composable
fun InputTextBase(
  label: String,              // required
  value: String = "",         // optional, default: ""
  placeholder: String? = null,// optional
  disabled: Boolean = false,  // optional, default: false
  error: String? = null       // optional
)
```

### 3. Token Usage Consistency

All platforms MUST use the same design tokens for visual properties.

**Token Mapping Requirements**:
```yaml
token_consistency:
  required:
    - Same token names referenced across platforms
    - Token values resolved through platform-specific mechanisms
    - No hardcoded values that bypass tokens
    
  platform_mechanisms:
    web: CSS Custom Properties (--dp-*)
    ios: DesignTokens Swift package
    android: DesignTokens Kotlin package
```

**Example - Focus Ring Token Usage**:
```css
/* Web */
.input-text-base:focus-visible {
  outline: var(--dp-accessibility-focus-width) solid var(--dp-accessibility-focus-color);
  outline-offset: var(--dp-accessibility-focus-offset);
}
```

```swift
// iOS
.overlay(
  RoundedRectangle(cornerRadius: DesignTokens.radius.input)
    .stroke(DesignTokens.accessibility.focus.color, lineWidth: DesignTokens.accessibility.focus.width)
    .padding(-DesignTokens.accessibility.focus.offset)
)
```

```kotlin
// Android
Modifier.border(
  width = DesignTokens.accessibility.focus.width,
  color = DesignTokens.accessibility.focus.color,
  shape = RoundedCornerShape(DesignTokens.radius.input)
)
```

### 4. Accessibility Consistency

All platforms MUST provide equivalent accessibility support using platform-native APIs.

**Accessibility Equivalence Matrix**:
| Accessibility Feature | Web | iOS | Android |
|----------------------|-----|-----|---------|
| **Label association** | `<label for>` or `aria-labelledby` | `.accessibilityLabel()` | `contentDescription` |
| **Error announcement** | `role="alert"` + `aria-describedby` | `.accessibilityHint()` | `semantics { error() }` |
| **Disabled state** | `aria-disabled="true"` | `.disabled()` | `enabled = false` |
| **Focus management** | `tabindex`, `:focus-visible` | `@FocusState` | `FocusRequester` |
| **Screen reader** | ARIA attributes | VoiceOver modifiers | TalkBack semantics |

**Example - Error State Accessibility**:
```html
<!-- Web -->
<input aria-invalid="true" aria-describedby="error-msg" />
<span id="error-msg" role="alert">Invalid email format</span>
```

```swift
// iOS
TextField(...)
  .accessibilityLabel(label)
  .accessibilityHint(error ?? "")
  .accessibilityValue(value)
```

```kotlin
// Android
OutlinedTextField(
  modifier = Modifier.semantics {
    if (error != null) {
      error(error)
    }
  }
)
```

### 5. State Management Consistency

All platforms MUST manage component states identically.

**State Consistency Requirements**:
```yaml
state_management:
  states:
    - default: Initial state, ready for interaction
    - focused: Component has keyboard/input focus
    - disabled: Interaction prevented
    - error: Validation failed, error displayed
    - hover: Mouse over (desktop only)
    - pressed: Active press/click
    
  transitions:
    - States transition on same triggers across platforms
    - State combinations are handled identically
    - State persistence follows same rules
```

**State Transition Diagram** (applies to all platforms):
```
┌─────────┐    focus    ┌─────────┐
│ Default │────────────▶│ Focused │
└─────────┘◀────────────└─────────┘
     │         blur          │
     │                       │
     │ disable               │ disable
     ▼                       ▼
┌─────────┐             ┌─────────┐
│Disabled │             │Disabled │
└─────────┘             │+Focused │
                        └─────────┘
```

---

## Acceptable Platform-Specific Optimizations

### Category 1: Native UI Patterns (ALLOWED)

Platform-specific UI patterns that enhance native user experience are acceptable when they don't violate behavioral contracts.

**Allowed Optimizations**:

| Optimization | Web | iOS | Android | Rationale |
|--------------|-----|-----|---------|-----------|
| **Haptic feedback** | N/A | ✅ UIImpactFeedbackGenerator | ✅ HapticFeedback | Native touch feedback |
| **Native gestures** | N/A | ✅ Swipe, long-press | ✅ Swipe, long-press | Platform conventions |
| **Keyboard types** | `inputmode` | Native keyboard | Native keyboard | Platform keyboards |
| **System dialogs** | Browser dialogs | UIAlertController | AlertDialog | Native dialog patterns |
| **Pull-to-refresh** | Custom | ✅ Native | ✅ Native | Platform convention |

**Example - Haptic Feedback**:
```swift
// iOS - Acceptable platform optimization
Button(action: {
  let impact = UIImpactFeedbackGenerator(style: .medium)
  impact.impactOccurred()
  onPress()
}) {
  // Button content
}
```

```kotlin
// Android - Acceptable platform optimization
Button(
  onClick = {
    view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
    onPress()
  }
)
```

### Category 2: Animation Implementation (ALLOWED)

Different animation APIs are acceptable when visual outcome is equivalent.

**Animation Equivalence Guidelines**:
```yaml
animation_equivalence:
  must_match:
    - Animation presence (animated vs instant)
    - Animation duration (within ±50ms tolerance)
    - Animation trigger conditions
    - Reduced motion behavior
    
  may_vary:
    - Easing curve implementation (visually similar)
    - Animation API (CSS, SwiftUI, Compose)
    - Frame rate (platform-dependent)
```

**Example - Float Label Animation**:
```css
/* Web - CSS Transitions */
.label {
  transition: transform var(--dp-motion-float-label-duration) ease-out,
              font-size var(--dp-motion-float-label-duration) ease-out;
}
.label.floated {
  transform: translateY(-20px);
  font-size: 12px;
}
```

```swift
// iOS - SwiftUI Animation
withAnimation(.easeOut(duration: DesignTokens.motion.floatLabel.duration)) {
  labelOffset = isFocused || !value.isEmpty ? -20 : 0
  labelScale = isFocused || !value.isEmpty ? 0.75 : 1.0
}
```

```kotlin
// Android - Compose Animation
val labelOffset by animateFloatAsState(
  targetValue = if (isFocused || value.isNotEmpty()) -20f else 0f,
  animationSpec = tween(
    durationMillis = DesignTokens.motion.floatLabel.duration,
    easing = FastOutSlowInEasing
  )
)
```

### Category 3: Rendering Optimizations (ALLOWED)

Platform-specific rendering optimizations are acceptable when they don't affect behavior.

**Allowed Rendering Optimizations**:
| Optimization | Description | Platforms |
|--------------|-------------|-----------|
| **Shadow DOM** | Encapsulation for web components | Web only |
| **Layer promotion** | GPU acceleration hints | All |
| **Lazy loading** | Deferred rendering | All |
| **View recycling** | Memory optimization | iOS, Android |
| **Subpixel rendering** | Text clarity | Platform-dependent |

### Category 4: Platform-Specific Accessibility (ALLOWED)

Enhanced accessibility features beyond minimum requirements are encouraged.

**Allowed Accessibility Enhancements**:
```yaml
accessibility_enhancements:
  ios:
    - VoiceOver custom actions
    - Accessibility rotor support
    - Dynamic Type support
    - Reduce Transparency support
    
  android:
    - TalkBack custom actions
    - Switch Access support
    - Font scaling support
    - High contrast support
    
  web:
    - ARIA live regions
    - Skip links
    - Focus trap management
    - High contrast mode support
```

---

## Prohibited Platform Variations

### Category 1: Contract Violations (PROHIBITED)

Any variation that breaks a behavioral contract is prohibited.

**Prohibited Variations**:
```yaml
contract_violations:
  prohibited:
    - Omitting a required contract on any platform
    - Changing trigger conditions between platforms
    - Different state transition logic
    - Missing accessibility announcements
    - Ignoring reduced motion preference
    
  examples:
    - ❌ Web has float label, iOS doesn't
    - ❌ Android validates on change, others on blur
    - ❌ iOS announces errors, web doesn't
```

### Category 2: Property Inconsistencies (PROHIBITED)

Property API differences between platforms are prohibited.

**Prohibited Property Variations**:
```yaml
property_inconsistencies:
  prohibited:
    - Different property names (label vs title)
    - Different property types (string vs enum)
    - Different default values
    - Different required status
    
  examples:
    - ❌ Web: disabled, iOS: isDisabled
    - ❌ Web: error (string), Android: hasError (boolean)
    - ❌ iOS default: true, Android default: false
```

### Category 3: Token Bypasses (PROHIBITED)

Hardcoded values that bypass the token system are prohibited.

**Prohibited Token Bypasses**:
```yaml
token_bypasses:
  prohibited:
    - Hardcoded colors (use color.* tokens)
    - Hardcoded spacing (use space.* tokens)
    - Hardcoded typography (use typography.* tokens)
    - Hardcoded motion (use motion.* tokens)
    
  examples:
    - ❌ color: #FF0000 (use color.error)
    - ❌ padding: 16px (use space.inset.md)
    - ❌ duration: 200ms (use motion.floatLabel.duration)
```

### Category 4: Accessibility Regressions (PROHIBITED)

Reducing accessibility support on any platform is prohibited.

**Prohibited Accessibility Regressions**:
```yaml
accessibility_regressions:
  prohibited:
    - Missing label associations
    - Missing error announcements
    - Missing focus indicators
    - Missing keyboard navigation
    - Ignoring system accessibility settings
    
  examples:
    - ❌ Web has ARIA, iOS missing VoiceOver support
    - ❌ Focus ring on web, none on Android
    - ❌ Keyboard nav on web, not on iOS with keyboard
```

---

## Validation Process for Future Families

### Phase 1: Pre-Implementation Validation

Before implementing a new component family, validate the design.

**Pre-Implementation Checklist**:
```yaml
pre_implementation:
  schema_validation:
    - [ ] Component schema follows YAML format
    - [ ] All required fields present (name, type, family, contracts, platforms)
    - [ ] Behavioral contracts are well-defined
    - [ ] Token dependencies are specified
    - [ ] Inheritance relationships are clear (for semantic components)
    
  contract_review:
    - [ ] Each contract has clear trigger conditions
    - [ ] Each contract has measurable outcomes
    - [ ] WCAG references included for accessibility contracts
    - [ ] Contracts are platform-agnostic (WHAT not HOW)
    
  human_ai_checkpoint:
    - [ ] Schema reviewed with Human
    - [ ] Contracts approved
    - [ ] Platform considerations discussed
```

### Phase 2: Implementation Validation

During implementation, validate each platform against contracts.

**Implementation Validation Checklist**:
```yaml
implementation_validation:
  per_platform:
    - [ ] All contracts implemented
    - [ ] Property names match schema
    - [ ] Token usage verified (no hardcoded values)
    - [ ] Accessibility patterns implemented
    - [ ] State management follows schema
    
  cross_platform:
    - [ ] Property APIs are identical
    - [ ] Behavioral outcomes are equivalent
    - [ ] Token references are consistent
    - [ ] Accessibility semantics are equivalent
```

### Phase 3: Automated Testing Validation

Run the automated test suite to verify consistency.

**Test Suite Execution**:
```bash
# Run behavioral contract validation tests
npm test -- --testPathPatterns="stemma-system/behavioral-contract-validation"

# Run cross-platform consistency tests
npm test -- --testPathPatterns="stemma-system/cross-platform-consistency"

# Run family-specific contract tests
npm test -- --testPathPatterns="stemma-system/[family]-contracts"

# Run full Stemma System test suite
npm test -- --testPathPatterns="stemma-system"
```

**Test Coverage Requirements**:
```yaml
test_coverage:
  required:
    - Schema validation tests (all components)
    - Platform parity tests (all platforms declared)
    - Contract implementation tests (all contracts)
    - Token usage tests (no hardcoded values)
    - Accessibility tests (WCAG compliance)
    
  optional:
    - Visual regression tests
    - Performance benchmarks
    - Animation timing tests
```

### Phase 4: Manual Verification

Perform manual verification for aspects that can't be automated.

**Manual Verification Checklist**:
```yaml
manual_verification:
  visual_review:
    - [ ] Component looks correct on each platform
    - [ ] Animations are smooth and equivalent
    - [ ] States are visually distinct
    - [ ] Error states are clear
    
  accessibility_testing:
    - [ ] VoiceOver testing (iOS)
    - [ ] TalkBack testing (Android)
    - [ ] Screen reader testing (web - NVDA/JAWS)
    - [ ] Keyboard navigation testing (all platforms)
    
  behavioral_testing:
    - [ ] Trigger conditions work as expected
    - [ ] State transitions are correct
    - [ ] Edge cases handled properly
```

### Phase 5: Documentation and Sign-off

Complete documentation and obtain sign-off.

**Documentation Requirements**:
```yaml
documentation:
  required:
    - [ ] Component schema YAML complete
    - [ ] README.md with usage examples
    - [ ] Platform-specific considerations documented
    - [ ] Test results documented
    
  sign_off:
    - [ ] Human-AI checkpoint completed
    - [ ] All tests passing
    - [ ] Manual verification complete
    - [ ] Readiness status set appropriately
```

---

## Validation Process Flowchart

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEW COMPONENT FAMILY                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: PRE-IMPLEMENTATION                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Schema          │  │ Contract        │  │ Human-AI        │ │
│  │ Validation      │──│ Review          │──│ Checkpoint      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: IMPLEMENTATION                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Web             │  │ iOS             │  │ Android         │ │
│  │ Implementation  │  │ Implementation  │  │ Implementation  │ │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘ │
│           │                    │                    │          │
│           └────────────────────┼────────────────────┘          │
│                                ▼                               │
│                    ┌─────────────────────┐                     │
│                    │ Cross-Platform      │                     │
│                    │ Validation          │                     │
│                    └─────────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: AUTOMATED TESTING                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Behavioral      │  │ Cross-Platform  │  │ Family-Specific │ │
│  │ Contract Tests  │  │ Consistency     │  │ Contract Tests  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  All tests must pass before proceeding                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: MANUAL VERIFICATION                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Visual          │  │ Accessibility   │  │ Behavioral      │ │
│  │ Review          │  │ Testing         │  │ Testing         │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 5: DOCUMENTATION & SIGN-OFF                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Schema &        │  │ Test Results    │  │ Human-AI        │ │
│  │ README          │  │ Documentation   │  │ Sign-off        │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT FAMILY READY                        │
│                    Readiness: Production Ready 🟢                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Platform-Specific Implementation Patterns

### Web Implementation Patterns

```yaml
web_patterns:
  component_format: Web Components (Custom Elements)
  shadow_dom: Recommended for encapsulation
  
  token_consumption:
    method: CSS Custom Properties
    prefix: --dp-
    example: var(--dp-color-primary)
    
  accessibility:
    method: ARIA attributes
    focus: :focus-visible pseudo-class
    announcements: role="alert", aria-live
    
  state_management:
    method: Component properties + CSS classes
    reactive: Property change triggers re-render
    
  event_handling:
    method: Custom Events
    bubbling: Configurable per event
```

### iOS Implementation Patterns

```yaml
ios_patterns:
  component_format: SwiftUI Views
  
  token_consumption:
    method: DesignTokens Swift package
    access: DesignTokens.category.subcategory
    example: DesignTokens.color.primary
    
  accessibility:
    method: SwiftUI accessibility modifiers
    focus: @FocusState property wrapper
    announcements: .accessibilityLabel, .accessibilityHint
    
  state_management:
    method: @State, @Binding, @ObservedObject
    reactive: SwiftUI automatic view updates
    
  event_handling:
    method: Closures and callbacks
    pattern: onAction: () -> Void
```

### Android Implementation Patterns

```yaml
android_patterns:
  component_format: Jetpack Compose Composables
  
  token_consumption:
    method: DesignTokens Kotlin package
    access: DesignTokens.category.subcategory
    example: DesignTokens.color.primary
    
  accessibility:
    method: Compose semantics
    focus: FocusRequester, focusable modifier
    announcements: semantics { contentDescription, error }
    
  state_management:
    method: remember, mutableStateOf, State hoisting
    reactive: Compose recomposition
    
  event_handling:
    method: Lambda callbacks
    pattern: onAction: () -> Unit
```

---

## Tolerance Levels Reference

### Animation Tolerances

| Aspect | Tolerance | Rationale |
|--------|-----------|-----------|
| Duration | ±50ms | Platform animation systems vary |
| Easing | Visually similar | Exact curves may differ |
| Frame rate | Platform-dependent | Hardware differences |

### Visual Tolerances

| Aspect | Tolerance | Rationale |
|--------|-----------|-----------|
| Color | ±2 RGB per channel | Display rendering varies |
| Spacing | ±1px | Subpixel rendering |
| Border radius | ±1px | Platform rendering |
| Font size | ±0.5px | Font rendering engines |

### Behavioral Tolerances

| Aspect | Tolerance | Rationale |
|--------|-----------|-----------|
| Debounce timing | ±20ms | Event loop variations |
| Callback invocation | Same/next frame | Platform event handling |
| Focus transition | ±1 frame | Focus management timing |

---

## Related Documentation

- [Behavioral Contract Validation Framework](./behavioral-contract-validation-framework.md) - Validation criteria and checklists
- [Stemma System Principles](./stemma-system-principles.md) - Core behavioral contract definitions
- [Component Schema Format Specification](./component-schema-format.md) - Schema structure for contracts
- [Component Development and Practices Guide](./Component Development and Practices Guide.md) - Component implementation guidance

---

*This document ensures consistent cross-platform implementation while allowing platform-appropriate optimizations that enhance the native user experience.*
