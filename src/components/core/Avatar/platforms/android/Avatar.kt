/**
 * Avatar Jetpack Compose Implementation
 * 
 * A visual representation component for users (Human) and AI agents (Agent)
 * with distinct shape-based differentiation:
 * - Human: Circle shape (organic, natural)
 * - Agent: Hexagon shape (synthetic, constructed)
 * 
 * Follows True Native Architecture with build-time platform separation.
 * Uses token-based styling for consistent cross-platform appearance.
 * Integrates with IconBase component for icon rendering.
 * 
 * @see .kiro/specs/042-avatar-component/design.md for implementation details
 * @see .kiro/specs/042-avatar-component/requirements.md Requirements 1.5, 2.7, 8.4, 9.3, 14.3
 * @see src/components/core/Icon-Base/platforms/android/IconBase.android.kt for Icon component
 */

package com.designerpunk.components.avatar

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.hoverable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.invisibleToUser
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import kotlin.math.cos
// Import IconBase component for icon rendering
// @see Requirements: 15.4 - Use Icon Compose component
import com.designerpunk.components.core.IconBase
// Import Coil AsyncImage for image loading
// @see Requirements: 5.1, 5.2, 5.3, 5.5, 5.6 - Image support
import coil.compose.AsyncImage
import coil.compose.AsyncImagePainter
import coil.compose.SubcomposeAsyncImage
import coil.compose.SubcomposeAsyncImageContent
import androidx.compose.foundation.layout.fillMaxSize

// MARK: - Avatar Tokens

/**
 * Avatar-specific design tokens.
 * 
 * These tokens are component-level tokens specific to the Avatar component.
 * They reference or extend the core DesignTokens where possible.
 * 
 * Icon size tokens use the existing DesignTokens.iconSizeXXX values where available,
 * with component-specific gap fillers for xs and xxl sizes.
 * 
 * @see Requirements: 3.1, 3.6 - Icon sizing at 50% ratio
 * @see Requirements: 4.1, 4.2 - Background colors
 * @see Requirements: 7.1-7.4 - Border styles
 */
object AvatarTokens {
    // MARK: - Avatar Icon Size Tokens (Gap Fillers)
    
    /**
     * Icon size for xs avatar (12dp = 1.5 × base)
     * Component token gap filler - no existing icon token at this size
     * @see Requirements: 3.1 - xs avatar icon size
     */
    val iconSizeXs: Dp = 12.dp
    
    /**
     * Icon size for xxl avatar (64dp = 8 × base)
     * Component token gap filler - no existing icon token at this size
     * @see Requirements: 3.6 - xxl avatar icon size
     */
    val iconSizeXxl: Dp = 64.dp
    
    // MARK: - Avatar Color Tokens
    
    /**
     * Background color for human avatars
     * References: color.avatar.human → orange300
     * @see Requirements: 4.1 - Human type background color
     */
    val colorHuman: Color = Color(0xFFFF6B35) // orange300 light base
    
    /**
     * Background color for agent avatars
     * References: color.avatar.agent → teal300
     * @see Requirements: 4.2 - Agent type background color
     */
    val colorAgent: Color = Color(0xFF06B6D4) // teal300 light base
    
    /**
     * Icon color on human avatar background
     * References: color.avatar.contrast.onHuman → white100
     * @see Requirements: 6.1 - Human type icon contrast color
     */
    val contrastOnHuman: Color = Color.White
    
    /**
     * Icon color on agent avatar background
     * References: color.avatar.contrast.onAgent → white100
     * @see Requirements: 6.2 - Agent type icon contrast color
     */
    val contrastOnAgent: Color = Color.White
    
    /**
     * Border color for avatars (xs through xl sizes)
     * References: color.avatar.border → gray100
     * @see Requirements: 7.2 - Border color for xs-xl sizes
     */
    val borderColor: Color = Color(0xFF999999) // gray100 approximation
    
    /**
     * Border color for xxl size avatars
     * References: color.contrast.onSurface
     * @see Requirements: 7.4 - Border color for xxl size
     */
    val borderColorXxl: Color = Color.White
    
    // MARK: - Avatar Border Tokens
    
    /**
     * Default border width (1dp)
     * References: borderDefault → borderWidth100
     * @see Requirements: 7.1 - Border width for xs-xl sizes
     */
    val borderWidthDefault: Dp = 1.dp
    
    /**
     * Emphasis border width (2dp)
     * References: borderEmphasis → borderWidth200
     * @see Requirements: 7.3 - Border width for xxl size
     */
    val borderWidthEmphasis: Dp = 2.dp
    
    // MARK: - Avatar Opacity Tokens
    
    /**
     * Heavy opacity for border (48%)
     * References: opacity.heavy → opacity600 (0.48)
     * @see Requirements: 7.2 - Border opacity for xs-xl sizes
     */
    const val opacityHeavy: Float = 0.48f
}

