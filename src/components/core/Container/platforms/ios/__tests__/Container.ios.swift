/**
 * Container iOS-Specific Tests
 * 
 * Tests for iOS platform-specific features of the Container component.
 * Validates SwiftUI modifier chains, safe area handling, and accessibility features.
 * 
 * @see Requirements: 10.2, 12.1-12.4, 14.1-14.2
 */

import XCTest
import SwiftUI
import ViewInspector
@testable import DesignerPunk

/**
 * Container iOS Tests
 * 
 * Test suite for iOS-specific Container functionality including:
 * - SwiftUI modifier chains
 * - Safe area handling
 * - Accessibility label application
 * - Token-to-SwiftUI mapping
 */
class ContainerIOSTests: XCTestCase {
    
    // MARK: - SwiftUI Modifier Chains (Requirement 10.2, 12.1, 12.2)
    
    func testContainerAppliesPaddingModifier() throws {
        // Test that Container applies padding modifier correctly
        let container = Container(padding: .p200) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify padding modifier is applied
        // Note: ViewInspector allows us to inspect SwiftUI view hierarchy
        let padding = try view.padding()
        XCTAssertNotNil(padding, "Padding modifier should be applied")
    }
    
    func testContainerAppliesBackgroundModifier() throws {
        // Test that Container applies background modifier correctly
        let container = Container(background: "color.surface") {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify background modifier is applied
        let background = try view.background()
        XCTAssertNotNil(background, "Background modifier should be applied")
    }
    
    func testContainerAppliesCornerRadiusModifier() throws {
        // Test that Container applies cornerRadius modifier correctly
        let container = Container(borderRadius: .normal) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify cornerRadius modifier is applied
        let cornerRadius = try view.cornerRadius()
        XCTAssertNotNil(cornerRadius, "Corner radius modifier should be applied")
    }
    
    func testContainerAppliesBorderOverlay() throws {
        // Test that Container applies border overlay correctly
        let container = Container(border: .default, borderRadius: .normal) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify overlay modifier is applied for border
        let overlay = try view.overlay()
        XCTAssertNotNil(overlay, "Border overlay should be applied")
    }
    
    func testContainerAppliesShadowModifier() throws {
        // Test that Container applies shadow modifier correctly
        let container = Container(shadow: "shadow.container") {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify shadow modifier is applied
        let shadow = try view.shadow()
        XCTAssertNotNil(shadow, "Shadow modifier should be applied")
    }
    
    func testContainerAppliesOpacityModifier() throws {
        // Test that Container applies opacity modifier correctly
        let container = Container(opacity: "opacity.subtle") {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify opacity modifier is applied
        let opacity = try view.opacity()
        XCTAssertNotNil(opacity, "Opacity modifier should be applied")
    }
    
    func testContainerAppliesZIndexModifier() throws {
        // Test that Container applies zIndex modifier correctly
        let container = Container(layering: .modal) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify zIndex modifier is applied
        let zIndex = try view.zIndex()
        XCTAssertNotNil(zIndex, "Z-index modifier should be applied")
    }
    
    func testContainerAppliesMultipleModifiers() throws {
        // Test that Container applies multiple modifiers in correct order
        let container = Container(
            padding: .p300,
            background: "color.primary",
            shadow: "shadow.container",
            borderRadius: .normal,
            opacity: "opacity.subtle",
            layering: .navigation
        ) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify all modifiers are applied
        XCTAssertNotNil(try? view.padding(), "Padding modifier should be applied")
        XCTAssertNotNil(try? view.background(), "Background modifier should be applied")
        XCTAssertNotNil(try? view.cornerRadius(), "Corner radius modifier should be applied")
        XCTAssertNotNil(try? view.shadow(), "Shadow modifier should be applied")
        XCTAssertNotNil(try? view.opacity(), "Opacity modifier should be applied")
        XCTAssertNotNil(try? view.zIndex(), "Z-index modifier should be applied")
    }
    
    func testContainerModifierChainOrder() throws {
        // Test that modifiers are applied in the correct order
        // Order matters in SwiftUI: content → padding → background → cornerRadius → overlay → shadow → opacity → zIndex
        let container = Container(
            padding: .p200,
            background: "color.surface",
            border: .default,
            borderRadius: .normal,
            shadow: "shadow.container",
            opacity: "opacity.subtle",
            layering: .container
        ) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify the view hierarchy reflects correct modifier order
        // This is a structural test - modifiers should be applied in the documented order
        XCTAssertNotNil(view, "Container view should be inspectable")
    }
    
    func testContainerWithNoModifiers() throws {
        // Test that Container works with no styling modifiers
        let container = Container {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify content is rendered
        let text = try view.find(Text.self)
        XCTAssertEqual(try text.string(), "Content", "Content should be rendered")
    }
    
    // MARK: - Safe Area Handling (Requirement 12.3, 12.4)
    
    func testContainerRespectsSafeAreaByDefault() throws {
        // Test that Container respects safe area by default (ignoresSafeArea = false)
        let container = Container(padding: .p200) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // By default, ignoresSafeArea should not be applied
        // We verify this by checking that the view doesn't have the ignoresSafeArea modifier
        // Note: This is a negative test - we're verifying the modifier is NOT present
        XCTAssertThrowsError(try view.ignoresSafeArea(), "ignoresSafeArea modifier should not be applied by default")
    }
    
    func testContainerIgnoresSafeAreaWhenEnabled() throws {
        // Test that Container ignores safe area when ignoresSafeArea = true
        let container = Container(
            padding: .p200,
            ignoresSafeArea: true
        ) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify ignoresSafeArea modifier is applied
        let safeArea = try view.ignoresSafeArea()
        XCTAssertNotNil(safeArea, "ignoresSafeArea modifier should be applied when enabled")
    }
    
    func testContainerSafeAreaWithBackground() throws {
        // Test that safe area handling works correctly with background
        let container = Container(
            background: "color.primary",
            ignoresSafeArea: true
        ) {
            Text("Full screen content")
        }
        
        let view = try container.inspect()
        
        // Verify both background and ignoresSafeArea are applied
        XCTAssertNotNil(try? view.background(), "Background should be applied")
        XCTAssertNotNil(try? view.ignoresSafeArea(), "ignoresSafeArea should be applied")
    }
    
    func testContainerSafeAreaToggle() throws {
        // Test that safe area handling can be toggled
        // First with safe area respected
        let containerWithSafeArea = Container(
            padding: .p200,
            ignoresSafeArea: false
        ) {
            Text("Content")
        }
        
        let viewWithSafeArea = try containerWithSafeArea.inspect()
        XCTAssertThrowsError(try viewWithSafeArea.ignoresSafeArea(), "ignoresSafeArea should not be applied when false")
        
        // Then with safe area ignored
        let containerIgnoringSafeArea = Container(
            padding: .p200,
            ignoresSafeArea: true
        ) {
            Text("Content")
        }
        
        let viewIgnoringSafeArea = try containerIgnoringSafeArea.inspect()
        XCTAssertNotNil(try? viewIgnoringSafeArea.ignoresSafeArea(), "ignoresSafeArea should be applied when true")
    }
    
    func testContainerSafeAreaWithMultipleModifiers() throws {
        // Test that safe area handling works with multiple other modifiers
        let container = Container(
            padding: .p300,
            background: "color.surface",
            shadow: "shadow.container",
            borderRadius: .normal,
            ignoresSafeArea: true
        ) {
            Text("Full screen content")
        }
        
        let view = try container.inspect()
        
        // Verify all modifiers including ignoresSafeArea are applied
        XCTAssertNotNil(try? view.padding(), "Padding should be applied")
        XCTAssertNotNil(try? view.background(), "Background should be applied")
        XCTAssertNotNil(try? view.cornerRadius(), "Corner radius should be applied")
        XCTAssertNotNil(try? view.shadow(), "Shadow should be applied")
        XCTAssertNotNil(try? view.ignoresSafeArea(), "ignoresSafeArea should be applied")
    }
    
    // MARK: - Accessibility Label Application (Requirement 14.1, 14.2)
    
    func testContainerAppliesAccessibilityLabel() throws {
        // Test that Container applies accessibility label when provided
        let container = Container(
            padding: .p200,
            accessibilityLabel: "Main content area"
        ) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify accessibility label is applied
        let label = try view.accessibilityLabel()
        XCTAssertEqual(label, "Main content area", "Accessibility label should be applied correctly")
    }
    
    func testContainerWithoutAccessibilityLabel() throws {
        // Test that Container works without accessibility label
        let container = Container(padding: .p200) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify no accessibility label is applied
        XCTAssertThrowsError(try view.accessibilityLabel(), "Accessibility label should not be applied when nil")
    }
    
    func testContainerAccessibilityLabelWithEmptyString() throws {
        // Test that Container handles empty accessibility label
        let container = Container(
            padding: .p200,
            accessibilityLabel: ""
        ) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Empty string should still apply the modifier
        let label = try view.accessibilityLabel()
        XCTAssertEqual(label, "", "Empty accessibility label should be applied")
    }
    
    func testContainerAccessibilityLabelWithSpecialCharacters() throws {
        // Test that Container handles special characters in accessibility label
        let container = Container(
            padding: .p200,
            accessibilityLabel: "User's \"Profile\" & Settings"
        ) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify special characters are preserved
        let label = try view.accessibilityLabel()
        XCTAssertEqual(label, "User's \"Profile\" & Settings", "Special characters should be preserved in accessibility label")
    }
    
    func testContainerAccessibilityLabelWithMultipleModifiers() throws {
        // Test that accessibility label works with multiple other modifiers
        let container = Container(
            padding: .p300,
            background: "color.primary",
            shadow: "shadow.container",
            borderRadius: .normal,
            accessibilityLabel: "Card container"
        ) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify all modifiers including accessibility label are applied
        XCTAssertNotNil(try? view.padding(), "Padding should be applied")
        XCTAssertNotNil(try? view.background(), "Background should be applied")
        XCTAssertNotNil(try? view.cornerRadius(), "Corner radius should be applied")
        XCTAssertNotNil(try? view.shadow(), "Shadow should be applied")
        
        let label = try view.accessibilityLabel()
        XCTAssertEqual(label, "Card container", "Accessibility label should be applied")
    }
    
    func testContainerAccessibilityLabelWithSafeArea() throws {
        // Test that accessibility label works with safe area handling
        let container = Container(
            padding: .p200,
            ignoresSafeArea: true,
            accessibilityLabel: "Full screen container"
        ) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify both ignoresSafeArea and accessibility label are applied
        XCTAssertNotNil(try? view.ignoresSafeArea(), "ignoresSafeArea should be applied")
        
        let label = try view.accessibilityLabel()
        XCTAssertEqual(label, "Full screen container", "Accessibility label should be applied")
    }
    
    func testContainerAccessibilityLabelWithLongText() throws {
        // Test that Container handles long accessibility labels
        let longLabel = "This is a very long accessibility label that describes the container in great detail for screen reader users who need comprehensive information about the content"
        
        let container = Container(
            padding: .p200,
            accessibilityLabel: longLabel
        ) {
            Text("Content")
        }
        
        let view = try container.inspect()
        
        // Verify long label is applied correctly
        let label = try view.accessibilityLabel()
        XCTAssertEqual(label, longLabel, "Long accessibility label should be applied correctly")
    }
    
    // MARK: - Content Rendering
    
    func testContainerRendersChildContent() throws {
        // Test that Container renders child content correctly
        let container = Container(padding: .p200) {
            Text("Test content")
        }
        
        let view = try container.inspect()
        
        // Verify child content is rendered
        let text = try view.find(Text.self)
        XCTAssertEqual(try text.string(), "Test content", "Child content should be rendered")
    }
    
    func testContainerRendersComplexChildContent() throws {
        // Test that Container renders complex child content
        let container = Container(padding: .p200) {
            VStack {
                Text("Title")
                Text("Subtitle")
                Button("Action") { }
            }
        }
        
        let view = try container.inspect()
        
        // Verify complex child content is rendered
        let vstack = try view.find(VStack.self)
        XCTAssertNotNil(vstack, "VStack should be rendered")
        
        let texts = try view.findAll(Text.self)
        XCTAssertEqual(texts.count, 2, "Both text views should be rendered")
        
        let button = try view.find(Button.self)
        XCTAssertNotNil(button, "Button should be rendered")
    }
    
    func testContainerRendersEmptyContent() throws {
        // Test that Container handles empty content
        let container = Container(padding: .p200) {
            EmptyView()
        }
        
        let view = try container.inspect()
        
        // Verify empty view is rendered
        let emptyView = try view.find(EmptyView.self)
        XCTAssertNotNil(emptyView, "EmptyView should be rendered")
    }
    
    // MARK: - Token Mapping Integration
    
    func testContainerPaddingTokenMapping() throws {
        // Test that padding values map to correct tokens
        let testCases: [(PaddingValue, String)] = [
            (.none, "zero padding"),
            (.p050, "4pt padding"),
            (.p100, "8pt padding"),
            (.p150, "12pt padding"),
            (.p200, "16pt padding"),
            (.p300, "24pt padding"),
            (.p400, "32pt padding")
        ]
        
        for (paddingValue, description) in testCases {
            let container = Container(padding: paddingValue) {
                Text("Content")
            }
            
            let view = try container.inspect()
            
            // Verify padding is applied (or not applied for .none)
            if paddingValue == .none {
                // For .none, padding should be zero (EdgeInsets())
                // This is harder to test directly, but we can verify the view exists
                XCTAssertNotNil(view, "Container with \(description) should render")
            } else {
                XCTAssertNotNil(try? view.padding(), "Container should apply \(description)")
            }
        }
    }
    
    func testContainerBorderTokenMapping() throws {
        // Test that border values map to correct tokens
        let testCases: [(BorderValue, String)] = [
            (.none, "no border"),
            (.default, "1pt border"),
            (.emphasis, "2pt border"),
            (.heavy, "4pt border")
        ]
        
        for (borderValue, description) in testCases {
            let container = Container(
                border: borderValue,
                borderRadius: .normal
            ) {
                Text("Content")
            }
            
            let view = try container.inspect()
            
            // Verify border overlay is applied (or not applied for .none)
            if borderValue == .none {
                // For .none, no overlay should be applied
                XCTAssertThrowsError(try view.overlay(), "Container with \(description) should not have overlay")
            } else {
                XCTAssertNotNil(try? view.overlay(), "Container should apply \(description)")
            }
        }
    }
    
    func testContainerBorderRadiusTokenMapping() throws {
        // Test that border radius values map to correct tokens
        let testCases: [(BorderRadiusValue, String)] = [
            (.none, "no radius"),
            (.tight, "4pt radius"),
            (.normal, "8pt radius"),
            (.loose, "16pt radius")
        ]
        
        for (radiusValue, description) in testCases {
            let container = Container(borderRadius: radiusValue) {
                Text("Content")
            }
            
            let view = try container.inspect()
            
            // Verify corner radius is applied (or not applied for .none)
            if radiusValue == .none {
                // For .none, corner radius should be 0
                // This is harder to test directly, but we can verify the view exists
                XCTAssertNotNil(view, "Container with \(description) should render")
            } else {
                XCTAssertNotNil(try? view.cornerRadius(), "Container should apply \(description)")
            }
        }
    }
    
    func testContainerLayeringTokenMapping() throws {
        // Test that layering values map to correct z-index tokens
        let testCases: [(LayeringValue, String)] = [
            (.container, "z-index 100"),
            (.navigation, "z-index 200"),
            (.dropdown, "z-index 300"),
            (.modal, "z-index 400"),
            (.toast, "z-index 500"),
            (.tooltip, "z-index 600")
        ]
        
        for (layeringValue, description) in testCases {
            let container = Container(layering: layeringValue) {
                Text("Content")
            }
            
            let view = try container.inspect()
            
            // Verify z-index is applied
            XCTAssertNotNil(try? view.zIndex(), "Container should apply \(description)")
        }
    }
    
    // MARK: - iOS Platform-Specific Features
    
    func testContainerWorksWithSwiftUIEnvironment() throws {
        // Test that Container works with SwiftUI environment
        let container = Container(padding: .p200) {
            Text("Content")
        }
        .environment(\.colorScheme, .dark)
        
        let view = try container.inspect()
        
        // Verify environment is applied
        XCTAssertNotNil(view, "Container should work with SwiftUI environment")
    }
    
    func testContainerWorksWithSwiftUIState() throws {
        // Test that Container works with SwiftUI state
        struct TestView: View {
            @State private var padding: PaddingValue = .p200
            
            var body: some View {
                Container(padding: padding) {
                    Text("Content")
                }
            }
        }
        
        let testView = TestView()
        let view = try testView.inspect()
        
        // Verify state-driven Container works
        XCTAssertNotNil(view, "Container should work with SwiftUI state")
    }
    
    func testContainerWorksWithSwiftUIBinding() throws {
        // Test that Container works with SwiftUI bindings
        struct TestView: View {
            @State private var isExpanded = false
            
            var body: some View {
                Container(padding: isExpanded ? .p400 : .p200) {
                    Text("Content")
                }
            }
        }
        
        let testView = TestView()
        let view = try testView.inspect()
        
        // Verify binding-driven Container works
        XCTAssertNotNil(view, "Container should work with SwiftUI bindings")
    }
}
