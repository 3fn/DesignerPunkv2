/**
 * ChangeClassifier for Release Tool
 *
 * Maps ExtractedChange objects to ClassifiedChange with priority tier.
 * Uses structured Deliverables field when present, falls back to keyword heuristics.
 */

import { ExtractedChange, ClassifiedChange, Priority } from '../types';

const PRIORITY_MAP: Record<string, Priority> = { '🔴': 'breaking', '🟡': 'prominent', '🔵': 'context' };

const KEYWORD_RULES: [RegExp, Priority, string][] = [
  [/\bbreaking\b/i, 'breaking', 'Breaking change'],
  [/\btoken\b/i, 'breaking', 'Token'],
  [/\bcomponent\b/i, 'breaking', 'Component'],
  [/\btool\b/i, 'prominent', 'Tool'],
  [/\bagent\b/i, 'prominent', 'Agent'],
  [/\bmcp\b/i, 'prominent', 'MCP'],
  [/\bbuild\b/i, 'prominent', 'Build'],
  [/\bgovernance\b/i, 'context', 'Governance'],
  [/\bprocess\b/i, 'context', 'Process'],
  [/\binfrastructure\b/i, 'context', 'Infrastructure'],
  [/\bdocumentation\b/i, 'context', 'Documentation'],
];

const PRIORITY_ORDER: Record<Priority, number> = { breaking: 0, prominent: 1, context: 2 };

export class ChangeClassifier {
  classify(changes: ExtractedChange[]): ClassifiedChange[] {
    return changes
      .map((change) => this.classifyOne(change))
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  }

  private classifyOne(change: ExtractedChange): ClassifiedChange {
    if (change.deliverables && change.deliverables.length > 0) {
      const highest = change.deliverables.reduce((best, d) =>
        PRIORITY_ORDER[PRIORITY_MAP[d.priority]] < PRIORITY_ORDER[PRIORITY_MAP[best.priority]] ? d : best,
      );
      return {
        change,
        priority: PRIORITY_MAP[highest.priority],
        deliverableType: highest.type,
      };
    }

    return this.classifyByKeywords(change);
  }

  private classifyByKeywords(change: ExtractedChange): ClassifiedChange {
    const text = [change.taskTitle, change.whatWasDone, ...change.keyChanges].join(' ');

    for (const [pattern, priority, type] of KEYWORD_RULES) {
      if (pattern.test(text)) {
        return { change, priority, deliverableType: type };
      }
    }

    return { change, priority: 'context', deliverableType: 'Other' };
  }
}