// MARK: - Avatar Type Enum

/**
 * Avatar entity type determines shape.
 * 
 * - Human: Circle shape (organic, natural) - for representing human users
 * - Agent: Hexagon shape (synthetic, constructed) - for representing AI agents
 * 
 * @see Requirements: 1.1, 1.2 - Shape-based entity differentiation
 */
enum class AvatarType {
    Human,
    Agent
}

// MARK: - Avatar Size Enum

/**
 * Avatar size variants derived from spacing token system.
 * 
 * Size values are defined by component tokens:
 * - Xs: 24dp (avatar.size.xs, references space300)
 * - Sm: 32dp (avatar.size.sm, references space400)
 * - Md: 40dp (avatar.size.md, references space500) - default
 * - Lg: 48dp (avatar.size.lg, references space600)
 * - Xl: 80dp (avatar.size.xl, calculated: SPACING_BASE_VALUE * 10)
 * - Xxl: 128dp (avatar.size.xxl, calculated: SPACING_BASE_VALUE * 16)
 * 
 * @see Requirements: 2.1-2.6 - Size variants
 */
enum class AvatarSize(
    /**
     * Avatar dimension in dp (height)
     * Width is calculated based on shape (circle = height, hexagon = height × 0.866)
     */
    val dimension: Dp,
    /**
     * Icon dimension in dp (50% of avatar height)
     * Uses DesignTokens icon size tokens where available, AvatarTokens for gap fillers (xs, xxl)
     * @see Requirements: 3.1-3.6 - Icon sizing at 50% ratio
     */
    val iconDimension: Dp,
    /**
     * Icon token reference for documentation and cross-platform consistency
     * @see Requirements: 3.1-3.6 - Icon size token references
     */
    val iconTokenReference: String
) {
    Xs(
        dimension = 24.dp,
        iconDimension = AvatarTokens.iconSizeXs,  // 12dp - component token gap filler
        iconTokenReference = "avatar.icon.size.xs"
    ),
    Sm(
        dimension = 32.dp,
        iconDimension = 16.dp,  // references icon.size050
        iconTokenReference = "icon.size050"
    ),
    Md(
        dimension = 40.dp,
        iconDimension = 20.dp,  // references icon.size075
        iconTokenReference = "icon.size075"
    ),
    Lg(
        dimension = 48.dp,
        iconDimension = 24.dp,  // references icon.size100
        iconTokenReference = "icon.size100"
    ),
    Xl(
        dimension = 80.dp,
        iconDimension = 40.dp,  // references icon.size500
        iconTokenReference = "icon.size500"
    ),
    Xxl(
        dimension = 128.dp,
        iconDimension = AvatarTokens.iconSizeXxl,  // 64dp - component token gap filler
        iconTokenReference = "avatar.icon.size.xxl"
    );
    
    /**
     * Border width for this size
     * Uses semantic border tokens:
     * - xs through xl: borderDefault → borderWidth100 (1dp)
     * - xxl: borderEmphasis → borderWidth200 (2dp)
     * @see Requirements: 7.1, 7.3 - Border width per size
     */
    val borderWidth: Dp
        get() = when (this) {
            Xxl -> AvatarTokens.borderWidthEmphasis  // 2dp
            else -> AvatarTokens.borderWidthDefault  // 1dp
        }
}

// MARK: - Avatar Default Values

/**
 * Default values for Avatar props matching web component.
 * 
 * @see Requirements: 1.5, 2.7, 8.4, 9.3 - Default values
 */
object AvatarDefaults {
    /**
     * Default entity type
     * @see Requirements: 1.5 - Default to "human" type when prop omitted
     */
    val type: AvatarType = AvatarType.Human
    
    /**
     * Default size variant
     * @see Requirements: 2.7 - Default to "md" size when prop omitted
     */
    val size: AvatarSize = AvatarSize.Md
    
    /**
     * Default interactive state
     * @see Requirements: 8.4 - Default interactive to false when prop omitted
     */
    const val interactive: Boolean = false
    
    /**
     * Default decorative state
     * @see Requirements: 9.3 - Default decorative to false when prop omitted
     */
    const val decorative: Boolean = false
}

// MARK: - Avatar Composable

