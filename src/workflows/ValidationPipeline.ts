/**
 * Validation Pipeline
 * 
 * Integrates validation at appropriate stages throughout the token generation
 * workflow. Provides staged validation with clear feedback and recovery options.
 */

import { TokenEngine } from '../TokenEngine';
import type { ValidationResult } from '../types';

/**
 * Validation stage configuration
 */
export interface ValidationStageConfig {
  strictMathematics?: boolean;
  requireCrossPlatformConsistency?: boolean;
  enablePatternAnalysis?: boolean;
  validateReferences?: boolean;
}

/**
 * Validation pipeline result
 */
export interface ValidationPipelineResult {
  stage: string;
  results: ValidationResult[];
  passed: boolean;
  errorCount: number;
  warningCount: number;
  passCount: number;
}

/**
 * Validation Pipeline class
 */
export class ValidationPipeline {
  private engine: TokenEngine;
  private stageResults: ValidationPipelineResult[] = [];
  private initialized: boolean = false;

  constructor(engine: TokenEngine) {
    this.engine = engine;
  }

  // ============================================================================
  // Pipeline Initialization
  // ============================================================================

  /**
   * Initialize validation pipeline
   */
  initialize(): void {
    this.stageResults = [];
    this.initialized = true;
  }

  /**
   * Reset validation pipeline
   */
  reset(): void {
    this.stageResults = [];
    this.initialized = false;
  }

  // ============================================================================
  // Validation Execution
  // ============================================================================

  /**
   * Execute complete validation pipeline
   */
  async validate(config: ValidationStageConfig = {}): Promise<ValidationResult[]> {
    if (!this.initialized) {
      throw new Error('Validation pipeline not initialized');
    }

    const allResults: ValidationResult[] = [];

    // Stage 1: Primitive Token Validation
    const primitiveResults = await this.validatePrimitiveTokens(config);
    allResults.push(...primitiveResults.results);
    this.stageResults.push(primitiveResults);

    // Stage 2: Semantic Token Validation
    const semanticResults = await this.validateSemanticTokens(config);
    allResults.push(...semanticResults.results);
    this.stageResults.push(semanticResults);

    // Stage 3: Cross-Platform Consistency (if enabled)
    if (config.requireCrossPlatformConsistency) {
      const consistencyResults = await this.validateCrossPlatformConsistency(config);
      allResults.push(...consistencyResults.results);
      this.stageResults.push(consistencyResults);
    }

    // Stage 4: Reference Integrity (if enabled)
    if (config.validateReferences) {
      const referenceResults = await this.validateReferenceIntegrity(config);
      allResults.push(...referenceResults.results);
      this.stageResults.push(referenceResults);
    }

    return allResults;
  }

  // ============================================================================
  // Validation Stages
  // ============================================================================

  /**
   * Validate primitive tokens
   * 
   * Validates all registered primitive tokens. This method validates tokens
   * that are already in the registry. For validation before registration,
   * use the engine's registerPrimitiveToken() method which validates before
   * allowing registration.
   */
  private async validatePrimitiveTokens(
    config: ValidationStageConfig
  ): Promise<ValidationPipelineResult> {
    const primitiveTokens = this.engine.getAllPrimitiveTokens();
    const results: ValidationResult[] = [];

    // Validate each primitive token
    // Note: These tokens are already registered. The engine's registration
    // methods (registerPrimitiveToken) validate before registration.
    for (const token of primitiveTokens) {
      const result = this.engine.validateToken(token);
      results.push(result);
    }

    return this.createStageResult('Primitive Token Validation', results);
  }

  /**
   * Validate semantic tokens
   * 
   * Validates all registered semantic tokens. This method validates tokens
   * that are already in the registry. For validation before registration,
   * use the engine's registerSemanticToken() method which validates before
   * allowing registration.
   */
  private async validateSemanticTokens(
    config: ValidationStageConfig
  ): Promise<ValidationPipelineResult> {
    const semanticTokens = this.engine.getAllSemanticTokens();
    const results: ValidationResult[] = [];

    // Validate each semantic token
    // Note: These tokens are already registered. The engine's registration
    // methods (registerSemanticToken) validate before registration.
    for (const token of semanticTokens) {
      const result = this.engine.validateToken(token);
      results.push(result);
    }

    return this.createStageResult('Semantic Token Validation', results);
  }

