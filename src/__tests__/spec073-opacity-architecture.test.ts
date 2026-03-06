/**
 * @category evergreen
 * @purpose Verify Spec 073 new features: TokenModifier, modeInvariant, modifier validation, generator resolution, scrim token
 */
/**
 * Spec 073 — Opacity Architecture Evolution
 *
 * Tests for: TokenModifier type, modeInvariant field, PrimitiveReferenceValidator.validateModifiers,
 * SemanticTokenValidator mode-invariance detection, generator modifier resolution,
 * and color.scrim.standard end-to-end integration.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { SemanticCategory } from '../types/SemanticToken';
import type { SemanticToken, TokenModifier } from '../types/SemanticToken';
import { TokenCategory } from '../types/PrimitiveToken';
import type { PrimitiveToken, ColorTokenValue } from '../types/PrimitiveToken';
import { PrimitiveTokenRegistry } from '../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../registries/SemanticTokenRegistry';
import { SemanticTokenValidator } from '../validators/SemanticTokenValidator';
import { WebFormatGenerator } from '../providers/WebFormatGenerator';
import { iOSFormatGenerator } from '../providers/iOSFormatGenerator';
import { AndroidFormatGenerator } from '../providers/AndroidFormatGenerator';
import { getSemanticToken } from '../tokens/semantic/index';

// --- Test fixtures ---

const black500: PrimitiveToken = {
  name: 'black500',
  category: TokenCategory.COLOR,
  baseValue: 0,
  familyBaseValue: 0,
  description: 'Pure black',
  mathematicalRelationship: 'pure black',
  baselineGridAlignment: false,
  isStrategicFlexibility: false,
  isPrecisionTargeted: false,
  platforms: {
    web: { value: { light: { base: 'rgba(0, 0, 0, 1)' }, dark: { base: 'rgba(0, 0, 0, 1)' } } as ColorTokenValue, unit: 'rgba' as const },
    ios: { value: { light: { base: 'rgba(0, 0, 0, 1)' }, dark: { base: 'rgba(0, 0, 0, 1)' } } as ColorTokenValue, unit: 'rgba' as const },
    android: { value: { light: { base: 'rgba(0, 0, 0, 1)' }, dark: { base: 'rgba(0, 0, 0, 1)' } } as ColorTokenValue, unit: 'rgba' as const }
  }
};

const opacity080: PrimitiveToken = {
  name: 'opacity080',
  category: TokenCategory.OPACITY,
  baseValue: 0.80,
  familyBaseValue: 0.08,
  description: '80% opacity',
  mathematicalRelationship: 'base × 10',
  baselineGridAlignment: false,
  isStrategicFlexibility: false,
  isPrecisionTargeted: false,
  platforms: {
    web: { value: 0.80, unit: 'unitless' as const },
    ios: { value: 0.80, unit: 'unitless' as const },
    android: { value: 0.80, unit: 'unitless' as const }
  }
};

/** A mode-aware color: light and dark differ */
const modeAwareColor: PrimitiveToken = {
  name: 'surface100',
  category: TokenCategory.COLOR,
  baseValue: 0,
  familyBaseValue: 0,
  description: 'Mode-aware surface',
  mathematicalRelationship: 'surface scale',
  baselineGridAlignment: false,
  isStrategicFlexibility: false,
  isPrecisionTargeted: false,
  platforms: {
    web: { value: { light: { base: 'rgba(255, 255, 255, 1)' }, dark: { base: 'rgba(30, 30, 30, 1)' } } as ColorTokenValue, unit: 'rgba' as const },
    ios: { value: { light: { base: 'rgba(255, 255, 255, 1)' }, dark: { base: 'rgba(30, 30, 30, 1)' } } as ColorTokenValue, unit: 'rgba' as const },
    android: { value: { light: { base: 'rgba(255, 255, 255, 1)' }, dark: { base: 'rgba(30, 30, 30, 1)' } } as ColorTokenValue, unit: 'rgba' as const }
  }
};

const space100: PrimitiveToken = {
  name: 'space100',
  category: TokenCategory.SPACING,
  baseValue: 8,
  familyBaseValue: 8,
  description: 'Base spacing',
  mathematicalRelationship: 'base × 1',
  baselineGridAlignment: true,
  isStrategicFlexibility: false,
  isPrecisionTargeted: false,
  platforms: {
    web: { value: 8, unit: 'px' },
    ios: { value: 8, unit: 'pt' },
    android: { value: 8, unit: 'dp' }
  }
};

function makeSemanticToken(overrides: Partial<SemanticToken> & { name: string }): SemanticToken {
  return {
    primitiveReferences: { value: 'black500' },
    category: SemanticCategory.COLOR,
    context: 'test',
    description: 'test token',
    ...overrides
  };
}