/**
 * Avatar Jetpack Compose Composable
 * 
 * A visual representation component for users (Human) and AI agents (Agent)
 * with distinct shape-based differentiation.
 * 
 * Usage:
 * ```kotlin
 * // Basic human avatar
 * Avatar(type = AvatarType.Human, size = AvatarSize.Md)
 * 
 * // Agent avatar
 * Avatar(type = AvatarType.Agent, size = AvatarSize.Lg)
 * 
 * // Human avatar with image
 * Avatar(
 *     type = AvatarType.Human,
 *     size = AvatarSize.Xl,
 *     src = "https://example.com/photo.jpg",
 *     alt = "User profile"
 * )
 * 
 * // Interactive avatar (shows hover visual feedback)
 * Avatar(type = AvatarType.Human, size = AvatarSize.Md, interactive = true)
 * 
 * // Decorative avatar (hidden from TalkBack)
 * Avatar(type = AvatarType.Human, size = AvatarSize.Sm, decorative = true)
 * ```
 * 
 * @param type Entity type determines shape: Human = circle, Agent = hexagon. Defaults to Human
 * @param size Size variant. Defaults to Md
 * @param src Image source URL (human only). Defaults to null
 * @param alt Alt text for accessibility. Defaults to null
 * @param interactive Whether to show hover visual feedback. Defaults to false
 * @param decorative Hide from screen readers. Defaults to false
 * @param testID Test ID for automated testing. Defaults to null
 * @param modifier Modifier for the avatar container
 * 
 * @see Requirements: 1.5, 2.7, 8.4, 9.3, 14.3 in .kiro/specs/042-avatar-component/requirements.md
 */
@Composable
fun Avatar(
    type: AvatarType = AvatarDefaults.type,
    size: AvatarSize = AvatarDefaults.size,
    src: String? = null,
    alt: String? = null,
    interactive: Boolean = AvatarDefaults.interactive,
    decorative: Boolean = AvatarDefaults.decorative,
    testID: String? = null,
    modifier: Modifier = Modifier
) {
    // Track hover state for interactive avatars
    val interactionSource = remember { MutableInteractionSource() }
    val isHovered by interactionSource.collectIsHoveredAsState()
    
    // Track image load failure for fallback to icon
    var imageLoadFailed by remember { mutableStateOf(false) }
    
    // Determine shape based on type
    val shape = when (type) {
        AvatarType.Human -> CircleShape
        AvatarType.Agent -> HexagonShape()
    }
    
    // Calculate avatar width based on type
    // Human (circle): width = height
    // Agent (hexagon): width = height × cos(30°) ≈ height × 0.866
    val avatarWidth = when (type) {
        AvatarType.Human -> size.dimension
        AvatarType.Agent -> size.dimension * HexagonShape.ASPECT_RATIO.toFloat()
    }.let { it.value.dp }
    
    // Determine background color based on type
    val backgroundColor = when (type) {
        AvatarType.Human -> AvatarTokens.colorHuman
        AvatarType.Agent -> AvatarTokens.colorAgent
    }
    
    // Determine icon color based on type
    val iconColor = when (type) {
        AvatarType.Human -> AvatarTokens.contrastOnHuman
        AvatarType.Agent -> AvatarTokens.contrastOnAgent
    }
    
    // Determine border color based on size
    val borderColor = when (size) {
        AvatarSize.Xxl -> AvatarTokens.borderColorXxl
        else -> AvatarTokens.borderColor.copy(alpha = AvatarTokens.opacityHeavy)
    }
    
    // Determine current border width (changes on hover for interactive avatars)
    val currentBorderWidth = if (interactive && isHovered) {
        AvatarTokens.borderWidthEmphasis  // 2dp on hover
    } else {
        size.borderWidth
    }
    
    // Determine if image should be shown
    // Image is shown when: type is Human, src is provided, and image hasn't failed to load
    val shouldShowImage = type == AvatarType.Human && src != null && !imageLoadFailed
    
    // Accessibility label
    val accessibilityLabel = alt?.takeIf { it.isNotEmpty() } ?: when (type) {
        AvatarType.Human -> "User avatar"
        AvatarType.Agent -> "AI agent avatar"
    }
    
    // Build modifier chain
    val avatarModifier = modifier
        .size(width = avatarWidth, height = size.dimension)
        .clip(shape)
        .background(if (shouldShowImage) Color.Transparent else backgroundColor)
        .border(width = currentBorderWidth, color = borderColor, shape = shape)
        .then(
            if (interactive) {
                Modifier.hoverable(interactionSource = interactionSource)
            } else {
                Modifier
            }
        )
        .then(
            if (testID != null) {
                Modifier.testTag(testID)
            } else {
                Modifier
            }
        )
        .semantics {
            if (decorative) {
                invisibleToUser()
            } else {
                contentDescription = accessibilityLabel
            }
        }
    
    // Render avatar container
    Box(
        modifier = avatarModifier,
        contentAlignment = Alignment.Center
    ) {
        // Render content based on type and src availability
        // @see Requirements: 5.1, 5.5, 5.6 - Image support for human type only
        if (shouldShowImage && src != null) {
            // Human type with valid image URL - render image with fallback
            AvatarImageContent(
                src = src,
                alt = alt,
                type = type,
                size = size,
                iconColor = iconColor,
                onImageLoadFailed = { imageLoadFailed = true }
            )
        } else {
            // Icon placeholder (human without image, agent, or image failed)
            // @see Requirements: 3.1-3.8, 6.1, 6.2, 15.4 - Icon integration
            AvatarIconContent(
                type = type,
                size = size,
                iconColor = iconColor
            )
        }
    }
}

