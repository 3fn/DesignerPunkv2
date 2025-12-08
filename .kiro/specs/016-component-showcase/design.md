# Design Document: Cross-Platform Component Showcase

**Date**: December 8, 2025
**Spec**: 016 - Cross-Platform Component Showcase
**Status**: Design Phase
**Dependencies**: 
- Spec 013 (TextInputField) - Complete
- Spec 005 (ButtonCTA) - Complete
- Spec 008 (Icon) - Complete
- Spec 012 (Container) - Complete

---

## Overview

The Cross-Platform Component Showcase demonstrates DesignerPunk's True Native Architecture through a realistic contact information form implemented natively on web (Custom Elements), iOS (SwiftUI), and Android (Jetpack Compose). This showcase uses **actual production code** from the component library and generated design tokens to validate the system works in real applications.

The design focuses on three key principles:

1. **Use Production Code**: Import actual components from `src/components/core/`, not mocks
2. **Generate Real Tokens**: Use `TokenFileGenerator` output for all styling
3. **Document Honestly**: Expose gaps and limitations discovered during implementation

This is not a hypothetical example - it's a working application that proves the system delivers on its cross-platform consistency promise.

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Token Generation                          │
│  npm run build → TokenFileGenerator                          │
│  ├─ DesignTokens.web.css (CSS custom properties)           │
│  ├─ DesignTokens.ios.swift (Swift constants)               │
│  └─ DesignTokens.android.kt (Kotlin constants)             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Production Component Library                    │
│  src/components/core/                                        │
│  ├─ TextInputField/ (web, iOS, Android)                    │
│  ├─ ButtonCTA/ (web, iOS, Android)                         │
│  ├─ Container/ (web, iOS, Android)                         │
│  └─ Icon/ (web, iOS, Android)                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Contact Form Examples                           │
│  examples/contact-form/                                      │
│  ├─ web/index.html (Custom Elements)                       │
│  ├─ ios/ContactForm.swift (SwiftUI)                        │
│  └─ android/ContactForm.kt (Jetpack Compose)               │
└─────────────────────────────────────────────────────────────┘
```

### Token Generation Workflow

The token generation workflow is **already implemented** in DesignerPunk:

1. Developer runs `npm run build`
2. `TokenFileGenerator` reads primitive and semantic tokens
3. Platform-specific builders generate token files:
   - `WebBuilder` → CSS custom properties
   - `iOSBuilder` → Swift constants
   - `AndroidBuilder` → Kotlin constants
4. Generated files are placed in `dist/` directory
5. Examples import generated token files

**Key Point**: This showcase **uses** the existing token generation system, it doesn't build a new one.

### Component Import Strategy

Each platform imports production components differently:

**Web**: Import Custom Elements as ES modules
```html
<script type="module">
  import './src/components/core/TextInputField/platforms/web/TextInputField.web.js';
  import './dist/DesignTokens.web.css';
</script>
```

**iOS**: Import SwiftUI components as Swift files
```swift
import SwiftUI
// Import generated tokens
import DesignTokens

// Import component implementations
import TextInputField
```

**Android**: Import Compose components as Kotlin files
```kotlin
import androidx.compose.runtime.*
// Import generated tokens
import com.designerpunk.tokens.DesignTokens

// Import component implementations
import com.designerpunk.components.TextInputField
```

---

## Components and Interfaces

### Contact Form Data Model

```typescript
// Shared data model across all platforms
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface ContactFormState {
  data: ContactFormData;
  errors: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  isSubmitting: boolean;
  isSubmitted: boolean;
}
```

### Validation Logic

```typescript
// Validation rules (same across all platforms)
interface ValidationRules {
  email: RegExp; // /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  phone: RegExp; // /^\+?[\d\s\-\(\)]+$/
  required: (value: string) => boolean;
}

// Validation results
interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
```

### Platform-Specific Implementations

Each platform implements the same form using native patterns:

**Web (Custom Elements)**:
- Uses `<dp-text-input-field>` Custom Elements
- Form state managed with vanilla JavaScript
- Validation on blur and submit
- Error messages displayed using component error state

**iOS (SwiftUI)**:
- Uses `TextInputField` SwiftUI views
- Form state managed with `@State` and `@Binding`
- Validation on field change and submit
- Error messages displayed using component error state

**Android (Jetpack Compose)**:
- Uses `TextInputField` Composable functions
- Form state managed with `remember` and `mutableStateOf`
- Validation on value change and submit
- Error messages displayed using component error state

---

## Data Models

### Web Implementation

```typescript
// Web form state management
class ContactFormController {
  private state: ContactFormState;
  private validators: ValidationRules;
  
  constructor() {
    this.state = this.getInitialState();
    this.validators = this.getValidators();
  }
  
