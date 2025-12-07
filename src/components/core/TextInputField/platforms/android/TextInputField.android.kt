/**
 * TextInputField Android Component
 * 
 * Android platform implementation of the TextInputField component using Jetpack Compose.
 * Implements float label pattern with animated transitions using motion.floatLabel token.
 * 
 * Features:
 * - Float label animation (labelMd → labelMdFloat)
 * - Color animation (text.subtle → primary)
 * - Offset animation (translateY)
 * - Trailing icon support (error, success, info)
 * - Respects reduce motion settings
 * - WCAG 2.1 AA compliant
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.5, 4.1, 4.2, 4.3, 8.5
 */

package com.designerpunk.components.core

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import android.provider.Settings

/**
 * Input type enumeration
 */
enum class InputType {
    TEXT,
    EMAIL,
    PASSWORD,
    TEL,
    URL
}

/**
 * TextInputField Composable
 * 
 * Implements the float label pattern with animated transitions.
 * Uses generated design tokens for consistent styling across platforms.
 * 
 * @param id Unique identifier for the input
 * @param label Label text (floats between placeholder and floated positions)
 * @param value Current input value
 * @param onValueChange Callback when value changes
 * @param modifier Modifier for the component
 * @param onFocus Callback when input receives focus
 * @param onBlur Callback when input loses focus
 * @param helperText Helper text displayed below input (persistent)
 * @param errorMessage Error message displayed below helper text (conditional)
 * @param isSuccess Success state indicator
 * @param showInfoIcon Info icon support
 * @param type Input type
 * @param placeholder Placeholder text (only shown when label is floated and input is empty)
 * @param readOnly Read-only state
 * @param required Required field indicator
 * @param maxLength Maximum length for input value
 * @param imeAction IME action for keyboard
 * @param keyboardActions Keyboard actions
 */
