"use strict";
/**
 * Example Usage of Advanced Release Analysis CLI
 *
 * Demonstrates the enhanced CLI features including interactive mode,
 * configuration management, and analysis history.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleInteractiveAnalysis = exampleInteractiveAnalysis;
exports.exampleDryRunPreview = exampleDryRunPreview;
exports.exampleConfigurationManagement = exampleConfigurationManagement;
exports.exampleHistoryManagement = exampleHistoryManagement;
exports.exampleAdvancedWorkflow = exampleAdvancedWorkflow;
exports.exampleCommandLineUsage = exampleCommandLineUsage;
exports.runAllExamples = runAllExamples;
var AdvancedReleaseCLI_1 = require("./AdvancedReleaseCLI");
/**
 * Example: Basic analysis with interactive mode
 */
function exampleInteractiveAnalysis() {
    return __awaiter(this, void 0, void 0, function () {
        var cli, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('=== Example: Interactive Analysis ===\n');
                    cli = new AdvancedReleaseCLI_1.AdvancedReleaseCLI();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, cli.analyzeChanges({
                            interactive: true,
                            outputFormat: 'detailed',
                            reviewThreshold: 0.8
                        })];
                case 2:
                    result = _a.sent();
                    console.log('Analysis completed successfully!');
                    console.log("Version recommendation: ".concat(result.versionRecommendation.recommendedVersion));
                    console.log("Confidence: ".concat((result.confidence.overall * 100).toFixed(1), "%"));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Analysis failed:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Example: Dry-run preview
 */
function exampleDryRunPreview() {
    return __awaiter(this, void 0, void 0, function () {
        var cli, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('=== Example: Dry-run Preview ===\n');
                    cli = new AdvancedReleaseCLI_1.AdvancedReleaseCLI();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, cli.analyzeChanges({
                            dryRun: true,
                            since: 'v1.0.0',
                            skipConfirmation: true
                        })];
                case 2:
                    result = _a.sent();
                    console.log('Dry-run completed successfully!');
                    console.log("Documents found: ".concat(result.scope.completionDocuments.length));
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Dry-run failed:', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Example: Configuration management
 */
function exampleConfigurationManagement() {
    return __awaiter(this, void 0, void 0, function () {
        var cli, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('=== Example: Configuration Management ===\n');
                    cli = new AdvancedReleaseCLI_1.AdvancedReleaseCLI();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    // Show current configuration
                    console.log('Current configuration:');
                    return [4 /*yield*/, cli.manageConfiguration({ show: true })];
                case 2:
                    _a.sent();
                    // Validate configuration
                    console.log('\nValidating configuration:');
                    return [4 /*yield*/, cli.manageConfiguration({ validate: true })];
                case 3:
                    _a.sent();
                    // Set a configuration value
                    console.log('\nUpdating confidence threshold:');
                    return [4 /*yield*/, cli.manageConfiguration({
                            set: {
                                key: 'extraction.confidenceThresholds.minimumConfidence',
                                value: '0.7'
                            }
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error('Configuration management failed:', error_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Example: Analysis history management
 */
function exampleHistoryManagement() {
    return __awaiter(this, void 0, void 0, function () {
        var cli, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('=== Example: History Management ===\n');
                    cli = new AdvancedReleaseCLI_1.AdvancedReleaseCLI();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // List analysis history
                    console.log('Analysis history:');
                    return [4 /*yield*/, cli.manageHistory({ list: true })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error('History management failed:', error_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Example: Advanced workflow with all features
 */
function exampleAdvancedWorkflow() {
    return __awaiter(this, void 0, void 0, function () {
        var cli, result, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('=== Example: Advanced Workflow ===\n');
                    cli = new AdvancedReleaseCLI_1.AdvancedReleaseCLI();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    // Step 1: Validate configuration
                    console.log('Step 1: Validating configuration...');
                    return [4 /*yield*/, cli.manageConfiguration({ validate: true })];
                case 2:
                    _a.sent();
                    // Step 2: Preview analysis
                    console.log('\nStep 2: Previewing analysis...');
                    return [4 /*yield*/, cli.analyzeChanges({
                            dryRun: true,
                            outputFormat: 'summary'
                        })];
                case 3:
                    _a.sent();
                    // Step 3: Run full analysis with interactive mode
                    console.log('\nStep 3: Running full analysis...');
                    return [4 /*yield*/, cli.analyzeChanges({
                            interactive: true,
                            outputFormat: 'detailed',
                            autoApprove: false,
                            reviewThreshold: 0.8
                        })];
                case 4:
                    result = _a.sent();
                    // Step 4: Display results
                    console.log('\nStep 4: Analysis results:');
                    cli.showSummaryReport(result);
                    // Step 5: Check history
                    console.log('\nStep 5: Updated history:');
                    return [4 /*yield*/, cli.manageHistory({ list: true })];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_5 = _a.sent();
                    console.error('Advanced workflow failed:', error_5);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Example: Command-line argument simulation
 */
function exampleCommandLineUsage() {
    return __awaiter(this, void 0, void 0, function () {
        var cli, scenarios, _i, scenarios_1, args, parsed;
        return __generator(this, function (_a) {
            console.log('=== Example: Command-line Usage Simulation ===\n');
            cli = new AdvancedReleaseCLI_1.AdvancedReleaseCLI();
            scenarios = [
                // Basic analysis
                ['analyze', '--format', 'summary'],
                // Interactive analysis with dry-run
                ['analyze', '--interactive', '--dry-run', '--format', 'detailed'],
                // Configuration management
                ['config', '--config-show'],
                // History management
                ['history', '--history-list'],
                // Advanced options
                ['analyze', '--since', 'v1.0.0', '--interactive', '--review-threshold', '0.8']
            ];
            for (_i = 0, scenarios_1 = scenarios; _i < scenarios_1.length; _i++) {
                args = scenarios_1[_i];
                console.log("\nSimulating: npm run release:analyze ".concat(args.join(' ')));
                try {
                    parsed = cli.parseAdvancedArguments(args);
                    console.log("  Command: ".concat(parsed.command));
                    console.log("  Options: ".concat(JSON.stringify(parsed.options, null, 2)));
                    // Note: In a real scenario, you would call cli.run(args)
                    // but that would actually execute the commands
                }
                catch (error) {
                    console.error("  Error: ".concat(error));
                }
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Run all examples
 */
function runAllExamples() {
    return __awaiter(this, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 Advanced Release Analysis CLI Examples\n');
                    console.log('This demonstrates the enhanced CLI features.\n');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, exampleCommandLineUsage()];
                case 2:
                    _a.sent();
                    // Uncomment to run interactive examples (requires actual setup):
                    // await exampleConfigurationManagement();
                    // await exampleHistoryManagement();
                    // await exampleDryRunPreview();
                    // await exampleInteractiveAnalysis();
                    // await exampleAdvancedWorkflow();
                    console.log('\n✅ All examples completed successfully!');
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    console.error('\n❌ Examples failed:', error_6);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Run examples if this file is executed directly
if (require.main === module) {
    runAllExamples().catch(console.error);
}
