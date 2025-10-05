/**
 * Tree-Shaking Optimizer
 * 
 * Provides tree-shaking optimization support for token files, enabling
 * build systems to eliminate unused tokens and reduce bundle sizes.
 * Generates optimized token exports with proper ESM structure.
 */

import type { PrimitiveToken, SemanticToken } from '../types';

/**
 * Tree-shaking optimization level
 */
export type OptimizationLevel = 'none' | 'basic' | 'aggressive';

/**
 * Tree-shaking configuration
 */
export interface TreeShakingConfig {
  /** Optimization level */
  level?: OptimizationLevel;
  
  /** Enable side-effect free marking */
  sideEffectFree?: boolean;
  
  /** Generate individual token exports */
  individualExports?: boolean;
  
  /** Enable dead code elimination hints */
  deadCodeElimination?: boolean;
  
  /** Preserve specific tokens even if unused */
  preserve?: string[];
}

/**
 * Optimization result
 */
export interface OptimizationResult {
  /** Original token count */
  originalCount: number;
  
  /** Optimized token count */
  optimizedCount: number;
  
  /** Estimated size reduction (bytes) */
  sizeReduction: number;
  
  /** Optimization level used */
  level: OptimizationLevel;
  
  /** Tokens that were preserved */
  preserved: string[];
  
  /** Optimization warnings */
  warnings: string[];
}

/**
 * Export structure for tree-shaking
 */
export interface TreeShakableExport {
  /** Export name */
  name: string;
  
  /** Export value */
  value: unknown;
  
  /** Whether this export has side effects */
  hasSideEffects: boolean;
  
  /** Dependencies on other exports */
  dependencies: string[];
}

/**
 * Tree-shaking optimizer
 * 
 * Optimizes token exports for tree-shaking by generating proper ESM structure,
 * marking side-effect free exports, and providing dead code elimination hints.
 */
export class TreeShakingOptimizer {
  private config: Required<TreeShakingConfig>;

  constructor(config: TreeShakingConfig = {}) {
    this.config = {
      level: config.level || 'basic',
      sideEffectFree: config.sideEffectFree !== false,
      individualExports: config.individualExports !== false,
      deadCodeElimination: config.deadCodeElimination !== false,
      preserve: config.preserve || []
    };
  }

  /**
   * Optimize primitive tokens for tree-shaking
   */
  optimizePrimitiveTokens(tokens: PrimitiveToken[]): OptimizationResult {
    const originalCount = tokens.length;
    const preserved = this.config.preserve;
    
    let optimizedTokens = tokens;
    
    // Apply optimization based on level
    if (this.config.level === 'aggressive') {
      optimizedTokens = tokens.filter(token => 
        preserved.includes(token.name) || !token.isStrategicFlexibility
      );
    }

    const optimizedCount = optimizedTokens.length;
    const sizeReduction = this.estimateSizeReduction(originalCount, optimizedCount);

    return {
      originalCount,
      optimizedCount,
      sizeReduction,
      level: this.config.level,
      preserved,
      warnings: this.generateWarnings(tokens, optimizedTokens)
    };
  }

  /**
   * Optimize semantic tokens for tree-shaking
   */
  optimizeSemanticTokens(tokens: SemanticToken[]): OptimizationResult {
    const originalCount = tokens.length;
    const preserved = this.config.preserve;
    
    const optimizedTokens = tokens.filter(token => 
      preserved.includes(token.name) || this.shouldPreserveSemanticToken(token)
    );

    const optimizedCount = optimizedTokens.length;
    const sizeReduction = this.estimateSizeReduction(originalCount, optimizedCount);

    return {
      originalCount,
      optimizedCount,
      sizeReduction,
      level: this.config.level,
      preserved,
      warnings: this.generateWarnings(tokens, optimizedTokens)
    };
  }

  /**
   * Generate tree-shakable exports for tokens
   */
  generateTreeShakableExports(
    primitiveTokens: PrimitiveToken[],
    semanticTokens: SemanticToken[]
  ): TreeShakableExport[] {
    const exports: TreeShakableExport[] = [];

    // Generate individual primitive token exports
    if (this.config.individualExports) {
      for (const token of primitiveTokens) {
        exports.push({
          name: token.name,
          value: token,
          hasSideEffects: false,
          dependencies: []
        });
      }

      // Generate individual semantic token exports
      for (const token of semanticTokens) {
        exports.push({
          name: token.name,
          value: token,
          hasSideEffects: false,
          dependencies: Object.values(token.primitiveReferences)
        });
      }
    } else {
      // Generate grouped exports
      exports.push({
        name: 'primitiveTokens',
        value: primitiveTokens,
        hasSideEffects: false,
        dependencies: []
      });

      exports.push({
        name: 'semanticTokens',
        value: semanticTokens,
        hasSideEffects: false,
        dependencies: primitiveTokens.map(t => t.name)
      });
    }

    return exports;
  }

