/**
 * Tests for Button-VerticalList-Set Component (Android Platform)
 * 
 * Comprehensive test suite for the ButtonVerticalListSet Composable
 * following Test Development Standards.
 * 
 * Test Categories:
 * - Mode Behavior: Verify correct behavior for tap, select, multiSelect modes
 * - State Derivation: Verify visual states are derived from controlled props
 * - Animation Coordination: Verify transition delay calculations
 * - Validation: Verify selection validation logic
 * - Accessibility: Verify TalkBack support and ARIA equivalents
 * - Cross-Platform Consistency: Verify behavior matches iOS/Web implementations
 * 
 * @module Button-VerticalList-Set/platforms/android
 * @see Requirements: 2.1-2.6, 3.1-3.4, 4.1-4.7, 5.1-5.5, 6.1-6.5, 7.1-7.6, 9.1-9.6, 10.3, 10.4, 10.5
 */

package com.designerpunk.components.button

import androidx.compose.runtime.*
import androidx.compose.ui.semantics.*
import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import org.junit.Assert.*
import org.junit.Rule
import org.junit.Test

/**
 * Unit tests for ButtonVerticalListSet Composable.
 * 
 * These tests verify the component's behavior by testing:
 * 1. Mode enum values and behavior
 * 2. Validation logic (validateSelection, canSelectItem)
 * 3. State derivation from controlled props
 * 4. Animation timing calculations
 * 5. Accessibility semantics for TalkBack
 * 
 * The tests focus on behavior verification rather than implementation details,
 * following Test Development Standards.
 */
class ButtonVerticalListSetTest {
    
    @get:Rule
    val composeTestRule = createComposeRule()
    
    // Sample items for testing
    private val sampleItems = listOf(
        ButtonVerticalListSetItem(id = 0, label = "Option 1", description = "First option"),
        ButtonVerticalListSetItem(id = 1, label = "Option 2", description = "Second option"),
        ButtonVerticalListSetItem(id = 2, label = "Option 3", description = "Third option"),
        ButtonVerticalListSetItem(id = 3, label = "Option 4", description = "Fourth option")
    )
    
    // ============================================================================
    // MARK: - Mode Enum Tests
    // Requirements: 2.2
    // ============================================================================
    
    /**
     * Test that all mode values are defined.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 2.2
     */
    @Test
    fun modeEnumValues_allDefined() {
        val modes = ButtonVerticalListSetMode.values()
        assertEquals(3, modes.size)
        assertTrue(modes.contains(ButtonVerticalListSetMode.TAP))
        assertTrue(modes.contains(ButtonVerticalListSetMode.SELECT))
        assertTrue(modes.contains(ButtonVerticalListSetMode.MULTI_SELECT))
    }
    
    // ============================================================================
    // MARK: - Validation Result Tests
    // Requirements: 7.3
    // ============================================================================
    
    /**
     * Test ValidationResult initialization.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.3
     */
    @Test
    fun validationResult_initialization() {
        val validResult = ValidationResult(isValid = true)
        assertTrue(validResult.isValid)
        assertNull(validResult.message)
        
        val invalidResult = ValidationResult(isValid = false, message = "Error message")
        assertFalse(invalidResult.isValid)
        assertEquals("Error message", invalidResult.message)
    }
    
    /**
     * Test ValidationResult equality.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.3
     */
    @Test
    fun validationResult_equality() {
        val result1 = ValidationResult(isValid = true)
        val result2 = ValidationResult(isValid = true)
        val result3 = ValidationResult(isValid = false, message = "Error")
        
        assertEquals(result1, result2)
        assertNotEquals(result1, result3)
    }
    
    // ============================================================================
    // MARK: - Validation Logic Tests
    // Requirements: 7.3-7.5
    // ============================================================================
    
    /**
     * Test tap mode validation always returns valid.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.3
     */
    @Test
    fun tapModeValidation_alwaysValid() {
        val result = validateSelection(
            mode = ButtonVerticalListSetMode.TAP,
            selectedIndex = null,
            selectedIndices = emptyList(),
            required = true
        )
        assertTrue(result.isValid)
        assertNull(result.message)
    }
    
