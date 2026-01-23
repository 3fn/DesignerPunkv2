/**
 * Badge-Count-Base Component for iOS Platform
 * 
 * Stemma System: Badge Family
 * Component Type: Type Primitive (Count)
 * Naming Convention: [Family]-[Type]-[Variant] = Badge-Count-Base
 * 
 * A read-only, non-interactive visual indicator for displaying numeric values
 * like notification counts or quantities. Follows True Native Architecture with
 * build-time platform separation.
 * 
 * Key Characteristics:
 * - Read-only: Display-only, no click/tap behavior
 * - Non-interactive: Not focusable, not in tab order
 * - Compact: Small footprint, designed for inline use
 * - Shape-adaptive: Circular for single digits, pill for multi-digit
 * - Informational: Conveys counts or quantities at a glance
 * 
 * @module Badge-Count-Base/platforms/ios
 * @see Requirements: 2.1-2.13, 4.3, 4.4, 5.2
 * @see .kiro/specs/044-badge-base/design.md for design specification
 */

import SwiftUI

// MARK: - Badge-Count-Base Tokens

/**
 * Badge-Count-Base specific design tokens.
 * 
 * These tokens are component-level tokens specific to the Badge-Count-Base component.
 * They reference or extend the core DesignTokens where possible.
 * 
 * @see Requirements: 4.3, 4.4 - Token integration
 */
enum BadgeCountBaseTokens {
    // MARK: - Shape Token
    
    /// Border radius for badge shape (circular/pill)
    /// References: radiusHalf → 50% (creates circle from square)
    /// For SwiftUI, we use Capsule() shape which automatically creates pill/circular shapes
    /// @see Requirements: 4.3 - radiusHalf for border radius
    
    // MARK: - Color Tokens
    
    /// Background color for badge
    /// References: color.surface → white200
    /// @see Requirements: Design.md - Default colors
    static let backgroundColor: Color = Color(DesignTokens.colorSurface)
    
    /// Text color for badge
    /// References: color.text.default → gray300
    /// @see Requirements: Design.md - Default colors
    static let textColor: Color = Color(DesignTokens.colorTextDefault)
}

// MARK: - Badge-Count-Base Size Enum

/**
 * Badge-Count-Base size variants.
 * 
 * Each size maps to specific typography and spacing tokens:
 * - sm: typography.labelXs, space.inset.none (v), space.inset.050 (h), min-width = line-height
 * - md: typography.labelSm, space.inset.none (v), space.inset.050 (h), min-width = line-height
 * - lg: typography.labelMd, space.inset.050 (v), space.inset.100 (h), min-width = line-height
 * 
 * @see Requirements: 2.9, 2.10 - Size variants with default md
 */
public enum BadgeCountBaseSize: String, CaseIterable {
    case sm
    case md
    case lg
    
    /// Font size for this size variant
    /// @see Requirements: 4.3 - Typography tokens
    var fontSize: CGFloat {
        switch self {
        case .sm: return DesignTokens.fontSize050  // 13pt - typography.labelXs
        case .md: return DesignTokens.fontSize075  // 14pt - typography.labelSm
        case .lg: return DesignTokens.fontSize100  // 16pt - typography.labelMd
        }
    }
    
    /// Line height for this size variant (used for min-width calculation)
    /// @see Requirements: 4.3 - Typography tokens
    var lineHeight: CGFloat {
        switch self {
        case .sm: return DesignTokens.fontSize050 * DesignTokens.lineHeight050  // ~20pt
        case .md: return DesignTokens.fontSize075 * DesignTokens.lineHeight075  // ~20pt
        case .lg: return DesignTokens.fontSize100 * DesignTokens.lineHeight100  // 24pt
        }
    }
    
    /// Vertical padding for this size variant
    /// @see Requirements: 4.4 - space.inset.* tokens for padding
    var paddingVertical: CGFloat {
        switch self {
        case .sm: return DesignTokens.space000  // 0pt - space.inset.none
        case .md: return DesignTokens.space000  // 0pt - space.inset.none
        case .lg: return DesignTokens.space050  // 4pt - space.inset.050
        }
    }
    
    /// Horizontal padding for this size variant
    /// @see Requirements: 4.4 - space.inset.* tokens for padding
    var paddingHorizontal: CGFloat {
        switch self {
        case .sm: return DesignTokens.space050  // 4pt - space.inset.050
        case .md: return DesignTokens.space050  // 4pt - space.inset.050
        case .lg: return DesignTokens.space100  // 8pt - space.inset.100
        }
    }
    
    /// Minimum width for circular single-digit counts (equals line-height)
    /// @see Requirements: Design.md - Min-width = line-height for circular shape
    var minWidth: CGFloat {
        return lineHeight
    }
    
