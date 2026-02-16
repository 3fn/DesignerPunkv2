/**
 * Progress-Indicator-Label-Base Component for iOS Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Indicator-Label-Base
 * 
 * Label element positioned centered below progress indicator nodes.
 * Renders primary label text with optional helper text, using
 * typography.labelSm token for consistent text styling.
 * 
 * @module Progress-Indicator-Label-Base/platforms/ios
 * @see Requirements: 1.8-1.10
 * @see .kiro/specs/048-progress-family/design.md
 */

import SwiftUI

// MARK: - Typography Constants

/**
 * Typography token values for labelSm.
 * References typography.labelSm composite token:
 * - fontSize: fontSize075 (14px → 14pt)
 * - lineHeight: lineHeight075
 * - fontWeight: fontWeight500
 * 
 * @see Requirements 1.8 - Apply typography.labelSm token (14px)
 */
private let labelFontSize: CGFloat = 14  // typography.labelSm → fontSize075
private let labelFontWeight: Font.Weight = .medium  // fontWeight500

// MARK: - Progress-Indicator-Label-Base View

/**
 * Progress-Indicator-Label-Base SwiftUI View
 * 
 * Renders a label centered below a progress indicator node with
 * optional helper text and line-limit truncation.
 * 
 * Usage:
 * ```swift
 * ProgressIndicatorLabelBase(label: "Step 1", helperText: "Personal Info")
 * ProgressIndicatorLabelBase(label: "Review", optional: true)
 * ```
 * 
 * @see Requirements: 1.8-1.10
 */
public struct ProgressIndicatorLabelBase: View {

    // MARK: - Properties

    public let label: String
    public let helperText: String?
    public let optional: Bool
    public let testID: String?

    // MARK: - Initialization

    public init(
        label: String,
        helperText: String? = nil,
        optional: Bool = false,
        testID: String? = nil
    ) {
        self.label = label
        self.helperText = helperText
        self.optional = optional
        self.testID = testID
    }

    // MARK: - Body

    public var body: some View {
        VStack(spacing: 2) {
            // Primary label text
            // @see Requirement 1.8 - Position centered below node
            // @see Requirement 1.10 - Truncate with ellipsis
            Text(label)
                .font(.system(size: labelFontSize, weight: labelFontWeight))
                .foregroundColor(Color(DesignTokens.colorTextDefault))
                .lineLimit(1)
                .truncationMode(.tail)

            // Optional helper text
            // @see Requirement 1.9 - Support optional helper text
            if let helperText = helperText {
                Text(helperText)
                    .font(.system(size: labelFontSize, weight: labelFontWeight))
                    .foregroundColor(Color(DesignTokens.colorTextSubtle))
                    .opacity(0.7)
                    .lineLimit(1)
                    .truncationMode(.tail)
            }
        }
        .frame(maxWidth: .infinity)
        .multilineTextAlignment(.center)
        .accessibilityHidden(true)
        .accessibilityIdentifier(testID ?? "")
    }
}

// MARK: - Preview

struct ProgressIndicatorLabelBase_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            Text("Progress-Indicator-Label-Base")
                .font(.headline)

            // Basic label
            VStack(alignment: .center) {
                Text("Basic Label")
                    .font(.subheadline)
                ProgressIndicatorLabelBase(label: "Step 1")
            }

            // Label with helper text
            VStack(alignment: .center) {
                Text("With Helper Text")
                    .font(.subheadline)
                ProgressIndicatorLabelBase(
                    label: "Personal Info",
                    helperText: "Name, email, phone"
                )
            }

            // Optional step
            VStack(alignment: .center) {
                Text("Optional Step")
                    .font(.subheadline)
                ProgressIndicatorLabelBase(
                    label: "Additional Details",
                    optional: true
                )
            }

            // Long text truncation
            VStack(alignment: .center) {
                Text("Long Text (Truncation)")
                    .font(.subheadline)
                ProgressIndicatorLabelBase(
                    label: "This is a very long step label that should truncate",
                    helperText: "This helper text is also very long and should truncate with ellipsis"
                )
                .frame(width: DesignTokens.space.inset.200)
            }
        }
        .padding()
    }
}
