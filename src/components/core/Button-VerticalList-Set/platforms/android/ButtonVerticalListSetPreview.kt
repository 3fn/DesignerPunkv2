/**
 * Preview for Button-VerticalList-Set Component (Android Platform)
 * 
 * Provides Compose Preview configurations for visual verification
 * of the ButtonVerticalListSet component in Android Studio.
 * 
 * @module Button-VerticalList-Set/platforms/android
 * @see Requirements: 10.3, 10.4
 */

package com.designerpunk.components.button

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// MARK: - Sample Data

/**
 * Sample items for preview demonstrations.
 */
private val sampleItems = listOf(
    ButtonVerticalListSetItem(id = 0, label = "Option 1", description = "First option description"),
    ButtonVerticalListSetItem(id = 1, label = "Option 2", description = "Second option description"),
    ButtonVerticalListSetItem(id = 2, label = "Option 3", description = "Third option description"),
    ButtonVerticalListSetItem(id = 3, label = "Option 4", description = "Fourth option description")
)

private val sampleItemsWithIcons = listOf(
    ButtonVerticalListSetItem(id = 0, label = "Settings", leadingIcon = "gear"),
    ButtonVerticalListSetItem(id = 1, label = "Notifications", leadingIcon = "bell"),
    ButtonVerticalListSetItem(id = 2, label = "Privacy", leadingIcon = "lock"),
    ButtonVerticalListSetItem(id = 3, label = "Help", leadingIcon = "help")
)

// MARK: - Tap Mode Preview

/**
 * Preview for Tap mode.
 * 
 * Demonstrates:
 * - All items in rest state
 * - Click callback invocation
 * - No selection tracking
 * 
 * Requirements: 3.1-3.4
 */
@Preview(showBackground = true, name = "Tap Mode")
@Composable
fun ButtonVerticalListSetTapModePreview() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Text(
            text = "Tap Mode",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        ButtonVerticalListSet(
            mode = ButtonVerticalListSetMode.TAP,
            items = sampleItems,
            onItemClick = { index -> println("Tapped item $index") },
            testTag = "tap-mode-preview"
        )
    }
}

// MARK: - Select Mode Preview

/**
 * Preview for Select mode.
 * 
 * Demonstrates:
 * - Single selection behavior
 * - Selected/notSelected visual states
 * - Deselection by clicking selected item
 * 
 * Requirements: 4.1-4.7
 */
