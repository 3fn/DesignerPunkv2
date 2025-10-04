/**
 * ModeThemeResolver Unit Tests
 * 
 * Tests for core mode/theme resolution logic handling colorToken[systemMode][userTheme] pattern.
 * Covers resolution for all mode/theme combinations, default theme handling, and validation.
 */

import { ModeThemeResolver, SystemMode, UserTheme, ColorResolutionResult } from '../ModeThemeResolver';
import { ColorTokenValue } from '../../types/PrimitiveToken';

// Mock color token factory for testing
const createMockColorToken = (): ColorTokenValue => ({
  light: {
    base: '#8B5CF6',
    wcag: '#7C3AED'
  },
  dark: {
    base: '#A78BFA',
    wcag: '#C4B5FD'
  }
});

describe('ModeThemeResolver', () => {
  let resolver: ModeThemeResolver;

  beforeEach(() => {
    resolver = new ModeThemeResolver();
  });

  describe('Basic Resolution', () => {
    test('should resolve light mode with base theme', () => {
      const colorToken = createMockColorToken();
      const result = resolver.resolve(colorToken, 'light', 'base');

      expect(result.color).toBe('#8B5CF6');
      expect(result.mode).toBe('light');
      expect(result.theme).toBe('base');
      expect(result.usedDefaultTheme).toBe(false);
    });

    test('should resolve light mode with wcag theme', () => {
      const colorToken = createMockColorToken();
      const result = resolver.resolve(colorToken, 'light', 'wcag');

      expect(result.color).toBe('#7C3AED');
      expect(result.mode).toBe('light');
      expect(result.theme).toBe('wcag');
      expect(result.usedDefaultTheme).toBe(false);
    });

    test('should resolve dark mode with base theme', () => {
      const colorToken = createMockColorToken();
      const result = resolver.resolve(colorToken, 'dark', 'base');

      expect(result.color).toBe('#A78BFA');
      expect(result.mode).toBe('dark');
      expect(result.theme).toBe('base');
      expect(result.usedDefaultTheme).toBe(false);
    });

    test('should resolve dark mode with wcag theme', () => {
      const colorToken = createMockColorToken();
      const result = resolver.resolve(colorToken, 'dark', 'wcag');

      expect(result.color).toBe('#C4B5FD');
      expect(result.mode).toBe('dark');
      expect(result.theme).toBe('wcag');
      expect(result.usedDefaultTheme).toBe(false);
    });
  });

  describe('Default Theme Handling', () => {
    test('should use base theme as default when theme not specified', () => {
      const colorToken = createMockColorToken();
      const result = resolver.resolve(colorToken, 'light');

      expect(result.color).toBe('#8B5CF6');
      expect(result.theme).toBe('base');
      expect(result.usedDefaultTheme).toBe(true);
    });

    test('should use default theme for dark mode when not specified', () => {
      const colorToken = createMockColorToken();
      const result = resolver.resolve(colorToken, 'dark');

      expect(result.color).toBe('#A78BFA');
      expect(result.theme).toBe('base');
      expect(result.usedDefaultTheme).toBe(true);
    });

    test('should get default theme', () => {
      expect(resolver.getDefaultTheme()).toBe('base');
    });

    test('should set default theme', () => {
      resolver.setDefaultTheme('wcag');
      expect(resolver.getDefaultTheme()).toBe('wcag');

      const colorToken = createMockColorToken();
      const result = resolver.resolve(colorToken, 'light');

      expect(result.color).toBe('#7C3AED');
      expect(result.theme).toBe('wcag');
      expect(result.usedDefaultTheme).toBe(true);
    });
  });

  describe('Default Mode Handling', () => {
    test('should use light mode as default when mode not specified', () => {
      const colorToken = createMockColorToken();
      const result = resolver.resolve(colorToken);

      expect(result.color).toBe('#8B5CF6');
      expect(result.mode).toBe('light');
      expect(result.theme).toBe('base');
    });

    test('should use light mode and default theme when both not specified', () => {
      const colorToken = createMockColorToken();
      const result = resolver.resolve(colorToken);

      expect(result.color).toBe('#8B5CF6');
      expect(result.mode).toBe('light');
      expect(result.theme).toBe('base');
      expect(result.usedDefaultTheme).toBe(true);
    });
  });

  describe('Resolve All Combinations', () => {
    test('should resolve all mode/theme combinations', () => {
      const colorToken = createMockColorToken();
      const allValues = resolver.resolveAll(colorToken);

      expect(allValues.light.base).toBe('#8B5CF6');
      expect(allValues.light.wcag).toBe('#7C3AED');
      expect(allValues.dark.base).toBe('#A78BFA');
      expect(allValues.dark.wcag).toBe('#C4B5FD');
    });

    test('should resolve all combinations for different color token', () => {
      const colorToken: ColorTokenValue = {
        light: {
          base: '#FF6B35',
          wcag: '#E65A2A'
        },
        dark: {
          base: '#FFB8A0',
          wcag: '#FFA380'
        }
      };

      const allValues = resolver.resolveAll(colorToken);

      expect(allValues.light.base).toBe('#FF6B35');
      expect(allValues.light.wcag).toBe('#E65A2A');
      expect(allValues.dark.base).toBe('#FFB8A0');
      expect(allValues.dark.wcag).toBe('#FFA380');
    });
  });

  describe('Color Token Validation', () => {
    test('should validate correct color token structure', () => {
      const colorToken = createMockColorToken();
      expect(resolver.validate(colorToken)).toBe(true);
    });

    test('should validate color token with different hex values', () => {
      const colorToken: ColorTokenValue = {
        light: {
          base: '#000000',
          wcag: '#FFFFFF'
        },
        dark: {
          base: '#FFFFFF',
          wcag: '#000000'
        }
      };

      expect(resolver.validate(colorToken)).toBe(true);
    });

    test('should reject color token missing light mode', () => {
      const invalidToken = {
        dark: {
          base: '#A78BFA',
          wcag: '#C4B5FD'
        }
      } as any;

      expect(resolver.validate(invalidToken)).toBe(false);
    });

    test('should reject color token missing dark mode', () => {
      const invalidToken = {
        light: {
          base: '#8B5CF6',
          wcag: '#7C3AED'
        }
      } as any;

      expect(resolver.validate(invalidToken)).toBe(false);
    });

    test('should reject color token missing base theme in light mode', () => {
      const invalidToken = {
        light: {
          wcag: '#7C3AED'
        },
        dark: {
          base: '#A78BFA',
          wcag: '#C4B5FD'
        }
      } as any;

      expect(resolver.validate(invalidToken)).toBe(false);
    });

    test('should reject color token missing wcag theme in dark mode', () => {
      const invalidToken = {
        light: {
          base: '#8B5CF6',
          wcag: '#7C3AED'
        },
        dark: {
          base: '#A78BFA'
        }
      } as any;

      expect(resolver.validate(invalidToken)).toBe(false);
    });

    test('should reject color token with invalid hex format', () => {
      const invalidToken = {
        light: {
          base: 'not-a-hex',
          wcag: '#7C3AED'
        },
        dark: {
          base: '#A78BFA',
          wcag: '#C4B5FD'
        }
      } as any;

      expect(resolver.validate(invalidToken)).toBe(false);
    });

    test('should reject color token with short hex format', () => {
      const invalidToken = {
        light: {
          base: '#FFF',
          wcag: '#7C3AED'
        },
        dark: {
          base: '#A78BFA',
          wcag: '#C4B5FD'
        }
      } as any;

      expect(resolver.validate(invalidToken)).toBe(false);
    });

    test('should reject color token with non-string values', () => {
      const invalidToken = {
        light: {
          base: 123456,
          wcag: '#7C3AED'
        },
        dark: {
          base: '#A78BFA',
          wcag: '#C4B5FD'
        }
      } as any;

      expect(resolver.validate(invalidToken)).toBe(false);
    });

    test('should reject color token with non-object mode values', () => {
      const invalidToken = {
        light: '#8B5CF6',
        dark: {
          base: '#A78BFA',
          wcag: '#C4B5FD'
        }
      } as any;

      expect(resolver.validate(invalidToken)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should handle uppercase hex values', () => {
      const colorToken: ColorTokenValue = {
        light: {
          base: '#8B5CF6',
          wcag: '#7C3AED'
        },
        dark: {
          base: '#A78BFA',
          wcag: '#C4B5FD'
        }
      };

      expect(resolver.validate(colorToken)).toBe(true);
      const result = resolver.resolve(colorToken, 'light', 'base');
      expect(result.color).toBe('#8B5CF6');
    });

    test('should handle lowercase hex values', () => {
      const colorToken: ColorTokenValue = {
        light: {
          base: '#8b5cf6',
          wcag: '#7c3aed'
        },
        dark: {
          base: '#a78bfa',
          wcag: '#c4b5fd'
        }
      };

      expect(resolver.validate(colorToken)).toBe(true);
      const result = resolver.resolve(colorToken, 'light', 'base');
      expect(result.color).toBe('#8b5cf6');
    });

    test('should handle mixed case hex values', () => {
      const colorToken: ColorTokenValue = {
        light: {
          base: '#8B5cF6',
          wcag: '#7C3aED'
        },
        dark: {
          base: '#A78bFA',
          wcag: '#C4B5fD'
        }
      };

      expect(resolver.validate(colorToken)).toBe(true);
    });

    test('should handle pure black and white', () => {
      const colorToken: ColorTokenValue = {
        light: {
          base: '#000000',
          wcag: '#000000'
        },
        dark: {
          base: '#FFFFFF',
          wcag: '#FFFFFF'
        }
      };

      expect(resolver.validate(colorToken)).toBe(true);
      expect(resolver.resolve(colorToken, 'light', 'base').color).toBe('#000000');
      expect(resolver.resolve(colorToken, 'dark', 'base').color).toBe('#FFFFFF');
    });
  });

  describe('Theme Switching Scenarios', () => {
    test('should support runtime theme switching', () => {
      const colorToken = createMockColorToken();

      // Start with base theme
      const baseResult = resolver.resolve(colorToken, 'light', 'base');
      expect(baseResult.color).toBe('#8B5CF6');

      // Switch to wcag theme
      const wcagResult = resolver.resolve(colorToken, 'light', 'wcag');
      expect(wcagResult.color).toBe('#7C3AED');

      // Switch back to base theme
      const backToBaseResult = resolver.resolve(colorToken, 'light', 'base');
      expect(backToBaseResult.color).toBe('#8B5CF6');
    });

    test('should support mode switching with consistent theme', () => {
      const colorToken = createMockColorToken();

      // Light mode with base theme
      const lightResult = resolver.resolve(colorToken, 'light', 'base');
      expect(lightResult.color).toBe('#8B5CF6');

      // Dark mode with base theme
      const darkResult = resolver.resolve(colorToken, 'dark', 'base');
      expect(darkResult.color).toBe('#A78BFA');

      // Back to light mode with base theme
      const backToLightResult = resolver.resolve(colorToken, 'light', 'base');
      expect(backToLightResult.color).toBe('#8B5CF6');
    });

    test('should support simultaneous mode and theme switching', () => {
      const colorToken = createMockColorToken();

      // Light + base
      expect(resolver.resolve(colorToken, 'light', 'base').color).toBe('#8B5CF6');

      // Dark + wcag
      expect(resolver.resolve(colorToken, 'dark', 'wcag').color).toBe('#C4B5FD');

      // Light + wcag
      expect(resolver.resolve(colorToken, 'light', 'wcag').color).toBe('#7C3AED');

      // Dark + base
      expect(resolver.resolve(colorToken, 'dark', 'base').color).toBe('#A78BFA');
    });
  });
});
