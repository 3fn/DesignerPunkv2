/**
 * Input-Text-Password Android Component
 * 
 * Android platform implementation of the Input-Text-Password component using Jetpack Compose.
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
 * - Android password autofill support
 * - Custom validation function support
 * 
 * Behavioral Contracts:
 * - provides_secure_input: Masks password input by default
 * - supports_password_toggle: Show/hide password functionality
 * - provides_password_autocomplete: Enables Android password autofill
 * - inherits_all_input_text_base_contracts: All base contracts apply
 * 
 * Requirements: R4.4 (Input-Text-Password secure input and toggle)
 */

package com.designerpunk.components.core

import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import java.util.regex.Pattern

/**
 * Password validation regex patterns
 */
private val UPPERCASE_PATTERN = Pattern.compile("[A-Z]")
private val LOWERCASE_PATTERN = Pattern.compile("[a-z]")
private val NUMBER_PATTERN = Pattern.compile("[0-9]")
private val SPECIAL_CHAR_PATTERN = Pattern.compile("[!@#\$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]")

/**
 * Default error message for invalid password
 */
private const val DEFAULT_INVALID_PASSWORD_MESSAGE = "Password does not meet requirements"

/**
 * Password validation details
 */
data class PasswordValidationDetails(
    val meetsMinLength: Boolean = true,
    val meetsMaxLength: Boolean = true,
    val hasUppercase: Boolean = true,
    val hasLowercase: Boolean = true,
    val hasNumber: Boolean = true,
    val hasSpecialChar: Boolean = true
) {
    val allMet: Boolean
        get() = meetsMinLength && meetsMaxLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
}

/**
 * Password requirements configuration
 */
data class PasswordRequirements(
    val minLength: Int? = null,
    val maxLength: Int? = null,
    val requireUppercase: Boolean = false,
    val requireLowercase: Boolean = false,
    val requireNumber: Boolean = false,
    val requireSpecialChar: Boolean = false
)

/**
 * Validate password against requirements
 */
private fun validatePasswordRequirements(
    password: String,
    requirements: PasswordRequirements
): PasswordValidationDetails {
    return PasswordValidationDetails(
        meetsMinLength = requirements.minLength == null || password.length >= requirements.minLength,
        meetsMaxLength = requirements.maxLength == null || password.length <= requirements.maxLength,
        hasUppercase = !requirements.requireUppercase || UPPERCASE_PATTERN.matcher(password).find(),
        hasLowercase = !requirements.requireLowercase || LOWERCASE_PATTERN.matcher(password).find(),
        hasNumber = !requirements.requireNumber || NUMBER_PATTERN.matcher(password).find(),
        hasSpecialChar = !requirements.requireSpecialChar || SPECIAL_CHAR_PATTERN.matcher(password).find()
    )
}

/**
 * Input-Text-Password Composable
 * 
 * Wraps Input-Text-Base with password-specific functionality.
 * Uses composition pattern to extend the base component.
 * 
 * @param id Unique identifier for the input
 * @param label Label text (floats between placeholder and floated positions)
 * @param value Current input value
 * @param onValueChange Callback when value changes
 * @param modifier Modifier for the component
 * @param onFocus Callback when input receives focus
 * @param onBlur Callback when input loses focus
 * @param onValidate Callback when validation occurs (isValid, errorMessage, details)
 * @param onToggleVisibility Callback when visibility is toggled
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
 * @param showToggle Whether to show the toggle button
 * @param isNewPassword Whether this is for a new password
 * @param invalidPasswordMessage Custom invalid password message
 * @param requirements Password requirements configuration
 * @param customValidator Custom password validator function
 */
