/**
 * Button-Icon Component for iOS Platform
 * 
 * Stemma System: Buttons Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type] = Button-Icon
 * 
 * Circular icon-only interactive button with three size variants, three visual styles,
 * and comprehensive interaction states. Follows True Native Architecture with
 * build-time platform separation.
 * 
 * Uses IconBase component for icon rendering, following the same component
 * composition pattern as web and Android platforms. This ensures cross-platform
 * consistency and single source of truth for icon rendering.
 * 
 * Design Decisions:
 * - No `disabled` prop by design (see Requirement 11.1)
 * - Required `ariaLabel` for accessibility (see Requirement 4.1)
 * - Self-contained focus ring buffer (see Requirement 6.3)
 * - Circular shape via Circle() clip shape (see Requirement 3.3)
 * - Platform-specific press feedback: scale transform (see Requirement 8.4)
 * 
 * @module Button-Icon/platforms/ios
 * @see Requirements: 1.5, 2.4, 4.1, 11.1, 14.3
 */

import SwiftUI

// MARK: - Enums

/**
 * Button-Icon size variants.
 * 
 * Determines icon size and padding tokens used:
 * - `small`: icon.size050 (16pt icon) + buttonIcon.inset.small (8pt padding)
 * - `medium`: icon.size075 (20pt icon) + buttonIcon.inset.medium (10pt padding)
 * - `large`: icon.size100 (24pt icon) + buttonIcon.inset.large (12pt padding)
 * 
 * All sizes include a 4pt transparent focus buffer on all sides
 * (accessibility.focus.offset + accessibility.focus.width).
 * 
 * @see Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 */
enum ButtonIconSize {
    case small
    case medium
    case large
    
    /// Icon size token value for this size variant
    /// - small: iconSize050 (16pt)
    /// - medium: iconSize075 (20pt)
    /// - large: iconSize100 (24pt)
    /// @see Requirements 1.1, 1.2, 1.3
    var iconSize: CGFloat {
        switch self {
        case .small:
            return DesignTokens.iconSize050  // 16pt
        case .medium:
            return DesignTokens.iconSize075  // 20pt
        case .large:
            return DesignTokens.iconSize100  // 24pt
        }
    }
    
    /// Inset (padding) token value for this size variant
    /// - small: buttonIcon.inset.small (8pt, references space.inset.100)
    /// - medium: buttonIcon.inset.medium (10pt, unique value)
    /// - large: buttonIcon.inset.large (12pt, references space.inset.150)
    /// @see Requirements 10.1, 10.2, 10.3
    var inset: CGFloat {
        switch self {
        case .small:
            return 8   // buttonIcon.inset.small (references space.inset.100)
        case .medium:
            return 10  // buttonIcon.inset.medium (unique value, no semantic equivalent)
        case .large:
            return 12  // buttonIcon.inset.large (references space.inset.150)
        }
    }
    
    /// Total button size (icon + padding × 2)
    var buttonSize: CGFloat {
        return iconSize + (inset * 2)
    }
}

/**
 * Button-Icon visual style variants.
 * 
 * Determines background, border, and icon color styling:
 * - `primary`: Solid color.primary background, color.contrast.onPrimary icon
 * - `secondary`: Transparent background, borderDefault border with color.primary, color.primary icon
 * - `tertiary`: Transparent background, no border, color.primary icon
 * 
 * @see Requirements 2.1, 2.2, 2.3, 2.4
 */
enum ButtonIconVariant {
    case primary
    case secondary
    case tertiary
}

// MARK: - ButtonIcon View

/**
 * ButtonIcon SwiftUI View
 * 
 * A circular, icon-only button with token-based styling and platform-specific
 * interaction patterns (scale transform on press).
 * 
 * @remarks
 * - Uses IconBase component for icon rendering
 * - Circular shape via `.clipShape(Circle())`
 * - Token-based styling via Swift constants
 * - Self-contained focus ring buffer (4pt on all sides)
 * - WCAG 2.1 AA compliant:
 *   - Required ariaLabel for VoiceOver support
 *   - Minimum 48pt touch targets for all sizes
 * 
 * @example
 * ```swift
 * // Basic usage
 * ButtonIcon(icon: "settings", ariaLabel: "Open settings") {
 *     print("Settings tapped")
 * }
 * 
 * // With all parameters
 * ButtonIcon(
 *     icon: "settings",
 *     ariaLabel: "Open settings",
 *     size: .large,
 *     variant: .primary,
 *     testID: "settings-button"
 * ) {
 *     print("Settings tapped")
 * }
 * ```
 * 
 * @see Requirements 1.5, 2.4, 4.1, 11.1, 14.3
 */
