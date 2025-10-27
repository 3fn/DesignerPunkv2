#!/usr/bin/env node
"use strict";
/**
 * CLI command for running accuracy validation tests
 *
 * Provides command-line interface for executing accuracy validation
 * and generating reports on extraction and categorization accuracy.
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
exports.runAccuracyValidation = main;
const AccuracyTestRunner_1 = require("../validation/AccuracyTestRunner");
const AnalysisConfig_1 = require("../config/AnalysisConfig");
function parseArgs(args) {
    const options = {};
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '--categories':
            case '-c':
                options.categories = args[++i]?.split(',') || [];
                break;
            case '--difficulties':
            case '-d':
                options.difficulties = args[++i]?.split(',') || [];
                break;
            case '--test-cases':
            case '-t':
                options.testCases = args[++i]?.split(',') || [];
                break;
            case '--regression':
            case '-r':
                options.regression = true;
                break;
            case '--baseline':
            case '-b':
                options.baseline = args[++i];
                break;
            case '--output':
            case '-o':
                options.output = args[++i];
                break;
            case '--format':
            case '-f':
                const format = args[++i];
                if (['summary', 'detailed', 'json'].includes(format)) {
                    options.format = format;
                }
                break;
            case '--quick':
            case '-q':
                options.quick = true;
                break;
            case '--comprehensive':
                options.comprehensive = true;
                break;
            case '--help':
            case '-h':
                options.help = true;
                break;
        }
    }
    return options;
}
function printHelp() {
    console.log(`
Release Analysis Accuracy Validation

USAGE:
  npm run accuracy:validate [OPTIONS]

OPTIONS:
  -c, --categories <list>     Test categories to include (structured,unstructured,mixed,edge-case)
  -d, --difficulties <list>   Test difficulty levels (easy,medium,hard,expert)
  -t, --test-cases <list>     Specific test case IDs to run
  -r, --regression            Run regression tests against baseline
  -b, --baseline <file>       Baseline results file for regression testing
  -o, --output <file>         Output file path (without extension)
  -f, --format <format>       Output format (summary|detailed|json)
  -q, --quick                 Run quick validation with basic test cases
      --comprehensive         Run comprehensive validation with all test cases
  -h, --help                  Show this help message

EXAMPLES:
  # Quick validation
  npm run accuracy:validate --quick

  # Comprehensive validation
  npm run accuracy:validate --comprehensive

  # Test specific categories
  npm run accuracy:validate --categories structured,unstructured

  # Run regression tests
  npm run accuracy:validate --regression --baseline baseline-results.json

  # Generate detailed report
  npm run accuracy:validate --format detailed --output accuracy-report

  # Test specific cases
  npm run accuracy:validate --test-cases structured-breaking-change,structured-feature
`);
}
async function loadBaselineResults(baselinePath) {
    try {
        const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
        const content = await fs.readFile(baselinePath, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        console.error(`Error loading baseline results from ${baselinePath}:`, error);
        process.exit(1);
    }
}
async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);
    if (options.help) {
        printHelp();
        return;
    }
    console.log('🔍 Starting Release Analysis Accuracy Validation...\n');
    try {
        const runner = new AccuracyTestRunner_1.AccuracyTestRunner(AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG.extraction);
        let report;
        if (options.quick) {
            console.log('Running quick accuracy validation...');
            report = await runner.runQuickCheck();
        }
        else if (options.comprehensive) {
            console.log('Running comprehensive accuracy validation...');
            report = await runner.runComprehensiveValidation();
        }
        else {
            // Custom test run
            const runOptions = {
                categories: options.categories,
                difficulties: options.difficulties,
                testCaseIds: options.testCases,
                runRegression: options.regression,
                baselineResults: options.baseline ? await loadBaselineResults(options.baseline) : undefined,
                outputFormat: options.format || 'detailed',
                saveResults: !!options.output,
                outputPath: options.output
            };
            console.log('Running custom accuracy validation...');
            if (runOptions.categories) {
                console.log(`  Categories: ${runOptions.categories.join(', ')}`);
            }
            if (runOptions.difficulties) {
                console.log(`  Difficulties: ${runOptions.difficulties.join(', ')}`);
            }
            if (runOptions.testCaseIds) {
                console.log(`  Test Cases: ${runOptions.testCaseIds.join(', ')}`);
            }
            if (runOptions.runRegression) {
                console.log('  Regression testing: enabled');
            }
            report = await runner.runTests(runOptions);
        }
        // Display results
        console.log('\n' + '='.repeat(60));
        console.log('ACCURACY VALIDATION RESULTS');
        console.log('='.repeat(60));
        const format = options.format || 'summary';
        const formattedReport = runner.formatReport(report, format);
        console.log(formattedReport);
        // Save results if requested
        if (options.output) {
            console.log(`\n📄 Report saved to: ${options.output}.${format === 'json' ? 'json' : 'md'}`);
        }
        // Exit with appropriate code
        const failedTests = report.summary.failedTests;
        if (failedTests > 0) {
            console.log(`\n❌ ${failedTests} test(s) failed. Review results and address issues.`);
            process.exit(1);
        }
        else {
            console.log(`\n✅ All ${report.summary.totalTests} tests passed!`);
            if (report.regressionResult?.regressionDetected) {
                console.log('⚠️  Regression detected in accuracy metrics.');
                process.exit(1);
            }
        }
    }
    catch (error) {
        console.error('❌ Error running accuracy validation:', error);
        process.exit(1);
    }
}
// Run CLI if this file is executed directly
if (require.main === module) {
    main().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=accuracy-validate.js.map