/**
 * File Generation Optimizer
 * 
 * Optimizes platform-specific file generation for speed and efficiency.
 * Implements parallel generation, incremental updates, and output optimization.
 */

import { PrimitiveToken } from '../types/PrimitiveToken';
import { SemanticToken } from '../types/SemanticToken';
import { TranslationOutput, TargetPlatform } from '../types/TranslationOutput';
import { CachingStrategy } from './CachingStrategy';

export interface OptimizationOptions {
  /** Enable parallel generation across platforms */
  enableParallel?: boolean;

  /** Enable incremental generation (only changed tokens) */
  enableIncremental?: boolean;

  /** Enable output minification */
  enableMinification?: boolean;

  /** Enable caching */
  enableCaching?: boolean;

  /** Maximum parallel operations */
  maxParallel?: number;
}

export interface GenerationTask {
  platform: TargetPlatform;
  tokens: Array<PrimitiveToken | SemanticToken>;
  priority: number;
}

/**
 * File Generation Optimizer for performance optimization
 */
export class FileGenerationOptimizer {
  private cache: CachingStrategy;
  private previousTokenHashes: Map<string, string> = new Map();

  constructor(cache?: CachingStrategy) {
    this.cache = cache || new CachingStrategy();
  }

  /**
   * Optimize file generation across platforms
   */
  async optimizeGeneration(
    tokens: Array<PrimitiveToken | SemanticToken>,
    platforms: TargetPlatform[],
    generator: (platform: TargetPlatform, tokens: Array<PrimitiveToken | SemanticToken>) => Promise<TranslationOutput>,
    options: OptimizationOptions = {}
  ): Promise<TranslationOutput[]> {
    const {
      enableParallel = true,
      enableIncremental = true,
      enableCaching = true,
      maxParallel = 3
    } = options;

    // Filter tokens for incremental generation
    const tokensToGenerate = enableIncremental
      ? this.filterChangedTokens(tokens)
      : tokens;

    // Check cache for existing generation results
    if (enableCaching && tokensToGenerate.length === 0) {
      const cachedResults = this.getCachedResults(platforms);
      if (cachedResults.length === platforms.length) {
        return cachedResults;
      }
    }

    // Create generation tasks
    const tasks = this.createGenerationTasks(tokensToGenerate, platforms);

    // Execute generation
    const results = enableParallel
      ? await this.generateParallel(tasks, generator, maxParallel)
      : await this.generateSequential(tasks, generator);

    // Cache results
    if (enableCaching) {
      this.cacheResults(results);
    }

    // Update token hashes for incremental generation
    if (enableIncremental) {
      this.updateTokenHashes(tokens);
    }

    return results;
  }

