/**
 * Chip-Base SwiftUI Implementation
 * 
 * Stemma System: Chip Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type] = Chip-Base
 * 
 * A compact, interactive element used for filtering, selection, or input management.
 * Chip-Base is the primitive component that provides the foundation for semantic
 * variants (Chip-Filter, Chip-Input).
 * 
 * Follows True Native Architecture with build-time platform separation.
 * Uses token-based styling for consistent cross-platform appearance.
 * Integrates with IconBase component for icon rendering.
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered. This ensures users always see actionable
 * UI elements.
 * 
 * @see .kiro/specs/045-chip-base/design.md for implementation details
 * @see .kiro/specs/045-chip-base/requirements.md Requirements 6.2, 6.4, 6.5
 * @see src/components/core/Icon-Base/platforms/ios/IconBase.ios.swift for Icon component
 */

import SwiftUI

// Import theme-aware blend utilities (Color extensions from ThemeAwareBlendUtilities.ios.swift)
// These provide semantic blend methods: pressedBlend() for state styling
// @see Requirements: 3.3 - Pressed state styling
// @see src/blend/ThemeAwareBlendUtilities.ios.swift

// MARK: - Chip Tokens

/**
 * Chip-specific design tokens.
 * 
 * These tokens are component-level tokens specific to the Chip component family.
 * They reference or extend the core DesignTokens where possible.
 * 
 * @see Requirements: 8.1, 8.2, 8.3 - Component token definition
 * @see Requirements: 2.1-2.6 - Visual specifications
 */
enum ChipTokens {
    // MARK: - Spacing Tokens
    
    /// Block padding achieving 32px visual height with buttonSm typography
    /// References: inset.075 semantic token (6px)
    /// Calculation: 6px padding × 2 + 20px content = 32px
    /// @see Requirements: 2.1 - Block padding
    static let paddingBlock: CGFloat = DesignTokens.spaceInset075  // 6px (inset.075)
    
    /// Inline padding for horizontal spacing
    /// References: space.inset.150 (12px)
    /// @see Requirements: 2.2 - Inline padding
    static let paddingInline: CGFloat = DesignTokens.space150  // 12px
    
    /// Gap between icon and label
    /// References: space.grouped.tight (4px)
    /// @see Requirements: 2.3 - Icon-label gap
    static let iconGap: CGFloat = DesignTokens.space050  // 4px
    
    // MARK: - Size Tokens
    
    /// Icon size for chip icons
    /// References: icon.size075 (20px)
    /// @see Requirements: 1.2 - Icon size
    static let iconSize: CGFloat = DesignTokens.iconSize075  // 20px
    
    /// Minimum tap area for accessibility
    /// References: tapAreaRecommended (48px)
    /// @see Requirements: 2.6, 7.6 - Tap area
    static let tapArea: CGFloat = DesignTokens.tapAreaRecommended  // 48px
    
    // MARK: - Border Tokens
    
    /// Border width for chip outline
    /// References: borderDefault → borderWidth100 (1px)
    /// @see Requirements: 1.5 - Border width
    static let borderWidth: CGFloat = DesignTokens.borderWidth100  // 1px
    
    // MARK: - Color Tokens
    
    /// Default background color
    /// References: color.structure.surface
    /// @see Requirements: 3.1 - Default state background
    static let backgroundColor: Color = Color(DesignTokens.colorStructureSurface)
    
    /// Default border color
    /// References: color.structure.border
    /// @see Requirements: 3.1 - Default state border
    static let borderColor: Color = Color(DesignTokens.colorStructureBorder)
    
    /// Default text color
    /// References: color.text.default
    /// @see Requirements: 3.1 - Default state text
    static let textColor: Color = Color(DesignTokens.colorTextDefault)
    
    /// Primary action color for hover/pressed border
    /// References: color.action.primary
    /// @see Requirements: 3.2, 3.3 - Hover/pressed state border
    static let primaryColor: Color = Color(DesignTokens.colorActionPrimary)
    
    // MARK: - Animation Tokens
    
    /// Animation duration for state transitions
    /// References: motion.duration.fast (150ms)
    /// @see Requirements: 3.4 - State transition animation
    static let animationDuration: Double = DesignTokens.duration150  // 0.15s
}