  validateField(field: keyof ContactFormData, value: string): string | undefined {
    // Field-specific validation
  }
  
  validateForm(): ValidationResult {
    // Full form validation
  }
  
  handleSubmit(): void {
    // Submit logic
  }
}
```

### iOS Implementation

```swift
// iOS form state management
struct ContactFormState {
    var firstName: String = ""
    var lastName: String = ""
    var email: String = ""
    var phone: String = ""
    var address: String = ""
    
    var errors: [String: String] = [:]
    var isSubmitting: Bool = false
    var isSubmitted: Bool = false
}

class ContactFormViewModel: ObservableObject {
    @Published var state = ContactFormState()
    
    func validateField(_ field: String, value: String) -> String? {
        // Field-specific validation
    }
    
    func validateForm() -> Bool {
        // Full form validation
    }
    
    func handleSubmit() {
        // Submit logic
    }
}
```

### Android Implementation

```kotlin
// Android form state management
data class ContactFormState(
    val firstName: String = "",
    val lastName: String = "",
    val email: String = "",
    val phone: String = "",
    val address: String = "",
    val errors: Map<String, String> = emptyMap(),
    val isSubmitting: Boolean = false,
    val isSubmitted: Boolean = false
)

class ContactFormViewModel : ViewModel() {
    private val _state = mutableStateOf(ContactFormState())
    val state: State<ContactFormState> = _state
    
    fun validateField(field: String, value: String): String? {
        // Field-specific validation
    }
    
    fun validateForm(): Boolean {
        // Full form validation
    }
    
    fun handleSubmit() {
        // Submit logic
    }
}
```

---

## Error Handling

### Validation Error Display

Each platform displays validation errors using the TextInputField component's error state:

**Web**:
```html
<dp-text-input-field
  label="Email"
  value="${email}"
  error="${emailError}"
  state="${emailError ? 'error' : 'default'}"
