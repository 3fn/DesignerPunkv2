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

    // Icons (contract: visual_state_colors)
    static let activeIconColor: Color = Color(DesignTokens.colorActionNavigation)
    static let inactiveIconColor: Color = Color(DesignTokens.colorIconNavigationInactive)

    // Dot (contract: visual_state_colors)
    static let dotSize: CGFloat = DesignTokens.space050
    static let dotColor: Color = Color(DesignTokens.colorActionNavigation)

    // Glow gradient (contract: visual_gradient_glow)
    static let glowActiveCenter: Color = Color(DesignTokens.colorBackgroundPrimarySubtle)
    static let glowInactiveCenter: Color = Color(DesignTokens.colorStructureCanvas)
    static let glowEdgeColor: Color = Color(DesignTokens.colorStructureCanvas)
    static let glowEdgeOpacity: Double = DesignTokens.opacity024

    // Spacing (contract: layout_flexible_length)
    static let activePaddingTop: CGFloat = DesignTokens.space150
    static let activePaddingInline: CGFloat = DesignTokens.space150
    static let activePaddingBottom: CGFloat = DesignTokens.space050
    static let activeItemSpacing: CGFloat = DesignTokens.spaceGroupedMinimal
    static let inactivePaddingTop: CGFloat = DesignTokens.space200
    static let inactivePaddingInline: CGFloat = DesignTokens.space150
    static let inactivePaddingBottom: CGFloat = DesignTokens.space100
    static let minTapWidth: CGFloat = DesignTokens.tapAreaMinimum

    // Motion
    static let durationShort: Double = DesignTokens.duration150 / 1000.0
    static let durationGlide: Double = DesignTokens.duration350 / 1000.0
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
public struct NavTabBarBase: View {
    let tabs: [TabOption]
    @Binding var selectedValue: String
    var onSelectionChange: ((String) -> Void)? = nil

    // Animation state
    @State private var dotOffset: CGFloat = 0
    @State private var glowOpacities: [String: Double] = [:]
    @State private var phase: AnimationPhase = .idle
    @State private var hasRendered = false

    // Keyboard focus (contract: interaction_keyboard_navigation)
    @FocusState private var focusedTab: String?

    // Haptics
    private let haptic = UIImpactFeedbackGenerator(style: .light)

    /// Contract: validation_selection_constraints
    init(tabs: [TabOption], selectedValue: Binding<String>,
         onSelectionChange: ((String) -> Void)? = nil) {
        precondition(tabs.count >= 2,
            "Nav-TabBar-Base requires at least 2 tabs. Received: \(tabs.count).")
        self.tabs = tabs
        self._selectedValue = selectedValue
        self.onSelectionChange = onSelectionChange
    }

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
                    .padding(.bottom, NavTabBarTokens.activePaddingBottom)
            }
            .frame(maxWidth: .infinity)
            .background(NavTabBarTokens.containerBackground)
            .overlay(alignment: .top) {
                Rectangle()
                    .fill(NavTabBarTokens.borderColor)
                    .frame(height: 1)
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

        return Button(action: { handleTap(tab.value, tabWidth: tabWidth) }) {
            VStack(spacing: isSelected ? NavTabBarTokens.activeItemSpacing : 0) {
                // Icon — solid (active) or outline (inactive)
                Image(systemName: isSelected ? tab.activeIcon : tab.icon)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 24, height: 24)
                    .foregroundColor(isSelected ? NavTabBarTokens.activeIconColor : NavTabBarTokens.inactiveIconColor)
            }
            .padding(.top, isSelected ? NavTabBarTokens.activePaddingTop : NavTabBarTokens.inactivePaddingTop)
            .padding(.horizontal, NavTabBarTokens.activePaddingInline)
            .padding(.bottom, isSelected ? NavTabBarTokens.activePaddingBottom : NavTabBarTokens.inactivePaddingBottom)
            .frame(width: tabWidth, minWidth: NavTabBarTokens.minTapWidth)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
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

    /// Elliptical radial gradient — 88% radii, three stops.
    /// Contract: visual_gradient_glow
    private func glowGradient(isSelected: Bool, tab: TabOption, width: CGFloat, height: CGFloat) -> some View {
        let center = isSelected ? NavTabBarTokens.glowActiveCenter : NavTabBarTokens.glowInactiveCenter
        let opacity = glowOpacities[tab.value] ?? (isSelected ? 1.0 : 1.0)

        return RadialGradient(
            gradient: Gradient(stops: [
                .init(color: center.opacity(opacity), location: 0.0),
                .init(color: NavTabBarTokens.glowEdgeColor.opacity(NavTabBarTokens.glowEdgeOpacity), location: 0.88),
                .init(color: .clear, location: 1.0),
            ]),
            center: .center,
            startRadius: 0,
            endRadius: min(width, height) * 0.88
        )
        .clipped(antialiased: false) // Allow bleed via ZStack — no per-tab clipping
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

    /// Three-phase animation choreography.
    /// Contract: animation_coordination
    private func animateSelection(from prevValue: String, to newValue: String, targetOffset: CGFloat) {
        guard phase == .idle else {
            // Re-entrant: snap
            dotOffset = targetOffset
            updateGlowForSelection()
            return
        }
        phase = .departing

        // Phase 1: Depart — dim departing glow
        withAnimation(.easeIn(duration: NavTabBarTokens.durationShort)) {
            glowOpacities[prevValue] = 0.0
        }

        // Phase 2: Glide — dot moves to new tab
        DispatchQueue.main.asyncAfter(deadline: .now() + NavTabBarTokens.durationShort) {
            phase = .gliding
            withAnimation(Animation.timingCurve(0.0, 0.0, 0.2, 1.0, duration: NavTabBarTokens.durationGlide)) {
                dotOffset = targetOffset
            }

            // Phase 3: Arrive (~80% through glide) — brighten arriving glow
            DispatchQueue.main.asyncAfter(deadline: .now() + NavTabBarTokens.durationGlide * 0.8) {
                phase = .arriving
                withAnimation(.easeOut(duration: NavTabBarTokens.durationShort)) {
                    glowOpacities[newValue] = 1.0
                }

                // Cleanup
                DispatchQueue.main.asyncAfter(deadline: .now() + NavTabBarTokens.durationShort) {
                    phase = .idle
                }
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
