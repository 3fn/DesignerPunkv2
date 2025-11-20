/**
 * Build Validation Script
 *
 * Integrates accessibility token validation into the build pipeline.
 * Validates accessibility tokens against WCAG requirements and reports
 * Pass/Warning/Error results.
 *
 * Requirements: 11.3, 11.6
 */
/**
 * Validation result summary for build output
 */
interface BuildValidationSummary {
    totalChecks: number;
    passCount: number;
    warningCount: number;
    errorCount: number;
    success: boolean;
    results: Array<{
        token: string;
        level: string;
        message: string;
    }>;
}
/**
 * Validate accessibility tokens during build
 */
export declare function validateAccessibilityTokens(): BuildValidationSummary;
/**
 * Main validation function for CLI usage
 */
export declare function runBuildValidation(): void;
export {};
//# sourceMappingURL=buildValidation.d.ts.map