/**
 * iOS Motion Token Equivalents
 * 
 * This file provides iOS-specific motion token constants for animation durations and easing curves.
 * These tokens map CSS cubic-bezier curves to SwiftUI Animation.timingCurve equivalents.
 * 
 * Duration Tokens:
 * - Stored as TimeInterval (seconds) for direct use with SwiftUI animations
 * - Converted from milliseconds: duration150 = 150ms = 0.15s
 * 
 * Easing Tokens:
 * - Stored as Animation.timingCurve for direct use with SwiftUI
 * - Mapped from CSS cubic-bezier(p1, p2, p3, p4) to Animation.timingCurve(p1, p2, p3, p4)
 * 
 * Usage Patterns:
 * 
 * Basic Animation:
 * ```swift
 * .animation(motionEasingStandard.speed(1.0 / motionDurationFast), value: isFocused)
 * ```
 * 
 * WithAnimation Block:
 * ```swift
 * withAnimation(motionEasingStandard.speed(1.0 / motionDurationFast)) {
 *     isFloated = true
 * }
 * ```
 * 
 * Combined Motion Token:
 * ```swift
 * let motionFocusTransition = motionEasingStandard.speed(1.0 / motionDurationFast)
 * .animation(motionFocusTransition, value: isFocused)
 * ```
 * 
 * Reduced Motion Support:
 * ```swift
 * @Environment(\.accessibilityReduceMotion) var reduceMotion
 * .animation(reduceMotion ? .none : motionFocusTransition, value: isFocused)
 * ```
 */

import SwiftUI

// MARK: - Duration Tokens

/**
 * Fast interactions duration - 150ms (0.15 seconds)
 * 
 * Usage: Hover, focus states, micro-interactions
 * 
 * Example:
 * ```swift
 * .animation(.easeOut.speed(1.0 / motionDurationFast), value: isHovered)
 * ```
 */
public let motionDurationFast: TimeInterval = 0.15

/**
 * Standard transitions duration - 250ms (0.25 seconds)
 * 
 * Usage: Float labels, state changes, most animations
 * 
 * Example:
 * ```swift
 * .animation(motionEasingStandard.speed(1.0 / motionDurationNormal), value: isFloated)
 * ```
 */
public let motionDurationNormal: TimeInterval = 0.25

/**
 * Deliberate animations duration - 350ms (0.35 seconds)
 * 
 * Usage: Modals, drawers, complex transitions
 * 
 * Example:
 * ```swift
 * .animation(motionEasingDecelerate.speed(1.0 / motionDurationSlow), value: isPresented)
 * ```
 */
public let motionDurationSlow: TimeInterval = 0.35

// MARK: - Easing Tokens

/**
 * Standard easing curve - Balanced acceleration and deceleration
 * 
 * CSS equivalent: cubic-bezier(0.4, 0.0, 0.2, 1)
 * Material Design: Standard curve
 * 
 * Usage: Most animations (float labels, state changes, general transitions)
 * 
 * Example:
 * ```swift
 * .animation(motionEasingStandard.speed(1.0 / motionDurationNormal), value: state)
 * ```
 */
public let motionEasingStandard = Animation.timingCurve(0.4, 0.0, 0.2, 1.0)

/**
 * Decelerate easing curve - Quick start with gradual slowdown
 * 
 * CSS equivalent: cubic-bezier(0.0, 0.0, 0.2, 1)
 * Material Design: Deceleration curve
 * 
 * Usage: Elements entering the screen (modals, drawers, tooltips)
 * 
 * Example:
 * ```swift
 * .animation(motionEasingDecelerate.speed(1.0 / motionDurationNormal), value: isPresented)
 * ```
 */
public let motionEasingDecelerate = Animation.timingCurve(0.0, 0.0, 0.2, 1.0)

/**
 * Accelerate easing curve - Gradual start with quick finish
 * 
 * CSS equivalent: cubic-bezier(0.4, 0.0, 1, 1)
 * Material Design: Acceleration curve
 * 
 * Usage: Elements leaving the screen (dismissals, closures, exits)
 * 
 * Example:
 * ```swift
 * .animation(motionEasingAccelerate.speed(1.0 / motionDurationFast), value: isDismissed)
 * ```
 */
public let motionEasingAccelerate = Animation.timingCurve(0.4, 0.0, 1.0, 1.0)

// MARK: - Semantic Motion Tokens

