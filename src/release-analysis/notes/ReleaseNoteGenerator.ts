/**
 * Release Note Generator
 * 
 * Formats extracted changes into comprehensive, readable release notes
 * following markdown standards with structured sections for different change types.
 */

import { 
  ExtractedChanges, 
  BreakingChange, 
  Feature, 
  BugFix, 
  Improvement,
  DocumentationChange 
} from '../types/AnalysisTypes';

export interface ReleaseContent {
  version: string;
  date: string;
  summary: string;
  sections: ReleaseSection[];
}

export interface ReleaseSection {
  title: string;
  items: ReleaseItem[];
  priority: number;
}

export interface ReleaseItem {
  title: string;
  description: string;
  source?: string;
  metadata?: Record<string, any>;
}

export interface ReleaseTemplate {
  format: 'markdown' | 'html' | 'plain';
  sections: TemplateSectionConfig[];
  styling: TemplateStyle;
}

export interface TemplateSectionConfig {
  type: 'breaking' | 'features' | 'fixes' | 'improvements' | 'documentation';
  title: string;
  enabled: boolean;
  priority: number;
  includeSource: boolean;
}

export interface TemplateStyle {
  headerLevel: number;
  bulletStyle: '-' | '*' | '+';
  includeMetadata: boolean;
  includeSummary: boolean;
}

export class ReleaseNoteGenerator {
  private defaultTemplate: ReleaseTemplate = {
    format: 'markdown',
    sections: [
      { type: 'breaking', title: '🚨 Breaking Changes', enabled: true, priority: 1, includeSource: true },
      { type: 'features', title: '✨ New Features', enabled: true, priority: 2, includeSource: false },
      { type: 'fixes', title: '🐛 Bug Fixes', enabled: true, priority: 3, includeSource: false },
      { type: 'improvements', title: '⚡ Improvements', enabled: true, priority: 4, includeSource: false },
      { type: 'documentation', title: '📚 Documentation', enabled: false, priority: 5, includeSource: false }
    ],
    styling: {
      headerLevel: 2,
      bulletStyle: '-',
      includeMetadata: false,
      includeSummary: true
    }
  };

  /**
   * Generate complete release notes from extracted changes
   */
  async generateReleaseNotes(
    changes: ExtractedChanges, 
    version: string, 
    template?: ReleaseTemplate
  ): Promise<string> {
    const releaseTemplate = template || this.defaultTemplate;
    const releaseContent = this.buildReleaseContent(changes, version);
    
    return this.applyTemplate(releaseContent, releaseTemplate);
  }

  /**
   * Format breaking changes with prominent highlighting and migration guidance
   */
  formatBreakingChanges(changes: BreakingChange[]): string {
    if (changes.length === 0) {
      return '';
    }

    const sections: string[] = [];
    
    changes.forEach(change => {
      let section = `- **${change.title}**`;
      
      if (change.description) {
        section += `\n  ${change.description}`;
      }
      
      if (change.affectedAPIs.length > 0) {
        section += `\n  - **Affected APIs:** ${change.affectedAPIs.join(', ')}`;
      }
      
      if (change.migrationGuidance) {
        section += `\n  - **Migration:** ${change.migrationGuidance}`;
      }
      
      if (change.severity && change.severity !== 'low') {
        section += `\n  - **Severity:** ${change.severity.toUpperCase()}`;
      }
      
      sections.push(section);
    });
    
    return sections.join('\n\n');
  }

  /**
   * Format new features with descriptions and benefits
   */
  formatNewFeatures(features: Feature[]): string {
    if (features.length === 0) {
      return '';
    }

    const sections: string[] = [];
    
    features.forEach(feature => {
      let section = `- **${feature.title}**`;
      
      if (feature.description) {
        section += `\n  ${feature.description}`;
      }
      
      if (feature.benefits.length > 0) {
        section += `\n  - **Benefits:** ${feature.benefits.join(', ')}`;
      }
      
      if (feature.category) {
        section += `\n  - **Category:** ${feature.category}`;
      }
      
      sections.push(section);
    });
    
    return sections.join('\n\n');
  }

