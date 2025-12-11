/**
 * Container Cleanup Tests
 * 
 * TEMPORARY: These tests verify hard-coded values have been replaced with tokens.
 * These tests will be deleted after cleanup is complete (Task 6.2).
 * 
 * Purpose: Provide immediate feedback during cleanup process
 * Scope: Validates token replacements, not component behavior
 * 
 * @see .kiro/specs/017-component-code-quality-sweep/tasks.md Task 5.3
 */

import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('Container Cleanup Tests (TEMPORARY)', () => {
  describe('Android TokenMapping.kt', () => {
    const tokenMappingPath = path.join(
      __dirname,
      '../platforms/android/TokenMapping.kt'
    );
    const tokenMappingContent = fs.readFileSync(tokenMappingPath, 'utf-8');

    it('should not have hard-coded 0.dp values in token constant definitions', () => {
      // Check that private val declarations don't use hard-coded 0.dp
      // Note: 0.dp in when expressions for "None" enum values is legitimate
      // Also note: DesignTokens.xxx_050.dp is correct (token reference, not hard-coded)
      const privateValLines = tokenMappingContent
        .split('\n')
        .filter(line => line.trim().startsWith('private val'));
      
      const hardCodedZeroDp = privateValLines.filter(line => 
        line.includes('= 0.dp') && !line.includes('// Legitimate')
      );

      expect(hardCodedZeroDp).toHaveLength(0);
    });

    it('should not have hard-coded border width values (1.dp, 2.dp, 4.dp)', () => {
      // Check private val declarations for hard-coded border widths
      const borderTokenLines = tokenMappingContent
        .split('\n')
        .filter(line => 
          line.includes('private val border') && 
          (line.includes('1.dp') || line.includes('2.dp') || line.includes('4.dp'))
        );

      expect(borderTokenLines).toHaveLength(0);
    });

    it('should not have hard-coded radius values (4.dp, 8.dp, 16.dp)', () => {
      // Check private val declarations for hard-coded radius values
      const radiusTokenLines = tokenMappingContent
        .split('\n')
        .filter(line => 
          line.includes('private val radius') && 
          (line.includes('4.dp') || line.includes('8.dp') || line.includes('16.dp'))
        );

      expect(radiusTokenLines).toHaveLength(0);
    });

    it('should not have hard-coded elevation values (2.dp, 4.dp, 8.dp, 16.dp, 24.dp)', () => {
      // Check private val declarations for hard-coded elevation values
      const elevationTokenLines = tokenMappingContent
        .split('\n')
        .filter(line => 
          line.includes('private val elevation') && 
          (line.includes('2.dp') || line.includes('4.dp') || 
           line.includes('8.dp') || line.includes('16.dp') || line.includes('24.dp'))
        );

      expect(elevationTokenLines).toHaveLength(0);
    });

    it('should not have hard-coded spacing values in inset tokens (4.dp, 8.dp, 12.dp, 16.dp, 24.dp, 32.dp)', () => {
      // Check private val declarations for hard-coded spacing values
      const spaceInsetLines = tokenMappingContent
        .split('\n')
        .filter(line => 
          line.includes('private val spaceInset') && 
          (line.includes('4.dp') || line.includes('8.dp') || line.includes('12.dp') ||
           line.includes('16.dp') || line.includes('24.dp') || line.includes('32.dp'))
        );

      expect(spaceInsetLines).toHaveLength(0);
    });

    it('should not have hard-coded color values (Color(0xRRGGBB))', () => {
      // Check for hard-coded Color(0xRRGGBB) pattern
      const colorPattern = /Color\(0x[0-9A-F]{8}\)/gi;
      const hardCodedColors = tokenMappingContent.match(colorPattern);

      expect(hardCodedColors).toBeNull();
    });
  });

  describe('Web Container.web.ts', () => {
    const webComponentPath = path.join(
      __dirname,
      '../platforms/web/Container.web.ts'
    );
    const webComponentContent = fs.readFileSync(webComponentPath, 'utf-8');

    it('should not have hard-coded 2px for focus outline width', () => {
      // Check for hard-coded 2px in focus outline styles
      const focusOutlineLines = webComponentContent
        .split('\n')
        .filter(line => 
          line.includes('outline:') && 
          line.includes('2px') &&
          !line.includes('var(--')
        );

      expect(focusOutlineLines).toHaveLength(0);
    });

    it('should not have hard-coded 2px for high contrast border width', () => {
      // Check for hard-coded 2px in high contrast media query
      const highContrastLines = webComponentContent
        .split('\n')
        .filter(line => 
          line.includes('border-width:') && 
          line.includes('2px') &&
          !line.includes('var(--')
        );

      expect(highContrastLines).toHaveLength(0);
    });

    it('should use CSS custom properties for all spacing values', () => {
      // Check that focus outline offset uses CSS custom property
      const outlineOffsetLines = webComponentContent
        .split('\n')
        .filter(line => 
          line.includes('outline-offset:') && 
          !line.includes('var(--')
        );

      // Should be 0 lines with hard-coded outline-offset
      expect(outlineOffsetLines).toHaveLength(0);
    });
  });
});
