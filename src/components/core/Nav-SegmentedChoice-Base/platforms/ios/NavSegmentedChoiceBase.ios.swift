/**
 * Nav-SegmentedChoice-Base — iOS Implementation
 *
 * Navigation control for switching between mutually exclusive content views.
 * SwiftUI View with tablist/tab accessibility semantics.
 *
 * Stemma System: Navigation Family, Primitive (Base)
 *
 * @module Nav-SegmentedChoice-Base/platforms/ios
 * @see .kiro/specs/049-nav-segmentedchoice-base/design-outline.md
 * @see Requirements: 1.1–1.5, 3.1–3.7, 7.1–7.3, 9.1–9.8, 10.2
 */

import SwiftUI

// MARK: - Tokens

/// Component token references for Nav-SegmentedChoice-Base.
/// Maps to generated DesignTokens values.
///
/// Contracts: visual_background, visual_border, visual_shadow, visual_state_colors
enum NavSegmentedChoiceTokens {
    // Container (contract: visual_background, visual_border)
    static let containerBackground: Color = Color(DesignTokens.colorStructureSurface)
    static let containerBorderColor: Color = Color(DesignTokens.colorStructureBorder)
    static let containerBorderWidth: CGFloat = DesignTokens.borderDefault
    static let containerRadius: CGFloat = DesignTokens.radiusNormal
    static let containerPadding: CGFloat = DesignTokens.space050

    // Indicator (contract: visual_shadow, visual_state_colors)
    static let indicatorBackground: Color = Color(DesignTokens.colorStructureCanvas)
    static let indicatorRadius: CGFloat = DesignTokens.radiusSmall
    static let indicatorShadow = DesignTokens.shadowNavigationIndicator

    // Segments (contract: visual_state_colors, layout_flexible_length)
    static let segmentColor: Color = Color(DesignTokens.colorActionNavigation)
    static let segmentRadius: CGFloat = DesignTokens.radiusSmall
    static let fontWeight: UIFont.Weight = DesignTokens.fontWeight700
    static let minSegmentWidth: CGFloat = DesignTokens.tapAreaMinimum
}

/// Size-specific tokens.
/// Contract: visual_size_variants
enum NavSegmentedChoiceSize: String, CaseIterable {
    case standard
    case condensed

    var blockPadding: CGFloat {
        switch self {
        case .standard: return DesignTokens.space150
        case .condensed: return DesignTokens.space100
        }
    }

    var inlinePadding: CGFloat {
        switch self {
        case .standard: return DesignTokens.space200
        case .condensed: return DesignTokens.space150
        }
    }

    var fontSize: CGFloat {
        switch self {
        case .standard: return DesignTokens.fontSize125
        case .condensed: return DesignTokens.fontSize100
        }
    }

    var lineHeight: CGFloat {
        switch self {
        case .standard: return DesignTokens.lineHeight125
        case .condensed: return DesignTokens.lineHeight100
        }
    }

    var iconSize: CGFloat {
        switch self {
        case .standard: return 28
        case .condensed: return 24
        }
    }
}

// MARK: - Segment Option

/// A segment is either text or icon, never both.
enum SegmentOption: Identifiable {
    case text(value: String, label: String)
    case icon(value: String, icon: String, accessibilityLabel: String)

    var id: String { value }

    var value: String {
        switch self {
        case .text(let value, _): return value
        case .icon(let value, _, _): return value
        }
    }
}

// MARK: - Animation Phase

/// Tracks the four-phase indicator animation.
/// Contract: animation_coordination
private enum AnimationPhase {
    case idle
    case shadowOut
    case glide
    case shadowIn
}

// MARK: - View

/// Nav-SegmentedChoice-Base SwiftUI View.
///
/// Usage:
/// ```swift
/// NavSegmentedChoiceBase(
///     segments: [.text(value: "daily", label: "Daily"), .text(value: "weekly", label: "Weekly")],
///     selectedValue: $selection,
///     onSelectionChange: { value in print(value) },
///     size: .standard
/// )
/// ```
public struct NavSegmentedChoiceBase: View {
    let segments: [SegmentOption]
    @Binding var selectedValue: String
    var onSelectionChange: ((String) -> Void)? = nil
    var size: NavSegmentedChoiceSize = .standard
    var componentId: String? = nil

    // Animation state (contract: animation_coordination, animation_initial_render)
    @State private var indicatorOffset: CGFloat = 0
    @State private var indicatorWidth: CGFloat = 0
    @State private var shadowOpacity: Double = 1.0
    @State private var phase: AnimationPhase = .idle
    @State private var hasRendered = false

