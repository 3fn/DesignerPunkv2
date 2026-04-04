/**
 * Progress-Pagination-Base Component for iOS Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Pagination-Base
 * 
 * Simple pagination indicator composing Node-Base primitives (dots only).
 * Renders all dots in a ScrollView with native scroll centering via
 * ScrollViewReader + scrollTo(anchor: .center). Viewport clips to ~5 visible.
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

// MARK: - Gap Token Values

/**
 * Gap values between pagination nodes per size variant.
 * References progress.node.gap.* component tokens.
 */
private enum PaginationGap {
    static func value(for size: ProgressNodeSize) -> CGFloat {
        switch size {
        case .sm, .md: return DesignTokens.spaceGroupedTight   // space.grouped.tight
        case .lg:      return DesignTokens.spaceGroupedNormal  // space.grouped.normal
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

    /// Maximum visible dots in the viewport (matches web)
    private var maxVisible: Int {
        min(totalItems, 5)
    }

    /// Accessibility label reflecting actual position
    /// @see Requirements 2.12, 7.1-7.2, 9.7
    private var effectiveAccessibilityLabel: String {
        accessibilityLabel ?? "Page \(currentItem) of \(totalItems)"
    }

    // MARK: - Body

    public var body: some View {
        let reduceMotion = UIAccessibility.isReduceMotionEnabled
        let stateAnimation: Animation? = reduceMotion
            ? nil
            : DesignTokens.MotionSelectionTransition.easing

        ScrollViewReader { proxy in
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: PaginationGap.value(for: size)) {
                    ForEach(1...totalItems, id: \.self) { index in
                        ProgressIndicatorNodeBase(
                            state: derivePaginationNodeState(index: index, currentItem: currentItem),
                            size: size,
                            content: .none
                        )
                        .id(index)
                    }
                }
                .padding(.vertical, size == .lg ? DesignTokens.spaceInset100 : DesignTokens.spaceInset075)
                .padding(.horizontal, size == .lg ? DesignTokens.spaceInset150 : DesignTokens.spaceInset100)
            }
            .scrollDisabled(true)
            .onChange(of: currentItem) { newValue in
                if reduceMotion {
                    proxy.scrollTo(newValue, anchor: .center)
                } else {
                    withAnimation(DesignTokens.MotionSettleTransition.easing) {
                        proxy.scrollTo(newValue, anchor: .center)
                    }
                }
            }
            .onAppear {
                proxy.scrollTo(currentItem, anchor: .center)
            }
        }
        .frame(width: viewportWidth)
        .background(DesignTokens.colorScrimStandard)
        .clipShape(Capsule())
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(effectiveAccessibilityLabel)
        .accessibilityIdentifier(testID ?? "")
        .animation(stateAnimation, value: currentItem)
    }

    /// Fixed viewport width based on maxVisible dots + gaps + padding
    private var viewportWidth: CGFloat {
        let stride = size.currentSize
        let gap = PaginationGap.value(for: size)
        let hPad = size == .lg ? DesignTokens.spaceInset150 : DesignTokens.spaceInset100
        return CGFloat(maxVisible) * stride + CGFloat(maxVisible - 1) * gap + 2 * hPad
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

                // Scroll centering (20 items)
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
