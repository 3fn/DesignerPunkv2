/**
 * @category evergreen
 * @purpose Verify TokenCompliance component renders correctly and behaves as expected
 */
/**
 * Token Compliance Tests
 * 
 * Evergreen prevention tests that scan all components for token compliance violations.
 * These tests remain valuable after cleanup is complete to prevent future violations.
 * 
 * Tests verify:
 * - No hard-coded RGB color values across all platforms
 * - No problematic hard-coded fallback patterns (allows defensive defaults)
 * - No undocumented hard-coded spacing values (allows documented generated CSS)
 * - No hard-coded motion durations
 * - No hard-coded typography values
 * 
 * REFINED (Spec 025 Task 4.2):
 * - R1: Fallback patterns distinguish acceptable defaults from problematic masking
 * - R2: Spacing detection distinguishes documented vs undocumented hard-coded values
 * - R3: Overall refinement reduces false positives while maintaining compliance goals
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 8.1, 14.3, 14.4, 14.5 (Spec 025)
 * 
 * @module components/__tests__/TokenCompliance
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

/**
 * Helper function to get all component files across all platforms
 * 
 * Scans the components directory for platform-specific implementation files:
 * - Web: *.web.ts, *.web.tsx, *.web.css
 * - iOS: *.ios.swift
 * - Android: *.android.kt
 * 
 * @returns Array of absolute file paths to all component implementation files
 */
function getAllComponentFiles(): string[] {
  const componentsDir = path.join(__dirname, '..');
  
  // Patterns for platform-specific component files
  const patterns = [
    '**/platforms/web/*.web.ts',
    '**/platforms/web/*.web.tsx',
    '**/platforms/web/*.web.css',
    '**/platforms/ios/*.ios.swift',
    '**/platforms/android/*.android.kt'
  ];
  
  const files: string[] = [];
  
  patterns.forEach(pattern => {
    const matches = glob.sync(pattern, {
      cwd: componentsDir,
      absolute: true,
      ignore: ['**/node_modules/**', '**/__tests__/**', '**/examples/**']
    });
    files.push(...matches);
  });
  
  return files;
}