// MARK: - Avatar Icon Content

/**
 * Icon content for avatar placeholder.
 * 
 * Integrates with IconBase component for consistent icon rendering across the design system.
 * Uses token-based sizing for cross-platform consistency.
 * 
 * - Human: "user" icon (person silhouette)
 * - Agent: "sparkles" icon (AI/bot placeholder)
 * 
 * @param type Avatar entity type determines which icon to render
 * @param size Avatar size determines icon size via token mapping
 * @param iconColor Color to apply to the icon
 * 
 * @see Requirements: 3.1-3.8 - Icon sizing at 50% ratio
 * @see Requirements: 6.1, 6.2 - Icon contrast colors
 * @see Requirements: 15.4 - Use Icon Compose component
 * @see src/components/core/Icon-Base/platforms/android/IconBase.android.kt
 */
@Composable
private fun AvatarIconContent(
    type: AvatarType,
    size: AvatarSize,
    iconColor: Color
) {
    // Determine icon name based on avatar type
    // Human: "user" (person silhouette from Feather icons)
    // Agent: "sparkles" (AI/bot placeholder)
    // @see Requirements: 3.7, 3.8 - Icon placeholders per type
    val iconName = when (type) {
        AvatarType.Human -> "user"
        AvatarType.Agent -> "sparkles"
    }
    
    // Render icon using IconBase component
    // Uses token-based sizing from AvatarSize enum
    // @see Requirements: 3.1-3.6 - Icon sizing at 50% ratio
    // @see Requirements: 6.1, 6.2 - Icon contrast colors
    IconBase(
        name = iconName,
        size = size.iconDimension,
        color = iconColor
    )
}

// MARK: - Avatar Image Content

/**
 * Image content for human avatars using Coil AsyncImage.
 * 
 * Uses SubcomposeAsyncImage for fine-grained control over loading states:
 * - Success: Display the loaded image with ContentScale.Crop
 * - Loading: Display icon placeholder while loading
 * - Error: Fall back to icon placeholder and trigger callback
 * 
 * Image is clipped to circle shape by the parent container's clip modifier.
 * 
 * @param src Image source URL
 * @param alt Alt text for accessibility (content description)
 * @param type Avatar entity type (used for fallback icon)
 * @param size Avatar size (used for fallback icon sizing)
 * @param iconColor Color for fallback icon
 * @param onImageLoadFailed Callback when image fails to load
 * 
 * @see Requirements: 5.1 - Display image when src provided for human type
 * @see Requirements: 5.2 - Use ContentScale.Crop for image scaling
 * @see Requirements: 5.3 - Clip image to circle shape (handled by parent)
 * @see Requirements: 5.6 - Fall back to icon on image error
 */
@Composable
private fun AvatarImageContent(
    src: String,
    alt: String?,
    type: AvatarType,
    size: AvatarSize,
    iconColor: Color,
    onImageLoadFailed: () -> Unit
) {
    SubcomposeAsyncImage(
        model = src,
        contentDescription = alt,
        modifier = Modifier.fillMaxSize(),
        contentScale = ContentScale.Crop
    ) {
        val state = painter.state
        
        when (state) {
            is AsyncImagePainter.State.Success -> {
                // Image loaded successfully - display it
                // @see Requirements: 5.1, 5.2 - Display image with crop scaling
                SubcomposeAsyncImageContent()
            }
            is AsyncImagePainter.State.Error -> {
                // Image failed to load - fall back to icon placeholder
                // @see Requirements: 5.6 - Fall back to icon placeholder
                AvatarIconContent(
                    type = type,
                    size = size,
                    iconColor = iconColor
                )
                // Trigger callback to update state (prevents retry loops)
                androidx.compose.runtime.LaunchedEffect(Unit) {
                    onImageLoadFailed()
                }
            }
            is AsyncImagePainter.State.Loading -> {
                // Loading state - show icon placeholder while loading
                AvatarIconContent(
                    type = type,
                    size = size,
                    iconColor = iconColor
                )
            }
            is AsyncImagePainter.State.Empty -> {
                // Empty state (no request yet) - show icon placeholder
                AvatarIconContent(
                    type = type,
                    size = size,
                    iconColor = iconColor
                )
            }
        }
    }
}


// MARK: - Preview
// 
// Comprehensive previews are available in AvatarPreview.kt
// @see src/components/core/Avatar/platforms/android/AvatarPreview.kt
