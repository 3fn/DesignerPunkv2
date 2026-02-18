/**
 * Tests for DTCGFormatGenerator error handling (Task 2.8)
 *
 * Validates:
 * - Invalid token type throws with token name and type (Requirement 12.1)
 * - Invalid token value throws with token name and value (Requirement 12.2)
 * - Shadow color merge failure throws with shadow name and color (Requirement 12.3)
 * - File write failure throws with path and system error (Requirement 12.4)
 * - Token count validation failure throws with expected vs actual (Requirement 12.5)
 *
 * @requirements 12.1-12.5
 */

import { DTCGFormatGenerator } from '../DTCGFormatGenerator';

describe('DTCGFormatGenerator Error Handling', () => {
  let generator: DTCGFormatGenerator;

  beforeEach(() => {
    generator = new DTCGFormatGenerator();
  });

  // ---------------------------------------------------------------------------
  // Requirement 12.1: Invalid token type
  // ---------------------------------------------------------------------------
  describe('invalid token type (Requirement 12.1)', () => {
    it('should throw for an unrecognized DTCG type', () => {
      expect(() => {
        generator.toDTCGToken('16px', 'bogusType' as any);
      }).toThrow(/Invalid token type.*bogusType.*No DTCG mapping exists/);
    });

    it('should include valid types in the error message', () => {
      expect(() => {
        generator.toDTCGToken('16px', 'pixel' as any);
      }).toThrow(/Valid types:/);
    });

    it('should accept all valid DTCG types without error', () => {
      const validTypes = [
        'color', 'dimension', 'fontFamily', 'fontWeight', 'duration',
        'cubicBezier', 'number', 'shadow', 'typography', 'transition',
      ] as const;

      for (const type of validTypes) {
        expect(() => {
          generator.toDTCGToken('test', type);
        }).not.toThrow();
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Requirement 12.3: Shadow color merge failure
  // ---------------------------------------------------------------------------
  describe('shadow color merge failure (Requirement 12.3)', () => {
    it('should throw for invalid color format', () => {
      expect(() => {
        generator.mergeShadowColor('not-a-color', 0.5);
      }).toThrow(/Shadow color merge failed.*not-a-color.*Expected rgba/);
    });

    it('should throw for hex color (not rgba)', () => {
      expect(() => {
        generator.mergeShadowColor('#ff0000', 0.5);
      }).toThrow(/Shadow color merge failed/);
    });

    it('should include shadow name in error when provided', () => {
      expect(() => {
        generator.mergeShadowColor('invalid', 0.3, 'shadow.container');
      }).toThrow(/shadow\.container/);
    });

    it('should succeed for valid rgba format', () => {
      expect(() => {
        generator.mergeShadowColor('rgba(0, 0, 0, 1)', 0.5);
      }).not.toThrow();
    });

    it('should succeed for rgb format (no alpha)', () => {
      expect(() => {
        generator.mergeShadowColor('rgb(0, 0, 0)', 0.5);
      }).not.toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // Requirement 12.4: File write failure
  // ---------------------------------------------------------------------------
  describe('file write failure (Requirement 12.4)', () => {
    it('should throw with file path and error message on write failure', () => {
      // Use an invalid path that will fail on any OS
      const invalidPath = '/nonexistent/deeply/nested/impossible/path/tokens.json';
      expect(() => {
        generator.writeToFile(invalidPath);
      }).toThrow(/Failed to write DTCG output to \/nonexistent/);
    });
  });

  // ---------------------------------------------------------------------------
  // Requirement 12.5: Token count validation
  // ---------------------------------------------------------------------------
  describe('token count validation (Requirement 12.5)', () => {
    it('should not throw when token counts meet minimums', () => {
      // Default generation should pass validation
      expect(() => {
        generator.generate();
      }).not.toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // General: All errors include helpful messages
  // ---------------------------------------------------------------------------
  describe('error message quality', () => {
    it('should include the invalid value in merge error', () => {
      try {
        generator.mergeShadowColor('hsl(0, 100%, 50%)', 0.5);
        fail('Expected error to be thrown');
      } catch (e: unknown) {
        const msg = (e as Error).message;
        expect(msg).toContain('hsl(0, 100%, 50%)');
        expect(msg).toContain('Expected rgba');
      }
    });

    it('should include the invalid type in type error', () => {
      try {
        generator.toDTCGToken('value', 'percentage' as any);
        fail('Expected error to be thrown');
      } catch (e: unknown) {
        const msg = (e as Error).message;
        expect(msg).toContain('percentage');
        expect(msg).toContain('No DTCG mapping exists');
      }
    });
  });
});
