/**
 * Button-VerticalList-Set Component for iOS Platform
 * 
 * Stemma System: Buttons Family
 * Component Type: Container/Orchestrator
 * Naming Convention: [Family]-[Type]-[Variant] = Button-VerticalList-Set
 * 
 * A container component that orchestrates selection behavior and coordinates
 * child Button-VerticalList-Item states. Manages selection logic, animation
 * timing, keyboard navigation, and accessibility semantics across three
 * interaction modes: Tap, Select, and Multi-Select.
 * 
 * The Set owns the "brain" (selection logic, mode behavior), while the Item
 * owns the "body" (visual rendering, individual states).
 * 
 * Part of the DesignerPunk Button System infrastructure.
 * 
 * @module Button-VerticalList-Set/platforms/ios
 * @see Requirements: 2.1-2.6, 3.1-3.4, 4.1-4.7, 5.1-5.5, 6.1-6.5, 7.1-7.6, 8.1-8.6, 9.1-9.6, 10.2, 10.4, 10.5
 */

import SwiftUI

// MARK: - Mode Enum

/**
 * Interaction modes for the Button-VerticalList-Set.
 * 
 * Requirements:
 * - 2.2: Accept mode prop with values 'tap', 'select', or 'multiSelect'
 */
public enum ButtonVerticalListSetMode: String, CaseIterable {
    /// Tap mode: Items act as simple action buttons with no selection tracking
    case tap
    
    /// Select mode: Single-selection behavior (radio-button style)
    case select
    
    /// Multi-select mode: Multiple-selection behavior (checkbox style)
    case multiSelect
}

// MARK: - Validation Result

/**
 * Result of selection validation.
 * 
 * Contains the validation status and an optional error message
 * to display to the user when validation fails.
 * 
 * Requirements:
 * - 7.3: Clear error on valid selection when required
 * - 7.4: Validate minimum selections in multiSelect mode
 * - 7.5: Validate maximum selections in multiSelect mode
 */
public struct ValidationResult: Equatable {
    /// Whether the current selection is valid
    public let isValid: Bool
    
    /// Error message to display when validation fails (nil when valid)
    public let message: String?
    
    public init(isValid: Bool, message: String? = nil) {
        self.isValid = isValid
        self.message = message
    }
}

// MARK: - Validation Functions

/**
 * Validate selection state based on mode and constraints.
 * 
 * Validation rules by mode:
 * 
 * **Select Mode**:
 * - If `required` is true, validation fails if no selection exists
 * 
 * **MultiSelect Mode**:
 * - If `minSelections` is set, validation fails if fewer items are selected
 * - If `maxSelections` is set, validation fails if more items are selected
 * 
 * **Tap Mode**:
 * - No validation (always valid)
 * 
 * @param mode - The selection mode
 * @param selectedIndex - The selected index for Select mode (nil if no selection)
 * @param selectedIndices - Array of selected indices for MultiSelect mode
 * @param required - Whether a selection is required (Select mode only)
 * @param minSelections - Minimum number of selections required (MultiSelect mode only)
 * @param maxSelections - Maximum number of selections allowed (MultiSelect mode only)
 * @returns ValidationResult with isValid flag and optional error message
 * 
 * Requirements:
 * - 7.3: WHEN a valid selection is made AND required is true THEN clear error
 * - 7.4: WHEN minSelections is set THEN validate at least that many
 * - 7.5: WHEN maxSelections is set THEN prevent selecting more
 */
public func validateSelection(
    mode: ButtonVerticalListSetMode,
    selectedIndex: Int?,
    selectedIndices: [Int],
    required: Bool,
    minSelections: Int? = nil,
    maxSelections: Int? = nil
) -> ValidationResult {
    // Select mode: Check required constraint
    // @see Requirement 7.3: "WHEN a valid selection is made AND required is true"
    if mode == .select && required && selectedIndex == nil {
        return ValidationResult(isValid: false, message: "Please select an option")
    }
    
    // MultiSelect mode: Check min/max constraints
    if mode == .multiSelect {
        let count = selectedIndices.count
        
        // @see Requirement 7.4: "WHEN minSelections is set THEN validate at least that many"
        if let min = minSelections, count < min {
            let plural = min > 1 ? "s" : ""
            return ValidationResult(
                isValid: false,
                message: "Please select at least \(min) option\(plural)"
            )
        }
        
        // @see Requirement 7.5: "WHEN maxSelections is set THEN prevent selecting more"
        // Note: This validation is for display purposes; actual prevention is in canSelectItem()
        if let max = maxSelections, count > max {
            let plural = max > 1 ? "s" : ""
            return ValidationResult(
                isValid: false,
                message: "Please select no more than \(max) option\(plural)"
            )
        }
    }
    
    // Tap mode has no validation requirements
    // All other cases are valid
    return ValidationResult(isValid: true, message: nil)
}

