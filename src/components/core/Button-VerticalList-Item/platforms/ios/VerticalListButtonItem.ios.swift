/**
 * Button-VerticalListItem Component for iOS Platform
 * 
 * Stemma System: Buttons Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type] = Button-VerticalListItem
 * 
 * A "dumb" presentational component that renders visual states based on props
 * received from a parent container. Handles no selection logic internally —
 * all state management is delegated to the parent pattern.
 * 
 * Supports three usage modes through its visualState prop:
 * - Tap Mode: Simple action buttons (rest state only)
 * - Select Mode: Single-selection radio-style behavior (rest, selected, notSelected)
 * - Multi-Select Mode: Checkbox-style behavior (checked, unchecked)
 * 
 * Part of the DesignerPunk Button System infrastructure.
 * 
 * @module Button-VerticalListItem/platforms/ios
 * @see Requirements: 1.1-1.5, 2.1-2.5, 3.1-3.4, 4.1-4.7, 5.1-5.4, 6.1-6.3, 7.1-7.5
 * @see Requirements: 10.5, 10.7, 11.4, 11.6, 12.1-12.3, 13.1-13.6
 */

import SwiftUI

// MARK: - HapticFeedbackType

/**
 * Types of haptic feedback that can be delegated to the parent pattern.
 * 
 * The Button-VerticalListItem component delegates haptic feedback to the parent
 * pattern rather than triggering it directly. This allows the parent to:
 * - Customize haptic intensity based on context
 * - Coordinate haptics across multiple items
 * - Disable haptics when appropriate (e.g., accessibility settings)
 * 
 * Requirements: 13.4 - Support haptic feedback delegation to parent pattern
 */
public enum HapticFeedbackType {
    /// Standard tap/click feedback
    case tap
    
    /// Selection feedback (item selected)
    case selection
    
    /// Deselection feedback (item deselected)
    case deselection
    
    /// Error feedback (validation error)
    case error
}

// MARK: - VerticalListButtonItem

