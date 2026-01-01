/**
 * Input-Text-PhoneNumber Android Component
 * 
 * Android platform implementation of the Input-Text-PhoneNumber component using Jetpack Compose.
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
 * - Android phone keyboard type
 * - Phone autofill support
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

package com.designerpunk.components.core

import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction

/**
 * Country configuration for phone number formatting
 */
data class CountryConfig(
    val code: String,
    val dialCode: String,
    val name: String,
    val format: String,
    val digitCount: Int
)

/**
 * Supported country codes with their formats
 */
private val COUNTRY_CONFIGS = mapOf(
    "US" to CountryConfig("US", "+1", "United States", "(###) ###-####", 10),
    "CA" to CountryConfig("CA", "+1", "Canada", "(###) ###-####", 10),
    "GB" to CountryConfig("GB", "+44", "United Kingdom", "#### ### ####", 11),
    "DE" to CountryConfig("DE", "+49", "Germany", "#### #######", 11),
    "FR" to CountryConfig("FR", "+33", "France", "## ## ## ## ##", 10),
    "AU" to CountryConfig("AU", "+61", "Australia", "#### ### ###", 10),
    "JP" to CountryConfig("JP", "+81", "Japan", "###-####-####", 11),
    "IN" to CountryConfig("IN", "+91", "India", "##### #####", 10),
    "BR" to CountryConfig("BR", "+55", "Brazil", "(##) #####-####", 11),
    "MX" to CountryConfig("MX", "+52", "Mexico", "## #### ####", 10)
)

/**
 * Default country code
 */
private const val DEFAULT_COUNTRY_CODE = "US"

/**
 * Default error message for invalid phone format
 */
private const val DEFAULT_INVALID_PHONE_MESSAGE = "Please enter a valid phone number"

/**
 * Get country configuration by code
 */
private fun getCountryConfig(code: String): CountryConfig {
    return COUNTRY_CONFIGS[code.uppercase()] ?: COUNTRY_CONFIGS[DEFAULT_COUNTRY_CODE]!!
}

/**
 * Extract digits only from a phone number string
 */
private fun extractDigits(phoneNumber: String): String {
    return phoneNumber.filter { it.isDigit() }
}

/**
 * Format a phone number according to country-specific format
 */
private fun formatPhoneNumber(digits: String, countryCode: String = DEFAULT_COUNTRY_CODE): String {
    val config = getCountryConfig(countryCode)
    val format = config.format
    
    if (digits.isEmpty()) {
        return ""
    }
    
    val result = StringBuilder()
    var digitIndex = 0
    
    for (char in format) {
        if (digitIndex >= digits.length) break
        
        if (char == '#') {
            result.append(digits[digitIndex])
            digitIndex++
        } else {
            result.append(char)
        }
    }
    
    return result.toString()
}

/**
 * Validate phone number format based on country
 */
private fun isValidPhoneNumber(phoneNumber: String, countryCode: String = DEFAULT_COUNTRY_CODE): Boolean {
    val trimmed = phoneNumber.trim()
    if (trimmed.isEmpty()) {
        return true // Empty is valid (use required for empty validation)
    }
    
    val digits = extractDigits(phoneNumber)
    val config = getCountryConfig(countryCode)
    
    return digits.length == config.digitCount
}

/**
 * Input-Text-PhoneNumber Composable
 * 
 * Wraps Input-Text-Base with phone number-specific functionality.
 * Uses composition pattern to extend the base component.
 * 
 * @param id Unique identifier for the input
 * @param label Label text (floats between placeholder and floated positions)
 * @param value Current input value
 * @param onValueChange Callback when value changes
 * @param modifier Modifier for the component
 * @param onFocus Callback when input receives focus
 * @param onBlur Callback when input loses focus
 * @param onValidate Callback when validation occurs (isValid, errorMessage)
 * @param helperText Helper text displayed below input (persistent)
 * @param errorMessage Error message from props (takes precedence over validation error)
 * @param isSuccess Success state indicator
 * @param showInfoIcon Info icon support
 * @param placeholder Placeholder text (only shown when label is floated and input is empty)
 * @param readOnly Read-only state
 * @param required Required field indicator
 * @param maxLength Maximum length for input value
 * @param imeAction IME action for keyboard
 * @param keyboardActions Keyboard actions
 * @param isDisabled Disabled state
 * @param countryCode Country code for formatting and validation
 * @param autoFormat Whether to auto-format as user types
 * @param invalidPhoneMessage Custom invalid phone message
 * @param customValidator Custom phone validator function
 */
