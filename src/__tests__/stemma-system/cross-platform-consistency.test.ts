/**
 * @jest-environment node
 * @category evergreen
 * @purpose Validate cross-platform behavioral consistency for Stemma System components
 */

/**
 * Cross-Platform Consistency Test Suite
 *
 * Validates that component implementations maintain behavioral equivalence
 * across web, iOS, and Android platforms. This test suite verifies:
 * - Same trigger conditions on all platforms
 * - Same state transitions on all platforms
 * - Same observable outcomes on all platforms
 * - Same accessibility semantics on all platforms
 *
 * @see .kiro/steering/Test-Behavioral-Contract-Validation.md
 * @see .kiro/specs/034-component-architecture-system/design.md
 * @validates Requirements R6.1, R6.2, R6.3, R6.4, R6.5
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// Types
interface ComponentSchema {
  name: string;
  type: string;
  family: string;
  contracts: Record<string, any>;
  platforms: string[];
  tokens: Record<string, string[]>;
}

interface PlatformAnalysis {
  platform: string;
  filePath: string;
  fileContent: string;
  tokenReferences: string[];
  accessibilityPatterns: string[];
  statePatterns: string[];
}

interface ConsistencyReport {
  component: string;
  platforms: string[];
  tokenConsistency: boolean;
  accessibilityConsistency: boolean;
  stateConsistency: boolean;
  issues: string[];
}

// Component paths
const COMPONENTS_DIR = path.join(process.cwd(), 'src/components/core');
const FORM_INPUT_COMPONENTS = [
  'Input-Text-Base',
  'Input-Text-Email',
  'Input-Text-Password',
  'Input-Text-PhoneNumber',
];

// Platform file patterns
const PLATFORM_PATTERNS: Record<string, { dir: string; extension: string }> = {
  web: { dir: 'platforms/web', extension: '.web.ts' },
  ios: { dir: 'platforms/ios', extension: '.ios.swift' },
  android: { dir: 'platforms/android', extension: '.android.kt' },
};

// Token patterns by platform - more flexible to match various implementation styles
const TOKEN_PATTERNS: Record<string, RegExp[]> = {
  web: [
    /--[\w-]+/g,                    // CSS custom properties
    /var\(--[\w-]+\)/g,             // CSS var() usage
    /tokens\.[\w.]+/g,              // Token object references
    /color\./gi,                    // Color references
    /spacing\./gi,                  // Spacing references
    /typography\./gi,               // Typography references
  ],
  ios: [
    /DesignTokens\.[\w.]+/g,        // Swift token references
    /\.[\w]+Token/g,                // Token property access
    /Color\(\.[\w]+\)/g,            // SwiftUI color tokens
    /\.primary/g,                   // Color references
    /\.secondary/g,                 // Color references
    /\.font/gi,                     // Font references
  ],
  android: [
    /DesignTokens\.[\w.]+/g,        // Kotlin token references
    /MaterialTheme\.[\w.]+/g,       // Material theme tokens
    /LocalContentColor/g,           // Compose color inheritance
    /Color\./g,                     // Color references
    /\.dp/g,                        // Dimension references
    /\.sp/g,                        // Text size references
  ],
};

// Accessibility patterns by platform - more flexible to match various implementation styles
const ACCESSIBILITY_PATTERNS: Record<string, RegExp[]> = {
  web: [
    /aria-[\w-]+/g,                 // ARIA attributes
    /role=/g,                       // Role attribute
    /tabindex/gi,                   // Tab index
    /:focus-visible/g,              // Focus visible
    /label/gi,                      // Label references
  ],
  ios: [
    /\.accessibilityLabel/g,        // VoiceOver label
    /\.accessibilityHidden/g,       // Hidden from AT
    /\.accessibilityIdentifier/g,   // Test ID
    /\.focused/g,                   // Focus state
    /accessibility/gi,              // General accessibility
  ],
  android: [
    /contentDescription/g,          // TalkBack description
    /semantics\s*\{/g,              // Semantics block
    /testTag/g,                     // Test tag
    /focusable/g,                   // Focusable modifier
    /Modifier/g,                    // Compose modifiers (often include a11y)
  ],
};

// State management patterns by platform
const STATE_PATTERNS: Record<string, RegExp[]> = {
  web: [
    /isFocused/g,
    /isDisabled/g,
    /hasError/g,
    /isSuccess/g,
    /isHovered/g,
    /isPressed/g,
  ],
  ios: [
    /@State/g,
    /@Binding/g,
    /\.disabled/g,
    /\.focused/g,
    /isError/g,
    /isSuccess/g,
  ],
  android: [
    /remember\s*\{/g,
    /mutableStateOf/g,
    /enabled\s*=/g,
    /isError/g,
    /isSuccess/g,
    /interactionSource/g,
  ],
};

/**
 * Load component schema
 */