  /**
   * Format bug fixes with clear descriptions
   */
  formatBugFixes(fixes: BugFix[]): string {
    if (fixes.length === 0) {
      return '';
    }

    const sections: string[] = [];
    
    fixes.forEach(fix => {
      let section = `- **${fix.title}**`;
      
      if (fix.description) {
        section += `\n  ${fix.description}`;
      }
      
      if (fix.issueNumber) {
        section += `\n  - **Issue:** #${fix.issueNumber}`;
      }
      
      if (fix.affectedComponents.length > 0) {
        section += `\n  - **Components:** ${fix.affectedComponents.join(', ')}`;
      }
      
      sections.push(section);
    });
    
    return sections.join('\n\n');
  }

  /**
   * Format improvements with type and impact information
   */
  formatImprovements(improvements: Improvement[]): string {
    if (improvements.length === 0) {
      return '';
    }

    const sections: string[] = [];
    
    improvements.forEach(improvement => {
      let section = `- **${improvement.title}**`;
      
      if (improvement.description) {
        section += `\n  ${improvement.description}`;
      }
      
      if (improvement.type) {
        section += `\n  - **Type:** ${improvement.type}`;
      }
      
      if (improvement.impact && improvement.impact !== 'low') {
        section += `\n  - **Impact:** ${improvement.impact}`;
      }
      
      sections.push(section);
    });
    
    return sections.join('\n\n');
  }

  /**
   * Format documentation changes
   */
  formatDocumentationChanges(docs: DocumentationChange[]): string {
    if (docs.length === 0) {
      return '';
    }

    const sections: string[] = [];
    
    docs.forEach(doc => {
      let section = `- **${doc.title}**`;
      
      if (doc.description) {
        section += `\n  ${doc.description}`;
      }
      
      if (doc.type) {
        section += `\n  - **Type:** ${doc.type}`;
      }
      
      sections.push(section);
    });
    
    return sections.join('\n\n');
  }

  /**
   * Apply template formatting to release content
   */
  applyTemplate(content: ReleaseContent, template: ReleaseTemplate): string {
    const sections: string[] = [];
    
    // Add version header
    const headerPrefix = '#'.repeat(template.styling.headerLevel - 1);
    sections.push(`${headerPrefix}# ${content.version}`);
    
    // Add date
    sections.push(`*Released: ${content.date}*`);
    
    // Add summary if enabled
    if (template.styling.includeSummary && content.summary) {
      sections.push('');
      sections.push(content.summary);
    }
    
    // Add sections in priority order
    const enabledSections = template.sections
      .filter(section => section.enabled)
      .sort((a, b) => a.priority - b.priority);
    
    enabledSections.forEach(sectionConfig => {
      const releaseSection = content.sections.find(s => 
        s.title.toLowerCase().includes(sectionConfig.type)
      );
      
      if (releaseSection && releaseSection.items.length > 0) {
        sections.push('');
        sections.push(`${headerPrefix}## ${sectionConfig.title}`);
        sections.push('');
        
        releaseSection.items.forEach(item => {
          let itemText = `${template.styling.bulletStyle} **${item.title}**`;
          
          if (item.description) {
            itemText += `\n  ${item.description}`;
          }
          
          if (sectionConfig.includeSource && item.source) {
            itemText += `\n  - **Source:** ${item.source}`;
          }
          
          sections.push(itemText);
        });
      }
    });
    
    // Add metadata if enabled
    if (template.styling.includeMetadata) {
      sections.push('');
      sections.push(`${headerPrefix}## Metadata`);
      sections.push('');
      sections.push(`${template.styling.bulletStyle} **Generated:** ${new Date().toISOString()}`);
      sections.push(`${template.styling.bulletStyle} **Total Changes:** ${content.sections.reduce((sum, s) => sum + s.items.length, 0)}`);
    }
    
    return sections.join('\n');
  }

