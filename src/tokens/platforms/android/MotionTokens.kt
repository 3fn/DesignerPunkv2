/**
 * Android Motion Token Equivalents
 * 
 * This file provides Android-specific motion token constants for animation durations and easing curves.
 * These tokens map CSS cubic-bezier curves to Jetpack Compose CubicBezierEasing equivalents.
 * 
 * Duration Tokens:
 * - Stored as Int (milliseconds) for direct use with Compose animations
 * - Values match CSS: duration150 = 150ms
 * 
 * Easing Tokens:
 * - Stored as CubicBezierEasing for direct use with Compose
 * - Mapped from CSS cubic-bezier(p1, p2, p3, p4) to CubicBezierEasing(p1f, p2f, p3f, p4f)
 * 
 * Usage Patterns:
 * 
 * Basic Animation:
 * ```kotlin
 * val animatedOffset by animateFloatAsState(
 *     targetValue = if (isFloated) -20f else 0f,
 *     animationSpec = tween(
 *         durationMillis = motionDurationFast,
 *         easing = motionEasingStandard
 *     )
 * )
 * ```
 * 
 * Animate*AsState:
 * ```kotlin
 * val animatedAlpha by animateFloatAsState(
 *     targetValue = if (isFocused) 1f else 0f,
 *     animationSpec = tween(
 *         durationMillis = motionDurationNormal,
 *         easing = motionEasingStandard
 *     )
 * )
 * ```
 * 
 * Combined Motion Token:
 * ```kotlin
 * val motionFocusTransition = tween<Float>(
 *     durationMillis = motionDurationFast,
 *     easing = motionEasingStandard
 * )
 * 
 * val animatedValue by animateFloatAsState(
 *     targetValue = targetValue,
 *     animationSpec = motionFocusTransition
 * )
 * ```
 * 
 * Reduced Motion Support:
 * ```kotlin
 * val accessibilityManager = LocalContext.current.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
 * val reduceMotion = accessibilityManager.isEnabled && 
 *     accessibilityManager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_GENERIC).isNotEmpty()
 * 
 * val animationSpec = if (reduceMotion) {
 *     snap()
 * } else {
 *     tween(durationMillis = motionDurationNormal, easing = motionEasingStandard)
 * }
 * ```
 */

package com.designerpunk.tokens

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween

// MARK: - Duration Tokens

/**
 * Fast interactions duration - 150ms
 * 
 * Usage: Hover, focus states, micro-interactions
 * 
 * Example:
 * ```kotlin
 * val animatedValue by animateFloatAsState(
 *     targetValue = if (isHovered) 1f else 0f,
 *     animationSpec = tween(
 *         durationMillis = motionDurationFast,
 *         easing = FastOutSlowInEasing
 *     )
 * )
 * ```
 */
const val motionDurationFast: Int = 150

/**
 * Standard transitions duration - 250ms
 * 
 * Usage: Float labels, state changes, most animations
 * 
 * Example:
 * ```kotlin
 * val animatedOffset by animateFloatAsState(
 *     targetValue = if (isFloated) -20f else 0f,
 *     animationSpec = tween(
 *         durationMillis = motionDurationNormal,
 *         easing = motionEasingStandard
 *     )
 * )
 * ```
 */
const val motionDurationNormal: Int = 250

/**
 * Deliberate animations duration - 350ms
 * 
 * Usage: Modals, drawers, complex transitions
 * 
 * Example:
 * ```kotlin
 * val animatedScale by animateFloatAsState(
 *     targetValue = if (isPresented) 1f else 0f,
 *     animationSpec = tween(
 *         durationMillis = motionDurationSlow,
 *         easing = motionEasingDecelerate
 *     )
 * )
 * ```
 */
const val motionDurationSlow: Int = 350

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
 * ```kotlin
 * val animatedValue by animateFloatAsState(
 *     targetValue = targetValue,
 *     animationSpec = tween(
 *         durationMillis = motionDurationNormal,
 *         easing = motionEasingStandard
 *     )
 * )
 * ```
 */
val motionEasingStandard = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)

/**
 * Decelerate easing curve - Quick start with gradual slowdown
 * 
 * CSS equivalent: cubic-bezier(0.0, 0.0, 0.2, 1)
 * Material Design: Deceleration curve
 * 
 * Usage: Elements entering the screen (modals, drawers, tooltips)
 * 
 * Example:
 * ```kotlin
 * val animatedAlpha by animateFloatAsState(
 *     targetValue = if (isPresented) 1f else 0f,
 *     animationSpec = tween(
 *         durationMillis = motionDurationNormal,
 *         easing = motionEasingDecelerate
 *     )
 * )
 * ```
 */
val motionEasingDecelerate = CubicBezierEasing(0.0f, 0.0f, 0.2f, 1.0f)

