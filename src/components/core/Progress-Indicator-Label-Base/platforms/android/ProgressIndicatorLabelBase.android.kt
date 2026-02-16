/**
 * Progress-Indicator-Label-Base Component for Android Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Indicator-Label-Base
 * 
 * Label element positioned centered below progress indicator nodes.
 * Renders primary label text with optional helper text, using
 * typography.labelSm token for consistent text styling.
 * 
 * @module Progress-Indicator-Label-Base/platforms/android
 * @see Requirements: 1.8-1.10
 * @see .kiro/specs/048-progress-family/design.md
 */

package com.designerpunk.components.core

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.designerpunk.tokens.DesignTokens

// MARK: - Typography Constants

/**
 * Typography token values for labelSm.
 * References typography.labelSm composite token:
 * - fontSize: fontSize075 (14sp)
 * - fontWeight: fontWeight500 (Medium)
 * 
 * @see Requirements 1.8 - Apply typography.labelSm token (14px)
 */
private val labelFontSize = 14.sp  // typography.labelSm → fontSize075
private val labelFontWeight = FontWeight.Medium  // fontWeight500

// MARK: - Progress-Indicator-Label-Base Composable

/**
 * Progress-Indicator-Label-Base Composable
 * 
 * Renders a label centered below a progress indicator node with
 * optional helper text and single-line truncation.
 * 
 * @param label Primary label text (required)
 * @param helperText Optional helper text below the label
 * @param optional Whether this step is optional
 * @param testTag Test identifier. Defaults to null
 * @param modifier Additional Compose modifiers
 * 
 * @see Requirements: 1.8-1.10
 */
@Composable
fun ProgressIndicatorLabelBase(
    label: String,
    helperText: String? = null,
    optional: Boolean = false,
    testTag: String? = null,
    modifier: Modifier = Modifier
) {
    val labelModifier = modifier
        .then(if (testTag != null) Modifier.testTag(testTag) else Modifier)
        .clearAndSetSemantics { } // Primitive is decorative; semantic variant handles a11y
        .fillMaxWidth()

    Column(
        modifier = labelModifier,
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_025)
    ) {
        // Primary label text
        // @see Requirement 1.8 - Position centered below node
        // @see Requirement 1.10 - Truncate with ellipsis
        Text(
            text = label,
            fontSize = labelFontSize,
            fontWeight = labelFontWeight,
            color = Color(DesignTokens.color_text_default),
            textAlign = TextAlign.Center,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )

        // Optional helper text
        // @see Requirement 1.9 - Support optional helper text
        if (helperText != null) {
            Text(
                text = helperText,
                fontSize = labelFontSize,
                fontWeight = labelFontWeight,
                color = Color(DesignTokens.color_text_subtle).copy(alpha = 0.7f),
                textAlign = TextAlign.Center,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

// MARK: - Preview

@Preview(showBackground = true, name = "ProgressIndicatorLabelBase Variants")
@Composable
fun ProgressIndicatorLabelBasePreview() {
    Column(
        modifier = Modifier.padding(DesignTokens.space_200),
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300)
    ) {
        Text(text = "Progress-Indicator-Label-Base")

        // Basic label
        Text(text = "Basic Label")
        ProgressIndicatorLabelBase(label = "Step 1")

        // Label with helper text
        Text(text = "With Helper Text")
        ProgressIndicatorLabelBase(
            label = "Personal Info",
            helperText = "Name, email, phone"
        )

        // Optional step
        Text(text = "Optional Step")
        ProgressIndicatorLabelBase(
            label = "Additional Details",
            optional = true
        )

        // Long text truncation
        Text(text = "Long Text (Truncation)")
        ProgressIndicatorLabelBase(
            label = "This is a very long step label that should truncate",
            helperText = "This helper text is also very long and should truncate with ellipsis",
            modifier = Modifier.width(DesignTokens.space_200) /* preview constraint */
        )
    }
}
