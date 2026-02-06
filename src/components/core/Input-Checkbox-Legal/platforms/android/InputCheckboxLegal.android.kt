/**
 * Input-Checkbox-Legal Component for Android Platform
 * 
 * Specialized checkbox for legal consent scenarios (terms of service, privacy policies,
 * GDPR consent) with audit capabilities and stricter validation.
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Input-Checkbox-Legal
 * Component Type: Semantic Variant (extends Base conceptually)
 * 
 * Key Differences from Input-Checkbox-Base:
 * - Fixed sizing: lg box (40px) with labelSm typography
 * - Fixed label alignment: top (for multi-line legal text)
 * - No indeterminate state support
 * - Explicit consent enforcement (prevents pre-checking)
 * - Audit trail support (timestamp, legalTextId, version)
 * - Required indicator visible by default
 * - No label truncation
 * 
 * Follows True Native Architecture with platform-specific Jetpack Compose implementation
 * while maintaining API consistency with web and iOS platforms.
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered.
 * 
 * @module Input-Checkbox-Legal/platforms/android
 * @see Requirements: 9.1-9.11
 */

package com.designerpunk.components.core

import android.util.Log
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.ripple.rememberRipple
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.semantics.toggleableState
import androidx.compose.ui.state.ToggleableState
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.designerpunk.tokens.BlendTokenValues
import com.designerpunk.tokens.DesignTokens
import java.time.Instant
import java.time.format.DateTimeFormatter

// MARK: - Consent Change Data

/**
 * Consent change event data with audit trail information.
 * 
 * This data class defines the data passed to the onConsentChange callback,
 * providing all information needed for legal audit trails.
 * 
 * @see Requirement 9.5-9.7 in .kiro/specs/046-input-checkbox-base/requirements.md
 */
data class ConsentChangeData(
    /** Whether consent was given (true) or withdrawn (false) */
    val consented: Boolean,
    
    /** ISO 8601 timestamp of when consent state changed
     * Format: YYYY-MM-DDTHH:mm:ss.sssZ
     */
    val timestamp: String,
    
    /** ID linking to full legal text (for audit trail) */
    val legalTextId: String? = null,
    
    /** Version of legal text being consented to */
    val legalTextVersion: String? = null
)

// MARK: - Legal Checkbox Tokens

/**
 * Legal checkbox-specific design tokens.
 * 
 * These tokens are fixed for the Legal checkbox variant:
 * - lg box size (40dp)
 * - labelSm typography (14sp)
 * - top label alignment
 * 
 * @see Requirement 9.1 - Fixed sizing
 */
private object LegalCheckboxTokens {
    // MARK: - Fixed Size Tokens (lg size)
    
    /** Fixed icon size for Legal checkbox (lg size = 24dp icon)
     * @see Requirement 9.1 - Fixed sizing
     */
    val iconSize: Dp = DesignTokens.icon_size_100  // 24dp
    
    /** Fixed inset padding for Legal checkbox (lg size = 8dp inset)
     * @see Requirement 9.1 - Fixed sizing
     */
    val inset: Dp = DesignTokens.space_inset_100  // 8dp
    
    /** Computed box size (icon + inset padding on both sides) = 40dp
     * @see Requirement 9.1 - Fixed sizing
     */
    val boxSize: Dp = iconSize + (inset * 2)  // 24 + 8 + 8 = 40dp
    
    /** Fixed gap between checkbox box and label (lg size = loose)
     * @see Requirement 9.1 - Fixed sizing
     */
    val gap: Dp = DesignTokens.space_grouped_loose  // 12dp
    
    /** Fixed border radius for Legal checkbox (lg size = radiusSmall)
     */
    val radius: Dp = DesignTokens.radius_small  // 4dp
    
    /** Fixed label font size (labelSm typography)
     * @see Requirement 9.1 - Fixed sizing (lg box + labelSm typography)
     */
    val labelFontSize: Float = DesignTokens.font_size_075  // 14sp (labelSm)
    
    // MARK: - Color Tokens
    
    /** Unchecked background color (transparent) */
    val uncheckedBackground: Color = Color.Transparent
    
    /** Checked background color
     * References: color.feedback.select.background.rest
     */
    val checkedBackground: Color
        get() = Color(DesignTokens.color_feedback_select_background_rest)
    
    /** Default border color (unchecked)
     * References: color.feedback.select.border.default
     */
    val defaultBorderColor: Color
        get() = Color(DesignTokens.color_feedback_select_border_default)
    
