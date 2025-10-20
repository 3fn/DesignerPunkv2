"use strict";
/**
 * Enhanced Change Extractor
 *
 * Implements sophisticated extraction of changes from completion documents.
 * Integrates complex extraction methods from CompletionAnalyzer with CLI workflow.
 * Uses structured section parsing with pattern-based fallback for maximum accuracy.
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleChangeExtractor = void 0;
// Simple ID generator to avoid module issues
function generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
var PatternMatcher_1 = require("./PatternMatcher");
var ChangeCategorizationSystem_1 = require("./ChangeCategorizationSystem");
var DeduplicationEngine_1 = require("./DeduplicationEngine");
var ConfidenceMetrics_1 = require("./ConfidenceMetrics");
var SimpleChangeExtractor = /** @class */ (function () {
    function SimpleChangeExtractor(config) {
        this.config = config;
        this.patternMatcher = new PatternMatcher_1.PatternMatcher(config);
        this.categorizationSystem = new ChangeCategorizationSystem_1.ChangeCategorizationSystem(config);
        this.deduplicationEngine = new DeduplicationEngine_1.DeduplicationEngine(config.confidenceThresholds);
        this.confidenceMetrics = new ConfidenceMetrics_1.ConfidenceMetrics(config.confidenceThresholds);
    }
    /**
     * Extract changes from multiple completion documents
     */
    SimpleChangeExtractor.prototype.extractChanges = function (documents) {
        return __awaiter(this, void 0, void 0, function () {
            var allChanges, filteredDocuments, _i, documents_1, document_1, documentChanges, aggregated, deduplicated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allChanges = [];
                        filteredDocuments = [];
                        _i = 0, documents_1 = documents;
                        _a.label = 1;
                    case 1:
                        if (!(_i < documents_1.length)) return [3 /*break*/, 4];
                        document_1 = documents_1[_i];
                        // Check if document should be excluded
                        if (this.patternMatcher.shouldExcludeContent(document_1.content, document_1.path)) {
                            filteredDocuments.push(document_1.path);
                            return [3 /*break*/, 3];
                        }
                        return [4 /*yield*/, this.parseCompletionDocument(document_1)];
                    case 2:
                        documentChanges = _a.sent();
                        allChanges.push(documentChanges);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        aggregated = this.aggregateChanges(allChanges);
                        // Add filtered documents to metadata
                        aggregated.metadata.filteredItems = filteredDocuments;
                        deduplicated = this.deduplicateChanges(aggregated);
                        return [2 /*return*/, deduplicated];
                }
            });
        });
    };
    /**
     * Parse a single completion document for changes
     */
    SimpleChangeExtractor.prototype.parseCompletionDocument = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var sectionMatches;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sectionMatches = this.patternMatcher.findSectionMatches(document.content);
                        if (sectionMatches.length > 0) {
                            return [2 /*return*/, this.parseStructuredDocument(document, sectionMatches)];
                        }
                        return [4 /*yield*/, this.parseUnstructuredDocument(document)];
                    case 1: 
                    // Fall back to pattern-based parsing
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Deduplicate similar changes across documents using enhanced deduplication engine
     */
    SimpleChangeExtractor.prototype.deduplicateChanges = function (changes) {
        // Deduplicate each type of change
        var breakingResult = this.deduplicationEngine.deduplicateBreakingChanges(changes.breakingChanges);
        var featuresResult = this.deduplicationEngine.deduplicateFeatures(changes.newFeatures);
        var bugFixesResult = this.deduplicationEngine.deduplicateBugFixes(changes.bugFixes);
        var improvementsResult = this.deduplicationEngine.deduplicateImprovements(changes.improvements);
        var documentationResult = this.deduplicationEngine.deduplicateDocumentation(changes.documentation);
        // Collect deduplication metadata
        var deduplicationMetadata = this.buildDeduplicationMetadata([
            { type: 'breaking-changes', result: breakingResult },
            { type: 'features', result: featuresResult },
            { type: 'bug-fixes', result: bugFixesResult },
            { type: 'improvements', result: improvementsResult },
            { type: 'documentation', result: documentationResult }
        ]);
        // Update confidence based on deduplication results
        var updatedConfidence = this.calculateConfidenceWithDeduplication(changes, deduplicationMetadata);
        return {
            breakingChanges: breakingResult.items,
            newFeatures: featuresResult.items,
            bugFixes: bugFixesResult.items,
            improvements: improvementsResult.items,
            documentation: documentationResult.items,
            metadata: __assign(__assign({}, changes.metadata), { extractionConfidence: updatedConfidence, deduplication: deduplicationMetadata })
        };
    };
    /**
     * Validate extraction results
     */
    SimpleChangeExtractor.prototype.validateExtraction = function (changes) {
        var _a;
        var errors = [];
        var warnings = [];
        var suggestions = [];
        // Check minimum confidence threshold
        if (changes.metadata.extractionConfidence < this.config.confidenceThresholds.minimumConfidence) {
            errors.push({
                type: 'confidence',
                message: "Extraction confidence (".concat(changes.metadata.extractionConfidence.toFixed(2), ") below minimum threshold (").concat(this.config.confidenceThresholds.minimumConfidence, ")")
            });
        }
        // Check for ambiguous items
        if (changes.metadata.ambiguousItems.length > 0) {
            warnings.push({
                type: 'ambiguous',
                message: "".concat(changes.metadata.ambiguousItems.length, " ambiguous items require review"),
                suggestion: 'Review ambiguous items for proper categorization'
            });
        }
        // Check for uncertain duplicates
        if (((_a = changes.metadata.deduplication) === null || _a === void 0 ? void 0 : _a.uncertainDuplicates) && changes.metadata.deduplication.uncertainDuplicates.length > 0) {
            warnings.push({
                type: 'ambiguous',
                message: "".concat(changes.metadata.deduplication.uncertainDuplicates.length, " potential duplicate groups require manual review"),
                suggestion: 'Review potential duplicates to determine if they should be merged or kept separate'
            });
        }
        // Check for empty results
        var totalChanges = changes.breakingChanges.length + changes.newFeatures.length +
            changes.bugFixes.length + changes.improvements.length;
        if (totalChanges === 0) {
            warnings.push({
                type: 'missing-info',
                message: 'No significant changes detected',
                suggestion: 'Verify completion documents contain change information'
            });
        }
        // Suggest review for low confidence items
        if (changes.metadata.extractionConfidence < this.config.confidenceThresholds.reviewThreshold) {
            suggestions.push({
                type: 'validation',
                message: 'Consider manual review of extracted changes',
                action: 'Review and validate extracted changes manually'
            });
        }
        return {
            valid: errors.length === 0,
            confidence: changes.metadata.extractionConfidence,
            errors: errors,
            warnings: warnings,
            suggestions: suggestions
        };
    };
    /**
     * Parse structured document using enhanced section matches with complex extraction logic
     */
    SimpleChangeExtractor.prototype.parseStructuredDocument = function (document, sectionMatches) {
        var breakingChanges = [];
        var newFeatures = [];
        var bugFixes = [];
        var improvements = [];
        var documentation = [];
        var ambiguousItems = [];
        var totalConfidence = 0;
        var sectionCount = 0;
        for (var _i = 0, sectionMatches_1 = sectionMatches; _i < sectionMatches_1.length; _i++) {
            var section = sectionMatches_1[_i];
            totalConfidence += section.confidence;
            sectionCount++;
            switch (section.type) {
                case 'breaking':
                    breakingChanges.push.apply(breakingChanges, this.extractBreakingChangesFromSection(section, document));
                    break;
                case 'feature':
                    newFeatures.push.apply(newFeatures, this.extractFeaturesFromSection(section, document));
                    break;
                case 'bugfix':
                    bugFixes.push.apply(bugFixes, this.extractBugFixesFromSection(section, document));
                    break;
                case 'improvement':
                    improvements.push.apply(improvements, this.extractImprovementsFromSection(section, document));
                    break;
                case 'summary':
                    // Extract mixed changes from summary section
                    var mixedChanges = this.extractMixedChangesFromSection(section, document);
                    breakingChanges.push.apply(breakingChanges, mixedChanges.breakingChanges);
                    newFeatures.push.apply(newFeatures, mixedChanges.newFeatures);
                    bugFixes.push.apply(bugFixes, mixedChanges.bugFixes);
                    improvements.push.apply(improvements, mixedChanges.improvements);
                    ambiguousItems.push.apply(ambiguousItems, mixedChanges.ambiguousItems);
                    break;
            }
        }
        var confidence = sectionCount > 0 ? totalConfidence / sectionCount : 0.5;
        return {
            document: document,
            breakingChanges: breakingChanges,
            newFeatures: newFeatures,
            bugFixes: bugFixes,
            improvements: improvements,
            documentation: documentation,
            confidence: confidence,
            ambiguousItems: ambiguousItems
        };
    };
    /**
     * Parse unstructured document using enhanced pattern matching with structured fallback
     */
    SimpleChangeExtractor.prototype.parseUnstructuredDocument = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var breakingChanges, newFeatures, bugFixes, patternMatches, improvements, documentation, ambiguousItems, totalConfidence, matchCount, _i, patternMatches_1, match, changeItem, confidence;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.extractBreakingChangesWithStructure(document)];
                    case 1:
                        breakingChanges = _a.sent();
                        return [4 /*yield*/, this.extractFeaturesWithStructure(document)];
                    case 2:
                        newFeatures = _a.sent();
                        return [4 /*yield*/, this.extractBugFixesWithStructure(document)];
                    case 3:
                        bugFixes = _a.sent();
                        patternMatches = this.patternMatcher.findPatternMatches(document.content, document.path);
                        improvements = [];
                        documentation = [];
                        ambiguousItems = [];
                        totalConfidence = 0;
                        matchCount = 0;
                        for (_i = 0, patternMatches_1 = patternMatches; _i < patternMatches_1.length; _i++) {
                            match = patternMatches_1[_i];
                            totalConfidence += match.confidence;
                            matchCount++;
                            if (match.confidence < this.config.confidenceThresholds.uncertaintyThreshold) {
                                ambiguousItems.push("".concat(match.match, " (line ").concat(match.line, ")"));
                            }
                            changeItem = this.createChangeFromPattern(match, document);
                            switch (match.type) {
                                case 'improvement':
                                    improvements.push(changeItem);
                                    break;
                                case 'documentation':
                                    documentation.push(changeItem);
                                    break;
                                // Breaking changes, features, and bug fixes are handled by structured extraction
                            }
                        }
                        confidence = matchCount > 0 ? totalConfidence / matchCount : 0.5;
                        return [2 /*return*/, {
                                document: document,
                                breakingChanges: breakingChanges,
                                newFeatures: newFeatures,
                                bugFixes: bugFixes,
                                improvements: improvements,
                                documentation: documentation,
                                confidence: confidence,
                                ambiguousItems: ambiguousItems
                            }];
                }
            });
        });
    };
    /**
     * Extract breaking changes from a section using enhanced extraction
     */
    SimpleChangeExtractor.prototype.extractBreakingChangesFromSection = function (section, document) {
        var changes = [];
        var items = this.extractListItems(section.content);
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            var affectedAPIs = this.extractAffectedAPIs(item);
            changes.push({
                id: generateId(),
                title: this.extractTitle(item),
                description: item,
                affectedAPIs: affectedAPIs,
                migrationGuidance: this.extractMigrationGuidance(item),
                source: "".concat(document.path, ":").concat(section.startLine),
                severity: this.determineBreakingChangeSeverity(item) // Use enhanced severity determination
            });
        }
        return changes;
    };
    /**
     * Extract features from a section
     */
    SimpleChangeExtractor.prototype.extractFeaturesFromSection = function (section, document) {
        var features = [];
        var items = this.extractListItems(section.content);
        for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
            var item = items_2[_i];
            var artifacts = this.extractArtifacts(item);
            features.push({
                id: generateId(),
                title: this.extractTitle(item),
                description: item,
                benefits: this.extractBenefits(item),
                requirements: this.extractRequirements(item),
                artifacts: artifacts,
                source: "".concat(document.path, ":").concat(section.startLine),
                category: this.categorizeFeature(item, artifacts)
            });
        }
        return features;
    };
    /**
     * Extract bug fixes from a section
     */
    SimpleChangeExtractor.prototype.extractBugFixesFromSection = function (section, document) {
        var bugFixes = [];
        var items = this.extractListItems(section.content);
        for (var _i = 0, items_3 = items; _i < items_3.length; _i++) {
            var item = items_3[_i];
            var affectedComponents = this.extractAffectedComponents(item);
            bugFixes.push({
                id: generateId(),
                title: this.extractTitle(item),
                description: item,
                issueNumber: this.extractIssueNumber(item),
                affectedComponents: affectedComponents,
                source: "".concat(document.path, ":").concat(section.startLine),
                severity: this.assessBugFixSeverity(item, affectedComponents)
            });
        }
        return bugFixes;
    };
    /**
     * Extract improvements from a section
     */
    SimpleChangeExtractor.prototype.extractImprovementsFromSection = function (section, document) {
        var improvements = [];
        var items = this.extractListItems(section.content);
        for (var _i = 0, items_4 = items; _i < items_4.length; _i++) {
            var item = items_4[_i];
            improvements.push({
                id: generateId(),
                title: this.extractTitle(item),
                description: item,
                type: this.categorizeImprovement(item),
                impact: this.assessImprovementImpact(item),
                source: "".concat(document.path, ":").concat(section.startLine)
            });
        }
        return improvements;
    };
    /**
     * Extract mixed changes from summary section
     */
    SimpleChangeExtractor.prototype.extractMixedChangesFromSection = function (section, document) {
        var patternMatches = this.patternMatcher.findPatternMatches(section.content, document.path);
        var breakingChanges = [];
        var newFeatures = [];
        var bugFixes = [];
        var improvements = [];
        var ambiguousItems = [];
        for (var _i = 0, patternMatches_2 = patternMatches; _i < patternMatches_2.length; _i++) {
            var match = patternMatches_2[_i];
            if (match.confidence < this.config.confidenceThresholds.uncertaintyThreshold) {
                ambiguousItems.push("".concat(match.match, " (line ").concat(match.line, ")"));
            }
            var changeItem = this.createChangeFromPattern(match, document);
            switch (match.type) {
                case 'breaking':
                    breakingChanges.push(changeItem);
                    break;
                case 'feature':
                    newFeatures.push(changeItem);
                    break;
                case 'bugfix':
                    bugFixes.push(changeItem);
                    break;
                case 'improvement':
                    improvements.push(changeItem);
                    break;
            }
        }
        return { breakingChanges: breakingChanges, newFeatures: newFeatures, bugFixes: bugFixes, improvements: improvements, ambiguousItems: ambiguousItems };
    };
    /**
     * Create change item from pattern match
     */
    SimpleChangeExtractor.prototype.createChangeFromPattern = function (match, document) {
        var baseItem = {
            id: generateId(),
            title: this.extractTitle(match.context),
            description: match.context,
            source: "".concat(document.path, ":").concat(match.line)
        };
        switch (match.type) {
            case 'breaking':
                var affectedAPIs = this.extractAffectedAPIs(match.context);
                return __assign(__assign({}, baseItem), { affectedAPIs: affectedAPIs, migrationGuidance: this.extractMigrationGuidance(match.context), severity: this.assessBreakingChangeSeverity(match.context, affectedAPIs) });
            case 'feature':
                var artifacts = this.extractArtifacts(match.context);
                return __assign(__assign({}, baseItem), { benefits: this.extractBenefits(match.context), requirements: this.extractRequirements(match.context), artifacts: artifacts, category: this.categorizeFeature(match.context, artifacts) });
            case 'bugfix':
                var affectedComponents = this.extractAffectedComponents(match.context);
                return __assign(__assign({}, baseItem), { issueNumber: this.extractIssueNumber(match.context), affectedComponents: affectedComponents, severity: this.assessBugFixSeverity(match.context, affectedComponents) });
            case 'improvement':
                return __assign(__assign({}, baseItem), { type: this.categorizeImprovement(match.context), impact: this.assessImprovementImpact(match.context) });
            case 'documentation':
                return __assign(__assign({}, baseItem), { type: this.categorizeDocumentation(match.context) });
            default:
                return baseItem;
        }
    };
    /**
     * Enhanced section finding from CompletionAnalyzer
     * Provides more sophisticated section detection for structured documents
     */
    SimpleChangeExtractor.prototype.findSections = function (content, sectionNames) {
        var sections = [];
        var lines = content.split('\n');
        var _loop_1 = function (i) {
            var line = lines[i].toLowerCase().trim();
            if (sectionNames.some(function (name) {
                return line.includes("## ".concat(name.toLowerCase())) ||
                    line.includes("# ".concat(name.toLowerCase())) ||
                    line.includes("**".concat(name.toLowerCase()));
            })) {
                // Extract section content without the header
                var sectionContent = '';
                for (var j = i + 1; j < lines.length; j++) {
                    var nextLine = lines[j];
                    // Stop at next section header (more precise detection)
                    if (nextLine.match(/^#{1,6}\s/) ||
                        nextLine.match(/^\*\*[^*]+\*\*\s*:/) ||
                        nextLine.trim() === '') {
                        // Skip empty lines at section boundaries
                        if (nextLine.trim() !== '') {
                            break;
                        }
                    }
                    else {
                        sectionContent += nextLine + '\n';
                    }
                }
                // Only add non-empty sections
                if (sectionContent.trim()) {
                    sections.push(sectionContent.trim());
                }
            }
        };
        for (var i = 0; i < lines.length; i++) {
            _loop_1(i);
        }
        return sections;
    };
    /**
     * Enhanced extraction using structured sections first (from CompletionAnalyzer)
     */
    SimpleChangeExtractor.prototype.extractBreakingChangesWithStructure = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var breakingChanges, content, breakingChangeSections, _i, breakingChangeSections_1, section, changes, lines, processedSections, _loop_2, this_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        breakingChanges = [];
                        content = document.content;
                        breakingChangeSections = this.findSections(content, [
                            'breaking changes',
                            'breaking change',
                            'incompatible changes',
                            'migration required',
                            'api changes'
                        ]);
                        if (!(breakingChangeSections.length > 0)) return [3 /*break*/, 5];
                        _i = 0, breakingChangeSections_1 = breakingChangeSections;
                        _a.label = 1;
                    case 1:
                        if (!(_i < breakingChangeSections_1.length)) return [3 /*break*/, 4];
                        section = breakingChangeSections_1[_i];
                        return [4 /*yield*/, this.parseBreakingChangeSection(section, document.path)];
                    case 2:
                        changes = _a.sent();
                        breakingChanges.push.apply(breakingChanges, changes);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 9];
                    case 5:
                        lines = content.split('\n');
                        processedSections = new Set();
                        _loop_2 = function (i) {
                            var line, lineContent, change;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (processedSections.has(i))
                                            return [2 /*return*/, "continue"];
                                        line = lines[i];
                                        lineContent = line.toLowerCase();
                                        if (!this_1.config.breakingChangeKeywords.some(function (keyword) {
                                            return lineContent.includes(keyword.toLowerCase());
                                        })) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this_1.createBreakingChangeFromLine(line, lines, i, document.path)];
                                    case 1:
                                        change = _b.sent();
                                        if (change) {
                                            breakingChanges.push(change);
                                            // Mark this line as processed to avoid re-extraction
                                            processedSections.add(i);
                                        }
                                        _b.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 6;
                    case 6:
                        if (!(i < lines.length)) return [3 /*break*/, 9];
                        return [5 /*yield**/, _loop_2(i)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        i++;
                        return [3 /*break*/, 6];
                    case 9: return [2 /*return*/, this.semanticDeduplicateBreakingChanges(breakingChanges)];
                }
            });
        });
    };
    /**
     * Enhanced feature extraction with structured sections (from CompletionAnalyzer)
     */
    SimpleChangeExtractor.prototype.extractFeaturesWithStructure = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var features, content, featureSections, _i, featureSections_1, section, sectionFeatures, hasBugFixSection, implementationPatterns, _a, implementationPatterns_1, pattern, matches, _b, matches_1, match, feature;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        features = [];
                        content = document.content;
                        featureSections = this.findSections(content, [
                            'new features',
                            'features implemented',
                            'functionality added'
                        ]);
                        if (!(featureSections.length > 0)) return [3 /*break*/, 5];
                        _i = 0, featureSections_1 = featureSections;
                        _c.label = 1;
                    case 1:
                        if (!(_i < featureSections_1.length)) return [3 /*break*/, 4];
                        section = featureSections_1[_i];
                        return [4 /*yield*/, this.parseFeaturesSection(section, document.path)];
                    case 2:
                        sectionFeatures = _c.sent();
                        features.push.apply(features, sectionFeatures);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 11];
                    case 5:
                        hasBugFixSection = this.findSections(content, ['bug fixes', 'fixes']).length > 0;
                        if (!!hasBugFixSection) return [3 /*break*/, 11];
                        implementationPatterns = [
                            /implemented?\s+new\s+([^.\n]+)/gi,
                            /created?\s+new\s+([^.\n]+)/gi,
                            /added?\s+new\s+([^.\n]+)/gi,
                            /built?\s+new\s+([^.\n]+)/gi
                        ];
                        _a = 0, implementationPatterns_1 = implementationPatterns;
                        _c.label = 6;
                    case 6:
                        if (!(_a < implementationPatterns_1.length)) return [3 /*break*/, 11];
                        pattern = implementationPatterns_1[_a];
                        matches = content.matchAll(pattern);
                        _b = 0, matches_1 = matches;
                        _c.label = 7;
                    case 7:
                        if (!(_b < matches_1.length)) return [3 /*break*/, 10];
                        match = matches_1[_b];
                        return [4 /*yield*/, this.createFeatureFromMatch(match, document.path)];
                    case 8:
                        feature = _c.sent();
                        if (feature) {
                            features.push(feature);
                        }
                        _c.label = 9;
                    case 9:
                        _b++;
                        return [3 /*break*/, 7];
                    case 10:
                        _a++;
                        return [3 /*break*/, 6];
                    case 11: return [2 /*return*/, this.semanticDeduplicateFeatures(features)];
                }
            });
        });
    };
    /**
     * Enhanced bug fix extraction with documentation filtering (from CompletionAnalyzer)
     */
    SimpleChangeExtractor.prototype.extractBugFixesWithStructure = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var bugFixes, content, documentationSections, bugFixSections, _i, bugFixSections_1, section, fixes, fixPatterns, _a, fixPatterns_1, pattern, matches, _b, matches_2, match, bugFix;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        bugFixes = [];
                        content = document.content;
                        documentationSections = this.findSections(content, [
                            'documentation updates',
                            'documentation changes',
                            'readme updates',
                            'documentation fixes'
                        ]);
                        bugFixSections = this.findSections(content, [
                            'bug fixes',
                            'fixes',
                            'issues resolved',
                            'problems solved'
                        ]);
                        if (!(bugFixSections.length > 0)) return [3 /*break*/, 5];
                        _i = 0, bugFixSections_1 = bugFixSections;
                        _c.label = 1;
                    case 1:
                        if (!(_i < bugFixSections_1.length)) return [3 /*break*/, 4];
                        section = bugFixSections_1[_i];
                        return [4 /*yield*/, this.parseBugFixSection(section, document.path)];
                    case 2:
                        fixes = _c.sent();
                        bugFixes.push.apply(bugFixes, fixes);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 11];
                    case 5:
                        if (!(documentationSections.length === 0)) return [3 /*break*/, 11];
                        fixPatterns = [
                            /fixed?\s+([^.\n]+)/gi,
                            /resolved?\s+([^.\n]+)/gi,
                            /corrected?\s+([^.\n]+)/gi
                        ];
                        _a = 0, fixPatterns_1 = fixPatterns;
                        _c.label = 6;
                    case 6:
                        if (!(_a < fixPatterns_1.length)) return [3 /*break*/, 11];
                        pattern = fixPatterns_1[_a];
                        matches = content.matchAll(pattern);
                        _b = 0, matches_2 = matches;
                        _c.label = 7;
                    case 7:
                        if (!(_b < matches_2.length)) return [3 /*break*/, 10];
                        match = matches_2[_b];
                        return [4 /*yield*/, this.createBugFixFromMatch(match, document.path)];
                    case 8:
                        bugFix = _c.sent();
                        if (bugFix) {
                            bugFixes.push(bugFix);
                        }
                        _c.label = 9;
                    case 9:
                        _b++;
                        return [3 /*break*/, 7];
                    case 10:
                        _a++;
                        return [3 /*break*/, 6];
                    case 11: return [2 /*return*/, this.semanticDeduplicateBugFixes(bugFixes)];
                }
            });
        });
    };
    /**
     * Semantic deduplication methods from CompletionAnalyzer
     */
    SimpleChangeExtractor.prototype.semanticDeduplicateBreakingChanges = function (changes) {
        var _this = this;
        return this.semanticDeduplicate(changes, function (a, b) {
            return _this.calculateSimilarity(a.title, b.title) > _this.config.confidenceThresholds.semanticSimilarityThreshold ||
                _this.calculateSimilarity(a.description, b.description) > _this.config.confidenceThresholds.semanticSimilarityThreshold;
        });
    };
    SimpleChangeExtractor.prototype.semanticDeduplicateFeatures = function (features) {
        var _this = this;
        return this.semanticDeduplicate(features, function (a, b) {
            return _this.calculateSimilarity(a.title, b.title) > _this.config.confidenceThresholds.semanticSimilarityThreshold ||
                _this.calculateSimilarity(a.description, b.description) > _this.config.confidenceThresholds.semanticSimilarityThreshold;
        });
    };
    SimpleChangeExtractor.prototype.semanticDeduplicateBugFixes = function (bugFixes) {
        var _this = this;
        return this.semanticDeduplicate(bugFixes, function (a, b) {
            return _this.calculateSimilarity(a.title, b.title) > _this.config.confidenceThresholds.semanticSimilarityThreshold ||
                _this.calculateSimilarity(a.description, b.description) > _this.config.confidenceThresholds.semanticSimilarityThreshold;
        });
    };
    SimpleChangeExtractor.prototype.semanticDeduplicateImprovements = function (improvements) {
        var _this = this;
        return this.semanticDeduplicate(improvements, function (a, b) {
            return _this.calculateSimilarity(a.title, b.title) > _this.config.confidenceThresholds.semanticSimilarityThreshold ||
                _this.calculateSimilarity(a.description, b.description) > _this.config.confidenceThresholds.semanticSimilarityThreshold;
        });
    };
    /**
     * Generic semantic deduplication with similarity function
     */
    SimpleChangeExtractor.prototype.semanticDeduplicate = function (items, similarityFn) {
        if (items.length <= 1)
            return items;
        var deduplicated = [];
        var processed = new Set();
        for (var _i = 0, items_5 = items; _i < items_5.length; _i++) {
            var item = items_5[_i];
            if (processed.has(item.id))
                continue;
            var isDuplicate = false;
            for (var _a = 0, deduplicated_1 = deduplicated; _a < deduplicated_1.length; _a++) {
                var existing = deduplicated_1[_a];
                if (similarityFn(item, existing)) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                deduplicated.push(item);
            }
            processed.add(item.id);
        }
        return deduplicated;
    };
    /**
     * Calculate text similarity using Levenshtein distance
     */
    SimpleChangeExtractor.prototype.calculateSimilarity = function (text1, text2) {
        var len1 = text1.length;
        var len2 = text2.length;
        if (len1 === 0)
            return len2 === 0 ? 1 : 0;
        if (len2 === 0)
            return 0;
        var matrix = Array(len2 + 1).fill(null).map(function () { return Array(len1 + 1).fill(null); });
        for (var i = 0; i <= len1; i++)
            matrix[0][i] = i;
        for (var j = 0; j <= len2; j++)
            matrix[j][0] = j;
        for (var j = 1; j <= len2; j++) {
            for (var i = 1; i <= len1; i++) {
                var indicator = text1[i - 1] === text2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(matrix[j][i - 1] + 1, // deletion
                matrix[j - 1][i] + 1, // insertion
                matrix[j - 1][i - 1] + indicator // substitution
                );
            }
        }
        var distance = matrix[len2][len1];
        var maxLength = Math.max(len1, len2);
        return 1 - (distance / maxLength);
    };
    /**
     * Enhanced section parsing methods from CompletionAnalyzer
     */
    SimpleChangeExtractor.prototype.parseBreakingChangeSection = function (section, source) {
        return __awaiter(this, void 0, void 0, function () {
            var changes, lines, _i, lines_1, line, trimmedLine, cleanLine, change;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        changes = [];
                        lines = section.split('\n');
                        _i = 0, lines_1 = lines;
                        _a.label = 1;
                    case 1:
                        if (!(_i < lines_1.length)) return [3 /*break*/, 4];
                        line = lines_1[_i];
                        trimmedLine = line.trim();
                        if (!(trimmedLine &&
                            !trimmedLine.match(/^#+/) &&
                            !trimmedLine.match(/^\*\*/) &&
                            (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•')))) return [3 /*break*/, 3];
                        cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
                        if (!cleanLine) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createBreakingChangeFromCleanLine(cleanLine, source)];
                    case 2:
                        change = _a.sent();
                        if (change) {
                            changes.push(change);
                        }
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, changes];
                }
            });
        });
    };
    SimpleChangeExtractor.prototype.parseFeaturesSection = function (section, source) {
        return __awaiter(this, void 0, void 0, function () {
            var features, lines, _i, lines_2, line, trimmedLine, cleanLine, feature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        features = [];
                        lines = section.split('\n');
                        _i = 0, lines_2 = lines;
                        _a.label = 1;
                    case 1:
                        if (!(_i < lines_2.length)) return [3 /*break*/, 4];
                        line = lines_2[_i];
                        trimmedLine = line.trim();
                        if (!(trimmedLine &&
                            !trimmedLine.match(/^#+/) &&
                            !trimmedLine.match(/^\*\*/) &&
                            (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•')))) return [3 /*break*/, 3];
                        cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
                        if (!cleanLine) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createFeatureFromCleanLine(cleanLine, source)];
                    case 2:
                        feature = _a.sent();
                        if (feature) {
                            features.push(feature);
                        }
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, features];
                }
            });
        });
    };
    SimpleChangeExtractor.prototype.parseBugFixSection = function (section, source) {
        return __awaiter(this, void 0, void 0, function () {
            var bugFixes, lines, _i, lines_3, line, trimmedLine, cleanLine, bugFix;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bugFixes = [];
                        lines = section.split('\n');
                        _i = 0, lines_3 = lines;
                        _a.label = 1;
                    case 1:
                        if (!(_i < lines_3.length)) return [3 /*break*/, 4];
                        line = lines_3[_i];
                        trimmedLine = line.trim();
                        if (!(trimmedLine &&
                            !trimmedLine.match(/^#+/) &&
                            !trimmedLine.match(/^\*\*/) &&
                            (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•')))) return [3 /*break*/, 3];
                        cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
                        if (!cleanLine) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createBugFixFromCleanLine(cleanLine, source)];
                    case 2:
                        bugFix = _a.sent();
                        if (bugFix) {
                            bugFixes.push(bugFix);
                        }
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, bugFixes];
                }
            });
        });
    };
    /**
     * Enhanced creation methods from CompletionAnalyzer
     */
    SimpleChangeExtractor.prototype.createBreakingChangeFromLine = function (line, allLines, lineIndex, source) {
        return __awaiter(this, void 0, void 0, function () {
            var trimmedLine, cleanLine;
            return __generator(this, function (_a) {
                trimmedLine = line.trim();
                if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('**')) {
                    return [2 /*return*/, null];
                }
                cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
                return [2 /*return*/, this.createBreakingChangeFromCleanLine(cleanLine, source)];
            });
        });
    };
    SimpleChangeExtractor.prototype.createBreakingChangeFromCleanLine = function (cleanLine, source) {
        return __awaiter(this, void 0, void 0, function () {
            var id, title, description;
            return __generator(this, function (_a) {
                if (!cleanLine) {
                    return [2 /*return*/, null];
                }
                id = generateId();
                title = cleanLine;
                description = cleanLine;
                return [2 /*return*/, {
                        id: id,
                        title: title,
                        description: description,
                        affectedAPIs: this.extractAffectedAPIs(description),
                        source: source,
                        severity: this.determineBreakingChangeSeverity(description)
                    }];
            });
        });
    };
    SimpleChangeExtractor.prototype.createFeatureFromMatch = function (match, source) {
        return __awaiter(this, void 0, void 0, function () {
            var id, title, description;
            return __generator(this, function (_a) {
                if (!match[1])
                    return [2 /*return*/, null];
                id = generateId();
                title = match[1].trim();
                description = title;
                return [2 /*return*/, {
                        id: id,
                        title: title,
                        description: description,
                        benefits: [],
                        requirements: [],
                        artifacts: [],
                        source: source,
                        category: 'new-functionality'
                    }];
            });
        });
    };
    SimpleChangeExtractor.prototype.createFeatureFromCleanLine = function (cleanLine, source) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                if (!cleanLine) {
                    return [2 /*return*/, null];
                }
                id = generateId();
                return [2 /*return*/, {
                        id: id,
                        title: cleanLine,
                        description: cleanLine,
                        benefits: [],
                        requirements: [],
                        artifacts: [],
                        source: source,
                        category: 'new-functionality'
                    }];
            });
        });
    };
    SimpleChangeExtractor.prototype.createBugFixFromMatch = function (match, source) {
        return __awaiter(this, void 0, void 0, function () {
            var id, title;
            return __generator(this, function (_a) {
                if (!match[1])
                    return [2 /*return*/, null];
                id = generateId();
                title = match[1].trim();
                return [2 /*return*/, {
                        id: id,
                        title: title,
                        description: title,
                        affectedComponents: [],
                        source: source,
                        severity: 'medium'
                    }];
            });
        });
    };
    SimpleChangeExtractor.prototype.createBugFixFromCleanLine = function (cleanLine, source) {
        return __awaiter(this, void 0, void 0, function () {
            var lowerLine, isDocumentationFix, id;
            return __generator(this, function (_a) {
                if (!cleanLine) {
                    return [2 /*return*/, null];
                }
                lowerLine = cleanLine.toLowerCase();
                isDocumentationFix = lowerLine.includes('typos') ||
                    lowerLine.includes('documentation formatting') ||
                    lowerLine.includes('readme formatting') ||
                    lowerLine.includes('documentation') ||
                    lowerLine.includes('readme') ||
                    lowerLine.includes('code examples') ||
                    lowerLine.includes('screenshots') ||
                    lowerLine.includes('diagrams') ||
                    lowerLine.includes('api documentation') ||
                    lowerLine.includes('tutorials') ||
                    lowerLine.includes('getting started') ||
                    lowerLine.includes('installation instructions') ||
                    lowerLine.includes('documentation structure') ||
                    lowerLine.includes('documentation updates');
                if (isDocumentationFix) {
                    return [2 /*return*/, null];
                }
                id = generateId();
                return [2 /*return*/, {
                        id: id,
                        title: cleanLine,
                        description: cleanLine,
                        affectedComponents: [],
                        source: source,
                        severity: 'medium'
                    }];
            });
        });
    };
    /**
     * Enhanced severity determination from CompletionAnalyzer
     */
    SimpleChangeExtractor.prototype.determineBreakingChangeSeverity = function (description) {
        var desc = description.toLowerCase();
        if (desc.includes('critical') || desc.includes('removes') || desc.includes('deletes')) {
            return 'critical';
        }
        if (desc.includes('incompatible') || desc.includes('breaking')) {
            return 'high';
        }
        if (desc.includes('changes') || desc.includes('modifies')) {
            return 'medium';
        }
        return 'low';
    };
    /**
     * Extract list items from content
     */
    SimpleChangeExtractor.prototype.extractListItems = function (content) {
        var lines = content.split('\n');
        var items = [];
        for (var _i = 0, lines_4 = lines; _i < lines_4.length; _i++) {
            var line = lines_4[_i];
            var trimmed = line.trim();
            if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
                items.push(trimmed.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, ''));
            }
            else if (trimmed.length > 0 && items.length === 0) {
                // If no list items found, treat the whole content as one item
                items.push(content.trim());
                break;
            }
        }
        return items.length > 0 ? items : [content.trim()];
    };
    /**
     * Extract title from text (first sentence or line)
     */
    SimpleChangeExtractor.prototype.extractTitle = function (text) {
        var firstLine = text.split('\n')[0].trim();
        var firstSentence = firstLine.split('.')[0];
        return firstSentence.length > 0 ? firstSentence : firstLine;
    };
    /**
     * Extract affected APIs from text
     */
    SimpleChangeExtractor.prototype.extractAffectedAPIs = function (text) {
        var apiPatterns = [
            /API[:\s]+([^\n,]+)/gi,
            /interface[:\s]+([^\n,]+)/gi,
            /method[:\s]+([^\n,]+)/gi,
            /function[:\s]+([^\n,]+)/gi
        ];
        var apis = [];
        for (var _i = 0, apiPatterns_1 = apiPatterns; _i < apiPatterns_1.length; _i++) {
            var pattern = apiPatterns_1[_i];
            var matches = text.match(pattern);
            if (matches) {
                apis.push.apply(apis, matches.map(function (match) { return match.replace(/^[^:]+:\s*/, '').trim(); }));
            }
        }
        return apis;
    };
    /**
     * Extract migration guidance from text
     */
    SimpleChangeExtractor.prototype.extractMigrationGuidance = function (text) {
        var migrationPatterns = [
            /migration[:\s]+([^\n]+)/gi,
            /upgrade[:\s]+([^\n]+)/gi,
            /replace[:\s]+([^\n]+)/gi,
            /use[:\s]+([^\n]+)\s+instead/gi
        ];
        for (var _i = 0, migrationPatterns_1 = migrationPatterns; _i < migrationPatterns_1.length; _i++) {
            var pattern = migrationPatterns_1[_i];
            var match = text.match(pattern);
            if (match) {
                return match[0];
            }
        }
        return undefined;
    };
    /**
     * Assess breaking change severity using categorization system
     */
    SimpleChangeExtractor.prototype.assessBreakingChangeSeverity = function (text, affectedAPIs) {
        if (affectedAPIs === void 0) { affectedAPIs = []; }
        var assessment = this.categorizationSystem.assessBreakingChangeSeverity(this.extractTitle(text), text, affectedAPIs);
        return assessment.severity;
    };
    /**
     * Extract benefits from text using enhanced categorization system
     */
    SimpleChangeExtractor.prototype.extractBenefits = function (text) {
        // Use the categorization system's benefit extraction for features
        var classification = this.categorizationSystem.classifyFeature(this.extractTitle(text), text, []);
        // If the categorization system found benefits, use those
        if (classification.benefits.length > 0) {
            return classification.benefits;
        }
        // Fallback to original pattern-based extraction
        var benefitPatterns = [
            /benefit[s]?[:\s]+([^\n]+)/gi,
            /advantage[s]?[:\s]+([^\n]+)/gi,
            /improve[s]?[:\s]+([^\n]+)/gi
        ];
        var benefits = [];
        for (var _i = 0, benefitPatterns_1 = benefitPatterns; _i < benefitPatterns_1.length; _i++) {
            var pattern = benefitPatterns_1[_i];
            var matches = text.match(pattern);
            if (matches) {
                benefits.push.apply(benefits, matches.map(function (match) { return match.replace(/^[^:]+:\s*/, '').trim(); }));
            }
        }
        return benefits;
    };
    /**
     * Extract requirements from text
     */
    SimpleChangeExtractor.prototype.extractRequirements = function (text) {
        var requirementPatterns = [
            /requirement[s]?[:\s]+([^\n]+)/gi,
            /require[s]?[:\s]+([^\n]+)/gi,
            /need[s]?[:\s]+([^\n]+)/gi
        ];
        var requirements = [];
        for (var _i = 0, requirementPatterns_1 = requirementPatterns; _i < requirementPatterns_1.length; _i++) {
            var pattern = requirementPatterns_1[_i];
            var matches = text.match(pattern);
            if (matches) {
                requirements.push.apply(requirements, matches.map(function (match) { return match.replace(/^[^:]+:\s*/, '').trim(); }));
            }
        }
        return requirements;
    };
    /**
     * Extract artifacts from text
     */
    SimpleChangeExtractor.prototype.extractArtifacts = function (text) {
        var artifactPatterns = [
            /file[s]?[:\s]+([^\n,]+)/gi,
            /component[s]?[:\s]+([^\n,]+)/gi,
            /class[es]*[:\s]+([^\n,]+)/gi,
            /\.ts|\.js|\.tsx|\.jsx|\.md/g
        ];
        var artifacts = [];
        for (var _i = 0, artifactPatterns_1 = artifactPatterns; _i < artifactPatterns_1.length; _i++) {
            var pattern = artifactPatterns_1[_i];
            var matches = text.match(pattern);
            if (matches) {
                artifacts.push.apply(artifacts, matches.map(function (match) { return match.trim(); }));
            }
        }
        return artifacts;
    };
    /**
     * Categorize feature type using categorization system
     */
    SimpleChangeExtractor.prototype.categorizeFeature = function (text, artifacts) {
        if (artifacts === void 0) { artifacts = []; }
        var classification = this.categorizationSystem.classifyFeature(this.extractTitle(text), text, artifacts);
        return classification.category;
    };
    /**
     * Extract issue number from text
     */
    SimpleChangeExtractor.prototype.extractIssueNumber = function (text) {
        var issuePattern = /#(\d+)|issue[:\s]+(\d+)/gi;
        var match = text.match(issuePattern);
        return match ? match[0] : undefined;
    };
    /**
     * Extract affected components from text
     */
    SimpleChangeExtractor.prototype.extractAffectedComponents = function (text) {
        var componentPatterns = [
            /component[s]?[:\s]+([^\n,]+)/gi,
            /module[s]?[:\s]+([^\n,]+)/gi,
            /service[s]?[:\s]+([^\n,]+)/gi
        ];
        var components = [];
        for (var _i = 0, componentPatterns_1 = componentPatterns; _i < componentPatterns_1.length; _i++) {
            var pattern = componentPatterns_1[_i];
            var matches = text.match(pattern);
            if (matches) {
                components.push.apply(components, matches.map(function (match) { return match.replace(/^[^:]+:\s*/, '').trim(); }));
            }
        }
        return components;
    };
    /**
     * Assess bug fix severity using categorization system
     */
    SimpleChangeExtractor.prototype.assessBugFixSeverity = function (text, affectedComponents) {
        if (affectedComponents === void 0) { affectedComponents = []; }
        var classification = this.categorizationSystem.classifyBugFix(this.extractTitle(text), text, affectedComponents);
        return classification.severity;
    };
    /**
     * Categorize improvement type using categorization system
     */
    SimpleChangeExtractor.prototype.categorizeImprovement = function (text) {
        var classification = this.categorizationSystem.classifyImprovement(this.extractTitle(text), text);
        return classification.type;
    };
    /**
     * Assess improvement impact using categorization system
     */
    SimpleChangeExtractor.prototype.assessImprovementImpact = function (text) {
        var classification = this.categorizationSystem.classifyImprovement(this.extractTitle(text), text);
        return classification.impact;
    };
    /**
     * Categorize documentation type
     */
    SimpleChangeExtractor.prototype.categorizeDocumentation = function (text) {
        var lowerText = text.toLowerCase();
        if (lowerText.includes('readme')) {
            return 'readme';
        }
        if (lowerText.includes('api') || lowerText.includes('reference')) {
            return 'api-docs';
        }
        if (lowerText.includes('example') || lowerText.includes('sample')) {
            return 'examples';
        }
        if (lowerText.includes('comment') || lowerText.includes('inline')) {
            return 'comments';
        }
        return 'other';
    };
    /**
     * Aggregate changes from multiple documents
     */
    SimpleChangeExtractor.prototype.aggregateChanges = function (allChanges) {
        var breakingChanges = [];
        var newFeatures = [];
        var bugFixes = [];
        var improvements = [];
        var documentation = [];
        var ambiguousItems = [];
        var totalConfidence = 0;
        var documentCount = 0;
        for (var _i = 0, allChanges_1 = allChanges; _i < allChanges_1.length; _i++) {
            var docChanges = allChanges_1[_i];
            breakingChanges.push.apply(breakingChanges, docChanges.breakingChanges);
            newFeatures.push.apply(newFeatures, docChanges.newFeatures);
            bugFixes.push.apply(bugFixes, docChanges.bugFixes);
            improvements.push.apply(improvements, docChanges.improvements);
            documentation.push.apply(documentation, docChanges.documentation);
            ambiguousItems.push.apply(ambiguousItems, docChanges.ambiguousItems);
            totalConfidence += docChanges.confidence;
            documentCount++;
        }
        var overallConfidence = documentCount > 0 ? totalConfidence / documentCount : 0;
        return {
            breakingChanges: breakingChanges,
            newFeatures: newFeatures,
            bugFixes: bugFixes,
            improvements: improvements,
            documentation: documentation,
            metadata: {
                documentsAnalyzed: documentCount,
                extractionConfidence: overallConfidence,
                ambiguousItems: ambiguousItems,
                filteredItems: [] // Will be populated by the main extractor
            }
        };
    };
    /**
     * Build deduplication metadata from deduplication results
     */
    SimpleChangeExtractor.prototype.buildDeduplicationMetadata = function (results) {
        var totalOriginal = results.reduce(function (sum, r) { return sum + r.result.statistics.totalProcessed; }, 0);
        var totalRemoved = results.reduce(function (sum, r) { return sum + r.result.statistics.duplicatesRemoved; }, 0);
        var totalEffectiveness = results.reduce(function (sum, r) { return sum + r.result.statistics.effectiveness; }, 0) / results.length;
        var uncertainDuplicates = [];
        for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
            var _a = results_1[_i], type = _a.type, result = _a.result;
            for (var _b = 0, _c = result.uncertainDuplicates; _b < _c.length; _b++) {
                var uncertain = _c[_b];
                uncertainDuplicates.push({
                    changeType: type,
                    itemCount: uncertain.items.length,
                    similarity: uncertain.similarity,
                    suggestedAction: uncertain.suggestedAction,
                    items: uncertain.items.map(function (item) { return ({
                        id: item.id,
                        title: item.title,
                        source: item.source
                    }); })
                });
            }
        }
        return {
            originalCount: totalOriginal,
            duplicatesRemoved: totalRemoved,
            uncertainDuplicates: uncertainDuplicates,
            effectiveness: totalEffectiveness
        };
    };
    /**
     * Calculate confidence with deduplication considerations
     */
    SimpleChangeExtractor.prototype.calculateConfidenceWithDeduplication = function (changes, deduplicationMetadata) {
        var baseConfidence = changes.metadata.extractionConfidence;
        // Reduce confidence if there are many uncertain duplicates
        var uncertainRatio = deduplicationMetadata.uncertainDuplicates.length /
            Math.max(1, deduplicationMetadata.originalCount);
        if (uncertainRatio > 0.2) { // More than 20% uncertain
            baseConfidence *= (1 - uncertainRatio * 0.3); // Reduce by up to 30%
        }
        // Increase confidence slightly if deduplication was effective
        if (deduplicationMetadata.effectiveness > 0.1) { // More than 10% duplicates removed
            baseConfidence *= 1.05; // Small boost for effective deduplication
        }
        return Math.max(0.1, Math.min(1.0, baseConfidence));
    };
    /**
     * Calculate overall confidence from aggregated changes
     */
    SimpleChangeExtractor.prototype.calculateOverallConfidence = function (changes) {
        var totalItems = changes.breakingChanges.length + changes.newFeatures.length +
            changes.bugFixes.length + changes.improvements.length;
        if (totalItems === 0) {
            return changes.metadata.extractionConfidence;
        }
        // Reduce confidence if there are many ambiguous items
        var ambiguousRatio = changes.metadata.ambiguousItems.length / totalItems;
        var confidenceReduction = ambiguousRatio * 0.3; // Max 30% reduction
        return Math.max(0.1, changes.metadata.extractionConfidence - confidenceReduction);
    };
    /**
     * Calculate comprehensive confidence metrics for extracted changes
     */
    SimpleChangeExtractor.prototype.calculateConfidenceMetrics = function (changes, documents, patternMatches, sectionMatches) {
        return this.confidenceMetrics.calculateConfidenceScore(changes, documents, patternMatches, sectionMatches);
    };
    /**
     * Calculate confidence for individual change items
     */
    SimpleChangeExtractor.prototype.calculateItemConfidence = function (item, context) {
        return this.confidenceMetrics.calculateItemConfidence(item, context);
    };
    /**
     * Generate quality report for extraction results
     */
    SimpleChangeExtractor.prototype.generateQualityReport = function (confidenceScore, changes) {
        return this.confidenceMetrics.generateQualityReport(confidenceScore, changes);
    };
    /**
     * Enhanced validation with confidence metrics
     */
    SimpleChangeExtractor.prototype.validateExtractionWithConfidence = function (changes, documents, patternMatches, sectionMatches) {
        // Calculate confidence metrics
        var confidenceScore = this.calculateConfidenceMetrics(changes, documents, patternMatches, sectionMatches);
        // Get base validation
        var baseValidation = this.validateExtraction(changes);
        // Enhance validation with confidence insights
        var enhancedErrors = __spreadArray([], baseValidation.errors, true);
        var enhancedWarnings = __spreadArray([], baseValidation.warnings, true);
        var enhancedSuggestions = __spreadArray([], baseValidation.suggestions, true);
        // Add confidence-based errors
        for (var _i = 0, _a = confidenceScore.validation.thresholdViolations; _i < _a.length; _i++) {
            var violation = _a[_i];
            enhancedErrors.push({
                type: 'confidence',
                message: "Confidence threshold violation: ".concat(violation.threshold, " (expected: ").concat(violation.expected, ", actual: ").concat(violation.actual.toFixed(2), ")"),
                source: 'confidence-metrics'
            });
        }
        // Add uncertainty-based warnings
        for (var _b = 0, _c = confidenceScore.uncertainties; _b < _c.length; _b++) {
            var uncertainty = _c[_b];
            if (uncertainty.severity === 'high') {
                enhancedWarnings.push({
                    type: 'ambiguous',
                    message: uncertainty.description,
                    source: uncertainty.source,
                    suggestion: uncertainty.suggestedAction
                });
            }
        }
        // Add confidence-based suggestions
        for (var _d = 0, _e = confidenceScore.validation.recommendations; _d < _e.length; _d++) {
            var recommendation = _e[_d];
            enhancedSuggestions.push({
                type: 'validation',
                message: recommendation.description,
                action: recommendation.actions.join('; ')
            });
        }
        return __assign(__assign({}, baseValidation), { confidence: confidenceScore.overall, errors: enhancedErrors, warnings: enhancedWarnings, suggestions: enhancedSuggestions, valid: enhancedErrors.length === 0, confidenceScore: confidenceScore, status: confidenceScore.validation.status, thresholdViolations: confidenceScore.validation.thresholdViolations, recommendations: confidenceScore.validation.recommendations });
    };
    /**
     * Get categorization insights for validation
     */
    SimpleChangeExtractor.prototype.getCategorizationInsights = function (changes) {
        var totalCategorized = changes.breakingChanges.length + changes.newFeatures.length +
            changes.bugFixes.length + changes.improvements.length;
        var categoryDistribution = {
            'Breaking Changes': changes.breakingChanges.length,
            'New Features': changes.newFeatures.length,
            'Bug Fixes': changes.bugFixes.length,
            'Improvements': changes.improvements.length,
            'Documentation': changes.documentation.length
        };
        // Calculate average confidence (simplified - in real implementation would track per-item confidence)
        var averageConfidence = changes.metadata.extractionConfidence;
        // Identify low confidence items from ambiguous items
        var lowConfidenceItems = changes.metadata.ambiguousItems;
        return {
            totalCategorized: totalCategorized,
            categoryDistribution: categoryDistribution,
            averageConfidence: averageConfidence,
            lowConfidenceItems: lowConfidenceItems
        };
    };
    /**
     * Enhanced extraction with confidence tracking
     */
    SimpleChangeExtractor.prototype.extractChangesWithConfidence = function (documents) {
        return __awaiter(this, void 0, void 0, function () {
            var allPatternMatches, allSectionMatches, changes, confidenceScore, validation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allPatternMatches = [];
                        allSectionMatches = [];
                        return [4 /*yield*/, this.extractChangesWithTracking(documents, allPatternMatches, allSectionMatches)];
                    case 1:
                        changes = _a.sent();
                        confidenceScore = this.calculateConfidenceMetrics(changes, documents, allPatternMatches, allSectionMatches);
                        validation = this.validateExtractionWithConfidence(changes, documents, allPatternMatches, allSectionMatches);
                        return [2 /*return*/, {
                                changes: changes,
                                confidenceScore: confidenceScore,
                                validation: validation
                            }];
                }
            });
        });
    };
    /**
     * Extract changes with pattern and section match tracking
     */
    SimpleChangeExtractor.prototype.extractChangesWithTracking = function (documents, patternMatches, sectionMatches) {
        return __awaiter(this, void 0, void 0, function () {
            var allChanges, filteredDocuments, _i, documents_2, document_2, documentChanges, aggregated, deduplicated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allChanges = [];
                        filteredDocuments = [];
                        _i = 0, documents_2 = documents;
                        _a.label = 1;
                    case 1:
                        if (!(_i < documents_2.length)) return [3 /*break*/, 4];
                        document_2 = documents_2[_i];
                        // Check if document should be excluded
                        if (this.patternMatcher.shouldExcludeContent(document_2.content, document_2.path)) {
                            filteredDocuments.push(document_2.path);
                            return [3 /*break*/, 3];
                        }
                        return [4 /*yield*/, this.parseCompletionDocumentWithTracking(document_2, patternMatches, sectionMatches)];
                    case 2:
                        documentChanges = _a.sent();
                        allChanges.push(documentChanges);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        aggregated = this.aggregateChanges(allChanges);
                        // Add filtered documents to metadata
                        aggregated.metadata.filteredItems = filteredDocuments;
                        deduplicated = this.deduplicateChanges(aggregated);
                        return [2 /*return*/, deduplicated];
                }
            });
        });
    };
    /**
     * Parse completion document with pattern and section match tracking
     */
    SimpleChangeExtractor.prototype.parseCompletionDocumentWithTracking = function (document, patternMatches, sectionMatches) {
        return __awaiter(this, void 0, void 0, function () {
            var docSectionMatches, docPatternMatches;
            return __generator(this, function (_a) {
                docSectionMatches = this.patternMatcher.findSectionMatches(document.content);
                sectionMatches.push.apply(sectionMatches, docSectionMatches);
                if (docSectionMatches.length > 0) {
                    return [2 /*return*/, this.parseStructuredDocument(document, docSectionMatches)];
                }
                docPatternMatches = this.patternMatcher.findPatternMatches(document.content, document.path);
                patternMatches.push.apply(patternMatches, docPatternMatches);
                return [2 /*return*/, this.parseUnstructuredDocumentWithPatterns(document, docPatternMatches)];
            });
        });
    };
    /**
     * Parse unstructured document with pattern tracking
     */
    SimpleChangeExtractor.prototype.parseUnstructuredDocumentWithPatterns = function (document, patternMatches) {
        var breakingChanges = [];
        var newFeatures = [];
        var bugFixes = [];
        var improvements = [];
        var documentation = [];
        var ambiguousItems = [];
        var totalConfidence = 0;
        var matchCount = 0;
        for (var _i = 0, patternMatches_3 = patternMatches; _i < patternMatches_3.length; _i++) {
            var match = patternMatches_3[_i];
            totalConfidence += match.confidence;
            matchCount++;
            var changeItem = this.createChangeFromPattern(match, document);
            if (match.confidence < this.config.confidenceThresholds.uncertaintyThreshold) {
                ambiguousItems.push("".concat(match.match, " (line ").concat(match.line, ")"));
            }
            switch (match.type) {
                case 'breaking':
                    breakingChanges.push(changeItem);
                    break;
                case 'feature':
                    newFeatures.push(changeItem);
                    break;
                case 'bugfix':
                    bugFixes.push(changeItem);
                    break;
                case 'improvement':
                    improvements.push(changeItem);
                    break;
                case 'documentation':
                    documentation.push(changeItem);
                    break;
            }
        }
        var confidence = matchCount > 0 ? totalConfidence / matchCount : 0.3;
        return {
            document: document,
            breakingChanges: breakingChanges,
            newFeatures: newFeatures,
            bugFixes: bugFixes,
            improvements: improvements,
            documentation: documentation,
            confidence: confidence,
            ambiguousItems: ambiguousItems
        };
    };
    return SimpleChangeExtractor;
}());
exports.SimpleChangeExtractor = SimpleChangeExtractor;
