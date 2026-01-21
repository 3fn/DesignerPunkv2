/**
 * Container-Base Component - iOS SwiftUI Implementation
 * 
 * Stemma System naming: [Family]-[Type] = Container-Base
 * Type: Primitive (foundational component)
 * 
 * SwiftUI view implementation of the Container-Base component using modifier chains.
 * Provides structural wrapping with individual styling capabilities.
 * 
 * Uses blend utilities for hover state colors instead of opacity workarounds.
 * This ensures cross-platform consistency with Web and Android implementations.
 * 
 * @see ../../../types.ts for ContainerBaseProps interface
 * @see ../../../tokens.ts for token reference mappings
 * @see .kiro/specs/010-container-component/design.md for complete design documentation
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @see .kiro/specs/031-blend-infrastructure-implementation for blend utilities
 */

import SwiftUI

// Note: Theme-aware blend utilities are provided via Color extensions in
// ThemeAwareBlendUtilities.ios.swift. The hoverBlend() semantic extension
// uses BlendTokenValues.hoverDarker (8%) for consistent state styling.

/**
 * Container-Base SwiftUI View
 * 
 * A foundational primitive component that provides structural wrapping with styling capabilities.
 * Uses SwiftUI modifier chains to apply styling based on props.
 * 
 * Features:
 * - Padding control via space.inset tokens (uniform, axis, and individual edges)
 * - Directional padding with override hierarchy (individual > axis > uniform)
 * - Background color via semantic color tokens
 * - Shadow via semantic shadow tokens
 * - Border via border width tokens with configurable border color
 * - Border radius via radius tokens
 * - Opacity via semantic opacity tokens
 * - Layering via z-index tokens
 * - Safe area control (iOS-specific)
 * - Accessibility label support
 * - Hover state support via blend utilities (macOS/iPadOS with pointer)
 * 
 * Directional Padding:
 * - paddingVertical/paddingHorizontal: Axis-level padding
 * - paddingBlockStart/paddingBlockEnd: Individual vertical edges
 * - paddingInlineStart/paddingInlineEnd: Individual horizontal edges
 * - Override hierarchy: individual edges > axis props > uniform padding
 * 
 * @example
 * ```swift
 * // Basic usage
 * ContainerBase(padding: .p200, background: "color.surface") {
 *     Text("Content")
 * }
 * 
 * // With directional padding
 * ContainerBase(
 *     padding: .p200,
 *     paddingVertical: .p100,
 *     paddingBlockStart: .p050
 * ) {
 *     Text("Content with asymmetric padding")
 * }
 * 
 * // With multiple styling props
 * ContainerBase(
 *     padding: .p300,
 *     background: "color.primary",
 *     shadow: "shadow.container",
 *     borderRadius: .normal,
 *     layering: .navigation
 * ) {
 *     Text("Content")
 * }
 * 
 * // With border color
 * ContainerBase(
 *     padding: .p200,
 *     border: .default,
 *     borderColor: "color.border.subtle"
 * ) {
 *     Text("Content with subtle border")
 * }
 * 
 * // With hover state enabled
 * ContainerBase(
 *     padding: .p200,
 *     background: "color.surface",
 *     hoverable: true
 * ) {
 *     Text("Hoverable content")
 * }
 * 
 * // With safe area control
 * ContainerBase(
 *     padding: .p200,
 *     background: "color.surface",
 *     ignoresSafeArea: true
 * ) {
 *     Text("Full screen content")
 * }
 * ```
 * 
 * @see Requirements 1.1-1.10 - Directional padding
 * @see Requirements 2.1-2.3 - Border color
 */
struct ContainerBase<Content: View>: View {
    // MARK: - Properties
    
    /// Internal padding for the container (uniform, lowest priority)
    let padding: ContainerBasePaddingValue
    
    /// Vertical (block-axis) padding - overrides uniform padding for vertical axis
    let paddingVertical: ContainerBasePaddingValue?
    
    /// Horizontal (inline-axis) padding - overrides uniform padding for horizontal axis
    let paddingHorizontal: ContainerBasePaddingValue?
    
    /// Block-start padding (top) - highest priority, overrides paddingVertical
    let paddingBlockStart: ContainerBasePaddingValue?
    
    /// Block-end padding (bottom) - highest priority, overrides paddingVertical
    let paddingBlockEnd: ContainerBasePaddingValue?
    
