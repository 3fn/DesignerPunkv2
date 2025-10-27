"use strict";
/**
 * Example Usage of Release Analysis Error Handling System
 *
 * Demonstrates comprehensive error handling patterns for the release analysis system,
 * including Git errors, parsing errors, configuration issues, and recovery strategies.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicErrorHandlingExample = basicErrorHandlingExample;
exports.gitErrorHandlingExample = gitErrorHandlingExample;
exports.documentParsingExample = documentParsingExample;
exports.configurationErrorExample = configurationErrorExample;
exports.errorReportingExample = errorReportingExample;
exports.cliIntegrationExample = cliIntegrationExample;
exports.runAllExamples = runAllExamples;
const index_1 = require("./index");
const ErrorRecovery_1 = require("./ErrorRecovery");
/**
 * Example 1: Basic error handling with automatic recovery
 */
async function basicErrorHandlingExample() {
    console.log('🔧 Example 1: Basic Error Handling\n');
    const context = (0, index_1.createErrorContext)('example-operation', 'ExampleComponent');
    // Simulate an operation that might fail
    const result = await (0, index_1.withErrorHandling)(async () => {
        // This would normally be a real operation
        throw new Error('Simulated failure for demonstration');
    }, context);
    if (result.success) {
        console.log('✅ Operation succeeded:', result.data);
    }
    else {
        console.log('❌ Operation failed:');
        console.log((0, index_1.formatErrorForCLI)(result.error));
    }
    console.log('\n' + '='.repeat(50) + '\n');
}
/**
 * Example 2: Git error handling with recovery
 */
async function gitErrorHandlingExample() {
    console.log('🔧 Example 2: Git Error Handling\n');
    const workingDirectory = process.cwd();
    const recoveryUtils = (0, ErrorRecovery_1.createRecoveryUtilities)(workingDirectory);
    // Simulate Git repository not found
    const gitError = new Error('fatal: not a git repository');
    const context = (0, index_1.createErrorContext)('git-analysis', 'GitAnalyzer', {
        gitCommand: 'git status'
    });
    const result = await index_1.releaseAnalysisErrorHandler.handleGitError(gitError, context, async () => {
        // Fallback: scan filesystem for completion documents
        console.log('🔄 Falling back to filesystem scanning...');
        return { useFileSystemScan: true };
    });
    if (result.success) {
        console.log('✅ Git error recovered:', result.data);
    }
    else {
        console.log('❌ Git error could not be recovered:');
        console.log((0, index_1.formatErrorForCLI)(result.error));
    }
    console.log('\n' + '='.repeat(50) + '\n');
}
/**
 * Example 3: Document parsing with error recovery
 */
