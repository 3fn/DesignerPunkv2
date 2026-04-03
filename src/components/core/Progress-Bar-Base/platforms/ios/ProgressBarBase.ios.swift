/**
 * Progress-Bar-Base — iOS Implementation
 *
 * Stemma System: ProgressIndicator Family, Primitive (standalone)
 *
 * @module Progress-Bar-Base/platforms/ios
 * @see .kiro/specs/090-linear-progress-bar/design.md
 */

import SwiftUI

// MARK: - Constants

let INDETERMINATE_STATIC_FILL: CGFloat = 0.33

private let MILESTONES: [Int] = [0, 25, 50, 75, 100]

// MARK: - Tokens

enum ProgressBarTokens {
    static let trackColor = Color(DesignTokens.colorProgressPendingBackground)
    static let determinateFillColor = Color(DesignTokens.colorProgressCompletedBackground)
    static let indeterminateFillColor = Color(DesignTokens.colorProgressCurrentBackground)
    static let animationDuration: Double = DesignTokens.duration150 / 1000

    static func height(for size: ProgressBarSize) -> CGFloat {
        switch size {
        case .sm: return DesignTokens.size050
        case .md: return DesignTokens.size100
        case .lg: return DesignTokens.size150
        }
    }
}

enum ProgressBarSize { case sm, md, lg }

// MARK: - View

struct ProgressBarBase: View {
    let mode: ProgressBarMode
    let accessibilityLabel: String
    var size: ProgressBarSize = .md
    var testID: String? = nil

    @State private var pulseOpacity: Double = 0.3
    @State private var lastAnnouncedMilestone: Int = -1
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                // Track
                RoundedRectangle(cornerRadius: .infinity)
                    .fill(ProgressBarTokens.trackColor)

                // Fill
                RoundedRectangle(cornerRadius: .infinity)
                    .fill(fillColor)
                    .frame(width: fillWidth(in: geometry.size.width))
                    .opacity(fillOpacity)
            }
        }
        .frame(height: ProgressBarTokens.height(for: size))
        .accessibilityElement()
        .accessibilityLabel(accessibilityLabel)
        .accessibilityValue(accessibilityValue)
        .accessibilityIdentifier(testID ?? "")
        .onAppear { startPulseIfNeeded() }
        .onChange(of: mode) { _ in startPulseIfNeeded() }
    }

    // MARK: - Fill

    private var fillColor: Color {
        switch mode {
        case .determinate: return ProgressBarTokens.determinateFillColor
        case .indeterminate: return ProgressBarTokens.indeterminateFillColor
        }
    }

    private func fillWidth(in trackWidth: CGFloat) -> CGFloat {
        switch mode {
        case .determinate(let value):
            validateValue(value)
            return trackWidth * CGFloat(value)
        case .indeterminate:
            return reduceMotion ? trackWidth * INDETERMINATE_STATIC_FILL : trackWidth * INDETERMINATE_STATIC_FILL
        }
    }

    private var fillOpacity: Double {
        switch mode {
        case .determinate: return 1.0
        case .indeterminate: return reduceMotion ? 1.0 : pulseOpacity
        }
    }

    // MARK: - Animation

    private func startPulseIfNeeded() {
        guard case .indeterminate = mode, !reduceMotion else { return }
        withAnimation(.easeInOut(duration: ProgressBarTokens.animationDuration).repeatForever(autoreverses: true)) {
            pulseOpacity = 1.0
        }
    }

    // MARK: - Accessibility

    private var accessibilityValue: String {
        switch mode {
        case .determinate(let value): return "\(Int(value * 100))%"
        case .indeterminate: return "Loading"
        }
    }

    // MARK: - Validation

    private func validateValue(_ value: Double) {
        precondition(value >= 0 && value <= 1,
            "Progress-Bar-Base: value must be between 0 and 1, received \(value)")
    }
}

// MARK: - Mode

enum ProgressBarMode {
    case determinate(value: Double)
    case indeterminate
}