struct ButtonIcon: View {
    // MARK: - Required Properties
    
    /// Icon name (references Asset Catalog image set)
    let icon: String
    
    /// Accessible label for VoiceOver (required)
    /// Applied via `.accessibilityLabel()` modifier
    /// @see Requirements 4.1, 4.3
    let ariaLabel: String
    
    /// Click/tap handler
    let onPress: () -> Void
    
    // MARK: - Optional Properties with Defaults
    
    /// Visual size variant
    /// @default .medium
    /// @see Requirements 1.5
    var size: ButtonIconSize = .medium
    
    /// Visual style variant
    /// @default .primary
    /// @see Requirements 2.4
    var variant: ButtonIconVariant = .primary
    
    /// Optional test identifier for UI testing
    /// Applied via `.accessibilityIdentifier()` modifier
    var testID: String? = nil
    
    // MARK: - State
    
    /// Tracks pressed state for scale animation
    @State private var isPressed: Bool = false
    
    // MARK: - Computed Properties
    
    /// Focus ring buffer size (accessibility.focus.offset + accessibility.focus.width)
    /// @see Requirements 1.4, 6.3
    private var focusBuffer: CGFloat {
        return 4  // accessibility.focus.buffer (2pt offset + 2pt width)
    }
    
    /// Background color based on variant
    /// - primary: color.primary (solid fill)
    /// - secondary/tertiary: transparent
    /// @see Requirements 2.1, 2.2, 2.3
    private var backgroundColor: Color {
        switch variant {
        case .primary:
            return Color(DesignTokens.colorPrimary)
        case .secondary, .tertiary:
            return Color.clear
        }
    }
    
    /// Icon color based on variant
    /// - primary: color.contrast.onPrimary (white on primary background)
    /// - secondary/tertiary: color.primary
    /// @see Requirements 2.1, 2.2, 2.3
    private var iconColor: Color {
        switch variant {
        case .primary:
            return Color(DesignTokens.colorContrastOnPrimary)
        case .secondary, .tertiary:
            return Color(DesignTokens.colorPrimary)
        }
    }
    
    /// Border width for secondary variant
    /// - secondary: borderDefault (1pt)
    /// - primary/tertiary: no border
    /// @see Requirements 2.2
    private var borderWidth: CGFloat {
        switch variant {
        case .secondary:
            return DesignTokens.borderWidth100  // borderDefault (1pt)
        case .primary, .tertiary:
            return 0
        }
    }
    
    /// Border color for secondary variant
    /// - secondary: color.primary
    /// - primary/tertiary: transparent
    /// @see Requirements 2.2
    private var borderColor: Color {
        switch variant {
        case .secondary:
            return Color(DesignTokens.colorPrimary)
        case .primary, .tertiary:
            return Color.clear
        }
    }
    
    /// Minimum touch target size (tapAreaRecommended = 48pt)
    /// Ensures WCAG 2.5.5 and 2.5.8 compliance for all sizes
    /// @see Requirements 5.1, 5.2, 5.3, 5.4, 5.5
    private var minTouchTarget: CGFloat {
        return DesignTokens.tapAreaRecommended  // 48pt
    }
    
    // MARK: - Body
    
    var body: some View {
        Button(action: onPress) {
            // Icon container with padding
            IconBase(
                name: icon,
                size: size.iconSize,
                color: iconColor
            )
            .padding(size.inset)
        }
        .buttonStyle(PlainButtonStyle())
        .background(backgroundColor)
        .clipShape(Circle())
        .overlay(
            Circle()
                .stroke(borderColor, lineWidth: borderWidth)
        )
        // Platform-specific press feedback: scale transform (0.97)
        // Uses motionButtonPress semantic token (duration150 + easingAccelerate)
        // @see Requirement 8.4, 12.1, 12.2
        .scaleEffect(isPressed ? 0.97 : 1.0)
        .animation(motionButtonPress, value: isPressed)
        // Focus buffer margin on all sides
        .padding(focusBuffer)
        // Extend touch target to tapAreaRecommended (48pt) for all sizes
        // @see Requirements 5.1, 5.2, 5.3, 5.4
        .frame(minWidth: minTouchTarget, minHeight: minTouchTarget)
        // Accessibility
        .accessibilityLabel(ariaLabel)
        .accessibilityAddTraits(.isButton)
        .accessibilityIdentifier(testID ?? "")
        // Track pressed state for scale animation
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in isPressed = true }
                .onEnded { _ in isPressed = false }
        )
    }
}

