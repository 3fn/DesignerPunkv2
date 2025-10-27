/**
 * Token Generation Workflow
 *
 * Orchestrates the end-to-end token generation process from token definition
 * to platform-specific output. Integrates validation at appropriate stages
 * and ensures mathematical consistency throughout the pipeline.
 */
import { TokenEngine } from '../TokenEngine';
import type { PrimitiveToken, SemanticToken, ValidationResult, TranslationOutput, TargetPlatform } from '../types';
/**
 * Workflow stage enumeration
 */
export declare enum WorkflowStage {
    INITIALIZATION = "initialization",
    TOKEN_REGISTRATION = "token_registration",
    VALIDATION = "validation",
    CONSISTENCY_CHECK = "consistency_check",
    TRANSLATION = "translation",
    OUTPUT_GENERATION = "output_generation",
    COMPLETION = "completion"
}
/**
 * Workflow execution options
 */
export interface WorkflowExecutionOptions {
    /** Skip validation stages (not recommended) */
    skipValidation?: boolean;
    /** Skip consistency checks (not recommended) */
    skipConsistencyCheck?: boolean;
    /** Target platforms for generation */
    targetPlatforms?: TargetPlatform[];
    /** Continue on validation warnings */
    continueOnWarnings?: boolean;
    /** Stop on first error */
    stopOnError?: boolean;
    /** Enable detailed logging */
    verbose?: boolean;
}
/**
 * Workflow execution result
 */
export interface WorkflowExecutionResult {
    success: boolean;
    stage: WorkflowStage;
    registrationResults: {
        primitiveTokens: ValidationResult[];
        semanticTokens: ValidationResult[];
    };
    validationResults: ValidationResult[];
    consistencyResults: ValidationResult[];
    translationOutputs: TranslationOutput[];
    errors: Array<{
        stage: WorkflowStage;
        error: string;
        recoverable: boolean;
    }>;
    warnings: string[];
    executionTime: number;
    timestamp: Date;
}
/**
 * Workflow progress callback
 */
export type WorkflowProgressCallback = (stage: WorkflowStage, progress: number, message: string) => void;
/**
 * Token Generation Workflow orchestrator
 */
export declare class TokenGenerationWorkflow {
    private engine;
    private validationPipeline;
    private consistencyValidator;
    private errorHandler;
    private currentStage;
    private progressCallback?;
    constructor(engine: TokenEngine);
    /**
     * Execute complete token generation workflow
     */
    execute(primitiveTokens: PrimitiveToken[], semanticTokens: SemanticToken[], options?: WorkflowExecutionOptions): Promise<WorkflowExecutionResult>;
    /**
     * Execute workflow for incremental token updates
     */
    executeIncremental(newPrimitiveTokens: PrimitiveToken[], newSemanticTokens: SemanticToken[], options?: WorkflowExecutionOptions): Promise<WorkflowExecutionResult>;
    /**
     * Initialize workflow
     */
    private initializeWorkflow;
    /**
     * Register tokens in the engine
     */
    private registerTokens;
    /**
     * Validate all registered tokens
     */
    private validateTokens;
    /**
     * Check mathematical consistency
     */
    private checkConsistency;
    /**
     * Translate tokens to platform-specific formats
     */
    private translateTokens;
    /**
     * Set progress callback
     */
    setProgressCallback(callback: WorkflowProgressCallback): void;
    /**
     * Update current workflow stage
     */
    private updateStage;
    /**
     * Update progress
     */
    private updateProgress;
    /**
     * Check if validation results contain errors
     */
    private hasErrors;
    /**
     * Get current workflow stage
     */
    getCurrentStage(): WorkflowStage;
    /**
     * Reset workflow state
     */
    reset(): void;
}
//# sourceMappingURL=TokenGenerationWorkflow.d.ts.map