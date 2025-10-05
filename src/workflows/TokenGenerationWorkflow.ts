/**
 * Token Generation Workflow
 * 
 * Orchestrates the end-to-end token generation process from token definition
 * to platform-specific output. Integrates validation at appropriate stages
 * and ensures mathematical consistency throughout the pipeline.
 */

import { TokenEngine } from '../TokenEngine';
import { ValidationPipeline } from './ValidationPipeline.js';
import { ConsistencyValidator } from './ConsistencyValidator.js';
import { WorkflowErrorHandler } from './WorkflowErrorHandler.js';
import type {
  PrimitiveToken,
  SemanticToken,
  ValidationResult,
  TranslationOutput,
  TargetPlatform
} from '../types';

/**
 * Workflow stage enumeration
 */
export enum WorkflowStage {
  INITIALIZATION = 'initialization',
  TOKEN_REGISTRATION = 'token_registration',
  VALIDATION = 'validation',
  CONSISTENCY_CHECK = 'consistency_check',
  TRANSLATION = 'translation',
  OUTPUT_GENERATION = 'output_generation',
  COMPLETION = 'completion'
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
export type WorkflowProgressCallback = (
  stage: WorkflowStage,
  progress: number,
  message: string
) => void;

/**
 * Token Generation Workflow orchestrator
 */
export class TokenGenerationWorkflow {
  private engine: TokenEngine;
  private validationPipeline: ValidationPipeline;
  private consistencyValidator: ConsistencyValidator;
  private errorHandler: WorkflowErrorHandler;
  private currentStage: WorkflowStage = WorkflowStage.INITIALIZATION;
  private progressCallback?: WorkflowProgressCallback;

  constructor(engine: TokenEngine) {
    this.engine = engine;
    this.validationPipeline = new ValidationPipeline(engine);
    this.consistencyValidator = new ConsistencyValidator(engine);
    this.errorHandler = new WorkflowErrorHandler();
  }

  // ============================================================================
  // Workflow Execution
  // ============================================================================

  /**
   * Execute complete token generation workflow
   */
  async execute(
    primitiveTokens: PrimitiveToken[],
    semanticTokens: SemanticToken[],
    options: WorkflowExecutionOptions = {}
  ): Promise<WorkflowExecutionResult> {
    const startTime = Date.now();
    const result: WorkflowExecutionResult = {
      success: false,
      stage: WorkflowStage.INITIALIZATION,
      registrationResults: {
        primitiveTokens: [],
        semanticTokens: []
      },
      validationResults: [],
      consistencyResults: [],
      translationOutputs: [],
      errors: [],
      warnings: [],
      executionTime: 0,
      timestamp: new Date()
    };

    try {
      // Stage 1: Initialization
      this.updateStage(WorkflowStage.INITIALIZATION, 0, 'Initializing workflow');
      await this.initializeWorkflow(options);

      // Stage 2: Token Registration
      this.updateStage(WorkflowStage.TOKEN_REGISTRATION, 10, 'Registering tokens');
      const registrationResult = await this.registerTokens(
        primitiveTokens,
        semanticTokens,
        options
      );
      result.registrationResults = registrationResult;

      // Check for registration errors
      if (this.hasErrors(registrationResult.primitiveTokens) ||
        this.hasErrors(registrationResult.semanticTokens)) {
        if (options.stopOnError) {
          throw new Error('Token registration failed with errors');
        }
        result.warnings.push('Some tokens failed registration but workflow continues');
      }

      // Stage 3: Validation
      if (!options.skipValidation) {
        this.updateStage(WorkflowStage.VALIDATION, 40, 'Validating tokens');
        const validationResult = await this.validateTokens(options);
        result.validationResults = validationResult;

        // Check for validation errors
        if (this.hasErrors(validationResult)) {
          if (options.stopOnError) {
            throw new Error('Token validation failed with errors');
          }
          result.warnings.push('Some tokens failed validation but workflow continues');
        }
      }

      // Stage 4: Consistency Check
      if (!options.skipConsistencyCheck) {
        this.updateStage(WorkflowStage.CONSISTENCY_CHECK, 60, 'Checking mathematical consistency');
        const consistencyResult = await this.checkConsistency(options);
        result.consistencyResults = consistencyResult;

        // Check for consistency errors
        if (this.hasErrors(consistencyResult)) {
          if (options.stopOnError) {
            throw new Error('Consistency check failed with errors');
          }
          result.warnings.push('Some consistency checks failed but workflow continues');
        }
      }

      // Stage 5: Translation
      this.updateStage(WorkflowStage.TRANSLATION, 80, 'Translating to platform-specific formats');
      const translationResult = await this.translateTokens(options);
      result.translationOutputs = translationResult;

      // Check for translation errors
      const failedTranslations = translationResult.filter(t => t.validationStatus === 'invalid');
      if (failedTranslations.length > 0) {
        if (options.stopOnError) {
          throw new Error(`Translation failed for ${failedTranslations.length} platforms`);
        }
        result.warnings.push(`Translation failed for ${failedTranslations.length} platforms`);
      }

      // Stage 6: Completion
      this.updateStage(WorkflowStage.COMPLETION, 100, 'Workflow completed successfully');
      result.success = true;
      result.stage = WorkflowStage.COMPLETION;

    } catch (error) {
      // Handle workflow errors
      const errorInfo = this.errorHandler.handleError(error, this.currentStage);
      result.errors.push(errorInfo);
      result.success = false;
      result.stage = this.currentStage;

      if (options.verbose) {
        console.error(`Workflow failed at stage ${this.currentStage}:`, error);
      }
    } finally {
      result.executionTime = Date.now() - startTime;
    }

    return result;
  }

