/**
 * Progress-Pagination-Base Component for iOS Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Pagination-Base
 * 
 * Simple pagination indicator composing Node-Base primitives (dots only).
 * Supports virtualization for large item counts (>5 items → sliding window).
 * 
 * @module Progress-Pagination-Base/platforms/ios
 * @see Requirements: 2.1-2.12, 10.1-10.2, 11.1-11.6
 * @see .kiro/specs/048-progress-family/design.md
 */

import SwiftUI

// MARK: - Constants

/// Maximum number of items supported
/// @see Requirement 2.9
private let paginationMaxItems = 50

/// Maximum visible nodes when virtualized
/// @see Requirements 2.4-2.8
private let paginationVisibleWindow = 5

// MARK: - Gap Token Values

/**
 * Gap values between pagination nodes per size variant.
 * References progress.node.gap.* component tokens.
 */
private enum PaginationGap {
    static func value(for size: ProgressNodeSize) -> CGFloat {
        switch size {
        case .sm: return 6   // progress.node.gap.sm (space075)
        case .md: return 8   // progress.node.gap.md (space100)
        case .lg: return 12  // progress.node.gap.lg (space150)
        }
    }
}

// MARK: - State Derivation

/**
 * Derive node state for pagination.
 * 
 * @see Requirements 10.1-10.2
 */
private func derivePaginationNodeState(index: Int, currentItem: Int) -> ProgressNodeState {
    return index == currentItem ? .current : .incomplete
}

// MARK: - Virtualization

/**
 * Calculate visible window for virtualized pagination.
 * 
 * @see Requirements 2.4-2.8, 9.1-9.6
 */
private func calculateVisibleWindow(currentItem: Int, totalItems: Int) -> (start: Int, end: Int) {
    if totalItems <= paginationVisibleWindow {
        return (start: 1, end: totalItems)
    }

    // Near start: show first 5
    if currentItem <= 3 {
        return (start: 1, end: 5)
    }

    // Near end: show last 5
    if currentItem >= totalItems - 2 {
        return (start: totalItems - 4, end: totalItems)
    }

    // Middle: center current at position 3
    return (start: currentItem - 2, end: currentItem + 2)
}

// MARK: - Progress-Pagination-Base View

/**
 * Progress-Pagination-Base SwiftUI View
 * 
 * Composes ProgressIndicatorNodeBase primitives to create a simple
 * pagination indicator. All nodes use content .none (dots only).
 * 
 * Usage:
 * ```swift
 * ProgressPaginationBase(totalItems: 10, currentItem: 3, size: .sm)
 * ```
 * 
 * @see Requirements: 2.1-2.12, 10.1-10.2, 11.1-11.6
 */
public struct ProgressPaginationBase: View {

    // MARK: - Properties

    public let totalItems: Int
    public let currentItem: Int
    public let size: ProgressNodeSize
    public let accessibilityLabel: String?
    public let testID: String?

    // MARK: - Initialization

    public init(
        totalItems: Int,
        currentItem: Int,
        size: ProgressNodeSize = .md,
        accessibilityLabel: String? = nil,
        testID: String? = nil
    ) {
        // Validate and clamp totalItems
        // @see Requirements 2.9-2.10
        if totalItems > paginationMaxItems {
            #if DEBUG
            assertionFailure(
                "Progress-Pagination-Base supports a maximum of \(paginationMaxItems) items. " +
                "Received \(totalItems) items. " +
                "Consider using a different navigation pattern for larger sets."
            )
            #else
            print(
                "⚠️ Progress-Pagination-Base: Received \(totalItems) items but maximum is \(paginationMaxItems). " +
                "Rendering first \(paginationMaxItems) items only."
            )
            #endif
        }

        self.totalItems = min(totalItems, paginationMaxItems)

        // Clamp currentItem to valid range [1, totalItems]
        // @see Requirement 2.11
        self.currentItem = max(1, min(currentItem, self.totalItems))

        self.size = size
        self.accessibilityLabel = accessibilityLabel
        self.testID = testID
    }

    // MARK: - Computed Properties

    /// Visible window for virtualization
    private var visibleWindow: (start: Int, end: Int) {
        calculateVisibleWindow(currentItem: currentItem, totalItems: totalItems)
    }

    /// ARIA label reflecting actual position (not virtualized subset)
    /// @see Requirements 2.12, 7.1-7.2, 9.7
    private var effectiveAccessibilityLabel: String {
        accessibilityLabel ?? "Page \(currentItem) of \(totalItems)"
    }

    // MARK: - Body

    public var body: some View {
        HStack(spacing: PaginationGap.value(for: size)) {
            ForEach(visibleWindow.start...visibleWindow.end, id: \.self) { index in
                ProgressIndicatorNodeBase(
                    state: derivePaginationNodeState(index: index, currentItem: currentItem),
                    size: size,
                    content: .none
                )
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(effectiveAccessibilityLabel)
        .accessibilityIdentifier(testID ?? "")
    }
}

// MARK: - Preview

struct ProgressPaginationBase_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Progress-Pagination-Base")
                    .font(.headline)

                // Basic pagination (5 items)
                Text("5 items, current=3, sm")
                    .font(.subheadline)
                ProgressPaginationBase(totalItems: 5, currentItem: 3, size: .sm)

                // Virtualized pagination (20 items)
                Text("20 items, current=10, md")
                    .font(.subheadline)
                ProgressPaginationBase(totalItems: 20, currentItem: 10, size: .md)

                // All sizes
                Text("Sizes (10 items, current=5)")
                    .font(.subheadline)
                VStack(spacing: 12) {
                    ProgressPaginationBase(totalItems: 10, currentItem: 5, size: .sm)
                    ProgressPaginationBase(totalItems: 10, currentItem: 5, size: .md)
                    ProgressPaginationBase(totalItems: 10, currentItem: 5, size: .lg)
                }
            }
            .padding()
        }
    }
}
