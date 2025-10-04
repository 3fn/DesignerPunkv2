/**
 * iOS Color Resolver
 * 
 * Generates UIColor.dynamicColor implementations with trait collection detection.
 * Supports native iOS light/dark mode via UITraitCollection and theme switching.
 * 
 * Output Format:
 * - Swift UIColor extensions with dynamicColor
 * - Trait collection detection for automatic mode switching
 * - Theme switching via custom trait or user defaults
 */

import { ColorTokenValue } from '../types/PrimitiveToken';
import { ModeThemeResolver, UserTheme } from './ModeThemeResolver';

/**
 * Swift output options
 */
export interface SwiftOutputOptions {
  /** Include theme switching support */
  includeThemeSwitching?: boolean;
  /** Default theme to use */
  defaultTheme?: UserTheme;
  /** Extension name (default: 'DesignSystemColors') */
  extensionName?: string;
}

/**
 * iOSColorResolver generates Swift UIColor code for iOS platform
 */
export class iOSColorResolver {
  private resolver: ModeThemeResolver;

  constructor() {
    this.resolver = new ModeThemeResolver();
  }

  /**
   * Convert hex color to Swift UIColor initialization
   * 
   * @param hex - Hex color string (e.g., '#FF6B35')
   * @returns Swift UIColor initialization code
   */
  private hexToUIColor(hex: string): string {
    // Remove # if present
    const cleanHex = hex.replace('#', '');

    // Parse RGB values
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    // Convert to 0-1 range with 3 decimal places
    const rFloat = (r / 255).toFixed(3);
    const gFloat = (g / 255).toFixed(3);
    const bFloat = (b / 255).toFixed(3);

    return `UIColor(red: ${rFloat}, green: ${gFloat}, blue: ${bFloat}, alpha: 1.0)`;
  }

  /**
   * Generate Swift UIColor.dynamicColor for a single color token
   * 
   * @param tokenName - Name of the color token (e.g., 'purple300')
   * @param colorValue - Color token value with mode/theme structure
   * @param options - Swift output options
   * @returns Swift UIColor.dynamicColor code
   */
  generateDynamicColor(
    tokenName: string,
    colorValue: ColorTokenValue,
    options: SwiftOutputOptions = {}
  ): string {
    const {
      includeThemeSwitching = true,
      defaultTheme = 'base'
    } = options;

    const allValues = this.resolver.resolveAll(colorValue);
    const camelCaseName = tokenName.charAt(0).toLowerCase() + tokenName.slice(1);

    let swift = `    static var ${camelCaseName}: UIColor {\n`;

    if (includeThemeSwitching) {
      // With theme switching support
      swift += `        let theme = UserDefaults.standard.string(forKey: "designSystemTheme") ?? "${defaultTheme}"\n`;
      swift += `        \n`;
      swift += `        return UIColor { traitCollection in\n`;
      swift += `            switch (traitCollection.userInterfaceStyle, theme) {\n`;
      swift += `            case (.dark, "wcag"):\n`;
      swift += `                return ${this.hexToUIColor(allValues.dark.wcag)}\n`;
      swift += `            case (.dark, _):\n`;
      swift += `                return ${this.hexToUIColor(allValues.dark.base)}\n`;
      swift += `            case (_, "wcag"):\n`;
      swift += `                return ${this.hexToUIColor(allValues.light.wcag)}\n`;
      swift += `            default:\n`;
      swift += `                return ${this.hexToUIColor(allValues.light.base)}\n`;
      swift += `            }\n`;
      swift += `        }\n`;
    } else {
      // Without theme switching (base theme only)
      swift += `        return UIColor { traitCollection in\n`;
      swift += `            switch traitCollection.userInterfaceStyle {\n`;
      swift += `            case .dark:\n`;
      swift += `                return ${this.hexToUIColor(allValues.dark[defaultTheme])}\n`;
      swift += `            default:\n`;
      swift += `                return ${this.hexToUIColor(allValues.light[defaultTheme])}\n`;
      swift += `            }\n`;
      swift += `        }\n`;
    }

    swift += `    }\n`;

    return swift;
  }