    // Keyboard focus (contract: interaction_keyboard_navigation, interaction_roving_tabindex)
    @FocusState private var focusedSegment: String?

    /// Contract: validation_selection_constraints
    init(segments: [SegmentOption], selectedValue: Binding<String>,
         onSelectionChange: ((String) -> Void)? = nil,
         size: NavSegmentedChoiceSize = .standard, componentId: String? = nil) {
        precondition(segments.count >= 2,
            "Nav-SegmentedChoice-Base requires at least 2 segments. Received: \(segments.count).")
        self.segments = segments
        self._selectedValue = selectedValue
        self.onSelectionChange = onSelectionChange
        self.size = size
        self.componentId = componentId
    }

    public var body: some View {
        GeometryReader { geometry in
            let segmentWidth = geometry.size.width / CGFloat(segments.count)

            ZStack(alignment: .leading) {
                // Indicator (contract: visual_shadow, visual_state_colors)
                indicator

                // Segments
                HStack(spacing: 0) {
                    ForEach(segments) { segment in
                        segmentButton(segment, segmentWidth: segmentWidth)
                    }
                }
            }
            .padding(NavSegmentedChoiceTokens.containerPadding)
            .background(NavSegmentedChoiceTokens.containerBackground)
            .clipShape(RoundedRectangle(cornerRadius: NavSegmentedChoiceTokens.containerRadius))
            .overlay(
                RoundedRectangle(cornerRadius: NavSegmentedChoiceTokens.containerRadius)
                    .stroke(NavSegmentedChoiceTokens.containerBorderColor,
                            lineWidth: NavSegmentedChoiceTokens.containerBorderWidth)
            )
            .onAppear {
                // Contract: animation_initial_render — position without animation on first render
                let index = selectedIndex
                indicatorOffset = CGFloat(index) * segmentWidth
                indicatorWidth = segmentWidth
                hasRendered = true
            }
        }
        .frame(height: intrinsicHeight)
        // Contract: interaction_keyboard_navigation — arrow key navigation with wrapping
        .onMoveCommand { direction in
            guard let current = focusedSegment,
                  let idx = segments.firstIndex(where: { $0.value == current }) else { return }
            let next: Int
            switch direction {
            case .left, .up:
                next = (idx - 1 + segments.count) % segments.count
            case .right, .down:
                next = (idx + 1) % segments.count
            @unknown default: return
            }
            focusedSegment = segments[next].value
        }
    }

    // MARK: - Indicator

    private var indicator: some View {
        let shadow = NavSegmentedChoiceTokens.indicatorShadow
        return RoundedRectangle(cornerRadius: NavSegmentedChoiceTokens.indicatorRadius)
            .fill(NavSegmentedChoiceTokens.indicatorBackground)
            .shadow(
                color: Color.black.opacity(shadow.opacity * shadowOpacity),
                radius: shadow.blur / 2,
                x: shadow.offsetX,
                y: shadow.offsetY
            )
            .frame(width: indicatorWidth, height: segmentHeight)
            .offset(x: indicatorOffset)
    }

    // MARK: - Segment Button

    /// Contracts: interaction_pressable, interaction_noop_active, content_displays_label,
    /// content_supports_icon, accessibility_aria_roles, accessibility_alt_text,
    /// accessibility_aria_controls, interaction_roving_tabindex
    private func segmentButton(_ segment: SegmentOption, segmentWidth: CGFloat) -> some View {
        let isSelected = segment.value == resolvedSelectedValue

        return Button(action: { handleTap(segment.value, segmentWidth: segmentWidth) }) {
            segmentContent(segment)
                .frame(width: segmentWidth, minHeight: segmentHeight)
        }
        .buttonStyle(.plain)
        .focused($focusedSegment, equals: segment.value)
        // Contract: accessibility_aria_roles — tab semantics
        .accessibilityAddTraits(.isButton)
        .accessibilityRemoveTraits(isSelected ? [] : .isSelected)
        .accessibilityAddTraits(isSelected ? .isSelected : [])
        // Contract: accessibility_alt_text — icon segments use accessibilityLabel
        .accessibilityLabel(segmentAccessibilityLabel(segment))
        // Contract: accessibility_aria_controls — panel association
        .accessibilityIdentifier(panelIdentifier(for: segment))
    }

