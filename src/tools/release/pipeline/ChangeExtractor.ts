/**
 * ChangeExtractor for Release Tool
 *
 * Parses summary doc markdown into structured ExtractedChange objects.
 * Handles both the optional ## Deliverables field and plain section extraction.
 */

import { SummaryDoc, ExtractedChange, DeliverableEntry } from '../types';

export class ChangeExtractor {
  extract(doc: SummaryDoc): ExtractedChange {
    const sections = this.parseSections(doc.raw);

    return {
      specName: doc.specName,
      taskTitle: this.extractTitle(doc.raw),
      taskType: this.extractMetadata(doc.raw, 'Type') || 'Unknown',
      whatWasDone: sections['what was done'] || '',
      whyItMatters: sections['why it matters'] || '',
      keyChanges: this.extractList(sections['key changes'] || ''),
      impact: this.extractList(sections['impact'] || ''),
      deliverables: this.extractDeliverables(sections['deliverables'] || sections['deliverables *(optional)*'] || ''),
    };
  }

  private parseSections(raw: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const lines = raw.split('\n');
    let currentHeading = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      const headingMatch = line.match(/^##\s+(.+)$/);
      if (headingMatch) {
        if (currentHeading) {
          sections[currentHeading] = currentContent.join('\n').trim();
        }
        currentHeading = headingMatch[1].toLowerCase().trim();
        currentContent = [];
      } else if (currentHeading) {
        currentContent.push(line);
      }
    }

    if (currentHeading) {
      sections[currentHeading] = currentContent.join('\n').trim();
    }

    return sections;
  }

  private extractTitle(raw: string): string {
    const match = raw.match(/^#\s+(?:Task\s+\d+\s+Summary:\s*)?(.+)$/m);
    return match ? match[1].trim() : '';
  }

  private extractMetadata(raw: string, key: string): string | null {
    const match = raw.match(new RegExp(`\\*\\*${key}\\*\\*:\\s*(.+)`, 'i'));
    return match ? match[1].trim() : null;
  }

  private extractList(content: string): string[] {
    return content
      .split('\n')
      .filter((l) => l.trim().startsWith('-') || l.trim().startsWith('*'))
      .map((l) => l.replace(/^[-*]\s*/, '').replace(/^[\u{2000}-\u{FFFF}\u{1F000}-\u{1FFFF}]\uFE0F?\s*/u, '').trim())
      .filter((l) => l.length > 0);
  }

  private extractDeliverables(content: string): DeliverableEntry[] | undefined {
    if (!content) return undefined;

    const entries: DeliverableEntry[] = [];
    for (const line of content.split('\n')) {
      const match = line.match(/^-\s*(🔴|🟡|🔵)\s+([^:]+):\s*(.+)$/);
      if (match) {
        entries.push({
          priority: match[1] as '🔴' | '🟡' | '🔵',
          type: match[2].trim(),
          description: match[3].trim(),
        });
      }
    }

    return entries.length > 0 ? entries : undefined;
  }
}