@Composable
fun TextInputField(
    id: String,
    label: String,
    value: String,
    onValueChange: (String) -> Void,
    modifier: Modifier = Modifier,
    onFocus: (() -> Unit)? = null,
    onBlur: (() -> Unit)? = null,
    helperText: String? = null,
    errorMessage: String? = null,
    isSuccess: Boolean = false,
    showInfoIcon: Boolean = false,
    type: InputType = InputType.TEXT,
    placeholder: String? = null,
    readOnly: Boolean = false,
    required: Boolean = false,
    maxLength: Int? = null,
    imeAction: ImeAction = ImeAction.Done,
    keyboardActions: KeyboardActions = KeyboardActions.Default
) {
    // State
    var isFocused by remember { mutableStateOf(false) }
    val focusRequester = remember { FocusRequester() }
    var labelAnimationComplete by remember { mutableStateOf(true) }
    
    // Computed properties
    val isFilled = value.isNotEmpty()
    val hasError = errorMessage != null
    val isLabelFloated = isFocused || isFilled
    
    // Icon visibility (after label animation completes)
    val showErrorIcon = hasError && isLabelFloated && labelAnimationComplete
    val showSuccessIcon = isSuccess && isLabelFloated && labelAnimationComplete
    val showInfoIconVisible = showInfoIcon && (isFocused || isFilled) && labelAnimationComplete
    
    // Check if reduce motion is enabled
    val context = LocalContext.current
    val reduceMotion = remember {
        Settings.Global.getFloat(
            context.contentResolver,
            Settings.Global.TRANSITION_ANIMATION_SCALE,
            1f
        ) == 0f
    }
    
    // Animation specs
    val animationSpec: AnimationSpec<Float> = if (reduceMotion) {
        snap()
    } else {
        tween(
            durationMillis = motionFloatLabelDuration,
            easing = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f) // easingStandard
        )
    }
    
    // Track label animation state changes
    LaunchedEffect(isLabelFloated) {
        // Mark animation as incomplete when label starts animating
        labelAnimationComplete = false
        
        // Mark animation as complete after motion.floatLabel duration
        kotlinx.coroutines.delay(motionFloatLabelDuration.toLong())
        labelAnimationComplete = true
    }
    
    // Animated values
    val labelFontSize by animateFloatAsState(
        targetValue = if (isLabelFloated) typographyLabelMdFloatFontSize else typographyLabelMdFontSize,
        animationSpec = animationSpec,
        label = "labelFontSize"
    )
    
    val labelOffsetY by animateDpAsState(
        targetValue = if (isLabelFloated) {
            // Float above input with grouped.tight spacing
            -(typographyLabelMdLineHeight.dp + spaceGroupedTight.dp)
        } else {
            // Center inside input
            0.dp
        },
        animationSpec = animationSpec,
        label = "labelOffsetY"
    )
    
    val labelColor by animateColorAsState(
        targetValue = when {
            hasError -> colorError
            isSuccess -> colorSuccessStrong
            isFocused -> colorPrimary
            else -> colorTextSubtle
        },
        animationSpec = animationSpec,
        label = "labelColor"
    )
    
    val borderColor by animateColorAsState(
        targetValue = when {
            hasError -> colorError
            isSuccess -> colorSuccessStrong
            isFocused -> colorPrimary
            else -> colorBorder
        },
        animationSpec = animationSpec,
        label = "borderColor"
    )
    
    // Icon opacity animation
    val iconOpacity by animateFloatAsState(
        targetValue = if (showErrorIcon || showSuccessIcon || showInfoIconVisible) 1f else 0f,
        animationSpec = animationSpec,
        label = "iconOpacity"
    )
    
    // Main layout
    Column(
        modifier = modifier
            .fillMaxWidth()
            .semantics {
                if (helperText != null) {
                    contentDescription = helperText
                }
                if (errorMessage != null) {
                    error(errorMessage)
                }
            }
    ) {
        // Input wrapper with label and trailing icon
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = tapAreaRecommended.dp), // WCAG minimum touch target
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Input field with label
            Box(
                modifier = Modifier
                    .weight(1f)
            ) {
                // Input field
                BasicTextField(
                value = value,
                onValueChange = { newValue ->
                    // Enforce max length
                    val finalValue = if (maxLength != null && newValue.length > maxLength) {
                        newValue.take(maxLength)
                    } else {
                        newValue
                    }
                    onValueChange(finalValue)
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .focusRequester(focusRequester)
                    .onFocusChanged { focusState ->
                        val wasFocused = isFocused
                        isFocused = focusState.isFocused
                        
                        if (isFocused && !wasFocused) {
                            onFocus?.invoke()
                        } else if (!isFocused && wasFocused) {
                            onBlur?.invoke()
                        }
                    }
                    .background(
                        color = colorBackground,
                        shape = RoundedCornerShape(radius150.dp)
                    )
                    .border(
                        width = borderDefault.dp,
                        color = borderColor,
                        shape = RoundedCornerShape(radius150.dp)
                    )
                    .padding(spaceInset100.dp),
                textStyle = LocalTextStyle.current.copy(
                    fontSize = typographyInputFontSize.sp,
                    lineHeight = typographyInputLineHeight.sp,
                    fontWeight = FontWeight(typographyInputFontWeight),
                    letterSpacing = typographyInputLetterSpacing.sp,
                    color = colorTextDefault
                ),
                keyboardOptions = KeyboardOptions(
                    keyboardType = getKeyboardType(type),
                    imeAction = imeAction
                ),
                keyboardActions = keyboardActions,
                singleLine = true,
                readOnly = readOnly,
                visualTransformation = if (type == InputType.PASSWORD) {
                    PasswordVisualTransformation()
                } else {
                    VisualTransformation.None
                },
                cursorBrush = SolidColor(colorPrimary),
                decorationBox = { innerTextField ->
                    Box(
                        modifier = Modifier.fillMaxWidth(),
                        contentAlignment = Alignment.CenterStart
                    ) {
                        // Show placeholder only when label is floated and input is empty
                        if (isLabelFloated && value.isEmpty() && placeholder != null) {
                            Text(
                                text = placeholder,
                                style = TextStyle(
                                    fontSize = typographyInputFontSize.sp,
                                    color = colorTextSubtle.copy(alpha = 0.5f)
                                )
                            )
                        }
                        innerTextField()
                    }
                }
            )
            
                // Floating label
                Text(
                    text = label + if (required) " *" else "",
                    style = TextStyle(
                        fontSize = labelFontSize.sp,
                        lineHeight = if (isLabelFloated) typographyLabelMdFloatLineHeight.sp else typographyLabelMdLineHeight.sp,
                        fontWeight = FontWeight(typographyLabelMdFontWeight),
                        letterSpacing = typographyLabelMdLetterSpacing.sp,
                        color = labelColor
                    ),
                    modifier = Modifier
                        .align(Alignment.CenterStart)
                        .offset(
                            x = spaceInset100.dp,
                            y = labelOffsetY
                        )
                        .padding(horizontal = 4.dp) // Small padding for better readability
                )
            }
            
            // Trailing icon (error, success, or info) with fade animation
            Box(
                modifier = Modifier
                    .padding(end = spaceInset100.dp)
                    .graphicsLayer(alpha = iconOpacity)
            ) {
                when {
                    showErrorIcon -> Icon(
                        name = "x",
                        size = 24.dp,
                        color = colorError
                    )
                    showSuccessIcon -> Icon(
                        name = "check",
                        size = 24.dp,
                        color = colorSuccessStrong
                    )
                    showInfoIconVisible -> Icon(
                        name = "info",
                        size = 24.dp,
                        color = colorTextSubtle
                    )
                }
            }
        }
        
        // Helper text (persistent)
        if (helperText != null) {
            Spacer(modifier = Modifier.height(spaceGroupedMinimal.dp))
            Text(
                text = helperText,
                style = TextStyle(
                    fontSize = typographyCaptionFontSize.sp,
                    lineHeight = typographyCaptionLineHeight.sp,
                    fontWeight = FontWeight(typographyCaptionFontWeight),
                    letterSpacing = typographyCaptionLetterSpacing.sp,
                    color = colorTextSubtle
                ),
                modifier = Modifier.padding(start = spaceInset100.dp)
            )
        }
        
        // Error message (conditional)
        if (errorMessage != null) {
            Spacer(modifier = Modifier.height(spaceGroupedMinimal.dp))
            Text(
                text = errorMessage,
                style = TextStyle(
                    fontSize = typographyCaptionFontSize.sp,
                    lineHeight = typographyCaptionLineHeight.sp,
                    fontWeight = FontWeight(typographyCaptionFontWeight),
                    letterSpacing = typographyCaptionLetterSpacing.sp,
                    color = colorError
                ),
                modifier = Modifier.padding(start = spaceInset100.dp)
            )
        }
    }
}

