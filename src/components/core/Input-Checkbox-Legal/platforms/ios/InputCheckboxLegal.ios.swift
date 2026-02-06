/**
 * Input-Checkbox-Legal Component for iOS Platform
 * 
 * Specialized checkbox for legal consent scenarios (terms of service, privacy policies,
 * GDPR consent) with audit capabilities and stricter validation.
 * 
 * **Architecture**: Wrapper pattern - wraps InputCheckboxBase with fixed configuration
 * and Legal-specific features. This reduces code duplication by ~80% and ensures
 * Legal inherits Base improvements automatically.
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Input-Checkbox-Legal
 * Component Type: Semantic Variant (wraps Base)
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
 * **Wrapper Pattern**: This component wraps InputCheckboxBase with fixed configuration
 * (lg size, top alignment, sm typography) and adds Legal-specific features:
 * - Required indicator (rendered above Base)
 * - Explicit consent enforcement (intercepts checked binding)
 * - Audit trail (onConsentChange with timestamp, legalTextId, version)
 * - No indeterminate support (not passed to Base)
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
    
    /// Flag to track if explicit consent warning has been shown
    @State private var consentWarningShown = false
    
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
            // Required indicator (above checkbox, Legal-specific)
            // @see Requirement 9.8-9.9 - Required indicator
            if showRequiredIndicator {
                Text("Required")
                    .font(.system(size: DesignTokens.fontSize050, weight: .medium))
                    .foregroundColor(Color(DesignTokens.colorTextMuted))
                    .accessibilityLabel("Required field")
            }
            
            // Wrapped InputCheckboxBase with fixed configuration
            // @see Requirement 9.1 - Fixed sizing (lg box + labelSm typography)
            // @see Requirement 9.2 - Fixed top label alignment
            // @see Requirement 9.10 - No indeterminate state (not passed to Base)
            InputCheckboxBase(
                checked: $checked,
                indeterminate: false,  // Legal never supports indeterminate
                label: label,
                size: .lg,             // Fixed: lg box (40px)
                labelAlign: .top,      // Fixed: top alignment for multi-line legal text
                labelTypography: .sm,  // Fixed: labelSm typography
                helperText: helperText,
                errorMessage: errorMessage,
                onChange: handleChange,
                testID: testID
            )
        }
        .onAppear {
            // Enforce explicit consent on appear
            // @see Requirement 9.3-9.4 - Explicit consent enforcement
            enforceExplicitConsent()
        }
    }
    
    // MARK: - Actions
    
    /// Handle checkbox state change and fire callbacks with audit trail
    /// Transforms Base's onChange to Legal's onConsentChange
    private func handleChange(_ newValue: Bool) {
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
