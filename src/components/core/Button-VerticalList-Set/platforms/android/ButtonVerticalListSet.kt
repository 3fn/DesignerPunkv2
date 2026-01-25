/**
 * Button-VerticalList-Set Component for Android Platform
 * 
 * Stemma System: Buttons Family
 * Component Type: Container/Orchestrator
 * Naming Convention: [Family]-[Type]-[Variant] = Button-VerticalList-Set
 * 
 * A container component that orchestrates selection behavior and coordinates
 * child Button-VerticalList-Item states. Manages selection logic, animation
 * timing, keyboard navigation, and accessibility semantics across three
 * interaction modes: Tap, Select, and Multi-Select.
 * 
 * The Set owns the "brain" (selection logic, mode behavior), while the Item
 * owns the "body" (visual rendering, individual states).
 * 
 * Part of the DesignerPunk Button System infrastructure.
 * 
 * @module Button-VerticalList-Set/platforms/android
 * @see Requirements: 2.1-2.6, 3.1-3.4, 4.1-4.7, 5.1-5.5, 6.1-6.5, 7.1-7.6, 8.1-8.6, 9.1-9.6, 10.3, 10.4, 10.5
 */

package com.designerpunk.components.button

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.accessibility.AccessibilityManager
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.designerpunk.tokens.DesignTokens

// MARK: - Mode Enum

/**
 * Interaction modes for the Button-VerticalList-Set.
 * 
 * Requirements:
 * - 2.2: Accept mode prop with values 'tap', 'select', or 'multiSelect'
 */
enum class ButtonVerticalListSetMode {
    /** Tap mode: Items act as simple action buttons with no selection tracking */
    TAP,
    
    /** Select mode: Single-selection behavior (radio-button style) */
    SELECT,
    
    /** Multi-select mode: Multiple-selection behavior (checkbox style) */
    MULTI_SELECT
}

// MARK: - Validation Result

/**
 * Result of selection validation.
 * 
 * Contains the validation status and an optional error message
 * to display to the user when validation fails.
 * 
 * Requirements:
 * - 7.3: Clear error on valid selection when required
 * - 7.4: Validate minimum selections in multiSelect mode
 * - 7.5: Validate maximum selections in multiSelect mode
 */
data class ValidationResult(
    /** Whether the current selection is valid */
    val isValid: Boolean,
    
    /** Error message to display when validation fails (null when valid) */
    val message: String? = null
)

// MARK: - Item Data Model

/**
 * Data model for items in the Button-VerticalList-Set.
 * 
 * This model represents the configuration for each item in the list,
 * allowing the Set to manage and coordinate child item states.
 */
data class ButtonVerticalListSetItem(
    val id: Int,
    val label: String,
    val description: String? = null,
    val leadingIcon: String? = null
)

// MARK: - Validation Functions

/**
 * Validate selection state based on mode and constraints.
 * 
 * Validation rules by mode:
 * 
 * **Select Mode**:
 * - If `required` is true, validation fails if no selection exists
 * 
 * **MultiSelect Mode**:
 * - If `minSelections` is set, validation fails if fewer items are selected
 * - If `maxSelections` is set, validation fails if more items are selected
 * 
 * **Tap Mode**:
 * - No validation (always valid)
 * 
 * @param mode - The selection mode
 * @param selectedIndex - The selected index for Select mode (null if no selection)
 * @param selectedIndices - List of selected indices for MultiSelect mode
 * @param required - Whether a selection is required (Select mode only)
 * @param minSelections - Minimum number of selections required (MultiSelect mode only)
 * @param maxSelections - Maximum number of selections allowed (MultiSelect mode only)
 * @returns ValidationResult with isValid flag and optional error message
 * 
 * Requirements:
 * - 7.3: WHEN a valid selection is made AND required is true THEN clear error
 * - 7.4: WHEN minSelections is set THEN validate at least that many
 * - 7.5: WHEN maxSelections is set THEN prevent selecting more
 */
