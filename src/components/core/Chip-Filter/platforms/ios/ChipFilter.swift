/**
 * Chip-Filter SwiftUI Implementation
 * 
 * Stemma System: Chip Family
 * Component Type: Semantic Variant
 * Inherits: Chip-Base
 * Naming Convention: [Family]-[Type] = Chip-Filter
 * 
 * A toggleable chip component used for filtering content by multiple criteria.
 * Extends Chip-Base with selected state styling and checkmark icon when selected.
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
 * @see .kiro/specs/045-chip-base/requirements.md Requirements 4.1-4.6, 6.2, 6.5
 * @see src/components/core/Chip-Base/platforms/ios/ChipBase.swift for base component
 */

import SwiftUI

// Import theme-aware blend utilities (Color extensions from ThemeAwareBlendUtilities.ios.swift)
// These provide semantic blend methods: pressedBlend() for state styling
// @see Requirements: 3.3 - Pressed state styling
// @see src/blend/ThemeAwareBlendUtilities.ios.swift

// MARK: - Chip-Filter Tokens

/**
 * Chip-Filter specific design tokens.
 * 
 * Extends ChipTokens with selected state colors.
 * Uses color.feedback.select.* tokens for selected state styling.
 * 
 * @see Requirements: 4.2 - Selected state styling
 */
enum ChipFilterTokens {
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
    
    // MARK: - Default State Color Tokens (inherited from ChipTokens)
    
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
    
    // MARK: - Selected State Color Tokens
    
    /// Selected state background color
    /// References: color.feedback.select.background.rest
    /// @see Requirement 4.2 - Selected state background
    static let selectedBackgroundColor: Color = Color(DesignTokens.colorFeedbackSelectBackgroundRest)
    
    /// Selected state border color
    /// References: color.feedback.select.text.rest (used for border)
    /// @see Requirement 4.2 - Selected state border
    static let selectedBorderColor: Color = Color(DesignTokens.colorFeedbackSelectTextRest)
    
    /// Selected state text color
    /// References: color.feedback.select.text.rest
    /// @see Requirement 4.2 - Selected state text
    static let selectedTextColor: Color = Color(DesignTokens.colorFeedbackSelectTextRest)
    
    // MARK: - Animation Tokens
    
    /// Animation duration for state transitions
    /// References: motion.duration.fast (150ms)
    static let animationDuration: Double = DesignTokens.duration150  // 0.15s
}

// MARK: - ChipFilter View

/**
 * ChipFilter SwiftUI View
 * 
 * A toggleable chip component with selected state styling and checkmark icon.
 * 
 * Usage:
 * ```swift
 * // Basic filter chip
 * @State var isSelected = false
 * ChipFilter(label: "Category", selected: $isSelected) { newValue in
 *     print("Selection changed to: \(newValue)")
 * }
 * 
 * // Filter chip with icon (icon replaced by checkmark when selected)
 * ChipFilter(label: "Filter", icon: "settings", selected: $isSelected)
 * 
 * // Filter chip with testID
 * ChipFilter(label: "Tag", selected: $isSelected, testID: "tag-filter")
 * ```
 * 
 * @see Requirements: 4.1-4.6 in .kiro/specs/045-chip-base/requirements.md
 */
public struct ChipFilter: View {
    
    // MARK: - Properties
    
    /// Chip text content (required)
    /// @see Requirements: 1.1 - Label text
    public let label: String
    
    /// Optional leading icon name (replaced by checkmark when selected)
    /// @see Requirements: 4.3, 4.4 - Checkmark replaces leading icon when selected
    public var icon: String?
    
    /// Binding to selected state
    /// @see Requirements: 4.1 - selected boolean prop
    @Binding public var selected: Bool
    
    /// Selection change callback
    /// @see Requirements: 4.5 - onSelectionChange callback
    public var onSelectionChange: ((Bool) -> Void)?
    
    /// Press callback (inherited from Chip-Base behavior)
    public var onPress: (() -> Void)?
    
    /// Test ID for automated testing
    /// Uses accessibilityIdentifier on iOS
    public var testID: String?
    
    // MARK: - State
    
    /// Tracks pressed state for visual feedback
    @State private var isPressed: Bool = false
    
    // MARK: - Initialization
    