/**
 * Check if an item can be selected in MultiSelect mode.
 * 
 * This function enforces the `maxSelections` constraint by preventing
 * selection of additional items when the maximum is reached.
 * 
 * Rules:
 * - Items that are already selected can always be deselected
 * - New items can only be selected if under the maxSelections limit
 * 
 * @param index - The index of the item to check
 * @param selectedIndices - Array of currently selected indices
 * @param maxSelections - Maximum number of selections allowed (optional)
 * @returns true if the item can be selected/toggled, false otherwise
 * 
 * Requirements:
 * - 7.5: WHEN maxSelections is set THEN prevent selecting more than max
 */
public func canSelectItem(
    index: Int,
    selectedIndices: [Int],
    maxSelections: Int? = nil
) -> Bool {
    // Can always deselect an already selected item
    if selectedIndices.contains(index) {
        return true
    }
    
    // Check if at max selections
    if let max = maxSelections, selectedIndices.count >= max {
        return false  // At max, can't select more
    }
    
    return true
}

// MARK: - Item Data Model

/**
 * Data model for items in the Button-VerticalList-Set.
 * 
 * This model represents the configuration for each item in the list,
 * allowing the Set to manage and coordinate child item states.
 */
public struct ButtonVerticalListSetItem: Identifiable, Equatable {
    public let id: Int
    public let label: String
    public var description: String?
    public var leadingIcon: String?
    
    public init(
        id: Int,
        label: String,
        description: String? = nil,
        leadingIcon: String? = nil
    ) {
        self.id = id
        self.label = label
        self.description = description
        self.leadingIcon = leadingIcon
    }
}

// MARK: - ButtonVerticalListSet

/**
 * Button-VerticalList-Set for iOS platform.
 * 
 * A SwiftUI View that manages vertical list button groups with three interaction modes.
 * Uses controlled component pattern where the parent manages state via bindings.
 * 
 * Key Features:
 * - Three interaction modes: tap, select, multiSelect
 * - Controlled selection state via @Binding
 * - Animation timing coordination for staggered transitions
 * - VoiceOver accessibility support
 * - Haptic feedback on selection changes
 * - Error state management with validation
 * 
 * Usage:
 * ```swift
 * // Tap mode
 * @State var items = [
 *     ButtonVerticalListSetItem(id: 0, label: "Option 1"),
 *     ButtonVerticalListSetItem(id: 1, label: "Option 2")
 * ]
 * ButtonVerticalListSet(
 *     mode: .tap,
 *     items: items,
 *     onItemClick: { index in print("Tapped item \(index)") }
 * )
 * 
 * // Select mode
 * @State var selectedIndex: Int? = nil
 * ButtonVerticalListSet(
 *     mode: .select,
 *     items: items,
 *     selectedIndex: $selectedIndex
 * )
 * 
 * // Multi-select mode
 * @State var selectedIndices: [Int] = []
 * ButtonVerticalListSet(
 *     mode: .multiSelect,
 *     items: items,
 *     selectedIndices: $selectedIndices,
 *     minSelections: 1,
 *     maxSelections: 3
 * )
 * ```
 * 
 * Requirements:
 * - 2.1-2.6: Set component structure and rendering
 * - 3.1-3.4: Tap mode behavior
 * - 4.1-4.7: Select mode behavior
 * - 5.1-5.5: Multi-select mode behavior
 * - 6.1-6.5: Animation coordination
 * - 7.1-7.6: Error state management
 * - 8.1-8.6: Keyboard navigation (via SwiftUI focus system)
 * - 9.1-9.6: Controlled API
 * - 10.2: SwiftUI View implementation
 * - 10.4: Consistent behavior across platforms
 * - 10.5: VoiceOver accessibility
 */
public struct ButtonVerticalListSet: View {
    // MARK: - Properties
    
    /// Interaction mode
    /// Requirements: 2.2
    public let mode: ButtonVerticalListSetMode
    
