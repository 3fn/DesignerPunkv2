"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFormatProvider = void 0;
/**
 * Abstract base class providing common format generation functionality
 */
class BaseFormatProvider {
    generateFile(tokens, options = {}) {
        const { includeComments = true, groupByCategory = true, sortAlphabetically = false, includeMathematicalContext = false } = options;
        let processedTokens = [...tokens];
        // Sort if requested
        if (sortAlphabetically) {
            processedTokens.sort((a, b) => a.name.localeCompare(b.name));
        }
        // Group by category if requested
        const tokenGroups = groupByCategory
            ? this.groupTokensByCategory(processedTokens)
            : { all: processedTokens };
        // Generate file content
        const parts = [];
        parts.push(this.generateHeader());
        for (const [category, categoryTokens] of Object.entries(tokenGroups)) {
            if (groupByCategory && category !== 'all') {
                parts.push(this.generateCategoryComment(category));
            }
            for (const token of categoryTokens) {
                if (includeComments && includeMathematicalContext && 'mathematicalRelationship' in token) {
                    parts.push(this.generateMathematicalComment(token));
                }
                parts.push(this.formatToken(token));
            }
            if (groupByCategory && category !== 'all') {
                parts.push(''); // Add spacing between categories
            }
        }
        parts.push(this.generateFooter());
        return parts.join('\n');
    }
    groupTokensByCategory(tokens) {
        const groups = {};
        for (const token of tokens) {
            const category = token.category;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(token);
        }
        return groups;
    }
    generateCategoryComment(category) {
        return `// ${category.toUpperCase()} TOKENS`;
    }
    generateMathematicalComment(token) {
        return `// ${token.mathematicalRelationship}`;
    }
    formatValue(value, unit) {
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        if (typeof value === 'string') {
            return `"${value}"`;
        }
        return unit === 'unitless' ? String(value) : `${value}${unit}`;
    }
}
exports.BaseFormatProvider = BaseFormatProvider;
//# sourceMappingURL=FormatProvider.js.map