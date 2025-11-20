/**
 * ButtonCTA Component for iOS Platform
 * 
 * Cross-platform call-to-action button with three size variants (small, medium, large),
 * three visual styles (primary, secondary, tertiary), and comprehensive interaction states.
 * 
 * Follows True Native Architecture with platform-specific SwiftUI implementation
 * while maintaining API consistency with web and Android platforms.
 * 
 * Part of the DesignerPunk CTA Button Component system.
 * 
 * @module ButtonCTA/platforms/ios
 */

import SwiftUI

/**
 * Button size variants
 * 
 * Defines three size options that follow the 8px baseline grid and meet
 * WCAG 2.1 AA touch target requirements (44px minimum).
 * 
 * - small: 40px visual height (extends to 44px touch target)
 * - medium: 48px visual height (meets 44px touch target)
 * - large: 56px visual height (exceeds 44px touch target)
 */
enum ButtonSize {
    case small
    case medium
    case large
}

/**
 * Button visual styles
 * 
 * Defines three visual styles that establish clear hierarchy through
 * visual weight progression.
 * 
 * - primary: Filled background with primary color (highest emphasis)
 * - secondary: Outlined with primary color border (medium emphasis)
 * - tertiary: Text-only with primary color (lowest emphasis)
 */
enum ButtonStyle {
    case primary
    case secondary
    case tertiary
}

/**
 * ButtonCTA component for iOS platform.
 * 
 * Renders a call-to-action button with SwiftUI Button component, supporting
 * three size variants, three visual styles, optional leading icons, and
 * platform-specific interaction patterns (scale transform on press).
 * 
 * Usage:
 * ```swift
 * // Basic usage
 * ButtonCTA(
 *     label: "Submit",
 *     onPress: { print("Submitted") }
 * )
 * 
 * // With size and style
 * ButtonCTA(
 *     label: "Get Started",
 *     size: .large,
 *     style: .primary,
 *     onPress: handleStart
 * )
 * 
 * // With icon
 * ButtonCTA(
 *     label: "Continue",
 *     size: .medium,
 *     style: .primary,
 *     icon: "arrow-right",
 *     onPress: handleContinue
 * )
 * ```
 * 
 * Requirements:
 * - 1.1-1.7: Size variants (small: 40px, medium: 48px, large: 56px)
 * - 2.1-2.4: Visual styles (primary, secondary, tertiary)
 * - 8.1-8.6: Icon support with leading position
 * - 13.1-13.4: Touch target accessibility (44px minimum)
 * - 17.2: Platform-specific scale transform on press
 */
struct ButtonCTA: View {
    // MARK: - Properties
    
    /// Button text label (required)
    let label: String
    
    /// Button size variant (default: medium)
    let size: ButtonSize
    
    /// Button visual style (default: primary)
    let style: ButtonStyle
    
    /// Optional leading icon from Icon System
    let icon: String?
    
    /// Prevent text wrapping (default: false)
    let noWrap: Bool
    
    /// Click/tap handler (required)
    let onPress: () -> Void
    
    /// Optional test ID for automated testing
    let testID: String?
    
    /// Optional disabled state (default: false)
    let disabled: Bool
    
    // MARK: - State
    
    /// Tracks pressed state for scale transform animation
    @State private var isPressed = false
    
    // MARK: - Initialization
    
    /**
     * Initialize ButtonCTA with all properties.
     * 
     * - Parameters:
     *   - label: Button text label (required)
     *   - size: Button size variant (default: .medium)
     *   - style: Button visual style (default: .primary)
     *   - icon: Optional leading icon name
     *   - noWrap: Prevent text wrapping (default: false)
     *   - onPress: Click/tap handler (required)
     *   - testID: Optional test identifier
     *   - disabled: Optional disabled state (default: false)
     */
    init(
        label: String,
        size: ButtonSize = .medium,
        style: ButtonStyle = .primary,
        icon: String? = nil,
        noWrap: Bool = false,
        onPress: @escaping () -> Void,
        testID: String? = nil,
        disabled: Bool = false
    ) {
        self.label = label
        self.size = size
        self.style = style
        self.icon = icon
        self.noWrap = noWrap
        self.onPress = onPress
        self.testID = testID
        self.disabled = disabled
    }
    
    // MARK: - Body
    
