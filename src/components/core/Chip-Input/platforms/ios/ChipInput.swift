/**
 * Chip-Input SwiftUI Implementation
 * 
 * Stemma System: Chip Family
 * Component Type: Semantic Variant
 * Inherits: Chip-Base
 * Naming Convention: [Family]-[Type] = Chip-Input
 * 
 * A dismissible chip component used for managing user-entered values like tags
 * or selections. Extends Chip-Base with dismiss behavior and always-visible X icon.
 * 
 * Follows True Native Architecture with build-time platform separation.
 * Uses token-based styling for consistent cross-platform appearance.
 * Integrates with IconBase component for icon rendering.
 * 
 * Key Characteristics:
 * - Always displays X icon as trailing element
 * - Supports both leading icon AND trailing X icon
 * - Tap anywhere dismisses (calls onDismiss)
 * - No selected state (dismiss-only behavior)
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered. This ensures users always see actionable
 * UI elements.
 * 
 * @see .kiro/specs/045-chip-base/design.md for implementation details
 * @see .kiro/specs/045-chip-base/requirements.md Requirements 5.1-5.6, 6.2, 6.5, 7.5
 * @see src/components/core/Chip-Base/platforms/ios/ChipBase.swift for base component
 */

import SwiftUI

// Import theme-aware blend utilities (Color extensions from ThemeAwareBlendUtilities.ios.swift)
// These provide semantic blend methods: pressedBlend() for state styling
// @see Requirements: 3.3 - Pressed state styling
// @see src/blend/ThemeAwareBlendUtilities.ios.swift

// MARK: - Chip-Input Tokens

/**
 * Chip-Input specific design tokens.
 * 
 * Inherits all tokens from ChipTokens (Chip-Base).
 * No additional tokens needed for Chip-Input.
 * 
 * @see Requirements: 5.1 - Inherits Chip-Base visual styling
 */
enum ChipInputTokens {
    // MARK: - Spacing Tokens (inherited from ChipTokens)
    
    /// Block padding achieving 32px visual height with buttonSm typography
    /// References: chip.paddingBlock → space075 (6px)
    static let paddingBlock: CGFloat = DesignTokens.space075  // 6px
    
    /// Inline padding for horizontal spacing
    /// References: space.inset.150 (12px)
    static let paddingInline: CGFloat = DesignTokens.space150  // 12px
    
    /// Gap between icon and label
    /// References: space.grouped.tight (4px)
    static let iconGap: CGFloat = DesignTokens.space050  // 4px
    
    // MARK: - Size Tokens (inherited from ChipTokens)
    
    /// Icon size for chip icons
    /// References: icon.size075 (20px)
    static let iconSize: CGFloat = DesignTokens.iconSize075  // 20px
    
    /// Minimum tap area for accessibility
    /// References: tapAreaRecommended (48px)
    static let tapArea: CGFloat = DesignTokens.tapAreaRecommended  // 48px
    
    // MARK: - Border Tokens (inherited from ChipTokens)
    
    /// Border width for chip outline
    /// References: borderDefault → borderWidth100 (1px)
    static let borderWidth: CGFloat = DesignTokens.borderWidth100  // 1px
    
    // MARK: - Color Tokens (inherited from ChipTokens)
    
    /// Default background color
    /// References: color.structure.surface
    static let backgroundColor: Color = Color(DesignTokens.colorStructureSurface)
    
    /// Default border color
    /// References: color.structure.border
    static let borderColor: Color = Color(DesignTokens.colorStructureBorder)
    
    /// Default text color
    /// References: color.text.default
    static let textColor: Color = Color(DesignTokens.colorTextDefault)
    
    /// Primary action color for hover/pressed border
    /// References: color.action.primary
    static let primaryColor: Color = Color(DesignTokens.colorActionPrimary)
    
    // MARK: - Animation Tokens
    
    /// Animation duration for state transitions
    /// References: motion.duration.fast (150ms)
    static let animationDuration: Double = DesignTokens.duration150  // 0.15s
}

// MARK: - ChipInput View

