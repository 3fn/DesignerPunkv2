/**
 * Input-Radio-Base Component for iOS Platform
 * 
 * Cross-platform radio button component with three size variants (sm, md, lg),
 * configurable label alignment, and support for selected/unselected states.
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Input-Radio-Base
 * Component Type: Primitive (Base)
 * 
 * Follows True Native Architecture with platform-specific SwiftUI implementation
 * while maintaining API consistency with web and Android platforms.
 * 
 * Key Differences from Checkbox:
 * - Single-select (mutual exclusivity within a group) vs multi-select
 * - Circular shape with filled dot indicator vs rounded square with checkmark
 * - No indeterminate state (not applicable to radio buttons)
 * - Uses @Binding var selectedValue: String? for group coordination
 * 
 * Part of the DesignerPunk Form Inputs Component system.
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered.
 * 
 * @module Input-Radio-Base/platforms/ios
 * @see Requirements: 1.1-1.7, 2.1-2.9, 3.1-3.4, 7.1, 7.2, 8.4
 */

import SwiftUI

// MARK: - Enums

/**
 * Radio size variants
 * 
 * Defines three size options that follow the 8px baseline grid.
 * Each size determines dot size, inset padding, circle size, gap, and typography.
 * 
 * Circle Size Formula: dotSize + (inset × 2)
 * - sm: 24px circle (16px dot + 4px inset × 2)
 * - md: 32px circle (20px dot + 6px inset × 2)
 * - lg: 40px circle (24px dot + 8px inset × 2)
 * 
 * @see Requirement 2.1-2.9 in .kiro/specs/047-input-radio-base/requirements.md
 */
enum RadioSize {
    case sm
    case md
    case lg
    
    /// Dot size token for this radio size (matches icon size tokens)
    /// @see Requirement 4.3 - Dot size matching size variant
    var dotSize: CGFloat {
        switch self {
        case .sm: return DesignTokens.iconSize050  // 16px
        case .md: return DesignTokens.iconSize075  // 20px
        case .lg: return DesignTokens.iconSize100  // 24px
        }
    }
    
    /// Inset padding for this radio size
    /// @see Requirement 2.1-2.3 - Circle size calculations
    var inset: CGFloat {
        switch self {
        case .sm: return DesignTokens.spaceInset050  // 4px
        case .md: return DesignTokens.spaceInset075  // 6px
        case .lg: return DesignTokens.spaceInset100  // 8px
        }
    }
    
    /// Computed circle size (dot + inset padding on both sides)
    /// @see Requirement 2.1-2.3 - Circle size calculations
    var circleSize: CGFloat {
        return dotSize + (inset * 2)
    }
    
    /// Gap between radio circle and label
    /// @see Requirement 2.7-2.8 - Gap tokens
    var gap: CGFloat {
        switch self {
        case .sm, .md: return DesignTokens.spaceGroupedNormal  // 8px
        case .lg: return DesignTokens.spaceGroupedLoose        // 12px
        }
    }
    
    /// Typography font size for label
    /// @see Requirement 2.4-2.6 - Label typography
    var labelFontSize: CGFloat {
        switch self {
        case .sm: return DesignTokens.fontSize075  // 14px (labelSm)
        case .md: return DesignTokens.fontSize100  // 16px (labelMd)
        case .lg: return DesignTokens.fontSize125  // 18px (labelLg)
        }
    }
}

/**
 * Label alignment options relative to radio circle.
 * 
 * - center: Vertically centers the label with the radio circle (default)
 * - top: Aligns the label to the top of the radio circle (for multi-line labels)
 * 
 * @see Requirement 3.1-3.4 in .kiro/specs/047-input-radio-base/requirements.md
 */
enum RadioLabelAlignment {
    case center
    case top
    
    /// SwiftUI vertical alignment for HStack
    var verticalAlignment: VerticalAlignment {
        switch self {
        case .center: return .center
        case .top: return .top
        }
    }
}

// MARK: - InputRadioBase Component

