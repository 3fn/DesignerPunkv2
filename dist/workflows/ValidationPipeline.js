"use strict";
/**
 * Validation Pipeline
 *
 * Integrates validation at appropriate stages throughout the token generation
 * workflow. Provides staged validation with clear feedback and recovery options.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationPipeline = void 0;
/**
 * Validation Pipeline class
 */
class ValidationPipeline {
    constructor(engine) {
        this.stageResults = [];
        this.initialized = false;
        this.engine = engine;
    }
    // ============================================================================
    // Pipeline Initialization
    // ============================================================================
    /**
     * Initialize validation pipeline
     */
    initialize() {
        this.stageResults = [];
        this.initialized = true;
    }
    /**
     * Reset validation pipeline
     */
    reset() {
        this.stageResults = [];
        this.initialized = false;
    }
    // ============================================================================
    // Validation Execution
    // ============================================================================
    /**
     * Execute complete validation pipeline
     */
    async validate(config = {}) {
        if (!this.initialized) {
            throw new Error('Validation pipeline not initialized');
        }
        const allResults = [];
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
    async validatePrimitiveTokens(config) {
        const primitiveTokens = this.engine.getAllPrimitiveTokens();
        const results = [];
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
    async validateSemanticTokens(config) {
        const semanticTokens = this.engine.getAllSemanticTokens();
        const results = [];
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
    async validateCrossPlatformConsistency(config) {
        const results = this.engine.validateCrossPlatformConsistency();
        return this.createStageResult('Cross-Platform Consistency', results);
    }
    /**
     * Validate reference integrity
     */
    async validateReferenceIntegrity(config) {
        const results = [];
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
                }
                else {
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
    createStageResult(stage, results) {
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
    getStageResults() {
        return [...this.stageResults];
    }
    /**
     * Get summary of all validation stages
     */
    getSummary() {
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
    isPassed() {
        return this.stageResults.every(s => s.passed);
    }
    /**
     * Get failed stages
     */
    getFailedStages() {
        return this.stageResults.filter(s => !s.passed);
    }
}
exports.ValidationPipeline = ValidationPipeline;
//# sourceMappingURL=ValidationPipeline.js.map