    /// Items to display in the list
    public let items: [ButtonVerticalListSetItem]
    
    /// Selected index for select mode (controlled)
    /// Requirements: 9.1 - Accept selectedIndex prop for Select mode
    @Binding public var selectedIndex: Int?
    
    /// Selected indices for multi-select mode (controlled)
    /// Requirements: 9.2 - Accept selectedIndices prop for Multi-Select mode
    @Binding public var selectedIndices: [Int]
    
    /// Callback when item is clicked in tap mode
    /// Requirements: 9.5 - Invoke onItemClick callback in Tap mode
    public var onItemClick: ((Int) -> Void)?
    
    /// Callback when selection changes in select mode
    /// Requirements: 9.3 - Invoke onSelectionChange callback in Select mode
    public var onSelectionChange: ((Int?) -> Void)?
    
    /// Callback when selections change in multi-select mode
    /// Requirements: 9.4 - Invoke onMultiSelectionChange callback in Multi-Select mode
    public var onMultiSelectionChange: (([Int]) -> Void)?
    
    /// Whether selection is required (select mode)
    /// Requirements: 7.3 - Clear error on valid selection when required
    public var required: Bool = false
    
    /// Minimum selections required (multi-select mode)
    /// Requirements: 7.4 - Validate minimum selections
    public var minSelections: Int?
    
    /// Maximum selections allowed (multi-select mode)
    /// Requirements: 7.5 - Prevent selecting more than max
    public var maxSelections: Int?
    
    /// Error state
    /// Requirements: 7.1 - Pass error to all children
    public var error: Bool = false
    
    /// Error message to display
    /// Requirements: 7.2 - Display error message above list
    public var errorMessage: String?
    
    /// Optional test ID for automated testing
    public var testID: String?
    
    // MARK: - Internal State
    
    /// Track focused item index for keyboard navigation
    /// Requirements: 8.6 - Roving tabindex pattern (focus management)
    @State private var focusedIndex: Int = 0
    
    /// Track previous selected index for animation coordination
    /// Requirements: 6.1, 6.2 - Staggered animation calculation
    @State private var previousSelectedIndex: Int? = nil
    
    /// Track if this is the first selection
    /// Requirements: 6.2 - First selection uses simultaneous animation
    @State private var isFirstSelection: Bool = true
    
    /// Unique ID for error message element (for aria-describedby)
    /// Requirements: 7.6 - Error accessibility
    private let errorMessageId = UUID().uuidString
    
    /// Track previous error state for announcements
    /// Requirements: 10.5 - Announce error state changes to VoiceOver
    @State private var previousErrorState: Bool = false
    
    // MARK: - Initializers
    
    /// Initialize with items array
    public init(
        mode: ButtonVerticalListSetMode,
        items: [ButtonVerticalListSetItem],
        selectedIndex: Binding<Int?> = .constant(nil),
        selectedIndices: Binding<[Int]> = .constant([]),
        onItemClick: ((Int) -> Void)? = nil,
        onSelectionChange: ((Int?) -> Void)? = nil,
        onMultiSelectionChange: (([Int]) -> Void)? = nil,
        required: Bool = false,
        minSelections: Int? = nil,
        maxSelections: Int? = nil,
        error: Bool = false,
        errorMessage: String? = nil,
        testID: String? = nil
    ) {
        self.mode = mode
        self.items = items
        self._selectedIndex = selectedIndex
        self._selectedIndices = selectedIndices
        self.onItemClick = onItemClick
        self.onSelectionChange = onSelectionChange
        self.onMultiSelectionChange = onMultiSelectionChange
        self.required = required
        self.minSelections = minSelections
        self.maxSelections = maxSelections
        self.error = error
        self.errorMessage = errorMessage
        self.testID = testID
    }
    
    // MARK: - Body
    
    public var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Error message (above list)
            // Requirements: 7.2 - Display error message above list
            if let message = errorMessage, error {
                errorMessageView(message: message)
            }
            
