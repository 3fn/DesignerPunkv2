/**
 * @category evergreen
 * @purpose Verify ChangeClassifier maps changes to correct priority tiers
 */

import { ChangeClassifier } from '../pipeline/ChangeClassifier';
import { ExtractedChange } from '../types';

describe('ChangeClassifier', () => {
  let classifier: ChangeClassifier;

  beforeEach(() => {
    classifier = new ChangeClassifier();
  });

  const makeChange = (overrides: Partial<ExtractedChange> = {}): ExtractedChange => ({
    specName: '065-test',
    taskTitle: 'Test task',
    taskType: 'Implementation',
    whatWasDone: 'Did something',
    whyItMatters: 'It matters',
    keyChanges: ['change 1'],
    impact: ['impact 1'],
    ...overrides,
  });

  describe('structured deliverables path', () => {
    it('should use deliverable priority directly', () => {
      const change = makeChange({
        deliverables: [{ priority: '🔴', type: 'Component', description: 'New ButtonCTA' }],
      });

      const results = classifier.classify([change]);

      expect(results[0].priority).toBe('breaking');
      expect(results[0].deliverableType).toBe('Component');
    });

    it('should use highest priority when multiple deliverables', () => {
      const change = makeChange({
        deliverables: [
          { priority: '🔵', type: 'Governance', description: 'Process update' },
          { priority: '🔴', type: 'Token', description: 'New color token' },
          { priority: '🟡', type: 'Tool', description: 'Build change' },
        ],
      });

      const results = classifier.classify([change]);

      expect(results[0].priority).toBe('breaking');
      expect(results[0].deliverableType).toBe('Token');
    });

    it('should map all three emoji priorities', () => {
      const changes = [
        makeChange({ deliverables: [{ priority: '🔴', type: 'Token', description: 'x' }] }),
        makeChange({ deliverables: [{ priority: '🟡', type: 'Tool', description: 'x' }] }),
        makeChange({ deliverables: [{ priority: '🔵', type: 'Governance', description: 'x' }] }),
      ];

      const results = classifier.classify(changes);

      expect(results[0].priority).toBe('breaking');
      expect(results[1].priority).toBe('prominent');
      expect(results[2].priority).toBe('context');
    });
  });

  describe('keyword heuristics fallback', () => {
    it('should classify token changes as breaking', () => {
      const change = makeChange({ taskTitle: 'Add new color token' });
      const results = classifier.classify([change]);
      expect(results[0].priority).toBe('breaking');
      expect(results[0].deliverableType).toBe('Token');
    });

    it('should classify component changes as breaking', () => {
      const change = makeChange({ whatWasDone: 'Created new component scaffold' });
      const results = classifier.classify([change]);
      expect(results[0].priority).toBe('breaking');
      expect(results[0].deliverableType).toBe('Component');
    });

    it('should classify tool changes as prominent', () => {
      const change = makeChange({ taskTitle: 'Build tool improvements' });
      const results = classifier.classify([change]);
      expect(results[0].priority).toBe('prominent');
    });

    it('should classify governance changes as context', () => {
      const change = makeChange({ keyChanges: ['Updated governance documentation'] });
      const results = classifier.classify([change]);
      expect(results[0].priority).toBe('context');
    });

    it('should default to context when no keywords match', () => {
      const change = makeChange({ taskTitle: 'Miscellaneous cleanup', whatWasDone: 'Cleaned up files', keyChanges: ['removed old stuff'] });
      const results = classifier.classify([change]);
      expect(results[0].priority).toBe('context');
      expect(results[0].deliverableType).toBe('Other');
    });
  });

  describe('sorting', () => {
    it('should sort by priority: breaking > prominent > context', () => {
      const changes = [
        makeChange({ taskTitle: 'Governance update', deliverables: [{ priority: '🔵', type: 'Governance', description: 'x' }] }),
        makeChange({ taskTitle: 'New token', deliverables: [{ priority: '🔴', type: 'Token', description: 'x' }] }),
        makeChange({ taskTitle: 'New tool', deliverables: [{ priority: '🟡', type: 'Tool', description: 'x' }] }),
      ];

      const results = classifier.classify(changes);

      expect(results[0].priority).toBe('breaking');
      expect(results[1].priority).toBe('prominent');
      expect(results[2].priority).toBe('context');
    });
  });

  describe('mixed structured and heuristic', () => {
    it('should handle mix of deliverable and no-deliverable changes', () => {
      const changes = [
        makeChange({ taskTitle: 'Misc cleanup', whatWasDone: 'Cleaned things', keyChanges: ['stuff'] }),
        makeChange({ deliverables: [{ priority: '🔴', type: 'Component', description: 'New component' }] }),
      ];

      const results = classifier.classify(changes);

      expect(results[0].priority).toBe('breaking');
      expect(results[1].priority).toBe('context');
    });
  });
});
