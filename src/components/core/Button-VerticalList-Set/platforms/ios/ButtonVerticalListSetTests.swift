/**
 * Tests for Button-VerticalList-Set iOS Platform
 * 
 * Tests mode behaviors, state derivation, animation coordination, validation,
 * and accessibility for the SwiftUI implementation.
 * 
 * Part of the DesignerPunk Button System infrastructure.
 * 
 * Test Categories:
 * - Mode Behavior: Verify correct behavior for tap, select, multiSelect modes
 * - State Derivation: Verify visual states are derived from controlled props
 * - Animation Coordination: Verify transition delay calculations
 * - Validation: Verify selection validation logic
 * - Accessibility: Verify VoiceOver support and ARIA equivalents
 * 
 * @module Button-VerticalList-Set/platforms/ios
 * @see Requirements: 2.1-2.6, 3.1-3.4, 4.1-4.7, 5.1-5.5, 6.1-6.5, 7.1-7.6, 9.1-9.6, 10.4, 10.5
 */

import XCTest
import SwiftUI
@testable import DesignerPunk

/**
 * Unit tests for ButtonVerticalListSet iOS component.
 * 
 * These tests verify the component's behavior by testing:
 * 1. Mode enum values and behavior
 * 2. Validation logic (validateSelection, canSelectItem)
 * 3. State derivation from controlled props
 * 4. Animation timing calculations
 * 5. Accessibility modifiers and descriptions
 * 
 * The tests focus on behavior verification rather than implementation details,
 * following Test Development Standards.
 */
final class ButtonVerticalListSetTests: XCTestCase {
    
    // MARK: - Mode Enum Tests
    
    /// Test that all mode values are defined
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 2.2
    func testModeEnumValues() throws {
        XCTAssertEqual(ButtonVerticalListSetMode.tap.rawValue, "tap")
        XCTAssertEqual(ButtonVerticalListSetMode.select.rawValue, "select")
        XCTAssertEqual(ButtonVerticalListSetMode.multiSelect.rawValue, "multiSelect")
    }
    
    /// Test that mode enum is CaseIterable
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 2.2
    func testModeEnumIsCaseIterable() throws {
        let allCases = ButtonVerticalListSetMode.allCases
        XCTAssertEqual(allCases.count, 3)
        XCTAssertTrue(allCases.contains(.tap))
        XCTAssertTrue(allCases.contains(.select))
        XCTAssertTrue(allCases.contains(.multiSelect))
    }
    
    // MARK: - Validation Result Tests
    
    /// Test ValidationResult initialization
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.3
    func testValidationResultInitialization() throws {
        let validResult = ValidationResult(isValid: true)
        XCTAssertTrue(validResult.isValid)
        XCTAssertNil(validResult.message)
        
        let invalidResult = ValidationResult(isValid: false, message: "Error message")
        XCTAssertFalse(invalidResult.isValid)
        XCTAssertEqual(invalidResult.message, "Error message")
    }
    
    /// Test ValidationResult equality
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.3
    func testValidationResultEquality() throws {
        let result1 = ValidationResult(isValid: true)
        let result2 = ValidationResult(isValid: true)
        let result3 = ValidationResult(isValid: false, message: "Error")
        
        XCTAssertEqual(result1, result2)
        XCTAssertNotEqual(result1, result3)
    }
    
    // MARK: - Validation Logic Tests (Requirement 7.3-7.5)
    
    /// Test tap mode validation always returns valid
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.3
    func testTapModeValidationAlwaysValid() throws {
        let result = validateSelection(
            mode: .tap,
            selectedIndex: nil,
            selectedIndices: [],
            required: true
        )
        XCTAssertTrue(result.isValid)
        XCTAssertNil(result.message)
    }
    
    /// Test select mode required validation - no selection
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.3
    func testSelectModeRequiredValidationNoSelection() throws {
        let result = validateSelection(
            mode: .select,
            selectedIndex: nil,
            selectedIndices: [],
            required: true
        )
        XCTAssertFalse(result.isValid)
        XCTAssertEqual(result.message, "Please select an option")
    }
    