            // Child items container
            // Requirements: 2.3, 2.4, 2.5 - Vertical stack with token spacing
            VStack(spacing: DesignTokens.spaceGroupedNormal) {
                ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
                    itemView(for: item, at: index)
                }
            }
            .frame(maxWidth: .infinity)
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(accessibilityLabel)
        .accessibilityIdentifier(testID ?? "")
        // Apply appropriate accessibility traits based on mode
        // Requirements: 3.4, 4.6, 5.4, 10.5
        .modifier(SetAccessibilityRoleModifier(
            mode: mode,
            itemCount: items.count,
            selectedCount: selectedIndices.count
        ))
        // Apply aria-invalid and aria-describedby for errors
        // Requirements: 7.6
        .modifier(ErrorAccessibilityModifier(
            error: error,
            errorMessage: errorMessage,
            errorMessageId: errorMessageId
        ))
        // Handle error state changes for accessibility announcements and haptic feedback
        // Requirements: 10.5 - VoiceOver announcements and haptic feedback
        .onAppear {
            previousErrorState = error
        }
        .onChange(of: error) { newValue in
            // Only announce if error state actually changed
            guard newValue != previousErrorState else { return }
            previousErrorState = newValue
            
            if newValue {
                // Error state became active
                triggerErrorHapticFeedback()
                
                // Announce error to VoiceOver
                if let message = errorMessage {
                    UIAccessibility.post(notification: .announcement, argument: "Error: \(message)")
                } else {
                    UIAccessibility.post(notification: .announcement, argument: "Error: Please correct the selection")
                }
            }
        }
    }
    
    // MARK: - Item View
    
    /// Creates a view for a single item
    /// Requirements: 9.6 - Derive child visual states from controlled props
    @ViewBuilder
    private func itemView(for item: ButtonVerticalListSetItem, at index: Int) -> some View {
        let visualState = deriveVisualState(for: index)
        let transitionDelay = calculateTransitionDelay(for: index)
        let checkmarkTransition = getCheckmarkTransition(for: index)
        
        VerticalListButtonItem(
            label: item.label,
            description: item.description,
            leadingIcon: item.leadingIcon,
            visualState: visualState,
            error: error,
            checkmarkTransition: checkmarkTransition,
            transitionDelay: transitionDelay,
            onClick: { handleItemClick(at: index) },
            testID: testID.map { "\($0)-item-\(index)" }
        )
        // Apply item-specific accessibility based on mode
        // Requirements: 4.7, 5.5, 10.5
        .modifier(ItemAccessibilityModifier(
            mode: mode,
            isSelected: isItemSelected(at: index),
            index: index,
            totalCount: items.count,
            itemLabel: item.label
        ))
    }
    
    // MARK: - Validation
    
    /**
     * Validate the current selection state.
     * 
     * This method validates the selection based on the current mode and constraints:
     * - Select mode: Validates `required` constraint
     * - MultiSelect mode: Validates `minSelections` and `maxSelections` constraints
     * - Tap mode: Always valid (no selection tracking)
     * 
     * Usage:
     * ```swift
     * let result = buttonSet.validate()
     * if !result.isValid {
     *     print("Validation error: \(result.message ?? "Unknown error")")
     * }
     * ```
     * 
     * Requirements:
     * - 7.3: Clear error on valid selection when required
     * - 7.4: Validate minimum selections in multiSelect mode
     * - 7.5: Validate maximum selections in multiSelect mode
     * 
     * @returns ValidationResult with isValid flag and optional error message
     */
    public func validate() -> ValidationResult {
        return validateSelection(
            mode: mode,
            selectedIndex: selectedIndex,
            selectedIndices: selectedIndices,
            required: required,
            minSelections: minSelections,
            maxSelections: maxSelections
        )
    }
    
    /**
     * Check if a specific item can be selected.
     * 
     * In MultiSelect mode, this checks if selecting the item would exceed
     * the `maxSelections` constraint. Items that are already selected can
     * always be deselected.
     * 
     * In other modes, this always returns true.
     * 
     * Usage:
     * ```swift
     * if buttonSet.canSelect(itemAt: 3) {
     *     // Item can be selected
     * } else {
     *     // At max selections, can't select more
     * }
     * ```
     * 
     * Requirements:
     * - 7.5: WHEN maxSelections is set THEN prevent selecting more than max
     * 
     * @param index - The index of the item to check
     * @returns true if the item can be selected/toggled, false otherwise
     */
    public func canSelect(itemAt index: Int) -> Bool {
        guard mode == .multiSelect else {
            return true
        }
        return canSelectItem(
            index: index,
            selectedIndices: selectedIndices,
            maxSelections: maxSelections
        )
    }
    
    // MARK: - Error Message View
    
    /// Error message display
    /// Requirements: 7.2, 7.6 - Error message with role="alert"
    @ViewBuilder
    private func errorMessageView(message: String) -> some View {
        Text(message)
            .font(.system(size: 14, weight: .regular))
            .foregroundColor(Color(DesignTokens.colorFeedbackErrorText))
            .padding(.bottom, 8)
            .accessibilityAddTraits(.isStaticText)
            // role="alert" equivalent for VoiceOver - immediate announcement
            .accessibilityLabel("Error: \(message)")
            .accessibilityIdentifier(errorMessageId)
    }
    
    // MARK: - State Derivation
    
    /// Derives the visual state for an item based on mode and selection
    /// Requirements: 9.6 - Derive child visual states from controlled props
    private func deriveVisualState(for index: Int) -> VisualState {
        switch mode {
        case .tap:
            // Requirements: 3.1 - All items in rest state
            return .rest
            
        case .select:
            // Requirements: 4.1, 4.2 - Selected/notSelected/rest states
            guard let selected = selectedIndex else {
                return .rest
            }
            return index == selected ? .selected : .notSelected
            
        case .multiSelect:
            // Requirements: 5.1, 5.2 - Checked/unchecked states
            return selectedIndices.contains(index) ? .checked : .unchecked
        }
    }
    
    /// Checks if an item is selected
    private func isItemSelected(at index: Int) -> Bool {
        switch mode {
        case .tap:
            return false
        case .select:
            return selectedIndex == index
        case .multiSelect:
            return selectedIndices.contains(index)
        }
    }
    
    // MARK: - Animation Coordination
    
    /// Calculates transition delay for staggered animations
    /// Requirements: 6.1, 6.2, 6.3, 6.4
    private func calculateTransitionDelay(for index: Int) -> Double {
        switch mode {
        case .tap:
            // No animation coordination needed
            return 0
            
        case .select:
            // Requirements: 6.2 - First selection is simultaneous
            if isFirstSelection {
                return 0
            }
            
            // Requirements: 6.3 - Deselection is simultaneous
            if selectedIndex == nil {
                return 0
            }
            
            // Requirements: 6.1 - Staggered animation for selection change
            if let prevIndex = previousSelectedIndex, let currentIndex = selectedIndex {
                if index == prevIndex {
                    // Deselecting item starts immediately
                    return 0
                } else if index == currentIndex {
                    // Selecting item starts at 50% (125ms of 250ms)
                    return 0.125
                }
            }
            return 0
            
        case .multiSelect:
            // Requirements: 6.4 - Independent animation (no delay)
            return 0
        }
    }
    
    /// Gets the checkmark transition type for an item
    /// Requirements: 6.5 - Instant checkmark on deselection
    private func getCheckmarkTransition(for index: Int) -> CheckmarkTransition {
        switch mode {
        case .tap:
            return .fade
            
        case .select:
            // Requirements: 6.5 - Instant checkmark removal on deselection
            if let prevIndex = previousSelectedIndex, index == prevIndex, selectedIndex != index {
                return .instant
            }
            return .fade
            
        case .multiSelect:
            return .fade
        }
    }
    
    // MARK: - Event Handlers
    
    /// Handles item click based on mode
    private func handleItemClick(at index: Int) {
        // Store item reference for announcement
        let item = items[index]
        
        switch mode {
        case .tap:
            // Requirements: 3.2, 9.5 - Invoke onItemClick callback
            onItemClick?(index)
            
        case .select:
            handleSelectModeClick(at: index)
            
        case .multiSelect:
            handleMultiSelectModeClick(at: index)
        }
        
        // Trigger haptic feedback
        triggerHapticFeedback(for: mode, at: index)
        
        // Announce selection change to VoiceOver
        // Requirements: 10.5 - Selection state announcements
        announceSelectionChange(for: mode, at: index, item: item)
    }
    
    /// Handles click in select mode
    /// Requirements: 4.2, 4.3, 4.4, 4.5, 9.3
    private func handleSelectModeClick(at index: Int) {
        // Track previous selection for animation
        previousSelectedIndex = selectedIndex
        
        if selectedIndex == index {
            // Requirements: 4.3 - Deselection (clicking selected item)
            selectedIndex = nil
            isFirstSelection = true
            onSelectionChange?(nil)
        } else {
            // Requirements: 4.2, 4.4 - Selection
            if isFirstSelection {
                isFirstSelection = false
            }
            selectedIndex = index
            onSelectionChange?(index)
        }
    }
    
    /// Handles click in multi-select mode
    /// Requirements: 5.2, 5.3, 7.5, 9.4
    private func handleMultiSelectModeClick(at index: Int) {
        var newIndices = selectedIndices
        
        if let existingIndex = newIndices.firstIndex(of: index) {
            // Deselect - always allowed
            newIndices.remove(at: existingIndex)
        } else {
            // Select - check max constraint using canSelectItem
            // Requirements: 7.5 - Prevent selecting more than max
            if !canSelectItem(index: index, selectedIndices: selectedIndices, maxSelections: maxSelections) {
                return // Can't select more
            }
            newIndices.append(index)
        }
        
        selectedIndices = newIndices
        onMultiSelectionChange?(newIndices)
    }
    
    /// Triggers haptic feedback for selection changes
    /// Requirements: 10.5 - Platform-appropriate feedback
    /// 
    /// Provides differentiated haptic feedback based on the action type:
    /// - Selection: Light impact for selecting an item
    /// - Deselection: Soft impact for deselecting an item
    /// - Toggle (multiSelect): Light impact for toggling
    /// - Error: Error notification for validation failures
    private func triggerHapticFeedback(for mode: ButtonVerticalListSetMode, at index: Int) {
        switch mode {
        case .tap:
            // Light tap feedback for action buttons
            let generator = UIImpactFeedbackGenerator(style: .light)
            generator.impactOccurred()
            
        case .select:
            // Differentiate between selection and deselection
            if selectedIndex == index {
                // Deselection - softer feedback
                let generator = UIImpactFeedbackGenerator(style: .soft)
                generator.impactOccurred()
            } else {
                // Selection - light feedback
                let generator = UIImpactFeedbackGenerator(style: .light)
                generator.impactOccurred()
            }
            
        case .multiSelect:
            // Toggle feedback
            if selectedIndices.contains(index) {
                // Unchecking - softer feedback
                let generator = UIImpactFeedbackGenerator(style: .soft)
                generator.impactOccurred()
            } else {
                // Checking - light feedback
                let generator = UIImpactFeedbackGenerator(style: .light)
                generator.impactOccurred()
            }
        }
    }
    
    /// Triggers error haptic feedback
    /// Requirements: 10.5 - Platform-appropriate feedback for errors
    private func triggerErrorHapticFeedback() {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.error)
    }
    
    /// Announces selection state change to VoiceOver
    /// Requirements: 10.5 - VoiceOver accessibility with selection state announcements
    /// 
    /// Posts an announcement notification to VoiceOver when selection state changes,
    /// providing immediate feedback to screen reader users about the current state.
    private func announceSelectionChange(for mode: ButtonVerticalListSetMode, at index: Int, item: ButtonVerticalListSetItem) {
        var announcement: String
        
        switch mode {
        case .tap:
            // No announcement needed for tap mode - action is immediate
            return
            
        case .select:
            if selectedIndex == index {
                // Item was just selected
                announcement = "\(item.label), selected"
            } else if selectedIndex == nil {
                // Item was deselected (all items now in rest state)
                announcement = "\(item.label), deselected"
            } else {
                // Different item selected - announce the newly selected item
                if let newIndex = selectedIndex, newIndex < items.count {
                    announcement = "\(items[newIndex].label), selected"
                } else {
                    return
                }
            }
            
        case .multiSelect:
            if selectedIndices.contains(index) {
                announcement = "\(item.label), checked"
            } else {
                announcement = "\(item.label), unchecked"
            }
        }
        
        // Post announcement to VoiceOver
        UIAccessibility.post(notification: .announcement, argument: announcement)
    }
    
    // MARK: - Computed Properties
    
    /// Accessibility label for the container
    private var accessibilityLabel: String {
        switch mode {
        case .tap:
            return "Button group"
        case .select:
            return "Selection group"
        case .multiSelect:
            return "Multiple selection group"
        }
    }
}

