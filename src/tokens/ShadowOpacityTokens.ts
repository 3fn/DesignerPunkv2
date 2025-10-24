/**
 * Shadow Opacity Token Definitions
 * 
 * Shadow opacity tokens determine shadow darkness based on quality and depth.
 * Base value: 0.3 (unitless)
 * 
 * Quality-based opacity tokens:
 * - shadowOpacityHard: 0.4 (darker for sharp shadows)
 * - shadowOpacityModerate: 0.3 (balanced opacity)
 * - shadowOpacitySoft: 0.2 (lighter for diffuse shadows)
 * 
 * Depth-based opacity tokens:
 * - shadowOpacityDepth200: 0.35 (slightly darker for raised elements)
 * - shadowOpacityDepth300: 0.4 (darkest for floating elements)
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

export const SHADOW_OPACITY_BASE_VALUE = 0.3;

function generateShadowOpacityPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'unitless' },
    ios: { value: baseValue, unit: 'unitless' },
    android: { value: baseValue, unit: 'unitless' }
  };
}

export const shadowOpacityTokens: Record<string, PrimitiveToken> = {
  shadowOpacityHard: {
    name: 'shadowOpacityHard',
    category: TokenCategory.SHADOW,
    baseValue: Math.round(SHADOW_OPACITY_BASE_VALUE * 1.33 * 100) / 100,
    familyBaseValue: SHADOW_OPACITY_BASE_VALUE,
    description: 'Hard shadow opacity - darker for sharp shadows',
    mathematicalRelationship: 'base × 1.33 = 0.3 × 1.33 ≈ 0.4',
    baselineGridAlignment: false, // Opacity is unitless
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOpacityPlatformValues(Math.round(SHADOW_OPACITY_BASE_VALUE * 1.33 * 100) / 100)
  },
  
  shadowOpacityModerate: {
    name: 'shadowOpacityModerate',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_OPACITY_BASE_VALUE,
    familyBaseValue: SHADOW_OPACITY_BASE_VALUE,
    description: 'Moderate shadow opacity - balanced opacity',
    mathematicalRelationship: 'base × 1 = 0.3 × 1 = 0.3',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOpacityPlatformValues(SHADOW_OPACITY_BASE_VALUE)
  },
  
  shadowOpacitySoft: {
    name: 'shadowOpacitySoft',
    category: TokenCategory.SHADOW,
    baseValue: Math.round(SHADOW_OPACITY_BASE_VALUE * 0.67 * 100) / 100,
    familyBaseValue: SHADOW_OPACITY_BASE_VALUE,
    description: 'Soft shadow opacity - lighter for diffuse shadows',
    mathematicalRelationship: 'base × 0.67 = 0.3 × 0.67 ≈ 0.2',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOpacityPlatformValues(Math.round(SHADOW_OPACITY_BASE_VALUE * 0.67 * 100) / 100)
  },
  
  shadowOpacityDepth200: {
    name: 'shadowOpacityDepth200',
    category: TokenCategory.SHADOW,
    baseValue: Math.round(SHADOW_OPACITY_BASE_VALUE * 1.17 * 100) / 100,
    familyBaseValue: SHADOW_OPACITY_BASE_VALUE,
    description: 'Depth 200 opacity adjustment - slightly darker for raised elements',
    mathematicalRelationship: 'base × 1.17 = 0.3 × 1.17 ≈ 0.35',
    baselineGridAlignment: false,
    isStrategicFlexibility: true, // Strategic flexibility for visual quality
    isPrecisionTargeted: false,
    platforms: generateShadowOpacityPlatformValues(Math.round(SHADOW_OPACITY_BASE_VALUE * 1.17 * 100) / 100)
  },
  
  shadowOpacityDepth300: {
    name: 'shadowOpacityDepth300',
    category: TokenCategory.SHADOW,
    baseValue: Math.round(SHADOW_OPACITY_BASE_VALUE * 1.33 * 100) / 100,
    familyBaseValue: SHADOW_OPACITY_BASE_VALUE,
    description: 'Depth 300 opacity adjustment - darkest for floating elements',
    mathematicalRelationship: 'base × 1.33 = 0.3 × 1.33 ≈ 0.4',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOpacityPlatformValues(Math.round(SHADOW_OPACITY_BASE_VALUE * 1.33 * 100) / 100)
  }
};

// Helper functions
export function getShadowOpacityToken(name: string): PrimitiveToken | undefined {
  return shadowOpacityTokens[name];
}

export function getAllShadowOpacityTokens(): PrimitiveToken[] {
  return Object.values(shadowOpacityTokens);
}

export const shadowOpacityTokenNames = Object.keys(shadowOpacityTokens);