// --- Tests ---

describe('Spec 073: TokenModifier type validation', () => {
  it('should accept a valid opacity modifier', () => {
    const mod: TokenModifier = { type: 'opacity', reference: 'opacity080' };
    expect(mod.type).toBe('opacity');
    expect(mod.reference).toBe('opacity080');
  });

  it('should be assignable to SemanticToken.modifiers', () => {
    const token = makeSemanticToken({
      name: 'test.modifier',
      modifiers: [{ type: 'opacity', reference: 'opacity080' }]
    });
    expect(token.modifiers).toHaveLength(1);
    expect(token.modifiers![0].type).toBe('opacity');
  });

  it('should allow SemanticToken without modifiers (backward compat)', () => {
    const token = makeSemanticToken({ name: 'test.nomod' });
    expect(token.modifiers).toBeUndefined();
  });
});

describe('Spec 073: modeInvariant field validation', () => {
  it('should accept modeInvariant: true', () => {
    const token = makeSemanticToken({ name: 'test.invariant', modeInvariant: true });
    expect(token.modeInvariant).toBe(true);
  });

  it('should default to undefined when not set', () => {
    const token = makeSemanticToken({ name: 'test.default' });
    expect(token.modeInvariant).toBeUndefined();
  });
});

describe('Spec 073: PrimitiveReferenceValidator.validateModifiers', () => {
  let primitiveRegistry: PrimitiveTokenRegistry;
  let semanticRegistry: SemanticTokenRegistry;
  let validator: SemanticTokenValidator;

  beforeEach(() => {
    primitiveRegistry = new PrimitiveTokenRegistry();
    semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
    validator = new SemanticTokenValidator(primitiveRegistry, semanticRegistry);
    primitiveRegistry.register(black500);
    primitiveRegistry.register(opacity080);
    primitiveRegistry.register(space100);
  });

  it('should pass for valid opacity modifier reference', () => {
    const token = makeSemanticToken({
      name: 'color.scrim.test',
      modifiers: [{ type: 'opacity', reference: 'opacity080' }]
    });
    const result = validator.getPrimitiveReferenceValidator().validateModifiers(token);
    expect(result.level).toBe('Pass');
  });

  it('should pass for token with no modifiers', () => {
    const token = makeSemanticToken({ name: 'color.plain' });
    const result = validator.getPrimitiveReferenceValidator().validateModifiers(token);
    expect(result.level).toBe('Pass');
  });

  it('should error for non-existent modifier reference', () => {
    const token = makeSemanticToken({
      name: 'color.bad.ref',
      modifiers: [{ type: 'opacity', reference: 'opacityNOPE' }]
    });
    const result = validator.getPrimitiveReferenceValidator().validateModifiers(token);
    expect(result.level).toBe('Error');
    expect(result.message).toContain('non-existent');
    expect(result.message).toContain('opacityNOPE');
  });

  it('should error for wrong-family modifier reference', () => {
    const token = makeSemanticToken({
      name: 'color.wrong.family',
      modifiers: [{ type: 'opacity', reference: 'space100' }]
    });
    const result = validator.getPrimitiveReferenceValidator().validateModifiers(token);
    expect(result.level).toBe('Error');
    expect(result.message).toContain('wrong-family');
  });
});

describe('Spec 073: SemanticTokenValidator mode-invariance detection', () => {
  let primitiveRegistry: PrimitiveTokenRegistry;
  let semanticRegistry: SemanticTokenRegistry;
  let validator: SemanticTokenValidator;

  beforeEach(() => {
    primitiveRegistry = new PrimitiveTokenRegistry();
    semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
    validator = new SemanticTokenValidator(primitiveRegistry, semanticRegistry);
    primitiveRegistry.register(black500);
    primitiveRegistry.register(opacity080);
    primitiveRegistry.register(modeAwareColor);
  });

  it('should warn when modeInvariant token references mode-aware primitive', () => {
    const token = makeSemanticToken({
      name: 'color.suspicious',
      primitiveReferences: { value: 'surface100' },
      modeInvariant: true
    });
    const result = validator.validateToken(token);
    expect(result.overall.level).toBe('Warning');
    expect(result.overall.rationale).toContain('mode-aware');
  });

  it('should not warn when modeInvariant token references mode-invariant primitive', () => {
    const token = makeSemanticToken({
      name: 'color.scrim.ok',
      primitiveReferences: { value: 'black500' },
      modeInvariant: true
    });
    const result = validator.validateToken(token);
    expect(result.overall.level).not.toBe('Warning');
  });

  it('should not warn when modeInvariant is not set', () => {
    const token = makeSemanticToken({
      name: 'color.normal',
      primitiveReferences: { value: 'surface100' }
    });
    const result = validator.validateToken(token);
    // Should not have mode-invariance warning (only possible if modeInvariant: true)
    expect(result.overall.rationale).not.toContain('mode-aware');
  });
});

