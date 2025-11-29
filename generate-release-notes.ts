/**
 * Generate inaugural release notes from summary documents
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

interface Change {
  spec: string;
  task: string;
  title: string;
  type: string;
  keyChanges: string[];
  impact: string[];
  breaking: boolean;
}

async function generateReleaseNotes() {
  console.log('📝 Generating Inaugural Release Notes from Summary Documents\n');

  const summaryPattern = 'docs/specs/**/task-*-summary.md';
  const summaryPaths = glob.sync(summaryPattern, { cwd: process.cwd() });

  console.log(`Found ${summaryPaths.length} summary documents\n`);

  const changes: Change[] = [];
  const categories = {
    features: [] as Change[],
    improvements: [] as Change[],
    fixes: [] as Change[],
    infrastructure: [] as Change[],
    breaking: [] as Change[]
  };

  // Process each summary
  for (const path of summaryPaths) {
    try {
      const content = readFileSync(path, 'utf-8');
      
      // Extract metadata
      const titleMatch = content.match(/# (.+)/);
      const specMatch = content.match(/\*\*Spec\*\*:\s*(.+)/);
      const typeMatch = content.match(/\*\*Type\*\*:\s*(.+)/);
      
      // Extract key changes
      const keyChangesSection = content.match(/## Key Changes\n\n([\s\S]*?)(?=\n##|$)/);
      const keyChanges: string[] = [];
      if (keyChangesSection) {
        const bullets = keyChangesSection[1].match(/^- (.+)$/gm);
        if (bullets) {
          keyChanges.push(...bullets.map(b => b.replace(/^- /, '')));
        }
      }
      
      // Extract impact
      const impactSection = content.match(/## Impact\n\n([\s\S]*?)(?=\n##|---)/);
      const impact: string[] = [];
      if (impactSection) {
        const bullets = impactSection[1].match(/^- .+$/gm);
        if (bullets) {
          impact.push(...bullets.map(b => b.replace(/^- /, '')));
        }
      }
      
      // Check for breaking changes
      const isBreaking = content.toLowerCase().includes('breaking') || 
                        content.toLowerCase().includes('incompatible');
      
      const change: Change = {
        spec: specMatch ? specMatch[1].trim() : 'unknown',
        task: path.split('/').pop()?.replace('.md', '') || '',
        title: titleMatch ? titleMatch[1].trim() : '',
        type: typeMatch ? typeMatch[1].trim() : 'Implementation',
        keyChanges,
        impact,
        breaking: isBreaking
      };
      
      changes.push(change);
      
      // Categorize
      if (isBreaking) {
        categories.breaking.push(change);
      } else if (change.spec.includes('test') || change.spec.includes('fix')) {
        categories.fixes.push(change);
      } else if (change.spec.includes('infrastructure') || change.spec.includes('release')) {
        categories.infrastructure.push(change);
      } else if (change.type === 'Architecture' || change.spec.includes('system')) {
        categories.features.push(change);
      } else {
        categories.improvements.push(change);
      }
      
    } catch (error) {
      console.warn(`⚠️  Failed to process ${path}:`, error);
    }
  }

  // Generate release notes
  console.log('📊 Summary Statistics:');
  console.log(`   Total changes: ${changes.length}`);
  console.log(`   Breaking changes: ${categories.breaking.length}`);
  console.log(`   New features: ${categories.features.length}`);
  console.log(`   Improvements: ${categories.improvements.length}`);
  console.log(`   Bug fixes: ${categories.fixes.length}`);
  console.log(`   Infrastructure: ${categories.infrastructure.length}`);
  console.log('');

  // Write release notes
  let releaseNotes = `# DesignerPunk v1.0.0 - Inaugural Release

**Release Date**: November 29, 2025

This is the inaugural release of DesignerPunk v2 - a True Native cross-platform design system with mathematical foundations.

## Overview

DesignerPunk v2 represents a complete reimagining of cross-platform design systems, built on mathematical principles and optimized for AI-human collaboration. This release establishes the foundational token system, component architecture, and development infrastructure.

`;

  // Breaking changes (if any)
  if (categories.breaking.length > 0) {
    releaseNotes += `## ⚠️  Breaking Changes\n\n`;
    categories.breaking.slice(0, 10).forEach(change => {
      releaseNotes += `- **${change.title}**\n`;
      if (change.keyChanges.length > 0) {
        releaseNotes += `  ${change.keyChanges[0]}\n`;
      }
    });
    releaseNotes += `\n`;
  }

  // Features
  releaseNotes += `## ✨ New Features\n\n`;
  categories.features.slice(0, 15).forEach(change => {
    releaseNotes += `- **${change.title}**\n`;
  });
  releaseNotes += `\n`;

  // Improvements
  releaseNotes += `## 🔧 Improvements\n\n`;
  categories.improvements.slice(0, 20).forEach(change => {
    releaseNotes += `- ${change.title}\n`;
  });
  releaseNotes += `\n`;

  // Bug fixes
  releaseNotes += `## 🐛 Bug Fixes & Test Improvements\n\n`;
  categories.fixes.slice(0, 15).forEach(change => {
    releaseNotes += `- ${change.title}\n`;
  });
  releaseNotes += `\n`;

  // Infrastructure
  releaseNotes += `## 🏗️  Infrastructure\n\n`;
  categories.infrastructure.slice(0, 10).forEach(change => {
    releaseNotes += `- ${change.title}\n`;
  });
  releaseNotes += `\n`;

  releaseNotes += `## 📊 Statistics\n\n`;
  releaseNotes += `- **Total Changes**: ${changes.length} completed tasks\n`;
  releaseNotes += `- **Specs Completed**: ${new Set(changes.map(c => c.spec)).size}\n`;
  releaseNotes += `- **Components**: Icon System, ButtonCTA\n`;
  releaseNotes += `- **Token Families**: Typography, Spacing, Color, Shadow, Accessibility\n`;
  releaseNotes += `\n`;

  releaseNotes += `## 🙏 Acknowledgments\n\n`;
  releaseNotes += `This inaugural release represents months of systematic development, establishing the foundation for a new generation of design systems optimized for AI-human collaboration.\n`;

  // Write to file
  const fs = require('fs');
  fs.writeFileSync('RELEASE-NOTES-v1.0.0.md', releaseNotes);
  
  console.log('✅ Release notes generated: RELEASE-NOTES-v1.0.0.md');
}

generateReleaseNotes().catch(console.error);