  /**
   * Build release content structure from extracted changes
   */
  private buildReleaseContent(changes: ExtractedChanges, version: string): ReleaseContent {
    const sections: ReleaseSection[] = [];
    
    // Breaking changes section
    if (changes.breakingChanges.length > 0) {
      sections.push({
        title: 'Breaking Changes',
        priority: 1,
        items: changes.breakingChanges.map(change => ({
          title: change.title,
          description: this.buildBreakingChangeDescription(change),
          source: change.source,
          metadata: { severity: change.severity, affectedAPIs: change.affectedAPIs }
        }))
      });
    }
    
    // New features section
    if (changes.newFeatures.length > 0) {
      sections.push({
        title: 'New Features',
        priority: 2,
        items: changes.newFeatures.map(feature => ({
          title: feature.title,
          description: this.buildFeatureDescription(feature),
          source: feature.source,
          metadata: { category: feature.category, benefits: feature.benefits }
        }))
      });
    }
    
    // Bug fixes section
    if (changes.bugFixes.length > 0) {
      sections.push({
        title: 'Bug Fixes',
        priority: 3,
        items: changes.bugFixes.map(fix => ({
          title: fix.title,
          description: this.buildBugFixDescription(fix),
          source: fix.source,
          metadata: { severity: fix.severity, components: fix.affectedComponents }
        }))
      });
    }
    
    // Improvements section
    if (changes.improvements.length > 0) {
      sections.push({
        title: 'Improvements',
        priority: 4,
        items: changes.improvements.map(improvement => ({
          title: improvement.title,
          description: improvement.description,
          source: improvement.source,
          metadata: { type: improvement.type, impact: improvement.impact }
        }))
      });
    }
    
    // Documentation section
    if (changes.documentation.length > 0) {
      sections.push({
        title: 'Documentation',
        priority: 5,
        items: changes.documentation.map(doc => ({
          title: doc.title,
          description: doc.description,
          source: doc.source,
          metadata: { type: doc.type }
        }))
      });
    }
    
    return {
      version,
      date: new Date().toISOString().split('T')[0],
      summary: this.generateSummary(changes),
      sections
    };
  }

  /**
   * Build detailed description for breaking changes
   */
  private buildBreakingChangeDescription(change: BreakingChange): string {
    const parts: string[] = [];
    
    if (change.description) {
      parts.push(change.description);
    }
    
    if (change.affectedAPIs.length > 0) {
      parts.push(`Affected APIs: ${change.affectedAPIs.join(', ')}`);
    }
    
    if (change.migrationGuidance) {
      parts.push(`Migration: ${change.migrationGuidance}`);
    }
    
    return parts.join('\n  ');
  }

  /**
   * Build detailed description for features
   */
  private buildFeatureDescription(feature: Feature): string {
    const parts: string[] = [];
    
    if (feature.description) {
      parts.push(feature.description);
    }
    
    if (feature.benefits.length > 0) {
      parts.push(`Benefits: ${feature.benefits.join(', ')}`);
    }
    
    return parts.join('\n  ');
  }

  /**
   * Build detailed description for bug fixes
   */
  private buildBugFixDescription(fix: BugFix): string {
    const parts: string[] = [];
    
    if (fix.description) {
      parts.push(fix.description);
    }
    
    if (fix.issueNumber) {
      parts.push(`Issue: #${fix.issueNumber}`);
    }
    
    if (fix.affectedComponents.length > 0) {
      parts.push(`Components: ${fix.affectedComponents.join(', ')}`);
    }
    
    return parts.join('\n  ');
  }

  /**
   * Generate summary of all changes
   */
  private generateSummary(changes: ExtractedChanges): string {
    const parts: string[] = [];
    const totalChanges = changes.breakingChanges.length + 
                        changes.newFeatures.length + 
                        changes.bugFixes.length + 
                        changes.improvements.length;
    
    if (totalChanges === 0) {
      return 'No significant changes in this release.';
    }
    
    if (changes.breakingChanges.length > 0) {
      parts.push(`${changes.breakingChanges.length} breaking change${changes.breakingChanges.length > 1 ? 's' : ''}`);
    }
    
    if (changes.newFeatures.length > 0) {
      parts.push(`${changes.newFeatures.length} new feature${changes.newFeatures.length > 1 ? 's' : ''}`);
    }
    
    if (changes.bugFixes.length > 0) {
      parts.push(`${changes.bugFixes.length} bug fix${changes.bugFixes.length > 1 ? 'es' : ''}`);
    }
    
    if (changes.improvements.length > 0) {
      parts.push(`${changes.improvements.length} improvement${changes.improvements.length > 1 ? 's' : ''}`);
    }
    
    return `This release includes ${parts.join(', ')}.`;
  }
}