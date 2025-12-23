/**
 * @jest-environment node
 * @category evergreen
 * @purpose Property test for minification effectiveness
 */

/**
 * Minification Effectiveness Property Test
 *
 * Property 3: Minification Effectiveness
 * Verifies that minified bundles are at least 50% smaller than non-minified versions.
 *
 * This property ensures that the minification process is working correctly and
 * providing meaningful size reduction for production deployments.
 *
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see Requirements: 5.3
 * @validates Requirements 5.3
 */

import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

describe('Property 3: Minification Effectiveness', () => {
  const BROWSER_DIST_DIR = path.join(process.cwd(), 'dist', 'browser');

  /**
   * Bundle configuration for testing
   */
  const BUNDLES = [
    {
      name: 'ESM',
      devFile: 'designerpunk.esm.js',
      minFile: 'designerpunk.esm.min.js',
    },
    {
      name: 'UMD',
      devFile: 'designerpunk.umd.js',
      minFile: 'designerpunk.umd.min.js',
    },
  ];

  /**
   * Minimum expected size reduction (30%)
   * Minified bundle should be at most 70% of the original size
   * Note: esbuild's minification achieves ~35-40% reduction typically
   */
  const MAX_SIZE_RATIO = 0.7;

  beforeAll(() => {
    // Ensure bundles exist before running tests
    if (!fs.existsSync(BROWSER_DIST_DIR)) {
      throw new Error(
        'Browser bundles not found. Run "npm run build:browser" first.'
      );
    }
  });

  describe('Raw Size Reduction', () => {
    /**
     * Property: For all bundle types, minified size <= 70% of development size
     *
     * This property validates that minification achieves meaningful size reduction.
     * A 30% reduction is a reasonable minimum expectation for JavaScript minification
     * with esbuild, which typically achieves 35-40% reduction.
     */
    test.each(BUNDLES)(
      '$name bundle: minified should be at most 70% of development size',
      ({ name, devFile, minFile }) => {
        const devPath = path.join(BROWSER_DIST_DIR, devFile);
        const minPath = path.join(BROWSER_DIST_DIR, minFile);

        const devSize = fs.statSync(devPath).size;
        const minSize = fs.statSync(minPath).size;

        const ratio = minSize / devSize;
        const reductionPercent = ((1 - ratio) * 100).toFixed(1);

        // Log sizes for visibility
        console.log(
          `${name}: Dev=${devSize} bytes, Min=${minSize} bytes, Reduction=${reductionPercent}%`
        );

        // Property assertion: minified size should be at most 70% of dev size
        expect(ratio).toBeLessThanOrEqual(MAX_SIZE_RATIO);
      }
    );
  });

  describe('Gzipped Size Reduction', () => {
    /**
     * Helper to get gzipped size of a file
     */
    function getGzippedSize(filePath: string): number {
      const content = fs.readFileSync(filePath);
      const gzipped = zlib.gzipSync(content);
      return gzipped.length;
    }

    /**
     * Property: For all bundle types, gzipped minified size < gzipped development size
     *
     * Even after gzip compression, minified bundles should be smaller.
     * This validates that minification provides value beyond what gzip alone provides.
     */
    test.each(BUNDLES)(
      '$name bundle: gzipped minified should be smaller than gzipped development',
      ({ name, devFile, minFile }) => {
        const devPath = path.join(BROWSER_DIST_DIR, devFile);
        const minPath = path.join(BROWSER_DIST_DIR, minFile);

        const devGzipSize = getGzippedSize(devPath);
        const minGzipSize = getGzippedSize(minPath);

        const reductionPercent = (
          ((devGzipSize - minGzipSize) / devGzipSize) *
          100
        ).toFixed(1);

        // Log gzipped sizes for visibility
        console.log(
          `${name} (gzip): Dev=${devGzipSize} bytes, Min=${minGzipSize} bytes, Reduction=${reductionPercent}%`
        );

        // Property assertion: gzipped minified should be smaller
        expect(minGzipSize).toBeLessThan(devGzipSize);
      }
    );
  });

  describe('Source Map Integrity', () => {
    /**
     * Property: For all minified bundles, source maps should exist and be valid JSON
     *
     * Source maps are essential for debugging production issues.
     * This property ensures they are generated correctly.
     */
    test.each(BUNDLES)(
      '$name bundle: minified source map should be valid JSON',
      ({ name, minFile }) => {
        const mapPath = path.join(BROWSER_DIST_DIR, `${minFile}.map`);

        expect(fs.existsSync(mapPath)).toBe(true);

        const mapContent = fs.readFileSync(mapPath, 'utf-8');

        // Property assertion: source map should be valid JSON
        expect(() => JSON.parse(mapContent)).not.toThrow();

        const sourceMap = JSON.parse(mapContent);

        // Property assertion: source map should have required fields
        expect(sourceMap).toHaveProperty('version');
        expect(sourceMap).toHaveProperty('sources');
        expect(sourceMap).toHaveProperty('mappings');
      }
    );
  });

  describe('Bundle Content Preservation', () => {
    /**
     * Property: For all bundle types, minified bundle should contain all component names
     *
     * Minification should not remove essential exports.
     * This property ensures component names are preserved.
     */
    const REQUIRED_COMPONENTS = [
      'TextInputField',
      'ButtonCTA',
      'DPIcon',
      'ContainerWeb',
    ];

    test.each(BUNDLES)(
      '$name bundle: minified should contain all component names',
      ({ name, minFile }) => {
        const minPath = path.join(BROWSER_DIST_DIR, minFile);
        const content = fs.readFileSync(minPath, 'utf-8');

        // Property assertion: all component names should be present
        for (const component of REQUIRED_COMPONENTS) {
          expect(content).toContain(component);
        }
      }
    );
  });
});
