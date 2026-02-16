/**
 * Progress-Stepper-Detailed Component for iOS Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Detailed)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Stepper-Detailed
 * 
 * Detailed stepper composing Node-Base, Connector-Base, and Label-Base primitives.
 * Supports state derivation with priority: error > completed > current > incomplete.
 * Icon precedence: completed = checkmark always, user icon for current/incomplete/error.
 * 
 * @module Progress-Stepper-Detailed/platforms/ios
 * @see Requirements: 4.1-4.16, 11.14-11.22
 * @see .kiro/specs/048-progress-family/design.md
 */

import SwiftUI

// MARK: - Constants

/// Maximum number of steps supported
/// @see Requirement 4.9
private let stepperDetailedMaxSteps = 8

// MARK: - Gap Token Values

/**
 * Gap values between stepper elements per size variant.
 * References progress.node.gap.* component tokens.
 * Note: sm is not supported for steppers.
 */
private enum StepperDetailedGap {
    static func value(for size: ProgressNodeSize) -> CGFloat {
        switch size {
        case .sm: fatalError("Steppers require size 'md' or 'lg'. Size 'sm' is only supported for Pagination-Base.")
        case .md: return 8   // progress.node.gap.md (space100)
        case .lg: return 12  // progress.node.gap.lg (space150)
        }
    }
}


// MARK: - Step Definition

/**
 * Step definition for Stepper-Detailed.
 * 
 * @see Requirements 4.1-4.8
 */
public struct StepDefinitioniOS {
    public let label: String
    public let helperText: String?
    public let icon: String?
    public let optional: Bool

    public init(
        label: String,
        helperText: String? = nil,
        icon: String? = nil,
        optional: Bool = false
    ) {
        self.label = label
        self.helperText = helperText
        self.icon = icon
        self.optional = optional
    }
}

// MARK: - State Derivation

/**
 * Derive node state for a step in the detailed stepper.
 * Priority: error > completed > current > incomplete
 * 
 * @see Requirements 4.3, 10.3-10.7
 */
private func deriveDetailedNodeState(index: Int, currentStep: Int, errorSteps: [Int]) -> ProgressNodeState {
    if errorSteps.contains(index) { return .error }
    if index < currentStep { return .completed }
    if index == currentStep { return .current }
    return .incomplete
}

/**
 * Derive content for a node based on its state and step definition.
 * Icon precedence: completed = checkmark always, user icon for others.
 * 
 * @see Requirements 4.4-4.6, 11.17-11.19
 */
private func deriveDetailedNodeContent(state: ProgressNodeState, step: StepDefinitioniOS) -> ProgressNodeContent {
    if state == .completed { return .checkmark }
    if step.icon != nil { return .icon }
    return .none
}

/**
 * Derive connector state between two adjacent nodes.
 * Active when both adjacent nodes are completed.
 * 
 * @see Requirements 11.21-11.22
 */
private func deriveDetailedConnectorState(leftState: ProgressNodeState, rightState: ProgressNodeState) -> ProgressConnectorState {
    return (leftState == .completed && rightState == .completed) ? .active : .inactive
}

// MARK: - Progress-Stepper-Detailed View

/**
 * Progress-Stepper-Detailed SwiftUI View
 * 
 * Composes ProgressIndicatorNodeBase, ProgressIndicatorConnectorBase,
 * and ProgressIndicatorLabelBase primitives to create a detailed stepper
 * with labels and optional icons for complex multi-step flows.
 * 
 * Usage:
 * ```swift
 * ProgressStepperDetailed(
 *     steps: [
 *         StepDefinitioniOS(label: "Personal Info"),
 *         StepDefinitioniOS(label: "Payment", icon: "creditcard"),
 *         StepDefinitioniOS(label: "Review")
 *     ],
 *     currentStep: 2,
 *     size: .md
 * )
 * ```
 * 
 * @see Requirements: 4.1-4.16, 11.14-11.22
 */
public struct ProgressStepperDetailed: View {

    // MARK: - Properties

    public let steps: [StepDefinitioniOS]
    public let currentStep: Int
    public let size: ProgressNodeSize
    public let errorSteps: [Int]
    public let accessibilityLabel: String?
    public let testID: String?

    // MARK: - Computed (effective values after validation)

    private let effectiveSteps: [StepDefinitioniOS]
    private let effectiveCurrentStep: Int
    private let effectiveErrorSteps: [Int]

    // MARK: - Initialization

    public init(
        steps: [StepDefinitioniOS],
        currentStep: Int,
        size: ProgressNodeSize = .md,
        errorSteps: [Int] = [],
        accessibilityLabel: String? = nil,
        testID: String? = nil
    ) {
        // Validate size ≠ sm
        // @see Requirement 4.16, 8.10
        precondition(
            size != .sm,
            "Steppers require size 'md' or 'lg'. Size 'sm' is only supported for Pagination-Base."
        )

        self.size = size
        self.accessibilityLabel = accessibilityLabel
        self.testID = testID

        // Validate and clamp steps count
        // @see Requirements 4.9-4.10
        if steps.count > stepperDetailedMaxSteps {
            #if DEBUG
            assertionFailure(
                "Progress-Stepper-Detailed supports a maximum of \(stepperDetailedMaxSteps) steps. " +
                "Received \(steps.count) steps. " +
                "For longer flows, break into multiple sub-flows."
            )
            #else
            print(
                "⚠️ Progress-Stepper-Detailed: Received \(steps.count) steps but maximum is \(stepperDetailedMaxSteps). " +
                "Rendering first \(stepperDetailedMaxSteps) steps only."
            )
            #endif
        }

        self.steps = steps
        self.effectiveSteps = Array(steps.prefix(stepperDetailedMaxSteps))

        let totalSteps = effectiveSteps.count

        // Clamp currentStep to valid range [1, totalSteps]
        // @see Requirement 4.11
        self.currentStep = currentStep
        self.effectiveCurrentStep = max(1, min(currentStep, totalSteps))

        // Filter errorSteps to valid range [1, totalSteps]
        // @see Requirement 4.12
        self.errorSteps = errorSteps
        self.effectiveErrorSteps = errorSteps.filter { $0 >= 1 && $0 <= totalSteps }
    }

