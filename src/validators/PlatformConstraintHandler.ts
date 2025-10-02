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
export enum ConstraintType {
  /** Rounding constraints due to platform unit systems */
  ROUNDING = 'rounding',
  
  /** Minimum/maximum value constraints */
  VALUE_BOUNDS = 'value_bounds',
  
  /** Unit conversion precision limitations */
  CONVERSION_PRECISION = 'conversion_precision',
  
  /** Platform-specific rendering constraints */
  RENDERING = 'rendering',
  
  /** Accessibility requirement constraints */
  ACCESSIBILITY = 'accessibility',
  
  /** Font system constraints */
  FONT_SYSTEM = 'font_system'
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
 * Platform-specific constraint definitions
 */
interface PlatformConstraintDefinition {
  platform: string;
  category: TokenCategory;
  constraint: (value: number | string) => PlatformConstraint | null;
}

/**
 * Handler for platform-specific constraints in cross-platform token systems
 */
export class PlatformConstraintHandler {
  private constraintDefinitions: PlatformConstraintDefinition[] = [];

  constructor() {
    this.initializeConstraintDefinitions();
  }

  /**
   * Initialize known platform constraint definitions
   */
  private initializeConstraintDefinitions(): void {
    // Web platform constraints
    this.addConstraintDefinition('web', TokenCategory.FONT_SIZE, (value) => {
      if (typeof value === 'number' && value < 0.5) {
        return {
          type: ConstraintType.RENDERING,
          platforms: ['web'],
          category: TokenCategory.FONT_SIZE,
          description: 'Web browsers may not render fonts smaller than 0.5rem reliably',
          originalValue: value,
          constrainedValue: 0.5,
          impact: 'Minimum font size enforced to maintain readability',
          recommendation: 'Use 0.5rem as minimum font size for web platform',
          severity: 'medium'
        };
      }
      return null;
    });

    // iOS platform constraints
    this.addConstraintDefinition('ios', TokenCategory.TAP_AREA, (value) => {
      if (typeof value === 'number' && value < 44) {
        return {
          type: ConstraintType.ACCESSIBILITY,
          platforms: ['ios'],
          category: TokenCategory.TAP_AREA,
          description: 'iOS Human Interface Guidelines require minimum 44pt tap targets',
          originalValue: value,
          constrainedValue: 44,
          impact: 'Minimum tap area enforced for accessibility compliance',
          recommendation: 'Use 44pt minimum for iOS tap targets',
          severity: 'high'
        };
      }
      return null;
    });

    // Android platform constraints
    this.addConstraintDefinition('android', TokenCategory.TAP_AREA, (value) => {
      if (typeof value === 'number' && value < 48) {
        return {
          type: ConstraintType.ACCESSIBILITY,
          platforms: ['android'],
          category: TokenCategory.TAP_AREA,
          description: 'Android Material Design requires minimum 48dp touch targets',
          originalValue: value,
          constrainedValue: 48,
          impact: 'Minimum touch target enforced for accessibility compliance',
          recommendation: 'Use 48dp minimum for Android touch targets',
          severity: 'high'
        };
      }
      return null;
    });

    // Cross-platform font weight constraints
    ['web', 'ios', 'android'].forEach(platform => {
      this.addConstraintDefinition(platform, TokenCategory.FONT_WEIGHT, (value) => {
        if (typeof value === 'number' && (value < 100 || value > 900)) {
          const clampedValue = Math.max(100, Math.min(900, value));
          
          return {
            type: ConstraintType.FONT_SYSTEM,
            platforms: [platform],
            category: TokenCategory.FONT_WEIGHT,
            description: `${platform} font systems support weights in 100-900 range`,
            originalValue: value,
            constrainedValue: clampedValue,
            impact: 'Font weight clamped to supported range',
            recommendation: `Use font weights between 100-900 (intermediate values like 450 are supported)`,
            severity: 'low'
          };
        }
        return null;
      });
    });

    // REM conversion precision constraints for web
    // Note: This constraint should only apply to pixel values being converted to REM,
    // not to values that are already in REM units
    this.addConstraintDefinition('web', TokenCategory.FONT_SIZE, (value) => {
      if (typeof value === 'number') {
        // Only apply precision constraint if the value appears to be in pixels (> 10)
        // Values already in REM (typically 0.5-5) should not be precision-constrained
        if (value > 10) {
          const remValue = value / 16; // Convert pixels to REM
          const decimalPlaces = (remValue.toString().split('.')[1] || '').length;
          
          if (decimalPlaces > 3) {
            const roundedValue = Math.round(remValue * 1000) / 1000;
            
            return {
              type: ConstraintType.CONVERSION_PRECISION,
              platforms: ['web'],
              category: TokenCategory.FONT_SIZE,
              description: 'REM values with excessive decimal places may cause rendering inconsistencies',
              originalValue: value,
              constrainedValue: roundedValue * 16, // Convert back to pixels
              impact: 'REM value rounded to 3 decimal places for consistency',
              recommendation: 'Limit REM precision to 3 decimal places',
              severity: 'low'
            };
          }
        }
      }
      return null;
    });
  }

