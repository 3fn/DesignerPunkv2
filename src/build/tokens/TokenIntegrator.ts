/**
 * Token Integration Layer
 * 
 * Integrates F1 tokens into platform-specific builds with proper unit conversion.
 * Follows token selection priority: semantic → primitive → component
 */

import { PrimitiveToken } from '../../types/PrimitiveToken';
import { SemanticToken } from '../../types/SemanticToken';
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../registries/SemanticTokenRegistry';
import { TokenSelection, TokenSelectionOptions } from './TokenSelection';
import { PlatformTokens } from './PlatformTokens';
import { ComponentToken, ComponentTokenSpec as IComponentTokenSpec } from './ComponentToken';
import { TokenSelector } from './TokenSelector';
import { ComponentTokenGenerator } from './ComponentTokenGenerator';
import { UnitConverter } from './UnitConverter';
import { Platform, PlatformValue } from './types';

/**
 * Token request specification
 */
export interface TokenRequest {
  /** Property name requesting the token */
  property: string;
  /** Desired token category (spacing, color, typography, etc.) */
  category: string;
  /** Optional specific token name */
  tokenName?: string;
  /** Context for token selection */
  context?: Record<string, unknown>;
}

// PlatformValue is now imported from './types'

/**
 * Component token specification for generation
 */
export interface ComponentTokenSpec {
  /** Component token name */
  name: string;
  /** Token category */
  category: string;
  /** Base unitless value */
  baseValue: number;
  /** Component name */
  component: string;
  /** Reasoning for why existing tokens are insufficient */
  reasoning: string;
  /** Optional primitive token references */
  references?: string[];
  /** Created by */
  createdBy: string;
}

/**
 * Main token integrator interface
 * 
 * Responsible for:
 * - Consuming primitive and semantic tokens from F1
 * - Following token selection priority (semantic → primitive → component)
 * - Converting tokens to platform-specific units
 * - Generating component tokens when necessary
 * - Validating mathematical consistency
 */
export interface TokenIntegrator {
  /**
   * Get all tokens for a specific platform with proper unit conversion
   * 
   * @param platform - Target platform (ios, android, web)
   * @returns Platform-specific token values
   */
  getTokensForPlatform(platform: Platform): PlatformTokens;

  /**
   * Convert a token to platform-specific value
   * 
   * @param token - Token to convert (primitive or semantic)
   * @param platform - Target platform
   * @returns Platform-specific value with unit
   */
  convertToken(token: PrimitiveToken | SemanticToken, platform: Platform): PlatformValue;

  /**
   * Select appropriate token following priority: semantic → primitive → component
   * 
   * @param request - Token request specification
   * @param options - Selection options
   * @returns Token selection with reasoning
   */
  selectToken(request: TokenRequest, options?: TokenSelectionOptions): TokenSelection;

  /**
   * Validate token selection follows priority rules
   * 
   * @param selection - Token selection to validate
   * @returns Validation result with errors/warnings
   */
  validateTokenSelection(selection: TokenSelection): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };

  /**
   * Generate component token when semantic and primitive tokens insufficient
   * 
   * @param spec - Component token specification
   * @returns Generated component token
   */
  generateComponentToken(spec: ComponentTokenSpec): ComponentToken;

  /**
   * Validate mathematical consistency across platforms
   * 
   * @param token - Token to validate
   * @returns Validation result
   */
  validateMathematicalConsistency(token: PrimitiveToken | SemanticToken | ComponentToken): {
    consistent: boolean;
    platforms: Record<Platform, PlatformValue>;
    issues: string[];
  };
}

/**
 * Token integrator implementation
 * 
 * Implements the token integration layer with F1 token system integration
 */
export class TokenIntegratorImpl implements TokenIntegrator {
  private tokenSelector: TokenSelector;
  private componentGenerator: ComponentTokenGenerator;
  private unitConverter: UnitConverter;