    // MARK: - Computed Properties

    /// Derive all node states
    private var nodeStates: [ProgressNodeState] {
        (1...effectiveSteps.count).map { index in
            deriveDetailedNodeState(index: index, currentStep: effectiveCurrentStep, errorSteps: effectiveErrorSteps)
        }
    }

    /// Effective accessibility label
    private var effectiveAccessibilityLabel: String {
        accessibilityLabel ?? "Step \(effectiveCurrentStep) of \(effectiveSteps.count)"
    }

    // MARK: - Body

    public var body: some View {
        let states = nodeStates
        let totalSteps = effectiveSteps.count

        HStack(alignment: .top, spacing: 0) {
            ForEach(0..<totalSteps, id: \.self) { i in
                // Each step is a vertical column: node row + label
                VStack(spacing: StepperDetailedGap.value(for: size)) {
                    // Node row with connectors
                    HStack(spacing: 0) {
                        // Left side: connector or spacer
                        if i > 0 {
                            let connState = deriveDetailedConnectorState(
                                leftState: states[i - 1],
                                rightState: states[i]
                            )
                            ProgressIndicatorConnectorBase(state: connState)
                        } else {
                            Spacer()
                        }

                        // Node
                        let content = deriveDetailedNodeContent(state: states[i], step: effectiveSteps[i])
                        ProgressIndicatorNodeBase(
                            state: states[i],
                            size: size,
                            content: content,
                            icon: (content == .icon) ? effectiveSteps[i].icon : nil
                        )

                        // Right side: connector or spacer
                        if i < totalSteps - 1 {
                            let connState = deriveDetailedConnectorState(
                                leftState: states[i],
                                rightState: states[i + 1]
                            )
                            ProgressIndicatorConnectorBase(state: connState)
                        } else {
                            Spacer()
                        }
                    }

                    // Label below node
                    // @see Requirements 4.7-4.8, 11.16, 11.20
                    ProgressIndicatorLabelBase(
                        label: effectiveSteps[i].label,
                        helperText: effectiveSteps[i].helperText,
                        optional: effectiveSteps[i].optional
                    )
                }
                .accessibilityElement(children: .combine)
                .accessibilityLabel(stepAccessibilityLabel(index: i, state: states[i], step: effectiveSteps[i]))
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(effectiveAccessibilityLabel)
        .accessibilityIdentifier(testID ?? "")
        // Convey list semantics for VoiceOver
        // @see Requirements 4.13, 7.4, 7.13
        .accessibilityHint("List of \(totalSteps) steps")
    }

    // MARK: - Helpers

    /**
     * Build accessibility label for a single step.
     * @see Requirements 4.13-4.15, 7.5-7.6
     */
    private func stepAccessibilityLabel(index: Int, state: ProgressNodeState, step: StepDefinitioniOS) -> String {
        var label = "Step \(index + 1) of \(effectiveSteps.count): \(step.label)"
        if effectiveErrorSteps.contains(index + 1) {
            label += ", error"
        }
        if step.optional {
            label += ", optional"
        }
        return label
    }
}

// MARK: - Preview

struct ProgressStepperDetailed_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Progress-Stepper-Detailed")
                    .font(.headline)

                // Basic 3-step
                Text("3 steps, current=2, md")
                    .font(.subheadline)
                ProgressStepperDetailed(
                    steps: [
                        StepDefinitioniOS(label: "Personal Info"),
                        StepDefinitioniOS(label: "Payment"),
                        StepDefinitioniOS(label: "Review")
                    ],
                    currentStep: 2,
                    size: .md
                )
                .padding(.horizontal)

                // With icons and error
                Text("4 steps, current=2, error=[3], lg, icons")
                    .font(.subheadline)
                ProgressStepperDetailed(
                    steps: [
                        StepDefinitioniOS(label: "Account", icon: "person"),
                        StepDefinitioniOS(label: "Details", helperText: "Address & phone"),
                        StepDefinitioniOS(label: "Verify", icon: "checkmark.shield"),
                        StepDefinitioniOS(label: "Done")
                    ],
                    currentStep: 2,
                    size: .lg,
                    errorSteps: [3]
                )
                .padding(.horizontal)

                // With optional step
                Text("3 steps, current=1, optional step")
                    .font(.subheadline)
                ProgressStepperDetailed(
                    steps: [
                        StepDefinitioniOS(label: "Required"),
                        StepDefinitioniOS(label: "Optional", optional: true),
                        StepDefinitioniOS(label: "Submit")
                    ],
                    currentStep: 1,
                    size: .md
                )
                .padding(.horizontal)
            }
            .padding()
        }
    }
}