/**
 * InputRadioBase component for iOS platform.
 * 
 * Renders a radio button with SwiftUI Button component, supporting three size variants,
 * configurable label alignment, and selected/unselected states.
 * 
 * Uses @Binding var selectedValue: String? for group coordination, allowing
 * Input-Radio-Set to manage mutual exclusivity across multiple radio buttons.
 * 
 * Usage:
 * ```swift
 * // Basic usage with binding
 * @State private var selectedOption: String? = nil
 * InputRadioBase(
 *     value: "option-a",
 *     label: "Option A",
 *     selectedValue: $selectedOption
 * )
 * 
 * // With size and alignment
 * InputRadioBase(
 *     value: "premium",
 *     label: "Premium Plan",
 *     selectedValue: $selectedPlan,
 *     size: .lg,
 *     labelAlign: .top
 * )
 * 
 * // With helper text and error
 * InputRadioBase(
 *     value: "agree",
 *     label: "I agree to the terms",
 *     selectedValue: $agreement,
 *     helperText: "Please read the terms carefully",
 *     errorMessage: "You must select an option"
 * )
 * ```
 * 
 * Requirements:
 * - 1.1-1.7: Radio states (unselected, selected, error)
 * - 2.1-2.9: Size variants (sm, md, lg)
 * - 3.1-3.4: Label alignment (center, top)
 * - 7.1, 7.2: iOS press feedback (scale096, motion.buttonPress)
 * - 8.4: SwiftUI native RTL handling
 */
struct InputRadioBase: View {
    // MARK: - Properties
    
    /// Value for form submission and group identification (required)
    let value: String
    
    /// Label text (required for accessibility)
    let label: String
    
    /// Currently selected value in the group (binding for two-way data flow)
    /// When selectedValue == value, this radio is selected
    @Binding var selectedValue: String?
    
    /// Size variant
    var size: RadioSize
    
    /// Vertical alignment of label relative to radio circle
    var labelAlign: RadioLabelAlignment
    
    /// Helper text displayed below radio (persistent)
    var helperText: String?
    
    /// Error message displayed below helper text (conditional)
    var errorMessage: String?
    
    /// Called when radio is selected
    var onSelect: ((String) -> Void)?
    
    /// Test ID for automated testing
    var testID: String?
    
    // MARK: - State
    
    /// Tracks pressed state for scale transform animation
    @State private var isPressed = false
    
    /// Environment for reduce motion preference
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    
    // MARK: - Computed Properties
    
    /// Whether this radio is currently selected
    var isSelected: Bool {
        selectedValue == value
    }
    
    // MARK: - Initialization
    
    /**
     * Initialize InputRadioBase with all properties.
     * 
     * - Parameters:
     *   - value: Value for form submission (required)
     *   - label: Label text (required)
     *   - selectedValue: Binding to selected value in group
     *   - size: Size variant (default: .md)
     *   - labelAlign: Label alignment (default: .center)
     *   - helperText: Optional helper text
     *   - errorMessage: Optional error message
     *   - onSelect: Optional select callback
     *   - testID: Optional test identifier
     */
    init(
        value: String,
        label: String,
        selectedValue: Binding<String?>,
        size: RadioSize = .md,
        labelAlign: RadioLabelAlignment = .center,
        helperText: String? = nil,
        errorMessage: String? = nil,
        onSelect: ((String) -> Void)? = nil,
        testID: String? = nil
    ) {
        self.value = value
        self.label = label
        self._selectedValue = selectedValue
        self.size = size
        self.labelAlign = labelAlign
        self.helperText = helperText
        self.errorMessage = errorMessage
        self.onSelect = onSelect
        self.testID = testID
    }
    
    // MARK: - Body
    
