"use strict";
/**
 * Deduplication Engine
 *
 * Enhanced deduplication system with similarity detection, change merging,
 * and manual review flagging for uncertain duplicates.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeduplicationEngine = void 0;
class DeduplicationEngine {
    constructor(confidenceThresholds) {
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
    deduplicateBreakingChanges(changes) {
        return this.deduplicateItems(changes, (item1, item2) => {
            const titleSim = this.calculateTextSimilarity(item1.title, item2.title);
            const descSim = this.calculateTextSimilarity(item1.description, item2.description);
            const apiSim = this.calculateArraySimilarity(item1.affectedAPIs, item2.affectedAPIs);
            return {
                overall: (titleSim * 0.4 + descSim * 0.4 + apiSim * 0.2),
                title: titleSim,
                description: descSim,
                metadata: apiSim
            };
        }, this.mergeBreakingChanges.bind(this));
    }
    /**
     * Deduplicate features with enhanced similarity detection
     */
    deduplicateFeatures(features) {
        return this.deduplicateItems(features, (item1, item2) => {
            const titleSim = this.calculateTextSimilarity(item1.title, item2.title);
            const descSim = this.calculateTextSimilarity(item1.description, item2.description);
            const benefitsSim = this.calculateArraySimilarity(item1.benefits, item2.benefits);
            const artifactsSim = this.calculateArraySimilarity(item1.artifacts, item2.artifacts);
            return {
                overall: (titleSim * 0.3 + descSim * 0.3 + benefitsSim * 0.2 + artifactsSim * 0.2),
                title: titleSim,
                description: descSim,
                metadata: (benefitsSim + artifactsSim) / 2
            };
        }, this.mergeFeatures.bind(this));
    }
    /**
     * Deduplicate bug fixes with enhanced similarity detection
     */
    deduplicateBugFixes(bugFixes) {
        return this.deduplicateItems(bugFixes, (item1, item2) => {
            const titleSim = this.calculateTextSimilarity(item1.title, item2.title);
            const descSim = this.calculateTextSimilarity(item1.description, item2.description);
            const componentsSim = this.calculateArraySimilarity(item1.affectedComponents, item2.affectedComponents);
            const issueSim = item1.issueNumber && item2.issueNumber ?
                (item1.issueNumber === item2.issueNumber ? 1.0 : 0.0) : 0.5;
            return {
                overall: (titleSim * 0.3 + descSim * 0.3 + componentsSim * 0.2 + issueSim * 0.2),
                title: titleSim,
                description: descSim,
                metadata: (componentsSim + issueSim) / 2
            };
        }, this.mergeBugFixes.bind(this));
    }
    /**
     * Deduplicate improvements with enhanced similarity detection
     */
    deduplicateImprovements(improvements) {
        return this.deduplicateItems(improvements, (item1, item2) => {
            const titleSim = this.calculateTextSimilarity(item1.title, item2.title);
            const descSim = this.calculateTextSimilarity(item1.description, item2.description);
            const typeSim = item1.type === item2.type ? 1.0 : 0.0;
            return {
                overall: (titleSim * 0.4 + descSim * 0.4 + typeSim * 0.2),
                title: titleSim,
                description: descSim,
                metadata: typeSim
            };
        }, this.mergeImprovements.bind(this));
    }
    /**
     * Deduplicate documentation changes with enhanced similarity detection
     */
    deduplicateDocumentation(documentation) {
        return this.deduplicateItems(documentation, (item1, item2) => {
            const titleSim = this.calculateTextSimilarity(item1.title, item2.title);
            const descSim = this.calculateTextSimilarity(item1.description, item2.description);
            const typeSim = item1.type === item2.type ? 1.0 : 0.0;
            return {
                overall: (titleSim * 0.4 + descSim * 0.4 + typeSim * 0.2),
                title: titleSim,
                description: descSim,
                metadata: typeSim
            };
        }, this.mergeDocumentation.bind(this));
    }
    /**
     * Generic deduplication algorithm with similarity calculation and merging
     */
    deduplicateItems(items, calculateSimilarity, mergeItems) {
        const result = [];
        const mergedItems = [];
        const uncertainDuplicates = [];
        const processed = new Set();
        for (let i = 0; i < items.length; i++) {
            const currentItem = items[i];
            if (processed.has(currentItem.id)) {
                continue;
            }
            const similarItems = [];
            // Find all similar items
            for (let j = i + 1; j < items.length; j++) {
                const compareItem = items[j];
                if (processed.has(compareItem.id)) {
                    continue;
                }
                const similarity = calculateSimilarity(currentItem, compareItem);
                if (similarity.overall >= this.UNCERTAIN_THRESHOLD) {
                    similarItems.push({ item: compareItem, similarity });
                }
            }
            if (similarItems.length === 0) {
                // No similar items found, keep as is
                result.push(currentItem);
                processed.add(currentItem.id);
            }
            else {
                // Group items by similarity level
                const definiteDuplicates = similarItems.filter(s => s.similarity.overall >= this.DEFINITE_DUPLICATE_THRESHOLD);
                const likelyDuplicates = similarItems.filter(s => s.similarity.overall >= this.DUPLICATE_THRESHOLD &&
                    s.similarity.overall < this.DEFINITE_DUPLICATE_THRESHOLD);
                const uncertainItems = similarItems.filter(s => s.similarity.overall >= this.UNCERTAIN_THRESHOLD &&
                    s.similarity.overall < this.DUPLICATE_THRESHOLD);
                if (definiteDuplicates.length > 0) {
                    // Merge definite duplicates
                    const itemsToMerge = [currentItem, ...definiteDuplicates.map(d => d.item)];
                    const merged = mergeItems(itemsToMerge);
                    result.push(merged);
                    mergedItems.push({
                        result: merged,
                        sources: itemsToMerge,
                        similarities: definiteDuplicates.map(d => d.similarity.overall),
                        reason: 'High similarity (>90%) - automatic merge'
                    });
                    // Mark all merged items as processed
                    itemsToMerge.forEach(item => processed.add(item.id));
                }
                else if (likelyDuplicates.length > 0) {
                    // Merge likely duplicates
                    const itemsToMerge = [currentItem, ...likelyDuplicates.map(d => d.item)];
                    const merged = mergeItems(itemsToMerge);
                    result.push(merged);
                    mergedItems.push({
                        result: merged,
                        sources: itemsToMerge,
                        similarities: likelyDuplicates.map(d => d.similarity.overall),
                        reason: 'Moderate similarity (70-90%) - automatic merge'
                    });
                    // Mark all merged items as processed
                    itemsToMerge.forEach(item => processed.add(item.id));
                }
                else {
                    // Flag uncertain items for manual review
                    const uncertainItemsList = [currentItem, ...uncertainItems.map(u => u.item)];
                    uncertainDuplicates.push({
                        items: uncertainItemsList,
                        similarity: Math.max(...uncertainItems.map(u => u.similarity.overall)),
                        reason: 'Moderate similarity (50-70%) - requires manual review',
                        suggestedAction: this.determineSuggestedAction(uncertainItems[0]?.similarity)
                    });
                    // Keep all uncertain items separate for now
                    result.push(currentItem);
                    processed.add(currentItem.id);
                }
            }
        }
        const statistics = {
            totalProcessed: items.length,
            duplicatesRemoved: items.length - result.length,
            uncertainItems: uncertainDuplicates.reduce((sum, group) => sum + group.items.length, 0),
            finalCount: result.length,
            effectiveness: items.length > 0 ? (items.length - result.length) / items.length : 0
        };
        return {
            items: result,
            mergedItems,
            uncertainDuplicates,
            statistics
        };
    }
    /**
     * Calculate text similarity between two strings
     */
    calculateTextSimilarity(text1, text2) {
        const normalized1 = this.normalizeText(text1);
        const normalized2 = this.normalizeText(text2);
        if (normalized1 === normalized2) {
            return 1.0;
        }
        // Check for exact substring matches
        if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
            const shorter = normalized1.length < normalized2.length ? normalized1 : normalized2;
            const longer = normalized1.length >= normalized2.length ? normalized1 : normalized2;
            return Math.max(0.8, shorter.length / longer.length);
        }
        // Calculate word overlap similarity
        const words1 = normalized1.split(' ').filter(w => w.length > 1); // Include 2-letter words
        const words2 = normalized2.split(' ').filter(w => w.length > 1);
        if (words1.length === 0 && words2.length === 0)
            return 1.0;
        if (words1.length === 0 || words2.length === 0)
            return 0.0;
        const commonWords = words1.filter(word => words2.includes(word));
        // Use Jaccard similarity (intersection over union)
        const totalWords = Math.max(words1.length, words2.length);
        const similarity = commonWords.length / totalWords;
        // Boost similarity if there are many common words
        if (commonWords.length >= 2 && similarity > 0.3) {
            return Math.min(1.0, similarity * 1.2);
        }
        return similarity;
    }
    /**
     * Calculate similarity between two arrays of strings
     */
    calculateArraySimilarity(array1, array2) {
        if (array1.length === 0 && array2.length === 0)
            return 1.0;
        if (array1.length === 0 || array2.length === 0)
            return 0.0;
        const set1 = new Set(array1.map(item => this.normalizeText(item)));
        const set2 = new Set(array2.map(item => this.normalizeText(item)));
        const intersection = new Set([...set1].filter(item => set2.has(item)));
        const union = new Set([...set1, ...set2]);
        return intersection.size / union.size;
    }
    /**
     * Normalize text for comparison
     */
    normalizeText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
    /**
     * Determine suggested action based on similarity metrics
     */
    determineSuggestedAction(similarity) {
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
    }
    /**
     * Merge multiple breaking changes into one
     */
    mergeBreakingChanges(changes) {
        const primary = this.selectPrimaryItem(changes);
        return {
            ...primary,
            description: this.mergeDescriptions(changes.map(c => c.description)),
            affectedAPIs: this.mergeArrays(changes.map(c => c.affectedAPIs)),
            migrationGuidance: this.mergeMigrationGuidance(changes),
            source: this.mergeSources(changes.map(c => c.source)),
            severity: this.selectHighestSeverity(changes.map(c => c.severity))
        };
    }
    /**
     * Merge multiple features into one
     */
    mergeFeatures(features) {
        const primary = this.selectPrimaryItem(features);
        return {
            ...primary,
            description: this.mergeDescriptions(features.map(f => f.description)),
            benefits: this.mergeArrays(features.map(f => f.benefits)),
            requirements: this.mergeArrays(features.map(f => f.requirements)),
            artifacts: this.mergeArrays(features.map(f => f.artifacts)),
            source: this.mergeSources(features.map(f => f.source)),
            category: primary.category // Keep primary category
        };
    }
    /**
     * Merge multiple bug fixes into one
     */
    mergeBugFixes(bugFixes) {
        const primary = this.selectPrimaryItem(bugFixes);
        return {
            ...primary,
            description: this.mergeDescriptions(bugFixes.map(b => b.description)),
            affectedComponents: this.mergeArrays(bugFixes.map(b => b.affectedComponents)),
            source: this.mergeSources(bugFixes.map(b => b.source)),
            severity: this.selectHighestSeverity(bugFixes.map(b => b.severity)),
            issueNumber: primary.issueNumber // Keep primary issue number
        };
    }
    /**
     * Merge multiple improvements into one
     */
    mergeImprovements(improvements) {
        const primary = this.selectPrimaryItem(improvements);
        return {
            ...primary,
            description: this.mergeDescriptions(improvements.map(i => i.description)),
            source: this.mergeSources(improvements.map(i => i.source)),
            impact: this.selectHighestImpact(improvements.map(i => i.impact))
        };
    }
    /**
     * Merge multiple documentation changes into one
     */
    mergeDocumentation(docs) {
        const primary = this.selectPrimaryItem(docs);
        return {
            ...primary,
            description: this.mergeDescriptions(docs.map(d => d.description)),
            source: this.mergeSources(docs.map(d => d.source))
        };
    }
    /**
     * Select the primary item from a list (most detailed)
     */
    selectPrimaryItem(items) {
        return items.reduce((primary, current) => {
            if (current.description.length > primary.description.length) {
                return current;
            }
            // Count non-empty fields as a tiebreaker
            const primaryFields = Object.values(primary).filter(v => v && v.toString().length > 0).length;
            const currentFields = Object.values(current).filter(v => v && v.toString().length > 0).length;
            return currentFields > primaryFields ? current : primary;
        });
    }
    /**
     * Merge multiple descriptions into one comprehensive description
     */
    mergeDescriptions(descriptions) {
        const unique = [...new Set(descriptions.map(d => d.trim()))];
        if (unique.length === 1) {
            return unique[0];
        }
        // Find the most comprehensive description
        const longest = unique.reduce((longest, current) => current.length > longest.length ? current : longest);
        // Add unique information from other descriptions
        const additionalInfo = unique
            .filter(desc => desc !== longest)
            .filter(desc => !longest.toLowerCase().includes(desc.toLowerCase()))
            .join(' ');
        return additionalInfo ? `${longest} ${additionalInfo}`.trim() : longest;
    }
    /**
     * Merge multiple arrays into one deduplicated array
     */
    mergeArrays(arrays) {
        const combined = arrays.flat();
        return [...new Set(combined.map(item => item.trim()).filter(item => item.length > 0))];
    }
    /**
     * Merge multiple sources into one source string
     */
    mergeSources(sources) {
        const unique = [...new Set(sources)];
        return unique.join(', ');
    }
    /**
     * Merge migration guidance from multiple breaking changes
     */
    mergeMigrationGuidance(changes) {
        const guidance = changes
            .map(c => c.migrationGuidance)
            .filter(g => g && g.length > 0);
        if (guidance.length === 0)
            return undefined;
        if (guidance.length === 1)
            return guidance[0];
        return [...new Set(guidance)].join(' ');
    }
    /**
     * Select the highest severity from a list
     */
    selectHighestSeverity(severities) {
        const severityOrder = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
        return severities.reduce((highest, current) => severityOrder[current] > severityOrder[highest] ? current : highest);
    }
    /**
     * Select the highest impact from a list
     */
    selectHighestImpact(impacts) {
        const impactOrder = { 'low': 1, 'medium': 2, 'high': 3 };
        return impacts.reduce((highest, current) => impactOrder[current] > impactOrder[highest] ? current : highest);
    }
}
exports.DeduplicationEngine = DeduplicationEngine;
//# sourceMappingURL=DeduplicationEngine.js.map