/**
 * Input-Text-Base iOS Component
 * 
 * iOS platform implementation of the Input-Text-Base component using SwiftUI.
 * Implements float label pattern with animated transitions using motion.floatLabel token.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Base
 * 
 * Features:
 * - Float label animation (labelMd → labelMdFloat)
 * - Color animation (text.subtle → primary with blend.focusSaturate)
 * - Offset animation (translateY)
 * - Trailing icon support (error, success, info)
 * - Respects accessibilityReduceMotion
 * - WCAG 2.1 AA compliant
 * - Uses theme-aware blend utilities for state colors (focus, disabled)
 * 
 * Behavioral Contracts:
 * - focusable: Can receive keyboard focus
 * - float_label_animation: Label animates on focus
 * - validates_on_blur: Validation triggers on blur
 * - error_state_display: Shows error message and styling
 * - success_state_display: Shows success styling
 * - disabled_state: Prevents interaction when disabled
 * - trailing_icon_display: Shows contextual trailing icons
 * - focus_ring: WCAG 2.4.7 focus visible indicator
 * - reduced_motion_support: Respects prefers-reduced-motion
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.5, 4.1, 4.2, 4.3, 8.1, 8.2, 8.4, 11.1, 11.2, 11.3, 13.1
 */

import SwiftUI

/**
 * Input-Text-Base SwiftUI View
 * 
 * Implements the float label pattern with animated transitions.
 * Uses generated design tokens for consistent styling across platforms.
 */
struct InputTextBase: View {
    // MARK: - Properties
    
    /// Unique identifier for the input
    let id: String
    
    /// Label text (floats between placeholder and floated positions)
    let label: String
    
    /// Current input value
    @Binding var value: String
    
    /// Callback when value changes
    let onChange: ((String) -> Void)?
    
    /// Callback when input receives focus
    let onFocus: (() -> Void)?
    
    /// Callback when input loses focus
    let onBlur: (() -> Void)?
    
    /// Helper text displayed below input (persistent)
    let helperText: String?
    
    /// Error message displayed below helper text (conditional)
    let errorMessage: String?
    
    /// Success state indicator
    let isSuccess: Bool
    
    /// Info icon support
    let showInfoIcon: Bool
    
    /// Input type
    let type: InputType
    
    /// Autocomplete type
    let autocomplete: UITextContentType?
    
    /// Placeholder text (only shown when label is floated and input is empty)
    let placeholder: String?
    
    /// Read-only state
    let readOnly: Bool
    
    /// Required field indicator
    let required: Bool
    
    /// Maximum length for input value
    let maxLength: Int?
    
    /// Disabled state
    let isDisabled: Bool
    
    // MARK: - State
    
    /// Whether input currently has focus
    @FocusState private var isFocused: Bool
    
    /// Whether reduce motion is enabled
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    
    /// Whether label animation has completed (for icon timing coordination)
    @State private var labelAnimationComplete: Bool = true
    
    // MARK: - Computed Properties
    
    /// Whether input has content
    private var isFilled: Bool {
        !value.isEmpty
    }
    
    /// Whether input has error
    private var hasError: Bool {
        errorMessage != nil
    }
    
    /// Whether label should be floated
    private var isLabelFloated: Bool {
        isFocused || isFilled
    }
    
    /// Label font size based on floated state
    private var labelFont: Font {
        if isLabelFloated {
            return Font.system(size: DesignTokens.typography.labelMdFloat.fontSize)
                .weight(DesignTokens.typography.labelMdFloat.fontWeight)
        } else {
            return Font.system(size: DesignTokens.typography.labelMd.fontSize)
                .weight(DesignTokens.typography.labelMd.fontWeight)
        }
    }
    
    /// Label color based on state
    private var labelColor: Color {
        if hasError {
            return Color(DesignTokens.color.error.strong)
        } else if isSuccess {
            return Color(DesignTokens.color.success.strong)
        } else if isDisabled {
            return Color(DesignTokens.color.primary).disabledBlend()
        } else if isFocused {
            return Color(DesignTokens.color.primary).focusBlend()
        } else {
            return Color(DesignTokens.color.text.muted)
        }
    }
    
    /// Label vertical offset based on floated state
    private var labelOffset: CGFloat {
        if isLabelFloated {
            return -(DesignTokens.typography.labelMd.lineHeight + DesignTokens.space.grouped.tight)
        } else {
            return 0
        }
    }
    
    /// Border color based on state
    private var borderColor: Color {
        if hasError {
            return Color(DesignTokens.color.error.strong)
        } else if isSuccess {
            return Color(DesignTokens.color.success.strong)
        } else if isDisabled {
            return Color(DesignTokens.color.primary).disabledBlend()
        } else if isFocused {
            return Color(DesignTokens.color.primary).focusBlend()
        } else {
            return Color(DesignTokens.color.border)
        }
    }
    
    /// Whether to show error icon (after label animation completes)
    private var showErrorIcon: Bool {
        hasError && isLabelFloated && labelAnimationComplete
    }
    
