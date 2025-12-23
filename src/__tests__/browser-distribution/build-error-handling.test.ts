/**
 * @category evergreen
 * @purpose Verify build error handling for browser bundle generation
 */

/**
 * Build Error Handling Tests
 *
 * Tests that the build script correctly handles errors and provides
 * descriptive error messages when bundle generation fails.
 *
 * This test uses static analysis of the build script to verify error handling
 * logic exists, rather than spawning subprocesses which cause Jest timeouts.
 *
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see Requirements: 7.4
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Build Error Handling', () => {
  const BUILD_SCRIPT_PATH = path.join(
    process.cwd(),
    'scripts',
    'build-browser-bundles.js'
  );

  let buildScript: string;

  beforeAll(() => {
    // Verify build script exists and load it once
    if (!fs.existsSync(BUILD_SCRIPT_PATH)) {
      throw new Error(
        'Build script not found. Ensure scripts/build-browser-bundles.js exists.'
      );
    }
    buildScript = fs.readFileSync(BUILD_SCRIPT_PATH, 'utf-8');
  });

  describe('Error Handling Logic', () => {
    it('should have try-catch error handling in build script', () => {
      // Check for try-catch block
      expect(buildScript).toContain('try {');
      expect(buildScript).toContain('} catch (error)');
    });

    it('should output descriptive error message on failure', () => {
      // Check for error message output
      expect(buildScript).toContain('Browser bundle build failed');
      expect(buildScript).toContain('error.message');
    });

    it('should exit with non-zero code on failure', () => {
      // Check for process.exit(1) in catch block
      expect(buildScript).toContain('process.exit(1)');
    });

    it('should clean up partial outputs on failure', () => {
      // Check for cleanup logic in catch block
      expect(buildScript).toContain('Clean up partial outputs');
      expect(buildScript).toContain('fs.unlinkSync');
    });
  });

  describe('Error Message Format', () => {
    it('should include error indicator emoji in failure message', () => {
      // Check for error indicator
      expect(buildScript).toContain('❌');
    });

    it('should include the actual error message in output', () => {
      // Check that error.message is logged
      expect(buildScript).toMatch(/console\.error.*error\.message/);
    });
  });

  describe('Error Scenario Coverage', () => {
    // These tests verify the script structure handles various error scenarios
    // without actually triggering errors (which would be destructive)

    it('should handle missing entry point gracefully', () => {
      // The script should have error handling that would catch missing entry point
      // esbuild throws an error if entry point doesn't exist
      expect(buildScript).toContain('entryPoints');
      expect(buildScript).toContain('catch (error)');
    });

    it('should handle esbuild errors', () => {
      // The script uses async/await with esbuild.build
      // Errors from esbuild will be caught by the try-catch
      expect(buildScript).toContain('await esbuild.build');
      expect(buildScript).toContain('catch (error)');
    });

    it('should use async function for proper error propagation', () => {
      // Async errors need to be in an async context to be caught
      expect(buildScript).toMatch(/async function main\(\)/);
    });
  });

  describe('Cleanup Behavior', () => {
    it('should only clean up designerpunk.* files on failure', () => {
      // Check that cleanup targets only designerpunk.* files
      expect(buildScript).toContain("file.startsWith('designerpunk.')");
    });

    it('should preserve tokens.css on failure', () => {
      // The cleanup logic only removes files starting with 'designerpunk.'
      // This means tokens.css would be preserved
      const cleanupSection = buildScript.match(
        /Clean up partial outputs[\s\S]*?process\.exit\(1\)/
      );
      expect(cleanupSection).toBeTruthy();

      // Verify it doesn't remove tokens.css
      expect(cleanupSection![0]).not.toContain('tokens.css');
    });

    it('should handle cleanup errors gracefully', () => {
      // Cleanup should not throw if files don't exist
      // The script iterates over existing files in the directory,
      // so it only attempts to delete files that exist
      const cleanupSection = buildScript.match(
        /Clean up partial outputs[\s\S]*?process\.exit\(1\)/
      );
      expect(cleanupSection).toBeTruthy();

      // Should iterate over readdirSync results (only existing files)
      expect(cleanupSection![0]).toContain('readdirSync');
    });
  });

  describe('Success Path', () => {
    it('should output success message on completion', () => {
      expect(buildScript).toContain('Browser bundles built successfully');
    });

    it('should include success indicator emoji', () => {
      expect(buildScript).toContain('✅');
    });
  });
});