  /**
   * Generate files in parallel
   */
  private async generateParallel(
    tasks: GenerationTask[],
    generator: (platform: TargetPlatform, tokens: Array<PrimitiveToken | SemanticToken>) => Promise<TranslationOutput>,
    maxParallel: number
  ): Promise<TranslationOutput[]> {
    const results: TranslationOutput[] = [];
    const sortedTasks = tasks.sort((a, b) => b.priority - a.priority);

    // Process tasks in batches
    for (let i = 0; i < sortedTasks.length; i += maxParallel) {
      const batch = sortedTasks.slice(i, i + maxParallel);
      const batchPromises = batch.map(task =>
        generator(task.platform, task.tokens)
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Generate files sequentially
   */
  private async generateSequential(
    tasks: GenerationTask[],
    generator: (platform: TargetPlatform, tokens: Array<PrimitiveToken | SemanticToken>) => Promise<TranslationOutput>
  ): Promise<TranslationOutput[]> {
    const results: TranslationOutput[] = [];
    const sortedTasks = tasks.sort((a, b) => b.priority - a.priority);

    for (const task of sortedTasks) {
      const result = await generator(task.platform, task.tokens);
      results.push(result);
    }

    return results;
  }

  /**
   * Create generation tasks with priorities
   */
  private createGenerationTasks(
    tokens: Array<PrimitiveToken | SemanticToken>,
    platforms: TargetPlatform[]
  ): GenerationTask[] {
    // Prioritize platforms based on typical usage
    const platformPriorities: Record<TargetPlatform, number> = {
      web: 3,
      ios: 2,
      android: 1
    };

    return platforms.map(platform => ({
      platform,
      tokens,
      priority: platformPriorities[platform] || 0
    }));
  }

  /**
   * Filter tokens that have changed since last generation
   */
  private filterChangedTokens(
    tokens: Array<PrimitiveToken | SemanticToken>
  ): Array<PrimitiveToken | SemanticToken> {
    return tokens.filter(token => {
      const currentHash = this.hashToken(token);
      const previousHash = this.previousTokenHashes.get(token.name);
      return currentHash !== previousHash;
    });
  }

  /**
   * Update token hashes for incremental generation
   */
  private updateTokenHashes(tokens: Array<PrimitiveToken | SemanticToken>): void {
    tokens.forEach(token => {
      const hash = this.hashToken(token);
      this.previousTokenHashes.set(token.name, hash);
    });
  }

  /**
   * Generate hash for token
   */
  private hashToken(token: PrimitiveToken | SemanticToken): string {
    // Simple hash based on token properties
    const tokenStr = JSON.stringify({
      name: token.name,
      category: token.category,
      ...(('baseValue' in token) ? { baseValue: token.baseValue } : {}),
      ...(('primitiveReference' in token) ? { primitiveReference: token.primitiveReference } : {})
    });

    // Simple string hash
    let hash = 0;
    for (let i = 0; i < tokenStr.length; i++) {
      const char = tokenStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return hash.toString(36);
  }

  /**
   * Get cached generation results
   */
  private getCachedResults(platforms: TargetPlatform[]): TranslationOutput[] {
    const results: TranslationOutput[] = [];

    for (const platform of platforms) {
      const cacheKey = `generation:${platform}`;
      const cached = this.cache.getCachedGeneration(cacheKey);

      if (cached) {
        results.push(JSON.parse(cached));
      }
    }

    return results;
  }

  /**
   * Cache generation results
   */
  private cacheResults(results: TranslationOutput[]): void {
    results.forEach(result => {
      const cacheKey = `generation:${result.platform}`;
      this.cache.cacheGeneration(cacheKey, JSON.stringify(result));
    });
  }

  /**
   * Optimize output content
   */
  optimizeOutput(content: string, options: OptimizationOptions = {}): string {
    const { enableMinification = false } = options;

    if (!enableMinification) {
      return content;
    }

    // Remove extra whitespace
    let optimized = content.replace(/\n\s*\n/g, '\n');

    // Remove trailing whitespace
    optimized = optimized.replace(/[ \t]+$/gm, '');

    // Remove comments (simple implementation)
    optimized = optimized.replace(/\/\*[\s\S]*?\*\//g, '');
    optimized = optimized.replace(/\/\/.*/g, '');

    return optimized;
  }

  /**
   * Batch token processing for efficiency
   */
  batchTokens(
    tokens: Array<PrimitiveToken | SemanticToken>,
    batchSize: number = 50
  ): Array<Array<PrimitiveToken | SemanticToken>> {
    const batches: Array<Array<PrimitiveToken | SemanticToken>> = [];

    for (let i = 0; i < tokens.length; i += batchSize) {
      batches.push(tokens.slice(i, i + batchSize));
    }

    return batches;
  }

  /**
   * Clear optimization caches
   */
  clearCaches(): void {
    this.previousTokenHashes.clear();
    this.cache.invalidateAll();
  }

  /**
   * Get optimization statistics
   */
  getStats(): {
    cachedTokens: number;
    cacheStats: any;
  } {
    return {
      cachedTokens: this.previousTokenHashes.size,
      cacheStats: this.cache.getStats()
    };
  }
}
