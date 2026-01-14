/**
 * Button-VerticalList-Set Preview for iOS Platform
 * 
 * SwiftUI Preview provider for visual testing and development of the
 * Button-VerticalList-Set component across all three interaction modes.
 * 
 * This file provides comprehensive previews for:
 * - Tap mode with click callbacks
 * - Select mode with single selection
 * - Multi-select mode with multiple selections
 * - Error states and validation
 * - Animation coordination demos
 * - Accessibility testing scenarios
 * 
 * @module Button-VerticalList-Set/platforms/ios
 * @see Requirements: 10.4 - Consistent behavior across platforms
 */

import SwiftUI

// MARK: - Preview Provider

struct ButtonVerticalListSetPreview_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            // Main interactive preview
            ButtonVerticalListSetPreviewContainer()
                .previewDisplayName("Interactive Demo")
            
            // Tap mode preview
            TapModePreviewView()
                .previewDisplayName("Tap Mode")
            
            // Select mode preview
            SelectModePreviewView()
                .previewDisplayName("Select Mode")
            
            // Multi-select mode preview
            MultiSelectModePreviewView()
                .previewDisplayName("Multi-Select Mode")
            
            // Error states preview
            ErrorStatesPreviewView()
                .previewDisplayName("Error States")
            
            // Validation preview
            ValidationPreviewView()
                .previewDisplayName("Validation")
            
            // Accessibility preview
            AccessibilityPreviewView()
                .previewDisplayName("Accessibility")
        }
    }
}

// MARK: - Preview Container

/**
 * Container view for Button-VerticalList-Set previews.
 * 
 * Provides interactive state management for demonstrating all three modes
 * and their behaviors including selection, error states, and animations.
 */
struct ButtonVerticalListSetPreviewContainer: View {
    // MARK: - State
    
    /// Selected index for select mode demo
    @State private var selectModeIndex: Int? = nil
    
    /// Selected indices for multi-select mode demo
    @State private var multiSelectIndices: [Int] = []
    
    /// Error state for demos
    @State private var showError: Bool = false
    
    /// Sample items for all demos
    private let sampleItems = [
        ButtonVerticalListSetItem(id: 0, label: "Option A", description: "First option"),
        ButtonVerticalListSetItem(id: 1, label: "Option B", description: "Second option"),
        ButtonVerticalListSetItem(id: 2, label: "Option C", description: "Third option")
    ]
    
    // MARK: - Body
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 32) {
                    // Tap Mode Section
                    tapModeSection
                    
                    Divider()
                    
                    // Select Mode Section
                    selectModeSection
                    
                    Divider()
                    
                    // Multi-Select Mode Section
                    multiSelectModeSection
                    
                    Divider()
                    
                    // Error States Section
                    errorStatesSection
                }
                .padding()
            }
            .navigationTitle("VerticalList-Set")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
    
    // MARK: - Tap Mode Section
    
    @ViewBuilder
    private var tapModeSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Tap Mode")
                .font(.headline)
            
            Text("Items act as simple action buttons with no selection tracking.")
                .font(.caption)
                .foregroundColor(.secondary)
            
            ButtonVerticalListSet(
                mode: .tap,
                items: sampleItems,
                onItemClick: { index in
                    print("Tapped item \(index): \(sampleItems[index].label)")
                },
                testID: "tap-mode-preview"
            )
        }
    }
    
    // MARK: - Select Mode Section
    
    @ViewBuilder
    private var selectModeSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Select Mode")
                .font(.headline)
            
            Text("Single-selection behavior (radio-button style). Selected: \(selectModeIndex.map { String($0) } ?? "none")")
                .font(.caption)
                .foregroundColor(.secondary)
            
            ButtonVerticalListSet(
                mode: .select,
                items: sampleItems,
                selectedIndex: $selectModeIndex,
                onSelectionChange: { index in
                    print("Selection changed to \(String(describing: index))")
                },
                testID: "select-mode-preview"
            )
            
            Button("Reset Selection") {
                selectModeIndex = nil
            }
            .font(.caption)
        }
    }
    
    // MARK: - Multi-Select Mode Section
    
    @ViewBuilder
    private var multiSelectModeSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Multi-Select Mode")
                .font(.headline)
            
            Text("Multiple-selection behavior (checkbox style). Selected: \(multiSelectIndices.map { String($0) }.joined(separator: ", "))")
                .font(.caption)
                .foregroundColor(.secondary)
            
            ButtonVerticalListSet(
                mode: .multiSelect,
                items: sampleItems,
                selectedIndices: $multiSelectIndices,
                onMultiSelectionChange: { indices in
                    print("Selections changed to \(indices)")
                },
                testID: "multiselect-mode-preview"
            )
            
            Button("Clear All") {
                multiSelectIndices = []
            }
            .font(.caption)
        }
    }
    
    // MARK: - Error States Section
    
    @ViewBuilder
    private var errorStatesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Error States")
                .font(.headline)
            
            Text("Error state propagates to all children with error message display.")
                .font(.caption)
                .foregroundColor(.secondary)
            
            Toggle("Show Error", isOn: $showError)
                .font(.caption)
            
            ButtonVerticalListSet(
                mode: .select,
                items: sampleItems,
                selectedIndex: .constant(nil),
                required: true,
                error: showError,
                errorMessage: showError ? "Please select an option" : nil,
                testID: "error-state-preview"
            )
        }
    }
}

