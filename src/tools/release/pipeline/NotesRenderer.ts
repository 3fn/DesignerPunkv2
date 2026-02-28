/**
 * NotesRenderer for Release Tool
 *
 * Generates markdown release notes from a PipelineRecommendation.
 * Public notes include 🔴 (breaking) and 🟡 (prominent) only.
 * Internal notes include all tiers.
 */

import { PipelineRecommendation, RenderedNotes, ClassifiedChange, ReleaseData } from '../types';

const TIER_HEADINGS: Record<string, string> = {
  breaking: '🔴 Breaking / Consumer-Facing',
  prominent: '🟡 Ecosystem Changes',
  context: '🔵 Internal / Context',
};

export class NotesRenderer {
  render(recommendation: PipelineRecommendation): RenderedNotes {
    const grouped = this.groupByPriority(recommendation.changes);
    const date = new Date().toISOString().split('T')[0];

    const json: ReleaseData = {
      version: recommendation.recommendedVersion,
      previousVersion: recommendation.currentVersion,
      date,
      changes: recommendation.changes,
      recommendation,
    };

    const header = `# Release ${recommendation.recommendedVersion}\n\n**Date**: ${date}  \n**Previous**: ${recommendation.currentVersion}  \n**Bump**: ${recommendation.bumpType}\n`;

    const publicSections = this.renderSections(grouped, ['breaking', 'prominent']);
    const internalSections = this.renderSections(grouped, ['breaking', 'prominent', 'context']);

    return {
      public: publicSections ? `${header}\n${publicSections}` : `${header}\nNo consumer-facing changes in this release.\n`,
      internal: `${header}\n${internalSections || 'No changes in this release.\n'}`,
      json,
    };
  }

  private groupByPriority(changes: ClassifiedChange[]): Record<string, ClassifiedChange[]> {
    const grouped: Record<string, ClassifiedChange[]> = {};
    for (const c of changes) {
      (grouped[c.priority] ??= []).push(c);
    }
    return grouped;
  }

  private renderSections(grouped: Record<string, ClassifiedChange[]>, tiers: string[]): string {
    return tiers
      .filter((tier) => grouped[tier]?.length)
      .map((tier) => `## ${TIER_HEADINGS[tier]}\n\n${this.renderChanges(grouped[tier])}`)
      .join('\n');
  }

  private renderChanges(changes: ClassifiedChange[]): string {
    return changes
      .map((c) => {
        const lines = [`- **${c.change.taskTitle}** *(${c.deliverableType})*`];
        if (c.change.whatWasDone) lines.push(`  ${c.change.whatWasDone}`);
        return lines.join('\n');
      })
      .join('\n') + '\n';
  }
}