// MARK: - ChipBase View

/**
 * ChipBase SwiftUI View
 * 
 * A compact, interactive element with pill shape for filtering, selection, or input.
 * 
 * Usage:
 * ```swift
 * // Basic chip
 * ChipBase(label: "Category") {
 *     print("Chip pressed")
 * }
 * 
 * // Chip with icon
 * ChipBase(label: "Filter", icon: "check") {
 *     print("Filter pressed")
 * }
 * 
 * // Chip with testID
 * ChipBase(label: "Tag", testID: "tag-chip") {
 *     print("Tag pressed")
 * }
 * ```
 * 
 * @see Requirements: 1.1, 1.2, 1.3 in .kiro/specs/045-chip-base/requirements.md
 */
public struct ChipBase: View {
    
    // MARK: - Properties
    
    /// Chip text content (required)
    /// @see Requirements: 1.1 - Label text
    public let label: String
    
    /// Optional leading icon name
    /// @see Requirements: 1.2 - Optional icon
    public var icon: String?
    
    /// Press callback
    /// @see Requirements: 1.3 - Press handling
    public var onPress: (() -> Void)?
    
    /// Test ID for automated testing
    /// Uses accessibilityIdentifier on iOS
    /// @see Requirements: testID support
    public var testID: String?
    
    // MARK: - State
    
    /// Tracks pressed state for visual feedback
    @State private var isPressed: Bool = false
    
    // MARK: - Initialization
    
    /**
     * Initialize ChipBase with all properties.
     * 
     * - Parameters:
     *   - label: Chip text content (required)
     *   - icon: Optional leading icon name
     *   - testID: Test ID for automated testing
     *   - onPress: Press callback
     * 
     * @see Requirements: 1.1, 1.2, 1.3 - Component structure
     */
    public init(
        label: String,
        icon: String? = nil,
        testID: String? = nil,
        onPress: (() -> Void)? = nil
    ) {
        self.label = label
        self.icon = icon
        self.testID = testID
        self.onPress = onPress
    }
    
    // MARK: - Body
    
    /**
     * Main body with accessibility modifiers.
     * 
     * Accessibility features:
     * - `.accessibilityIdentifier(testID)`: Sets test identifier for automated testing
     * - `.accessibilityAddTraits(.isButton)`: Announces as button to VoiceOver
     * - `.accessibilityLabel(label)`: Announces label text to VoiceOver
     * 
     * @see Requirements: 7.1, 7.2, 7.3 - Accessibility implementation
     */
    public var body: some View {
        Button(action: handlePress) {
            chipContent
        }
        .buttonStyle(ChipButtonStyle(isPressed: $isPressed))
        .frame(minHeight: ChipTokens.tapArea)
        .accessibilityIdentifier(testID ?? "")
        .accessibilityLabel(label)
        .accessibilityAddTraits(.isButton)
    }
    
    // MARK: - Content
    
    /**
     * Chip content with icon and label.
     * 
     * Layout:
     * - HStack with icon (optional) and label
     * - Gap between icon and label: space.grouped.tight (4px)
     * - Padding: paddingBlock (6px) vertical, paddingInline (12px) horizontal
     * 
     * @see Requirements: 2.1, 2.2, 2.3 - Visual specifications
     */
    @ViewBuilder
    private var chipContent: some View {
        HStack(spacing: ChipTokens.iconGap) {
            // Optional leading icon
            if let iconName = icon {
                IconBase(
                    name: iconName,
                    size: ChipTokens.iconSize,
                    color: ChipTokens.textColor
                )
            }
            
            // Label text
            Text(label)
                .font(.system(
                    size: DesignTokens.fontSize075,
                    weight: .medium
                ))
                .foregroundColor(ChipTokens.textColor)
        }
        .padding(.horizontal, ChipTokens.paddingInline)
        .padding(.vertical, ChipTokens.paddingBlock)
    }
    
    // MARK: - Actions
    
    /**
     * Handle press action.
     * 
     * Calls the onPress callback if provided.
     * 
     * @see Requirements: 1.3 - Press callback
     */
    private func handlePress() {
        onPress?()
    }
}

