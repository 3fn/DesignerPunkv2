/**
 * Container-Card-Base Component - iOS SwiftUI Implementation
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Container-Card-Base
 * Type: Type Primitive (Card)
 * 
 * SwiftUI view implementation that composes ContainerBase internally and exposes
 * a curated subset of props appropriate for card use cases.
 * 
 * Key Features:
 * - Zero-config card rendering with opinionated defaults
 * - Curated prop subset (only card-appropriate values)
 * - Interactive behavior (hover, press, focus)
 * - Accessibility traits based on interactive and role props
 * 
 * Uses blend utilities for hover/press state colors instead of opacity workarounds.
 * This ensures cross-platform consistency with Web and Android implementations.
 * 
 * @see ../../../types.ts for ContainerCardBaseProps interface
 * @see ../../../tokens.ts for token reference mappings
 * @see .kiro/specs/043-container-card-base/design.md for complete design documentation
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @see Requirements 3.1-3.14, 4.1-4.7, 5.1-5.10, 6.1-6.5, 7.1-7.6
 */

import SwiftUI

// Note: Theme-aware blend utilities are provided via Color extensions in
// ThemeAwareBlendUtilities.ios.swift. The hoverBlend() and pressedBlend()
// semantic extensions use BlendTokenValues for consistent state styling.

// MARK: - Card-Specific Enums (Curated Subsets)

/**
 * Curated padding values for Container-Card-Base
 * 
 * Subset of Container-Base padding values appropriate for cards.
 * Excludes '050', '300', '400' as they're rarely appropriate for cards.
 * 
 * @see Requirements 3.1, 4.1
 */
enum CardPadding {
    case none
    case p100  // 8px - space.inset.100
    case p150  // 12px - space.inset.150 [DEFAULT]
    case p200  // 16px - space.inset.200
}

/**
 * Curated vertical padding values for Container-Card-Base
 * 
 * Includes '050' for fine-tuning vertical rhythm with typography.
 * 
 * @see Requirements 3.2, 3.4, 3.5
 */
enum CardVerticalPadding {
    case none
    case p050  // 4px - space.inset.050 (for typography fine-tuning)
    case p100  // 8px - space.inset.100
    case p150  // 12px - space.inset.150
    case p200  // 16px - space.inset.200
}

/**
 * Curated horizontal padding values for Container-Card-Base
 * 
 * Same as CardPadding (excludes '050' as it's rarely needed horizontally).
 * 
 * @see Requirements 3.3, 3.6, 3.7
 */
enum CardHorizontalPadding {
    case none
    case p100  // 8px - space.inset.100
    case p150  // 12px - space.inset.150
    case p200  // 16px - space.inset.200
}

/**
 * Curated background values for Container-Card-Base
 * 
 * Limited to surface colors appropriate for cards.
 * 
 * @see Requirements 3.8, 4.2
 */
enum CardBackground {
    case surfacePrimary    // color.surface.primary [DEFAULT]
    case surfaceSecondary  // color.surface.secondary
    case surfaceTertiary   // color.surface.tertiary
}

/**
 * Curated shadow values for Container-Card-Base
 * 
 * Limited to container shadow only.
 * 
 * @see Requirements 3.9, 4.3
 */
enum CardShadow {
    case none
    case container  // shadow.container [DEFAULT]
}

/**
 * Curated border values for Container-Card-Base
 * 
 * Limited to subtle border only.
 * 
 * @see Requirements 3.10, 4.4
 */
enum CardBorder {
    case none      // No border [DEFAULT]
    case `default` // 1px border using borderColor
}

/**
 * Curated border color values for Container-Card-Base
 * 
 * Limited to card-appropriate colors.
 * 
 * @see Requirements 3.11
 */
enum CardBorderColor {
    case borderDefault  // color.border.default [DEFAULT]
    case borderSubtle   // color.structure.border.subtle
}

/**
 * Curated border radius values for Container-Card-Base
 * 
 * Limited to rounded values only (no sharp corners for cards).
 * 
 * @see Requirements 3.12, 4.5
 */
enum CardBorderRadius {
    case normal  // 8px - radius-100 [DEFAULT]
    case loose   // 16px - radius-200
}