  /**
   * Generate package.json sideEffects configuration
   */
  generateSideEffectsConfig(): boolean | string[] {
    if (!this.config.sideEffectFree) {
      return true; // Has side effects
    }

    // Mark all token files as side-effect free
    return false;
  }

  /**
   * Generate ESM export code for tree-shaking
   */
  generateESMExports(exports: TreeShakableExport[]): string {
    const lines: string[] = [];

    // Add header comment
    lines.push('/**');
    lines.push(' * Tree-shakable token exports');
    lines.push(' * @module tokens');
    lines.push(' * @sideEffects false');
    lines.push(' */');
    lines.push('');

    // Generate individual exports
    for (const exp of exports) {
      if (this.config.deadCodeElimination) {
        lines.push(`/* #__PURE__ */`);
      }
      
      lines.push(`export const ${exp.name} = ${JSON.stringify(exp.value, null, 2)};`);
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Analyze token usage and provide optimization recommendations
   */
  analyzeUsage(
    usedTokens: string[],
    availableTokens: (PrimitiveToken | SemanticToken)[]
  ): {
    unusedTokens: string[];
    utilizationRate: number;
    recommendations: string[];
  } {
    const availableNames = new Set(availableTokens.map(t => t.name));
    const usedNames = new Set(usedTokens);
    
    const unusedTokens = Array.from(availableNames).filter(name => !usedNames.has(name));
    const utilizationRate = usedNames.size / availableNames.size;

    const recommendations: string[] = [];

    if (utilizationRate < 0.3) {
      recommendations.push(
        'Low token utilization detected (<30%). Consider using individual token imports to reduce bundle size.'
      );
    }

    if (unusedTokens.length > 50) {
      recommendations.push(
        `${unusedTokens.length} unused tokens detected. Enable aggressive tree-shaking to eliminate them.`
      );
    }

    if (this.config.level === 'none') {
      recommendations.push(
        'Tree-shaking is disabled. Enable at least basic optimization to reduce bundle size.'
      );
    }

    return {
      unusedTokens,
      utilizationRate,
      recommendations
    };
  }

  /**
   * Generate webpack configuration for tree-shaking
   */
  generateWebpackConfig(): Record<string, unknown> {
    return {
      optimization: {
        usedExports: true,
        sideEffects: this.config.sideEffectFree,
        providedExports: true
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            sideEffects: false
          }
        ]
      }
    };
  }

  /**
   * Generate rollup configuration for tree-shaking
   */
  generateRollupConfig(): Record<string, unknown> {
    return {
      treeshake: {
        moduleSideEffects: !this.config.sideEffectFree,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    };
  }

  private shouldPreserveSemanticToken(token: SemanticToken): boolean {
    // Always preserve commonly used semantic tokens
    const commonTokens = ['color.primary', 'color.error', 'typography.body', 'space.normal'];
    return commonTokens.includes(token.name);
  }

  private estimateSizeReduction(originalCount: number, optimizedCount: number): number {
    // Rough estimate: ~100 bytes per token
    const bytesPerToken = 100;
    return (originalCount - optimizedCount) * bytesPerToken;
  }

  private generateWarnings(
    original: (PrimitiveToken | SemanticToken)[],
    optimized: (PrimitiveToken | SemanticToken)[]
  ): string[] {
    const warnings: string[] = [];
    const removed = original.length - optimized.length;

    if (removed > 0 && this.config.level === 'aggressive') {
      warnings.push(
        `Aggressive optimization removed ${removed} tokens. Ensure this doesn't break functionality.`
      );
    }

    return warnings;
  }
}

/**
 * Create a tree-shaking optimizer with default configuration
 */
export function createTreeShakingOptimizer(
  config?: TreeShakingConfig
): TreeShakingOptimizer {
  return new TreeShakingOptimizer(config);
}
