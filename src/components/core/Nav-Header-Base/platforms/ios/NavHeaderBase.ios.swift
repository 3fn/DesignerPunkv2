/**
 * Nav-Header-Base — iOS Implementation
 *
 * Structural primitive for top-of-screen navigation bars.
 * Three-region layout, landmark semantics, safe area, appearance modes.
 * Internal only — semantic variants compose this.
 *
 * Stemma System: Navigation Family, Primitive (Base)
 *
 * @module Nav-Header-Base/platforms/ios
 * @see .kiro/specs/088-top-bar-component/design.md
 * @see contracts: accessibility_aria_roles, visual_background, visual_translucent,
 *      visual_separator, layout_three_regions, layout_safe_area, interaction_focus_order
 */

import SwiftUI

// MARK: - Tokens

/// Component token references for Nav-Header-Base.
enum NavHeaderTokens {
    // Background (contract: visual_background)
    static let canvasBackground: Color = Color(DesignTokens.colorStructureCanvas)

    // Separator (contract: visual_separator)
    static let separatorColor: Color = Color(DesignTokens.colorStructureBorderSubtle)
    static let separatorWidth: CGFloat = DesignTokens.borderWidth100
}

// MARK: - Nav-Header-Base View

/// Structural primitive for top-of-screen navigation bars.
/// Provides three-region layout, safe area integration, and landmark semantics.
/// Internal only — use Nav-Header-Page or Nav-Header-App instead.
struct NavHeaderBase<Leading: View, Title: View, Trailing: View>: View {
    let leadingSlot: Leading
    let titleSlot: Title
    let trailingSlot: Trailing
    var appearance: NavHeaderAppearance = .opaque
    var showSeparator: Bool = true
    var testID: String? = nil

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 0) {
                // Leading region (inline-start)
                leadingSlot
                    .accessibilitySortPriority(3)

                // Title region (center, fills available space)
                titleSlot
                    .frame(maxWidth: .infinity)
                    .accessibilitySortPriority(2)

                // Trailing region (inline-end)
                trailingSlot
                    .accessibilitySortPriority(1)
            }
            .frame(minHeight: 48)
            .background(backgroundView)

            // Separator (contract: visual_separator)
            if showSeparator {
                Rectangle()
                    .fill(NavHeaderTokens.separatorColor)
                    .frame(height: NavHeaderTokens.separatorWidth)
                    .accessibilityHidden(true)
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityAddTraits(.isHeader)
        .if(testID != nil) { view in
            view.accessibilityIdentifier(testID!)
        }
    }

    // MARK: - Background

    @ViewBuilder
    private var backgroundView: some View {
        switch appearance {
        case .opaque:
            NavHeaderTokens.canvasBackground
        case .translucent:
            // iOS system material for translucent backdrop
            // blur050→.systemUltraThinMaterial, blur100→.systemThinMaterial, blur150→.systemMaterial
            Color.clear.background(.thinMaterial)
        }
    }
}

// MARK: - Appearance

enum NavHeaderAppearance {
    case opaque
    case translucent
}

// MARK: - Conditional Modifier

private extension View {
    @ViewBuilder
    func `if`<Content: View>(_ condition: Bool, transform: (Self) -> Content) -> some View {
        if condition { transform(self) } else { self }
    }
}