/**
 * ARIA role for interactive cards
 * 
 * Determines accessibility traits and keyboard activation behavior.
 * 
 * @see Requirements 6.1-6.5
 */
enum CardRole {
    case button  // Card acts as a button [DEFAULT]
    case link    // Card acts as a link
}

// MARK: - Container-Card-Base View

/**
 * Container-Card-Base SwiftUI View
 * 
 * A type primitive component that provides card-specific styling and behaviors.
 * Composes ContainerBase internally and exposes a curated subset of props.
 * 
 * Features:
 * - Zero-config card rendering with opinionated defaults
 * - Curated prop subset (only card-appropriate values)
 * - Interactive behavior (hover, press, focus)
 * - Accessibility traits based on interactive and role props
 * 
 * Opinionated Defaults:
 * - padding: .p150 (12px)
 * - background: .surfacePrimary
 * - shadow: .container
 * - border: .none
 * - borderRadius: .normal (8px)
 * - interactive: false
 * 
 * @example
 * ```swift
 * // Zero-config card (uses all defaults)
 * ContainerCardBase {
 *     Text("Card content")
 * }
 * 
 * // Interactive card
 * ContainerCardBase(
 *     interactive: true,
 *     accessibilityLabel: "View details",
 *     onPress: { print("Card pressed") }
 * ) {
 *     VStack {
 *         Text("Card Title")
 *         Text("Card description")
 *     }
 * }
 * 
 * // Custom styling
 * ContainerCardBase(
 *     padding: .p200,
 *     background: .surfaceSecondary,
 *     border: .default,
 *     borderColor: .borderSubtle
 * ) {
 *     Text("Styled card content")
 * }
 * ```
 * 
 * @see Requirements 3.1-3.14, 4.1-4.7, 5.1-5.10, 6.1-6.5, 7.1-7.6
 */
struct ContainerCardBase<Content: View>: View {
    // MARK: - Properties
    
    /// Uniform padding for the card (default: .p150)
    let padding: CardPadding
    
    /// Vertical (block-axis) padding - overrides uniform padding for vertical axis
    let paddingVertical: CardVerticalPadding?
    
    /// Horizontal (inline-axis) padding - overrides uniform padding for horizontal axis
    let paddingHorizontal: CardHorizontalPadding?
    
    /// Block-start padding (top) - highest priority, overrides paddingVertical
    let paddingBlockStart: CardVerticalPadding?
    
    /// Block-end padding (bottom) - highest priority, overrides paddingVertical
    let paddingBlockEnd: CardVerticalPadding?
    
    /// Inline-start padding (leading) - highest priority, overrides paddingHorizontal
    let paddingInlineStart: CardHorizontalPadding?
    
    /// Inline-end padding (trailing) - highest priority, overrides paddingHorizontal
    let paddingInlineEnd: CardHorizontalPadding?
    
    /// Background color for the card (default: .surfacePrimary)
    let background: CardBackground
    
    /// Shadow for the card (default: .container)
    let shadow: CardShadow
    
    /// Border for the card (default: .none)
    let border: CardBorder
    
    /// Border color for the card (default: .borderDefault)
    let borderColor: CardBorderColor
    
    /// Border radius for the card (default: .normal)
    let borderRadius: CardBorderRadius
    
    /// Accessibility label for the card
    let accessibilityLabel: String?
    
    /// Whether the card is interactive (default: false)
    let interactive: Bool
    
    /// Callback when card is pressed/clicked
    let onPress: (() -> Void)?
    
    /// ARIA role for interactive cards (default: .button)
    let role: CardRole
    
    /// Test identifier for automated testing
    let testID: String?
    
    /// Whether the card shows focus indicator for keyboard navigation
    let focusable: Bool
    
    /// Child content
    let content: Content
    
    // MARK: - State
    
    /// Tracks hover state for pointer interactions (macOS/iPadOS)
    @State private var isHovered: Bool = false
    
    /// Tracks pressed state for tap feedback
    @State private var isPressed: Bool = false
    
    /// Tracks focus state for keyboard navigation (WCAG 2.4.7)
    @FocusState private var isFocused: Bool
    
    // MARK: - Initialization
    
