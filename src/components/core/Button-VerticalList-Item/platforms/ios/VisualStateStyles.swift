/**
 * Visual State Styles for Button-VerticalListItem iOS Platform
 * 
 * Defines the visual state mapping and error styling logic for the
 * Button-VerticalListItem component on iOS.
 * 
 * This file implements the state-to-style mapping that matches the TypeScript
 * definition in the web implementation, ensuring cross-platform consistency.
 * 
 * Part of the DesignerPunk Button System infrastructure.
 * 
 * @module Button-VerticalListItem/platforms/ios
 * @see Requirements: 1.1-1.5, 3.1-3.4
 */

import SwiftUI
import UIKit

// MARK: - Visual State Enum

/**
 * Visual state for the vertical list button item.
 * 
 * Determines the appearance of the button based on selection context:
 * - Tap Mode: Uses `rest` state only
 * - Select Mode: Uses `rest`, `selected`, `notSelected`
 * - Multi-Select Mode: Uses `checked`, `unchecked`
 * 
 * This enum matches the TypeScript definition:
 * ```typescript
 * type VisualState = 'rest' | 'selected' | 'notSelected' | 'checked' | 'unchecked';
 * ```
 * 
 * Requirements:
 * - 1.1: rest state styling
 * - 1.2: selected state styling
 * - 1.3: notSelected state styling
 * - 1.4: checked state styling
 * - 1.5: unchecked state styling
 */
public enum VisualState: String, CaseIterable, Equatable {
    case rest
    case selected
    case notSelected
    case checked
    case unchecked
    
    /// Whether this state shows the selection indicator (checkmark)
    /// Requirements: 2.1, 2.2
    public var showsCheckmark: Bool {
        switch self {
        case .selected, .checked:
            return true
        case .rest, .notSelected, .unchecked:
            return false
        }
    }
    
    /// Whether this state uses emphasis border (2pt)
    /// Only `selected` state uses the emphasis border
    public var usesEmphasisBorder: Bool {
        self == .selected
    }
    
    /// Whether this state is part of Select mode
    /// Select mode states: rest, selected, notSelected
    public var isSelectMode: Bool {
        switch self {
        case .rest, .selected, .notSelected:
            return true
        case .checked, .unchecked:
            return false
        }
    }
    
    /// Whether this state is part of Multi-Select mode
    /// Multi-Select mode states: checked, unchecked
    public var isMultiSelectMode: Bool {
        switch self {
        case .checked, .unchecked:
            return true
        case .rest, .selected, .notSelected:
            return false
        }
    }
    
    /// Accessibility state description for VoiceOver
    /// Requirements: 10.5, 10.7
    public var accessibilityStateDescription: String {
        switch self {
        case .selected:
            return "Selected"
        case .notSelected:
            return "Not selected"
        case .checked:
            return "Checked"
        case .unchecked:
            return "Unchecked"
        case .rest:
            return ""
        }
    }
}

// MARK: - Checkmark Transition Enum

/**
 * Checkmark transition behavior when hiding.
 * 
 * Controls how the selection indicator (checkmark) animates when
 * transitioning from visible to hidden state.
 * 
 * Requirements:
 * - 7.3: fade transition - uses motion.selectionTransition
 * - 7.4: instant transition - hides immediately without animation
 */
public enum CheckmarkTransition: Equatable {
    /// Fade out using motion.selectionTransition (250ms, standard easing)
    case fade
    
    /// Hide immediately without animation
    case instant
}

// MARK: - Visual State Styles

/**
 * Visual styles for a specific state.
 * 
 * Contains all the styling properties needed to render the button
 * in a particular visual state. Uses DesignTokens for all color
 * and dimension values to ensure consistency with the design system.
 * 
 * Requirements:
 * - 1.1-1.5: State-specific styling
 * - 3.1-3.4: Error state overlay
 */
public struct VisualStateStyles: Equatable {
    public let background: Color
    public let borderWidth: CGFloat
    public let borderColor: Color
    public let labelColor: Color
    public let iconColor: Color
    public let checkmarkVisible: Bool
    
    public init(
        background: Color,
        borderWidth: CGFloat,
        borderColor: Color,
        labelColor: Color,
        iconColor: Color,
        checkmarkVisible: Bool
    ) {
        self.background = background
        self.borderWidth = borderWidth
        self.borderColor = borderColor
        self.labelColor = labelColor
        self.iconColor = iconColor
        self.checkmarkVisible = checkmarkVisible
    }
    
    // MARK: - State-Specific Styles Using Design Tokens
    
    /// Rest state styles (Tap mode default)
    /// Requirements: 1.1 - color.background, borderDefault (1px), color.text.default
    public static let rest = VisualStateStyles(
        background: Color(DesignTokens.colorBackground),
        borderWidth: DesignTokens.borderBorderDefault,
        borderColor: .clear,
        labelColor: Color(DesignTokens.colorTextDefault),
        iconColor: Color(DesignTokens.colorTextDefault),
        checkmarkVisible: false
    )
    
