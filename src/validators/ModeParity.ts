/**
 * Mode Parity Audit (Spec 080, Task 6.1)
 *
 * Reports the mode-awareness status of every semantic color token:
 * - Level 2 (active override in dark theme map)
 * - Level 1 (commented-out in theme file — fallback to primitive)
 * - Mode-invariant (by design — no dark differentiation needed)
 * - Missing (not in theme file at all — theme file out of sync)
 *
 * Structural errors (override references nonexistent primitive) are
 * caught by SemanticOverrideResolver.validate(), not here.
 *
 * @see requirements.md R5 AC4-5, R7 AC3-4
 */

import * as fs from 'fs';
import * as path from 'path';
import { getAllSemanticTokens } from '../tokens/semantic';
import { SemanticCategory } from '../types/SemanticToken';
import type { SemanticOverrideMap } from '../tokens/themes/types';

export interface ModeParityEntry {
  token: string;
  classification: 'level-2' | 'level-1' | 'mode-invariant' | 'missing';
}

export interface ModeParityReport {
  total: number;
  level2: number;
  level1: number;
  modeInvariant: number;
  missing: number;
  entries: ModeParityEntry[];
}

/** Tokens that are mode-invariant by design (from Task 3 audit). */
const MODE_INVARIANT_TOKENS = new Set([
  'color.scrim.standard',
  'color.print.default',
  'glow.neonPurple',
  'glow.neonCyan',
  'glow.neonYellow',
  'glow.neonGreen',
  'glow.neonPink',
  'color.contrast.onLight',
  'color.contrast.onDark',
]);

/**
 * Run mode parity audit against the dark theme file.
 *
 * @param overrideMap - The exported dark semantic override map
 * @param themeFilePath - Path to SemanticOverrides.ts (reads comments to detect fallback entries)
 */
export function runModeParityAudit(
  overrideMap: SemanticOverrideMap,
  themeFilePath: string = path.join(__dirname, '../tokens/themes/dark/SemanticOverrides.ts')
): ModeParityReport {
  const colorTokens = getAllSemanticTokens()
    .filter(t => t.category === SemanticCategory.COLOR);

  // Read theme file to detect commented-out entries
  const themeContent = fs.readFileSync(themeFilePath, 'utf-8');

  const entries: ModeParityEntry[] = colorTokens.map(t => {
    const name = t.name;

    if (overrideMap[name]) {
      return { token: name, classification: 'level-2' as const };
    }
    if (MODE_INVARIANT_TOKENS.has(name)) {
      return { token: name, classification: 'mode-invariant' as const };
    }
    // Check if token appears in theme file (even as comment)
    if (themeContent.includes(name)) {
      return { token: name, classification: 'level-1' as const };
    }
    return { token: name, classification: 'missing' as const };
  });

  return {
    total: entries.length,
    level2: entries.filter(e => e.classification === 'level-2').length,
    level1: entries.filter(e => e.classification === 'level-1').length,
    modeInvariant: entries.filter(e => e.classification === 'mode-invariant').length,
    missing: entries.filter(e => e.classification === 'missing').length,
    entries,
  };
}

/** Format report for console/CI output. */
export function formatModeParityReport(report: ModeParityReport): string {
  const lines: string[] = [
    '🔍 Mode Parity Audit',
    `   Total semantic color tokens: ${report.total}`,
    `   Level 2 (active override):   ${report.level2}`,
    `   Level 1 (fallback to base):  ${report.level1}`,
    `   Mode-invariant:              ${report.modeInvariant}`,
  ];

  if (report.missing > 0) {
    lines.push(`   ⚠️  Missing from theme file:  ${report.missing}`);
    const missingTokens = report.entries.filter(e => e.classification === 'missing');
    for (const e of missingTokens) {
      lines.push(`       - ${e.token}`);
    }
  } else {
    lines.push('   ✅ All tokens accounted for in theme file');
  }

  return lines.join('\n');
}

// CLI entry point
if (require.main === module) {
  const { darkSemanticOverrides } = require('../tokens/themes/dark/SemanticOverrides');
  const report = runModeParityAudit(darkSemanticOverrides);
  console.log(formatModeParityReport(report));
  // Exit with warning code if tokens are missing from theme file
  if (report.missing > 0) {
    process.exit(1);
  }
}
