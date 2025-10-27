/**
 * Example usage of VersionCalculator
 *
 * Demonstrates how to use the version calculation functionality
 * for semantic versioning based on extracted changes.
 */
import { ExtractedChanges } from '../types/AnalysisTypes';
export declare function demonstrateVersionCalculation(): {
    majorBump: import("./VersionCalculator").VersionRecommendation;
    minorBump: import("./VersionCalculator").VersionRecommendation;
    patchBump: import("./VersionCalculator").VersionRecommendation;
    validation: import("./VersionCalculator").ValidationResult;
};
export declare function exampleCLIIntegration(changes: ExtractedChanges, currentVersion: string): import("./VersionCalculator").VersionRecommendation;
//# sourceMappingURL=example-usage.d.ts.map