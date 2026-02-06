/**
 * Input-Checkbox-Legal Component for iOS Platform
 * 
 * Specialized checkbox for legal consent scenarios (terms of service, privacy policies,
 * GDPR consent) with audit capabilities and stricter validation.
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Input-Checkbox-Legal
 * Component Type: Semantic Variant (extends Base conceptually)
 * 
 * Key Differences from Input-Checkbox-Base:
 * - Fixed sizing: lg box (40px) with labelSm typography
 * - Fixed label alignment: top (for multi-line legal text)
 * - No indeterminate state support
 * - Explicit consent enforcement (prevents pre-checking)
 * - Audit trail support (timestamp, legalTextId, version)
 * - Required indicator visible by default
 * - No label truncation
 * 
 * Follows True Native Architecture with platform-specific SwiftUI implementation
 * while maintaining API consistency with web and Android platforms.
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered.
 * 
 * @module Input-Checkbox-Legal/platforms/ios
 * @see Requirements: 9.1-9.11
 */

import SwiftUI

// MARK: - Consent Change Data

/**
 * Consent change event data with audit trail information.
 * 
 * This struct defines the data passed to the onConsentChange callback,
 * providing all information needed for legal audit trails.
 * 
 * @see Requirement 9.5-9.7 in .kiro/specs/046-input-checkbox-base/requirements.md
 */
struct ConsentChangeData {
    /// Whether consent was given (true) or withdrawn (false)
    let consented: Bool
    
    /// ISO 8601 timestamp of when consent state changed
    /// Format: YYYY-MM-DDTHH:mm:ss.sssZ
    let timestamp: String
    
    /// ID linking to full legal text (for audit trail)
    let legalTextId: String?
    
    /// Version of legal text being consented to
    let legalTextVersion: String?
}

// MARK: - InputCheckboxLegal Component

/**
 * InputCheckboxLegal component for iOS platform.
 * 
 * Renders a legal consent checkbox with SwiftUI, using fixed lg box size
 * with labelSm typography for legal text readability.
 * 
 * Uses Icon-Base for checkmark icon rendering and theme-aware blend utilities
 * for state colors.
 * 
 * Usage:
 * ```swift
 * // Basic legal consent usage
 * @State private var hasConsented = false
 * InputCheckboxLegal(
 *     checked: $hasConsented,
 *     label: "I agree to the Terms of Service and Privacy Policy",
 *     onConsentChange: { data in
 *         print("Consent: \(data.consented) at \(data.timestamp)")
 *     }
 * )
 * 
 * // With audit trail
 * InputCheckboxLegal(
 *     checked: $hasConsented,
 *     label: "I consent to the processing of my personal data",
 *     legalTextId: "privacy-policy-v2",
 *     legalTextVersion: "2.1.0",
 *     onConsentChange: { data in
 *         auditLog.record(
 *             action: data.consented ? "CONSENT_GIVEN" : "CONSENT_WITHDRAWN",
 *             timestamp: data.timestamp,
 *             documentId: data.legalTextId,
 *             documentVersion: data.legalTextVersion
 *         )
 *     }
 * )
 * ```
 * 
 * Requirements:
 * - 9.1: Fixed sizing (lg box + labelSm typography)
 * - 9.2: Fixed top label alignment
 * - 9.3-9.4: Explicit consent enforcement
 * - 9.5-9.7: Audit trail support (timestamp, legalTextId, version)
 * - 9.8-9.9: Required indicator
 * - 9.10: No indeterminate state
 * - 9.11: No label truncation
 */
struct InputCheckboxLegal: View {
    // MARK: - Properties
    
    /// Whether checkbox is checked (binding for two-way data flow)
    @Binding var checked: Bool
    
    /// Label text (required for accessibility)
    let label: String
    
    /// Helper text displayed below checkbox (persistent)
    var helperText: String?
    
    /// Error message displayed below helper text (conditional)
    var errorMessage: String?
    
    /// Prevents checkbox from being pre-checked (GDPR compliance)
    /// @default true
    var requiresExplicitConsent: Bool
    
