/**
 * Badge-Count-Notification Component for iOS Platform
 * 
 * Stemma System: Badge Family
 * Component Type: Semantic Variant (inherits from Badge-Count-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Badge-Count-Notification
 * 
 * A notification count badge with predefined styling and accessibility announcements
 * for screen readers. Extends Badge-Count-Base behavior with notification-specific
 * colors and live region announcements.
 * 
 * Key Characteristics:
 * - Inherits all Badge-Count-Base behavior (count display, max truncation, showZero)
 * - Fixed notification colors (pink400 background, white100 text)
 * - Accessibility announcements via UIAccessibility.post(notification:)
 * - Pluralized announcement text ("1 notification", "5 notifications")
 * - Optional announceChanges prop (default: true)
 * 
 * @module Badge-Count-Notification/platforms/ios
 * @see Requirements: 3.1-3.10, 4.7, 5.2, 6.3
 * @see .kiro/specs/044-badge-base/design.md for design specification
 */

import SwiftUI
import UIKit

// MARK: - Badge-Count-Notification Tokens

/**
 * Badge-Count-Notification specific design tokens.
 * 
 * Fixed notification colors - not configurable by consumers.
 * These tokens reference the semantic color tokens:
 * - color.badge.notification.background → pink400
 * - color.badge.notification.text → white100
 * 
 * Contrast Ratio: 6.33:1 (exceeds WCAG AA 4.5:1)
 * 
 * @see Requirements: 3.1, 4.7 - notification-specific color tokens
 */
enum BadgeCountNotificationTokens {
    // MARK: - Fixed Notification Colors
    
    /// Background color for notification badge
    /// Uses semantic token: color.badge.notification.background
    /// @see Requirement 3.1 - notification-specific color tokens
    static let backgroundColor: Color = Color(DesignTokens.colorBadgeNotificationBackground)
    
    /// Text color for notification badge
    /// Uses semantic token: color.badge.notification.text
    /// @see Requirement 3.1 - notification-specific color tokens
    static let textColor: Color = Color(DesignTokens.colorBadgeNotificationText)
}

// MARK: - Badge-Count-Notification Size Enum

/**
 * Badge-Count-Notification size variants.
 * 
 * Inherits size specifications from Badge-Count-Base:
 * - sm: typography.labelXs, space.inset.none (v), space.inset.050 (h), min-width = line-height
 * - md: typography.labelSm, space.inset.none (v), space.inset.050 (h), min-width = line-height
 * - lg: typography.labelMd, space.inset.050 (v), space.inset.100 (h), min-width = line-height
 * 
 * @see Requirements: 3.2 - inherits size behavior from Badge-Count-Base
 */
public enum BadgeCountNotificationSize: String, CaseIterable {
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

// MARK: - Badge-Count-Notification Default Values

/**
 * Default values for Badge-Count-Notification props.
 * 
 * Inherits defaults from Badge-Count-Base and adds notification-specific defaults.
 * 
 * @see Requirements: 3.2, 3.6 - Default values
 */
public enum BadgeCountNotificationDefaults {
    /// Default maximum before showing "[max]+"
    /// @see Requirements: 3.2 - inherits max behavior from Badge-Count-Base
    public static let max: Int = 99
    
    /// Default showZero behavior
    /// @see Requirements: 3.2 - inherits showZero behavior from Badge-Count-Base
    public static let showZero: Bool = false
    
    /// Default size variant
    /// @see Requirements: 3.2 - inherits size behavior from Badge-Count-Base
    public static let size: BadgeCountNotificationSize = .md
    
