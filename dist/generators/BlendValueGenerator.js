"use strict";
/**
 * Blend Value Generator
 *
 * Generates blend value constants for all platforms.
 * Outputs blend100-blend500 constants in platform-appropriate format:
 * - Web: export const blend100 = 0.04
 * - iOS: static let blend100: Double = 0.04
 * - Android: const val blend100 = 0.04f
 *
 * Integrates with existing unified generator infrastructure.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlendValueGenerator = void 0;
const BlendTokens_1 = require("../tokens/BlendTokens");
/**
 * Blend Value Generator
 * Generates platform-specific blend value constants
 */
class BlendValueGenerator {
    /**
     * Generate blend values for all platforms
     */
    generateAll(options = {}) {
        return {
            web: this.generateWebBlendValues(options),
            ios: this.generateiOSBlendValues(options),
            android: this.generateAndroidBlendValues(options)
        };
    }
    /**
     * Generate blend values for web platform (JavaScript/TypeScript)
     */
    generateWebBlendValues(options = {}) {
        const { includeComments = true, includeBaseValue = true } = options;
        const tokens = (0, BlendTokens_1.getAllBlendTokens)();
        const lines = [];
        if (includeComments) {
            lines.push('/**');
            lines.push(' * Blend Value Constants');
            lines.push(' * Base value: 0.04 (4%)');
            lines.push(' * Scale: 5 tokens from 4% to 20% in 4% increments');
            lines.push(' * Usage: Apply with blend utilities for color modification');
            lines.push(' */');
            lines.push('');
        }
        if (includeBaseValue) {
            lines.push(`export const BLEND_BASE_VALUE = ${BlendTokens_1.BLEND_BASE_VALUE};`);
            lines.push('');
        }
        lines.push('export const BlendTokens = {');
        tokens.forEach((token, index) => {
            const value = token.baseValue;
            const isLast = index === tokens.length - 1;
            if (includeComments) {
                lines.push(`  // ${token.description}`);
                lines.push(`  // ${token.mathematicalRelationship}`);
            }
            lines.push(`  ${token.name}: ${value}${isLast ? '' : ','}`);
            if (!isLast && includeComments) {
                lines.push('');
            }
        });
        lines.push('};');
        return lines.join('\n');
    }
    /**
     * Generate blend values for iOS platform (Swift)
     */
    generateiOSBlendValues(options = {}) {
        const { includeComments = true, includeBaseValue = true } = options;
        const tokens = (0, BlendTokens_1.getAllBlendTokens)();
        const lines = [];
        if (includeComments) {
            lines.push('/**');
            lines.push(' * Blend Value Constants');
            lines.push(' * Base value: 0.04 (4%)');
            lines.push(' * Scale: 5 tokens from 4% to 20% in 4% increments');
            lines.push(' * Usage: Apply with blend utilities for color modification');
            lines.push(' */');
            lines.push('');
        }
        lines.push('struct BlendTokens {');
        if (includeBaseValue) {
            lines.push(`  static let baseValue: Double = ${BlendTokens_1.BLEND_BASE_VALUE}`);
            lines.push('');
        }
        tokens.forEach((token) => {
            const value = token.baseValue;
            if (includeComments) {
                lines.push(`  // ${token.description}`);
                lines.push(`  // ${token.mathematicalRelationship}`);
            }
            lines.push(`  static let ${token.name}: Double = ${value}`);
            if (includeComments) {
                lines.push('');
            }
        });
        lines.push('}');
        return lines.join('\n');
    }
    /**
     * Generate blend values for Android platform (Kotlin)
     */
    generateAndroidBlendValues(options = {}) {
        const { includeComments = true, includeBaseValue = true } = options;
        const tokens = (0, BlendTokens_1.getAllBlendTokens)();
        const lines = [];
        if (includeComments) {
            lines.push('/**');
            lines.push(' * Blend Value Constants');
            lines.push(' * Base value: 0.04 (4%)');
            lines.push(' * Scale: 5 tokens from 4% to 20% in 4% increments');
            lines.push(' * Usage: Apply with blend utilities for color modification');
            lines.push(' */');
            lines.push('');
        }
        lines.push('object BlendTokens {');
        if (includeBaseValue) {
            lines.push(`  const val baseValue = ${BlendTokens_1.BLEND_BASE_VALUE}f`);
            lines.push('');
        }
        tokens.forEach((token) => {
            const value = token.baseValue;
            if (includeComments) {
                lines.push(`  // ${token.description}`);
                lines.push(`  // ${token.mathematicalRelationship}`);
            }
            lines.push(`  const val ${token.name} = ${value}f`);
            if (includeComments) {
                lines.push('');
            }
        });
        lines.push('}');
        return lines.join('\n');
    }
    /**
     * Format blend value for specific platform
     * Helper method for integration with existing generator infrastructure
     */
    formatBlendValue(platform, name, value) {
        switch (platform) {
            case 'web':
                return `export const ${name} = ${value};`;
            case 'ios':
                return `static let ${name}: Double = ${value}`;
            case 'android':
                return `const val ${name} = ${value}f`;
        }
    }
    /**
     * Get blend tokens as array for iteration
     */
    getBlendTokens() {
        return (0, BlendTokens_1.getAllBlendTokens)();
    }
}
exports.BlendValueGenerator = BlendValueGenerator;
//# sourceMappingURL=BlendValueGenerator.js.map