    /// ID linking to full legal text (for audit trail)
    var legalTextId: String?
    
    /// Version of legal text being consented to
    var legalTextVersion: String?
    
    /// Whether to show "Required" indicator
    /// @default true
    var showRequiredIndicator: Bool
    
    /// Base onChange callback
    var onChange: ((Bool) -> Void)?
    
    /// Consent change callback with audit trail data
    var onConsentChange: ((ConsentChangeData) -> Void)?
    
    /// Test ID for automated testing
    var testID: String?
    
    // MARK: - State
    
    /// Tracks pressed state for scale transform animation
    @State private var isPressed = false
    
    /// Flag to track if explicit consent warning has been shown
    @State private var consentWarningShown = false
    
    /// Environment for reduce motion preference
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    
    // MARK: - Fixed Configuration (Legal-specific)
    
    /// Fixed icon size for Legal checkbox (lg size = 24px icon)
    /// @see Requirement 9.1 - Fixed sizing
    private let iconSize: CGFloat = DesignTokens.iconSize100  // 24px
    
    /// Fixed inset padding for Legal checkbox (lg size = 8px inset)
    /// @see Requirement 9.1 - Fixed sizing
    private let inset: CGFloat = DesignTokens.spaceInset100  // 8px
    
    /// Computed box size (icon + inset padding on both sides) = 40px
    /// @see Requirement 9.1 - Fixed sizing
    private var boxSize: CGFloat {
        return iconSize + (inset * 2)  // 24 + 8 + 8 = 40px
    }
    
    /// Fixed gap between checkbox box and label (lg size = loose)
    /// @see Requirement 9.1 - Fixed sizing
    private let gap: CGFloat = DesignTokens.spaceGroupedLoose  // 12px
    
    /// Fixed border radius for Legal checkbox (lg size = radiusSmall)
    private let radius: CGFloat = DesignTokens.radiusSmall  // 4px
    
    /// Fixed label font size (labelSm typography)
    /// @see Requirement 9.1 - Fixed sizing (lg box + labelSm typography)
    private let labelFontSize: CGFloat = DesignTokens.fontSize075  // 14px (labelSm)
    
    // MARK: - Initialization
    
    /**
     * Initialize InputCheckboxLegal with all properties.
     * 
     * - Parameters:
     *   - checked: Binding to checked state
     *   - label: Label text (required)
     *   - helperText: Optional helper text
     *   - errorMessage: Optional error message
     *   - requiresExplicitConsent: Prevents pre-checking (default: true)
     *   - legalTextId: Optional legal text ID for audit trail
     *   - legalTextVersion: Optional legal text version for audit trail
     *   - showRequiredIndicator: Show "Required" indicator (default: true)
     *   - onChange: Optional base change callback
     *   - onConsentChange: Optional consent change callback with audit data
     *   - testID: Optional test identifier
     */
    init(
        checked: Binding<Bool>,
        label: String,
        helperText: String? = nil,
        errorMessage: String? = nil,
        requiresExplicitConsent: Bool = true,
        legalTextId: String? = nil,
        legalTextVersion: String? = nil,
        showRequiredIndicator: Bool = true,
        onChange: ((Bool) -> Void)? = nil,
        onConsentChange: ((ConsentChangeData) -> Void)? = nil,
        testID: String? = nil
    ) {
        self._checked = checked
        self.label = label
        self.helperText = helperText
        self.errorMessage = errorMessage
        self.requiresExplicitConsent = requiresExplicitConsent
        self.legalTextId = legalTextId
        self.legalTextVersion = legalTextVersion
        self.showRequiredIndicator = showRequiredIndicator
        self.onChange = onChange
        self.onConsentChange = onConsentChange
        self.testID = testID
    }
    
    // MARK: - Body
    
