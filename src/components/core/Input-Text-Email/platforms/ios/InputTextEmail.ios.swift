/**
 * Input-Text-Email iOS Component
 * 
 * iOS platform implementation of the Input-Text-Email component using SwiftUI.
 * Extends Input-Text-Base with email validation and autocomplete functionality.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Email
 * 
 * Features:
 * - Inherits all Input-Text-Base features (float label, validation states, etc.)
 * - Email format validation on blur
 * - iOS email keyboard type
 * - Email content type for autofill
 * - Custom validation function support
 * 
 * Behavioral Contracts:
 * - validates_email_format: Validates email against RFC 5322 pattern
 * - provides_email_autocomplete: Enables iOS email autofill
 * - inherits_all_input_text_base_contracts: All base contracts apply
 * 
 * Requirements: R4.3 (Input-Text-Email validation and autocomplete)
 */

import SwiftUI

/**
 * Email validation regex pattern (RFC 5322 compliant)
 */
private let emailRegex = try! NSRegularExpression(
    pattern: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
    options: []
)

/**
 * Default error message for invalid email format
 */
private let defaultInvalidEmailMessage = "Please enter a valid email address"

/**
 * Validate email format
 */
private func isValidEmail(_ email: String) -> Bool {
    let trimmed = email.trimmingCharacters(in: .whitespacesAndNewlines)
    if trimmed.isEmpty {
        return true // Empty is valid (use required for empty validation)
    }
    
    let range = NSRange(location: 0, length: trimmed.utf16.count)
    return emailRegex.firstMatch(in: trimmed, options: [], range: range) != nil
}

/**
 * Input-Text-Email SwiftUI View
 * 
 * Wraps Input-Text-Base with email-specific functionality.
 * Uses composition pattern to extend the base component.
 */
struct InputTextEmail: View {
    // MARK: - Properties
    
    /// Unique identifier for the input
    let id: String
    
    /// Label text (floats between placeholder and floated positions)
    let label: String
    
    /// Current input value
    @Binding var value: String
    
    /// Callback when value changes
    let onChange: ((String) -> Void)?
    
    /// Callback when input receives focus
    let onFocus: (() -> Void)?
    
    /// Callback when input loses focus
    let onBlur: (() -> Void)?
    
    /// Callback when validation occurs
    let onValidate: ((Bool, String?) -> Void)?
    
    /// Helper text displayed below input (persistent)
    let helperText: String?
    
    /// Error message from props (takes precedence over validation error)
    let errorMessage: String?
    
    /// Success state indicator
    let isSuccess: Bool
    
    /// Info icon support
    let showInfoIcon: Bool
    
    /// Placeholder text (only shown when label is floated and input is empty)
    let placeholder: String?
    
    /// Read-only state
    let readOnly: Bool
    
    /// Required field indicator
    let required: Bool
    
    /// Maximum length for input value
    let maxLength: Int?
    
    /// Disabled state
    let isDisabled: Bool
    
    /// Custom invalid email message
    let invalidEmailMessage: String
    
    /// Custom email validator
    let customValidator: ((String) -> Bool)?
    
    // MARK: - State
    
    /// Whether validation has been triggered (on blur)
    @State private var hasBeenValidated: Bool = false
    
    /// Whether the email format is valid
    @State private var isEmailValid: Bool = true
    
    // MARK: - Computed Properties
    
    /// Effective error message (props error takes precedence)
    private var effectiveErrorMessage: String? {
        if let propsError = errorMessage, !propsError.isEmpty {
            return propsError
        }
        
        if hasBeenValidated && !isEmailValid {
            return invalidEmailMessage
        }
        
        return nil
    }
    
    // MARK: - Initializer
    
    init(
        id: String,
        label: String,
        value: Binding<String>,
        onChange: ((String) -> Void)? = nil,
        onFocus: (() -> Void)? = nil,
        onBlur: (() -> Void)? = nil,
        onValidate: ((Bool, String?) -> Void)? = nil,
        helperText: String? = nil,
        errorMessage: String? = nil,
        isSuccess: Bool = false,
        showInfoIcon: Bool = false,
        placeholder: String? = nil,
        readOnly: Bool = false,
        required: Bool = false,
        maxLength: Int? = nil,
        isDisabled: Bool = false,
        invalidEmailMessage: String = defaultInvalidEmailMessage,
        customValidator: ((String) -> Bool)? = nil
    ) {
        self.id = id
        self.label = label
        self._value = value
        self.onChange = onChange
        self.onFocus = onFocus
        self.onBlur = onBlur
        self.onValidate = onValidate
        self.helperText = helperText
        self.errorMessage = errorMessage
        self.isSuccess = isSuccess
        self.showInfoIcon = showInfoIcon
        self.placeholder = placeholder
        self.readOnly = readOnly
        self.required = required
        self.maxLength = maxLength
        self.isDisabled = isDisabled
        self.invalidEmailMessage = invalidEmailMessage
        self.customValidator = customValidator
    }
    
    // MARK: - Body
    
    var body: some View {
        InputTextBase(
            id: id,
            label: label,
            value: $value,
            onChange: { newValue in
                // Clear validation state when user types
                hasBeenValidated = false
                isEmailValid = true
                onChange?(newValue)
            },
            onFocus: onFocus,
            onBlur: {
                // Validate on blur
                validateEmail()
                onBlur?()
            },
            helperText: helperText,
            errorMessage: effectiveErrorMessage,
            isSuccess: isSuccess,
            showInfoIcon: showInfoIcon,
            type: .email,
            autocomplete: .emailAddress,
            placeholder: placeholder,
            readOnly: readOnly,
            required: required,
            maxLength: maxLength,
            isDisabled: isDisabled
        )
    }
    
    // MARK: - Validation
    
    /// Validate the email format
    private func validateEmail() {
        let validator = customValidator ?? isValidEmail
        isEmailValid = validator(value)
        hasBeenValidated = true
        
        // Notify validation result
        let errorMsg = isEmailValid ? nil : invalidEmailMessage
        onValidate?(isEmailValid, errorMsg)
    }
    
    /// Programmatic validation method
    func validate() -> (isValid: Bool, errorMessage: String?) {
        validateEmail()
        return (isEmailValid, isEmailValid ? nil : invalidEmailMessage)
    }
}

// MARK: - Preview

#if DEBUG
struct InputTextEmail_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            InputTextEmail(
                id: "preview-default",
                label: "Email",
                value: .constant(""),
                helperText: "Enter your email address"
            )
            
            InputTextEmail(
                id: "preview-filled",
                label: "Email",
                value: .constant("user@example.com"),
                helperText: "Enter your email address"
            )
            
            InputTextEmail(
                id: "preview-invalid",
                label: "Email",
                value: .constant("invalid-email"),
                helperText: "Enter your email address",
                errorMessage: "Please enter a valid email address"
            )
            
            InputTextEmail(
                id: "preview-success",
                label: "Email",
                value: .constant("user@example.com"),
                helperText: "Enter your email address",
                isSuccess: true
            )
            
            InputTextEmail(
                id: "preview-disabled",
                label: "Email",
                value: .constant("user@example.com"),
                helperText: "This field is disabled",
                isDisabled: true
            )
            
            InputTextEmail(
                id: "preview-required",
                label: "Email",
                value: .constant(""),
                helperText: "Required field",
                required: true
            )
        }
        .padding()
    }
}
#endif

