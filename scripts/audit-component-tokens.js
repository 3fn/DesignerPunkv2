#!/usr/bin/env node

/**
 * Component Token Audit Script
 * 
 * Scans component files for hard-coded values and generates a report
 * identifying violations that should be replaced with design tokens.
 * 
 * Usage:
 *   npm run audit:tokens                    # Audit all components
 *   npm run audit:tokens -- ButtonCTA       # Audit specific component
 *   npm run audit:tokens -- --detailed      # Generate detailed report
 */

const fs = require('fs');
const path = require('path');

/**
 * Configuration
 */
const CONFIG = {
  componentsDir: path.join(__dirname, '../src/components/core'),
  outputDir: path.join(__dirname, '../.kiro/specs/017-component-code-quality-sweep'),
  platforms: ['web', 'ios', 'android'],
  fileExtensions: {
    web: ['.ts', '.tsx', '.js', '.jsx'],
    ios: ['.swift'],
    android: ['.kt']
  }
};

/**
 * Audit Report Structure
 */
class AuditReport {
  constructor() {
    this.summary = {
      totalComponents: 0,
      totalViolations: 0,
      violationsByType: {
        color: 0,
        spacing: 0,
        motion: 0,
        typography: 0
      },
      violationsByPriority: {
        high: 0,    // Colors, spacing
        medium: 0,  // Motion
        low: 0      // Edge cases
      }
    };
    this.components = [];
  }

  /**
   * Add component violations to report
   */
  addComponent(componentViolations) {
    this.components.push(componentViolations);
    this.summary.totalComponents++;
    
    // Update summary statistics
    componentViolations.violations.forEach(violation => {
      this.summary.totalViolations++;
      this.summary.violationsByType[violation.type]++;
      this.summary.violationsByPriority[violation.priority]++;
    });
  }

  /**
   * Generate markdown report
   */
  toMarkdown() {
    let markdown = '# Component Token Audit Report\n\n';
    markdown += `**Date**: ${new Date().toISOString().split('T')[0]}\n`;
    markdown += `**Total Components Audited**: ${this.summary.totalComponents}\n`;
    markdown += `**Total Violations Found**: ${this.summary.totalViolations}\n\n`;

    // Summary by type
    markdown += '## Violations by Type\n\n';
    markdown += `- **Color**: ${this.summary.violationsByType.color}\n`;
    markdown += `- **Spacing**: ${this.summary.violationsByType.spacing}\n`;
    markdown += `- **Motion**: ${this.summary.violationsByType.motion}\n`;
    markdown += `- **Typography**: ${this.summary.violationsByType.typography}\n\n`;

    // Summary by priority
    markdown += '## Violations by Priority\n\n';
    markdown += `- **High** (Colors, Spacing): ${this.summary.violationsByPriority.high}\n`;
    markdown += `- **Medium** (Motion): ${this.summary.violationsByPriority.medium}\n`;
    markdown += `- **Low** (Edge Cases): ${this.summary.violationsByPriority.low}\n\n`;

    // Component details
    markdown += '## Component Details\n\n';
    this.components.forEach(component => {
      markdown += `### ${component.componentName} (${component.platform})\n\n`;
      markdown += `**File**: \`${component.filePath}\`\n`;
      markdown += `**Violations**: ${component.violations.length}\n\n`;

      if (component.violations.length > 0) {
        component.violations.forEach(violation => {
          markdown += `#### Line ${violation.lineNumber}: ${violation.type} (${violation.priority} priority)\n\n`;
          markdown += `**Current Value**: \`${violation.currentValue}\`\n`;
          markdown += `**Suggested Token**: \`${violation.suggestedToken}\`\n`;
          if (violation.isFallbackPattern) {
            markdown += `**⚠️ Fallback Pattern**: This uses a hard-coded fallback value\n`;
          }
          markdown += `\n**Context**:\n\`\`\`\n${violation.context}\n\`\`\`\n\n`;
        });
      }
    });

    return markdown;
  }
}

/**
 * Component Violations Structure
 */
class ComponentViolations {
  constructor(componentName, platform, filePath) {
    this.componentName = componentName;
    this.platform = platform;
    this.filePath = filePath;
    this.violations = [];
  }

  /**
   * Add violation to component
   */
  addViolation(violation) {
    this.violations.push(violation);
  }
}

/**
 * File Scanner
 * Identifies component files to audit
 */