fun validateSelection(
    mode: ButtonVerticalListSetMode,
    selectedIndex: Int?,
    selectedIndices: List<Int>,
    required: Boolean,
    minSelections: Int? = null,
    maxSelections: Int? = null
): ValidationResult {
    // Select mode: Check required constraint
    // @see Requirement 7.3: "WHEN a valid selection is made AND required is true"
    if (mode == ButtonVerticalListSetMode.SELECT && required && selectedIndex == null) {
        return ValidationResult(isValid = false, message = "Please select an option")
    }
    
    // MultiSelect mode: Check min/max constraints
    if (mode == ButtonVerticalListSetMode.MULTI_SELECT) {
        val count = selectedIndices.size
        
        // @see Requirement 7.4: "WHEN minSelections is set THEN validate at least that many"
        minSelections?.let { min ->
            if (count < min) {
                val plural = if (min > 1) "s" else ""
                return ValidationResult(
                    isValid = false,
                    message = "Please select at least $min option$plural"
                )
            }
        }
        
        // @see Requirement 7.5: "WHEN maxSelections is set THEN prevent selecting more"
        // Note: This validation is for display purposes; actual prevention is in canSelectItem()
        maxSelections?.let { max ->
            if (count > max) {
                val plural = if (max > 1) "s" else ""
                return ValidationResult(
                    isValid = false,
                    message = "Please select no more than $max option$plural"
                )
            }
        }
    }
    
    // Tap mode has no validation requirements
    // All other cases are valid
    return ValidationResult(isValid = true, message = null)
}

/**
 * Check if an item can be selected in MultiSelect mode.
 * 
 * This function enforces the `maxSelections` constraint by preventing
 * selection of additional items when the maximum is reached.
 * 
 * Rules:
 * - Items that are already selected can always be deselected
 * - New items can only be selected if under the maxSelections limit
 * 
 * @param index - The index of the item to check
 * @param selectedIndices - List of currently selected indices
 * @param maxSelections - Maximum number of selections allowed (optional)
 * @returns true if the item can be selected/toggled, false otherwise
 * 
 * Requirements:
 * - 7.5: WHEN maxSelections is set THEN prevent selecting more than max
 */
fun canSelectItem(
    index: Int,
    selectedIndices: List<Int>,
    maxSelections: Int? = null
): Boolean {
    // Can always deselect an already selected item
    if (selectedIndices.contains(index)) {
        return true
    }
    
    // Check if at max selections
    maxSelections?.let { max ->
        if (selectedIndices.size >= max) {
            return false  // At max, can't select more
        }
    }
    
    return true
}

// MARK: - Accessibility Helpers

/**
 * Announces a message to TalkBack users.
 * 
 * This function posts an accessibility announcement that TalkBack will read aloud,
 * providing immediate feedback to screen reader users about state changes.
 * 
 * Requirements:
 * - 10.5: TalkBack accessibility with selection state announcements
 * 
 * @param context - The Android context
 * @param message - The message to announce
 */
fun announceForAccessibility(context: Context, message: String) {
    val accessibilityManager = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as? AccessibilityManager
    if (accessibilityManager?.isEnabled == true) {
        val event = android.view.accessibility.AccessibilityEvent.obtain(
            android.view.accessibility.AccessibilityEvent.TYPE_ANNOUNCEMENT
        )
        event.text.add(message)
        accessibilityManager.sendAccessibilityEvent(event)
    }
}

/**
 * Triggers haptic feedback for selection changes.
 * 
 * Provides differentiated haptic feedback based on the action type:
 * - Selection: Light click for selecting an item
 * - Deselection: Soft tick for deselecting an item
 * - Toggle (multiSelect): Light click for toggling
 * - Error: Heavy click for validation failures
 * 
 * Requirements:
 * - 10.5: Platform-appropriate feedback (haptic feedback on Android)
 * 
 * @param context - The Android context
 * @param feedbackType - The type of haptic feedback to trigger
 */
