"use strict";
/**
 * Build Validation Script
 *
 * Integrates accessibility token validation into the build pipeline.
 * Validates accessibility tokens against WCAG requirements and reports
 * Pass/Warning/Error results.
 *
 * Requirements: 11.3, 11.6
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAccessibilityTokens = validateAccessibilityTokens;
exports.runBuildValidation = runBuildValidation;
const ThreeTierValidator_1 = require("./ThreeTierValidator");
const WCAGValidator_1 = require("./WCAGValidator");
const AccessibilityTokens_1 = require("../tokens/semantic/AccessibilityTokens");
const SpacingTokens_1 = require("../tokens/SpacingTokens");
const BorderWidthTokens_1 = require("../tokens/BorderWidthTokens");
/**
 * Resolve primitive token value from token reference
 */
function resolvePrimitiveValue(tokenRef) {
    // Check spacing tokens
    if (tokenRef.startsWith('space')) {
        const spacingToken = SpacingTokens_1.spacingTokens[tokenRef];
        return spacingToken ? spacingToken.baseValue : 0;
    }
    // Check border width tokens
    if (tokenRef.startsWith('borderWidth')) {
        const borderToken = BorderWidthTokens_1.borderWidthTokens[tokenRef];
        return borderToken ? borderToken.baseValue : 0;
    }
    // Check color tokens (primitive color names like 'purple300')
    // For now, return the token reference as-is for colors
    return tokenRef;
}
/**
 * Validate accessibility tokens during build
 */
function validateAccessibilityTokens() {
    console.log('\n🔍 Validating Accessibility Tokens...\n');
    const validator = new ThreeTierValidator_1.ThreeTierValidator();
    const wcagValidator = new WCAGValidator_1.WCAGValidator();
    // Resolve token values
    const offsetValue = resolvePrimitiveValue(AccessibilityTokens_1.accessibility.focus.offset);
    const widthValue = resolvePrimitiveValue(AccessibilityTokens_1.accessibility.focus.width);
    const colorValue = AccessibilityTokens_1.accessibility.focus.color; // Color reference
    // Create tokens object with resolved values for validation
    const tokens = {
        focus: {
            offset: typeof offsetValue === 'number' ? offsetValue : 0,
            width: typeof widthValue === 'number' ? widthValue : 0,
            color: typeof colorValue === 'string' ? colorValue : '#000000'
        }
    };
    // Run three-tier validation
    const validationResults = validator.validateAccessibilityTokens(tokens);
    // Run WCAG-specific validation
    const wcagVisibilityResult = wcagValidator.validateFocusVisibility(tokens.focus.offset, tokens.focus.width);
    // Aggregate results
    const allResults = [
        ...validationResults,
        {
            level: wcagVisibilityResult.level === 'pass' ? 'Pass' : wcagVisibilityResult.level === 'warning' ? 'Warning' : 'Error',
            token: 'accessibility.focus (WCAG visibility)',
            message: wcagVisibilityResult.message,
            rationale: wcagVisibilityResult.wcag || 'WCAG 2.4.7 Focus Visible',
            mathematicalReasoning: wcagVisibilityResult.message
        }
    ];
    // Count results by level
    let passCount = 0;
    let warningCount = 0;
    let errorCount = 0;
    const formattedResults = allResults.map(result => {
        if (result.level === 'Pass')
            passCount++;
        else if (result.level === 'Warning')
            warningCount++;
        else if (result.level === 'Error')
            errorCount++;
        return {
            token: result.token,
            level: result.level,
            message: result.message
        };
    });
    // Print results
    console.log('Validation Results:');
    console.log('==================\n');
    formattedResults.forEach(result => {
        const icon = result.level === 'Pass' ? '✅' : result.level === 'Warning' ? '⚠️' : '❌';
        const color = result.level === 'Pass' ? '\x1b[32m' : result.level === 'Warning' ? '\x1b[33m' : '\x1b[31m';
        const reset = '\x1b[0m';
        console.log(`${icon} ${color}${result.level}${reset}: ${result.token}`);
        console.log(`   ${result.message}\n`);
    });
    // Print summary
    console.log('Summary:');
    console.log('========');
    console.log(`Total checks: ${allResults.length}`);
    console.log(`✅ Pass: ${passCount}`);
    console.log(`⚠️  Warning: ${warningCount}`);
    console.log(`❌ Error: ${errorCount}\n`);
    const success = errorCount === 0;
    if (success) {
        console.log('✅ Accessibility token validation passed!\n');
    }
    else {
        console.log('❌ Accessibility token validation failed with errors.\n');
    }
    return {
        totalChecks: allResults.length,
        passCount,
        warningCount,
        errorCount,
        success,
        results: formattedResults
    };
}
/**
 * Main validation function for CLI usage
 */
function runBuildValidation() {
    const summary = validateAccessibilityTokens();
    // Exit with error code if validation failed
    if (!summary.success) {
        process.exit(1);
    }
}
// Run validation if executed directly
if (require.main === module) {
    runBuildValidation();
}
//# sourceMappingURL=buildValidation.js.map