// MARK: - SetAccessibilityRoleModifier

/**
 * Modifier to apply appropriate accessibility role based on mode.
 * 
 * Provides VoiceOver users with context about the type of selection group:
 * - Tap mode: Group of action buttons
 * - Select mode: Single-selection group (like radio buttons)
 * - MultiSelect mode: Multiple-selection group (like checkboxes)
 * 
 * Requirements:
 * - 3.4: role="group" for tap mode
 * - 4.6: role="radiogroup" for select mode
 * - 5.4: role="group" with aria-multiselectable for multiSelect mode
 * - 10.5: VoiceOver accessibility support
 */
struct SetAccessibilityRoleModifier: ViewModifier {
    let mode: ButtonVerticalListSetMode
    let itemCount: Int
    let selectedCount: Int
    
    init(mode: ButtonVerticalListSetMode, itemCount: Int = 0, selectedCount: Int = 0) {
        self.mode = mode
        self.itemCount = itemCount
        self.selectedCount = selectedCount
    }
    
    func body(content: Content) -> some View {
        switch mode {
        case .tap:
            // Requirements: 3.4 - role="group" for action buttons
            content
                .accessibilityElement(children: .contain)
                .accessibilityLabel("Button group, \(itemCount) options")
        case .select:
            // Requirements: 4.6 - role="radiogroup" for single selection
            content
                .accessibilityElement(children: .contain)
                .accessibilityLabel("Selection group, \(itemCount) options")
                .accessibilityHint("Double tap to select an option")
        case .multiSelect:
            // Requirements: 5.4 - role="group" with aria-multiselectable
            content
                .accessibilityElement(children: .contain)
                .accessibilityLabel("Multiple selection group, \(selectedCount) of \(itemCount) selected")
                .accessibilityHint("Double tap to toggle selection")
        }
    }
}