/**
 * ChipInput SwiftUI View
 * 
 * A dismissible chip component with always-visible X icon as trailing element.
 * Tap anywhere on the chip to dismiss.
 * 
 * Usage:
 * ```swift
 * // Basic input chip
 * ChipInput(label: "Tag") {
 *     print("Chip dismissed")
 * }
 * 
 * // Input chip with leading icon (shows both leading icon AND trailing X)
 * ChipInput(label: "Category", icon: "tag") {
 *     print("Category dismissed")
 * }
 * 
 * // Input chip with testID
 * ChipInput(label: "Email", testID: "email-chip") {
 *     print("Email chip dismissed")
 * }
 * ```
 * 
 * @see Requirements: 5.1-5.6 in .kiro/specs/045-chip-base/requirements.md
 */
public struct ChipInput: View {
    
    // MARK: - Properties
    
    /// Chip text content (required)
    /// @see Requirements: 1.1 - Label text
    public let label: String
    
    /// Optional leading icon name
    /// @see Requirements: 5.3 - Support both leading icon AND trailing X icon
    public var icon: String?
    
    /// Dismiss callback
    /// @see Requirements: 5.4 - onDismiss callback
    public var onDismiss: (() -> Void)?
    
    /// Test ID for automated testing
    /// Uses accessibilityIdentifier on iOS
    public var testID: String?
    
    // MARK: - State
    
    /// Tracks pressed state for visual feedback
    @State private var isPressed: Bool = false
    
    // MARK: - Initialization
    
    /**
     * Initialize ChipInput with all properties.
     * 
     * - Parameters:
     *   - label: Chip text content (required)
     *   - icon: Optional leading icon name
     *   - testID: Test ID for automated testing
     *   - onDismiss: Dismiss callback
     * 
     * @see Requirements: 5.1-5.4 - Chip-Input props
     */
    public init(
        label: String,
        icon: String? = nil,
        testID: String? = nil,
        onDismiss: (() -> Void)? = nil
    ) {
        self.label = label
        self.icon = icon
        self.testID = testID
        self.onDismiss = onDismiss
    }
    
    // MARK: - Body
    
    /**
     * Main body with accessibility modifiers.
     * 
     * Accessibility features:
     * - `.accessibilityIdentifier(testID)`: Sets test identifier for automated testing
     * - `.accessibilityAddTraits(.isButton)`: Announces as button to VoiceOver
     * - `.accessibilityLabel`: Announces "Remove [label]" to VoiceOver
     * 
     * @see Requirements: 7.5 - X icon accessible label "Remove [label]"
     */
    public var body: some View {
        Button(action: handleDismiss) {
            chipContent
        }
        .buttonStyle(ChipInputButtonStyle(isPressed: $isPressed))
        .frame(minHeight: ChipInputTokens.tapArea)
        .accessibilityIdentifier(testID ?? "")
        .accessibilityLabel("Remove \(label)")
        .accessibilityAddTraits(.isButton)
    }
    
    // MARK: - Content
    
    /**
     * Chip content with optional leading icon, label, and trailing X icon.
     * 
     * Layout:
     * - HStack with leading icon (optional), label, and trailing X icon (always)
     * - Gap between elements: space.grouped.tight (4px)
     * - Padding: paddingBlock (6px) vertical, paddingInline (12px) horizontal
     * 
     * @see Requirements: 5.2, 5.3 - X icon as trailing element, both icons supported
     */
    @ViewBuilder
    private var chipContent: some View {
        HStack(spacing: ChipInputTokens.iconGap) {
            // Optional leading icon
            // @see Requirement 5.3 - Support both leading icon AND trailing X icon
            if let iconName = icon {
                IconBase(
                    name: iconName,
                    size: ChipInputTokens.iconSize,
                    color: ChipInputTokens.textColor
                )
            }
            
            // Label text
            Text(label)
                .font(.system(
                    size: DesignTokens.fontSize075,
                    weight: .medium
                ))
                .foregroundColor(ChipInputTokens.textColor)
            
            // Trailing X icon (always visible)
            // @see Requirement 5.2 - Always display X icon as trailing element
            IconBase(
                name: "x",
                size: ChipInputTokens.iconSize,
                color: ChipInputTokens.textColor
            )
            .accessibilityLabel("Remove \(label)")
        }
        .padding(.horizontal, ChipInputTokens.paddingInline)
        .padding(.vertical, ChipInputTokens.paddingBlock)
    }
    
    // MARK: - Actions
    
    /**
     * Handle dismiss action.
     * 
     * Calls the onDismiss callback if provided.
     * 
     * @see Requirements: 5.4 - Tap anywhere calls onDismiss
     */
    private func handleDismiss() {
        onDismiss?()
    }
}