    /// Selected state styles (Select mode)
    /// Requirements: 1.2 - color.select.selected.subtle, borderEmphasis (2px), 
    ///               color.select.selected.strong for border and label
    public static let selected = VisualStateStyles(
        background: Color(DesignTokens.colorSelectSelectedSubtle),
        borderWidth: DesignTokens.borderBorderEmphasis,
        borderColor: Color(DesignTokens.colorSelectSelectedStrong),
        labelColor: Color(DesignTokens.colorSelectSelectedStrong),
        iconColor: Color(DesignTokens.colorSelectSelectedStrong),
        checkmarkVisible: true
    )
    
    /// Not selected state styles (Select mode)
    /// Requirements: 1.3 - color.select.notSelected.subtle, borderDefault (1px),
    ///               transparent border, color.select.notSelected.strong
    public static let notSelected = VisualStateStyles(
        background: Color(DesignTokens.colorSelectNotSelectedSubtle),
        borderWidth: DesignTokens.borderBorderDefault,
        borderColor: .clear,
        labelColor: Color(DesignTokens.colorSelectNotSelectedStrong),
        iconColor: Color(DesignTokens.colorSelectNotSelectedStrong),
        checkmarkVisible: false
    )
    
    /// Checked state styles (Multi-Select mode)
    /// Requirements: 1.4 - color.select.selected.subtle, borderDefault (1px),
    ///               transparent border, color.select.selected.strong
    public static let checked = VisualStateStyles(
        background: Color(DesignTokens.colorSelectSelectedSubtle),
        borderWidth: DesignTokens.borderBorderDefault,
        borderColor: .clear,
        labelColor: Color(DesignTokens.colorSelectSelectedStrong),
        iconColor: Color(DesignTokens.colorSelectSelectedStrong),
        checkmarkVisible: true
    )
    
    /// Unchecked state styles (Multi-Select mode)
    /// Requirements: 1.5 - color.background, borderDefault (1px),
    ///               transparent border, color.text.default
    public static let unchecked = VisualStateStyles(
        background: Color(DesignTokens.colorBackground),
        borderWidth: DesignTokens.borderBorderDefault,
        borderColor: .clear,
        labelColor: Color(DesignTokens.colorTextDefault),
        iconColor: Color(DesignTokens.colorTextDefault),
        checkmarkVisible: false
    )
    
    // MARK: - Error State Styles
    
    /// Error state styles for Select mode (full treatment)
    /// Requirements: 3.1 - color.error.subtle background, borderEmphasis (2px),
    ///               color.error.strong for border, label, and icon
    public static func errorSelectMode(checkmarkVisible: Bool) -> VisualStateStyles {
        return VisualStateStyles(
            background: Color(DesignTokens.colorErrorSubtle),
            borderWidth: DesignTokens.borderBorderEmphasis,
            borderColor: Color(DesignTokens.colorErrorStrong),
            labelColor: Color(DesignTokens.colorErrorStrong),
            iconColor: Color(DesignTokens.colorErrorStrong),
            checkmarkVisible: checkmarkVisible
        )
    }
    
    /// Error state styles for Multi-Select mode (colors only)
    /// Requirements: 3.2 - preserves background and border, only changes label/icon colors
    public static func errorMultiSelectMode(baseStyles: VisualStateStyles) -> VisualStateStyles {
        return VisualStateStyles(
            background: baseStyles.background,
            borderWidth: baseStyles.borderWidth,
            borderColor: baseStyles.borderColor,
            labelColor: Color(DesignTokens.colorErrorStrong),
            iconColor: Color(DesignTokens.colorErrorStrong),
            checkmarkVisible: baseStyles.checkmarkVisible
        )
    }
}

// MARK: - Visual State Mapping

/**
 * Maps visual states to their corresponding styles.
 * 
 * This dictionary provides O(1) lookup for visual state styles,
 * matching the TypeScript `visualStateMap` implementation.
 * 
 * Requirements:
 * - 1.1-1.5: Visual state rendering
 */
public let visualStateMap: [VisualState: VisualStateStyles] = [
    .rest: .rest,
    .selected: .selected,
    .notSelected: .notSelected,
    .checked: .checked,
    .unchecked: .unchecked
]

// MARK: - Style Retrieval

/**
 * Gets the visual state styles for a given state.
 * 
 * Provides a safe way to retrieve styles with a fallback to rest state
 * if the state is not found in the map (should never happen with enum).
 * 
 * - Parameter visualState: The visual state to get styles for
 * - Returns: The corresponding VisualStateStyles
 */
public func getStylesForState(_ visualState: VisualState) -> VisualStateStyles {
    return visualStateMap[visualState] ?? .rest
}

// MARK: - Error Styling