@Preview(showBackground = true, name = "Select Mode")
@Composable
fun ButtonVerticalListSetSelectModePreview() {
    var selectedIndex by remember { mutableStateOf<Int?>(1) }
    
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Text(
            text = "Select Mode",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        Text(
            text = "Selected: ${selectedIndex ?: "None"}",
            fontSize = 14.sp,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        ButtonVerticalListSet(
            mode = ButtonVerticalListSetMode.SELECT,
            items = sampleItems,
            selectedIndex = selectedIndex,
            onSelectionChange = { index -> selectedIndex = index },
            testTag = "select-mode-preview"
        )
    }
}

// MARK: - Multi-Select Mode Preview

/**
 * Preview for Multi-Select mode.
 * 
 * Demonstrates:
 * - Multiple selection behavior
 * - Checked/unchecked visual states
 * - Toggle behavior
 * 
 * Requirements: 5.1-5.5
 */
@Preview(showBackground = true, name = "Multi-Select Mode")
@Composable
fun ButtonVerticalListSetMultiSelectModePreview() {
    var selectedIndices by remember { mutableStateOf(listOf(0, 2)) }
    
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Text(
            text = "Multi-Select Mode",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        Text(
            text = "Selected: ${selectedIndices.joinToString(", ")}",
            fontSize = 14.sp,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        ButtonVerticalListSet(
            mode = ButtonVerticalListSetMode.MULTI_SELECT,
            items = sampleItems,
            selectedIndices = selectedIndices,
            onMultiSelectionChange = { indices -> selectedIndices = indices },
            testTag = "multi-select-mode-preview"
        )
    }
}

// MARK: - Multi-Select with Constraints Preview

/**
 * Preview for Multi-Select mode with min/max constraints.
 * 
 * Demonstrates:
 * - Minimum selection validation
 * - Maximum selection enforcement
 * - Error state display
 * 
 * Requirements: 7.4, 7.5
 */
@Preview(showBackground = true, name = "Multi-Select with Constraints")
@Composable
fun ButtonVerticalListSetMultiSelectConstraintsPreview() {
    var selectedIndices by remember { mutableStateOf(listOf<Int>()) }
    var error by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    
    // Validate on selection change
    LaunchedEffect(selectedIndices) {
        val result = validateSelection(
            mode = ButtonVerticalListSetMode.MULTI_SELECT,
            selectedIndex = null,
            selectedIndices = selectedIndices,
            required = false,
            minSelections = 1,
            maxSelections = 2
        )
        error = !result.isValid
        errorMessage = result.message
    }
    
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Text(
            text = "Multi-Select (Min: 1, Max: 2)",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        Text(
            text = "Selected: ${selectedIndices.size} of ${sampleItems.size}",
            fontSize = 14.sp,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        ButtonVerticalListSet(
            mode = ButtonVerticalListSetMode.MULTI_SELECT,
            items = sampleItems,
            selectedIndices = selectedIndices,
            onMultiSelectionChange = { indices -> selectedIndices = indices },
            minSelections = 1,
            maxSelections = 2,
            error = error,
            errorMessage = errorMessage,
            testTag = "multi-select-constraints-preview"
        )
    }
}

// MARK: - Error State Preview

/**
 * Preview for error state.
 * 
 * Demonstrates:
 * - Error message display above list
 * - Error state propagation to children
 * - Required validation
 * 
 * Requirements: 7.1-7.6
 */
@Preview(showBackground = true, name = "Error State")
@Composable
fun ButtonVerticalListSetErrorStatePreview() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Text(
            text = "Error State (Required)",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        ButtonVerticalListSet(
            mode = ButtonVerticalListSetMode.SELECT,
            items = sampleItems,
            selectedIndex = null,
            required = true,
            error = true,
            errorMessage = "Please select an option",
            testTag = "error-state-preview"
        )
    }
}

// MARK: - With Icons Preview

/**
 * Preview with leading icons.
 * 
 * Demonstrates:
 * - Leading icon display
 * - Icon color coordination with visual state
 * 
 * Requirements: 4.4, 4.5
 */
@Preview(showBackground = true, name = "With Icons")
@Composable
fun ButtonVerticalListSetWithIconsPreview() {
    var selectedIndex by remember { mutableStateOf<Int?>(0) }
    
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Text(
            text = "With Leading Icons",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        ButtonVerticalListSet(
            mode = ButtonVerticalListSetMode.SELECT,
            items = sampleItemsWithIcons,
            selectedIndex = selectedIndex,
            onSelectionChange = { index -> selectedIndex = index },
            testTag = "with-icons-preview"
        )
    }
}

// MARK: - All Modes Preview

/**
 * Comprehensive preview showing all modes.
 * 
 * Demonstrates:
 * - All three interaction modes
 * - Visual comparison between modes
 * 
 * Requirements: 2.2, 3.1-3.4, 4.1-4.7, 5.1-5.5
 */
@Preview(showBackground = true, name = "All Modes", heightDp = 800)
@Composable
fun ButtonVerticalListSetAllModesPreview() {
    var selectModeIndex by remember { mutableStateOf<Int?>(1) }
    var multiSelectIndices by remember { mutableStateOf(listOf(0, 2)) }
    
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        // Tap Mode
        Column {
            Text(
                text = "Tap Mode",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.TAP,
                items = sampleItems.take(3),
                onItemClick = { index -> println("Tapped $index") },
                testTag = "all-modes-tap"
            )
        }
        
        Divider()
        
        // Select Mode
        Column {
            Text(
                text = "Select Mode",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.SELECT,
                items = sampleItems.take(3),
                selectedIndex = selectModeIndex,
                onSelectionChange = { index -> selectModeIndex = index },
                testTag = "all-modes-select"
            )
        }
        
        Divider()
        
        // Multi-Select Mode
        Column {
            Text(
                text = "Multi-Select Mode",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            ButtonVerticalListSet(
                mode = ButtonVerticalListSetMode.MULTI_SELECT,
                items = sampleItems.take(3),
                selectedIndices = multiSelectIndices,
                onMultiSelectionChange = { indices -> multiSelectIndices = indices },
                testTag = "all-modes-multi"
            )
        }
    }
}