  /**
   * Validate cross-platform consistency
   */
  private async validateCrossPlatformConsistency(
    config: ValidationStageConfig
  ): Promise<ValidationPipelineResult> {
    const results = this.engine.validateCrossPlatformConsistency();
    return this.createStageResult('Cross-Platform Consistency', results);
  }

  /**
   * Validate reference integrity
   */
  private async validateReferenceIntegrity(
    config: ValidationStageConfig
  ): Promise<ValidationPipelineResult> {
    const results: ValidationResult[] = [];
    const semanticTokens = this.engine.getAllSemanticTokens();

    // Check that all semantic tokens reference valid primitive tokens
    for (const token of semanticTokens) {
      for (const [key, primitiveRef] of Object.entries(token.primitiveReferences)) {
        const primitiveToken = this.engine.getPrimitiveToken(primitiveRef);
        
        if (!primitiveToken) {
          results.push({
            level: 'Error',
            token: token.name,
            message: `Unresolved primitive reference: ${primitiveRef}`,
            rationale: `Semantic token ${token.name} references non-existent primitive token ${primitiveRef} for property ${key}`,
            mathematicalReasoning: 'Semantic tokens must reference valid primitive tokens to maintain mathematical consistency',
            suggestions: [
              `Register primitive token ${primitiveRef}`,
              `Update semantic token ${token.name} to reference an existing primitive token`
            ]
          });
        } else {
          results.push({
            level: 'Pass',
            token: token.name,
            message: `Valid primitive reference: ${primitiveRef}`,
            rationale: `Semantic token ${token.name} correctly references primitive token ${primitiveRef}`,
            mathematicalReasoning: 'Reference integrity maintained'
          });
        }
      }
    }

    return this.createStageResult('Reference Integrity', results);
  }

  // ============================================================================
  // Result Management
  // ============================================================================

  /**
   * Create stage result from validation results
   */
  private createStageResult(
    stage: string,
    results: ValidationResult[]
  ): ValidationPipelineResult {
    const errorCount = results.filter(r => r.level === 'Error').length;
    const warningCount = results.filter(r => r.level === 'Warning').length;
    const passCount = results.filter(r => r.level === 'Pass').length;

    return {
      stage,
      results,
      passed: errorCount === 0,
      errorCount,
      warningCount,
      passCount
    };
  }

  /**
   * Get all stage results
   */
  getStageResults(): ValidationPipelineResult[] {
    return [...this.stageResults];
  }

  /**
   * Get summary of all validation stages
   */
  getSummary(): {
    totalStages: number;
    passedStages: number;
    failedStages: number;
    totalErrors: number;
    totalWarnings: number;
    totalPasses: number;
  } {
    const totalStages = this.stageResults.length;
    const passedStages = this.stageResults.filter(s => s.passed).length;
    const failedStages = this.stageResults.filter(s => !s.passed).length;
    const totalErrors = this.stageResults.reduce((sum, s) => sum + s.errorCount, 0);
    const totalWarnings = this.stageResults.reduce((sum, s) => sum + s.warningCount, 0);
    const totalPasses = this.stageResults.reduce((sum, s) => sum + s.passCount, 0);

    return {
      totalStages,
      passedStages,
      failedStages,
      totalErrors,
      totalWarnings,
      totalPasses
    };
  }

  /**
   * Check if pipeline passed all stages
   */
  isPassed(): boolean {
    return this.stageResults.every(s => s.passed);
  }

  /**
   * Get failed stages
   */
  getFailedStages(): ValidationPipelineResult[] {
    return this.stageResults.filter(s => !s.passed);
  }
}