  /**
   * Add a constraint definition for a specific platform and category
   */
  private addConstraintDefinition(
    platform: string,
    category: TokenCategory,
    constraint: (value: number | string) => PlatformConstraint | null
  ): void {
    this.constraintDefinitions.push({ platform, category, constraint });
  }

  /**
   * Identify constraints for a given token across platforms
   */
  identifyConstraints(
    tokenName: string,
    category: TokenCategory,
    platformValues: Record<string, PlatformValues[keyof PlatformValues]>
  ): PlatformConstraint[] {
    const constraints: PlatformConstraint[] = [];

    Object.entries(platformValues).forEach(([platform, platformValue]) => {
      const relevantDefinitions = this.constraintDefinitions.filter(
        def => def.platform === platform && def.category === category
      );

      relevantDefinitions.forEach(definition => {
        const constraint = definition.constraint(platformValue.value);
        if (constraint) {
          constraints.push(constraint);
        }
      });
    });

    return constraints;
  }

  /**
   * Handle identified constraints and provide adjusted values
   */
  handleConstraints(
    tokenName: string,
    category: TokenCategory,
    platformValues: Record<string, PlatformValues[keyof PlatformValues]>,
    unitProviders: Record<string, UnitProvider>
  ): ConstraintHandlingResult {
    const constraints = this.identifyConstraints(tokenName, category, platformValues);
    
    if (constraints.length === 0) {
      return {
        hasConstraints: false,
        constraints: [],
        adjustedValues: platformValues,
        strategy: 'No constraints identified - original values maintained',
        consistencyAssessment: 'Mathematical consistency preserved across all platforms'
      };
    }

    // Apply constraint adjustments
    const adjustedValues = { ...platformValues };
    const handlingStrategies: string[] = [];

    constraints.forEach(constraint => {
      constraint.platforms.forEach(platform => {
        if (adjustedValues[platform]) {
          const originalValue = adjustedValues[platform].value;
          adjustedValues[platform] = {
            ...adjustedValues[platform],
            value: constraint.constrainedValue
          };

          handlingStrategies.push(
            `${platform}: ${constraint.description} (${originalValue} → ${constraint.constrainedValue})`
          );
        }
      });
    });

    // Assess mathematical consistency after constraint handling
    const consistencyAssessment = this.assessConsistencyAfterConstraints(
      constraints,
      platformValues,
      adjustedValues
    );

    return {
      hasConstraints: true,
      constraints,
      adjustedValues,
      strategy: handlingStrategies.join('; '),
      consistencyAssessment
    };
  }

