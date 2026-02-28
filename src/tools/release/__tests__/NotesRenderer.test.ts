/**
 * @category evergreen
 * @purpose Verify NotesRenderer generates correct markdown and JSON output
 */

import { NotesRenderer } from '../pipeline/NotesRenderer';
import { PipelineRecommendation, ClassifiedChange, ExtractedChange } from '../types';

describe('NotesRenderer', () => {
  let renderer: NotesRenderer;

  beforeEach(() => {
    renderer = new NotesRenderer();
    jest.useFakeTimers().setSystemTime(new Date('2026-02-27'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const makeChange = (priority: 'breaking' | 'prominent' | 'context', title: string, type: string): ClassifiedChange => ({
    change: {
      specName: '065-test',
      taskTitle: title,
      taskType: 'Implementation',
      whatWasDone: `Implemented ${title.toLowerCase()}`,
      whyItMatters: 'It matters',
      keyChanges: ['change'],
      impact: ['impact'],
    } as ExtractedChange,
    priority,
    deliverableType: type,
  });

  const makeRecommendation = (changes: ClassifiedChange[]): PipelineRecommendation => ({
    currentVersion: '7.0.0',
    recommendedVersion: '8.0.0',
    bumpType: 'major',
    rationale: 'Breaking changes detected',
    confidence: 0.9,
    changes,
  });

  describe('public notes', () => {
    it('should include breaking and prominent but not context', () => {
      const rec = makeRecommendation([
        makeChange('breaking', 'New Token', 'Token'),
        makeChange('prominent', 'Build Tool', 'Tool'),
        makeChange('context', 'Governance Update', 'Governance'),
      ]);

      const result = renderer.render(rec);

      expect(result.public).toContain('New Token');
      expect(result.public).toContain('Build Tool');
      expect(result.public).not.toContain('Governance Update');
    });

    it('should show fallback message when no public changes', () => {
      const rec = makeRecommendation([
        makeChange('context', 'Internal cleanup', 'Other'),
      ]);

      const result = renderer.render(rec);

      expect(result.public).toContain('No consumer-facing changes');
    });
  });

  describe('internal notes', () => {
    it('should include all tiers', () => {
      const rec = makeRecommendation([
        makeChange('breaking', 'New Token', 'Token'),
        makeChange('prominent', 'Build Tool', 'Tool'),
        makeChange('context', 'Governance Update', 'Governance'),
      ]);

      const result = renderer.render(rec);

      expect(result.internal).toContain('New Token');
      expect(result.internal).toContain('Build Tool');
      expect(result.internal).toContain('Governance Update');
    });
  });

  describe('markdown structure', () => {
    it('should include header with version, date, and bump type', () => {
      const rec = makeRecommendation([makeChange('breaking', 'Change', 'Token')]);
      const result = renderer.render(rec);

      expect(result.public).toContain('# Release 8.0.0');
      expect(result.public).toContain('**Date**: 2026-02-27');
      expect(result.public).toContain('**Previous**: 7.0.0');
      expect(result.public).toContain('**Bump**: major');
    });

    it('should render tier headings', () => {
      const rec = makeRecommendation([
        makeChange('breaking', 'Token Change', 'Token'),
        makeChange('prominent', 'Tool Change', 'Tool'),
      ]);

      const result = renderer.render(rec);

      expect(result.public).toContain('## 🔴 Breaking / Consumer-Facing');
      expect(result.public).toContain('## 🟡 Ecosystem Changes');
    });

    it('should render change entries with title, type, and description', () => {
      const rec = makeRecommendation([makeChange('breaking', 'New Color Token', 'Token')]);
      const result = renderer.render(rec);

      expect(result.public).toContain('- **New Color Token** *(Token)*');
      expect(result.public).toContain('Implemented new color token');
    });
  });

  describe('json output', () => {
    it('should include structured release data', () => {
      const changes = [makeChange('breaking', 'Change', 'Token')];
      const rec = makeRecommendation(changes);
      const result = renderer.render(rec);

      expect(result.json.version).toBe('8.0.0');
      expect(result.json.previousVersion).toBe('7.0.0');
      expect(result.json.date).toBe('2026-02-27');
      expect(result.json.changes).toEqual(changes);
      expect(result.json.recommendation).toBe(rec);
    });
  });

  describe('empty changes', () => {
    it('should handle recommendation with no changes', () => {
      const rec = makeRecommendation([]);
      const result = renderer.render(rec);

      expect(result.public).toContain('No consumer-facing changes');
      expect(result.internal).toContain('No changes in this release');
      expect(result.json.changes).toEqual([]);
    });
  });
});