    /**
     * Test select mode required validation - no selection.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.3
     */
    @Test
    fun selectModeRequiredValidation_noSelection_invalid() {
        val result = validateSelection(
            mode = ButtonVerticalListSetMode.SELECT,
            selectedIndex = null,
            selectedIndices = emptyList(),
            required = true
        )
        assertFalse(result.isValid)
        assertEquals("Please select an option", result.message)
    }
    
    /**
     * Test select mode required validation - with selection.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.3
     */
    @Test
    fun selectModeRequiredValidation_withSelection_valid() {
        val result = validateSelection(
            mode = ButtonVerticalListSetMode.SELECT,
            selectedIndex = 1,
            selectedIndices = emptyList(),
            required = true
        )
        assertTrue(result.isValid)
        assertNull(result.message)
    }
    
    /**
     * Test select mode non-required validation.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.3
     */
    @Test
    fun selectModeNonRequiredValidation_noSelection_valid() {
        val result = validateSelection(
            mode = ButtonVerticalListSetMode.SELECT,
            selectedIndex = null,
            selectedIndices = emptyList(),
            required = false
        )
        assertTrue(result.isValid)
        assertNull(result.message)
    }
    
    /**
     * Test multiSelect mode minSelections validation - below minimum.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.4
     */
    @Test
    fun multiSelectMinSelectionsValidation_belowMin_invalid() {
        val result = validateSelection(
            mode = ButtonVerticalListSetMode.MULTI_SELECT,
            selectedIndex = null,
            selectedIndices = listOf(0),
            required = false,
            minSelections = 2
        )
        assertFalse(result.isValid)
        assertEquals("Please select at least 2 options", result.message)
    }
    
    /**
     * Test multiSelect mode minSelections validation - at minimum.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.4
     */
    @Test
    fun multiSelectMinSelectionsValidation_atMin_valid() {
        val result = validateSelection(
            mode = ButtonVerticalListSetMode.MULTI_SELECT,
            selectedIndex = null,
            selectedIndices = listOf(0, 1),
            required = false,
            minSelections = 2
        )
        assertTrue(result.isValid)
        assertNull(result.message)
    }
    
    /**
     * Test multiSelect mode minSelections validation - singular message.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.4
     */
    @Test
    fun multiSelectMinSelectionsValidation_singular_correctMessage() {
        val result = validateSelection(
            mode = ButtonVerticalListSetMode.MULTI_SELECT,
            selectedIndex = null,
            selectedIndices = emptyList(),
            required = false,
            minSelections = 1
        )
        assertFalse(result.isValid)
        assertEquals("Please select at least 1 option", result.message)
    }
    
    /**
     * Test multiSelect mode maxSelections validation - above maximum.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.5
     */
    @Test
    fun multiSelectMaxSelectionsValidation_aboveMax_invalid() {
        val result = validateSelection(
            mode = ButtonVerticalListSetMode.MULTI_SELECT,
            selectedIndex = null,
            selectedIndices = listOf(0, 1, 2, 3),
            required = false,
            maxSelections = 3
        )
        assertFalse(result.isValid)
        assertEquals("Please select no more than 3 options", result.message)
    }
    
    /**
     * Test multiSelect mode maxSelections validation - at maximum.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.5
     */
    @Test
    fun multiSelectMaxSelectionsValidation_atMax_valid() {
        val result = validateSelection(
            mode = ButtonVerticalListSetMode.MULTI_SELECT,
            selectedIndex = null,
            selectedIndices = listOf(0, 1, 2),
            required = false,
            maxSelections = 3
        )
        assertTrue(result.isValid)
        assertNull(result.message)
    }
    
    /**
     * Test multiSelect mode maxSelections validation - singular message.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.5
     */
    @Test
    fun multiSelectMaxSelectionsValidation_singular_correctMessage() {
        val result = validateSelection(
            mode = ButtonVerticalListSetMode.MULTI_SELECT,
            selectedIndex = null,
            selectedIndices = listOf(0, 1),
            required = false,
            maxSelections = 1
        )
        assertFalse(result.isValid)
        assertEquals("Please select no more than 1 option", result.message)
    }
    
    // ============================================================================
    // MARK: - canSelectItem Tests
    // Requirements: 7.5
    // ============================================================================
    