    /**
     * Initialize ContainerCardBase with styling props
     * 
     * All parameters have sensible defaults for zero-config card rendering.
     * 
     * @param padding Uniform padding (default: .p150)
     * @param paddingVertical Vertical axis padding (default: nil)
     * @param paddingHorizontal Horizontal axis padding (default: nil)
     * @param paddingBlockStart Block-start edge padding (default: nil)
     * @param paddingBlockEnd Block-end edge padding (default: nil)
     * @param paddingInlineStart Inline-start edge padding (default: nil)
     * @param paddingInlineEnd Inline-end edge padding (default: nil)
     * @param background Background color (default: .surfacePrimary)
     * @param shadow Shadow (default: .container)
     * @param border Border (default: .none)
     * @param borderColor Border color (default: .borderDefault)
     * @param borderRadius Border radius (default: .normal)
     * @param accessibilityLabel Accessibility label (default: nil)
     * @param interactive Whether card is interactive (default: false)
     * @param onPress Press callback (default: nil)
     * @param role ARIA role for interactive cards (default: .button)
     * @param testID Test identifier (default: nil)
     * @param focusable Whether card shows focus indicator (default: false)
     * @param content Child content builder
     */
    init(
        padding: CardPadding = .p150,
        paddingVertical: CardVerticalPadding? = nil,
        paddingHorizontal: CardHorizontalPadding? = nil,
        paddingBlockStart: CardVerticalPadding? = nil,
        paddingBlockEnd: CardVerticalPadding? = nil,
        paddingInlineStart: CardHorizontalPadding? = nil,
        paddingInlineEnd: CardHorizontalPadding? = nil,
        background: CardBackground = .surfacePrimary,
        shadow: CardShadow = .container,
        border: CardBorder = .none,
        borderColor: CardBorderColor = .borderDefault,
        borderRadius: CardBorderRadius = .normal,
        accessibilityLabel: String? = nil,
        interactive: Bool = false,
        onPress: (() -> Void)? = nil,
        role: CardRole = .button,
        testID: String? = nil,
        focusable: Bool = false,
        @ViewBuilder content: () -> Content
    ) {
        self.padding = padding
        self.paddingVertical = paddingVertical
        self.paddingHorizontal = paddingHorizontal
        self.paddingBlockStart = paddingBlockStart
        self.paddingBlockEnd = paddingBlockEnd
        self.paddingInlineStart = paddingInlineStart
        self.paddingInlineEnd = paddingInlineEnd
        self.background = background
        self.shadow = shadow
        self.border = border
        self.borderColor = borderColor
        self.borderRadius = borderRadius
        self.accessibilityLabel = accessibilityLabel
        self.interactive = interactive
        self.onPress = onPress
        self.role = role
        self.testID = testID
        self.focusable = focusable
        self.content = content()
    }
    
    // MARK: - Body
    
    var body: some View {
        content
            .padding(paddingValue)
            .background(currentBackgroundColor)
            .cornerRadius(cornerRadiusValue)
            .overlay(borderOverlay)
            .overlay(focusIndicatorOverlay)
            .shadow(color: shadowColor, radius: shadowRadius, x: shadowX, y: shadowY)
            .focused($isFocused)
            .if(interactive) { view in
                view
                    // Hover state for pointer devices (macOS/iPadOS)
                    .onHover { hovering in
                        withAnimation(motionFocusTransition) {
                            isHovered = hovering
                        }
                    }
                    // Press/tap gesture
                    .simultaneousGesture(
                        DragGesture(minimumDistance: 0)
                            .onChanged { _ in
                                if !isPressed {
                                    isPressed = true
                                }
                            }
                            .onEnded { _ in
                                isPressed = false
                                onPress?()
                            }
                    )
            }
            .if(accessibilityLabel != nil) { view in
                view.accessibilityLabel(accessibilityLabel!)
            }
            .if(interactive) { view in
                view.accessibilityAddTraits(accessibilityTraits)
            }
            .if(testID != nil) { view in
                view.accessibilityIdentifier(testID!)
            }
    }
    
    // MARK: - Computed Properties
    