// MARK: - Tap Mode Preview

/**
 * Dedicated preview for Tap mode behavior.
 * 
 * Demonstrates:
 * - Items in rest state
 * - Click callbacks with index
 * - No selection tracking
 * 
 * Requirements: 3.1-3.4
 */
struct TapModePreviewView: View {
    @State private var lastTappedIndex: Int? = nil
    
    private let items = [
        ButtonVerticalListSetItem(id: 0, label: "Settings", leadingIcon: "gear"),
        ButtonVerticalListSetItem(id: 1, label: "Profile", description: "View and edit your profile"),
        ButtonVerticalListSetItem(id: 2, label: "Notifications", leadingIcon: "bell"),
        ButtonVerticalListSetItem(id: 3, label: "Help & Support")
    ]
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Tap Mode")
                    .font(.headline)
                
                Text("Last tapped: \(lastTappedIndex.map { "Item \($0)" } ?? "None")")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                ButtonVerticalListSet(
                    mode: .tap,
                    items: items,
                    onItemClick: { index in
                        lastTappedIndex = index
                    },
                    testID: "tap-mode-demo"
                )
                
                Text("All items remain in rest state regardless of taps.")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            .padding()
        }
    }
}

// MARK: - Select Mode Preview

/**
 * Dedicated preview for Select mode behavior.
 * 
 * Demonstrates:
 * - Single selection (radio-button style)
 * - Selected/notSelected visual states
 * - Deselection by re-selecting
 * - Staggered animation on selection change
 * 
 * Requirements: 4.1-4.7, 6.1-6.3
 */
struct SelectModePreviewView: View {
    @State private var selectedIndex: Int? = nil
    
    private let items = [
        ButtonVerticalListSetItem(id: 0, label: "Small", description: "8oz serving"),
        ButtonVerticalListSetItem(id: 1, label: "Medium", description: "12oz serving"),
        ButtonVerticalListSetItem(id: 2, label: "Large", description: "16oz serving")
    ]
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Select Mode")
                    .font(.headline)
                
                Text("Selected: \(selectedIndex.map { items[$0].label } ?? "None")")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                ButtonVerticalListSet(
                    mode: .select,
                    items: items,
                    selectedIndex: $selectedIndex,
                    onSelectionChange: { index in
                        print("Selection: \(String(describing: index))")
                    },
                    testID: "select-mode-demo"
                )
                
                HStack {
                    Button("Select First") {
                        selectedIndex = 0
                    }
                    Button("Clear") {
                        selectedIndex = nil
                    }
                }
                .font(.caption)
                
                Text("Tap selected item again to deselect.")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            .padding()
        }
    }
}

// MARK: - Multi-Select Mode Preview

/**
 * Dedicated preview for Multi-Select mode behavior.
 * 
 * Demonstrates:
 * - Multiple selection (checkbox style)
 * - Checked/unchecked visual states
 * - Toggle behavior
 * - Min/max selection constraints
 * 
 * Requirements: 5.1-5.5, 6.4, 7.4-7.5
 */
struct MultiSelectModePreviewView: View {
    @State private var selectedIndices: [Int] = []
    