    /// Inline-start padding (leading/left in LTR) - highest priority, overrides paddingHorizontal
    let paddingInlineStart: ContainerBasePaddingValue?
    
    /// Inline-end padding (trailing/right in LTR) - highest priority, overrides paddingHorizontal
    let paddingInlineEnd: ContainerBasePaddingValue?
    
    /// Background color token name
    let background: String?
    
    /// Shadow token name
    let shadow: String?
    
    /// Border width value
    let border: ContainerBaseBorderValue
    
    /// Border color token name (defaults to color.border.default when nil)
    let borderColor: String?
    
    /// Border radius value
    let borderRadius: ContainerBaseBorderRadiusValue
    
    /// Opacity token name
    let opacity: String?
    
    /// Layering value for z-index
    let layering: ContainerBaseLayeringValue?
    
    /// Whether to ignore safe area insets (iOS-specific)
    let ignoresSafeArea: Bool
    
    /// Accessibility label
    let accessibilityLabel: String?
    
    /// Whether hover state is enabled
    let hoverable: Bool
    
    /// Child content
    let content: Content
    
    // MARK: - State
    
    /// Tracks hover state for pointer interactions (macOS/iPadOS)
    @State private var isHovered: Bool = false
    
    // MARK: - Initialization
    
    /**
     * Initialize ContainerBase with styling props
     * 
     * @param padding Internal padding (default: .none)
     * @param paddingVertical Vertical axis padding (default: nil)
     * @param paddingHorizontal Horizontal axis padding (default: nil)
     * @param paddingBlockStart Block-start edge padding (default: nil)
     * @param paddingBlockEnd Block-end edge padding (default: nil)
     * @param paddingInlineStart Inline-start edge padding (default: nil)
     * @param paddingInlineEnd Inline-end edge padding (default: nil)
     * @param background Background color token name (default: nil)
     * @param shadow Shadow token name (default: nil)
     * @param border Border width (default: .none)
     * @param borderColor Border color token name (default: nil, uses color.border.default)
     * @param borderRadius Border radius (default: .none)
     * @param opacity Opacity token name (default: nil)
     * @param layering Layering value for z-index (default: nil)
     * @param ignoresSafeArea Whether to ignore safe area (default: false)
     * @param accessibilityLabel Accessibility label (default: nil)
     * @param hoverable Whether hover state is enabled (default: false)
     * @param content Child content builder
     */
    init(
        padding: ContainerBasePaddingValue = .none,
        paddingVertical: ContainerBasePaddingValue? = nil,
        paddingHorizontal: ContainerBasePaddingValue? = nil,
        paddingBlockStart: ContainerBasePaddingValue? = nil,
        paddingBlockEnd: ContainerBasePaddingValue? = nil,
        paddingInlineStart: ContainerBasePaddingValue? = nil,
        paddingInlineEnd: ContainerBasePaddingValue? = nil,
        background: String? = nil,
        shadow: String? = nil,
        border: ContainerBaseBorderValue = .none,
        borderColor: String? = nil,
        borderRadius: ContainerBaseBorderRadiusValue = .none,
        opacity: String? = nil,
        layering: ContainerBaseLayeringValue? = nil,
        ignoresSafeArea: Bool = false,
        accessibilityLabel: String? = nil,
        hoverable: Bool = false,
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
        self.opacity = opacity
        self.layering = layering
        self.ignoresSafeArea = ignoresSafeArea
        self.accessibilityLabel = accessibilityLabel
        self.hoverable = hoverable
        self.content = content()
    }
    
    // MARK: - Body
    