    /**
     * Padding value from token with override hierarchy
     * 
     * Calculates EdgeInsets using the override hierarchy:
     * 1. Individual edges (paddingBlockStart, etc.) - highest priority
     * 2. Axis props (paddingVertical, paddingHorizontal) - medium priority
     * 3. Uniform padding (padding prop) - lowest priority
     * 
     * @see Requirements 3.1-3.7
     */
    private var paddingValue: EdgeInsets {
        return calculateCardPadding(
            uniform: padding,
            vertical: paddingVertical,
            horizontal: paddingHorizontal,
            blockStart: paddingBlockStart,
            blockEnd: paddingBlockEnd,
            inlineStart: paddingInlineStart,
            inlineEnd: paddingInlineEnd
        )
    }
    
    /**
     * Background color from token
     * 
     * Resolves background prop to SwiftUI Color using semantic color tokens.
     * 
     * @see Requirements 3.8, 4.2
     */
    private var backgroundValue: Color {
        return mapCardBackgroundToColor(background)
    }
    
    /**
     * Current background color considering hover and press states
     * 
     * Returns darkened color when interactive and hovered/pressed,
     * otherwise returns the base background color.
     * 
     * Uses hoverBlend() (8% darker) and pressedBlend() (12% darker)
     * semantic extensions from ThemeAwareBlendUtilities.ios.swift
     * 
     * @see Requirements 5.1-5.10
     */
    private var currentBackgroundColor: Color {
        if interactive && isPressed {
            return backgroundValue.pressedBlend()
        } else if interactive && isHovered {
            return backgroundValue.hoverBlend()
        }
        return backgroundValue
    }
    
    /**
     * Corner radius value from token
     * 
     * Maps borderRadius prop to CGFloat using radius tokens.
     * 
     * @see Requirements 3.12, 4.5
     */
    private var cornerRadiusValue: CGFloat {
        return mapCardBorderRadiusToCornerRadius(borderRadius)
    }
    
    /**
     * Border overlay view
     * 
     * Creates border overlay using border width and border color.
     * Returns empty view for .none border.
     * 
     * @see Requirements 3.10, 3.11, 4.4
     */
    @ViewBuilder
    private var borderOverlay: some View {
        if border != .none {
            RoundedRectangle(cornerRadius: cornerRadiusValue)
                .stroke(mapCardBorderColorToColor(borderColor), lineWidth: mapCardBorderToLineWidth(border))
        }
    }
    
    /**
     * Focus indicator overlay view
     * 
     * Creates focus indicator overlay using accessibility tokens for WCAG 2.4.7 compliance.
     * Uses accessibilityFocusColor, accessibilityFocusWidth, and accessibilityFocusOffset tokens.
     * Only visible when focusable is true and card has focus.
     * 
     * @see src/tokens/semantic/AccessibilityTokens.ts
     * @see WCAG 2.4.7 Focus Visible (Level AA)
     * @see WCAG 1.4.11 Non-text Contrast (Level AA) - 3:1 minimum for focus indicators
     * @see Requirements 6.7 - Container-Card-Base focus outline uses accessibility token
     */
    @ViewBuilder
    private var focusIndicatorOverlay: some View {
        if focusable {
            RoundedRectangle(cornerRadius: cornerRadiusValue)
                .stroke(cardAccessibilityFocusColor, lineWidth: cardAccessibilityFocusWidth)
                .padding(-cardAccessibilityFocusOffset)
                .opacity(isFocused ? 1 : 0)
                .animation(motionFocusTransition, value: isFocused)
        }
    }
    
    /**
     * Shadow properties from token
     * 
     * Resolves shadow prop to shadow properties (color, radius, x, y).
     * Returns zero shadow for .none.
     * 
     * @see Requirements 3.9, 4.3
     */
    private var shadowProperties: CardShadowProperties {
        return mapCardShadowToProperties(shadow)
    }
    
    /// Shadow color from token
    private var shadowColor: Color {
        return shadowProperties.color
    }
    
    /// Shadow radius from token
    private var shadowRadius: CGFloat {
        return shadowProperties.radius
    }
    
    /// Shadow X offset from token
    private var shadowX: CGFloat {
        return shadowProperties.x
    }
    
    /// Shadow Y offset from token
    private var shadowY: CGFloat {
        return shadowProperties.y
    }
    
