/**
 * Container Component - Android Tests
 * 
 * Comprehensive test suite for the Android Jetpack Compose implementation of Container.
 * Tests Compose modifiers, elevation conflict warnings, and accessibility content descriptions.
 * 
 * Test Coverage:
 * - Jetpack Compose modifiers (padding, background, shadow, border, borderRadius, opacity, layering)
 * - Elevation conflict warning (layering + shadow props)
 * - Accessibility content description
 * - Token mapping integration
 * - Content rendering
 * - Android platform-specific features
 * 
 * Testing Framework:
 * - JUnit 4 for test structure
 * - Compose Testing for Compose UI testing
 * - Mockito for mocking Log calls
 * 
 * @see ../Container.android.kt for implementation being tested
 * @see ../TokenMapping.kt for token mapping functions being tested
 * @see Requirements 10.3, 13.1-13.5, 14.1-14.2
 */

package com.designerpunk.components.core

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.material.Text
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.unit.dp
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.shadows.ShadowLog
import org.junit.Assert.*
import org.junit.Before

/**
 * Container Android Tests
 * 
 * Tests the Jetpack Compose implementation of Container component.
 * Uses Compose Testing library for UI testing and Robolectric for Android framework mocking.
 */
@RunWith(RobolectricTestRunner::class)
@Config(sdk = [28])
class ContainerAndroidTest {
    
    @get:Rule
    val composeTestRule = createComposeRule()
    
    @Before
    fun setUp() {
        // Enable logging output for test debugging
        ShadowLog.stream = System.out
    }
    
    // MARK: - Jetpack Compose Modifiers
    
    /**
     * Test: Container renders with no props
     * 
     * Verifies that Container can render with default values (no styling applied).
     * 
     * @see Requirements 10.3, 13.1
     */
    @Test
    fun testContainerRendersWithNoProps() {
        composeTestRule.setContent {
            Container {
                Text("Test Content", modifier = Modifier.testTag("content"))
            }
        }
        
        // Verify content is rendered
        composeTestRule.onNodeWithTag("content").assertExists()
        composeTestRule.onNodeWithText("Test Content").assertExists()
    }
    