    /// Whether to show success icon (after label animation completes)
    private var showSuccessIcon: Bool {
        isSuccess && isLabelFloated && labelAnimationComplete
    }
    
    /// Whether to show info icon (after label animation completes)
    private var showInfoIconVisible: Bool {
        showInfoIcon && (isFocused || isFilled) && labelAnimationComplete
    }
    
    // MARK: - Body
    
    var body: some View {
        VStack(alignment: .leading, spacing: spaceGroupedMinimal) {
            // Input wrapper with label and trailing icon
            HStack(alignment: .center, spacing: 0) {
                ZStack(alignment: .leading) {
                    // Label
                    Text(label + (required ? " *" : ""))
                        .font(labelFont)
                        .foregroundColor(labelColor)
                        .offset(y: labelOffset)
                        .animation(
                            reduceMotion ? .none : Animation.timingCurve(0.4, 0.0, 0.2, 1.0, duration: DesignTokens.motion.floatLabel.duration),
                            value: isLabelFloated
                        )
                        .allowsHitTesting(false)
                        .onChange(of: isLabelFloated) { _ in
                            labelAnimationComplete = false
                            DispatchQueue.main.asyncAfter(deadline: .now() + DesignTokens.motion.floatLabel.duration) {
                                labelAnimationComplete = true
                            }
                        }
                    
                    // Input field
                    if type == .password {
                        SecureField(isLabelFloated && placeholder != nil ? placeholder! : "", text: $value)
                            .textFieldStyle(InputTextBaseFieldStyle(
                                borderColor: borderColor,
                                isFocused: isFocused,
                                hasError: hasError,
                                isSuccess: isSuccess,
                                isDisabled: isDisabled,
                                hasTrailingIcon: showErrorIcon || showSuccessIcon || showInfoIconVisible
                            ))
                            .focused($isFocused)
                            .disabled(readOnly || isDisabled)
                            .textContentType(autocomplete)
                            .onChange(of: value) { newValue in
                                if let maxLength = maxLength, newValue.count > maxLength {
                                    value = String(newValue.prefix(maxLength))
                                }
                                onChange?(value)
                            }
                            .onChange(of: isFocused) { focused in
                                if focused {
                                    onFocus?()
                                } else {
                                    onBlur?()
                                }
                            }
                    } else {
                        TextField(isLabelFloated && placeholder != nil ? placeholder! : "", text: $value)
                            .textFieldStyle(InputTextBaseFieldStyle(
                                borderColor: borderColor,
                                isFocused: isFocused,
                                hasError: hasError,
                                isSuccess: isSuccess,
                                isDisabled: isDisabled,
                                hasTrailingIcon: showErrorIcon || showSuccessIcon || showInfoIconVisible
                            ))
                            .focused($isFocused)
                            .disabled(readOnly || isDisabled)
                            .textContentType(autocomplete)
                            .keyboardType(keyboardTypeForInputType(type))
                            .onChange(of: value) { newValue in
                                if let maxLength = maxLength, newValue.count > maxLength {
                                    value = String(newValue.prefix(maxLength))
                                }
                                onChange?(value)
                            }
                            .onChange(of: isFocused) { focused in
                                if focused {
                                    onFocus?()
                                } else {
                                    onBlur?()
                                }
                            }
                    }
                }
                
                // Trailing icon (error, success, or info)
                if showErrorIcon {
                    Icon(name: "x", size: DesignTokens.icon.size100, color: Color(DesignTokens.color.error.strong))
                        .padding(.trailing, DesignTokens.space.inset.100)
                        .transition(.opacity)
                        .animation(
                            reduceMotion ? .none : Animation.timingCurve(0.4, 0.0, 0.2, 1.0, duration: DesignTokens.motion.floatLabel.duration),
                            value: showErrorIcon
                        )
                } else if showSuccessIcon {
                    Icon(name: "check", size: DesignTokens.icon.size100, color: Color(DesignTokens.color.success.strong))
                        .padding(.trailing, DesignTokens.space.inset.100)
                        .transition(.opacity)
                        .animation(
                            reduceMotion ? .none : Animation.timingCurve(0.4, 0.0, 0.2, 1.0, duration: DesignTokens.motion.floatLabel.duration),
                            value: showSuccessIcon
                        )
                } else if showInfoIconVisible {
                    Icon(name: "info", size: DesignTokens.icon.size100, color: Color(DesignTokens.color.text.muted))
                        .padding(.trailing, DesignTokens.space.inset.100)
                        .transition(.opacity)
                        .animation(
                            reduceMotion ? .none : Animation.timingCurve(0.4, 0.0, 0.2, 1.0, duration: DesignTokens.motion.floatLabel.duration),
                            value: showInfoIconVisible
                        )
                }
            }
            .frame(minHeight: DesignTokens.accessibility.tapArea.recommended)
            
            // Helper text (persistent)
            if let helperText = helperText {
                Text(helperText)
                    .font(Font.system(size: DesignTokens.typography.caption.fontSize)
                        .weight(DesignTokens.typography.caption.fontWeight))
                    .foregroundColor(Color(DesignTokens.color.text.muted))
                    .accessibilityIdentifier("\(id)-helper")
            }
            
            // Error message (conditional)
            if let errorMessage = errorMessage {
                Text(errorMessage)
                    .font(Font.system(size: DesignTokens.typography.caption.fontSize)
                        .weight(DesignTokens.typography.caption.fontWeight))
                    .foregroundColor(Color(DesignTokens.color.error.strong))
                    .accessibilityIdentifier("\(id)-error")
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(label)
        .accessibilityValue(value)
        .accessibilityHint(helperText ?? "")
    }
    
    // MARK: - Helper Methods
    
    private func keyboardTypeForInputType(_ type: InputType) -> UIKeyboardType {
        switch type {
        case .text:
            return .default
        case .email:
            return .emailAddress
        case .tel:
            return .phonePad
        case .url:
            return .URL
        case .password:
            return .default
        }
    }
}

// MARK: - Input Type Enum

/**
 * Input type enumeration
 */
enum InputType {
    case text
    case email
    case password
    case tel
    case url
}

// MARK: - Custom Text Field Style

/**
 * Custom text field style for consistent appearance
 */
struct InputTextBaseFieldStyle: TextFieldStyle {
    let borderColor: Color
    let isFocused: Bool
    let hasError: Bool
    let isSuccess: Bool
    let isDisabled: Bool
    let hasTrailingIcon: Bool
    
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .font(Font.system(size: DesignTokens.typography.input.fontSize)
                .weight(DesignTokens.typography.input.fontWeight))
            .foregroundColor(isDisabled ? Color(DesignTokens.color.text.muted) : Color(DesignTokens.color.text.default))
            .padding(.leading, DesignTokens.space.inset.100)
            .padding(.vertical, DesignTokens.space.inset.100)
            .padding(.trailing, hasTrailingIcon ? 0 : DesignTokens.space.inset.100)
            .background(Color(DesignTokens.color.background))
            .overlay(
                RoundedRectangle(cornerRadius: DesignTokens.radius150)
                    .stroke(borderColor, lineWidth: DesignTokens.border.default)
            )
            .overlay(
                RoundedRectangle(cornerRadius: DesignTokens.radius150)
                    .stroke(Color(DesignTokens.color.primary), lineWidth: DesignTokens.accessibility.focus.width)
                    .padding(-DesignTokens.accessibility.focus.offset)
                    .opacity(isFocused && !isDisabled ? 1 : 0)
                    .animation(
                        reduceMotion ? .none : Animation.timingCurve(0.4, 0.0, 0.2, 1.0, duration: DesignTokens.motion.focusTransition.duration),
                        value: isFocused
                    )
            )
    }
}

// MARK: - Preview

#if DEBUG
struct InputTextBase_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            InputTextBase(
                id: "preview-default",
                label: "Email",
                value: .constant(""),
                onChange: nil,
                onFocus: nil,
                onBlur: nil,
                helperText: "Enter your email address",
                errorMessage: nil,
                isSuccess: false,
                showInfoIcon: false,
                type: .email,
                autocomplete: .emailAddress,
                placeholder: nil,
                readOnly: false,
                required: false,
                maxLength: nil,
                isDisabled: false
            )
            