@Composable
fun InputTextPhoneNumber(
    id: String,
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    onFocus: (() -> Unit)? = null,
    onBlur: (() -> Unit)? = null,
    onValidate: ((Boolean, String?) -> Unit)? = null,
    helperText: String? = null,
    errorMessage: String? = null,
    isSuccess: Boolean = false,
    showInfoIcon: Boolean = false,
    placeholder: String? = null,
    readOnly: Boolean = false,
    required: Boolean = false,
    maxLength: Int? = null,
    imeAction: ImeAction = ImeAction.Done,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    isDisabled: Boolean = false,
    countryCode: String = DEFAULT_COUNTRY_CODE,
    autoFormat: Boolean = true,
    invalidPhoneMessage: String = DEFAULT_INVALID_PHONE_MESSAGE,
    customValidator: ((String, String) -> Boolean)? = null
) {
    // Validation state
    var hasBeenValidated by remember { mutableStateOf(false) }
    var isPhoneValid by remember { mutableStateOf(true) }
    
    // Phone number state
    var rawDigits by remember { mutableStateOf(extractDigits(value)) }
    var formattedValue by remember { mutableStateOf(formatPhoneNumber(rawDigits, countryCode)) }
    
    // Display value (formatted or raw based on autoFormat)
    val displayValue = if (autoFormat) formattedValue else rawDigits
    
    // Effective error message (props error takes precedence)
    val effectiveErrorMessage = remember(errorMessage, hasBeenValidated, isPhoneValid, invalidPhoneMessage) {
        when {
            !errorMessage.isNullOrEmpty() -> errorMessage
            hasBeenValidated && !isPhoneValid -> invalidPhoneMessage
            else -> null
        }
    }
    
    // Validation function
    fun validatePhone() {
        val validator = customValidator ?: { phone, country ->
            isValidPhoneNumber(phone, country)
        }
        isPhoneValid = validator(rawDigits, countryCode)
        hasBeenValidated = true
        
        // Notify validation result
        val errorMsg = if (isPhoneValid) null else invalidPhoneMessage
        onValidate?.invoke(isPhoneValid, errorMsg)
    }
    
    // Handle value change with formatting
    fun handleValueChange(newValue: String) {
        val config = getCountryConfig(countryCode)
        
        // Extract and limit digits
        val digits = extractDigits(newValue).take(config.digitCount)
        rawDigits = digits
        formattedValue = formatPhoneNumber(digits, countryCode)
        
        // Clear validation state when user types
        hasBeenValidated = false
        isPhoneValid = true
        
        // Notify with appropriate value
        onValueChange(if (autoFormat) formattedValue else rawDigits)
    }
    
    // Render Input-Text-Base with phone configuration
    InputTextBase(
        id = id,
        label = label,
        value = displayValue,
        onValueChange = { newValue ->
            handleValueChange(newValue)
        },
        modifier = modifier,
        onFocus = onFocus,
        onBlur = {
            // Validate on blur
            validatePhone()
            onBlur?.invoke()
        },
        helperText = helperText,
        errorMessage = effectiveErrorMessage,
        isSuccess = isSuccess,
        showInfoIcon = showInfoIcon,
        type = InputType.PHONE,
        placeholder = placeholder,
        readOnly = readOnly,
        required = required,
        maxLength = maxLength,
        imeAction = imeAction,
        keyboardActions = keyboardActions,
        isDisabled = isDisabled
    )
}

/**
 * Phone validation result data class
 */
data class PhoneValidationResult(
    val isValid: Boolean,
    val errorMessage: String? = null,
    val formattedNumber: String? = null,
    val rawDigits: String? = null
)

/**
 * Programmatic phone validation function
 * 
 * Can be used to validate phone number without triggering blur.
 * 
 * @param phoneNumber The phone number to validate
 * @param countryCode Country code for validation
 * @param customValidator Optional custom validation function
 * @param invalidPhoneMessage Custom error message for invalid phone
 * @return PhoneValidationResult with isValid, errorMessage, formattedNumber, and rawDigits
 */
fun validatePhoneNumber(
    phoneNumber: String,
    countryCode: String = DEFAULT_COUNTRY_CODE,
    customValidator: ((String, String) -> Boolean)? = null,
    invalidPhoneMessage: String = DEFAULT_INVALID_PHONE_MESSAGE
): PhoneValidationResult {
    val digits = extractDigits(phoneNumber)
    val formatted = formatPhoneNumber(digits, countryCode)
    
    val validator = customValidator ?: { phone, country ->
        isValidPhoneNumber(phone, country)
    }
    val isValid = validator(digits, countryCode)
    
    return PhoneValidationResult(
        isValid = isValid,
        errorMessage = if (isValid) null else invalidPhoneMessage,
        formattedNumber = formatted,
        rawDigits = digits
    )
}

/**
 * Get list of supported countries
 */
fun getSupportedCountries(): List<CountryConfig> {
    return COUNTRY_CONFIGS.values.toList()
}