></dp-text-input-field>
```

**iOS**:
```swift
TextInputField(
    label: "Email",
    value: $email,
    error: emailError,
    state: emailError != nil ? .error : .default
)
```

**Android**:
```kotlin
TextInputField(
    label = "Email",
    value = email,
    error = emailError,
    state = if (emailError != null) TextInputState.Error else TextInputState.Default
)
```

### Form Submission Error Handling

Form submission follows the same error handling pattern across platforms:

1. **Validation Phase**: Validate all fields before submission
2. **Error Display**: Show errors on invalid fields
3. **Success State**: Display success message if validation passes
4. **Reset**: Allow form reset after successful submission

---

## Testing Strategy

### Manual Testing Approach

This showcase uses **manual testing** to validate cross-platform consistency:

1. **Visual Comparison**: Side-by-side screenshots of all three platforms
2. **Interaction Testing**: Manual testing of form validation and submission
3. **Token Verification**: Inspect generated token files to verify consistency
4. **Component Verification**: Verify components are imported from production code

### Testing Checklist

For each platform, verify:

- [ ] Form displays with correct spacing (using generated tokens)
- [ ] Form displays with correct colors (using generated tokens)
- [ ] Form displays with correct typography (using generated tokens)
- [ ] Email validation works (invalid format shows error)
- [ ] Phone validation works (invalid format shows error)
- [ ] Required field validation works (empty fields show error)
- [ ] Success state displays after valid submission
- [ ] Components are imported from `src/components/core/` (not mocks)
- [ ] Tokens are imported from generated files (not hard-coded)

### Gap Documentation

During testing, document:

- Components that don't work as expected
- Platform implementations that are missing
- Token generation issues discovered
- Developer experience friction points
- Differences between platforms that need explanation

---

## Design Decisions

### Decision 1: Contact Form Example

**Options Considered**:
1. Simple button showcase (just buttons and icons)
2. Contact form with validation (realistic use case)
3. Multi-page application (too complex for initial showcase)

**Decision**: Contact form with validation

**Rationale**: 
A contact form demonstrates multiple components working together (TextInputField, ButtonCTA, Container) and shows realistic patterns like form validation and error handling. It's complex enough to validate the system but simple enough to implement quickly.

A simple button showcase wouldn't prove components work together. A multi-page application would be too complex for an initial showcase and would require navigation patterns we haven't built yet.

**Trade-offs**:
- ✅ **Gained**: Realistic example showing multiple components and patterns
- ✅ **Gained**: Validates form validation and error handling work cross-platform
- ❌ **Lost**: Simplicity of a single-component showcase
- ⚠️ **Risk**: May expose gaps in component implementations

**Counter-Arguments**:
- **Argument**: A simpler example would be easier to implement and less likely to expose issues
- **Response**: The goal is to expose issues - we want to find gaps now, not later when building real applications

### Decision 2: Production Code Only

**Options Considered**:
1. Use production components from `src/components/core/`
2. Create simplified mock components for examples
3. Mix production and mock components

**Decision**: Production code only

**Rationale**:
The showcase must prove the actual system works, not a simplified version. Using mocks would defeat the purpose of validating True Native Architecture. If production components don't work in examples, we need to fix the components, not create fake examples.

**Trade-offs**:
- ✅ **Gained**: Honest validation of actual system capabilities
- ✅ **Gained**: Examples that developers can trust and learn from
- ❌ **Lost**: Ability to hide component limitations
- ⚠️ **Risk**: May discover components aren't production-ready

**Counter-Arguments**:
- **Argument**: Mock components would let us show the "ideal" experience even if components aren't ready
- **Response**: Showing an ideal that doesn't exist is dishonest and wastes developer time when they try to use the system

### Decision 3: Manual Testing Only

**Options Considered**:
1. Automated visual regression testing
2. Automated cross-platform consistency tests
3. Manual testing with documented checklist

**Decision**: Manual testing with documented checklist

**Rationale**:
Automated testing infrastructure would take significant time to build and isn't the goal of this showcase. Manual testing with a clear checklist is sufficient to validate cross-platform consistency and document gaps. We can add automated testing later if needed.

**Trade-offs**:
- ✅ **Gained**: Fast implementation without building test infrastructure
- ✅ **Gained**: Human judgment on visual consistency
- ❌ **Lost**: Automated regression detection
- ⚠️ **Risk**: Manual testing is less repeatable

**Counter-Arguments**:
- **Argument**: Automated tests would catch regressions as the system evolves
- **Response**: True, but building test infrastructure isn't the goal right now. We need to validate the system works first, then we can add automated testing.

### Decision 4: Single Example (Contact Form)

**Options Considered**:
1. Multiple examples (contact form, dashboard, settings page)
2. Single realistic example (contact form)
3. Component gallery (showcase all components individually)

**Decision**: Single realistic example (contact form)

**Rationale**:
One realistic example is sufficient to validate the system and document developer experience. Multiple examples would take more time without providing proportionally more value. A component gallery wouldn't show how components work together in realistic patterns.

**Trade-offs**:
- ✅ **Gained**: Focused effort on one high-quality example
- ✅ **Gained**: Realistic pattern showing components working together
- ❌ **Lost**: Coverage of other use cases and patterns
- ⚠️ **Risk**: May not expose issues specific to other patterns

**Counter-Arguments**:
- **Argument**: Multiple examples would provide more comprehensive validation
- **Response**: True, but one realistic example is sufficient for initial validation. We can add more examples later based on what we learn.

### Decision 5: No Build Tooling Beyond Token Generation

**Options Considered**:
1. Add esbuild/webpack for component bundling
2. Add development server with hot reload
3. Use existing `npm run build` for token generation only

**Decision**: Use existing `npm run build` for token generation only

**Rationale**:
The goal is to showcase components and tokens, not build a complete development environment. Components are already TypeScript/Swift/Kotlin files that can be imported directly. Adding build tooling would add complexity without providing value for this showcase.

**Trade-offs**:
- ✅ **Gained**: Simple setup using existing token generation
- ✅ **Gained**: No additional build infrastructure to maintain
- ❌ **Lost**: Hot reload and development conveniences
- ⚠️ **Risk**: Manual refresh required during development

**Counter-Arguments**:
- **Argument**: Build tooling would improve developer experience
- **Response**: True, but that's not the goal of this showcase. We're validating the system works, not building a complete development environment.

---

## Implementation Approach

### Phase 1: Token Generation Verification

1. Run `npm run build` to generate token files
2. Verify `DesignTokens.web.css` contains expected tokens
3. Verify `DesignTokens.ios.swift` contains expected tokens
4. Verify `DesignTokens.android.kt` contains expected tokens
5. Document any missing or incorrect tokens

### Phase 2: Web Example Implementation

1. Create `examples/contact-form/web/index.html`
2. Import Custom Elements from `src/components/core/`
3. Import generated `DesignTokens.web.css`
4. Implement form with TextInputField components
5. Implement validation logic
6. Test form submission and error handling
7. Document any component issues discovered

### Phase 3: iOS Example Implementation

1. Create `examples/contact-form/ios/` Xcode project
2. Import SwiftUI components from `src/components/core/`
3. Import generated `DesignTokens.ios.swift`
4. Implement form with TextInputField components
5. Implement validation logic (same as web)
6. Test form submission and error handling
7. Document platform-specific differences

### Phase 4: Android Example Implementation

1. Create `examples/contact-form/android/` Gradle project
2. Import Compose components from `src/components/core/`
3. Import generated `DesignTokens.android.kt`
4. Implement form with TextInputField components
5. Implement validation logic (same as web and iOS)
6. Test form submission and error handling
7. Document platform-specific differences

### Phase 5: Cross-Platform Validation

1. Take screenshots of all three platforms
2. Compare visual consistency (spacing, colors, typography)
3. Compare interaction patterns (validation, error display)
4. Document differences and explain why they exist
5. Create side-by-side comparison documentation

### Phase 6: Developer Documentation

1. Create root README explaining token generation workflow
2. Document how to run each platform's example
3. Document how to import components and tokens
4. Include code snippets from actual examples
5. Document gaps and limitations discovered

---

## Directory Structure

```
examples/
└── contact-form/
    ├── README.md                    # Root documentation
    ├── web/
    │   ├── index.html              # Web example entry point
    │   ├── ContactForm.js          # Form controller
    │   └── README.md               # Web-specific instructions
    ├── ios/
    │   ├── ContactForm.xcodeproj   # Xcode project
    │   ├── ContactForm/
    │   │   ├── ContentView.swift   # Main view
    │   │   ├── ContactFormView.swift # Form implementation
    │   │   └── ContactFormViewModel.swift # State management
    │   └── README.md               # iOS-specific instructions
    └── android/
        ├── build.gradle            # Gradle project
        ├── app/
        │   └── src/main/kotlin/
        │       ├── MainActivity.kt
        │       ├── ContactFormScreen.kt # Form implementation
        │       └── ContactFormViewModel.kt # State management
        └── README.md               # Android-specific instructions
