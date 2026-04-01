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

// Composition: IconBase( via ButtonIcon), ButtonIcon( direct)
// MARK: - Swift Types (from types.ts)

enum LeadingAction {
    case back(accessibilityLabel: String? = nil, onPress: () -> Void)
    case menu(onPress: () -> Void)
    case custom(icon: IconBaseName, accessibilityLabel: String, onPress: () -> Void)
}

struct TrailingAction: Identifiable {
    let id = UUID()
    let icon: IconBaseName
    let accessibilityLabel: String
    let onPress: () -> Void
    var badge: Int? = nil
}

struct CloseAction {
    let onPress: () -> Void
    var accessibilityLabel: String? = nil
}

enum TitleAlignment {
    case center
    case leading
}

enum ScrollBehavior {
    case fixed
    case collapsible
}

// MARK: - Tokens

enum NavHeaderPageTokens {
    static let titleColor: Color = Color(DesignTokens.colorActionNavigation)
    static let trailingGap: CGFloat = DesignTokens.spaceGroupedMinimal
    static let closeGap: CGFloat = DesignTokens.spaceGroupedTight
    static let scrollThreshold: CGFloat = 8
    static let animationDuration: Double = DesignTokens.duration150 / 1000 // ms → seconds
}

// MARK: - Scroll Offset PreferenceKey

struct ScrollOffsetPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
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
    @State private var lastScrollOffset: CGFloat = 0
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
        .offset(y: isHidden ? -NavHeaderTokens.minHeight : 0)
        .animation(
            reduceMotion ? nil : .easeOut(duration: NavHeaderPageTokens.animationDuration),
            value: isHidden
        )
        .onPreferenceChange(ScrollOffsetPreferenceKey.self) { offset in
            guard scrollBehavior == .collapsible, !reduceMotion else { return }
            let delta = offset - lastScrollOffset
            if delta < -NavHeaderPageTokens.scrollThreshold && !isHidden {
                isHidden = true
            } else if delta > NavHeaderPageTokens.scrollThreshold && isHidden {
                isHidden = false
            }
            lastScrollOffset = offset
        }
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
                size: DesignTokens.typographyLabelMd.fontSize,
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
            ForEach(trailingActions) { action in
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

            if let close = closeAction {
                Spacer()
                    .frame(width: NavHeaderPageTokens.closeGap)

                ButtonIcon(
                    icon: .close,
                    ariaLabel: close.accessibilityLabel ?? "Close",
                    onPress: close.onPress,
                    size: .medium,
                    variant: .tertiary
                )
            }
        }
    }
}