    var body: some View {
        VStack(alignment: .leading, spacing: DesignTokens.spaceGroupedTight) {
            // Main radio row
            Button(action: selectRadio) {
                HStack(alignment: labelAlign.verticalAlignment, spacing: size.gap) {
                    radioCircle
                    labelContent
                }
            }
            .buttonStyle(PlainButtonStyle())
            .simultaneousGesture(pressGesture)
            // MARK: - Accessibility (Requirements 6.1-6.6)
            // Requirement 6.1: Associate label with radio via accessibility label
            .accessibilityElement(children: .combine)
            .accessibilityLabel(label)
            // Requirement 6.2: Screen reader announces state (selected/not selected)
            .accessibilityValue(isSelected ? "selected" : "not selected")
            // Accessibility hint provides context about the action
            .accessibilityHint(isSelected ? "Already selected" : "Double tap to select")
            // Use isButton trait - SwiftUI handles selection behavior via accessibilityValue
            .accessibilityAddTraits(.isButton)
            .accessibilityIdentifier(testID ?? "")
            // Requirement 6.6: Minimum 44pt touch target for mobile accessibility
            // Ensures WCAG 2.5.5 Target Size compliance
            .frame(minHeight: DesignTokens.tapAreaMinimum)
            // Extend touch target to full frame for easier interaction
            .contentShape(Rectangle())
            
            // Helper text and error message
            // @see Requirements 5.1-5.6 - Helper text and error messages
            if helperText != nil || errorMessage != nil {
                VStack(alignment: .leading, spacing: DesignTokens.spaceGroupedMinimal) {
                    if let helperText = helperText {
                        Text(helperText)
                            .font(.system(size: DesignTokens.fontSize050, weight: .regular))
                            .foregroundColor(Color(DesignTokens.colorTextMuted))
                            .accessibilityLabel("Helper: \(helperText)")
                            .accessibilityIdentifier("\(testID ?? "radio")-helper")
                    }
                    
                    if let errorMessage = errorMessage {
                        Text(errorMessage)
                            .font(.system(size: DesignTokens.fontSize050, weight: .regular))
                            .foregroundColor(Color(DesignTokens.colorFeedbackErrorText))
                            .accessibilityLabel("Error: \(errorMessage)")
                            .accessibilityIdentifier("\(testID ?? "radio")-error")
                    }
                }
                .padding(.leading, size.circleSize + size.gap)
            }
        }
    }
    
    // MARK: - Radio Circle View
    
    /// The radio circle with border and dot indicator
    /// @see Requirements 1.1-1.7 - Radio states
    /// @see Requirements 4.1-4.6 - Selection indicator (dot)
    private var radioCircle: some View {
        ZStack {
            // Outer circle border
            Circle()
                .stroke(borderColor, lineWidth: DesignTokens.borderEmphasis)
                .frame(width: size.circleSize, height: size.circleSize)
            
            // Inner dot when selected
            // @see Requirement 4.1-4.4 - Dot indicator
            if isSelected {
                Circle()
                    .fill(Color(DesignTokens.colorFeedbackSelectBackgroundRest))
                    .frame(width: size.dotSize, height: size.dotSize)
                    .transition(.scale)
            }
        }
        // @see Requirement 7.1 - iOS press feedback with scale096 token
        .scaleEffect(isPressed ? DesignTokens.scale096 : 1.0)
        // @see Requirement 7.2 - Animation using motion.buttonPress timing (150ms)
        .animation(
            reduceMotion ? .none : .easeOut(duration: DesignTokens.MotionButtonPress.duration),
            value: isPressed
        )
        // @see Requirement 1.6 - State change animation using motion.selectionTransition (250ms)
        .animation(
            reduceMotion ? .none : .easeInOut(duration: DesignTokens.MotionSelectionTransition.duration),
            value: isSelected
        )
    }
    
    // MARK: - Label Content View
    
    /// The label text with appropriate typography
    /// @see Requirements 2.4-2.6 - Label typography
    private var labelContent: some View {
        Text(label)
            .font(.system(size: size.labelFontSize, weight: .medium))
            .foregroundColor(Color(DesignTokens.colorTextDefault))
            .fixedSize(horizontal: false, vertical: true)
    }
    
    // MARK: - Computed Properties
    
    /// Border color based on state (error or default)
    /// @see Requirements 1.1-1.5 - State colors
    private var borderColor: Color {
        if errorMessage != nil {
            // @see Requirement 1.5 - Error border color
            return Color(DesignTokens.colorFeedbackErrorBorder)
        } else if isSelected {
            // @see Requirement 1.2 - Selected border color
            return Color(DesignTokens.colorFeedbackSelectBorderRest)
        } else {
            // @see Requirement 1.1 - Unselected border color
            return Color(DesignTokens.colorFeedbackSelectBorderDefault)
        }
    }
    
    // MARK: - Gestures
    
    /// Press gesture for scale feedback
    /// @see Requirements 7.1, 7.2 - iOS press feedback
    private var pressGesture: some Gesture {
        DragGesture(minimumDistance: 0)
            .onChanged { _ in
                isPressed = true
            }
            .onEnded { _ in
                isPressed = false
            }
    }
    
    // MARK: - Actions
    
