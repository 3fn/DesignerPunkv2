/**
 * Input-Text-Password iOS Component
 * 
 * iOS platform implementation of the Input-Text-Password component using SwiftUI.
 * Extends Input-Text-Base with secure input and password toggle functionality.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Password
 * 
 * Features:
 * - Inherits all Input-Text-Base features (float label, validation states, etc.)
 * - Secure password masking by default
 * - Password visibility toggle button
 * - Password strength validation on blur
 * - iOS password autofill support
 * - Custom validation function support
 * 
 * Behavioral Contracts:
 * - provides_secure_input: Masks password input by default
 * - supports_password_toggle: Show/hide password functionality
 * - provides_password_autocomplete: Enables iOS password autofill
 * - inherits_all_input_text_base_contracts: All base contracts apply
 * 
 * Requirements: R4.4 (Input-Text-Password secure input and toggle)
 */

import SwiftUI

/**
 * Password validation regex patterns
 */
private let uppercasePattern = try! NSRegularExpression(pattern: "[A-Z]", options: [])
private let lowercasePattern = try! NSRegularExpression(pattern: "[a-z]", options: [])
private let numberPattern = try! NSRegularExpression(pattern: "[0-9]", options: [])
private let specialCharPattern = try! NSRegularExpression(pattern: "[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]", options: [])

/**
 * Default error message for invalid password
 */
private let defaultInvalidPasswordMessage = "Password does not meet requirements"

/**
 * Password validation details
 */
struct PasswordValidationDetails {
    var meetsMinLength: Bool = true
    var meetsMaxLength: Bool = true
    var hasUppercase: Bool = true
    var hasLowercase: Bool = true
    var hasNumber: Bool = true
    var hasSpecialChar: Bool = true
    
    var allMet: Bool {
        meetsMinLength && meetsMaxLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
    }
}

/**
 * Password requirements configuration
 */
struct PasswordRequirements {
    var minLength: Int?
    var maxLength: Int?
    var requireUppercase: Bool = false
    var requireLowercase: Bool = false
    var requireNumber: Bool = false
    var requireSpecialChar: Bool = false
}

/**
 * Validate password against requirements
 */
private func validatePasswordRequirements(_ password: String, requirements: PasswordRequirements) -> PasswordValidationDetails {
    let range = NSRange(location: 0, length: password.utf16.count)
    
    return PasswordValidationDetails(
        meetsMinLength: requirements.minLength == nil || password.count >= requirements.minLength!,
        meetsMaxLength: requirements.maxLength == nil || password.count <= requirements.maxLength!,
        hasUppercase: !requirements.requireUppercase || uppercasePattern.firstMatch(in: password, options: [], range: range) != nil,
        hasLowercase: !requirements.requireLowercase || lowercasePattern.firstMatch(in: password, options: [], range: range) != nil,
        hasNumber: !requirements.requireNumber || numberPattern.firstMatch(in: password, options: [], range: range) != nil,
        hasSpecialChar: !requirements.requireSpecialChar || specialCharPattern.firstMatch(in: password, options: [], range: range) != nil
    )
}

/**
 * Input-Text-Password SwiftUI View
 * 
 * Wraps Input-Text-Base with password-specific functionality.
 * Uses composition pattern to extend the base component.
 */
struct InputTextPassword: View {
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
    let onValidate: ((Bool, String?, PasswordValidationDetails) -> Void)?
    
    /// Callback when visibility is toggled
    let onToggleVisibility: ((Bool) -> Void)?
    
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
    
    /// Whether to show the toggle button
    let showToggle: Bool
    
    /// Whether this is for a new password
    let isNewPassword: Bool
    
    /// Custom invalid password message
    let invalidPasswordMessage: String
    
    /// Password requirements
    let requirements: PasswordRequirements
    
    /// Custom password validator
    let customValidator: ((String) -> Bool)?
    
    // MARK: - State
    
    /// Whether the password is currently visible
    @State private var isPasswordVisible: Bool = false
    