    /** Active border color (checked)
     * References: color.feedback.select.border.rest
     */
    val activeBorderColor: Color
        get() = Color(DesignTokens.color_feedback_select_border_rest)
    
    /** Error border color
     * References: color.feedback.error.border
     */
    val errorBorderColor: Color
        get() = Color(DesignTokens.color_feedback_error_border)
    
    /** Icon color (on dark/filled background)
     * References: color.contrast.onDark
     */
    val iconColor: Color
        get() = Color(DesignTokens.color_contrast_on_dark)
    
    /** Label text color
     * References: color.text.default
     */
    val labelColor: Color
        get() = Color(DesignTokens.color_text_default)
    
    /** Helper text color
     * References: color.text.muted
     */
    val helperTextColor: Color
        get() = Color(DesignTokens.color_text_muted)
    
    /** Error text color
     * References: color.feedback.error.text
     */
    val errorTextColor: Color
        get() = Color(DesignTokens.color_feedback_error_text)
    
    /** Required indicator text color
     * References: color.text.muted
     */
    val requiredIndicatorColor: Color
        get() = Color(DesignTokens.color_text_muted)
    
    // MARK: - Border Tokens
    
    /** Border width for checkbox box
     * References: borderEmphasis (2dp)
     */
    val borderWidth: Dp = DesignTokens.border_emphasis
    
    // MARK: - Animation Tokens
    
    /** Animation duration for state transitions
     * References: motion.selectionTransition (250ms)
     */
    val animationDuration: Int = DesignTokens.Duration.Duration250
    
    // MARK: - Spacing Tokens
    
    /** Minimum tap area for accessibility
     * References: tapAreaMinimum (44dp)
     * @see Requirement 6.6 - Minimum touch target
     */
    val tapAreaMinimum: Dp = DesignTokens.tap_area_minimum
    
    /** Spacing between helper/error text and checkbox
     * References: space.grouped.tight (4dp)
     */
    val textSpacing: Dp = DesignTokens.space_grouped_tight
    
    /** Minimal spacing between helper and error text
     * References: space.grouped.minimal (2dp)
     */
    val minimalSpacing: Dp = DesignTokens.space_grouped_minimal
    
    // MARK: - Typography Tokens
    
    /** Helper/error text font size
     * References: fontSize050 (12sp)
     */
    val helperFontSize: Float = DesignTokens.font_size_050
    
    /** Required indicator font size
     * References: fontSize050 (12sp)
     */
    val requiredFontSize: Float = DesignTokens.font_size_050
}

// MARK: - InputCheckboxLegal Composable

/**
 * InputCheckboxLegal Composable
 * 
 * A specialized checkbox for legal consent scenarios with fixed sizing,
 * explicit consent enforcement, and audit trail support.
 * 
 * ## Key Features
 * 
 * - **Fixed Sizing**: lg box (40dp) with labelSm typography (14sp)
 * - **Fixed Alignment**: Top alignment for multi-line legal text
 * - **Explicit Consent**: Prevents pre-checking when requiresExplicitConsent is true
 * - **Audit Trail**: Provides ISO 8601 timestamp and legal text metadata
 * - **Required Indicator**: Shows "Required" label by default
 * - **No Indeterminate**: Legal consent is binary (checked/unchecked only)
 * - **No Truncation**: Label text is never truncated
 * 
 * ## Accessibility (TalkBack Support)
 * 
 * This component is fully accessible with TalkBack:
 * - **Role**: Checkbox role is set for proper TalkBack behavior
 * - **State**: TalkBack announces "checked" or "not checked"
 * - **Label**: The label text is announced as the content description
 * - **Hint**: Action hints guide users ("Double tap to give/withdraw consent")
 * - **Touch Target**: Minimum 44dp touch target for WCAG 2.5.5 compliance
 * 
 * Usage:
 * ```kotlin
 * // Basic legal consent usage
 * var hasConsented by remember { mutableStateOf(false) }
 * InputCheckboxLegal(
 *     checked = hasConsented,
 *     onCheckedChange = { hasConsented = it },
 *     label = "I agree to the Terms of Service and Privacy Policy",
 *     onConsentChange = { data ->
 *         println("Consent: ${data.consented} at ${data.timestamp}")
 *     }
 * )
 * 
 * // With audit trail
 * InputCheckboxLegal(
 *     checked = hasConsented,
 *     onCheckedChange = { hasConsented = it },
 *     label = "I consent to the processing of my personal data",
 *     legalTextId = "privacy-policy-v2",
 *     legalTextVersion = "2.1.0",
 *     onConsentChange = { data ->
 *         auditLog.record(
 *             action = if (data.consented) "CONSENT_GIVEN" else "CONSENT_WITHDRAWN",
 *             timestamp = data.timestamp,
 *             documentId = data.legalTextId,
 *             documentVersion = data.legalTextVersion
 *         )
 *     }
 * )
 * ```
 * 
 * Requirements:
 * - 9.1: Fixed sizing (lg box + labelSm typography)
 * - 9.2: Fixed top label alignment
 * - 9.3-9.4: Explicit consent enforcement
 * - 9.5-9.7: Audit trail support (timestamp, legalTextId, version)
 * - 9.8-9.9: Required indicator
 * - 9.10: No indeterminate state
 * - 9.11: No label truncation
 * 
 * @param checked Whether checkbox is checked
 * @param onCheckedChange Called when checkbox state changes
 * @param label Label text (required for accessibility)
 * @param modifier Additional Compose modifiers
 * @param helperText Optional helper text displayed below checkbox
 * @param errorMessage Optional error message displayed below helper text
 * @param requiresExplicitConsent Prevents pre-checking (default: true)
 * @param legalTextId Optional legal text ID for audit trail
 * @param legalTextVersion Optional legal text version for audit trail
 * @param showRequiredIndicator Show "Required" indicator (default: true)
 * @param onConsentChange Optional consent change callback with audit data
 * @param testTag Test identifier for automated testing
 */