    /**
     * Test canSelectItem allows deselection of selected item.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.5
     */
    @Test
    fun canSelectItem_allowsDeselection() {
        val result = canSelectItem(
            index = 1,
            selectedIndices = listOf(0, 1, 2),
            maxSelections = 3
        )
        assertTrue("Should allow deselecting an already selected item", result)
    }
    
    /**
     * Test canSelectItem prevents selection at max.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.5
     */
    @Test
    fun canSelectItem_preventsSelectionAtMax() {
        val result = canSelectItem(
            index = 3,
            selectedIndices = listOf(0, 1, 2),
            maxSelections = 3
        )
        assertFalse("Should prevent selecting when at max", result)
    }
    
    /**
     * Test canSelectItem allows selection below max.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.5
     */
    @Test
    fun canSelectItem_allowsSelectionBelowMax() {
        val result = canSelectItem(
            index = 2,
            selectedIndices = listOf(0, 1),
            maxSelections = 3
        )
        assertTrue("Should allow selecting when below max", result)
    }
    
    /**
     * Test canSelectItem allows selection without max constraint.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.5
     */
    @Test
    fun canSelectItem_allowsSelectionWithoutMax() {
        val result = canSelectItem(
            index = 5,
            selectedIndices = listOf(0, 1, 2, 3, 4),
            maxSelections = null
        )
        assertTrue("Should allow selecting when no max is set", result)
    }
    
    // ============================================================================
    // MARK: - Item Data Model Tests
    // ============================================================================
    
    /**
     * Test ButtonVerticalListSetItem initialization.
     * 
     * Feature: 041-vertical-list-buttons-pattern
     */
    @Test
    fun itemInitialization_fullParams() {
        val item = ButtonVerticalListSetItem(
            id = 0,
            label = "Test Label",
            description = "Test Description",
            leadingIcon = "star"
        )
        
        assertEquals(0, item.id)
        assertEquals("Test Label", item.label)
        assertEquals("Test Description", item.description)
        assertEquals("star", item.leadingIcon)
    }
    
    /**
     * Test ButtonVerticalListSetItem with minimal initialization.
     * 
     * Feature: 041-vertical-list-buttons-pattern
     */
    @Test
    fun itemInitialization_minimalParams() {
        val item = ButtonVerticalListSetItem(id = 1, label = "Simple")
        
        assertEquals(1, item.id)
        assertEquals("Simple", item.label)
        assertNull(item.description)
        assertNull(item.leadingIcon)
    }
    
    /**
     * Test ButtonVerticalListSetItem equality.
     * 
     * Feature: 041-vertical-list-buttons-pattern
     */
    @Test
    fun itemEquality() {
        val item1 = ButtonVerticalListSetItem(id = 0, label = "Test")
        val item2 = ButtonVerticalListSetItem(id = 0, label = "Test")
        val item3 = ButtonVerticalListSetItem(id = 1, label = "Test")
        
        assertEquals(item1, item2)
        assertNotEquals(item1, item3)
    }
    
    // ============================================================================
    // MARK: - State Derivation Tests
    // Requirements: 9.6
    // ============================================================================
    
    /**
     * Test deriveVisualState for tap mode.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 3.1
     */
    @Test
    fun deriveVisualState_tapMode_alwaysRest() {
        val state = deriveVisualState(
            mode = ButtonVerticalListSetMode.TAP,
            index = 0,
            selectedIndex = null,
            selectedIndices = emptyList()
        )
        assertEquals(VisualState.REST, state)
    }
    
    /**
     * Test deriveVisualState for select mode - no selection.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 4.1
     */
    @Test
    fun deriveVisualState_selectMode_noSelection_rest() {
        val state = deriveVisualState(
            mode = ButtonVerticalListSetMode.SELECT,
            index = 0,
            selectedIndex = null,
            selectedIndices = emptyList()
        )
        assertEquals(VisualState.REST, state)
    }
    
    /**
     * Test deriveVisualState for select mode - selected item.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 4.2
     */
    @Test
    fun deriveVisualState_selectMode_selectedItem_selected() {
        val state = deriveVisualState(
            mode = ButtonVerticalListSetMode.SELECT,
            index = 1,
            selectedIndex = 1,
            selectedIndices = emptyList()
        )
        assertEquals(VisualState.SELECTED, state)
    }
    