    /// Default announceChanges behavior - announce count changes to screen readers
    /// @see Requirements: 3.6 - default announceChanges to true
    public static let announceChanges: Bool = true
}

// MARK: - Badge-Count-Notification View

/**
 * Badge-Count-Notification SwiftUI View
 * 
 * A notification count badge with predefined styling and accessibility announcements.
 * Extends Badge-Count-Base behavior with notification-specific colors and live region
 * announcements for screen readers.
 * 
 * Fixed Colors (not configurable):
 * - Background: color.badge.notification.background (pink400)
 * - Text: color.badge.notification.text (white100)
 * - Contrast Ratio: 6.33:1 (exceeds WCAG AA 4.5:1)
 * 
 * Accessibility Features:
 * - `.accessibilityAddTraits(.updatesFrequently)` for live region behavior
 * - `UIAccessibility.post(notification:)` for count change announcements
 * - Pluralized announcement text ("1 notification", "5 notifications")
 * - Optional announceChanges prop (default: true)
 * 
 * Usage:
 * ```swift
 * // Basic usage
 * BadgeCountNotification(count: 5)
 * 
 * // With size variant
 * BadgeCountNotification(count: 3, size: .sm)
 * 
 * // With max truncation
 * BadgeCountNotification(count: 150, max: 99)  // Shows "99+"
 * 
 * // Disable announcements
 * BadgeCountNotification(count: 5, announceChanges: false)
 * 
 * // With testID
 * BadgeCountNotification(count: 5, testID: "notification-badge")
 * ```
 * 
 * @see Requirements: 3.1-3.10, 4.7, 5.2, 6.3
 */
public struct BadgeCountNotification: View {
    
    // MARK: - Properties
    
    /// Notification count (required)
    /// @see Requirements: 3.2 - inherits count behavior from Badge-Count-Base
    public let count: Int
    
    /// Maximum before showing "[max]+"
    /// @see Requirements: 3.2 - inherits max behavior from Badge-Count-Base
    public let max: Int
    
    /// Whether to show badge when count is 0
    /// @see Requirements: 3.2 - inherits showZero behavior from Badge-Count-Base
    public let showZero: Bool
    
    /// Size variant
    /// @see Requirements: 3.2 - inherits size behavior from Badge-Count-Base
    public let size: BadgeCountNotificationSize
    
    /// Whether to announce count changes to screen readers
    /// @see Requirements: 3.3, 3.6, 3.7 - announceChanges prop
    public let announceChanges: Bool
    
    /// Test ID for automated testing
    /// @see Requirements: testID as accessibilityIdentifier
    public let testID: String?
    
    /// Previous count for tracking changes (used for announcements)
    @State private var previousCount: Int?
    
    // MARK: - Initialization
    
    /**
     * Initialize Badge-Count-Notification with all properties.
     * 
     * - Parameters:
     *   - count: Notification count (required)
     *   - max: Maximum before showing "[max]+". Defaults to 99
     *   - showZero: Whether to show badge when count is 0. Defaults to false
     *   - size: Size variant. Defaults to .md
     *   - announceChanges: Whether to announce count changes. Defaults to true
     *   - testID: Test ID for automated testing. Defaults to nil
     * 
     * @see Requirements: 3.1-3.10 - Props interface
     */
    public init(
        count: Int,
        max: Int = BadgeCountNotificationDefaults.max,
        showZero: Bool = BadgeCountNotificationDefaults.showZero,
        size: BadgeCountNotificationSize = BadgeCountNotificationDefaults.size,
        announceChanges: Bool = BadgeCountNotificationDefaults.announceChanges,
        testID: String? = nil
    ) {
        // Handle negative counts by using absolute value
        // @see Error Handling in design.md - count is negative → Render absolute value or 0
        self.count = Swift.max(0, abs(count))
        
        // Handle invalid max by using default
        // @see Error Handling in design.md - max is 0 or negative → Use default (99)
        self.max = max > 0 ? max : BadgeCountNotificationDefaults.max
        
        self.showZero = showZero
        self.size = size
        self.announceChanges = announceChanges
        self.testID = testID
    }
    
    // MARK: - Computed Properties
    
    /// Display text for the count
    /// @see Requirements: 3.2 - inherits max truncation from Badge-Count-Base
    private var displayText: String {
        if count > max {
            return "\(max)+"
        }
        return String(count)
    }
    