  /**
   * Execute workflow for incremental token updates
   */
  async executeIncremental(
    newPrimitiveTokens: PrimitiveToken[],
    newSemanticTokens: SemanticToken[],
    options: WorkflowExecutionOptions = {}
  ): Promise<WorkflowExecutionResult> {
    // Incremental execution only processes new tokens
    // Existing tokens remain in the engine
    return this.execute(newPrimitiveTokens, newSemanticTokens, {
      ...options,
      skipValidation: false, // Always validate new tokens
      skipConsistencyCheck: false // Always check consistency with existing tokens
    });
  }

  // ============================================================================
  // Workflow Stages
  // ============================================================================

  /**
   * Initialize workflow
   */
  private async initializeWorkflow(options: WorkflowExecutionOptions): Promise<void> {
    // Configure engine based on workflow options
    if (options.targetPlatforms) {
      this.engine.updateConfig({
        translationConfig: {
          enabledPlatforms: options.targetPlatforms
        }
      });
    }

    // Initialize validation pipeline
    this.validationPipeline.initialize();

    // Initialize consistency validator
    this.consistencyValidator.initialize();
  }

  /**
   * Register tokens in the engine
   */
  private async registerTokens(
    primitiveTokens: PrimitiveToken[],
    semanticTokens: SemanticToken[],
    options: WorkflowExecutionOptions
  ): Promise<{
    primitiveTokens: ValidationResult[];
    semanticTokens: ValidationResult[];
  }> {
    const primitiveResults: ValidationResult[] = [];
    const semanticResults: ValidationResult[] = [];

    // Register primitive tokens first
    for (let i = 0; i < primitiveTokens.length; i++) {
      const token = primitiveTokens[i];
      const progress = 10 + (20 * (i / primitiveTokens.length));
      this.updateProgress(progress, `Registering primitive token: ${token.name}`);

      try {
        const result = this.engine.registerPrimitiveToken(token);
        primitiveResults.push(result);

        if (result.level === 'Error' && options.stopOnError) {
          throw new Error(`Failed to register primitive token ${token.name}: ${result.message}`);
        }
      } catch (error) {
        const errorResult = this.errorHandler.createErrorResult(
          token.name,
          error,
          'Token registration failed'
        );
        primitiveResults.push(errorResult);

        if (options.stopOnError) {
          throw error;
        }
      }
    }

    // Register semantic tokens after primitives
    for (let i = 0; i < semanticTokens.length; i++) {
      const token = semanticTokens[i];
      const progress = 30 + (10 * (i / semanticTokens.length));
      this.updateProgress(progress, `Registering semantic token: ${token.name}`);

      try {
        const result = this.engine.registerSemanticToken(token);
        semanticResults.push(result);

        if (result.level === 'Error' && options.stopOnError) {
          throw new Error(`Failed to register semantic token ${token.name}: ${result.message}`);
        }
      } catch (error) {
        const errorResult = this.errorHandler.createErrorResult(
          token.name,
          error,
          'Token registration failed'
        );
        semanticResults.push(errorResult);

        if (options.stopOnError) {
          throw error;
        }
      }
    }

    return {
      primitiveTokens: primitiveResults,
      semanticTokens: semanticResults
    };
  }

