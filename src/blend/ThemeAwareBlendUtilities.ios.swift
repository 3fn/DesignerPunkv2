//
// Theme-Aware Blend Utilities for iOS (SwiftUI)
//
// Provides theme-aware Color extensions that wrap blend utilities with
// automatic theme context awareness. Components can use these extensions
// to get blend colors that automatically use the current theme's color values.
//
// @see Requirements: 11.4 - Theme-aware wrapper functions
//

import SwiftUI

// MARK: - Blend Token Values

/// Blend token values from semantic blend tokens
/// These match the design token definitions and provide consistent state styling
public struct BlendTokenValues {
    /// Hover state darkening - blend200 (8%)
    public static let hoverDarker: Double = 0.08
    
    /// Pressed state darkening - blend300 (12%)
    public static let pressedDarker: Double = 0.12
    
    /// Focus state saturation increase - blend200 (8%)
    public static let focusSaturate: Double = 0.08
    
    /// Disabled state desaturation - blend300 (12%)
    public static let disabledDesaturate: Double = 0.12
    
    /// Icon optical balance lightening - blend200 (8%)
    public static let iconLighter: Double = 0.08
    
    private init() {}
}

// MARK: - Theme Context

/// Theme mode for light/dark theme support
public enum ThemeMode {
    case light
    case dark
    
    /// Get current theme mode from environment
    @available(iOS 13.0, macOS 10.15, *)
    public static func current(from colorScheme: ColorScheme) -> ThemeMode {
        switch colorScheme {
        case .dark:
            return .dark
        case .light:
            return .light
        @unknown default:
            return .light
        }
    }
}

/// Theme context for blend utilities
/// Provides color values for the current theme
public struct BlendThemeContext {
    /// Current theme mode (light or dark)
    public let mode: ThemeMode
    
    /// Primary color for the current theme
    public let primaryColor: Color
    
    /// On-primary color (text/icon color on primary background)
    public let onPrimaryColor: Color
    
    /// Surface color for the current theme
    public let surfaceColor: Color
    
    /// On-surface color (text/icon color on surface background)
    public let onSurfaceColor: Color
    
    public init(
        mode: ThemeMode,
        primaryColor: Color,
        onPrimaryColor: Color,
        surfaceColor: Color,
        onSurfaceColor: Color
    ) {
        self.mode = mode
        self.primaryColor = primaryColor
        self.onPrimaryColor = onPrimaryColor
        self.surfaceColor = surfaceColor
        self.onSurfaceColor = onSurfaceColor
    }
}

// MARK: - Theme-Aware Color Extensions

extension Color {
    
    // MARK: - Semantic Blend Functions
    
    /// Calculate hover color by darkening the color using blend token value
    ///
    /// Uses `BlendTokenValues.hoverDarker` (8%) for consistent hover state styling
    /// across all components.
    ///
    /// - Returns: Darkened color for hover state
    ///
    /// Example:
    /// ```swift
    /// let hoverBg = Color.primary.hoverBlend()
    /// ```
    ///
    /// @see Requirements: 11.4 - Theme-aware wrapper functions
    public func hoverBlend() -> Color {
        return self.darkerBlend(BlendTokenValues.hoverDarker)
    }
    
    /// Calculate pressed color by darkening the color using blend token value
    ///
    /// Uses `BlendTokenValues.pressedDarker` (12%) for consistent pressed state styling
    /// across all components.
    ///
    /// - Returns: Darkened color for pressed state
    ///
    /// Example:
    /// ```swift
    /// let pressedBg = Color.primary.pressedBlend()
    /// ```
    ///
    /// @see Requirements: 11.4 - Theme-aware wrapper functions
    public func pressedBlend() -> Color {
        return self.darkerBlend(BlendTokenValues.pressedDarker)
    }
    
    /// Calculate focus color by saturating the color using blend token value
    ///
    /// Uses `BlendTokenValues.focusSaturate` (8%) for consistent focus state styling
    /// across all components.
    ///
    /// - Returns: Saturated color for focus state
    ///
    /// Example:
    /// ```swift
    /// let focusBorder = Color.primary.focusBlend()
    /// ```
    ///
    /// @see Requirements: 11.4 - Theme-aware wrapper functions
    public func focusBlend() -> Color {
        return self.saturate(BlendTokenValues.focusSaturate)
    }
    
    /// Calculate disabled color by desaturating the color using blend token value
    ///
    /// Uses `BlendTokenValues.disabledDesaturate` (12%) for consistent disabled state styling
    /// across all components.
    ///
    /// - Returns: Desaturated color for disabled state
    ///
    /// Example:
    /// ```swift
    /// let disabledBg = Color.primary.disabledBlend()
    /// ```
    ///
    /// @see Requirements: 11.4 - Theme-aware wrapper functions
    public func disabledBlend() -> Color {
        return self.desaturate(BlendTokenValues.disabledDesaturate)
    }
    