    /// Whether the badge should be visible
    /// @see Requirements: 3.2 - inherits showZero behavior from Badge-Count-Base
    private var shouldRender: Bool {
        if count == 0 && !showZero {
            return false
        }
        return true
    }
    
    /// Whether the count is a single digit (for circular shape)
    /// @see Requirements: 3.2 - inherits circular vs pill shape from Badge-Count-Base
    private var isSingleDigit: Bool {
        return displayText.count == 1
    }
    
    /**
     * Get the announcement text for screen readers.
     * 
     * Implements pluralization logic:
     * - "1 notification" (singular)
     * - "5 notifications" (plural)
     * - "99 or more notifications" (overflow)
     * 
     * @see Requirements: 3.4, 3.5 - pluralized announcement text
     */
    private var announcementText: String {
        // @see Requirement 3.5 - overflow announcement
        if count > max {
            return "\(max) or more notifications"
        }
        
        // @see Requirement 3.4 - pluralized text
        if count == 1 {
            return "1 notification"
        }
        
        return "\(count) notifications"
    }
    
    // MARK: - Body
    
    /**
     * Main body with conditional rendering and accessibility modifiers.
     * 
     * Accessibility features:
     * - `.accessibilityIdentifier(testID)`: Sets test identifier for automated testing
     * - `.accessibilityLabel(announcementText)`: Announces count to screen readers
     * - `.accessibilityAddTraits(.updatesFrequently)`: Marks as live region
     * - Non-interactive: No button traits, not focusable
     * 
     * @see Requirements: 3.1-3.10, 6.3 - Visibility and accessibility
     */
    public var body: some View {
        if shouldRender {
            badgeContainer
                .accessibilityIdentifier(testID ?? "")
                .accessibilityLabel(announcementText)
                .accessibilityElement(children: .ignore)
                .accessibilityAddTraits(announceChanges ? .updatesFrequently : [])
                .onChange(of: count) { newCount in
                    handleCountChange(newCount: newCount)
                }
                .onAppear {
                    // Initialize previous count on first render
                    previousCount = count
                }
        }
    }
    
    // MARK: - Badge Container
    
    /**
     * Main badge container with notification colors, content, and shape.
     * 
     * Structure:
     * - Text content centered in container
     * - Fixed notification background color (pink400)
     * - Fixed notification text color (white100)
     * - Capsule shape for circular/pill (radiusHalf equivalent)
     * - Min-width ensures circular shape for single digits
     * - Non-interactive (no gesture handlers)
     * 
     * @see Requirements: 3.1, 4.7 - notification-specific colors
     */
    @ViewBuilder
    private var badgeContainer: some View {
        Text(displayText)
            .font(.system(size: size.fontSize, weight: .medium))
            .foregroundColor(BadgeCountNotificationTokens.textColor)
            .lineLimit(1)
            .padding(.vertical, size.paddingVertical)
            .padding(.horizontal, size.paddingHorizontal)
            .frame(minWidth: isSingleDigit ? size.minWidth : nil, minHeight: size.minWidth)
            .background(
                Capsule()
                    .fill(BadgeCountNotificationTokens.backgroundColor)
            )
    }
    
    // MARK: - Accessibility Announcements
    
