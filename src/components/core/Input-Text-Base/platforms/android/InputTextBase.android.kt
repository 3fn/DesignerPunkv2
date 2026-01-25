/**
 * Input-Text-Base Android Component
 * 
 * Android platform implementation of the Input-Text-Base component using Jetpack Compose.
 * Implements float label pattern with animated transitions using motion.floatLabel token.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Base
 * 
 * Features:
 * - Float label animation (labelMd → labelMdFloat)
 * - Color animation (text.subtle → primary with blend.focusSaturate)
 * - Offset animation (translateY)
 * - Trailing icon support (error, success, info)
 * - Respects reduce motion settings
 * - WCAG 2.1 AA compliant
 * - Uses theme-aware blend utilities for state colors (focus, disabled)
 * 
 * Behavioral Contracts:
 * - focusable: Can receive keyboard focus
 * - float_label_animation: Label animates on focus
 * - validates_on_blur: Validation triggers on blur
 * - error_state_display: Shows error message and styling
 * - success_state_display: Shows success styling
 * - disabled_state: Prevents interaction when disabled
 * - trailing_icon_display: Shows contextual trailing icons
 * - focus_ring: WCAG 2.4.7 focus visible indicator
 * - reduced_motion_support: Respects prefers-reduced-motion
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.5, 4.1, 4.2, 4.3, 8.1, 8.2, 8.3, 8.5, 11.1, 11.2, 11.3, 13.1
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
import com.designerpunk.tokens.focusBlend
import com.designerpunk.tokens.disabledBlend

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
 * Input-Text-Base Composable
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
 * @param isDisabled Disabled state
 */
