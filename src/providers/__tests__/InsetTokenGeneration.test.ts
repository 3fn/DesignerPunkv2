/**
 * Inset Token Generation Tests
 * 
 * Tests for platform generator output of renamed inset spacing tokens.
 * Verifies that generators output new numeric token names (050, 100, 150, etc.)
 * and do not output old synonym names (tight, normal, comfortable, etc.).
 * 
 * Requirements: 8.3, 8.4
 */

import { WebFormatGenerator } from '../WebFormatGenerator';
import { iOSFormatGenerator } from '../iOSFormatGenerator';
import { AndroidFormatGenerator } from '../AndroidFormatGenerator';
import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

describe('Inset Token Generation - Web CSS', () => {
  let generator: WebFormatGenerator;

  beforeEach(() => {
    generator = new WebFormatGenerator();
  });

  describe('New numeric token names', () => {
    test('should generate --space-inset-050 for inset 050 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset050',
        primitiveReferences: {
          value: 'space050'
        },
        category: SemanticCategory.SPACING,
        context: 'Minimal internal spacing',
        description: 'Minimal internal spacing (4px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toContain('--space-inset-050');
      expect(result).toContain('var(--space-050)');
    });

    test('should generate --space-inset-100 for inset 100 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset100',
        primitiveReferences: {
          value: 'space100'
        },
        category: SemanticCategory.SPACING,
        context: 'Compact internal spacing',
        description: 'Compact internal spacing (8px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toContain('--space-inset-100');
      expect(result).toContain('var(--space-100)');
    });

    test('should generate --space-inset-150 for inset 150 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset150',
        primitiveReferences: {
          value: 'space150'
        },
        category: SemanticCategory.SPACING,
        context: 'Standard internal spacing',
        description: 'Standard internal spacing (12px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toContain('--space-inset-150');
      expect(result).toContain('var(--space-150)');
    });

    test('should generate --space-inset-200 for inset 200 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset200',
        primitiveReferences: {
          value: 'space200'
        },
        category: SemanticCategory.SPACING,
        context: 'Comfortable internal spacing',
        description: 'Comfortable internal spacing (16px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toContain('--space-inset-200');
      expect(result).toContain('var(--space-200)');
    });

    test('should generate --space-inset-300 for inset 300 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset300',
        primitiveReferences: {
          value: 'space300'
        },
        category: SemanticCategory.SPACING,
        context: 'Spacious internal spacing',
        description: 'Spacious internal spacing (24px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toContain('--space-inset-300');
      expect(result).toContain('var(--space-300)');
    });

    test('should generate --space-inset-400 for inset 400 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset400',
        primitiveReferences: {
          value: 'space400'
        },
        category: SemanticCategory.SPACING,
        context: 'Maximum internal spacing',
        description: 'Maximum internal spacing (32px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toContain('--space-inset-400');
      expect(result).toContain('var(--space-400)');
    });
  });

  describe('Old synonym names should not appear', () => {
    test('should not generate --space-inset-tight', () => {
      const token: SemanticToken = {
        name: 'spaceInset050',
        primitiveReferences: {
          value: 'space050'
        },
        category: SemanticCategory.SPACING,
        context: 'Minimal internal spacing',
        description: 'Minimal internal spacing (4px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).not.toContain('--space-inset-tight');
      expect(result).not.toContain('tight');
    });

    test('should not generate --space-inset-normal', () => {
      const token: SemanticToken = {
        name: 'spaceInset100',
        primitiveReferences: {
          value: 'space100'
        },
        category: SemanticCategory.SPACING,
        context: 'Compact internal spacing',
        description: 'Compact internal spacing (8px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).not.toContain('--space-inset-normal');
      expect(result).not.toContain('normal');
    });

    test('should not generate --space-inset-comfortable', () => {
      const token: SemanticToken = {
        name: 'spaceInset150',
        primitiveReferences: {
          value: 'space150'
        },
        category: SemanticCategory.SPACING,
        context: 'Standard internal spacing',
        description: 'Standard internal spacing (12px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).not.toContain('--space-inset-comfortable');
      expect(result).not.toContain('comfortable');
    });

    test('should not generate old synonym names for any inset tokens', () => {
      const oldNames = ['tight', 'normal', 'comfortable', 'spacious', 'expansive', 'generous'];
      const tokens: SemanticToken[] = [
        {
          name: 'spaceInset050',
          primitiveReferences: { value: 'space050' },
          category: SemanticCategory.SPACING,
          context: 'Test',
          description: 'Test'
        },
        {
          name: 'spaceInset100',
          primitiveReferences: { value: 'space100' },
          category: SemanticCategory.SPACING,
          context: 'Test',
          description: 'Test'
        },
        {
          name: 'spaceInset150',
          primitiveReferences: { value: 'space150' },
          category: SemanticCategory.SPACING,
          context: 'Test',
          description: 'Test'
        }
      ];

      tokens.forEach(token => {
        const result = generator.formatSingleReferenceToken(token);
        oldNames.forEach(oldName => {
          expect(result).not.toContain(oldName);
        });
      });
    });
  });
});

describe('Inset Token Generation - iOS Swift', () => {
  let generator: iOSFormatGenerator;

  beforeEach(() => {
    generator = new iOSFormatGenerator();
  });

  describe('New numeric token names', () => {
    test('should generate spaceInset050 for inset 050 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset050',
        primitiveReferences: {
          value: 'space050'
        },
        category: SemanticCategory.SPACING,
        context: 'Minimal internal spacing',
        description: 'Minimal internal spacing (4px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toContain('spaceInset050');
      expect(result).toContain('space050');
      expect(result).toMatch(/public static let spaceInset050 = space050/);
    });

    test('should generate spaceInset100 for inset 100 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset100',
        primitiveReferences: {
          value: 'space100'
        },
        category: SemanticCategory.SPACING,
        context: 'Compact internal spacing',
        description: 'Compact internal spacing (8px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toContain('spaceInset100');
      expect(result).toContain('space100');
      expect(result).toMatch(/public static let spaceInset100 = space100/);
    });

    test('should generate spaceInset150 for inset 150 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset150',
        primitiveReferences: {
          value: 'space150'
        },
        category: SemanticCategory.SPACING,
        context: 'Standard internal spacing',
        description: 'Standard internal spacing (12px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toContain('spaceInset150');
      expect(result).toContain('space150');
      expect(result).toMatch(/public static let spaceInset150 = space150/);
    });

    test('should generate spaceInset200 for inset 200 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset200',
        primitiveReferences: {
          value: 'space200'
        },
        category: SemanticCategory.SPACING,
        context: 'Comfortable internal spacing',
        description: 'Comfortable internal spacing (16px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toContain('spaceInset200');
      expect(result).toContain('space200');
      expect(result).toMatch(/public static let spaceInset200 = space200/);
    });

    test('should generate spaceInset300 for inset 300 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset300',
        primitiveReferences: {
          value: 'space300'
        },
        category: SemanticCategory.SPACING,
        context: 'Spacious internal spacing',
        description: 'Spacious internal spacing (24px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toContain('spaceInset300');
      expect(result).toContain('space300');
      expect(result).toMatch(/public static let spaceInset300 = space300/);
    });

    test('should generate spaceInset400 for inset 400 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset400',
        primitiveReferences: {
          value: 'space400'
        },
        category: SemanticCategory.SPACING,
        context: 'Maximum internal spacing',
        description: 'Maximum internal spacing (32px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toContain('spaceInset400');
      expect(result).toContain('space400');
      expect(result).toMatch(/public static let spaceInset400 = space400/);
    });
  });

  describe('Old synonym names should not appear', () => {
    test('should not generate spaceInsetTight', () => {
      const token: SemanticToken = {
        name: 'spaceInset050',
        primitiveReferences: {
          value: 'space050'
        },
        category: SemanticCategory.SPACING,
        context: 'Minimal internal spacing',
        description: 'Minimal internal spacing (4px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).not.toContain('spaceInsetTight');
      expect(result).not.toContain('Tight');
    });

    test('should not generate spaceInsetNormal', () => {
      const token: SemanticToken = {
        name: 'spaceInset100',
        primitiveReferences: {
          value: 'space100'
        },
        category: SemanticCategory.SPACING,
        context: 'Compact internal spacing',
        description: 'Compact internal spacing (8px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).not.toContain('spaceInsetNormal');
      expect(result).not.toContain('Normal');
    });

    test('should not generate spaceInsetComfortable', () => {
      const token: SemanticToken = {
        name: 'spaceInset150',
        primitiveReferences: {
          value: 'space150'
        },
        category: SemanticCategory.SPACING,
        context: 'Standard internal spacing',
        description: 'Standard internal spacing (12px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).not.toContain('spaceInsetComfortable');
      expect(result).not.toContain('Comfortable');
    });

    test('should not generate old synonym names for any inset tokens', () => {
      const oldNames = ['Tight', 'Normal', 'Comfortable', 'Spacious', 'Expansive', 'Generous'];
      const tokens: SemanticToken[] = [
        {
          name: 'spaceInset050',
          primitiveReferences: { value: 'space050' },
          category: SemanticCategory.SPACING,
          context: 'Test',
          description: 'Test'
        },
        {
          name: 'spaceInset100',
          primitiveReferences: { value: 'space100' },
          category: SemanticCategory.SPACING,
          context: 'Test',
          description: 'Test'
        },
        {
          name: 'spaceInset150',
          primitiveReferences: { value: 'space150' },
          category: SemanticCategory.SPACING,
          context: 'Test',
          description: 'Test'
        }
      ];

      tokens.forEach(token => {
        const result = generator.formatSingleReferenceToken(token);
        oldNames.forEach(oldName => {
          expect(result).not.toContain(oldName);
        });
      });
    });
  });
});

describe('Inset Token Generation - Android Kotlin', () => {
  let generator: AndroidFormatGenerator;

  beforeEach(() => {
    generator = new AndroidFormatGenerator('kotlin');
  });

  describe('New numeric token names', () => {
    test('should generate space_inset_050 for inset 050 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset050',
        primitiveReferences: {
          value: 'space050'
        },
        category: SemanticCategory.SPACING,
        context: 'Minimal internal spacing',
        description: 'Minimal internal spacing (4px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toMatch(/space_inset_050/);
      expect(result).toMatch(/space_050/);
      expect(result).toMatch(/val space_inset_050 = space_050/);
    });

    test('should generate space_inset_100 for inset 100 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset100',
        primitiveReferences: {
          value: 'space100'
        },
        category: SemanticCategory.SPACING,
        context: 'Compact internal spacing',
        description: 'Compact internal spacing (8px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toMatch(/space_inset_100/);
      expect(result).toMatch(/space_100/);
      expect(result).toMatch(/val space_inset_100 = space_100/);
    });

    test('should generate space_inset_150 for inset 150 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset150',
        primitiveReferences: {
          value: 'space150'
        },
        category: SemanticCategory.SPACING,
        context: 'Standard internal spacing',
        description: 'Standard internal spacing (12px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toMatch(/space_inset_150/);
      expect(result).toMatch(/space_150/);
      expect(result).toMatch(/val space_inset_150 = space_150/);
    });

    test('should generate space_inset_200 for inset 200 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset200',
        primitiveReferences: {
          value: 'space200'
        },
        category: SemanticCategory.SPACING,
        context: 'Comfortable internal spacing',
        description: 'Comfortable internal spacing (16px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toMatch(/space_inset_200/);
      expect(result).toMatch(/space_200/);
      expect(result).toMatch(/val space_inset_200 = space_200/);
    });

    test('should generate space_inset_300 for inset 300 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset300',
        primitiveReferences: {
          value: 'space300'
        },
        category: SemanticCategory.SPACING,
        context: 'Spacious internal spacing',
        description: 'Spacious internal spacing (24px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toMatch(/space_inset_300/);
      expect(result).toMatch(/space_300/);
      expect(result).toMatch(/val space_inset_300 = space_300/);
    });

    test('should generate space_inset_400 for inset 400 token', () => {
      const token: SemanticToken = {
        name: 'spaceInset400',
        primitiveReferences: {
          value: 'space400'
        },
        category: SemanticCategory.SPACING,
        context: 'Maximum internal spacing',
        description: 'Maximum internal spacing (32px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).toMatch(/space_inset_400/);
      expect(result).toMatch(/space_400/);
      expect(result).toMatch(/val space_inset_400 = space_400/);
    });
  });

  describe('Old synonym names should not appear', () => {
    test('should not generate space_inset_tight', () => {
      const token: SemanticToken = {
        name: 'spaceInset050',
        primitiveReferences: {
          value: 'space050'
        },
        category: SemanticCategory.SPACING,
        context: 'Minimal internal spacing',
        description: 'Minimal internal spacing (4px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).not.toContain('space_inset_tight');
      expect(result).not.toContain('tight');
    });

    test('should not generate space_inset_normal', () => {
      const token: SemanticToken = {
        name: 'spaceInset100',
        primitiveReferences: {
          value: 'space100'
        },
        category: SemanticCategory.SPACING,
        context: 'Compact internal spacing',
        description: 'Compact internal spacing (8px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).not.toContain('space_inset_normal');
      expect(result).not.toContain('normal');
    });

    test('should not generate space_inset_comfortable', () => {
      const token: SemanticToken = {
        name: 'spaceInset150',
        primitiveReferences: {
          value: 'space150'
        },
        category: SemanticCategory.SPACING,
        context: 'Standard internal spacing',
        description: 'Standard internal spacing (12px)'
      };

      const result = generator.formatSingleReferenceToken(token);

      expect(result).not.toContain('space_inset_comfortable');
      expect(result).not.toContain('comfortable');
    });

    test('should not generate old synonym names for any inset tokens', () => {
      const oldNames = ['tight', 'normal', 'comfortable', 'spacious', 'expansive', 'generous'];
      const tokens: SemanticToken[] = [
        {
          name: 'spaceInset050',
          primitiveReferences: { value: 'space050' },
          category: SemanticCategory.SPACING,
          context: 'Test',
          description: 'Test'
        },
        {
          name: 'spaceInset100',
          primitiveReferences: { value: 'space100' },
          category: SemanticCategory.SPACING,
          context: 'Test',
          description: 'Test'
        },
        {
          name: 'spaceInset150',
          primitiveReferences: { value: 'space150' },
          category: SemanticCategory.SPACING,
          context: 'Test',
          description: 'Test'
        }
      ];

      tokens.forEach(token => {
        const result = generator.formatSingleReferenceToken(token);
        oldNames.forEach(oldName => {
          expect(result).not.toContain(oldName);
        });
      });
    });
  });
});
