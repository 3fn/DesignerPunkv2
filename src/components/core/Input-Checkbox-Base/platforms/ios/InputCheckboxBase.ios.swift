/**
 * Input-Checkbox-Base Component for iOS Platform
 * 
 * Cross-platform checkbox component with three size variants (sm, md, lg),
 * configurable label alignment, and support for checked, unchecked, and indeterminate states.
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Input-Checkbox-Base
 * Component Type: Primitive (Base)
 * 
 * Follows True Native Architecture with platform-specific SwiftUI implementation
 * while maintaining API consistency with web and Android platforms.
 * 
 * Uses Icon-Base component for checkmark/minus icon rendering.
 * Uses theme-aware blend utilities for state colors.
 * 
 * Part of the DesignerPunk Form Inputs Component system.
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered.
 * 
 * @module Input-Checkbox-Base/platforms/ios
 * @see Requirements: 1.1-1.7, 2.1-2.9, 4.1-4.5, 7.1, 7.2, 8.4
 */

import SwiftUI

// MARK: - Enums

/**
 * Checkbox size variants
 * 
 * Defines three size options that follow the 8px baseline grid.
 * Each size determines icon size, inset padding, gap, and typography.
 * 
 * - sm: 24px box (16px icon + 4px inset × 2)
 * - md: 32px box (20px icon + 6px inset × 2)
 * - lg: 40px box (24px icon + 8px inset × 2)
 * 
 * @see Requirement 2.1-2.9 in .kiro/specs/046-input-checkbox-base/requirements.md
 */
enum CheckboxSize {
    case sm
    case md
    case lg
    
    /// Icon size token for this checkbox size
    /// @see Requirement 4.3 - Icon size matching checkbox size variant
    var iconSize: CGFloat {
        switch self {
        case .sm: return DesignTokens.iconSize050  // 16px
        case .md: return DesignTokens.iconSize075  // 20px
        case .lg: return DesignTokens.iconSize100  // 24px
        }
    }
    
    /// Inset padding for this checkbox size
    /// @see Requirement 2.1-2.3 - Box size calculations
    var inset: CGFloat {
        switch self {
        case .sm: return DesignTokens.spaceInset050  // 4px
        case .md: return DesignTokens.spaceInset075  // 6px
        case .lg: return DesignTokens.spaceInset100  // 8px
        }
    }
    
    /// Computed box size (icon + inset padding on both sides)
    /// @see Requirement 2.1-2.3 - Box size calculations
    var boxSize: CGFloat {
        return iconSize + (inset * 2)
    }
    
    /// Gap between checkbox box and label
    /// @see Requirement 2.7-2.8 - Gap tokens
    var gap: CGFloat {
        switch self {
        case .sm, .md: return DesignTokens.spaceGroupedNormal  // 8px
        case .lg: return DesignTokens.spaceGroupedLoose        // 12px
        }
    }
    