    /**
     * Handle count changes and post accessibility announcements.
     * 
     * Only announces when:
     * - announceChanges is true
     * - There was a previous count (not initial render)
     * - The count has actually changed
     * 
     * Uses `UIAccessibility.post(notification:announcement:)` to announce
     * the new count to screen readers.
     * 
     * @see Requirements: 3.3, 3.7, 3.9 - announcement conditions and iOS implementation
     */
    private func handleCountChange(newCount: Int) {
        // Only announce if announceChanges is enabled
        guard announceChanges else { return }
        
        // Only announce if there was a previous count (not initial render)
        guard let previous = previousCount else {
            previousCount = newCount
            return
        }
        
        // Only announce if count actually changed
        guard previous != newCount else { return }
        
        // Update previous count
        previousCount = newCount
        
        // Post accessibility announcement
        // @see Requirement 3.9 - UIAccessibility.post(notification:) for announcements
        UIAccessibility.post(
            notification: .announcement,
            argument: announcementText
        )
    }
}

// MARK: - Preview

/**
 * SwiftUI Preview for Badge-Count-Notification component.
 * 
 * Demonstrates notification colors, size variants, max truncation, and announceChanges.
 * 
 * @see Requirements: 5.2 - iOS SwiftUI implementation
 */
struct BadgeCountNotification_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Badge-Count-Notification Component")
                    .font(.headline)
                
                // Notification colors
                Text("Notification Colors (Fixed)")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        BadgeCountNotification(count: 5)
                        Text("pink400 background, white100 text")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    Text("Contrast Ratio: 6.33:1 (exceeds WCAG AA 4.5:1)")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                
                Divider()
                
                // Size variants
                Text("Size Variants")
                    .font(.subheadline)
                
                HStack(spacing: 16) {
                    ForEach(BadgeCountNotificationSize.allCases, id: \.self) { size in
                        VStack {
                            BadgeCountNotification(count: 5, size: size)
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
                        BadgeCountNotification(count: 1)
                        Text("Single digit (1) - Circular")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountNotification(count: 9)
                        Text("Single digit (9) - Circular")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountNotification(count: 10)
                        Text("Double digit (10) - Pill")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountNotification(count: 99)
                        Text("Double digit (99) - Pill")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountNotification(count: 100)
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
                        BadgeCountNotification(count: 99, max: 99)
                        Text("count=99, max=99 → Shows 99")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountNotification(count: 100, max: 99)
                        Text("count=100, max=99 → Shows 99+")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountNotification(count: 50, max: 9)
                        Text("count=50, max=9 → Shows 9+")
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
                        BadgeCountNotification(count: 0, showZero: false)
                        Text("count=0, showZero=false → Hidden")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountNotification(count: 0, showZero: true)
                        Text("count=0, showZero=true → Shows 0")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                Divider()
                
                // announceChanges behavior
                Text("announceChanges Behavior")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        BadgeCountNotification(count: 5, announceChanges: true)
                        Text("announceChanges=true (default)")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountNotification(count: 5, announceChanges: false)
                        Text("announceChanges=false")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    Text("When announceChanges=true, count changes are announced to screen readers")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                
                Divider()
                
                // Announcement text examples
                Text("Announcement Text (Pluralization)")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        BadgeCountNotification(count: 1)
                        Text("\"1 notification\"")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountNotification(count: 5)
                        Text("\"5 notifications\"")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        BadgeCountNotification(count: 100)
                        Text("\"99 or more notifications\"")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                Divider()
                
                // Various counts
                Text("Various Counts")
                    .font(.subheadline)
                
                HStack(spacing: 8) {
                    BadgeCountNotification(count: 1)
                    BadgeCountNotification(count: 5)
                    BadgeCountNotification(count: 12)
                    BadgeCountNotification(count: 42)
                    BadgeCountNotification(count: 99)
                    BadgeCountNotification(count: 150)
                }
                
                Divider()
                
                // With testID
                Text("With testID")
                    .font(.subheadline)
                
                BadgeCountNotification(count: 5, testID: "notification-badge")
                
                Divider()
                
                // Accessibility traits
                Text("Accessibility Features")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 8) {
                    Text("• .accessibilityAddTraits(.updatesFrequently)")
                        .font(.caption)
                    Text("• UIAccessibility.post(notification:) for announcements")
                        .font(.caption)
                    Text("• Pluralized announcement text")
                        .font(.caption)
                    Text("• accessibilityIdentifier for testID")
                        .font(.caption)
                }
                .foregroundColor(.secondary)
            }
            .padding()
        }
    }
}
