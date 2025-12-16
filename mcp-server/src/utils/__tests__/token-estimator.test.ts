/**
 * Tests for Token Count Estimator
 * 
 * Validates the token count estimation heuristic (character count / 4)
 */

import { estimateTokenCount } from '../token-estimator';

describe('Token Count Estimator', () => {
  describe('estimateTokenCount', () => {
    it('should estimate tokens for empty string', () => {
      const result = estimateTokenCount('');
      expect(result).toBe(0);
    });

    it('should estimate tokens for short text', () => {
      const content = 'Hello world';
      const result = estimateTokenCount(content);
      // 11 characters / 4 = 2.75, rounds to 3
      expect(result).toBe(3);
    });

    it('should estimate tokens for medium text', () => {
      const content = 'This is a sample document with some content that spans multiple words.';
      const result = estimateTokenCount(content);
      // 71 characters / 4 = 17.75, rounds to 18
      expect(result).toBe(18);
    });

    it('should estimate tokens for longer text', () => {
      const content = `
# Document Title

This is a longer document with multiple paragraphs.
It includes headings, line breaks, and various content.

## Section 1

Some content here with details and explanations.

## Section 2

More content with additional information.
      `.trim();
      
      const result = estimateTokenCount(content);
      // Should be roughly content.length / 4
      const expected = Math.round(content.length / 4);
      expect(result).toBe(expected);
    });

    it('should handle markdown formatting', () => {
      const content = '**Bold text** and *italic text* with [links](url)';
      const result = estimateTokenCount(content);
      // 49 characters / 4 = 12.25, rounds to 12
      expect(result).toBe(12);
    });

    it('should handle whitespace consistently', () => {
      const content = 'Text   with   multiple   spaces';
      const result = estimateTokenCount(content);
      // 31 characters / 4 = 7.75, rounds to 8
      expect(result).toBe(8);
    });

    it('should round to nearest integer', () => {
      // Test rounding down
      const content1 = 'ab'; // 2 chars / 4 = 0.5, rounds to 1
      expect(estimateTokenCount(content1)).toBe(1);
      
      // Test rounding up
      const content2 = 'abcdefgh'; // 8 chars / 4 = 2, exact
      expect(estimateTokenCount(content2)).toBe(2);
      
      // Test rounding down from .4
      const content3 = 'a'; // 1 char / 4 = 0.25, rounds to 0
      expect(estimateTokenCount(content3)).toBe(0);
    });

    it('should provide consistent estimates for same content', () => {
      const content = 'Consistent content for testing';
      const result1 = estimateTokenCount(content);
      const result2 = estimateTokenCount(content);
      expect(result1).toBe(result2);
    });
  });
});
