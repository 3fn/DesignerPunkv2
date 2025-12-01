/**
 * Container Component - iOS SwiftUI Implementation
 * 
 * SwiftUI view implementation of the Container component using modifier chains.
 * Provides structural wrapping with individual styling capabilities.
 * 
 * @see ../../../types.ts for ContainerProps interface
 * @see ../../../tokens.ts for token reference mappings
 * @see .kiro/specs/010-container-component/design.md for complete design documentation
 */

import SwiftUI

/**
 * Container SwiftUI View
 * 
 * A foundational primitive component that provides structural wrapping with styling capabilities.
 * Uses SwiftUI modifier chains to apply styling based on props.
 * 
 * Features:
 * - Padding control via space.inset tokens
 * - Background color via semantic color tokens
 * - Shadow via semantic shadow tokens
 * - Border via border width tokens
 * - Border radius via radius tokens
 * - Opacity via semantic opacity tokens
 * - Layering via z-index tokens
 * - Safe area control (iOS-specific)
 * - Accessibility label support
 * 
 * @example
 * ```swift
 * // Basic usage
 * Container(padding: .p200, background: "color.surface") {
 *     Text("Content")
 * }
 * 
 * // With multiple styling props
 * Container(
 *     padding: .p300,
 *     background: "color.primary",
 *     shadow: "shadow.container",
 *     borderRadius: .normal,
 *     layering: .navigation
 * ) {
 *     Text("Content")
 * }
 * 
 * // With safe area control
 * Container(
 *     padding: .p200,
 *     background: "color.surface",
 *     ignoresSafeArea: true
 * ) {
 *     Text("Full screen content")
 * }
 * ```
 */
struct Container<Content: View>: View {
    // MARK: - Properties
    
    /// Internal padding for the container
    let padding: PaddingValue
    
    /// Background color token name
    let background: String?
    
    /// Shadow token name
    let shadow: String?
    
    /// Border width value
    let border: BorderValue
    
    /// Border radius value
    let borderRadius: BorderRadiusValue
    
    /// Opacity token name
    let opacity: String?
    
    /// Layering value for z-index
    let layering: LayeringValue?
    
    /// Whether to ignore safe area insets (iOS-specific)
    let ignoresSafeArea: Bool
    
    /// Accessibility label
    let accessibilityLabel: String?
    
    /// Child content
    let content: Content
    
    // MARK: - Initialization
    
    /**
     * Initialize Container with styling props
     * 
     * @param padding Internal padding (default: .none)
     * @param background Background color token name (default: nil)
     * @param shadow Shadow token name (default: nil)
     * @param border Border width (default: .none)
     * @param borderRadius Border radius (default: .none)
     * @param opacity Opacity token name (default: nil)
     * @param layering Layering value for z-index (default: nil)
     * @param ignoresSafeArea Whether to ignore safe area (default: false)
     * @param accessibilityLabel Accessibility label (default: nil)
     * @param content Child content builder
     */
    init(
        padding: PaddingValue = .none,
        background: String? = nil,
        shadow: String? = nil,
        border: BorderValue = .none,
        borderRadius: BorderRadiusValue = .none,
        opacity: String? = nil,
        layering: LayeringValue? = nil,
        ignoresSafeArea: Bool = false,
        accessibilityLabel: String? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.padding = padding
        self.background = background
        self.shadow = shadow
        self.border = border
        self.borderRadius = borderRadius
        self.opacity = opacity
        self.layering = layering
        self.ignoresSafeArea = ignoresSafeArea
        self.accessibilityLabel = accessibilityLabel
        self.content = content()
    }
    
    // MARK: - Body
    
    var body: some View {
        content
            .padding(paddingValue)
            .background(backgroundValue)
            .cornerRadius(cornerRadiusValue)
            .overlay(borderOverlay)
            .shadow(color: shadowColor, radius: shadowRadius, x: shadowX, y: shadowY)
            .opacity(opacityValue)
            .zIndex(zIndexValue)
            .if(ignoresSafeArea) { view in
                view.ignoresSafeArea(.all)
            }
            .if(accessibilityLabel != nil) { view in
                view.accessibilityLabel(accessibilityLabel!)
            }
    }
    
    // MARK: - Computed Properties
    
    /**
     * Padding value from token
     * 
     * Maps padding prop to EdgeInsets using space.inset tokens.
     * Returns EdgeInsets.zero for .none.
     */
    private var paddingValue: EdgeInsets {
        return mapPaddingToEdgeInsets(padding)
    }
    
    /**
     * Background color from token
     * 
     * Resolves background token name to SwiftUI Color.
     * Returns Color.clear for nil.
     */
    private var backgroundValue: Color {
        return resolveColorToken(background)
    }
    
    /**
     * Corner radius value from token
     * 
     * Maps borderRadius prop to CGFloat using radius tokens.
     * Returns 0 for .none.
     */
    private var cornerRadiusValue: CGFloat {
        return mapBorderRadiusToCornerRadius(borderRadius)
    }
    
    /**
     * Border overlay view
     * 
     * Creates border overlay using border width and color.border token.
     * Returns nil for .none border.
     */
    private var borderOverlay: some View {
        Group {
            if border != .none {
                RoundedRectangle(cornerRadius: cornerRadiusValue)
                    .stroke(getBorderColor(), lineWidth: mapBorderToLineWidth(border))
            }
        }
    }
    
    /**
     * Shadow properties from token
     * 
     * Resolves shadow token to shadow properties (color, radius, x, y).
     * Returns zero shadow for nil.
     */
    private var shadowProperties: ShadowProperties {
        return resolveShadowToken(shadow)
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
        return resolveOpacityToken(opacity)
    }
    
    /**
     * Z-index value from token
     * 
     * Resolves layering prop to z-index value using zIndex tokens.
     * Returns 0 for nil layering.
     */
    private var zIndexValue: Double {
        return mapLayeringToZIndex(layering)
    }
}

// MARK: - Supporting Types

/**
 * Padding value enumeration
 * 
 * Maps to PaddingValue type from types.ts.
 * Provides type-safe padding options.
 */
enum PaddingValue {
    case none
    case p050  // 4px
    case p100  // 8px
    case p150  // 12px
    case p200  // 16px
    case p300  // 24px
    case p400  // 32px
}

/**
 * Border value enumeration
 * 
 * Maps to BorderValue type from types.ts.
 * Provides type-safe border width options.
 */
enum BorderValue {
    case none
    case `default`  // 1px
    case emphasis   // 2px
    case heavy      // 4px
}

/**
 * Border radius value enumeration
 * 
 * Maps to BorderRadiusValue type from types.ts.
 * Provides type-safe border radius options.
 */
enum BorderRadiusValue {
    case none
    case tight   // 4px
    case normal  // 8px
    case loose   // 16px
}

/**
 * Layering value enumeration
 * 
 * Maps to LayeringValue type from types.ts.
 * Provides type-safe layering options.
 */
enum LayeringValue {
    case container
    case navigation
    case dropdown
    case modal
    case toast
    case tooltip
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

// MARK: - Token Mapping
// Token resolution functions are now in TokenMapping.swift