@Composable
fun InputTextBase(
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
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    isDisabled: Boolean = false
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
            easing = easingStandard
        )
    }
    
    // Track label animation state changes
    LaunchedEffect(isLabelFloated) {
        labelAnimationComplete = false
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
            -(typographyLabelMdLineHeight + spaceGroupedTight)
        } else {
            0.dp
        },
        animationSpec = animationSpec,
        label = "labelOffsetY"
    )
    
    val labelColor by animateColorAsState(
        targetValue = when {
            hasError -> colorFeedbackErrorText
            isSuccess -> colorFeedbackSuccessText
            isDisabled -> colorActionPrimary.disabledBlend()
            isFocused -> colorActionPrimary.focusBlend()
            else -> colorTextMuted
        },
        animationSpec = animationSpec,
        label = "labelColor"
    )
    
    val borderColor by animateColorAsState(
        targetValue = when {
            hasError -> colorFeedbackErrorText
            isSuccess -> colorFeedbackSuccessText
            isDisabled -> colorActionPrimary.disabledBlend()
            isFocused -> colorActionPrimary.focusBlend()
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
                .heightIn(min = tapAreaRecommended),
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
                        shape = RoundedCornerShape(radius150)
                    )
                    .border(
                        width = borderDefault,
                        color = borderColor,
                        shape = RoundedCornerShape(radius150)
                    )
                    .then(
                        if (isFocused && !isDisabled) {
                            Modifier.border(
                                width = accessibilityFocusWidth,
                                color = accessibilityFocusColor,
                                shape = RoundedCornerShape(radius150)
                            )
                            .padding(accessibilityFocusOffset)
                        } else {
                            Modifier
                        }
                    )
                    .padding(spaceInset100),
                textStyle = LocalTextStyle.current.copy(
                    fontSize = typographyInputFontSize.sp,
                    lineHeight = typographyInputLineHeight.sp,
                    fontWeight = FontWeight(typographyInputFontWeight),
                    letterSpacing = typographyInputLetterSpacing.sp,
                    color = if (isDisabled) colorTextMuted else colorTextDefault
                ),
                keyboardOptions = KeyboardOptions(
                    keyboardType = getKeyboardType(type),
                    imeAction = imeAction
                ),
                keyboardActions = keyboardActions,
                singleLine = true,
                readOnly = readOnly || isDisabled,
                visualTransformation = if (type == InputType.PASSWORD) {
                    PasswordVisualTransformation()
                } else {
                    VisualTransformation.None
                },
                cursorBrush = SolidColor(colorActionPrimary),
                decorationBox = { innerTextField ->
                    Box(
                        modifier = Modifier.fillMaxWidth(),
                        contentAlignment = Alignment.CenterStart
                    ) {
                        if (isLabelFloated && value.isEmpty() && placeholder != null) {
                            Text(
                                text = placeholder,
                                style = TextStyle(
                                    fontSize = typographyInputFontSize.sp,
                                    color = colorTextMuted.copy(alpha = 0.5f)
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
                            x = spaceInset100,
                            y = labelOffsetY
                        )
                        .padding(horizontal = spaceGroupedTight)
                )
            }
            
            // Trailing icon (error, success, or info) with fade animation
            Box(
                modifier = Modifier
                    .padding(end = spaceInset100)
                    .graphicsLayer(alpha = iconOpacity)
            ) {
                when {
                    showErrorIcon -> Icon(
                        name = "x",
                        size = iconSize100,
                        color = colorFeedbackErrorText
                    )
                    showSuccessIcon -> Icon(
                        name = "check",
                        size = iconSize100,
                        color = colorFeedbackSuccessText
                    )
                    showInfoIconVisible -> Icon(
                        name = "info",
                        size = iconSize100,
                        color = colorTextMuted
                    )
                }
            }
        }
        
        // Helper text (persistent)
        if (helperText != null) {
            Spacer(modifier = Modifier.height(spaceGroupedMinimal))
            Text(
                text = helperText,
                style = TextStyle(
                    fontSize = typographyCaptionFontSize.sp,
                    lineHeight = typographyCaptionLineHeight.sp,
                    fontWeight = FontWeight(typographyCaptionFontWeight),
                    letterSpacing = typographyCaptionLetterSpacing.sp,
                    color = colorTextMuted
                ),
                modifier = Modifier.padding(start = spaceInset100)
            )
        }
        
        // Error message (conditional)
        if (errorMessage != null) {
            Spacer(modifier = Modifier.height(spaceGroupedMinimal))
            Text(
                text = errorMessage,
                style = TextStyle(
                    fontSize = typographyCaptionFontSize.sp,
                    lineHeight = typographyCaptionLineHeight.sp,
                    fontWeight = FontWeight(typographyCaptionFontWeight),
                    letterSpacing = typographyCaptionLetterSpacing.sp,
                    color = colorFeedbackErrorText
                ),
                modifier = Modifier.padding(start = spaceInset100)
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
// These constants reference semantic tokens that will be generated by the build system.

// Typography tokens - labelMd (typography.labelMd)
private const val typographyLabelMdFontSize: Float // Generated from typography.labelMd.fontSize
private val typographyLabelMdLineHeight: Dp // Generated from typography.labelMd.lineHeight
private const val typographyLabelMdFontWeight: Int // Generated from typography.labelMd.fontWeight
private const val typographyLabelMdLetterSpacing: Float // Generated from typography.labelMd.letterSpacing

// Typography tokens - labelMdFloat (typography.labelMdFloat)
private const val typographyLabelMdFloatFontSize: Float // Generated from typography.labelMdFloat.fontSize
private const val typographyLabelMdFloatLineHeight: Float // Generated from typography.labelMdFloat.lineHeight
private const val typographyLabelMdFloatFontWeight: Int // Generated from typography.labelMdFloat.fontWeight
private const val typographyLabelMdFloatLetterSpacing: Float // Generated from typography.labelMdFloat.letterSpacing

// Typography tokens - input (typography.input)
private const val typographyInputFontSize: Float // Generated from typography.input.fontSize
private const val typographyInputLineHeight: Float // Generated from typography.input.lineHeight
private const val typographyInputFontWeight: Int // Generated from typography.input.fontWeight
private const val typographyInputLetterSpacing: Float // Generated from typography.input.letterSpacing

// Typography tokens - caption (typography.caption)
private const val typographyCaptionFontSize: Float // Generated from typography.caption.fontSize
private const val typographyCaptionLineHeight: Float // Generated from typography.caption.lineHeight
private const val typographyCaptionFontWeight: Int // Generated from typography.caption.fontWeight
private const val typographyCaptionLetterSpacing: Float // Generated from typography.caption.letterSpacing

// Color tokens (semantic)
private val colorTextMuted: Color // Generated from color.text.muted
private val colorTextDefault: Color // Generated from color.text.default
private val colorActionPrimary: Color // Generated from color.action.primary
private val colorFeedbackErrorText: Color // Generated from color.feedback.error.text
private val colorFeedbackSuccessText: Color // Generated from color.feedback.success.text
private val colorBorder: Color // Generated from color.border
private val colorBackground: Color // Generated from color.background

// Spacing tokens (semantic) - Dp type
private val spaceInset100: Dp // Generated from space.inset.100
private val spaceGroupedTight: Dp // Generated from space.grouped.tight
private val spaceGroupedMinimal: Dp // Generated from space.grouped.minimal

// Motion tokens - motion.floatLabel (duration250 + easingStandard)
private const val motionFloatLabelDuration: Int // Generated from motion.floatLabel.duration (250ms)
private val easingStandard = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f) // Material Design standard curve

// Border tokens - Dp type
private val borderDefault: Dp // Generated from border.default
private val radius150: Dp // Generated from radius.150

// Icon tokens - Dp type
private val iconSize100: Dp // Generated from icon.size100 (24dp)

// Accessibility tokens - Dp type
private val tapAreaRecommended: Dp // Generated from accessibility.tapArea.recommended (48dp minimum)
private val accessibilityFocusWidth: Dp // Generated from accessibility.focus.width
private val accessibilityFocusOffset: Dp // Generated from accessibility.focus.offset
private val accessibilityFocusColor: Color // Generated from accessibility.focus.color
