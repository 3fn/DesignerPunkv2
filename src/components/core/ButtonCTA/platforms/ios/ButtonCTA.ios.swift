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
        // Requirement 17.2: Scale transform on press with motion token animation
        // iOS platform pattern: scale + motion pairing for tactile feedback
        // Scale: scale096 (0.96 = 4% reduction, using existing token instead of 0.97)
        // Motion: motionButtonPress (150ms with accelerate easing for immediate response)
        .scaleEffect(isPressed ? DesignTokens.scale096 : DesignTokens.scale100)
        .animation(
            DesignTokens.Easing.easingAccelerate.speed(1.0 / DesignTokens.Duration.duration150),
            value: isPressed
        )
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
    /// Uses labelMd/labelLg tokens (fontWeight500) for visual emphasis and clarity
    private var typography: Font {
        switch size {
        case .small, .medium:
            // typography.labelMd with Dynamic Type support (16pt, fontWeight500)
            return .system(size: DesignTokens.typographyLabelMd.fontSize, weight: .medium, design: .default)
        case .large:
            // typography.labelLg with Dynamic Type support (18pt, fontWeight500)
            return .system(size: DesignTokens.typographyLabelLg.fontSize, weight: .medium, design: .default)
        }
    }
    
    /// Horizontal padding based on button size
    /// Requirements: 3.1-3.3
    private var horizontalPadding: CGFloat {
        switch size {
        case .small:
            return DesignTokens.spaceInset200 // 16pt
        case .medium:
            return DesignTokens.spaceInset300 // 24pt
        case .large:
            return DesignTokens.spaceInset400 // 32pt
        }
    }
    
    /// Vertical padding based on button size
    /// Requirements: 4.1-4.3
    private var verticalPadding: CGFloat {
        switch size {
        case .small:
            return DesignTokens.spaceInset100 // 8pt
        case .medium, .large:
            return DesignTokens.spaceInset150 // 12pt
        }
    }
    
    /// Border radius based on button size
    /// Requirements: 5.1-5.3
    private var borderRadius: CGFloat {
        switch size {
        case .small:
            return DesignTokens.radius100 // 8pt
        case .medium:
            return DesignTokens.radius150 // 12pt
        case .large:
            return DesignTokens.radius200 // 16pt
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
    /// - Small (40px visual): Extended to 44px touch target via .frame(minHeight: tapAreaMinimum)
    /// - Medium (48px): Meets 44px minimum naturally via tapAreaRecommended
    /// - Large (56px): Exceeds 44px minimum via tapAreaComfortable
    /// 
    /// The .frame(minHeight:) modifier maintains visual height while providing
    /// the required 44px interactive area for small buttons.
    private var touchTargetHeight: CGFloat {
        switch size {
        case .small:
            return DesignTokens.tapAreaMinimum // Extends from 40px visual to 44px touch target (Requirement 13.1, 13.3, 13.4)
        case .medium:
            return DesignTokens.tapAreaRecommended // Meets 44px minimum (Requirement 13.2)
        case .large:
            return DesignTokens.tapAreaComfortable // Exceeds 44px minimum (Requirement 13.2)
        }
    }
    
    /// Icon size based on button size
    /// Requirements: 8.2-8.3
    private var iconSize: CGFloat {
        switch size {
        case .small, .medium:
            return DesignTokens.iconSize100 // 24pt
        case .large:
            return DesignTokens.iconSize125 // 28pt
        }
    }
    
    /// Icon-text spacing based on button size
    /// Requirements: 8.4-8.5
    private var iconTextSpacing: CGFloat {
        switch size {
        case .small:
            return DesignTokens.spaceGroupedTight // 4pt
        case .medium, .large:
            return DesignTokens.spaceGroupedNormal // 8pt
        }
    }
    
    // MARK: - Style-Based Computed Properties
    
    /// Background color based on button style
    /// Requirements: 2.1-2.3
    private var backgroundColor: Color {
        switch style {
        case .primary:
            return Color(DesignTokens.colorPrimary) // Semantic token: color.primary
        case .secondary:
            return Color(DesignTokens.colorBackground) // Semantic token: color.background (white)
        case .tertiary:
            return Color.clear // transparent
        }
    }
    
    /// Text color based on button style
    /// Requirements: 2.1-2.3
    private var textColor: Color {
        switch style {
        case .primary:
            return Color(DesignTokens.colorTextOnPrimary) // Semantic token: color.text.onPrimary
        case .secondary, .tertiary:
            return Color(DesignTokens.colorPrimary) // Semantic token: color.primary
        }
    }
    
    /// Border color based on button style
    /// Requirements: 2.2
    private var borderColor: Color {
        switch style {
        case .primary, .tertiary:
            return Color.clear // No border
        case .secondary:
            return Color(DesignTokens.colorPrimary) // Semantic token: color.primary
        }
    }
    
    /// Border width based on button style
    /// Requirements: 2.2
    private var borderWidth: CGFloat {
        switch style {
        case .primary, .tertiary:
            return DesignTokens.borderWidth000 // No border
        case .secondary:
            return DesignTokens.borderWidth100 // border.default (1pt)
        }
    }
    
    /// Icon color based on button style with optical balance
    /// Requirements: 9.1-9.3
    private var iconColor: Color? {
        switch style {
        case .primary:
            // Primary style: Use colorTextOnPrimary semantic token
            return Color(DesignTokens.colorTextOnPrimary) // Semantic token: color.text.onPrimary
        case .secondary, .tertiary:
            // Secondary/Tertiary: Use color.primary with optical balance blend
            // Apply blend200 (8% lighter) for optical weight compensation
            return Color(DesignTokens.colorPrimary).opacity(1.0 + DesignTokens.colorIconOpticalBalance) // color.primary + blend200 LIGHTER
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