/**
 * Button-VerticalListItem for iOS platform.
 * 
 * Renders a vertical list button item with visual states controlled by props.
 * Uses SwiftUI's native patterns for accessibility, RTL support, and animations.
 * 
 * Key Features:
 * - Visual state rendering based on props (rest, selected, notSelected, checked, unchecked)
 * - Error state overlay with mode-specific treatment
 * - Padding compensation for height stability (48pt constant height)
 * - Selection indicator (checkmark) with fade/instant transitions
 * - VoiceOver accessibility support
 * - Automatic RTL layout adaptation
 * - Smooth animations using motion.selectionTransition timing
 * - Event callbacks (onClick, onFocus, onBlur)
 * - Haptic feedback delegation to parent pattern
 * 
 * Usage:
 * ```swift
 * // Basic usage in Tap mode
 * VerticalListButtonItem(
 *     label: "Settings",
 *     visualState: .rest,
 *     onClick: { print("Tapped") }
 * )
 * 
 * // Select mode with selection indicator
 * VerticalListButtonItem(
 *     label: "Option A",
 *     description: "First option",
 *     visualState: .selected,
 *     onClick: { print("Selected") }
 * )
 * 
 * // Multi-Select mode with leading icon
 * VerticalListButtonItem(
 *     label: "Enable notifications",
 *     leadingIcon: "bell",
 *     visualState: .checked,
 *     onClick: { print("Toggled") }
 * )
 * 
 * // With error state
 * VerticalListButtonItem(
 *     label: "Required selection",
 *     visualState: .notSelected,
 *     error: true,
 *     onClick: { print("Error state") }
 * )
 * 
 * // With haptic feedback delegation
 * VerticalListButtonItem(
 *     label: "Option",
 *     visualState: .rest,
 *     onClick: { /* handle selection */ },
 *     onHapticFeedback: { feedbackType in
 *         // Parent pattern triggers appropriate haptic
 *         UIImpactFeedbackGenerator(style: .light).impactOccurred()
 *     }
 * )
 * 
 * // With focus/blur callbacks
 * VerticalListButtonItem(
 *     label: "Focusable Option",
 *     visualState: .rest,
 *     onClick: { print("Clicked") },
 *     onFocus: { print("Received focus") },
 *     onBlur: { print("Lost focus") }
 * )
 * ```
 * 
 * Requirements:
 * - 1.1-1.5: Visual state rendering (rest, selected, notSelected, checked, unchecked)
 * - 2.1-2.5: Selection indicator display and styling
 * - 3.1-3.4: Error state rendering with mode-specific treatment
 * - 4.1-4.7: Content layout (label, description, icons, spacing)
 * - 5.1-5.4: Sizing and touch targets (48pt minimum height)
 * - 6.1-6.3: Height stability with padding compensation
 * - 7.1-7.5: Animation and transitions
 * - 10.5, 10.7: VoiceOver accessibility
 * - 11.4, 11.6: RTL support via SwiftUI's automatic layout
 * - 12.1-12.3: Event handling (onClick, onFocus, onBlur)
 * - 13.1-13.6: Platform-specific rendering (SwiftUI patterns, haptic delegation)
 */
public struct VerticalListButtonItem: View {
    // MARK: - Properties
    
    /// Primary button text (required)
    /// Requirements: 4.1 - Always display label with typography.buttonMd
    public let label: String
    
    /// Secondary explanatory text (optional)
    /// Requirements: 4.2, 4.3 - Display below label with typography.bodySm, color.text.muted
    public var description: String?
    
    /// Icon name for leading icon (optional)
    /// Requirements: 4.4, 4.5, 9.1 - Display on far left with iconBaseSizes.size100 (24pt)
    public var leadingIcon: String?
    
    /// Current visual state controlled by parent
    /// Requirements: 1.1-1.5 - Determines appearance (background, border, text colors)
    public let visualState: VisualState
    
    /// Whether error styling should be applied
    /// Requirements: 3.1-3.4 - Mode-specific error treatment
    public var error: Bool = false
    
    /// How checkmark should animate when hiding
    /// Requirements: 7.3, 7.4 - Fade or instant transition
    public var checkmarkTransition: CheckmarkTransition = .fade
    
    /// Delay before transition starts (seconds)
    /// Requirements: 7.5 - Enable staggered animations from parent pattern
    public var transitionDelay: Double = 0
    
    /// Callback when button is clicked
    /// Requirements: 12.1 - Emit click event to parent
    public var onClick: (() -> Void)?
    
    /// Callback when button receives focus
    /// Requirements: 12.2 - Emit focus event to parent
    public var onFocus: (() -> Void)?
    
    /// Callback when button loses focus
    /// Requirements: 12.3 - Emit blur event to parent
    public var onBlur: (() -> Void)?
    
    /// Callback for haptic feedback delegation to parent pattern
    /// Requirements: 13.4 - Support haptic feedback delegation
    /// The parent pattern is responsible for triggering haptic feedback
    /// based on the interaction type (selection, deselection, error, etc.)
    /// 
    /// Usage:
    /// ```swift
    /// VerticalListButtonItem(
    ///     label: "Option",
    ///     visualState: .rest,
    ///     onClick: { /* handle selection */ },
    ///     onHapticFeedback: { feedbackType in
    ///         // Parent pattern triggers appropriate haptic
    ///         switch feedbackType {
    ///         case .selection:
    ///             UIImpactFeedbackGenerator(style: .light).impactOccurred()
    ///         case .error:
    ///             UINotificationFeedbackGenerator().notificationOccurred(.error)
    ///         }
    ///     }
    /// )
    /// ```
    public var onHapticFeedback: ((HapticFeedbackType) -> Void)?
    
    /// Optional test ID for automated testing
    /// Maps to accessibilityIdentifier on iOS
    public var testID: String?
    
    // MARK: - Environment
    
    /// Layout direction for RTL support
    /// Requirements: 11.4, 11.6 - Automatic RTL layout adaptation
    /// 
    /// SwiftUI automatically handles RTL layout mirroring:
    /// - HStack reverses child order in RTL context
    /// - Leading icon appears on the right (start of reading direction)
    /// - Checkmark appears on the left (end of reading direction)
    /// - Content flows from right to left
    /// 
    /// This environment variable is available for custom RTL behavior if needed,
    /// but the component relies on SwiftUI's automatic layout mirroring.
    @Environment(\.layoutDirection) private var layoutDirection
    
    // MARK: - State
    
    /// Track focus state for onFocus/onBlur callbacks
    /// Requirements: 12.2, 12.3 - Emit focus/blur events to parent
    /// Uses SwiftUI's @FocusState for native focus tracking
    @FocusState private var isFocused: Bool
    
    /// Track pressed state for visual feedback
    @State private var isPressed: Bool = false
    
    /// Track checkmark visibility for animation
    /// Requirements: 7.2, 7.3, 7.4 - Checkmark fade-in/fade-out
    @State private var checkmarkOpacity: Double = 0
    
    /// Track whether initial appearance has occurred
    /// Used to prevent animation on initial render
    @State private var hasAppeared: Bool = false
    
    /// Track previous focus state for detecting focus changes
    @State private var previousFocusState: Bool = false
    
    // MARK: - Computed Properties
    
    /// Computed styles based on visual state and error
    /// Requirements: 1.1-1.5, 3.1-3.4
    private var styles: VisualStateStyles {
        return computeStyles(visualState: visualState, error: error)
    }
    
    /// Padding compensation for border width changes
    /// Requirements: 6.1, 6.2, 6.3 - Maintain constant 48pt height
    /// - 11pt padding for 1pt border (rest, notSelected, checked, unchecked)
    /// - 10pt padding for 2pt border (selected, or error in Select mode)
    private var paddingBlock: CGFloat {
        return calculatePaddingBlock(for: visualState, error: error)
    }
    
    /// Animation timing for state transitions
    /// Requirements: 7.1, 13.3 - Use motion.selectionTransition (250ms, standard easing)
    /// The animation is applied with the transitionDelay prop for staggered animations
    private var stateAnimation: Animation {
        return Animation
            .easeInOut(duration: DesignTokens.motionSelectionTransitionDuration)
            .delay(transitionDelay)
    }
    
    /// Animation timing for checkmark transitions
    /// Requirements: 7.2, 7.3 - Checkmark fade-in/fade-out using motion.selectionTransition
    private var checkmarkAnimation: Animation {
        return Animation
            .easeInOut(duration: DesignTokens.motionSelectionTransitionDuration)
            .delay(transitionDelay)
    }
    
    /// Accessibility state description for VoiceOver
    /// Requirements: 10.5, 10.7
    private var accessibilityStateDescription: String {
        return visualState.accessibilityStateDescription
    }
    
    /// Accessibility hint for VoiceOver (includes description if provided)
    /// Requirements: 10.3, 10.5 - Screen readers announce label and current state
    /// The hint provides additional context from the description prop
    private var accessibilityHintText: String? {
        return description
    }
    
    // MARK: - Body
    
    public var body: some View {
        Button(action: handleClick) {
            buttonContent
        }
        .buttonStyle(VerticalListButtonItemStyle(
            styles: styles,
            paddingBlock: paddingBlock,
            isPressed: isPressed,
            stateAnimation: stateAnimation
        ))
        // Enable focus tracking for onFocus/onBlur callbacks
        // Requirements: 12.2, 12.3
        .focused($isFocused)
        // Animate all visual state changes together
        // Requirements: 7.1 - Animate background, border, padding, colors using motion.selectionTransition
        .animation(stateAnimation, value: visualState)
        .animation(stateAnimation, value: error)
        .animation(stateAnimation, value: paddingBlock)
        .accessibilityLabel(label)
        .accessibilityValue(accessibilityStateDescription)
        .accessibilityAddTraits(.isButton)
        .accessibilityHint(accessibilityHintText ?? "")
        .accessibilityIdentifier(testID ?? "")
        .onAppear {
            // Initialize checkmark opacity based on initial state
            // No animation on initial appearance
            checkmarkOpacity = styles.checkmarkVisible ? 1 : 0
            hasAppeared = true
            previousFocusState = isFocused
        }
        .onChange(of: isFocused) { newValue in
            // Handle focus state changes
            // Requirements: 12.2, 12.3 - Emit focus/blur events to parent
            handleFocusChange(newValue: newValue)
        }
        .onChange(of: styles.checkmarkVisible) { newValue in
            // Only animate after initial appearance
            guard hasAppeared else {
                checkmarkOpacity = newValue ? 1 : 0
                return
            }
            
            // Animate checkmark visibility changes
            // Requirements: 7.2, 7.3, 7.4 - Checkmark fade-in/fade-out
            if newValue {
                // Always fade in when becoming visible
                // Requirements: 7.2 - Fade in using motion.selectionTransition
                withAnimation(checkmarkAnimation) {
                    checkmarkOpacity = 1
                }
            } else {
                // Fade out or instant based on checkmarkTransition prop
                if checkmarkTransition == .fade {
                    // Requirements: 7.3 - Fade out using motion.selectionTransition
                    withAnimation(checkmarkAnimation) {
                        checkmarkOpacity = 0
                    }
                } else {
                    // Requirements: 7.4 - Hide immediately without animation
                    checkmarkOpacity = 0
                }
            }
        }
    }
    
    // MARK: - Button Content
    
    /// Main button content layout
    /// Requirements: 4.1-4.7 - Content layout with label, description, icons, spacing
    @ViewBuilder
    private var buttonContent: some View {
        HStack(spacing: DesignTokens.spaceGroupedLoose) {
            // Leading icon (optional)
            // Requirements: 4.4, 4.5, 9.1
            if let iconName = leadingIcon {
                leadingIconView(name: iconName)
            }
            
            // Content (label + description)
            // Requirements: 4.1, 4.2, 4.3
            contentStack
            
            // Selection indicator (checkmark)
            // Requirements: 2.1-2.5, 9.2
            if styles.checkmarkVisible || checkmarkOpacity > 0 {
                checkmarkView
            }
        }
    }
    
    /// Leading icon view
    /// Requirements: 4.4, 4.5, 9.1 - Icon with label color and optical balance
    /// Requirements: 7.1 - Animate icon color changes
    /// Uses IconBase component for consistent icon rendering across the design system
    @ViewBuilder
    private func leadingIconView(name: String) -> some View {
        IconBase(
            name: name,
            size: DesignTokens.iconSize100,
            color: styles.iconColor,
            opticalBalance: true,  // Requirements: 4.5 - Apply optical balance blend
            testID: testID.map { "\($0)-leading-icon" }
        )
        .animation(stateAnimation, value: styles.iconColor)
    }
    
    /// Content stack with label and optional description
    /// Requirements: 4.1, 4.2, 4.3
    /// Requirements: 7.1 - Animate text color changes
    @ViewBuilder
    private var contentStack: some View {
        VStack(alignment: .leading, spacing: 2) {
            // Label - always present
            // Requirements: 4.1 - typography.buttonMd styling
            Text(label)
                .font(.system(size: DesignTokens.typographyButtonMd.fontSize, weight: .medium))
                .foregroundColor(styles.labelColor)
                .lineLimit(1)
                .truncationMode(.tail)
                .animation(stateAnimation, value: styles.labelColor)
            
            // Description - optional
            // Requirements: 4.2, 4.3 - typography.bodySm, color.text.muted
            if let desc = description {
                Text(desc)
                    .font(.system(size: DesignTokens.typographyBodySm.fontSize, weight: .regular))
                    .foregroundColor(Color(DesignTokens.colorTextMuted))
                    .lineLimit(nil)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
    
    /// Checkmark selection indicator
    /// Requirements: 2.1-2.5, 9.2 - Checkmark with state-appropriate color
    /// Requirements: 7.2, 7.3, 7.4 - Checkmark fade-in/fade-out animation
    /// Uses IconBase component for consistent icon rendering across the design system
    @ViewBuilder
    private var checkmarkView: some View {
        IconBase(
            name: "check",
            size: DesignTokens.iconSize100,
            color: styles.iconColor,
            opticalBalance: true,  // Requirements: 2.3, 2.4 - Apply optical balance blend
            testID: testID.map { "\($0)-checkmark" }
        )
        .opacity(checkmarkOpacity)
        // Transition for smooth appearance/disappearance
        .transition(.opacity.animation(checkmarkAnimation))
        .accessibilityHidden(true) // Requirements: 2.5 - Decorative, aria-hidden
    }
    
    // MARK: - Event Handlers
    
    /// Handle button click
    /// Requirements: 12.1 - Emit click event to parent
    /// Requirements: 13.4 - Support haptic feedback delegation
    private func handleClick() {
        // Notify parent pattern about haptic feedback opportunity
        // The parent decides whether and how to trigger haptics
        onHapticFeedback?(.tap)
        
        // Call the onClick callback
        onClick?()
    }
    
    /// Handle focus state changes
    /// Requirements: 12.2, 12.3 - Emit focus/blur events to parent
    private func handleFocusChange(newValue: Bool) {
        // Only trigger callbacks if focus state actually changed
        guard newValue != previousFocusState else { return }
        previousFocusState = newValue
        
        if newValue {
            // Button received focus
            // Requirements: 12.2
            onFocus?()
        } else {
            // Button lost focus
            // Requirements: 12.3
            onBlur?()
        }
    }
}

// MARK: - VerticalListButtonItemStyle

/**
 * Custom button style for VerticalListButtonItem.
 * 
 * Handles visual styling including:
 * - Background color based on visual state
 * - Border rendering using strokeBorder (inside view bounds)
 * - Padding compensation for height stability
 * - Pressed state overlay
 * - Smooth animations for all visual properties
 * 
 * Requirements:
 * - 5.1-5.4: Sizing and touch targets
 * - 6.1-6.3: Height stability with padding compensation
 * - 7.1: Animation of background, border, padding, colors together
 * - 8.1, 8.2: Hover/pressed overlays
 * - 13.2, 13.6: strokeBorder for border rendering inside view bounds
 */
struct VerticalListButtonItemStyle: ButtonStyle {
    let styles: VisualStateStyles
    let paddingBlock: CGFloat
    let isPressed: Bool
    let stateAnimation: Animation
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(.vertical, paddingBlock)
            .padding(.horizontal, DesignTokens.spaceInset200)
            .frame(maxWidth: .infinity)
            .frame(minHeight: DesignTokens.tapAreaRecommended)
            .background(
                RoundedRectangle(cornerRadius: DesignTokens.radiusNormal)
                    .fill(styles.background)
            )
            .overlay(
                // Border using strokeBorder (draws inside view bounds)
                // Requirements: 13.2, 13.6
                RoundedRectangle(cornerRadius: DesignTokens.radiusNormal)
                    .strokeBorder(
                        styles.borderColor,
                        lineWidth: styles.borderWidth
                    )
            )
            .overlay(
                // Pressed state overlay
                // Requirements: 8.2 - blend.pressedDarker overlay
                RoundedRectangle(cornerRadius: DesignTokens.radiusNormal)
                    .fill(Color.black.opacity(configuration.isPressed ? 0.1 : 0))
            )
            .contentShape(RoundedRectangle(cornerRadius: DesignTokens.radiusNormal))
            // Animate all visual properties together
            // Requirements: 7.1 - Animate background, border-color, border-width, padding, color
            .animation(stateAnimation, value: styles.background)
            .animation(stateAnimation, value: styles.borderColor)
            .animation(stateAnimation, value: styles.borderWidth)
            .animation(stateAnimation, value: paddingBlock)
    }
}

// MARK: - DesignTokens Extensions

/**
 * Design token extensions for VerticalListButtonItem.
 * 
 * These extensions provide semantic token access for the component.
 * In a full implementation, these would be generated by the Rosetta system.
 * 
 * Note: This is a placeholder implementation. In production, these tokens
 * would be provided by the DesignTokens struct generated from the token system.
 */
extension DesignTokens {
    // MARK: - Motion Tokens
    
    /// Selection transition duration (250ms)
    /// Requirements: 7.1 - motion.selectionTransition
    public static let motionSelectionTransitionDuration: Double = 0.25
    
    // MARK: - Accessibility Tokens
    
    /// Recommended tap area size (48pt)
    /// Requirements: 5.1 - Minimum height for touch targets
    public static let tapAreaRecommended: CGFloat = 48
    
    // MARK: - Spacing Tokens
    
    /// Grouped loose spacing (12pt)
    /// Requirements: 4.6, 4.7 - Internal spacing between elements
    public static let spaceGroupedLoose: CGFloat = 12
    
    /// Inset 200 spacing (16pt)
    /// Requirements: 5.4 - Inline padding
    public static let spaceInset200: CGFloat = 16
    
    // MARK: - Component Tokens (Padding Compensation)
    
    /// Block padding for rest state (11pt) - used with 1pt border
    /// Requirements: 6.1 - 11pt padding for 1pt border
    /// Formula: SPACING_BASE_VALUE * 1.375 = 8 * 1.375 = 11
    /// Height calculation: 1pt border + 11pt padding + 24pt content + 11pt padding + 1pt border = 48pt
    public static let verticalListItemPaddingBlockRest: CGFloat = 11
    
    /// Block padding for selected state (10pt) - used with 2pt border
    /// Requirements: 6.2 - 10pt padding for 2pt border
    /// References: space125 primitive token
    /// Height calculation: 2pt border + 10pt padding + 24pt content + 10pt padding + 2pt border = 48pt
    public static let verticalListItemPaddingBlockSelected: CGFloat = 10
    
    // MARK: - Radius Tokens
    
    /// Normal border radius (8pt)
    /// Requirements: 5.3 - Border radius
    public static let radiusNormal: CGFloat = 8
    
    // MARK: - Icon Tokens
    
    /// Icon size 100 (24pt)
    /// Requirements: 9.1, 9.2 - Icon sizing
    public static let iconSize100: CGFloat = 24
    
    // MARK: - Border Tokens
    
    /// Default border width (1pt)
    /// Requirements: 1.1, 1.3, 1.4, 1.5
    public static let borderBorderDefault: CGFloat = 1
    
    /// Emphasis border width (2pt)
    /// Requirements: 1.2, 3.1
    public static let borderBorderEmphasis: CGFloat = 2
    
    // MARK: - Color Tokens (Semantic)
    
    /// Background color
    /// Requirements: 1.1, 1.5
    public static let colorBackground: UIColor = UIColor.systemBackground
    
    /// Default text color
    /// Requirements: 1.1, 1.5
    public static let colorTextDefault: UIColor = UIColor.label
    
    /// Muted text color
    /// Requirements: 4.3
    public static let colorTextMuted: UIColor = UIColor.secondaryLabel
    
    /// Selected state subtle background (feedback.select.background.rest)
    /// Requirements: 1.2, 1.4
    public static let colorFeedbackSelectBackgroundRest: UIColor = UIColor.systemBlue.withAlphaComponent(0.1)
    
    /// Selected state strong foreground (feedback.select.text.rest)
    /// Requirements: 1.2, 1.4, 2.3
    public static let colorFeedbackSelectTextRest: UIColor = UIColor.systemBlue
    
    /// Not selected state subtle background (feedback.select.background.default)
    /// Requirements: 1.3
    public static let colorFeedbackSelectBackgroundDefault: UIColor = UIColor.systemGray6
    
    /// Not selected state strong foreground (feedback.select.text.default)
    /// Requirements: 1.3
    public static let colorFeedbackSelectTextDefault: UIColor = UIColor.systemGray
    
    /// Error state subtle background (feedback.error.background)
    /// Requirements: 3.1
    public static let colorFeedbackErrorBackground: UIColor = UIColor.systemRed.withAlphaComponent(0.1)
    
    /// Error state strong foreground (feedback.error.text)
    /// Requirements: 3.1, 3.2, 3.3, 2.4
    public static let colorFeedbackErrorText: UIColor = UIColor.systemRed
    
    // MARK: - Typography Tokens
    
    /// Button medium typography
    /// Requirements: 4.1
    public static let typographyButtonMd: (fontSize: CGFloat, lineHeight: CGFloat) = (fontSize: 16, lineHeight: 24)
    
    /// Body small typography
    /// Requirements: 4.2
    public static let typographyBodySm: (fontSize: CGFloat, lineHeight: CGFloat) = (fontSize: 14, lineHeight: 20)
}

// MARK: - Preview

struct VerticalListButtonItem_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 16) {
                Text("Button-VerticalListItem")
                    .font(.headline)
                