// MARK: - ItemAccessibilityModifier

/**
 * Modifier to apply item-specific accessibility attributes.
 * 
 * Provides VoiceOver users with:
 * - Selection state (selected/not selected for select mode, checked/unchecked for multiSelect)
 * - Position in list (e.g., "Option 1 of 3")
 * - Appropriate hints for interaction
 * 
 * Requirements:
 * - 4.7: role="radio" and aria-checked for select mode items
 * - 5.5: role="checkbox" and aria-checked for multiSelect mode items
 * - 10.5: VoiceOver accessibility support with selection state announcements
 */
struct ItemAccessibilityModifier: ViewModifier {
    let mode: ButtonVerticalListSetMode
    let isSelected: Bool
    let index: Int
    let totalCount: Int
    let itemLabel: String
    
    init(mode: ButtonVerticalListSetMode, isSelected: Bool, index: Int, totalCount: Int, itemLabel: String = "") {
        self.mode = mode
        self.isSelected = isSelected
        self.index = index
        self.totalCount = totalCount
        self.itemLabel = itemLabel
    }
    
    func body(content: Content) -> some View {
        switch mode {
        case .tap:
            // Tap mode items are simple buttons
            content
                .accessibilityAddTraits(.isButton)
                .accessibilityHint("Double tap to activate")
        case .select:
            // Requirements: 4.7 - role="radio" and aria-checked
            // VoiceOver will announce: "[label], [selected/not selected], radio button, [position]"
            content
                .accessibilityAddTraits(isSelected ? [.isButton, .isSelected] : .isButton)
                .accessibilityValue(isSelected ? "Selected" : "Not selected")
                .accessibilityHint("Option \(index + 1) of \(totalCount). Double tap to \(isSelected ? "deselect" : "select")")
        case .multiSelect:
            // Requirements: 5.5 - role="checkbox" and aria-checked
            // VoiceOver will announce: "[label], [checked/unchecked], checkbox, [position]"
            content
                .accessibilityAddTraits(isSelected ? [.isButton, .isSelected] : .isButton)
                .accessibilityValue(isSelected ? "Checked" : "Unchecked")
                .accessibilityHint("Option \(index + 1) of \(totalCount). Double tap to \(isSelected ? "uncheck" : "check")")
        }
    }
}