@Composable
fun InputCheckboxLegal(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    helperText: String? = null,
    errorMessage: String? = null,
    requiresExplicitConsent: Boolean = true,
    legalTextId: String? = null,
    legalTextVersion: String? = null,
    showRequiredIndicator: Boolean = true,
    onConsentChange: ((ConsentChangeData) -> Unit)? = null,
    testTag: String? = null
) {
    // Track if consent warning has been shown
    var consentWarningShown by remember { mutableStateOf(false) }
    
    // Enforce explicit consent on initial composition
    // @see Requirement 9.3-9.4 - Explicit consent enforcement
    LaunchedEffect(checked, requiresExplicitConsent) {
        if (requiresExplicitConsent && checked) {
            if (!consentWarningShown) {
                Log.w(
                    "InputCheckboxLegal",
                    "Pre-checked state not allowed with requiresExplicitConsent. " +
                    "Overriding to unchecked. Legal consent must be explicitly given by the user."
                )
                consentWarningShown = true
            }
            // Override to unchecked
            onCheckedChange(false)
        }
    }
    
    // Track interaction state for ripple effect
    val interactionSource = remember { MutableInteractionSource() }
    
    // Determine visual state
    val hasError = errorMessage != null
    
    // Animated colors for smooth state transitions
    val backgroundColor by animateColorAsState(
        targetValue = if (checked) LegalCheckboxTokens.checkedBackground else LegalCheckboxTokens.uncheckedBackground,
        animationSpec = tween(durationMillis = LegalCheckboxTokens.animationDuration),
        label = "legalCheckboxBackground"
    )
    
    val borderColor by animateColorAsState(
        targetValue = when {
            hasError -> LegalCheckboxTokens.errorBorderColor
            checked -> LegalCheckboxTokens.activeBorderColor
            else -> LegalCheckboxTokens.defaultBorderColor
        },
        animationSpec = tween(durationMillis = LegalCheckboxTokens.animationDuration),
        label = "legalCheckboxBorder"
    )
    
    // Accessibility state description
    // @see Requirement 6.2 - Screen reader announces state
    // Note: No indeterminate state for Legal checkbox
    val stateDesc = if (checked) "checked" else "unchecked"
    
    // Toggleable state for TalkBack checkbox semantics
    val toggleableState = if (checked) ToggleableState.On else ToggleableState.Off
    
    // Accessibility hint providing action context
    val accessibilityHint = if (checked) {
        "Double tap to withdraw consent"
    } else {
        "Double tap to give consent"
    }
    
    // Handle checkbox toggle with audit trail
    val handleToggle: () -> Unit = {
        val newValue = !checked
        
        // Call base onCheckedChange
        onCheckedChange(newValue)
        
        // Generate ISO 8601 timestamp
        // @see Requirement 9.5 - ISO 8601 timestamp
        val timestamp = DateTimeFormatter.ISO_INSTANT.format(Instant.now())
        
        // Build consent change data with audit trail
        // @see Requirements 9.5-9.7 - Audit trail support
        val consentData = ConsentChangeData(
            consented = newValue,
            timestamp = timestamp,
            legalTextId = legalTextId,
            legalTextVersion = legalTextVersion
        )
        
        // Fire consent change callback
        onConsentChange?.invoke(consentData)
    }
    
    Column(
        modifier = modifier
            .then(
                if (testTag != null) Modifier.testTag(testTag) else Modifier
            )
    ) {
        // Required indicator (above checkbox)
        // @see Requirement 9.8-9.9 - Required indicator
        if (showRequiredIndicator) {
            Text(
                text = "Required",
                style = TextStyle(
                    fontSize = LegalCheckboxTokens.requiredFontSize.sp,
                    fontWeight = FontWeight.Medium
                ),
                color = LegalCheckboxTokens.requiredIndicatorColor,
                modifier = Modifier
                    .padding(bottom = LegalCheckboxTokens.minimalSpacing)
                    .clearAndSetSemantics {
                        contentDescription = "Required field"
                    }
            )
        }
        
        // Main checkbox row
        // Fixed top alignment for multi-line legal text
        // @see Requirement 9.2 - Fixed top label alignment
        Row(
            verticalAlignment = Alignment.Top,
            horizontalArrangement = Arrangement.spacedBy(LegalCheckboxTokens.gap),
            modifier = Modifier
                // @see Requirement 6.6 - Minimum 44dp touch target
                .sizeIn(minHeight = LegalCheckboxTokens.tapAreaMinimum, minWidth = LegalCheckboxTokens.tapAreaMinimum)
                // @see Requirement 6.5 - Entire label area tappable
                .clickable(
                    onClick = handleToggle,
                    interactionSource = interactionSource,
                    // @see Requirement 7.3 - Material ripple effect using blend.pressedDarker
                    indication = rememberRipple(
                        bounded = true,
                        color = LegalCheckboxTokens.activeBorderColor.copy(
                            alpha = BlendTokenValues.pressedDarker
                        )
                    )
                )
                // @see Requirements 6.1-6.4 - Accessibility semantics for TalkBack
                .semantics(mergeDescendants = true) {
                    contentDescription = "$label, $accessibilityHint"
                    stateDescription = stateDesc
                    role = Role.Checkbox
                    this.toggleableState = toggleableState
                }
        ) {
            // Checkbox box (fixed lg size)
            LegalCheckboxBox(
                isChecked = checked,
                backgroundColor = backgroundColor,
                borderColor = borderColor
            )
            
            // Label text (fixed labelSm typography, no truncation)
            // @see Requirement 9.1 - Fixed sizing (lg box + labelSm typography)
            // @see Requirement 9.11 - No label truncation
            Text(
                text = label,
                style = TextStyle(
                    fontSize = LegalCheckboxTokens.labelFontSize.sp,
                    fontWeight = FontWeight.Medium
                ),
                color = LegalCheckboxTokens.labelColor
                // Note: No maxLines or overflow - label is never truncated
            )
        }
        
        // Helper text and error message
        // @see Requirements 5.1-5.6 - Helper text and error messages
        if (helperText != null || errorMessage != null) {
            Spacer(modifier = Modifier.height(LegalCheckboxTokens.textSpacing))
            
            Column(
                verticalArrangement = Arrangement.spacedBy(LegalCheckboxTokens.minimalSpacing),
                modifier = Modifier.padding(start = LegalCheckboxTokens.boxSize + LegalCheckboxTokens.gap)
            ) {
                // Helper text
                if (helperText != null) {
                    Text(
                        text = helperText,
                        style = TextStyle(
                            fontSize = LegalCheckboxTokens.helperFontSize.sp,
                            fontWeight = FontWeight.Normal
                        ),
                        color = LegalCheckboxTokens.helperTextColor,
                        modifier = Modifier.clearAndSetSemantics {
                            contentDescription = "Helper text: $helperText"
                        }
                    )
                }
                
                // Error message
                if (errorMessage != null) {
                    Text(
                        text = errorMessage,
                        style = TextStyle(
                            fontSize = LegalCheckboxTokens.helperFontSize.sp,
                            fontWeight = FontWeight.Normal
                        ),
                        color = LegalCheckboxTokens.errorTextColor,
                        modifier = Modifier.clearAndSetSemantics {
                            contentDescription = "Error: $errorMessage"
                        }
                    )
                }
            }
        }
    }
}

