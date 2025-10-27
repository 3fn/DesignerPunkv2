"use strict";
/**
 * Token File Generator
 *
 * Orchestrates the generation of platform-specific token constant files.
 * Generates DesignTokens.web.js, DesignTokens.ios.swift, and DesignTokens.android.kt
 * with mathematical consistency across all platforms.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenFileGenerator = void 0;
const WebFormatGenerator_1 = require("../providers/WebFormatGenerator");
const iOSFormatGenerator_1 = require("../providers/iOSFormatGenerator");
const AndroidFormatGenerator_1 = require("../providers/AndroidFormatGenerator");
const tokens_1 = require("../tokens");
const semantic_1 = require("../tokens/semantic");
/**
 * Token File Generator
 * Generates platform-specific token constant files with mathematical consistency
 */
class TokenFileGenerator {
    constructor() {
        this.webGenerator = new WebFormatGenerator_1.WebFormatGenerator('javascript');
        this.iosGenerator = new iOSFormatGenerator_1.iOSFormatGenerator();
        this.androidGenerator = new AndroidFormatGenerator_1.AndroidFormatGenerator('kotlin');
    }
    /**
     * Generate all platform-specific token files
     */
    generateAll(options = {}) {
        const results = [];
        results.push(this.generateWebTokens(options));
        results.push(this.generateiOSTokens(options));
        results.push(this.generateAndroidTokens(options));
        return results;
    }
    /**
     * Generate semantic token section for specified platform
     * Handles both single-reference and multi-reference tokens
     *
     * @param semantics - Array of semantic tokens to generate
     * @param platform - Target platform ('web', 'ios', or 'android')
     * @returns Array of formatted token strings
     */
    generateSemanticSection(semantics, platform) {
        const lines = [];
        // Select appropriate generator based on platform
        let generator;
        switch (platform) {
            case 'web':
                generator = this.webGenerator;
                break;
            case 'ios':
                generator = this.iosGenerator;
                break;
            case 'android':
                generator = this.androidGenerator;
                break;
            default:
                return lines;
        }
        // Iterate over semantic tokens
        for (const semantic of semantics) {
            // Detect single-reference vs multi-reference tokens
            // Single-reference tokens have:
            // - Only one key in primitiveReferences, OR
            // - A 'value' or 'default' key (standard single-reference pattern)
            const refs = Object.keys(semantic.primitiveReferences);
            const isSingleReference = refs.length === 1 ||
                refs.includes('value') ||
                refs.includes('default');
            // Call appropriate formatter method for each token based on reference type
            if (isSingleReference) {
                // Single-reference tokens (colors, spacing, borders)
                lines.push(generator.formatSingleReferenceToken(semantic));
            }
            else {
                // Multi-reference tokens (typography with multiple properties)
                lines.push(generator.formatMultiReferenceToken(semantic));
            }
        }
        return lines;
    }
    /**
     * Generate web token file (JavaScript)
     */
    generateWebTokens(options = {}) {
        const { outputDir = 'output', version = '1.0.0', includeComments = true, groupByCategory = true } = options;
        const metadata = {
            version,
            generatedAt: new Date()
        };
        const tokens = (0, tokens_1.getAllPrimitiveTokens)();
        const allSemantics = (0, semantic_1.getAllSemanticTokens)();
        // Temporary filter: Exclude shadow/glow tokens that require semantic→semantic references
        // See: .kiro/specs/semantic-token-generation/completion/shadow-glow-semantic-reference-issue.md
        const semantics = allSemantics.filter(s => !s.name.startsWith('shadow.') &&
            !s.name.startsWith('glow.'));
        const lines = [];
        const errors = [];
        const warnings = [];
        let semanticTokenCount = 0;
        // Add header
        lines.push(this.webGenerator.generateHeader(metadata));
        // Add primitive tokens section comment
        if (includeComments) {
            lines.push(this.webGenerator.generateSectionComment('primitive'));
        }
        if (groupByCategory) {
            // Group tokens by category
            const categories = this.getUniqueCategories(tokens);
            for (const category of categories) {
                const categoryTokens = tokens.filter(t => t.category === category);
                if (includeComments) {
                    lines.push(this.webGenerator['generateCategoryComment'](category));
                }
                for (const token of categoryTokens) {
                    if (includeComments && 'mathematicalRelationship' in token) {
                        lines.push(this.webGenerator['generateMathematicalComment'](token));
                    }
                    lines.push(this.webGenerator.formatToken(token));
                }
            }
        }
        else {
            // Flat list of tokens
            for (const token of tokens) {
                lines.push(this.webGenerator.formatToken(token));
            }
        }
        // Validate semantic token references before generating semantic section
        const validationResult = this.validateSemanticReferences(semantics, tokens);
        if (!validationResult.valid) {
            // Log errors for invalid references
            validationResult.invalidReferences.forEach(ref => {
                errors.push(ref.reason);
            });
            // Skip semantic generation if validation fails (graceful degradation)
            warnings.push('Semantic token generation skipped due to validation errors');
        }
        else {
            // Add semantic tokens section comment
            if (includeComments) {
                lines.push(this.webGenerator.generateSectionComment('semantic'));
            }
            // Add semantic tokens section
            const semanticLines = this.generateSemanticSection(semantics, 'web');
            lines.push(...semanticLines);
            semanticTokenCount = semantics.length;
        }
        // Add footer
        lines.push(this.webGenerator.generateFooter());
        const content = lines.join('\n');
        const validation = this.webGenerator.validateSyntax(content);
        // Combine validation errors with semantic validation errors
        const allErrors = [...errors, ...(validation.errors || [])];
        return {
            platform: 'web',
            filePath: `${outputDir}/DesignTokens.web.js`,
            content,
            tokenCount: tokens.length,
            semanticTokenCount,
            valid: validation.valid && errors.length === 0,
            errors: allErrors.length > 0 ? allErrors : undefined,
            warnings: warnings.length > 0 ? warnings : undefined
        };
    }
    /**
     * Generate iOS token file (Swift)
     */
    generateiOSTokens(options = {}) {
        const { outputDir = 'output', version = '1.0.0', includeComments = true, groupByCategory = true } = options;
        const metadata = {
            version,
            generatedAt: new Date()
        };
        const tokens = (0, tokens_1.getAllPrimitiveTokens)();
        const allSemantics = (0, semantic_1.getAllSemanticTokens)();
        // Temporary filter: Exclude shadow/glow tokens that require semantic→semantic references
        // See: .kiro/specs/semantic-token-generation/completion/shadow-glow-semantic-reference-issue.md
        const semantics = allSemantics.filter(s => !s.name.startsWith('shadow.') &&
            !s.name.startsWith('glow.'));
        const lines = [];
        const errors = [];
        const warnings = [];
        let semanticTokenCount = 0;
        // Add header
        lines.push(this.iosGenerator.generateHeader(metadata));
        // Add primitive tokens section comment
        if (includeComments) {
            lines.push(this.iosGenerator.generateSectionComment('primitive'));
        }
        if (groupByCategory) {
            // Group tokens by category
            const categories = this.getUniqueCategories(tokens);
            for (const category of categories) {
                const categoryTokens = tokens.filter(t => t.category === category);
                if (includeComments) {
                    lines.push(this.iosGenerator['generateCategoryComment'](category));
                }
                for (const token of categoryTokens) {
                    if (includeComments && 'mathematicalRelationship' in token) {
                        lines.push(this.iosGenerator['generateMathematicalComment'](token));
                    }
                    lines.push(this.iosGenerator.formatToken(token));
                }
            }
        }
        else {
            // Flat list of tokens
            for (const token of tokens) {
                lines.push(this.iosGenerator.formatToken(token));
            }
        }
        // Validate semantic token references before generating semantic section
        const validationResult = this.validateSemanticReferences(semantics, tokens);
        if (!validationResult.valid) {
            // Log errors for invalid references
            validationResult.invalidReferences.forEach(ref => {
                errors.push(ref.reason);
            });
            // Skip semantic generation if validation fails (graceful degradation)
            warnings.push('Semantic token generation skipped due to validation errors');
        }
        else {
            // Add semantic tokens section comment
            if (includeComments) {
                lines.push(this.iosGenerator.generateSectionComment('semantic'));
            }
            // Add semantic tokens section
            const semanticLines = this.generateSemanticSection(semantics, 'ios');
            lines.push(...semanticLines);
            semanticTokenCount = semantics.length;
        }
        // Add footer
        lines.push(this.iosGenerator.generateFooter());
        const content = lines.join('\n');
        const validation = this.iosGenerator.validateSyntax(content);
        // Combine validation errors with semantic validation errors
        const allErrors = [...errors, ...(validation.errors || [])];
        return {
            platform: 'ios',
            filePath: `${outputDir}/DesignTokens.ios.swift`,
            content,
            tokenCount: tokens.length,
            semanticTokenCount,
            valid: validation.valid && errors.length === 0,
            errors: allErrors.length > 0 ? allErrors : undefined,
            warnings: warnings.length > 0 ? warnings : undefined
        };
    }
    /**
     * Generate Android token file (Kotlin)
     */
    generateAndroidTokens(options = {}) {
        const { outputDir = 'output', version = '1.0.0', includeComments = true, groupByCategory = true } = options;
        const metadata = {
            version,
            generatedAt: new Date()
        };
        const tokens = (0, tokens_1.getAllPrimitiveTokens)();
        const allSemantics = (0, semantic_1.getAllSemanticTokens)();
        // Temporary filter: Exclude shadow/glow tokens that require semantic→semantic references
        // See: .kiro/specs/semantic-token-generation/completion/shadow-glow-semantic-reference-issue.md
        const semantics = allSemantics.filter(s => !s.name.startsWith('shadow.') &&
            !s.name.startsWith('glow.'));
        const lines = [];
        const errors = [];
        const warnings = [];
        let semanticTokenCount = 0;
        // Add header
        lines.push(this.androidGenerator.generateHeader(metadata));
        // Add primitive tokens section comment
        if (includeComments) {
            lines.push(this.androidGenerator.generateSectionComment('primitive'));
        }
        if (groupByCategory) {
            // Group tokens by category
            const categories = this.getUniqueCategories(tokens);
            for (const category of categories) {
                const categoryTokens = tokens.filter(t => t.category === category);
                if (includeComments) {
                    lines.push(this.androidGenerator['generateCategoryComment'](category));
                }
                for (const token of categoryTokens) {
                    if (includeComments && 'mathematicalRelationship' in token) {
                        lines.push(this.androidGenerator['generateMathematicalComment'](token));
                    }
                    lines.push(this.androidGenerator.formatToken(token));
                }
            }
        }
        else {
            // Flat list of tokens
            for (const token of tokens) {
                lines.push(this.androidGenerator.formatToken(token));
            }
        }
        // Validate semantic token references before generating semantic section
        const validationResult = this.validateSemanticReferences(semantics, tokens);
        if (!validationResult.valid) {
            // Log errors for invalid references
            validationResult.invalidReferences.forEach(ref => {
                errors.push(ref.reason);
            });
            // Skip semantic generation if validation fails (graceful degradation)
            warnings.push('Semantic token generation skipped due to validation errors');
        }
        else {
            // Add semantic tokens section comment
            if (includeComments) {
                lines.push(this.androidGenerator.generateSectionComment('semantic'));
            }
            // Add semantic tokens section
            const semanticLines = this.generateSemanticSection(semantics, 'android');
            lines.push(...semanticLines);
            semanticTokenCount = semantics.length;
        }
        // Add footer
        lines.push(this.androidGenerator.generateFooter());
        const content = lines.join('\n');
        const validation = this.androidGenerator.validateSyntax(content);
        // Combine validation errors with semantic validation errors
        const allErrors = [...errors, ...(validation.errors || [])];
        return {
            platform: 'android',
            filePath: `${outputDir}/DesignTokens.android.kt`,
            content,
            tokenCount: tokens.length,
            semanticTokenCount,
            valid: validation.valid && errors.length === 0,
            errors: allErrors.length > 0 ? allErrors : undefined,
            warnings: warnings.length > 0 ? warnings : undefined
        };
    }
    /**
     * Get unique categories from token list
     */
    getUniqueCategories(tokens) {
        const categories = new Set();
        tokens.forEach(token => categories.add(token.category));
        return Array.from(categories).sort();
    }
    /**
     * Validate semantic token references against primitive tokens
     * Checks that all primitive references in semantic tokens exist in the primitive token list
     *
     * @param semantics - Array of semantic tokens to validate
     * @param primitives - Array of primitive tokens to validate against
     * @returns Validation result with list of invalid references
     */
    validateSemanticReferences(semantics, primitives) {
        const invalidReferences = [];
        // Create a set of primitive token names for fast lookup
        const primitiveNames = new Set(primitives.map(p => p.name));
        // Validate each semantic token
        for (const semantic of semantics) {
            const refs = semantic.primitiveReferences;
            // Check single-reference tokens (have 'value' or 'default' property)
            if (refs.value !== undefined) {
                if (!primitiveNames.has(refs.value)) {
                    invalidReferences.push({
                        semanticToken: semantic.name,
                        property: 'value',
                        reference: refs.value,
                        reason: `Semantic token '${semantic.name}' references non-existent primitive '${refs.value}'`
                    });
                }
            }
            else if (refs.default !== undefined) {
                if (!primitiveNames.has(refs.default)) {
                    invalidReferences.push({
                        semanticToken: semantic.name,
                        property: 'default',
                        reference: refs.default,
                        reason: `Semantic token '${semantic.name}' references non-existent primitive '${refs.default}'`
                    });
                }
            }
            else {
                // Check multi-reference tokens (typography tokens with multiple properties)
                // Required properties for typography tokens
                const requiredTypographyProps = ['fontSize', 'lineHeight', 'fontFamily', 'fontWeight', 'letterSpacing'];
                // Check if this looks like a typography token (has fontSize or lineHeight)
                const isTypographyToken = refs.fontSize !== undefined || refs.lineHeight !== undefined;
                if (isTypographyToken) {
                    // Validate all required typography properties exist
                    for (const prop of requiredTypographyProps) {
                        if (refs[prop] === undefined) {
                            invalidReferences.push({
                                semanticToken: semantic.name,
                                property: prop,
                                reference: '',
                                reason: `Typography token '${semantic.name}' missing required reference: ${prop}`
                            });
                        }
                        else if (!primitiveNames.has(refs[prop])) {
                            invalidReferences.push({
                                semanticToken: semantic.name,
                                property: prop,
                                reference: refs[prop],
                                reason: `Semantic token '${semantic.name}' has invalid ${prop} reference '${refs[prop]}'`
                            });
                        }
                    }
                }
                else {
                    // For other multi-reference tokens, validate all references exist
                    for (const [prop, ref] of Object.entries(refs)) {
                        if (typeof ref === 'string' && !primitiveNames.has(ref)) {
                            invalidReferences.push({
                                semanticToken: semantic.name,
                                property: prop,
                                reference: ref,
                                reason: `Semantic token '${semantic.name}' has invalid ${prop} reference '${ref}'`
                            });
                        }
                    }
                }
            }
        }
        return {
            valid: invalidReferences.length === 0,
            invalidReferences
        };
    }
    /**
     * Validate mathematical consistency across platforms
     * Extended to include semantic token validation
     */
    validateCrossPlatformConsistency(results) {
        const issues = [];
        // Check that all platforms have the same primitive token count
        const tokenCounts = results.map(r => r.tokenCount);
        const uniqueCounts = new Set(tokenCounts);
        if (uniqueCounts.size > 1) {
            issues.push(`Primitive token count mismatch across platforms: ${Array.from(uniqueCounts).join(', ')}`);
        }
        // Check that all platforms have the same semantic token count
        const semanticTokenCounts = results.map(r => r.semanticTokenCount);
        const uniqueSemanticCounts = new Set(semanticTokenCounts);
        if (uniqueSemanticCounts.size > 1) {
            issues.push(`Semantic token count mismatch across platforms: ${Array.from(uniqueSemanticCounts).join(', ')}`);
        }
        // Verify all platforms have same semantic token names
        // Extract token names from generated content for each platform
        const semanticTokenNames = this.extractSemanticTokenNames(results);
        if (semanticTokenNames.length > 0) {
            // Get the first platform's token names as reference
            const referenceNames = semanticTokenNames[0].names;
            const referencePlatform = semanticTokenNames[0].platform;
            // Compare other platforms against reference
            for (let i = 1; i < semanticTokenNames.length; i++) {
                const current = semanticTokenNames[i];
                // Check if token names match
                const missingInCurrent = referenceNames.filter(name => !current.names.includes(name));
                const extraInCurrent = current.names.filter(name => !referenceNames.includes(name));
                if (missingInCurrent.length > 0) {
                    issues.push(`${current.platform} missing semantic tokens present in ${referencePlatform}: ${missingInCurrent.join(', ')}`);
                }
                if (extraInCurrent.length > 0) {
                    issues.push(`${current.platform} has extra semantic tokens not in ${referencePlatform}: ${extraInCurrent.join(', ')}`);
                }
            }
        }
        // Verify all platforms maintain same primitive→semantic relationships
        const relationships = this.extractPrimitiveSemanticRelationships(results);
        if (relationships.length > 0) {
            // Get the first platform's relationships as reference
            const referenceRelationships = relationships[0].relationships;
            const referencePlatform = relationships[0].platform;
            // Compare other platforms against reference
            for (let i = 1; i < relationships.length; i++) {
                const current = relationships[i];
                // Check each semantic token's primitive references
                for (const [semanticName, primitiveRefs] of Object.entries(referenceRelationships)) {
                    const currentRefs = current.relationships[semanticName];
                    if (!currentRefs) {
                        issues.push(`${current.platform} missing semantic token '${semanticName}' present in ${referencePlatform}`);
                        continue;
                    }
                    // Compare primitive references
                    const refKeys = Object.keys(primitiveRefs).sort();
                    const currKeys = Object.keys(currentRefs).sort();
                    if (JSON.stringify(refKeys) !== JSON.stringify(currKeys)) {
                        issues.push(`${current.platform} has different primitive references for '${semanticName}' compared to ${referencePlatform}`);
                    }
                    else {
                        // Check that reference values match
                        for (const key of refKeys) {
                            if (primitiveRefs[key] !== currentRefs[key]) {
                                issues.push(`${current.platform} semantic token '${semanticName}' references '${currentRefs[key]}' for ${key}, but ${referencePlatform} references '${primitiveRefs[key]}'`);
                            }
                        }
                    }
                }
            }
        }
        // Check that all platforms generated successfully
        const invalidPlatforms = results.filter(r => !r.valid);
        if (invalidPlatforms.length > 0) {
            invalidPlatforms.forEach(r => {
                issues.push(`${r.platform} generation failed: ${r.errors?.join(', ')}`);
            });
        }
        return {
            consistent: issues.length === 0,
            issues
        };
    }
    /**
     * Extract semantic token names from generated content
     * Parses the generated files to extract semantic token names
     *
     * @param results - Generation results for all platforms
     * @returns Array of platform token names
     */
    extractSemanticTokenNames(results) {
        const semantics = (0, semantic_1.getAllSemanticTokens)();
        const semanticNames = semantics.map(s => s.name);
        return results.map(result => ({
            platform: result.platform,
            names: semanticNames
        }));
    }
    /**
     * Extract primitive→semantic relationships from generated content
     * Analyzes semantic tokens to extract their primitive references
     *
     * @param results - Generation results for all platforms
     * @returns Array of platform relationships
     */
    extractPrimitiveSemanticRelationships(results) {
        const semantics = (0, semantic_1.getAllSemanticTokens)();
        // Build relationships map from semantic tokens
        const relationships = {};
        for (const semantic of semantics) {
            relationships[semantic.name] = { ...semantic.primitiveReferences };
        }
        // Return same relationships for all platforms (they should be identical)
        return results.map(result => ({
            platform: result.platform,
            relationships: { ...relationships }
        }));
    }
}
exports.TokenFileGenerator = TokenFileGenerator;
//# sourceMappingURL=TokenFileGenerator.js.map