describe('Spec 073: Generator modifier resolution', () => {
  it('Web: should resolve modifier-based token to rgba()', () => {
    const generator = new WebFormatGenerator();
    const token = makeSemanticToken({
      name: 'color.scrim.standard',
      primitiveReferences: { value: 'black500' },
      modifiers: [{ type: 'opacity', reference: 'opacity080' }],
      modeInvariant: true
    });
    const result = generator.formatSingleReferenceToken(token);
    expect(result).toContain('rgba(0, 0, 0, 0.8');
    expect(result).toContain('color-scrim-standard');
  });

  it('iOS: should resolve modifier-based token to UIColor', () => {
    const generator = new iOSFormatGenerator();
    const token = makeSemanticToken({
      name: 'color.scrim.standard',
      primitiveReferences: { value: 'black500' },
      modifiers: [{ type: 'opacity', reference: 'opacity080' }],
      modeInvariant: true
    });
    const result = generator.formatSingleReferenceToken(token);
    expect(result).toContain('alpha: 0.80');
    expect(result).toContain('Scrim');
  });

  it('Android: should resolve modifier-based token to Color.argb()', () => {
    const generator = new AndroidFormatGenerator('kotlin');
    const token = makeSemanticToken({
      name: 'color.scrim.standard',
      primitiveReferences: { value: 'black500' },
      modifiers: [{ type: 'opacity', reference: 'opacity080' }],
      modeInvariant: true
    });
    const result = generator.formatSingleReferenceToken(token);
    // Android uses Color.argb with integer alpha: 0.80 × 255 = 204
    expect(result).toContain('Color.argb(204');
    expect(result).toContain('scrim');
  });

  it('should produce identical output to non-modifier path when no modifiers', () => {
    const generator = new WebFormatGenerator();
    const token = makeSemanticToken({
      name: 'colorPrimary',
      primitiveReferences: { value: 'black500' }
    });
    const result = generator.formatSingleReferenceToken(token);
    expect(result).toContain('var(--black-500)');
    expect(result).not.toContain('rgba');
  });
});

describe('Spec 073: color.scrim.standard integration', () => {
  it('should be discoverable via getSemanticToken', () => {
    const token = getSemanticToken('color.scrim.standard');
    expect(token).toBeDefined();
  });

  it('should have correct definition fields', () => {
    const token = getSemanticToken('color.scrim.standard')!;
    expect(token.name).toBe('color.scrim.standard');
    expect(token.category).toBe(SemanticCategory.COLOR);
    expect(token.modeInvariant).toBe(true);
    expect(token.primitiveReferences).toEqual({ value: 'black500' });
    expect(token.modifiers).toEqual([{ type: 'opacity', reference: 'opacity080' }]);
  });

  it('should resolve to rgba(0, 0, 0, 0.8) on web', () => {
    const token = getSemanticToken('color.scrim.standard')!;
    const generator = new WebFormatGenerator();
    const result = generator.formatSingleReferenceToken(token as SemanticToken);
    expect(result).toContain('rgba(0, 0, 0, 0.8');
  });

  it('should resolve correctly on iOS', () => {
    const token = getSemanticToken('color.scrim.standard')!;
    const generator = new iOSFormatGenerator();
    const result = generator.formatSingleReferenceToken(token as SemanticToken);
    expect(result).toContain('alpha: 0.80');
  });

  it('should resolve correctly on Android', () => {
    const token = getSemanticToken('color.scrim.standard')!;
    const generator = new AndroidFormatGenerator('kotlin');
    const result = generator.formatSingleReferenceToken(token as SemanticToken);
    expect(result).toContain('Color.argb(204');
  });

  it('should pass validation with real primitives registered', () => {
    const primitiveRegistry = new PrimitiveTokenRegistry();
    const semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
    const validator = new SemanticTokenValidator(primitiveRegistry, semanticRegistry);

    // Register the real primitives that color.scrim.standard references
    const { colorTokens } = require('../tokens/ColorTokens');
    const { opacityTokens } = require('../tokens/OpacityTokens');
    primitiveRegistry.register(colorTokens.black500);
    primitiveRegistry.register(opacityTokens.opacity080);

    const token = getSemanticToken('color.scrim.standard')! as SemanticToken;
    const result = validator.validateToken(token);
    expect(result.overall.level).not.toBe('Error');
  });
});
