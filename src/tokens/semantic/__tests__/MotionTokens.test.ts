/**
 * Semantic Motion Token Tests
 * 
 * Tests for semantic motion token structure and utility functions.
 * Validates that motion tokens follow compositional pattern and reference valid primitives.
 * 
 * Task: 6.2 Create unit tests for semantic motion tokens
 * Spec: 014-motion-token-system
 * Requirements: 5.1, 5.2, 8.4
 */

import {
  motionTokens,
  getMotionToken,
  getAllMotionTokens
} from '../MotionTokens';
import { durationTokens } from '../../DurationTokens';
import { easingTokens } from '../../EasingTokens';
import { SemanticCategory } from '../../../types/SemanticToken';

describe('Semantic Motion Tokens', () => {
  describe('motionTokens', () => {
    it('should have motion.floatLabel token', () => {
      expect(motionTokens['motion.floatLabel']).toBeDefined();
    });

    it('should have required properties', () => {
      const token = motionTokens['motion.floatLabel'];
      
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('primitiveReferences');
      expect(token).toHaveProperty('category');
      expect(token).toHaveProperty('context');
      expect(token).toHaveProperty('description');
    });

    it('should have correct name', () => {
      const token = motionTokens['motion.floatLabel'];
      expect(token.name).toBe('motion.floatLabel');
    });

    it('should have INTERACTION category', () => {
      const token = motionTokens['motion.floatLabel'];
      expect(token.category).toBe(SemanticCategory.INTERACTION);
    });

    it('should have meaningful context', () => {
      const token = motionTokens['motion.floatLabel'];
      expect(token.context).toBeTruthy();
      expect(token.context.length).toBeGreaterThan(0);
      expect(token.context).toContain('Float label');
    });

    it('should have meaningful description', () => {
      const token = motionTokens['motion.floatLabel'];
      expect(token.description).toBeTruthy();
      expect(token.description.length).toBeGreaterThan(0);
    });
  });

  describe('primitiveReferences', () => {
    it('should reference duration250 primitive token', () => {
      const token = motionTokens['motion.floatLabel'];
      expect(token.primitiveReferences.duration).toBe('duration250');
    });

    it('should reference easingStandard primitive token', () => {
      const token = motionTokens['motion.floatLabel'];
      expect(token.primitiveReferences.easing).toBe('easingStandard');
    });

    it('should point to existing primitive tokens', () => {
      const token = motionTokens['motion.floatLabel'];
      
      // Verify duration token exists
      const durationName = token.primitiveReferences.duration;
      expect(durationTokens).toHaveProperty(durationName);
      
      // Verify easing token exists
      const easingName = token.primitiveReferences.easing;
      expect(easingTokens).toHaveProperty(easingName);
    });

    it('should have valid primitive token references', () => {
      const token = motionTokens['motion.floatLabel'];
      
      // Verify duration token is valid
      const durationToken = durationTokens[token.primitiveReferences.duration];
      expect(durationToken).toHaveProperty('name');
      expect(durationToken).toHaveProperty('baseValue');
      
      // Verify easing token is valid
      const easingToken = easingTokens[token.primitiveReferences.easing];
      expect(easingToken).toHaveProperty('name');
      expect(easingToken).toHaveProperty('platforms');
    });

    it('should have duration and easing references', () => {
      const token = motionTokens['motion.floatLabel'];
      const refKeys = Object.keys(token.primitiveReferences);
      
      expect(refKeys).toContain('duration');
      expect(refKeys).toContain('easing');
    });

    it('should not have scale reference for floatLabel', () => {
      const token = motionTokens['motion.floatLabel'];
      expect(token.primitiveReferences.scale).toBeUndefined();
    });
  });

  describe('getMotionToken()', () => {
    it('should return motion.floatLabel token', () => {
      const token = getMotionToken('motion.floatLabel');
      expect(token).toBeDefined();
      expect(token?.name).toBe('motion.floatLabel');
    });

    it('should return undefined for non-existent token', () => {
      const token = getMotionToken('motion.nonexistent');
      expect(token).toBeUndefined();
    });

    it('should return token with all required properties', () => {
      const token = getMotionToken('motion.floatLabel');
      
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('primitiveReferences');
      expect(token).toHaveProperty('category');
      expect(token).toHaveProperty('context');
      expect(token).toHaveProperty('description');
    });

    it('should return token with valid primitive references', () => {
      const token = getMotionToken('motion.floatLabel');
      
      expect(token?.primitiveReferences.duration).toBe('duration250');
      expect(token?.primitiveReferences.easing).toBe('easingStandard');
    });
  });

  describe('getAllMotionTokens()', () => {
    it('should return array of motion tokens', () => {
      const tokens = getAllMotionTokens();
      expect(Array.isArray(tokens)).toBe(true);
    });

    it('should return at least one token', () => {
      const tokens = getAllMotionTokens();
      expect(tokens.length).toBeGreaterThan(0);
    });

    it('should include motion.floatLabel token', () => {
      const tokens = getAllMotionTokens();
      const floatLabelToken = tokens.find(t => t.name === 'motion.floatLabel');
      expect(floatLabelToken).toBeDefined();
    });

    it('should return tokens with correct structure', () => {
      const tokens = getAllMotionTokens();
      
      tokens.forEach(token => {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('primitiveReferences');
        expect(token).toHaveProperty('category');
        expect(token).toHaveProperty('context');
        expect(token).toHaveProperty('description');
      });
    });

    it('should return tokens with INTERACTION category', () => {
      const tokens = getAllMotionTokens();
      
      tokens.forEach(token => {
        expect(token.category).toBe(SemanticCategory.INTERACTION);
      });
    });
  });

  describe('Compositional Pattern', () => {
    it('should follow compositional pattern with primitiveReferences', () => {
      const token = motionTokens['motion.floatLabel'];
      
      // Compositional pattern: semantic tokens reference primitives
      expect(token.primitiveReferences).toBeDefined();
      expect(typeof token.primitiveReferences).toBe('object');
      expect(Object.keys(token.primitiveReferences).length).toBeGreaterThan(0);
    });

    it('should not contain hard-coded values', () => {
      const token = motionTokens['motion.floatLabel'];
      
      // Should reference token names, not contain numeric values
      expect(typeof token.primitiveReferences.duration).toBe('string');
      expect(typeof token.primitiveReferences.easing).toBe('string');
      
      // Token names should not be numeric
      expect(isNaN(Number(token.primitiveReferences.duration))).toBe(true);
      expect(isNaN(Number(token.primitiveReferences.easing))).toBe(true);
    });

    it('should follow same pattern as Shadow and Typography tokens', () => {
      const token = motionTokens['motion.floatLabel'];
      
      // Same pattern: primitiveReferences property with token name strings
      expect(token).toHaveProperty('primitiveReferences');
      expect(token.primitiveReferences).toHaveProperty('duration');
      expect(token.primitiveReferences).toHaveProperty('easing');
      
      // References should be strings (token names)
      expect(typeof token.primitiveReferences.duration).toBe('string');
      expect(typeof token.primitiveReferences.easing).toBe('string');
    });

    it('should enable mathematical consistency through primitive references', () => {
      const token = motionTokens['motion.floatLabel'];
      
      // Verify primitive tokens have mathematical relationships
      const durationToken = durationTokens[token.primitiveReferences.duration];
      expect(durationToken).toHaveProperty('baseValue');
      expect(durationToken).toHaveProperty('mathematicalRelationship');
      
      const easingToken = easingTokens[token.primitiveReferences.easing];
      expect(easingToken).toHaveProperty('mathematicalRelationship');
    });

    it('should support cross-platform generation through primitives', () => {
      const token = motionTokens['motion.floatLabel'];
      
      // Verify primitive tokens have platform-specific values
      const durationToken = durationTokens[token.primitiveReferences.duration];
      expect(durationToken).toHaveProperty('platforms');
      expect(durationToken.platforms).toHaveProperty('web');
      expect(durationToken.platforms).toHaveProperty('ios');
      expect(durationToken.platforms).toHaveProperty('android');
      
      const easingToken = easingTokens[token.primitiveReferences.easing];
      expect(easingToken).toHaveProperty('platforms');
      expect(easingToken.platforms).toHaveProperty('web');
      expect(easingToken.platforms).toHaveProperty('ios');
      expect(easingToken.platforms).toHaveProperty('android');
    });
  });

  describe('Token Structure Consistency', () => {
    it('should have consistent structure across all tokens', () => {
      const tokens = getAllMotionTokens();
      const firstToken = tokens[0];
      const firstTokenKeys = Object.keys(firstToken).sort();
      
      tokens.forEach(token => {
        const tokenKeys = Object.keys(token).sort();
        expect(tokenKeys).toEqual(firstTokenKeys);
      });
    });

    it('should maintain name consistency with object key', () => {
      Object.entries(motionTokens).forEach(([key, token]) => {
        expect(token.name).toBe(key);
      });
    });

    it('should have non-empty required fields', () => {
      const tokens = getAllMotionTokens();
      
      tokens.forEach(token => {
        expect(token.name).toBeTruthy();
        expect(token.name.length).toBeGreaterThan(0);
        
        expect(Object.keys(token.primitiveReferences).length).toBeGreaterThan(0);
        
        expect(token.category).toBeTruthy();
        expect(token.category.length).toBeGreaterThan(0);
        
        expect(token.context).toBeTruthy();
        expect(token.context.length).toBeGreaterThan(0);
        
        expect(token.description).toBeTruthy();
        expect(token.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Incremental Expansion Support', () => {
    it('should support optional scale property for future tokens', () => {
      const token = motionTokens['motion.floatLabel'];
      
      // Structure supports scale property even if not used
      // This validates the interface allows for future expansion
      expect(token.primitiveReferences).toBeDefined();
      
      // Scale is optional, so it's okay if it's undefined
      if (token.primitiveReferences.scale) {
        expect(typeof token.primitiveReferences.scale).toBe('string');
      }
    });

    it('should allow adding new motion tokens without breaking existing ones', () => {
      // Verify current token structure
      const currentToken = motionTokens['motion.floatLabel'];
      expect(currentToken).toBeDefined();
      
      // Structure should support adding new tokens
      // (This test validates the pattern, not actual new tokens)
      const tokenKeys = Object.keys(motionTokens);
      expect(tokenKeys.length).toBeGreaterThanOrEqual(1);
    });
  });
});
