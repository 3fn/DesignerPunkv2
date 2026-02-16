/**
 * Progress-Indicator-Connector-Base Component for iOS Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Indicator-Connector-Base
 * 
 * Connecting line element between progress indicator nodes.
 * Renders as a horizontal line with state-based color treatment.
 * 
 * @module Progress-Indicator-Connector-Base/platforms/ios
 * @see Requirements: 1.6-1.7, 12.10-12.12
 * @see .kiro/specs/048-progress-family/design.md
 */

import SwiftUI

// MARK: - Connector State Enum

/**
 * Visual states for the progress indicator connector.
 * 
 * @see Requirement 1.6 - Two states: active, inactive
 */
public enum ProgressConnectorState: String, CaseIterable {
    case active
    case inactive
}

// MARK: - Connector Color Tokens

/**
 * Color tokens for progress connector states.
 * 
 * References semantic color.progress.*.connector tokens.
 * - active: color.progress.completed.connector (green100)
 * - inactive: color.progress.pending.connector (white200)
 * 
 * @see Requirements 12.10-12.11 - Color application per state
 */
private enum ProgressConnectorColors {
    static func color(for state: ProgressConnectorState) -> Color {
        switch state {
        case .active:   return Color(DesignTokens.colorProgressCompletedConnector)
        case .inactive: return Color(DesignTokens.colorProgressPendingConnector)
        }
    }
}

// MARK: - Connector Thickness Token

/**
 * Thickness token for progress connector.
 * References progress.connector.thickness → borderDefault → borderWidth100 (1pt).
 * 
 * @see Requirement 1.7 - 1px thickness (borderDefault token)
 * @see Requirement 12.12 - Uses borderDefault token
 */
private let connectorThickness: CGFloat = DesignTokens.borderWidth100  // 1pt

// MARK: - Progress-Indicator-Connector-Base View

/**
 * Progress-Indicator-Connector-Base SwiftUI View
 * 
 * Renders a horizontal connecting line between progress indicator nodes
 * with state-based color treatment.
 * 
 * Usage:
 * ```swift
 * ProgressIndicatorConnectorBase(state: .active)
 * ProgressIndicatorConnectorBase(state: .inactive)
 * ```
 * 
 * @see Requirements: 1.6-1.7, 12.10-12.12
 */
public struct ProgressIndicatorConnectorBase: View {

    // MARK: - Properties

    public let state: ProgressConnectorState
    public let testID: String?

    // MARK: - Initialization

    public init(
        state: ProgressConnectorState,
        testID: String? = nil
    ) {
        self.state = state
        self.testID = testID
    }

    // MARK: - Body

    public var body: some View {
        Rectangle()
            .fill(ProgressConnectorColors.color(for: state))
            .frame(height: connectorThickness)
            .frame(maxWidth: .infinity)
            .accessibilityHidden(true)
            .accessibilityIdentifier(testID ?? "")
    }
}

// MARK: - Preview

struct ProgressIndicatorConnectorBase_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            Text("Progress-Indicator-Connector-Base")
                .font(.headline)

            // Active connector
            VStack(alignment: .leading) {
                Text("Active (green100)")
                    .font(.subheadline)
                ProgressIndicatorConnectorBase(state: .active)
                    .padding(.horizontal)
            }

            // Inactive connector
            VStack(alignment: .leading) {
                Text("Inactive (white200)")
                    .font(.subheadline)
                ProgressIndicatorConnectorBase(state: .inactive)
                    .padding(.horizontal)
            }

            // Both states side by side
            VStack(alignment: .leading) {
                Text("Both States")
                    .font(.subheadline)
                HStack(spacing: 8) {
                    Circle()
                        .fill(Color.green)
                        .frame(width: ProgressNodeSize.md.baseSize, height: ProgressNodeSize.md.baseSize)
                    ProgressIndicatorConnectorBase(state: .active)
                    Circle()
                        .fill(Color.green)
                        .frame(width: ProgressNodeSize.md.baseSize, height: ProgressNodeSize.md.baseSize)
                    ProgressIndicatorConnectorBase(state: .inactive)
                    Circle()
                        .fill(Color.gray)
                        .frame(width: ProgressNodeSize.md.baseSize, height: ProgressNodeSize.md.baseSize)
                }
                .padding(.horizontal)
            }
        }
        .padding()
    }
}