    /// Calculate icon color with optical balance adjustment using blend token value
    ///
    /// Uses `BlendTokenValues.iconLighter` (8%) for consistent icon optical balance
    /// across all components.
    ///
    /// - Returns: Lightened color for icon optical balance
    ///
    /// Example:
    /// ```swift
    /// let iconColor = Color.onPrimary.iconBlend()
    /// ```
    ///
    /// @see Requirements: 11.4 - Theme-aware wrapper functions
    public func iconBlend() -> Color {
        return self.lighterBlend(BlendTokenValues.iconLighter)
    }
}

// MARK: - Theme-Aware View Modifier

/// View modifier that provides theme-aware blend utilities to child views
@available(iOS 13.0, macOS 10.15, *)
public struct ThemeAwareBlendModifier: ViewModifier {
    @Environment(\.colorScheme) private var colorScheme
    
    public func body(content: Content) -> some View {
        content
            .environment(\.themeMode, ThemeMode.current(from: colorScheme))
    }
}

/// Environment key for theme mode
@available(iOS 13.0, macOS 10.15, *)
private struct ThemeModeKey: EnvironmentKey {
    static let defaultValue: ThemeMode = .light
}

@available(iOS 13.0, macOS 10.15, *)
extension EnvironmentValues {
    /// Current theme mode from environment
    public var themeMode: ThemeMode {
        get { self[ThemeModeKey.self] }
        set { self[ThemeModeKey.self] = newValue }
    }
}

@available(iOS 13.0, macOS 10.15, *)
extension View {
    /// Apply theme-aware blend utilities to this view and its children
    ///
    /// This modifier sets up the theme context for blend utilities,
    /// automatically detecting light/dark mode from the system.
    ///
    /// Example:
    /// ```swift
    /// ContentView()
    ///     .themeAwareBlend()
    /// ```
    ///
    /// @see Requirements: 11.4 - Theme-aware wrapper functions
    public func themeAwareBlend() -> some View {
        modifier(ThemeAwareBlendModifier())
    }
}

// MARK: - Blend Utilities Provider

/// Provider class for theme-aware blend utilities
/// Use this for programmatic access to blend functions outside of SwiftUI views
public class BlendUtilitiesProvider {
    
    /// Shared instance for convenience
    public static let shared = BlendUtilitiesProvider()
    
    private init() {}
    
    /// Calculate hover color for a given base color
    /// - Parameter color: Base color
    /// - Returns: Darkened color for hover state
    public func hoverColor(_ color: Color) -> Color {
        return color.hoverBlend()
    }
    
    /// Calculate pressed color for a given base color
    /// - Parameter color: Base color
    /// - Returns: Darkened color for pressed state
    public func pressedColor(_ color: Color) -> Color {
        return color.pressedBlend()
    }
    
    /// Calculate focus color for a given base color
    /// - Parameter color: Base color
    /// - Returns: Saturated color for focus state
    public func focusColor(_ color: Color) -> Color {
        return color.focusBlend()
    }
    
    /// Calculate disabled color for a given base color
    /// - Parameter color: Base color
    /// - Returns: Desaturated color for disabled state
    public func disabledColor(_ color: Color) -> Color {
        return color.disabledBlend()
    }
    
    /// Calculate icon color with optical balance for a given base color
    /// - Parameter color: Base color
    /// - Returns: Lightened color for icon optical balance
    public func iconColor(_ color: Color) -> Color {
        return color.iconBlend()
    }
    
    /// Generic darker blend function
    /// - Parameters:
    ///   - color: Base color
    ///   - amount: Blend amount (0.0-1.0)
    /// - Returns: Darkened color
    public func darkerBlend(_ color: Color, amount: Double) -> Color {
        return color.darkerBlend(amount)
    }
    
    /// Generic lighter blend function
    /// - Parameters:
    ///   - color: Base color
    ///   - amount: Blend amount (0.0-1.0)
    /// - Returns: Lightened color
    public func lighterBlend(_ color: Color, amount: Double) -> Color {
        return color.lighterBlend(amount)
    }
    
    /// Generic saturate blend function
    /// - Parameters:
    ///   - color: Base color
    ///   - amount: Blend amount (0.0-1.0)
    /// - Returns: Saturated color
    public func saturate(_ color: Color, amount: Double) -> Color {
        return color.saturate(amount)
    }
    
    /// Generic desaturate blend function
    /// - Parameters:
    ///   - color: Base color
    ///   - amount: Blend amount (0.0-1.0)
    /// - Returns: Desaturated color
    public func desaturate(_ color: Color, amount: Double) -> Color {
        return color.desaturate(amount)
    }
}
