/**
 * Progress-Indicator-Node-Base Component for iOS Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Indicator-Node-Base
 * 
 * Individual indicator element with state-based visual treatment.
 * Renders as a circular node with color, size, and content determined by state.
 * 
 * @module Progress-Indicator-Node-Base/platforms/ios
 * @see Requirements: 1.1-1.5, 12.1-12.16
 * @see .kiro/specs/048-progress-family/design.md
 */

import SwiftUI

// MARK: - Node State Enum

/**
 * Visual states for the progress indicator node.
 * 
 * @see Requirement 1.1 - Four states: incomplete, current, completed, error
 */
public enum ProgressNodeState: String, CaseIterable {
    case incomplete
    case current
    case completed
    case error
}

// MARK: - Node Size Enum

/**
 * Size variants for the progress indicator node.
 * 
 * @see Requirement 1.2 - Three sizes: sm (12px), md (16px), lg (24px)
 * @see Requirement 1.5 - Current state applies +4px emphasis
 */
public enum ProgressNodeSize: String, CaseIterable {
    case sm
    case md
    case lg

    /// Base size in points
    var baseSize: CGFloat {
        switch self {
        case .sm: return 12  // progress.node.size.sm
        case .md: return 16  // progress.node.size.md
        case .lg: return 24  // progress.node.size.lg
        }
    }

    /// Current (emphasized) size in points (+4px)
    var currentSize: CGFloat {
        switch self {
        case .sm: return 16  // progress.node.size.sm.current
        case .md: return 20  // progress.node.size.md.current
        case .lg: return 28  // progress.node.size.lg.current
        }
    }
}

// MARK: - Node Content Enum

/**
 * Content types for the progress indicator node.
 * 
 * @see Requirements 1.3-1.4 - Content support per size
 */
public enum ProgressNodeContent: String {
    case none
    case checkmark
    case icon
}

// MARK: - Constants

/// Icon scale ratio: icons render at 50% of node dimension
private let iconScaleRatio: CGFloat = 0.5

// MARK: - Node Color Tokens

/**
 * Color tokens for progress node states.
 * 
 * References semantic color.progress.* tokens.
 * In production, these would come from generated DesignTokens.
 * 
 * @see Requirements 12.13-12.16 - Color application per state
 */
private enum ProgressNodeColors {
    static func backgroundColor(for state: ProgressNodeState) -> Color {
        switch state {
        case .incomplete: return Color(DesignTokens.colorProgressPendingBackground)
        case .current:    return Color(DesignTokens.colorProgressCurrentBackground)
        case .completed:  return Color(DesignTokens.colorProgressCompletedBackground)
        case .error:      return Color(DesignTokens.colorProgressErrorBackground)
        }
    }

    static func foregroundColor(for state: ProgressNodeState) -> Color {
        switch state {
        case .incomplete: return Color(DesignTokens.colorProgressPendingText)
        case .current:    return Color(DesignTokens.colorProgressCurrentText)
        case .completed:  return Color(DesignTokens.colorProgressCompletedText)
        case .error:      return Color(DesignTokens.colorProgressErrorText)
        }
    }
}

// MARK: - Progress-Indicator-Node-Base View

/**
 * Progress-Indicator-Node-Base SwiftUI View
 * 
 * Renders a circular indicator node with state-based colors, size emphasis
 * for current state, and optional content (checkmark, icon).
 * 
 * Usage:
 * ```swift
 * ProgressIndicatorNodeBase(state: .current, size: .md)
 * ProgressIndicatorNodeBase(state: .completed, size: .lg, content: .checkmark)
 * ```
 * 
 * @see Requirements: 1.1-1.5, 12.1-12.16
 */
public struct ProgressIndicatorNodeBase: View {

    // MARK: - Properties

    public let state: ProgressNodeState
    public let size: ProgressNodeSize
    public let content: ProgressNodeContent
    public let icon: String?
    public let testID: String?

    // MARK: - Initialization

    public init(
        state: ProgressNodeState,
        size: ProgressNodeSize = .md,
        content: ProgressNodeContent = .none,
        icon: String? = nil,
        testID: String? = nil
    ) {
        self.state = state
        self.size = size
        self.content = content
        self.icon = icon
        self.testID = testID
    }

    // MARK: - Computed Properties

    /// Effective dimension based on state (current gets +4px emphasis)
    private var dimension: CGFloat {
        state == .current ? size.currentSize : size.baseSize
    }

    /// Effective content (sm always renders as dot)
    private var effectiveContent: ProgressNodeContent {
        size == .sm ? .none : content
    }

    // MARK: - Body

    public var body: some View {
        ZStack {
            // Background circle
            Circle()
                .fill(ProgressNodeColors.backgroundColor(for: state))
                .frame(width: dimension, height: dimension)

            // Inner content
            nodeContent
        }
        .frame(width: dimension, height: dimension)
        .accessibilityHidden(true)
        .accessibilityIdentifier(testID ?? "")
        .animation(
            UIAccessibility.isReduceMotionEnabled ? nil : motionFocusTransition,
            value: state
        )
    }

    // MARK: - Content Views

    @ViewBuilder
    private var nodeContent: some View {
        if size == .sm {
            // sm: always a filled dot
            Circle()
                .fill(ProgressNodeColors.foregroundColor(for: state))
                .frame(width: dimension * iconScaleRatio, height: dimension * iconScaleRatio)
        } else if effectiveContent == .checkmark {
            // md/lg + checkmark
            Image(systemName: "checkmark")
                .resizable()
                .scaledToFit()
                .frame(width: dimension * iconScaleRatio, height: dimension * iconScaleRatio)
                .foregroundColor(ProgressNodeColors.foregroundColor(for: state))
        } else if effectiveContent == .icon, let iconName = icon {
            // md/lg + custom icon
            IconBase(
                name: iconName,
                size: dimension * iconScaleRatio,
                color: ProgressNodeColors.foregroundColor(for: state)
            )
        }
        // md/lg + none: empty circle (no inner content rendered)
    }
}

// MARK: - Preview

struct ProgressIndicatorNodeBase_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Progress-Indicator-Node-Base")
                    .font(.headline)

                // All states at md size
                Text("States (md)")
                    .font(.subheadline)
                HStack(spacing: 16) {
                    ForEach(ProgressNodeState.allCases, id: \.self) { nodeState in
                        VStack {
                            ProgressIndicatorNodeBase(state: nodeState, size: .md)
                            Text(nodeState.rawValue)
                                .font(.caption)
                        }
                    }
                }

                // All sizes at current state
                Text("Sizes (current)")
                    .font(.subheadline)
                HStack(spacing: 16) {
                    ForEach(ProgressNodeSize.allCases, id: \.self) { nodeSize in
                        VStack {
                            ProgressIndicatorNodeBase(state: .current, size: nodeSize)
                            Text(nodeSize.rawValue)
                                .font(.caption)
                        }
                    }
                }

                // Completed with checkmark
                Text("Completed + Checkmark (lg)")
                    .font(.subheadline)
                ProgressIndicatorNodeBase(state: .completed, size: .lg, content: .checkmark)
            }
            .padding()
        }
    }
}