// MARK: - ErrorAccessibilityModifier

/**
 * Modifier to apply error accessibility attributes.
 * 
 * Provides VoiceOver users with:
 * - Invalid state indication when error is present
 * - Error message announcement via aria-describedby equivalent
 * - Immediate feedback when error state changes
 * 
 * Requirements:
 * - 7.6: aria-invalid and aria-describedby for errors
 * - 10.5: VoiceOver accessibility support
 */
struct ErrorAccessibilityModifier: ViewModifier {
    let error: Bool
    let errorMessage: String?
    let errorMessageId: String
    
    func body(content: Content) -> some View {
        if error {
            content
                .accessibilityValue(errorMessage != nil ? "Invalid. \(errorMessage!)" : "Invalid")
                .accessibilityHint(errorMessage ?? "Please correct the error")
        } else {
            content
        }
    }
}

// MARK: - DesignTokens Extensions

extension DesignTokens {
    /// Grouped normal spacing (8pt)
    /// Requirements: 2.4 - Gap between child items
    public static let spaceGroupedNormal: CGFloat = 8
}

// MARK: - Preview

struct ButtonVerticalListSet_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            // Tap Mode Preview
            TapModePreview()
                .previewDisplayName("Tap Mode")
            
            // Select Mode Preview
            SelectModePreview()
                .previewDisplayName("Select Mode")
            
            // Multi-Select Mode Preview
            MultiSelectModePreview()
                .previewDisplayName("Multi-Select Mode")
            
            // Error State Preview
            ErrorStatePreview()
                .previewDisplayName("Error States")
        }
    }
}