                Group {
                    Text("Tap Mode").font(.subheadline).foregroundColor(.secondary)
                    
                    VerticalListButtonItem(
                        label: "Settings",
                        visualState: .rest,
                        onClick: { print("Tapped Settings") },
                        onHapticFeedback: { type in print("Haptic: \(type)") }
                    )
                    
                    VerticalListButtonItem(
                        label: "With Description",
                        description: "Additional context for this option",
                        visualState: .rest,
                        onClick: { print("Tapped") },
                        onFocus: { print("Focused") },
                        onBlur: { print("Blurred") }
                    )
                    
                    VerticalListButtonItem(
                        label: "With Icon",
                        leadingIcon: "gear",
                        visualState: .rest,
                        onClick: { print("Tapped") }
                    )
                }
                
                Divider()
                
                Group {
                    Text("Select Mode").font(.subheadline).foregroundColor(.secondary)
                    
                    VerticalListButtonItem(
                        label: "Selected Option",
                        description: "This option is currently selected",
                        visualState: .selected,
                        onClick: { print("Selected") }
                    )
                    
                    VerticalListButtonItem(
                        label: "Not Selected Option",
                        visualState: .notSelected,
                        onClick: { print("Not Selected") }
                    )
                    
                    VerticalListButtonItem(
                        label: "Rest State",
                        visualState: .rest,
                        onClick: { print("Rest") }
                    )
                }
                
