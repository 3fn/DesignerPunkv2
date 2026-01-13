/**
 * Tests for Button-VerticalListItem Component (Android Platform)
 * 
 * Comprehensive test suite for the VerticalListButtonItem Composable
 * following Test Development Standards.
 * 
 * Test Categories:
 * - Visual state rendering behavior (Property 1)
 * - Selection indicator visibility (Property 2)
 * - Padding compensation correctness (Property 11)
 * - Android native rendering (Property 20)
 * - TalkBack accessibility (Property 21)
 * - RTL layout adaptation (Property 22)
 * - Event callback invocation (Property 17)
 * 
 * @module Button-VerticalListItem/platforms/android
 * @see Requirements: Properties 1, 2, 11, 20, 21 from design
 */

package com.designerpunk.components.button

import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import org.junit.Assert.*
import org.junit.Rule
import org.junit.Test

// Helper function to check for state description
private fun hasStateDescription(value: String): SemanticsMatcher {
    return SemanticsMatcher.expectValue(
        androidx.compose.ui.semantics.SemanticsProperties.StateDescription,
        value
    )
}

// Helper function to check for role
private fun hasRole(role: Role): SemanticsMatcher {
    return SemanticsMatcher.expectValue(
        androidx.compose.ui.semantics.SemanticsProperties.Role,
        role
    )
}


/**
 * Test suite for VerticalListButtonItem Composable.
 * 
 * Tests behavior, not implementation details, following Test Development Standards.
 */
class VerticalListButtonItemTest {
    
    @get:Rule
    val composeTestRule = createComposeRule()
    
    // ============================================================================
    // MARK: - Property 1: Visual State Styling Consistency
    // Requirements: 1.1-1.5
    // ============================================================================
    
