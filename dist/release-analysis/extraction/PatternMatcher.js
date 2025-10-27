"use strict";
/**
 * Pattern Matcher for Change Extraction
 *
 * Implements regex-based pattern matching for detecting different types of changes
 * in completion documents. Provides both keyword-based and section-based matching.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternMatcher = void 0;
class PatternMatcher {
    constructor(config) {
        this.config = config;
    }
    /**
     * Find all pattern matches in document content
     */
    findPatternMatches(content, documentPath) {
        const matches = [];
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNumber = i + 1;
            // Check for breaking change patterns
            const breakingMatches = this.findKeywordMatches(line, this.config.breakingChangeKeywords, 'breaking', lineNumber, this.getContext(lines, i));
            matches.push(...breakingMatches);
            // Check for feature patterns
            const featureMatches = this.findKeywordMatches(line, this.config.featureKeywords, 'feature', lineNumber, this.getContext(lines, i));
            matches.push(...featureMatches);
            // Check for bug fix patterns
            const bugFixMatches = this.findKeywordMatches(line, this.config.bugFixKeywords, 'bugfix', lineNumber, this.getContext(lines, i));
            matches.push(...bugFixMatches);
            // Check for improvement patterns
            const improvementMatches = this.findKeywordMatches(line, this.config.improvementKeywords, 'improvement', lineNumber, this.getContext(lines, i));
            matches.push(...improvementMatches);
            // Check for documentation patterns
            const docMatches = this.findKeywordMatches(line, this.config.documentationKeywords, 'documentation', lineNumber, this.getContext(lines, i));
            matches.push(...docMatches);
        }
        return this.deduplicateMatches(matches);
    }
    /**
     * Find structured sections in document content
     */
    findSectionMatches(content) {
        const matches = [];
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            // Check if line is a header (starts with # or is underlined)
            if (this.isHeader(line, lines, i)) {
                const headerText = this.extractHeaderText(line, lines, i);
                const sectionType = this.classifyHeader(headerText);
                if (sectionType) {
                    const sectionContent = this.extractSectionContent(lines, i);
                    const confidence = this.calculateSectionConfidence(headerText, sectionContent.content);
                    matches.push({
                        header: headerText,
                        content: sectionContent.content,
                        startLine: i + 1,
                        endLine: sectionContent.endLine,
                        type: sectionType,
                        confidence
                    });
                }
            }
        }
        return matches;
    }
    /**
     * Check if content should be excluded based on documentation patterns
     */
    shouldExcludeContent(content, documentPath) {
        // Check if document path matches exclude patterns
        for (const pattern of this.config.excludePatterns) {
            const regex = this.globToRegex(pattern);
            if (regex.test(documentPath)) {
                return true;
            }
        }
        // Check if content is primarily documentation
        const docKeywordCount = this.countKeywordMatches(content, this.config.documentationKeywords);
        const totalKeywordCount = this.countAllKeywordMatches(content);
        // If more than 80% of keywords are documentation-related, exclude
        if (totalKeywordCount > 0 && (docKeywordCount / totalKeywordCount) > 0.8) {
            return true;
        }
        // Check for documentation-only indicators
        const docOnlyPatterns = [
            /^#\s*(readme|documentation|docs|guide|tutorial)/i,
            /^##\s*(usage|examples|installation|setup)/i,
            /^\s*<!--.*documentation.*-->/i,
            /^\s*\*\s*(updated?\s+)?(readme|docs|documentation)/i
        ];
        for (const pattern of docOnlyPatterns) {
            if (pattern.test(content)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Find keyword matches in a line of text
     */
    findKeywordMatches(line, keywords, type, lineNumber, context) {
        const matches = [];
        const lowerLine = line.toLowerCase();
        for (const keyword of keywords) {
            const lowerKeyword = keyword.toLowerCase();
            const index = lowerLine.indexOf(lowerKeyword);
            if (index !== -1) {
                const confidence = this.calculateKeywordConfidence(keyword, line, context);
                matches.push({
                    pattern: keyword,
                    match: line.substring(index, index + keyword.length),
                    confidence,
                    context,
                    line: lineNumber,
                    type
                });
            }
        }
        return matches;
    }
    /**
     * Calculate confidence score for keyword match
     */
    calculateKeywordConfidence(keyword, line, context) {
        let confidence = 0.5; // Base confidence
        // Boost confidence for exact matches
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
            confidence += 0.2;
        }
        // Boost confidence for word boundaries
        const wordBoundaryRegex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
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
        const negationWords = ['not', 'no', 'without', 'except', 'excluding'];
        for (const negation of negationWords) {
            if (line.toLowerCase().includes(negation)) {
                confidence -= 0.2;
                break;
            }
        }
        return Math.max(0, Math.min(1, confidence));
    }
    /**
     * Calculate confidence score for section match
     */
    calculateSectionConfidence(header, content) {
        let confidence = 0.6; // Base confidence for section match
        // Boost confidence for clear header matches
        const headerLower = header.toLowerCase();
        if (headerLower.includes('breaking') || headerLower.includes('feature') ||
            headerLower.includes('fix') || headerLower.includes('improvement')) {
            confidence += 0.2;
        }
        // Boost confidence for substantial content
        const contentLines = content.split('\n').filter(line => line.trim().length > 0);
        if (contentLines.length > 3) {
            confidence += 0.1;
        }
        // Boost confidence for structured content (lists, etc.)
        const listItems = content.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*') || /^\s*\d+\./.test(line));
        if (listItems.length > 1) {
            confidence += 0.1;
        }
        return Math.max(0, Math.min(1, confidence));
    }
    /**
     * Get context around a line (previous and next lines)
     */
    getContext(lines, lineIndex, contextSize = 2) {
        const start = Math.max(0, lineIndex - contextSize);
        const end = Math.min(lines.length, lineIndex + contextSize + 1);
        return lines.slice(start, end).join('\n');
    }
    /**
     * Check if a line is a header
     */
    isHeader(line, lines, index) {
        // Markdown headers with #
        if (line.startsWith('#')) {
            return true;
        }
        // Underlined headers (next line is === or ---)
        if (index + 1 < lines.length) {
            const nextLine = lines[index + 1].trim();
            if (nextLine.match(/^=+$/) || nextLine.match(/^-+$/)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Extract header text from line
     */
    extractHeaderText(line, lines, index) {
        if (line.startsWith('#')) {
            return line.replace(/^#+\s*/, '').trim();
        }
        // For underlined headers, the text is on the current line
        return line.trim();
    }
    /**
     * Classify header type based on text
     */
    classifyHeader(headerText) {
        const lowerHeader = headerText.toLowerCase();
        // Check breaking changes
        for (const pattern of this.config.sectionHeaders.breakingChanges) {
            if (lowerHeader.includes(pattern.toLowerCase())) {
                return 'breaking';
            }
        }
        // Check features
        for (const pattern of this.config.sectionHeaders.features) {
            if (lowerHeader.includes(pattern.toLowerCase())) {
                return 'feature';
            }
        }
        // Check bug fixes
        for (const pattern of this.config.sectionHeaders.bugFixes) {
            if (lowerHeader.includes(pattern.toLowerCase())) {
                return 'bugfix';
            }
        }
        // Check improvements
        for (const pattern of this.config.sectionHeaders.improvements) {
            if (lowerHeader.includes(pattern.toLowerCase())) {
                return 'improvement';
            }
        }
        // Check summary
        for (const pattern of this.config.sectionHeaders.summary) {
            if (lowerHeader.includes(pattern.toLowerCase())) {
                return 'summary';
            }
        }
        return null;
    }
    /**
     * Extract content of a section
     */
    extractSectionContent(lines, headerIndex) {
        const content = [];
        let currentIndex = headerIndex + 1;
        // Skip the underline if it exists
        if (currentIndex < lines.length &&
            (lines[currentIndex].trim().match(/^=+$/) || lines[currentIndex].trim().match(/^-+$/))) {
            currentIndex++;
        }
        // Collect content until next header or end of document
        while (currentIndex < lines.length) {
            const line = lines[currentIndex];
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
    }
    /**
     * Count keyword matches in content
     */
    countKeywordMatches(content, keywords) {
        const lowerContent = content.toLowerCase();
        let count = 0;
        for (const keyword of keywords) {
            const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
            const matches = lowerContent.match(regex);
            if (matches) {
                count += matches.length;
            }
        }
        return count;
    }
    /**
     * Count all keyword matches across all categories
     */
    countAllKeywordMatches(content) {
        const allKeywords = [
            ...this.config.breakingChangeKeywords,
            ...this.config.featureKeywords,
            ...this.config.bugFixKeywords,
            ...this.config.improvementKeywords,
            ...this.config.documentationKeywords
        ];
        return this.countKeywordMatches(content, allKeywords);
    }
    /**
     * Convert glob pattern to regex
     */
    globToRegex(pattern) {
        const regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        return new RegExp(`^${regexPattern}$`, 'i');
    }
    /**
     * Remove duplicate matches based on line and type
     */
    deduplicateMatches(matches) {
        const seen = new Set();
        const deduplicated = [];
        for (const match of matches) {
            const key = `${match.line}-${match.type}-${match.match}`;
            if (!seen.has(key)) {
                seen.add(key);
                deduplicated.push(match);
            }
        }
        return deduplicated.sort((a, b) => a.line - b.line);
    }
}
exports.PatternMatcher = PatternMatcher;
//# sourceMappingURL=PatternMatcher.js.map