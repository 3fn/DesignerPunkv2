/**
 * Input-Checkbox-Legal Component for Android Platform
 * 
 * Specialized checkbox for legal consent scenarios (terms of service, privacy policies,
 * GDPR consent) with audit capabilities and stricter validation.
 * 
 * **Architecture**: Wrapper pattern - wraps InputCheckboxBase with fixed configuration
 * and Legal-specific features. This reduces code duplication by ~80% and ensures
 * Legal inherits Base improvements automatically.
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Input-Checkbox-Legal
 * Component Type: Semantic Variant (wraps Base)
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
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.sp
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

// MARK: - Legal-Specific Tokens

/**
 * Legal checkbox-specific design tokens.
 * 
 * Only contains tokens specific to Legal that are NOT part of Base.
 * All other tokens (colors, sizes, etc.) come from InputCheckboxBase.
 * 
 * @see Requirement 9.8-9.9 - Required indicator
 */
private object LegalCheckboxTokens {
    /** Required indicator text color
     * References: color.text.muted
     */
    val requiredIndicatorColor: Color
        get() = Color(DesignTokens.color_text_muted)
    
    /** Required indicator font size
     * References: fontSize050 (12sp)
     */
    val requiredFontSize: Float = DesignTokens.font_size_050
    
    /** Minimal spacing between required indicator and checkbox
     * References: space.grouped.minimal (2dp)
     */
    val minimalSpacing = DesignTokens.space_grouped_minimal
}

// MARK: - InputCheckboxLegal Composable

/**
 * InputCheckboxLegal Composable
 * 
 * **Wrapper Pattern**: This component wraps InputCheckboxBase with fixed configuration
 * (lg size, top alignment, sm typography) and adds Legal-specific features:
 * - Required indicator (rendered above Base)
 * - Explicit consent enforcement (intercepts checked state)
 * - Audit trail (onConsentChange with timestamp, legalTextId, version)
 * - No indeterminate support (not passed to Base)
 * 
 * ## Key Features
 * 
 * - **Fixed Sizing**: lg box (40dp) with labelSm typography (14sp)
 * - **Fixed Alignment**: Top alignment for multi-line legal text
 * - **Explicit Consent**: Prevents pre-checking when requiresExplicitConsent is true
 * - **Audit Trail**: Provides ISO 8601 timestamp and legal text metadata
 * - **Required Indicator**: Shows "Required" label by default
 * - **No Indeterminate**: Legal consent is binary (checked/unchecked only)
 * - **No Truncation**: Label text is never truncated (inherited from Base)
 * 
 * ## Accessibility (TalkBack Support)
 * 
 * Inherits full accessibility from InputCheckboxBase:
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
    
    // Handle checkbox toggle with audit trail
    // Transforms Base's onCheckedChange to Legal's onConsentChange
    val handleChange: (Boolean) -> Unit = { newValue ->
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
            ),
        verticalArrangement = Arrangement.spacedBy(LegalCheckboxTokens.minimalSpacing)
    ) {
        // Required indicator (above checkbox, Legal-specific)
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
                    .clearAndSetSemantics {
                        contentDescription = "Required field"
                    }
            )
        }
        
        // Wrapped InputCheckboxBase with fixed configuration
        // @see Requirement 9.1 - Fixed sizing (lg box + labelSm typography)
        // @see Requirement 9.2 - Fixed top label alignment
        // @see Requirement 9.10 - No indeterminate state (not passed to Base)
        InputCheckboxBase(
            checked = checked,
            onCheckedChange = handleChange,
            label = label,
            indeterminate = false,  // Legal never supports indeterminate
            size = CheckboxSize.Large,  // Fixed: lg box (40dp)
            labelAlign = LabelAlignment.Top,  // Fixed: top alignment for multi-line legal text
            labelTypography = LabelTypography.Small,  // Fixed: labelSm typography
            helperText = helperText,
            errorMessage = errorMessage,
            testTag = null  // testTag is on the outer Column
        )
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
            text = "InputCheckboxLegal Component (Wrapper Pattern)",
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
            label = "By checking this box, I acknowledge that I have read, understood, and agree to be bound by the Terms of Service, Privacy Policy, and Cookie Policy. I understand that my personal data will be processed in accordance with these policies and that I may withdraw my consent at any time by contacting support."
        )
    }
}
