/**
 * Theme File Generator (Spec 080, Task 6.2)
 *
 * Generates the complete dark theme file skeleton from the live token registry.
 * Every semantic color token gets an entry — populated overrides are exported,
 * unpopulated entries are commented out with their base primitive reference.
 *
 * CI usage: regenerate and diff against existing file to detect:
 * - New tokens added to base (new commented-out entries)
 * - Tokens removed from base (orphaned entries in existing file)
 *
 * @see requirements.md R8 AC1-4
 */

import { getAllSemanticTokens } from '../tokens/semantic';
import { SemanticCategory } from '../types/SemanticToken';
import type { SemanticOverrideMap } from '../tokens/themes/types';

/** Derive a section heading from a token name prefix. */
function sectionHeading(name: string): string {
  // 'color.feedback.success.text' → 'FEEDBACK — SUCCESS'
  // 'color.structure.canvas' → 'STRUCTURE'
  // 'glow.neonPurple' → 'GLOW'
  const parts = name.startsWith('glow.') ? ['glow'] : name.replace(/^color\./, '').split('.');

  if (parts.length >= 2 && ['feedback', 'progress'].includes(parts[0])) {
    return `${parts[0].toUpperCase()} — ${parts[1].toUpperCase()}`;
  }
  return parts[0].toUpperCase();
}

/** Format a primitiveReferences object as a readable string. */
function formatRefs(refs: Record<string, string>): string {
  const entries = Object.entries(refs);
  if (entries.length === 1) return `{ ${entries[0][0]}: '${entries[0][1]}' }`;
  return '{ ' + entries.map(([k, v]) => `${k}: '${v}'`).join(', ') + ' }';
}

export function generateThemeFile(overrideMap: SemanticOverrideMap): string {
  const colorTokens = getAllSemanticTokens()
    .filter(t => t.category === SemanticCategory.COLOR);

  const lines: string[] = [
    '/**',
    ' * Dark Theme — Semantic Color Overrides',
    ' *',
    ' * AUTO-GENERATED SKELETON — do not edit section structure manually.',
    ' * To add an override: uncomment the entry, set primitiveReferences to the',
    ' * dark mode primitive(s), and add to the exported map below.',
    ' *',
    ' * @see audit/semantic-color-token-audit.md for classification rationale',
    ' * @see design.md § "Complete Theme with Fallback"',
    ' */',
    '',
    "import type { SemanticOverrideMap } from '../types';",
  ];

  // Group tokens by section
  let currentSection = '';
  for (const token of colorTokens) {
    const section = sectionHeading(token.name);
    if (section !== currentSection) {
      currentSection = section;
      lines.push('');
      lines.push('// ' + '='.repeat(70));
      lines.push(`// ${section}`);
      lines.push('// ' + '='.repeat(70));
    }

    const refs = token.primitiveReferences;
    const refsStr = formatRefs(refs);
    const wcagNote = refs.wcagValue ? ' [has wcagValue — Phase 2]' : '';
    lines.push(`// ${token.name}: ${refsStr}${wcagNote}`);
  }

  // Export map with populated overrides
  lines.push('');
  lines.push('// ' + '='.repeat(70));
  lines.push('// EXPORTED OVERRIDE MAP');
  lines.push('// ' + '='.repeat(70));

  const overrideKeys = Object.keys(overrideMap);
  if (overrideKeys.length === 0) {
    lines.push('');
    lines.push('export const darkSemanticOverrides: SemanticOverrideMap = {};');
  } else {
    lines.push('');
    lines.push('export const darkSemanticOverrides: SemanticOverrideMap = {');
    for (const key of overrideKeys) {
      const override = overrideMap[key];
      const refsStr = formatRefs(override.primitiveReferences);
      if (override.modifiers !== undefined) {
        lines.push(`  '${key}': { primitiveReferences: ${refsStr}, modifiers: ${JSON.stringify(override.modifiers)} },`);
      } else {
        lines.push(`  '${key}': { primitiveReferences: ${refsStr} },`);
      }
    }
    lines.push('};');
  }

  lines.push('');
  return lines.join('\n');
}

// CLI entry point
if (require.main === module) {
  const { darkSemanticOverrides } = require('../tokens/themes/dark/SemanticOverrides');
  const output = generateThemeFile(darkSemanticOverrides);
  console.log(output);
}