  constructor(
    private primitiveRegistry: PrimitiveTokenRegistry,
    private semanticRegistry: SemanticTokenRegistry
  ) {
    this.tokenSelector = new TokenSelector(primitiveRegistry, semanticRegistry);
    this.componentGenerator = new ComponentTokenGenerator(primitiveRegistry);
    this.unitConverter = new UnitConverter();
  }

  /**
   * Get all tokens for a specific platform with proper unit conversion
   */
  getTokensForPlatform(platform: Platform): PlatformTokens {
    const primitives: PlatformTokens['primitives'] = {
      spacing: {},
      colors: {},
      typography: {},
      radius: {},
      sizing: {},
      opacity: {},
      elevation: {},
      animation: {}
    };

    const semantics: PlatformTokens['semantics'] = {
      spacing: {},
      colors: {},
      typography: {},
      radius: {},
      sizing: {},
      opacity: {},
      elevation: {},
      animation: {}
    };

    // Get all primitive tokens and organize by category
    const allPrimitives = this.primitiveRegistry.query();
    for (const token of allPrimitives) {
      const platformValue = this.convertToken(token, platform);
      
      // Organize by category
      switch (token.category) {
        case 'spacing':
          primitives.spacing[token.name] = platformValue;
          break;
        case 'color':
          primitives.colors[token.name] = platformValue;
          break;
        case 'fontSize':
        case 'lineHeight':
        case 'fontWeight':
        case 'letterSpacing':
        case 'fontFamily':
          primitives.typography[token.name] = platformValue;
          break;
        case 'radius':
          primitives.radius[token.name] = platformValue;
          break;
        case 'density':
        case 'tapArea':
          primitives.sizing[token.name] = platformValue;
          break;
      }
    }

    // Get all semantic tokens and organize by category
    const allSemantics = this.semanticRegistry.query();
    for (const token of allSemantics) {
      const platformValue = this.convertToken(token, platform);
      
      // Organize by category
      switch (token.category) {
        case 'spacing':
          semantics.spacing[token.name] = platformValue;
          break;
        case 'color':
          semantics.colors[token.name] = platformValue;
          break;
        case 'typography':
          semantics.typography[token.name] = platformValue;
          break;
        case 'border':
          semantics.radius[token.name] = platformValue;
          break;
      }
    }
    
    return {
      platform,
      primitives,
      semantics,
      components: {
        spacing: {},
        colors: {},
        typography: {},
        radius: {},
        sizing: {},
        opacity: {},
        elevation: {},
        animation: {}
      },
      metadata: {
        platform,
        defaultSpacingUnit: platform === 'ios' ? 'pt' : platform === 'android' ? 'dp' : 'px',
        defaultTypographyUnit: platform === 'ios' ? 'pt' : platform === 'android' ? 'sp' : 'rem',
        supportedUnits: platform === 'ios' ? ['pt'] : platform === 'android' ? ['dp', 'sp'] : ['px', 'rem'],
        constraints: {
          decimalPrecision: 2,
          supportsSubpixel: platform === 'web',
          roundingMode: 'round'
        },
        generatedAt: new Date()
      }
    };
  }

  /**
   * Convert a token to platform-specific value
   */
  convertToken(token: PrimitiveToken | SemanticToken, platform: Platform): PlatformValue {
    // For primitive tokens, use platform values directly
    if ('baseValue' in token && 'platforms' in token) {
      const primitiveToken = token as PrimitiveToken;
      const platformValue = primitiveToken.platforms[platform];
      return {
        value: platformValue.value,
        unit: platformValue.unit,
        token: primitiveToken.name
      };
    }

    // For semantic tokens, resolve to primitive and convert
    const semanticToken = token as SemanticToken;
    const primitiveRef = Object.values(semanticToken.primitiveReferences)[0];
    const primitiveToken = this.primitiveRegistry.get(primitiveRef);
    
    if (!primitiveToken) {
      throw new Error(`Primitive token '${primitiveRef}' not found for semantic token '${semanticToken.name}'`);
    }

    const platformValue = primitiveToken.platforms[platform];
    return {
      value: platformValue.value,
      unit: platformValue.unit,
      token: semanticToken.name
    };
  }

