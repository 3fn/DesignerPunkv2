/**
 * Input-Radio-Set Component for iOS Platform
 * 
 * Orchestrator component that manages a group of Input-Radio-Base children,
 * providing mutual exclusivity, controlled selection state, validation,
 * and error display.
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Input-Radio-Set
 * Component Type: Pattern (Set)
 * 
 * Architectural Principle: ORCHESTRATION, NOT DUPLICATION
 * This component orchestrates child Input-Radio-Base components via SwiftUI
 * environment values. It does NOT duplicate radio circle/dot rendering logic.
 * 
 * Platform State Coordination (iOS):
 * - Uses EnvironmentKey to pass selectedValue binding to children
 * - Uses EnvironmentKey to pass size to children
 * - Children read environment values to determine their selected state
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered.
 * 
 * @module Input-Radio-Set/platforms/ios
 * @see Requirements: 9.1, 9.2, 9.3, 9.4, 9.8, 9.9, 11.2
 */

import SwiftUI

// MARK: - Environment Keys

/**
 * Environment key for passing the selected value binding through the view hierarchy.
 * 
 * Input-Radio-Set uses this to coordinate selection state with child
 * Input-Radio-Base components without duplicating rendering logic.
 * 
 * @see Requirement 11.2 - iOS uses environment values to pass selection state
 */
private struct RadioSetSelectedValueKey: EnvironmentKey {
    static let defaultValue: Binding<String?>? = nil
}

/**
 * Environment key for passing the size variant to all children.
 * 
 * When a size is set on the Set, all child radios inherit it for
 * visual consistency within the group.
 * 
 * @see Requirement 9.10 - Size prop applied to all child radios
 */
private struct RadioSetSizeKey: EnvironmentKey {
    static let defaultValue: RadioSize? = nil
}

// MARK: - Environment Values Extension

extension EnvironmentValues {
    /// The selected value binding from the parent Input-Radio-Set.
    /// Child Input-Radio-Base components read this to determine selection state.
    var radioSetSelectedValue: Binding<String?>? {
        get { self[RadioSetSelectedValueKey.self] }
        set { self[RadioSetSelectedValueKey.self] = newValue }
    }
    
    /// The size variant from the parent Input-Radio-Set.
    /// Child Input-Radio-Base components read this to override their local size.
    var radioSetSize: RadioSize? {
        get { self[RadioSetSizeKey.self] }
        set { self[RadioSetSizeKey.self] = newValue }
    }
}

// MARK: - InputRadioSet Component

/**
 * InputRadioSet component for iOS platform.
 * 
 * Orchestrates child Input-Radio-Base components to provide group behavior:
 * - Mutual exclusivity via shared selectedValue binding
 * - Controlled selection state passed through environment values
 * - Group-level error message display
 * - Consistent sizing across all children
 * 
 * Usage:
 * ```swift
 * @State private var selectedPlan: String? = nil
 * 
 * InputRadioSet(selectedValue: $selectedPlan) {
 *     InputRadioBase(value: "basic", label: "Basic Plan", selectedValue: $selectedPlan)
 *     InputRadioBase(value: "pro", label: "Pro Plan", selectedValue: $selectedPlan)
 *     InputRadioBase(value: "enterprise", label: "Enterprise Plan", selectedValue: $selectedPlan)
 * }
 * 
 * // With validation and error
 * InputRadioSet(
 *     selectedValue: $selectedPlan,
 *     required: true,
 *     error: true,
 *     errorMessage: "Please select a plan"
 * ) {
 *     InputRadioBase(value: "basic", label: "Basic", selectedValue: $selectedPlan)
 *     InputRadioBase(value: "pro", label: "Pro", selectedValue: $selectedPlan)
 * }
 * ```
 * 
 * Requirements:
 * - 9.1: Orchestrates child Input-Radio-Base components
 * - 9.3: Passes selected state to matching child
 * - 9.4: Calls onSelectionChange when selection changes
 * - 9.8: Displays error message when error is true
 * - 11.2: Uses environment values to pass selection state
 */
struct InputRadioSet<Content: View>: View {
    // MARK: - Properties
    
    /// Currently selected value (controlled via binding)
    /// @see Requirement 9.3 - Pass selected state to matching child
    @Binding var selectedValue: String?
    
    /// Whether a selection is required for validation
    /// @see Requirement 9.7 - Required validation
    var required: Bool
    
    /// Error state indicator
    /// @see Requirement 9.8 - Error display
    var error: Bool
    
    /// Error message to display above the radio group
    /// @see Requirement 9.8, 9.9 - Error message with screen reader announcement
    var errorMessage: String?
    
    /// Size variant applied to all children
    /// @see Requirement 9.10 - Size propagation
    var size: RadioSize
    
    /// Callback when selection changes
    /// @see Requirement 9.4 - Selection change callback
    var onSelectionChange: ((String?) -> Void)?
    
    /// Test ID for automated testing
    var testID: String?
    
    /// Child content built with @ViewBuilder
    let content: Content
    
    // MARK: - Initialization
    