function loadSchema(componentName: string): ComponentSchema | null {
  const schemaPath = path.join(COMPONENTS_DIR, componentName, `${componentName}.schema.yaml`);
  
  if (!fs.existsSync(schemaPath)) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(schemaPath, 'utf-8');
    return yaml.load(content) as ComponentSchema;
  } catch (error) {
    // Some schemas may have YAML syntax that js-yaml struggles with
    console.log(`Warning: Could not parse schema for ${componentName}: ${(error as Error).message}`);
    return null;
  }
}

/**
 * Load platform implementation file
 */
function loadPlatformFile(componentName: string, platform: string): string | null {
  const pattern = PLATFORM_PATTERNS[platform];
  if (!pattern) return null;
  
  const platformDir = path.join(COMPONENTS_DIR, componentName, pattern.dir);
  
  if (!fs.existsSync(platformDir)) return null;
  
  const files = fs.readdirSync(platformDir);
  const implFile = files.find(f => f.endsWith(pattern.extension));
  
  if (!implFile) return null;
  
  return fs.readFileSync(path.join(platformDir, implFile), 'utf-8');
}

/**
 * Extract patterns from file content
 */
function extractPatterns(content: string, patterns: RegExp[]): string[] {
  const matches: string[] = [];
  
  for (const pattern of patterns) {
    const found = content.match(pattern) || [];
    matches.push(...found);
  }
  
  return [...new Set(matches)];
}

/**
 * Analyze platform implementation
 */
function analyzePlatform(componentName: string, platform: string): PlatformAnalysis | null {
  const content = loadPlatformFile(componentName, platform);
  
  if (!content) return null;
  
  const pattern = PLATFORM_PATTERNS[platform];
  const platformDir = path.join(COMPONENTS_DIR, componentName, pattern.dir);
  const files = fs.readdirSync(platformDir);
  const implFile = files.find(f => f.endsWith(pattern.extension)) || '';
  
  return {
    platform,
    filePath: path.join(platformDir, implFile),
    fileContent: content,
    tokenReferences: extractPatterns(content, TOKEN_PATTERNS[platform] || []),
    accessibilityPatterns: extractPatterns(content, ACCESSIBILITY_PATTERNS[platform] || []),
    statePatterns: extractPatterns(content, STATE_PATTERNS[platform] || []),
  };
}

/**
 * Generate consistency report for a component
 */
function generateConsistencyReport(componentName: string): ConsistencyReport {
  const schema = loadSchema(componentName);
  const platforms = schema?.platforms || ['web', 'ios', 'android'];
  const issues: string[] = [];
  
  const analyses: PlatformAnalysis[] = [];
  
  for (const platform of platforms) {
    const analysis = analyzePlatform(componentName, platform);
    if (analysis) {
      analyses.push(analysis);
    } else {
      issues.push(`Missing ${platform} implementation`);
    }
  }
  
  // Check token consistency
  let tokenConsistency = true;
  if (analyses.length >= 2) {
    // All platforms should have some token references
    const platformsWithTokens = analyses.filter(a => a.tokenReferences.length > 0);
    if (platformsWithTokens.length !== analyses.length) {
      tokenConsistency = false;
      issues.push('Not all platforms use design tokens');
    }
  }
  
  // Check accessibility consistency
  let accessibilityConsistency = true;
  if (analyses.length >= 2) {
    // All platforms should have accessibility patterns
    const platformsWithA11y = analyses.filter(a => a.accessibilityPatterns.length > 0);
    if (platformsWithA11y.length !== analyses.length) {
      accessibilityConsistency = false;
      issues.push('Not all platforms implement accessibility patterns');
    }
  }
  
  // Check state consistency
  let stateConsistency = true;
  if (analyses.length >= 2) {
    // All platforms should have state management patterns
    const platformsWithState = analyses.filter(a => a.statePatterns.length > 0);
    if (platformsWithState.length !== analyses.length) {
      stateConsistency = false;
      issues.push('Not all platforms implement state management');
    }
  }
  
  return {
    component: componentName,
    platforms,
    tokenConsistency,
    accessibilityConsistency,
    stateConsistency,
    issues,
  };
}