    var body: some View {
        VStack(alignment: .leading, spacing: DesignTokens.spaceGroupedTight) {
            // Required indicator (above checkbox)
            // @see Requirement 9.8-9.9 - Required indicator
            if showRequiredIndicator {
                Text("Required")
                    .font(.system(size: DesignTokens.fontSize050, weight: .medium))
                    .foregroundColor(Color(DesignTokens.colorTextMuted))
                    .accessibilityLabel("Required field")
            }
            
            // Main checkbox row
            Button(action: toggleChecked) {
                // Fixed top alignment for multi-line legal text
                // @see Requirement 9.2 - Fixed top label alignment
                HStack(alignment: .top, spacing: gap) {
                    checkboxBox
                    labelText
                }
            }
            .buttonStyle(PlainButtonStyle())
            .simultaneousGesture(pressGesture)
            // MARK: - Accessibility (Requirements 6.1-6.6)
            .accessibilityElement(children: .combine)
            .accessibilityLabel(label)
            .accessibilityValue(accessibilityState)
            .accessibilityHint(accessibilityHint)
            .accessibilityAddTraits(.isButton)
            .accessibilityIdentifier(testID ?? "")
            // Requirement 6.6: Minimum 44pt touch target
            .frame(minHeight: DesignTokens.tapAreaMinimum)
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
                            .accessibilityIdentifier("\(testID ?? "legal-checkbox")-helper")
                    }
                    
                    if let errorMessage = errorMessage {
                        Text(errorMessage)
                            .font(.system(size: DesignTokens.fontSize050, weight: .regular))
                            .foregroundColor(Color(DesignTokens.colorFeedbackErrorText))
                            .accessibilityLabel("Error: \(errorMessage)")
                            .accessibilityIdentifier("\(testID ?? "legal-checkbox")-error")
                    }
                }
                .padding(.leading, boxSize + gap)
            }
        }
        .onAppear {
            // Enforce explicit consent on appear
            // @see Requirement 9.3-9.4 - Explicit consent enforcement
            enforceExplicitConsent()
        }
    }
    
    // MARK: - Checkbox Box View
    
    /// The checkbox box with border, background, and icon
    /// Fixed lg size (40px) per Requirement 9.1
    private var checkboxBox: some View {
        ZStack {
            // Border/background rectangle
            RoundedRectangle(cornerRadius: radius)
                .stroke(borderColor, lineWidth: DesignTokens.borderEmphasis)
                .frame(width: boxSize, height: boxSize)
            
            // Filled background when checked (no indeterminate for Legal)
            // @see Requirement 9.10 - No indeterminate state
            if checked {
                RoundedRectangle(cornerRadius: radius)
                    .fill(Color(DesignTokens.colorFeedbackSelectBackgroundRest))
                    .frame(width: boxSize, height: boxSize)
                
                // Check icon only (no minus icon for Legal)
                IconBase(
                    name: "check",
                    size: iconSize,
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
    }
    
    // MARK: - Label Text View
    
    /// The label text with fixed labelSm typography
    /// @see Requirement 9.1 - Fixed sizing (lg box + labelSm typography)
    /// @see Requirement 9.11 - No label truncation
    private var labelText: some View {
        Text(label)
            .font(.system(size: labelFontSize, weight: .medium))
            .foregroundColor(Color(DesignTokens.colorTextDefault))
            // Requirement 9.11: No label truncation - allow full text to display
            .fixedSize(horizontal: false, vertical: true)
            .lineLimit(nil)
    }
    
    // MARK: - Computed Properties
    
    /// Border color based on state (error or default)
    private var borderColor: Color {
        if errorMessage != nil {
            return Color(DesignTokens.colorFeedbackErrorBorder)
        } else if checked {
            return Color(DesignTokens.colorFeedbackSelectBorderRest)
        } else {
            return Color(DesignTokens.colorFeedbackSelectBorderDefault)
        }
    }
    
    /// Accessibility state description
    private var accessibilityState: String {
        // No indeterminate state for Legal
        if checked {
            return "checked"
        } else {
            return "unchecked"
        }
    }
    
    /// Accessibility hint providing action context
    private var accessibilityHint: String {
        if checked {
            return "Double tap to withdraw consent"
        } else {
            return "Double tap to give consent"
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
    
    /// Toggle checkbox state and fire callbacks with audit trail
    private func toggleChecked() {
        let newValue = !checked
        checked = newValue
        
        // Fire base onChange callback
        onChange?(newValue)
        
        // Generate ISO 8601 timestamp
        // @see Requirement 9.5 - ISO 8601 timestamp
        let timestamp = ISO8601DateFormatter().string(from: Date())
        
        // Build consent change data with audit trail
        // @see Requirements 9.5-9.7 - Audit trail support
        let consentData = ConsentChangeData(
            consented: newValue,
            timestamp: timestamp,
            legalTextId: legalTextId,
            legalTextVersion: legalTextVersion
        )
        
        // Fire consent change callback
        onConsentChange?(consentData)
    }
    
    /// Enforce explicit consent - prevent pre-checking
    /// @see Requirements 9.3-9.4 - Explicit consent enforcement
    private func enforceExplicitConsent() {
        if requiresExplicitConsent && checked {
            // Show warning only once
            if !consentWarningShown {
                print(
                    "Input-Checkbox-Legal: Pre-checked state not allowed with requiresExplicitConsent. " +
                    "Overriding to unchecked. Legal consent must be explicitly given by the user."
                )
                consentWarningShown = true
            }
            // Override to unchecked
            checked = false
        }
    }
}

// MARK: - Preview

#if DEBUG
struct InputCheckboxLegal_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 32) {
                // Basic legal consent
                Text("Basic Legal Consent")
                    .font(.headline)
                
                PreviewLegalCheckbox(
                    label: "I agree to the Terms of Service and Privacy Policy"
                )
                
                Divider()
                
                // With audit trail
                Text("With Audit Trail")
                    .font(.headline)
                
                PreviewLegalCheckbox(
                    label: "I consent to the processing of my personal data as described in the Privacy Policy",
                    legalTextId: "privacy-policy-v2",
                    legalTextVersion: "2.1.0"
                )
                
                Divider()
                
                // With helper text
                Text("With Helper Text")
                    .font(.headline)
                
                PreviewLegalCheckbox(
                    label: "I agree to receive marketing communications",
                    helperText: "You can unsubscribe at any time"
                )
                
                Divider()
                
                // With error
                Text("With Error")
                    .font(.headline)
                
                PreviewLegalCheckbox(
                    label: "I have read and accept the Terms of Service",
                    errorMessage: "You must accept the terms to continue"
                )
                
                Divider()
                
                // Without required indicator
                Text("Without Required Indicator")
                    .font(.headline)
                
                PreviewLegalCheckbox(
                    label: "I would like to receive the newsletter (optional)",
                    showRequiredIndicator: false
                )
                
                Divider()
                
                // Long multi-line label
                Text("Multi-line Label (Top Aligned)")
                    .font(.headline)
                
                PreviewLegalCheckbox(
                    label: "By checking this box, I acknowledge that I have read, understood, and agree to be bound by the Terms of Service, Privacy Policy, and Cookie Policy. I understand that my personal data will be processed in accordance with these policies and that I may withdraw my consent at any time by contacting support."
                )
            }
            .padding()
        }
    }
}

/// Helper view for previews with internal state
private struct PreviewLegalCheckbox: View {
    let label: String
    var helperText: String? = nil
    var errorMessage: String? = nil
    var legalTextId: String? = nil
    var legalTextVersion: String? = nil
    var showRequiredIndicator: Bool = true
    
    @State private var isChecked: Bool = false
    
    var body: some View {
        InputCheckboxLegal(
            checked: $isChecked,
            label: label,
            helperText: helperText,
            errorMessage: errorMessage,
            legalTextId: legalTextId,
            legalTextVersion: legalTextVersion,
            showRequiredIndicator: showRequiredIndicator,
            onConsentChange: { data in
                print("Consent: \(data.consented) at \(data.timestamp)")
                if let id = data.legalTextId {
                    print("  Legal Text ID: \(id)")
                }
                if let version = data.legalTextVersion {
                    print("  Legal Text Version: \(version)")
                }
            }
        )
    }
}
#endif