async function documentParsingExample() {
    console.log('🔧 Example 3: Document Parsing Error Recovery\n');
    const recoveryUtils = (0, ErrorRecovery_1.createRecoveryUtilities)(process.cwd());
    // Simulate parsing multiple documents with some failures
    const documents = [
        { path: 'valid-doc.md', content: '# Valid Document\n\nThis is a valid completion document.' },
        { path: 'malformed-doc.md', content: '# Malformed\n\nToo short' },
        { path: 'empty-doc.md', content: '' },
        { path: 'corrupted-doc.md', content: '# Corrupted Document\n\nThis document has enough content but simulates parsing failure.' }
    ];
    const parseOperations = documents.map(doc => async () => {
        if (doc.path === 'corrupted-doc.md') {
            throw new Error('JSON metadata parsing failed');
        }
        if (doc.content.length < 50) {
            throw new Error('Document too short');
        }
        return { ...doc, parsed: true };
    });
    const batchResult = await (0, index_1.handleMultipleErrors)(parseOperations, { component: 'DocumentParser', timestamp: new Date() }, true // Continue on error
    );
    console.log(`📊 Parsing Results:`);
    console.log(`   Successful: ${batchResult.successCount}/${parseOperations.length}`);
    console.log(`   Errors: ${batchResult.errors.length}`);
    if (batchResult.errors.length > 0) {
        console.log('\n❌ Parsing Errors:');
        batchResult.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${(0, index_1.formatErrorForCLI)(error)}`);
        });
    }
    console.log('\n' + '='.repeat(50) + '\n');
}
/**
 * Example 4: Configuration error handling
 */
async function configurationErrorExample() {
    console.log('🔧 Example 4: Configuration Error Handling\n');
    const recoveryUtils = (0, ErrorRecovery_1.createRecoveryUtilities)(process.cwd());
    // Simulate configuration loading failure
    const configError = new Error('Configuration file not found');
    const context = (0, index_1.createErrorContext)('load-config', 'ConfigManager', {
        filePath: '.kiro/release-config.json'
    });
    const result = await index_1.releaseAnalysisErrorHandler.handleConfigurationError(configError, context, '.kiro/release-config.json');
    if (result.success) {
        console.log('✅ Configuration recovered with defaults');
    }
    else {
        console.log('❌ Configuration error:');
        console.log((0, index_1.formatErrorForCLI)(result.error));
        // Try manual recovery
        const recoveryResult = await recoveryUtils.configuration.recoverFromMissingConfig('.kiro/release-config.json');
        if (recoveryResult.success) {
            console.log('🔄 Manual recovery successful with default configuration');
        }
    }
    console.log('\n' + '='.repeat(50) + '\n');
}
/**
 * Example 5: Comprehensive error reporting
 */
async function errorReportingExample() {
    console.log('🔧 Example 5: Comprehensive Error Reporting\n');
    // Clear previous errors
    index_1.releaseAnalysisErrorHandler.clearErrorHistory();
    // Simulate multiple errors during analysis
    await index_1.releaseAnalysisErrorHandler.handleGitError(new Error('permission denied'), (0, index_1.createErrorContext)('git-access', 'GitAnalyzer'));
    await index_1.releaseAnalysisErrorHandler.handleParsingError(new Error('malformed JSON metadata'), 'task-1-completion.md', (0, index_1.createErrorContext)('parse-document', 'DocumentParser'), true // Skip on error
    );
    await index_1.releaseAnalysisErrorHandler.handleValidationError(new Error('schema validation failed'), (0, index_1.createErrorContext)('validate-extraction', 'ChangeExtractor'));
    // Generate comprehensive error report
    const errorReport = index_1.releaseAnalysisErrorHandler.getFormattedErrorReport();
    console.log(errorReport);
    // Get structured error summary
    const summary = index_1.releaseAnalysisErrorHandler.createErrorSummary();
    console.log('\n📈 Structured Summary:');
    console.log(`   Total Errors: ${summary.totalErrors}`);
    console.log(`   Critical: ${summary.criticalErrors.length}`);
    console.log(`   Recoverable: ${summary.recoverableErrors.length}`);
    console.log(`   Recommendations: ${summary.recommendations.length}`);
    console.log('\n' + '='.repeat(50) + '\n');
}
/**
 * Example 6: CLI integration pattern
 */
async function cliIntegrationExample() {
    console.log('🔧 Example 6: CLI Integration Pattern\n');
    // Clear error history for clean example
    index_1.releaseAnalysisErrorHandler.clearErrorHistory();
    // Simulate CLI operation with comprehensive error handling
    const cliOperation = async () => {
        console.log('🔍 Starting release analysis...');
        // Step 1: Git analysis
        const gitResult = await (0, index_1.withErrorHandling)(async () => {
            // Simulate Git operation
            throw new Error('not a git repository');
        }, (0, index_1.createErrorContext)('git-analysis', 'CLI'));
        if (!gitResult.success) {
            console.log('⚠️  Git analysis failed, using fallback...');
        }
        // Step 2: Document collection
        const docResult = await (0, index_1.withErrorHandling)(async () => {
            // Simulate document collection
            return ['doc1.md', 'doc2.md'];
        }, (0, index_1.createErrorContext)('collect-documents', 'CLI'));
        // Step 3: Change extraction
        const extractResult = await (0, index_1.withErrorHandling)(async () => {
            // Simulate extraction with validation warning
            throw new Error('low confidence extraction');
        }, (0, index_1.createErrorContext)('extract-changes', 'CLI'));
        return {
            gitAnalysis: gitResult.success,
            documentCollection: docResult.success,
            changeExtraction: extractResult.success
        };
    };
    const result = await cliOperation();
    console.log('\n📊 Analysis Results:');
    console.log(`   Git Analysis: ${result.gitAnalysis ? '✅' : '❌'}`);
    console.log(`   Document Collection: ${result.documentCollection ? '✅' : '❌'}`);
    console.log(`   Change Extraction: ${result.changeExtraction ? '✅' : '❌'}`);
    // Show error summary
    const errorReport = index_1.releaseAnalysisErrorHandler.getFormattedErrorReport();
    if (errorReport !== '✅ No errors encountered during analysis') {
        console.log('\n' + errorReport);
    }
    console.log('\n' + '='.repeat(50) + '\n');
}
/**
 * Run all examples
 */
async function runAllExamples() {
    console.log('🚀 Release Analysis Error Handling Examples\n');
    console.log('This demonstrates comprehensive error handling patterns for the release analysis system.\n');
    try {
        await basicErrorHandlingExample();
        await gitErrorHandlingExample();
        await documentParsingExample();
        await configurationErrorExample();
        await errorReportingExample();
        await cliIntegrationExample();
        console.log('✅ All examples completed successfully!');
        console.log('\nKey Takeaways:');
        console.log('• Error handling provides graceful degradation and recovery');
        console.log('• Users receive clear, actionable guidance for resolving issues');
        console.log('• The system continues operation when possible, failing gracefully when not');
        console.log('• Comprehensive error reporting helps with debugging and improvement');
    }
    catch (error) {
        console.error('❌ Example execution failed:', error);
    }
}
// Run examples if this file is executed directly
if (require.main === module) {
    runAllExamples().catch(console.error);
}
//# sourceMappingURL=example-usage.js.map