    /// Border radius for checkbox box
    /// @see Design document - radiusSubtle for sm, radiusSmall for md/lg
    var radius: CGFloat {
        switch self {
        case .sm: return DesignTokens.radiusSubtle  // 2px
        case .md, .lg: return DesignTokens.radiusSmall  // 4px
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
 * Label alignment options relative to checkbox box.
 * 
 * - center: Vertically centers the label with the checkbox box (default)
 * - top: Aligns the label to the top of the checkbox box (for multi-line labels)
 * 
 * @see Requirement 3.1-3.4 in .kiro/specs/046-input-checkbox-base/requirements.md
 */
enum LabelAlignment {
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

/**
 * Label typography override options.
 * 
 * Allows overriding the default label typography which normally matches the size variant.
 * This is primarily used by Input-Checkbox-Legal which needs lg box size with sm typography.
 * 
 * - inherit: Uses typography matching the size variant (default behavior)
 * - sm: Forces labelSm typography (14px) regardless of size
 * - md: Forces labelMd typography (16px) regardless of size
 * - lg: Forces labelLg typography (18px) regardless of size
 * 
 * @see Requirement 9.1 in .kiro/specs/046-input-checkbox-base/requirements.md
 */
enum LabelTypography {
    case inherit
    case sm
    case md
    case lg
    
    /// Font size for this typography option
    /// Returns nil for .inherit (use size variant's default)
    var fontSize: CGFloat? {
        switch self {
        case .inherit: return nil
        case .sm: return DesignTokens.fontSize075  // 14px (labelSm)
        case .md: return DesignTokens.fontSize100  // 16px (labelMd)
        case .lg: return DesignTokens.fontSize125  // 18px (labelLg)
        }
    }
}

// MARK: - InputCheckboxBase Component

/**
 * InputCheckboxBase component for iOS platform.
 * 
 * Renders a checkbox with SwiftUI Button component, supporting three size variants,
 * configurable label alignment, and checked/unchecked/indeterminate states.
 * 
 * Uses Icon-Base for checkmark/minus icon rendering and theme-aware blend utilities
 * for state colors.
 * 
 * Usage:
 * ```swift
 * // Basic usage with binding
 * @State private var isChecked = false
 * InputCheckboxBase(
 *     checked: $isChecked,
 *     label: "Accept terms"
 * )
 * 
 * // With size and alignment
 * InputCheckboxBase(
 *     checked: $isChecked,
 *     label: "Subscribe to newsletter",
 *     size: .lg,
 *     labelAlign: .top
 * )
 * 
 * // With helper text and error
 * InputCheckboxBase(
 *     checked: $isChecked,
 *     label: "I agree to the terms",
 *     helperText: "Please read the terms carefully",
 *     errorMessage: "You must accept the terms"
 * )
 * ```
 * 
 * Requirements:
 * - 1.1-1.7: Checkbox states (unchecked, checked, indeterminate, error)
 * - 2.1-2.9: Size variants (sm, md, lg)
 * - 3.1-3.4: Label alignment (center, top)
 * - 4.1-4.5: Icon-Base integration
 * - 7.1, 7.2: iOS press feedback (scale096, motion.buttonPress)
 * - 8.4: SwiftUI native RTL handling
 */
struct InputCheckboxBase: View {
    // MARK: - Properties
    
    /// Whether checkbox is checked (binding for two-way data flow)
    @Binding var checked: Bool
    
    /// Indeterminate state (overrides checked visually)
    var indeterminate: Bool
    
    /// Label text (required for accessibility)
    let label: String
    
    /// Size variant
    var size: CheckboxSize
    
    /// Vertical alignment of label relative to checkbox box
    var labelAlign: LabelAlignment
    
    /// Override label typography independent of size variant
    /// When .inherit (default), uses typography matching the size variant
    /// @see Requirement 9.1 - Legal uses lg box + labelSm typography
    var labelTypography: LabelTypography
    
    /// Helper text displayed below checkbox (persistent)
    var helperText: String?
    
    /// Error message displayed below helper text (conditional)
    var errorMessage: String?
    
    /// Called when checkbox state changes
    var onChange: ((Bool) -> Void)?
    
    /// Test ID for automated testing
    var testID: String?
    
    // MARK: - State
    
    /// Tracks pressed state for scale transform animation
    @State private var isPressed = false
    
    /// Environment for reduce motion preference
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    
    // MARK: - Initialization
    
    /**
     * Initialize InputCheckboxBase with all properties.
     * 
     * - Parameters:
     *   - checked: Binding to checked state
     *   - indeterminate: Indeterminate state (default: false)
     *   - label: Label text (required)
     *   - size: Size variant (default: .md)
     *   - labelAlign: Label alignment (default: .center)
     *   - labelTypography: Typography override (default: .inherit)
     *   - helperText: Optional helper text
     *   - errorMessage: Optional error message
     *   - onChange: Optional change callback
     *   - testID: Optional test identifier
     */
    init(
        checked: Binding<Bool>,
        indeterminate: Bool = false,
        label: String,
        size: CheckboxSize = .md,
        labelAlign: LabelAlignment = .center,
        labelTypography: LabelTypography = .inherit,
        helperText: String? = nil,
        errorMessage: String? = nil,
        onChange: ((Bool) -> Void)? = nil,
        testID: String? = nil
    ) {
        self._checked = checked
        self.indeterminate = indeterminate
        self.label = label
        self.size = size
        self.labelAlign = labelAlign
        self.labelTypography = labelTypography
        self.helperText = helperText
        self.errorMessage = errorMessage
        self.onChange = onChange
        self.testID = testID
    }
    
    // MARK: - Body
    
    var body: some View {
        VStack(alignment: .leading, spacing: DesignTokens.spaceGroupedTight) {
            // Main checkbox row
            Button(action: toggleChecked) {
                HStack(alignment: labelAlign.verticalAlignment, spacing: size.gap) {
                    checkboxBox
                    labelText
                }
            }
            .buttonStyle(PlainButtonStyle())
            .simultaneousGesture(pressGesture)
            // MARK: - Accessibility (Requirements 6.1-6.6)
            // Requirement 6.1: Associate label with checkbox via accessibility label
            .accessibilityElement(children: .combine)
            .accessibilityLabel(label)
            // Requirement 6.2: Screen reader announces state (checked/unchecked/partially checked)
            .accessibilityValue(accessibilityState)
            // Accessibility hint provides context about the action
            .accessibilityHint(accessibilityHint)
            // Use isButton trait - SwiftUI handles toggle behavior via accessibilityValue
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
                            .accessibilityIdentifier("\(testID ?? "checkbox")-helper")
                    }
                    
                    if let errorMessage = errorMessage {
                        Text(errorMessage)
                            .font(.system(size: DesignTokens.fontSize050, weight: .regular))
                            .foregroundColor(Color(DesignTokens.colorFeedbackErrorText))
                            .accessibilityLabel("Error: \(errorMessage)")
                            .accessibilityIdentifier("\(testID ?? "checkbox")-error")
                    }
                }
                .padding(.leading, size.boxSize + size.gap)
            }
        }
    }
    
    // MARK: - Checkbox Box View
    
    /// The checkbox box with border, background, and icon
    /// @see Requirements 1.1-1.7 - Checkbox states
    private var checkboxBox: some View {
        ZStack {
            // Border/background rectangle
            RoundedRectangle(cornerRadius: size.radius)
                .stroke(borderColor, lineWidth: DesignTokens.borderEmphasis)
                .frame(width: size.boxSize, height: size.boxSize)
            
            // Filled background when checked or indeterminate
            if checked || indeterminate {
                RoundedRectangle(cornerRadius: size.radius)
                    .fill(Color(DesignTokens.colorFeedbackSelectBackgroundRest))
                    .frame(width: size.boxSize, height: size.boxSize)
                
                // Icon (check or minus)
                IconBase(
                    name: indeterminate ? "minus" : "check",
                    size: size.iconSize,
                    color: Color(DesignTokens.colorContrastOnDark)
                )
            }
        }
        .scaleEffect(isPressed ? DesignTokens.scale096 : 1.0)
        .animation(
            reduceMotion ? .none : .easeOut(duration: DesignTokens.MotionButtonPress.duration),
            value: isPressed
        )
        .animation(
            reduceMotion ? .none : .easeInOut(duration: DesignTokens.MotionSelectionTransition.duration),
            value: checked
        )
        .animation(
            reduceMotion ? .none : .easeInOut(duration: DesignTokens.MotionSelectionTransition.duration),
            value: indeterminate
        )
    }
    
    // MARK: - Label Text View
    
    /// The label text with appropriate typography
    /// Uses labelTypography override if specified, otherwise uses size variant's default
    /// @see Requirements 2.4-2.6 - Label typography
    /// @see Requirement 9.1 - Legal uses lg box + labelSm typography
    private var labelText: some View {
        Text(label)
            .font(.system(size: effectiveLabelFontSize, weight: .medium))
            .foregroundColor(Color(DesignTokens.colorTextDefault))
            .fixedSize(horizontal: false, vertical: true)
    }
    
    /// Computed font size for label, respecting typography override
    private var effectiveLabelFontSize: CGFloat {
        // If labelTypography is not .inherit, use its explicit font size
        if let overrideFontSize = labelTypography.fontSize {
            return overrideFontSize
        }
        // Otherwise, use the size variant's default typography
        return size.labelFontSize
    }
    
    // MARK: - Computed Properties
    
    /// Border color based on state (error or default)
    /// @see Requirements 1.4, 1.6 - Hover and error states
    private var borderColor: Color {
        if errorMessage != nil {
            return Color(DesignTokens.colorFeedbackErrorBorder)
        } else if checked || indeterminate {
            return Color(DesignTokens.colorFeedbackSelectBorderRest)
        } else {
            return Color(DesignTokens.colorFeedbackSelectBorderDefault)
        }
    }
    
    /// Accessibility state description
    /// @see Requirement 6.2 - Screen reader announcements
    private var accessibilityState: String {
        if indeterminate {
            return "partially checked"
        } else if checked {
            return "checked"
        } else {
            return "unchecked"
        }
    }
    
    /// Accessibility hint providing action context
    /// @see Requirement 6.4 - Keyboard/tap interaction guidance
    private var accessibilityHint: String {
        if indeterminate {
            return "Double tap to check"
        } else if checked {
            return "Double tap to uncheck"
        } else {
            return "Double tap to check"
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
    
    /// Toggle checkbox state
    private func toggleChecked() {
        let newValue = !checked
        checked = newValue
        onChange?(newValue)
    }
}

// MARK: - Preview

#if DEBUG
struct InputCheckboxBase_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 32) {
                // Size variants
                Text("Size Variants")
                    .font(.headline)
                
                VStack(alignment: .leading, spacing: 16) {
                    PreviewCheckbox(label: "Small checkbox", size: .sm)
                    PreviewCheckbox(label: "Medium checkbox (default)", size: .md)
                    PreviewCheckbox(label: "Large checkbox", size: .lg)
                }
                
                Divider()
                
                // States
                Text("States")
                    .font(.headline)
                
                VStack(alignment: .leading, spacing: 16) {
                    PreviewCheckbox(label: "Unchecked", initialChecked: false)
                    PreviewCheckbox(label: "Checked", initialChecked: true)
                    PreviewCheckbox(label: "Indeterminate", indeterminate: true)
                    PreviewCheckbox(label: "Error state", errorMessage: "This field is required")
                }
                
                Divider()
                
                // Label alignment
                Text("Label Alignment")
                    .font(.headline)
                
                VStack(alignment: .leading, spacing: 16) {
                    PreviewCheckbox(
                        label: "Center aligned (default)",
                        labelAlign: .center
                    )
                    PreviewCheckbox(
                        label: "This is a multi-line label that demonstrates top alignment for longer text content",
                        labelAlign: .top,
                        size: .lg
                    )
                }
                
                Divider()
                
                // Typography override (for Legal checkbox pattern)
                Text("Typography Override")
                    .font(.headline)
                
                VStack(alignment: .leading, spacing: 16) {
                    PreviewCheckbox(
                        label: "Large box with default (lg) typography",
                        size: .lg
                    )
                    PreviewCheckbox(
                        label: "Large box with small typography (Legal pattern)",
                        size: .lg,
                        labelTypography: .sm
                    )
                    PreviewCheckbox(
                        label: "Medium box with large typography",
                        size: .md,
                        labelTypography: .lg
                    )
                }
                
                Divider()
                
                // Helper text and error
                Text("Helper Text & Error")
                    .font(.headline)
                
                VStack(alignment: .leading, spacing: 16) {
                    PreviewCheckbox(
                        label: "With helper text",
                        helperText: "This is helpful information"
                    )
                    PreviewCheckbox(
                        label: "With error message",
                        errorMessage: "You must accept the terms"
                    )
                    PreviewCheckbox(
                        label: "With both",
                        helperText: "Please read carefully",
                        errorMessage: "This field is required"
                    )
                }
            }
            .padding()
        }
    }
}

