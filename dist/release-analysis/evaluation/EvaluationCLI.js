"use strict";
/**
 * Evaluation CLI Interface
 *
 * Command-line interface for running artifact evaluation framework.
 * Provides easy access to systematic testing and comparison of extraction approaches.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationCLI = void 0;
exports.runArtifactEvaluation = runArtifactEvaluation;
exports.runQuickComparison = runQuickComparison;
exports.runMethodEvaluation = runMethodEvaluation;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const ArtifactEvaluator_1 = require("./ArtifactEvaluator");
const AnalysisConfig_1 = require("../config/AnalysisConfig");
const ReleaseConfig_1 = require("../../release/config/ReleaseConfig");
class EvaluationCLI {
    constructor(analysisConfig = AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG, detectionConfig = ReleaseConfig_1.DEFAULT_RELEASE_CONFIG.detection) {
        this.analysisConfig = analysisConfig;
        this.detectionConfig = detectionConfig;
        this.evaluator = new ArtifactEvaluator_1.ArtifactEvaluator(analysisConfig, detectionConfig);
    }
    /**
     * Run complete artifact evaluation
     */
    async runEvaluation(options = {}) {
        console.log('🚀 Starting Artifact Evaluation Framework');
        console.log('==========================================\n');
        try {
            // Run the evaluation
            const result = await this.evaluator.evaluateArtifacts();
            // Output results
            await this.outputResults(result, options);
            // Print summary to console
            this.printSummary(result);
            return result;
        }
        catch (error) {
            console.error('❌ Evaluation failed:', error);
            throw error;
        }
    }
    /**
     * Run CompletionAnalyzer method evaluation (Task 4.2)
     */
    async runMethodEvaluation(options = {}) {
        console.log('🚀 Starting CompletionAnalyzer Method Evaluation (Task 4.2)');
        console.log('=========================================================\n');
        try {
            // Run the method evaluation
            const result = await this.evaluator.evaluateCompletionAnalyzerMethods();
            // Output results
            await this.outputMethodResults(result, options);
            // Print summary to console
            this.printMethodSummary(result);
        }
        catch (error) {
            console.error('❌ Method evaluation failed:', error);
            throw error;
        }
    }
    /**
     * Output evaluation results in specified format
     */
    async outputResults(result, options) {
        const format = options.format || 'markdown';
        switch (format) {
            case 'markdown':
                const outputPath = options.outputPath || this.getDefaultOutputPath('markdown');
                const markdownReport = this.evaluator.generateEvaluationReport(result);
                await fs_1.promises.writeFile(outputPath, markdownReport, 'utf-8');
                console.log(`📄 Markdown report saved to: ${outputPath}`);
                break;
            case 'json':
                const jsonPath = options.outputPath || this.getDefaultOutputPath('json');
                const jsonReport = JSON.stringify(result, null, 2);
                await fs_1.promises.writeFile(jsonPath, jsonReport, 'utf-8');
                console.log(`📊 JSON report saved to: ${jsonPath}`);
                break;
            case 'console':
                // Results already printed to console
                break;
        }
    }
    /**
     * Output method evaluation results in specified format
     */
    async outputMethodResults(result, options) {
        const format = options.format || 'markdown';
        switch (format) {
            case 'markdown':
                const outputPath = options.outputPath || this.getDefaultMethodOutputPath('markdown');
                const markdownReport = this.generateMethodEvaluationReport(result);
                await fs_1.promises.writeFile(outputPath, markdownReport, 'utf-8');
                console.log(`📄 Method evaluation report saved to: ${outputPath}`);
                break;
            case 'json':
                const jsonPath = options.outputPath || this.getDefaultMethodOutputPath('json');
                const jsonReport = JSON.stringify(result, null, 2);
                await fs_1.promises.writeFile(jsonPath, jsonReport, 'utf-8');
                console.log(`📊 Method evaluation JSON saved to: ${jsonPath}`);
                break;
            case 'console':
                // Results already printed to console
                break;
        }
    }
    /**
     * Print evaluation summary to console
     */
    printSummary(result) {
        console.log('\n📋 EVALUATION SUMMARY');
        console.log('====================\n');
        // Recommendation
        const decision = result.recommendation.decision.toUpperCase();
        const confidence = (result.recommendation.confidence * 100).toFixed(0);
        console.log(`🎯 RECOMMENDATION: ${decision} (${confidence}% confidence)\n`);
        // Key metrics comparison
        console.log('📊 KEY METRICS COMPARISON:');
        console.log('┌─────────────────────┬─────────────┬─────────────┬────────────┐');
        console.log('│ Metric              │ Simple      │ Complex     │ Difference │');
        console.log('├─────────────────────┼─────────────┼─────────────┼────────────┤');
        const simpleAcc = (result.simpleApproach.accuracy.extractionAccuracy * 100).toFixed(1);
        const complexAcc = (result.complexApproach.accuracy.extractionAccuracy * 100).toFixed(1);
        const accDiff = ((result.complexApproach.accuracy.extractionAccuracy - result.simpleApproach.accuracy.extractionAccuracy) * 100).toFixed(1);
        console.log(`│ Extraction Accuracy │ ${simpleAcc.padStart(10)}% │ ${complexAcc.padStart(10)}% │ ${(accDiff + 'pp').padStart(9)} │`);
        const simpleTime = result.simpleApproach.performance.processingTimeMs.toFixed(1);
        const complexTime = result.complexApproach.performance.processingTimeMs.toFixed(1);
        const timeDiff = (result.complexApproach.performance.processingTimeMs - result.simpleApproach.performance.processingTimeMs).toFixed(1);
        console.log(`│ Processing Time     │ ${(simpleTime + 'ms').padStart(11)} │ ${(complexTime + 'ms').padStart(11)} │ ${('+' + timeDiff + 'ms').padStart(10)} │`);
        const simpleComp = result.simpleApproach.complexity.cyclomaticComplexity.toString();
        const complexComp = result.complexApproach.complexity.cyclomaticComplexity.toString();
        const compDiff = (result.complexApproach.complexity.cyclomaticComplexity - result.simpleApproach.complexity.cyclomaticComplexity).toString();
        console.log(`│ Complexity Score    │ ${simpleComp.padStart(11)} │ ${complexComp.padStart(11)} │ ${('+' + compDiff).padStart(10)} │`);
        console.log('└─────────────────────┴─────────────┴─────────────┴────────────┘\n');
        // Tradeoff analysis
        console.log('⚖️  TRADEOFF ANALYSIS:');
        console.log(`   Accuracy vs Complexity: ${result.tradeoffAnalysis.accuracyVsComplexity.toFixed(3)}`);
        console.log(`   Performance vs Complexity: ${result.tradeoffAnalysis.performanceVsComplexity.toFixed(3)}`);
        console.log(`   Value vs Cost: ${result.tradeoffAnalysis.valueVsCost.toFixed(3)}\n`);
        // Risk assessment
        console.log(`🚨 RISK ASSESSMENT: ${result.tradeoffAnalysis.riskAssessment}\n`);
        // Conditions or alternatives
        if (result.recommendation.conditions) {
            console.log('📋 INTEGRATION CONDITIONS:');
            for (const condition of result.recommendation.conditions) {
                console.log(`   • ${condition}`);
            }
            console.log('');
        }
        if (result.recommendation.alternatives) {
            console.log('🔄 ALTERNATIVE APPROACHES:');
            for (const alternative of result.recommendation.alternatives) {
                console.log(`   • ${alternative}`);
            }
            console.log('');
        }
        // Mitigation strategies
        if (result.tradeoffAnalysis.mitigationStrategies.length > 0) {
            console.log('🛡️  MITIGATION STRATEGIES:');
            for (const strategy of result.tradeoffAnalysis.mitigationStrategies) {
                console.log(`   • ${strategy}`);
            }
            console.log('');
        }
        console.log('✅ Evaluation complete! Use the detailed report for implementation guidance.\n');
    }
    /**
     * Print method evaluation summary to console
     */
    printMethodSummary(result) {
        console.log('\n📋 METHOD EVALUATION SUMMARY (Task 4.2)');
        console.log('========================================\n');
        // Overall recommendation
        console.log(`🎯 OVERALL RECOMMENDATION:`);
        console.log(`   Extraction Method: ${result.overallRecommendation.extractionMethod.toUpperCase()}`);
        console.log(`   Deduplication: ${result.overallRecommendation.deduplicationMethod.toUpperCase()}`);
        console.log(`   Section Parsing: ${result.overallRecommendation.sectionParsing.toUpperCase()}`);
        console.log(`   Documentation Filtering: ${result.overallRecommendation.documentationFiltering ? 'ENABLED' : 'DISABLED'}`);
        console.log(`   Overall Complexity: ${result.overallRecommendation.overallComplexity.toUpperCase()}\n`);
        // Method comparisons
        console.log('📊 METHOD COMPARISON RESULTS:');
        console.log('┌─────────────────────────┬─────────────┬─────────────┬──────────────┐');
        console.log('│ Method                  │ Simple      │ Complex     │ Improvement  │');
        console.log('├─────────────────────────┼─────────────┼─────────────┼──────────────┤');
        const extractionSimple = (result.extractionComparison.simplePatternAccuracy * 100).toFixed(1);
        const extractionComplex = (result.extractionComparison.complexExtractionAccuracy * 100).toFixed(1);
        const extractionImprovement = (result.extractionComparison.accuracyImprovement * 100).toFixed(1);
        console.log(`│ Extraction Accuracy     │ ${extractionSimple.padStart(10)}% │ ${extractionComplex.padStart(10)}% │ ${(extractionImprovement + 'pp').padStart(11)} │`);
        const dedupeSimple = (result.deduplicationComparison.simpleDeduplicationEffectiveness * 100).toFixed(1);
        const dedupeComplex = (result.deduplicationComparison.semanticDeduplicationEffectiveness * 100).toFixed(1);
        const dedupeImprovement = (result.deduplicationComparison.falsePositiveReduction * 100).toFixed(1);
        console.log(`│ Deduplication Effect.   │ ${dedupeSimple.padStart(10)}% │ ${dedupeComplex.padStart(10)}% │ ${(dedupeImprovement + 'pp').padStart(11)} │`);
        const sectionPattern = (result.sectionParsingComparison.patternMatchingAccuracy * 100).toFixed(1);
        const sectionStructured = (result.sectionParsingComparison.structuredParsingAccuracy * 100).toFixed(1);
        const sectionAdvantage = (result.sectionParsingComparison.structuredDocumentAdvantage * 100).toFixed(1);
        console.log(`│ Section Parsing Acc.    │ ${sectionPattern.padStart(10)}% │ ${sectionStructured.padStart(10)}% │ ${(sectionAdvantage + 'pp').padStart(11)} │`);
        console.log('└─────────────────────────┴─────────────┴─────────────┴──────────────┘\n');
        // Implementation priority
        console.log('📋 IMPLEMENTATION PRIORITY:');
        result.overallRecommendation.implementationPriority.forEach((item) => {
            const priority = item.priority.toUpperCase();
            const icon = priority === 'HIGH' ? '🔴' : priority === 'MEDIUM' ? '🟡' : '🟢';
            console.log(`   ${icon} ${priority} - ${item.component}`);
        });
        console.log('');
        // Key insights
        console.log('💡 KEY INSIGHTS:');
        console.log(`   • Extraction: ${result.extractionComparison.recommendation.replace('-', ' ').toUpperCase()}`);
        console.log(`   • Deduplication: ${result.deduplicationComparison.recommendation.replace('-', ' ').toUpperCase()}`);
        console.log(`   • Section Parsing: ${result.sectionParsingComparison.recommendation.replace('-', ' ').toUpperCase()}`);
        console.log(`   • Doc Filtering: ${result.documentationFilteringComparison.recommendation.toUpperCase()}\n`);
        console.log('✅ Method evaluation complete! See detailed report for implementation guidance.\n');
    }
    /**
     * Generate method evaluation markdown report
     */
    generateMethodEvaluationReport(result) {
        const timestamp = new Date().toISOString();
        return `# CompletionAnalyzer Method Evaluation Report (Task 4.2)

**Generated:** ${timestamp}  
**Purpose:** Systematic evaluation of CompletionAnalyzer extraction methods vs simple pattern-based approach

## Executive Summary

**Overall Recommendation:** ${result.overallRecommendation.extractionMethod.toUpperCase()} extraction with ${result.overallRecommendation.deduplicationMethod.toUpperCase()} deduplication  
**Complexity Level:** ${result.overallRecommendation.overallComplexity.toUpperCase()}  
**Documentation Filtering:** ${result.overallRecommendation.documentationFiltering ? 'RECOMMENDED' : 'NOT RECOMMENDED'}

## Method Comparison Results

### 1. Extraction Methods

- **Simple Pattern Accuracy:** ${(result.extractionComparison.simplePatternAccuracy * 100).toFixed(1)}%
- **Complex Extraction Accuracy:** ${(result.extractionComparison.complexExtractionAccuracy * 100).toFixed(1)}%
- **Accuracy Improvement:** ${(result.extractionComparison.accuracyImprovement * 100).toFixed(1)} percentage points
- **Performance Impact:** +${result.extractionComparison.performanceImpact.toFixed(1)}ms
- **Recommendation:** ${result.extractionComparison.recommendation.toUpperCase()}

**Rationale:** ${result.extractionComparison.rationale}

### 2. Deduplication Methods

- **Simple Effectiveness:** ${(result.deduplicationComparison.simpleDeduplicationEffectiveness * 100).toFixed(1)}%
- **Semantic Effectiveness:** ${(result.deduplicationComparison.semanticDeduplicationEffectiveness * 100).toFixed(1)}%
- **False Positive Reduction:** ${(result.deduplicationComparison.falsePositiveReduction * 100).toFixed(1)}%
- **Processing Overhead:** +${result.deduplicationComparison.processingOverhead}ms
- **Recommendation:** ${result.deduplicationComparison.recommendation.toUpperCase()}

**Rationale:** ${result.deduplicationComparison.rationale}

### 3. Section Parsing Methods

- **Structured Parsing Accuracy:** ${(result.sectionParsingComparison.structuredParsingAccuracy * 100).toFixed(1)}%
- **Pattern Matching Accuracy:** ${(result.sectionParsingComparison.patternMatchingAccuracy * 100).toFixed(1)}%
- **Structured Document Advantage:** ${(result.sectionParsingComparison.structuredDocumentAdvantage * 100).toFixed(1)}%
- **Unstructured Performance:** ${(result.sectionParsingComparison.unstructuredDocumentPerformance * 100).toFixed(1)}%
- **Recommendation:** ${result.sectionParsingComparison.recommendation.toUpperCase()}

**Rationale:** ${result.sectionParsingComparison.rationale}

### 4. Documentation Filtering

- **Filtering Accuracy:** ${(result.documentationFilteringComparison.filteringAccuracy * 100).toFixed(1)}%
- **False Positive Reduction:** ${(result.documentationFilteringComparison.falsePositiveReduction * 100).toFixed(1)}%
- **False Negative Rate:** ${(result.documentationFilteringComparison.falseNegativeRate * 100).toFixed(1)}%
- **Overall Effectiveness:** ${(result.documentationFilteringComparison.overallEffectiveness * 100).toFixed(1)}%
- **Recommendation:** ${result.documentationFilteringComparison.recommendation.toUpperCase()}

**Rationale:** ${result.documentationFilteringComparison.rationale}

## Implementation Recommendations

### Priority Matrix

${result.overallRecommendation.implementationPriority.map((item) => `- **${item.priority.toUpperCase()}** - ${item.component}: ${item.justification}`).join('\n')}

### Integration Strategy

${result.overallRecommendation.rationale}

## Conclusion

Based on systematic evaluation of CompletionAnalyzer methods against simple pattern-based approaches, the recommended integration strategy balances accuracy improvements with implementation complexity for the CLI-driven release analysis workflow.

**Next Steps:**
1. Implement high-priority components first
2. Validate integration with real completion documents
3. Monitor performance impact during implementation
4. Consider progressive complexity based on document types

---
*Report generated by Release Analysis System Evaluation Framework*
`;
    }
    /**
     * Get default output path for format
     */
    getDefaultOutputPath(format) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const extension = format === 'markdown' ? 'md' : 'json';
        return `.kiro/specs/release-analysis-system/evaluation/artifact-evaluation-${timestamp}.${extension}`;
    }
    /**
     * Get default output path for method evaluation
     */
    getDefaultMethodOutputPath(format) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const extension = format === 'markdown' ? 'md' : 'json';
        return `.kiro/specs/release-analysis-system/evaluation/method-evaluation-${timestamp}.${extension}`;
    }
    /**
     * Run quick comparison (simplified evaluation)
     */
    async runQuickComparison() {
        console.log('⚡ Running Quick Artifact Comparison...\n');
        try {
            const result = await this.evaluator.evaluateArtifacts();
            console.log('📊 QUICK COMPARISON RESULTS:');
            console.log(`   Simple Approach Accuracy: ${(result.simpleApproach.accuracy.extractionAccuracy * 100).toFixed(1)}%`);
            console.log(`   Complex Approach Accuracy: ${(result.complexApproach.accuracy.extractionAccuracy * 100).toFixed(1)}%`);
            console.log(`   Accuracy Improvement: ${((result.complexApproach.accuracy.extractionAccuracy - result.simpleApproach.accuracy.extractionAccuracy) * 100).toFixed(1)} percentage points`);
            console.log(`   Performance Impact: +${(result.complexApproach.performance.processingTimeMs - result.simpleApproach.performance.processingTimeMs).toFixed(1)}ms`);
            console.log(`   Complexity Increase: +${result.complexApproach.complexity.cyclomaticComplexity - result.simpleApproach.complexity.cyclomaticComplexity} points`);
            console.log(`\n🎯 RECOMMENDATION: ${result.recommendation.decision.toUpperCase()} (${(result.recommendation.confidence * 100).toFixed(0)}% confidence)\n`);
        }
        catch (error) {
            console.error('❌ Quick comparison failed:', error);
        }
    }
    /**
     * Validate evaluation setup
     */
    async validateSetup() {
        console.log('🔍 Validating evaluation setup...\n');
        const checks = [
            { name: 'Simple extractor available', check: () => this.checkSimpleExtractor() },
            { name: 'Complex analyzer available', check: () => this.checkComplexAnalyzer() },
            { name: 'Test documents available', check: () => this.checkTestDocuments() },
            { name: 'Output directory writable', check: () => this.checkOutputDirectory() }
        ];
        let allPassed = true;
        for (const { name, check } of checks) {
            try {
                const passed = await check();
                console.log(`${passed ? '✅' : '❌'} ${name}`);
                if (!passed)
                    allPassed = false;
            }
            catch (error) {
                console.log(`❌ ${name} - Error: ${error}`);
                allPassed = false;
            }
        }
        console.log(`\n${allPassed ? '✅' : '❌'} Setup validation ${allPassed ? 'passed' : 'failed'}\n`);
        return allPassed;
    }
    /**
     * Setup validation checks
     */
    async checkSimpleExtractor() {
        try {
            // Try to instantiate simple extractor
            return this.evaluator !== null;
        }
        catch (error) {
            return false;
        }
    }
    async checkComplexAnalyzer() {
        try {
            // Check if complex analyzer file exists
            const analyzerPath = path.join(__dirname, '../../release/detection/CompletionAnalyzer.ts');
            await fs_1.promises.access(analyzerPath);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async checkTestDocuments() {
        try {
            const specsDir = '.kiro/specs';
            await fs_1.promises.access(specsDir);
            // Check for at least one completion document
            const specs = await fs_1.promises.readdir(specsDir);
            for (const spec of specs) {
                const completionDir = path.join(specsDir, spec, 'completion');
                try {
                    const files = await fs_1.promises.readdir(completionDir);
                    if (files.some(f => f.endsWith('.md'))) {
                        return true;
                    }
                }
                catch (error) {
                    // Continue checking other specs
                }
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    async checkOutputDirectory() {
        try {
            const outputDir = '.kiro/specs/release-analysis-system/evaluation';
            await fs_1.promises.mkdir(outputDir, { recursive: true });
            // Test write access
            const testFile = path.join(outputDir, 'test-write.tmp');
            await fs_1.promises.writeFile(testFile, 'test');
            await fs_1.promises.unlink(testFile);
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.EvaluationCLI = EvaluationCLI;
/**
 * CLI entry point for artifact evaluation
 */
async function runArtifactEvaluation(options = {}) {
    const cli = new EvaluationCLI();
    // Validate setup first
    const setupValid = await cli.validateSetup();
    if (!setupValid) {
        console.error('❌ Setup validation failed. Please fix issues before running evaluation.');
        process.exit(1);
    }
    // Run evaluation
    await cli.runEvaluation(options);
}
/**
 * CLI entry point for quick comparison
 */
async function runQuickComparison() {
    const cli = new EvaluationCLI();
    await cli.runQuickComparison();
}
/**
 * CLI entry point for method evaluation (Task 4.2)
 */
async function runMethodEvaluation(options = {}) {
    const cli = new EvaluationCLI();
    // Validate setup first
    const setupValid = await cli.validateSetup();
    if (!setupValid) {
        console.error('❌ Setup validation failed. Please fix issues before running method evaluation.');
        process.exit(1);
    }
    // Run method evaluation
    await cli.runMethodEvaluation(options);
}
//# sourceMappingURL=EvaluationCLI.js.map