    /**
     * Accessibility traits based on role
     * 
     * Returns appropriate accessibility traits for interactive cards.
     * 
     * @see Requirements 6.1-6.5
     */
    private var accessibilityTraits: AccessibilityTraits {
        switch role {
        case .button:
            return .isButton
        case .link:
            return .isLink
        }
    }
}

// MARK: - Supporting Types

/**
 * Shadow properties structure for Container-Card-Base
 */
struct CardShadowProperties {
    let color: Color
    let radius: CGFloat
    let x: CGFloat
    let y: CGFloat
}

// MARK: - Token Mapping Functions

/**
 * Map CardPadding to CGFloat
 * 
 * @param padding Card padding value
 * @returns CGFloat padding value in points
 */
func mapCardPaddingToCGFloat(_ padding: CardPadding) -> CGFloat {
    switch padding {
    case .none: return 0
    case .p100: return spaceInset100 /* space.inset.100 */
    case .p150: return spaceInset150 /* space.inset.150 */
    case .p200: return spaceInset200 /* space.inset.200 */
    }
}

/**
 * Map CardVerticalPadding to CGFloat
 * 
 * @param padding Card vertical padding value
 * @returns CGFloat padding value in points
 */
func mapCardVerticalPaddingToCGFloat(_ padding: CardVerticalPadding) -> CGFloat {
    switch padding {
    case .none: return 0
    case .p050: return spaceInset050 /* space.inset.050 */
    case .p100: return spaceInset100 /* space.inset.100 */
    case .p150: return spaceInset150 /* space.inset.150 */
    case .p200: return spaceInset200 /* space.inset.200 */
    }
}

/**
 * Map CardHorizontalPadding to CGFloat
 * 
 * @param padding Card horizontal padding value
 * @returns CGFloat padding value in points
 */
func mapCardHorizontalPaddingToCGFloat(_ padding: CardHorizontalPadding) -> CGFloat {
    switch padding {
    case .none: return 0
    case .p100: return spaceInset100 /* space.inset.100 */
    case .p150: return spaceInset150 /* space.inset.150 */
    case .p200: return spaceInset200 /* space.inset.200 */
    }
}

/**
 * Calculate directional padding with override hierarchy
 * 
 * Implements the padding override hierarchy:
 * 1. Individual edges (paddingBlockStart, etc.) - highest priority
 * 2. Axis props (paddingVertical, paddingHorizontal) - medium priority
 * 3. Uniform padding (padding prop) - lowest priority
 * 
 * @param uniform Base uniform padding (lowest priority)
 * @param vertical Vertical axis padding (overrides uniform for top/bottom)
 * @param horizontal Horizontal axis padding (overrides uniform for leading/trailing)
 * @param blockStart Top edge padding (highest priority)
 * @param blockEnd Bottom edge padding (highest priority)
 * @param inlineStart Leading edge padding (highest priority)
 * @param inlineEnd Trailing edge padding (highest priority)
 * @returns EdgeInsets with calculated padding values
 * 
 * @see Requirements 3.1-3.7
 */
func calculateCardPadding(
    uniform: CardPadding,
    vertical: CardVerticalPadding?,
    horizontal: CardHorizontalPadding?,
    blockStart: CardVerticalPadding?,
    blockEnd: CardVerticalPadding?,
    inlineStart: CardHorizontalPadding?,
    inlineEnd: CardHorizontalPadding?
) -> EdgeInsets {
    // Start with uniform padding as base
    let uniformValue = mapCardPaddingToCGFloat(uniform)
    
    // Calculate top (block-start) with override hierarchy
    var top = uniformValue
    if let vertical = vertical {
        top = mapCardVerticalPaddingToCGFloat(vertical)
    }
    if let blockStart = blockStart {
        top = mapCardVerticalPaddingToCGFloat(blockStart)
    }
    
    // Calculate bottom (block-end) with override hierarchy
    var bottom = uniformValue
    if let vertical = vertical {
        bottom = mapCardVerticalPaddingToCGFloat(vertical)
    }
    if let blockEnd = blockEnd {
        bottom = mapCardVerticalPaddingToCGFloat(blockEnd)
    }
    
    // Calculate leading (inline-start) with override hierarchy
    var leading = uniformValue
    if let horizontal = horizontal {
        leading = mapCardHorizontalPaddingToCGFloat(horizontal)
    }
    if let inlineStart = inlineStart {
        leading = mapCardHorizontalPaddingToCGFloat(inlineStart)
    }
    
    // Calculate trailing (inline-end) with override hierarchy
    var trailing = uniformValue
    if let horizontal = horizontal {
        trailing = mapCardHorizontalPaddingToCGFloat(horizontal)
    }
    if let inlineEnd = inlineEnd {
        trailing = mapCardHorizontalPaddingToCGFloat(inlineEnd)
    }
    
    return EdgeInsets(top: top, leading: leading, bottom: bottom, trailing: trailing)
}

