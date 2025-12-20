/**
 * @category evergreen
 * @purpose Verify ResponsiveGridGeneration generator produces correct output format
 */
/**
 * Responsive Grid Generation Tests
 * 
 * Tests for responsive grid CSS generation with:
 * - Progressive column counts (4→8→12→16)
 * - Breakpoint-specific grid spacing
 * - CSS custom properties
 */

import { ResponsiveGridGenerator, responsiveGridConfigs } from '../ResponsiveGridGenerator';
import { breakpointTokens } from '../../tokens/BreakpointTokens';
import { gridSpacingTokens } from '../../tokens/semantic/GridSpacingTokens';

describe('ResponsiveGridGenerator', () => {
  let generator: ResponsiveGridGenerator;

  beforeEach(() => {
    generator = new ResponsiveGridGenerator();
  });

  describe('Configuration Validation', () => {
    it('should validate responsive grid configuration successfully', () => {
      const result = generator.validateConfiguration();
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should have 4 breakpoint configurations', () => {
      expect(responsiveGridConfigs).toHaveLength(4);
    });

    it('should have progressive column counts (4→8→12→16)', () => {
      expect(responsiveGridConfigs[0].columns).toBe(4);  // xs
      expect(responsiveGridConfigs[1].columns).toBe(8);  // sm
      expect(responsiveGridConfigs[2].columns).toBe(12); // md
      expect(responsiveGridConfigs[3].columns).toBe(16); // lg
    });

    it('should reference valid breakpoint tokens', () => {
      for (const config of responsiveGridConfigs) {
        expect(breakpointTokens[config.breakpoint]).toBeDefined();
      }
    });

    it('should reference valid grid spacing tokens', () => {
      for (const config of responsiveGridConfigs) {
        expect(gridSpacingTokens[config.gutter]).toBeDefined();
        expect(gridSpacingTokens[config.margin]).toBeDefined();
      }
    });
  });

  describe('Base Grid Styles', () => {
    it('should generate base grid container styles', () => {
      const css = generator.generateResponsiveGridCSS();
      
      expect(css).toContain('.grid-container');
      expect(css).toContain('display: grid;');
      expect(css).toContain('grid-template-columns: repeat(4, 1fr);'); // xs: 4 columns
    });

    it('should use CSS custom properties for grid spacing', () => {
      const css = generator.generateResponsiveGridCSS();
      
      expect(css).toContain('var(--grid-gutter-xs)');
      expect(css).toContain('var(--grid-margin-xs)');
    });

    it('should include width and box-sizing properties', () => {
      const css = generator.generateResponsiveGridCSS();
      
      expect(css).toContain('width: 100%;');
      expect(css).toContain('box-sizing: border-box;');
    });
  });

  describe('Media Queries', () => {
    it('should generate media queries for sm, md, lg breakpoints', () => {
      const css = generator.generateResponsiveGridCSS();
      
      // Should have 3 media queries (sm, md, lg - xs is base)
      const mediaQueryCount = (css.match(/@media/g) || []).length;
      expect(mediaQueryCount).toBe(3);
    });

    it('should use correct breakpoint values in media queries', () => {
      const css = generator.generateResponsiveGridCSS();
      
      // sm: 375px
      expect(css).toContain('@media (min-width: 375px)');
      
      // md: 1024px
      expect(css).toContain('@media (min-width: 1024px)');
      
      // lg: 1440px
      expect(css).toContain('@media (min-width: 1440px)');
    });

    it('should apply progressive column counts in media queries', () => {
      const css = generator.generateResponsiveGridCSS();
      
      // Check that each breakpoint has correct column count
      expect(css).toContain('grid-template-columns: repeat(8, 1fr);');  // sm
      expect(css).toContain('grid-template-columns: repeat(12, 1fr);'); // md
      expect(css).toContain('grid-template-columns: repeat(16, 1fr);'); // lg
    });

    it('should apply appropriate grid spacing at each breakpoint', () => {
      const css = generator.generateResponsiveGridCSS();
      
      // sm breakpoint
      expect(css).toContain('var(--grid-gutter-sm)');
      expect(css).toContain('var(--grid-margin-sm)');
      
      // md breakpoint
      expect(css).toContain('var(--grid-gutter-md)');
      expect(css).toContain('var(--grid-margin-md)');
      
      // lg breakpoint
      expect(css).toContain('var(--grid-gutter-lg)');
      expect(css).toContain('var(--grid-margin-lg)');
    });

    it('should include breakpoint labels in comments', () => {
      const css = generator.generateResponsiveGridCSS();
      
      expect(css).toContain('SM Breakpoint');
      expect(css).toContain('MD Breakpoint');
      expect(css).toContain('LG Breakpoint');
    });
  });

  describe('Grid Item Styles', () => {
    it('should generate base grid item styles', () => {
      const css = generator.generateGridItemStyles();
      
      expect(css).toContain('.grid-item');
      expect(css).toContain('min-width: 0;');
      expect(css).toContain('box-sizing: border-box;');
    });

    it('should generate column span utilities for all breakpoints', () => {
      const css = generator.generateGridItemStyles();
      
      // xs: 4 columns
      expect(css).toContain('.col-xs-1');
      expect(css).toContain('.col-xs-4');
      
      // sm: 8 columns
      expect(css).toContain('.col-sm-1');
      expect(css).toContain('.col-sm-8');
      
      // md: 12 columns
      expect(css).toContain('.col-md-1');
      expect(css).toContain('.col-md-12');
      
      // lg: 16 columns
      expect(css).toContain('.col-lg-1');
      expect(css).toContain('.col-lg-16');
    });

    it('should use grid-column span for column utilities', () => {
      const css = generator.generateGridItemStyles();
      
      expect(css).toContain('grid-column: span 1;');
      expect(css).toContain('grid-column: span 4;');
      expect(css).toContain('grid-column: span 8;');
      expect(css).toContain('grid-column: span 12;');
      expect(css).toContain('grid-column: span 16;');
    });

    it('should wrap non-xs column utilities in media queries', () => {
      const css = generator.generateGridItemStyles();
      
      // xs utilities should not be in media query
      const xsSection = css.substring(
        css.indexOf('/* XS Column Span'),
        css.indexOf('/* SM Column Span')
      );
      expect(xsSection).not.toContain('@media');
      
      // sm, md, lg utilities should be in media queries
      expect(css).toContain('@media (min-width: 375px)'); // sm
      expect(css).toContain('@media (min-width: 1024px)'); // md
      expect(css).toContain('@media (min-width: 1440px)'); // lg
    });
  });

  describe('Complete Grid System', () => {
    it('should generate complete grid system CSS', () => {
      const css = generator.generateCompleteGridSystem();
      
      expect(css).toContain('DesignerPunk Responsive Grid System');
      expect(css).toContain('.grid-container');
      expect(css).toContain('.grid-item');
    });

    it('should include documentation in header', () => {
      const css = generator.generateCompleteGridSystem();
      
      expect(css).toContain('Progressive column counts');
      expect(css).toContain('xs (320px): 4 columns');
      expect(css).toContain('sm (375px): 8 columns');
      expect(css).toContain('md (1024px): 12 columns');
      expect(css).toContain('lg (1440px): 16 columns');
    });

    it('should be valid CSS syntax', () => {
      const css = generator.generateCompleteGridSystem();
      
      // Check balanced braces
      const openBraces = (css.match(/{/g) || []).length;
      const closeBraces = (css.match(/}/g) || []).length;
      expect(openBraces).toBe(closeBraces);
      
      // Check for CSS selectors
      expect(css).toMatch(/\.[a-z-]+\s*{/);
      
      // Check for CSS properties
      expect(css).toMatch(/[a-z-]+:\s*[^;]+;/);
    });
  });

  describe('CSS Custom Properties Integration', () => {
    it('should reference all grid spacing tokens', () => {
      const css = generator.generateCompleteGridSystem();
      
      // Gutter tokens
      expect(css).toContain('--grid-gutter-xs');
      expect(css).toContain('--grid-gutter-sm');
      expect(css).toContain('--grid-gutter-md');
      expect(css).toContain('--grid-gutter-lg');
      
      // Margin tokens
      expect(css).toContain('--grid-margin-xs');
      expect(css).toContain('--grid-margin-sm');
      expect(css).toContain('--grid-margin-md');
      expect(css).toContain('--grid-margin-lg');
    });

    it('should use var() syntax for CSS custom properties', () => {
      const css = generator.generateCompleteGridSystem();
      
      expect(css).toMatch(/var\(--grid-gutter-[a-z]+\)/);
      expect(css).toMatch(/var\(--grid-margin-[a-z]+\)/);
    });
  });

  describe('Responsive Behavior', () => {
    it('should implement mobile-first approach', () => {
      const css = generator.generateResponsiveGridCSS();
      
      // Base styles should be for xs (smallest breakpoint)
      const baseSection = css.substring(0, css.indexOf('@media'));
      expect(baseSection).toContain('grid-template-columns: repeat(4, 1fr);');
      expect(baseSection).toContain('var(--grid-gutter-xs)');
    });

    it('should have min-width media queries (mobile-first)', () => {
      const css = generator.generateResponsiveGridCSS();
      
      // All media queries should use min-width
      const mediaQueries = css.match(/@media[^{]+/g) || [];
      for (const query of mediaQueries) {
        expect(query).toContain('min-width');
        expect(query).not.toContain('max-width');
      }
    });

    it('should scale grid spacing with layout complexity', () => {
      const css = generator.generateResponsiveGridCSS();
      
      // Verify that gutter and margin tokens scale appropriately
      // xs: gridGutterXs (16px), gridMarginXs (24px)
      // sm: gridGutterSm (20px), gridMarginSm (24px) - using space300 instead of space350
      // md: gridGutterMd (24px), gridMarginMd (32px)
      // lg: gridGutterLg (32px), gridMarginLg (40px)
      
      // Check that each breakpoint references its corresponding tokens
      expect(css).toContain('var(--grid-gutter-xs)');
      expect(css).toContain('var(--grid-gutter-sm)');
      expect(css).toContain('var(--grid-gutter-md)');
      expect(css).toContain('var(--grid-gutter-lg)');
    });
  });
});
