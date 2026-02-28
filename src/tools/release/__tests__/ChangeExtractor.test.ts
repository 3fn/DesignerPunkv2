/**
 * @category evergreen
 * @purpose Verify ChangeExtractor parses summary docs correctly
 */

import { ChangeExtractor } from '../pipeline/ChangeExtractor';
import { SummaryDoc } from '../types';

describe('ChangeExtractor', () => {
  let extractor: ChangeExtractor;

  beforeEach(() => {
    extractor = new ChangeExtractor();
  });

  const makeSummaryDoc = (raw: string, overrides: Partial<SummaryDoc> = {}): SummaryDoc => ({
    path: 'docs/specs/065-release-system-rebuild/task-1-summary.md',
    specName: '065-release-system-rebuild',
    taskNumber: 1,
    raw,
    ...overrides,
  });

  const fullDoc = makeSummaryDoc(`# Task 1 Summary: Summary Format Enhancement

**Date**: 2026-02-27
**Spec**: 065-release-system-rebuild
**Type**: Architecture

---

## What Was Done

Added an optional Deliverables section to the summary template.

## Why It Matters

The release tool needs structured deliverable classification.

## Key Changes

- Added Deliverables section to summary template
- Added guidance note explaining three tiers
- Updated example summary

## Impact

- ✅ Release tool gets structured data
- ✅ Fallback to section-based extraction when absent
- ✅ Minimal per-task overhead

## Deliverables *(optional)*

- 🔵 Governance: Deliverables field added to summary template
- 🟡 Tool: Release tool scaffold created

---

*For detailed notes, see completion doc*
`);

  describe('full document parsing', () => {
    it('should extract all sections', () => {
      const result = extractor.extract(fullDoc);

      expect(result.specName).toBe('065-release-system-rebuild');
      expect(result.taskTitle).toBe('Summary Format Enhancement');
      expect(result.taskType).toBe('Architecture');
      expect(result.whatWasDone).toContain('Added an optional Deliverables section');
      expect(result.whyItMatters).toContain('structured deliverable classification');
      expect(result.keyChanges).toHaveLength(3);
      expect(result.keyChanges[0]).toBe('Added Deliverables section to summary template');
      expect(result.impact).toHaveLength(3);
      expect(result.impact[0]).toBe('Release tool gets structured data');
    });

    it('should extract deliverables with correct priority and type', () => {
      const result = extractor.extract(fullDoc);

      expect(result.deliverables).toHaveLength(2);
      expect(result.deliverables![0]).toEqual({
        priority: '🔵',
        type: 'Governance',
        description: 'Deliverables field added to summary template',
      });
      expect(result.deliverables![1]).toEqual({
        priority: '🟡',
        type: 'Tool',
        description: 'Release tool scaffold created',
      });
    });
  });

  describe('document without deliverables', () => {
    it('should return undefined deliverables when section missing', () => {
      const doc = makeSummaryDoc(`# Task 2 Summary: Some Task

**Type**: Implementation

## What Was Done

Did something useful.

## Why It Matters

It matters a lot.

## Key Changes

- Change one
- Change two

## Impact

- ✅ Good outcome
`);

      const result = extractor.extract(doc);

      expect(result.deliverables).toBeUndefined();
      expect(result.taskTitle).toBe('Some Task');
      expect(result.taskType).toBe('Implementation');
      expect(result.keyChanges).toHaveLength(2);
      expect(result.impact).toHaveLength(1);
    });
  });

  describe('missing sections', () => {
    it('should handle minimal document gracefully', () => {
      const doc = makeSummaryDoc(`# Task 3 Summary: Minimal

**Type**: Setup

## What Was Done

Just this.
`);

      const result = extractor.extract(doc);

      expect(result.taskTitle).toBe('Minimal');
      expect(result.taskType).toBe('Setup');
      expect(result.whatWasDone).toBe('Just this.');
      expect(result.whyItMatters).toBe('');
      expect(result.keyChanges).toHaveLength(0);
      expect(result.impact).toHaveLength(0);
      expect(result.deliverables).toBeUndefined();
    });

    it('should handle empty document', () => {
      const doc = makeSummaryDoc('');

      const result = extractor.extract(doc);

      expect(result.taskTitle).toBe('');
      expect(result.taskType).toBe('Unknown');
      expect(result.whatWasDone).toBe('');
    });
  });

  describe('deliverable parsing edge cases', () => {
    it('should parse all three priority levels', () => {
      const doc = makeSummaryDoc(`# Task 4 Summary: Multi-tier

**Type**: Architecture

## Deliverables *(optional)*

- 🔴 Component: New ButtonCTA component
- 🟡 Build: Updated build pipeline
- 🔵 Governance: Process documentation
`);

      const result = extractor.extract(doc);

      expect(result.deliverables).toHaveLength(3);
      expect(result.deliverables![0].priority).toBe('🔴');
      expect(result.deliverables![1].priority).toBe('🟡');
      expect(result.deliverables![2].priority).toBe('🔵');
    });

    it('should skip malformed deliverable lines', () => {
      const doc = makeSummaryDoc(`# Task 5 Summary: Mixed

**Type**: Implementation

## Deliverables *(optional)*

- 🔴 Token: Valid entry
- This is not a deliverable
- 🟡 Tool: Another valid entry
`);

      const result = extractor.extract(doc);

      expect(result.deliverables).toHaveLength(2);
    });
  });

  describe('impact line cleaning', () => {
    it('should strip emoji prefixes from impact lines', () => {
      const doc = makeSummaryDoc(`# Task 6 Summary: Emoji

**Type**: Implementation

## Impact

- ✅ Good thing happened
- ⚠️ Watch out for this
- ❌ This broke
`);

      const result = extractor.extract(doc);

      expect(result.impact).toEqual([
        'Good thing happened',
        'Watch out for this',
        'This broke',
      ]);
    });
  });
});
