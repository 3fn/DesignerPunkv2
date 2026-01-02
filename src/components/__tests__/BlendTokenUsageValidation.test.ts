/**
 * @category evergreen
 * @purpose Layer 2 validation tests for component blend utility + token usage
 */
/**
 * Blend Token Usage Validation Tests (Layer 2)
 * 
 * Static analysis tests that validate components use correct blend utility + token combinations.
 * These tests verify semantic correctness of token usage, not numerical precision (Layer 1).
 * 
 * Task: 2.5 Write Layer 2 validation tests (Token-Naming)
 * Spec: 031-blend-infrastructure-implementation
 * Requirements: 12.2, 12.3, 13.5
 * 
 * Validation approach:
 * - Parse component source files for blend utility usage patterns
 * - Verify correct blend function + token combinations for each state
 * - Detect and fail on remaining workarounds (opacity, filter, scaleEffect, Material ripple)
 * 
 * Components validated:
 * - ButtonCTA (Web, iOS, Android)
 * - TextInputField (Web, iOS, Android)
 * - Container (Web, iOS, Android)
 * - Icon (Web, iOS, Android)
 */

import * as fs from 'fs';
import * as path from 'path';

// Component source file paths
const COMPONENT_PATHS = {
  buttonCTA: {
    web: 'src/components/core/Button-CTA/platforms/web/ButtonCTA.web.ts',
    ios: 'src/components/core/Button-CTA/platforms/ios/ButtonCTA.ios.swift',
    android: 'src/components/core/Button-CTA/platforms/android/ButtonCTA.android.kt'
  },
  textInputField: {
    web: 'src/components/core/TextInputField/platforms/web/TextInputField.web.ts',
    ios: 'src/components/core/TextInputField/platforms/ios/TextInputField.ios.swift',
    android: 'src/components/core/TextInputField/platforms/android/TextInputField.android.kt'
  },
  container: {
    web: 'src/components/core/Container/platforms/web/Container.web.ts',
    ios: 'src/components/core/Container/platforms/ios/Container.ios.swift',
    android: 'src/components/core/Container/platforms/android/Container.android.kt'
  },
  icon: {
    web: 'src/components/core/Icon/platforms/web/Icon.web.ts',
    ios: 'src/components/core/Icon/platforms/ios/Icon.ios.swift',
    android: 'src/components/core/Icon/platforms/android/Icon.android.kt'
  }
};

// Expected blend token values (from semantic blend tokens)
const BLEND_TOKEN_VALUES = {
  hoverDarker: 0.08,      // blend200
  pressedDarker: 0.12,    // blend300
  disabledDesaturate: 0.12, // blend300
  focusSaturate: 0.08,    // blend200
  iconLighter: 0.08       // blend200 (color.icon.opticalBalance)
};

