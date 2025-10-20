"use strict";
/**
 * Deduplication Engine
 *
 * Enhanced deduplication system with similarity detection, change merging,
 * and manual review flagging for uncertain duplicates.
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
exports.DeduplicationEngine = void 0;
var DeduplicationEngine = /** @class */ (function () {
    function DeduplicationEngine(confidenceThresholds) {
        /** Similarity threshold for considering items as duplicates */
        this.DUPLICATE_THRESHOLD = 0.6;
        /** Similarity threshold for flagging uncertain duplicates */
        this.UNCERTAIN_THRESHOLD = 0.4;
        /** Maximum similarity threshold - items above this are definitely duplicates */
        this.DEFINITE_DUPLICATE_THRESHOLD = 0.85;
        this.confidenceThresholds = confidenceThresholds;
    }
    /**
     * Deduplicate breaking changes with enhanced similarity detection
     */
    DeduplicationEngine.prototype.deduplicateBreakingChanges = function (changes) {
        var _this = this;
        return this.deduplicateItems(changes, function (item1, item2) {
            var titleSim = _this.calculateTextSimilarity(item1.title, item2.title);
            var descSim = _this.calculateTextSimilarity(item1.description, item2.description);
            var apiSim = _this.calculateArraySimilarity(item1.affectedAPIs, item2.affectedAPIs);
            return {
                overall: (titleSim * 0.4 + descSim * 0.4 + apiSim * 0.2),
                title: titleSim,
                description: descSim,
                metadata: apiSim
            };
        }, this.mergeBreakingChanges.bind(this));
    };
    /**
     * Deduplicate features with enhanced similarity detection
     */
    DeduplicationEngine.prototype.deduplicateFeatures = function (features) {
        var _this = this;
        return this.deduplicateItems(features, function (item1, item2) {
            var titleSim = _this.calculateTextSimilarity(item1.title, item2.title);
            var descSim = _this.calculateTextSimilarity(item1.description, item2.description);
            var benefitsSim = _this.calculateArraySimilarity(item1.benefits, item2.benefits);
            var artifactsSim = _this.calculateArraySimilarity(item1.artifacts, item2.artifacts);
            return {
                overall: (titleSim * 0.3 + descSim * 0.3 + benefitsSim * 0.2 + artifactsSim * 0.2),
                title: titleSim,
                description: descSim,
                metadata: (benefitsSim + artifactsSim) / 2
            };
        }, this.mergeFeatures.bind(this));
    };
    /**
     * Deduplicate bug fixes with enhanced similarity detection
     */
    DeduplicationEngine.prototype.deduplicateBugFixes = function (bugFixes) {
        var _this = this;
        return this.deduplicateItems(bugFixes, function (item1, item2) {
            var titleSim = _this.calculateTextSimilarity(item1.title, item2.title);
            var descSim = _this.calculateTextSimilarity(item1.description, item2.description);
            var componentsSim = _this.calculateArraySimilarity(item1.affectedComponents, item2.affectedComponents);
            var issueSim = item1.issueNumber && item2.issueNumber ?
                (item1.issueNumber === item2.issueNumber ? 1.0 : 0.0) : 0.5;
            return {
                overall: (titleSim * 0.3 + descSim * 0.3 + componentsSim * 0.2 + issueSim * 0.2),
                title: titleSim,
                description: descSim,
                metadata: (componentsSim + issueSim) / 2
            };
        }, this.mergeBugFixes.bind(this));
    };
    /**
     * Deduplicate improvements with enhanced similarity detection
     */
    DeduplicationEngine.prototype.deduplicateImprovements = function (improvements) {
        var _this = this;
        return this.deduplicateItems(improvements, function (item1, item2) {
            var titleSim = _this.calculateTextSimilarity(item1.title, item2.title);
            var descSim = _this.calculateTextSimilarity(item1.description, item2.description);
            var typeSim = item1.type === item2.type ? 1.0 : 0.0;
            return {
                overall: (titleSim * 0.4 + descSim * 0.4 + typeSim * 0.2),
                title: titleSim,
                description: descSim,
                metadata: typeSim
            };
        }, this.mergeImprovements.bind(this));
    };
    /**
     * Deduplicate documentation changes with enhanced similarity detection
     */
    DeduplicationEngine.prototype.deduplicateDocumentation = function (documentation) {
        var _this = this;
        return this.deduplicateItems(documentation, function (item1, item2) {
            var titleSim = _this.calculateTextSimilarity(item1.title, item2.title);
            var descSim = _this.calculateTextSimilarity(item1.description, item2.description);
            var typeSim = item1.type === item2.type ? 1.0 : 0.0;
            return {
                overall: (titleSim * 0.4 + descSim * 0.4 + typeSim * 0.2),
                title: titleSim,
                description: descSim,
                metadata: typeSim
            };
        }, this.mergeDocumentation.bind(this));
    };
    /**
     * Generic deduplication algorithm with similarity calculation and merging
     */
    DeduplicationEngine.prototype.deduplicateItems = function (items, calculateSimilarity, mergeItems) {
        var _this = this;
        var _a;
        var result = [];
        var mergedItems = [];
        var uncertainDuplicates = [];
        var processed = new Set();
        for (var i = 0; i < items.length; i++) {
            var currentItem = items[i];
            if (processed.has(currentItem.id)) {
                continue;
            }
            var similarItems = [];
            // Find all similar items
            for (var j = i + 1; j < items.length; j++) {
                var compareItem = items[j];
                if (processed.has(compareItem.id)) {
                    continue;
                }
                var similarity = calculateSimilarity(currentItem, compareItem);
                if (similarity.overall >= this.UNCERTAIN_THRESHOLD) {
                    similarItems.push({ item: compareItem, similarity: similarity });
                }
            }
            if (similarItems.length === 0) {
                // No similar items found, keep as is
                result.push(currentItem);
                processed.add(currentItem.id);
            }
            else {
                // Group items by similarity level
                var definiteDuplicates = similarItems.filter(function (s) { return s.similarity.overall >= _this.DEFINITE_DUPLICATE_THRESHOLD; });
                var likelyDuplicates = similarItems.filter(function (s) {
                    return s.similarity.overall >= _this.DUPLICATE_THRESHOLD &&
                        s.similarity.overall < _this.DEFINITE_DUPLICATE_THRESHOLD;
                });
                var uncertainItems = similarItems.filter(function (s) {
                    return s.similarity.overall >= _this.UNCERTAIN_THRESHOLD &&
                        s.similarity.overall < _this.DUPLICATE_THRESHOLD;
                });
                if (definiteDuplicates.length > 0) {
                    // Merge definite duplicates
                    var itemsToMerge = __spreadArray([currentItem], definiteDuplicates.map(function (d) { return d.item; }), true);
                    var merged = mergeItems(itemsToMerge);
                    result.push(merged);
                    mergedItems.push({
                        result: merged,
                        sources: itemsToMerge,
                        similarities: definiteDuplicates.map(function (d) { return d.similarity.overall; }),
                        reason: 'High similarity (>90%) - automatic merge'
                    });
                    // Mark all merged items as processed
                    itemsToMerge.forEach(function (item) { return processed.add(item.id); });
                }
                else if (likelyDuplicates.length > 0) {
                    // Merge likely duplicates
                    var itemsToMerge = __spreadArray([currentItem], likelyDuplicates.map(function (d) { return d.item; }), true);
                    var merged = mergeItems(itemsToMerge);
                    result.push(merged);
                    mergedItems.push({
                        result: merged,
                        sources: itemsToMerge,
                        similarities: likelyDuplicates.map(function (d) { return d.similarity.overall; }),
                        reason: 'Moderate similarity (70-90%) - automatic merge'
                    });
                    // Mark all merged items as processed
                    itemsToMerge.forEach(function (item) { return processed.add(item.id); });
                }
                else {
                    // Flag uncertain items for manual review
                    var uncertainItemsList = __spreadArray([currentItem], uncertainItems.map(function (u) { return u.item; }), true);
                    uncertainDuplicates.push({
                        items: uncertainItemsList,
                        similarity: Math.max.apply(Math, uncertainItems.map(function (u) { return u.similarity.overall; })),
                        reason: 'Moderate similarity (50-70%) - requires manual review',
                        suggestedAction: this.determineSuggestedAction((_a = uncertainItems[0]) === null || _a === void 0 ? void 0 : _a.similarity)
                    });
                    // Keep all uncertain items separate for now
                    result.push(currentItem);
                    processed.add(currentItem.id);
                }
            }
        }
        var statistics = {
            totalProcessed: items.length,
            duplicatesRemoved: items.length - result.length,
            uncertainItems: uncertainDuplicates.reduce(function (sum, group) { return sum + group.items.length; }, 0),
            finalCount: result.length,
            effectiveness: items.length > 0 ? (items.length - result.length) / items.length : 0
        };
        return {
            items: result,
            mergedItems: mergedItems,
            uncertainDuplicates: uncertainDuplicates,
            statistics: statistics
        };
    };
    /**
     * Calculate text similarity between two strings
     */
    DeduplicationEngine.prototype.calculateTextSimilarity = function (text1, text2) {
        var normalized1 = this.normalizeText(text1);
        var normalized2 = this.normalizeText(text2);
        if (normalized1 === normalized2) {
            return 1.0;
        }
        // Check for exact substring matches
        if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
            var shorter = normalized1.length < normalized2.length ? normalized1 : normalized2;
            var longer = normalized1.length >= normalized2.length ? normalized1 : normalized2;
            return Math.max(0.8, shorter.length / longer.length);
        }
        // Calculate word overlap similarity
        var words1 = normalized1.split(' ').filter(function (w) { return w.length > 1; }); // Include 2-letter words
        var words2 = normalized2.split(' ').filter(function (w) { return w.length > 1; });
        if (words1.length === 0 && words2.length === 0)
            return 1.0;
        if (words1.length === 0 || words2.length === 0)
            return 0.0;
        var commonWords = words1.filter(function (word) { return words2.includes(word); });
        // Use Jaccard similarity (intersection over union)
        var totalWords = Math.max(words1.length, words2.length);
        var similarity = commonWords.length / totalWords;
        // Boost similarity if there are many common words
        if (commonWords.length >= 2 && similarity > 0.3) {
            return Math.min(1.0, similarity * 1.2);
        }
        return similarity;
    };
    /**
     * Calculate similarity between two arrays of strings
     */
    DeduplicationEngine.prototype.calculateArraySimilarity = function (array1, array2) {
        var _this = this;
        if (array1.length === 0 && array2.length === 0)
            return 1.0;
        if (array1.length === 0 || array2.length === 0)
            return 0.0;
        var set1 = new Set(array1.map(function (item) { return _this.normalizeText(item); }));
        var set2 = new Set(array2.map(function (item) { return _this.normalizeText(item); }));
        var intersection = new Set(__spreadArray([], set1, true).filter(function (item) { return set2.has(item); }));
        var union = new Set(__spreadArray(__spreadArray([], set1, true), set2, true));
        return intersection.size / union.size;
    };
    /**
     * Normalize text for comparison
     */
    DeduplicationEngine.prototype.normalizeText = function (text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    };
    /**
     * Determine suggested action based on similarity metrics
     */
    DeduplicationEngine.prototype.determineSuggestedAction = function (similarity) {
        if (!similarity)
            return 'needs-clarification';
        if (similarity.overall > 0.6) {
            return 'merge';
        }
        else if (similarity.title > 0.8 || similarity.metadata > 0.8) {
            return 'merge';
        }
        else if (similarity.overall < 0.3) {
            return 'keep-separate';
        }
        else {
            return 'needs-clarification';
        }
    };
    /**
     * Merge multiple breaking changes into one
     */
    DeduplicationEngine.prototype.mergeBreakingChanges = function (changes) {
        var primary = this.selectPrimaryItem(changes);
        return __assign(__assign({}, primary), { description: this.mergeDescriptions(changes.map(function (c) { return c.description; })), affectedAPIs: this.mergeArrays(changes.map(function (c) { return c.affectedAPIs; })), migrationGuidance: this.mergeMigrationGuidance(changes), source: this.mergeSources(changes.map(function (c) { return c.source; })), severity: this.selectHighestSeverity(changes.map(function (c) { return c.severity; })) });
    };
    /**
     * Merge multiple features into one
     */
    DeduplicationEngine.prototype.mergeFeatures = function (features) {
        var primary = this.selectPrimaryItem(features);
        return __assign(__assign({}, primary), { description: this.mergeDescriptions(features.map(function (f) { return f.description; })), benefits: this.mergeArrays(features.map(function (f) { return f.benefits; })), requirements: this.mergeArrays(features.map(function (f) { return f.requirements; })), artifacts: this.mergeArrays(features.map(function (f) { return f.artifacts; })), source: this.mergeSources(features.map(function (f) { return f.source; })), category: primary.category // Keep primary category
         });
    };
    /**
     * Merge multiple bug fixes into one
     */
    DeduplicationEngine.prototype.mergeBugFixes = function (bugFixes) {
        var primary = this.selectPrimaryItem(bugFixes);
        return __assign(__assign({}, primary), { description: this.mergeDescriptions(bugFixes.map(function (b) { return b.description; })), affectedComponents: this.mergeArrays(bugFixes.map(function (b) { return b.affectedComponents; })), source: this.mergeSources(bugFixes.map(function (b) { return b.source; })), severity: this.selectHighestSeverity(bugFixes.map(function (b) { return b.severity; })), issueNumber: primary.issueNumber // Keep primary issue number
         });
    };
    /**
     * Merge multiple improvements into one
     */
    DeduplicationEngine.prototype.mergeImprovements = function (improvements) {
        var primary = this.selectPrimaryItem(improvements);
        return __assign(__assign({}, primary), { description: this.mergeDescriptions(improvements.map(function (i) { return i.description; })), source: this.mergeSources(improvements.map(function (i) { return i.source; })), impact: this.selectHighestImpact(improvements.map(function (i) { return i.impact; })) });
    };
    /**
     * Merge multiple documentation changes into one
     */
    DeduplicationEngine.prototype.mergeDocumentation = function (docs) {
        var primary = this.selectPrimaryItem(docs);
        return __assign(__assign({}, primary), { description: this.mergeDescriptions(docs.map(function (d) { return d.description; })), source: this.mergeSources(docs.map(function (d) { return d.source; })) });
    };
    /**
     * Select the primary item from a list (most detailed)
     */
    DeduplicationEngine.prototype.selectPrimaryItem = function (items) {
        return items.reduce(function (primary, current) {
            if (current.description.length > primary.description.length) {
                return current;
            }
            // Count non-empty fields as a tiebreaker
            var primaryFields = Object.values(primary).filter(function (v) { return v && v.toString().length > 0; }).length;
            var currentFields = Object.values(current).filter(function (v) { return v && v.toString().length > 0; }).length;
            return currentFields > primaryFields ? current : primary;
        });
    };
    /**
     * Merge multiple descriptions into one comprehensive description
     */
    DeduplicationEngine.prototype.mergeDescriptions = function (descriptions) {
        var unique = __spreadArray([], new Set(descriptions.map(function (d) { return d.trim(); })), true);
        if (unique.length === 1) {
            return unique[0];
        }
        // Find the most comprehensive description
        var longest = unique.reduce(function (longest, current) {
            return current.length > longest.length ? current : longest;
        });
        // Add unique information from other descriptions
        var additionalInfo = unique
            .filter(function (desc) { return desc !== longest; })
            .filter(function (desc) { return !longest.toLowerCase().includes(desc.toLowerCase()); })
            .join(' ');
        return additionalInfo ? "".concat(longest, " ").concat(additionalInfo).trim() : longest;
    };
    /**
     * Merge multiple arrays into one deduplicated array
     */
    DeduplicationEngine.prototype.mergeArrays = function (arrays) {
        var combined = arrays.flat();
        return __spreadArray([], new Set(combined.map(function (item) { return item.trim(); }).filter(function (item) { return item.length > 0; })), true);
    };
    /**
     * Merge multiple sources into one source string
     */
    DeduplicationEngine.prototype.mergeSources = function (sources) {
        var unique = __spreadArray([], new Set(sources), true);
        return unique.join(', ');
    };
    /**
     * Merge migration guidance from multiple breaking changes
     */
    DeduplicationEngine.prototype.mergeMigrationGuidance = function (changes) {
        var guidance = changes
            .map(function (c) { return c.migrationGuidance; })
            .filter(function (g) { return g && g.length > 0; });
        if (guidance.length === 0)
            return undefined;
        if (guidance.length === 1)
            return guidance[0];
        return __spreadArray([], new Set(guidance), true).join(' ');
    };
    /**
     * Select the highest severity from a list
     */
    DeduplicationEngine.prototype.selectHighestSeverity = function (severities) {
        var severityOrder = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
        return severities.reduce(function (highest, current) {
            return severityOrder[current] > severityOrder[highest] ? current : highest;
        });
    };
    /**
     * Select the highest impact from a list
     */
    DeduplicationEngine.prototype.selectHighestImpact = function (impacts) {
        var impactOrder = { 'low': 1, 'medium': 2, 'high': 3 };
        return impacts.reduce(function (highest, current) {
            return impactOrder[current] > impactOrder[highest] ? current : highest;
        });
    };
    return DeduplicationEngine;
}());
exports.DeduplicationEngine = DeduplicationEngine;