    /// Token reference for documentation
    var typographyTokenReference: String {
        switch self {
        case .sm: return "typography.labelXs"
        case .md: return "typography.labelSm"
        case .lg: return "typography.labelMd"
        }
    }
}

// MARK: - Badge-Count-Base Default Values

/**
 * Default values for Badge-Count-Base props matching web component.
 * 
 * @see Requirements: 2.5, 2.8, 2.10 - Default values
 */
public enum BadgeCountBaseDefaults {
    /// Default maximum before showing "[max]+"
    /// @see Requirements: 2.5 - Default max to 99 when prop omitted
    public static let max: Int = 99
    
    /// Default showZero behavior
    /// @see Requirements: 2.8 - Default showZero to false when prop omitted
    public static let showZero: Bool = false
    
    /// Default size variant
    /// @see Requirements: 2.10 - Default to "md" size when prop omitted
    public static let size: BadgeCountBaseSize = .md
}

// MARK: - Badge-Count-Base View

/**
 * Badge-Count-Base SwiftUI View
 * 
 * A read-only, non-interactive visual indicator for displaying numeric values
 * like notification counts or quantities.
 * 
 * Shape behavior:
 * - Single digit (1-9): Circular (width = height via min-width = line-height)
 * - Multi-digit (10+): Pill shape (expands horizontally with padding)
 * - Zero (showZero=false): Not rendered
 * - Zero (showZero=true): Circular showing "0"
 * 
 * Usage:
 * ```swift
 * // Basic usage
 * BadgeCountBase(count: 5)
 * 
 * // With size variant
 * BadgeCountBase(count: 3, size: .sm)
 * 
 * // With max truncation
 * BadgeCountBase(count: 150, max: 99)  // Shows "99+"
 * 
 * // Show zero
 * BadgeCountBase(count: 0, showZero: true)
 * 
 * // With testID
 * BadgeCountBase(count: 5, testID: "notification-badge")
 * ```
 * 
 * @see Requirements: 2.1-2.13, 4.3, 4.4, 5.2
 */
public struct BadgeCountBase: View {
    
    // MARK: - Properties
    
    /// Numeric value to display (required)
    /// @see Requirements: 2.1 - count prop renders numeric value
    public let count: Int
    
    /// Maximum before showing "[max]+"
    /// @see Requirements: 2.4, 2.5 - max prop with default 99
    public let max: Int
    
    /// Whether to show badge when count is 0
    /// @see Requirements: 2.6, 2.7, 2.8 - showZero prop with default false
    public let showZero: Bool
    
    /// Size variant
    /// @see Requirements: 2.9, 2.10 - size prop with default md
    public let size: BadgeCountBaseSize
    
    /// Test ID for automated testing
    /// @see Requirements: testID as accessibilityIdentifier
    public let testID: String?
    
    // MARK: - Initialization
    
    /**
     * Initialize Badge-Count-Base with all properties.
     * 
     * - Parameters:
     *   - count: Numeric value to display (required)
     *   - max: Maximum before showing "[max]+". Defaults to 99
     *   - showZero: Whether to show badge when count is 0. Defaults to false
     *   - size: Size variant. Defaults to .md
     *   - testID: Test ID for automated testing. Defaults to nil
     * 
     * @see Requirements: 2.1-2.13 - Props interface
     */
    public init(
        count: Int,
        max: Int = BadgeCountBaseDefaults.max,
        showZero: Bool = BadgeCountBaseDefaults.showZero,
        size: BadgeCountBaseSize = BadgeCountBaseDefaults.size,
        testID: String? = nil
    ) {
        // Handle negative counts by using absolute value
        // @see Error Handling in design.md - count is negative → Render absolute value or 0
        self.count = Swift.max(0, abs(count))
        
        // Handle invalid max by using default
        // @see Error Handling in design.md - max is 0 or negative → Use default (99)
        self.max = max > 0 ? max : BadgeCountBaseDefaults.max
        
        self.showZero = showZero
        self.size = size
        self.testID = testID
    }
    
    // MARK: - Computed Properties
    
    /// Display text for the count
    /// @see Requirements: 2.4 - max truncation logic
    private var displayText: String {
        if count > max {
            return "\(max)+"
        }
        return String(count)
    }
    
    /// Whether the badge should be visible
    /// @see Requirements: 2.6, 2.7 - showZero behavior
    private var shouldRender: Bool {
        // @see Requirement 2.6 - count is 0 AND showZero is false → NOT render
        if count == 0 && !showZero {
            return false
        }
        return true
    }
    
    /// Whether the count is a single digit (for circular shape)
    /// @see Requirements: 2.2, 2.3 - circular vs pill shape
    private var isSingleDigit: Bool {
        return displayText.count == 1
    }
    