    /// Whether validation has been triggered (on blur)
    @State private var hasBeenValidated: Bool = false
    
    /// Whether the password meets requirements
    @State private var isPasswordValid: Bool = true
    
    /// Validation details
    @State private var validationDetails: PasswordValidationDetails = PasswordValidationDetails()
    
    // MARK: - Computed Properties
    
    /// Effective error message (props error takes precedence)
    private var effectiveErrorMessage: String? {
        if let propsError = errorMessage, !propsError.isEmpty {
            return propsError
        }
        
        if hasBeenValidated && !isPasswordValid {
            return invalidPasswordMessage
        }
        
        return nil
    }
    
    /// Content type for autofill
    private var contentType: UITextContentType {
        isNewPassword ? .newPassword : .password
    }
    
    // MARK: - Initializer
    
    init(
        id: String,
        label: String,
        value: Binding<String>,
        onChange: ((String) -> Void)? = nil,
        onFocus: (() -> Void)? = nil,
        onBlur: (() -> Void)? = nil,
        onValidate: ((Bool, String?, PasswordValidationDetails) -> Void)? = nil,
        onToggleVisibility: ((Bool) -> Void)? = nil,
        helperText: String? = nil,
        errorMessage: String? = nil,
        isSuccess: Bool = false,
        showInfoIcon: Bool = false,
        placeholder: String? = nil,
        readOnly: Bool = false,
        required: Bool = false,
        maxLength: Int? = nil,
        isDisabled: Bool = false,
        showToggle: Bool = true,
        isNewPassword: Bool = false,
        invalidPasswordMessage: String = defaultInvalidPasswordMessage,
        requirements: PasswordRequirements = PasswordRequirements(),
        customValidator: ((String) -> Bool)? = nil
    ) {
        self.id = id
        self.label = label
        self._value = value
        self.onChange = onChange
        self.onFocus = onFocus
        self.onBlur = onBlur
        self.onValidate = onValidate
        self.onToggleVisibility = onToggleVisibility
        self.helperText = helperText
        self.errorMessage = errorMessage
        self.isSuccess = isSuccess
        self.showInfoIcon = showInfoIcon
        self.placeholder = placeholder
        self.readOnly = readOnly
        self.required = required
        self.maxLength = maxLength
        self.isDisabled = isDisabled
        self.showToggle = showToggle
        self.isNewPassword = isNewPassword
        self.invalidPasswordMessage = invalidPasswordMessage
        self.requirements = requirements
        self.customValidator = customValidator
    }
    
    // MARK: - Body
    
    var body: some View {
        HStack(spacing: 0) {
            // Use SecureField or TextField based on visibility
            if isPasswordVisible {
                InputTextBase(
                    id: id,
                    label: label,
                    value: $value,
                    onChange: { newValue in
                        // Clear validation state when user types
                        hasBeenValidated = false
                        isPasswordValid = true
                        validationDetails = PasswordValidationDetails()
                        onChange?(newValue)
                    },
                    onFocus: onFocus,
                    onBlur: {
                        // Validate on blur
                        validatePassword()
                        onBlur?()
                    },
                    helperText: helperText,
                    errorMessage: effectiveErrorMessage,
                    isSuccess: isSuccess,
                    showInfoIcon: showInfoIcon && !showToggle,
                    type: .text,
                    autocomplete: contentType,
                    placeholder: placeholder,
                    readOnly: readOnly,
                    required: required,
                    maxLength: maxLength,
                    isDisabled: isDisabled,
                    trailingContent: showToggle ? AnyView(toggleButton) : nil
                )
            } else {
                InputTextBase(
                    id: id,
                    label: label,
                    value: $value,
                    onChange: { newValue in
                        // Clear validation state when user types
                        hasBeenValidated = false
                        isPasswordValid = true
                        validationDetails = PasswordValidationDetails()
                        onChange?(newValue)
                    },
                    onFocus: onFocus,
                    onBlur: {
                        // Validate on blur
                        validatePassword()
                        onBlur?()
                    },
                    helperText: helperText,
                    errorMessage: effectiveErrorMessage,
                    isSuccess: isSuccess,
                    showInfoIcon: showInfoIcon && !showToggle,
                    type: .password,
                    autocomplete: contentType,
                    placeholder: placeholder,
                    readOnly: readOnly,
                    required: required,
                    maxLength: maxLength,
                    isDisabled: isDisabled,
                    trailingContent: showToggle ? AnyView(toggleButton) : nil
                )
            }
        }
    }
    