/**
 * Applies error styling on top of base visual state styles.
 * 
 * Error treatment is mode-specific:
 * - Select mode: Full error treatment (border + background + colors)
 *   - Background: color.error.subtle
 *   - Border: borderEmphasis (2px), color.error.strong
 *   - Label/Icon: color.error.strong
 * - Multi-Select mode: Text/icon colors only (no border/background change)
 *   - Background: preserved from base state
 *   - Border: preserved from base state
 *   - Label/Icon: color.error.strong
 * - Tap mode (rest state only): No effect (nothing to validate)
 * 
 * Requirements:
 * - 3.1: Select mode error treatment (full treatment)
 * - 3.2: Multi-Select mode error treatment (colors only)
 * - 3.3: Error colors (color.error.strong for foreground)
 * - 3.4: Tap mode ignores error prop
 * 
 * - Parameters:
 *   - baseStyles: The base visual state styles
 *   - visualState: The current visual state
 * - Returns: Modified styles with error treatment applied
 */
public func applyErrorStyles(
    _ baseStyles: VisualStateStyles,
    visualState: VisualState
) -> VisualStateStyles {
    
    if visualState.isSelectMode {
        // Select mode: full error treatment (border + background + colors)
        // Requirements: 3.1
        return VisualStateStyles.errorSelectMode(checkmarkVisible: baseStyles.checkmarkVisible)
    }
    
    if visualState.isMultiSelectMode {
        // Multi-Select mode: text/icon colors only
        // Requirements: 3.2
        return VisualStateStyles.errorMultiSelectMode(baseStyles: baseStyles)
    }
    
    // Tap mode (rest state in tap context): error has no effect
    // Requirements: 3.4
    return baseStyles
}

/**
 * Computes the final styles for a visual state, optionally applying error treatment.
 * 
 * This is the primary entry point for getting styles in the component.
 * It handles both normal state styling and error state overlay.
 * 
 * - Parameters:
 *   - visualState: The current visual state
 *   - error: Whether error styling should be applied
 * - Returns: The computed VisualStateStyles
 */
public func computeStyles(
    visualState: VisualState,
    error: Bool
) -> VisualStateStyles {
    let baseStyles = getStylesForState(visualState)
    
    if error {
        return applyErrorStyles(baseStyles, visualState: visualState)
    }
    
    return baseStyles
}

// MARK: - Padding Compensation

/**
 * Calculates the block padding based on border width for height stability.
 * 
 * Padding compensation ensures constant 48pt height across all visual states:
 * - 1pt border: 11pt padding (1 + 11 + 24 + 11 + 1 = 48)
 * - 2pt border: 10pt padding (2 + 10 + 24 + 10 + 2 = 48)
 * 
 * This matches the web implementation's padding compensation approach
 * and the component token definitions:
 * - verticalListItem.paddingBlock.rest = 11 (SPACING_BASE_VALUE * 1.375)
 * - verticalListItem.paddingBlock.selected = 10 (references space125)
 * 
 * Requirements:
 * - 6.1: 11pt padding for 1pt border (borderDefault)
 * - 6.2: 10pt padding for 2pt border (borderEmphasis)
 * - 6.3: Constant 48pt total height
 * 
 * - Parameter borderWidth: The current border width
 * - Returns: The appropriate block padding value
 */
public func calculatePaddingBlock(borderWidth: CGFloat) -> CGFloat {
    // borderEmphasis (2pt) requires 10pt padding
    // borderDefault (1pt) requires 11pt padding
    // Uses component tokens for consistency with design system
    return borderWidth == DesignTokens.borderBorderEmphasis 
        ? DesignTokens.verticalListItemPaddingBlockSelected 
        : DesignTokens.verticalListItemPaddingBlockRest
}

/**
 * Calculates the block padding for a given visual state.
 * 
 * Convenience function that determines padding based on the visual state's
 * border width requirement.
 * 
 * - Parameter visualState: The current visual state
 * - Returns: The appropriate block padding value
 */
public func calculatePaddingBlock(for visualState: VisualState) -> CGFloat {
    let styles = getStylesForState(visualState)
    return calculatePaddingBlock(borderWidth: styles.borderWidth)
}

/**
 * Calculates the block padding for a given visual state with error consideration.
 * 
 * When error is true in Select mode, the border width changes to emphasis (2pt),
 * which affects the padding calculation.
 * 
 * - Parameters:
 *   - visualState: The current visual state
 *   - error: Whether error styling is applied
 * - Returns: The appropriate block padding value
 */
public func calculatePaddingBlock(for visualState: VisualState, error: Bool) -> CGFloat {
    let styles = computeStyles(visualState: visualState, error: error)
    return calculatePaddingBlock(borderWidth: styles.borderWidth)
}


// MARK: - DesignTokens Extension for Padding Compensation

/**
 * Component token extensions for padding compensation.
 * 
 * These tokens define the padding values used for height stability:
 * - Rest state (1pt border): 11pt padding
 * - Selected state (2pt border): 10pt padding
 * 
 * The values ensure constant 48pt total height across all visual states.
 * 
 * Requirements:
 * - 6.1: 11pt padding for 1pt border
 * - 6.2: 10pt padding for 2pt border
 * - 6.3: Constant 48pt total height
 */
extension DesignTokens {
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
}