    var body: some View {
        Button(action: onPress) {
            HStack(spacing: iconTextSpacing) {
                // Optional leading icon
                // Requirements: 8.1-8.6, 9.1-9.3
                if let iconName = icon {
                    Icon(
                        name: iconName,
                        size: iconSize,
                        color: iconColor
                    )
                    .accessibilityHidden(true) // Mark icon as decorative (Requirement 16.3)
                }
                
                // Button label text
                // Requirement 16.4: Support Dynamic Type for text size preferences
                Text(label)
                    .font(typography)
                    .foregroundColor(textColor)
                    .lineLimit(noWrap ? 1 : nil)
                    .minimumScaleFactor(0.5) // Allow text to scale down if needed
                    .allowsTightening(true) // Allow character spacing to tighten
            }
            .padding(.horizontal, horizontalPadding)
            .padding(.vertical, verticalPadding)
            .frame(minWidth: minWidth, minHeight: touchTargetHeight)
            .background(backgroundColor)
            .cornerRadius(borderRadius)
            .overlay(
                // Requirement 17.5: Render border inside frame bounds
                RoundedRectangle(cornerRadius: borderRadius)
                    .strokeBorder(borderColor, lineWidth: borderWidth)
            )
        }
        .buttonStyle(PlainButtonStyle())
        // Requirement 17.2: Scale transform to 0.97 (97%) on press with 100ms ease-out animation
        .scaleEffect(isPressed ? 0.97 : 1.0)
        .animation(.easeOut(duration: 0.1), value: isPressed)
        // Track pressed state for scale transform
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    if !disabled {
                        isPressed = true
                    }
                }
                .onEnded { _ in
                    isPressed = false
                }
        )
        .disabled(disabled)
        // Requirement 13.1-13.4, 16.4: Accessibility identifier for testing
        .accessibilityIdentifier(testID ?? "")
        // Requirement 17.4: Respect safe area insets for full-width buttons
        .edgesIgnoringSafeArea([]) // Respects safe area by default
    }
    
    // MARK: - Size-Based Computed Properties
    
    /// Typography token based on button size
    /// Requirements: 1.5-1.7, 16.4 (Dynamic Type support)
    private var typography: Font {
        switch size {
        case .small, .medium:
            // typography.bodyMd with Dynamic Type support
            return .system(size: 16, weight: .regular, design: .default)
        case .large:
            // typography.bodyLg with Dynamic Type support
            return .system(size: 18, weight: .regular, design: .default)
        }
    }
    
    /// Horizontal padding based on button size
    /// Requirements: 3.1-3.3
    private var horizontalPadding: CGFloat {
        switch size {
        case .small:
            return 16 // space.inset.spacious
        case .medium:
            return 24 // space.inset.expansive
        case .large:
            return 32 // space.inset.generous
        }
    }
    
    /// Vertical padding based on button size
    /// Requirements: 4.1-4.3
    private var verticalPadding: CGFloat {
        switch size {
        case .small:
            return 8 // space.inset.normal
        case .medium, .large:
            return 12 // space.inset.comfortable
        }
    }
    
    /// Border radius based on button size
    /// Requirements: 5.1-5.3
    private var borderRadius: CGFloat {
        switch size {
        case .small:
            return 8 // radius100
        case .medium:
            return 12 // radius150
        case .large:
            return 16 // radius200
        }
    }
    
    /// Minimum width based on button size
    /// Requirements: 6.1-6.3
    private var minWidth: CGFloat {
        switch size {
        case .small:
            return 56
        case .medium:
            return 72
        case .large:
            return 80
        }
    }
    
    /// Touch target height (44px minimum for accessibility)
    /// Requirements: 13.1-13.4
    /// 
    /// Implements WCAG 2.1 AA touch target requirements:
    /// - Small (40px visual): Extended to 44px touch target via .frame(minHeight: 44)
    /// - Medium (48px): Meets 44px minimum naturally
    /// - Large (56px): Exceeds 44px minimum
    /// 
    /// The .frame(minHeight:) modifier maintains visual height while providing
    /// the required 44px interactive area for small buttons.
    private var touchTargetHeight: CGFloat {
        switch size {
        case .small:
            return 44 // Extends from 40px visual to 44px touch target (Requirement 13.1, 13.3, 13.4)
        case .medium:
            return 48 // Meets 44px minimum (Requirement 13.2)
        case .large:
            return 56 // Exceeds 44px minimum (Requirement 13.2)
        }
    }
    
    /// Icon size based on button size
    /// Requirements: 8.2-8.3
    private var iconSize: CGFloat {
        switch size {
        case .small, .medium:
            return 24 // icon.size100
        case .large:
            return 32 // icon.size125
        }
    }
    
    /// Icon-text spacing based on button size
    /// Requirements: 8.4-8.5
    private var iconTextSpacing: CGFloat {
        switch size {
        case .small:
            return 4 // space.grouped.tight
        case .medium, .large:
            return 8 // space.grouped.normal
        }
    }
    
    // MARK: - Style-Based Computed Properties
    
    /// Background color based on button style
    /// Requirements: 2.1-2.3
    private var backgroundColor: Color {
        switch style {
        case .primary:
            return Color(red: 0.404, green: 0.314, blue: 0.643) // color.primary (#6750A4)
        case .secondary:
            return Color(red: 1.0, green: 1.0, blue: 1.0) // color.background (white)
        case .tertiary:
            return Color.clear // transparent
        }
    }
    
    /// Text color based on button style
    /// Requirements: 2.1-2.3
    private var textColor: Color {
        switch style {
        case .primary:
            return Color.white // color.text.onPrimary
        case .secondary, .tertiary:
            return Color(red: 0.404, green: 0.314, blue: 0.643) // color.primary
        }
    }
    
    /// Border color based on button style
    /// Requirements: 2.2
    private var borderColor: Color {
        switch style {
        case .primary, .tertiary:
            return Color.clear // No border
        case .secondary:
            return Color(red: 0.404, green: 0.314, blue: 0.643) // color.primary
        }
    }
    
    /// Border width based on button style
    /// Requirements: 2.2
    private var borderWidth: CGFloat {
        switch style {
        case .primary, .tertiary:
            return 0 // No border
        case .secondary:
            return 1 // border.default
        }
    }
    
    /// Icon color based on button style with optical balance
    /// Requirements: 9.1-9.3
    private var iconColor: Color? {
        switch style {
        case .primary:
            // Primary style: Use color.text.onPrimary (white)
            return Color.white
        case .secondary, .tertiary:
            // Secondary/Tertiary: Use color.primary with optical balance
            // Optical balance: 20% lighter for visual weight compensation
            // color.icon.opticalBalance = blend200 with BlendDirection.LIGHTER
            return Color(red: 0.506, green: 0.424, blue: 0.722) // Lightened primary color
        }
    }
}

