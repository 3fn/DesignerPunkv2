/**
 * TEMPORARY CLEANUP-SPECIFIC TESTS
 * 
 * These tests verify token replacements during the component code quality sweep.
 * They will be deleted after cleanup is complete (Task 6.2).
 * 
 * Purpose: Provide immediate feedback during token replacement to ensure:
 * - Hard-coded values are replaced with token references
 * - Fallback patterns are removed
 * - Components fail loudly when tokens are missing
 * 
 * DO NOT maintain these tests long-term - they are cleanup-specific only.
 */

import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('Icon Component Token Cleanup', () => {
  describe('Web Platform', () => {
    it('should not have fallback patterns in backward-compatibility test', () => {
      const testFile = fs.readFileSync(
        path.join(__dirname, '../platforms/web/__tests__/Icon.backward-compatibility.test.ts'),
        'utf-8'
      );

      // Should not have ternary fallback pattern for icon size
      expect(testFile).not.toMatch(/\?\s*32\s*:\s*24/);
      expect(testFile).not.toMatch(/buttonSize\s*===\s*['"]large['"]\s*\?\s*32\s*:\s*24/);
    });

    it('should not have hard-coded spacing in web test assertions', () => {
      const testFile = fs.readFileSync(
        path.join(__dirname, '../platforms/web/__tests__/Icon.web.test.ts'),
        'utf-8'
      );

      // Should not have hard-coded 8px in test assertions
      // Note: This checks for the specific pattern in the test assertion
      expect(testFile).not.toMatch(/expect\(result\)\.toContain\(['"]margin-right:\s*8px['"]\)/);
    });
  });

  describe('Android Platform', () => {
    it('should not have hard-coded dp values in documentation comments', () => {
      const androidFile = fs.readFileSync(
        path.join(__dirname, '../platforms/android/Icon.android.kt'),
        'utf-8'
      );

      // Check for hard-coded dp values in comments
      // These should be replaced with token references or descriptions
      const commentLines = androidFile.split('\n').filter(line => line.trim().startsWith('*'));
      
      // Should not have bare dp values like "16.dp" in comments
      // Allow "DesignTokens.icon_size_xxx.dp" pattern
      const hardCodedDpPattern = /\b(16|24|32|40)\.dp\b(?!.*DesignTokens)/;
      const violatingLines = commentLines.filter(line => hardCodedDpPattern.test(line));
      
      if (violatingLines.length > 0) {
        console.log('Found hard-coded dp values in comments:');
        violatingLines.forEach(line => console.log('  ', line.trim()));
      }
      
      expect(violatingLines.length).toBe(0);
    });

    it('should not have hard-coded dp values in preview examples', () => {
      const androidFile = fs.readFileSync(
        path.join(__dirname, '../platforms/android/Icon.android.kt'),
        'utf-8'
      );

      // Extract preview function content
      const previewMatch = androidFile.match(/@Preview[\s\S]*?fun IconPreview\(\)[\s\S]*?\n\}/);
      
      if (previewMatch) {
        const previewContent = previewMatch[0];
        
        // Should not have hard-coded dp values in preview
        // Allow "DesignTokens.icon_size_xxx.dp" pattern
        const hardCodedDpPattern = /Icon\([^)]*size\s*=\s*(16|24|32|40)\.dp/g;
        const matches = previewContent.match(hardCodedDpPattern);
        
        if (matches) {
          console.log('Found hard-coded dp values in preview:');
          matches.forEach(match => console.log('  ', match));
        }
        
        expect(matches).toBeNull();
      }
    });
  });

  describe('Token References', () => {
    it('should use icon size tokens for web', () => {
      const webFile = fs.readFileSync(
        path.join(__dirname, '../platforms/web/Icon.web.ts'),
        'utf-8'
      );

      // Should reference icon size tokens from design system
      // This is a positive check - we expect to find token references
      expect(webFile).toMatch(/iconSize100|iconSize125|icon\.size/);
    });

    it('should use icon size tokens for Android', () => {
      const androidFile = fs.readFileSync(
        path.join(__dirname, '../platforms/android/Icon.android.kt'),
        'utf-8'
      );

      // Should reference DesignTokens for icon sizes
      // This is a positive check - we expect to find token references
      expect(androidFile).toMatch(/DesignTokens\.(icon_size|space_)/);
    });
  });
});
