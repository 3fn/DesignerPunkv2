/**
 * Progress-Stepper-Base Component for iOS Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Stepper-Base
 * 
 * Stepper indicator composing Node-Base and Connector-Base primitives.
 * Supports state derivation with priority: error > completed > current > incomplete.
 * 
 * @module Progress-Stepper-Base/platforms/ios
 * @see Requirements: 3.1-3.17, 10.3-10.7, 11.7-11.13
 * @see .kiro/specs/048-progress-family/design.md
 */

import SwiftUI

// MARK: - Constants

/// Maximum number of steps supported
/// @see Requirement 3.12
private let stepperMaxSteps = 8

// MARK: - Gap Token Values

/**
 * Gap values between stepper elements per size variant.
 * References progress.node.gap.* component tokens.
 * Note: sm is not supported for steppers.
 */
private enum StepperGap {
    static func value(for size: ProgressNodeSize) -> CGFloat {
        switch size {
        case .sm: fatalError("Steppers require size 'md' or 'lg'. Size 'sm' is only supported for Pagination-Base.")
        case .md: return 8   // progress.node.gap.md (space100)
        case .lg: return 12  // progress.node.gap.lg (space150)
        }
    }
}

// MARK: - State Derivation

/**
 * Derive node state for a step in the stepper.
 * Priority: error > completed > current > incomplete
 * 
 * @see Requirements 10.3-10.7
 */
private func deriveStepperNodeState(index: Int, currentStep: Int, errorSteps: [Int]) -> ProgressNodeState {
    if errorSteps.contains(index) { return .error }
    if index < currentStep { return .completed }
    if index == currentStep { return .current }
    return .incomplete
}

/**
 * Derive content for a node based on its state.
 * Completed nodes get checkmark, all others get none.
 * 
 * @see Requirements 3.8-3.9, 11.10-11.11
 */
private func deriveStepperNodeContent(state: ProgressNodeState) -> ProgressNodeContent {
    return state == .completed ? .checkmark : .none
}

/**
 * Derive connector state between two adjacent nodes.
 * Active when both adjacent nodes are completed.
 * 
 * @see Requirements 3.10-3.11, 11.12-11.13
 */
private func deriveConnectorState(leftState: ProgressNodeState, rightState: ProgressNodeState) -> ProgressConnectorState {
    return (leftState == .completed && rightState == .completed) ? .active : .inactive
}


// MARK: - Progress-Stepper-Base View

/**
 * Progress-Stepper-Base SwiftUI View
 * 
 * Composes ProgressIndicatorNodeBase and ProgressIndicatorConnectorBase
 * primitives to create a stepper indicator for linear multi-step flows.
 * 
 * Usage:
 * ```swift
 * ProgressStepperBase(totalSteps: 5, currentStep: 3, size: .md)
 * ProgressStepperBase(totalSteps: 4, currentStep: 2, size: .lg, errorSteps: [3])
 * ```
 * 
 * @see Requirements: 3.1-3.17, 10.3-10.7, 11.7-11.13
 */
public struct ProgressStepperBase: View {

    // MARK: - Properties

    public let totalSteps: Int
    public let currentStep: Int
    public let size: ProgressNodeSize
    public let errorSteps: [Int]
    public let accessibilityLabel: String?
    public let testID: String?

    // MARK: - Initialization

    public init(
        totalSteps: Int,
        currentStep: Int,
        size: ProgressNodeSize = .md,
        errorSteps: [Int] = [],
        accessibilityLabel: String? = nil,
        testID: String? = nil
    ) {
        // Validate size ≠ sm
        // @see Requirement 3.17, 8.10
        precondition(
            size != .sm,
            "Steppers require size 'md' or 'lg'. Size 'sm' is only supported for Pagination-Base."
        )

        // Validate and clamp totalSteps
        // @see Requirements 3.12-3.13
        if totalSteps > stepperMaxSteps {
            #if DEBUG
            assertionFailure(
                "Progress-Stepper-Base supports a maximum of \(stepperMaxSteps) steps. " +
                "Received \(totalSteps) steps. " +
                "For longer flows, break into multiple sub-flows."
            )
            #else
            print(
                "⚠️ Progress-Stepper-Base: Received \(totalSteps) steps but maximum is \(stepperMaxSteps). " +
                "Rendering first \(stepperMaxSteps) steps only."
            )
            #endif
        }

        self.totalSteps = min(totalSteps, stepperMaxSteps)

        // Clamp currentStep to valid range [1, totalSteps]
        // @see Requirement 3.14
        self.currentStep = max(1, min(currentStep, self.totalSteps))

        self.size = size

        // Filter errorSteps to valid range [1, totalSteps]
        // @see Requirement 3.15
        self.errorSteps = errorSteps.filter { $0 >= 1 && $0 <= self.totalSteps }

        self.accessibilityLabel = accessibilityLabel
        self.testID = testID
    }

    // MARK: - Computed Properties

    /// Derive all node states
    private var nodeStates: [ProgressNodeState] {
        (1...totalSteps).map { index in
            deriveStepperNodeState(index: index, currentStep: currentStep, errorSteps: errorSteps)
        }
    }

    /// ARIA label
    /// @see Requirements 3.16, 7.3, 7.12
    private var effectiveAccessibilityLabel: String {
        accessibilityLabel ?? "Step \(currentStep) of \(totalSteps)"
    }

    // MARK: - Body

    public var body: some View {
        HStack(spacing: StepperGap.value(for: size)) {
            let states = nodeStates
            ForEach(0..<states.count, id: \.self) { i in
                // Render node
                ProgressIndicatorNodeBase(
                    state: states[i],
                    size: size,
                    content: deriveStepperNodeContent(state: states[i])
                )

                // Render connector between nodes (n-1 connectors)
                // @see Requirements 11.8, 11.12-11.13
                if i < states.count - 1 {
                    let connState = deriveConnectorState(
                        leftState: states[i],
                        rightState: states[i + 1]
                    )
                    ProgressIndicatorConnectorBase(state: connState)
                }
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityAddTraits(.updatesFrequently)
        .accessibilityValue("Step \(currentStep) of \(totalSteps)")
        .accessibilityLabel(effectiveAccessibilityLabel)
        .accessibilityIdentifier(testID ?? "")
    }
}

// MARK: - Preview

struct ProgressStepperBase_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Progress-Stepper-Base")
                    .font(.headline)

                // Basic stepper (5 steps, current=3, md)
                Text("5 steps, current=3, md")
                    .font(.subheadline)
                ProgressStepperBase(totalSteps: 5, currentStep: 3, size: .md)
                    .padding(.horizontal)

                // With error step
                Text("5 steps, current=3, error=[2], lg")
                    .font(.subheadline)
                ProgressStepperBase(totalSteps: 5, currentStep: 3, size: .lg, errorSteps: [2])
                    .padding(.horizontal)

                // All completed
                Text("4 steps, current=4, md (all completed except current)")
                    .font(.subheadline)
                ProgressStepperBase(totalSteps: 4, currentStep: 4, size: .md)
                    .padding(.horizontal)

                // Both sizes
                Text("Sizes (5 steps, current=3)")
                    .font(.subheadline)
                VStack(spacing: 12) {
                    ProgressStepperBase(totalSteps: 5, currentStep: 3, size: .md)
                    ProgressStepperBase(totalSteps: 5, currentStep: 3, size: .lg)
                }
                .padding(.horizontal)
            }
            .padding()
        }
    }
}