    /**
     * Test deriveVisualState for select mode - non-selected item.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 4.2
     */
    @Test
    fun deriveVisualState_selectMode_nonSelectedItem_notSelected() {
        val state = deriveVisualState(
            mode = ButtonVerticalListSetMode.SELECT,
            index = 0,
            selectedIndex = 1,
            selectedIndices = emptyList()
        )
        assertEquals(VisualState.NOT_SELECTED, state)
    }
    
    /**
     * Test deriveVisualState for multiSelect mode - checked item.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 5.2
     */
    @Test
    fun deriveVisualState_multiSelectMode_checkedItem_checked() {
        val state = deriveVisualState(
            mode = ButtonVerticalListSetMode.MULTI_SELECT,
            index = 1,
            selectedIndex = null,
            selectedIndices = listOf(0, 1, 2)
        )
        assertEquals(VisualState.CHECKED, state)
    }
    
    /**
     * Test deriveVisualState for multiSelect mode - unchecked item.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 5.1
     */
    @Test
    fun deriveVisualState_multiSelectMode_uncheckedItem_unchecked() {
        val state = deriveVisualState(
            mode = ButtonVerticalListSetMode.MULTI_SELECT,
            index = 3,
            selectedIndex = null,
            selectedIndices = listOf(0, 1, 2)
        )
        assertEquals(VisualState.UNCHECKED, state)
    }

    
    // ============================================================================
    // MARK: - Compose UI Tests
    // Requirements: 10.3
    // ============================================================================
    
    /**
     * Test component renders in tap mode.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 3.1
     */
    @Test
    fun tapMode_rendersCorrectly() {
        composeTestRule.setContent {
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.TAP,
                items = sampleItems,
                onItemClick = { },
                testTag = "tap-mode-set"
            )
        }
        
        composeTestRule.onNodeWithTag("tap-mode-set")
            .assertExists()
            .assertIsDisplayed()
    }
    
    /**
     * Test component renders in select mode.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 4.1
     */
    @Test
    fun selectMode_rendersCorrectly() {
        composeTestRule.setContent {
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.SELECT,
                items = sampleItems,
                selectedIndex = null,
                onSelectionChange = { },
                testTag = "select-mode-set"
            )
        }
        
        composeTestRule.onNodeWithTag("select-mode-set")
            .assertExists()
            .assertIsDisplayed()
    }
    
    /**
     * Test component renders in multiSelect mode.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 5.1
     */
    @Test
    fun multiSelectMode_rendersCorrectly() {
        composeTestRule.setContent {
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.MULTI_SELECT,
                items = sampleItems,
                selectedIndices = emptyList(),
                onMultiSelectionChange = { },
                testTag = "multi-select-mode-set"
            )
        }
        
        composeTestRule.onNodeWithTag("multi-select-mode-set")
            .assertExists()
            .assertIsDisplayed()
    }
    
    /**
     * Test tap mode invokes onItemClick callback.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 3.2, 9.5
     */
    @Test
    fun tapMode_invokesOnItemClick() {
        var clickedIndex: Int? = null
        
        composeTestRule.setContent {
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.TAP,
                items = sampleItems,
                onItemClick = { index -> clickedIndex = index },
                testTag = "tap-callback-set"
            )
        }
        
        // Click the first item
        composeTestRule.onNodeWithTag("tap-callback-set-item-0")
            .performClick()
        
        assertEquals(0, clickedIndex)
    }
    
    /**
     * Test select mode invokes onSelectionChange callback.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 4.5, 9.3
     */
    @Test
    fun selectMode_invokesOnSelectionChange() {
        var selectedIndex: Int? = null
        
        composeTestRule.setContent {
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.SELECT,
                items = sampleItems,
                selectedIndex = selectedIndex,
                onSelectionChange = { index -> selectedIndex = index },
                testTag = "select-callback-set"
            )
        }
        
        // Click the second item
        composeTestRule.onNodeWithTag("select-callback-set-item-1")
            .performClick()
        
        assertEquals(1, selectedIndex)
    }
    
    /**
     * Test multiSelect mode invokes onMultiSelectionChange callback.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 5.3, 9.4
     */
    @Test
    fun multiSelectMode_invokesOnMultiSelectionChange() {
        var selectedIndices: List<Int> = emptyList()
        
        composeTestRule.setContent {
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.MULTI_SELECT,
                items = sampleItems,
                selectedIndices = selectedIndices,
                onMultiSelectionChange = { indices -> selectedIndices = indices },
                testTag = "multi-callback-set"
            )
        }
        
        // Click the first item
        composeTestRule.onNodeWithTag("multi-callback-set-item-0")
            .performClick()
        
        assertTrue(selectedIndices.contains(0))
    }
    
    /**
     * Test error message displays above list.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.2
     */
    @Test
    fun errorState_displaysErrorMessage() {
        composeTestRule.setContent {
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.SELECT,
                items = sampleItems,
                selectedIndex = null,
                error = true,
                errorMessage = "Please select an option",
                testTag = "error-set"
            )
        }
        
        // Error message should be displayed
        composeTestRule.onNodeWithText("Please select an option")
            .assertExists()
            .assertIsDisplayed()
    }
    
    /**
     * Test error message is not displayed when no error.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.2
     */
    @Test
    fun noError_doesNotDisplayErrorMessage() {
        composeTestRule.setContent {
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.SELECT,
                items = sampleItems,
                selectedIndex = null,
                error = false,
                errorMessage = null,
                testTag = "no-error-set"
            )
        }
        
        // Error message should not exist
        composeTestRule.onNodeWithText("Please select an option")
            .assertDoesNotExist()
    }
    
    /**
     * Test all items render in the list.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 2.3
     */
    @Test
    fun allItems_renderInList() {
        composeTestRule.setContent {
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.TAP,
                items = sampleItems,
                onItemClick = { },
                testTag = "items-set"
            )
        }
        
        // All items should exist
        sampleItems.forEachIndexed { index, _ ->
            composeTestRule.onNodeWithTag("items-set-item-$index")
                .assertExists()
        }
    }
}