class FileScanner {
  /**
   * Get all component directories
   */
  getComponentDirectories() {
    const componentsDir = CONFIG.componentsDir;
    
    if (!fs.existsSync(componentsDir)) {
      console.error(`Components directory not found: ${componentsDir}`);
      return [];
    }

    const entries = fs.readdirSync(componentsDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => ({
        name: entry.name,
        path: path.join(componentsDir, entry.name)
      }));
  }

  /**
   * Get platform files for a component
   */
  getPlatformFiles(componentDir, platform) {
    const platformDir = path.join(componentDir, 'platforms', platform);
    
    if (!fs.existsSync(platformDir)) {
      return [];
    }

    const extensions = CONFIG.fileExtensions[platform];
    const files = [];

    const scanDirectory = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      });
    };

    scanDirectory(platformDir);
    return files;
  }

  /**
   * Get all component files to audit
   */
  getAllComponentFiles(specificComponent = null) {
    const components = this.getComponentDirectories();
    const filesToAudit = [];

    components.forEach(component => {
      // Skip if specific component requested and this isn't it
      if (specificComponent && component.name !== specificComponent) {
        return;
      }

      CONFIG.platforms.forEach(platform => {
        const platformFiles = this.getPlatformFiles(component.path, platform);
        platformFiles.forEach(file => {
          filesToAudit.push({
            componentName: component.name,
            platform: platform,
            filePath: file
          });
        });
      });
    });

    return filesToAudit;
  }
}

/**
 * Token Matcher
 * Matches detected values to semantic or primitive tokens
 */
class TokenMatcher {
  constructor() {
    // Semantic color tokens (prefer these first)
    this.semanticColorTokens = {
      // Brand
      'color.primary': { primitive: 'purple300', description: 'Primary brand color' },
      
      // Status - Success
      'color.success.strong': { primitive: 'green400', description: 'Strong success color' },
      'color.success.subtle': { primitive: 'green100', description: 'Subtle success color' },
      
      // Status - Warning
      'color.warning.strong': { primitive: 'orange400', description: 'Strong warning color' },
      'color.warning.subtle': { primitive: 'orange100', description: 'Subtle warning color' },
      
      // Status - Error
      'color.error.strong': { primitive: 'pink400', description: 'Strong error color' },
      'color.error.subtle': { primitive: 'pink100', description: 'Subtle error color' },
      
      // Informational
      'color.info.strong': { primitive: 'teal400', description: 'Strong info color' },
      'color.info.subtle': { primitive: 'teal100', description: 'Subtle info color' },
      
      // Attention & Highlight
      'color.attention': { primitive: 'yellow400', description: 'Attention color' },
      'color.highlight': { primitive: 'yellow300', description: 'Highlight color' },
      
      // Tech & Data
      'color.tech': { primitive: 'cyan400', description: 'Tech color' },
      'color.data': { primitive: 'cyan300', description: 'Data color' },
      
      // Text
      'color.text.default': { primitive: 'gray300', description: 'Primary text color' },
      'color.text.muted': { primitive: 'gray200', description: 'Muted text color' },
      'color.text.subtle': { primitive: 'gray100', description: 'Subtle text color' },
      'color.text.onPrimary': { primitive: 'white100', description: 'Text on primary backgrounds' },
      
      // Surfaces
      'color.background': { primitive: 'white100', description: 'Primary background' },
      'color.surface': { primitive: 'white200', description: 'Surface color for cards' },
      'color.border': { primitive: 'gray100', description: 'Border color' }
    };

    // Semantic spacing tokens (prefer these first)
    this.semanticSpacingTokens = {
      // Layout - Grouped
      'space.grouped.minimal': { primitive: 'space025', value: 2, description: 'Extremely tight grouping' },
      'space.grouped.tight': { primitive: 'space050', value: 4, description: 'Tight grouping' },
      'space.grouped.normal': { primitive: 'space100', value: 8, description: 'Standard grouping' },
      'space.grouped.loose': { primitive: 'space150', value: 12, description: 'Generous grouping' },
      
      // Layout - Related
      'space.related.tight': { primitive: 'space100', value: 8, description: 'Minimal related separation' },
      'space.related.normal': { primitive: 'space200', value: 16, description: 'Standard related separation' },
      'space.related.loose': { primitive: 'space300', value: 24, description: 'Generous related separation' },
      
      // Layout - Separated
      'space.separated.tight': { primitive: 'space200', value: 16, description: 'Minimal separated distinction' },
      'space.separated.normal': { primitive: 'space300', value: 24, description: 'Standard separated distinction' },
      'space.separated.loose': { primitive: 'space400', value: 32, description: 'Generous separated distinction' },
      
      // Layout - Sectioned
      'space.sectioned.tight': { primitive: 'space400', value: 32, description: 'Minimal section boundary' },
      'space.sectioned.normal': { primitive: 'space500', value: 40, description: 'Standard section boundary' },
      'space.sectioned.loose': { primitive: 'space600', value: 48, description: 'Generous section boundary' },
      
      // Inset
      'space.inset.050': { primitive: 'space050', value: 4, description: 'Minimal internal spacing' },
      'space.inset.100': { primitive: 'space100', value: 8, description: 'Compact internal spacing' },
      'space.inset.150': { primitive: 'space150', value: 12, description: 'Standard internal spacing' },
      'space.inset.200': { primitive: 'space200', value: 16, description: 'Comfortable internal spacing' },
      'space.inset.300': { primitive: 'space300', value: 24, description: 'Spacious internal spacing' },
      'space.inset.400': { primitive: 'space400', value: 32, description: 'Maximum internal spacing' }
    };

    // Primitive spacing tokens (fallback when semantic doesn't exist)
    this.primitiveSpacingTokens = {
      'space025': { value: 2, description: 'Extra tight spacing - 0.25x base' },
      'space050': { value: 4, description: 'Tight spacing - 0.5x base' },
      'space075': { value: 6, description: 'Strategic flexibility - 0.75x base' },
      'space100': { value: 8, description: 'Base spacing - 1x base' },
      'space125': { value: 10, description: 'Strategic flexibility - 1.25x base' },
      'space150': { value: 12, description: 'Medium spacing - 1.5x base' },
      'space200': { value: 16, description: 'Large spacing - 2x base' },
      'space250': { value: 20, description: 'Strategic flexibility - 2.5x base' },
      'space300': { value: 24, description: 'Extra large spacing - 3x base' },
      'space400': { value: 32, description: 'Huge spacing - 4x base' },
      'space500': { value: 40, description: 'Massive spacing - 5x base' },
      'space600': { value: 48, description: 'Maximum spacing - 6x base' }
    };

    // Semantic motion tokens
    this.semanticMotionTokens = {
      'motion.floatLabel': { value: 250, description: 'Float label animation duration' },
      'motion.focus': { value: 150, description: 'Focus state animation duration' }
    };

    // Primitive motion tokens (fallback)
    this.primitiveMotionTokens = {
      'motion100': { value: 100, description: 'Quick motion' },
      'motion150': { value: 150, description: 'Fast motion' },
      'motion200': { value: 200, description: 'Standard motion' },
      'motion250': { value: 250, description: 'Moderate motion' },
      'motion300': { value: 300, description: 'Slow motion' }
    };
  }