            InputTextBase(
                id: "preview-filled",
                label: "Email",
                value: .constant("user@example.com"),
                onChange: nil,
                onFocus: nil,
                onBlur: nil,
                helperText: "Enter your email address",
                errorMessage: nil,
                isSuccess: false,
                showInfoIcon: false,
                type: .email,
                autocomplete: .emailAddress,
                placeholder: nil,
                readOnly: false,
                required: false,
                maxLength: nil,
                isDisabled: false
            )
            
            InputTextBase(
                id: "preview-error",
                label: "Email",
                value: .constant("invalid"),
                onChange: nil,
                onFocus: nil,
                onBlur: nil,
                helperText: "Enter your email address",
                errorMessage: "Please enter a valid email address",
                isSuccess: false,
                showInfoIcon: false,
                type: .email,
                autocomplete: .emailAddress,
                placeholder: nil,
                readOnly: false,
                required: true,
                maxLength: nil,
                isDisabled: false
            )
            
            InputTextBase(
                id: "preview-success",
                label: "Email",
                value: .constant("user@example.com"),
                onChange: nil,
                onFocus: nil,
                onBlur: nil,
                helperText: "Enter your email address",
                errorMessage: nil,
                isSuccess: true,
                showInfoIcon: false,
                type: .email,
                autocomplete: .emailAddress,
                placeholder: nil,
                readOnly: false,
                required: false,
                maxLength: nil,
                isDisabled: false
            )
            
            InputTextBase(
                id: "preview-disabled",
                label: "Email",
                value: .constant("user@example.com"),
                onChange: nil,
                onFocus: nil,
                onBlur: nil,
                helperText: "This field is disabled",
                errorMessage: nil,
                isSuccess: false,
                showInfoIcon: false,
                type: .email,
                autocomplete: .emailAddress,
                placeholder: nil,
                readOnly: false,
                required: false,
                maxLength: nil,
                isDisabled: true
            )
        }
        .padding()
    }
}
#endif
