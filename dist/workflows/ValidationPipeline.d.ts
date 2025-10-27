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
export declare class ValidationPipeline {
    private engine;
    private stageResults;
    private initialized;
    constructor(engine: TokenEngine);
    /**
     * Initialize validation pipeline
     */
    initialize(): void;
    /**
     * Reset validation pipeline
     */
    reset(): void;
    /**
     * Execute complete validation pipeline
     */
    validate(config?: ValidationStageConfig): Promise<ValidationResult[]>;
    /**
     * Validate primitive tokens
     */
    private validatePrimitiveTokens;
    /**
     * Validate semantic tokens
     */
    private validateSemanticTokens;
    /**
     * Validate cross-platform consistency
     */
    private validateCrossPlatformConsistency;
    /**
     * Validate reference integrity
     */
    private validateReferenceIntegrity;
    /**
     * Create stage result from validation results
     */
    private createStageResult;
    /**
     * Get all stage results
     */
    getStageResults(): ValidationPipelineResult[];
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
    };
    /**
     * Check if pipeline passed all stages
     */
    isPassed(): boolean;
    /**
     * Get failed stages
     */
    getFailedStages(): ValidationPipelineResult[];
}
//# sourceMappingURL=ValidationPipeline.d.ts.map