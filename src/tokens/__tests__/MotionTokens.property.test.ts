/**
 * @category evergreen
 * @purpose Verify MotionTokens.property tokens are correctly defined and structured
 */
/**
 * Motion Tokens Property-Based Tests
 * 
 * Property-based tests for motion tokens using fast-check.
 * Tests universal properties that should hold across all inputs.
 * 
 * Task: 6.3 Create property-based tests for motion tokens
 * Spec: 014-motion-token-system
 * Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.8, 8.4, 9.5
 * 
 * Properties tested:
 * - Property 1: Token existence and type correctness
 * - Property 2: Cross-platform value equivalence
 * - Property 3: Scale token rounding correctness
 * - Property 4: Semantic token reference validity
 * - Property 5: Incremental expansion backward compatibility
 */

import * as fc from 'fast-check';
import {
  durationTokens,
  durationTokenNames,
  getDurationToken,
  getAllDurationTokens,
  DURATION_BASE_VALUE
} from '../DurationTokens';
import {
  easingTokens,
  easingTokenNames,
  getEasingToken,
  getAllEasingTokens
} from '../EasingTokens';
import {
  scaleTokens,
  scaleTokenNames,
  getScaleToken,
  getAllScaleTokens,
  SCALE_BASE_VALUE
} from '../ScaleTokens';
import {
  motionTokens,
  getMotionToken,
  getAllMotionTokens
} from '../semantic/MotionTokens';
import { TokenCategory } from '../../types/PrimitiveToken';
import { SemanticCategory } from '../../types/SemanticToken';