    /**
     * Initialize ChipFilter with all properties.
     * 
     * - Parameters:
     *   - label: Chip text content (required)
     *   - icon: Optional leading icon name (replaced by checkmark when selected)
     *   - selected: Binding to selected state
     *   - testID: Test ID for automated testing
     *   - onSelectionChange: Selection change callback
     *   - onPress: Press callback
     * 
     * @see Requirements: 4.1-4.5 - Chip-Filter props
     */
    public init(
        label: String,
        icon: String? = nil,
        selected: Binding<Bool>,
        testID: String? = nil,
        onSelectionChange: ((Bool) -> Void)? = nil,
        onPress: (() -> Void)? = nil
    ) {
        self.label = label
        self.icon = icon
        self._selected = selected
        self.testID = testID
        self.onSelectionChange = onSelectionChange
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
     * - `.accessibilityValue`: Announces selected state to VoiceOver
     * 
     * @see Requirements: 7.4 - aria-pressed equivalent for iOS
     */
    public var body: some View {
        Button(action: handlePress) {
            chipContent
        }
        .buttonStyle(ChipFilterButtonStyle(isPressed: $isPressed, selected: selected))
        .frame(minHeight: ChipFilterTokens.tapArea)
        .accessibilityIdentifier(testID ?? "")
        .accessibilityLabel(label)
        .accessibilityAddTraits(.isButton)
        .accessibilityValue(selected ? "Selected" : "Not selected")
    }
    
    // MARK: - Content
    
    /**
     * Chip content with icon and label.
     * 
     * When selected, displays checkmark icon instead of leading icon.
     * 
     * Layout:
     * - HStack with icon (checkmark when selected, or leading icon) and label
     * - Gap between icon and label: space.grouped.tight (4px)
     * - Padding: paddingBlock (6px) vertical, paddingInline (12px) horizontal
     * 
     * @see Requirements: 4.3, 4.4 - Checkmark when selected, replaces leading icon
     */
    @ViewBuilder
    private var chipContent: some View {
        HStack(spacing: ChipFilterTokens.iconGap) {
            // Icon logic:
            // - When selected: always show checkmark (replaces leading icon)
            // - When not selected: show leading icon if provided
            // @see Requirement 4.3, 4.4
            if selected {
                // Checkmark icon when selected
                IconBase(
                    name: "check",
                    size: ChipFilterTokens.iconSize,
                    color: ChipFilterTokens.selectedTextColor
                )
            } else if let iconName = icon {
                // Leading icon when not selected
                IconBase(
                    name: iconName,
                    size: ChipFilterTokens.iconSize,
                    color: ChipFilterTokens.textColor
                )
            }
            
            // Label text
            Text(label)
                .font(.system(
                    size: DesignTokens.fontSize075,
                    weight: .medium
                ))
                .foregroundColor(selected ? ChipFilterTokens.selectedTextColor : ChipFilterTokens.textColor)
        }
        .padding(.horizontal, ChipFilterTokens.paddingInline)
        .padding(.vertical, ChipFilterTokens.paddingBlock)
    }
    
    // MARK: - Actions
    
    /**
     * Handle press action.
     * 
     * Toggles selected state and calls callbacks.
     * 
     * @see Requirements: 4.5 - Toggle selected state on press
     */
    private func handlePress() {
        // Toggle selected state
        let newSelected = !selected
        selected = newSelected
        
        // Call onSelectionChange callback
        onSelectionChange?(newSelected)
        
        // Call onPress callback (inherited from Chip-Base behavior)
        onPress?()
    }
}

// MARK: - ChipFilterButtonStyle

/**
 * Custom button style for ChipFilter.
 * 
 * Provides pill shape, border, and state-based styling (default, selected, pressed).
 * Uses Capsule shape for pill appearance.
 * 
 * @see Requirements: 4.2 - Selected state styling
 */
struct ChipFilterButtonStyle: ButtonStyle {
    
    /// Binding to track pressed state
    @Binding var isPressed: Bool
    
    /// Current selected state
    let selected: Bool
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background(backgroundColor(isPressed: configuration.isPressed))
            .clipShape(Capsule())
            .overlay(
                Capsule()
                    .stroke(
                        borderColor(isPressed: configuration.isPressed),
                        lineWidth: ChipFilterTokens.borderWidth
                    )
            )
            .animation(.easeInOut(duration: ChipFilterTokens.animationDuration), value: configuration.isPressed)
            .animation(.easeInOut(duration: ChipFilterTokens.animationDuration), value: selected)
            .onChange(of: configuration.isPressed) { newValue in
                isPressed = newValue
            }
    }
    
    /**
     * Background color based on selected and pressed state.
     * 
     * - Default (not selected): color.structure.surface
     * - Selected: color.feedback.select.background.rest
     * - Pressed (not selected): color.structure.surface with blend.pressedDarker
     * - Pressed (selected): color.feedback.select.background.rest with brightness adjustment
     * 
     * @see Requirements: 4.2 - Selected state styling
     */
    private func backgroundColor(isPressed: Bool) -> Color {
        if selected {
            if isPressed {
                // Selected + pressed: slightly darker selected background
                return ChipFilterTokens.selectedBackgroundColor.opacity(0.9)
            }
            return ChipFilterTokens.selectedBackgroundColor
        } else {
            if isPressed {
                // Not selected + pressed: apply pressed blend
                return ChipFilterTokens.backgroundColor.pressedBlend()
            }
            return ChipFilterTokens.backgroundColor
        }
    }
    
