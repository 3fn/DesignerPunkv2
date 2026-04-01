/**
 * Blur Token Definitions
 *
 * Unified blur primitive family for all blur contexts: shadow edge softness,
 * glow radial spread, and surface/backdrop obscuring.
 *
 * Base value: 16 units (consistent with fontSize100)
 *
 * Scale:
 * - blur000:  0   (no blur)
 * - blur025:  4   (base × 0.25)
 * - blur050:  8   (base × 0.5)
 * - blur075: 12   (base × 0.75)
 * - blur100: 16   (base × 1)
 * - blur125: 20   (base × 1.25)
 * - blur150: 24   (base × 1.5)
 * - blur200: 32   (base × 2)
 * - blur250: 40   (base × 2.5)
 *
 * All values are multiples of 4 (baseline grid aligned).
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

export const BLUR_BASE_VALUE = 16;

function generateBlurPlatformValues(value: number): PlatformValues {
  return {
    web: { value, unit: 'px' },
    ios: { value, unit: 'pt' },
    android: { value, unit: 'dp' }
  };
}

export const blur: Record<string, PrimitiveToken> = {
  blur000: {
    name: 'blur000',
    category: TokenCategory.BLUR,
    baseValue: 0,
    familyBaseValue: BLUR_BASE_VALUE,
    description: 'No blur',
    mathematicalRelationship: '0',
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlurPlatformValues(0)
  },
  blur025: {
    name: 'blur025',
    category: TokenCategory.BLUR,
    baseValue: BLUR_BASE_VALUE * 0.25,
    familyBaseValue: BLUR_BASE_VALUE,
    description: 'Blur 025 - minimal blur',
    mathematicalRelationship: `base × 0.25 = ${BLUR_BASE_VALUE} × 0.25 = ${BLUR_BASE_VALUE * 0.25}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlurPlatformValues(BLUR_BASE_VALUE * 0.25)
  },
  blur050: {
    name: 'blur050',
    category: TokenCategory.BLUR,
    baseValue: BLUR_BASE_VALUE * 0.5,
    familyBaseValue: BLUR_BASE_VALUE,
    description: 'Blur 050 - light blur',
    mathematicalRelationship: `base × 0.5 = ${BLUR_BASE_VALUE} × 0.5 = ${BLUR_BASE_VALUE * 0.5}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlurPlatformValues(BLUR_BASE_VALUE * 0.5)
  },
  blur075: {
    name: 'blur075',
    category: TokenCategory.BLUR,
    baseValue: BLUR_BASE_VALUE * 0.75,
    familyBaseValue: BLUR_BASE_VALUE,
    description: 'Blur 075 - moderate blur',
    mathematicalRelationship: `base × 0.75 = ${BLUR_BASE_VALUE} × 0.75 = ${BLUR_BASE_VALUE * 0.75}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlurPlatformValues(BLUR_BASE_VALUE * 0.75)
  },
  blur100: {
    name: 'blur100',
    category: TokenCategory.BLUR,
    baseValue: BLUR_BASE_VALUE,
    familyBaseValue: BLUR_BASE_VALUE,
    description: 'Blur 100 - base blur value',
    mathematicalRelationship: `base × 1 = ${BLUR_BASE_VALUE} × 1 = ${BLUR_BASE_VALUE}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlurPlatformValues(BLUR_BASE_VALUE)
  },
  blur125: {
    name: 'blur125',
    category: TokenCategory.BLUR,
    baseValue: BLUR_BASE_VALUE * 1.25,
    familyBaseValue: BLUR_BASE_VALUE,
    description: 'Blur 125 - strong blur',
    mathematicalRelationship: `base × 1.25 = ${BLUR_BASE_VALUE} × 1.25 = ${BLUR_BASE_VALUE * 1.25}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlurPlatformValues(BLUR_BASE_VALUE * 1.25)
  },
  blur150: {
    name: 'blur150',
    category: TokenCategory.BLUR,
    baseValue: BLUR_BASE_VALUE * 1.5,
    familyBaseValue: BLUR_BASE_VALUE,
    description: 'Blur 150 - heavy blur',
    mathematicalRelationship: `base × 1.5 = ${BLUR_BASE_VALUE} × 1.5 = ${BLUR_BASE_VALUE * 1.5}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlurPlatformValues(BLUR_BASE_VALUE * 1.5)
  },
  blur200: {
    name: 'blur200',
    category: TokenCategory.BLUR,
    baseValue: BLUR_BASE_VALUE * 2,
    familyBaseValue: BLUR_BASE_VALUE,
    description: 'Blur 200 - intense blur',
    mathematicalRelationship: `base × 2 = ${BLUR_BASE_VALUE} × 2 = ${BLUR_BASE_VALUE * 2}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlurPlatformValues(BLUR_BASE_VALUE * 2)
  },
  blur250: {
    name: 'blur250',
    category: TokenCategory.BLUR,
    baseValue: BLUR_BASE_VALUE * 2.5,
    familyBaseValue: BLUR_BASE_VALUE,
    description: 'Blur 250 - maximum blur',
    mathematicalRelationship: `base × 2.5 = ${BLUR_BASE_VALUE} × 2.5 = ${BLUR_BASE_VALUE * 2.5}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlurPlatformValues(BLUR_BASE_VALUE * 2.5)
  },
};

export const blurNames = Object.keys(blur);

export function getBlurToken(name: string): PrimitiveToken | undefined {
  return blur[name];
}

export function getAllBlurTokens(): PrimitiveToken[] {
  return Object.values(blur);
}
