/**
 * Caching Strategy
 * 
 * Implements efficient caching for token generation to reduce redundant processing.
 * Handles cache invalidation, versioning, and cache hit/miss tracking.
 */

import { PrimitiveToken } from '../types/PrimitiveToken';
import { SemanticToken } from '../types/SemanticToken';

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  version: string;
  hits: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  oldestEntry: number | null;
  newestEntry: number | null;
}

/**
 * Caching Strategy for token generation optimization
 */
export class CachingStrategy {
  private tokenCache: Map<string, CacheEntry<PrimitiveToken | SemanticToken>> = new Map();
  private generationCache: Map<string, CacheEntry<string>> = new Map();
  private validationCache: Map<string, CacheEntry<any>> = new Map();
  
  private hits: number = 0;
  private misses: number = 0;
  private currentVersion: string = '1.0.0';

  /**
   * Set cache version for invalidation
   */
  setVersion(version: string): void {
    if (version !== this.currentVersion) {
      this.currentVersion = version;
      this.invalidateAll();
    }
  }

  /**
   * Get current cache version
   */
  getVersion(): string {
    return this.currentVersion;
  }

  // ============================================================================
  // Token Caching
  // ============================================================================

  /**
   * Cache a token
   */
  cacheToken(key: string, token: PrimitiveToken | SemanticToken): void {
    this.tokenCache.set(key, {
      value: token,
      timestamp: Date.now(),
      version: this.currentVersion,
      hits: 0
    });
  }

  /**
   * Get cached token
   */
  getCachedToken(key: string): (PrimitiveToken | SemanticToken) | null {
    const entry = this.tokenCache.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }

    // Check version compatibility
    if (entry.version !== this.currentVersion) {
      this.tokenCache.delete(key);
      this.misses++;
      return null;
    }

    // Update hit count
    entry.hits++;
    this.hits++;
    