// MARK: - ChipButtonStyle

/**
 * Custom button style for ChipBase.
 * 
 * Provides pill shape, border, and state-based styling (default, pressed).
 * Uses Capsule shape for pill appearance.
 * 
 * @see Requirements: 2.4, 3.1, 3.3 - Visual styling
 */
struct ChipButtonStyle: ButtonStyle {
    
    /// Binding to track pressed state
    @Binding var isPressed: Bool
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background(backgroundColor(isPressed: configuration.isPressed))
            .clipShape(Capsule())
            .overlay(
                Capsule()
                    .stroke(
                        borderColor(isPressed: configuration.isPressed),
                        lineWidth: ChipTokens.borderWidth
                    )
            )
            .animation(.easeInOut(duration: ChipTokens.animationDuration), value: configuration.isPressed)
            .onChange(of: configuration.isPressed) { newValue in
                isPressed = newValue
            }
    }
    
    /**
     * Background color based on pressed state.
     * 
     * - Default: color.structure.surface
     * - Pressed: color.structure.surface with blend.pressedDarker (12% darker)
     * 
     * @see Requirements: 3.1, 3.3 - State styling
     */
    private func backgroundColor(isPressed: Bool) -> Color {
        if isPressed {
            // Apply pressed blend (12% darker)
            return ChipTokens.backgroundColor.pressedBlend()
        }
        return ChipTokens.backgroundColor
    }
    
    /**
     * Border color based on pressed state.
     * 
     * - Default: color.structure.border
     * - Pressed: color.action.primary
     * 
     * @see Requirements: 3.1, 3.3 - State styling
     */
    private func borderColor(isPressed: Bool) -> Color {
        if isPressed {
            return ChipTokens.primaryColor
        }
        return ChipTokens.borderColor
    }
}

// MARK: - Preview

/**
 * SwiftUI Preview for ChipBase component.
 * 
 * Demonstrates various chip configurations:
 * - Basic chip with label only
 * - Chip with icon
 * - Multiple chips in a row
 * - Chip with testID
 * 
 * @see Requirements: 6.5 - Cross-platform consistency verification
 */
struct ChipBase_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("ChipBase Component")
                    .font(.headline)
                
                // Basic chip
                Text("Basic Chip")
                    .font(.subheadline)
                
                ChipBase(label: "Category") {
                    print("Category pressed")
                }
                
                Divider()
                
                // Chip with icon
                Text("Chip with Icon")
                    .font(.subheadline)
                
                ChipBase(label: "Filter", icon: "check") {
                    print("Filter pressed")
                }
                
                Divider()
                
                // Multiple chips
                Text("Multiple Chips")
                    .font(.subheadline)
                
                HStack(spacing: 8) {
                    ChipBase(label: "All") {
                        print("All pressed")
                    }
                    
                    ChipBase(label: "Active", icon: "circle") {
                        print("Active pressed")
                    }
                    
                    ChipBase(label: "Completed", icon: "check") {
                        print("Completed pressed")
                    }
                }
                
                Divider()
                
                // Chip with testID
                Text("Chip with testID")
                    .font(.subheadline)
                
                ChipBase(
                    label: "Test Chip",
                    testID: "test-chip"
                ) {
                    print("Test chip pressed")
                }
                
                Divider()
                
                // Token reference documentation
                Text("Token References")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("paddingBlock: \(Int(ChipTokens.paddingBlock))pt (inset.075)")
                        .font(.caption)
                    Text("paddingInline: \(Int(ChipTokens.paddingInline))pt (space150)")
                        .font(.caption)
                    Text("iconGap: \(Int(ChipTokens.iconGap))pt (space050)")
                        .font(.caption)
                    Text("iconSize: \(Int(ChipTokens.iconSize))pt (iconSize075)")
                        .font(.caption)
                    Text("tapArea: \(Int(ChipTokens.tapArea))pt (tapAreaRecommended)")
                        .font(.caption)
                    Text("borderWidth: \(Int(ChipTokens.borderWidth))pt (borderWidth100)")
                        .font(.caption)
                }
            }
            .padding()
        }
    }
}