  /**
   * Assess mathematical consistency after applying constraint handling
   */
  private assessConsistencyAfterConstraints(
    constraints: PlatformConstraint[],
    originalValues: Record<string, PlatformValues[keyof PlatformValues]>,
    adjustedValues: Record<string, PlatformValues[keyof PlatformValues]>
  ): string {
    const highSeverityConstraints = constraints.filter(c => c.severity === 'high');
    const mediumSeverityConstraints = constraints.filter(c => c.severity === 'medium');
    const lowSeverityConstraints = constraints.filter(c => c.severity === 'low');

    const assessments: string[] = [];

    if (highSeverityConstraints.length > 0) {
      assessments.push(
        `High-severity constraints applied (${highSeverityConstraints.length}): ` +
        'Platform requirements enforced, proportional relationships maintained where possible'
      );
    }

    if (mediumSeverityConstraints.length > 0) {
      assessments.push(
        `Medium-severity constraints applied (${mediumSeverityConstraints.length}): ` +
        'Platform optimization applied with minimal impact on mathematical relationships'
      );
    }

    if (lowSeverityConstraints.length > 0) {
      assessments.push(
        `Low-severity constraints applied (${lowSeverityConstraints.length}): ` +
        'Minor precision adjustments for platform compatibility'
      );
    }

    // Check if proportional relationships are maintained
    const proportionalityMaintained = this.checkProportionalityMaintained(
      originalValues,
      adjustedValues
    );

    if (proportionalityMaintained) {
      assessments.push('Proportional relationships maintained across platforms');
    } else {
      assessments.push('Some proportional relationships affected by platform constraints');
    }

    return assessments.join('; ');
  }

  /**
   * Check if proportional relationships are maintained after constraint handling
   */
  private checkProportionalityMaintained(
    originalValues: Record<string, PlatformValues[keyof PlatformValues]>,
    adjustedValues: Record<string, PlatformValues[keyof PlatformValues]>
  ): boolean {
    const platforms = Object.keys(originalValues);
    
    if (platforms.length < 2) return true;

    // Compare ratios between platforms
    for (let i = 0; i < platforms.length - 1; i++) {
      for (let j = i + 1; j < platforms.length; j++) {
        const platform1 = platforms[i];
        const platform2 = platforms[j];

        const original1 = originalValues[platform1].value;
        const original2 = originalValues[platform2].value;
        const adjusted1 = adjustedValues[platform1].value;
        const adjusted2 = adjustedValues[platform2].value;

        // Skip comparison for string values
        if (typeof original1 !== 'number' || typeof original2 !== 'number' ||
            typeof adjusted1 !== 'number' || typeof adjusted2 !== 'number') {
          continue;
        }

        // Calculate original and adjusted ratios
        if (original2 !== 0 && adjusted2 !== 0) {
          const originalRatio = original1 / original2;
          const adjustedRatio = adjusted1 / adjusted2;
          const ratioChange = Math.abs(originalRatio - adjustedRatio) / originalRatio;

          // If ratio changed by more than 5%, proportionality is affected
          if (ratioChange > 0.05) {
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * Get documentation for all known constraints
   */
  getConstraintDocumentation(): Record<string, any> {
    const documentation: Record<string, any> = {
      web: {
        fontSize: 'Minimum 0.5rem for reliable rendering',
        fontWeight: 'Font weights 100-900 supported (intermediate values like 450 allowed)',
        remPrecision: 'Limited to 3 decimal places for consistency'
      },
      ios: {
        tapArea: 'Minimum 44pt for accessibility compliance (HIG)',
        fontWeight: 'Font weights 100-900 supported (intermediate values allowed)'
      },
      android: {
        tapArea: 'Minimum 48dp for accessibility compliance (Material Design)',
        fontWeight: 'Font weights 100-900 supported (intermediate values allowed)'
      }
    };

    return documentation;
  }

  /**
   * Validate that constraint handling maintains design system integrity
   */
  validateConstraintHandling(result: ConstraintHandlingResult): boolean {
    // Ensure no high-severity constraints are ignored
    const ignoredHighSeverity = result.constraints.filter(
      c => c.severity === 'high' && 
      !result.strategy.includes(c.platforms[0])
    );

    if (ignoredHighSeverity.length > 0) {
      return false;
    }

    // Ensure adjusted values are reasonable
    const hasUnreasonableValues = Object.values(result.adjustedValues).some(value => {
      if (typeof value.value === 'number') {
        return value.value < 0 || value.value > 10000; // Reasonable bounds
      }
      return false;
    });

    return !hasUnreasonableValues;
  }
}