    return entry.value;
  }

  /**
   * Check if token is cached
   */
  hasToken(key: string): boolean {
    const entry = this.tokenCache.get(key);
    return entry !== undefined && entry.version === this.currentVersion;
  }

  /**
   * Invalidate token cache
   */
  invalidateToken(key: string): void {
    this.tokenCache.delete(key);
  }

  // ============================================================================
  // Generation Result Caching
  // ============================================================================

  /**
   * Cache generation result
   */
  cacheGeneration(key: string, content: string): void {
    this.generationCache.set(key, {
      value: content,
      timestamp: Date.now(),
      version: this.currentVersion,
      hits: 0
    });
  }

  /**
   * Get cached generation result
   */
  getCachedGeneration(key: string): string | null {
    const entry = this.generationCache.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }

    // Check version compatibility
    if (entry.version !== this.currentVersion) {
      this.generationCache.delete(key);
      this.misses++;
      return null;
    }

    // Update hit count
    entry.hits++;
    this.hits++;
    
    return entry.value;
  }

  /**
   * Check if generation result is cached
   */
  hasGeneration(key: string): boolean {
    const entry = this.generationCache.get(key);
    return entry !== undefined && entry.version === this.currentVersion;
  }

  /**
   * Invalidate generation cache
   */
  invalidateGeneration(key: string): void {
    this.generationCache.delete(key);
  }

  // ============================================================================
  // Validation Result Caching
  // ============================================================================

  /**
   * Cache validation result
   */
  cacheValidation(key: string, result: any): void {
    this.validationCache.set(key, {
      value: result,
      timestamp: Date.now(),
      version: this.currentVersion,
      hits: 0
    });
  }

  /**
   * Get cached validation result
   */
  getCachedValidation(key: string): any | null {
    const entry = this.validationCache.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }

    // Check version compatibility
    if (entry.version !== this.currentVersion) {
      this.validationCache.delete(key);
      this.misses++;
      return null;
    }

    // Update hit count
    entry.hits++;
    this.hits++;
    
    return entry.value;
  }

  /**
   * Check if validation result is cached
   */
  hasValidation(key: string): boolean {
    const entry = this.validationCache.get(key);
    return entry !== undefined && entry.version === this.currentVersion;
  }

  /**
   * Invalidate validation cache
   */
  invalidateValidation(key: string): void {
    this.validationCache.delete(key);
  }

  // ============================================================================
  // Cache Management
  // ============================================================================

  /**
   * Invalidate all caches
   */
  invalidateAll(): void {
    this.tokenCache.clear();
    this.generationCache.clear();
    this.validationCache.clear();
    this.resetStats();
  }

  /**
   * Invalidate caches by pattern
   */
  invalidateByPattern(pattern: RegExp): void {
    // Invalidate matching token cache entries
    for (const key of this.tokenCache.keys()) {
      if (pattern.test(key)) {
        this.tokenCache.delete(key);
      }
    }

    // Invalidate matching generation cache entries
    for (const key of this.generationCache.keys()) {
      if (pattern.test(key)) {
        this.generationCache.delete(key);
      }
    }

    // Invalidate matching validation cache entries
    for (const key of this.validationCache.keys()) {
      if (pattern.test(key)) {
        this.validationCache.delete(key);
      }
    }
  }

  /**
   * Prune old cache entries
   */
  pruneOldEntries(maxAgeMs: number): number {
    const now = Date.now();
    let pruned = 0;

    // Prune token cache
    for (const [key, entry] of this.tokenCache.entries()) {
      if (now - entry.timestamp > maxAgeMs) {
        this.tokenCache.delete(key);
        pruned++;
      }
    }

    // Prune generation cache
    for (const [key, entry] of this.generationCache.entries()) {
      if (now - entry.timestamp > maxAgeMs) {
        this.generationCache.delete(key);
        pruned++;
      }
    }

    // Prune validation cache
    for (const [key, entry] of this.validationCache.entries()) {
      if (now - entry.timestamp > maxAgeMs) {
        this.validationCache.delete(key);
        pruned++;
      }
    }

    return pruned;
  }

  /**
   * Prune least recently used entries
   */
  pruneLRU(maxSize: number): number {
    let pruned = 0;

    // Prune token cache
    if (this.tokenCache.size > maxSize) {
      const entries = Array.from(this.tokenCache.entries())
        .sort((a, b) => a[1].hits - b[1].hits);
      
      const toRemove = entries.slice(0, this.tokenCache.size - maxSize);
      toRemove.forEach(([key]) => {
        this.tokenCache.delete(key);
        pruned++;
      });
    }

    // Prune generation cache
    if (this.generationCache.size > maxSize) {
      const entries = Array.from(this.generationCache.entries())
        .sort((a, b) => a[1].hits - b[1].hits);
      
      const toRemove = entries.slice(0, this.generationCache.size - maxSize);
      toRemove.forEach(([key]) => {
        this.generationCache.delete(key);
        pruned++;
      });
    }

    // Prune validation cache
    if (this.validationCache.size > maxSize) {
      const entries = Array.from(this.validationCache.entries())
        .sort((a, b) => a[1].hits - b[1].hits);
      
      const toRemove = entries.slice(0, this.validationCache.size - maxSize);
      toRemove.forEach(([key]) => {
        this.validationCache.delete(key);
        pruned++;
      });
    }

    return pruned;
  }

  // ============================================================================
  // Cache Statistics
  // ============================================================================

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalSize = this.tokenCache.size + this.generationCache.size + this.validationCache.size;
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? this.hits / totalRequests : 0;

    // Find oldest and newest entries
    const allEntries = [
      ...Array.from(this.tokenCache.values()),
      ...Array.from(this.generationCache.values()),
      ...Array.from(this.validationCache.values())
    ];

    const timestamps = allEntries.map(e => e.timestamp);
    const oldestEntry = timestamps.length > 0 ? Math.min(...timestamps) : null;
    const newestEntry = timestamps.length > 0 ? Math.max(...timestamps) : null;

    return {
      hits: this.hits,
      misses: this.misses,
      hitRate,
      size: totalSize,
      oldestEntry,
      newestEntry
    };
  }

  /**
   * Reset cache statistics
   */
  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache size breakdown
   */
  getSizeBreakdown(): {
    tokens: number;
    generations: number;
    validations: number;
    total: number;
  } {
    return {
      tokens: this.tokenCache.size,
      generations: this.generationCache.size,
      validations: this.validationCache.size,
      total: this.tokenCache.size + this.generationCache.size + this.validationCache.size
    };
  }

  /**
   * Get most frequently accessed entries
   */
  getMostAccessed(limit: number = 10): Array<{ key: string; hits: number; type: string }> {
    const allEntries: Array<{ key: string; hits: number; type: string }> = [];

    // Collect token cache entries
    for (const [key, entry] of this.tokenCache.entries()) {
      allEntries.push({ key, hits: entry.hits, type: 'token' });
    }

    // Collect generation cache entries
    for (const [key, entry] of this.generationCache.entries()) {
      allEntries.push({ key, hits: entry.hits, type: 'generation' });
    }

    // Collect validation cache entries
    for (const [key, entry] of this.validationCache.entries()) {
      allEntries.push({ key, hits: entry.hits, type: 'validation' });
    }

    return allEntries
      .sort((a, b) => b.hits - a.hits)
      .slice(0, limit);
  }
}
