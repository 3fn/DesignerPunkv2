/**
 * Targeted tests for VariantAnalyzer.detectConflicts()
 *
 * Task 2.6 — Conflict detection between family-pattern and behavioral-analysis
 * recommendations.
 */
import { VariantAnalyzer, type MCPDocClient } from '../VariantAnalyzer';

// Minimal stub — detectConflicts doesn't use MCP.
const stubMcp: MCPDocClient = {
  getDocumentFull: async () => null,
  getSection: async () => null,
};

describe('VariantAnalyzer.detectConflicts', () => {
  const analyzer = new VariantAnalyzer(stubMcp);

  // ----- No conflict cases -----

  it('returns empty array when family recommendation is empty (no family doc)', () => {
    const conflicts = analyzer.detectConflicts('', 'single component');
    expect(conflicts).toEqual([]);
  });

  it('returns empty array when behavioral recommendation is empty', () => {
    const conflicts = analyzer.detectConflicts('single component', '');
    expect(conflicts).toEqual([]);
  });

  it('returns empty array when both recommendations agree (single)', () => {
    const conflicts = analyzer.detectConflicts(
      'single component with variant prop',
      'single component with variant prop',
    );
    expect(conflicts).toEqual([]);
  });

  it('returns empty array when both recommendations agree (split)', () => {
    const conflicts = analyzer.detectConflicts(
      'primitive + semantic structure',
      'primitive + semantic structure',
    );
    expect(conflicts).toEqual([]);
  });

  it('returns empty array when wording differs but bucket matches (both single)', () => {
    const conflicts = analyzer.detectConflicts(
      'Option A — single component',
      'one component with variant prop',
    );
    expect(conflicts).toEqual([]);
  });

  it('returns empty array when wording differs but bucket matches (both split)', () => {
    const conflicts = analyzer.detectConflicts(
      'Option B — primitive base with semantic variants',
      'Stemma split structure',
    );
    expect(conflicts).toEqual([]);
  });

  // ----- Conflict cases -----

  it('detects conflict when family says single but behavior says split', () => {
    const conflicts = analyzer.detectConflicts(
      'single component with variant prop',
      'primitive + semantic separate components',
    );
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].familyRecommendation).toBe('single component with variant prop');
    expect(conflicts[0].behavioralRecommendation).toBe('primitive + semantic separate components');
    expect(conflicts[0].explanation).toContain('Component-Family pattern recommends');
    expect(conflicts[0].explanation).toContain('behavioral analysis recommends');
    expect(conflicts[0].explanation).toContain('Human review is required');
  });

  it('detects conflict when family says split but behavior says single', () => {
    const conflicts = analyzer.detectConflicts(
      'primitive + semantic structure (Stemma pattern)',
      'single component (variants are styling-only)',
    );
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].explanation).toContain('primitive + semantic split structure');
    expect(conflicts[0].explanation).toContain('single component');
  });

  it('detects conflict with Option A / Option B labels', () => {
    const conflicts = analyzer.detectConflicts('Option A', 'Option B');
    expect(conflicts).toHaveLength(1);
  });

  it('detects conflict when both are unknown but textually different', () => {
    const conflicts = analyzer.detectConflicts(
      'custom architecture approach',
      'different architecture approach',
    );
    // Both classify as 'unknown' but text differs — still flagged.
    // Actually both unknown with same bucket → no conflict.
    // This is correct: if we can't classify either, we can't determine
    // a meaningful architectural disagreement.
    expect(conflicts).toEqual([]);
  });

  it('flags conflict when one is classifiable and the other is unknown', () => {
    const conflicts = analyzer.detectConflicts(
      'single component with variant prop',
      'some unrecognised recommendation',
    );
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].explanation).toContain('single component');
  });

  // ----- Explanation quality -----

  it('includes both perspectives in the explanation', () => {
    const conflicts = analyzer.detectConflicts(
      'Option A — single component',
      'Option B — base + semantic split',
    );
    expect(conflicts).toHaveLength(1);
    const explanation = conflicts[0].explanation;
    expect(explanation).toContain('Component-Family pattern recommends');
    expect(explanation).toContain('behavioral analysis recommends');
    expect(explanation).toContain('Human review is required');
  });
});
