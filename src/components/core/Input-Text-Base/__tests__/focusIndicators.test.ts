/**
 * @jest-environment jsdom
 */

/**
 * @category evergreen
 * @purpose Verify focusIndicators component renders correctly and behaves as expected
 */

/**
 * Focus Indicators Tests
 * 
 * Tests for Input-Text-Base focus ring indicators using accessibility tokens.
 * Verifies WCAG 2.4.7 Focus Visible compliance.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * 
 * Note: CSS is now in an external file (InputTextBase.web.css) and imported
 * as a string. In Jest, CSS imports are mocked to return empty strings.
 * Tests that need to verify CSS content read the CSS file directly.
 * 
 * Requirements: 2.2, 5.2, 5.3, 5.4, 6.4, 7.3, R3
 * Ported from: TextInputField/__tests__/focusIndicators.test.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { InputTextBase } from '../platforms/web/InputTextBase.web';
import { setupBlendColorProperties, cleanupBlendColorProperties } from './test-utils';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Read the actual CSS file content for CSS validation tests.
 * 
 * In Jest, CSS imports are mocked to return empty strings for performance.
 * Tests that need to verify CSS content read the file directly.
 * 
 * @see Requirements: 5.2, 5.3, 5.4 (external CSS file with esbuild plugin pattern)
 */
function readCSSFileContent(): string {
  const cssPath = path.resolve(process.cwd(), 'src/components/core/Input-Text-Base/platforms/web/InputTextBase.web.css');
  if (fs.existsSync(cssPath)) {
    return fs.readFileSync(cssPath, 'utf-8');
  }
  return '';
}

/**
 * Read the TypeScript source file for implementation validation.
 */
function readTSFileContent(): string {
  const tsPath = path.resolve(process.cwd(), 'src/components/core/Input-Text-Base/platforms/web/InputTextBase.web.ts');
  if (fs.existsSync(tsPath)) {
    return fs.readFileSync(tsPath, 'utf-8');
  }
  return '';
}

// Cache file contents to avoid repeated reads
let cachedCSSContent: string | null = null;
let cachedTSContent: string | null = null;

function getCSSContent(): string {
  if (cachedCSSContent === null) {
    cachedCSSContent = readCSSFileContent();
  }
  return cachedCSSContent;
}

function getTSContent(): string {
  if (cachedTSContent === null) {
    cachedTSContent = readTSFileContent();
  }
  return cachedTSContent;
}