    /**
     * Initialize InputRadioSet with all properties.
     * 
     * - Parameters:
     *   - selectedValue: Binding to the currently selected value
     *   - required: Whether selection is required (default: false)
     *   - error: Whether to show error state (default: false)
     *   - errorMessage: Error message to display (default: nil)
     *   - size: Size variant for all children (default: .md)
     *   - onSelectionChange: Callback when selection changes (default: nil)
     *   - testID: Test identifier (default: nil)
     *   - content: Child views built with @ViewBuilder
     */
    init(
        selectedValue: Binding<String?>,
        required: Bool = false,
        error: Bool = false,
        errorMessage: String? = nil,
        size: RadioSize = .md,
        onSelectionChange: ((String?) -> Void)? = nil,
        testID: String? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self._selectedValue = selectedValue
        self.required = required
        self.error = error
        self.errorMessage = errorMessage
        self.size = size
        self.onSelectionChange = onSelectionChange
        self.testID = testID
        self.content = content()
    }
    
    // MARK: - Body
    
    var body: some View {
        VStack(alignment: .leading, spacing: DesignTokens.spaceGroupedNormal) {
            // Error message display
            // @see Requirement 9.8 - Display errorMessage when error is true
            // @see Requirement 9.9 - Screen reader announcement for error
            if error, let message = errorMessage {
                Text(message)
                    .font(.system(size: DesignTokens.fontSize050, weight: .regular))
                    .foregroundColor(Color(DesignTokens.colorFeedbackErrorText))
                    // @see Requirement 9.9 - Error message announced to screen readers
                    // accessibilityLabel prefixed with "Error:" for clear VoiceOver context
                    .accessibilityLabel("Error: \(message)")
                    // sortPriority ensures VoiceOver announces the error before child radios
                    .accessibilitySortPriority(1)
                    .accessibilityIdentifier("\(testID ?? "radio-set")-error")
            }
            
            // Child content with environment values
            // @see Requirement 9.1 - Orchestrate children (not duplicate rendering)
            // @see Requirement 11.2 - Pass selection state via environment values
            content
                .environment(\.radioSetSelectedValue, $selectedValue)
                .environment(\.radioSetSize, size)
        }
        // MARK: - Accessibility (Requirements 9.2, 9.9)
        // @see Requirement 9.2 - Accessibility group (role="radiogroup" equivalent)
        // .contain allows VoiceOver to navigate into child radios individually
        .accessibilityElement(children: .contain)
        // Announce group context so VoiceOver users understand this is a radio group
        .accessibilityLabel("Radio group")
        .accessibilityIdentifier(testID ?? "")
        // Observe selection changes to invoke callback
        .onChange(of: selectedValue) { newValue in
            onSelectionChange?(newValue)
        }
    }
}

// MARK: - Preview

#if DEBUG
struct InputRadioSet_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 32) {
                // Basic radio group
                Text("Basic Radio Group")
                    .font(.headline)
                
                PreviewRadioSet()
                
                Divider()
                
                // With error state
                Text("Error State")
                    .font(.headline)
                
                PreviewRadioSetWithError()
                
                Divider()
                
                // Large size variant
                Text("Large Size")
                    .font(.headline)
                
                PreviewRadioSetLarge()
            }
            .padding()
        }
    }
}

/// Preview helper for basic radio group
private struct PreviewRadioSet: View {
    @State private var selected: String? = "option-b"
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            InputRadioSet(selectedValue: $selected) {
                InputRadioBase(value: "option-a", label: "Option A", selectedValue: $selected)
                InputRadioBase(value: "option-b", label: "Option B", selectedValue: $selected)
                InputRadioBase(value: "option-c", label: "Option C", selectedValue: $selected)
            }
            
            Text("Selected: \(selected ?? "None")")
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}

/// Preview helper for error state
private struct PreviewRadioSetWithError: View {
    @State private var selected: String? = nil
    
    var body: some View {
        InputRadioSet(
            selectedValue: $selected,
            required: true,
            error: true,
            errorMessage: "Please select an option"
        ) {
            InputRadioBase(value: "yes", label: "Yes", selectedValue: $selected)
            InputRadioBase(value: "no", label: "No", selectedValue: $selected)
        }
    }
}

/// Preview helper for large size
private struct PreviewRadioSetLarge: View {
    @State private var selected: String? = "basic"
    
    var body: some View {
        InputRadioSet(
            selectedValue: $selected,
            size: .lg,
            onSelectionChange: { value in
                print("Selection changed to: \(value ?? "nil")")
            }
        ) {
            InputRadioBase(
                value: "basic",
                label: "Basic Plan - $9/month",
                selectedValue: $selected,
                size: .lg,
                helperText: "For individuals"
            )
            InputRadioBase(
                value: "pro",
                label: "Pro Plan - $19/month",
                selectedValue: $selected,
                size: .lg,
                helperText: "For small teams"
            )
            InputRadioBase(
                value: "enterprise",
                label: "Enterprise Plan - $49/month",
                selectedValue: $selected,
                size: .lg,
                helperText: "For large organizations"
            )
        }
    }
}
#endif