// MARK: - Preview

/**
 * SwiftUI preview for ButtonIcon component.
 * 
 * Shows buttons at different sizes and variants to demonstrate
 * size variants, visual styles, and interaction states.
 */
struct ButtonIcon_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 32) {
                // Size variants
                Text("Size Variants")
                    .font(.headline)
                
                HStack(spacing: 16) {
                    VStack {
                        ButtonIcon(
                            icon: "settings",
                            ariaLabel: "Settings",
                            onPress: {},
                            size: .small
                        )
                        Text("Small")
                            .font(.caption)
                    }
                    
                    VStack {
                        ButtonIcon(
                            icon: "settings",
                            ariaLabel: "Settings",
                            onPress: {},
                            size: .medium
                        )
                        Text("Medium")
                            .font(.caption)
                    }
                    
                    VStack {
                        ButtonIcon(
                            icon: "settings",
                            ariaLabel: "Settings",
                            onPress: {},
                            size: .large
                        )
                        Text("Large")
                            .font(.caption)
                    }
                }
                
                Divider()
                
                // Primary variant
                Text("Primary Variant")
                    .font(.headline)
                
                HStack(spacing: 16) {
                    ButtonIcon(
                        icon: "plus",
                        ariaLabel: "Add",
                        onPress: {},
                        size: .small,
                        variant: .primary
                    )
                    
                    ButtonIcon(
                        icon: "plus",
                        ariaLabel: "Add",
                        onPress: {},
                        size: .medium,
                        variant: .primary
                    )
                    
                    ButtonIcon(
                        icon: "plus",
                        ariaLabel: "Add",
                        onPress: {},
                        size: .large,
                        variant: .primary
                    )
                }
                
                Divider()
                
                // Secondary variant
                Text("Secondary Variant")
                    .font(.headline)
                
                HStack(spacing: 16) {
                    ButtonIcon(
                        icon: "heart",
                        ariaLabel: "Favorite",
                        onPress: {},
                        size: .small,
                        variant: .secondary
                    )
                    
                    ButtonIcon(
                        icon: "heart",
                        ariaLabel: "Favorite",
                        onPress: {},
                        size: .medium,
                        variant: .secondary
                    )
                    
                    ButtonIcon(
                        icon: "heart",
                        ariaLabel: "Favorite",
                        onPress: {},
                        size: .large,
                        variant: .secondary
                    )
                }
                
                Divider()
                
                // Tertiary variant
                Text("Tertiary Variant")
                    .font(.headline)
                
                HStack(spacing: 16) {
                    ButtonIcon(
                        icon: "x",
                        ariaLabel: "Close",
                        onPress: {},
                        size: .small,
                        variant: .tertiary
                    )
                    
                    ButtonIcon(
                        icon: "x",
                        ariaLabel: "Close",
                        onPress: {},
                        size: .medium,
                        variant: .tertiary
                    )
                    
                    ButtonIcon(
                        icon: "x",
                        ariaLabel: "Close",
                        onPress: {},
                        size: .large,
                        variant: .tertiary
                    )
                }
                
                Divider()
                
                // testID support
                Text("testID Support")
                    .font(.headline)
                
                HStack(spacing: 16) {
                    ButtonIcon(
                        icon: "arrow-right",
                        ariaLabel: "Next",
                        onPress: {},
                        testID: "next-button"
                    )
                    
                    ButtonIcon(
                        icon: "check",
                        ariaLabel: "Confirm",
                        onPress: {},
                        testID: "confirm-button"
                    )
                }
                
                Divider()
                
                // Icon variety
                Text("Icon Variety")
                    .font(.headline)
                
                HStack(spacing: 16) {
                    ButtonIcon(icon: "arrow-left", ariaLabel: "Back", onPress: {})
                    ButtonIcon(icon: "arrow-up", ariaLabel: "Up", onPress: {})
                    ButtonIcon(icon: "arrow-down", ariaLabel: "Down", onPress: {})
                    ButtonIcon(icon: "chevron-right", ariaLabel: "Forward", onPress: {})
                }
                
                HStack(spacing: 16) {
                    ButtonIcon(icon: "plus", ariaLabel: "Add", onPress: {})
                    ButtonIcon(icon: "minus", ariaLabel: "Remove", onPress: {})
                    ButtonIcon(icon: "user", ariaLabel: "Profile", onPress: {})
                    ButtonIcon(icon: "mail", ariaLabel: "Email", onPress: {})
                }
            }
            .padding()
        }
    }
}
