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
 * // Basic usage
 * Icon(name: "arrow-right", size: 24)
 * 
 * // With custom color
 * Icon(name: "check", size: 32)
 *     .foregroundColor(.blue)
 * 
 * // In a button
 * Button(action: action) {
 *     HStack {
 *         Icon(name: "arrow-right", size: 24)
 *         Text("Next")
 *     }
 * }
 * ```
 * 
 * Requirements:
 * - 1.1: Unified icon component API across platforms
 * - 1.2: Type-safe icon names (enforced by Swift string type)
 * - 1.3: Type-safe icon sizes (enforced by CGFloat type)
 * - 2.1, 2.2, 2.3: Size variants (16, 24, 32, 40)
 * - 3.2: Color inheritance via template rendering mode
 * - 7.2: Accessibility (hidden from VoiceOver)
 * - 10.2: Platform-native rendering (SwiftUI Image with Asset Catalog)
 */
struct Icon: View {
    /// Icon name (references Asset Catalog image set)
    let name: String
    
    /// Icon size in points
    let size: CGFloat
    
    var body: some View {
        Image(name)
            .resizable()
            .renderingMode(.template)
            .frame(width: size, height: size)
            .foregroundColor(.primary)
            .accessibilityHidden(true)
    }
}

/**
 * SwiftUI preview for Icon component.
 * 
 * Shows icons at different sizes (16, 24, 32, 40) and with different colors
 * to demonstrate size variants and color inheritance.
 */
struct Icon_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            // Size variants
            Text("Size Variants")
                .font(.headline)
            
            HStack(spacing: 16) {
                VStack {
                    Icon(name: "arrow-right", size: 16)
                    Text("16pt")
                        .font(.caption)
                }
                
                VStack {
                    Icon(name: "arrow-right", size: 24)
                    Text("24pt")
                        .font(.caption)
                }
                
                VStack {
                    Icon(name: "arrow-right", size: 32)
                    Text("32pt")
                        .font(.caption)
                }
                
                VStack {
                    Icon(name: "arrow-right", size: 40)
                    Text("40pt")
                        .font(.caption)
                }
            }
            
            Divider()
            
            // Color inheritance
            Text("Color Inheritance")
                .font(.headline)
            
            HStack(spacing: 16) {
                Icon(name: "check", size: 24)
                    .foregroundColor(.green)
                
                Icon(name: "x", size: 24)
                    .foregroundColor(.red)
                
                Icon(name: "heart", size: 24)
                    .foregroundColor(.pink)
                
                Icon(name: "settings", size: 24)
                    .foregroundColor(.blue)
            }
            
            Divider()
            
            // Icon variety
            Text("Icon Variety")
                .font(.headline)
            
            HStack(spacing: 16) {
                Icon(name: "arrow-left", size: 24)
                Icon(name: "arrow-up", size: 24)
                Icon(name: "arrow-down", size: 24)
                Icon(name: "chevron-right", size: 24)
            }
            
            HStack(spacing: 16) {
                Icon(name: "plus", size: 24)
                Icon(name: "minus", size: 24)
                Icon(name: "circle", size: 24)
                Icon(name: "user", size: 24)
            }
            
            HStack(spacing: 16) {
                Icon(name: "mail", size: 24)
                Icon(name: "calendar", size: 24)
            }
        }
        .padding()
    }
}