enum class HapticFeedbackType {
    /** Light feedback for selection */
    SELECTION,
    /** Soft feedback for deselection */
    DESELECTION,
    /** Error feedback for validation failures */
    ERROR
}

fun triggerHapticFeedback(context: Context, feedbackType: HapticFeedbackType) {
    val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
        vibratorManager?.defaultVibrator
    } else {
        @Suppress("DEPRECATION")
        context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    }
    
    vibrator?.let { vib ->
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val effect = when (feedbackType) {
                HapticFeedbackType.SELECTION -> VibrationEffect.createOneShot(10, VibrationEffect.DEFAULT_AMPLITUDE)
                HapticFeedbackType.DESELECTION -> VibrationEffect.createOneShot(5, VibrationEffect.DEFAULT_AMPLITUDE / 2)
                HapticFeedbackType.ERROR -> VibrationEffect.createOneShot(50, VibrationEffect.DEFAULT_AMPLITUDE)
            }
            vib.vibrate(effect)
        } else {
            @Suppress("DEPRECATION")
            val duration = when (feedbackType) {
                HapticFeedbackType.SELECTION -> 10L
                HapticFeedbackType.DESELECTION -> 5L
                HapticFeedbackType.ERROR -> 50L
            }
            vib.vibrate(duration)
        }
    }
}

// MARK: - State Derivation

/**
 * Derives the visual state for an item based on mode and selection.
 * 
 * Requirements: 9.6 - Derive child visual states from controlled props
 * 
 * @param mode - The selection mode
 * @param index - The index of the item
 * @param selectedIndex - The selected index for Select mode (null if no selection)
 * @param selectedIndices - List of selected indices for MultiSelect mode
 * @returns The visual state for the item
 */
fun deriveVisualState(
    mode: ButtonVerticalListSetMode,
    index: Int,
    selectedIndex: Int?,
    selectedIndices: List<Int>
): VisualState {
    return when (mode) {
        ButtonVerticalListSetMode.TAP -> {
            // Requirements: 3.1 - All items in rest state
            VisualState.REST
        }
        ButtonVerticalListSetMode.SELECT -> {
            // Requirements: 4.1, 4.2 - Selected/notSelected/rest states
            when {
                selectedIndex == null -> VisualState.REST
                index == selectedIndex -> VisualState.SELECTED
                else -> VisualState.NOT_SELECTED
            }
        }
        ButtonVerticalListSetMode.MULTI_SELECT -> {
            // Requirements: 5.1, 5.2 - Checked/unchecked states
            if (selectedIndices.contains(index)) VisualState.CHECKED else VisualState.UNCHECKED
        }
    }
}

// MARK: - ButtonVerticalListSet Composable

