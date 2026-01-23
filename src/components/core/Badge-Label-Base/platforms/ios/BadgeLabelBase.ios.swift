/**
 * Badge-Label-Base Component for iOS Platform
 * 
 * Stemma System: Badge Family
 * Component Type: Type Primitive (Label)
 * Naming Convention: [Family]-[Type]-[Variant] = Badge-Label-Base
 * 
 * A read-only, non-interactive visual indicator for displaying categorization,
 * status, or metadata text. Follows True Native Architecture with build-time
 * platform separation.
 * 
 * Key Characteristics:
 * - Read-only: Display-only, no click/tap behavior
 * - Non-interactive: Not focusable, not in tab order
 * - Compact: Small footprint, designed for inline use
 * - Informational: Conveys status or metadata at a glance
 * 
 * Uses IconBase component for icon rendering, following the same component
 * composition pattern as web and Android platforms.
 * 
 * @module Badge-Label-Base/platforms/ios
 * @see Requirements: 1.1-1.10, 4.1, 4.2, 4.4, 4.5, 4.6, 4.8, 5.2
 * @see .kiro/specs/044-badge-base/design.md for design specification
 */

import SwiftUI

// MARK: - Badge-Label-Base Tokens

/**
 * Badge-Label-Base specific design tokens.
 * 
 * These tokens are component-level tokens specific to the Badge-Label-Base component.
 * They reference or extend the core DesignTokens where possible.
 * 
 * @see Requirements: 4.1, 4.2, 4.4, 4.5, 4.6, 4.8 - Token integration
 */
enum BadgeLabelBaseTokens {
    // MARK: - Component Token
    
    /// Maximum width for truncated badges (120px)
    /// Component token: badge.label.maxWidth
    /// Allows ~12-15 characters before ellipsis while maintaining compact badge appearance
    /// Value follows spacing family pattern (8 × 15 = 120px)
    /// @see Requirements: 4.8 - badge.label.maxWidth token
    static let maxWidth: CGFloat = 120
    
    // MARK: - Shape Token
    
    /// Border radius for badge shape
    /// References: radiusSubtle → radius025 (2px)
    /// @see Requirements: 4.2 - radiusSubtle for border radius
    static let cornerRadius: CGFloat = DesignTokens.radius025
    
    // MARK: - Color Tokens
    
    /// Background color for badge
    /// References: color.surface → white200
    /// @see Requirements: Design.md - Default colors
    static let backgroundColor: Color = Color(DesignTokens.colorSurface)
    
    /// Text color for badge
    /// References: color.text.default → gray300
    /// @see Requirements: Design.md - Default colors
    static let textColor: Color = Color(DesignTokens.colorTextDefault)
    
    /// Icon color for badge
    /// References: color.icon.default → gray200
    /// @see Requirements: Design.md - Default colors
    static let iconColor: Color = Color(DesignTokens.colorIconDefault)
}

// MARK: - Badge-Label-Base Size Enum

/**
 * Badge-Label-Base size variants.
 * 
 * Each size maps to specific typography and spacing tokens:
 * - sm: typography.labelXs, space.inset.none (v), space.inset.050 (h), icon.size050
 * - md: typography.labelSm, space.inset.050 (v), space.inset.100 (h), icon.size075
 * - lg: typography.labelMd, space.inset.100 (v), space.inset.150 (h), icon.size100
 * 
 * @see Requirements: 1.2, 1.3 - Size variants with default md
 */
public enum BadgeLabelBaseSize: String, CaseIterable {
    case sm
    case md
    case lg
    
    /// Font size for this size variant
    /// @see Requirements: 4.1 - Typography tokens
    var fontSize: CGFloat {
        switch self {
        case .sm: return DesignTokens.fontSize050  // 13pt - typography.labelXs
        case .md: return DesignTokens.fontSize075  // 14pt - typography.labelSm
        case .lg: return DesignTokens.fontSize100  // 16pt - typography.labelMd
        }
    }
    
    /// Line height multiplier for this size variant
    /// @see Requirements: 4.1 - Typography tokens
    var lineHeight: CGFloat {
        switch self {
        case .sm: return DesignTokens.lineHeight050  // 1.538
        case .md: return DesignTokens.lineHeight075  // 1.429
        case .lg: return DesignTokens.lineHeight100  // 1.5
        }
    }
    
    /// Vertical padding for this size variant
    /// @see Requirements: 4.4 - space.inset.* tokens for padding
    var paddingVertical: CGFloat {
        switch self {
        case .sm: return DesignTokens.space000  // 0pt - space.inset.none
        case .md: return DesignTokens.space050  // 4pt - space.inset.050
        case .lg: return DesignTokens.space100  // 8pt - space.inset.100
        }
    }
    