describe('Input-Text-Base Focus Indicators', () => {
  beforeEach(() => {
    // Set up CSS custom properties required for blend utilities
    setupBlendColorProperties();
    
    // Register custom element if not already registered
    if (!customElements.get('input-text-base')) {
      customElements.define('input-text-base', InputTextBase);
    }
  });

  afterEach(() => {
    // Clean up CSS custom properties
    cleanupBlendColorProperties();
  });

  describe('Focus Ring Token Usage', () => {
    it('should use accessibility.focus.width token for focus ring width', () => {
      // Verify token reference exists in tokens.ts
      const { accessibilityTokens } = require('../tokens');
      
      expect(accessibilityTokens.focusWidth).toBe('accessibility.focus.width');
    });
    
    it('should use accessibility.focus.color token for focus ring color', () => {
      // Verify token reference exists in tokens.ts
      const { accessibilityTokens } = require('../tokens');
      
      expect(accessibilityTokens.focusColor).toBe('accessibility.focus.color');
    });
    
    it('should use accessibility.focus.offset token for focus ring offset', () => {
      // Verify token reference exists in tokens.ts
      const { accessibilityTokens } = require('../tokens');
      
      expect(accessibilityTokens.focusOffset).toBe('accessibility.focus.offset');
    });
  });
  
  describe('Web Platform Focus Ring', () => {
    it('should have focus-visible styles with accessibility tokens', () => {
      // Read CSS file directly (Jest mocks CSS imports to empty strings)
      const cssContent = getCSSContent();
      
      // Verify focus-visible selector exists
      expect(cssContent).toContain(':focus-visible');
      
      // Verify accessibility.focus.width token is used
      expect(cssContent).toContain('var(--accessibility-focus-width');
      
      // Verify accessibility.focus.color token is used
      expect(cssContent).toContain('var(--accessibility-focus-color');
      
      // Verify accessibility.focus.offset token is used
      expect(cssContent).toContain('var(--accessibility-focus-offset');
    });
    
    it('should have focus ring visible in error state', () => {
      // Read CSS file directly (Jest mocks CSS imports to empty strings)
      const cssContent = getCSSContent();
      
      // Verify focus ring is visible in error state
      expect(cssContent).toContain('.input-wrapper.error .input-element:focus-visible');
    });
    
    it('should have focus ring visible in success state', () => {
      // Read CSS file directly (Jest mocks CSS imports to empty strings)
      const cssContent = getCSSContent();
      
      // Verify focus ring is visible in success state
      expect(cssContent).toContain('.input-wrapper.success .input-element:focus-visible');
    });
  });
  
  describe('iOS Platform Focus Ring', () => {
    it('should have focus ring overlay with accessibility tokens', () => {
      // Read iOS component implementation
      const fs = require('fs');
      const path = require('path');
      const iosComponentPath = path.join(__dirname, '../platforms/ios/InputTextBase.ios.swift');
      const iosComponentContent = fs.readFileSync(iosComponentPath, 'utf-8');
      
      // Verify accessibility tokens are used (nested structure)
      expect(iosComponentContent).toContain('accessibility.focus.width');
      expect(iosComponentContent).toContain('accessibility.focus.offset');
      
      // Verify focus ring is visible when focused (and not disabled)
      expect(iosComponentContent).toContain('.opacity(isFocused && !isDisabled ? 1 : 0)');
    });
    
    it('should have focus ring animation that respects reduce motion', () => {
      // Read iOS component implementation
      const fs = require('fs');
      const path = require('path');
      const iosComponentPath = path.join(__dirname, '../platforms/ios/InputTextBase.ios.swift');
      const iosComponentContent = fs.readFileSync(iosComponentPath, 'utf-8');
      
      // Verify animation respects reduce motion
      expect(iosComponentContent).toContain('reduceMotion ? .none');
    });
  });
  
  describe('Android Platform Focus Ring', () => {
    it('should have focus ring border with accessibility tokens', () => {
      // Read Android component implementation
      const fs = require('fs');
      const path = require('path');
      const androidComponentPath = path.join(__dirname, '../platforms/android/InputTextBase.android.kt');
      const androidComponentContent = fs.readFileSync(androidComponentPath, 'utf-8');
      
      // Verify accessibility tokens are used
      expect(androidComponentContent).toContain('accessibilityFocusWidth');
      expect(androidComponentContent).toContain('accessibilityFocusColor');
      expect(androidComponentContent).toContain('accessibilityFocusOffset');
      
      // Verify focus ring is conditional on focus state (and not disabled)
      expect(androidComponentContent).toContain('if (isFocused && !isDisabled)');
    });
  });
  
  describe('Focus Ring Visibility', () => {
    it('should have focus ring visible in all component states', () => {
      // This test verifies that focus ring implementation doesn't exclude any states
      
      // Read CSS file directly (Jest mocks CSS imports to empty strings)
      const cssContent = getCSSContent();
      
      // Read iOS and Android implementations
      const iosPath = path.join(__dirname, '../platforms/ios/InputTextBase.ios.swift');
      const androidPath = path.join(__dirname, '../platforms/android/InputTextBase.android.kt');
      
      const iosContent = fs.readFileSync(iosPath, 'utf-8');
      const androidContent = fs.readFileSync(androidPath, 'utf-8');
      
      // Web: Verify focus ring works in error and success states
      expect(cssContent).toContain('.input-wrapper.error .input-element:focus-visible');
      expect(cssContent).toContain('.input-wrapper.success .input-element:focus-visible');
      
      // iOS: Verify focus ring is not conditional on error/success state
      // (it should always show when focused, regardless of validation state)
      // Note: Focus ring is hidden when disabled (isDisabled check is expected)
      // Find the focus ring section in the InputTextBaseFieldStyle
      const iosFocusRingSection = iosContent.substring(
        iosContent.indexOf('.opacity(isFocused && !isDisabled ? 1 : 0)'),
        iosContent.indexOf('.opacity(isFocused && !isDisabled ? 1 : 0)') + 200
      );
      expect(iosFocusRingSection).toContain('.opacity(isFocused && !isDisabled ? 1 : 0)');
      
      // Android: Verify focus ring is conditional on focus state (and not disabled)
      expect(androidContent).toContain('if (isFocused && !isDisabled)');
    });
  });
  
  describe('WCAG 2.4.7 Focus Visible Compliance', () => {
    it('should have focus ring implementation in all platforms', () => {
      // Read CSS file directly (Jest mocks CSS imports to empty strings)
      const cssContent = getCSSContent();
      
      // Read iOS and Android implementations
      const iosPath = path.join(__dirname, '../platforms/ios/InputTextBase.ios.swift');
      const androidPath = path.join(__dirname, '../platforms/android/InputTextBase.android.kt');
      
      const iosContent = fs.readFileSync(iosPath, 'utf-8');
      const androidContent = fs.readFileSync(androidPath, 'utf-8');
      
      // Verify focus ring implementation exists in all platforms
      // Web: Uses :focus-visible pseudo-class
      expect(cssContent).toContain(':focus-visible');
      
      // iOS: Uses overlay with opacity based on focus state
      expect(iosContent).toContain('.opacity(isFocused && !isDisabled ? 1 : 0)');
      
      // Android: Uses conditional border based on focus state
      expect(androidContent).toContain('if (isFocused && !isDisabled)');
    });

    it('should document WCAG 2.4.7 compliance in behavioral contracts', () => {
      // Read TypeScript file for behavioral contracts
      const tsContent = getTSContent();
      
      // Read iOS and Android implementations
      const iosPath = path.join(__dirname, '../platforms/ios/InputTextBase.ios.swift');
      const androidPath = path.join(__dirname, '../platforms/android/InputTextBase.android.kt');
      
      const iosContent = fs.readFileSync(iosPath, 'utf-8');
      const androidContent = fs.readFileSync(androidPath, 'utf-8');
      
      // Verify behavioral contracts mention focus_ring
      expect(tsContent).toContain('focus_ring');
      expect(iosContent).toContain('focus_ring');
      expect(androidContent).toContain('focus_ring');
      
      // Verify WCAG 2.4.7 is mentioned in behavioral contracts
      expect(tsContent).toContain('WCAG 2.4.7');
      expect(iosContent).toContain('WCAG 2.4.7');
      expect(androidContent).toContain('WCAG 2.4.7');
    });
  });

  describe('Reduced Motion Support', () => {
    it('should respect prefers-reduced-motion in web implementation', () => {
      // Read CSS file directly (Jest mocks CSS imports to empty strings)
      const cssContent = getCSSContent();
      
      // Verify prefers-reduced-motion media query is used
      expect(cssContent).toContain('prefers-reduced-motion');
    });

    it('should respect accessibilityReduceMotion in iOS implementation', () => {
      // Read iOS component implementation
      const iosComponentPath = path.join(__dirname, '../platforms/ios/InputTextBase.ios.swift');
      const iosComponentContent = fs.readFileSync(iosComponentPath, 'utf-8');
      
      // Verify accessibilityReduceMotion is used
      expect(iosComponentContent).toContain('accessibilityReduceMotion');
      expect(iosComponentContent).toContain('reduceMotion');
    });

    it('should respect reduce motion settings in Android implementation', () => {
      // Read Android component implementation
      const androidComponentPath = path.join(__dirname, '../platforms/android/InputTextBase.android.kt');
      const androidComponentContent = fs.readFileSync(androidComponentPath, 'utf-8');
      
      // Verify reduce motion is checked
      expect(androidComponentContent).toContain('reduceMotion');
      expect(androidComponentContent).toContain('TRANSITION_ANIMATION_SCALE');
    });
  });
});
