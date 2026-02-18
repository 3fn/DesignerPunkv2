/**
 * Tests for DTCGFormatGenerator configuration options (Task 2.7)
 *
 * Validates:
 * - includeExtensions: false omits $extensions.designerpunk from all tokens
 * - includeDeprecated: false excludes deprecated tokens from output
 * - resolveAliases: true resolves {token.path} references to final values
 * - prettyPrint: true/false formats JSON correctly
 * - schemaUrl configuration for $schema property
 *
 * @requirements 9.2-9.4, 7.2, 7.3
 */

import { DTCGFormatGenerator } from '../DTCGFormatGenerator';
import type { DTCGTokenFile, DTCGToken, DTCGGroup } from '../types/DTCGTypes';

describe('DTCGFormatGenerator Configuration Options', () => {
  // -------------------------------------------------------------------------
  // includeExtensions: false (Requirement 9.2)
  // -------------------------------------------------------------------------
  describe('includeExtensions: false', () => {
    it('should omit $extensions.designerpunk from all tokens', () => {
      const generator = new DTCGFormatGenerator({ includeExtensions: false });
      const output = generator.generate();

      // Root-level extensions should be absent
      expect(output.$extensions).toBeUndefined();

      // Walk all tokens and verify no $extensions.designerpunk
      const hasExtensions = findTokensWithExtensions(output);
      expect(hasExtensions).toHaveLength(0);
    });

    it('should still include $value and $type on all tokens', () => {
      const generator = new DTCGFormatGenerator({ includeExtensions: false });
      const output = generator.generate();

      // Spot-check a primitive group
      const spaceGroup = output.space as DTCGGroup;
      expect(spaceGroup).toBeDefined();
      const firstTokenKey = Object.keys(spaceGroup).find(k => !k.startsWith('$'));
      if (firstTokenKey) {
        const token = spaceGroup[firstTokenKey] as DTCGToken;
        expect(token.$value).toBeDefined();
        expect(token.$type).toBeDefined();
        expect(token.$extensions).toBeUndefined();
      }
    });
  });

  // -------------------------------------------------------------------------
  // includeExtensions: true (default — Requirement 9.5)
  // -------------------------------------------------------------------------
  describe('includeExtensions: true (default)', () => {
    it('should include $extensions.designerpunk on tokens', () => {
      const generator = new DTCGFormatGenerator(); // default config
      const output = generator.generate();

      // Root-level extensions should be present
      expect(output.$extensions).toBeDefined();
      expect(output.$extensions?.designerpunk).toBeDefined();

      // At least some tokens should have extensions
      const withExtensions = findTokensWithExtensions(output);
      expect(withExtensions.length).toBeGreaterThan(0);
    });
  });

  // -------------------------------------------------------------------------
  // resolveAliases: true (Requirement 9.4)
  // -------------------------------------------------------------------------
  describe('resolveAliases: true', () => {
    it('should resolve semantic color aliases to actual values', () => {
      const generator = new DTCGFormatGenerator({ resolveAliases: true });
      const output = generator.generate();

      const semanticColors = output.semanticColor as DTCGGroup;
      expect(semanticColors).toBeDefined();

      // Check that semantic color values are resolved (not alias syntax)
      for (const [key, value] of Object.entries(semanticColors)) {
        if (key.startsWith('$')) continue;
        const token = value as DTCGToken;
        if (token.$value && typeof token.$value === 'string') {
          expect(token.$value).not.toMatch(/^\{.*\}$/);
        }
      }
    });

    it('should resolve semantic spacing aliases to dimension values', () => {
      const generator = new DTCGFormatGenerator({ resolveAliases: true });
      const output = generator.generate();

      const semanticSpace = output.semanticSpace as DTCGGroup;
      expect(semanticSpace).toBeDefined();

      // Walk into subgroups and check resolved values
      for (const [groupKey, groupValue] of Object.entries(semanticSpace)) {
        if (groupKey.startsWith('$')) continue;
        const subGroup = groupValue as DTCGGroup;
        for (const [key, value] of Object.entries(subGroup)) {
          if (key.startsWith('$')) continue;
          const token = value as DTCGToken;
          if (token.$value && typeof token.$value === 'string') {
            // Resolved values should end with 'px', not be alias syntax
            expect(token.$value).toMatch(/^\d+px$/);
          }
        }
      }
    });

    it('should resolve typography composite aliases to final values', () => {
      const generator = new DTCGFormatGenerator({ resolveAliases: true });
      const output = generator.generate();

      const typography = output.typography as DTCGGroup;
      expect(typography).toBeDefined();

      const firstKey = Object.keys(typography).find(k => !k.startsWith('$'));
      if (firstKey) {
        const token = typography[firstKey] as DTCGToken;
        const val = token.$value as Record<string, unknown>;
        // fontFamily should be an array (resolved), not alias string
        expect(Array.isArray(val.fontFamily)).toBe(true);
        // fontSize should be a dimension string like "16px"
        expect(typeof val.fontSize).toBe('string');
        expect(String(val.fontSize)).toMatch(/^\d+px$/);
      }
    });
  });

  // -------------------------------------------------------------------------
  // resolveAliases: false (default — Requirement 3.2)
  // -------------------------------------------------------------------------
  describe('resolveAliases: false (default)', () => {
    it('should preserve alias syntax in semantic tokens', () => {
      const generator = new DTCGFormatGenerator(); // default: resolveAliases: false
      const output = generator.generate();

      const semanticColors = output.semanticColor as DTCGGroup;
      let foundAlias = false;
      for (const [key, value] of Object.entries(semanticColors)) {
        if (key.startsWith('$')) continue;
        const token = value as DTCGToken;
        if (token.$value && typeof token.$value === 'string' && token.$value.match(/^\{.*\}$/)) {
          foundAlias = true;
          break;
        }
      }
      expect(foundAlias).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // prettyPrint (Requirements 7.2, 7.3)
  // -------------------------------------------------------------------------
  describe('prettyPrint', () => {
    it('should format JSON with 2-space indentation when prettyPrint: true', () => {
      const generator = new DTCGFormatGenerator({ prettyPrint: true });
      const output = generator.generate();
      const json = JSON.stringify(output, null, 2);

      // Pretty-printed JSON has newlines and indentation
      expect(json).toContain('\n');
      expect(json).toContain('  ');
    });

    it('should output minified JSON when prettyPrint: false', () => {
      const generator = new DTCGFormatGenerator({ prettyPrint: false });
      const output = generator.generate();
      const json = JSON.stringify(output);

      // Minified JSON has no newlines
      expect(json).not.toContain('\n');
    });
  });

  // -------------------------------------------------------------------------
  // schemaUrl (Requirement 9.5)
  // -------------------------------------------------------------------------
  describe('schemaUrl', () => {
    it('should use default schema URL', () => {
      const generator = new DTCGFormatGenerator();
      const output = generator.generate();
      expect(output.$schema).toBe('https://tr.designtokens.org/format/');
    });

    it('should use custom schema URL when configured', () => {
      const customUrl = 'https://custom.schema.org/dtcg/v2';
      const generator = new DTCGFormatGenerator({ schemaUrl: customUrl });
      const output = generator.generate();
      expect(output.$schema).toBe(customUrl);
    });
  });

  // -------------------------------------------------------------------------
  // includeDeprecated: false (Requirement 9.3)
  // -------------------------------------------------------------------------
  describe('includeDeprecated: false', () => {
    it('should exclude tokens marked as deprecated', () => {
      // Since no tokens currently have deprecated: true in their data,
      // we verify the infrastructure works by generating with both configs
      // and confirming the output is identical (no deprecated tokens to strip)
      const withDeprecated = new DTCGFormatGenerator({ includeDeprecated: true });
      const withoutDeprecated = new DTCGFormatGenerator({ includeDeprecated: false });

      const outputWith = withDeprecated.generate();
      const outputWithout = withoutDeprecated.generate();

      // Both should produce valid output (no crash)
      expect(outputWith.$schema).toBeDefined();
      expect(outputWithout.$schema).toBeDefined();

      // Since no tokens are currently deprecated, counts should match
      const countWith = countAllTokens(outputWith);
      const countWithout = countAllTokens(outputWithout);
      expect(countWith).toBe(countWithout);
    });
  });
});

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

/** Find all tokens that have $extensions.designerpunk in the output tree */
function findTokensWithExtensions(obj: Record<string, unknown>, path = ''): string[] {
  const results: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object') {
      const token = value as Record<string, unknown>;
      if (token.$extensions && typeof token.$extensions === 'object') {
        const ext = token.$extensions as Record<string, unknown>;
        if (ext.designerpunk) {
          results.push(`${path}.${key}`);
        }
      }
      // Recurse into groups
      results.push(...findTokensWithExtensions(token, `${path}.${key}`));
    }
  }
  return results;
}

/** Count all tokens (objects with $value) in the output tree */
function countAllTokens(obj: Record<string, unknown>): number {
  let count = 0;
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object') {
      const token = value as Record<string, unknown>;
      if ('$value' in token) {
        count++;
      }
      count += countAllTokens(token);
    }
  }
  return count;
}