/**
 * Float label motion - Standard motion for label floating animation
 * 
 * Duration: 250ms (motionDurationNormal)
 * Easing: Standard curve (motionEasingStandard)
 * 
 * Usage: Text input label transitions from placeholder to floating position
 * 
 * Example:
 * ```swift
 * @Environment(\.accessibilityReduceMotion) var reduceMotion
 * 
 * .animation(reduceMotion ? .none : motionFloatLabel, value: isFloated)
 * ```
 */
public let motionFloatLabel = motionEasingStandard.speed(1.0 / motionDurationNormal)

/**
 * Focus transition motion - Fast motion for focus state changes
 * 
 * Duration: 150ms (motionDurationFast)
 * Easing: Standard curve (motionEasingStandard)
 * 
 * Usage: Focus state transitions for interactive elements
 * 
 * Example:
 * ```swift
 * @Environment(\.accessibilityReduceMotion) var reduceMotion
 * 
 * .animation(reduceMotion ? .none : motionFocusTransition, value: isFocused)
 * ```
 */
public let motionFocusTransition = motionEasingStandard.speed(1.0 / motionDurationFast)

/**
 * Button press motion - Fast motion for button press feedback
 * 
 * Duration: 150ms (motionDurationFast)
 * Easing: Accelerate curve (motionEasingAccelerate)
 * 
 * Usage: Button press and release animations with scale transforms
 * 
 * Example:
 * ```swift
 * @Environment(\.accessibilityReduceMotion) var reduceMotion
 * 
 * .scaleEffect(isPressed ? DesignTokens.scale096 : DesignTokens.scale100)
 * .animation(reduceMotion ? .none : motionButtonPress, value: isPressed)
 * ```
 */
public let motionButtonPress = motionEasingAccelerate.speed(1.0 / motionDurationFast)

/**
 * Modal slide motion - Deliberate motion for modal entry
 * 
 * Duration: 350ms (motionDurationSlow)
 * Easing: Decelerate curve (motionEasingDecelerate)
 * 
 * Usage: Modal and overlay slide animations
 * 
 * Example:
 * ```swift
 * @Environment(\.accessibilityReduceMotion) var reduceMotion
 * 
 * .transition(.move(edge: .bottom))
 * .animation(reduceMotion ? .none : motionModalSlide, value: isPresented)
 * ```
 */
public let motionModalSlide = motionEasingDecelerate.speed(1.0 / motionDurationSlow)

// MARK: - Usage Documentation

/**
 * iOS Motion Token Usage Patterns
 * 
 * 1. Basic Animation with Duration and Easing:
 * ```swift
 * .animation(motionEasingStandard.speed(1.0 / motionDurationFast), value: isFocused)
 * ```
 * 
 * 2. WithAnimation Block:
 * ```swift
 * withAnimation(motionEasingStandard.speed(1.0 / motionDurationFast)) {
 *     isFloated = true
 * }
 * ```
 * 
 * 3. Combined Motion Token (Recommended):
 * ```swift
 * let motionFocusTransition = motionEasingStandard.speed(1.0 / motionDurationFast)
 * .animation(motionFocusTransition, value: isFocused)
 * ```
 * 
 * 4. Reduced Motion Support (Required for Accessibility):
 * ```swift
 * @Environment(\.accessibilityReduceMotion) var reduceMotion
 * 
 * .animation(reduceMotion ? .none : motionFocusTransition, value: isFocused)
 * ```
 * 
 * 5. Semantic Motion Tokens (Preferred):
 * ```swift
 * @Environment(\.accessibilityReduceMotion) var reduceMotion
 * 
 * .animation(reduceMotion ? .none : motionFloatLabel, value: isFloated)
 * ```
 * 
 * Speed Calculation:
 * SwiftUI's .speed() modifier controls animation duration:
 * - speed(1.0) = normal speed (1 second)
 * - speed(2.0) = twice as fast (0.5 seconds)
 * - speed(1.0 / 0.25) = 4x speed = 0.25 seconds
 * 
 * Therefore: .speed(1.0 / duration) converts TimeInterval to animation speed
 * 
 * Cross-Platform Consistency:
 * - Web: CSS cubic-bezier(0.4, 0.0, 0.2, 1) with 250ms duration
 * - iOS: Animation.timingCurve(0.4, 0.0, 0.2, 1.0).speed(1.0 / 0.25)
 * - Android: CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f) with 250ms duration
 * 
 * All platforms use the same cubic-bezier control points and durations,
 * ensuring consistent motion feel across platforms.
 */
