/**
 * Analytics Module
 * 
 * Exports usage tracking and pattern analysis components for monitoring
 * token usage patterns and providing actionable feedback for token system improvement.
 * 
 * Core validation: Strategic flexibility tokens must be ≤20% of total token usage.
 * Additional insights: Semantic adoption, primitive fallbacks, and usage patterns.
 */

export {
  TokenUsageTracker,
  TokenType,
  type TokenUsage,
  type TokenUsageStats
} from './TokenUsageTracker.js';

export {
  StrategicFlexibilityTracker,
  UsageContext,
  UsageAppropriateness,
  type StrategicFlexibilityUsage,
  type StrategicFlexibilityStats
} from './StrategicFlexibilityTracker.js';

export {
  SemanticTokenUsageTracker,
  type SemanticTokenUsage,
  type SemanticTokenStats
} from './SemanticTokenUsageTracker.js';

export {
  PrimitiveTokenFallbackTracker,
  FallbackReason,
  type PrimitiveTokenFallback,
  type PrimitiveTokenFallbackStats
} from './PrimitiveTokenFallbackTracker.js';

export {
  UsagePatternAnalyzer,
  type UsagePatternAnalysis
} from './UsagePatternAnalyzer.js';