/**
 * Map CardBackground to Color
 * 
 * @param background Card background value
 * @returns SwiftUI Color for the background
 * 
 * @see Requirements 3.8, 4.2
 */
func mapCardBackgroundToColor(_ background: CardBackground) -> Color {
    switch background {
    case .surfacePrimary:
        return colorSurfacePrimary /* color.surface.primary */
    case .surfaceSecondary:
        return colorSurfaceSecondary /* color.surface.secondary */
    case .surfaceTertiary:
        return colorSurfaceTertiary /* color.surface.tertiary */
    }
}

/**
 * Map CardBorderRadius to CGFloat
 * 
 * @param borderRadius Card border radius value
 * @returns CGFloat corner radius value in points
 * 
 * @see Requirements 3.12, 4.5
 */
func mapCardBorderRadiusToCornerRadius(_ borderRadius: CardBorderRadius) -> CGFloat {
    switch borderRadius {
    case .normal: return radius100 /* radius-100 */
    case .loose: return radius200 /* radius-200 */
    }
}

/**
 * Map CardBorder to line width
 * 
 * @param border Card border value
 * @returns CGFloat line width in points
 * 
 * @see Requirements 3.10, 4.4
 */
func mapCardBorderToLineWidth(_ border: CardBorder) -> CGFloat {
    switch border {
    case .none: return 0
    case .default: return borderDefault /* border.border.default */
    }
}

/**
 * Map CardBorderColor to Color
 * 
 * @param borderColor Card border color value
 * @returns SwiftUI Color for the border
 * 
 * @see Requirements 3.11
 */
func mapCardBorderColorToColor(_ borderColor: CardBorderColor) -> Color {
    switch borderColor {
    case .borderDefault:
        return colorBorder /* color.border.default */
    case .borderSubtle:
        return colorBorderSubtle /* color.structure.border.subtle */
    }
}

/**
 * Map CardShadow to shadow properties
 * 
 * @param shadow Card shadow value
 * @returns CardShadowProperties with shadow values
 * 
 * @see Requirements 3.9, 4.3
 */
func mapCardShadowToProperties(_ shadow: CardShadow) -> CardShadowProperties {
    switch shadow {
    case .none:
        return CardShadowProperties(color: Color.clear, radius: 0, x: 0, y: 0)
    case .container:
        return CardShadowProperties(
            color: shadowContainerColor,
            radius: shadowContainerRadius,
            x: shadowContainerX,
            y: shadowContainerY
        )
    }
}

// MARK: - View Extension

/**
 * Conditional view modifier extension
 * 
 * Allows conditional application of view modifiers.
 * Used for optional modifiers like interactive behavior and accessibility.
 */
extension View {
    @ViewBuilder
    func `if`<Transform: View>(_ condition: Bool, transform: (Self) -> Transform) -> some View {
        if condition {
            transform(self)
        } else {
            self
        }
    }
}

// MARK: - Token Constants
// These would be imported from the design token system in a real implementation

// Space tokens (space.inset.*)
let spaceInset050: CGFloat = 4   /* space.inset.050 */
let spaceInset100: CGFloat = 8   /* space.inset.100 */
let spaceInset150: CGFloat = 12  /* space.inset.150 */
let spaceInset200: CGFloat = 16  /* space.inset.200 */

// Radius tokens
let radius100: CGFloat = 8   /* radius-100 */
let radius200: CGFloat = 16  /* radius-200 */

// Border tokens
let borderDefault: CGFloat = 1  /* border.border.default */