/**
 * Legal checkbox box composable
 * 
 * Renders the checkbox box with border, background, and check icon.
 * Fixed lg size (40dp) per Requirement 9.1.
 * Only shows check icon (no minus icon - no indeterminate state).
 * 
 * @param isChecked Whether checkbox is checked
 * @param backgroundColor Animated background color
 * @param borderColor Animated border color
 */
@Composable
private fun LegalCheckboxBox(
    isChecked: Boolean,
    backgroundColor: Color,
    borderColor: Color
) {
    Box(
        modifier = Modifier
            .size(LegalCheckboxTokens.boxSize)
            .clip(RoundedCornerShape(LegalCheckboxTokens.radius))
            .background(backgroundColor)
            .border(
                width = LegalCheckboxTokens.borderWidth,
                color = borderColor,
                shape = RoundedCornerShape(LegalCheckboxTokens.radius)
            ),
        contentAlignment = Alignment.Center
    ) {
        // Check icon only (no minus icon - no indeterminate for Legal)
        // @see Requirement 9.10 - No indeterminate state
        if (isChecked) {
            IconBase(
                name = "check",
                size = LegalCheckboxTokens.iconSize,
                color = LegalCheckboxTokens.iconColor
            )
        }
    }
}

// MARK: - Preview

/**
 * Preview composable for InputCheckboxLegal component.
 * 
 * Demonstrates various legal checkbox configurations:
 * - Basic legal consent
 * - With audit trail
 * - With helper text
 * - With error message
 * - Without required indicator
 * - Multi-line label (top aligned)
 */