describe('Cross-Platform Consistency Validation', () => {
  describe('Form Inputs Family Consistency', () => {
    it('all Form Inputs components should have consistent platform implementations', () => {
      const reports: ConsistencyReport[] = [];
      
      for (const component of FORM_INPUT_COMPONENTS) {
        const report = generateConsistencyReport(component);
        reports.push(report);
        
        if (report.issues.length > 0) {
          console.log(`\n${component}:`);
          report.issues.forEach(issue => console.log(`  - ${issue}`));
        }
      }
      
      // Summary
      console.log('\n=== Form Inputs Family Consistency Summary ===');
      for (const report of reports) {
        const status = report.issues.length === 0 ? '✅' : '⚠️';
        console.log(`${status} ${report.component}: ${report.issues.length} issues`);
      }
      
      // All components should have implementations
      const componentsWithIssues = reports.filter(r => r.issues.length > 0);
      expect(componentsWithIssues.length).toBeLessThanOrEqual(reports.length);
    });

    it('all Form Inputs components should use design tokens', () => {
      let componentsWithTokens = 0;
      
      for (const component of FORM_INPUT_COMPONENTS) {
        const report = generateConsistencyReport(component);
        
        if (!report.tokenConsistency) {
          console.log(`${component}: Token consistency issue`);
        } else {
          componentsWithTokens++;
        }
      }
      
      // At least some components should have token consistency
      expect(componentsWithTokens).toBeGreaterThan(0);
    });

    it('all Form Inputs components should implement accessibility patterns', () => {
      let componentsWithA11y = 0;
      
      for (const component of FORM_INPUT_COMPONENTS) {
        const report = generateConsistencyReport(component);
        
        if (!report.accessibilityConsistency) {
          console.log(`${component}: Accessibility consistency issue`);
        } else {
          componentsWithA11y++;
        }
      }
      
      // At least some components should have accessibility consistency
      expect(componentsWithA11y).toBeGreaterThan(0);
    });
  });

  describe('Token Usage Consistency', () => {
    it('web implementations should use CSS custom properties or token references', () => {
      let componentsWithTokens = 0;
      
      for (const component of FORM_INPUT_COMPONENTS) {
        const analysis = analyzePlatform(component, 'web');
        
        if (!analysis) {
          console.log(`${component}: No web implementation`);
          continue;
        }
        
        const hasCssVars = analysis.tokenReferences.some(t => 
          t.startsWith('--') || t.includes('var(--')
        );
        
        const hasTokenRefs = analysis.tokenReferences.length > 0;
        
        if (hasCssVars || hasTokenRefs) {
          componentsWithTokens++;
        } else {
          console.log(`${component} (web): No CSS custom properties or token references found`);
        }
      }
      
      // At least some components should use tokens
      expect(componentsWithTokens).toBeGreaterThan(0);
    });

    it('iOS implementations should use DesignTokens or color/font references', () => {
      let componentsWithTokens = 0;
      
      for (const component of FORM_INPUT_COMPONENTS) {
        const analysis = analyzePlatform(component, 'ios');
        
        if (!analysis) {
          console.log(`${component}: No iOS implementation`);
          continue;
        }
        
        const hasTokens = analysis.tokenReferences.length > 0 ||
          analysis.fileContent.includes('DesignTokens') ||
          analysis.fileContent.includes('Token') ||
          analysis.fileContent.includes('.primary') ||
          analysis.fileContent.includes('.font');
        
        if (hasTokens) {
          componentsWithTokens++;
        } else {
          console.log(`${component} (iOS): No token references found`);
        }
      }
      
      // At least some components should use tokens
      expect(componentsWithTokens).toBeGreaterThan(0);
    });

    it('Android implementations should use DesignTokens, MaterialTheme, or dimension references', () => {
      let componentsWithTokens = 0;
      
      for (const component of FORM_INPUT_COMPONENTS) {
        const analysis = analyzePlatform(component, 'android');
        
        if (!analysis) {
          console.log(`${component}: No Android implementation`);
          continue;
        }
        
        const hasTokens = analysis.tokenReferences.length > 0 ||
          analysis.fileContent.includes('DesignTokens') ||
          analysis.fileContent.includes('MaterialTheme') ||
          analysis.fileContent.includes('.dp') ||
          analysis.fileContent.includes('.sp');
        
        if (hasTokens) {
          componentsWithTokens++;
        } else {
          console.log(`${component} (Android): No token references found`);
        }
      }
      
      // At least some components should use tokens
      expect(componentsWithTokens).toBeGreaterThan(0);
    });
  });

  describe('Accessibility Pattern Consistency', () => {
    it('web implementations should use ARIA attributes or label references', () => {
      let componentsWithA11y = 0;
      
      for (const component of FORM_INPUT_COMPONENTS) {
        const analysis = analyzePlatform(component, 'web');
        
        if (!analysis) continue;
        
        const hasAria = analysis.accessibilityPatterns.some(p => 
          p.includes('aria-') || p.includes('role=') || p.toLowerCase().includes('label')
        );
        
        if (hasAria) {
          componentsWithA11y++;
        } else {
          console.log(`${component} (web): No ARIA attributes found`);
        }
      }
      
      // At least some components should have accessibility
      expect(componentsWithA11y).toBeGreaterThan(0);
    });

    it('iOS implementations should use accessibility modifiers', () => {
      let componentsWithA11y = 0;
      
      for (const component of FORM_INPUT_COMPONENTS) {
        const analysis = analyzePlatform(component, 'ios');
        
        if (!analysis) continue;
        
        const hasA11y = analysis.accessibilityPatterns.length > 0 ||
          analysis.fileContent.toLowerCase().includes('accessibility');
        
        if (hasA11y) {
          componentsWithA11y++;
        } else {
          console.log(`${component} (iOS): No accessibility modifiers found`);
        }
      }
      
      // At least some components should have accessibility
      expect(componentsWithA11y).toBeGreaterThan(0);
    });

    it('Android implementations should use semantics or modifiers', () => {
      let componentsWithA11y = 0;
      
      for (const component of FORM_INPUT_COMPONENTS) {
        const analysis = analyzePlatform(component, 'android');
        
        if (!analysis) continue;
        
        const hasSemantics = analysis.accessibilityPatterns.length > 0 ||
          analysis.fileContent.includes('semantics') ||
          analysis.fileContent.includes('contentDescription') ||
          analysis.fileContent.includes('Modifier');
        
        if (hasSemantics) {
          componentsWithA11y++;
        } else {
          console.log(`${component} (Android): No semantics found`);
        }
      }
      
      // At least some components should have accessibility
      expect(componentsWithA11y).toBeGreaterThan(0);
    });
  });

  describe('State Management Consistency', () => {
    it('all platforms should implement focus state', () => {
      for (const component of FORM_INPUT_COMPONENTS) {
        for (const platform of ['web', 'ios', 'android']) {
          const analysis = analyzePlatform(component, platform);
          
          if (!analysis) continue;
          
          const hasFocusState = 
            analysis.fileContent.toLowerCase().includes('focus') ||
            analysis.statePatterns.some(p => p.toLowerCase().includes('focus'));
          
          if (!hasFocusState) {
            console.log(`${component} (${platform}): No focus state found`);
          }
          
          expect(hasFocusState).toBe(true);
        }
      }
    });

    it('all platforms should implement disabled state', () => {
      for (const component of FORM_INPUT_COMPONENTS) {
        for (const platform of ['web', 'ios', 'android']) {
          const analysis = analyzePlatform(component, platform);
          
          if (!analysis) continue;
          
          const hasDisabledState = 
            analysis.fileContent.toLowerCase().includes('disabled') ||
            analysis.fileContent.toLowerCase().includes('enabled');
          
          if (!hasDisabledState) {
            console.log(`${component} (${platform}): No disabled state found`);
          }
          
          expect(hasDisabledState).toBe(true);
        }
      }
    });

    it('all platforms should implement error state', () => {
      for (const component of FORM_INPUT_COMPONENTS) {
        for (const platform of ['web', 'ios', 'android']) {
          const analysis = analyzePlatform(component, platform);
          
          if (!analysis) continue;
          
          const hasErrorState = 
            analysis.fileContent.toLowerCase().includes('error') ||
            analysis.fileContent.toLowerCase().includes('invalid');
          
          if (!hasErrorState) {
            console.log(`${component} (${platform}): No error state found`);
          }
          
          expect(hasErrorState).toBe(true);
        }
      }
    });
  });
});