// Color tokens
let colorSurfacePrimary: Color = Color(DesignTokens.colorStructureSurfacePrimary)      /* color.structure.surface.primary */
let colorSurfaceSecondary: Color = Color(DesignTokens.colorStructureSurfaceSecondary)  /* color.structure.surface.secondary */
let colorSurfaceTertiary: Color = Color(DesignTokens.colorStructureSurfaceTertiary)    /* color.structure.surface.tertiary */
let colorBorder: Color = Color(UIColor.separator)                     /* color.border.default */
let colorBorderSubtle: Color = Color(UIColor.separator).opacity(0.5)  /* color.structure.border.subtle */

// Shadow tokens (shadow.container)
let shadowContainerColor: Color = Color.black.opacity(0.1)
let shadowContainerRadius: CGFloat = 8
let shadowContainerX: CGFloat = 0
let shadowContainerY: CGFloat = 2

// Motion tokens
// Note: Duration value 0.15 corresponds to motion.focusTransition token (150ms)
let motionFocusTransitionDuration: Double = 0.15 /* motion.focusTransition */
let motionFocusTransition: Animation = .easeOut(duration: motionFocusTransitionDuration)

// MARK: - Accessibility Focus Tokens
// WCAG 2.4.7 Focus Visible (Level AA) - Focus indicator must be visible
// WCAG 1.4.11 Non-text Contrast (Level AA) - 3:1 minimum for focus indicators
// @see src/tokens/semantic/AccessibilityTokens.ts

/// Focus indicator outline offset from component bounds (2px)
/// References: accessibility.focus.offset → space025 primitive token
let cardAccessibilityFocusOffset: CGFloat = 2 /* space025 */

/// Focus indicator outline width (2px)
/// References: accessibility.focus.width → borderWidth200 primitive token
let cardAccessibilityFocusWidth: CGFloat = 2 /* borderWidth200 */

/// Focus indicator outline color (purple300 - primary brand color)
/// References: accessibility.focus.color → purple300 primitive token
/// Ensures 3:1 contrast ratio per WCAG 1.4.11
let cardAccessibilityFocusColor: Color = Color(red: 0.69, green: 0.15, blue: 1.00) /* purple300 */

// MARK: - Preview

/**
 * SwiftUI preview for ContainerCardBase component.
 * 
 * Shows cards with different configurations to demonstrate
 * component variants and interaction patterns.
 */
struct ContainerCardBase_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Zero-config card
                Text("Zero-Config Card")
                    .font(.headline)
                
                ContainerCardBase {
                    Text("Default card with all opinionated defaults")
                }
                
                Divider()
                
                // Interactive card
                Text("Interactive Card")
                    .font(.headline)
                
                ContainerCardBase(
                    interactive: true,
                    accessibilityLabel: "Tap to view details",
                    onPress: { print("Card pressed") }
                ) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Interactive Card")
                            .font(.headline)
                        Text("Tap or hover to see state changes")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
                
                Divider()
                
                // Custom styling
                Text("Custom Styling")
                    .font(.headline)
                
                ContainerCardBase(
                    padding: .p200,
                    background: .surfaceSecondary,
                    border: .default,
                    borderColor: .borderSubtle,
                    borderRadius: .loose
                ) {
                    Text("Custom styled card with border and loose radius")
                }
                
                Divider()
                
                // Directional padding
                Text("Directional Padding")
                    .font(.headline)
                
                ContainerCardBase(
                    paddingVertical: .p050,
                    paddingHorizontal: .p200
                ) {
                    Text("Card with asymmetric padding")
                }
                
                Divider()
                
                // Link role
                Text("Link Role")
                    .font(.headline)
                
                ContainerCardBase(
                    interactive: true,
                    role: .link,
                    onPress: { print("Link card pressed") }
                ) {
                    HStack {
                        Text("Navigate to details")
                        Spacer()
                        Image(systemName: "chevron.right")
                            .foregroundColor(.secondary)
                    }
                }
                
                Divider()
                
                // Focusable card (WCAG 2.4.7)
                Text("Focusable Card")
                    .font(.headline)
                
                ContainerCardBase(
                    interactive: true,
                    focusable: true,
                    onPress: { print("Focusable card pressed") }
                ) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Keyboard Accessible Card")
                            .font(.headline)
                        Text("Shows focus indicator when focused via keyboard")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
            }
            .padding()
        }
    }
}
