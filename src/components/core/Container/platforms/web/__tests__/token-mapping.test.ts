/**
 * @category evergreen
 * @purpose Verify token-mapping component renders correctly and behaves as expected
 */
/**
 * Token-to-CSS Mapping Tests
 * 
 * Tests for token-to-CSS conversion functions that map Container props
 * to CSS custom properties.
 * 
 * @see Requirements 2.1-2.5, 3.1-3.3, 4.1-4.3, 5.1-5.3, 6.1-6.3, 7.1-7.3, 8.1-8.4, 9.1-9.6
 */

import {
  tokenToCssVar,
  mapPaddingToCSS,
  mapBorderToCSS,
  mapBorderRadiusToCSS,
  mapColorToCSS,
  mapShadowToCSS,
  mapOpacityToCSS,
  mapLayeringToCSS,
  buildContainerStyles
} from '../token-mapping';
import type { PaddingValue, BorderValue, BorderRadiusValue, LayeringValue } from '../../../types';
import type { ColorTokenName, ShadowTokenName, OpacityTokenName } from '../../../../../../types/generated/TokenTypes';

describe('tokenToCssVar', () => {
  it('converts dot notation to CSS custom property format', () => {
    expect(tokenToCssVar('space.inset.200')).toBe('var(--space-inset-200)');
    expect(tokenToCssVar('color.primary')).toBe('var(--color-primary)');
    expect(tokenToCssVar('shadow.container')).toBe('var(--shadow-container)');
  });

  it('handles single-level token names', () => {
    expect(tokenToCssVar('radius-100')).toBe('var(--radius-100)');
  });

  it('handles multi-level token names', () => {
    expect(tokenToCssVar('space.inset.comfortable')).toBe('var(--space-inset-comfortable)');
  });
});

describe('mapPaddingToCSS', () => {
  it('maps padding values to CSS padding with space.inset tokens', () => {
    expect(mapPaddingToCSS('050')).toBe('padding: var(--space-inset-050)');
    expect(mapPaddingToCSS('100')).toBe('padding: var(--space-inset-100)');
    expect(mapPaddingToCSS('150')).toBe('padding: var(--space-inset-150)');
    expect(mapPaddingToCSS('200')).toBe('padding: var(--space-inset-200)');
    expect(mapPaddingToCSS('300')).toBe('padding: var(--space-inset-300)');
    expect(mapPaddingToCSS('400')).toBe('padding: var(--space-inset-400)');
  });

  it('returns empty string for none value', () => {
    expect(mapPaddingToCSS('none')).toBe('');
  });

  it('returns empty string for null value', () => {
    expect(mapPaddingToCSS(null)).toBe('');
  });
});

describe('mapBorderToCSS', () => {
  it('maps border values to CSS border with width and color tokens', () => {
    expect(mapBorderToCSS('default')).toBe('border: var(--border-border-default) solid var(--color-border)');
    expect(mapBorderToCSS('emphasis')).toBe('border: var(--border-border-emphasis) solid var(--color-border)');
    expect(mapBorderToCSS('heavy')).toBe('border: var(--border-border-heavy) solid var(--color-border)');
  });

  it('returns empty string for none value', () => {
    expect(mapBorderToCSS('none')).toBe('');
  });

  it('returns empty string for null value', () => {
    expect(mapBorderToCSS(null)).toBe('');
  });
});

describe('mapBorderRadiusToCSS', () => {
  it('maps border radius values to CSS border-radius with radius tokens', () => {
    expect(mapBorderRadiusToCSS('tight')).toBe('border-radius: var(--radius-050)');
    expect(mapBorderRadiusToCSS('normal')).toBe('border-radius: var(--radius-100)');
    expect(mapBorderRadiusToCSS('loose')).toBe('border-radius: var(--radius-200)');
  });

  it('returns empty string for none value', () => {
    expect(mapBorderRadiusToCSS('none')).toBe('');
  });

  it('returns empty string for null value', () => {
    expect(mapBorderRadiusToCSS(null)).toBe('');
  });
});

describe('mapColorToCSS', () => {
  it('maps color token names to CSS background property', () => {
    expect(mapColorToCSS('color.primary' as ColorTokenName)).toBe('background: var(--color-primary)');
    expect(mapColorToCSS('color.surface' as ColorTokenName)).toBe('background: var(--color-surface)');
    expect(mapColorToCSS('color.background' as ColorTokenName)).toBe('background: var(--color-background)');
  });

  it('returns empty string for null value', () => {
    expect(mapColorToCSS(null)).toBe('');
  });
});

describe('mapShadowToCSS', () => {
  it('maps shadow token names to CSS box-shadow property', () => {
    expect(mapShadowToCSS('shadow.container' as ShadowTokenName)).toBe('box-shadow: var(--shadow-container)');
    expect(mapShadowToCSS('shadow.modal' as ShadowTokenName)).toBe('box-shadow: var(--shadow-modal)');
    expect(mapShadowToCSS('shadow.sunrise' as ShadowTokenName)).toBe('box-shadow: var(--shadow-sunrise)');
  });

  it('returns empty string for null value', () => {
    expect(mapShadowToCSS(null)).toBe('');
  });
});

describe('mapOpacityToCSS', () => {
  it('maps opacity token names to CSS opacity property', () => {
    expect(mapOpacityToCSS('opacity.subtle' as OpacityTokenName)).toBe('opacity: var(--opacity-subtle)');
    expect(mapOpacityToCSS('opacity.medium' as OpacityTokenName)).toBe('opacity: var(--opacity-medium)');
    expect(mapOpacityToCSS('opacity.heavy' as OpacityTokenName)).toBe('opacity: var(--opacity-heavy)');
    expect(mapOpacityToCSS('opacity.ghost' as OpacityTokenName)).toBe('opacity: var(--opacity-ghost)');
  });

  it('defaults to opacity.subtle for null value (cross-platform consistency)', () => {
    expect(mapOpacityToCSS(null)).toBe('opacity: var(--opacity-subtle)');
  });
});