    /**
     * Border color based on selected and pressed state.
     * 
     * - Default (not selected): color.structure.border
     * - Selected: color.feedback.select.text.rest
     * - Pressed (not selected): color.action.primary
     * 
     * @see Requirements: 4.2 - Selected state styling
     */
    private func borderColor(isPressed: Bool) -> Color {
        if selected {
            return ChipFilterTokens.selectedBorderColor
        } else if isPressed {
            return ChipFilterTokens.primaryColor
        }
        return ChipFilterTokens.borderColor
    }
}

// MARK: - Preview

/**
 * SwiftUI Preview for ChipFilter component.
 * 
 * Demonstrates various chip configurations:
 * - Basic filter chip (not selected)
 * - Selected filter chip
 * - Filter chip with icon (shows checkmark when selected)
 * - Multiple filter chips in a row
 * - Interactive toggle demonstration
 * 
 * @see Requirements: 6.5 - Cross-platform consistency verification
 */
struct ChipFilter_Previews: PreviewProvider {
    static var previews: some View {
        ChipFilterPreviewContent()
    }
}

/**
 * Preview content wrapper with state management.
 */
struct ChipFilterPreviewContent: View {
    @State private var isSelected1 = false
    @State private var isSelected2 = true
    @State private var isSelected3 = false
    @State private var isSelected4 = true
    @State private var isSelectedAll = false
    @State private var isSelectedActive = true
    @State private var isSelectedCompleted = false
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("ChipFilter Component")
                    .font(.headline)
                
                // Basic filter chip (not selected)
                Text("Not Selected")
                    .font(.subheadline)
                
                ChipFilter(label: "Category", selected: $isSelected1) { newValue in
                    print("Category selection changed to: \(newValue)")
                }
                
                Divider()
                
                // Selected filter chip
                Text("Selected (with checkmark)")
                    .font(.subheadline)
                
                ChipFilter(label: "Active", selected: $isSelected2) { newValue in
                    print("Active selection changed to: \(newValue)")
                }
                
                Divider()
                
                // Filter chip with icon (not selected)
                Text("With Icon (not selected)")
                    .font(.subheadline)
                
                ChipFilter(label: "Settings", icon: "settings", selected: $isSelected3) { newValue in
                    print("Settings selection changed to: \(newValue)")
                }
                
                Divider()
                
                // Filter chip with icon (selected - shows checkmark instead)
                Text("With Icon (selected - checkmark replaces icon)")
                    .font(.subheadline)
                
                ChipFilter(label: "Settings", icon: "settings", selected: $isSelected4) { newValue in
                    print("Settings selection changed to: \(newValue)")
                }
                
                Divider()
                
                // Multiple filter chips
                Text("Multiple Filter Chips")
                    .font(.subheadline)
                
                HStack(spacing: 8) {
                    ChipFilter(label: "All", selected: $isSelectedAll) { newValue in
                        print("All selection changed to: \(newValue)")
                    }
                    
                    ChipFilter(label: "Active", icon: "circle", selected: $isSelectedActive) { newValue in
                        print("Active selection changed to: \(newValue)")
                    }
                    
                    ChipFilter(label: "Completed", icon: "check", selected: $isSelectedCompleted) { newValue in
                        print("Completed selection changed to: \(newValue)")
                    }
                }
                
                Divider()
                
                // Token reference documentation
                Text("Token References")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("paddingBlock: \(Int(ChipFilterTokens.paddingBlock))pt (space075)")
                        .font(.caption)
                    Text("paddingInline: \(Int(ChipFilterTokens.paddingInline))pt (space150)")
                        .font(.caption)
                    Text("iconGap: \(Int(ChipFilterTokens.iconGap))pt (space050)")
                        .font(.caption)
                    Text("iconSize: \(Int(ChipFilterTokens.iconSize))pt (iconSize075)")
                        .font(.caption)
                    Text("tapArea: \(Int(ChipFilterTokens.tapArea))pt (tapAreaRecommended)")
                        .font(.caption)
                    Text("borderWidth: \(Int(ChipFilterTokens.borderWidth))pt (borderWidth100)")
                        .font(.caption)
                }
                
                Divider()
                
                // Selected state token references
                Text("Selected State Tokens")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("selectedBackground: color.feedback.select.background.rest")
                        .font(.caption)
                    Text("selectedBorder: color.feedback.select.text.rest")
                        .font(.caption)
                    Text("selectedText: color.feedback.select.text.rest")
                        .font(.caption)
                }
            }
            .padding()
        }
    }
}