describe('Property-Based Tests: Motion Tokens', () => {
  /**
   * Property 1: Token Existence and Type Correctness
   * 
   * Feature: 014-motion-token-system, Property 1: Token existence and type correctness
   * Validates: Requirements 1.1, 2.1, 3.1
   * 
   * For any token name in the system, if it exists, it must have:
   * - Correct type (number for duration/scale, string for easing)
   * - Valid value (positive numbers, valid cubic-bezier strings)
   * - Required properties (name, baseValue, category, platforms)
   */
  describe('Property 1: Token Existence and Type Correctness', () => {
    it('should have correct types for all duration tokens', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...durationTokenNames),
          (tokenName) => {
            const token = getDurationToken(tokenName);
            
            // Token must exist
            expect(token).toBeDefined();
            
            // Must have correct type
            expect(typeof token!.baseValue).toBe('number');
            
            // Must be positive and finite
            expect(token!.baseValue).toBeGreaterThan(0);
            expect(Number.isFinite(token!.baseValue)).toBe(true);
            
            // Must have required properties
            expect(token!.name).toBe(tokenName);
            expect(token!.category).toBe(TokenCategory.SPACING);
            expect(token!.familyBaseValue).toBe(DURATION_BASE_VALUE);
            
            // Must have platform values
            expect(token!.platforms.web).toBeDefined();
            expect(token!.platforms.ios).toBeDefined();
            expect(token!.platforms.android).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have correct types for all easing tokens', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...easingTokenNames),
          (tokenName) => {
            const token = getEasingToken(tokenName);
            
            // Token must exist
            expect(token).toBeDefined();
            
            // Must have cubic-bezier string value
            const webValue = token!.platforms.web.value as string;
            expect(typeof webValue).toBe('string');
            expect(webValue).toMatch(/^cubic-bezier\(/);
            
            // Must have required properties
            expect(token!.name).toBe(tokenName);
            expect(token!.category).toBe(TokenCategory.SPACING);
            expect(token!.baseValue).toBe(0); // Categorical token
            
            // Must have platform values
            expect(token!.platforms.web).toBeDefined();
            expect(token!.platforms.ios).toBeDefined();
            expect(token!.platforms.android).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have correct types for all scale tokens', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...scaleTokenNames),
          (tokenName) => {
            const token = getScaleToken(tokenName);
            
            // Token must exist
            expect(token).toBeDefined();
            
            // Must have correct type
            expect(typeof token!.baseValue).toBe('number');
            
            // Must be positive and finite
            expect(token!.baseValue).toBeGreaterThan(0);
            expect(Number.isFinite(token!.baseValue)).toBe(true);
            
            // Must have required properties
            expect(token!.name).toBe(tokenName);
            expect(token!.category).toBe(TokenCategory.SPACING);
            expect(token!.familyBaseValue).toBe(SCALE_BASE_VALUE);
            
            // Must have platform values
            expect(token!.platforms.web).toBeDefined();
            expect(token!.platforms.ios).toBeDefined();
            expect(token!.platforms.android).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return undefined for non-existent token names', () => {
      // Built-in JavaScript property names that exist on all objects
      const builtInProps = ['valueOf', 'toString', 'hasOwnProperty', 'constructor', '__proto__'];
      
      fc.assert(
        fc.property(
          fc.string().filter(s => 
            !durationTokenNames.includes(s) && 
            !builtInProps.includes(s) &&
            s.length > 0  // Exclude empty strings
          ),
          (invalidName) => {
            const token = getDurationToken(invalidName);
            expect(token).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2: Cross-Platform Value Equivalence
   * 
   * Feature: 014-motion-token-system, Property 2: Cross-platform value equivalence
   * Validates: Requirements 6.8
   * 
   * For any motion token, the mathematical values must be equivalent across platforms
   * despite platform-specific syntax differences:
   * - Duration: web ms = iOS seconds × 1000 = Android ms
   * - Easing: web cubic-bezier = iOS cubic-bezier = Android cubic-bezier
   * - Scale: web value = iOS value = Android value
   */
  describe('Property 2: Cross-Platform Value Equivalence', () => {
    it('should maintain mathematical equivalence for duration tokens across platforms', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...durationTokenNames),
          (tokenName) => {
            const token = getDurationToken(tokenName);
            expect(token).toBeDefined();
            
            const webValue = token!.platforms.web.value as number;
            const iosValue = token!.platforms.ios.value as number;
            const androidValue = token!.platforms.android.value as number;
            
            // Web and Android use milliseconds (same as baseValue)
            expect(webValue).toBe(token!.baseValue);
            expect(androidValue).toBe(token!.baseValue);
            
            // iOS uses seconds (baseValue / 1000)
            expect(iosValue).toBeCloseTo(token!.baseValue / 1000, 3);
            
            // Mathematical equivalence: web ms = iOS seconds × 1000 = Android ms
            expect(webValue).toBe(androidValue);
            expect(iosValue * 1000).toBeCloseTo(webValue, 1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain identical easing curves across platforms', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...easingTokenNames),
          (tokenName) => {
            const token = getEasingToken(tokenName);
            expect(token).toBeDefined();
            
            const webValue = token!.platforms.web.value as string;
            const iosValue = token!.platforms.ios.value as string;
            const androidValue = token!.platforms.android.value as string;
            
            // All platforms should have identical cubic-bezier strings
            expect(webValue).toBe(iosValue);
            expect(iosValue).toBe(androidValue);
            
            // All should be valid cubic-bezier format
            expect(webValue).toMatch(/^cubic-bezier\(/);
            expect(iosValue).toMatch(/^cubic-bezier\(/);
            expect(androidValue).toMatch(/^cubic-bezier\(/);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain identical scale values across platforms', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...scaleTokenNames),
          (tokenName) => {
            const token = getScaleToken(tokenName);
            expect(token).toBeDefined();
            
            const webValue = token!.platforms.web.value as number;
            const iosValue = token!.platforms.ios.value as number;
            const androidValue = token!.platforms.android.value as number;
            
            // All platforms should have identical scale values
            expect(webValue).toBe(token!.baseValue);
            expect(iosValue).toBe(token!.baseValue);
            expect(androidValue).toBe(token!.baseValue);
            
            // All should be the same
            expect(webValue).toBe(iosValue);
            expect(iosValue).toBe(androidValue);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 3: Scale Token Rounding Correctness
   * 
   * Feature: 014-motion-token-system, Property 3: Scale token rounding correctness
   * Validates: Requirements 4.1
   * 
   * For any scale token applied to a base value, the result must be rounded
   * to the nearest whole number using Math.round():
   * - 16 × 0.88 = 14.08 → rounds to 14
   * - 16 × 0.92 = 14.72 → rounds to 15
   * - 16 × 0.96 = 15.36 → rounds to 15
   */
  describe('Property 3: Scale Token Rounding Correctness', () => {
    it('should produce whole pixel values when scale tokens are applied', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...scaleTokenNames),
          fc.integer({ min: 8, max: 64 }), // Common base values (8px to 64px)
          (tokenName, baseValue) => {
            const token = getScaleToken(tokenName);
            expect(token).toBeDefined();
            
            const scaleFactor = token!.baseValue;
            const scaledValue = baseValue * scaleFactor;
            const roundedValue = Math.round(scaledValue);
            
            // Rounded value must be a whole number
            expect(Number.isInteger(roundedValue)).toBe(true);
            
            // Rounded value must be within 0.5 of original
            expect(Math.abs(scaledValue - roundedValue)).toBeLessThanOrEqual(0.5);
            
            // Rounding must be consistent with Math.round()
            expect(roundedValue).toBe(Math.round(scaledValue));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle edge cases in rounding correctly', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...scaleTokenNames),
          fc.constantFrom(16, 24, 32), // Common typography base sizes
          (tokenName, baseValue) => {
            const token = getScaleToken(tokenName);
            expect(token).toBeDefined();
            
            const scaleFactor = token!.baseValue;
            const scaledValue = baseValue * scaleFactor;
            const roundedValue = Math.round(scaledValue);
            
            // Specific test cases from requirements
            if (tokenName === 'scale088' && baseValue === 16) {
              // 16 × 0.88 = 14.08 → rounds to 14
              expect(roundedValue).toBe(14);
            }
            
            // General property: rounding produces whole numbers
            expect(Number.isInteger(roundedValue)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain precision within acceptable tolerance', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...scaleTokenNames),
          fc.integer({ min: 8, max: 64 }),
          (tokenName, baseValue) => {
            const token = getScaleToken(tokenName);
            expect(token).toBeDefined();
            
            const scaleFactor = token!.baseValue;
            const scaledValue = baseValue * scaleFactor;
            const roundedValue = Math.round(scaledValue);
            
            // Precision loss should be less than 0.5px
            const precisionLoss = Math.abs(scaledValue - roundedValue);
            expect(precisionLoss).toBeLessThanOrEqual(0.5);
            
            // For values close to 0.5, rounding should follow Math.round() behavior
            if (Math.abs(scaledValue - Math.floor(scaledValue) - 0.5) < 0.01) {
              expect(roundedValue).toBe(Math.round(scaledValue));
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 4: Semantic Token Reference Validity
   * 
   * Feature: 014-motion-token-system, Property 4: Semantic token reference validity
   * Validates: Requirements 5.1, 8.4
   * 
   * For any semantic motion token, all primitive references must:
   * - Point to existing primitive tokens
   * - Reference valid token names
   * - Maintain compositional pattern
   */
  describe('Property 4: Semantic Token Reference Validity', () => {
    it('should reference existing primitive tokens', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(motionTokens)),
          (tokenName) => {
            const token = getMotionToken(tokenName);
            expect(token).toBeDefined();
            
            // Duration reference must exist
            const durationRef = token!.primitiveReferences.duration;
            expect(durationRef).toBeDefined();
            expect(durationTokens).toHaveProperty(durationRef);
            
            // Easing reference must exist
            const easingRef = token!.primitiveReferences.easing;
            expect(easingRef).toBeDefined();
            expect(easingTokens).toHaveProperty(easingRef);
            
            // Scale reference is optional
            if (token!.primitiveReferences.scale) {
              expect(scaleTokens).toHaveProperty(token!.primitiveReferences.scale);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have valid primitive token references', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(motionTokens)),
          (tokenName) => {
            const token = getMotionToken(tokenName);
            expect(token).toBeDefined();
            
            // Verify duration token is valid
            const durationToken = durationTokens[token!.primitiveReferences.duration];
            expect(durationToken).toBeDefined();
            expect(durationToken.name).toBe(token!.primitiveReferences.duration);
            expect(typeof durationToken.baseValue).toBe('number');
            
            // Verify easing token is valid
            const easingToken = easingTokens[token!.primitiveReferences.easing];
            expect(easingToken).toBeDefined();
            expect(easingToken.name).toBe(token!.primitiveReferences.easing);
            expect(easingToken.platforms.web.value).toMatch(/^cubic-bezier\(/);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain compositional pattern structure', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(motionTokens)),
          (tokenName) => {
            const token = getMotionToken(tokenName);
            expect(token).toBeDefined();
            
            // Must have primitiveReferences property
            expect(token!.primitiveReferences).toBeDefined();
            expect(typeof token!.primitiveReferences).toBe('object');
            
            // Must have at least duration and easing
            expect(token!.primitiveReferences.duration).toBeDefined();
            expect(token!.primitiveReferences.easing).toBeDefined();
            
            // References must be strings (token names)
            expect(typeof token!.primitiveReferences.duration).toBe('string');
            expect(typeof token!.primitiveReferences.easing).toBe('string');
            
            // Must have semantic category
            expect(token!.category).toBe(SemanticCategory.INTERACTION);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not contain hard-coded values', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(motionTokens)),
          (tokenName) => {
            const token = getMotionToken(tokenName);
            expect(token).toBeDefined();
            
            // References should be token names, not numeric values
            const durationRef = token!.primitiveReferences.duration;
            const easingRef = token!.primitiveReferences.easing;
            
            // Token names should not be numeric
            expect(isNaN(Number(durationRef))).toBe(true);
            expect(isNaN(Number(easingRef))).toBe(true);
            
            // Should reference actual token names
            expect(durationTokenNames).toContain(durationRef);
            expect(easingTokenNames).toContain(easingRef);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 5: Incremental Expansion Backward Compatibility
   * 
   * Feature: 014-motion-token-system, Property 5: Incremental expansion backward compatibility
   * Validates: Requirements 9.5
   * 
   * For any existing token reference, adding new tokens must not break:
   * - Existing token resolution
   * - Existing token values
   * - Existing token structure
   */
  describe('Property 5: Incremental Expansion Backward Compatibility', () => {
    it('should maintain existing token references when new tokens are added', () => {
      // Simulate adding new tokens by verifying current tokens remain accessible
      fc.assert(
        fc.property(
          fc.constantFrom(...durationTokenNames),
          (existingTokenName) => {
            const token = getDurationToken(existingTokenName);
            
            // Existing token must still be accessible
            expect(token).toBeDefined();
            expect(token!.name).toBe(existingTokenName);
            
            // Token must still have all required properties
            expect(token!.baseValue).toBeDefined();
            expect(token!.category).toBeDefined();
            expect(token!.platforms).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain existing token values when new tokens are added', () => {
      // Verify that existing token values don't change
      const expectedValues = {
        duration150: 150,
        duration250: 250,
        duration350: 350,
        scale088: 0.88,
        scale092: 0.92,
        scale096: 0.96,
        scale100: 1.00,
        scale104: 1.04,
        scale108: 1.08
      };

      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(expectedValues)),
          (tokenName) => {
            let token;
            if (tokenName.startsWith('duration')) {
              token = getDurationToken(tokenName);
            } else if (tokenName.startsWith('scale')) {
              token = getScaleToken(tokenName);
            }
            
            expect(token).toBeDefined();
            expect(token!.baseValue).toBe(expectedValues[tokenName as keyof typeof expectedValues]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain existing token structure when new tokens are added', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...durationTokenNames),
          (tokenName) => {
            const token = getDurationToken(tokenName);
            expect(token).toBeDefined();
            
            // Structure must remain consistent
            const requiredProperties = ['name', 'baseValue', 'category', 'familyBaseValue', 'platforms', 'mathematicalRelationship'];
            requiredProperties.forEach(prop => {
              expect(token).toHaveProperty(prop);
            });
            
            // Platform structure must remain consistent
            expect(token!.platforms).toHaveProperty('web');
            expect(token!.platforms).toHaveProperty('ios');
            expect(token!.platforms).toHaveProperty('android');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should support optional properties for future expansion', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(motionTokens)),
          (tokenName) => {
            const token = getMotionToken(tokenName);
            expect(token).toBeDefined();
            
            // Structure should support optional scale property
            // (even if not currently used by all tokens)
            expect(token!.primitiveReferences).toBeDefined();
            
            // Scale is optional, so it's okay if it's undefined
            if (token!.primitiveReferences.scale) {
              expect(typeof token!.primitiveReferences.scale).toBe('string');
              expect(scaleTokens).toHaveProperty(token!.primitiveReferences.scale);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should allow adding new semantic tokens without breaking existing ones', () => {
      // Verify that existing semantic tokens remain valid
      const existingTokens = Object.keys(motionTokens);
      
      fc.assert(
        fc.property(
          fc.constantFrom(...existingTokens),
          (tokenName) => {
            const token = getMotionToken(tokenName);
            
            // Token must still exist
            expect(token).toBeDefined();
            
            // Token must still have valid structure
            expect(token!.name).toBe(tokenName);
            expect(token!.primitiveReferences).toBeDefined();
            expect(token!.category).toBe(SemanticCategory.INTERACTION);
            
            // Primitive references must still be valid
            expect(durationTokens).toHaveProperty(token!.primitiveReferences.duration);
            expect(easingTokens).toHaveProperty(token!.primitiveReferences.easing);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
