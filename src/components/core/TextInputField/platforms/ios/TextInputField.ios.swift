/**
 * TextInputField iOS Component
 * 
 * iOS platform implementation of the TextInputField component using SwiftUI.
 * Implements float label pattern with animated transitions using motion.floatLabel token.
 * 
 * Features:
 * - Float label animation (labelMd → labelMdFloat)
 * - Color animation (text.subtle → primary)
 * - Offset animation (translateY)
 * - Trailing icon support (error, success, info)
 * - Respects accessibilityReduceMotion
 * - WCAG 2.1 AA compliant
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.5, 4.1, 4.2, 4.3, 8.4
 */

import SwiftUI

/**
 * TextInputField SwiftUI View
 * 
 * Implements the float label pattern with animated transitions.
 * Uses generated design tokens for consistent styling across platforms.
 */
struct TextInputField: View {
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
            // labelMdFloat: 14pt (scale088 × fontSize100)
            return Font.system(size: typographyLabelMdFloatFontSize)
                .weight(typographyLabelMdFloatFontWeight)
        } else {
            // labelMd: 16pt
            return Font.system(size: typographyLabelMdFontSize)
                .weight(typographyLabelMdFontWeight)
        }
    }
    
    /// Label color based on state
    private var labelColor: Color {
        if hasError {
            return colorError
        } else if isSuccess {
            return colorSuccessStrong
        } else if isFocused {
            return colorPrimary
        } else {
            return colorTextMuted
        }
    }
    
    /// Label vertical offset based on floated state
    private var labelOffset: CGFloat {
        if isLabelFloated {
            // Float above input with grouped.tight spacing
            return -(typographyLabelMdLineHeight + spaceGroupedTight)
        } else {
            // Center inside input
            return 0
        }
    }
    
    /// Border color based on state
    private var borderColor: Color {
        if hasError {
            return colorError
        } else if isSuccess {
            return colorSuccessStrong
        } else if isFocused {
            return colorPrimary
        } else {
            return colorBorder
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
                            reduceMotion ? .none : motionFloatLabel,
                            value: isLabelFloated
                        )
                        .allowsHitTesting(false) // Label doesn't intercept touches
                        .onChange(of: isLabelFloated) { _ in
                            // Mark animation as incomplete when label starts animating
                            labelAnimationComplete = false
                            
                            // Mark animation as complete after motion.floatLabel duration
                            DispatchQueue.main.asyncAfter(deadline: .now() + motionFloatLabelDuration) {
                                labelAnimationComplete = true
                            }
                        }
                    
                    // Input field
                    if type == .password {
                        SecureField(isLabelFloated && placeholder != nil ? placeholder! : "", text: $value)
                            .textFieldStyle(CustomTextFieldStyle(
                                borderColor: borderColor,
                                isFocused: isFocused,
                                hasError: hasError,
                                isSuccess: isSuccess,
                                hasTrailingIcon: showErrorIcon || showSuccessIcon || showInfoIconVisible
                            ))
                            .focused($isFocused)
                            .disabled(readOnly)
                            .textContentType(autocomplete)
                            .onChange(of: value) { newValue in
                                // Enforce max length
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
                            .textFieldStyle(CustomTextFieldStyle(
                                borderColor: borderColor,
                                isFocused: isFocused,
                                hasError: hasError,
                                isSuccess: isSuccess,
                                hasTrailingIcon: showErrorIcon || showSuccessIcon || showInfoIconVisible
                            ))
                            .focused($isFocused)
                            .disabled(readOnly)
                            .textContentType(autocomplete)
                            .keyboardType(keyboardTypeForInputType(type))
                            .onChange(of: value) { newValue in
                                // Enforce max length
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
                    Icon(name: "x", size: 24, color: colorError)
                        .padding(.trailing, spaceInset100)
                        .transition(.opacity)
                        .animation(
                            reduceMotion ? .none : motionFloatLabel,
                            value: showErrorIcon
                        )
                } else if showSuccessIcon {
                    Icon(name: "check", size: 24, color: colorSuccessStrong)
                        .padding(.trailing, spaceInset100)
                        .transition(.opacity)
                        .animation(
                            reduceMotion ? .none : motionFloatLabel,
                            value: showSuccessIcon
                        )
                } else if showInfoIconVisible {
                    Icon(name: "info", size: 24, color: colorTextMuted)
                        .padding(.trailing, spaceInset100)
                        .transition(.opacity)
                        .animation(
                            reduceMotion ? .none : motionFloatLabel,
                            value: showInfoIconVisible
                        )
                }
            }
            .frame(minHeight: tapAreaRecommended) // WCAG minimum touch target
            
            // Helper text (persistent)
            if let helperText = helperText {
                Text(helperText)
                    .font(Font.system(size: typographyCaptionFontSize)
                        .weight(typographyCaptionFontWeight))
                    .foregroundColor(colorTextMuted)
                    .accessibilityIdentifier("\(id)-helper")
            }
            
            // Error message (conditional)
            if let errorMessage = errorMessage {
                Text(errorMessage)
                    .font(Font.system(size: typographyCaptionFontSize)
                        .weight(typographyCaptionFontWeight))
                    .foregroundColor(colorError)
                    .accessibilityIdentifier("\(id)-error")
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(label)
        .accessibilityValue(value)
        .accessibilityHint(helperText ?? "")
    }
    
    // MARK: - Helper Methods
    
    /// Get keyboard type for input type
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
struct CustomTextFieldStyle: TextFieldStyle {
    let borderColor: Color
    let isFocused: Bool
    let hasError: Bool
    let isSuccess: Bool
    let hasTrailingIcon: Bool
    
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .font(Font.system(size: typographyInputFontSize)
                .weight(typographyInputFontWeight))
            .foregroundColor(colorTextDefault)
            .padding(.leading, spaceInset100)
            .padding(.vertical, spaceInset100)
            .padding(.trailing, hasTrailingIcon ? 0 : spaceInset100) // No trailing padding if icon present
            .background(colorBackground)
            .overlay(
                RoundedRectangle(cornerRadius: radius150)
                    .stroke(borderColor, lineWidth: borderDefault)
            )
            .overlay(
                // Focus ring for keyboard navigation (WCAG 2.4.7 Focus Visible)
                // Visible in all states when focused
                RoundedRectangle(cornerRadius: radius150)
                    .stroke(accessibilityFocusColor, lineWidth: accessibilityFocusWidth)
                    .padding(-accessibilityFocusOffset)
                    .opacity(isFocused ? 1 : 0)
                    .animation(
                        reduceMotion ? .none : motionFocusTransition,
                        value: isFocused
                    )
            )
    }
}

// MARK: - Design Token Constants

// Typography tokens - semantic tokens (generated by build system)
// These reference semantic typography tokens from TypographyTokens.ts

// Typography tokens - labelMd (16pt)
private let typographyLabelMdFontSize: CGFloat // typography.labelMd.fontSize
private let typographyLabelMdLineHeight: CGFloat // typography.labelMd.lineHeight
private let typographyLabelMdFontWeight: Font.Weight // typography.labelMd.fontWeight
private let typographyLabelMdLetterSpacing: CGFloat // typography.labelMd.letterSpacing

// Typography tokens - labelMdFloat (14pt, via scale088 × fontSize100)
private let typographyLabelMdFloatFontSize: CGFloat // typography.labelMdFloat.fontSize
private let typographyLabelMdFloatLineHeight: CGFloat // typography.labelMdFloat.lineHeight
private let typographyLabelMdFloatFontWeight: Font.Weight // typography.labelMdFloat.fontWeight
private let typographyLabelMdFloatLetterSpacing: CGFloat // typography.labelMdFloat.letterSpacing

// Typography tokens - input (16pt)
private let typographyInputFontSize: CGFloat // typography.input.fontSize
private let typographyInputLineHeight: CGFloat // typography.input.lineHeight
private let typographyInputFontWeight: Font.Weight // typography.input.fontWeight
private let typographyInputLetterSpacing: CGFloat // typography.input.letterSpacing

// Typography tokens - caption (13pt)
private let typographyCaptionFontSize: CGFloat // typography.caption.fontSize
private let typographyCaptionLineHeight: CGFloat // typography.caption.lineHeight
private let typographyCaptionFontWeight: Font.Weight // typography.caption.fontWeight
private let typographyCaptionLetterSpacing: CGFloat // typography.caption.letterSpacing

// Color tokens - semantic tokens (generated by build system)
// These reference semantic color tokens from ColorTokens.ts
private let colorTextMuted: Color // color.text.muted
private let colorTextDefault: Color // color.text.default
private let colorPrimary: Color // color.primary
private let colorError: Color // color.error.strong
private let colorSuccessStrong: Color // color.success.strong
private let colorBorder: Color // color.border
private let colorBackground: Color // color.background

// Spacing tokens - semantic tokens (generated by build system)
// These reference semantic spacing tokens from SpacingTokens.ts
private let spaceInset100: CGFloat // space.inset.100 (8px)
private let spaceGroupedTight: CGFloat // space.grouped.tight (4px)
private let spaceGroupedMinimal: CGFloat // space.grouped.minimal (2px)

// Motion tokens - motion.floatLabel (duration250 + easingStandard)
// Generated by build system from MotionTokens.ts
private let motionFloatLabelDuration: TimeInterval // motion.floatLabel.duration (0.25s / 250ms)
// Easing: cubic-bezier(0.4, 0.0, 0.2, 1.0) - Material Design standard curve

// Duration tokens - primitive tokens (generated by build system)
private let duration150: TimeInterval // duration150 (150ms) - Fast interactions (focus states)

// Border tokens - primitive tokens (generated by build system)
// These reference primitive border tokens
private let borderDefault: CGFloat // border.default (1px)
private let radius150: CGFloat // radius150 (12px)

// Accessibility tokens - semantic tokens (generated by build system)
// These reference accessibility tokens from AccessibilityTokens.ts
private let tapAreaRecommended: CGFloat // accessibility.tapArea.recommended (48px)
private let accessibilityFocusWidth: CGFloat // accessibility.focus.width (2px)
private let accessibilityFocusOffset: CGFloat // accessibility.focus.offset (2px)
private let accessibilityFocusColor: Color // color.primary (focus ring color)

// MARK: - Preview

#if DEBUG
struct TextInputField_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            // Default state (empty, not focused)
            TextInputField(
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
                maxLength: nil
            )
            
            // Filled state
            TextInputField(
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
                maxLength: nil
            )
            
            // Error state
            TextInputField(
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
                maxLength: nil
            )
            
            // Success state
            TextInputField(
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
                maxLength: nil
            )
        }
        .padding()
    }
}
#endif