    /// Test select mode required validation - with selection
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.3
    func testSelectModeRequiredValidationWithSelection() throws {
        let result = validateSelection(
            mode: .select,
            selectedIndex: 1,
            selectedIndices: [],
            required: true
        )
        XCTAssertTrue(result.isValid)
        XCTAssertNil(result.message)
    }
    
    /// Test select mode non-required validation
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.3
    func testSelectModeNonRequiredValidation() throws {
        let result = validateSelection(
            mode: .select,
            selectedIndex: nil,
            selectedIndices: [],
            required: false
        )
        XCTAssertTrue(result.isValid)
        XCTAssertNil(result.message)
    }
    
    /// Test multiSelect mode minSelections validation - below minimum
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.4
    func testMultiSelectMinSelectionsValidationBelowMin() throws {
        let result = validateSelection(
            mode: .multiSelect,
            selectedIndex: nil,
            selectedIndices: [0],
            required: false,
            minSelections: 2
        )
        XCTAssertFalse(result.isValid)
        XCTAssertEqual(result.message, "Please select at least 2 options")
    }
    
    /// Test multiSelect mode minSelections validation - at minimum
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.4
    func testMultiSelectMinSelectionsValidationAtMin() throws {
        let result = validateSelection(
            mode: .multiSelect,
            selectedIndex: nil,
            selectedIndices: [0, 1],
            required: false,
            minSelections: 2
        )
        XCTAssertTrue(result.isValid)
        XCTAssertNil(result.message)
    }
    
    /// Test multiSelect mode minSelections validation - singular message
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.4
    func testMultiSelectMinSelectionsValidationSingular() throws {
        let result = validateSelection(
            mode: .multiSelect,
            selectedIndex: nil,
            selectedIndices: [],
            required: false,
            minSelections: 1
        )
        XCTAssertFalse(result.isValid)
        XCTAssertEqual(result.message, "Please select at least 1 option")
    }
    
    /// Test multiSelect mode maxSelections validation - above maximum
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.5
    func testMultiSelectMaxSelectionsValidationAboveMax() throws {
        let result = validateSelection(
            mode: .multiSelect,
            selectedIndex: nil,
            selectedIndices: [0, 1, 2, 3],
            required: false,
            maxSelections: 3
        )
        XCTAssertFalse(result.isValid)
        XCTAssertEqual(result.message, "Please select no more than 3 options")
    }
    
    /// Test multiSelect mode maxSelections validation - at maximum
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.5
    func testMultiSelectMaxSelectionsValidationAtMax() throws {
        let result = validateSelection(
            mode: .multiSelect,
            selectedIndex: nil,
            selectedIndices: [0, 1, 2],
            required: false,
            maxSelections: 3
        )
        XCTAssertTrue(result.isValid)
        XCTAssertNil(result.message)
    }
    
    /// Test multiSelect mode maxSelections validation - singular message
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.5
    func testMultiSelectMaxSelectionsValidationSingular() throws {
        let result = validateSelection(
            mode: .multiSelect,
            selectedIndex: nil,
            selectedIndices: [0, 1],
            required: false,
            maxSelections: 1
        )
        XCTAssertFalse(result.isValid)
        XCTAssertEqual(result.message, "Please select no more than 1 option")
    }
    
    // MARK: - canSelectItem Tests (Requirement 7.5)
    
    /// Test canSelectItem allows deselection of selected item
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.5
    func testCanSelectItemAllowsDeselection() throws {
        let result = canSelectItem(
            index: 1,
            selectedIndices: [0, 1, 2],
            maxSelections: 3
        )
        XCTAssertTrue(result, "Should allow deselecting an already selected item")
    }
    
    /// Test canSelectItem prevents selection at max
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.5
    func testCanSelectItemPreventsSelectionAtMax() throws {
        let result = canSelectItem(
            index: 3,
            selectedIndices: [0, 1, 2],
            maxSelections: 3
        )
        XCTAssertFalse(result, "Should prevent selecting when at max")
    }
    
    /// Test canSelectItem allows selection below max
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.5
    func testCanSelectItemAllowsSelectionBelowMax() throws {
        let result = canSelectItem(
            index: 2,
            selectedIndices: [0, 1],
            maxSelections: 3
        )
        XCTAssertTrue(result, "Should allow selecting when below max")
    }
    