                Divider()
                
                Group {
                    Text("Multi-Select Mode").font(.subheadline).foregroundColor(.secondary)
                    
                    VerticalListButtonItem(
                        label: "Checked Option",
                        leadingIcon: "bell",
                        visualState: .checked,
                        onClick: { print("Checked") }
                    )
                    
                    VerticalListButtonItem(
                        label: "Unchecked Option",
                        leadingIcon: "bell.slash",
                        visualState: .unchecked,
                        onClick: { print("Unchecked") }
                    )
                }
                
                Divider()
                
                Group {
                    Text("Error States").font(.subheadline).foregroundColor(.secondary)
                    
                    VerticalListButtonItem(
                        label: "Select Mode Error",
                        description: "Full error treatment",
                        visualState: .notSelected,
                        error: true,
                        onClick: { print("Error Select") }
                    )
                    
                    VerticalListButtonItem(
                        label: "Multi-Select Error",
                        description: "Colors only treatment",
                        visualState: .unchecked,
                        error: true,
                        onClick: { print("Error Multi") }
                    )
                }
                
                Divider()
                
                Group {
                    Text("Animation Demo").font(.subheadline).foregroundColor(.secondary)
                    
                    // Staggered animation demo
                    Text("Staggered Animations (transitionDelay)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    VerticalListButtonItem(
                        label: "No Delay",
                        visualState: .selected,
                        transitionDelay: 0,
                        onClick: { print("No delay") }
                    )
                    
                    VerticalListButtonItem(
                        label: "100ms Delay",
                        visualState: .selected,
                        transitionDelay: 0.1,
                        onClick: { print("100ms delay") }
                    )
                    
                    VerticalListButtonItem(
                        label: "200ms Delay",
                        visualState: .selected,
                        transitionDelay: 0.2,
                        onClick: { print("200ms delay") }
                    )
                    
                    // Checkmark transition demo
                    Text("Checkmark Transitions")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    VerticalListButtonItem(
                        label: "Fade Transition (default)",
                        visualState: .checked,
                        checkmarkTransition: .fade,
                        onClick: { print("Fade") }
                    )
                    
                    VerticalListButtonItem(
                        label: "Instant Transition",
                        visualState: .checked,
                        checkmarkTransition: .instant,
                        onClick: { print("Instant") }
                    )
                }
            }
            .padding()
        }
        .previewDisplayName("All States")
        
        // RTL Preview
        // Requirements: 11.4, 11.6 - Verify layout mirrors automatically in RTL context
        ScrollView {
            VStack(spacing: 16) {
                Text("RTL Layout Test")
                    .font(.headline)
                
                Text("Leading icon should appear on RIGHT")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Text("Checkmark should appear on LEFT")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                // With leading icon - icon should be on right in RTL
                VerticalListButtonItem(
                    label: "With Leading Icon",
                    description: "Icon appears on right in RTL",
                    leadingIcon: "gear",
                    visualState: .rest,
                    onClick: { print("RTL with icon") }
                )
                
                // Selected with checkmark - checkmark should be on left in RTL
                VerticalListButtonItem(
                    label: "Selected State",
                    description: "Checkmark appears on left in RTL",
                    visualState: .selected,
                    onClick: { print("RTL selected") }
                )
                
                // With both icon and checkmark
                VerticalListButtonItem(
                    label: "Icon + Checkmark",
                    description: "Icon on right, checkmark on left",
                    leadingIcon: "star",
                    visualState: .checked,
                    onClick: { print("RTL both") }
                )
                
                // Content alignment test
                VerticalListButtonItem(
                    label: "Content Alignment",
                    description: "Text should align to the right (start in RTL)",
                    visualState: .rest,
                    onClick: { print("RTL alignment") }
                )
            }
            .padding()
        }
        .environment(\.layoutDirection, .rightToLeft)
        .previewDisplayName("RTL Layout")
        
        // Animation Preview
        AnimationDemoView()
            .previewDisplayName("Animation Demo")
    }
}

