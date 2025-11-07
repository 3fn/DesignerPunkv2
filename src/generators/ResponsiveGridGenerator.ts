/**
 * Responsive Grid Generator
 * 
 * Generates CSS media queries for responsive grid system with:
 * - Progressive column counts (4→8→12→16)
 * - Breakpoint-specific grid spacing (gutters and margins)
 * - CSS custom properties for all values
 */

import { breakpointTokens } from '../tokens/BreakpointTokens';
import { gridSpacingTokens } from '../tokens/semantic/GridSpacingTokens';

export interface ResponsiveGridConfig {
  breakpoint: string;     // References breakpoint token name
  columns: number;        // Progressive column count
  gutter: string;         // References grid gutter token name
  margin: string;         // References grid margin token name
}

/**
 * Responsive grid configurations for each breakpoint
 * Maps breakpoints to column counts and grid spacing tokens
 */
export const responsiveGridConfigs: ResponsiveGridConfig[] = [
  {
    breakpoint: 'breakpointXs',
    columns: 4,
    gutter: 'gridGutterXs',
    margin: 'gridMarginXs'
  },
  {
    breakpoint: 'breakpointSm',
    columns: 8,
    gutter: 'gridGutterSm',
    margin: 'gridMarginSm'
  },
  {
    breakpoint: 'breakpointMd',
    columns: 12,
    gutter: 'gridGutterMd',
    margin: 'gridMarginMd'
  },
  {
    breakpoint: 'breakpointLg',
    columns: 16,
    gutter: 'gridGutterLg',
    margin: 'gridMarginLg'
  }
];

/**
 * Responsive Grid Generator
 * Generates CSS media queries for responsive grid system
 */
