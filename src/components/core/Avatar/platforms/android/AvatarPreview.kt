/**
 * Avatar Jetpack Compose Preview
 * 
 * Comprehensive preview demonstrating all Avatar component configurations.
 * Used for visual verification and cross-platform consistency testing.
 * 
 * Preview Sections:
 * 1. All Type/Size Combinations - Grid showing human and agent avatars at all sizes
 * 2. Image Examples - Human avatars with profile images
 * 3. Interactive Examples - Avatars with hover visual feedback
 * 4. Accessibility Examples - Decorative mode and alt text usage
 * 5. Cross-Platform Consistency - Token reference documentation
 * 6. Border Styles - Border width and color variations by size
 * 
 * @see .kiro/specs/042-avatar-component/requirements.md Requirements 14.1, 14.2, 14.3
 * @see .kiro/specs/042-avatar-component/design.md for implementation details
 */

package com.designerpunk.components.avatar

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Divider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

// MARK: - Main Preview

/**
 * Main preview provider for Avatar component.
 * 
 * Demonstrates all type/size combinations, image examples, and interactive states.
 * Verifies visual consistency with web and iOS implementations through token-based sizing.
 * 
 * @see Requirements: 14.1, 14.2, 14.3 - Cross-platform consistency verification
 */
@Preview(showBackground = true, name = "Avatar Component - Full Preview")
@Composable
fun AvatarFullPreview() {
    Surface(
        modifier = Modifier.padding(16.dp)
    ) {
        Column(
            modifier = Modifier.verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            // Header
            HeaderSection()
            
            Divider()
            
            // Section 1: All Type/Size Combinations
            AllTypeSizeCombinationsSection()
            
            Divider()
            
            // Section 2: Image Examples
            ImageExamplesSection()
            
            Divider()
            
            // Section 3: Interactive Examples
            InteractiveExamplesSection()
            
            Divider()
            
            // Section 4: Accessibility Examples
            AccessibilityExamplesSection()
            
            Divider()
            
            // Section 5: Cross-Platform Consistency
            CrossPlatformConsistencySection()
            
            Divider()
            
            // Section 6: Border Styles
            BorderStylesSection()
        }
    }
}

// MARK: - Header Section

@Composable
private fun HeaderSection() {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = "Avatar Component",
            style = MaterialTheme.typography.headlineLarge
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = "Visual representation for users (Human) and AI agents (Agent)",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        
        Text(
            text = "Human = Circle | Agent = Hexagon",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}


// MARK: - Section 1: All Type/Size Combinations

@Composable
private fun AllTypeSizeCombinationsSection() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text(
            text = "1. All Type/Size Combinations",
            style = MaterialTheme.typography.titleMedium
        )
        
        // Human avatars - all sizes
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Human Avatars (Circle)",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalAlignment = Alignment.Bottom
            ) {
                AvatarSize.values().forEach { size ->
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Avatar(type = AvatarType.Human, size = size)
                        Text(
                            text = size.name.lowercase(),
                            style = MaterialTheme.typography.labelSmall
                        )
                        Text(
                            text = "${size.dimension.value.toInt()}dp",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
        
        // Agent avatars - all sizes
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Agent Avatars (Hexagon)",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalAlignment = Alignment.Bottom
            ) {
                AvatarSize.values().forEach { size ->
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Avatar(type = AvatarType.Agent, size = size)
                        Text(
                            text = size.name.lowercase(),
                            style = MaterialTheme.typography.labelSmall
                        )
                        Text(
                            text = "${size.dimension.value.toInt()}dp",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
        
        // Side-by-side comparison
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Side-by-Side Comparison",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                listOf(AvatarSize.Sm, AvatarSize.Md, AvatarSize.Lg, AvatarSize.Xl).forEach { size ->
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Avatar(type = AvatarType.Human, size = size)
                            Avatar(type = AvatarType.Agent, size = size)
                        }
                        Text(
                            text = size.name.lowercase(),
                            style = MaterialTheme.typography.labelSmall
                        )
                    }
                }
            }
        }
    }
}


