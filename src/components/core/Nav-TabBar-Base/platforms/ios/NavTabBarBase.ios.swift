/**
 * Nav-TabBar-Base — iOS Implementation
 *
 * Primary bottom navigation with icon-only tabs, dot indicator,
 * radial glow gradients, and three-phase selection animation.
 * Full-width anchored to bottom, OS safe area.
 *
 * Stemma System: Navigation Family, Primitive (Base)
 *
 * @module Nav-TabBar-Base/platforms/ios
 * @see .kiro/specs/050-nav-tabbar-base/design.md
 * @see Requirements: R1-R6, R8-R10
 */

import SwiftUI

// MARK: - Tokens

/// Component token references for Nav-TabBar-Base.
/// Contracts: visual_background, visual_state_colors, visual_gradient_glow
enum NavTabBarTokens {
    // Container (contract: visual_background)
    static let containerBackground: Color = Color(DesignTokens.colorStructureCanvas)
    static let borderColor: Color = Color(DesignTokens.colorStructureBorderSubtle)
    static let borderWidth: CGFloat = DesignTokens.borderDefault

    // Icons (contract: visual_state_colors)
    static let activeIconColor: Color = Color(DesignTokens.colorActionNavigation)
    static let inactiveIconColor: Color = Color(DesignTokens.colorIconNavigationInactive)

    // Dot (contract: visual_state_colors)
    static let dotSize: CGFloat = DesignTokens.size050
    static let dotColor: Color = Color(DesignTokens.colorActionNavigation)

    // Glow gradient (contract: visual_gradient_glow)
    static let glowActiveCenter: Color = Color(DesignTokens.colorBackgroundPrimarySubtle)
    static let glowInactiveCenter: Color = Color(DesignTokens.colorStructureCanvas)
    static let glowEdgeColor: Color = Color(DesignTokens.colorStructureCanvas)
    static let glowEdgeOpacity: Double = DesignTokens.opacity024

    // Spacing (contract: layout_flexible_length)
    static let activePaddingTop: CGFloat = DesignTokens.space150
    static let activePaddingInline: CGFloat = DesignTokens.space150
    static let activePaddingBottom: CGFloat = DesignTokens.space150
    static let activeItemSpacing: CGFloat = DesignTokens.spaceGroupedMinimal
    static let inactivePaddingTop: CGFloat = DesignTokens.space150
    static let inactivePaddingInline: CGFloat = DesignTokens.space150
    static let inactivePaddingBottom: CGFloat = DesignTokens.space075
    static let minTapWidth: CGFloat = DesignTokens.tapAreaMinimum
    static let minTabHeight: CGFloat = DesignTokens.space600

    // Icon
    static let iconSize: CGFloat = DesignTokens.iconSize100

    // Glow geometry
    static let glowHorizontalRadius: CGFloat = DesignTokens.space700

    // Motion
    static let durationShort: Double = DesignTokens.Duration.duration150
    static let durationGlide: Double = DesignTokens.Duration.duration350
}

// MARK: - Tab Option

/// A tab item definition — icon-only with required accessibility label.
public struct TabOption: Identifiable {
    public let value: String
    public let icon: String              // outline-stroke variant (inactive)
    public let activeIcon: String        // solid-fill variant (active)
    public let accessibilityLabel: String

    public var id: String { value }
}

// MARK: - View

/// Nav-TabBar-Base SwiftUI View.
///
/// Usage:
/// ```swift
/// NavTabBarBase(
///     tabs: [
///         TabOption(value: "home", icon: "house", activeIcon: "house.fill", accessibilityLabel: "Home"),
///         TabOption(value: "search", icon: "magnifyingglass", activeIcon: "magnifyingglass", accessibilityLabel: "Search"),
///     ],
///     selectedValue: $selection,
///     onSelectionChange: { value in print(value) }
/// )
/// ```
public struct NavTabBarBase<Badge: View>: View {
    let tabs: [TabOption]
    @Binding var selectedValue: String
    var onSelectionChange: ((String) -> Void)? = nil
    let badgeContent: (String) -> Badge

    // Animation state
    @State private var dotOffset: CGFloat = 0
    @State private var glowOpacities: [String: Double] = [:]
    @State private var phase: AnimationPhase = .idle
    @State private var hasRendered = false

    // Keyboard focus (contract: interaction_keyboard_navigation)
    @FocusState private var focusedTab: String?

    // Pressed state (contract: interaction_pressable)
    @State private var pressedTab: String? = nil

    // Haptics
    private let haptic = UIImpactFeedbackGenerator(style: .light)

    /// Contract: validation_selection_constraints
    init(tabs: [TabOption], selectedValue: Binding<String>,
         onSelectionChange: ((String) -> Void)? = nil,
         @ViewBuilder badge: @escaping (String) -> Badge) {
        precondition(tabs.count >= 2,
            "Nav-TabBar-Base requires at least 2 tabs. Received: \(tabs.count).")
        self.tabs = tabs
        self._selectedValue = selectedValue
        self.onSelectionChange = onSelectionChange
        self.badgeContent = badge
    }
}