describe('mapLayeringToCSS', () => {
  it('maps layering values to CSS z-index with z-index tokens (web platform)', () => {
    expect(mapLayeringToCSS('container')).toBe('z-index: var(--zIndex-container)');
    expect(mapLayeringToCSS('navigation')).toBe('z-index: var(--zIndex-navigation)');
    expect(mapLayeringToCSS('dropdown')).toBe('z-index: var(--zIndex-dropdown)');
    expect(mapLayeringToCSS('modal')).toBe('z-index: var(--zIndex-modal)');
    expect(mapLayeringToCSS('toast')).toBe('z-index: var(--zIndex-toast)');
    expect(mapLayeringToCSS('tooltip')).toBe('z-index: var(--zIndex-tooltip)');
  });

  it('returns empty string for null value', () => {
    expect(mapLayeringToCSS(null)).toBe('');
  });
});

describe('buildContainerStyles', () => {
  it('builds CSS with single prop (plus default opacity)', () => {
    const styles = buildContainerStyles({
      padding: '200'
    });
    // Opacity is always included with default value
    expect(styles).toContain('padding: var(--space-inset-200)');
    expect(styles).toContain('opacity: var(--opacity-subtle)');
  });

  it('builds CSS with multiple props', () => {
    const styles = buildContainerStyles({
      padding: '200',
      background: 'color.surface' as ColorTokenName,
      shadow: 'shadow.container' as ShadowTokenName,
      borderRadius: 'normal'
    });
    
    expect(styles).toContain('padding: var(--space-inset-200)');
    expect(styles).toContain('background: var(--color-surface)');
    expect(styles).toContain('box-shadow: var(--shadow-container)');
    expect(styles).toContain('border-radius: var(--radius-100)');
  });

  it('builds CSS with all props', () => {
    const styles = buildContainerStyles({
      padding: '300',
      background: 'color.primary' as ColorTokenName,
      shadow: 'shadow.modal' as ShadowTokenName,
      border: 'emphasis',
      borderRadius: 'loose',
      opacity: 'opacity.subtle' as OpacityTokenName,
      layering: 'modal'
    });
    
    expect(styles).toContain('padding: var(--space-inset-300)');
    expect(styles).toContain('background: var(--color-primary)');
    expect(styles).toContain('box-shadow: var(--shadow-modal)');
    expect(styles).toContain('border: var(--border-border-emphasis) solid var(--color-border)');
    expect(styles).toContain('border-radius: var(--radius-200)');
    expect(styles).toContain('opacity: var(--opacity-subtle)');
    expect(styles).toContain('z-index: var(--zIndex-modal)');
  });

  it('omits styles for none values (except default opacity)', () => {
    const styles = buildContainerStyles({
      padding: 'none',
      border: 'none',
      borderRadius: 'none'
    });
    
    // Only opacity is included (with default value)
    expect(styles).toBe('opacity: var(--opacity-subtle)');
  });

  it('omits styles for null values (except opacity which has default)', () => {
    const styles = buildContainerStyles({
      padding: null,
      background: null,
      shadow: null,
      opacity: null
    });
    
    // Opacity defaults to opacity.subtle even when null
    expect(styles).toBe('opacity: var(--opacity-subtle)');
  });

  it('applies default opacity when no props provided', () => {
    const styles = buildContainerStyles({});
    
    // Opacity defaults to opacity.subtle even when not specified
    expect(styles).toBe('opacity: var(--opacity-subtle)');
  });

  it('formats styles with semicolons and newlines', () => {
    const styles = buildContainerStyles({
      padding: '200',
      background: 'color.surface' as ColorTokenName
    });
    
    // Should have semicolon and newline between styles
    expect(styles).toMatch(/padding: var\(--space-inset-200\);\n\s+background: var\(--color-surface\)/);
  });
});

describe('Integration: Token mapping with Container props', () => {
  it('correctly maps all Container prop types to CSS', () => {
    // Test that all prop types are handled correctly
    const props = {
      padding: '200' as PaddingValue,
      background: 'color.primary' as ColorTokenName,
      shadow: 'shadow.container' as ShadowTokenName,
      border: 'default' as BorderValue,
      borderRadius: 'normal' as BorderRadiusValue,
      opacity: 'opacity.subtle' as OpacityTokenName,
      layering: 'navigation' as LayeringValue
    };

    const styles = buildContainerStyles(props);

    // Verify each prop is mapped correctly
    expect(styles).toContain('padding: var(--space-inset-200)');
    expect(styles).toContain('background: var(--color-primary)');
    expect(styles).toContain('box-shadow: var(--shadow-container)');
    expect(styles).toContain('border: var(--border-border-default) solid var(--color-border)');
    expect(styles).toContain('border-radius: var(--radius-100)');
    expect(styles).toContain('opacity: var(--opacity-subtle)');
    expect(styles).toContain('z-index: var(--zIndex-navigation)');
  });

  it('handles partial prop sets correctly', () => {
    // Test with only some props set
    const styles = buildContainerStyles({
      padding: '100',
      borderRadius: 'tight'
    });

    expect(styles).toContain('padding: var(--space-inset-100)');
    expect(styles).toContain('border-radius: var(--radius-050)');
    expect(styles).toContain('opacity: var(--opacity-subtle)'); // Default opacity always included
    expect(styles).not.toContain('background');
    expect(styles).not.toContain('box-shadow');
    expect(styles).not.toContain('border:');
    expect(styles).not.toContain('z-index');
  });
});
