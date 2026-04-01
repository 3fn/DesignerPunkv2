/**
 * Nav-Header-Page — iOS Implementation
 *
 * Opinionated page-level navigation bar. Composes Nav-Header-Base.
 * Back/close actions, h1 title, trailing actions, collapsible scroll.
 *
 * Stemma System: Navigation Family, Semantic (inherits Nav-Header-Base)
 *
 * @module Nav-Header-Page/platforms/ios
 * @see .kiro/specs/088-top-bar-component/design.md
 */

import SwiftUI

// MARK: - Tokens

enum NavHeaderPageTokens {
    static let titleColor: Color = Color(DesignTokens.colorActionNavigation)
    static let trailingGap: CGFloat = DesignTokens.spaceGroupedMinimal
    static let closeGap: CGFloat = DesignTokens.spaceGroupedTight
    static let scrollThreshold: CGFloat = 8
}

// MARK: - Nav-Header-Page View

struct NavHeaderPage: View {
    let title: String
    var leadingAction: LeadingAction? = nil
    var trailingActions: [TrailingAction] = []
    var closeAction: CloseAction? = nil
    var titleAlignment: TitleAlignment = .center  // iOS default
    var scrollBehavior: ScrollBehavior = .fixed
    var appearance: NavHeaderAppearance = .opaque
    var showSeparator: Bool = true
    var testID: String? = nil

    @State private var isHidden = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        NavHeaderBase(
            leadingSlot: leadingView,
            titleSlot: titleView,
            trailingSlot: trailingView,
            appearance: appearance,
            showSeparator: showSeparator,
            testID: testID
        )
        .offset(y: isHidden ? -100 : 0)
        .animation(reduceMotion ? nil : .easeInOut(duration: 0.15), value: isHidden)
    }

    // MARK: - Leading

    @ViewBuilder
    private var leadingView: some View {
        if let action = leadingAction {
            switch action {
            case .back(let label, let onPress):
                ButtonIcon(
                    icon: .chevronLeft,
                    ariaLabel: label ?? "Back",
                    onPress: onPress,
                    size: .medium,
                    variant: .tertiary
                )
            case .menu(let onPress):
                ButtonIcon(
                    icon: .menu,
                    ariaLabel: "Menu",
                    onPress: onPress,
                    size: .medium,
                    variant: .tertiary
                )
            case .custom(let icon, let label, let onPress):
                ButtonIcon(
                    icon: icon,
                    ariaLabel: label,
                    onPress: onPress,
                    size: .medium,
                    variant: .tertiary
                )
            }
        }
    }

    // MARK: - Title

    @ViewBuilder
    private var titleView: some View {
        Text(title)
            .font(.system(
                size: DesignTokens.typographyLabelMdFontSize,
                weight: .medium
            ))
            .foregroundColor(NavHeaderPageTokens.titleColor)
            .lineLimit(1)
            .truncationMode(.tail)
            .accessibilityAddTraits(.isHeader)
            .frame(
                maxWidth: .infinity,
                alignment: titleAlignment == .center ? .center : .leading
            )
    }

    // MARK: - Trailing

    @ViewBuilder
    private var trailingView: some View {
        HStack(spacing: NavHeaderPageTokens.trailingGap) {
            ForEach(trailingActions.indices, id: \.self) { index in
                let action = trailingActions[index]
                ZStack(alignment: .topTrailing) {
                    ButtonIcon(
                        icon: action.icon,
                        ariaLabel: action.accessibilityLabel,
                        onPress: action.onPress,
                        size: .medium,
                        variant: .tertiary
                    )
                    if let badge = action.badge, badge > 0 {
                        BadgeCountBase(count: badge, size: .sm)
                    }
                }
            }

            if closeAction != nil {
                Spacer()
                    .frame(width: NavHeaderPageTokens.closeGap)

                ButtonIcon(
                    icon: .close,
                    ariaLabel: closeAction?.accessibilityLabel ?? "Close",
                    onPress: closeAction!.onPress,
                    size: .medium,
                    variant: .tertiary
                )
            }
        }
    }
}

// MARK: - Enums

enum TitleAlignment {
    case center
    case leading
}

enum ScrollBehavior {
    case fixed
    case collapsible
}