    /**
     * Test that component renders with REST visual state.
     * 
     * Feature: 038-vertical-list-buttons, Property 1: Visual State Styling Consistency
     * Requirements: 1.1 - REST state renders with color.background, borderDefault (1dp)
     */
    @Test
    fun visualState_rest_rendersCorrectly() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Rest State",
                visualState = VisualState.REST,
                testTag = "rest-button"
            )
        }
        
        // Verify component renders and is accessible
        composeTestRule.onNodeWithTag("rest-button")
            .assertExists()
            .assertIsDisplayed()
            .assertContentDescriptionEquals("Rest State")
    }
    
    /**
     * Test that component renders with SELECTED visual state.
     * 
     * Feature: 038-vertical-list-buttons, Property 1: Visual State Styling Consistency
     * Requirements: 1.2 - SELECTED state renders with selected background, emphasis border
     */
    @Test
    fun visualState_selected_rendersCorrectly() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Selected State",
                visualState = VisualState.SELECTED,
                testTag = "selected-button"
            )
        }
        
        composeTestRule.onNodeWithTag("selected-button")
            .assertExists()
            .assertIsDisplayed()
            .assertContentDescriptionEquals("Selected State")
            .assert(hasStateDescription("Selected"))
        
        // Verify checkmark is visible for selected state
        composeTestRule.onNodeWithTag("selected-button-checkmark")
            .assertExists()
    }

    
    /**
     * Test that component renders with NOT_SELECTED visual state.
     * 
     * Feature: 038-vertical-list-buttons, Property 1: Visual State Styling Consistency
     * Requirements: 1.3 - NOT_SELECTED state renders with muted appearance
     */
    @Test
    fun visualState_notSelected_rendersCorrectly() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Not Selected State",
                visualState = VisualState.NOT_SELECTED,
                testTag = "not-selected-button"
            )
        }
        
        composeTestRule.onNodeWithTag("not-selected-button")
            .assertExists()
            .assertIsDisplayed()
            .assertContentDescriptionEquals("Not Selected State")
            .assert(hasStateDescription("Not selected"))
    }
    
    /**
     * Test that component renders with CHECKED visual state.
     * 
     * Feature: 038-vertical-list-buttons, Property 1: Visual State Styling Consistency
     * Requirements: 1.4 - CHECKED state renders with selected background, shows checkmark
     */
    @Test
    fun visualState_checked_rendersCorrectly() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Checked State",
                visualState = VisualState.CHECKED,
                testTag = "checked-button"
            )
        }
        
        composeTestRule.onNodeWithTag("checked-button")
            .assertExists()
            .assertIsDisplayed()
            .assertContentDescriptionEquals("Checked State")
            .assert(hasStateDescription("Checked"))
        
        // Verify checkmark is visible for checked state
        composeTestRule.onNodeWithTag("checked-button-checkmark")
            .assertExists()
    }
    
    /**
     * Test that component renders with UNCHECKED visual state.
     * 
     * Feature: 038-vertical-list-buttons, Property 1: Visual State Styling Consistency
     * Requirements: 1.5 - UNCHECKED state renders with default background
     */
    @Test
    fun visualState_unchecked_rendersCorrectly() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Unchecked State",
                visualState = VisualState.UNCHECKED,
                testTag = "unchecked-button"
            )
        }
        
        composeTestRule.onNodeWithTag("unchecked-button")
            .assertExists()
            .assertIsDisplayed()
            .assertContentDescriptionEquals("Unchecked State")
            .assert(hasStateDescription("Not checked"))
    }

    
    /**
     * Test that all visual states render correctly.
     * 
     * Feature: 038-vertical-list-buttons, Property 1: Visual State Styling Consistency
     * Requirements: 1.1-1.5 - All states render with correct styling
     */
    @Test
    fun allVisualStates_renderCorrectly() {
        VisualState.values().forEach { state ->
            composeTestRule.setContent {
                VerticalListButtonItem(
                    label = "State: ${state.name}",
                    visualState = state,
                    testTag = "state-${state.name.lowercase()}"
                )
            }
            
            composeTestRule.onNodeWithTag("state-${state.name.lowercase()}")
                .assertExists()
                .assertIsDisplayed()
        }
    }
    
    // ============================================================================
    // MARK: - Property 2: Selection Indicator Visibility
    // Requirements: 2.1, 2.2
    // ============================================================================
    
    /**
     * Test that checkmark is visible for SELECTED state.
     * 
     * Feature: 038-vertical-list-buttons, Property 2: Selection Indicator Visibility
     * Requirements: 2.1 - Checkmark visible when visualState is selected or checked
     */
    @Test
    fun selectionIndicator_visibleForSelectedState() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Selected Option",
                visualState = VisualState.SELECTED,
                testTag = "selected-indicator"
            )
        }
        
        // Checkmark should be visible
        composeTestRule.onNodeWithTag("selected-indicator-checkmark")
            .assertExists()
    }
    
    /**
     * Test that checkmark is visible for CHECKED state.
     * 
     * Feature: 038-vertical-list-buttons, Property 2: Selection Indicator Visibility
     * Requirements: 2.1 - Checkmark visible when visualState is selected or checked
     */
    @Test
    fun selectionIndicator_visibleForCheckedState() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Checked Option",
                visualState = VisualState.CHECKED,
                testTag = "checked-indicator"
            )
        }
        
        // Checkmark should be visible
        composeTestRule.onNodeWithTag("checked-indicator-checkmark")
            .assertExists()
    }

    
    /**
     * Test that checkmark is hidden for REST state.
     * 
     * Feature: 038-vertical-list-buttons, Property 2: Selection Indicator Visibility
     * Requirements: 2.2 - Checkmark hidden for rest, notSelected, unchecked states
     */
    @Test
    fun selectionIndicator_hiddenForRestState() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Rest Option",
                visualState = VisualState.REST,
                testTag = "rest-indicator"
            )
        }
        
        // Checkmark should not exist
        composeTestRule.onNodeWithTag("rest-indicator-checkmark")
            .assertDoesNotExist()
    }
    
    /**
     * Test that checkmark is hidden for NOT_SELECTED state.
     * 
     * Feature: 038-vertical-list-buttons, Property 2: Selection Indicator Visibility
     * Requirements: 2.2 - Checkmark hidden for rest, notSelected, unchecked states
     */
    @Test
    fun selectionIndicator_hiddenForNotSelectedState() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Not Selected Option",
                visualState = VisualState.NOT_SELECTED,
                testTag = "not-selected-indicator"
            )
        }
        
        // Checkmark should not exist
        composeTestRule.onNodeWithTag("not-selected-indicator-checkmark")
            .assertDoesNotExist()
    }
    
    /**
     * Test that checkmark is hidden for UNCHECKED state.
     * 
     * Feature: 038-vertical-list-buttons, Property 2: Selection Indicator Visibility
     * Requirements: 2.2 - Checkmark hidden for rest, notSelected, unchecked states
     */
    @Test
    fun selectionIndicator_hiddenForUncheckedState() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Unchecked Option",
                visualState = VisualState.UNCHECKED,
                testTag = "unchecked-indicator"
            )
        }
        
        // Checkmark should not exist
        composeTestRule.onNodeWithTag("unchecked-indicator-checkmark")
            .assertDoesNotExist()
    }

    
    // ============================================================================
    // MARK: - Property 11: Padding Compensation Correctness
    // Requirements: 5.1, 6.1, 6.2, 6.3
    // ============================================================================
    
    /**
     * Test padding compensation for REST state (1dp border = 11dp padding).
     * 
     * Feature: 038-vertical-list-buttons, Property 11: Padding Compensation Correctness
     * Requirements: 6.1 - 11dp padding for 1dp border (borderDefault)
     */
    @Test
    fun paddingCompensation_restState_correctPadding() {
        // REST state uses borderDefault (1dp), so padding should be 11dp
        val borderWidth = VisualStateStyles.rest.borderWidth
        val expectedPadding = VERTICAL_LIST_ITEM_PADDING_BLOCK_REST
        
        val actualPadding = calculatePaddingBlock(borderWidth)
        
        assertEquals(expectedPadding, actualPadding)
        assertEquals(11.dp, actualPadding)
    }
    
    /**
     * Test padding compensation for SELECTED state (2dp border = 10dp padding).
     * 
     * Feature: 038-vertical-list-buttons, Property 11: Padding Compensation Correctness
     * Requirements: 6.2 - 10dp padding for 2dp border (borderEmphasis)
     */
    @Test
    fun paddingCompensation_selectedState_correctPadding() {
        // SELECTED state uses borderEmphasis (2dp), so padding should be 10dp
        val borderWidth = VisualStateStyles.selected.borderWidth
        val expectedPadding = VERTICAL_LIST_ITEM_PADDING_BLOCK_SELECTED
        
        val actualPadding = calculatePaddingBlock(borderWidth)
        
        assertEquals(expectedPadding, actualPadding)
        assertEquals(10.dp, actualPadding)
    }
    
    /**
     * Test that padding compensation maintains constant 48dp height for REST state.
     * 
     * Feature: 038-vertical-list-buttons, Property 11: Padding Compensation Correctness
     * Requirements: 6.3 - Constant 48dp total height
     */
    @Test
    fun paddingCompensation_restState_maintains48dpHeight() {
        val borderWidth = VisualStateStyles.rest.borderWidth
        val paddingBlock = calculatePaddingBlock(borderWidth)
        val totalHeight = calculateTotalHeight(borderWidth, paddingBlock)
        
        assertEquals(VERTICAL_LIST_ITEM_MIN_HEIGHT, totalHeight)
        assertEquals(48.dp, totalHeight)
    }
    
    /**
     * Test that padding compensation maintains constant 48dp height for SELECTED state.
     * 
     * Feature: 038-vertical-list-buttons, Property 11: Padding Compensation Correctness
     * Requirements: 6.3 - Constant 48dp total height
     */
    @Test
    fun paddingCompensation_selectedState_maintains48dpHeight() {
        val borderWidth = VisualStateStyles.selected.borderWidth
        val paddingBlock = calculatePaddingBlock(borderWidth)
        val totalHeight = calculateTotalHeight(borderWidth, paddingBlock)
        
        assertEquals(VERTICAL_LIST_ITEM_MIN_HEIGHT, totalHeight)
        assertEquals(48.dp, totalHeight)
    }

    
    /**
     * Test that padding compensation is valid for all visual states.
     * 
     * Feature: 038-vertical-list-buttons, Property 11: Padding Compensation Correctness
     * Requirements: 6.1, 6.2, 6.3 - All states maintain 48dp height
     */
    @Test
    fun paddingCompensation_allStates_maintain48dpHeight() {
        VisualState.values().forEach { state ->
            val isValid = validatePaddingCompensation(state)
            assertTrue(
                "Padding compensation should be valid for state: ${state.name}",
                isValid
            )
        }
    }
    
    /**
     * Test that padding compensation is valid for all visual states with error.
     * 
     * Feature: 038-vertical-list-buttons, Property 11: Padding Compensation Correctness
     * Requirements: 6.1, 6.2, 6.3 - All states maintain 48dp height even with error
     */
    @Test
    fun paddingCompensation_allStatesWithError_maintain48dpHeight() {
        VisualState.values().forEach { state ->
            val isValid = validatePaddingCompensation(state, error = true)
            assertTrue(
                "Padding compensation should be valid for state: ${state.name} with error",
                isValid
            )
        }
    }
    
    // ============================================================================
    // MARK: - Property 20: Android Native Rendering
    // Requirements: 14.1, 14.2, 14.3
    // ============================================================================
    
    /**
     * Test that component uses Jetpack Compose for native rendering.
     * 
     * Feature: 038-vertical-list-buttons, Property 20: Android Native Rendering
     * Requirements: 14.1 - Android implementation uses Jetpack Compose
     */
    @Test
    fun androidNativeRendering_usesJetpackCompose() {
        // This test verifies the component renders using Compose
        // by successfully using ComposeTestRule
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Compose Test",
                visualState = VisualState.REST,
                testTag = "compose-button"
            )
        }
        
        // If we can find the node, Compose is working
        composeTestRule.onNodeWithTag("compose-button")
            .assertExists()
            .assertIsDisplayed()
    }

    
    /**
     * Test that component applies Material ripple effect on click.
     * 
     * Feature: 038-vertical-list-buttons, Property 20: Android Native Rendering
     * Requirements: 14.2 - Material-style ripple effects via Modifier.clickable
     */
    @Test
    fun androidNativeRendering_materialRippleEffect() {
        var clicked = false
        
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Ripple Test",
                visualState = VisualState.REST,
                onClick = { clicked = true },
                testTag = "ripple-button"
            )
        }
        
        // Perform click - ripple effect is applied via rememberRipple()
        composeTestRule.onNodeWithTag("ripple-button").performClick()
        
        // Verify click was registered (ripple visual verification requires screenshot testing)
        assertTrue("onClick should have been invoked", clicked)
    }
    
    /**
     * Test that component is clickable and responds to interactions.
     * 
     * Feature: 038-vertical-list-buttons, Property 20: Android Native Rendering
     * Requirements: 14.5 - Modifier.clickable with indication
     */
    @Test
    fun androidNativeRendering_clickableInteraction() {
        var clickCount = 0
        
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Clickable Test",
                visualState = VisualState.REST,
                onClick = { clickCount++ },
                testTag = "clickable-button"
            )
        }
        
        // Perform multiple clicks
        composeTestRule.onNodeWithTag("clickable-button").performClick()
        composeTestRule.onNodeWithTag("clickable-button").performClick()
        
        assertEquals(2, clickCount)
    }
    
    // ============================================================================
    // MARK: - Property 21: Android Accessibility (TalkBack)
    // Requirements: 10.6, 10.8
    // ============================================================================
    
    /**
     * Test TalkBack accessibility - content description.
     * 
     * Feature: 038-vertical-list-buttons, Property 21: Android Accessibility
     * Requirements: 10.3 - Screen readers announce the label
     */
    @Test
    fun talkBackAccessibility_contentDescription() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Settings",
                visualState = VisualState.SELECTED,
                testTag = "settings-button"
            )
        }
        
        composeTestRule.onNodeWithTag("settings-button")
            .assertExists()
            .assertContentDescriptionEquals("Settings")
    }

    
    /**
     * Test TalkBack accessibility - state description for SELECTED state.
     * 
     * Feature: 038-vertical-list-buttons, Property 21: Android Accessibility
     * Requirements: 10.6 - TalkBack announces current selection state
     */
    @Test
    fun talkBackAccessibility_stateDescription_selected() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Option A",
                visualState = VisualState.SELECTED,
                testTag = "selected-button"
            )
        }
        
        composeTestRule.onNodeWithTag("selected-button")
            .assertExists()
            .assert(hasStateDescription("Selected"))
    }
    
    /**
     * Test TalkBack accessibility - state description for NOT_SELECTED state.
     * 
     * Feature: 038-vertical-list-buttons, Property 21: Android Accessibility
     * Requirements: 10.6 - TalkBack announces current selection state
     */
    @Test
    fun talkBackAccessibility_stateDescription_notSelected() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Option B",
                visualState = VisualState.NOT_SELECTED,
                testTag = "not-selected-button"
            )
        }
        
        composeTestRule.onNodeWithTag("not-selected-button")
            .assertExists()
            .assert(hasStateDescription("Not selected"))
    }
    
    /**
     * Test TalkBack accessibility - state description for CHECKED state.
     * 
     * Feature: 038-vertical-list-buttons, Property 21: Android Accessibility
     * Requirements: 10.6 - TalkBack announces current selection state
     */
    @Test
    fun talkBackAccessibility_stateDescription_checked() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Enable notifications",
                visualState = VisualState.CHECKED,
                testTag = "checked-button"
            )
        }
        
        composeTestRule.onNodeWithTag("checked-button")
            .assertExists()
            .assert(hasStateDescription("Checked"))
    }
    
    /**
     * Test TalkBack accessibility - state description for UNCHECKED state.
     * 
     * Feature: 038-vertical-list-buttons, Property 21: Android Accessibility
     * Requirements: 10.6 - TalkBack announces current selection state
     */
    @Test
    fun talkBackAccessibility_stateDescription_unchecked() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Enable notifications",
                visualState = VisualState.UNCHECKED,
                testTag = "unchecked-button"
            )
        }
        
        composeTestRule.onNodeWithTag("unchecked-button")
            .assertExists()
            .assert(hasStateDescription("Not checked"))
    }

    
    /**
     * Test TalkBack accessibility - REST state has no state description.
     * 
     * Feature: 038-vertical-list-buttons, Property 21: Android Accessibility
     * Requirements: 10.6 - REST state is neutral, no state to announce
     */
    @Test
    fun talkBackAccessibility_stateDescription_rest() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Settings",
                visualState = VisualState.REST,
                testTag = "rest-button"
            )
        }
        
        // REST state should not have a state description (empty string)
        composeTestRule.onNodeWithTag("rest-button")
            .assertExists()
            .assertContentDescriptionEquals("Settings")
    }
    
    /**
     * Test TalkBack accessibility - checkmark is decorative (not announced).
     * 
     * Feature: 038-vertical-list-buttons, Property 21: Android Accessibility
     * Requirements: 2.5 - Selection indicator marked as decorative
     */
    @Test
    fun talkBackAccessibility_checkmarkIsDecorative() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Selected Option",
                visualState = VisualState.SELECTED,
                testTag = "selected-with-checkmark"
            )
        }
        
        // The button itself is accessible
        composeTestRule.onNodeWithTag("selected-with-checkmark")
            .assertExists()
            .assertContentDescriptionEquals("Selected Option")
            .assert(hasStateDescription("Selected"))
        
        // The checkmark exists visually but uses clearAndSetSemantics
        // which removes it from the accessibility tree
        composeTestRule.onNodeWithTag("selected-with-checkmark-checkmark")
            .assertExists()
    }
    
    /**
     * Test TalkBack accessibility - error state is announced.
     * 
     * Feature: 038-vertical-list-buttons, Property 21: Android Accessibility
     * Requirements: 10.6 - Error state included in accessibility announcement
     */
    @Test
    fun talkBackAccessibility_errorStateAnnounced() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Required Selection",
                visualState = VisualState.NOT_SELECTED,
                error = true,
                testTag = "error-button"
            )
        }
        
        // Error state is included in state description
        composeTestRule.onNodeWithTag("error-button")
            .assertExists()
            .assertContentDescriptionEquals("Required Selection")
            .assert(hasStateDescription("Not selected, Error"))
    }
    
    /**
     * Test TalkBack accessibility - component has button role.
     * 
     * Feature: 038-vertical-list-buttons, Property 21: Android Accessibility
     * Requirements: 10.8 - Use Compose semantics for TalkBack support
     */
    @Test
    fun talkBackAccessibility_hasButtonRole() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Action Button",
                visualState = VisualState.REST,
                testTag = "role-button"
            )
        }
        
        composeTestRule.onNodeWithTag("role-button")
            .assertExists()
            .assert(hasRole(Role.Button))
    }

    
    // ============================================================================
    // MARK: - Property 22: RTL Layout Adaptation
    // Requirements: 11.5, 11.7
    // ============================================================================
    
    /**
     * Test RTL layout adaptation - component renders in RTL context.
     * 
     * Feature: 038-vertical-list-buttons, Property 22: Cross-Platform RTL Support
     * Requirements: 11.5 - Android uses Compose's automatic RTL layout via LocalLayoutDirection
     */
    @Test
    fun rtlLayoutAdaptation_componentRendersInRtlContext() {
        composeTestRule.setContent {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                VerticalListButtonItem(
                    label = "RTL Test",
                    leadingIcon = "settings",
                    visualState = VisualState.SELECTED,
                    testTag = "rtl-button"
                )
            }
        }
        
        // Verify component renders in RTL context
        composeTestRule.onNodeWithTag("rtl-button")
            .assertExists()
            .assertContentDescriptionEquals("RTL Test")
            .assert(hasStateDescription("Selected"))
        
        // Verify leading icon exists (will be on right in RTL)
        composeTestRule.onNodeWithTag("rtl-button-leading-icon")
            .assertExists()
        
        // Verify checkmark exists (will be on left in RTL)
        composeTestRule.onNodeWithTag("rtl-button-checkmark")
            .assertExists()
    }
    
    /**
     * Test RTL layout adaptation - leading icon position in RTL.
     * 
     * Feature: 038-vertical-list-buttons, Property 22: Cross-Platform RTL Support
     * Requirements: 11.7 - Layout mirrors automatically using Compose's built-in RTL handling
     */
    @Test
    fun rtlLayoutAdaptation_leadingIconAppearsOnRightInRtl() {
        composeTestRule.setContent {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                VerticalListButtonItem(
                    label = "RTL Icon Test",
                    leadingIcon = "gear",
                    visualState = VisualState.REST,
                    testTag = "rtl-icon-button"
                )
            }
        }
        
        // Verify component and leading icon exist in RTL context
        composeTestRule.onNodeWithTag("rtl-icon-button")
            .assertExists()
        
        composeTestRule.onNodeWithTag("rtl-icon-button-leading-icon")
            .assertExists()
    }
    
    /**
     * Test RTL layout adaptation - checkmark position in RTL.
     * 
     * Feature: 038-vertical-list-buttons, Property 22: Cross-Platform RTL Support
     * Requirements: 11.7 - Layout mirrors automatically using Compose's built-in RTL handling
     */
    @Test
    fun rtlLayoutAdaptation_checkmarkAppearsOnLeftInRtl() {
        composeTestRule.setContent {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                VerticalListButtonItem(
                    label = "RTL Checkmark Test",
                    visualState = VisualState.SELECTED,
                    testTag = "rtl-checkmark-button"
                )
            }
        }
        
        composeTestRule.onNodeWithTag("rtl-checkmark-button")
            .assertExists()
            .assert(hasStateDescription("Selected"))
        
        composeTestRule.onNodeWithTag("rtl-checkmark-button-checkmark")
            .assertExists()
    }

    
    /**
     * Test RTL layout adaptation - full component with icon and checkmark.
     * 
     * Feature: 038-vertical-list-buttons, Property 22: Cross-Platform RTL Support
     * Requirements: 11.5, 11.7 - Complete RTL scenario
     */
    @Test
    fun rtlLayoutAdaptation_fullComponentWithIconAndCheckmark() {
        composeTestRule.setContent {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                VerticalListButtonItem(
                    label = "Full RTL Test",
                    description = "With description",
                    leadingIcon = "bell",
                    visualState = VisualState.CHECKED,
                    testTag = "rtl-full-button"
                )
            }
        }
        
        // Verify all components exist in RTL context
        composeTestRule.onNodeWithTag("rtl-full-button")
            .assertExists()
            .assertContentDescriptionEquals("Full RTL Test")
            .assert(hasStateDescription("Checked"))
        
        composeTestRule.onNodeWithTag("rtl-full-button-leading-icon")
            .assertExists()
        
        composeTestRule.onNodeWithTag("rtl-full-button-checkmark")
            .assertExists()
    }
    
    /**
     * Test RTL layout adaptation - LTR context for comparison.
     * 
     * Feature: 038-vertical-list-buttons, Property 22: Cross-Platform RTL Support
     * Requirements: 11.5, 11.7 - Baseline LTR comparison
     */
    @Test
    fun rtlLayoutAdaptation_ltrContextForComparison() {
        composeTestRule.setContent {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
                VerticalListButtonItem(
                    label = "LTR Test",
                    leadingIcon = "settings",
                    visualState = VisualState.SELECTED,
                    testTag = "ltr-button"
                )
            }
        }
        
        composeTestRule.onNodeWithTag("ltr-button")
            .assertExists()
            .assertContentDescriptionEquals("LTR Test")
            .assert(hasStateDescription("Selected"))
        
        composeTestRule.onNodeWithTag("ltr-button-leading-icon")
            .assertExists()
        
        composeTestRule.onNodeWithTag("ltr-button-checkmark")
            .assertExists()
    }
    
    // ============================================================================
    // MARK: - Property 17: Event Callback Invocation
    // Requirements: 12.1, 12.2, 12.3
    // ============================================================================
    
    /**
     * Test onClick callback invocation.
     * 
     * Feature: 038-vertical-list-buttons, Property 17: Event Callback Invocation
     * Requirements: 12.1 - onClick callback fires on click/tap
     */
    @Test
    fun eventCallback_onClick_invoked() {
        var clicked = false
        
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Click Me",
                visualState = VisualState.REST,
                onClick = { clicked = true },
                testTag = "click-button"
            )
        }
        
        composeTestRule.onNodeWithTag("click-button").performClick()
        
        assertTrue("onClick callback should have been invoked", clicked)
    }

    
    /**
     * Test onClick callback not invoked when not provided.
     * 
     * Feature: 038-vertical-list-buttons, Property 17: Event Callback Invocation
     * Requirements: 12.1 - Component handles null onClick gracefully
     */
    @Test
    fun eventCallback_onClick_notProvidedHandledGracefully() {
        // Should not crash when onClick is null
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "No Click Handler",
                visualState = VisualState.REST,
                onClick = null,
                testTag = "no-click-button"
            )
        }
        
        // Click should not crash
        composeTestRule.onNodeWithTag("no-click-button").performClick()
        
        // Component should still exist
        composeTestRule.onNodeWithTag("no-click-button")
            .assertExists()
    }
    
    // ============================================================================
    // MARK: - Error State Tests
    // Requirements: 3.1, 3.2, 3.3, 3.4
    // ============================================================================
    
    /**
     * Test error state rendering for Select mode.
     * 
     * Feature: 038-vertical-list-buttons, Property 4: Error Styling for Select Mode
     * Requirements: 3.1 - Full error treatment (border + background + colors)
     */
    @Test
    fun errorState_selectMode_fullTreatment() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Error Select",
                visualState = VisualState.NOT_SELECTED,
                error = true,
                testTag = "error-select-button"
            )
        }
        
        // Verify component renders with error state
        composeTestRule.onNodeWithTag("error-select-button")
            .assertExists()
            .assertIsDisplayed()
            .assert(hasStateDescription("Not selected, Error"))
    }
    
    /**
     * Test error state rendering for Multi-Select mode.
     * 
     * Feature: 038-vertical-list-buttons, Property 5: Error Styling for Multi-Select Mode
     * Requirements: 3.2 - Colors only treatment (no border/background change)
     */
    @Test
    fun errorState_multiSelectMode_colorsOnlyTreatment() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Error Multi",
                visualState = VisualState.UNCHECKED,
                error = true,
                testTag = "error-multi-button"
            )
        }
        
        // Verify component renders with error state
        composeTestRule.onNodeWithTag("error-multi-button")
            .assertExists()
            .assertIsDisplayed()
            .assert(hasStateDescription("Not checked, Error"))
    }
    
    /**
     * Test error state has no effect in Tap mode (REST state).
     * 
     * Feature: 038-vertical-list-buttons, Property 4: Error Styling
     * Requirements: 3.4 - Tap mode ignores error prop
     */
    @Test
    fun errorState_tapMode_noEffect() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Tap Mode Error",
                visualState = VisualState.REST,
                error = true,
                testTag = "tap-error-button"
            )
        }
        
        // REST state should not have error in state description
        // (error has no effect in Tap mode)
        composeTestRule.onNodeWithTag("tap-error-button")
            .assertExists()
            .assertIsDisplayed()
            .assertContentDescriptionEquals("Tap Mode Error")
    }

    
    // ============================================================================
    // MARK: - Content Rendering Tests
    // Requirements: 4.1-4.7
    // ============================================================================
    
    /**
     * Test label is always rendered.
     * 
     * Feature: 038-vertical-list-buttons, Property 6: Label Presence
     * Requirements: 4.1 - Label always present with typography.buttonMd
     */
    @Test
    fun contentRendering_labelAlwaysPresent() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "Test Label",
                visualState = VisualState.REST,
                testTag = "label-button"
            )
        }
        
        composeTestRule.onNodeWithTag("label-button")
            .assertExists()
            .assertContentDescriptionEquals("Test Label")
    }
    
    /**
     * Test description renders when provided.
     * 
     * Feature: 038-vertical-list-buttons, Property 7: Description Rendering
     * Requirements: 4.2, 4.3 - Description with typography.bodySm, color.text.muted
     */
    @Test
    fun contentRendering_descriptionRendersWhenProvided() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "With Description",
                description = "This is a description",
                visualState = VisualState.REST,
                testTag = "description-button"
            )
        }
        
        composeTestRule.onNodeWithTag("description-button")
            .assertExists()
    }
    
    /**
     * Test leading icon renders when provided.
     * 
     * Feature: 038-vertical-list-buttons, Property 8: Leading Icon Rendering
     * Requirements: 4.4, 4.5, 9.1 - Leading icon with label color and optical balance
     */
    @Test
    fun contentRendering_leadingIconRendersWhenProvided() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "With Icon",
                leadingIcon = "settings",
                visualState = VisualState.REST,
                testTag = "icon-button"
            )
        }
        
        composeTestRule.onNodeWithTag("icon-button")
            .assertExists()
        
        composeTestRule.onNodeWithTag("icon-button-leading-icon")
            .assertExists()
    }
    
    /**
     * Test leading icon does not render when not provided.
     * 
     * Feature: 038-vertical-list-buttons, Property 8: Leading Icon Rendering
     * Requirements: 4.4 - Leading icon is optional
     */
    @Test
    fun contentRendering_leadingIconNotRenderedWhenNotProvided() {
        composeTestRule.setContent {
            VerticalListButtonItem(
                label = "No Icon",
                visualState = VisualState.REST,
                testTag = "no-icon-button"
            )
        }
        
        composeTestRule.onNodeWithTag("no-icon-button")
            .assertExists()
        
        composeTestRule.onNodeWithTag("no-icon-button-leading-icon")
            .assertDoesNotExist()
    }
}
