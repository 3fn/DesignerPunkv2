/**
 * Input-Text-Email Android Component
 * 
 * Android platform implementation of the Input-Text-Email component using Jetpack Compose.
 * Extends Input-Text-Base with email validation and autocomplete functionality.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Email
 * 
 * Features:
 * - Inherits all Input-Text-Base features (float label, validation states, etc.)
 * - Email format validation on blur
 * - Android email keyboard type
 * - Email autofill support
 * - Custom validation function support
 * 
 * Behavioral Contracts:
 * - validates_email_format: Validates email against RFC 5322 pattern
 * - provides_email_autocomplete: Enables Android email autofill
 * - inherits_all_input_text_base_contracts: All base contracts apply
 * 
 * Requirements: R4.3 (Input-Text-Email validation and autocomplete)
 */

package com.designerpunk.components.core

import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import java.util.regex.Pattern

/**
 * Email validation regex pattern (RFC 5322 compliant)
 */
private val EMAIL_PATTERN = Pattern.compile(
    "^[a-zA-Z0-9.!#\$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\$"
)

/**
 * Default error message for invalid email format
 */
private const val DEFAULT_INVALID_EMAIL_MESSAGE = "Please enter a valid email address"

/**
 * Validate email format
 */
private fun isValidEmail(email: String): Boolean {
    val trimmed = email.trim()
    if (trimmed.isEmpty()) {
        return true // Empty is valid (use required for empty validation)
    }
    return EMAIL_PATTERN.matcher(trimmed).matches()
}

/**
 * Input-Text-Email Composable
 * 
 * Wraps Input-Text-Base with email-specific functionality.
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
 * @param invalidEmailMessage Custom invalid email message
 * @param customValidator Custom email validator function
 */
@Composable
fun InputTextEmail(
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
    invalidEmailMessage: String = DEFAULT_INVALID_EMAIL_MESSAGE,
    customValidator: ((String) -> Boolean)? = null
) {
    // Validation state
    var hasBeenValidated by remember { mutableStateOf(false) }
    var isEmailValid by remember { mutableStateOf(true) }
    
    // Effective error message (props error takes precedence)
    val effectiveErrorMessage = remember(errorMessage, hasBeenValidated, isEmailValid, invalidEmailMessage) {
        when {
            !errorMessage.isNullOrEmpty() -> errorMessage
            hasBeenValidated && !isEmailValid -> invalidEmailMessage
            else -> null
        }
    }
    
    // Validation function
    fun validateEmail() {
        val validator = customValidator ?: ::isValidEmail
        isEmailValid = validator(value)
        hasBeenValidated = true
        
        // Notify validation result
        val errorMsg = if (isEmailValid) null else invalidEmailMessage
        onValidate?.invoke(isEmailValid, errorMsg)
    }
    
    // Render Input-Text-Base with email configuration
    InputTextBase(
        id = id,
        label = label,
        value = value,
        onValueChange = { newValue ->
            // Clear validation state when user types
            hasBeenValidated = false
            isEmailValid = true
            onValueChange(newValue)
        },
        modifier = modifier,
        onFocus = onFocus,
        onBlur = {
            // Validate on blur
            validateEmail()
            onBlur?.invoke()
        },
        helperText = helperText,
        errorMessage = effectiveErrorMessage,
        isSuccess = isSuccess,
        showInfoIcon = showInfoIcon,
        type = InputType.EMAIL,
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
 * Email validation result data class
 */
data class EmailValidationResult(
    val isValid: Boolean,
    val errorMessage: String? = null
)

/**
 * Programmatic email validation function
 * 
 * Can be used to validate email without triggering blur.
 * 
 * @param email The email address to validate
 * @param customValidator Optional custom validation function
 * @param invalidEmailMessage Custom error message for invalid email
 * @return EmailValidationResult with isValid and optional errorMessage
 */
fun validateEmailAddress(
    email: String,
    customValidator: ((String) -> Boolean)? = null,
    invalidEmailMessage: String = DEFAULT_INVALID_EMAIL_MESSAGE
): EmailValidationResult {
    val validator = customValidator ?: ::isValidEmail
    val isValid = validator(email)
    
    return EmailValidationResult(
        isValid = isValid,
        errorMessage = if (isValid) null else invalidEmailMessage
    )
}