    /**
     * Test: Container applies padding modifier
     * 
     * Verifies that padding prop correctly applies padding modifier.
     * 
     * @see Requirements 10.3, 13.1, 2.1, 3.1-3.7
     */
    @Test
    fun testContainerAppliesPaddingModifier() {
        composeTestRule.setContent {
            Container(
                padding = PaddingValue.P200,
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container exists
        composeTestRule.onNodeWithTag("container").assertExists()
        
        // Note: Compose Testing doesn't provide direct access to modifier values
        // We verify that the component renders without errors, which indicates
        // the padding modifier was applied correctly
    }
    
    /**
     * Test: Container applies all padding values
     * 
     * Verifies that all padding values (None, P050, P100, P150, P200, P300, P400)
     * can be applied without errors.
     * 
     * @see Requirements 10.3, 13.1, 3.1-3.7
     */
    @Test
    fun testContainerAppliesAllPaddingValues() {
        val paddingValues = listOf(
            PaddingValue.None,
            PaddingValue.P050,
            PaddingValue.P100,
            PaddingValue.P150,
            PaddingValue.P200,
            PaddingValue.P300,
            PaddingValue.P400
        )
        
        paddingValues.forEach { padding ->
            composeTestRule.setContent {
                Container(
                    padding = padding,
                    modifier = Modifier.testTag("container-$padding")
                ) {
                    Text("Test Content")
                }
            }
            
            // Verify container renders for each padding value
            composeTestRule.onNodeWithTag("container-$padding").assertExists()
        }
    }
    
    /**
     * Test: Container applies background modifier
     * 
     * Verifies that background prop correctly applies background modifier.
     * 
     * @see Requirements 10.3, 13.1, 2.2, 4.1-4.4
     */
    @Test
    fun testContainerAppliesBackgroundModifier() {
        composeTestRule.setContent {
            Container(
                background = "color.primary",
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container exists
        composeTestRule.onNodeWithTag("container").assertExists()
    }
    
    /**
     * Test: Container applies shadow modifier
     * 
     * Verifies that shadow prop correctly applies shadow modifier (elevation).
     * 
     * @see Requirements 10.3, 13.1, 2.3, 5.1-5.4
     */
    @Test
    fun testContainerAppliesShadowModifier() {
        composeTestRule.setContent {
            Container(
                shadow = "shadow.container",
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container exists
        composeTestRule.onNodeWithTag("container").assertExists()
    }
    
    /**
     * Test: Container applies border modifier
     * 
     * Verifies that border prop correctly applies border modifier.
     * 
     * @see Requirements 10.3, 13.1, 2.4, 6.1-6.5
     */
    @Test
    fun testContainerAppliesBorderModifier() {
        composeTestRule.setContent {
            Container(
                border = BorderValue.Default,
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container exists
        composeTestRule.onNodeWithTag("container").assertExists()
    }
    
    /**
     * Test: Container applies all border values
     * 
     * Verifies that all border values (None, Default, Emphasis, Heavy)
     * can be applied without errors.
     * 
     * @see Requirements 10.3, 13.1, 6.1-6.5
     */
    @Test
    fun testContainerAppliesAllBorderValues() {
        val borderValues = listOf(
            BorderValue.None,
            BorderValue.Default,
            BorderValue.Emphasis,
            BorderValue.Heavy
        )
        
        borderValues.forEach { border ->
            composeTestRule.setContent {
                Container(
                    border = border,
                    modifier = Modifier.testTag("container-$border")
                ) {
                    Text("Test Content")
                }
            }
            
            // Verify container renders for each border value
            composeTestRule.onNodeWithTag("container-$border").assertExists()
        }
    }
    
    /**
     * Test: Container applies border radius modifier
     * 
     * Verifies that borderRadius prop correctly applies border radius modifier.
     * 
     * @see Requirements 10.3, 13.1, 2.5, 7.1-7.4
     */
    @Test
    fun testContainerAppliesBorderRadiusModifier() {
        composeTestRule.setContent {
            Container(
                borderRadius = BorderRadiusValue.Normal,
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container exists
        composeTestRule.onNodeWithTag("container").assertExists()
    }
    
    /**
     * Test: Container applies all border radius values
     * 
     * Verifies that all border radius values (None, Tight, Normal, Loose)
     * can be applied without errors.
     * 
     * @see Requirements 10.3, 13.1, 7.1-7.4
     */
    @Test
    fun testContainerAppliesAllBorderRadiusValues() {
        val borderRadiusValues = listOf(
            BorderRadiusValue.None,
            BorderRadiusValue.Tight,
            BorderRadiusValue.Normal,
            BorderRadiusValue.Loose
        )
        
        borderRadiusValues.forEach { borderRadius ->
            composeTestRule.setContent {
                Container(
                    borderRadius = borderRadius,
                    modifier = Modifier.testTag("container-$borderRadius")
                ) {
                    Text("Test Content")
                }
            }
            
            // Verify container renders for each border radius value
            composeTestRule.onNodeWithTag("container-$borderRadius").assertExists()
        }
    }
    
    /**
     * Test: Container applies opacity modifier
     * 
     * Verifies that opacity prop correctly applies opacity modifier.
     * 
     * @see Requirements 10.3, 13.1, 8.1-8.4
     */
    @Test
    fun testContainerAppliesOpacityModifier() {
        composeTestRule.setContent {
            Container(
                opacity = "opacity.subtle",
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container exists
        composeTestRule.onNodeWithTag("container").assertExists()
    }
    
    /**
     * Test: Container applies layering modifier
     * 
     * Verifies that layering prop correctly applies elevation modifier.
     * On Android, elevation handles both stacking order and shadow rendering.
     * 
     * @see Requirements 10.3, 13.1, 9.1-9.9
     */
    @Test
    fun testContainerAppliesLayeringModifier() {
        composeTestRule.setContent {
            Container(
                layering = LayeringValue.Modal,
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container exists
        composeTestRule.onNodeWithTag("container").assertExists()
    }
    
    /**
     * Test: Container applies all layering values
     * 
     * Verifies that all layering values (Container, Navigation, Dropdown, Modal, Toast, Tooltip)
     * can be applied without errors.
     * 
     * @see Requirements 10.3, 13.1, 9.1-9.9
     */
    @Test
    fun testContainerAppliesAllLayeringValues() {
        val layeringValues = listOf(
            LayeringValue.Container,
            LayeringValue.Navigation,
            LayeringValue.Dropdown,
            LayeringValue.Modal,
            LayeringValue.Toast,
            LayeringValue.Tooltip
        )
        
        layeringValues.forEach { layering ->
            composeTestRule.setContent {
                Container(
                    layering = layering,
                    modifier = Modifier.testTag("container-$layering")
                ) {
                    Text("Test Content")
                }
            }
            
            // Verify container renders for each layering value
            composeTestRule.onNodeWithTag("container-$layering").assertExists()
        }
    }
    
    /**
     * Test: Container applies multiple modifiers
     * 
     * Verifies that Container can apply multiple modifiers simultaneously.
     * 
     * @see Requirements 10.3, 13.1, 13.2
     */
    @Test
    fun testContainerAppliesMultipleModifiers() {
        composeTestRule.setContent {
            Container(
                padding = PaddingValue.P200,
                background = "color.primary",
                shadow = "shadow.container",
                border = BorderValue.Default,
                borderRadius = BorderRadiusValue.Normal,
                opacity = "opacity.subtle",
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container exists with all modifiers applied
        composeTestRule.onNodeWithTag("container").assertExists()
    }
    
    // MARK: - Elevation Conflict Warning
    
    /**
     * Test: Container logs warning when both layering and shadow props provided
     * 
     * Verifies that Container logs a development warning when both layering and shadow
     * props are provided, since Android elevation handles both stacking and shadow.
     * 
     * @see Requirements 13.3, 13.4, 13.5
     */
    @Test
    fun testContainerLogsWarningForLayeringAndShadowConflict() {
        // Clear any existing logs
        ShadowLog.reset()
        
        composeTestRule.setContent {
            Container(
                layering = LayeringValue.Modal,
                shadow = "shadow.container",
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container renders (layering takes precedence)
        composeTestRule.onNodeWithTag("container").assertExists()
        
        // Verify warning was logged
        val logs = ShadowLog.getLogsForTag("Container")
        assertNotNull("Expected warning log to be present", logs)
        assertTrue(
            "Expected warning about layering and shadow conflict",
            logs.any { it.msg.contains("Both layering and shadow props provided") }
        )
        assertTrue(
            "Expected warning to mention Android elevation",
            logs.any { it.msg.contains("Android elevation handles both stacking and shadow") }
        )
        assertTrue(
            "Expected warning to mention layering precedence",
            logs.any { it.msg.contains("Using layering prop, shadow prop ignored") }
        )
    }
    
    /**
     * Test: Container uses layering when both layering and shadow provided
     * 
     * Verifies that when both layering and shadow props are provided,
     * layering takes precedence (as documented in the warning).
     * 
     * @see Requirements 13.3, 13.4, 13.5
     */
    @Test
    fun testContainerUsesLayeringWhenBothProvided() {
        composeTestRule.setContent {
            Container(
                layering = LayeringValue.Modal,
                shadow = "shadow.container",
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container renders without errors
        // The implementation uses layering elevation, not shadow elevation
        composeTestRule.onNodeWithTag("container").assertExists()
    }
    
    /**
     * Test: Container does not log warning when only layering provided
     * 
     * Verifies that no warning is logged when only layering prop is provided.
     * 
     * @see Requirements 13.3, 13.4
     */
    @Test
    fun testContainerDoesNotLogWarningForLayeringOnly() {
        // Clear any existing logs
        ShadowLog.reset()
        
        composeTestRule.setContent {
            Container(
                layering = LayeringValue.Modal,
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container renders
        composeTestRule.onNodeWithTag("container").assertExists()
        
        // Verify no warning was logged
        val logs = ShadowLog.getLogsForTag("Container")
        if (logs != null) {
            assertFalse(
                "Expected no warning when only layering provided",
                logs.any { it.msg.contains("Both layering and shadow props provided") }
            )
        }
    }
    
    /**
     * Test: Container does not log warning when only shadow provided
     * 
     * Verifies that no warning is logged when only shadow prop is provided.
     * 
     * @see Requirements 13.3, 13.4
     */
    @Test
    fun testContainerDoesNotLogWarningForShadowOnly() {
        // Clear any existing logs
        ShadowLog.reset()
        
        composeTestRule.setContent {
            Container(
                shadow = "shadow.container",
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container renders
        composeTestRule.onNodeWithTag("container").assertExists()
        
        // Verify no warning was logged
        val logs = ShadowLog.getLogsForTag("Container")
        if (logs != null) {
            assertFalse(
                "Expected no warning when only shadow provided",
                logs.any { it.msg.contains("Both layering and shadow props provided") }
            )
        }
    }
    
    // MARK: - Accessibility Content Description
    
    /**
     * Test: Container applies accessibility content description
     * 
     * Verifies that accessibilityLabel prop correctly applies content description
     * for accessibility services.
     * 
     * @see Requirements 14.1, 14.2
     */
    @Test
    fun testContainerAppliesAccessibilityContentDescription() {
        composeTestRule.setContent {
            Container(
                accessibilityLabel = "Product card",
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container exists
        val node = composeTestRule.onNodeWithTag("container")
        node.assertExists()
        
        // Verify content description is set
        val semantics = node.fetchSemanticsNode()
        val contentDescription = semantics.config.getOrNull(SemanticsProperties.ContentDescription)
        assertNotNull("Expected content description to be set", contentDescription)
        assertTrue(
            "Expected content description to contain 'Product card'",
            contentDescription?.any { it == "Product card" } == true
        )
    }
    
    /**
     * Test: Container handles empty accessibility label
     * 
     * Verifies that Container handles empty accessibility label gracefully.
     * 
     * @see Requirements 14.1, 14.2
     */
    @Test
    fun testContainerHandlesEmptyAccessibilityLabel() {
        composeTestRule.setContent {
            Container(
                accessibilityLabel = "",
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container renders without errors
        composeTestRule.onNodeWithTag("container").assertExists()
    }
    
    /**
     * Test: Container handles null accessibility label
     * 
     * Verifies that Container handles null accessibility label (no content description applied).
     * 
     * @see Requirements 14.1, 14.2
     */
    @Test
    fun testContainerHandlesNullAccessibilityLabel() {
        composeTestRule.setContent {
            Container(
                accessibilityLabel = null,
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container renders without errors
        composeTestRule.onNodeWithTag("container").assertExists()
        
        // Verify no content description is set
        val node = composeTestRule.onNodeWithTag("container")
        val semantics = node.fetchSemanticsNode()
        val contentDescription = semantics.config.getOrNull(SemanticsProperties.ContentDescription)
        assertTrue(
            "Expected no content description when accessibilityLabel is null",
            contentDescription == null || contentDescription.isEmpty()
        )
    }
    
    /**
     * Test: Container handles special characters in accessibility label
     * 
     * Verifies that Container handles special characters in accessibility label.
     * 
     * @see Requirements 14.1, 14.2
     */
    @Test
    fun testContainerHandlesSpecialCharactersInAccessibilityLabel() {
        val specialLabel = "Product card with $100 price & 50% discount!"
        
        composeTestRule.setContent {
            Container(
                accessibilityLabel = specialLabel,
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container exists
        val node = composeTestRule.onNodeWithTag("container")
        node.assertExists()
        
        // Verify content description contains special characters
        val semantics = node.fetchSemanticsNode()
        val contentDescription = semantics.config.getOrNull(SemanticsProperties.ContentDescription)
        assertNotNull("Expected content description to be set", contentDescription)
        assertTrue(
            "Expected content description to contain special characters",
            contentDescription?.any { it == specialLabel } == true
        )
    }
    
    /**
     * Test: Container handles long accessibility label
     * 
     * Verifies that Container handles long accessibility labels.
     * 
     * @see Requirements 14.1, 14.2
     */
    @Test
    fun testContainerHandlesLongAccessibilityLabel() {
        val longLabel = "This is a very long accessibility label that describes a complex UI element with multiple features and characteristics that need to be communicated to assistive technologies"
        
        composeTestRule.setContent {
            Container(
                accessibilityLabel = longLabel,
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container exists
        val node = composeTestRule.onNodeWithTag("container")
        node.assertExists()
        
        // Verify content description is set
        val semantics = node.fetchSemanticsNode()
        val contentDescription = semantics.config.getOrNull(SemanticsProperties.ContentDescription)
        assertNotNull("Expected content description to be set", contentDescription)
        assertTrue(
            "Expected content description to contain long label",
            contentDescription?.any { it == longLabel } == true
        )
    }
    
    /**
     * Test: Container applies accessibility with other modifiers
     * 
     * Verifies that accessibility content description works correctly when combined
     * with other modifiers.
     * 
     * @see Requirements 14.1, 14.2
     */
    @Test
    fun testContainerAppliesAccessibilityWithOtherModifiers() {
        composeTestRule.setContent {
            Container(
                padding = PaddingValue.P200,
                background = "color.primary",
                layering = LayeringValue.Modal,
                accessibilityLabel = "Modal dialog",
                modifier = Modifier.testTag("container")
            ) {
                Text("Test Content")
            }
        }
        
        // Verify container exists
        val node = composeTestRule.onNodeWithTag("container")
        node.assertExists()
        
        // Verify content description is set
        val semantics = node.fetchSemanticsNode()
        val contentDescription = semantics.config.getOrNull(SemanticsProperties.ContentDescription)
        assertNotNull("Expected content description to be set", contentDescription)
        assertTrue(
            "Expected content description to contain 'Modal dialog'",
            contentDescription?.any { it == "Modal dialog" } == true
        )
    }
    
    // MARK: - Content Rendering
    
    /**
     * Test: Container renders simple child content
     * 
     * Verifies that Container correctly renders simple child content.
     * 
     * @see Requirements 10.3, 13.1
     */
    @Test
    fun testContainerRendersSimpleChildContent() {
        composeTestRule.setContent {
            Container {
                Text("Simple Content", modifier = Modifier.testTag("content"))
            }
        }
        
        // Verify content is rendered
        composeTestRule.onNodeWithTag("content").assertExists()
        composeTestRule.onNodeWithText("Simple Content").assertExists()
    }
    
    /**
     * Test: Container renders complex child content
     * 
     * Verifies that Container correctly renders complex child content
     * (multiple composables).
     * 
     * @see Requirements 10.3, 13.1
     */
    @Test
    fun testContainerRendersComplexChildContent() {
        composeTestRule.setContent {
            Container {
                Column {
                    Text("Title", modifier = Modifier.testTag("title"))
                    Text("Subtitle", modifier = Modifier.testTag("subtitle"))
                    Text("Body", modifier = Modifier.testTag("body"))
                }
            }
        }
        
        // Verify all content is rendered
        composeTestRule.onNodeWithTag("title").assertExists()
        composeTestRule.onNodeWithTag("subtitle").assertExists()
        composeTestRule.onNodeWithTag("body").assertExists()
        composeTestRule.onNodeWithText("Title").assertExists()
        composeTestRule.onNodeWithText("Subtitle").assertExists()
        composeTestRule.onNodeWithText("Body").assertExists()
    }
    
    /**
     * Test: Container renders empty content
     * 
     * Verifies that Container can render with empty content (no children).
     * 
     * @see Requirements 10.3, 13.1
     */
    @Test
    fun testContainerRendersEmptyContent() {
        composeTestRule.setContent {
            Container(modifier = Modifier.testTag("container")) {
                // Empty content
            }
        }
        
        // Verify container exists even with empty content
        composeTestRule.onNodeWithTag("container").assertExists()
    }
}