    private let items = [
        ButtonVerticalListSetItem(id: 0, label: "Notifications", leadingIcon: "bell"),
        ButtonVerticalListSetItem(id: 1, label: "Dark Mode", leadingIcon: "moon"),
        ButtonVerticalListSetItem(id: 2, label: "Auto-Save", leadingIcon: "arrow.clockwise"),
        ButtonVerticalListSetItem(id: 3, label: "Analytics", leadingIcon: "chart.bar")
    ]
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Multi-Select Mode")
                    .font(.headline)
                
                Text("Selected: \(selectedIndices.count) of \(items.count)")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Text("Min: 1, Max: 3")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                
                ButtonVerticalListSet(
                    mode: .multiSelect,
                    items: items,
                    selectedIndices: $selectedIndices,
                    minSelections: 1,
                    maxSelections: 3,
                    onMultiSelectionChange: { indices in
                        print("Selections: \(indices)")
                    },
                    testID: "multiselect-mode-demo"
                )
                
                HStack {
                    Button("Select All (up to max)") {
                        selectedIndices = [0, 1, 2]
                    }
                    Button("Clear") {
                        selectedIndices = []
                    }
                }
                .font(.caption)
            }
            .padding()
        }
    }
}

// MARK: - Error States Preview

/**
 * Dedicated preview for error state behavior.
 * 
 * Demonstrates:
 * - Error message display above list
 * - Error state propagation to children
 * - Error clearing on valid selection
 * - Different error scenarios
 * 
 * Requirements: 7.1-7.6
 */
struct ErrorStatesPreviewView: View {
    @State private var selectModeIndex: Int? = nil
    @State private var multiSelectIndices: [Int] = []
    
    private let items = [
        ButtonVerticalListSetItem(id: 0, label: "Option 1"),
        ButtonVerticalListSetItem(id: 1, label: "Option 2"),
        ButtonVerticalListSetItem(id: 2, label: "Option 3")
    ]
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Select mode with required error
                VStack(alignment: .leading, spacing: 12) {
                    Text("Select Mode - Required")
                        .font(.headline)
                    
                    ButtonVerticalListSet(
                        mode: .select,
                        items: items,
                        selectedIndex: $selectModeIndex,
                        required: true,
                        error: selectModeIndex == nil,
                        errorMessage: selectModeIndex == nil ? "Please select an option" : nil,
                        testID: "select-error-demo"
                    )
                }
                
                Divider()
                
                // Multi-select mode with min selections error
                VStack(alignment: .leading, spacing: 12) {
                    Text("Multi-Select Mode - Min 2")
                        .font(.headline)
                    
                    ButtonVerticalListSet(
                        mode: .multiSelect,
                        items: items,
                        selectedIndices: $multiSelectIndices,
                        minSelections: 2,
                        error: multiSelectIndices.count < 2,
                        errorMessage: multiSelectIndices.count < 2 ? "Please select at least 2 options" : nil,
                        testID: "multiselect-error-demo"
                    )
                }
            }
            .padding()
        }
    }
}

// MARK: - Validation Preview

/**
 * Dedicated preview for validation behavior.
 * 
 * Demonstrates:
 * - Required validation in select mode
 * - Min/max validation in multi-select mode
 * - Validation result display
 * - Max selection enforcement
 * 
 * Requirements: 7.3-7.5
 */
struct ValidationPreviewView: View {
    @State private var selectedIndex: Int? = nil
    @State private var selectedIndices: [Int] = []
    
    private let items = [
        ButtonVerticalListSetItem(id: 0, label: "Choice A"),
        ButtonVerticalListSetItem(id: 1, label: "Choice B"),
        ButtonVerticalListSetItem(id: 2, label: "Choice C"),
        ButtonVerticalListSetItem(id: 3, label: "Choice D")
    ]
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Select mode validation
                VStack(alignment: .leading, spacing: 12) {
                    Text("Select Mode Validation")
                        .font(.headline)
                    
                    let selectValidation = validateSelection(
                        mode: .select,
                        selectedIndex: selectedIndex,
                        selectedIndices: [],
                        required: true
                    )
                    
                    Text("Valid: \(selectValidation.isValid ? "✓" : "✗")")
                        .font(.caption)
                        .foregroundColor(selectValidation.isValid ? .green : .red)
                    
                    if let message = selectValidation.message {
                        Text(message)
                            .font(.caption)
                            .foregroundColor(.red)
                    }
                    
                    ButtonVerticalListSet(
                        mode: .select,
                        items: items,
                        selectedIndex: $selectedIndex,
                        required: true,
                        error: !selectValidation.isValid,
                        errorMessage: selectValidation.message,
                        testID: "select-validation-demo"
                    )
                }
                