  /**
   * Select appropriate token following priority: semantic → primitive → component
   */
  selectToken(request: TokenRequest, options: TokenSelectionOptions = {}): TokenSelection {
    return this.tokenSelector.selectToken(request, options);
  }

  /**
   * Validate token selection follows priority rules
   */
  validateTokenSelection(selection: TokenSelection): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate priority was followed correctly
    if (selection.priority === 'primitive' && !selection.semanticInsufficiencyReason) {
      warnings.push('Primitive token selected without documenting why semantic token was insufficient');
    }

    if (selection.priority === 'component') {
      if (!selection.semanticInsufficiencyReason) {
        errors.push('Component token selected without documenting why semantic token was insufficient');
      }
      if (!selection.primitiveInsufficiencyReason) {
        errors.push('Component token selected without documenting why primitive token was insufficient');
      }
    }

    // Validate reasoning is provided
    if (!selection.reasoning || selection.reasoning.trim().length === 0) {
      errors.push('Token selection must include reasoning');
    }

    // Validate mathematical validity
    if (!selection.mathematicallyValid && selection.priority !== 'component') {
      warnings.push('Selected token is not mathematically valid');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Generate component token when semantic and primitive tokens insufficient
   */
  generateComponentToken(spec: ComponentTokenSpec): ComponentToken {
    const componentSpec: IComponentTokenSpec = {
      name: spec.name,
      category: spec.category as any,
      baseValue: spec.baseValue,
      component: spec.component,
      reasoning: spec.reasoning,
      references: spec.references?.map(ref => ({
        tokenName: ref,
        relationship: 'base' as const
      })),
      createdBy: spec.createdBy
    };

    return this.componentGenerator.generate(componentSpec);
  }

  /**
   * Validate mathematical consistency across platforms
   */
  validateMathematicalConsistency(token: PrimitiveToken | SemanticToken | ComponentToken): {
    consistent: boolean;
    platforms: Record<Platform, PlatformValue>;
    issues: string[];
  } {
    const issues: string[] = [];
    const platforms: Record<Platform, PlatformValue> = {
      ios: { value: 0, unit: 'pt', token: '' },
      android: { value: 0, unit: 'dp', token: '' },
      web: { value: 0, unit: 'px', token: '' }
    };

    // Check if it's a component token
    if ('component' in token) {
      const componentToken = token as ComponentToken;
      platforms.ios = componentToken.platforms.ios;
      platforms.android = componentToken.platforms.android;
      platforms.web = componentToken.platforms.web;

      // Validate all platforms have same base value
      if (platforms.ios.value !== componentToken.baseValue) {
        issues.push(`iOS value (${platforms.ios.value}) does not match base value (${componentToken.baseValue})`);
      }
      if (platforms.android.value !== componentToken.baseValue) {
        issues.push(`Android value (${platforms.android.value}) does not match base value (${componentToken.baseValue})`);
      }
      if (platforms.web.value !== componentToken.baseValue) {
        issues.push(`Web value (${platforms.web.value}) does not match base value (${componentToken.baseValue})`);
      }
    } else {
      // Convert token to each platform
      platforms.ios = this.convertToken(token, 'ios');
      platforms.android = this.convertToken(token, 'android');
      platforms.web = this.convertToken(token, 'web');

      // For primitive/semantic tokens, values should be consistent
      // (allowing for different units but same numeric value)
      const iosValue = typeof platforms.ios.value === 'number' ? platforms.ios.value : 0;
      const androidValue = typeof platforms.android.value === 'number' ? platforms.android.value : 0;
      const webValue = typeof platforms.web.value === 'number' ? platforms.web.value : 0;

      if (iosValue !== androidValue || androidValue !== webValue) {
        issues.push(
          `Platform values are inconsistent: iOS=${iosValue}, Android=${androidValue}, Web=${webValue}`
        );
      }
    }

    return {
      consistent: issues.length === 0,
      platforms,
      issues
    };
  }
}