  /**
   * Validate all registered tokens
   */
  private async validateTokens(
    options: WorkflowExecutionOptions
  ): Promise<ValidationResult[]> {
    this.updateProgress(40, 'Running validation pipeline');

    const results = await this.validationPipeline.validate({
      strictMathematics: true,
      requireCrossPlatformConsistency: true,
      enablePatternAnalysis: true,
      validateReferences: true
    });

    // Filter results based on options
    if (!options.continueOnWarnings) {
      const warnings = results.filter(r => r.level === 'Warning');
      if (warnings.length > 0 && options.verbose) {
        console.warn(`Validation produced ${warnings.length} warnings`);
      }
    }

    return results;
  }

  /**
   * Check mathematical consistency
   */
  private async checkConsistency(
    options: WorkflowExecutionOptions
  ): Promise<ValidationResult[]> {
    this.updateProgress(60, 'Validating mathematical consistency');

    const results = await this.consistencyValidator.validate({
      checkBaselineGrid: true,
      checkCrossPlatform: true,
      checkMathematicalRelationships: true,
      checkStrategicFlexibility: true
    });

    return results;
  }

  /**
   * Translate tokens to platform-specific formats
   */
  private async translateTokens(
    options: WorkflowExecutionOptions
  ): Promise<TranslationOutput[]> {
    this.updateProgress(80, 'Generating platform-specific token files');

    const outputs = await this.engine.generatePlatformTokens();

    // Log translation results
    if (options.verbose) {
      outputs.forEach(output => {
        const status = output.validationStatus === 'valid' ? '✓' : '✗';
        console.log(`${status} ${output.platform}: ${output.tokenCount} tokens → ${output.filePath}`);
      });
    }

    return outputs;
  }

  // ============================================================================
  // Progress Tracking
  // ============================================================================

  /**
   * Set progress callback
   */
  setProgressCallback(callback: WorkflowProgressCallback): void {
    this.progressCallback = callback;
  }

  /**
   * Update current workflow stage
   */
  private updateStage(stage: WorkflowStage, progress: number, message: string): void {
    this.currentStage = stage;
    this.updateProgress(progress, message);
  }

  /**
   * Update progress
   */
  private updateProgress(progress: number, message: string): void {
    if (this.progressCallback) {
      this.progressCallback(this.currentStage, progress, message);
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Check if validation results contain errors
   */
  private hasErrors(results: ValidationResult[]): boolean {
    return results.some((r: ValidationResult) => r.level === 'Error');
  }

  /**
   * Get current workflow stage
   */
  getCurrentStage(): WorkflowStage {
    return this.currentStage;
  }

  /**
   * Reset workflow state
   */
  reset(): void {
    this.currentStage = WorkflowStage.INITIALIZATION;
    this.validationPipeline.reset();
    this.consistencyValidator.reset();
    this.errorHandler.reset();
  }
}
