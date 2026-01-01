/**
 * Input-Text-PhoneNumber iOS Component
 * 
 * iOS platform implementation of the Input-Text-PhoneNumber component using SwiftUI.
 * Extends Input-Text-Base with phone number formatting and validation functionality.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-PhoneNumber
 * 
 * Features:
 * - Inherits all Input-Text-Base features (float label, validation states, etc.)
 * - Phone number format validation on blur
 * - Auto-formatting as user types
 * - International format support
 * - iOS phone keyboard type
 * - Phone content type for autofill
 * - Custom validation function support
 * 
 * Behavioral Contracts:
 * - validates_phone_format: Validates phone against country-specific patterns
 * - provides_phone_formatting: Formats phone numbers as user types
 * - supports_international_formats: Handles multiple country formats
 * - inherits_all_input_text_base_contracts: All base contracts apply
 * 
 * Requirements: R4.5 (Input-Text-PhoneNumber formatting and validation)
 */

import SwiftUI

/**
 * Country configuration for phone number formatting
 */
struct CountryConfig {
    let code: String
    let dialCode: String
    let name: String
    let format: String
    let digitCount: Int
}

/**
 * Supported country codes with their formats
 */
private let countryConfigs: [String: CountryConfig] = [
    "US": CountryConfig(code: "US", dialCode: "+1", name: "United States", format: "(###) ###-####", digitCount: 10),
    "CA": CountryConfig(code: "CA", dialCode: "+1", name: "Canada", format: "(###) ###-####", digitCount: 10),
    "GB": CountryConfig(code: "GB", dialCode: "+44", name: "United Kingdom", format: "#### ### ####", digitCount: 11),
    "DE": CountryConfig(code: "DE", dialCode: "+49", name: "Germany", format: "#### #######", digitCount: 11),
    "FR": CountryConfig(code: "FR", dialCode: "+33", name: "France", format: "## ## ## ## ##", digitCount: 10),
    "AU": CountryConfig(code: "AU", dialCode: "+61", name: "Australia", format: "#### ### ###", digitCount: 10),
    "JP": CountryConfig(code: "JP", dialCode: "+81", name: "Japan", format: "###-####-####", digitCount: 11),
    "IN": CountryConfig(code: "IN", dialCode: "+91", name: "India", format: "##### #####", digitCount: 10),
    "BR": CountryConfig(code: "BR", dialCode: "+55", name: "Brazil", format: "(##) #####-####", digitCount: 11),
    "MX": CountryConfig(code: "MX", dialCode: "+52", name: "Mexico", format: "## #### ####", digitCount: 10)
]

/**
 * Default country code
 */
private let defaultCountryCode = "US"

/**
 * Default error message for invalid phone format
 */
private let defaultInvalidPhoneMessage = "Please enter a valid phone number"

/**
 * Get country configuration by code
 */
private func getCountryConfig(_ code: String) -> CountryConfig {
    return countryConfigs[code.uppercased()] ?? countryConfigs[defaultCountryCode]!
}

/**
 * Extract digits only from a phone number string
 */
private func extractDigits(_ phoneNumber: String) -> String {
    return phoneNumber.filter { $0.isNumber }
}

/**
 * Format a phone number according to country-specific format
 */
private func formatPhoneNumber(_ digits: String, countryCode: String = defaultCountryCode) -> String {
    let config = getCountryConfig(countryCode)
    let format = config.format
    
    if digits.isEmpty {
        return ""
    }
    
    var result = ""
    var digitIndex = digits.startIndex
    
    for char in format {
        guard digitIndex < digits.endIndex else { break }
        
        if char == "#" {
            result.append(digits[digitIndex])
            digitIndex = digits.index(after: digitIndex)
        } else {
            result.append(char)
        }
    }
    
    return result
}

/**
 * Validate phone number format based on country
 */
private func isValidPhoneNumber(_ phoneNumber: String, countryCode: String = defaultCountryCode) -> Bool {
    let trimmed = phoneNumber.trimmingCharacters(in: .whitespacesAndNewlines)
    if trimmed.isEmpty {
        return true // Empty is valid (use required for empty validation)
    }
    
    let digits = extractDigits(phoneNumber)
    let config = getCountryConfig(countryCode)
    
    return digits.count == config.digitCount
}

/**
 * Input-Text-PhoneNumber SwiftUI View
 * 
 * Wraps Input-Text-Base with phone number-specific functionality.
 * Uses composition pattern to extend the base component.
 */
struct InputTextPhoneNumber: View {
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
    
    /// Country code for formatting and validation
    let countryCode: String
    
    /// Whether to auto-format as user types
    let autoFormat: Bool
    
    /// Custom invalid phone message
    let invalidPhoneMessage: String
    
    /// Custom phone validator
    let customValidator: ((String, String) -> Bool)?
    
    // MARK: - State
    
    /// Whether validation has been triggered (on blur)
    @State private var hasBeenValidated: Bool = false
    