    /// Select this radio (sets selectedValue to this radio's value)
    private func selectRadio() {
        selectedValue = value
        onSelect?(value)
    }
}

// MARK: - Preview

#if DEBUG
struct InputRadioBase_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 32) {
                // Size variants
                Text("Size Variants")
                    .font(.headline)
                
                VStack(alignment: .leading, spacing: 16) {
                    PreviewRadio(value: "sm", label: "Small radio", size: .sm)
                    PreviewRadio(value: "md", label: "Medium radio (default)", size: .md)
                    PreviewRadio(value: "lg", label: "Large radio", size: .lg)
                }
                
                Divider()
                
                // States
                Text("States")
                    .font(.headline)
                
                VStack(alignment: .leading, spacing: 16) {
                    PreviewRadio(value: "unselected", label: "Unselected", initialSelected: nil)
                    PreviewRadio(value: "selected", label: "Selected", initialSelected: "selected")
                    PreviewRadio(value: "error", label: "Error state", errorMessage: "This field is required")
                }
                
                Divider()
                
                // Label alignment
                Text("Label Alignment")
                    .font(.headline)
                
                VStack(alignment: .leading, spacing: 16) {
                    PreviewRadio(
                        value: "center",
                        label: "Center aligned (default)",
                        labelAlign: .center
                    )
                    PreviewRadio(
                        value: "top",
                        label: "This is a multi-line label that demonstrates top alignment for longer text content",
                        labelAlign: .top,
                        size: .lg
                    )
                }
                
                Divider()
                
                // Helper text and error
                Text("Helper Text & Error")
                    .font(.headline)
                
                VStack(alignment: .leading, spacing: 16) {
                    PreviewRadio(
                        value: "helper",
                        label: "With helper text",
                        helperText: "This is helpful information"
                    )
                    PreviewRadio(
                        value: "error-msg",
                        label: "With error message",
                        errorMessage: "You must select an option"
                    )
                    PreviewRadio(
                        value: "both",
                        label: "With both",
                        helperText: "Please read carefully",
                        errorMessage: "This field is required"
                    )
                }
                
                Divider()
                
                // Radio group example
                Text("Radio Group Example")
                    .font(.headline)
                
                PreviewRadioGroup()
            }
            .padding()
        }
    }
}

/// Helper view for previews with internal state
private struct PreviewRadio: View {
    let value: String
    let label: String
    var size: RadioSize = .md
    var labelAlign: RadioLabelAlignment = .center
    var initialSelected: String? = nil
    var helperText: String? = nil
    var errorMessage: String? = nil
    
    @State private var selectedValue: String?
    
    init(
        value: String,
        label: String,
        size: RadioSize = .md,
        labelAlign: RadioLabelAlignment = .center,
        initialSelected: String? = nil,
        helperText: String? = nil,
        errorMessage: String? = nil
    ) {
        self.value = value
        self.label = label
        self.size = size
        self.labelAlign = labelAlign
        self.initialSelected = initialSelected
        self.helperText = helperText
        self.errorMessage = errorMessage
        self._selectedValue = State(initialValue: initialSelected)
    }
    
    var body: some View {
        InputRadioBase(
            value: value,
            label: label,
            selectedValue: $selectedValue,
            size: size,
            labelAlign: labelAlign,
            helperText: helperText,
            errorMessage: errorMessage,
            onSelect: { selected in
                print("Radio '\(label)' selected with value: \(selected)")
            }
        )
    }
}

/// Helper view for demonstrating radio group behavior
private struct PreviewRadioGroup: View {
    @State private var selectedPlan: String? = "basic"
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Select a plan:")
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            InputRadioBase(
                value: "basic",
                label: "Basic Plan - $9/month",
                selectedValue: $selectedPlan,
                helperText: "For individuals"
            )
            
            InputRadioBase(
                value: "pro",
                label: "Pro Plan - $19/month",
                selectedValue: $selectedPlan,
                helperText: "For small teams"
            )
            
            InputRadioBase(
                value: "enterprise",
                label: "Enterprise Plan - $49/month",
                selectedValue: $selectedPlan,
                size: .lg,
                helperText: "For large organizations"
            )
            
            Text("Selected: \(selectedPlan ?? "None")")
                .font(.caption)
                .foregroundColor(.secondary)
                .padding(.top, DesignTokens.spaceGroupedNormal) /* space.grouped.normal */
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}
#endif
