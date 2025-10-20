#!/usr/bin/env node
"use strict";
/**
 * Advanced Release Analysis CLI
 *
 * Enhanced command-line interface with interactive features, configuration management,
 * analysis history, and advanced workflow capabilities.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AdvancedReleaseCLI = void 0;
exports.runAdvancedAnalysisCli = main;
var fs_1 = require("fs");
var path = require("path");
var readline = require("readline");
var ErrorHandler_1 = require("../errors/ErrorHandler");
var AnalysisConfig_1 = require("../config/AnalysisConfig");
/**
 * Advanced CLI class with interactive features
 */
var AdvancedReleaseCLI = /** @class */ (function () {
    function AdvancedReleaseCLI(workingDirectory) {
        if (workingDirectory === void 0) { workingDirectory = process.cwd(); }
        this.workingDirectory = workingDirectory;
        this.configPath = path.join(workingDirectory, '.kiro/release-config.json');
        this.historyPath = path.join(workingDirectory, '.kiro/release-analysis/history.json');
        this.config = AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG;
        // Initialize readline interface for interactive features
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    /**
     * Enhanced analyze command with interactive features
     */
    AdvancedReleaseCLI.prototype.analyzeChanges = function () {
        return __awaiter(this, arguments, void 0, function (options) {
            var startTime, context, result, errorReport;
            var _this = this;
            var _a;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('🔍 Starting enhanced release analysis...\n');
                        startTime = Date.now();
                        // Load configuration
                        return [4 /*yield*/, this.loadConfiguration()];
                    case 1:
                        // Load configuration
                        _b.sent();
                        // Clear previous error history for new analysis
                        ErrorHandler_1.releaseAnalysisErrorHandler.clearErrorHistory();
                        context = {
                            operation: 'analyzeChanges',
                            component: 'AdvancedReleaseCLI',
                            userAction: 'Running enhanced release analysis',
                            timestamp: new Date()
                        };
                        return [4 /*yield*/, (0, ErrorHandler_1.withErrorHandling)(function () { return __awaiter(_this, void 0, void 0, function () {
                                var preview, proceed, analysisScope, extractor, extractedChanges, versionCalculator, currentVersion, versionRecommendation, confirm_1, override, noteGenerator, releaseNotes, confidence, analysisResult, duration;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!options.dryRun) return [3 /*break*/, 3];
                                            console.log('🔍 Dry-run mode: Previewing analysis scope...\n');
                                            return [4 /*yield*/, this.previewAnalysis(options)];
                                        case 1:
                                            preview = _a.sent();
                                            this.showAnalysisPreview(preview);
                                            if (!!options.skipConfirmation) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.promptUser('Continue with full analysis? (y/n): ')];
                                        case 2:
                                            proceed = _a.sent();
                                            if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
                                                console.log('Analysis cancelled by user.');
                                                return [2 /*return*/, this.createEmptyResult()];
                                            }
                                            _a.label = 3;
                                        case 3:
                                            // Step 1: Determine analysis scope
                                            console.log('🎯 Determining analysis scope...');
                                            return [4 /*yield*/, this.determineAnalysisScope(options)];
                                        case 4:
                                            analysisScope = _a.sent();
                                            console.log("\uD83D\uDCC4 Found ".concat(analysisScope.completionDocuments.length, " completion documents"));
                                            // Step 2: Extract changes
                                            console.log('🔍 Extracting changes...');
                                            return [4 /*yield*/, Promise.resolve().then(function () { return require('../extraction/SimpleChangeExtractor'); })];
                                        case 5:
                                            extractor = new (_a.sent()).SimpleChangeExtractor(this.config.extraction);
                                            return [4 /*yield*/, extractor.extractChanges(analysisScope.completionDocuments)];
                                        case 6:
                                            extractedChanges = _a.sent();
                                            if (!(options.interactive && extractedChanges.metadata.ambiguousItems.length > 0)) return [3 /*break*/, 8];
                                            console.log('\n🤔 Found uncertain changes requiring review...');
                                            return [4 /*yield*/, this.interactiveReview(extractedChanges, options)];
                                        case 7:
                                            _a.sent();
                                            _a.label = 8;
                                        case 8:
                                            // Step 4: Calculate version recommendation
                                            console.log('🏷️  Calculating version recommendation...');
                                            return [4 /*yield*/, Promise.resolve().then(function () { return require('../versioning/VersionCalculator'); })];
                                        case 9:
                                            versionCalculator = new (_a.sent()).VersionCalculator();
                                            return [4 /*yield*/, this.getCurrentVersion()];
                                        case 10:
                                            currentVersion = _a.sent();
                                            versionRecommendation = versionCalculator.calculateVersionBump(extractedChanges, currentVersion);
                                            if (!(versionRecommendation.bumpType === 'major' && !options.skipConfirmation)) return [3 /*break*/, 13];
                                            console.log('\n⚠️  Major version bump detected!');
                                            console.log("   ".concat(versionRecommendation.currentVersion, " \u2192 ").concat(versionRecommendation.recommendedVersion));
                                            console.log("   Rationale: ".concat(versionRecommendation.rationale));
                                            return [4 /*yield*/, this.promptUser('Confirm major version bump? (y/n): ')];
                                        case 11:
                                            confirm_1 = _a.sent();
                                            if (!(confirm_1.toLowerCase() !== 'y' && confirm_1.toLowerCase() !== 'yes')) return [3 /*break*/, 13];
                                            return [4 /*yield*/, this.promptVersionOverride(versionRecommendation)];
                                        case 12:
                                            override = _a.sent();
                                            if (override) {
                                                Object.assign(versionRecommendation, override);
                                            }
                                            _a.label = 13;
                                        case 13:
                                            // Step 6: Generate release notes
                                            console.log('📝 Generating release notes...');
                                            return [4 /*yield*/, Promise.resolve().then(function () { return require('../notes/ReleaseNoteGenerator'); })];
                                        case 14:
                                            noteGenerator = new (_a.sent()).ReleaseNoteGenerator();
                                            return [4 /*yield*/, noteGenerator.generateReleaseNotes(extractedChanges, versionRecommendation.recommendedVersion)];
                                        case 15:
                                            releaseNotes = _a.sent();
                                            confidence = this.calculateConfidenceMetrics(extractedChanges, versionRecommendation);
                                            analysisResult = {
                                                scope: analysisScope,
                                                changes: extractedChanges,
                                                versionRecommendation: versionRecommendation,
                                                releaseNotes: releaseNotes,
                                                confidence: confidence
                                            };
                                            duration = Date.now() - startTime;
                                            return [4 /*yield*/, this.saveToHistory(analysisResult, options, duration)];
                                        case 16:
                                            _a.sent();
                                            return [2 /*return*/, analysisResult];
                                    }
                                });
                            }); }, context)];
                    case 2:
                        result = _b.sent();
                        if (result.success) {
                            console.log('✅ Enhanced analysis complete!\n');
                            errorReport = ErrorHandler_1.releaseAnalysisErrorHandler.getFormattedErrorReport();
                            if (errorReport !== '✅ No errors encountered during analysis') {
                                console.log(errorReport);
                            }
                            return [2 /*return*/, result.data];
                        }
                        else {
                            console.error('❌ Analysis failed with critical errors:');
                            console.error(ErrorHandler_1.releaseAnalysisErrorHandler.getFormattedErrorReport());
                            // Return a minimal result to allow CLI to continue
                            return [2 /*return*/, this.createFallbackResult(((_a = result.error) === null || _a === void 0 ? void 0 : _a.message) || 'Analysis failed')];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Interactive review of uncertain changes
     */
    AdvancedReleaseCLI.prototype.interactiveReview = function (changes, options) {
        return __awaiter(this, void 0, void 0, function () {
            var reviewThreshold, i, item, action, _a, newDescription, _i, _b, duplicate, action;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log('\n📋 Interactive Review Mode');
                        console.log('='.repeat(40));
                        reviewThreshold = options.reviewThreshold || this.config.extraction.confidenceThresholds.reviewThreshold;
                        if (!(changes.metadata.ambiguousItems.length > 0)) return [3 /*break*/, 9];
                        console.log("\n\u26A0\uFE0F  Found ".concat(changes.metadata.ambiguousItems.length, " ambiguous items:"));
                        i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(i < changes.metadata.ambiguousItems.length)) return [3 /*break*/, 9];
                        item = changes.metadata.ambiguousItems[i];
                        console.log("\n".concat(i + 1, ". ").concat(item));
                        if (!!options.autoApprove) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.promptUser('Action (k)eep, (r)emove, (e)dit, (s)kip: ')];
                    case 2:
                        action = _d.sent();
                        _a = action.toLowerCase();
                        switch (_a) {
                            case 'k': return [3 /*break*/, 3];
                            case 'keep': return [3 /*break*/, 3];
                            case 'r': return [3 /*break*/, 4];
                            case 'remove': return [3 /*break*/, 4];
                            case 'e': return [3 /*break*/, 5];
                            case 'edit': return [3 /*break*/, 5];
                            case 's': return [3 /*break*/, 7];
                            case 'skip': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 7];
                    case 3:
                        console.log('   ✅ Keeping item');
                        return [3 /*break*/, 8];
                    case 4:
                        console.log('   ❌ Removing item');
                        changes.metadata.ambiguousItems.splice(i, 1);
                        i--; // Adjust index after removal
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, this.promptUser('   New description: ')];
                    case 6:
                        newDescription = _d.sent();
                        changes.metadata.ambiguousItems[i] = newDescription;
                        console.log('   ✏️  Updated item');
                        return [3 /*break*/, 8];
                    case 7:
                        console.log('   ⏭️  Skipping item');
                        return [3 /*break*/, 8];
                    case 8:
                        i++;
                        return [3 /*break*/, 1];
                    case 9:
                        if (!((_c = changes.metadata.deduplication) === null || _c === void 0 ? void 0 : _c.uncertainDuplicates)) return [3 /*break*/, 13];
                        console.log("\n\uD83D\uDD04 Found ".concat(changes.metadata.deduplication.uncertainDuplicates.length, " uncertain duplicates:"));
                        _i = 0, _b = changes.metadata.deduplication.uncertainDuplicates;
                        _d.label = 10;
                    case 10:
                        if (!(_i < _b.length)) return [3 /*break*/, 13];
                        duplicate = _b[_i];
                        console.log("\n\uD83D\uDCDD ".concat(duplicate.changeType, " - Similarity: ").concat((duplicate.similarity * 100).toFixed(1), "%"));
                        console.log("   Items: ".concat(duplicate.items.map(function (item) { return item.title; }).join(', ')));
                        console.log("   Suggested: ".concat(duplicate.suggestedAction));
                        if (!!options.autoApprove) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.promptUser('Action (m)erge, (s)eparate, (r)eview later: ')];
                    case 11:
                        action = _d.sent();
                        switch (action.toLowerCase()) {
                            case 'm':
                            case 'merge':
                                console.log('   🔗 Merging items');
                                // Implementation would merge the duplicate items
                                break;
                            case 's':
                            case 'separate':
                                console.log('   📋 Keeping items separate');
                                break;
                            case 'r':
                            case 'review':
                            default:
                                console.log('   ⏳ Flagged for later review');
                                break;
                        }
                        _d.label = 12;
                    case 12:
                        _i++;
                        return [3 /*break*/, 10];
                    case 13:
                        console.log('\n✅ Interactive review complete');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Preview analysis scope without full extraction
     */
    AdvancedReleaseCLI.prototype.previewAnalysis = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var gitAnalyzer, analysisScope, changes, documents, lastRelease, changes, documents, allDocuments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('../git/GitHistoryAnalyzer'); })];
                    case 1:
                        gitAnalyzer = new (_a.sent()).GitHistoryAnalyzer(this.workingDirectory);
                        if (!options.since) return [3 /*break*/, 4];
                        return [4 /*yield*/, gitAnalyzer.getChangesSince(options.since)];
                    case 2:
                        changes = _a.sent();
                        return [4 /*yield*/, gitAnalyzer.findCompletionDocuments(changes)];
                    case 3:
                        documents = _a.sent();
                        analysisScope = {
                            fromTag: options.since,
                            toCommit: 'HEAD',
                            completionDocuments: documents,
                            analysisDate: new Date()
                        };
                        return [3 /*break*/, 10];
                    case 4: return [4 /*yield*/, gitAnalyzer.findLastRelease()];
                    case 5:
                        lastRelease = _a.sent();
                        if (!lastRelease) return [3 /*break*/, 8];
                        return [4 /*yield*/, gitAnalyzer.getChangesSince(lastRelease.name)];
                    case 6:
                        changes = _a.sent();
                        return [4 /*yield*/, gitAnalyzer.findCompletionDocuments(changes)];
                    case 7:
                        documents = _a.sent();
                        analysisScope = {
                            fromTag: lastRelease.name,
                            toCommit: 'HEAD',
                            completionDocuments: documents,
                            analysisDate: new Date()
                        };
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, this.findAllCompletionDocuments()];
                    case 9:
                        allDocuments = _a.sent();
                        analysisScope = {
                            toCommit: 'HEAD',
                            completionDocuments: allDocuments,
                            analysisDate: new Date()
                        };
                        _a.label = 10;
                    case 10: return [2 /*return*/, analysisScope];
                }
            });
        });
    };
    /**
     * Show analysis preview
     */
    AdvancedReleaseCLI.prototype.showAnalysisPreview = function (scope) {
        console.log('📋 Analysis Preview');
        console.log('='.repeat(30));
        console.log("From: ".concat(scope.fromTag || scope.fromCommit || 'Repository start'));
        console.log("To: ".concat(scope.toCommit));
        console.log("Documents to analyze: ".concat(scope.completionDocuments.length));
        if (scope.completionDocuments.length > 0) {
            console.log('\nDocuments:');
            scope.completionDocuments.forEach(function (doc, index) {
                console.log("  ".concat(index + 1, ". ").concat(doc.path, " (").concat(doc.metadata.type, ")"));
            });
        }
        console.log('');
    };
    /**
     * Configuration management commands
     */
    AdvancedReleaseCLI.prototype.manageConfiguration = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.show) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.showConfiguration()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 2:
                        if (!options.set) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.setConfigurationValue(options.set.key, options.set.value)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 4:
                        if (!options.reset) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.resetConfiguration()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        if (!options.validate) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.validateConfiguration()];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        console.log('Configuration management options:');
                        console.log('  --config-show          Show current configuration');
                        console.log('  --config-set key=value Set configuration value');
                        console.log('  --config-reset         Reset to default configuration');
                        console.log('  --config-validate      Validate configuration');
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Show current configuration
     */
    AdvancedReleaseCLI.prototype.showConfiguration = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('📋 Current Configuration');
                console.log('='.repeat(40));
                console.log(JSON.stringify(this.config, null, 2));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Set configuration value
     */
    AdvancedReleaseCLI.prototype.setConfigurationValue = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, current, i, finalKey, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        keys = key.split('.');
                        current = this.config;
                        // Navigate to parent object
                        for (i = 0; i < keys.length - 1; i++) {
                            if (!(keys[i] in current)) {
                                throw new Error("Configuration key not found: ".concat(keys.slice(0, i + 1).join('.')));
                            }
                            current = current[keys[i]];
                        }
                        finalKey = keys[keys.length - 1];
                        if (!(finalKey in current)) {
                            throw new Error("Configuration key not found: ".concat(key));
                        }
                        // Type conversion
                        if (typeof current[finalKey] === 'number') {
                            current[finalKey] = parseFloat(value);
                        }
                        else if (typeof current[finalKey] === 'boolean') {
                            current[finalKey] = value === 'true' || value === true;
                        }
                        else {
                            current[finalKey] = value;
                        }
                        // Save configuration
                        return [4 /*yield*/, this.saveConfiguration()];
                    case 1:
                        // Save configuration
                        _a.sent();
                        console.log("\u2705 Configuration updated: ".concat(key, " = ").concat(value));
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("\u274C Error setting configuration: ".concat(error_1));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reset configuration to defaults
     */
    AdvancedReleaseCLI.prototype.resetConfiguration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var confirm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.promptUser('Reset configuration to defaults? (y/n): ')];
                    case 1:
                        confirm = _a.sent();
                        if (!(confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes')) return [3 /*break*/, 3];
                        this.config = __assign({}, AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG);
                        return [4 /*yield*/, this.saveConfiguration()];
                    case 2:
                        _a.sent();
                        console.log('✅ Configuration reset to defaults');
                        return [3 /*break*/, 4];
                    case 3:
                        console.log('Configuration reset cancelled');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate configuration
     */
    AdvancedReleaseCLI.prototype.validateConfiguration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var errors, warnings, thresholds, outputDir, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('🔍 Validating configuration...');
                        errors = [];
                        warnings = [];
                        thresholds = this.config.extraction.confidenceThresholds;
                        if (thresholds.minimumConfidence < 0 || thresholds.minimumConfidence > 1) {
                            errors.push('minimumConfidence must be between 0 and 1');
                        }
                        if (thresholds.uncertaintyThreshold < 0 || thresholds.uncertaintyThreshold > 1) {
                            errors.push('uncertaintyThreshold must be between 0 and 1');
                        }
                        if (thresholds.reviewThreshold < 0 || thresholds.reviewThreshold > 1) {
                            errors.push('reviewThreshold must be between 0 and 1');
                        }
                        // Validate patterns
                        if (this.config.extraction.completionPatterns.length === 0) {
                            warnings.push('No completion patterns defined');
                        }
                        outputDir = this.config.reporting.outputFiles.outputDirectory;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_1.promises.access(path.dirname(outputDir))];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        warnings.push("Output directory parent does not exist: ".concat(outputDir));
                        return [3 /*break*/, 4];
                    case 4:
                        // Report results
                        if (errors.length === 0 && warnings.length === 0) {
                            console.log('✅ Configuration is valid');
                        }
                        else {
                            if (errors.length > 0) {
                                console.log('❌ Configuration errors:');
                                errors.forEach(function (error) { return console.log("  - ".concat(error)); });
                            }
                            if (warnings.length > 0) {
                                console.log('⚠️  Configuration warnings:');
                                warnings.forEach(function (warning) { return console.log("  - ".concat(warning)); });
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Analysis history management
     */
    AdvancedReleaseCLI.prototype.manageHistory = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.list) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.listAnalysisHistory()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 2:
                        if (!options.compare) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.compareWithHistory(options.compare)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 4:
                        if (!options.show) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.showHistoryEntry(options.show)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        if (!options.clear) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.clearAnalysisHistory()];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        console.log('History management options:');
                        console.log('  --history-list         List previous analyses');
                        console.log('  --history-compare <id> Compare with previous analysis');
                        console.log('  --history-show <id>    Show analysis details');
                        console.log('  --history-clear        Clear analysis history');
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List analysis history
     */
    AdvancedReleaseCLI.prototype.listAnalysisHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var history_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.loadAnalysisHistory()];
                    case 1:
                        history_1 = _a.sent();
                        if (history_1.length === 0) {
                            console.log('📋 No analysis history found');
                            return [2 /*return*/];
                        }
                        console.log('📋 Analysis History');
                        console.log('='.repeat(50));
                        history_1.forEach(function (entry, index) {
                            var date = new Date(entry.timestamp).toLocaleString();
                            var version = entry.result.versionRecommendation.recommendedVersion;
                            var changes = entry.result.changes.breakingChanges.length +
                                entry.result.changes.newFeatures.length +
                                entry.result.changes.bugFixes.length +
                                entry.result.changes.improvements.length;
                            console.log("".concat(index + 1, ". ").concat(entry.id));
                            console.log("   Date: ".concat(date));
                            console.log("   Version: ".concat(version));
                            console.log("   Changes: ".concat(changes));
                            console.log("   Duration: ".concat(entry.duration, "ms"));
                            console.log('');
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("\u274C Error loading history: ".concat(error_2));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Compare current analysis with historical entry
     */
    AdvancedReleaseCLI.prototype.compareWithHistory = function (historyId) {
        return __awaiter(this, void 0, void 0, function () {
            var history_2, previousEntry, currentResult, comparison, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.loadAnalysisHistory()];
                    case 1:
                        history_2 = _a.sent();
                        previousEntry = history_2.find(function (entry) { return entry.id === historyId; });
                        if (!previousEntry) {
                            console.error("\u274C History entry not found: ".concat(historyId));
                            return [2 /*return*/];
                        }
                        // Run current analysis
                        console.log('🔍 Running current analysis for comparison...');
                        return [4 /*yield*/, this.analyzeChanges({ skipConfirmation: true })];
                    case 2:
                        currentResult = _a.sent();
                        comparison = this.createComparison(previousEntry, currentResult);
                        this.showComparison(comparison);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error("\u274C Error comparing with history: ".concat(error_3));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Show detailed history entry
     */
    AdvancedReleaseCLI.prototype.showHistoryEntry = function (historyId) {
        return __awaiter(this, void 0, void 0, function () {
            var history_3, entry, changes, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.loadAnalysisHistory()];
                    case 1:
                        history_3 = _a.sent();
                        entry = history_3.find(function (h) { return h.id === historyId; });
                        if (!entry) {
                            console.error("\u274C History entry not found: ".concat(historyId));
                            return [2 /*return*/];
                        }
                        console.log("\uD83D\uDCCB Analysis Details: ".concat(entry.id));
                        console.log('='.repeat(50));
                        console.log("Date: ".concat(new Date(entry.timestamp).toLocaleString()));
                        console.log("Duration: ".concat(entry.duration, "ms"));
                        console.log("Version: ".concat(entry.result.versionRecommendation.recommendedVersion));
                        console.log("Confidence: ".concat((entry.result.confidence.overall * 100).toFixed(1), "%"));
                        console.log('');
                        changes = entry.result.changes;
                        console.log('Changes:');
                        console.log("  Breaking: ".concat(changes.breakingChanges.length));
                        console.log("  Features: ".concat(changes.newFeatures.length));
                        console.log("  Bug Fixes: ".concat(changes.bugFixes.length));
                        console.log("  Improvements: ".concat(changes.improvements.length));
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error("\u274C Error showing history entry: ".concat(error_4));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clear analysis history
     */
    AdvancedReleaseCLI.prototype.clearAnalysisHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var confirm, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.promptUser('Clear all analysis history? (y/n): ')];
                    case 1:
                        confirm = _a.sent();
                        if (!(confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes')) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs_1.promises.unlink(this.historyPath)];
                    case 3:
                        _a.sent();
                        console.log('✅ Analysis history cleared');
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        console.log('✅ No history to clear');
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        console.log('History clear cancelled');
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Enhanced argument parsing with advanced options
     */
    AdvancedReleaseCLI.prototype.parseAdvancedArguments = function (args) {
        var command = 'analyze';
        var options = {};
        var configOptions = {};
        var historyOptions = {};
        var i = 0;
        // Check for help/version flags first
        if (args.includes('--help') || args.includes('-h')) {
            return { command: 'help', options: options, configOptions: configOptions, historyOptions: historyOptions };
        }
        if (args.includes('--version') || args.includes('-v')) {
            return { command: 'version', options: options, configOptions: configOptions, historyOptions: historyOptions };
        }
        // Check if first argument is a command
        if (args.length > 0 && !args[0].startsWith('--')) {
            var possibleCommand = args[0];
            if (['analyze', 'config', 'history', 'help', 'version'].includes(possibleCommand)) {
                command = possibleCommand;
                i = 1;
            }
        }
        // Parse options
        while (i < args.length) {
            var arg = args[i];
            switch (arg) {
                // Basic analysis options
                case '--since':
                    if (i + 1 < args.length)
                        options.since = args[++i];
                    break;
                case '--format':
                    if (i + 1 < args.length) {
                        var format = args[++i];
                        if (['summary', 'detailed', 'json'].includes(format)) {
                            options.outputFormat = format;
                        }
                    }
                    break;
                case '--dry-run':
                    options.dryRun = true;
                    break;
                case '--include':
                    if (i + 1 < args.length)
                        options.includePatterns = args[++i].split(',');
                    break;
                case '--exclude':
                    if (i + 1 < args.length)
                        options.excludePatterns = args[++i].split(',');
                    break;
                // Interactive options
                case '--interactive':
                case '-i':
                    options.interactive = true;
                    break;
                case '--auto-approve':
                    options.autoApprove = true;
                    break;
                case '--skip-confirmation':
                    options.skipConfirmation = true;
                    break;
                case '--review-threshold':
                    if (i + 1 < args.length)
                        options.reviewThreshold = parseFloat(args[++i]);
                    break;
                // Configuration options
                case '--config-show':
                    configOptions.show = true;
                    break;
                case '--config-set':
                    if (i + 1 < args.length) {
                        var _a = args[++i].split('='), key = _a[0], value = _a[1];
                        configOptions.set = { key: key, value: value };
                    }
                    break;
                case '--config-reset':
                    configOptions.reset = true;
                    break;
                case '--config-validate':
                    configOptions.validate = true;
                    break;
                case '--config-path':
                    if (i + 1 < args.length)
                        configOptions.configPath = args[++i];
                    break;
                // History options
                case '--history-list':
                    historyOptions.list = true;
                    break;
                case '--history-compare':
                    if (i + 1 < args.length)
                        historyOptions.compare = args[++i];
                    break;
                case '--history-show':
                    if (i + 1 < args.length)
                        historyOptions.show = args[++i];
                    break;
                case '--history-clear':
                    historyOptions.clear = true;
                    break;
            }
            i++;
        }
        return { command: command, options: options, configOptions: configOptions, historyOptions: historyOptions };
    };
    /**
     * Enhanced main CLI entry point
     */
    AdvancedReleaseCLI.prototype.run = function () {
        return __awaiter(this, arguments, void 0, function (args) {
            var _a, command, options, configOptions, historyOptions, _b, result, error_6;
            if (args === void 0) { args = process.argv.slice(2); }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 11, 12, 13]);
                        _a = this.parseAdvancedArguments(args), command = _a.command, options = _a.options, configOptions = _a.configOptions, historyOptions = _a.historyOptions;
                        _b = command;
                        switch (_b) {
                            case 'help': return [3 /*break*/, 1];
                            case 'analyze': return [3 /*break*/, 2];
                            case 'config': return [3 /*break*/, 4];
                            case 'history': return [3 /*break*/, 6];
                            case 'version': return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 9];
                    case 1:
                        this.showAdvancedHelp();
                        return [3 /*break*/, 10];
                    case 2: return [4 /*yield*/, this.analyzeChanges(options)];
                    case 3:
                        result = _c.sent();
                        switch (options.outputFormat || 'summary') {
                            case 'detailed':
                                this.showDetailedReport(result);
                                break;
                            case 'json':
                                this.showJSONReport(result);
                                break;
                            case 'summary':
                            default:
                                this.showSummaryReport(result);
                                break;
                        }
                        return [3 /*break*/, 10];
                    case 4: return [4 /*yield*/, this.manageConfiguration(configOptions)];
                    case 5:
                        _c.sent();
                        return [3 /*break*/, 10];
                    case 6: return [4 /*yield*/, this.manageHistory(historyOptions)];
                    case 7:
                        _c.sent();
                        return [3 /*break*/, 10];
                    case 8:
                        console.log('Advanced Release Analysis CLI v1.0.0');
                        return [3 /*break*/, 10];
                    case 9:
                        console.error("\u274C Unknown command: ".concat(command));
                        this.showAdvancedHelp();
                        process.exit(1);
                        _c.label = 10;
                    case 10: return [3 /*break*/, 13];
                    case 11:
                        error_6 = _c.sent();
                        console.error('❌ Error:', error_6);
                        process.exit(1);
                        return [3 /*break*/, 13];
                    case 12:
                        this.rl.close();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    // Helper methods (implementation details)
    AdvancedReleaseCLI.prototype.determineAnalysisScope = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var gitAnalyzer, changes, documents, lastRelease, changes, documents, allDocuments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('../git/GitHistoryAnalyzer'); })];
                    case 1:
                        gitAnalyzer = new (_a.sent()).GitHistoryAnalyzer(this.workingDirectory);
                        if (!options.since) return [3 /*break*/, 4];
                        return [4 /*yield*/, gitAnalyzer.getChangesSince(options.since)];
                    case 2:
                        changes = _a.sent();
                        return [4 /*yield*/, gitAnalyzer.findCompletionDocuments(changes)];
                    case 3:
                        documents = _a.sent();
                        return [2 /*return*/, {
                                fromTag: options.since,
                                toCommit: 'HEAD',
                                completionDocuments: documents,
                                analysisDate: new Date()
                            }];
                    case 4: return [4 /*yield*/, gitAnalyzer.findLastRelease()];
                    case 5:
                        lastRelease = _a.sent();
                        if (!lastRelease) return [3 /*break*/, 8];
                        return [4 /*yield*/, gitAnalyzer.getChangesSince(lastRelease.name)];
                    case 6:
                        changes = _a.sent();
                        return [4 /*yield*/, gitAnalyzer.findCompletionDocuments(changes)];
                    case 7:
                        documents = _a.sent();
                        return [2 /*return*/, {
                                fromTag: lastRelease.name,
                                toCommit: 'HEAD',
                                completionDocuments: documents,
                                analysisDate: new Date()
                            }];
                    case 8: return [4 /*yield*/, this.findAllCompletionDocuments()];
                    case 9:
                        allDocuments = _a.sent();
                        return [2 /*return*/, {
                                toCommit: 'HEAD',
                                completionDocuments: allDocuments,
                                analysisDate: new Date()
                            }];
                }
            });
        });
    };
    AdvancedReleaseCLI.prototype.findAllCompletionDocuments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var collector, completionPaths, glob, _loop_1, _i, _a, pattern, collectionResult;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('../collection/CompletionDocumentCollector'); })];
                    case 1:
                        collector = new (_b.sent()).CompletionDocumentCollector(this.workingDirectory, this.config);
                        completionPaths = [];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('glob'); })];
                    case 2:
                        glob = (_b.sent()).glob;
                        _loop_1 = function (pattern) {
                            var matches, error_7;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                glob(pattern, { cwd: _this.workingDirectory }, function (err, files) {
                                                    if (err)
                                                        reject(err);
                                                    else
                                                        resolve(files);
                                                });
                                            })];
                                    case 1:
                                        matches = _c.sent();
                                        completionPaths.push.apply(completionPaths, matches);
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_7 = _c.sent();
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, _a = this.config.extraction.completionPatterns;
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        pattern = _a[_i];
                        return [5 /*yield**/, _loop_1(pattern)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [4 /*yield*/, collector.collectFromPaths(completionPaths)];
                    case 7:
                        collectionResult = _b.sent();
                        return [2 /*return*/, collectionResult.documents];
                }
            });
        });
    };
    AdvancedReleaseCLI.prototype.getCurrentVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var packagePath, packageContent, packageJson, _a, gitAnalyzer, lastRelease;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        packagePath = path.join(this.workingDirectory, 'package.json');
                        return [4 /*yield*/, fs_1.promises.readFile(packagePath, 'utf-8')];
                    case 1:
                        packageContent = _b.sent();
                        packageJson = JSON.parse(packageContent);
                        if (packageJson.version) {
                            return [2 /*return*/, packageJson.version];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 3: return [4 /*yield*/, Promise.resolve().then(function () { return require('../git/GitHistoryAnalyzer'); })];
                    case 4:
                        gitAnalyzer = new (_b.sent()).GitHistoryAnalyzer(this.workingDirectory);
                        return [4 /*yield*/, gitAnalyzer.findLastRelease()];
                    case 5:
                        lastRelease = _b.sent();
                        if (lastRelease) {
                            return [2 /*return*/, lastRelease.name.replace(/^v/, '')];
                        }
                        return [2 /*return*/, '0.0.0'];
                }
            });
        });
    };
    AdvancedReleaseCLI.prototype.calculateConfidenceMetrics = function (changes, versionRec) {
        var extractionConfidence = changes.metadata.extractionConfidence || 0.8;
        var versioningConfidence = versionRec.confidence || 0.9;
        var overall = (extractionConfidence + versioningConfidence) / 2;
        if (changes.metadata.ambiguousItems.length > 0) {
            overall *= 0.9;
        }
        if (changes.metadata.documentsAnalyzed === 0) {
            overall *= 0.5;
        }
        return {
            overall: Math.max(0, Math.min(1, overall)),
            extraction: extractionConfidence,
            categorization: extractionConfidence,
            deduplication: 0.95,
            versionCalculation: versioningConfidence
        };
    };
    AdvancedReleaseCLI.prototype.loadConfiguration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var configContent, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs_1.promises.readFile(this.configPath, 'utf-8')];
                    case 1:
                        configContent = _b.sent();
                        this.config = __assign(__assign({}, AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG), JSON.parse(configContent));
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        this.config = AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG;
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdvancedReleaseCLI.prototype.saveConfiguration = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_1.promises.mkdir(path.dirname(this.configPath), { recursive: true })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fs_1.promises.writeFile(this.configPath, JSON.stringify(this.config, null, 2), 'utf-8')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AdvancedReleaseCLI.prototype.loadAnalysisHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var historyContent, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs_1.promises.readFile(this.historyPath, 'utf-8')];
                    case 1:
                        historyContent = _b.sent();
                        return [2 /*return*/, JSON.parse(historyContent)];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdvancedReleaseCLI.prototype.saveToHistory = function (result, options, duration) {
        return __awaiter(this, void 0, void 0, function () {
            var history, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadAnalysisHistory()];
                    case 1:
                        history = _a.sent();
                        entry = {
                            id: "analysis-".concat(Date.now()),
                            timestamp: new Date(),
                            scope: result.scope,
                            result: result,
                            options: options,
                            duration: duration
                        };
                        history.unshift(entry);
                        // Keep only last 50 analyses
                        if (history.length > 50) {
                            history.splice(50);
                        }
                        return [4 /*yield*/, fs_1.promises.mkdir(path.dirname(this.historyPath), { recursive: true })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, fs_1.promises.writeFile(this.historyPath, JSON.stringify(history, null, 2), 'utf-8')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AdvancedReleaseCLI.prototype.createComparison = function (previous, current) {
        var prevChanges = previous.result.changes;
        var currChanges = current.changes;
        var prevTotal = prevChanges.breakingChanges.length + prevChanges.newFeatures.length +
            prevChanges.bugFixes.length + prevChanges.improvements.length;
        var currTotal = currChanges.breakingChanges.length + currChanges.newFeatures.length +
            currChanges.bugFixes.length + currChanges.improvements.length;
        return {
            previous: previous,
            current: current,
            differences: {
                versionChange: previous.result.versionRecommendation.recommendedVersion !== current.versionRecommendation.recommendedVersion,
                changeCountDifference: currTotal - prevTotal,
                newBreakingChanges: currChanges.breakingChanges.length - prevChanges.breakingChanges.length,
                newFeatures: currChanges.newFeatures.length - prevChanges.newFeatures.length,
                newBugFixes: currChanges.bugFixes.length - prevChanges.bugFixes.length,
                confidenceChange: current.confidence.overall - previous.result.confidence.overall
            }
        };
    };
    AdvancedReleaseCLI.prototype.showComparison = function (comparison) {
        console.log('📊 Analysis Comparison');
        console.log('='.repeat(40));
        var prev = comparison.previous.result;
        var curr = comparison.current;
        var diff = comparison.differences;
        console.log("Previous: ".concat(prev.versionRecommendation.recommendedVersion, " (").concat(new Date(comparison.previous.timestamp).toLocaleDateString(), ")"));
        console.log("Current:  ".concat(curr.versionRecommendation.recommendedVersion));
        if (diff.versionChange) {
            console.log('🔄 Version recommendation changed');
        }
        else {
            console.log('✅ Version recommendation unchanged');
        }
        console.log("\nChange count difference: ".concat(diff.changeCountDifference > 0 ? '+' : '').concat(diff.changeCountDifference));
        console.log("Breaking changes: ".concat(diff.newBreakingChanges > 0 ? '+' : '').concat(diff.newBreakingChanges));
        console.log("New features: ".concat(diff.newFeatures > 0 ? '+' : '').concat(diff.newFeatures));
        console.log("Bug fixes: ".concat(diff.newBugFixes > 0 ? '+' : '').concat(diff.newBugFixes));
        console.log("Confidence change: ".concat(diff.confidenceChange > 0 ? '+' : '').concat((diff.confidenceChange * 100).toFixed(1), "%"));
    };
    AdvancedReleaseCLI.prototype.promptUser = function (question) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.rl.question(question, function (answer) {
                            resolve(answer.trim());
                        });
                    })];
            });
        });
    };
    AdvancedReleaseCLI.prototype.promptVersionOverride = function (current) {
        return __awaiter(this, void 0, void 0, function () {
            var choice, minorVersion, patchVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\nVersion Override Options:');
                        console.log('1. Minor version bump');
                        console.log('2. Patch version bump');
                        console.log('3. Keep current recommendation');
                        return [4 /*yield*/, this.promptUser('Choose option (1-3): ')];
                    case 1:
                        choice = _a.sent();
                        switch (choice) {
                            case '1':
                                minorVersion = this.calculateMinorBump(current.currentVersion);
                                return [2 /*return*/, {
                                        recommendedVersion: minorVersion,
                                        bumpType: 'minor',
                                        rationale: 'User override: Changed from major to minor bump'
                                    }];
                            case '2':
                                patchVersion = this.calculatePatchBump(current.currentVersion);
                                return [2 /*return*/, {
                                        recommendedVersion: patchVersion,
                                        bumpType: 'patch',
                                        rationale: 'User override: Changed from major to patch bump'
                                    }];
                            default:
                                return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AdvancedReleaseCLI.prototype.calculateMinorBump = function (version) {
        var _a = version.split('.').map(Number), major = _a[0], minor = _a[1];
        return "".concat(major, ".").concat(minor + 1, ".0");
    };
    AdvancedReleaseCLI.prototype.calculatePatchBump = function (version) {
        var _a = version.split('.').map(Number), major = _a[0], minor = _a[1], patch = _a[2];
        return "".concat(major, ".").concat(minor, ".").concat(patch + 1);
    };
    AdvancedReleaseCLI.prototype.createEmptyResult = function () {
        return {
            scope: {
                toCommit: 'HEAD',
                completionDocuments: [],
                analysisDate: new Date()
            },
            changes: {
                breakingChanges: [],
                newFeatures: [],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 0,
                    extractionConfidence: 0,
                    ambiguousItems: [],
                    filteredItems: []
                }
            },
            versionRecommendation: {
                currentVersion: '0.0.0',
                recommendedVersion: '0.0.0',
                bumpType: 'none',
                rationale: 'Analysis cancelled by user',
                confidence: 0,
                evidence: []
            },
            releaseNotes: '# Analysis Cancelled\n\nAnalysis was cancelled by user during dry-run preview.',
            confidence: {
                overall: 0,
                extraction: 0,
                categorization: 0,
                deduplication: 0,
                versionCalculation: 0
            }
        };
    };
    AdvancedReleaseCLI.prototype.createFallbackResult = function (errorMessage) {
        return {
            scope: {
                toCommit: 'HEAD',
                completionDocuments: [],
                analysisDate: new Date()
            },
            changes: {
                breakingChanges: [],
                newFeatures: [],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 0,
                    extractionConfidence: 0,
                    ambiguousItems: ["Analysis failed: ".concat(errorMessage)],
                    filteredItems: []
                }
            },
            versionRecommendation: {
                currentVersion: '0.0.0',
                recommendedVersion: '0.0.0',
                bumpType: 'none',
                rationale: "Analysis failed: ".concat(errorMessage),
                confidence: 0,
                evidence: []
            },
            releaseNotes: "# Analysis Failed\n\n".concat(errorMessage, "\n\nPlease resolve the issues and try again."),
            confidence: {
                overall: 0,
                extraction: 0,
                categorization: 0,
                deduplication: 0,
                versionCalculation: 0
            }
        };
    };
    // Report display methods (reuse from basic CLI)
    AdvancedReleaseCLI.prototype.showDetailedReport = function (result) {
        console.log('📊 Detailed Analysis Report');
        console.log('='.repeat(50));
        // Analysis Scope
        console.log('\n📋 Analysis Scope:');
        console.log("  From: ".concat(result.scope.fromTag || result.scope.fromCommit || 'Repository start'));
        console.log("  To: ".concat(result.scope.toCommit));
        console.log("  Documents analyzed: ".concat(result.changes.metadata.documentsAnalyzed));
        console.log("  Analysis date: ".concat(result.scope.analysisDate.toISOString()));
        // Version Recommendation
        console.log('\n🏷️  Version Recommendation:');
        console.log("  Current: ".concat(result.versionRecommendation.currentVersion));
        console.log("  Recommended: ".concat(result.versionRecommendation.recommendedVersion));
        console.log("  Bump type: ".concat(result.versionRecommendation.bumpType));
        console.log("  Confidence: ".concat((result.versionRecommendation.confidence * 100).toFixed(1), "%"));
        console.log("  Rationale: ".concat(result.versionRecommendation.rationale));
        // Changes Summary
        console.log('\n📝 Changes Summary:');
        console.log("  Breaking changes: ".concat(result.changes.breakingChanges.length));
        console.log("  New features: ".concat(result.changes.newFeatures.length));
        console.log("  Bug fixes: ".concat(result.changes.bugFixes.length));
        console.log("  Improvements: ".concat(result.changes.improvements.length));
        console.log("  Documentation: ".concat(result.changes.documentation.length));
        // Confidence Metrics
        console.log('\n📈 Confidence Metrics:');
        console.log("  Overall: ".concat((result.confidence.overall * 100).toFixed(1), "%"));
        console.log("  Extraction: ".concat((result.confidence.extraction * 100).toFixed(1), "%"));
        console.log("  Categorization: ".concat((result.confidence.categorization * 100).toFixed(1), "%"));
        console.log("  Deduplication: ".concat((result.confidence.deduplication * 100).toFixed(1), "%"));
        console.log("  Version Calculation: ".concat((result.confidence.versionCalculation * 100).toFixed(1), "%"));
        // Evidence
        if (result.versionRecommendation.evidence.length > 0) {
            console.log('\n🔍 Evidence:');
            result.versionRecommendation.evidence.forEach(function (evidence, index) {
                console.log("  ".concat(index + 1, ". [").concat(evidence.type.toUpperCase(), "] ").concat(evidence.description));
                console.log("     Source: ".concat(evidence.source));
                console.log("     Impact: ".concat(evidence.impact));
            });
        }
        // Quality Indicators
        if (result.changes.metadata.ambiguousItems.length > 0) {
            console.log('\n⚠️  Items requiring review:');
            result.changes.metadata.ambiguousItems.forEach(function (item, index) {
                console.log("  ".concat(index + 1, ". ").concat(item));
            });
        }
        console.log('\n' + '='.repeat(50));
    };
    AdvancedReleaseCLI.prototype.showSummaryReport = function (result) {
        console.log('📊 Release Analysis Summary');
        console.log('='.repeat(30));
        console.log("\n\uD83C\uDFF7\uFE0F  Version: ".concat(result.versionRecommendation.currentVersion, " \u2192 ").concat(result.versionRecommendation.recommendedVersion));
        console.log("\uD83D\uDCC8 Bump type: ".concat(result.versionRecommendation.bumpType));
        console.log("\uD83C\uDFAF Confidence: ".concat((result.versionRecommendation.confidence * 100).toFixed(1), "%"));
        var totalChanges = result.changes.breakingChanges.length +
            result.changes.newFeatures.length +
            result.changes.bugFixes.length +
            result.changes.improvements.length;
        console.log("\n\uD83D\uDCDD Changes: ".concat(totalChanges, " total"));
        if (result.changes.breakingChanges.length > 0) {
            console.log("  \u26A0\uFE0F  ".concat(result.changes.breakingChanges.length, " breaking changes"));
        }
        if (result.changes.newFeatures.length > 0) {
            console.log("  \u2728 ".concat(result.changes.newFeatures.length, " new features"));
        }
        if (result.changes.bugFixes.length > 0) {
            console.log("  \uD83D\uDC1B ".concat(result.changes.bugFixes.length, " bug fixes"));
        }
        if (result.changes.improvements.length > 0) {
            console.log("  \uD83D\uDD27 ".concat(result.changes.improvements.length, " improvements"));
        }
        console.log("\n\uD83D\uDCAD ".concat(result.versionRecommendation.rationale));
        if (result.changes.metadata.ambiguousItems.length > 0) {
            console.log("\n\u26A0\uFE0F  ".concat(result.changes.metadata.ambiguousItems.length, " items need review"));
        }
        console.log('\n' + '='.repeat(30));
    };
    AdvancedReleaseCLI.prototype.showJSONReport = function (result) {
        console.log(JSON.stringify(result, null, 2));
    };
    AdvancedReleaseCLI.prototype.showAdvancedHelp = function () {
        console.log("\n\uD83D\uDE80 Advanced Release Analysis CLI\n\nEnhanced CLI with interactive features, configuration management, and analysis history.\n\nUsage:\n  npm run release:analyze [command] [options]\n\nCommands:\n  analyze                 - Analyze changes since last release (default)\n  config                  - Manage configuration\n  history                 - Manage analysis history\n  help                    - Show this help message\n  version                 - Show CLI version\n\nAnalysis Options:\n  --since <tag|commit>    - Analyze changes since specific tag or commit\n  --format <type>         - Output format: summary, detailed, json (default: summary)\n  --dry-run              - Preview analysis scope without full extraction\n  --include <patterns>    - Comma-separated file patterns to include\n  --exclude <patterns>    - Comma-separated file patterns to exclude\n\nInteractive Options:\n  --interactive, -i       - Enable interactive mode for reviewing uncertain changes\n  --auto-approve         - Auto-approve low-confidence items in interactive mode\n  --skip-confirmation    - Skip confirmation prompts (use with caution)\n  --review-threshold <n> - Confidence threshold for interactive review (0-1)\n\nConfiguration Management:\n  --config-show          - Show current configuration\n  --config-set key=value - Set configuration value (supports nested keys)\n  --config-reset         - Reset configuration to defaults\n  --config-validate      - Validate current configuration\n  --config-path <path>   - Use custom configuration file path\n\nAnalysis History:\n  --history-list         - List previous analyses\n  --history-compare <id> - Compare current analysis with historical entry\n  --history-show <id>    - Show detailed information about historical analysis\n  --history-clear        - Clear all analysis history\n\nExamples:\n  # Basic analysis\n  npm run release:analyze\n\n  # Interactive analysis with detailed output\n  npm run release:analyze --interactive --format detailed\n\n  # Dry-run preview\n  npm run release:analyze --dry-run --since v1.0.0\n\n  # Configuration management\n  npm run release:analyze config --config-show\n  npm run release:analyze config --config-set extraction.confidenceThresholds.minimumConfidence=0.7\n\n  # History management\n  npm run release:analyze history --history-list\n  npm run release:analyze history --history-compare analysis-1640995200000\n\n  # Advanced workflow\n  npm run release:analyze --interactive --review-threshold 0.8 --format detailed\n\nInteractive Mode:\n  When --interactive is enabled, the CLI will prompt you to review:\n  - Ambiguous changes that couldn't be categorized with high confidence\n  - Uncertain duplicate items that may need merging or separation\n  - Major version bump recommendations for confirmation\n\nConfiguration Keys:\n  extraction.confidenceThresholds.minimumConfidence    - Minimum confidence for extraction (0-1)\n  extraction.confidenceThresholds.reviewThreshold     - Threshold for requiring review (0-1)\n  versioning.versionBumpRules.requireMajorConfirmation - Require confirmation for major bumps\n  reporting.defaultFormat                              - Default output format\n  reporting.includeConfidence                          - Include confidence metrics in output\n\nThe enhanced CLI provides a complete workflow for release analysis with human oversight\nand quality control through interactive features and comprehensive configuration options.\n");
    };
    return AdvancedReleaseCLI;
}());
exports.AdvancedReleaseCLI = AdvancedReleaseCLI;
// CLI entry point when run directly
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var cli;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cli = new AdvancedReleaseCLI();
                    return [4 /*yield*/, cli.run()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Run the CLI if this file is executed directly
if (require.main === module) {
    main().catch(function (error) {
        console.error('Unhandled error:', error);
        process.exit(1);
    });
}