// MARK: - Preview Helpers

struct TapModePreview: View {
    let items = [
        ButtonVerticalListSetItem(id: 0, label: "Settings", leadingIcon: "gear"),
        ButtonVerticalListSetItem(id: 1, label: "Profile", description: "View and edit your profile"),
        ButtonVerticalListSetItem(id: 2, label: "Notifications", leadingIcon: "bell")
    ]
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Tap Mode")
                    .font(.headline)
                
                ButtonVerticalListSet(
                    mode: .tap,
                    items: items,
                    onItemClick: { index in print("Tapped item \(index)") },
                    testID: "tap-mode-demo"
                )
            }
            .padding()
        }
    }
}

struct SelectModePreview: View {
    @State private var selectedIndex: Int? = nil
    
    let items = [
        ButtonVerticalListSetItem(id: 0, label: "Option A", description: "First option"),
        ButtonVerticalListSetItem(id: 1, label: "Option B", description: "Second option"),
        ButtonVerticalListSetItem(id: 2, label: "Option C", description: "Third option")
    ]
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Select Mode")
                    .font(.headline)
                
                Text("Selected: \(selectedIndex.map { String($0) } ?? "None")")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                ButtonVerticalListSet(
                    mode: .select,
                    items: items,
                    selectedIndex: $selectedIndex,
                    onSelectionChange: { index in print("Selection changed to \(String(describing: index))") },
                    testID: "select-mode-demo"
                )
            }
            .padding()
        }
    }
}

struct MultiSelectModePreview: View {
    @State private var selectedIndices: [Int] = []
    
    let items = [
        ButtonVerticalListSetItem(id: 0, label: "Enable notifications", leadingIcon: "bell"),
        ButtonVerticalListSetItem(id: 1, label: "Dark mode", leadingIcon: "moon"),
        ButtonVerticalListSetItem(id: 2, label: "Auto-save", leadingIcon: "arrow.clockwise"),
        ButtonVerticalListSetItem(id: 3, label: "Analytics", leadingIcon: "chart.bar")
    ]
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Multi-Select Mode")
                    .font(.headline)
                
                Text("Selected: \(selectedIndices.map { String($0) }.joined(separator: ", "))")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                ButtonVerticalListSet(
                    mode: .multiSelect,
                    items: items,
                    selectedIndices: $selectedIndices,
                    minSelections: 1,
                    maxSelections: 3,
                    onMultiSelectionChange: { indices in print("Selections changed to \(indices)") },
                    testID: "multiselect-mode-demo"
                )
            }
            .padding()
        }
    }
}

struct ErrorStatePreview: View {
    @State private var selectedIndex: Int? = nil
    @State private var selectedIndices: [Int] = []
    
    let items = [
        ButtonVerticalListSetItem(id: 0, label: "Option 1"),
        ButtonVerticalListSetItem(id: 1, label: "Option 2"),
        ButtonVerticalListSetItem(id: 2, label: "Option 3")
    ]
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Error States")
                    .font(.headline)
                
                Text("Select Mode with Error")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                ButtonVerticalListSet(
                    mode: .select,
                    items: items,
                    selectedIndex: $selectedIndex,
                    required: true,
                    error: true,
                    errorMessage: "Please select an option",
                    testID: "select-error-demo"
                )
                
                Divider()
                
                Text("Multi-Select Mode with Error")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                ButtonVerticalListSet(
                    mode: .multiSelect,
                    items: items,
                    selectedIndices: $selectedIndices,
                    minSelections: 2,
                    error: true,
                    errorMessage: "Please select at least 2 options",
                    testID: "multiselect-error-demo"
                )
            }
            .padding()
        }
    }
}
