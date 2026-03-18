/**
 * Mode Classifier
 *
 * Classifies semantic color tokens by mode-awareness level for component MCP responses.
 * Reads SemanticOverrides.ts as text to extract Level 2 keys — no pipeline coupling.
 *
 * Classification:
 * - level-2: token name appears in the exported SemanticOverrideMap
 * - mode-invariant: token is in the known mode-invariant set
 * - level-1: color token not in the above (primitive handles mode)
 *
 * @see .kiro/specs/080-rosetta-mode-architecture/audit/semantic-color-token-audit.md
 * @see Lina R1 F41, Ada R10
 */

import * as fs from 'fs';
import * as path from 'path';

export type ModeLevel = 'level-1' | 'level-2' | 'mode-invariant';

/**
 * Tokens classified as mode-invariant by the semantic color token audit.
 * These have identical values in both modes by design.
 *
 * @see audit/semantic-color-token-audit.md § "Mode-Invariant Tokens"
 */
const MODE_INVARIANT_TOKENS = new Set([
  'color.scrim.standard',
  'color.print.default',
  'color.contrast.onLight',
  'color.contrast.onDark',
  'glow.neonPurple',
  'glow.neonCyan',
  'glow.neonYellow',
  'glow.neonGreen',
  'glow.neonPink',
]);

/** Prefixes that identify color tokens in the token namespace. */
const COLOR_PREFIXES = ['color.', 'glow.'];

function isColorToken(name: string): boolean {
  return COLOR_PREFIXES.some(p => name.startsWith(p));
}

/**
 * Extract override keys from SemanticOverrides.ts by parsing the exported map.
 * Reads the file as text and matches string-literal keys — no TS compilation needed.
 */
function extractOverrideKeys(overridesPath: string): Set<string> {
  const keys = new Set<string>();
  if (!fs.existsSync(overridesPath)) return keys;

  const content = fs.readFileSync(overridesPath, 'utf-8');

  // Match keys in the exported map: 'token.name': { primitiveReferences: ... }
  const keyPattern = /^\s*'([^']+)':\s*\{\s*primitiveReferences:/gm;
  let match: RegExpExecArray | null;
  while ((match = keyPattern.exec(content)) !== null) {
    keys.add(match[1]);
  }
  return keys;
}

export class ModeClassifier {
  private level2Keys = new Set<string>();
  private warnings: string[] = [];

  /**
   * Load classification data from the project's SemanticOverrides file.
   * @param projectRoot Absolute path to the project root
   */
  load(projectRoot: string): void {
    const overridesPath = path.join(projectRoot, 'src/tokens/themes/dark/SemanticOverrides.ts');
    this.level2Keys = extractOverrideKeys(overridesPath);
    if (!fs.existsSync(overridesPath)) {
      this.warnings.push('SemanticOverrides.ts not found — mode classification unavailable');
    }
  }

  /** Classify a single token. Returns null for non-color tokens. */
  classify(tokenName: string): ModeLevel | null {
    if (!isColorToken(tokenName)) return null;
    if (this.level2Keys.has(tokenName)) return 'level-2';
    if (MODE_INVARIANT_TOKENS.has(tokenName)) return 'mode-invariant';
    return 'level-1';
  }

  /** Classify all color tokens in a list. Returns map of token name → level (color tokens only). */
  classifyAll(tokens: string[]): Record<string, ModeLevel> {
    const result: Record<string, ModeLevel> = {};
    for (const t of tokens) {
      const level = this.classify(t);
      if (level) result[t] = level;
    }
    return result;
  }

  getWarnings(): string[] {
    return this.warnings;
  }
}