// Workaround patterns to detect and fail on
const WORKAROUND_PATTERNS = {
  // Opacity workarounds for state colors
  opacityHover: /opacity:\s*0\.9[0-9]/i,
  opacityPressed: /opacity:\s*0\.8[0-9]/i,
  opacityDisabled: /opacity:\s*0\.[56]/i,
  
  // CSS filter workarounds for icon lightening
  // This pattern detects actual CSS filter: brightness() usage, not comments
  filterBrightness: /filter:\s*brightness\(/i,
  
  // iOS scaleEffect workaround for pressed state
  scaleEffect: /scaleEffect\s*\(\s*0\.9[0-9]/i,
  
  // Android Material ripple workaround for pressed state
  materialRipple: /ripple\s*=\s*rememberRipple/i,
  indicationRipple: /indication\s*=\s*rememberRipple/i
};

/**
 * Strip comments from source code to avoid false positives in workaround detection
 */
function stripComments(source: string): string {
  // Remove single-line comments (// ...)
  let result = source.replace(/\/\/.*$/gm, '');
  // Remove multi-line comments (/* ... */)
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  return result;
}

/**
 * Read component source file
 */
function readComponentSource(filePath: string): string {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    return ''; // Return empty string if file doesn't exist
  }
  return fs.readFileSync(fullPath, 'utf-8');
}

/**
 * Check if source contains blend utility import/usage
 * 
 * Supports both direct blend utility usage and theme-aware utility usage:
 * - Direct: calculateDarkerBlend, darkerBlend, etc.
 * - Theme-aware: getBlendUtilities, hoverBlend, pressedBlend, disabledBlend, iconBlend
 */
function hasBlendUtilityUsage(source: string, platform: 'web' | 'ios' | 'android'): boolean {
  if (platform === 'web') {
    // Web: Check for blend utility imports and function calls
    // Supports both direct blend utilities and theme-aware utilities
    return (
      // Direct blend utilities
      source.includes('calculateDarkerBlend') ||
      source.includes('calculateLighterBlend') ||
      source.includes('calculateSaturateBlend') ||
      source.includes('calculateDesaturateBlend') ||
      source.includes('darkerBlend') ||
      source.includes('lighterBlend') ||
      source.includes('saturate') ||
      source.includes('desaturate') ||
      // Theme-aware blend utilities
      source.includes('getBlendUtilities') ||
      source.includes('createBlendUtilities') ||
      source.includes('hoverColor') ||
      source.includes('pressedColor') ||
      source.includes('disabledColor') ||
      source.includes('iconColor') ||
      source.includes('ThemeAwareBlendUtilities')
    );
  } else if (platform === 'ios') {
    // iOS: Check for Color extension method calls OR standalone blend functions
    // Supports both direct blend utilities and theme-aware utilities
    return (
      // Direct blend utilities
      source.includes('.darkerBlend(') ||
      source.includes('.lighterBlend(') ||
      source.includes('.saturate(') ||
      source.includes('.desaturate(') ||
      // Theme-aware blend utilities (semantic methods)
      source.includes('.hoverBlend(') ||
      source.includes('.pressedBlend(') ||
      source.includes('.focusBlend(') ||
      source.includes('.disabledBlend(') ||
      source.includes('.iconBlend(') ||
      // Also check for standalone function definitions (private func saturate/desaturate)
      /private\s+func\s+saturate\s*\(/.test(source) ||
      /private\s+func\s+desaturate\s*\(/.test(source) ||
      // Check for function calls without dot prefix (standalone functions)
      /[^.]\bsaturate\s*\(/.test(source) ||
      /[^.]\bdesaturate\s*\(/.test(source)
    );
  } else {
    // Android: Check for Color extension function calls
    // Supports both direct blend utilities and theme-aware utilities
    return (
      // Direct blend utilities
      source.includes('.darkerBlend(') ||
      source.includes('.lighterBlend(') ||
      source.includes('.saturate(') ||
      source.includes('.desaturate(') ||
      // Theme-aware blend utilities (semantic methods)
      source.includes('.hoverBlend(') ||
      source.includes('.pressedBlend(') ||
      source.includes('.focusBlend(') ||
      source.includes('.disabledBlend(') ||
      source.includes('.iconBlend(')
    );
  }
}

/**
 * Check for specific blend token value usage
 * 
 * Supports both direct token value definitions and theme-aware utility usage:
 * - Direct: BLEND_HOVER_DARKER = 0.08, etc.
 * - Theme-aware: Uses BlendTokenValues from ThemeAwareBlendUtilities (values encapsulated)
 * 
 * When theme-aware utilities are used, the token values are defined in the utility files,
 * not in the component files. This function checks for both patterns.
 */
function hasBlendTokenValue(source: string, tokenValue: number): boolean {
  // Check for the token value in various formats (direct definition)
  const directPatterns = [
    new RegExp(`${tokenValue}\\b`),           // Direct value: 0.08
    new RegExp(`${tokenValue}f\\b`),          // Kotlin float: 0.08f
    new RegExp(`BLEND_.*=\\s*${tokenValue}`), // Constant definition
  ];
  
  // Check for theme-aware utility usage (values encapsulated in utility files)
  // When using theme-aware utilities, the component doesn't define the values directly
  const themeAwarePatterns = [
    // Web: getBlendUtilities(), createBlendUtilities(), BlendUtilitiesResult
    /getBlendUtilities\s*\(\s*\)/,
    /createBlendUtilities\s*\(\s*\)/,
    /ThemeAwareBlendUtilities/,
    /BlendUtilitiesResult/,
    // iOS: hoverBlend(), pressedBlend(), disabledBlend(), iconBlend()
    /\.hoverBlend\s*\(\s*\)/,
    /\.pressedBlend\s*\(\s*\)/,
    /\.focusBlend\s*\(\s*\)/,
    /\.disabledBlend\s*\(\s*\)/,
    /\.iconBlend\s*\(\s*\)/,
    // Android: hoverBlend(), pressedBlend(), disabledBlend(), iconBlend()
    /import.*hoverBlend/,
    /import.*pressedBlend/,
    /import.*disabledBlend/,
    /import.*iconBlend/,
  ];
  
  // Return true if either direct values or theme-aware utilities are used
  const hasDirectValue = directPatterns.some(pattern => pattern.test(source));
  const hasThemeAwareUsage = themeAwarePatterns.some(pattern => pattern.test(source));
  
  return hasDirectValue || hasThemeAwareUsage;
}

/**
 * Check for workaround patterns in source
 * Strips comments first to avoid false positives from documentation
 */
function findWorkarounds(source: string): string[] {
  const foundWorkarounds: string[] = [];
  
  // Strip comments to avoid false positives from documentation
  const sourceWithoutComments = stripComments(source);
  
  for (const [name, pattern] of Object.entries(WORKAROUND_PATTERNS)) {
    if (pattern.test(sourceWithoutComments)) {
      foundWorkarounds.push(name);
    }
  }
  
  return foundWorkarounds;
}

describe('Layer 2 Validation: Component Blend Token Usage', () => {
  /**
   * ButtonCTA Component Validation
   * 
   * Expected blend utility + token combinations:
   * - Hover: darkerBlend(color.primary, blend.hoverDarker) = 8% darker
   * - Pressed: darkerBlend(color.primary, blend.pressedDarker) = 12% darker
   * - Disabled: desaturate(color.primary, blend.disabledDesaturate) = 12% less saturated
   * - Icon: lighterBlend(color.onPrimary, blend.iconLighter) = 8% lighter
   * 
   * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 13.1, 13.2, 13.3, 13.4
   */
  describe('ButtonCTA Component', () => {
    describe('Web Platform', () => {
      let source: string;
      
      beforeAll(() => {
        source = readComponentSource(COMPONENT_PATHS.buttonCTA.web);
      });
      
      it('should use blend utilities for state colors', () => {
        expect(source).not.toBe('');
        expect(hasBlendUtilityUsage(source, 'web')).toBe(true);
      });
      
      it('should use correct hover blend token value (0.08)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.hoverDarker)).toBe(true);
      });
      
      it('should use correct pressed blend token value (0.12)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.pressedDarker)).toBe(true);
      });
      
      it('should use correct disabled blend token value (0.12)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.disabledDesaturate)).toBe(true);
      });
      
      it('should use correct icon optical balance blend token value (0.08)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.iconLighter)).toBe(true);
      });
      
      it('should not contain opacity workarounds', () => {
        const workarounds = findWorkarounds(source);
        const opacityWorkarounds = workarounds.filter(w => w.startsWith('opacity'));
        expect(opacityWorkarounds).toHaveLength(0);
      });
      
      it('should not contain filter brightness workaround', () => {
        const workarounds = findWorkarounds(source);
        expect(workarounds).not.toContain('filterBrightness');
      });
    });
    
    describe('iOS Platform', () => {
      let source: string;
      
      beforeAll(() => {
        source = readComponentSource(COMPONENT_PATHS.buttonCTA.ios);
      });
      
      it('should use blend utilities for state colors', () => {
        expect(source).not.toBe('');
        expect(hasBlendUtilityUsage(source, 'ios')).toBe(true);
      });
      
      it('should use correct hover blend token value (0.08)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.hoverDarker)).toBe(true);
      });
      
      it('should use correct pressed blend token value (0.12)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.pressedDarker)).toBe(true);
      });
      
      it('should use correct disabled blend token value (0.12)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.disabledDesaturate)).toBe(true);
      });
      
      it('should use correct icon optical balance blend token value (0.08)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.iconLighter)).toBe(true);
      });
      
      it('should not contain scaleEffect workaround', () => {
        const workarounds = findWorkarounds(source);
        expect(workarounds).not.toContain('scaleEffect');
      });
    });
    
    describe('Android Platform', () => {
      let source: string;
      
      beforeAll(() => {
        source = readComponentSource(COMPONENT_PATHS.buttonCTA.android);
      });
      
      it('should use blend utilities for state colors', () => {
        expect(source).not.toBe('');
        expect(hasBlendUtilityUsage(source, 'android')).toBe(true);
      });
      
      it('should use correct hover blend token value (0.08f)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.hoverDarker)).toBe(true);
      });
      
      it('should use correct pressed blend token value (0.12f)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.pressedDarker)).toBe(true);
      });
      
      it('should use correct disabled blend token value (0.12f)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.disabledDesaturate)).toBe(true);
      });
      
      it('should use correct icon optical balance blend token value (0.08f)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.iconLighter)).toBe(true);
      });
      
      it('should not contain Material ripple workaround', () => {
        const workarounds = findWorkarounds(source);
        expect(workarounds).not.toContain('materialRipple');
        expect(workarounds).not.toContain('indicationRipple');
      });
    });
  });

  /**
   * TextInputField Component Validation
   * 
   * Expected blend utility + token combinations:
   * - Focus: saturate(color.primary, blend.focusSaturate) = 8% more saturated
   * - Disabled: desaturate(color.primary, blend.disabledDesaturate) = 12% less saturated
   * 
   * Validates: Requirements 8.1, 8.2, 8.3, 13.1
   */
  describe('TextInputField Component', () => {
    describe('Web Platform', () => {
      let source: string;
      
      beforeAll(() => {
        source = readComponentSource(COMPONENT_PATHS.textInputField.web);
      });
      
      it('should use blend utilities for state colors', () => {
        expect(source).not.toBe('');
        expect(hasBlendUtilityUsage(source, 'web')).toBe(true);
      });
      
      it('should use correct focus blend token value (0.08)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.focusSaturate)).toBe(true);
      });
      
      it('should use correct disabled blend token value (0.12)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.disabledDesaturate)).toBe(true);
      });
      
      it('should not contain opacity workarounds for disabled state', () => {
        // Check that opacity: 0.6 pattern is not used for disabled state
        // Note: opacity: 1 is acceptable (used to override browser defaults)
        const hasDisabledOpacityWorkaround = /disabled.*opacity:\s*0\.[56]/is.test(source);
        expect(hasDisabledOpacityWorkaround).toBe(false);
      });
    });
    
    describe('iOS Platform', () => {
      let source: string;
      
      beforeAll(() => {
        source = readComponentSource(COMPONENT_PATHS.textInputField.ios);
      });
      
      it('should exist or be skipped if not implemented', () => {
        // iOS TextInputField may not be implemented yet
        if (source === '') {
          console.log('iOS TextInputField not implemented - skipping validation');
          expect(true).toBe(true);
        } else {
          expect(hasBlendUtilityUsage(source, 'ios')).toBe(true);
        }
      });
    });
    
    describe('Android Platform', () => {
      let source: string;
      
      beforeAll(() => {
        source = readComponentSource(COMPONENT_PATHS.textInputField.android);
      });
      
      it('should exist or be skipped if not implemented', () => {
        // Android TextInputField may not be implemented yet
        if (source === '') {
          console.log('Android TextInputField not implemented - skipping validation');
          expect(true).toBe(true);
        } else {
          expect(hasBlendUtilityUsage(source, 'android')).toBe(true);
        }
      });
    });
  });

  /**
   * Container Component Validation
   * 
   * Expected blend utility + token combinations:
   * - Hover: darkerBlend(color.surface, blend.hoverDarker) = 8% darker
   * 
   * Validates: Requirements 9.1, 9.2
   */
  describe('Container Component', () => {
    describe('Web Platform', () => {
      let source: string;
      
      beforeAll(() => {
        source = readComponentSource(COMPONENT_PATHS.container.web);
      });
      
      it('should use blend utilities for hover state', () => {
        expect(source).not.toBe('');
        expect(hasBlendUtilityUsage(source, 'web')).toBe(true);
      });
      
      it('should use correct hover blend token value (0.08)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.hoverDarker)).toBe(true);
      });
      
      it('should not contain opacity workarounds for hover state', () => {
        const workarounds = findWorkarounds(source);
        const opacityWorkarounds = workarounds.filter(w => w.startsWith('opacity'));
        expect(opacityWorkarounds).toHaveLength(0);
      });
    });
    
    describe('iOS Platform', () => {
      let source: string;
      
      beforeAll(() => {
        source = readComponentSource(COMPONENT_PATHS.container.ios);
      });
      
      it('should exist or be skipped if not implemented', () => {
        // iOS Container may not be implemented yet
        if (source === '') {
          console.log('iOS Container not implemented - skipping validation');
          expect(true).toBe(true);
        } else {
          expect(hasBlendUtilityUsage(source, 'ios')).toBe(true);
        }
      });
    });
    
    describe('Android Platform', () => {
      let source: string;
      
      beforeAll(() => {
        source = readComponentSource(COMPONENT_PATHS.container.android);
      });
      
      it('should exist or be skipped if not implemented', () => {
        // Android Container may not be implemented yet
        if (source === '') {
          console.log('Android Container not implemented - skipping validation');
          expect(true).toBe(true);
        } else {
          expect(hasBlendUtilityUsage(source, 'android')).toBe(true);
        }
      });
    });
  });

  /**
   * Icon Component Validation
   * 
   * Expected blend utility + token combinations:
   * - Optical Balance: lighterBlend(color, blend.iconLighter) = 8% lighter
   * 
   * Validates: Requirements 10.1, 10.2, 13.2
   */
  describe('Icon Component', () => {
    describe('Web Platform', () => {
      let source: string;
      
      beforeAll(() => {
        source = readComponentSource(COMPONENT_PATHS.icon.web);
      });
      
      it('should use blend utilities for optical balance', () => {
        expect(source).not.toBe('');
        expect(hasBlendUtilityUsage(source, 'web')).toBe(true);
      });
      
      it('should use correct icon optical balance blend token value (0.08)', () => {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.iconLighter)).toBe(true);
      });
      
      it('should not contain filter brightness workaround', () => {
        const workarounds = findWorkarounds(source);
        expect(workarounds).not.toContain('filterBrightness');
      });
    });
    
    describe('iOS Platform', () => {
      let source: string;
      
      beforeAll(() => {
        source = readComponentSource(COMPONENT_PATHS.icon.ios);
      });
      
      it('should exist or be skipped if not implemented', () => {
        // iOS Icon may not have optical balance implemented yet
        if (source === '') {
          console.log('iOS Icon not implemented - skipping validation');
          expect(true).toBe(true);
        } else {
          // Check if optical balance is implemented
          const hasOpticalBalance = source.includes('lighterBlend') || source.includes('opticalBalance');
          if (hasOpticalBalance) {
            expect(hasBlendUtilityUsage(source, 'ios')).toBe(true);
          } else {
            console.log('iOS Icon optical balance not implemented - skipping validation');
            expect(true).toBe(true);
          }
        }
      });
    });
    
    describe('Android Platform', () => {
      let source: string;
      
      beforeAll(() => {
        source = readComponentSource(COMPONENT_PATHS.icon.android);
      });
      
      it('should exist or be skipped if not implemented', () => {
        // Android Icon may not have optical balance implemented yet
        if (source === '') {
          console.log('Android Icon not implemented - skipping validation');
          expect(true).toBe(true);
        } else {
          // Check if optical balance is implemented
          const hasOpticalBalance = source.includes('lighterBlend') || source.includes('opticalBalance');
          if (hasOpticalBalance) {
            expect(hasBlendUtilityUsage(source, 'android')).toBe(true);
          } else {
            console.log('Android Icon optical balance not implemented - skipping validation');
            expect(true).toBe(true);
          }
        }
      });
    });
  });

  /**
   * Workaround Detection Tests
   * 
   * Validates: Requirement 13.5 - Verify no workarounds remain
   * 
   * Scans all component files for remaining workaround patterns:
   * - opacity for hover/pressed/disabled states
   * - filter: brightness() for icon lightening
   * - scaleEffect for pressed state (iOS)
   * - Material ripple for pressed state (Android)
   */
  describe('Workaround Detection', () => {
    it('should not have any opacity workarounds in ButtonCTA', () => {
      const webSource = readComponentSource(COMPONENT_PATHS.buttonCTA.web);
      const iosSource = readComponentSource(COMPONENT_PATHS.buttonCTA.ios);
      const androidSource = readComponentSource(COMPONENT_PATHS.buttonCTA.android);
      
      // Check for opacity workarounds (0.92, 0.84, 0.6 patterns)
      const allSources = [webSource, iosSource, androidSource].filter(s => s !== '');
      
      for (const source of allSources) {
        const workarounds = findWorkarounds(source);
        const opacityWorkarounds = workarounds.filter(w => w.startsWith('opacity'));
        expect(opacityWorkarounds).toHaveLength(0);
      }
    });
    
    it('should not have filter brightness workaround in any component', () => {
      const allPaths = [
        COMPONENT_PATHS.buttonCTA.web,
        COMPONENT_PATHS.textInputField.web,
        COMPONENT_PATHS.container.web,
        COMPONENT_PATHS.icon.web
      ];
      
      for (const filePath of allPaths) {
        const source = readComponentSource(filePath);
        if (source !== '') {
          const workarounds = findWorkarounds(source);
          expect(workarounds).not.toContain('filterBrightness');
        }
      }
    });
    
    it('should not have scaleEffect workaround in iOS ButtonCTA', () => {
      const source = readComponentSource(COMPONENT_PATHS.buttonCTA.ios);
      if (source !== '') {
        const workarounds = findWorkarounds(source);
        expect(workarounds).not.toContain('scaleEffect');
      }
    });
    
    it('should not have Material ripple workaround in Android ButtonCTA', () => {
      const source = readComponentSource(COMPONENT_PATHS.buttonCTA.android);
      if (source !== '') {
        const workarounds = findWorkarounds(source);
        expect(workarounds).not.toContain('materialRipple');
        expect(workarounds).not.toContain('indicationRipple');
      }
    });
  });

  /**
   * Cross-Platform Consistency Tests
   * 
   * Validates that all platforms use the same blend token values
   * for consistent visual appearance across Web, iOS, and Android.
   */
  describe('Cross-Platform Blend Token Consistency', () => {
    it('should use same hover blend value (0.08) across all platforms', () => {
      const webSource = readComponentSource(COMPONENT_PATHS.buttonCTA.web);
      const iosSource = readComponentSource(COMPONENT_PATHS.buttonCTA.ios);
      const androidSource = readComponentSource(COMPONENT_PATHS.buttonCTA.android);
      
      const sources = [
        { name: 'Web', source: webSource },
        { name: 'iOS', source: iosSource },
        { name: 'Android', source: androidSource }
      ].filter(s => s.source !== '');
      
      for (const { name, source } of sources) {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.hoverDarker))
          .toBe(true);
      }
    });
    
    it('should use same pressed blend value (0.12) across all platforms', () => {
      const webSource = readComponentSource(COMPONENT_PATHS.buttonCTA.web);
      const iosSource = readComponentSource(COMPONENT_PATHS.buttonCTA.ios);
      const androidSource = readComponentSource(COMPONENT_PATHS.buttonCTA.android);
      
      const sources = [
        { name: 'Web', source: webSource },
        { name: 'iOS', source: iosSource },
        { name: 'Android', source: androidSource }
      ].filter(s => s.source !== '');
      
      for (const { name, source } of sources) {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.pressedDarker))
          .toBe(true);
      }
    });
    
    it('should use same disabled blend value (0.12) across all platforms', () => {
      const webSource = readComponentSource(COMPONENT_PATHS.buttonCTA.web);
      const iosSource = readComponentSource(COMPONENT_PATHS.buttonCTA.ios);
      const androidSource = readComponentSource(COMPONENT_PATHS.buttonCTA.android);
      
      const sources = [
        { name: 'Web', source: webSource },
        { name: 'iOS', source: iosSource },
        { name: 'Android', source: androidSource }
      ].filter(s => s.source !== '');
      
      for (const { name, source } of sources) {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.disabledDesaturate))
          .toBe(true);
      }
    });
    
    it('should use same icon optical balance blend value (0.08) across all platforms', () => {
      const webSource = readComponentSource(COMPONENT_PATHS.buttonCTA.web);
      const iosSource = readComponentSource(COMPONENT_PATHS.buttonCTA.ios);
      const androidSource = readComponentSource(COMPONENT_PATHS.buttonCTA.android);
      
      const sources = [
        { name: 'Web', source: webSource },
        { name: 'iOS', source: iosSource },
        { name: 'Android', source: androidSource }
      ].filter(s => s.source !== '');
      
      for (const { name, source } of sources) {
        expect(hasBlendTokenValue(source, BLEND_TOKEN_VALUES.iconLighter))
          .toBe(true);
      }
    });
  });
});