    // MARK: - Toggle Button
    
    private var toggleButton: some View {
        Button(action: {
            isPasswordVisible.toggle()
            onToggleVisibility?(isPasswordVisible)
        }) {
            Image(systemName: isPasswordVisible ? "eye.slash" : "eye")
                .foregroundColor(Color(UIColor.secondaryLabel))
                .frame(width: DesignTokens.tapAreaMinimum, height: DesignTokens.tapAreaMinimum)
                .contentShape(Rectangle())
        }
        .buttonStyle(PlainButtonStyle())
        .disabled(isDisabled)
        .accessibilityLabel(isPasswordVisible ? "Hide password" : "Show password")
        .accessibilityAddTraits(.isButton)
    }
    
    // MARK: - Validation
    
    /// Validate the password
    private func validatePassword() {
        // Empty passwords are valid (use required for empty validation)
        if value.isEmpty {
            isPasswordValid = true
            validationDetails = PasswordValidationDetails()
            hasBeenValidated = true
            onValidate?(true, nil, validationDetails)
            return
        }
        
        // Use custom validator if provided
        if let validator = customValidator {
            isPasswordValid = validator(value)
            validationDetails = PasswordValidationDetails()
            hasBeenValidated = true
            let errorMsg = isPasswordValid ? nil : invalidPasswordMessage
            onValidate?(isPasswordValid, errorMsg, validationDetails)
            return
        }
        
        // Validate against requirements
        validationDetails = validatePasswordRequirements(value, requirements: requirements)
        isPasswordValid = validationDetails.allMet
        hasBeenValidated = true
        
        // Notify validation result
        let errorMsg = isPasswordValid ? nil : invalidPasswordMessage
        onValidate?(isPasswordValid, errorMsg, validationDetails)
    }
    
    /// Programmatic validation method
    func validate() -> (isValid: Bool, errorMessage: String?, details: PasswordValidationDetails) {
        validatePassword()
        return (isPasswordValid, isPasswordValid ? nil : invalidPasswordMessage, validationDetails)
    }
}

// MARK: - Preview

#if DEBUG
struct InputTextPassword_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            InputTextPassword(
                id: "preview-default",
                label: "Password",
                value: .constant(""),
                helperText: "Enter your password"
            )
            
            InputTextPassword(
                id: "preview-filled",
                label: "Password",
                value: .constant("secretpassword"),
                helperText: "Enter your password"
            )
            
            InputTextPassword(
                id: "preview-error",
                label: "Password",
                value: .constant("weak"),
                helperText: "Enter your password",
                errorMessage: "Password does not meet requirements"
            )
            
            InputTextPassword(
                id: "preview-success",
                label: "Password",
                value: .constant("StrongP@ss123"),
                helperText: "Enter your password",
                isSuccess: true
            )
            
            InputTextPassword(
                id: "preview-disabled",
                label: "Password",
                value: .constant("secretpassword"),
                helperText: "This field is disabled",
                isDisabled: true
            )
            
            InputTextPassword(
                id: "preview-new-password",
                label: "New Password",
                value: .constant(""),
                helperText: "Create a strong password",
                required: true,
                isNewPassword: true,
                requirements: PasswordRequirements(
                    minLength: 8,
                    requireUppercase: true,
                    requireLowercase: true,
                    requireNumber: true,
                    requireSpecialChar: true
                )
            )
            
            InputTextPassword(
                id: "preview-no-toggle",
                label: "Password",
                value: .constant("secretpassword"),
                helperText: "Toggle hidden",
                showToggle: false
            )
        }
        .padding()
    }
}
#endif