    @ViewBuilder
    private func segmentContent(_ segment: SegmentOption) -> some View {
        switch segment {
        case .text(_, let label):
            Text(label)
                .font(.system(size: size.fontSize, weight: .bold))
                .lineSpacing(size.fontSize * (size.lineHeight - 1))
                .foregroundColor(NavSegmentedChoiceTokens.segmentColor)
                .padding(.vertical, size.blockPadding)
                .padding(.horizontal, size.inlinePadding)

        case .icon(_, let icon, _):
            Image(systemName: icon)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: size.iconSize, height: size.iconSize)
                .foregroundColor(NavSegmentedChoiceTokens.segmentColor)
                .padding(.vertical, size.blockPadding)
                .padding(.horizontal, size.inlinePadding)
        }
    }

    // MARK: - Selection

    /// Contract: interaction_pressable, interaction_noop_active
    private func handleTap(_ value: String, segmentWidth: CGFloat) {
        // No-op on active segment (contract: interaction_noop_active)
        guard value != resolvedSelectedValue else { return }

        selectedValue = value
        onSelectionChange?(value)

        let targetIndex = segments.firstIndex(where: { $0.value == value }) ?? 0
        let targetOffset = CGFloat(targetIndex) * segmentWidth

        // Contract: accessibility_reduced_motion
        if UIAccessibility.isReduceMotionEnabled {
            indicatorOffset = targetOffset
            indicatorWidth = segmentWidth
            return
        }

        animateIndicator(to: targetOffset, width: segmentWidth)
    }

    // MARK: - Animation

    /// Four-phase indicator animation choreography.
    /// Contract: animation_coordination
    ///
    /// Phase 1: Shadow out (duration150 + easingAccelerate)
    /// Phase 2+3: Resize + Glide simultaneous (duration150 easingStandard / duration350 easingGlideDecelerate)
    /// Phase 4: Shadow in (duration150 + easingDecelerate)
    private func animateIndicator(to targetOffset: CGFloat, width targetWidth: CGFloat) {
        guard phase == .idle else {
            // Re-entrant: snap to target
            indicatorOffset = targetOffset
            indicatorWidth = targetWidth
            shadowOpacity = 1.0
            phase = .idle
            return
        }

        let d150 = DesignTokens.Duration.duration150
        let d350 = DesignTokens.Duration.duration350

        // Phase 1: Shadow out
        phase = .shadowOut
        withAnimation(DesignTokens.Easing.easingAccelerate.speed(1.0 / d150)) {
            shadowOpacity = 0
        }

        // Phase 2+3: Resize + Glide (after shadow out completes)
        DispatchQueue.main.asyncAfter(deadline: .now() + d150) {
            phase = .glide
            withAnimation(DesignTokens.Easing.easingStandard.speed(1.0 / d150)) {
                indicatorWidth = targetWidth
            }
            withAnimation(DesignTokens.Easing.easingGlideDecelerate) {
                indicatorOffset = targetOffset
            }

            // Phase 4: Shadow in (after glide completes)
            DispatchQueue.main.asyncAfter(deadline: .now() + d350) {
                phase = .shadowIn
                withAnimation(DesignTokens.Easing.easingDecelerate.speed(1.0 / d150)) {
                    shadowOpacity = 1.0
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + d150) {
                    phase = .idle
                }
            }
        }
    }

    // MARK: - Accessibility Helpers

    /// Contract: accessibility_alt_text
    private func segmentAccessibilityLabel(_ segment: SegmentOption) -> String {
        switch segment {
        case .text(_, let label): return label
        case .icon(_, _, let accessibilityLabel): return accessibilityLabel
        }
    }

    /// Contract: accessibility_aria_controls
    private func panelIdentifier(for segment: SegmentOption) -> String {
        guard let id = componentId else { return segment.value }
        return "\(id)-panel-\(segment.value)"
    }

    // MARK: - Layout Helpers

    private var selectedIndex: Int {
        segments.firstIndex(where: { $0.value == resolvedSelectedValue }) ?? 0
    }

    /// Contract: content_displays_fallback
    private var resolvedSelectedValue: String {
        if segments.contains(where: { $0.value == selectedValue }) {
            return selectedValue
        }
        return segments.first?.value ?? ""
    }

    private var segmentHeight: CGFloat {
        size.fontSize * size.lineHeight
    }

    private var intrinsicHeight: CGFloat {
        segmentHeight + (size.blockPadding * 2) + (NavSegmentedChoiceTokens.containerPadding * 2)
    }
}