/**
 * Button-VerticalList-Set for Android platform.
 * 
 * A Jetpack Compose Composable that manages vertical list button groups with three interaction modes.
 * Uses controlled component pattern where the parent manages state via state hoisting.
 * 
 * Key Features:
 * - Three interaction modes: tap, select, multiSelect
 * - Controlled selection state via state hoisting
 * - Animation timing coordination for staggered transitions
 * - TalkBack accessibility support
 * - Error state management with validation
 * 
 * Usage:
 * ```kotlin
 * // Tap mode
 * val items = listOf(
 *     ButtonVerticalListSetItem(id = 0, label = "Option 1"),
 *     ButtonVerticalListSetItem(id = 1, label = "Option 2")
 * )
 * ButtonVerticalListSet(
 *     mode = ButtonVerticalListSetMode.TAP,
 *     items = items,
 *     onItemClick = { index -> println("Tapped item $index") }
 * )
 * 
 * // Select mode
 * var selectedIndex by remember { mutableStateOf<Int?>(null) }
 * ButtonVerticalListSet(
 *     mode = ButtonVerticalListSetMode.SELECT,
 *     items = items,
 *     selectedIndex = selectedIndex,
 *     onSelectionChange = { index -> selectedIndex = index }
 * )
 * 
 * // Multi-select mode
 * var selectedIndices by remember { mutableStateOf(listOf<Int>()) }
 * ButtonVerticalListSet(
 *     mode = ButtonVerticalListSetMode.MULTI_SELECT,
 *     items = items,
 *     selectedIndices = selectedIndices,
 *     onMultiSelectionChange = { indices -> selectedIndices = indices },
 *     minSelections = 1,
 *     maxSelections = 3
 * )
 * ```
 * 
 * Requirements:
 * - 2.1-2.6: Set component structure and rendering
 * - 3.1-3.4: Tap mode behavior
 * - 4.1-4.7: Select mode behavior
 * - 5.1-5.5: Multi-select mode behavior
 * - 6.1-6.5: Animation coordination
 * - 7.1-7.6: Error state management
 * - 8.1-8.6: Keyboard navigation (via Compose focus system)
 * - 9.1-9.6: Controlled API
 * - 10.3: Jetpack Compose Composable implementation
 * - 10.4: Consistent behavior across platforms
 * - 10.5: TalkBack accessibility
 * 
 * @param mode Interaction mode (TAP, SELECT, MULTI_SELECT)
 * @param items List of items to display
 * @param modifier Modifier for the component
 * @param selectedIndex Selected index for select mode (controlled)
 * @param selectedIndices Selected indices for multi-select mode (controlled)
 * @param onItemClick Callback when item is clicked in tap mode
 * @param onSelectionChange Callback when selection changes in select mode
 * @param onMultiSelectionChange Callback when selections change in multi-select mode
 * @param required Whether selection is required (select mode)
 * @param minSelections Minimum selections required (multi-select mode)
 * @param maxSelections Maximum selections allowed (multi-select mode)
 * @param error Error state
 * @param errorMessage Error message to display
 * @param testTag Optional test tag for automated testing
 */