    var body: some View {
        content
            .padding(paddingValue)
            .background(currentBackgroundColor)
            .cornerRadius(cornerRadiusValue)
            .overlay(borderOverlay)
            .shadow(color: shadowColor, radius: shadowRadius, x: shadowX, y: shadowY)
            .opacity(opacityValue)
            .zIndex(zIndexValue)
            .if(hoverable) { view in
                view.onHover { hovering in
                    withAnimation(motionFocusTransition) {
                        isHovered = hovering
                    }
                }
            }
            .if(ignoresSafeArea) { view in
                view.ignoresSafeArea(.all)
            }
            .if(accessibilityLabel != nil) { view in
                view.accessibilityLabel(accessibilityLabel!)
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
     * Maps logical properties to physical edges:
     * - blockStart -> top
     * - blockEnd -> bottom
     * - inlineStart -> leading (left in LTR, right in RTL)
     * - inlineEnd -> trailing (right in LTR, left in RTL)
     * 
     * @see Requirements 1.7, 1.8 - Override hierarchy
     */
    private var paddingValue: EdgeInsets {
        return calculateDirectionalPadding(
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
     * Resolves background token name to SwiftUI Color.
     * Returns Color.clear for nil.
     */
    private var backgroundValue: Color {
        return resolveContainerBaseColorToken(background)
    }
    
    /**
     * Current background color considering hover state
     * 
     * Returns darkened color when hoverable and hovered,
     * otherwise returns the base background color.
     * 
     * Uses hoverBlend() semantic extension from ThemeAwareBlendUtilities.ios.swift
     * which applies darkerBlend(color.surface, blend.hoverDarker) - 8% darker
     * 
     * @see Requirements: 9.1 - Container hover state
     * @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
     */
    private var currentBackgroundColor: Color {
        if hoverable && isHovered {
            return backgroundValue.hoverBlend()
        }
        return backgroundValue
    }
    
    /**
     * Corner radius value from token
     * 
     * Maps borderRadius prop to CGFloat using radius tokens.
     * Returns 0 for .none.
     */
    private var cornerRadiusValue: CGFloat {
        return mapContainerBaseBorderRadiusToCornerRadius(borderRadius)
    }
    
    /**
     * Border overlay view
     * 
     * Creates border overlay using border width and border color.
     * Uses borderColor prop if provided, otherwise defaults to color.border.default.
     * Returns nil for .none border.
     * 
     * @see Requirements 2.1, 2.2, 2.3 - Border color
     */
    private var borderOverlay: some View {
        Group {
            if border != .none {
                RoundedRectangle(cornerRadius: cornerRadiusValue)
                    .stroke(resolveContainerBaseBorderColor(borderColor), lineWidth: mapContainerBaseBorderToLineWidth(border))
            }
        }
    }
    
    /**
     * Shadow properties from token
     * 
     * Resolves shadow token to shadow properties (color, radius, x, y).
     * Returns zero shadow for nil.
     */
    private var shadowProperties: ContainerBaseShadowProperties {
        return resolveContainerBaseShadowToken(shadow)
    }
    
    /**
     * Shadow color from token
     */
    private var shadowColor: Color {
        return shadowProperties.color
    }
    
    /**
     * Shadow radius from token
     */
    private var shadowRadius: CGFloat {
        return shadowProperties.radius
    }
    
    /**
     * Shadow X offset from token
     */
    private var shadowX: CGFloat {
        return shadowProperties.x
    }
    
    /**
     * Shadow Y offset from token
     */
    private var shadowY: CGFloat {
        return shadowProperties.y
    }
    
    /**
     * Opacity value from token
     * 
     * Resolves opacity token name to Double.
     * Returns 1.0 (fully opaque) for nil.
     */
    private var opacityValue: Double {
        return resolveContainerBaseOpacityToken(opacity)
    }
    
    /**
     * Z-index value from token
     * 
     * Resolves layering prop to z-index value using zIndex tokens.
     * Returns 0 for nil layering.
     */
    private var zIndexValue: Double {
        return mapContainerBaseLayeringToZIndex(layering)
    }
}

// MARK: - Supporting Types

/**
 * Padding value enumeration for Container-Base
 * 
 * Maps to PaddingValue type from types.ts.
 * Provides type-safe padding options.
 */
enum ContainerBasePaddingValue {
    case none
    case p050  // 4px
    case p100  // 8px
    case p150  // 12px
    case p200  // 16px
    case p300  // 24px
    case p400  // 32px
}

/**
 * Border value enumeration for Container-Base
 * 
 * Maps to BorderValue type from types.ts.
 * Provides type-safe border width options.
 */
enum ContainerBaseBorderValue {
    case none
    case `default`  // 1px
    case emphasis   // 2px
    case heavy      // 4px
}

/**
 * Border radius value enumeration for Container-Base
 * 
 * Maps to BorderRadiusValue type from types.ts.
 * Provides type-safe border radius options.
 */
enum ContainerBaseBorderRadiusValue {
    case none
    case tight   // 4px
    case normal  // 8px
    case loose   // 16px
}

/**
 * Layering value enumeration for Container-Base
 * 
 * Maps to LayeringValue type from types.ts.
 * Provides type-safe layering options.
 */
enum ContainerBaseLayeringValue {
    case container
    case navigation
    case dropdown
    case modal
    case toast
    case tooltip
}

/**
 * Shadow properties structure for Container-Base
 */
struct ContainerBaseShadowProperties {
    let color: Color
    let radius: CGFloat
    let x: CGFloat
    let y: CGFloat
}

// MARK: - View Extension

/**
 * Conditional view modifier extension
 * 
 * Allows conditional application of view modifiers.
 * Used for optional modifiers like ignoresSafeArea and accessibilityLabel.
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

// MARK: - Token Mapping Functions
// These functions would be implemented in TokenMapping.swift

func mapContainerBasePaddingToEdgeInsets(_ padding: ContainerBasePaddingValue) -> EdgeInsets {
    // Implementation maps to actual token values from DesignerPunk token system
    // Token references: space.inset.050 through space.inset.400
    switch padding {
    case .none: return EdgeInsets()
    case .p050: return EdgeInsets(top: spaceInset050, leading: spaceInset050, bottom: spaceInset050, trailing: spaceInset050) /* space.inset.050 */
    case .p100: return EdgeInsets(top: spaceInset100, leading: spaceInset100, bottom: spaceInset100, trailing: spaceInset100) /* space.inset.100 */
    case .p150: return EdgeInsets(top: spaceInset150, leading: spaceInset150, bottom: spaceInset150, trailing: spaceInset150) /* space.inset.150 */
    case .p200: return EdgeInsets(top: spaceInset200, leading: spaceInset200, bottom: spaceInset200, trailing: spaceInset200) /* space.inset.200 */
    case .p300: return EdgeInsets(top: spaceInset300, leading: spaceInset300, bottom: spaceInset300, trailing: spaceInset300) /* space.inset.300 */
    case .p400: return EdgeInsets(top: spaceInset400, leading: spaceInset400, bottom: spaceInset400, trailing: spaceInset400) /* space.inset.400 */
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
 * Maps logical properties to physical edges:
 * - blockStart -> top
 * - blockEnd -> bottom
 * - inlineStart -> leading (respects layout direction)
 * - inlineEnd -> trailing (respects layout direction)
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
 * @see Requirements 1.1-1.10 - Directional padding
 */
func calculateDirectionalPadding(
    uniform: ContainerBasePaddingValue,
    vertical: ContainerBasePaddingValue?,
    horizontal: ContainerBasePaddingValue?,
    blockStart: ContainerBasePaddingValue?,
    blockEnd: ContainerBasePaddingValue?,
    inlineStart: ContainerBasePaddingValue?,
    inlineEnd: ContainerBasePaddingValue?
) -> EdgeInsets {
    // Start with uniform padding as base
    let uniformInsets = mapContainerBasePaddingToEdgeInsets(uniform)
    
    // Calculate top (block-start) with override hierarchy
    var top = uniformInsets.top
    if let vertical = vertical, vertical != .none {
        top = mapContainerBasePaddingValueToCGFloat(vertical)
    }
    if let blockStart = blockStart {
        top = mapContainerBasePaddingValueToCGFloat(blockStart)
    }
    
    // Calculate bottom (block-end) with override hierarchy
    var bottom = uniformInsets.bottom
    if let vertical = vertical, vertical != .none {
        bottom = mapContainerBasePaddingValueToCGFloat(vertical)
    }
    if let blockEnd = blockEnd {
        bottom = mapContainerBasePaddingValueToCGFloat(blockEnd)
    }
    
    // Calculate leading (inline-start) with override hierarchy
    var leading = uniformInsets.leading
    if let horizontal = horizontal, horizontal != .none {
        leading = mapContainerBasePaddingValueToCGFloat(horizontal)
    }
    if let inlineStart = inlineStart {
        leading = mapContainerBasePaddingValueToCGFloat(inlineStart)
    }
    
    // Calculate trailing (inline-end) with override hierarchy
    var trailing = uniformInsets.trailing
    if let horizontal = horizontal, horizontal != .none {
        trailing = mapContainerBasePaddingValueToCGFloat(horizontal)
    }
    if let inlineEnd = inlineEnd {
        trailing = mapContainerBasePaddingValueToCGFloat(inlineEnd)
    }
    
    return EdgeInsets(top: top, leading: leading, bottom: bottom, trailing: trailing)
}

/**
 * Map padding value to CGFloat
 * 
 * Helper function to convert a single padding value to CGFloat.
 * Used by calculateDirectionalPadding for individual edge calculations.
 * 
 * @param padding Padding value to convert
 * @returns CGFloat padding value in points
 */
func mapContainerBasePaddingValueToCGFloat(_ padding: ContainerBasePaddingValue) -> CGFloat {
    switch padding {
    case .none: return 0
    case .p050: return spaceInset050 /* space.inset.050 */
    case .p100: return spaceInset100 /* space.inset.100 */
    case .p150: return spaceInset150 /* space.inset.150 */
    case .p200: return spaceInset200 /* space.inset.200 */
    case .p300: return spaceInset300 /* space.inset.300 */
    case .p400: return spaceInset400 /* space.inset.400 */
    }
}

func resolveContainerBaseColorToken(_ tokenName: String?) -> Color {
    // Implementation would resolve token to Color
    return tokenName != nil ? Color.gray : Color.clear
}

func mapContainerBaseBorderRadiusToCornerRadius(_ borderRadius: ContainerBaseBorderRadiusValue) -> CGFloat {
    // Token references: radius-050, radius-100, radius-200
    switch borderRadius {
    case .none: return 0
    case .tight: return radius050 /* radius-050 */
    case .normal: return radius100 /* radius-100 */
    case .loose: return radius200 /* radius-200 */
    }
}

func mapContainerBaseBorderToLineWidth(_ border: ContainerBaseBorderValue) -> CGFloat {
    // Token references: border.border.default, border.border.emphasis, border.border.heavy
    switch border {
    case .none: return 0
    case .default: return borderDefault /* border.border.default */
    case .emphasis: return borderEmphasis /* border.border.emphasis */
    case .heavy: return borderHeavy /* border.border.heavy */
    }
}

func getContainerBaseBorderColor() -> Color {
    // Implementation would return color.border token value
    return Color.gray
}

/**
 * Resolve border color from token name
 * 
 * Returns the color for the border based on the borderColor prop.
 * If borderColor is nil, defaults to color.border.default.
 * 
 * @param borderColor Optional border color token name
 * @returns SwiftUI Color for the border
 * 
 * @see Requirements 2.1, 2.2, 2.3 - Border color
 */
func resolveContainerBaseBorderColor(_ borderColor: String?) -> Color {
    guard let borderColor = borderColor, !borderColor.isEmpty else {
        // Default to color.border.default when not specified
        return colorBorder
    }
    
    // Resolve the border color token
    switch borderColor {
    case "color.border.default":
        return colorBorder
    case "color.border.subtle":
        return colorBorderSubtle
    case "color.border.emphasis":
        return colorBorderEmphasis
    default:
        // Fall back to default border color for unknown tokens
        return colorBorder
    }
}

func resolveContainerBaseShadowToken(_ tokenName: String?) -> ContainerBaseShadowProperties {
    // Implementation would resolve shadow token
    return ContainerBaseShadowProperties(color: Color.clear, radius: 0, x: 0, y: 0)
}

func resolveContainerBaseOpacityToken(_ tokenName: String?) -> Double {
    // Implementation would resolve opacity token
    return 1.0
}

func mapContainerBaseLayeringToZIndex(_ layering: ContainerBaseLayeringValue?) -> Double {
    // Token references: zIndex.container through zIndex.tooltip
    guard let layering = layering else { return 0 }
    switch layering {
    case .container: return zIndexContainer /* zIndex.container */
    case .navigation: return zIndexNavigation /* zIndex.navigation */
    case .dropdown: return zIndexDropdown /* zIndex.dropdown */
    case .modal: return zIndexModal /* zIndex.modal */
    case .toast: return zIndexToast /* zIndex.toast */
    case .tooltip: return zIndexTooltip /* zIndex.tooltip */
    }
}

// Note: Color blend extensions (darkerBlend, lighterBlend, saturate, desaturate)
// and semantic blend functions (hoverBlend, pressedBlend, focusBlend, etc.)
// are provided by ThemeAwareBlendUtilities.ios.swift

// Note: motionFocusTransition is imported from MotionTokens.swift
// Uses motionEasingStandard.speed(1.0 / motionDurationFast) for consistent animation timing