export class ResponsiveGridGenerator {
  /**
   * Generate complete responsive grid CSS
   * Includes base grid styles and media queries for all breakpoints
   */
  generateResponsiveGridCSS(): string {
    const lines: string[] = [];

    // Add header comment
    lines.push('/**');
    lines.push(' * Responsive Grid System');
    lines.push(' * Progressive column counts: 4→8→12→16');
    lines.push(' * Grid spacing scales with layout complexity');
    lines.push(' */');
    lines.push('');

    // Add base grid container styles (xs breakpoint - mobile first)
    lines.push(this.generateBaseGridStyles());
    lines.push('');

    // Add media queries for each breakpoint (sm, md, lg)
    // Skip xs since it's the base (mobile-first approach)
    const breakpointsWithMediaQueries = responsiveGridConfigs.slice(1);
    
    for (const config of breakpointsWithMediaQueries) {
      lines.push(this.generateMediaQuery(config));
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Generate base grid container styles (xs breakpoint)
   * Mobile-first approach - xs is the default
   */
  private generateBaseGridStyles(): string {
    const xsConfig = responsiveGridConfigs[0]; // xs breakpoint
    
    return [
      '/* Base Grid Container (xs: 4 columns) */',
      '.grid-container {',
      '  display: grid;',
      `  grid-template-columns: repeat(${xsConfig.columns}, 1fr);`,
      `  gap: var(--${this.toKebabCase(xsConfig.gutter)});`,
      `  margin-inline: var(--${this.toKebabCase(xsConfig.margin)});`,
      '  width: 100%;',
      '  box-sizing: border-box;',
      '}'
    ].join('\n');
  }

  /**
   * Generate media query for a specific breakpoint
   * Applies progressive column count and grid spacing
   */
  private generateMediaQuery(config: ResponsiveGridConfig): string {
    const breakpointToken = breakpointTokens[config.breakpoint];
    
    if (!breakpointToken) {
      throw new Error(`Breakpoint token '${config.breakpoint}' not found`);
    }

    const breakpointValue = breakpointToken.platforms.web.value;
    const breakpointUnit = breakpointToken.platforms.web.unit;
    
    // Get breakpoint label (xs, sm, md, lg)
    const label = config.breakpoint.replace('breakpoint', '').toLowerCase();
    
    return [
      `/* ${label.toUpperCase()} Breakpoint: ${config.columns} columns */`,
      `@media (min-width: ${breakpointValue}${breakpointUnit}) {`,
      '  .grid-container {',
      `    grid-template-columns: repeat(${config.columns}, 1fr);`,
      `    gap: var(--${this.toKebabCase(config.gutter)});`,
      `    margin-inline: var(--${this.toKebabCase(config.margin)});`,
      '  }',
      '}'
    ].join('\n');
  }

  /**
   * Generate grid item styles with column span support
   * Provides utility classes for responsive column spanning
   */
  generateGridItemStyles(): string {
    const lines: string[] = [];

    lines.push('/**');
    lines.push(' * Grid Item Styles');
    lines.push(' * Column span utilities for responsive layouts');
    lines.push(' */');
    lines.push('');

    // Base grid item styles
    lines.push('/* Base Grid Item */');
    lines.push('.grid-item {');
    lines.push('  min-width: 0; /* Prevent overflow */');
    lines.push('  box-sizing: border-box;');
    lines.push('}');
    lines.push('');

    // Generate column span utilities for each breakpoint
    for (const config of responsiveGridConfigs) {
      const label = config.breakpoint.replace('breakpoint', '').toLowerCase();
      const breakpointToken = breakpointTokens[config.breakpoint];
      const breakpointValue = breakpointToken.platforms.web.value;
      const breakpointUnit = breakpointToken.platforms.web.unit;

      lines.push(`/* ${label.toUpperCase()} Column Span Utilities (${config.columns} columns) */`);
      
      if (label === 'xs') {
        // Base styles (no media query for xs)
        for (let span = 1; span <= config.columns; span++) {
          lines.push(`.col-${label}-${span} {`);
          lines.push(`  grid-column: span ${span};`);
          lines.push('}');
        }
      } else {
        // Media query for other breakpoints
        lines.push(`@media (min-width: ${breakpointValue}${breakpointUnit}) {`);
        for (let span = 1; span <= config.columns; span++) {
          lines.push(`  .col-${label}-${span} {`);
          lines.push(`    grid-column: span ${span};`);
          lines.push(`  }`);
        }
        lines.push('}');
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Generate complete responsive grid system CSS
   * Includes container, item, and utility styles
   */
  generateCompleteGridSystem(): string {
    const lines: string[] = [];

    lines.push('/**');
    lines.push(' * DesignerPunk Responsive Grid System');
    lines.push(' * ');
    lines.push(' * Progressive column counts:');
    lines.push(' * - xs (320px): 4 columns');
    lines.push(' * - sm (375px): 8 columns');
    lines.push(' * - md (1024px): 12 columns');
    lines.push(' * - lg (1440px): 16 columns');
    lines.push(' * ');
    lines.push(' * Grid spacing scales with layout complexity');
    lines.push(' * Uses CSS custom properties from design tokens');
    lines.push(' */');
    lines.push('');

    // Add responsive grid container styles
    lines.push(this.generateResponsiveGridCSS());
    lines.push('');

    // Add grid item styles
    lines.push(this.generateGridItemStyles());

    return lines.join('\n');
  }

  /**
   * Convert camelCase to kebab-case
   * Example: gridGutterXs -> grid-gutter-xs
   */
  private toKebabCase(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  /**
   * Validate responsive grid configuration
   * Ensures all referenced tokens exist
   */
  validateConfiguration(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const config of responsiveGridConfigs) {
      // Validate breakpoint token exists
      if (!breakpointTokens[config.breakpoint]) {
        errors.push(`Breakpoint token '${config.breakpoint}' not found`);
      }

      // Validate grid spacing tokens exist
      if (!gridSpacingTokens[config.gutter]) {
        errors.push(`Grid gutter token '${config.gutter}' not found`);
      }

      if (!gridSpacingTokens[config.margin]) {
        errors.push(`Grid margin token '${config.margin}' not found`);
      }

      // Validate column count is positive
      if (config.columns <= 0) {
        errors.push(`Invalid column count ${config.columns} for breakpoint ${config.breakpoint}`);
      }
    }

    // Validate progressive column count (should increase)
    for (let i = 1; i < responsiveGridConfigs.length; i++) {
      const prev = responsiveGridConfigs[i - 1];
      const curr = responsiveGridConfigs[i];
      
      if (curr.columns <= prev.columns) {
        errors.push(
          `Column count should increase progressively: ${prev.breakpoint} (${prev.columns}) -> ${curr.breakpoint} (${curr.columns})`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