@Composable
fun ButtonVerticalListSet(
    mode: ButtonVerticalListSetMode,
    items: List<ButtonVerticalListSetItem>,
    modifier: Modifier = Modifier,
    selectedIndex: Int? = null,
    selectedIndices: List<Int> = emptyList(),
    onItemClick: ((Int) -> Unit)? = null,
    onSelectionChange: ((Int?) -> Unit)? = null,
    onMultiSelectionChange: ((List<Int>) -> Unit)? = null,
    required: Boolean = false,
    minSelections: Int? = null,
    maxSelections: Int? = null,
    error: Boolean = false,
    errorMessage: String? = null,
    testTag: String? = null
) {
    // MARK: - Internal State
    
    // Track focused item index for keyboard navigation
    // Requirements: 8.6 - Roving tabindex pattern (focus management)
    var focusedIndex by remember { mutableStateOf(0) }
    
    // Track previous selected index for animation coordination
    // Requirements: 6.1, 6.2 - Staggered animation calculation
    var previousSelectedIndex by remember { mutableStateOf<Int?>(null) }
    
    // Track if this is the first selection
    // Requirements: 6.2 - First selection uses simultaneous animation
    var isFirstSelection by remember { mutableStateOf(true) }
    
    // Unique ID for error message element (for aria-describedby equivalent)
    // Requirements: 7.6 - Error accessibility
    val errorMessageId = remember { "error-${System.currentTimeMillis()}" }
    
    // Track previous error state for announcements
    // Requirements: 10.5 - Announce error state changes to TalkBack
    var previousErrorState by remember { mutableStateOf(error) }
    
    // Get context for accessibility announcements and haptic feedback
    // Requirements: 10.5 - TalkBack accessibility
    val context = LocalContext.current
    val view = LocalView.current
    
    // Handle error state changes for accessibility announcements and haptic feedback
    // Requirements: 10.5 - TalkBack announcements and haptic feedback
    LaunchedEffect(error) {
        if (error != previousErrorState) {
            previousErrorState = error
            
            if (error) {
                // Error state became active
                triggerHapticFeedback(context, HapticFeedbackType.ERROR)
                
                // Announce error to TalkBack
                val announcement = if (errorMessage != null) {
                    "Error: $errorMessage"
                } else {
                    "Error: Please correct the selection"
                }
                announceForAccessibility(context, announcement)
            }
        }
    }
    
    // MARK: - Component Layout
    
    Column(
        modifier = modifier
            .fillMaxWidth()
            // Accessibility semantics for TalkBack
            // Requirements: 3.4, 4.6, 5.4, 10.5
            .semantics(mergeDescendants = false) {
                // Apply appropriate role based on mode
                when (mode) {
                    ButtonVerticalListSetMode.TAP -> {
                        // Requirements: 3.4 - role="group" for tap mode
                        contentDescription = "Button group, ${items.size} options"
                    }
                    ButtonVerticalListSetMode.SELECT -> {
                        // Requirements: 4.6 - role="radiogroup" for select mode
                        contentDescription = "Selection group, ${items.size} options"
                        // Collection info for TalkBack navigation
                        collectionInfo = CollectionInfo(
                            rowCount = items.size,
                            columnCount = 1
                        )
                    }
                    ButtonVerticalListSetMode.MULTI_SELECT -> {
                        // Requirements: 5.4 - role="group" with aria-multiselectable for multiSelect mode
                        contentDescription = "Multiple selection group, ${items.size} options, ${selectedIndices.size} selected"
                        // Collection info for TalkBack navigation
                        collectionInfo = CollectionInfo(
                            rowCount = items.size,
                            columnCount = 1
                        )
                    }
                }
                
                // Apply aria-invalid for errors
                // Requirements: 7.6
                if (error) {
                    error("Invalid selection")
                }
            }
            .then(testTag?.let { Modifier.testTag(it) } ?: Modifier)
    ) {
        // Error message (above list)
        // Requirements: 7.2 - Display error message above list
        if (error && errorMessage != null) {
            Text(
                text = errorMessage,
                color = Color(DesignTokens.color_feedback_error_text),
                fontSize = 14.sp,
                fontWeight = FontWeight.Normal,
                modifier = Modifier
                    .padding(bottom = 8.dp)
                    .semantics {
                        // role="alert" equivalent for TalkBack - immediate announcement
                        liveRegion = LiveRegionMode.Assertive
                        contentDescription = "Error: $errorMessage"
                    }
                    .testTag(errorMessageId)
            )
        }
        
        // Child items container
        // Requirements: 2.3, 2.4, 2.5 - Vertical stack with token spacing
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_grouped_normal.dp)
        ) {
            items.forEachIndexed { index, item ->
                // Derive visual state from controlled props
                // Requirements: 9.6 - Derive child visual states from controlled props
                val visualState = deriveVisualState(mode, index, selectedIndex, selectedIndices)
                
                // Calculate transition delay for animation coordination
                // Requirements: 6.1, 6.2, 6.3, 6.4
                val transitionDelay = calculateTransitionDelay(
                    mode = mode,
                    index = index,
                    selectedIndex = selectedIndex,
                    previousSelectedIndex = previousSelectedIndex,
                    isFirstSelection = isFirstSelection
                )
                
                // Get checkmark transition type
                // Requirements: 6.5 - Instant checkmark on deselection
                val checkmarkTransition = getCheckmarkTransition(
                    mode = mode,
                    index = index,
                    selectedIndex = selectedIndex,
                    previousSelectedIndex = previousSelectedIndex
                )
                
                VerticalListButtonItem(
                    label = item.label,
                    visualState = visualState,
                    description = item.description,
                    leadingIcon = item.leadingIcon,
                    error = error,
                    checkmarkTransition = checkmarkTransition,
                    transitionDelay = transitionDelay,
                    onClick = {
                        handleItemClick(
                            mode = mode,
                            index = index,
                            selectedIndex = selectedIndex,
                            selectedIndices = selectedIndices,
                            maxSelections = maxSelections,
                            items = items,
                            context = context,
                            onItemClick = onItemClick,
                            onSelectionChange = onSelectionChange,
                            onMultiSelectionChange = onMultiSelectionChange,
                            updatePreviousSelectedIndex = { previousSelectedIndex = it },
                            updateIsFirstSelection = { isFirstSelection = it }
                        )
                    },
                    testTag = testTag?.let { "$it-item-$index" },
                    // Apply item-specific accessibility based on mode
                    // Requirements: 4.7, 5.5, 10.5
                    modifier = Modifier.semantics {
                        when (mode) {
                            ButtonVerticalListSetMode.TAP -> {
                                // Tap mode items are simple buttons
                                role = Role.Button
                            }
                            ButtonVerticalListSetMode.SELECT -> {
                                // Requirements: 4.7 - role="radio" and aria-checked
                                role = Role.RadioButton
                                selected = (selectedIndex == index)
                                // Position in list for TalkBack
                                collectionItemInfo = CollectionItemInfo(
                                    rowIndex = index,
                                    rowSpan = 1,
                                    columnIndex = 0,
                                    columnSpan = 1
                                )
                            }
                            ButtonVerticalListSetMode.MULTI_SELECT -> {
                                // Requirements: 5.5 - role="checkbox" and aria-checked
                                role = Role.Checkbox
                                selected = selectedIndices.contains(index)
                                // Position in list for TalkBack
                                collectionItemInfo = CollectionItemInfo(
                                    rowIndex = index,
                                    rowSpan = 1,
                                    columnIndex = 0,
                                    columnSpan = 1
                                )
                            }
                        }
                    }
                )
            }
        }
    }
}