  /**
   * Match spacing value to best token
   * Prefers semantic tokens, falls back to primitive
   */
  matchSpacing(value) {
    const numValue = parseFloat(value);
    
    // Try semantic tokens first
    for (const [tokenName, tokenInfo] of Object.entries(this.semanticSpacingTokens)) {
      if (tokenInfo.value === numValue) {
        return {
          token: tokenName,
          type: 'semantic',
          description: tokenInfo.description,
          primitive: tokenInfo.primitive
        };
      }
    }
    
    // Fall back to primitive tokens
    for (const [tokenName, tokenInfo] of Object.entries(this.primitiveSpacingTokens)) {
      if (tokenInfo.value === numValue) {
        return {
          token: tokenName,
          type: 'primitive',
          description: tokenInfo.description,
          note: 'Consider if semantic token would be more appropriate'
        };
      }
    }
    
    // No exact match - suggest closest token
    const closest = this.findClosestSpacing(numValue);
    return {
      token: closest.token,
      type: closest.type,
      description: closest.description,
      note: `No exact match for ${numValue}. Closest: ${closest.token} (${closest.value})`
    };
  }

  /**
   * Find closest spacing token to a value
   */
  findClosestSpacing(value) {
    let closest = null;
    let minDiff = Infinity;
    
    // Check semantic tokens first
    for (const [tokenName, tokenInfo] of Object.entries(this.semanticSpacingTokens)) {
      const diff = Math.abs(tokenInfo.value - value);
      if (diff < minDiff) {
        minDiff = diff;
        closest = {
          token: tokenName,
          type: 'semantic',
          value: tokenInfo.value,
          description: tokenInfo.description
        };
      }
    }
    
    // Check primitive tokens
    for (const [tokenName, tokenInfo] of Object.entries(this.primitiveSpacingTokens)) {
      const diff = Math.abs(tokenInfo.value - value);
      if (diff < minDiff) {
        minDiff = diff;
        closest = {
          token: tokenName,
          type: 'primitive',
          value: tokenInfo.value,
          description: tokenInfo.description
        };
      }
    }
    
    return closest;
  }