// MARK: - Section 2: Image Examples

/**
 * Image examples section demonstrating human avatars with profile images.
 * 
 * @see Requirements: 5.1, 5.2, 5.3, 5.5, 5.6 - Image support for human type
 */
@Composable
private fun ImageExamplesSection() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text(
            text = "2. Image Examples (Human Only)",
            style = MaterialTheme.typography.titleMedium
        )
        
        Text(
            text = "Agent avatars ignore src prop - always show icon",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        
        // Human avatars with images
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Human with Profile Image",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                // Small image avatar
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(
                        type = AvatarType.Human,
                        size = AvatarSize.Md,
                        src = "https://i.pravatar.cc/80?img=1",
                        alt = "Profile photo of Alex"
                    )
                    Text(
                        text = "md",
                        style = MaterialTheme.typography.labelSmall
                    )
                }
                
                // Large image avatar
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(
                        type = AvatarType.Human,
                        size = AvatarSize.Xl,
                        src = "https://i.pravatar.cc/160?img=2",
                        alt = "Profile photo of Jordan"
                    )
                    Text(
                        text = "xl",
                        style = MaterialTheme.typography.labelSmall
                    )
                }
                
                // XXL image avatar
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(
                        type = AvatarType.Human,
                        size = AvatarSize.Xxl,
                        src = "https://i.pravatar.cc/256?img=3",
                        alt = "Profile photo of Sam"
                    )
                    Text(
                        text = "xxl",
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }
        }
        
        // Agent ignores src
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Agent Ignores src Prop",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    // Agent with src (should show icon, not image)
                    Avatar(
                        type = AvatarType.Agent,
                        size = AvatarSize.Lg,
                        src = "https://i.pravatar.cc/96?img=4",
                        alt = "This alt text is ignored"
                    )
                    Text(
                        text = "src ignored",
                        style = MaterialTheme.typography.labelSmall,
                        color = Color(0xFFFF9800) // Orange warning color
                    )
                }
                
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    // Agent without src (same appearance)
                    Avatar(type = AvatarType.Agent, size = AvatarSize.Lg)
                    Text(
                        text = "no src",
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }
        }
        
        // Image fallback
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Image Fallback to Icon",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Text(
                text = "When image fails to load, falls back to icon placeholder",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    // Invalid URL - will show fallback
                    Avatar(
                        type = AvatarType.Human,
                        size = AvatarSize.Lg,
                        src = "https://invalid-url-that-will-fail.com/image.jpg",
                        alt = "Fallback example"
                    )
                    Text(
                        text = "Invalid URL",
                        style = MaterialTheme.typography.labelSmall
                    )
                }
                
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    // No src - shows icon
                    Avatar(type = AvatarType.Human, size = AvatarSize.Lg)
                    Text(
                        text = "No src",
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }
        }
    }
}


// MARK: - Section 3: Interactive Examples

/**
 * Interactive examples section demonstrating hover visual feedback.
 * 
 * @see Requirements: 8.1, 8.2, 8.3, 8.4 - Interactive hover state
 */
