/**
 * Sizing Token Definitions
 *
 * Primitive token family for component dimensions (width, height, box size).
 * Separates dimensional sizing from spacing — spacing describes gaps,
 * sizing describes how big things are.
 *
 * Base value: 8 (aligns with baseline grid and spacing base)
 *
 * Scale:
 * - size050:   4   (base × 0.5)
 * - size100:   8   (base × 1)
 * - size150:  12   (base × 1.5)
 * - size200:  16   (base × 2)
 * - size250:  20   (base × 2.5)
 * - size300:  24   (base × 3)
 * - size400:  32   (base × 4)
 * - size500:  40   (base × 5)
 * - size600:  48   (base × 6)
 * - size700:  56   (base × 7)
 * - size800:  64   (base × 8)
 * - size1000: 80   (base × 10)
 * - size1600: 128  (base × 16)
 *
 * All values are multiples of 4 (baseline grid aligned).
 * Numeric suffixes match spacing: size300 = 24 = space300.
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

export const SIZING_BASE_VALUE = 8;

function generateSizingPlatformValues(value: number): PlatformValues {
  return {
    web: { value, unit: 'px' },
    ios: { value, unit: 'pt' },
    android: { value, unit: 'dp' }
  };
}

export const sizingTokens: Record<string, PrimitiveToken> = {
  size050: {
    name: 'size050',
    category: TokenCategory.SIZING,
    baseValue: SIZING_BASE_VALUE * 0.5,
    familyBaseValue: SIZING_BASE_VALUE,
    description: 'Size 050 - smallest component dimension',
    mathematicalRelationship: `base × 0.5 = ${SIZING_BASE_VALUE} × 0.5 = ${SIZING_BASE_VALUE * 0.5}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSizingPlatformValues(SIZING_BASE_VALUE * 0.5)
  },
  size100: {
    name: 'size100',
    category: TokenCategory.SIZING,
    baseValue: SIZING_BASE_VALUE,
    familyBaseValue: SIZING_BASE_VALUE,
    description: 'Size 100 - base component dimension',
    mathematicalRelationship: `base × 1 = ${SIZING_BASE_VALUE} × 1 = ${SIZING_BASE_VALUE}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSizingPlatformValues(SIZING_BASE_VALUE)
  },
  size150: {
    name: 'size150',
    category: TokenCategory.SIZING,
    baseValue: SIZING_BASE_VALUE * 1.5,
    familyBaseValue: SIZING_BASE_VALUE,
    description: 'Size 150 - small component dimension',
    mathematicalRelationship: `base × 1.5 = ${SIZING_BASE_VALUE} × 1.5 = ${SIZING_BASE_VALUE * 1.5}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSizingPlatformValues(SIZING_BASE_VALUE * 1.5)
  },
  size200: {
    name: 'size200',
    category: TokenCategory.SIZING,
    baseValue: SIZING_BASE_VALUE * 2,
    familyBaseValue: SIZING_BASE_VALUE,
    description: 'Size 200 - medium-small component dimension',
    mathematicalRelationship: `base × 2 = ${SIZING_BASE_VALUE} × 2 = ${SIZING_BASE_VALUE * 2}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSizingPlatformValues(SIZING_BASE_VALUE * 2)
  },
  size250: {
    name: 'size250',
    category: TokenCategory.SIZING,
    baseValue: SIZING_BASE_VALUE * 2.5,
    familyBaseValue: SIZING_BASE_VALUE,
    description: 'Size 250 - medium component dimension',
    mathematicalRelationship: `base × 2.5 = ${SIZING_BASE_VALUE} × 2.5 = ${SIZING_BASE_VALUE * 2.5}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSizingPlatformValues(SIZING_BASE_VALUE * 2.5)
  },
  size300: {
    name: 'size300',
    category: TokenCategory.SIZING,
    baseValue: SIZING_BASE_VALUE * 3,
    familyBaseValue: SIZING_BASE_VALUE,
    description: 'Size 300 - standard component dimension',
    mathematicalRelationship: `base × 3 = ${SIZING_BASE_VALUE} × 3 = ${SIZING_BASE_VALUE * 3}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSizingPlatformValues(SIZING_BASE_VALUE * 3)
  },
  size400: {
    name: 'size400',
    category: TokenCategory.SIZING,
    baseValue: SIZING_BASE_VALUE * 4,
    familyBaseValue: SIZING_BASE_VALUE,
    description: 'Size 400 - large component dimension',
    mathematicalRelationship: `base × 4 = ${SIZING_BASE_VALUE} × 4 = ${SIZING_BASE_VALUE * 4}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSizingPlatformValues(SIZING_BASE_VALUE * 4)
  },
  size500: {
    name: 'size500',
    category: TokenCategory.SIZING,
    baseValue: SIZING_BASE_VALUE * 5,
    familyBaseValue: SIZING_BASE_VALUE,
    description: 'Size 500 - extra-large component dimension',
    mathematicalRelationship: `base × 5 = ${SIZING_BASE_VALUE} × 5 = ${SIZING_BASE_VALUE * 5}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSizingPlatformValues(SIZING_BASE_VALUE * 5)
  },
  size600: {
    name: 'size600',
    category: TokenCategory.SIZING,
    baseValue: SIZING_BASE_VALUE * 6,
    familyBaseValue: SIZING_BASE_VALUE,
    description: 'Size 600 - prominent component dimension',
    mathematicalRelationship: `base × 6 = ${SIZING_BASE_VALUE} × 6 = ${SIZING_BASE_VALUE * 6}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSizingPlatformValues(SIZING_BASE_VALUE * 6)
  },
  size700: {
    name: 'size700',
    category: TokenCategory.SIZING,
    baseValue: SIZING_BASE_VALUE * 7,
    familyBaseValue: SIZING_BASE_VALUE,
    description: 'Size 700 - large prominent component dimension',
    mathematicalRelationship: `base × 7 = ${SIZING_BASE_VALUE} × 7 = ${SIZING_BASE_VALUE * 7}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSizingPlatformValues(SIZING_BASE_VALUE * 7)
  },
  size800: {
    name: 'size800',
    category: TokenCategory.SIZING,
    baseValue: SIZING_BASE_VALUE * 8,
    familyBaseValue: SIZING_BASE_VALUE,
    description: 'Size 800 - extra-large prominent component dimension',
    mathematicalRelationship: `base × 8 = ${SIZING_BASE_VALUE} × 8 = ${SIZING_BASE_VALUE * 8}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSizingPlatformValues(SIZING_BASE_VALUE * 8)
  },
  size1000: {
    name: 'size1000',
    category: TokenCategory.SIZING,
    baseValue: SIZING_BASE_VALUE * 10,
    familyBaseValue: SIZING_BASE_VALUE,
    description: 'Size 1000 - hero component dimension',
    mathematicalRelationship: `base × 10 = ${SIZING_BASE_VALUE} × 10 = ${SIZING_BASE_VALUE * 10}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSizingPlatformValues(SIZING_BASE_VALUE * 10)
  },
  size1600: {
    name: 'size1600',
    category: TokenCategory.SIZING,
    baseValue: SIZING_BASE_VALUE * 16,
    familyBaseValue: SIZING_BASE_VALUE,
    description: 'Size 1600 - maximum component dimension',
    mathematicalRelationship: `base × 16 = ${SIZING_BASE_VALUE} × 16 = ${SIZING_BASE_VALUE * 16}`,
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSizingPlatformValues(SIZING_BASE_VALUE * 16)
  },
};

export const sizingTokenNames = Object.keys(sizingTokens);

export function getSizingToken(name: string): PrimitiveToken | undefined {
  return sizingTokens[name];
}

export function getAllSizingTokens(): PrimitiveToken[] {
  return Object.values(sizingTokens);
}
