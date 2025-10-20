"use strict";
/**
 * Pattern Matcher for Change Extraction
 *
 * Implements regex-based pattern matching for detecting different types of changes
 * in completion documents. Provides both keyword-based and section-based matching.
 */
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
exports.PatternMatcher = void 0;
var PatternMatcher = /** @class */ (function () {
    function PatternMatcher(config) {
        this.config = config;
    }
    /**
     * Find all pattern matches in document content
     */
    PatternMatcher.prototype.findPatternMatches = function (content, documentPath) {
        var matches = [];
        var lines = content.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var lineNumber = i + 1;
            // Check for breaking change patterns
            var breakingMatches = this.findKeywordMatches(line, this.config.breakingChangeKeywords, 'breaking', lineNumber, this.getContext(lines, i));
            matches.push.apply(matches, breakingMatches);
            // Check for feature patterns
            var featureMatches = this.findKeywordMatches(line, this.config.featureKeywords, 'feature', lineNumber, this.getContext(lines, i));
            matches.push.apply(matches, featureMatches);
            // Check for bug fix patterns
            var bugFixMatches = this.findKeywordMatches(line, this.config.bugFixKeywords, 'bugfix', lineNumber, this.getContext(lines, i));
            matches.push.apply(matches, bugFixMatches);
            // Check for improvement patterns
            var improvementMatches = this.findKeywordMatches(line, this.config.improvementKeywords, 'improvement', lineNumber, this.getContext(lines, i));
            matches.push.apply(matches, improvementMatches);
            // Check for documentation patterns
            var docMatches = this.findKeywordMatches(line, this.config.documentationKeywords, 'documentation', lineNumber, this.getContext(lines, i));
            matches.push.apply(matches, docMatches);
        }
        return this.deduplicateMatches(matches);
    };
    /**
     * Find structured sections in document content
     */
    PatternMatcher.prototype.findSectionMatches = function (content) {
        var matches = [];
        var lines = content.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            // Check if line is a header (starts with # or is underlined)
            if (this.isHeader(line, lines, i)) {
                var headerText = this.extractHeaderText(line, lines, i);
                var sectionType = this.classifyHeader(headerText);
                if (sectionType) {
                    var sectionContent = this.extractSectionContent(lines, i);
                    var confidence = this.calculateSectionConfidence(headerText, sectionContent.content);
                    matches.push({
                        header: headerText,
                        content: sectionContent.content,
                        startLine: i + 1,
                        endLine: sectionContent.endLine,
                        type: sectionType,
                        confidence: confidence
                    });
                }
            }
        }
        return matches;
    };
    /**
     * Check if content should be excluded based on documentation patterns
     */
    PatternMatcher.prototype.shouldExcludeContent = function (content, documentPath) {
        // Check if document path matches exclude patterns
        for (var _i = 0, _a = this.config.excludePatterns; _i < _a.length; _i++) {
            var pattern = _a[_i];
            var regex = this.globToRegex(pattern);
            if (regex.test(documentPath)) {
                return true;
            }
        }
        // Check if content is primarily documentation
        var docKeywordCount = this.countKeywordMatches(content, this.config.documentationKeywords);
        var totalKeywordCount = this.countAllKeywordMatches(content);
        // If more than 80% of keywords are documentation-related, exclude
        if (totalKeywordCount > 0 && (docKeywordCount / totalKeywordCount) > 0.8) {
            return true;
        }
        // Check for documentation-only indicators
        var docOnlyPatterns = [
            /^#\s*(readme|documentation|docs|guide|tutorial)/i,
            /^##\s*(usage|examples|installation|setup)/i,
            /^\s*<!--.*documentation.*-->/i,
            /^\s*\*\s*(updated?\s+)?(readme|docs|documentation)/i
        ];
        for (var _b = 0, docOnlyPatterns_1 = docOnlyPatterns; _b < docOnlyPatterns_1.length; _b++) {
            var pattern = docOnlyPatterns_1[_b];
            if (pattern.test(content)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Find keyword matches in a line of text
     */
    PatternMatcher.prototype.findKeywordMatches = function (line, keywords, type, lineNumber, context) {
        var matches = [];
        var lowerLine = line.toLowerCase();
        for (var _i = 0, keywords_1 = keywords; _i < keywords_1.length; _i++) {
            var keyword = keywords_1[_i];
            var lowerKeyword = keyword.toLowerCase();
            var index = lowerLine.indexOf(lowerKeyword);
            if (index !== -1) {
                var confidence = this.calculateKeywordConfidence(keyword, line, context);
                matches.push({
                    pattern: keyword,
                    match: line.substring(index, index + keyword.length),
                    confidence: confidence,
                    context: context,
                    line: lineNumber,
                    type: type
                });
            }
        }
        return matches;
    };
    /**
     * Calculate confidence score for keyword match
     */
    PatternMatcher.prototype.calculateKeywordConfidence = function (keyword, line, context) {
        var confidence = 0.5; // Base confidence
        // Boost confidence for exact matches
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
            confidence += 0.2;
        }
        // Boost confidence for word boundaries
        var wordBoundaryRegex = new RegExp("\\b".concat(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "\\b"), 'i');
        if (wordBoundaryRegex.test(line)) {
            confidence += 0.2;
        }
        // Boost confidence for header context
        if (line.trim().startsWith('#') || line.trim().startsWith('##')) {
            confidence += 0.1;
        }
        // Boost confidence for list item context
        if (line.trim().startsWith('-') || line.trim().startsWith('*') || /^\s*\d+\./.test(line)) {
            confidence += 0.1;
        }
        // Reduce confidence for negation context
        var negationWords = ['not', 'no', 'without', 'except', 'excluding'];
        for (var _i = 0, negationWords_1 = negationWords; _i < negationWords_1.length; _i++) {
            var negation = negationWords_1[_i];
            if (line.toLowerCase().includes(negation)) {
                confidence -= 0.2;
                break;
            }
        }
        return Math.max(0, Math.min(1, confidence));
    };
    /**
     * Calculate confidence score for section match
     */
    PatternMatcher.prototype.calculateSectionConfidence = function (header, content) {
        var confidence = 0.6; // Base confidence for section match
        // Boost confidence for clear header matches
        var headerLower = header.toLowerCase();
        if (headerLower.includes('breaking') || headerLower.includes('feature') ||
            headerLower.includes('fix') || headerLower.includes('improvement')) {
            confidence += 0.2;
        }
        // Boost confidence for substantial content
        var contentLines = content.split('\n').filter(function (line) { return line.trim().length > 0; });
        if (contentLines.length > 3) {
            confidence += 0.1;
        }
        // Boost confidence for structured content (lists, etc.)
        var listItems = content.split('\n').filter(function (line) {
            return line.trim().startsWith('-') || line.trim().startsWith('*') || /^\s*\d+\./.test(line);
        });
        if (listItems.length > 1) {
            confidence += 0.1;
        }
        return Math.max(0, Math.min(1, confidence));
    };
    /**
     * Get context around a line (previous and next lines)
     */
    PatternMatcher.prototype.getContext = function (lines, lineIndex, contextSize) {
        if (contextSize === void 0) { contextSize = 2; }
        var start = Math.max(0, lineIndex - contextSize);
        var end = Math.min(lines.length, lineIndex + contextSize + 1);
        return lines.slice(start, end).join('\n');
    };
    /**
     * Check if a line is a header
     */
    PatternMatcher.prototype.isHeader = function (line, lines, index) {
        // Markdown headers with #
        if (line.startsWith('#')) {
            return true;
        }
        // Underlined headers (next line is === or ---)
        if (index + 1 < lines.length) {
            var nextLine = lines[index + 1].trim();
            if (nextLine.match(/^=+$/) || nextLine.match(/^-+$/)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Extract header text from line
     */
    PatternMatcher.prototype.extractHeaderText = function (line, lines, index) {
        if (line.startsWith('#')) {
            return line.replace(/^#+\s*/, '').trim();
        }
        // For underlined headers, the text is on the current line
        return line.trim();
    };
    /**
     * Classify header type based on text
     */
    PatternMatcher.prototype.classifyHeader = function (headerText) {
        var lowerHeader = headerText.toLowerCase();
        // Check breaking changes
        for (var _i = 0, _a = this.config.sectionHeaders.breakingChanges; _i < _a.length; _i++) {
            var pattern = _a[_i];
            if (lowerHeader.includes(pattern.toLowerCase())) {
                return 'breaking';
            }
        }
        // Check features
        for (var _b = 0, _c = this.config.sectionHeaders.features; _b < _c.length; _b++) {
            var pattern = _c[_b];
            if (lowerHeader.includes(pattern.toLowerCase())) {
                return 'feature';
            }
        }
        // Check bug fixes
        for (var _d = 0, _e = this.config.sectionHeaders.bugFixes; _d < _e.length; _d++) {
            var pattern = _e[_d];
            if (lowerHeader.includes(pattern.toLowerCase())) {
                return 'bugfix';
            }
        }
        // Check improvements
        for (var _f = 0, _g = this.config.sectionHeaders.improvements; _f < _g.length; _f++) {
            var pattern = _g[_f];
            if (lowerHeader.includes(pattern.toLowerCase())) {
                return 'improvement';
            }
        }
        // Check summary
        for (var _h = 0, _j = this.config.sectionHeaders.summary; _h < _j.length; _h++) {
            var pattern = _j[_h];
            if (lowerHeader.includes(pattern.toLowerCase())) {
                return 'summary';
            }
        }
        return null;
    };
    /**
     * Extract content of a section
     */
    PatternMatcher.prototype.extractSectionContent = function (lines, headerIndex) {
        var content = [];
        var currentIndex = headerIndex + 1;
        // Skip the underline if it exists
        if (currentIndex < lines.length &&
            (lines[currentIndex].trim().match(/^=+$/) || lines[currentIndex].trim().match(/^-+$/))) {
            currentIndex++;
        }
        // Collect content until next header or end of document
        while (currentIndex < lines.length) {
            var line = lines[currentIndex];
            // Stop at next header
            if (this.isHeader(line, lines, currentIndex)) {
                break;
            }
            content.push(line);
            currentIndex++;
        }
        return {
            content: content.join('\n').trim(),
            endLine: currentIndex
        };
    };
    /**
     * Count keyword matches in content
     */
    PatternMatcher.prototype.countKeywordMatches = function (content, keywords) {
        var lowerContent = content.toLowerCase();
        var count = 0;
        for (var _i = 0, keywords_2 = keywords; _i < keywords_2.length; _i++) {
            var keyword = keywords_2[_i];
            var regex = new RegExp("\\b".concat(keyword.toLowerCase(), "\\b"), 'g');
            var matches = lowerContent.match(regex);
            if (matches) {
                count += matches.length;
            }
        }
        return count;
    };
    /**
     * Count all keyword matches across all categories
     */
    PatternMatcher.prototype.countAllKeywordMatches = function (content) {
        var allKeywords = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], this.config.breakingChangeKeywords, true), this.config.featureKeywords, true), this.config.bugFixKeywords, true), this.config.improvementKeywords, true), this.config.documentationKeywords, true);
        return this.countKeywordMatches(content, allKeywords);
    };
    /**
     * Convert glob pattern to regex
     */
    PatternMatcher.prototype.globToRegex = function (pattern) {
        var regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        return new RegExp("^".concat(regexPattern, "$"), 'i');
    };
    /**
     * Remove duplicate matches based on line and type
     */
    PatternMatcher.prototype.deduplicateMatches = function (matches) {
        var seen = new Set();
        var deduplicated = [];
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var match = matches_1[_i];
            var key = "".concat(match.line, "-").concat(match.type, "-").concat(match.match);
            if (!seen.has(key)) {
                seen.add(key);
                deduplicated.push(match);
            }
        }
        return deduplicated.sort(function (a, b) { return a.line - b.line; });
    };
    return PatternMatcher;
}());
exports.PatternMatcher = PatternMatcher;