                Divider()
                
                // Multi-select mode validation
                VStack(alignment: .leading, spacing: 12) {
                    Text("Multi-Select Validation (min: 1, max: 2)")
                        .font(.headline)
                    
                    let multiValidation = validateSelection(
                        mode: .multiSelect,
                        selectedIndex: nil,
                        selectedIndices: selectedIndices,
                        required: false,
                        minSelections: 1,
                        maxSelections: 2
                    )
                    
                    Text("Valid: \(multiValidation.isValid ? "✓" : "✗")")
                        .font(.caption)
                        .foregroundColor(multiValidation.isValid ? .green : .red)
                    
                    if let message = multiValidation.message {
                        Text(message)
                            .font(.caption)
                            .foregroundColor(.red)
                    }
                    
                    ButtonVerticalListSet(
                        mode: .multiSelect,
                        items: items,
                        selectedIndices: $selectedIndices,
                        minSelections: 1,
                        maxSelections: 2,
                        error: !multiValidation.isValid,
                        errorMessage: multiValidation.message,
                        testID: "multiselect-validation-demo"
                    )
                }
            }
            .padding()
        }
    }
}

// MARK: - Accessibility Preview

/**
 * Dedicated preview for accessibility testing.
 * 
 * Demonstrates:
 * - VoiceOver labels and hints
 * - Selection state announcements
 * - Error state accessibility
 * - ARIA role equivalents
 * 
 * Requirements: 10.5, 7.6
 */
struct AccessibilityPreviewView: View {
    @State private var selectedIndex: Int? = 1
    @State private var selectedIndices: [Int] = [0, 2]
    
    private let items = [
        ButtonVerticalListSetItem(id: 0, label: "Accessible Option 1", description: "First accessible option"),
        ButtonVerticalListSetItem(id: 1, label: "Accessible Option 2", description: "Second accessible option"),
        ButtonVerticalListSetItem(id: 2, label: "Accessible Option 3", description: "Third accessible option")
    ]
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                Text("Accessibility Testing")
                    .font(.headline)
                
                Text("Enable VoiceOver to test accessibility features.")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                // Tap mode accessibility
                VStack(alignment: .leading, spacing: 8) {
                    Text("Tap Mode (role: group)")
                        .font(.subheadline)
                    
                    ButtonVerticalListSet(
                        mode: .tap,
                        items: items,
                        onItemClick: { _ in },
                        testID: "tap-accessibility-demo"
                    )
                }
                
                Divider()
                
                // Select mode accessibility
                VStack(alignment: .leading, spacing: 8) {
                    Text("Select Mode (role: radiogroup)")
                        .font(.subheadline)
                    
                    ButtonVerticalListSet(
                        mode: .select,
                        items: items,
                        selectedIndex: $selectedIndex,
                        testID: "select-accessibility-demo"
                    )
                }
                
                Divider()
                
                // Multi-select mode accessibility
                VStack(alignment: .leading, spacing: 8) {
                    Text("Multi-Select Mode (role: group, multiselectable)")
                        .font(.subheadline)
                    
                    ButtonVerticalListSet(
                        mode: .multiSelect,
                        items: items,
                        selectedIndices: $selectedIndices,
                        testID: "multiselect-accessibility-demo"
                    )
                }
                
                Divider()
                
                // Error state accessibility
                VStack(alignment: .leading, spacing: 8) {
                    Text("Error State (aria-invalid, role: alert)")
                        .font(.subheadline)
                    
                    ButtonVerticalListSet(
                        mode: .select,
                        items: items,
                        selectedIndex: .constant(nil),
                        required: true,
                        error: true,
                        errorMessage: "Please select an option",
                        testID: "error-accessibility-demo"
                    )
                }
            }
            .padding()
        }
    }
}