/// Helper view for previews with internal state
private struct PreviewCheckbox: View {
    let label: String
    var size: CheckboxSize = .md
    var labelAlign: LabelAlignment = .center
    var labelTypography: LabelTypography = .inherit
    var initialChecked: Bool = false
    var indeterminate: Bool = false
    var helperText: String? = nil
    var errorMessage: String? = nil
    
    @State private var isChecked: Bool
    
    init(
        label: String,
        size: CheckboxSize = .md,
        labelAlign: LabelAlignment = .center,
        labelTypography: LabelTypography = .inherit,
        initialChecked: Bool = false,
        indeterminate: Bool = false,
        helperText: String? = nil,
        errorMessage: String? = nil
    ) {
        self.label = label
        self.size = size
        self.labelAlign = labelAlign
        self.labelTypography = labelTypography
        self.initialChecked = initialChecked
        self.indeterminate = indeterminate
        self.helperText = helperText
        self.errorMessage = errorMessage
        self._isChecked = State(initialValue: initialChecked)
    }
    
    var body: some View {
        InputCheckboxBase(
            checked: $isChecked,
            indeterminate: indeterminate,
            label: label,
            size: size,
            labelAlign: labelAlign,
            labelTypography: labelTypography,
            helperText: helperText,
            errorMessage: errorMessage,
            onChange: { checked in
                print("Checkbox '\(label)' changed to: \(checked)")
            }
        )
    }
}
#endif