    /// Whether the phone format is valid
    @State private var isPhoneValid: Bool = true
    
    /// Raw digits (no formatting)
    @State private var rawDigits: String = ""
    
    /// Formatted phone number
    @State private var formattedValue: String = ""
    
    // MARK: - Computed Properties
    
    /// Effective error message (props error takes precedence)
    private var effectiveErrorMessage: String? {
        if let propsError = errorMessage, !propsError.isEmpty {
            return propsError
        }
        
        if hasBeenValidated && !isPhoneValid {
            return invalidPhoneMessage
        }
        
        return nil
    }
    
    /// Display value (formatted or raw based on autoFormat)
    private var displayValue: String {
        return autoFormat ? formattedValue : rawDigits
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
        countryCode: String = defaultCountryCode,
        autoFormat: Bool = true,
        invalidPhoneMessage: String = defaultInvalidPhoneMessage,
        customValidator: ((String, String) -> Bool)? = nil
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
        self.countryCode = countryCode
        self.autoFormat = autoFormat
        self.invalidPhoneMessage = invalidPhoneMessage
        self.customValidator = customValidator
    }
    
    // MARK: - Body
    
    var body: some View {
        InputTextBase(
            id: id,
            label: label,
            value: Binding(
                get: { displayValue },
                set: { newValue in
                    handleValueChange(newValue)
                }
            ),
            onChange: { newValue in
                onChange?(autoFormat ? formattedValue : rawDigits)
            },
            onFocus: onFocus,
            onBlur: {
                // Validate on blur
                validatePhone()
                onBlur?()
            },
            helperText: helperText,
            errorMessage: effectiveErrorMessage,
            isSuccess: isSuccess,
            showInfoIcon: showInfoIcon,
            type: .phone,
            autocomplete: .telephoneNumber,
            placeholder: placeholder,
            readOnly: readOnly,
            required: required,
            maxLength: maxLength,
            isDisabled: isDisabled
        )
        .onAppear {
            // Initialize formatted value from initial value
            rawDigits = extractDigits(value)
            formattedValue = formatPhoneNumber(rawDigits, countryCode: countryCode)
        }
    }
    
    // MARK: - Value Handling
    
    /// Handle value change with formatting
    private func handleValueChange(_ newValue: String) {
        let config = getCountryConfig(countryCode)
        
        // Extract and limit digits
        let digits = String(extractDigits(newValue).prefix(config.digitCount))
        rawDigits = digits
        formattedValue = formatPhoneNumber(digits, countryCode: countryCode)
        
        // Update bound value
        value = autoFormat ? formattedValue : rawDigits
        
        // Clear validation state when user types
        hasBeenValidated = false
        isPhoneValid = true
    }
    
    // MARK: - Validation
    
    /// Validate the phone format
    private func validatePhone() {
        let validator = customValidator ?? { phone, country in
            isValidPhoneNumber(phone, countryCode: country)
        }
        isPhoneValid = validator(rawDigits, countryCode)
        hasBeenValidated = true
        
        // Notify validation result
        let errorMsg = isPhoneValid ? nil : invalidPhoneMessage
        onValidate?(isPhoneValid, errorMsg)
    }
    
    /// Programmatic validation method
    func validate() -> (isValid: Bool, errorMessage: String?, formattedNumber: String, rawDigits: String) {
        validatePhone()
        return (isPhoneValid, isPhoneValid ? nil : invalidPhoneMessage, formattedValue, rawDigits)
    }
}

// MARK: - Preview

#if DEBUG
struct InputTextPhoneNumber_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            InputTextPhoneNumber(
                id: "preview-default",
                label: "Phone Number",
                value: .constant(""),
                helperText: "Enter your phone number"
            )
            
            InputTextPhoneNumber(
                id: "preview-filled",
                label: "Phone Number",
                value: .constant("5551234567"),
                helperText: "Enter your phone number"
            )
            
            InputTextPhoneNumber(
                id: "preview-invalid",
                label: "Phone Number",
                value: .constant("555"),
                helperText: "Enter your phone number",
                errorMessage: "Please enter a valid phone number"
            )
            
            InputTextPhoneNumber(
                id: "preview-success",
                label: "Phone Number",
                value: .constant("5551234567"),
                helperText: "Enter your phone number",
                isSuccess: true
            )
            
            InputTextPhoneNumber(
                id: "preview-uk",
                label: "UK Phone Number",
                value: .constant(""),
                helperText: "Enter your UK phone number",
                countryCode: "GB"
            )
            
            InputTextPhoneNumber(
                id: "preview-disabled",
                label: "Phone Number",
                value: .constant("5551234567"),
                helperText: "This field is disabled",
                isDisabled: true
            )
            
            InputTextPhoneNumber(
                id: "preview-required",
                label: "Phone Number",
                value: .constant(""),
                helperText: "Required field",
                required: true
            )
        }
        .padding()
    }
}
#endif