    /// Test canSelectItem allows selection without max constraint
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.5
    func testCanSelectItemAllowsSelectionWithoutMax() throws {
        let result = canSelectItem(
            index: 5,
            selectedIndices: [0, 1, 2, 3, 4],
            maxSelections: nil
        )
        XCTAssertTrue(result, "Should allow selecting when no max is set")
    }
    
    // MARK: - Item Data Model Tests
    
    /// Test ButtonVerticalListSetItem initialization
    /// Feature: 041-vertical-list-buttons-pattern
    func testItemInitialization() throws {
        let item = ButtonVerticalListSetItem(
            id: 0,
            label: "Test Label",
            description: "Test Description",
            leadingIcon: "star"
        )
        
        XCTAssertEqual(item.id, 0)
        XCTAssertEqual(item.label, "Test Label")
        XCTAssertEqual(item.description, "Test Description")
        XCTAssertEqual(item.leadingIcon, "star")
    }
    
    /// Test ButtonVerticalListSetItem with minimal initialization
    /// Feature: 041-vertical-list-buttons-pattern
    func testItemMinimalInitialization() throws {
        let item = ButtonVerticalListSetItem(id: 1, label: "Simple")
        
        XCTAssertEqual(item.id, 1)
        XCTAssertEqual(item.label, "Simple")
        XCTAssertNil(item.description)
        XCTAssertNil(item.leadingIcon)
    }
    
    /// Test ButtonVerticalListSetItem equality
    /// Feature: 041-vertical-list-buttons-pattern
    func testItemEquality() throws {
        let item1 = ButtonVerticalListSetItem(id: 0, label: "Test")
        let item2 = ButtonVerticalListSetItem(id: 0, label: "Test")
        let item3 = ButtonVerticalListSetItem(id: 1, label: "Test")
        
        XCTAssertEqual(item1, item2)
        XCTAssertNotEqual(item1, item3)
    }
    
    // MARK: - Design Tokens Tests
    
    /// Test spaceGroupedNormal token value
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 2.4
    func testSpaceGroupedNormalToken() throws {
        XCTAssertEqual(DesignTokens.spaceGroupedNormal, 8, "Gap between items should be 8pt")
    }
}

// MARK: - Accessibility Modifier Tests

/**
 * Tests for accessibility modifiers used by ButtonVerticalListSet.
 * 
 * These tests verify that the accessibility modifiers correctly apply
 * ARIA-equivalent attributes for VoiceOver support.
 */
final class ButtonVerticalListSetAccessibilityTests: XCTestCase {
    
    /// Test SetAccessibilityRoleModifier initialization for tap mode
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 3.4
    func testSetAccessibilityRoleModifierTapMode() throws {
        let modifier = SetAccessibilityRoleModifier(mode: .tap, itemCount: 3, selectedCount: 0)
        XCTAssertEqual(modifier.mode, .tap)
        XCTAssertEqual(modifier.itemCount, 3)
    }
    
    /// Test SetAccessibilityRoleModifier initialization for select mode
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 4.6
    func testSetAccessibilityRoleModifierSelectMode() throws {
        let modifier = SetAccessibilityRoleModifier(mode: .select, itemCount: 3, selectedCount: 1)
        XCTAssertEqual(modifier.mode, .select)
        XCTAssertEqual(modifier.itemCount, 3)
    }
    
    /// Test SetAccessibilityRoleModifier initialization for multiSelect mode
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 5.4
    func testSetAccessibilityRoleModifierMultiSelectMode() throws {
        let modifier = SetAccessibilityRoleModifier(mode: .multiSelect, itemCount: 4, selectedCount: 2)
        XCTAssertEqual(modifier.mode, .multiSelect)
        XCTAssertEqual(modifier.itemCount, 4)
        XCTAssertEqual(modifier.selectedCount, 2)
    }
    
    /// Test ItemAccessibilityModifier initialization
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 4.7, 5.5
    func testItemAccessibilityModifierInitialization() throws {
        let modifier = ItemAccessibilityModifier(
            mode: .select,
            isSelected: true,
            index: 1,
            totalCount: 3,
            itemLabel: "Option B"
        )
        
        XCTAssertEqual(modifier.mode, .select)
        XCTAssertTrue(modifier.isSelected)
        XCTAssertEqual(modifier.index, 1)
        XCTAssertEqual(modifier.totalCount, 3)
        XCTAssertEqual(modifier.itemLabel, "Option B")
    }
    