// MARK: - Animation Coordination

/**
 * Calculates transition delay for staggered animations.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */
private fun calculateTransitionDelay(
    mode: ButtonVerticalListSetMode,
    index: Int,
    selectedIndex: Int?,
    previousSelectedIndex: Int?,
    isFirstSelection: Boolean
): Int {
    return when (mode) {
        ButtonVerticalListSetMode.TAP -> {
            // No animation coordination needed
            0
        }
        ButtonVerticalListSetMode.SELECT -> {
            // Requirements: 6.2 - First selection is simultaneous
            if (isFirstSelection) {
                0
            }
            // Requirements: 6.3 - Deselection is simultaneous
            else if (selectedIndex == null) {
                0
            }
            // Requirements: 6.1 - Staggered animation for selection change
            else if (previousSelectedIndex != null && selectedIndex != null) {
                when (index) {
                    previousSelectedIndex -> 0  // Deselecting item starts immediately
                    selectedIndex -> 125  // Selecting item starts at 50% (125ms of 250ms)
                    else -> 0
                }
            } else {
                0
            }
        }
        ButtonVerticalListSetMode.MULTI_SELECT -> {
            // Requirements: 6.4 - Independent animation (no delay)
            0
        }
    }
}

/**
 * Gets the checkmark transition type for an item.
 * 
 * Requirements: 6.5 - Instant checkmark on deselection
 */
private fun getCheckmarkTransition(
    mode: ButtonVerticalListSetMode,
    index: Int,
    selectedIndex: Int?,
    previousSelectedIndex: Int?
): CheckmarkTransition {
    return when (mode) {
        ButtonVerticalListSetMode.TAP -> CheckmarkTransition.FADE
        ButtonVerticalListSetMode.SELECT -> {
            // Requirements: 6.5 - Instant checkmark removal on deselection
            if (previousSelectedIndex != null && index == previousSelectedIndex && selectedIndex != index) {
                CheckmarkTransition.INSTANT
            } else {
                CheckmarkTransition.FADE
            }
        }
        ButtonVerticalListSetMode.MULTI_SELECT -> CheckmarkTransition.FADE
    }
}