    // MARK: - Body
    
    /**
     * Main body with conditional rendering and accessibility modifiers.
     * 
     * Accessibility features:
     * - `.accessibilityIdentifier(testID)`: Sets test identifier for automated testing
     * - `.accessibilityLabel(displayText)`: Announces count to screen readers
     * - Non-interactive: No button traits, not focusable
     * 
     * @see Requirements: 2.6, 2.7, 2.11, 6.1 - Visibility and accessibility
     */
    public var body: some View {
        if shouldRender {
            badgeContainer
                .accessibilityIdentifier(testID ?? "")
                .accessibilityLabel(displayText)
                .accessibilityElement(children: .ignore)
        }
    }
    
    // MARK: - Badge Container
    
    /**
     * Main badge container with background, content, and shape.
     * 
     * Structure:
     * - Text content centered in container
     * - Background color from tokens
     * - Capsule shape for circular/pill (radiusHalf equivalent)
     * - Min-width ensures circular shape for single digits
     * - Non-interactive (no gesture handlers)
     * 
     * @see Requirements: 2.1-2.13, 4.3, 4.4
     */
    @ViewBuilder
    private var badgeContainer: some View {
        Text(displayText)
            .font(.system(size: size.fontSize, weight: .medium))
            .foregroundColor(BadgeCountBaseTokens.textColor)
            .lineLimit(1)
            .padding(.vertical, size.paddingVertical)
            .padding(.horizontal, size.paddingHorizontal)
            .frame(minWidth: isSingleDigit ? size.minWidth : nil, minHeight: size.minWidth)
            .background(
                Capsule()
                    .fill(BadgeCountBaseTokens.backgroundColor)
            )
    }
}

// MARK: - Preview

/**
 * SwiftUI Preview for Badge-Count-Base component.
 * 
 * Demonstrates all size variants, shape behavior, max truncation, and showZero.
 * 
 * @see Requirements: 5.2 - iOS SwiftUI implementation
 */
struct BadgeCountBase_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Badge-Count-Base Component")
                    .font(.headline)
                
                // Size variants
                Text("Size Variants")
                    .font(.subheadline)
                
                HStack(spacing: 16) {
                    ForEach(BadgeCountBaseSize.allCases, id: \.self) { size in
                        VStack {
                            BadgeCountBase(count: 5, size: size)
                            Text(size.rawValue)
                                .font(.caption)
                            Text(size.typographyTokenReference)
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                
                Divider()
                
                // Shape behavior
                Text("Shape Behavior")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        BadgeCountBase(count: 1)
                        Text("Single digit (1) - Circular")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountBase(count: 9)
                        Text("Single digit (9) - Circular")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountBase(count: 10)
                        Text("Double digit (10) - Pill")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountBase(count: 99)
                        Text("Double digit (99) - Pill")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountBase(count: 100)
                        Text("Triple digit (100) - Shows 99+")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                Divider()
                
                // Max truncation
                Text("Max Truncation")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        BadgeCountBase(count: 99, max: 99)
                        Text("count=99, max=99 → Shows 99")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountBase(count: 100, max: 99)
                        Text("count=100, max=99 → Shows 99+")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountBase(count: 50, max: 9)
                        Text("count=50, max=9 → Shows 9+")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountBase(count: 999, max: 999)
                        Text("count=999, max=999 → Shows 999")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                Divider()
                
                // showZero behavior
                Text("showZero Behavior")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        BadgeCountBase(count: 0, showZero: false)
                        Text("count=0, showZero=false → Hidden")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountBase(count: 0, showZero: true)
                        Text("count=0, showZero=true → Shows 0")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                Divider()
                
                // Various counts
                Text("Various Counts")
                    .font(.subheadline)
                
                HStack(spacing: 8) {
                    BadgeCountBase(count: 1)
                    BadgeCountBase(count: 5)
                    BadgeCountBase(count: 12)
                    BadgeCountBase(count: 42)
                    BadgeCountBase(count: 99)
                    BadgeCountBase(count: 150)
                }
                
                Divider()
                
                // With testID
                Text("With testID")
                    .font(.subheadline)
                
                BadgeCountBase(count: 5, testID: "notification-badge")
                
                Divider()
                
                // Token references
                Text("Token References")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(BadgeCountBaseSize.allCases, id: \.self) { size in
                        HStack {
                            BadgeCountBase(count: 5, size: size)
                            VStack(alignment: .leading) {
                                Text("\(size.rawValue): \(size.typographyTokenReference)")
                                    .font(.caption)
                                Text("Min-width: \(Int(size.minWidth))pt")
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                }
            }
            .padding()
        }
    }
}
