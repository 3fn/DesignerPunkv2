/**
 * Platform Constraint Handler for Cross-Platform Mathematical Consistency
 *
 * Identifies, documents, and handles platform-specific constraints that may
 * prevent exact mathematical equivalence while maintaining proportional relationships.
 */
import { TokenCategory, PlatformValues } from '../types';
import { UnitProvider } from '../providers/UnitProvider';
/**
 * Platform-specific constraint types
 */
export declare enum ConstraintType {
    /** Rounding constraints due to platform unit systems */
    ROUNDING = "rounding",
    /** Minimum/maximum value constraints */
    VALUE_BOUNDS = "value_bounds",
    /** Unit conversion precision limitations */
    CONVERSION_PRECISION = "conversion_precision",
    /** Platform-specific rendering constraints */
    RENDERING = "rendering",
    /** Accessibility requirement constraints */
    ACCESSIBILITY = "accessibility",
    /** Font system constraints */
    FONT_SYSTEM = "font_system"
}
/**
 * Identified platform constraint
 */
export interface PlatformConstraint {
    /** Type of constraint */
    type: ConstraintType;
    /** Platform(s) affected */
    platforms: string[];
    /** Token category affected */
    category: TokenCategory;
    /** Description of the constraint */
    description: string;
    /** Original intended value */
    originalValue: number | string;
    /** Constrained value that platform can support */
    constrainedValue: number | string;
    /** Mathematical impact of the constraint */
    impact: string;
    /** Recommended handling approach */
    recommendation: string;
    /** Severity level */
    severity: 'low' | 'medium' | 'high';
}
/**
 * Constraint handling result
 */
export interface ConstraintHandlingResult {
    /** Whether constraints were found */
    hasConstraints: boolean;
    /** List of identified constraints */
    constraints: PlatformConstraint[];
    /** Adjusted values that respect constraints */
    adjustedValues: Record<string, PlatformValues[keyof PlatformValues]>;
    /** Overall handling strategy */
    strategy: string;
    /** Mathematical consistency assessment */
    consistencyAssessment: string;
}
/**
 * Handler for platform-specific constraints in cross-platform token systems
 */
export declare class PlatformConstraintHandler {
    private constraintDefinitions;
    constructor();
    /**
     * Initialize known platform constraint definitions
     */
    private initializeConstraintDefinitions;
    /**
     * Add a constraint definition for a specific platform and category
     */
    private addConstraintDefinition;
    /**
     * Identify constraints for a given token across platforms
     */
    identifyConstraints(tokenName: string, category: TokenCategory, platformValues: Record<string, PlatformValues[keyof PlatformValues]>): PlatformConstraint[];
    /**
     * Handle identified constraints and provide adjusted values
     */
    handleConstraints(tokenName: string, category: TokenCategory, platformValues: Record<string, PlatformValues[keyof PlatformValues]>, unitProviders: Record<string, UnitProvider>): ConstraintHandlingResult;
    /**
     * Assess mathematical consistency after applying constraint handling
     */
    private assessConsistencyAfterConstraints;
    /**
     * Check if proportional relationships are maintained after constraint handling
     */
    private checkProportionalityMaintained;
    /**
     * Get documentation for all known constraints
     */
    getConstraintDocumentation(): Record<string, any>;
    /**
     * Validate that constraint handling maintains design system integrity
     */
    validateConstraintHandling(result: ConstraintHandlingResult): boolean;
}
//# sourceMappingURL=PlatformConstraintHandler.d.ts.map