// MARK: - Event Handlers

/**
 * Handles item click based on mode.
 * 
 * Includes:
 * - Mode-specific selection logic
 * - Haptic feedback for selection changes
 * - TalkBack announcements for selection state changes
 * 
 * Requirements:
 * - 3.2, 9.5: Tap mode callback
 * - 4.2-4.5, 9.3: Select mode behavior
 * - 5.2, 5.3, 9.4: MultiSelect mode behavior
 * - 10.5: TalkBack accessibility with selection state announcements
 */
private fun handleItemClick(
    mode: ButtonVerticalListSetMode,
    index: Int,
    selectedIndex: Int?,
    selectedIndices: List<Int>,
    maxSelections: Int?,
    items: List<ButtonVerticalListSetItem>,
    context: Context,
    onItemClick: ((Int) -> Unit)?,
    onSelectionChange: ((Int?) -> Unit)?,
    onMultiSelectionChange: ((List<Int>) -> Unit)?,
    updatePreviousSelectedIndex: (Int?) -> Unit,
    updateIsFirstSelection: (Boolean) -> Unit
) {
    // Get item for announcement
    val item = items.getOrNull(index) ?: return
    
    when (mode) {
        ButtonVerticalListSetMode.TAP -> {
            // Requirements: 3.2, 9.5 - Invoke onItemClick callback
            // Light haptic feedback for tap
            triggerHapticFeedback(context, HapticFeedbackType.SELECTION)
            onItemClick?.invoke(index)
        }
        ButtonVerticalListSetMode.SELECT -> {
            // Track previous selection for animation
            updatePreviousSelectedIndex(selectedIndex)
            
            if (selectedIndex == index) {
                // Requirements: 4.3 - Deselection (clicking selected item)
                updateIsFirstSelection(true)
                
                // Haptic feedback for deselection
                triggerHapticFeedback(context, HapticFeedbackType.DESELECTION)
                
                // Announce deselection to TalkBack
                // Requirements: 10.5 - Selection state announcements
                announceForAccessibility(context, "${item.label}, deselected")
                
                onSelectionChange?.invoke(null)
            } else {
                // Requirements: 4.2, 4.4 - Selection
                updateIsFirstSelection(false)
                
                // Haptic feedback for selection
                triggerHapticFeedback(context, HapticFeedbackType.SELECTION)
                
                // Announce selection to TalkBack
                // Requirements: 10.5 - Selection state announcements
                announceForAccessibility(context, "${item.label}, selected")
                
                onSelectionChange?.invoke(index)
            }
        }
        ButtonVerticalListSetMode.MULTI_SELECT -> {
            val newIndices = selectedIndices.toMutableList()
            
            if (newIndices.contains(index)) {
                // Deselect - always allowed
                newIndices.remove(index)
                
                // Haptic feedback for unchecking
                triggerHapticFeedback(context, HapticFeedbackType.DESELECTION)
                
                // Announce unchecked to TalkBack
                // Requirements: 10.5 - Selection state announcements
                announceForAccessibility(context, "${item.label}, unchecked")
            } else {
                // Select - check max constraint using canSelectItem
                // Requirements: 7.5 - Prevent selecting more than max
                if (!canSelectItem(index, selectedIndices, maxSelections)) {
                    return // Can't select more
                }
                newIndices.add(index)
                
                // Haptic feedback for checking
                triggerHapticFeedback(context, HapticFeedbackType.SELECTION)
                
                // Announce checked to TalkBack
                // Requirements: 10.5 - Selection state announcements
                announceForAccessibility(context, "${item.label}, checked")
            }
            
            onMultiSelectionChange?.invoke(newIndices)
        }
    }
}