    /// Horizontal padding for this size variant
    /// @see Requirements: 4.4 - space.inset.* tokens for padding
    var paddingHorizontal: CGFloat {
        switch self {
        case .sm: return DesignTokens.space050  // 4pt - space.inset.050
        case .md: return DesignTokens.space100  // 8pt - space.inset.100
        case .lg: return DesignTokens.space150  // 12pt - space.inset.150
        }
    }
    
    /// Icon size for this size variant
    /// @see Requirements: 4.6 - icon.size050, icon.size075, icon.size100
    var iconSize: CGFloat {
        switch self {
        case .sm: return DesignTokens.iconSize050  // 16pt
        case .md: return DesignTokens.iconSize075  // 20pt
        case .lg: return DesignTokens.iconSize100  // 24pt
        }
    }
    
    /// Icon gap (spacing between icon and label) for this size variant
    /// @see Requirements: 4.5 - space.grouped.* tokens
    var iconGap: CGFloat {
        switch self {
        case .sm: return DesignTokens.space025  // 2pt - space.grouped.minimal
        case .md: return DesignTokens.space050  // 4pt - space.grouped.tight
        case .lg: return DesignTokens.space050  // 4pt - space.grouped.tight
        }
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

// MARK: - Badge-Label-Base Default Values

/**
 * Default values for Badge-Label-Base props matching web component.
 * 
 * @see Requirements: 1.3, 1.7 - Default values
 */
public enum BadgeLabelBaseDefaults {
    /// Default size variant
    /// @see Requirements: 1.3 - Default to "md" size when prop omitted
    public static let size: BadgeLabelBaseSize = .md
    
    /// Default truncation behavior
    /// @see Requirements: 1.7 - Default truncate to false when prop omitted
    public static let truncate: Bool = false
}

// MARK: - Badge-Label-Base View

/**
 * Badge-Label-Base SwiftUI View
 * 
 * A read-only, non-interactive visual indicator for displaying categorization,
 * status, or metadata text.
 * 
 * Usage:
 * ```swift
 * // Basic usage
 * BadgeLabelBase(label: "Draft")
 * 
 * // With size variant
 * BadgeLabelBase(label: "Status", size: .sm)
 * 
 * // With icon
 * BadgeLabelBase(label: "Approved", icon: "check", size: .md)
 * 
 * // With truncation
 * BadgeLabelBase(label: "Very long category name", truncate: true)
 * 
 * // With testID
 * BadgeLabelBase(label: "Draft", testID: "status-badge")
 * ```
 * 
 * @see Requirements: 1.1-1.10, 4.1, 4.2, 4.4, 4.5, 4.6, 4.8, 5.2
 */
public struct BadgeLabelBase: View {
    
    // MARK: - Properties
    
    /// Badge text content (required)
    /// @see Requirements: 1.1 - label prop renders text content
    public let label: String
    
    /// Size variant
    /// @see Requirements: 1.2, 1.3 - size prop with default md
    public let size: BadgeLabelBaseSize
    
    /// Optional leading icon name (uses Icon-Base)
    /// @see Requirements: 1.4 - optional leading icon via Icon-Base
    public let icon: String?
    
    /// Enable truncation at component-defined max-width
    /// @see Requirements: 1.5, 1.6, 1.7 - truncate prop with default false
    public let truncate: Bool
    
    /// Test ID for automated testing
    /// @see Requirements: testID as accessibilityIdentifier
    public let testID: String?
    
    // MARK: - Initialization
    
    /**
     * Initialize Badge-Label-Base with all properties.
     * 
     * - Parameters:
     *   - label: Badge text content (required)
     *   - size: Size variant. Defaults to .md
     *   - icon: Optional leading icon name. Defaults to nil
     *   - truncate: Enable truncation. Defaults to false
     *   - testID: Test ID for automated testing. Defaults to nil
     * 
     * @see Requirements: 1.1-1.10 - Props interface
     */
    public init(
        label: String,
        size: BadgeLabelBaseSize = BadgeLabelBaseDefaults.size,
        icon: String? = nil,
        truncate: Bool = BadgeLabelBaseDefaults.truncate,
        testID: String? = nil
    ) {
        self.label = label
        self.size = size
        self.icon = icon
        self.truncate = truncate
        self.testID = testID
    }
    
    // MARK: - Body
    
    /**
     * Main body with accessibility modifiers.
     * 
     * Accessibility features:
     * - `.accessibilityIdentifier(testID)`: Sets test identifier for automated testing
     * - `.accessibilityLabel(fullLabel)`: Announces full label text (especially for truncated badges)
     * - Non-interactive: No button traits, not focusable
     * 
     * @see Requirements: 1.6, 1.8, 6.1 - Accessibility implementation
     */
    public var body: some View {
        badgeContainer
            .accessibilityIdentifier(testID ?? "")
            .accessibilityLabel(label)
            .accessibilityElement(children: .ignore)
    }
    
    // MARK: - Badge Container
    
    /**
     * Main badge container with background, content, and shape.
     * 
     * Structure:
     * - HStack containing optional icon and label text
     * - Background color from tokens
     * - Corner radius from radiusSubtle token
     * - Non-interactive (no gesture handlers)
     * 
     * @see Requirements: 1.1-1.10, 4.1, 4.2, 4.4, 4.5, 4.6, 4.8
     */
    @ViewBuilder
    private var badgeContainer: some View {
        HStack(spacing: size.iconGap) {
            // Optional leading icon
            if let iconName = icon {
                iconContent(name: iconName)
            }
            
            // Label text
            labelContent
        }
        .padding(.vertical, size.paddingVertical)
        .padding(.horizontal, size.paddingHorizontal)
        .background(BadgeLabelBaseTokens.backgroundColor)
        .cornerRadius(BadgeLabelBaseTokens.cornerRadius)
    }
    
    // MARK: - Icon Content
    
    /**
     * Icon content using IconBase component.
     * 
     * Icon is marked as decorative (hidden from VoiceOver) since the label
     * provides the semantic meaning.
     * 
     * @see Requirements: 1.4, 6.2 - Icon rendering via Icon-Base, decorative
     */
    @ViewBuilder
    private func iconContent(name: String) -> some View {
        IconBase(
            name: name,
            size: size.iconSize,
            color: BadgeLabelBaseTokens.iconColor
        )
        .accessibilityHidden(true)
    }
    
    // MARK: - Label Content
    
    /**
     * Label text content with typography and optional truncation.
     * 
     * When truncate is true:
     * - Text is limited to max-width (120px)
     * - Overflow is truncated with ellipsis
     * - Full text is accessible via accessibilityLabel on parent
     * 
     * @see Requirements: 1.1, 1.5, 1.6, 4.1 - Label rendering and truncation
     */
    @ViewBuilder
    private var labelContent: some View {
        if truncate {
            Text(label)
                .font(.system(size: size.fontSize, weight: .medium))
                .foregroundColor(BadgeLabelBaseTokens.textColor)
                .lineLimit(1)
                .truncationMode(.tail)
                .frame(maxWidth: BadgeLabelBaseTokens.maxWidth, alignment: .leading)
        } else {
            Text(label)
                .font(.system(size: size.fontSize, weight: .medium))
                .foregroundColor(BadgeLabelBaseTokens.textColor)
                .lineLimit(1)
        }
    }
}

// MARK: - Preview

/**
 * SwiftUI Preview for Badge-Label-Base component.
 * 
 * Demonstrates all size variants, icon support, and truncation behavior.
 * 
 * @see Requirements: 5.2 - iOS SwiftUI implementation
 */
struct BadgeLabelBase_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Badge-Label-Base Component")
                    .font(.headline)
                
                // Size variants
                Text("Size Variants")
                    .font(.subheadline)
                
                HStack(spacing: 16) {
                    ForEach(BadgeLabelBaseSize.allCases, id: \.self) { size in
                        VStack {
                            BadgeLabelBase(label: "Draft", size: size)
                            Text(size.rawValue)
                                .font(.caption)
                            Text(size.typographyTokenReference)
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                
                Divider()
                
                // With icons
                Text("With Icons")
                    .font(.subheadline)
                
                HStack(spacing: 16) {
                    BadgeLabelBase(label: "Approved", icon: "check", size: .sm)
                    BadgeLabelBase(label: "Pending", icon: "clock", size: .md)
                    BadgeLabelBase(label: "Warning", icon: "alert-triangle", size: .lg)
                }
                
                Divider()
                
                // Truncation
                Text("Truncation Behavior")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        BadgeLabelBase(label: "Short", truncate: false)
                        Text("No truncation")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeLabelBase(label: "This is a very long category name that should truncate", truncate: true)
                        Text("With truncation")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeLabelBase(label: "This is a very long category name that should NOT truncate", truncate: false)
                        Text("Without truncation")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                Divider()
                
                // Various labels
                Text("Various Labels")
                    .font(.subheadline)
                
                HStack(spacing: 8) {
                    BadgeLabelBase(label: "New")
                    BadgeLabelBase(label: "Featured")
                    BadgeLabelBase(label: "Sale")
                    BadgeLabelBase(label: "Limited")
                }
                
                Divider()
                
                // With testID
                Text("With testID")
                    .font(.subheadline)
                
                BadgeLabelBase(label: "Status", testID: "status-badge")
                
                Divider()
                
                // Token references
                Text("Token References")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(BadgeLabelBaseSize.allCases, id: \.self) { size in
                        HStack {
                            BadgeLabelBase(label: "Label", size: size)
                            VStack(alignment: .leading) {
                                Text("\(size.rawValue): \(size.typographyTokenReference)")
                                    .font(.caption)
                                Text("Icon: \(Int(size.iconSize))pt, Gap: \(Int(size.iconGap))pt")
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