// MARK: - ChipInputButtonStyle

/**
 * Custom button style for ChipInput.
 * 
 * Provides pill shape, border, and state-based styling (default, pressed).
 * Uses Capsule shape for pill appearance.
 * Inherits visual styling from Chip-Base.
 * 
 * @see Requirements: 5.1 - Inherits Chip-Base visual styling
 */
struct ChipInputButtonStyle: ButtonStyle {
    
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
                        lineWidth: ChipInputTokens.borderWidth
                    )
            )
            .animation(.easeInOut(duration: ChipInputTokens.animationDuration), value: configuration.isPressed)
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
     * @see Requirements: 3.1, 3.3 - State styling (inherited from Chip-Base)
     */
    private func backgroundColor(isPressed: Bool) -> Color {
        if isPressed {
            // Apply pressed blend (12% darker)
            return ChipInputTokens.backgroundColor.pressedBlend()
        }
        return ChipInputTokens.backgroundColor
    }
    
    /**
     * Border color based on pressed state.
     * 
     * - Default: color.structure.border
     * - Pressed: color.action.primary
     * 
     * @see Requirements: 3.1, 3.3 - State styling (inherited from Chip-Base)
     */
    private func borderColor(isPressed: Bool) -> Color {
        if isPressed {
            return ChipInputTokens.primaryColor
        }
        return ChipInputTokens.borderColor
    }
}

// MARK: - Preview

/**
 * SwiftUI Preview for ChipInput component.
 * 
 * Demonstrates various chip configurations:
 * - Basic input chip with X icon
 * - Input chip with leading icon (shows both icons)
 * - Multiple input chips in a row
 * - Input chip with testID
 * - Token reference documentation
 * 
 * @see Requirements: 6.5 - Cross-platform consistency verification
 */
struct ChipInput_Previews: PreviewProvider {
    static var previews: some View {
        ChipInputPreviewContent()
    }
}

/**
 * Preview content wrapper.
 */
struct ChipInputPreviewContent: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("ChipInput Component")
                    .font(.headline)
                
                // Basic input chip
                Text("Basic Input Chip (with X icon)")
                    .font(.subheadline)
                
                ChipInput(label: "Tag") {
                    print("Tag dismissed")
                }
                
                Divider()
                
                // Input chip with leading icon
                Text("With Leading Icon (both icons visible)")
                    .font(.subheadline)
                
                ChipInput(label: "Category", icon: "tag") {
                    print("Category dismissed")
                }
                
                Divider()
                
                // Multiple input chips
                Text("Multiple Input Chips")
                    .font(.subheadline)
                
                HStack(spacing: 8) {
                    ChipInput(label: "Swift") {
                        print("Swift dismissed")
                    }
                    
                    ChipInput(label: "iOS", icon: "apple") {
                        print("iOS dismissed")
                    }
                    
                    ChipInput(label: "Design") {
                        print("Design dismissed")
                    }
                }
                
                Divider()
                
                // Input chip with testID
                Text("Input Chip with testID")
                    .font(.subheadline)
                
                ChipInput(
                    label: "Test Chip",
                    testID: "test-input-chip"
                ) {
                    print("Test chip dismissed")
                }
                
                Divider()
                
                // Token reference documentation
                Text("Token References")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("paddingBlock: \(Int(ChipInputTokens.paddingBlock))pt (space075)")
                        .font(.caption)
                    Text("paddingInline: \(Int(ChipInputTokens.paddingInline))pt (space150)")
                        .font(.caption)
                    Text("iconGap: \(Int(ChipInputTokens.iconGap))pt (space050)")
                        .font(.caption)
                    Text("iconSize: \(Int(ChipInputTokens.iconSize))pt (iconSize075)")
                        .font(.caption)
                    Text("tapArea: \(Int(ChipInputTokens.tapArea))pt (tapAreaRecommended)")
                        .font(.caption)
                    Text("borderWidth: \(Int(ChipInputTokens.borderWidth))pt (borderWidth100)")
                        .font(.caption)
                }
                
                Divider()
                
                // Accessibility note
                Text("Accessibility")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("• X icon has accessible label: \"Remove [label]\"")
                        .font(.caption)
                    Text("• Tap anywhere on chip dismisses")
                        .font(.caption)
                    Text("• 48pt minimum tap area")
                        .font(.caption)
                }
            }
            .padding()
        }
    }
}