  /**
   * Match motion duration to best token
   * Prefers semantic tokens, falls back to primitive
   */
  matchMotion(value) {
    const numValue = parseFloat(value);
    
    // Try semantic tokens first
    for (const [tokenName, tokenInfo] of Object.entries(this.semanticMotionTokens)) {
      if (tokenInfo.value === numValue) {
        return {
          token: tokenName,
          type: 'semantic',
          description: tokenInfo.description
        };
      }
    }
    
    // Fall back to primitive tokens
    for (const [tokenName, tokenInfo] of Object.entries(this.primitiveMotionTokens)) {
      if (tokenInfo.value === numValue) {
        return {
          token: tokenName,
          type: 'primitive',
          description: tokenInfo.description,
          note: 'Consider if semantic token would be more appropriate'
        };
      }
    }
    
    // No exact match - suggest closest token
    const closest = this.findClosestMotion(numValue);
    return {
      token: closest.token,
      type: closest.type,
      description: closest.description,
      note: `No exact match for ${numValue}ms. Closest: ${closest.token} (${closest.value}ms)`
    };
  }

  /**
   * Find closest motion token to a value
   */
  findClosestMotion(value) {
    let closest = null;
    let minDiff = Infinity;
    
    // Check semantic tokens first
    for (const [tokenName, tokenInfo] of Object.entries(this.semanticMotionTokens)) {
      const diff = Math.abs(tokenInfo.value - value);
      if (diff < minDiff) {
        minDiff = diff;
        closest = {
          token: tokenName,
          type: 'semantic',
          value: tokenInfo.value,
          description: tokenInfo.description
        };
      }
    }
    
    // Check primitive tokens
    for (const [tokenName, tokenInfo] of Object.entries(this.primitiveMotionTokens)) {
      const diff = Math.abs(tokenInfo.value - value);
      if (diff < minDiff) {
        minDiff = diff;
        closest = {
          token: tokenName,
          type: 'primitive',
          value: tokenInfo.value,
          description: tokenInfo.description
        };
      }
    }
    
    return closest;
  }

  /**
   * Suggest color token based on context
   * Returns generic suggestion since we can't determine semantic meaning from value alone
   */
  suggestColorToken(platform) {
    if (platform === 'web') {
      return 'var(--color-primary) or appropriate semantic color token';
    } else if (platform === 'ios') {
      return 'colorPrimary or appropriate semantic color token';
    } else if (platform === 'android') {
      return 'DesignTokens.color_primary or appropriate semantic color token';
    }
    return 'color.primary or appropriate semantic color token';
  }

  /**
   * Suggest typography token based on context
   */
  suggestTypographyToken(platform) {
    if (platform === 'web') {
      return 'var(--typography-body-md-font-size) or appropriate typography token';
    } else if (platform === 'ios') {
      return 'typographyBodyMdFontSize or appropriate typography token';
    } else if (platform === 'android') {
      return 'DesignTokens.font_size_100 or appropriate typography token';
    }
    return 'typography.bodyMd or appropriate typography token';
  }
}

/**
 * Violation Detector
 * Detects hard-coded values in component files
 */
class ViolationDetector {
  constructor(platform) {
    this.platform = platform;
    this.tokenMatcher = new TokenMatcher();
  }