@Preview(showBackground = true, name = "InputCheckboxLegal Component")
@Composable
fun InputCheckboxLegalPreview() {
    Column(
        modifier = Modifier.padding(DesignTokens.space_200),
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_400)
    ) {
        // Title
        Text(
            text = "InputCheckboxLegal Component",
            style = androidx.compose.material3.MaterialTheme.typography.titleMedium
        )
        
        // Basic legal consent
        Text(
            text = "Basic Legal Consent",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        var basicChecked by remember { mutableStateOf(false) }
        InputCheckboxLegal(
            checked = basicChecked,
            onCheckedChange = { basicChecked = it },
            label = "I agree to the Terms of Service and Privacy Policy"
        )
        
        // With audit trail
        Text(
            text = "With Audit Trail",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        var auditChecked by remember { mutableStateOf(false) }
        InputCheckboxLegal(
            checked = auditChecked,
            onCheckedChange = { auditChecked = it },
            label = "I consent to the processing of my personal data as described in the Privacy Policy",
            legalTextId = "privacy-policy-v2",
            legalTextVersion = "2.1.0",
            onConsentChange = { data ->
                Log.d("Preview", "Consent: ${data.consented} at ${data.timestamp}")
                Log.d("Preview", "Legal Text ID: ${data.legalTextId}")
                Log.d("Preview", "Legal Text Version: ${data.legalTextVersion}")
            }
        )
        
        // With helper text
        Text(
            text = "With Helper Text",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        var helperChecked by remember { mutableStateOf(false) }
        InputCheckboxLegal(
            checked = helperChecked,
            onCheckedChange = { helperChecked = it },
            label = "I agree to receive marketing communications",
            helperText = "You can unsubscribe at any time"
        )
        
        // With error
        Text(
            text = "With Error",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        var errorChecked by remember { mutableStateOf(false) }
        InputCheckboxLegal(
            checked = errorChecked,
            onCheckedChange = { errorChecked = it },
            label = "I have read and accept the Terms of Service",
            errorMessage = "You must accept the terms to continue"
        )
        
        // Without required indicator
        Text(
            text = "Without Required Indicator",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        var optionalChecked by remember { mutableStateOf(false) }
        InputCheckboxLegal(
            checked = optionalChecked,
            onCheckedChange = { optionalChecked = it },
            label = "I would like to receive the newsletter (optional)",
            showRequiredIndicator = false
        )
        
        // Multi-line label (top aligned)
        Text(
            text = "Multi-line Label (Top Aligned)",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        var multilineChecked by remember { mutableStateOf(false) }
        InputCheckboxLegal(
            checked = multilineChecked,
            onCheckedChange = { multilineChecked = it },
            label = "By checking this box, I acknowledge that I have read, understood, and agree to be bound by the Terms of Service, Privacy Policy, and Cookie Policy. I understand that my personal data will be processed in accordance with these policies and that I may withdraw my consent at any time by contacting support.",
            modifier = Modifier.fillMaxWidth()
        )
    }
}