describe('Token Compliance - All Components', () => {
  let componentFiles: string[];
  
  beforeAll(() => {
    componentFiles = getAllComponentFiles();
  });
  
  describe('Helper Function Validation', () => {
    it('should find component files', () => {
      expect(componentFiles.length).toBeGreaterThan(0);
    });
    
    it('should find web component files', () => {
      const webFiles = componentFiles.filter(f => f.includes('.web.'));
      expect(webFiles.length).toBeGreaterThan(0);
    });
    
    it('should find iOS component files', () => {
      const iosFiles = componentFiles.filter(f => f.includes('.ios.swift'));
      expect(iosFiles.length).toBeGreaterThan(0);
    });
    
    it('should find Android component files', () => {
      const androidFiles = componentFiles.filter(f => f.includes('.android.kt'));
      expect(androidFiles.length).toBeGreaterThan(0);
    });
    
    it('should not include test files', () => {
      const testFiles = componentFiles.filter(f => f.includes('__tests__'));
      expect(testFiles.length).toBe(0);
    });
    
    it('should not include example files', () => {
      const exampleFiles = componentFiles.filter(f => f.includes('examples'));
      expect(exampleFiles.length).toBe(0);
    });
  });
  
  describe('Hard-Coded Color Detection', () => {
    /**
     * Test for iOS Color(red:green:blue:) pattern
     * 
     * Detects hard-coded RGB color values in iOS Swift files.
     * Pattern: Color(red: X, green: Y, blue: Z) or Color(red:X, green:Y, blue:Z)
     * 
     * Requirements: 1.1, 8.1
     */
    it('should not contain Color(red:green:blue:) pattern in iOS files', () => {
      const iosFiles = componentFiles.filter(f => f.includes('.ios.swift'));
      const violations: Array<{ file: string; line: number; content: string }> = [];
      
      iosFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        // Pattern to match Color(red: X, green: Y, blue: Z) with various spacing
        const colorPattern = /Color\s*\(\s*red\s*:\s*[\d.]+/i;
        
        lines.forEach((line, index) => {
          if (colorPattern.test(line)) {
            violations.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              content: line.trim()
            });
          }
        });
      });
      
      if (violations.length > 0) {
        const violationDetails = violations
          .map(v => `  ${v.file}:${v.line}\n    ${v.content}`)
          .join('\n\n');
        
        throw new Error(
          `Found ${violations.length} hard-coded Color(red:green:blue:) pattern(s) in iOS files:\n\n${violationDetails}\n\n` +
          `Use semantic color tokens instead (e.g., colorPrimary, colorTextDefault)`
        );
      }
    });
    
    /**
     * Test for Android Color(0xRRGGBB) pattern
     * 
     * Detects hard-coded hex color values in Android Kotlin files.
     * Pattern: Color(0xRRGGBB) or Color(0xAARRGGBB) with 6 or 8 hex digits
     * 
     * Requirements: 1.1, 8.1
     */
    it('should not contain Color(0xRRGGBB) pattern in Android files', () => {
      const androidFiles = componentFiles.filter(f => f.includes('.android.kt'));
      const violations: Array<{ file: string; line: number; content: string }> = [];
      
      androidFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        // Pattern to match Color(0xRRGGBB) or Color(0xAARRGGBB)
        const colorPattern = /Color\s*\(\s*0x[0-9A-Fa-f]{6,8}\s*\)/;
        
        lines.forEach((line, index) => {
          if (colorPattern.test(line)) {
            violations.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              content: line.trim()
            });
          }
        });
      });
      
      if (violations.length > 0) {
        const violationDetails = violations
          .map(v => `  ${v.file}:${v.line}\n    ${v.content}`)
          .join('\n\n');
        
        throw new Error(
          `Found ${violations.length} hard-coded Color(0xRRGGBB) pattern(s) in Android files:\n\n${violationDetails}\n\n` +
          `Use semantic color tokens instead (e.g., colorPrimary, colorTextDefault)`
        );
      }
    });
    
    /**
     * Test for Web rgb() and hex color patterns
     * 
     * Detects hard-coded color values in Web TypeScript/CSS files.
     * Patterns:
     * - rgb(R, G, B) or rgba(R, G, B, A)
     * - #RGB or #RRGGBB hex colors
     * 
     * REFINED (Spec 030 Task 3.3): Excludes values within CSS comment blocks.
     * Multi-line CSS comments are tracked across lines to avoid
     * false positives from commented-out code or documentation examples.
     * 
     * Requirements: 1.1, 8.1, 10.1, 10.2
     */
    it('should not contain rgb() or hex color patterns in Web files', () => {
      const webFiles = componentFiles.filter(f => f.includes('.web.'));
      const violations: Array<{ file: string; line: number; content: string; pattern: string }> = [];
      
      webFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        // Pattern to match rgb(R, G, B) or rgba(R, G, B, A)
        const rgbPattern = /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+/;
        
        // Pattern to match hex colors: #RGB or #RRGGBB (but not CSS custom properties like --color-primary)
        // Exclude lines that are comments or contain 'var(--'
        const hexPattern = /#[0-9A-Fa-f]{3,6}\b/;
        
        // Track multi-line comment state
        let inMultiLineComment = false;
        
        lines.forEach((line, index) => {
          const trimmedLine = line.trim();
          
          // Handle multi-line comment tracking
          // Check for comment start/end to track state across lines
          if (inMultiLineComment) {
            // We're inside a multi-line comment, check if it ends on this line
            if (trimmedLine.includes('*/')) {
              inMultiLineComment = false;
              // Check if there's code after the comment end
              const afterComment = line.substring(line.indexOf('*/') + 2);
              if (!afterComment.trim()) {
                return; // No code after comment, skip this line
              }
              // Continue to check the code after the comment
            } else {
              return; // Still inside multi-line comment, skip this line
            }
          }
          
          // Check if this line starts a multi-line comment
          if (trimmedLine.includes('/*') && !trimmedLine.includes('*/')) {
            inMultiLineComment = true;
            // Check if there's code before the comment start
            const beforeComment = line.substring(0, line.indexOf('/*'));
            if (!beforeComment.trim()) {
              return; // No code before comment, skip this line
            }
            // Continue to check the code before the comment
          }
          
          // Skip single-line comments
          if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
            return;
          }
          
          // Skip CSS custom property references
          if (trimmedLine.includes('var(--')) {
            return;
          }
          
          // For lines with inline comments, extract only the code portion
          // Remove content within /* ... */ inline comments before checking
          let codeToCheck = line;
          if (line.includes('/*') && line.includes('*/')) {
            // Remove inline comments (/* ... */) from the line before checking
            codeToCheck = line.replace(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, '');
          }
          
          if (rgbPattern.test(codeToCheck)) {
            violations.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              content: line.trim(),
              pattern: 'rgb()'
            });
          }
          
          if (hexPattern.test(codeToCheck)) {
            violations.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              content: line.trim(),
              pattern: 'hex'
            });
          }
        });
      });
      
      if (violations.length > 0) {
        const violationDetails = violations
          .map(v => `  ${v.file}:${v.line} [${v.pattern}]\n    ${v.content}`)
          .join('\n\n');
        
        throw new Error(
          `Found ${violations.length} hard-coded color pattern(s) in Web files:\n\n${violationDetails}\n\n` +
          `Use CSS custom properties instead (e.g., var(--color-primary), var(--color-text-default))`
        );
      }
    });
  });
  
  describe('Fallback Pattern Detection', () => {
    /**
     * Test for || number fallback patterns
     * 
     * Detects hard-coded fallback patterns using || operator with numeric values.
     * Pattern: || <number> (e.g., || 250, || 8, || 16)
     * 
     * UPDATED (Spec 030): Following "fail loudly" philosophy, ALL numeric fallback
     * patterns are now considered problematic. Components should throw errors
     * when required values are missing rather than silently falling back.
     * 
     * Previous acceptable patterns (e.g., || 24 for default size) have been
     * removed in favor of explicit error handling.
     * 
     * Requirements: 3.1, 3.2 (Spec 030)
     */
    it('should not contain problematic || number fallback patterns', () => {
      const violations: Array<{ file: string; line: number; content: string }> = [];
      
      componentFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        // Pattern to match || followed by a number (with optional whitespace)
        // Matches: || 250, || 8, ||16, etc.
        // Excludes: ||= (assignment operator), || 0 (common boolean coercion)
        const fallbackPattern = /\|\|\s*[1-9]\d*(?:\.\d+)?(?!\d)/;
        
        lines.forEach((line, index) => {
          // Skip comments
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
            return;
          }
          
          if (fallbackPattern.test(line)) {
            violations.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              content: line.trim()
            });
          }
        });
      });
      
      if (violations.length > 0) {
        const violationDetails = violations
          .map(v => `  ${v.file}:${v.line}\n    ${v.content}`)
          .join('\n\n');
        
        throw new Error(
          `Found ${violations.length} problematic || number fallback pattern(s):\n\n${violationDetails}\n\n` +
          `Components should fail loudly when required tokens are missing.\n` +
          `Replace with explicit error handling that throws or logs when tokens are unavailable.`
        );
      }
    });
    
    /**
     * Test for || 'string' fallback patterns
     * 
     * Detects hard-coded fallback patterns using || operator with string values.
     * Pattern: || 'string' or || "string" (e.g., || '250ms', || "8px")
     * 
     * UPDATED (Spec 030): Following "fail loudly" philosophy, ALL string fallback
     * patterns containing numeric values are now considered problematic. Components
     * should throw errors when required values are missing rather than silently
     * falling back.
     * 
     * Previous acceptable patterns (e.g., || '24', || 'icon--size-100') have been
     * removed in favor of explicit error handling.
     * 
     * Requirements: 3.1, 3.2 (Spec 030)
     */
    it('should not contain problematic || string fallback patterns', () => {
      const violations: Array<{ file: string; line: number; content: string }> = [];
      
      componentFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        // Pattern to match || followed by a quoted string containing numbers
        // Matches: || '250ms', || "8px", || '16', etc.
        // Looks for strings that contain digits (likely token values)
        const fallbackPattern = /\|\|\s*['"`][^'"`]*\d+[^'"`]*['"`]/;
        
        lines.forEach((line, index) => {
          // Skip comments
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
            return;
          }
          
          if (fallbackPattern.test(line)) {
            violations.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              content: line.trim()
            });
          }
        });
      });
      
      if (violations.length > 0) {
        const violationDetails = violations
          .map(v => `  ${v.file}:${v.line}\n    ${v.content}`)
          .join('\n\n');
        
        throw new Error(
          `Found ${violations.length} problematic || string fallback pattern(s):\n\n${violationDetails}\n\n` +
          `Components should fail loudly when required tokens are missing.\n` +
          `Replace with explicit error handling that throws or logs when tokens are unavailable.`
        );
      }
    });
    
    /**
     * Test for ?? number fallback patterns
     * 
     * Detects hard-coded fallback patterns using ?? (nullish coalescing) operator with numeric values.
     * Pattern: ?? <number> (e.g., ?? 250, ?? 8, ?? 16)
     * 
     * These patterns mask missing tokens and prevent early detection of issues.
     * Components should fail loudly when tokens are missing rather than using fallbacks.
     * 
     * Requirements: 1.5, 8.1
     */
    it('should not contain ?? number fallback patterns', () => {
      const violations: Array<{ file: string; line: number; content: string }> = [];
      
      componentFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        // Pattern to match ?? followed by a number (with optional whitespace)
        // Matches: ?? 250, ?? 8, ??16, etc.
        // Excludes: ?? 0 (common for optional values)
        const fallbackPattern = /\?\?\s*[1-9]\d*(?:\.\d+)?(?!\d)/;
        
        lines.forEach((line, index) => {
          // Skip comments
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
            return;
          }
          
          if (fallbackPattern.test(line)) {
            violations.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              content: line.trim()
            });
          }
        });
      });
      
      if (violations.length > 0) {
        const violationDetails = violations
          .map(v => `  ${v.file}:${v.line}\n    ${v.content}`)
          .join('\n\n');
        
        throw new Error(
          `Found ${violations.length} hard-coded ?? number fallback pattern(s):\n\n${violationDetails}\n\n` +
          `Components should fail loudly when tokens are missing rather than using fallback values.\n` +
          `Replace with explicit error handling that throws or logs when tokens are unavailable.`
        );
      }
    });
  });
  
  describe('Hard-Coded Spacing Detection', () => {
    /**
     * Test for hard-coded spacing values across all platforms
     * 
     * Detects hard-coded spacing values that should use spacing tokens instead.
     * Patterns:
     * - Web: Hard-coded px values (e.g., padding: 8px, margin: 16px)
     * - iOS: Hard-coded CGFloat values (e.g., .padding(.horizontal, 8))
     * - Android: Hard-coded .dp values (e.g., padding(horizontal = 8.dp))
     * 
     * REFINED (Spec 025 R2): Distinguishes documented vs undocumented hard-coded values.
     * - Documented: Values followed by token comments
     * - Undocumented: Values without token comments
     * 
     * REFINED (Spec 030 Task 3.3): Web CSS regex excludes values within CSS comment blocks.
     * Multi-line CSS comments are tracked across lines to avoid
     * false positives from commented-out code or documentation examples.
     * 
     * Documented values are typically generated CSS from token system.
     * Undocumented values are problematic hard-coded values.
     * 
     * Requirements: 1.2, 8.1, 10.1, 10.2, 14.4, 14.5 (Spec 025)
     */
    it('should not contain undocumented hard-coded spacing values', () => {
      const violations: Array<{ file: string; line: number; content: string; platform: string }> = [];
      
      // Track multi-line comment state per file
      const fileCommentState: Map<string, boolean> = new Map();
      
      componentFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        let platform = 'unknown';
        if (file.includes('.web.')) platform = 'web';
        else if (file.includes('.ios.swift')) platform = 'ios';
        else if (file.includes('.android.kt')) platform = 'android';
        
        // Track multi-line comment state for web files
        let inMultiLineComment = false;
        
        lines.forEach((line, index) => {
          // Skip comments
          const trimmedLine = line.trim();
          
          // Handle multi-line comment tracking for web files
          if (platform === 'web') {
            if (inMultiLineComment) {
              // We're inside a multi-line comment, check if it ends on this line
              if (trimmedLine.includes('*/')) {
                inMultiLineComment = false;
                // Check if there's code after the comment end
                const afterComment = line.substring(line.indexOf('*/') + 2);
                if (!afterComment.trim()) {
                  return; // No code after comment, skip this line
                }
                // Continue to check the code after the comment
              } else {
                return; // Still inside multi-line comment, skip this line
              }
            }
            
            // Check if this line starts a multi-line comment
            if (trimmedLine.includes('/*') && !trimmedLine.includes('*/')) {
              inMultiLineComment = true;
              // Check if there's code before the comment start
              const beforeComment = line.substring(0, line.indexOf('/*'));
              if (!beforeComment.trim()) {
                return; // No code before comment, skip this line
              }
              // Continue to check the code before the comment
            }
          }
          
          if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
            return;
          }
          
          // Skip lines with token references
          if (trimmedLine.includes('var(--space') || 
              trimmedLine.includes('space') && (trimmedLine.includes('Inset') || trimmedLine.includes('Separated') || trimmedLine.includes('Grouped'))) {
            return;
          }
          
          let hasViolation = false;
          
          if (platform === 'web') {
            // Web: Look for hard-coded px values WITHOUT token documentation comments
            // Pattern: padding: 8px (without /* token.name */ comment)
            // Matches: "padding: 8px;" or "margin: 16px"
            // Excludes: "min-width: 56px; /* buttonCTA.minWidth.small */"
            // REFINED (Spec 030 Task 3.3): Also excludes values within CSS comment blocks
            // Note: For spacing, we check the ORIGINAL line (not with comments removed)
            // because the presence of a token documentation comment makes the value acceptable
            const webSpacingPattern = /(padding|margin|gap|width|height|top|right|bottom|left|inset)[\s:]+\d+px(?!\s*;?\s*\/\*)/i;
            
            if (webSpacingPattern.test(line)) {
              hasViolation = true;
            }
          } else if (platform === 'ios') {
            // iOS: Look for hard-coded numeric values in padding, frame, spacing
            // Pattern: .padding(.horizontal, 8), .frame(width: 100), .spacing(16)
            // REFINED (Spec 030 Task 3.1): Exclude lines containing DesignTokens. references
            // Lines like "DesignTokens.space.inset.100" are valid semantic token references
            const iosSpacingPattern = /\.(padding|frame|spacing)\s*\([^)]*\d+(?!\.)(?!pt)(?!px)/;
            
            // Skip lines with DesignTokens. references - these are valid semantic token usages
            if (trimmedLine.includes('DesignTokens.')) {
              return;
            }
            
            if (iosSpacingPattern.test(line)) {
              hasViolation = true;
            }
          } else if (platform === 'android') {
            // Android: Look for hard-coded .dp values
            // Pattern: padding(horizontal = 8.dp), size(width = 100.dp)
            // REFINED (Spec 030 Task 3.2): Exclude 0.dp as valid edge case
            // Zero values are a valid literal that don't require token references
            // since they represent "no spacing" which is semantically clear
            const androidSpacingPattern = /[1-9]\d*\.dp\b/;
            if (androidSpacingPattern.test(line)) {
              hasViolation = true;
            }
          }
          
          if (hasViolation) {
            violations.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              content: line.trim(),
              platform
            });
          }
        });
      });
      
      if (violations.length > 0) {
        const violationDetails = violations
          .map(v => `  ${v.file}:${v.line} [${v.platform}]\n    ${v.content}`)
          .join('\n\n');
        
        throw new Error(
          `Found ${violations.length} undocumented hard-coded spacing value(s):\n\n${violationDetails}\n\n` +
          `Use spacing tokens instead:\n` +
          `- Web: var(--space-inset-normal), var(--space-separated-200)\n` +
          `- iOS: spaceInsetNormal, spaceSeparated200\n` +
          `- Android: spaceInsetNormal.dp, spaceSeparated200.dp\n\n` +
          `Note: Values with token documentation comments (e.g., /* token.name */) are allowed (generated CSS).`
        );
      }
    });
  });
  
  describe('Hard-Coded Motion Detection', () => {
    /**
     * Test for hard-coded motion duration values across all platforms
     * 
     * Detects hard-coded animation/transition durations that should use motion tokens instead.
     * Patterns:
     * - Web: Hard-coded ms/s values (e.g., transition: all 250ms, animation-duration: 0.25s)
     * - iOS: Hard-coded TimeInterval values (e.g., .animation(.easeOut(duration: 0.25)))
     * - Android: Hard-coded millisecond values (e.g., tween(durationMillis = 250))
     * 
     * REFINED (Spec 030 Task 3.3): Web CSS regex excludes values within CSS comment blocks.
     * Multi-line CSS comments are tracked across lines to avoid
     * false positives from commented-out code or documentation examples.
     * 
     * Requirements: 1.3, 8.1, 10.1, 10.2
     */
    it('should not contain hard-coded motion duration values', () => {
      const violations: Array<{ file: string; line: number; content: string; platform: string }> = [];
      
      componentFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        let platform = 'unknown';
        if (file.includes('.web.')) platform = 'web';
        else if (file.includes('.ios.swift')) platform = 'ios';
        else if (file.includes('.android.kt')) platform = 'android';
        
        // Track multi-line comment state for web files
        let inMultiLineComment = false;
        
        lines.forEach((line, index) => {
          // Skip comments
          const trimmedLine = line.trim();
          
          // Handle multi-line comment tracking for web files
          if (platform === 'web') {
            if (inMultiLineComment) {
              // We're inside a multi-line comment, check if it ends on this line
              if (trimmedLine.includes('*/')) {
                inMultiLineComment = false;
                // Check if there's code after the comment end
                const afterComment = line.substring(line.indexOf('*/') + 2);
                if (!afterComment.trim()) {
                  return; // No code after comment, skip this line
                }
                // Continue to check the code after the comment
              } else {
                return; // Still inside multi-line comment, skip this line
              }
            }
            
            // Check if this line starts a multi-line comment
            if (trimmedLine.includes('/*') && !trimmedLine.includes('*/')) {
              inMultiLineComment = true;
              // Check if there's code before the comment start
              const beforeComment = line.substring(0, line.indexOf('/*'));
              if (!beforeComment.trim()) {
                return; // No code before comment, skip this line
              }
              // Continue to check the code before the comment
            }
          }
          
          if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
            return;
          }
          
          // Skip lines with motion token references
          if (trimmedLine.includes('var(--motion') || 
              trimmedLine.includes('motion') && (trimmedLine.includes('Duration') || trimmedLine.includes('Easing'))) {
            return;
          }
          
          let hasViolation = false;
          
          if (platform === 'web') {
            // Web: Look for hard-coded ms or s values in transition, animation
            // Pattern: transition: all 250ms, animation-duration: 0.25s
            // REFINED (Spec 030 Task 3.3): Also excludes values within CSS comment blocks
            const webMotionPattern = /(transition|animation)[\s:][^;]*\d+(?:ms|s)\b/i;
            
            // For lines with inline comments, extract only the code portion
            // Remove content within /* ... */ inline comments before checking
            let codeToCheck = line;
            if (line.includes('/*') && line.includes('*/')) {
              // Remove inline comments (/* ... */) from the line before checking
              codeToCheck = line.replace(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, '');
            }
            
            if (webMotionPattern.test(codeToCheck)) {
              hasViolation = true;
            }
          } else if (platform === 'ios') {
            // iOS: Look for hard-coded duration values in animation
            // Pattern: .animation(.easeOut(duration: 0.25)), withAnimation(.easeInOut(duration: 0.15))
            const iosMotionPattern = /duration\s*:\s*\d+\.?\d*/;
            if (iosMotionPattern.test(line)) {
              hasViolation = true;
            }
          } else if (platform === 'android') {
            // Android: Look for hard-coded durationMillis values
            // Pattern: tween(durationMillis = 250), animateFloatAsState(animationSpec = tween(durationMillis = 250))
            const androidMotionPattern = /durationMillis\s*=\s*\d+/;
            if (androidMotionPattern.test(line)) {
              hasViolation = true;
            }
          }
          
          if (hasViolation) {
            violations.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              content: line.trim(),
              platform
            });
          }
        });
      });
      
      if (violations.length > 0) {
        const violationDetails = violations
          .map(v => `  ${v.file}:${v.line} [${v.platform}]\n    ${v.content}`)
          .join('\n\n');
        
        throw new Error(
          `Found ${violations.length} hard-coded motion duration value(s):\n\n${violationDetails}\n\n` +
          `Use motion tokens instead:\n` +
          `- Web: var(--motion-float-label-duration), var(--motion-focus-duration)\n` +
          `- iOS: motionFloatLabelDuration, motionFocusDuration\n` +
          `- Android: motionFloatLabelDuration, motionFocusDuration`
        );
      }
    });
  });
  
  describe('Hard-Coded Typography Detection', () => {
    /**
     * Test for hard-coded typography values across all platforms
     * 
     * Detects hard-coded font sizes, weights, and line heights that should use typography tokens instead.
     * Patterns:
     * - Web: Hard-coded font-size, font-weight, line-height values
     * - iOS: Hard-coded Font.system() calls with size/weight
     * - Android: Hard-coded fontSize, fontWeight, lineHeight in TextStyle
     * 
     * REFINED (Spec 030 Task 3.3): Web CSS regex excludes values within CSS comment blocks.
     * Multi-line CSS comments are tracked across lines to avoid
     * false positives from commented-out code or documentation examples.
     * 
     * Requirements: 1.4, 8.1, 10.1, 10.2
     */
    it('should not contain hard-coded typography values', () => {
      const violations: Array<{ file: string; line: number; content: string; platform: string }> = [];
      
      componentFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        let platform = 'unknown';
        if (file.includes('.web.')) platform = 'web';
        else if (file.includes('.ios.swift')) platform = 'ios';
        else if (file.includes('.android.kt')) platform = 'android';
        
        // Track multi-line comment state for web files
        let inMultiLineComment = false;
        
        lines.forEach((line, index) => {
          // Skip comments
          const trimmedLine = line.trim();
          
          // Handle multi-line comment tracking for web files
          if (platform === 'web') {
            if (inMultiLineComment) {
              // We're inside a multi-line comment, check if it ends on this line
              if (trimmedLine.includes('*/')) {
                inMultiLineComment = false;
                // Check if there's code after the comment end
                const afterComment = line.substring(line.indexOf('*/') + 2);
                if (!afterComment.trim()) {
                  return; // No code after comment, skip this line
                }
                // Continue to check the code after the comment
              } else {
                return; // Still inside multi-line comment, skip this line
              }
            }
            
            // Check if this line starts a multi-line comment
            if (trimmedLine.includes('/*') && !trimmedLine.includes('*/')) {
              inMultiLineComment = true;
              // Check if there's code before the comment start
              const beforeComment = line.substring(0, line.indexOf('/*'));
              if (!beforeComment.trim()) {
                return; // No code before comment, skip this line
              }
              // Continue to check the code before the comment
            }
          }
          
          if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
            return;
          }
          
          // Skip lines with typography token references
          if (trimmedLine.includes('var(--typography') || 
              trimmedLine.includes('typography') && (trimmedLine.includes('Body') || trimmedLine.includes('Label') || trimmedLine.includes('Heading'))) {
            return;
          }
          
          let hasViolation = false;
          
          if (platform === 'web') {
            // Web: Look for hard-coded font-size, font-weight, line-height
            // Pattern: font-size: 16px, font-weight: 500, line-height: 24px
            // REFINED (Spec 030 Task 3.3): Also excludes values within CSS comment blocks
            const webTypographyPattern = /(font-size|font-weight|line-height)[\s:]+\d+(?:px|pt|em|rem)?/i;
            
            // For lines with inline comments, extract only the code portion
            // Remove content within /* ... */ inline comments before checking
            let codeToCheck = line;
            if (line.includes('/*') && line.includes('*/')) {
              // Remove inline comments (/* ... */) from the line before checking
              codeToCheck = line.replace(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, '');
            }
            
            if (webTypographyPattern.test(codeToCheck)) {
              hasViolation = true;
            }
          } else if (platform === 'ios') {
            // iOS: Look for hard-coded Font.system() calls
            // Pattern: Font.system(size: 16), Font.system(size: 16, weight: .regular)
            const iosTypographyPattern = /Font\.system\s*\(\s*size\s*:\s*\d+/;
            if (iosTypographyPattern.test(line)) {
              hasViolation = true;
            }
          } else if (platform === 'android') {
            // Android: Look for hard-coded fontSize, fontWeight, lineHeight in TextStyle
            // Pattern: fontSize = 16.sp, fontWeight = FontWeight.Normal, lineHeight = 24.sp
            const androidTypographyPattern = /(fontSize|lineHeight)\s*=\s*\d+\.sp\b/;
            if (androidTypographyPattern.test(line)) {
              hasViolation = true;
            }
          }
          
          if (hasViolation) {
            violations.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              content: line.trim(),
              platform
            });
          }
        });
      });
      
      if (violations.length > 0) {
        const violationDetails = violations
          .map(v => `  ${v.file}:${v.line} [${v.platform}]\n    ${v.content}`)
          .join('\n\n');
        
        throw new Error(
          `Found ${violations.length} hard-coded typography value(s):\n\n${violationDetails}\n\n` +
          `Use typography tokens instead:\n` +
          `- Web: var(--typography-body-md), var(--typography-label-sm)\n` +
          `- iOS: typographyBodyMd, typographyLabelSm\n` +
          `- Android: typographyBodyMd, typographyLabelSm`
        );
      }
    });
  });
});