// MARK: - Convenience init (no badge)

extension NavTabBarBase where Badge == EmptyView {
    init(tabs: [TabOption], selectedValue: Binding<String>,
         onSelectionChange: ((String) -> Void)? = nil) {
        self.init(tabs: tabs, selectedValue: selectedValue,
                  onSelectionChange: onSelectionChange,
                  badge: { _ in EmptyView() })
    }
}

extension NavTabBarBase {
    public var body: some View {
        GeometryReader { geometry in
            let tabWidth = geometry.size.width / CGFloat(tabs.count)

            ZStack(alignment: .leading) {
                // Tab items
                HStack(spacing: 0) {
                    ForEach(tabs) { tab in
                        tabItem(tab, tabWidth: tabWidth, containerHeight: geometry.size.height)
                    }
                }

                // Dot indicator — positioned absolutely, animated
                Circle()
                    .fill(NavTabBarTokens.dotColor)
                    .frame(width: NavTabBarTokens.dotSize, height: NavTabBarTokens.dotSize)
                    .offset(x: dotOffset - NavTabBarTokens.dotSize / 2)
                    .frame(maxHeight: .infinity, alignment: .bottom)
                    .padding(.bottom, NavTabBarTokens.activePaddingBottom)            }
            .frame(maxWidth: .infinity)
            .background(
                LinearGradient(
                    stops: [
                        .init(color: NavTabBarTokens.containerBackground.opacity(0.80), location: 0.0),
                        .init(color: NavTabBarTokens.containerBackground.opacity(0.88), location: 0.16),
                        .init(color: NavTabBarTokens.containerBackground.opacity(0.96), location: 0.32),
                        .init(color: NavTabBarTokens.containerBackground, location: 0.48),
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            .overlay(alignment: .top) {
                Rectangle()
                    .fill(NavTabBarTokens.borderColor)
                    .frame(height: NavTabBarTokens.borderWidth)
            }
            .onAppear {
                // Contract: animation_initial_render — no animation on first render
                let index = resolvedIndex
                dotOffset = CGFloat(index) * tabWidth + tabWidth / 2
                initGlowOpacities()
                hasRendered = true
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityAddTraits(.isTabBar)
        // Contract: interaction_keyboard_navigation — arrow key navigation with wrapping
        .onMoveCommand { direction in
            guard let current = focusedTab,
                  let idx = tabs.firstIndex(where: { $0.value == current }) else { return }
            let next: Int
            switch direction {
            case .left, .up:
                next = (idx - 1 + tabs.count) % tabs.count
            case .right, .down:
                next = (idx + 1) % tabs.count
            @unknown default: return
            }
            focusedTab = tabs[next].value
        }
    }

    // MARK: - Tab Item

    /// Contracts: visual_state_colors, visual_gradient_glow, interaction_pressable,
    /// interaction_noop_active, accessibility_aria_roles, accessibility_aria_label
    private func tabItem(_ tab: TabOption, tabWidth: CGFloat, containerHeight: CGFloat) -> some View {
        let isSelected = tab.value == resolvedSelectedValue
        let isTabPressed = pressedTab == tab.value && !isSelected

        // Contract: interaction_pressable — blend.pressedLighter on inactive press
        let iconColor: Color = if isSelected {
            NavTabBarTokens.activeIconColor
        } else if isTabPressed {
            NavTabBarTokens.inactiveIconColor.pressedLighterBlend()
        } else {
            NavTabBarTokens.inactiveIconColor
        }

        return Button(action: { handleTap(tab.value, tabWidth: tabWidth) }) {
            VStack(spacing: isSelected ? NavTabBarTokens.activeItemSpacing : 0) {
                // Icon — solid (active) or outline (inactive)
                IconBase(
                    name: isSelected ? tab.activeIcon : tab.icon,
                    size: NavTabBarTokens.iconSize,
                    color: iconColor
                )
            }
            .overlay(alignment: .topTrailing) {
                // Badge composition slot (empty in v1)
                badgeContent(tab.value)
            }
            .padding(.top, isSelected ? NavTabBarTokens.activePaddingTop : NavTabBarTokens.inactivePaddingTop)
            .padding(.horizontal, NavTabBarTokens.activePaddingInline)
            .padding(.bottom, isSelected ? NavTabBarTokens.activePaddingBottom : NavTabBarTokens.inactivePaddingBottom)
            .frame(width: tabWidth, minWidth: NavTabBarTokens.minTapWidth, minHeight: NavTabBarTokens.minTabHeight)
            .contentShape(Rectangle())
        }
        .buttonStyle(TabBarButtonStyle(tabValue: tab.value, pressedTab: $pressedTab))
        .focused($focusedTab, equals: tab.value)
        .background(
            // Glow gradient (contract: visual_gradient_glow)
            glowGradient(isSelected: isSelected, tab: tab, width: tabWidth, height: containerHeight)
        )
        .accessibilityAddTraits(.isButton)
        .accessibilityRemoveTraits(isSelected ? [] : .isSelected)
        .accessibilityAddTraits(isSelected ? .isSelected : [])
        .accessibilityLabel(tab.accessibilityLabel)
    }

    // MARK: - Glow Gradient

    /// Radial glow gradient — active tab only, tighter ellipse.
    /// Contract: visual_gradient_glow
    private func glowGradient(isSelected: Bool, tab: TabOption, width: CGFloat, height: CGFloat) -> some View {
        let opacity = glowOpacities[tab.value, default: 1]
        // Ellipse: space-700 horizontal × 56% of tab height vertical
        let verticalRadius = height * 0.56
        let yScale = verticalRadius / NavTabBarTokens.glowHorizontalRadius

        return Group {
            if isSelected {
                RadialGradient(
                    gradient: Gradient(stops: [
                        .init(color: NavTabBarTokens.glowActiveCenter.opacity(opacity), location: 0.0),
                        .init(color: NavTabBarTokens.glowActiveCenter.opacity(opacity * 0.5), location: 0.4),
                        .init(color: NavTabBarTokens.glowEdgeColor.opacity(NavTabBarTokens.glowEdgeOpacity), location: 0.8),
                        .init(color: .clear, location: 1.0),
                    ]),
                    center: .center,
                    startRadius: 0,
                    endRadius: NavTabBarTokens.glowHorizontalRadius
                )
                .scaleEffect(x: 1.0, y: yScale, anchor: .center)
            } else {
                Color.clear
            }
        }
    }

    // MARK: - Selection

    /// Contract: interaction_pressable, interaction_noop_active
    private func handleTap(_ value: String, tabWidth: CGFloat) {
        guard value != resolvedSelectedValue else { return }

        let prevValue = resolvedSelectedValue
        selectedValue = value

        // Callback fires before animation (R3 callback timing)
        onSelectionChange?(value)

        // Haptic feedback (R10 AC1)
        haptic.impactOccurred()

        let targetIndex = tabs.firstIndex(where: { $0.value == value }) ?? 0
        let targetOffset = CGFloat(targetIndex) * tabWidth + tabWidth / 2

        // Contract: accessibility_reduced_motion
        if UIAccessibility.isReduceMotionEnabled {
            dotOffset = targetOffset
            updateGlowForSelection()
            return
        }

        animateSelection(from: prevValue, to: value, targetOffset: targetOffset)
    }

    // MARK: - Animation

    private enum AnimationPhase {
        case idle, departing, gliding, arriving
    }

    /// Animation choreography: dot glides immediately, depart at 8%, arrive at 50%.
    /// Contract: animation_coordination
    private func animateSelection(from prevValue: String, to newValue: String, targetOffset: CGFloat) {
        guard phase == .idle else {
            dotOffset = targetOffset
            updateGlowForSelection()
            return
        }
        phase = .gliding

        // Dot glide starts immediately
        withAnimation(Animation.timingCurve(0.0, 0.0, 0.2, 1.0, duration: NavTabBarTokens.durationGlide)) {
            dotOffset = targetOffset
        }

        // At 8%: departing tab settles down, glow dims
        DispatchQueue.main.asyncAfter(deadline: .now() + NavTabBarTokens.durationGlide * 0.08) {
            phase = .departing
            withAnimation(DesignTokens.MotionSelectionTransition.easing) {
                glowOpacities[prevValue] = 0.0
            }
        }

        // At 50%: arriving tab lifts up, glow brightens
        DispatchQueue.main.asyncAfter(deadline: .now() + NavTabBarTokens.durationGlide * 0.5) {
            phase = .arriving
            withAnimation(DesignTokens.MotionSelectionTransition.easing) {
                glowOpacities[newValue] = 1.0
            }

            // Cleanup
            DispatchQueue.main.asyncAfter(deadline: .now() + NavTabBarTokens.durationShort) {
                phase = .idle
            }
        }
    }

    // MARK: - Helpers

    private var resolvedSelectedValue: String {
        tabs.contains(where: { $0.value == selectedValue }) ? selectedValue : tabs.first?.value ?? ""
    }

    private var resolvedIndex: Int {
        tabs.firstIndex(where: { $0.value == resolvedSelectedValue }) ?? 0
    }

    private func initGlowOpacities() {
        for tab in tabs {
            glowOpacities[tab.value] = 1.0
        }
    }

    private func updateGlowForSelection() {
        for tab in tabs {
            glowOpacities[tab.value] = 1.0
        }
    }
}

// MARK: - TabBarButtonStyle

/// Custom ButtonStyle that tracks pressed state per tab for blend.pressedLighter.
/// Contract: interaction_pressable
private struct TabBarButtonStyle: ButtonStyle {
    let tabValue: String
    @Binding var pressedTab: String?

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .onChange(of: configuration.isPressed) { newValue in
                pressedTab = newValue ? tabValue : nil
            }
    }
}