/**
 * Accelerate easing curve - Gradual start with quick finish
 * 
 * CSS equivalent: cubic-bezier(0.4, 0.0, 1, 1)
 * Material Design: Acceleration curve
 * 
 * Usage: Elements leaving the screen (dismissals, closures, exits)
 * 
 * Example:
 * ```kotlin
 * val animatedAlpha by animateFloatAsState(
 *     targetValue = if (isDismissed) 0f else 1f,
 *     animationSpec = tween(
 *         durationMillis = motionDurationFast,
 *         easing = motionEasingAccelerate
 *     )
 * )
 * ```
 */
val motionEasingAccelerate = CubicBezierEasing(0.4f, 0.0f, 1.0f, 1.0f)

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
 * ```kotlin
 * val accessibilityManager = LocalContext.current.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
 * val reduceMotion = accessibilityManager.isEnabled && 
 *     accessibilityManager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_GENERIC).isNotEmpty()
 * 
 * val animationSpec = if (reduceMotion) {
 *     snap()
 * } else {
 *     motionFloatLabel
 * }
 * 
 * val animatedOffset by animateFloatAsState(
 *     targetValue = if (isFloated) -20f else 0f,
 *     animationSpec = animationSpec
 * )
 * ```
 */
val motionFloatLabel = tween<Float>(
    durationMillis = motionDurationNormal,
    easing = motionEasingStandard
)

// MARK: - Usage Documentation

/**
 * Android Motion Token Usage Patterns
 * 
 * 1. Basic Animation with Duration and Easing:
 * ```kotlin
 * val animatedValue by animateFloatAsState(
 *     targetValue = if (isFocused) 1f else 0f,
 *     animationSpec = tween(
 *         durationMillis = motionDurationFast,
 *         easing = motionEasingStandard
 *     )
 * )
 * ```
 * 
 * 2. Animate*AsState with Multiple Properties:
 * ```kotlin
 * val animatedOffset by animateFloatAsState(
 *     targetValue = if (isFloated) -20f else 0f,
 *     animationSpec = tween(
 *         durationMillis = motionDurationNormal,
 *         easing = motionEasingStandard
 *     )
 * )
 * 
 * val animatedAlpha by animateFloatAsState(
 *     targetValue = if (isFloated) 1f else 0.6f,
 *     animationSpec = tween(
 *         durationMillis = motionDurationNormal,
 *         easing = motionEasingStandard
 *     )
 * )
 * ```
 * 
 * 3. Combined Motion Token (Recommended):
 * ```kotlin
 * val motionFocusTransition = tween<Float>(
 *     durationMillis = motionDurationFast,
 *     easing = motionEasingStandard
 * )
 * 
 * val animatedValue by animateFloatAsState(
 *     targetValue = targetValue,
 *     animationSpec = motionFocusTransition
 * )
 * ```
 * 
 * 4. Reduced Motion Support (Required for Accessibility):
 * ```kotlin
 * val accessibilityManager = LocalContext.current.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
 * val reduceMotion = accessibilityManager.isEnabled && 
 *     accessibilityManager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_GENERIC).isNotEmpty()
 * 
 * val animationSpec = if (reduceMotion) {
 *     snap() // Instant transition, no animation
 * } else {
 *     tween(durationMillis = motionDurationNormal, easing = motionEasingStandard)
 * }
 * 
 * val animatedValue by animateFloatAsState(
 *     targetValue = targetValue,
 *     animationSpec = animationSpec
 * )
 * ```
 * 
 * 5. Semantic Motion Tokens (Preferred):
 * ```kotlin
 * val accessibilityManager = LocalContext.current.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
 * val reduceMotion = accessibilityManager.isEnabled && 
 *     accessibilityManager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_GENERIC).isNotEmpty()
 * 
 * val animationSpec = if (reduceMotion) snap() else motionFloatLabel
 * 
 * val animatedOffset by animateFloatAsState(
 *     targetValue = if (isFloated) -20f else 0f,
 *     animationSpec = animationSpec
 * )
 * ```
 * 
 * Duration Values:
 * - motionDurationFast: 150ms (fast interactions)
 * - motionDurationNormal: 250ms (standard transitions)
 * - motionDurationSlow: 350ms (deliberate animations)
 * 
 * Easing Curves:
 * - motionEasingStandard: CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f) - balanced
 * - motionEasingDecelerate: CubicBezierEasing(0.0f, 0.0f, 0.2f, 1.0f) - entering
 * - motionEasingAccelerate: CubicBezierEasing(0.4f, 0.0f, 1.0f, 1.0f) - exiting
 * 
 * Cross-Platform Consistency:
 * - Web: CSS cubic-bezier(0.4, 0.0, 0.2, 1) with 250ms duration
 * - iOS: Animation.timingCurve(0.4, 0.0, 0.2, 1.0).speed(1.0 / 0.25)
 * - Android: CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f) with 250ms duration
 * 
 * All platforms use the same cubic-bezier control points and durations,
 * ensuring consistent motion feel across platforms.
 */