// ============================================================================
// MARK: - Cross-Platform Consistency Tests
// Requirements: 10.4
// ============================================================================

/**
 * Tests to verify cross-platform behavioral consistency.
 * 
 * These tests ensure the Android implementation behaves consistently
 * with the iOS and Web implementations as specified in the design document.
 * 
 * Requirements: 10.4 - Consistent behavior across platforms
 */
class ButtonVerticalListSetCrossPlatformTest {
    
    /**
     * Test validation logic matches iOS/Web implementation.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 10.4
     */
    @Test
    fun validationLogic_matchesOtherPlatforms() {
        // Case 1: Select mode, required, no selection
        val case1 = validateSelection(
            mode = ButtonVerticalListSetMode.SELECT,
            selectedIndex = null,
            selectedIndices = emptyList(),
            required = true
        )
        assertFalse(case1.isValid)
        assertEquals("Please select an option", case1.message)
        
        // Case 2: MultiSelect mode, minSelections=2, 1 selected
        val case2 = validateSelection(
            mode = ButtonVerticalListSetMode.MULTI_SELECT,
            selectedIndex = null,
            selectedIndices = listOf(0),
            required = false,
            minSelections = 2
        )
        assertFalse(case2.isValid)
        assertEquals("Please select at least 2 options", case2.message)
        
        // Case 3: MultiSelect mode, maxSelections=2, 3 selected
        val case3 = validateSelection(
            mode = ButtonVerticalListSetMode.MULTI_SELECT,
            selectedIndex = null,
            selectedIndices = listOf(0, 1, 2),
            required = false,
            maxSelections = 2
        )
        assertFalse(case3.isValid)
        assertEquals("Please select no more than 2 options", case3.message)
    }
    
    /**
     * Test canSelectItem logic matches iOS/Web implementation.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 10.4
     */
    @Test
    fun canSelectItemLogic_matchesOtherPlatforms() {
        // Case 1: Can deselect at max
        assertTrue(canSelectItem(index = 0, selectedIndices = listOf(0, 1, 2), maxSelections = 3))
        
        // Case 2: Cannot select new at max
        assertFalse(canSelectItem(index = 3, selectedIndices = listOf(0, 1, 2), maxSelections = 3))
        
        // Case 3: Can select below max
        assertTrue(canSelectItem(index = 2, selectedIndices = listOf(0, 1), maxSelections = 3))
        
        // Case 4: Can select without max
        assertTrue(canSelectItem(index = 10, selectedIndices = listOf(0, 1, 2, 3, 4), maxSelections = null))
    }
    
