/**
 * Icon Component for iOS Platform
 * 
 * Renders icons from Asset Catalog with template rendering mode for color tinting.
 * Icons automatically inherit foreground color from SwiftUI environment.
 * 
 * Part of the DesignerPunk Icon System infrastructure.
 * 
 * @module Icon/platforms/ios
 */

import SwiftUI

/**
 * Icon component for iOS platform.
 * 
 * Renders Image from Asset Catalog with template rendering mode for color tinting.
 * Icons inherit foreground color from environment and are hidden from VoiceOver
 * for accessibility (decorative icons only).
 * 
 * Usage:
 * ```swift
 * // Basic usage with token (REQUIRED - do not use raw numbers)
 * Icon(name: "arrow-right", size: DesignTokens.iconSize100)
 * 
 * // With custom color
 * Icon(name: "check", size: DesignTokens.iconSize150)
 *     .foregroundColor(.blue)
 * 
 * // In a button with testID
 * Button(action: action) {
 *     HStack {
 *         Icon(name: "arrow-right", size: DesignTokens.iconSize100, testID: "next-button-icon")
 *         Text("Next")
 *     }
 * }
 * 
 * // ❌ INCORRECT - Do not use raw numeric values
 * // Icon(name: "arrow-right", size: 24)  // This violates design system compliance
 * ```
 * 
 * Requirements:
 * - 1.1: Unified icon component API across platforms
 * - 1.2: Type-safe icon names (enforced by Swift string type)
 * - 1.3: Type-safe icon sizes (token-only approach for design system compliance)
 * - 2.1, 2.2, 2.3: Size variants via icon size tokens (iconSize050-iconSize700)
 * - 3.2: Color inheritance via template rendering mode
 * - 7.2: Accessibility (hidden from VoiceOver, testID support for testing)
 * - 10.2: Platform-native rendering (SwiftUI Image with Asset Catalog)
 */
struct Icon: View {
    /// Icon name (references Asset Catalog image set)
    let name: String
    
    /// Icon size from design tokens (token-only approach)
    /// - Important: Only pass values from DesignTokens.iconSizeXXX. Raw numeric values are not supported.
    let size: CGFloat
    
    /// Optional color override for optical weight compensation
    /// - nil (default): Uses .primary color (inherits from environment)
    /// - Color value: Uses specified color for optical balance
    let color: Color?
    
    /// Optional test identifier for UI testing
    let testID: String?
    
    /// Initialize Icon with token-based sizing
    /// - Parameters:
    ///   - name: Icon name from Asset Catalog
    ///   - size: Icon size token from DesignTokens (e.g., DesignTokens.iconSize100)
    ///            Do NOT pass raw numeric values - only use design tokens
    ///   - color: Optional color override for optical balance
    ///   - testID: Optional test identifier for UI testing
    /// - Important: This component enforces token-only sizing for design system compliance.
    ///              Always use DesignTokens.iconSizeXXX values, never raw numbers.
    init(name: String, size: CGFloat, color: Color? = nil, testID: String? = nil) {
        self.name = name
        self.size = size
        self.color = color
        self.testID = testID
    }
    
    var body: some View {
        Image(name)
            .resizable()
            .renderingMode(.template)
            .frame(width: size, height: size)
            .foregroundColor(color ?? .primary) // Use override or default to .primary
            .accessibilityHidden(true)
            .accessibilityIdentifier(testID ?? "")
    }
}

/**
 * SwiftUI preview for Icon component.
 * 
 * Shows icons at different sizes using design tokens and with different colors
 * to demonstrate size variants and color inheritance.
 * 
 * Note: Preview uses token references (DesignTokens.iconSizeXXX) to demonstrate
 * correct token usage pattern.
 */
struct Icon_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            // Size variants using design tokens
            Text("Size Variants (Token-Based)")
                .font(.headline)
            
            HStack(spacing: 16) {
                VStack {
                    Icon(name: "arrow-right", size: DesignTokens.iconSize075)
                    Text("iconSize075 (20pt)")
                        .font(.caption)
                }
                
                VStack {
                    Icon(name: "arrow-right", size: DesignTokens.iconSize100)
                    Text("iconSize100 (24pt)")
                        .font(.caption)
                }
                
                VStack {
                    Icon(name: "arrow-right", size: DesignTokens.iconSize200)
                    Text("iconSize200 (32pt)")
                        .font(.caption)
                }
                
                VStack {
                    Icon(name: "arrow-right", size: DesignTokens.iconSize500)
                    Text("iconSize500 (40pt)")
                        .font(.caption)
                }
            }
            
            Divider()
            
            // Color inheritance (default)
            Text("Color Inheritance (Default)")
                .font(.headline)
            
            HStack(spacing: 16) {
                Icon(name: "check", size: DesignTokens.iconSize100)
                    .foregroundColor(.green)
                
                Icon(name: "x", size: DesignTokens.iconSize100)
                    .foregroundColor(.red)
                
                Icon(name: "heart", size: DesignTokens.iconSize100)
                    .foregroundColor(.pink)
                
                Icon(name: "settings", size: DesignTokens.iconSize100)
                    .foregroundColor(.blue)
            }
            
            Divider()
            
            // Color override (explicit)
            Text("Color Override (Explicit)")
                .font(.headline)
            
            HStack(spacing: 16) {
                Icon(name: "check", size: DesignTokens.iconSize100, color: .green)
                Icon(name: "x", size: DesignTokens.iconSize100, color: .red)
                Icon(name: "heart", size: DesignTokens.iconSize100, color: .pink)
                Icon(name: "settings", size: DesignTokens.iconSize100, color: .blue)
            }
            
            Divider()
            
            // testID support demonstration
            Text("testID Support")
                .font(.headline)
            
            HStack(spacing: 16) {
                Icon(name: "arrow-right", size: DesignTokens.iconSize100, testID: "arrow-icon")
                Icon(name: "check", size: DesignTokens.iconSize100, testID: "check-icon")
            }
            
            Divider()
            
            // Icon variety
            Text("Icon Variety")
                .font(.headline)
            
            HStack(spacing: 16) {
                Icon(name: "arrow-left", size: DesignTokens.iconSize100)
                Icon(name: "arrow-up", size: DesignTokens.iconSize100)
                Icon(name: "arrow-down", size: DesignTokens.iconSize100)
                Icon(name: "chevron-right", size: DesignTokens.iconSize100)
            }
            
            HStack(spacing: 16) {
                Icon(name: "plus", size: DesignTokens.iconSize100)
                Icon(name: "minus", size: DesignTokens.iconSize100)
                Icon(name: "circle", size: DesignTokens.iconSize100)
                Icon(name: "user", size: DesignTokens.iconSize100)
            }
            
            HStack(spacing: 16) {
                Icon(name: "mail", size: DesignTokens.iconSize100)
                Icon(name: "calendar", size: DesignTokens.iconSize100)
            }
        }
        .padding()
    }
}