  /**
   * Generate complete Swift extension with all color tokens
   * 
   * @param tokens - Object mapping token names to color values
   * @param options - Swift output options
   * @returns Complete Swift extension code
   */
  generateSwiftExtension(
    tokens: Record<string, ColorTokenValue>,
    options: SwiftOutputOptions = {}
  ): string {
    const {
      extensionName = 'DesignSystemColors'
    } = options;

    let swift = '//\n';
    swift += `//  ${extensionName}.swift\n`;
    swift += '//  Design System Color Tokens\n';
    swift += '//\n';
    swift += '//  Generated with mode-aware and theme-aware support\n';
    swift += '//  Supports native iOS light/dark mode via UITraitCollection\n';
    swift += '//\n\n';

    swift += 'import UIKit\n\n';

    swift += `extension UIColor {\n`;
    swift += `    /// Design System color tokens with mode-aware and theme-aware support\n`;
    swift += `    enum ${extensionName} {\n`;

    Object.entries(tokens).forEach(([tokenName, colorValue]) => {
      swift += this.generateDynamicColor(tokenName, colorValue, options);
      swift += '\n';
    });

    swift += `    }\n`;
    swift += `}\n\n`;

    // Add theme switching helper
    swift += '// MARK: - Theme Switching Helper\n\n';
    swift += 'extension UserDefaults {\n';
    swift += '    /// Get current design system theme\n';
    swift += '    var designSystemTheme: String {\n';
    swift += '        get { string(forKey: "designSystemTheme") ?? "base" }\n';
    swift += '        set { set(newValue, forKey: "designSystemTheme") }\n';
    swift += '    }\n';
    swift += '    \n';
    swift += '    /// Set design system theme and trigger UI update\n';
    swift += '    func setDesignSystemTheme(_ theme: String) {\n';
    swift += '        designSystemTheme = theme\n';
    swift += '        // Trigger UI update by posting notification\n';
    swift += '        NotificationCenter.default.post(\n';
    swift += '            name: NSNotification.Name("DesignSystemThemeDidChange"),\n';
    swift += '            object: nil\n';
    swift += '        )\n';
    swift += '    }\n';
    swift += '}\n';

    return swift;
  }

  /**
   * Generate usage example documentation
   * 
   * @param extensionName - Extension name used in generation
   * @returns Swift usage example code
   */
  generateUsageExample(extensionName: string = 'DesignSystemColors'): string {
    let example = '//\n';
    example += '//  Usage Examples\n';
    example += '//\n\n';

    example += '// MARK: - Basic Usage\n\n';
    example += '// Use color tokens in your views\n';
    example += `view.backgroundColor = UIColor.${extensionName}.purple300\n`;
    example += `label.textColor = UIColor.${extensionName}.gray300\n\n`;

    example += '// MARK: - Theme Switching\n\n';
    example += '// Switch to WCAG theme\n';
    example += 'UserDefaults.standard.setDesignSystemTheme("wcag")\n\n';

    example += '// Switch back to base theme\n';
    example += 'UserDefaults.standard.setDesignSystemTheme("base")\n\n';

    example += '// MARK: - Observing Theme Changes\n\n';
    example += 'NotificationCenter.default.addObserver(\n';
    example += '    forName: NSNotification.Name("DesignSystemThemeDidChange"),\n';
    example += '    object: nil,\n';
    example += '    queue: .main\n';
    example += ') { _ in\n';
    example += '    // Update your UI when theme changes\n';
    example += '    self.updateColors()\n';
    example += '}\n\n';

    example += '// MARK: - Automatic Mode Detection\n\n';
    example += '// Colors automatically adapt to light/dark mode\n';
    example += '// based on UITraitCollection.userInterfaceStyle\n';
    example += '// No additional code needed!\n';

    return example;
  }

  /**
   * Get resolver instance for direct color resolution
   */
  getResolver(): ModeThemeResolver {
    return this.resolver;
  }
}