/**
 * Get keyboard type for input type
 */
private fun getKeyboardType(type: InputType): KeyboardType {
    return when (type) {
        InputType.TEXT -> KeyboardType.Text
        InputType.EMAIL -> KeyboardType.Email
        InputType.PASSWORD -> KeyboardType.Password
        InputType.TEL -> KeyboardType.Phone
        InputType.URL -> KeyboardType.Uri
    }
}

// MARK: - Design Token Constants

// Typography tokens - labelMd (16sp)
private const val typographyLabelMdFontSize = 16f
private const val typographyLabelMdLineHeight = 24f
private const val typographyLabelMdFontWeight = 500
private const val typographyLabelMdLetterSpacing = 0f

// Typography tokens - labelMdFloat (14sp, via scale088 × fontSize100)
private const val typographyLabelMdFloatFontSize = 14f
private const val typographyLabelMdFloatLineHeight = 20f
private const val typographyLabelMdFloatFontWeight = 500
private const val typographyLabelMdFloatLetterSpacing = 0f

// Typography tokens - input (16sp)
private const val typographyInputFontSize = 16f
private const val typographyInputLineHeight = 24f
private const val typographyInputFontWeight = 400
private const val typographyInputLetterSpacing = 0f

// Typography tokens - caption (13sp)
private const val typographyCaptionFontSize = 13f
private const val typographyCaptionLineHeight = 18f
private const val typographyCaptionFontWeight = 400
private const val typographyCaptionLetterSpacing = 0f

// Color tokens
private val colorTextSubtle = Color(0xFF6B7280) // #6B7280
private val colorTextDefault = Color(0xFF000000) // #000000
private val colorPrimary = Color(0xFF3B82F6) // #3B82F6
private val colorError = Color(0xFFEF4444) // #EF4444
private val colorSuccessStrong = Color(0xFF10B981) // #10B981
private val colorBorder = Color(0xFFD1D5DB) // #D1D5DB
private val colorBackground = Color(0xFFFFFFFF) // #FFFFFF

// Spacing tokens
private const val spaceInset100 = 8f // Input padding
private const val spaceGroupedTight = 4f // Label offset spacing
private const val spaceGroupedMinimal = 2f // Element spacing

// Motion tokens - motion.floatLabel (duration250 + easingStandard)
private const val motionFloatLabelDuration = 250 // 250ms
// Easing: cubic-bezier(0.4, 0.0, 0.2, 1.0) - Material Design standard curve

// Border tokens
private const val borderDefault = 1f // Border width
private const val radius150 = 12f // Border radius

// Accessibility tokens
private const val tapAreaRecommended = 48f // Minimum touch target (WCAG)
private const val accessibilityFocusWidth = 2f // Focus ring width
private const val accessibilityFocusOffset = 2f // Focus ring offset
private val accessibilityFocusColor = Color(0xFF3B82F6) // #3B82F6
