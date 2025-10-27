"use strict";
/**
 * Token Integration Layer
 *
 * Integrates F1 tokens into platform-specific builds with proper unit conversion.
 * Follows token selection priority: semantic → primitive → component
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenIntegratorImpl = void 0;
const TokenSelector_1 = require("./TokenSelector");
const ComponentTokenGenerator_1 = require("./ComponentTokenGenerator");
const UnitConverter_1 = require("./UnitConverter");
/**
 * Token integrator implementation
 *
 * Implements the token integration layer with F1 token system integration
 */
class TokenIntegratorImpl {
    constructor(primitiveRegistry, semanticRegistry) {
        this.primitiveRegistry = primitiveRegistry;
        this.semanticRegistry = semanticRegistry;
        this.tokenSelector = new TokenSelector_1.TokenSelector(primitiveRegistry, semanticRegistry);
        this.componentGenerator = new ComponentTokenGenerator_1.ComponentTokenGenerator(primitiveRegistry);
        this.unitConverter = new UnitConverter_1.UnitConverter();
    }
    /**
     * Get all tokens for a specific platform with proper unit conversion
     */
    getTokensForPlatform(platform) {
        const primitives = {
            spacing: {},
            colors: {},
            typography: {},
            radius: {},
            sizing: {},
            opacity: {},
            elevation: {},
            animation: {}
        };
        const semantics = {
            spacing: {},
            colors: {},
            typography: {},
            radius: {},
            sizing: {},
            opacity: {},
            elevation: {},
            animation: {}
        };
        // Get all primitive tokens and organize by category
        const allPrimitives = this.primitiveRegistry.query();
        for (const token of allPrimitives) {
            const platformValue = this.convertToken(token, platform);
            // Organize by category
            switch (token.category) {
                case 'spacing':
                    primitives.spacing[token.name] = platformValue;
                    break;
                case 'color':
                    primitives.colors[token.name] = platformValue;
                    break;
                case 'fontSize':
                case 'lineHeight':
                case 'fontWeight':
                case 'letterSpacing':
                case 'fontFamily':
                    primitives.typography[token.name] = platformValue;
                    break;
                case 'radius':
                    primitives.radius[token.name] = platformValue;
                    break;
                case 'density':
                case 'tapArea':
                    primitives.sizing[token.name] = platformValue;
                    break;
            }
        }
        // Get all semantic tokens and organize by category
        const allSemantics = this.semanticRegistry.query();
        for (const token of allSemantics) {
            const platformValue = this.convertToken(token, platform);
            // Organize by category
            switch (token.category) {
                case 'spacing':
                    semantics.spacing[token.name] = platformValue;
                    break;
                case 'color':
                    semantics.colors[token.name] = platformValue;
                    break;
                case 'typography':
                    semantics.typography[token.name] = platformValue;
                    break;
                case 'border':
                    semantics.radius[token.name] = platformValue;
                    break;
            }
        }
        return {
            platform,
            primitives,
            semantics,
            components: {
                spacing: {},
                colors: {},
                typography: {},
                radius: {},
                sizing: {},
                opacity: {},
                elevation: {},
                animation: {}
            },
            metadata: {
                platform,
                defaultSpacingUnit: platform === 'ios' ? 'pt' : platform === 'android' ? 'dp' : 'px',
                defaultTypographyUnit: platform === 'ios' ? 'pt' : platform === 'android' ? 'sp' : 'rem',
                supportedUnits: platform === 'ios' ? ['pt'] : platform === 'android' ? ['dp', 'sp'] : ['px', 'rem'],
                constraints: {
                    decimalPrecision: 2,
                    supportsSubpixel: platform === 'web',
                    roundingMode: 'round'
                },
                generatedAt: new Date()
            }
        };
    }
    /**
     * Convert a token to platform-specific value
     */
    convertToken(token, platform) {
        // For primitive tokens, use platform values directly
        if ('baseValue' in token && 'platforms' in token) {
            const primitiveToken = token;
            const platformValue = primitiveToken.platforms[platform];
            return {
                value: platformValue.value,
                unit: platformValue.unit,
                token: primitiveToken.name
            };
        }
        // For semantic tokens, resolve to primitive and convert
        const semanticToken = token;
        const primitiveRef = Object.values(semanticToken.primitiveReferences)[0];
        const primitiveToken = this.primitiveRegistry.get(primitiveRef);
        if (!primitiveToken) {
            throw new Error(`Primitive token '${primitiveRef}' not found for semantic token '${semanticToken.name}'`);
        }
        const platformValue = primitiveToken.platforms[platform];
        return {
            value: platformValue.value,
            unit: platformValue.unit,
            token: semanticToken.name
        };
    }
    /**
     * Select appropriate token following priority: semantic → primitive → component
     */
    selectToken(request, options = {}) {
        return this.tokenSelector.selectToken(request, options);
    }
    /**
     * Validate token selection follows priority rules
     */
    validateTokenSelection(selection) {
        const errors = [];
        const warnings = [];
        // Validate priority was followed correctly
        if (selection.priority === 'primitive' && !selection.semanticInsufficiencyReason) {
            warnings.push('Primitive token selected without documenting why semantic token was insufficient');
        }
        if (selection.priority === 'component') {
            if (!selection.semanticInsufficiencyReason) {
                errors.push('Component token selected without documenting why semantic token was insufficient');
            }
            if (!selection.primitiveInsufficiencyReason) {
                errors.push('Component token selected without documenting why primitive token was insufficient');
            }
        }
        // Validate reasoning is provided
        if (!selection.reasoning || selection.reasoning.trim().length === 0) {
            errors.push('Token selection must include reasoning');
        }
        // Validate mathematical validity
        if (!selection.mathematicallyValid && selection.priority !== 'component') {
            warnings.push('Selected token is not mathematically valid');
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    /**
     * Generate component token when semantic and primitive tokens insufficient
     */
    generateComponentToken(spec) {
        const componentSpec = {
            name: spec.name,
            category: spec.category,
            baseValue: spec.baseValue,
            component: spec.component,
            reasoning: spec.reasoning,
            references: spec.references?.map(ref => ({
                tokenName: ref,
                relationship: 'base'
            })),
            createdBy: spec.createdBy
        };
        return this.componentGenerator.generate(componentSpec);
    }
    /**
     * Validate mathematical consistency across platforms
     */
    validateMathematicalConsistency(token) {
        const issues = [];
        const platforms = {
            ios: { value: 0, unit: 'pt', token: '' },
            android: { value: 0, unit: 'dp', token: '' },
            web: { value: 0, unit: 'px', token: '' }
        };
        // Check if it's a component token
        if ('component' in token) {
            const componentToken = token;
            platforms.ios = componentToken.platforms.ios;
            platforms.android = componentToken.platforms.android;
            platforms.web = componentToken.platforms.web;
            // Validate all platforms have same base value
            if (platforms.ios.value !== componentToken.baseValue) {
                issues.push(`iOS value (${platforms.ios.value}) does not match base value (${componentToken.baseValue})`);
            }
            if (platforms.android.value !== componentToken.baseValue) {
                issues.push(`Android value (${platforms.android.value}) does not match base value (${componentToken.baseValue})`);
            }
            if (platforms.web.value !== componentToken.baseValue) {
                issues.push(`Web value (${platforms.web.value}) does not match base value (${componentToken.baseValue})`);
            }
        }
        else {
            // Convert token to each platform
            platforms.ios = this.convertToken(token, 'ios');
            platforms.android = this.convertToken(token, 'android');
            platforms.web = this.convertToken(token, 'web');
            // For primitive/semantic tokens, values should be consistent
            // (allowing for different units but same numeric value)
            const iosValue = typeof platforms.ios.value === 'number' ? platforms.ios.value : 0;
            const androidValue = typeof platforms.android.value === 'number' ? platforms.android.value : 0;
            const webValue = typeof platforms.web.value === 'number' ? platforms.web.value : 0;
            if (iosValue !== androidValue || androidValue !== webValue) {
                issues.push(`Platform values are inconsistent: iOS=${iosValue}, Android=${androidValue}, Web=${webValue}`);
            }
        }
        return {
            consistent: issues.length === 0,
            platforms,
            issues
        };
    }
}
exports.TokenIntegratorImpl = TokenIntegratorImpl;
//# sourceMappingURL=TokenIntegrator.js.map