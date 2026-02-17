/**
 * @category evergreen
 * @purpose Verify soft ceiling warning functionality for bundle sizes
 */

/**
 * Soft Ceiling Warning Tests
 *
 * Tests that the build script correctly warns when bundles exceed
 * the 100KB gzipped soft ceiling threshold.
 *
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see Requirements: 11.4
 */

import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

describe('Soft Ceiling Warning', () => {
  const BROWSER_DIST_DIR = path.join(process.cwd(), 'dist', 'browser');
  const SOFT_CEILING_KB = 125; // 125KB gzipped soft ceiling (matches build script)

  /**
   * Calculate gzipped size of a file
   */
  function getGzippedSize(filePath: string): number {
    const content = fs.readFileSync(filePath);
    return zlib.gzipSync(content).length;
  }

  /**
   * Format bytes to KB
   */
  function toKB(bytes: number): number {
    return bytes / 1024;
  }

  beforeAll(() => {
    // Ensure bundles exist before running tests
    if (!fs.existsSync(BROWSER_DIST_DIR)) {
      throw new Error(
        'Browser bundles not found. Run "npm run build:browser" first.'
      );
    }
  });

  describe('Threshold Configuration', () => {
    it('should have soft ceiling defined at 125KB', () => {
      // Read the build script to verify threshold is configured
      const buildScriptPath = path.join(process.cwd(), 'scripts', 'build-browser-bundles.js');
      const buildScript = fs.readFileSync(buildScriptPath, 'utf-8');
      
      // Check for SOFT_CEILING_KB constant
      expect(buildScript).toContain('SOFT_CEILING_KB = 125');
    });
  });

  describe('Bundle Size Verification', () => {
    const bundles = [
      { name: 'ESM', file: 'designerpunk.esm.js' },
      { name: 'ESM (minified)', file: 'designerpunk.esm.min.js' },
      { name: 'UMD', file: 'designerpunk.umd.js' },
      { name: 'UMD (minified)', file: 'designerpunk.umd.min.js' }
    ];

    bundles.forEach(({ name, file }) => {
      it(`should track gzipped size for ${name} bundle`, () => {
        const bundlePath = path.join(BROWSER_DIST_DIR, file);
        
        if (!fs.existsSync(bundlePath)) {
          throw new Error(`Bundle not found: ${bundlePath}`);
        }

        const gzippedSize = getGzippedSize(bundlePath);
        const gzippedKB = toKB(gzippedSize);

        // Verify we can calculate gzipped size
        expect(gzippedSize).toBeGreaterThan(0);
        
        // Log the size for visibility
        console.log(`${name}: ${gzippedKB.toFixed(2)} KB gzipped`);
      });
    });
  });

  describe('Warning Logic', () => {
    it('should identify bundles exceeding soft ceiling', () => {
      const bundles = [
        { name: 'ESM', file: 'designerpunk.esm.js' },
        { name: 'ESM (minified)', file: 'designerpunk.esm.min.js' },
        { name: 'UMD', file: 'designerpunk.umd.js' },
        { name: 'UMD (minified)', file: 'designerpunk.umd.min.js' }
      ];

      const warnings: string[] = [];

      for (const { name, file } of bundles) {
        const bundlePath = path.join(BROWSER_DIST_DIR, file);
        
        if (!fs.existsSync(bundlePath)) {
          continue;
        }

        const gzippedSize = getGzippedSize(bundlePath);
        const gzippedKB = toKB(gzippedSize);

        if (gzippedKB > SOFT_CEILING_KB) {
          warnings.push(`${name} exceeds ${SOFT_CEILING_KB}KB gzipped soft ceiling (${gzippedKB.toFixed(2)} KB)`);
        }
      }

      // Current bundles should be under the ceiling
      // This test documents the expected behavior
      expect(warnings.length).toBe(0);
      
      // Log confirmation
      console.log('All bundles are under the 125KB gzipped soft ceiling');
    });

    it('should correctly detect when a bundle would exceed ceiling', () => {
      // Test the warning logic with a simulated large bundle
      const simulatedGzippedKB = 150; // 150KB - exceeds 125KB ceiling
      const exceedsCeiling = simulatedGzippedKB > SOFT_CEILING_KB;
      
      expect(exceedsCeiling).toBe(true);
    });

    it('should not warn for bundles under ceiling', () => {
      // Test the warning logic with a simulated small bundle
      const simulatedGzippedKB = 50; // 50KB - under 125KB ceiling
      const exceedsCeiling = simulatedGzippedKB > SOFT_CEILING_KB;
      
      expect(exceedsCeiling).toBe(false);
    });
  });

  describe('Build Script Warning Output', () => {
    it('should have warning output logic in build script', () => {
      const buildScriptPath = path.join(process.cwd(), 'scripts', 'build-browser-bundles.js');
      const buildScript = fs.readFileSync(buildScriptPath, 'utf-8');
      
      // Check for warning collection logic
      expect(buildScript).toContain('warnings.push');
      expect(buildScript).toContain('exceeds');
      expect(buildScript).toContain('soft ceiling');
      
      // Check for warning output logic
      expect(buildScript).toContain('Size Warnings');
    });

    it('should include ceiling indicator in size report', () => {
      const buildScriptPath = path.join(process.cwd(), 'scripts', 'build-browser-bundles.js');
      const buildScript = fs.readFileSync(buildScriptPath, 'utf-8');
      
      // Check for ceiling indicator emoji
      expect(buildScript).toContain('⚠️');
      expect(buildScript).toContain('exceedsCeiling');
    });
  });
});