@Composable
private fun InteractiveExamplesSection() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text(
            text = "3. Interactive Examples",
            style = MaterialTheme.typography.titleMedium
        )
        
        Text(
            text = "Hover over avatars to see border width increase",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        
        // Interactive avatars
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Interactive Avatars (hover to see effect)",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Row(horizontalArrangement = Arrangement.spacedBy(32.dp)) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(type = AvatarType.Human, size = AvatarSize.Lg, interactive = true)
                    Text(
                        text = "Human",
                        style = MaterialTheme.typography.labelSmall
                    )
                    Text(
                        text = "interactive: true",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(type = AvatarType.Agent, size = AvatarSize.Lg, interactive = true)
                    Text(
                        text = "Agent",
                        style = MaterialTheme.typography.labelSmall
                    )
                    Text(
                        text = "interactive: true",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
        
        // Non-interactive comparison
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Non-Interactive (default)",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Row(horizontalArrangement = Arrangement.spacedBy(32.dp)) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(type = AvatarType.Human, size = AvatarSize.Lg, interactive = false)
                    Text(
                        text = "Human",
                        style = MaterialTheme.typography.labelSmall
                    )
                    Text(
                        text = "interactive: false",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(type = AvatarType.Agent, size = AvatarSize.Lg, interactive = false)
                    Text(
                        text = "Agent",
                        style = MaterialTheme.typography.labelSmall
                    )
                    Text(
                        text = "interactive: false",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
        
        // Interactive with image
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Interactive with Image",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Avatar(
                type = AvatarType.Human,
                size = AvatarSize.Xl,
                src = "https://i.pravatar.cc/160?img=5",
                alt = "Profile photo",
                interactive = true
            )
        }
    }
}


// MARK: - Section 4: Accessibility Examples

/**
 * Accessibility examples section demonstrating decorative mode and alt text.
 * 
 * @see Requirements: 9.1, 9.2, 9.3, 16.1, 16.2 - Accessibility and testID
 */
@Composable
private fun AccessibilityExamplesSection() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text(
            text = "4. Accessibility Examples",
            style = MaterialTheme.typography.titleMedium
        )
        
        // Decorative mode
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Decorative Mode (Hidden from TalkBack)",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Text(
                text = "Use when avatar is adjacent to name text",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Box(
                modifier = Modifier
                    .background(
                        color = MaterialTheme.colorScheme.surfaceVariant,
                        shape = MaterialTheme.shapes.small
                    )
                    .padding(12.dp)
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Avatar(type = AvatarType.Human, size = AvatarSize.Md, decorative = true)
                    Text(
                        text = "John Doe",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }
            
            Text(
                text = "decorative: true → semantics { invisibleToUser() }",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        
        // Alt text examples
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Alt Text for Images",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Avatar(
                        type = AvatarType.Human,
                        size = AvatarSize.Md,
                        src = "https://i.pravatar.cc/80?img=6",
                        alt = "Profile photo of Jane Smith"
                    )
                    Column {
                        Text(
                            text = "With alt text",
                            style = MaterialTheme.typography.labelSmall
                        )
                        Text(
                            text = "TalkBack: \"Profile photo of Jane Smith\"",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Avatar(type = AvatarType.Human, size = AvatarSize.Md)
                    Column {
                        Text(
                            text = "Without alt text",
                            style = MaterialTheme.typography.labelSmall
                        )
                        Text(
                            text = "TalkBack: \"User avatar\"",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Avatar(type = AvatarType.Agent, size = AvatarSize.Md)
                    Column {
                        Text(
                            text = "Agent type",
                            style = MaterialTheme.typography.labelSmall
                        )
                        Text(
                            text = "TalkBack: \"AI agent avatar\"",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
        
        // testID example
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Test ID for Automation",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Avatar(type = AvatarType.Human, size = AvatarSize.Md, testID = "user-profile-avatar")
            
            Text(
                text = "testID: \"user-profile-avatar\"",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Text(
                text = "→ Modifier.testTag(\"user-profile-avatar\")",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}


// MARK: - Section 5: Cross-Platform Consistency

/**
 * Cross-platform consistency section showing token references.
 * 
 * @see Requirements: 14.1, 14.2, 14.3 - Cross-platform consistency
 */
@Composable
private fun CrossPlatformConsistencySection() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text(
            text = "5. Cross-Platform Consistency",
            style = MaterialTheme.typography.titleMedium
        )
        
        Text(
            text = "Token references ensure identical values across Web, iOS, Android",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        
        // Size token references
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Avatar Size Tokens",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                AvatarSize.values().forEach { size ->
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Avatar(type = AvatarType.Human, size = size)
                        Column {
                            Text(
                                text = "avatar.size.${size.name.lowercase()}",
                                style = MaterialTheme.typography.labelSmall,
                                fontFamily = FontFamily.Monospace
                            )
                            Text(
                                text = "${size.dimension.value.toInt()}dp",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
        
        // Icon size token references
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Icon Size Tokens (50% ratio)",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                AvatarSize.values().forEach { size ->
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Avatar(type = AvatarType.Human, size = size)
                        Column {
                            Text(
                                text = size.iconTokenReference,
                                style = MaterialTheme.typography.labelSmall,
                                fontFamily = FontFamily.Monospace
                            )
                            Text(
                                text = "${size.iconDimension.value.toInt()}dp icon",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
        
        // Color token references
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Color Tokens",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Avatar(type = AvatarType.Human, size = AvatarSize.Md)
                    Column {
                        Text(
                            text = "color.avatar.human.background",
                            style = MaterialTheme.typography.labelSmall,
                            fontFamily = FontFamily.Monospace
                        )
                        Text(
                            text = "→ color.identity.human → orange300",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Avatar(type = AvatarType.Agent, size = AvatarSize.Md)
                    Column {
                        Text(
                            text = "color.avatar.agent.background",
                            style = MaterialTheme.typography.labelSmall,
                            fontFamily = FontFamily.Monospace
                        )
                        Text(
                            text = "→ color.identity.agent → teal200",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}


// MARK: - Section 6: Border Styles

/**
 * Border styles section showing border width and color variations.
 * 
 * @see Requirements: 7.1, 7.2, 7.3, 7.4 - Border styles
 */
@Composable
private fun BorderStylesSection() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text(
            text = "6. Border Styles",
            style = MaterialTheme.typography.titleMedium
        )
        
        Text(
            text = "Border width and color vary by size",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        
        // xs through xl: borderDefault (1dp) with opacity
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "xs-xl: borderDefault (1dp) + opacity.heavy (48%)",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                listOf(AvatarSize.Xs, AvatarSize.Sm, AvatarSize.Md, AvatarSize.Lg, AvatarSize.Xl).forEach { size ->
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Avatar(type = AvatarType.Human, size = size)
                        Text(
                            text = size.name.lowercase(),
                            style = MaterialTheme.typography.labelSmall
                        )
                    }
                }
            }
        }
        
        // xxl: borderEmphasis (2dp) with full opacity
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "xxl: borderEmphasis (2dp) + full opacity",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(type = AvatarType.Human, size = AvatarSize.Xxl)
                    Text(
                        text = "Human xxl",
                        style = MaterialTheme.typography.labelSmall
                    )
                }
                
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(type = AvatarType.Agent, size = AvatarSize.Xxl)
                    Text(
                        text = "Agent xxl",
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }
        }
        
        // Border token references
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                text = "Border Token References",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Text(
                text = "xs-xl: borderDefault → borderWidth100 (1dp)",
                style = MaterialTheme.typography.labelSmall,
                fontFamily = FontFamily.Monospace
            )
            Text(
                text = "xxl: borderEmphasis → borderWidth200 (2dp)",
                style = MaterialTheme.typography.labelSmall,
                fontFamily = FontFamily.Monospace
            )
            Text(
                text = "xs-xl color: color.avatar.default.border + opacity.heavy",
                style = MaterialTheme.typography.labelSmall,
                fontFamily = FontFamily.Monospace
            )
            Text(
                text = "xxl color: color.contrast.onSurface (full opacity)",
                style = MaterialTheme.typography.labelSmall,
                fontFamily = FontFamily.Monospace
            )
        }
    }
}


// MARK: - Individual Preview Sections

/**
 * Compact preview showing just the type/size grid.
 * Useful for quick visual verification.
 */
@Preview(showBackground = true, name = "Avatar - Type/Size Grid")
@Composable
fun AvatarTypeSizeGridPreview() {
    Surface(modifier = Modifier.padding(16.dp)) {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text(
                text = "Avatar Type/Size Grid",
                style = MaterialTheme.typography.titleMedium
            )
            
            // Human row
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.Bottom
            ) {
                Text(
                    text = "Human",
                    style = MaterialTheme.typography.labelSmall,
                    modifier = Modifier.padding(end = 8.dp)
                )
                AvatarSize.values().forEach { size ->
                    Avatar(type = AvatarType.Human, size = size)
                }
            }
            
            // Agent row
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.Bottom
            ) {
                Text(
                    text = "Agent",
                    style = MaterialTheme.typography.labelSmall,
                    modifier = Modifier.padding(end = 8.dp)
                )
                AvatarSize.values().forEach { size ->
                    Avatar(type = AvatarType.Agent, size = size)
                }
            }
            
            // Size labels
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "",
                    modifier = Modifier.padding(end = 8.dp)
                )
                AvatarSize.values().forEach { size ->
                    Text(
                        text = size.name.lowercase(),
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }
        }
    }
}

/**
 * Preview showing interactive hover behavior.
 * Best viewed in Android Studio's interactive preview mode.
 */
@Preview(showBackground = true, name = "Avatar - Interactive")
@Composable
fun AvatarInteractivePreview() {
    Surface(modifier = Modifier.padding(16.dp)) {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text(
                text = "Interactive Avatars",
                style = MaterialTheme.typography.titleMedium
            )
            
            Text(
                text = "Hover to see border width increase",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Row(horizontalArrangement = Arrangement.spacedBy(32.dp)) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(type = AvatarType.Human, size = AvatarSize.Xl, interactive = true)
                    Text(
                        text = "Human",
                        style = MaterialTheme.typography.labelSmall
                    )
                }
                
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(type = AvatarType.Agent, size = AvatarSize.Xl, interactive = true)
                    Text(
                        text = "Agent",
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }
        }
    }
}

/**
 * Preview showing image loading behavior.
 */
@Preview(showBackground = true, name = "Avatar - Images")
@Composable
fun AvatarImagesPreview() {
    Surface(modifier = Modifier.padding(16.dp)) {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text(
                text = "Image Avatars",
                style = MaterialTheme.typography.titleMedium
            )
            
            Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                Avatar(
                    type = AvatarType.Human,
                    size = AvatarSize.Lg,
                    src = "https://i.pravatar.cc/96?img=1",
                    alt = "User 1"
                )
                
                Avatar(
                    type = AvatarType.Human,
                    size = AvatarSize.Lg,
                    src = "https://i.pravatar.cc/96?img=2",
                    alt = "User 2"
                )
                
                Avatar(
                    type = AvatarType.Human,
                    size = AvatarSize.Lg,
                    src = "https://i.pravatar.cc/96?img=3",
                    alt = "User 3"
                )
            }
        }
    }
}

/**
 * Dark mode preview for visual consistency verification.
 */
@Preview(showBackground = true, name = "Avatar - Dark Mode", uiMode = android.content.res.Configuration.UI_MODE_NIGHT_YES)
@Composable
fun AvatarDarkModePreview() {
    Surface(modifier = Modifier.padding(16.dp)) {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text(
                text = "Dark Mode",
                style = MaterialTheme.typography.titleMedium
            )
            
            Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(type = AvatarType.Human, size = AvatarSize.Lg)
                    Text(
                        text = "Human",
                        style = MaterialTheme.typography.labelSmall
                    )
                }
                
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(type = AvatarType.Agent, size = AvatarSize.Lg)
                    Text(
                        text = "Agent",
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }
            
            Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                Avatar(type = AvatarType.Human, size = AvatarSize.Xxl)
                Avatar(type = AvatarType.Agent, size = AvatarSize.Xxl)
            }
        }
    }
}

/**
 * XXL size preview for hero profile verification.
 */
@Preview(showBackground = true, name = "Avatar - XXL Hero Size")
@Composable
fun AvatarXxlPreview() {
    Surface(modifier = Modifier.padding(16.dp)) {
        Column(
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "XXL Hero Size (128dp)",
                style = MaterialTheme.typography.titleMedium
            )
            
            Row(horizontalArrangement = Arrangement.spacedBy(32.dp)) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(type = AvatarType.Human, size = AvatarSize.Xxl)
                    Text(
                        text = "Human",
                        style = MaterialTheme.typography.labelSmall
                    )
                }
                
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Avatar(type = AvatarType.Agent, size = AvatarSize.Xxl)
                    Text(
                        text = "Agent",
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }
            
            Text(
                text = "Border: 2dp (borderEmphasis) with full opacity",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