// MARK: - Animation Demo View

/**
 * Interactive demo view for testing animations.
 * 
 * Demonstrates:
 * - Visual state transitions with motion.selectionTransition timing
 * - Checkmark fade-in/fade-out based on checkmarkTransition prop
 * - Staggered animations using transitionDelay prop
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */
struct AnimationDemoView: View {
    @State private var visualState: VisualState = .rest
    @State private var error: Bool = false
    @State private var checkmarkTransition: CheckmarkTransition = .fade
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Text("Animation Demo")
                    .font(.headline)
                
                // Interactive button
                VerticalListButtonItem(
                    label: "Interactive Demo",
                    description: "Tap buttons below to change state",
                    leadingIcon: "star",
                    visualState: visualState,
                    error: error,
                    checkmarkTransition: checkmarkTransition,
                    onClick: { print("Clicked") }
                )
                
                Divider()
                
                // State controls
                Text("Visual State").font(.subheadline)
                
                HStack(spacing: 8) {
                    ForEach(VisualState.allCases, id: \.self) { state in
                        Button(state.rawValue) {
                            visualState = state
                        }
                        .buttonStyle(.bordered)
                        .tint(visualState == state ? .blue : .gray)
                    }
                }
                
                // Error toggle
                Toggle("Error State", isOn: $error)
                    .padding(.horizontal)
                
                // Checkmark transition toggle
                Text("Checkmark Transition").font(.subheadline)
                
                HStack(spacing: 8) {
                    Button("Fade") {
                        checkmarkTransition = .fade
                    }
                    .buttonStyle(.bordered)
                    .tint(checkmarkTransition == .fade ? .blue : .gray)
                    
                    Button("Instant") {
                        checkmarkTransition = .instant
                    }
                    .buttonStyle(.bordered)
                    .tint(checkmarkTransition == .instant ? .blue : .gray)
                }
                
                Divider()
                
                // Staggered animation demo
                Text("Staggered Animation Demo").font(.subheadline)
                Text("All items animate together with different delays")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                ForEach(0..<4) { index in
                    VerticalListButtonItem(
                        label: "Item \(index + 1)",
                        description: "Delay: \(index * 50)ms",
                        visualState: visualState,
                        error: error,
                        transitionDelay: Double(index) * 0.05,
                        onClick: { print("Item \(index + 1)") }
                    )
                }
            }
            .padding()
        }
    }
}