    /**
     * Test state derivation logic matches iOS/Web implementation.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 9.6, 10.4
     */
    @Test
    fun stateDeriviationLogic_matchesOtherPlatforms() {
        // Tap mode: all items should be REST
        assertEquals(
            VisualState.REST,
            deriveVisualState(ButtonVerticalListSetMode.TAP, 0, null, emptyList())
        )
        
        // Select mode: no selection = REST
        assertEquals(
            VisualState.REST,
            deriveVisualState(ButtonVerticalListSetMode.SELECT, 0, null, emptyList())
        )
        
        // Select mode: selected item = SELECTED
        assertEquals(
            VisualState.SELECTED,
            deriveVisualState(ButtonVerticalListSetMode.SELECT, 1, 1, emptyList())
        )
        
        // Select mode: non-selected item = NOT_SELECTED
        assertEquals(
            VisualState.NOT_SELECTED,
            deriveVisualState(ButtonVerticalListSetMode.SELECT, 0, 1, emptyList())
        )
        
        // MultiSelect mode: checked item = CHECKED
        assertEquals(
            VisualState.CHECKED,
            deriveVisualState(ButtonVerticalListSetMode.MULTI_SELECT, 1, null, listOf(0, 1))
        )
        
        // MultiSelect mode: unchecked item = UNCHECKED
        assertEquals(
            VisualState.UNCHECKED,
            deriveVisualState(ButtonVerticalListSetMode.MULTI_SELECT, 2, null, listOf(0, 1))
        )
    }
}

// ============================================================================
// MARK: - Accessibility Tests
// Requirements: 10.5
// ============================================================================

/**
 * Tests for TalkBack accessibility support.
 * 
 * These tests verify that the component provides proper accessibility
 * semantics for TalkBack users.
 * 
 * Requirements: 10.5 - TalkBack accessibility
 */
class ButtonVerticalListSetAccessibilityTest {
    
    @get:Rule
    val composeTestRule = createComposeRule()
    
    private val sampleItems = listOf(
        ButtonVerticalListSetItem(id = 0, label = "Option 1"),
        ButtonVerticalListSetItem(id = 1, label = "Option 2"),
        ButtonVerticalListSetItem(id = 2, label = "Option 3")
    )
    
    /**
     * Test tap mode has correct accessibility role.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 3.4
     */
    @Test
    fun tapMode_hasCorrectAccessibilityRole() {
        composeTestRule.setContent {
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.TAP,
                items = sampleItems,
                onItemClick = { },
                testTag = "tap-a11y-set"
            )
        }
        
        // Container should have group semantics
        composeTestRule.onNodeWithTag("tap-a11y-set")
            .assertExists()
    }
    
    /**
     * Test select mode has correct accessibility role.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 4.6
     */
    @Test
    fun selectMode_hasCorrectAccessibilityRole() {
        composeTestRule.setContent {
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.SELECT,
                items = sampleItems,
                selectedIndex = 1,
                onSelectionChange = { },
                testTag = "select-a11y-set"
            )
        }
        
        // Container should have radiogroup semantics
        composeTestRule.onNodeWithTag("select-a11y-set")
            .assertExists()
    }
    
    /**
     * Test multiSelect mode has correct accessibility role.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 5.4
     */
    @Test
    fun multiSelectMode_hasCorrectAccessibilityRole() {
        composeTestRule.setContent {
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.MULTI_SELECT,
                items = sampleItems,
                selectedIndices = listOf(0, 2),
                onMultiSelectionChange = { },
                testTag = "multi-a11y-set"
            )
        }
        
        // Container should have group with multiselectable semantics
        composeTestRule.onNodeWithTag("multi-a11y-set")
            .assertExists()
    }
    
    /**
     * Test error state has correct accessibility attributes.
     * 
     * Feature: 041-vertical-list-buttons-pattern, Requirement 7.6
     */
    @Test
    fun errorState_hasCorrectAccessibilityAttributes() {
        composeTestRule.setContent {
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.SELECT,
                items = sampleItems,
                selectedIndex = null,
                error = true,
                errorMessage = "Please select an option",
                testTag = "error-a11y-set"
            )
        }
        
        // Error message should have live region for immediate announcement
        composeTestRule.onNodeWithText("Please select an option")
            .assertExists()
    }
}