/**
 * SwiftUI preview for ButtonCTA component.
 * 
 * Shows buttons with different sizes, styles, and configurations
 * to demonstrate component variants and interaction patterns.
 */
struct ButtonCTA_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            // Size variants
            Text("Size Variants")
                .font(.headline)
            
            VStack(spacing: 12) {
                ButtonCTA(
                    label: "Small Button",
                    size: .small,
                    onPress: { print("Small pressed") }
                )
                
                ButtonCTA(
                    label: "Medium Button",
                    size: .medium,
                    onPress: { print("Medium pressed") }
                )
                
                ButtonCTA(
                    label: "Large Button",
                    size: .large,
                    onPress: { print("Large pressed") }
                )
            }
            
            Divider()
            
            // Style variants
            Text("Style Variants")
                .font(.headline)
            
            VStack(spacing: 12) {
                ButtonCTA(
                    label: "Primary Button",
                    style: .primary,
                    onPress: { print("Primary pressed") }
                )
                
                ButtonCTA(
                    label: "Secondary Button",
                    style: .secondary,
                    onPress: { print("Secondary pressed") }
                )
                
                ButtonCTA(
                    label: "Tertiary Button",
                    style: .tertiary,
                    onPress: { print("Tertiary pressed") }
                )
            }
            
            Divider()
            
            // With icons
            Text("With Icons")
                .font(.headline)
            
            VStack(spacing: 12) {
                ButtonCTA(
                    label: "Continue",
                    icon: "arrow-right",
                    onPress: { print("Continue pressed") }
                )
                
                ButtonCTA(
                    label: "Add Item",
                    icon: "plus",
                    onPress: { print("Add pressed") }
                )
                
                ButtonCTA(
                    label: "Confirm",
                    icon: "check",
                    onPress: { print("Confirm pressed") }
                )
            }
            
            Divider()
            
            // Disabled state
            Text("Disabled State")
                .font(.headline)
            
            VStack(spacing: 12) {
                ButtonCTA(
                    label: "Disabled Button",
                    disabled: true,
                    onPress: { print("Should not print") }
                )
            }
        }
        .padding()
    }
}
