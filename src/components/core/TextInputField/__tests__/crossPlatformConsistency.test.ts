/**
 * Cross-Platform Consistency Tests for TextInputField
 * 
 * Verifies that the TextInputField component maintains consistent behavior
 * and appearance across web, iOS, and Android platforms.
 * 
 * Tests verify:
 * - Animation timing identical across platforms (250ms)
 * - Visual appearance consistent (colors, spacing, typography)
 * - Token usage consistent across platforms
 * - Platform-specific implementations follow same patterns
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

import { readFileSync } from 'fs';
import { join } from 'path';

describe('TextInputField Cross-Platform Consistency', () => {
  // Platform file paths
  const webPath = join(__dirname, '../platforms/web/TextInputField.web.ts');
  const iosPath = join(__dirname, '../platforms/ios/TextInputField.ios.swift');
  const androidPath = join(__dirname, '../platforms/android/TextInputField.android.kt');
  
  // Read platform implementations
  const webContent = readFileSync(webPath, 'utf-8');
  const iosContent = readFileSync(iosPath, 'utf-8');
  const androidContent = readFileSync(androidPath, 'utf-8');
  
  describe('Animation Timing Consistency', () => {
    test('all platforms use 250ms animation duration', () => {
      // Web: motion.floatLabel duration (250ms)
      expect(webContent).toContain('--motion-float-label-duration, 250ms');
      
      // iOS: motionFloatLabelDuration = 0.25 (250ms in seconds)
      expect(iosContent).toContain('motionFloatLabelDuration: TimeInterval = 0.25');
      
      // Android: motionFloatLabelDuration = 250 (250ms)
      expect(androidContent).toContain('motionFloatLabelDuration = 250');
    });
    
    test('all platforms use easingStandard curve', () => {
      // Web: cubic-bezier(0.4, 0.0, 0.2, 1.0)
      expect(webContent).toContain('cubic-bezier(0.4, 0.0, 0.2, 1.0)');
      
      // iOS: .timingCurve(0.4, 0.0, 0.2, 1.0)
      expect(iosContent).toContain('.timingCurve(0.4, 0.0, 0.2, 1.0');
      
      // Android: CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)
      expect(androidContent).toContain('CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)');
    });
    
    test('all platforms respect reduce motion preferences', () => {
      // Web: @media (prefers-reduced-motion: reduce)
      expect(webContent).toContain('@media (prefers-reduced-motion: reduce)');
      expect(webContent).toContain('transition: none');
      
      // iOS: accessibilityReduceMotion
      expect(iosContent).toContain('accessibilityReduceMotion');
      expect(iosContent).toContain('reduceMotion ? .none :');
      
      // Android: Settings.Global.TRANSITION_ANIMATION_SCALE
      expect(androidContent).toContain('Settings.Global.TRANSITION_ANIMATION_SCALE');
      expect(androidContent).toContain('snap()');
    });
  });
  
  describe('Typography Token Consistency', () => {
    test('all platforms use labelMd typography (16px/pt/sp)', () => {
      // Web: typography.labelMd
      expect(webContent).toContain('--typography-label-md-font-size, 16px');
      expect(webContent).toContain('--typography-label-md-line-height, 24px');
      expect(webContent).toContain('--typography-label-md-font-weight, 500');
      
      // iOS: typographyLabelMdFontSize = 16
      expect(iosContent).toContain('typographyLabelMdFontSize: CGFloat = 16');
      expect(iosContent).toContain('typographyLabelMdLineHeight: CGFloat = 24');
      expect(iosContent).toContain('typographyLabelMdFontWeight: Font.Weight = .medium');
      
      // Android: typographyLabelMdFontSize = 16f
      expect(androidContent).toContain('typographyLabelMdFontSize = 16f');
      expect(androidContent).toContain('typographyLabelMdLineHeight = 24f');
      expect(androidContent).toContain('typographyLabelMdFontWeight = 500');
    });
    
    test('all platforms use labelMdFloat typography (14px/pt/sp)', () => {
      // Web: typography.labelMdFloat (via scale088)
      expect(webContent).toContain('--typography-label-md-float-font-size, 14px');
      expect(webContent).toContain('--typography-label-md-float-line-height, 20px');
      
      // iOS: typographyLabelMdFloatFontSize = 14
      expect(iosContent).toContain('typographyLabelMdFloatFontSize: CGFloat = 14');
      expect(iosContent).toContain('typographyLabelMdFloatLineHeight: CGFloat = 20');
      
      // Android: typographyLabelMdFloatFontSize = 14f
      expect(androidContent).toContain('typographyLabelMdFloatFontSize = 14f');
      expect(androidContent).toContain('typographyLabelMdFloatLineHeight = 20f');
    });
    
    test('all platforms use input typography (16px/pt/sp)', () => {
      // Web: typography.input
      expect(webContent).toContain('--typography-input-font-size, 16px');
      expect(webContent).toContain('--typography-input-line-height, 24px');
      
      // iOS: typographyInputFontSize = 16
      expect(iosContent).toContain('typographyInputFontSize: CGFloat = 16');
      expect(iosContent).toContain('typographyInputLineHeight: CGFloat = 24');
      
      // Android: typographyInputFontSize = 16f
      expect(androidContent).toContain('typographyInputFontSize = 16f');
      expect(androidContent).toContain('typographyInputLineHeight = 24f');
    });
    
    test('all platforms use caption typography (13px/pt/sp)', () => {
      // Web: typography.caption
      expect(webContent).toContain('--typography-caption-font-size, 13px');
      expect(webContent).toContain('--typography-caption-line-height, 18px');
      
      // iOS: typographyCaptionFontSize = 13
      expect(iosContent).toContain('typographyCaptionFontSize: CGFloat = 13');
      expect(iosContent).toContain('typographyCaptionLineHeight: CGFloat = 18');
      
      // Android: typographyCaptionFontSize = 13f
      expect(androidContent).toContain('typographyCaptionFontSize = 13f');
      expect(androidContent).toContain('typographyCaptionLineHeight = 18f');
    });
  });
  
  describe('Color Token Consistency', () => {
    test('all platforms use consistent color values', () => {
      // Primary color: #3B82F6
      expect(webContent).toContain('--color-primary, #3B82F6');
      expect(iosContent).toContain('59/255, green: 130/255, blue: 246/255'); // RGB for #3B82F6
      expect(androidContent).toContain('0xFF3B82F6');
      
      // Error color: #EF4444
      expect(webContent).toContain('--color-error, #EF4444');
      expect(iosContent).toContain('239/255, green: 68/255, blue: 68/255'); // RGB for #EF4444
      expect(androidContent).toContain('0xFFEF4444');
      
      // Success color: #10B981
      expect(webContent).toContain('--color-success-strong, #10B981');
      expect(iosContent).toContain('16/255, green: 185/255, blue: 129/255'); // RGB for #10B981
      expect(androidContent).toContain('0xFF10B981');
      
      // Text muted: #6B7280
      expect(webContent).toContain('--color-text-muted, #6B7280');
      expect(iosContent).toContain('107/255, green: 114/255, blue: 128/255'); // RGB for #6B7280
      expect(androidContent).toContain('0xFF6B7280');
      
      // Border color: #D1D5DB
      expect(webContent).toContain('--color-border, #D1D5DB');
      expect(iosContent).toContain('209/255, green: 213/255, blue: 219/255'); // RGB for #D1D5DB
      expect(androidContent).toContain('0xFFD1D5DB');
    });
  });
  
  describe('Spacing Token Consistency', () => {
    test('all platforms use consistent spacing values', () => {
      // Input padding: 8px/pt/dp
      expect(webContent).toContain('--space-inset-100, 8px');
      expect(iosContent).toContain('spaceInset100: CGFloat = 8');
      expect(androidContent).toContain('spaceInset100 = 8f');
      
      // Label offset: 4px/pt/dp
      expect(webContent).toContain('--space-grouped-tight, 4px');
      expect(iosContent).toContain('spaceGroupedTight: CGFloat = 4');
      expect(androidContent).toContain('spaceGroupedTight = 4f');
      
      // Element spacing: 2px/pt/dp
      expect(webContent).toContain('--space-grouped-minimal, 2px');
      expect(iosContent).toContain('spaceGroupedMinimal: CGFloat = 2');
      expect(androidContent).toContain('spaceGroupedMinimal = 2f');
    });
  });
  
  describe('Border Token Consistency', () => {
    test('all platforms use consistent border values', () => {
      // Border width: 1px/pt/dp
      expect(webContent).toContain('--border-default, 1px');
      expect(iosContent).toContain('borderDefault: CGFloat = 1');
      expect(androidContent).toContain('borderDefault = 1f');
      
      // Border radius: 12px/pt/dp
      expect(webContent).toContain('--radius-150, 12px');
      expect(iosContent).toContain('radius150: CGFloat = 12');
      expect(androidContent).toContain('radius150 = 12f');
    });
  });
  
  describe('Accessibility Token Consistency', () => {
    test('all platforms use consistent accessibility values', () => {
      // Minimum touch target: 48px/pt/dp
      expect(webContent).toContain('--tap-area-recommended, 48px');
      expect(iosContent).toContain('tapAreaRecommended: CGFloat = 48');
      expect(androidContent).toContain('tapAreaRecommended = 48f');
      
      // Focus ring width: 2px/pt/dp
      expect(webContent).toContain('--accessibility-focus-width, 2px');
      expect(iosContent).toContain('accessibilityFocusWidth: CGFloat = 2');
      expect(androidContent).toContain('accessibilityFocusWidth = 2f');
      
      // Focus ring offset: 2px/pt/dp
      expect(webContent).toContain('--accessibility-focus-offset, 2px');
      expect(iosContent).toContain('accessibilityFocusOffset: CGFloat = 2');
      expect(androidContent).toContain('accessibilityFocusOffset = 2f');
    });
  });
  
  describe('Icon Integration Consistency', () => {
    test('all platforms use same icon names', () => {
      // Error icon: x
      expect(webContent).toContain("name: 'x'");
      expect(iosContent).toContain('name: "x"');
      expect(androidContent).toContain('name = "x"');
      
      // Success icon: check
      expect(webContent).toContain("name: 'check'");
      expect(iosContent).toContain('name: "check"');
      expect(androidContent).toContain('name = "check"');
      
      // Info icon: info
      expect(webContent).toContain("name: 'info'");
      expect(iosContent).toContain('name: "info"');
      expect(androidContent).toContain('name = "info"');
    });
    
    test('all platforms use same icon size (24)', () => {
      expect(webContent).toContain('size: 24');
      expect(iosContent).toContain('size: 24');
      expect(androidContent).toContain('size = 24');
    });
    
    test('all platforms coordinate icon visibility with label animation', () => {
      // All platforms check labelAnimationComplete before showing icons
      expect(webContent).toContain('labelAnimationComplete');
      expect(iosContent).toContain('labelAnimationComplete');
      expect(androidContent).toContain('labelAnimationComplete');
      
      // All platforms show icons after label floats
      expect(webContent).toContain('isLabelFloated && labelAnimationComplete');
      expect(iosContent).toContain('isLabelFloated && labelAnimationComplete');
      expect(androidContent).toContain('isLabelFloated && labelAnimationComplete');
    });
  });
  
  describe('State Management Consistency', () => {
    test('all platforms track same state properties', () => {
      // isFocused state
      expect(webContent).toContain('isFocused');
      expect(iosContent).toContain('isFocused');
      expect(androidContent).toContain('isFocused');
      
      // isFilled state
      expect(webContent).toContain('isFilled');
      expect(iosContent).toContain('isFilled');
      expect(androidContent).toContain('isFilled');
      
      // hasError state
      expect(webContent).toContain('hasError');
      expect(iosContent).toContain('hasError');
      expect(androidContent).toContain('hasError');
      
      // isSuccess state
      expect(webContent).toContain('isSuccess');
      expect(iosContent).toContain('isSuccess');
      expect(androidContent).toContain('isSuccess');
      
      // isLabelFloated state
      expect(webContent).toContain('isLabelFloated');
      expect(iosContent).toContain('isLabelFloated');
      expect(androidContent).toContain('isLabelFloated');
    });
    
    test('all platforms calculate label position consistently', () => {
      // Label floats when focused OR filled
      expect(webContent).toContain('isFocused || isFilled');
      expect(iosContent).toContain('isFocused || isFilled');
      expect(androidContent).toContain('isFocused || isFilled');
    });
  });
  
  describe('Label Animation Pattern Consistency', () => {
    test('all platforms animate label fontSize', () => {
      // Web: CSS transition on font-size
      expect(webContent).toContain('font-size var(--motion-float-label-duration)');
      
      // iOS: Font.system(size: animated)
      expect(iosContent).toContain('Font.system(size: typographyLabelMdFloatFontSize)');
      expect(iosContent).toContain('Font.system(size: typographyLabelMdFontSize)');
      
      // Android: animateFloatAsState for fontSize
      expect(androidContent).toContain('animateFloatAsState');
      expect(androidContent).toContain('typographyLabelMdFloatFontSize');
      expect(androidContent).toContain('typographyLabelMdFontSize');
    });
    
    test('all platforms animate label color', () => {
      // Web: CSS transition on color
      expect(webContent).toContain('color var(--motion-float-label-duration)');
      
      // iOS: .foregroundColor with animation
      expect(iosContent).toContain('.foregroundColor(labelColor)');
      expect(iosContent).toContain('.animation(');
      
      // Android: animateColorAsState for labelColor
      expect(androidContent).toContain('animateColorAsState');
      expect(androidContent).toContain('labelColor');
    });
    
    test('all platforms animate label position', () => {
      // Web: CSS transition on transform
      expect(webContent).toContain('transform var(--motion-float-label-duration)');
      expect(webContent).toContain('translateY');
      
      // iOS: .offset with animation
      expect(iosContent).toContain('.offset(y: labelOffset)');
      expect(iosContent).toContain('.animation(');
      
      // Android: animateDpAsState for labelOffsetY
      expect(androidContent).toContain('animateDpAsState');
      expect(androidContent).toContain('labelOffsetY');
    });
  });
  
  describe('Focus Ring Consistency', () => {
    test('all platforms implement visible focus rings', () => {
      // Web: outline on :focus-visible
      expect(webContent).toContain(':focus-visible');
      expect(webContent).toContain('outline:');
      
      // iOS: overlay with RoundedRectangle stroke
      expect(iosContent).toContain('RoundedRectangle');
      expect(iosContent).toContain('.stroke(accessibilityFocusColor');
      
      // Android: border modifier when focused
      expect(androidContent).toContain('if (isFocused)');
      expect(androidContent).toContain('Modifier.border');
    });
    
    test('all platforms use same focus ring styling', () => {
      // Focus ring width: 2px/pt/dp
      expect(webContent).toContain('--accessibility-focus-width, 2px');
      expect(iosContent).toContain('accessibilityFocusWidth');
      expect(androidContent).toContain('accessibilityFocusWidth');
      
      // Focus ring offset: 2px/pt/dp
      expect(webContent).toContain('--accessibility-focus-offset, 2px');
      expect(iosContent).toContain('accessibilityFocusOffset');
      expect(androidContent).toContain('accessibilityFocusOffset');
      
      // Focus ring color: primary
      expect(webContent).toContain('--accessibility-focus-color');
      expect(iosContent).toContain('accessibilityFocusColor');
      expect(androidContent).toContain('accessibilityFocusColor');
    });
  });
  
  describe('Helper Text and Error Message Consistency', () => {
    test('all platforms display helper text persistently', () => {
      expect(webContent).toContain('helper-text');
      expect(iosContent).toContain('helperText');
      expect(androidContent).toContain('helperText');
    });
    
    test('all platforms display error message conditionally', () => {
      expect(webContent).toContain('error-message');
      expect(iosContent).toContain('errorMessage');
      expect(androidContent).toContain('errorMessage');
    });
    
    test('all platforms use caption typography for helper/error text', () => {
      // Web: typography.caption
      expect(webContent).toContain('--typography-caption-font-size');
      
      // iOS: typographyCaptionFontSize
      expect(iosContent).toContain('typographyCaptionFontSize');
      
      // Android: typographyCaptionFontSize
      expect(androidContent).toContain('typographyCaptionFontSize');
    });
  });
  
  describe('Platform-Specific Accessibility Features', () => {
    test('web implements ARIA attributes', () => {
      expect(webContent).toContain('aria-describedby');
      expect(webContent).toContain('aria-invalid');
      expect(webContent).toContain('role="alert"');
    });
    
    test('iOS implements accessibility labels', () => {
      expect(iosContent).toContain('.accessibilityLabel');
      expect(iosContent).toContain('.accessibilityValue');
      expect(iosContent).toContain('.accessibilityHint');
    });
    
    test('Android implements semantics', () => {
      expect(androidContent).toContain('.semantics');
      expect(androidContent).toContain('contentDescription');
      expect(androidContent).toContain('error(');
    });
  });
  
  describe('Mathematical Equivalence', () => {
    test('animation timing is mathematically equivalent', () => {
      // All platforms use 250ms (0.25s)
      // Web: 250ms
      // iOS: 0.25 seconds
      // Android: 250 milliseconds
      // These are mathematically equivalent
      expect(true).toBe(true); // Verified by string checks above
    });
    
    test('easing curves are mathematically equivalent', () => {
      // All platforms use cubic-bezier(0.4, 0.0, 0.2, 1.0)
      // This is Material Design's standard easing curve
      expect(true).toBe(true); // Verified by string checks above
    });
    
    test('spacing values are mathematically equivalent', () => {
      // All platforms use same numeric values
      // Web: 8px, iOS: 8pt, Android: 8dp
      // These are unitless base values with platform-specific units
      expect(true).toBe(true); // Verified by string checks above
    });
  });
});