  /**
   * Detect all violations in file content
   */
  detectViolations(content, filePath) {
    const lines = content.split('\n');
    const violations = [];

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Detect color violations
      violations.push(...this.detectColorViolations(line, lineNumber, lines));
      
      // Detect spacing violations
      violations.push(...this.detectSpacingViolations(line, lineNumber, lines));
      
      // Detect motion violations
      violations.push(...this.detectMotionViolations(line, lineNumber, lines));
      
      // Detect typography violations
      violations.push(...this.detectTypographyViolations(line, lineNumber, lines));
      
      // Detect fallback patterns
      violations.push(...this.detectFallbackPatterns(line, lineNumber, lines));
    });

    return violations;
  }

  /**
   * Detect hard-coded color values
   */
  detectColorViolations(line, lineNumber, allLines) {
    const violations = [];

    if (this.platform === 'ios') {
      // iOS: Color(red:green:blue:) pattern
      const rgbPattern = /Color\s*\(\s*red:\s*[\d.]+\s*(?:\/\s*255)?\s*,\s*green:\s*[\d.]+\s*(?:\/\s*255)?\s*,\s*blue:\s*[\d.]+\s*(?:\/\s*255)?\s*(?:,\s*opacity:\s*[\d.]+)?\s*\)/g;
      let match;
      while ((match = rgbPattern.exec(line)) !== null) {
        violations.push({
          type: 'color',
          priority: 'high',
          lineNumber,
          currentValue: match[0],
          suggestedToken: this.tokenMatcher.suggestColorToken(this.platform),
          context: this.getContext(lineNumber, allLines),
          isFallbackPattern: false
        });
      }
    } else if (this.platform === 'android') {
      // Android: Color(0xRRGGBB) pattern
      const hexPattern = /Color\s*\(\s*0x[0-9A-Fa-f]{6,8}\s*\)/g;
      let match;
      while ((match = hexPattern.exec(line)) !== null) {
        violations.push({
          type: 'color',
          priority: 'high',
          lineNumber,
          currentValue: match[0],
          suggestedToken: this.tokenMatcher.suggestColorToken(this.platform),
          context: this.getContext(lineNumber, allLines),
          isFallbackPattern: false
        });
      }
    } else if (this.platform === 'web') {
      // Web: rgb(), rgba(), hex patterns
      const rgbPattern = /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)/g;
      const hexPattern = /#[0-9A-Fa-f]{3,8}\b/g;
      
      let match;
      while ((match = rgbPattern.exec(line)) !== null) {
        // Skip if it's in a comment
        if (!this.isInComment(line, match.index)) {
          violations.push({
            type: 'color',
            priority: 'high',
            lineNumber,
            currentValue: match[0],
            suggestedToken: this.tokenMatcher.suggestColorToken(this.platform),
            context: this.getContext(lineNumber, allLines),
            isFallbackPattern: false
          });
        }
      }
      
      while ((match = hexPattern.exec(line)) !== null) {
        // Skip if it's in a comment
        if (!this.isInComment(line, match.index)) {
          violations.push({
            type: 'color',
            priority: 'high',
            lineNumber,
            currentValue: match[0],
            suggestedToken: this.tokenMatcher.suggestColorToken(this.platform),
            context: this.getContext(lineNumber, allLines),
            isFallbackPattern: false
          });
        }
      }
    }

    return violations;
  }

  /**
   * Detect hard-coded spacing values
   */
  detectSpacingViolations(line, lineNumber, allLines) {
    const violations = [];

    if (this.platform === 'ios') {
      // iOS: CGFloat literals in padding/spacing contexts
      const spacingPattern = /(?:padding|spacing|frame|offset|inset)\s*\([^)]*?(\d+(?:\.\d+)?)\s*\)/gi;
      let match;
      while ((match = spacingPattern.exec(line)) !== null) {
        const value = match[1];
        // Skip if it's already a token reference
        if (!line.includes('space') && !line.includes('inset')) {
          const matchResult = this.tokenMatcher.matchSpacing(value);
          const suggestion = this.formatSpacingSuggestion(matchResult, 'ios');
          violations.push({
            type: 'spacing',
            priority: 'high',
            lineNumber,
            currentValue: value,
            suggestedToken: suggestion,
            context: this.getContext(lineNumber, allLines),
            isFallbackPattern: false
          });
        }
      }
    } else if (this.platform === 'android') {
      // Android: .dp values
      const dpPattern = /(\d+(?:\.\d+)?)\s*\.dp\b/g;
      let match;
      while ((match = dpPattern.exec(line)) !== null) {
        const value = match[1];
        // Skip if it's already a token reference
        if (!line.includes('space') && !line.includes('inset')) {
          const matchResult = this.tokenMatcher.matchSpacing(value);
          const suggestion = this.formatSpacingSuggestion(matchResult, 'android');
          violations.push({
            type: 'spacing',
            priority: 'high',
            lineNumber,
            currentValue: match[0],
            suggestedToken: suggestion,
            context: this.getContext(lineNumber, allLines),
            isFallbackPattern: false
          });
        }
      }
    } else if (this.platform === 'web') {
      // Web: px values in CSS
      const pxPattern = /:\s*(\d+(?:\.\d+)?)px\b/g;
      let match;
      while ((match = pxPattern.exec(line)) !== null) {
        const value = match[1];
        // Skip if it's already a var() reference
        if (!line.includes('var(--') && !this.isInComment(line, match.index)) {
          const matchResult = this.tokenMatcher.matchSpacing(value);
          const suggestion = this.formatSpacingSuggestion(matchResult, 'web');
          violations.push({
            type: 'spacing',
            priority: 'high',
            lineNumber,
            currentValue: match[1] + 'px',
            suggestedToken: suggestion,
            context: this.getContext(lineNumber, allLines),
            isFallbackPattern: false
          });
        }
      }
    }

    return violations;
  }

  /**
   * Format spacing token suggestion based on platform
   */
  formatSpacingSuggestion(matchResult, platform) {
    let suggestion = '';
    
    if (platform === 'web') {
      // Convert token name to CSS custom property format
      const cssToken = matchResult.token.replace(/\./g, '-');
      suggestion = `var(--${cssToken})`;
    } else if (platform === 'ios') {
      // Convert to camelCase for Swift
      const swiftToken = matchResult.token
        .split('.')
        .map((part, i) => i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
      suggestion = swiftToken;
    } else if (platform === 'android') {
      // Convert to snake_case for Kotlin (DesignTokens.space_inset_200)
      const kotlinToken = matchResult.token.replace(/\./g, '_');
      suggestion = `DesignTokens.${kotlinToken}.dp`;
    }
    
    // Add note if it's a primitive token or has a note
    if (matchResult.type === 'primitive') {
      suggestion += ' (primitive - consider semantic alternative)';
    } else if (matchResult.note) {
      suggestion += ` (${matchResult.note})`;
    }
    
    return suggestion;
  }

  /**
   * Detect hard-coded motion durations
   */
  detectMotionViolations(line, lineNumber, allLines) {
    const violations = [];

    if (this.platform === 'ios') {
      // iOS: animation duration literals
      const durationPattern = /(?:duration|withAnimation).*?(\d+(?:\.\d+)?)\s*(?:seconds?)?/gi;
      let match;
      while ((match = durationPattern.exec(line)) !== null) {
        const value = match[1];
        // Skip if it's already a token reference
        if (!line.includes('motion') && !this.isInComment(line, match.index)) {
          // Convert seconds to milliseconds if needed
          const msValue = value < 10 ? parseFloat(value) * 1000 : parseFloat(value);
          const matchResult = this.tokenMatcher.matchMotion(msValue);
          const suggestion = this.formatMotionSuggestion(matchResult, 'ios');
          violations.push({
            type: 'motion',
            priority: 'medium',
            lineNumber,
            currentValue: match[1],
            suggestedToken: suggestion,
            context: this.getContext(lineNumber, allLines),
            isFallbackPattern: false
          });
        }
      }
    } else if (this.platform === 'android') {
      // Android: durationMillis values
      const durationPattern = /durationMillis\s*=\s*(\d+)/g;
      let match;
      while ((match = durationPattern.exec(line)) !== null) {
        const value = match[1];
        // Skip if it's already a token reference
        if (!line.includes('motion')) {
          const matchResult = this.tokenMatcher.matchMotion(parseFloat(value));
          const suggestion = this.formatMotionSuggestion(matchResult, 'android');
          violations.push({
            type: 'motion',
            priority: 'medium',
            lineNumber,
            currentValue: match[1],
            suggestedToken: suggestion,
            context: this.getContext(lineNumber, allLines),
            isFallbackPattern: false
          });
        }
      }
    } else if (this.platform === 'web') {
      // Web: transition/animation duration values
      const durationPattern = /(?:transition|animation).*?(\d+(?:\.\d+)?)(ms|s)\b/gi;
      let match;
      while ((match = durationPattern.exec(line)) !== null) {
        const value = match[1];
        const unit = match[2];
        // Skip if it's already a var() reference
        if (!line.includes('var(--motion') && !this.isInComment(line, match.index)) {
          // Convert to milliseconds
          const msValue = unit === 's' ? parseFloat(value) * 1000 : parseFloat(value);
          const matchResult = this.tokenMatcher.matchMotion(msValue);
          const suggestion = this.formatMotionSuggestion(matchResult, 'web');
          violations.push({
            type: 'motion',
            priority: 'medium',
            lineNumber,
            currentValue: match[1] + unit,
            suggestedToken: suggestion,
            context: this.getContext(lineNumber, allLines),
            isFallbackPattern: false
          });
        }
      }
    }

    return violations;
  }

  /**
   * Format motion token suggestion based on platform
   */
  formatMotionSuggestion(matchResult, platform) {
    let suggestion = '';
    
    if (platform === 'web') {
      // Convert token name to CSS custom property format
      const cssToken = matchResult.token.replace(/\./g, '-');
      suggestion = `var(--${cssToken})`;
    } else if (platform === 'ios') {
      // Convert to camelCase for Swift
      const swiftToken = matchResult.token
        .split('.')
        .map((part, i) => i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
      suggestion = swiftToken;
    } else if (platform === 'android') {
      // Convert to snake_case for Kotlin (DesignTokens.motion_float_label)
      const kotlinToken = matchResult.token.replace(/\./g, '_');
      suggestion = `DesignTokens.${kotlinToken}`;
    }
    
    // Add note if it's a primitive token or has a note
    if (matchResult.type === 'primitive') {
      suggestion += ' (primitive - consider semantic alternative)';
    } else if (matchResult.note) {
      suggestion += ` (${matchResult.note})`;
    }
    
    return suggestion;
  }

  /**
   * Detect hard-coded typography values
   */
  detectTypographyViolations(line, lineNumber, allLines) {
    const violations = [];

    if (this.platform === 'ios') {
      // iOS: Font.system() with hard-coded values
      const fontPattern = /Font\.system\s*\(\s*size:\s*(\d+(?:\.\d+)?)/g;
      let match;
      while ((match = fontPattern.exec(line)) !== null) {
        // Skip if it's already a token reference
        if (!line.includes('typography') && !line.includes('fontSize')) {
          violations.push({
            type: 'typography',
            priority: 'high',
            lineNumber,
            currentValue: match[1],
            suggestedToken: this.tokenMatcher.suggestTypographyToken(this.platform),
            context: this.getContext(lineNumber, allLines),
            isFallbackPattern: false
          });
        }
      }
    } else if (this.platform === 'android') {
      // Android: fontSize in sp
      const fontPattern = /fontSize\s*=\s*(\d+(?:\.\d+)?)\s*\.sp/g;
      let match;
      while ((match = fontPattern.exec(line)) !== null) {
        // Skip if it's already a token reference
        if (!line.includes('typography')) {
          violations.push({
            type: 'typography',
            priority: 'high',
            lineNumber,
            currentValue: match[0],
            suggestedToken: this.tokenMatcher.suggestTypographyToken(this.platform),
            context: this.getContext(lineNumber, allLines),
            isFallbackPattern: false
          });
        }
      }
    } else if (this.platform === 'web') {
      // Web: font-size in px
      const fontPattern = /font-size:\s*(\d+(?:\.\d+)?px)\b/g;
      let match;
      while ((match = fontPattern.exec(line)) !== null) {
        // Skip if it's already a var() reference
        if (!line.includes('var(--typography') && !this.isInComment(line, match.index)) {
          violations.push({
            type: 'typography',
            priority: 'high',
            lineNumber,
            currentValue: match[1],
            suggestedToken: this.tokenMatcher.suggestTypographyToken(this.platform),
            context: this.getContext(lineNumber, allLines),
            isFallbackPattern: false
          });
        }
      }
    }

    return violations;
  }

  /**
   * Detect fallback patterns with hard-coded values
   */
  detectFallbackPatterns(line, lineNumber, allLines) {
    const violations = [];

    // Pattern 1: || with hard-coded number
    const orNumberPattern = /\|\|\s*(\d+(?:\.\d+)?)\b/g;
    let match;
    while ((match = orNumberPattern.exec(line)) !== null) {
      if (!this.isInComment(line, match.index)) {
        violations.push({
          type: 'spacing', // Assume spacing, could be motion
          priority: 'high',
          lineNumber,
          currentValue: `|| ${match[1]}`,
          suggestedToken: 'Remove fallback - fail loudly when token missing',
          context: this.getContext(lineNumber, allLines),
          isFallbackPattern: true
        });
      }
    }

    // Pattern 2: || with hard-coded string (duration, color, etc.)
    const orStringPattern = /\|\|\s*['"`]([^'"`]+)['"`]/g;
    while ((match = orStringPattern.exec(line)) !== null) {
      if (!this.isInComment(line, match.index)) {
        const value = match[1];
        // Check if it looks like a duration, color, or other hard-coded value
        if (/^\d+(?:ms|s|px|dp|pt)$/.test(value) || /^#[0-9A-Fa-f]{3,8}$/.test(value) || /^rgba?\(/.test(value)) {
          violations.push({
            type: 'motion', // Could be spacing or color
            priority: 'high',
            lineNumber,
            currentValue: `|| '${value}'`,
            suggestedToken: 'Remove fallback - fail loudly when token missing',
            context: this.getContext(lineNumber, allLines),
            isFallbackPattern: true
          });
        }
      }
    }

    // Pattern 3: ?? with hard-coded number
    const nullishNumberPattern = /\?\?\s*(\d+(?:\.\d+)?)\b/g;
    while ((match = nullishNumberPattern.exec(line)) !== null) {
      if (!this.isInComment(line, match.index)) {
        violations.push({
          type: 'spacing',
          priority: 'high',
          lineNumber,
          currentValue: `?? ${match[1]}`,
          suggestedToken: 'Remove fallback - fail loudly when token missing',
          context: this.getContext(lineNumber, allLines),
          isFallbackPattern: true
        });
      }
    }

    // Pattern 4: Ternary with hard-coded values
    const ternaryPattern = /\?\s*(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)/g;
    while ((match = ternaryPattern.exec(line)) !== null) {
      if (!this.isInComment(line, match.index)) {
        violations.push({
          type: 'spacing',
          priority: 'high',
          lineNumber,
          currentValue: `? ${match[1]} : ${match[2]}`,
          suggestedToken: 'Remove fallback - fail loudly when token missing',
          context: this.getContext(lineNumber, allLines),
          isFallbackPattern: true
        });
      }
    }

    return violations;
  }

  /**
   * Get context lines around a violation
   */
  getContext(lineNumber, allLines, contextLines = 2) {
    const start = Math.max(0, lineNumber - contextLines - 1);
    const end = Math.min(allLines.length, lineNumber + contextLines);
    return allLines.slice(start, end).join('\n');
  }

  /**
   * Check if position is within a comment
   */
  isInComment(line, position) {
    // Check for // comments
    const commentIndex = line.indexOf('//');
    if (commentIndex !== -1 && commentIndex < position) {
      return true;
    }
    
    // Check for /* */ comments (simple check)
    const blockCommentStart = line.indexOf('/*');
    const blockCommentEnd = line.indexOf('*/');
    if (blockCommentStart !== -1 && blockCommentEnd !== -1) {
      if (position > blockCommentStart && position < blockCommentEnd) {
        return true;
      }
    }
    
    return false;
  }
}

/**
 * Main audit function
 */
function runAudit(options = {}) {
  console.log('🔍 Starting component token audit...\n');

  const scanner = new FileScanner();
  const report = new AuditReport();

  // Get files to audit
  const filesToAudit = scanner.getAllComponentFiles(options.component);
  
  if (filesToAudit.length === 0) {
    console.log('No component files found to audit.');
    return;
  }

  console.log(`Found ${filesToAudit.length} files to audit\n`);

  // Audit each file
  filesToAudit.forEach(fileInfo => {
    const componentViolations = new ComponentViolations(
      fileInfo.componentName,
      fileInfo.platform,
      fileInfo.filePath
    );

    // Read file content
    const content = fs.readFileSync(fileInfo.filePath, 'utf-8');
    
    // Detect violations
    const detector = new ViolationDetector(fileInfo.platform);
    const violations = detector.detectViolations(content, fileInfo.filePath);
    
    // Add violations to component
    violations.forEach(violation => {
      componentViolations.addViolation(violation);
    });

    report.addComponent(componentViolations);
  });

  // Generate report
  const reportPath = path.join(CONFIG.outputDir, 'audit-report.md');
  const reportContent = report.toMarkdown();
  
  // Ensure output directory exists
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  fs.writeFileSync(reportPath, reportContent);

  console.log('✅ Audit complete!');
  console.log(`📄 Report saved to: ${reportPath}\n`);
  console.log('Summary:');
  console.log(`  Components audited: ${report.summary.totalComponents}`);
  console.log(`  Total violations: ${report.summary.totalViolations}`);
  console.log(`  High priority: ${report.summary.violationsByPriority.high}`);
  console.log(`  Medium priority: ${report.summary.violationsByPriority.medium}`);
  console.log(`  Low priority: ${report.summary.violationsByPriority.low}`);
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    component: null,
    detailed: false
  };

  args.forEach(arg => {
    if (arg === '--detailed') {
      options.detailed = true;
    } else if (!arg.startsWith('--')) {
      options.component = arg;
    }
  });

  return options;
}

/**
 * Entry point
 */
if (require.main === module) {
  const options = parseArgs();
  runAudit(options);
}

module.exports = {
  FileScanner,
  AuditReport,
  ComponentViolations,
  ViolationDetector,
  runAudit
};