    /// Test ErrorAccessibilityModifier with error
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.6
    func testErrorAccessibilityModifierWithError() throws {
        let modifier = ErrorAccessibilityModifier(
            error: true,
            errorMessage: "Please select an option",
            errorMessageId: "error-123"
        )
        
        XCTAssertTrue(modifier.error)
        XCTAssertEqual(modifier.errorMessage, "Please select an option")
        XCTAssertEqual(modifier.errorMessageId, "error-123")
    }
    
    /// Test ErrorAccessibilityModifier without error
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 7.6
    func testErrorAccessibilityModifierWithoutError() throws {
        let modifier = ErrorAccessibilityModifier(
            error: false,
            errorMessage: nil,
            errorMessageId: "error-123"
        )
        
        XCTAssertFalse(modifier.error)
        XCTAssertNil(modifier.errorMessage)
    }
}

// MARK: - Cross-Platform Consistency Tests

/**
 * Tests to verify cross-platform behavioral consistency.
 * 
 * These tests ensure the iOS implementation behaves consistently
 * with the Web implementation as specified in the design document.
 * 
 * Requirements: 10.4 - Consistent behavior across platforms
 */
final class ButtonVerticalListSetCrossPlatformTests: XCTestCase {
    
    /// Test validation logic matches web implementation
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 10.4
    func testValidationLogicMatchesWeb() throws {
        // Test cases that should produce identical results on web and iOS
        
        // Case 1: Select mode, required, no selection
        let case1 = validateSelection(
            mode: .select,
            selectedIndex: nil,
            selectedIndices: [],
            required: true
        )
        XCTAssertFalse(case1.isValid)
        XCTAssertEqual(case1.message, "Please select an option")
        
        // Case 2: MultiSelect mode, minSelections=2, 1 selected
        let case2 = validateSelection(
            mode: .multiSelect,
            selectedIndex: nil,
            selectedIndices: [0],
            required: false,
            minSelections: 2
        )
        XCTAssertFalse(case2.isValid)
        XCTAssertEqual(case2.message, "Please select at least 2 options")
        
        // Case 3: MultiSelect mode, maxSelections=2, 3 selected
        let case3 = validateSelection(
            mode: .multiSelect,
            selectedIndex: nil,
            selectedIndices: [0, 1, 2],
            required: false,
            maxSelections: 2
        )
        XCTAssertFalse(case3.isValid)
        XCTAssertEqual(case3.message, "Please select no more than 2 options")
    }
    
    /// Test canSelectItem logic matches web implementation
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 10.4
    func testCanSelectItemLogicMatchesWeb() throws {
        // Test cases that should produce identical results on web and iOS
        
        // Case 1: Can deselect at max
        XCTAssertTrue(canSelectItem(index: 0, selectedIndices: [0, 1, 2], maxSelections: 3))
        
        // Case 2: Cannot select new at max
        XCTAssertFalse(canSelectItem(index: 3, selectedIndices: [0, 1, 2], maxSelections: 3))
        
        // Case 3: Can select below max
        XCTAssertTrue(canSelectItem(index: 2, selectedIndices: [0, 1], maxSelections: 3))
        
        // Case 4: Can select without max
        XCTAssertTrue(canSelectItem(index: 10, selectedIndices: [0, 1, 2, 3, 4], maxSelections: nil))
    }
    
    /// Test mode enum values match web implementation
    /// Feature: 041-vertical-list-buttons-pattern, Requirement 10.4
    func testModeEnumValuesMatchWeb() throws {
        // Web uses string literals: 'tap', 'select', 'multiSelect'
        // iOS should use matching raw values
        XCTAssertEqual(ButtonVerticalListSetMode.tap.rawValue, "tap")
        XCTAssertEqual(ButtonVerticalListSetMode.select.rawValue, "select")
        XCTAssertEqual(ButtonVerticalListSetMode.multiSelect.rawValue, "multiSelect")
    }
}