```

---

## Token Usage Examples

### Web Token Usage

```css
/* Generated DesignTokens.web.css */
:root {
  --space-inset-normal: 16px;
  --space-inset-tight: 8px;
  --color-primary: #3B82F6;
  --color-text-default: #1F2937;
  --typography-body-md: 400 16px/24px system-ui;
}
```

```html
<!-- Using tokens in web example -->
<style>
  .contact-form {
    padding: var(--space-inset-normal);
    color: var(--color-text-default);
    font: var(--typography-body-md);
  }
</style>
```

### iOS Token Usage

```swift
// Generated DesignTokens.ios.swift
public struct DesignTokens {
    public static let spaceInsetNormal: CGFloat = 16
    public static let spaceInsetTight: CGFloat = 8
    public static let colorPrimary = UIColor(red: 0.231, green: 0.510, blue: 0.965, alpha: 1.0)
    public static let colorTextDefault = UIColor(red: 0.122, green: 0.161, blue: 0.216, alpha: 1.0)
}
```

```swift
// Using tokens in iOS example
VStack(spacing: DesignTokens.spaceInsetNormal) {
    TextInputField(label: "First Name", value: $firstName)
        .foregroundColor(DesignTokens.colorTextDefault)
}
.padding(DesignTokens.spaceInsetNormal)
```

### Android Token Usage

```kotlin
// Generated DesignTokens.android.kt
object DesignTokens {
    val spaceInsetNormal = 16.dp
    val spaceInsetTight = 8.dp
    val colorPrimary = Color(0xFF3B82F6)
    val colorTextDefault = Color(0xFF1F2937)
}
```

```kotlin
// Using tokens in Android example
Column(
    modifier = Modifier.padding(DesignTokens.spaceInsetNormal),
    verticalArrangement = Arrangement.spacedBy(DesignTokens.spaceInsetNormal)
) {
    TextInputField(
        label = "First Name",
        value = firstName,
        textColor = DesignTokens.colorTextDefault
    )
}
```

---

## Gap Documentation Template

During implementation, document gaps using this template:

```markdown
### Gap: [Component/Feature Name]

**Platform**: [Web | iOS | Android | All]
**Severity**: [Blocker | High | Medium | Low]
**Description**: [Specific description of what's missing or broken]
**Impact**: [How this affects the example or developer experience]
**Workaround**: [Temporary solution if one exists]
**Recommendation**: [What should be done to fix this]
```

**Example**:
```markdown
### Gap: TextInputField Error State Animation

**Platform**: Web
**Severity**: Medium
**Description**: TextInputField error state appears instantly without animation, creating jarring visual transition
**Impact**: Error messages feel abrupt, reducing polish of the example
**Workaround**: None - error state works functionally, just lacks animation
**Recommendation**: Add CSS transition for error state appearance (0.2s ease-in-out)
```

---

## Success Criteria

The showcase is successful when:

1. ✅ All three platforms have working contact form examples
2. ✅ All examples use production components from `src/components/core/`
3. ✅ All examples use generated tokens from `TokenFileGenerator`
4. ✅ Form validation works consistently across all platforms
5. ✅ Visual consistency is documented with side-by-side screenshots
6. ✅ Developer documentation explains how to generate tokens and use components
7. ✅ Gaps and limitations are honestly documented with specific details
8. ✅ Examples can be run by following README instructions

---

**Organization**: spec-validation
**Scope**: 016-component-showcase