@Composable
fun InputTextPassword(
    id: String,
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    onFocus: (() -> Unit)? = null,
    onBlur: (() -> Unit)? = null,
    onValidate: ((Boolean, String?, PasswordValidationDetails) -> Unit)? = null,
    onToggleVisibility: ((Boolean) -> Unit)? = null,
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
    showToggle: Boolean = true,
    isNewPassword: Boolean = false,
    invalidPasswordMessage: String = DEFAULT_INVALID_PASSWORD_MESSAGE,
    requirements: PasswordRequirements = PasswordRequirements(),
    customValidator: ((String) -> Boolean)? = null
) {
    // Password visibility state
    var isPasswordVisible by remember { mutableStateOf(false) }
    
    // Validation state
    var hasBeenValidated by remember { mutableStateOf(false) }
    var isPasswordValid by remember { mutableStateOf(true) }
    var validationDetails by remember { mutableStateOf(PasswordValidationDetails()) }
    
    // Effective error message (props error takes precedence)
    val effectiveErrorMessage = remember(errorMessage, hasBeenValidated, isPasswordValid, invalidPasswordMessage) {
        when {
            !errorMessage.isNullOrEmpty() -> errorMessage
            hasBeenValidated && !isPasswordValid -> invalidPasswordMessage
            else -> null
        }
    }
    
    // Validation function
    fun validatePassword() {
        // Empty passwords are valid (use required for empty validation)
        if (value.isEmpty()) {
            isPasswordValid = true
            validationDetails = PasswordValidationDetails()
            hasBeenValidated = true
            onValidate?.invoke(true, null, validationDetails)
            return
        }
        
        // Use custom validator if provided
        if (customValidator != null) {
            isPasswordValid = customValidator.invoke(value)
            validationDetails = PasswordValidationDetails()
            hasBeenValidated = true
            val errorMsg = if (isPasswordValid) null else invalidPasswordMessage
            onValidate?.invoke(isPasswordValid, errorMsg, validationDetails)
            return
        }
        
        // Validate against requirements
        validationDetails = validatePasswordRequirements(value, requirements)
        isPasswordValid = validationDetails.allMet
        hasBeenValidated = true
        
        // Notify validation result
        val errorMsg = if (isPasswordValid) null else invalidPasswordMessage
        onValidate?.invoke(isPasswordValid, errorMsg, validationDetails)
    }
    
    // Toggle button composable
    val toggleButton: @Composable (() -> Unit)? = if (showToggle) {
        {
            IconButton(
                onClick = {
                    isPasswordVisible = !isPasswordVisible
                    onToggleVisibility?.invoke(isPasswordVisible)
                },
                enabled = !isDisabled
            ) {
                Icon(
                    imageVector = if (isPasswordVisible) Icons.Filled.VisibilityOff else Icons.Filled.Visibility,
                    contentDescription = if (isPasswordVisible) "Hide password" else "Show password"
                )
            }
        }
    } else null
    
    // Visual transformation for password masking
    val visualTransformation = if (isPasswordVisible) {
        VisualTransformation.None
    } else {
        PasswordVisualTransformation()
    }
    
    // Render Input-Text-Base with password configuration
    InputTextBase(
        id = id,
        label = label,
        value = value,
        onValueChange = { newValue ->
            // Clear validation state when user types
            hasBeenValidated = false
            isPasswordValid = true
            validationDetails = PasswordValidationDetails()
            onValueChange(newValue)
        },
        modifier = modifier,
        onFocus = onFocus,
        onBlur = {
            // Validate on blur
            validatePassword()
            onBlur?.invoke()
        },
        helperText = helperText,
        errorMessage = effectiveErrorMessage,
        isSuccess = isSuccess,
        showInfoIcon = showInfoIcon && !showToggle,
        type = InputType.PASSWORD,
        visualTransformation = visualTransformation,
        placeholder = placeholder,
        readOnly = readOnly,
        required = required,
        maxLength = maxLength,
        imeAction = imeAction,
        keyboardActions = keyboardActions,
        isDisabled = isDisabled,
        trailingContent = toggleButton
    )
}

/**
 * Password validation result data class
 */
data class PasswordValidationResult(
    val isValid: Boolean,
    val errorMessage: String? = null,
    val details: PasswordValidationDetails = PasswordValidationDetails()
)

/**
 * Programmatic password validation function
 * 
 * Can be used to validate password without triggering blur.
 * 
 * @param password The password to validate
 * @param requirements Password requirements configuration
 * @param customValidator Optional custom validation function
 * @param invalidPasswordMessage Custom error message for invalid password
 * @return PasswordValidationResult with isValid, errorMessage, and details
 */
fun validatePasswordValue(
    password: String,
    requirements: PasswordRequirements = PasswordRequirements(),
    customValidator: ((String) -> Boolean)? = null,
    invalidPasswordMessage: String = DEFAULT_INVALID_PASSWORD_MESSAGE
): PasswordValidationResult {
    // Empty passwords are valid (use required for empty validation)
    if (password.isEmpty()) {
        return PasswordValidationResult(isValid = true)
    }
    
    // Use custom validator if provided
    if (customValidator != null) {
        val isValid = customValidator.invoke(password)
        return PasswordValidationResult(
            isValid = isValid,
            errorMessage = if (isValid) null else invalidPasswordMessage
        )
    }
    
    // Validate against requirements
    val details = validatePasswordRequirements(password, requirements)
    val isValid = details.allMet
    
    return PasswordValidationResult(
        isValid = isValid,
        errorMessage = if (isValid) null else invalidPasswordMessage,
        details = details
    )
}
