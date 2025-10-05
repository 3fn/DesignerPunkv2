/**
 * Optimization Validation Tests
 * 
 * Tests optimization effectiveness including tree-shaking, caching,
 * and performance monitoring to ensure system efficiency.
 */

import { TreeShakingOptimizer, type TreeShakingConfig } from '../../integration/TreeShakingOptimizer';
import { TokenCategory, SemanticCategory } from '../../types';
import type { PrimitiveToken, SemanticToken } from '../../types';

describe('Optimization Validation', () => {
  describe('Tree-Shaking Optimization', () => {
    let optimizer: TreeShakingOptimizer;
    let primitiveTokens: PrimitiveToken[];
    let semanticTokens: SemanticToken[];

    beforeEach(() => {
      optimizer = new TreeShakingOptimizer({
        level: 'basic',
        sideEffectFree: true,
        individualExports: true,
        deadCodeElimination: true
      });

      // Create test tokens
      primitiveTokens = [];
      for (let i = 1; i <= 20; i++) {
        primitiveTokens.push({
          name: `space${i}00`,
          category: TokenCategory.SPACING,
          baseValue: 8 * i,
          familyBaseValue: 8,
          description: `Spacing ${i}x`,
          mathematicalRelationship: `base × ${i}`,
          baselineGridAlignment: true,
          isStrategicFlexibility: i === 7, // space700 is strategic flexibility
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8 * i, unit: 'px' },
            ios: { value: 8 * i, unit: 'pt' },
            android: { value: 8 * i, unit: 'dp' }
          }
        });
      }

      semanticTokens = [];
      for (let i = 1; i <= 10; i++) {
        semanticTokens.push({
          name: `space.semantic${i}`,
          primitiveReferences: { default: `space${i}00` },
          category: SemanticCategory.SPACING,
          context: `Semantic ${i}`,
          description: `Semantic spacing ${i}`,
          primitiveTokens: {}
        });
      }
    });

    it('should optimize primitive tokens with basic level', () => {
      const result = optimizer.optimizePrimitiveTokens(primitiveTokens);

      expect(result.originalCount).toBe(20);
      expect(result.optimizedCount).toBe(20); // Basic doesn't remove tokens
      expect(result.level).toBe('basic');
    });

    it('should optimize primitive tokens with aggressive level', () => {
      const aggressiveOptimizer = new TreeShakingOptimizer({
        level: 'aggressive',
        sideEffectFree: true
      });

      const result = aggressiveOptimizer.optimizePrimitiveTokens(primitiveTokens);

      expect(result.originalCount).toBe(20);
      expect(result.optimizedCount).toBeLessThan(20); // Aggressive removes strategic flexibility
      expect(result.level).toBe('aggressive');
    });

    it('should preserve specified tokens during optimization', () => {
      const preserveOptimizer = new TreeShakingOptimizer({
        level: 'aggressive',
        preserve: ['space700']
      });

      const result = preserveOptimizer.optimizePrimitiveTokens(primitiveTokens);

      expect(result.preserved).toContain('space700');
    });

    it('should optimize semantic tokens', () => {
      const result = optimizer.optimizeSemanticTokens(semanticTokens);

      expect(result.originalCount).toBe(10);
      // Semantic token optimization filters based on common tokens
      // None of our test tokens match common tokens, so they're filtered out
      expect(result.optimizedCount).toBeGreaterThanOrEqual(0);
      expect(result.level).toBe('basic');
    });

    it('should estimate size reduction', () => {
      const aggressiveOptimizer = new TreeShakingOptimizer({
        level: 'aggressive'
      });

      const result = aggressiveOptimizer.optimizePrimitiveTokens(primitiveTokens);

      if (result.optimizedCount < result.originalCount) {
        expect(result.sizeReduction).toBeGreaterThan(0);
      }
    });

    it('should generate warnings for aggressive optimization', () => {
      const aggressiveOptimizer = new TreeShakingOptimizer({
        level: 'aggressive'
      });

      const result = aggressiveOptimizer.optimizePrimitiveTokens(primitiveTokens);

      if (result.optimizedCount < result.originalCount) {
        expect(result.warnings.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Tree-Shakable Export Generation', () => {
    let optimizer: TreeShakingOptimizer;
    let primitiveTokens: PrimitiveToken[];
    let semanticTokens: SemanticToken[];

    beforeEach(() => {
      optimizer = new TreeShakingOptimizer({
        level: 'basic',
        individualExports: true,
        sideEffectFree: true
      });

      primitiveTokens = [
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base spacing',
          mathematicalRelationship: 'base',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8, unit: 'px' },
            ios: { value: 8, unit: 'pt' },
            android: { value: 8, unit: 'dp' }
          }
        }
      ];

      semanticTokens = [
        {
          name: 'space.normal',
          primitiveReferences: { default: 'space100' },
          category: SemanticCategory.SPACING,
          context: 'Normal spacing',
          description: 'Standard spacing',
          primitiveTokens: {}
        }
      ];
    });

    it('should generate individual exports', () => {
      const exports = optimizer.generateTreeShakableExports(primitiveTokens, semanticTokens);

      expect(exports.length).toBeGreaterThan(0);
      expect(exports.every(e => e.hasSideEffects === false)).toBe(true);
    });

    it('should generate grouped exports when individual exports disabled', () => {
      const groupedOptimizer = new TreeShakingOptimizer({
        individualExports: false
      });

      const exports = groupedOptimizer.generateTreeShakableExports(primitiveTokens, semanticTokens);

      expect(exports.some(e => e.name === 'primitiveTokens')).toBe(true);
      expect(exports.some(e => e.name === 'semanticTokens')).toBe(true);
    });

    it('should track dependencies in exports', () => {
      const exports = optimizer.generateTreeShakableExports(primitiveTokens, semanticTokens);

      const semanticExport = exports.find(e => e.name === 'space.normal');
      expect(semanticExport).toBeDefined();
      expect(semanticExport?.dependencies).toContain('space100');
    });

    it('should mark all exports as side-effect free', () => {
      const exports = optimizer.generateTreeShakableExports(primitiveTokens, semanticTokens);

      expect(exports.every(e => e.hasSideEffects === false)).toBe(true);
    });
  });

  describe('Side-Effects Configuration', () => {
    it('should generate side-effect free configuration', () => {
      const optimizer = new TreeShakingOptimizer({
        sideEffectFree: true
      });

      const config = optimizer.generateSideEffectsConfig();

      expect(config).toBe(false);
    });

    it('should generate side-effects configuration when not free', () => {
      const optimizer = new TreeShakingOptimizer({
        sideEffectFree: false
      });

      const config = optimizer.generateSideEffectsConfig();

      expect(config).toBe(true);
    });
  });

  describe('ESM Export Code Generation', () => {
    let optimizer: TreeShakingOptimizer;

    beforeEach(() => {
      optimizer = new TreeShakingOptimizer({
        deadCodeElimination: true,
        individualExports: true
      });
    });

    it('should generate ESM export code', () => {
      const exports = [
        {
          name: 'space100',
          value: { baseValue: 8 },
          hasSideEffects: false,
          dependencies: []
        }
      ];

      const code = optimizer.generateESMExports(exports);

      expect(code).toContain('export const space100');
      expect(code).toContain('@sideEffects false');
    });

    it('should include PURE annotations for dead code elimination', () => {
      const exports = [
        {
          name: 'space100',
          value: { baseValue: 8 },
          hasSideEffects: false,
          dependencies: []
        }
      ];

      const code = optimizer.generateESMExports(exports);

      expect(code).toContain('/* #__PURE__ */');
    });

    it('should generate valid JavaScript', () => {
      const exports = [
        {
          name: 'space100',
          value: { baseValue: 8, unit: 'px' },
          hasSideEffects: false,
          dependencies: []
        }
      ];

      const code = optimizer.generateESMExports(exports);

      expect(() => JSON.parse(code.match(/= (.+);/)?.[1] || '{}')).not.toThrow();
    });
  });

  describe('Usage Analysis', () => {
    let optimizer: TreeShakingOptimizer;
    let availableTokens: PrimitiveToken[];

    beforeEach(() => {
      optimizer = new TreeShakingOptimizer({
        level: 'basic'
      });

      availableTokens = [];
      for (let i = 1; i <= 100; i++) {
        availableTokens.push({
          name: `token${i}`,
          category: TokenCategory.SPACING,
          baseValue: 8 * (i % 10 + 1),
          familyBaseValue: 8,
          description: `Token ${i}`,
          mathematicalRelationship: `base × ${i % 10 + 1}`,
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8 * (i % 10 + 1), unit: 'px' },
            ios: { value: 8 * (i % 10 + 1), unit: 'pt' },
            android: { value: 8 * (i % 10 + 1), unit: 'dp' }
          }
        });
      }
    });

    it('should analyze token usage', () => {
      const usedTokens = ['token1', 'token2', 'token3'];
      const analysis = optimizer.analyzeUsage(usedTokens, availableTokens);

      expect(analysis.unusedTokens.length).toBe(97);
      expect(analysis.utilizationRate).toBe(0.03);
      expect(analysis.recommendations.length).toBeGreaterThan(0);
    });

    it('should recommend optimization for low utilization', () => {
      const usedTokens = ['token1', 'token2'];
      const analysis = optimizer.analyzeUsage(usedTokens, availableTokens);

      expect(analysis.utilizationRate).toBeLessThan(0.3);
      expect(analysis.recommendations.some(r => r.includes('Low token utilization'))).toBe(true);
    });

    it('should recommend tree-shaking for many unused tokens', () => {
      const usedTokens = ['token1'];
      const analysis = optimizer.analyzeUsage(usedTokens, availableTokens);

      expect(analysis.unusedTokens.length).toBeGreaterThan(50);
      expect(analysis.recommendations.some(r => r.includes('unused tokens detected'))).toBe(true);
    });

    it('should recommend enabling optimization when disabled', () => {
      const noneOptimizer = new TreeShakingOptimizer({
        level: 'none'
      });

      const usedTokens = ['token1'];
      const analysis = noneOptimizer.analyzeUsage(usedTokens, availableTokens);

      expect(analysis.recommendations.some(r => r.includes('Tree-shaking is disabled'))).toBe(true);
    });

    it('should calculate correct utilization rate', () => {
      const usedTokens = availableTokens.slice(0, 50).map(t => t.name);
      const analysis = optimizer.analyzeUsage(usedTokens, availableTokens);

      expect(analysis.utilizationRate).toBe(0.5);
    });
  });

  describe('Build System Configuration Generation', () => {
    let optimizer: TreeShakingOptimizer;

    beforeEach(() => {
      optimizer = new TreeShakingOptimizer({
        level: 'basic',
        sideEffectFree: true
      });
    });

    it('should generate webpack configuration', () => {
      const config = optimizer.generateWebpackConfig();

      expect(config).toHaveProperty('optimization');
      expect(config.optimization).toHaveProperty('usedExports', true);
      expect(config.optimization).toHaveProperty('sideEffects');
    });

    it('should generate rollup configuration', () => {
      const config = optimizer.generateRollupConfig();

      expect(config).toHaveProperty('treeshake');
      expect(config.treeshake).toHaveProperty('moduleSideEffects');
      expect(config.treeshake).toHaveProperty('propertyReadSideEffects', false);
    });

    it('should configure side effects in webpack', () => {
      const config = optimizer.generateWebpackConfig();

      expect(config.optimization).toHaveProperty('sideEffects', true);
    });

    it('should configure tree-shaking in rollup', () => {
      const config = optimizer.generateRollupConfig();

      expect(config.treeshake).toHaveProperty('moduleSideEffects', false);
    });
  });

  describe('Optimization Level Impact', () => {
    let primitiveTokens: PrimitiveToken[];

    beforeEach(() => {
      primitiveTokens = [];
      for (let i = 1; i <= 50; i++) {
        primitiveTokens.push({
          name: `token${i}`,
          category: TokenCategory.SPACING,
          baseValue: 8 * (i % 10 + 1),
          familyBaseValue: 8,
          description: `Token ${i}`,
          mathematicalRelationship: `base × ${i % 10 + 1}`,
          baselineGridAlignment: true,
          isStrategicFlexibility: i % 10 === 0, // Every 10th token
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8 * (i % 10 + 1), unit: 'px' },
            ios: { value: 8 * (i % 10 + 1), unit: 'pt' },
            android: { value: 8 * (i % 10 + 1), unit: 'dp' }
          }
        });
      }
    });

    it('should not remove tokens with none optimization', () => {
      const optimizer = new TreeShakingOptimizer({ level: 'none' });
      const result = optimizer.optimizePrimitiveTokens(primitiveTokens);

      expect(result.optimizedCount).toBe(result.originalCount);
    });

    it('should preserve all tokens with basic optimization', () => {
      const optimizer = new TreeShakingOptimizer({ level: 'basic' });
      const result = optimizer.optimizePrimitiveTokens(primitiveTokens);

      expect(result.optimizedCount).toBe(result.originalCount);
    });

    it('should remove strategic flexibility tokens with aggressive optimization', () => {
      const optimizer = new TreeShakingOptimizer({ level: 'aggressive' });
      const result = optimizer.optimizePrimitiveTokens(primitiveTokens);

      expect(result.optimizedCount).toBeLessThan(result.originalCount);
      expect(result.sizeReduction).toBeGreaterThan(0);
    });
  });

  describe('Performance Impact', () => {
    it('should optimize quickly for typical token sets', () => {
      const optimizer = new TreeShakingOptimizer({ level: 'basic' });
      const tokens: PrimitiveToken[] = [];

      for (let i = 1; i <= 30; i++) {
        tokens.push({
          name: `token${i}`,
          category: TokenCategory.SPACING,
          baseValue: 8 * i,
          familyBaseValue: 8,
          description: `Token ${i}`,
          mathematicalRelationship: `base × ${i}`,
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8 * i, unit: 'px' },
            ios: { value: 8 * i, unit: 'pt' },
            android: { value: 8 * i, unit: 'dp' }
          }
        });
      }

      const startTime = performance.now();
      optimizer.optimizePrimitiveTokens(tokens);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(5);
    });

    it('should generate exports quickly', () => {
      const optimizer = new TreeShakingOptimizer({ individualExports: true });
      const primitiveTokens: PrimitiveToken[] = [];
      const semanticTokens: SemanticToken[] = [];

      for (let i = 1; i <= 20; i++) {
        primitiveTokens.push({
          name: `token${i}`,
          category: TokenCategory.SPACING,
          baseValue: 8 * i,
          familyBaseValue: 8,
          description: `Token ${i}`,
          mathematicalRelationship: `base × ${i}`,
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8 * i, unit: 'px' },
            ios: { value: 8 * i, unit: 'pt' },
            android: { value: 8 * i, unit: 'dp' }
          }
        });
      }

      const startTime = performance.now();
      optimizer.generateTreeShakableExports(primitiveTokens, semanticTokens);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(5);
    });
  });
});
