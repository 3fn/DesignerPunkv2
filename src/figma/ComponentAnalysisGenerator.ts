/**
 * ComponentAnalysisGenerator — Dual output generation for Component Analysis.
 *
 * Produces JSON (authoritative) and Markdown (human-readable) artifacts
 * from a ComponentAnalysis data structure.
 *
 * @see Design: .kiro/specs/054d-hierarchical-design-extraction/design.md
 * @requirements Req 7 (Dual Output Format)
 * @spec 054d-hierarchical-design-extraction
 */

import * as fs from 'fs';
import * as path from 'path';
import type {
  ComponentAnalysis,
  NodeWithClassifications,
  ClassifiedToken,
  UnidentifiedValue,
  CompositionPattern,
  UnresolvedBinding,
  ScreenshotMetadata,
} from './ComponentAnalysis';
import type { ComponentTokenDecision, ModeValidationResult, PlatformParityCheck } from './DesignExtractor';
import type { VariantMapping } from './VariantAnalyzer';

// ---------------------------------------------------------------------------
// JSON Output Generator
// ---------------------------------------------------------------------------

/**
 * Options for JSON output generation.
 */
export interface JSONOutputOptions {
  /** Base directory for analysis output (e.g. '.kiro/specs/my-spec/analysis'). */
  outputDir: string;
  /** Pretty-print indentation (default: 2). */
  indent?: number;
}

/**
 * Result of a JSON generation operation.
 */
export interface JSONOutputResult {
  /** Absolute path to the written JSON file. */
  filePath: string;
  /** Component name used in the filename. */
  componentName: string;
  /** Size of the written file in bytes. */
  sizeBytes: number;
}

/**
 * Sanitise a component name for use as a filename.
 *
 * Converts spaces, slashes, and other unsafe characters to hyphens,
 * collapses runs of hyphens, and lowercases the result.
 */
export function sanitizeComponentName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a JSON file from a ComponentAnalysis.
 *
 * Writes the complete structured data to
 * `{outputDir}/{component-name}-analysis.json`.
 *
 * @returns Metadata about the written file.
 */
export function generateComponentAnalysisJSON(
  analysis: ComponentAnalysis,
  options: JSONOutputOptions,
): JSONOutputResult {
  const indent = options.indent ?? 2;
  const safeName = sanitizeComponentName(analysis.componentName);
  const filename = `${safeName}-analysis.json`;

  // Ensure output directory exists
  const outputDir = path.resolve(options.outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, filename);
  const json = JSON.stringify(analysis, null, indent);
  fs.writeFileSync(filePath, json, 'utf-8');

  return {
    filePath,
    componentName: safeName,
    sizeBytes: Buffer.byteLength(json, 'utf-8'),
  };
}

// ---------------------------------------------------------------------------
// Markdown Output Generator
// ---------------------------------------------------------------------------

/**
 * Options for Markdown output generation.
 */
export interface MarkdownOutputOptions {
  /** Base directory for analysis output (e.g. '.kiro/specs/my-spec/analysis'). */
  outputDir: string;
}

/**
 * Result of a Markdown generation operation.
 */
export interface MarkdownOutputResult {
  /** Absolute path to the written Markdown file. */
  filePath: string;
  /** Component name used in the filename. */
  componentName: string;
  /** Size of the written file in bytes. */
  sizeBytes: number;
}

/**
 * Generate a Markdown file from a ComponentAnalysis.
 *
 * Writes a human-readable analysis to
 * `{outputDir}/{component-name}-analysis.md`.
 *
 * Sections: Classification Summary, Node Tree, Token Usage by Node,
 * Composition Patterns, Unresolved Bindings, Recommendations,
 * Unidentified Values, Screenshots.
 *
 * @returns Metadata about the written file.
 */
export function generateComponentAnalysisMarkdown(
  analysis: ComponentAnalysis,
  options: MarkdownOutputOptions,
): MarkdownOutputResult {
  const safeName = sanitizeComponentName(analysis.componentName);
  const filename = `${safeName}-analysis.md`;

  const outputDir = path.resolve(options.outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const md = renderMarkdown(analysis);
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, md, 'utf-8');

  return {
    filePath,
    componentName: safeName,
    sizeBytes: Buffer.byteLength(md, 'utf-8'),
  };
}

// ---------------------------------------------------------------------------
// Markdown rendering helpers
// ---------------------------------------------------------------------------

function renderMarkdown(a: ComponentAnalysis): string {
  const sections: string[] = [
    renderHeader(a),
    renderClassificationSummary(a),
    renderNodeTree(a.nodeTree),
    renderTokenUsageByNode(a.nodeTree),
    renderCompositionPatterns(a.compositionPatterns),
    renderUnresolvedBindings(a.unresolvedBindings),
    renderRecommendations(a.recommendations),
    renderUnidentifiedValues(a.nodeTree),
    renderScreenshots(a.screenshots),
  ];
  return sections.filter(Boolean).join('\n');
}

function renderHeader(a: ComponentAnalysis): string {
  const lines = [
    `# Component Analysis: ${a.componentName}`,
    '',
    `**Component Type**: ${a.componentType}`,
    `**Figma ID**: ${a.figmaId}`,
    `**File Key**: ${a.fileKey}`,
    `**Extracted**: ${a.extractedAt}`,
    `**Extractor Version**: ${a.extractorVersion}`,
    '',
  ];
  if (a.variantDefinitions) {
    lines.push('**Variant Definitions**:');
    for (const [name, def] of Object.entries(a.variantDefinitions)) {
      const opts = def.variantOptions ? ` (${def.variantOptions.join(', ')})` : '';
      lines.push(`- ${name}: ${def.type}, default=${String(def.defaultValue)}${opts}`);
    }
    lines.push('');
  }
  lines.push('---', '');
  return lines.join('\n');
}

function renderClassificationSummary(a: ComponentAnalysis): string {
  const s = a.classificationSummary;
  const total = s.semanticIdentified + s.primitiveIdentified + s.unidentified;
  return [
    '## Classification Summary',
    '',
    `| Tier | Count | Percentage |`,
    `| --- | --- | --- |`,
    `| ✅ Semantic Identified | ${s.semanticIdentified} | ${pct(s.semanticIdentified, total)} |`,
    `| ⚠️ Primitive Identified | ${s.primitiveIdentified} | ${pct(s.primitiveIdentified, total)} |`,
    `| ❌ Unidentified | ${s.unidentified} | ${pct(s.unidentified, total)} |`,
    `| **Total** | **${total}** | **100%** |`,
    '',
  ].join('\n');
}

function pct(n: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((n / total) * 100)}%`;
}

function renderNodeTree(node: NodeWithClassifications, indent: number = 0): string {
  if (indent === 0) {
    const lines = ['## Node Tree', ''];
    lines.push(renderNodeTreeLines(node, 0));
    lines.push('');
    return lines.join('\n');
  }
  return renderNodeTreeLines(node, indent);
}

function renderNodeTreeLines(node: NodeWithClassifications, indent: number): string {
  const prefix = '  '.repeat(indent);
  const tc = node.tokenClassifications;
  const counts = `[S:${tc.semanticIdentified.length} P:${tc.primitiveIdentified.length} U:${tc.unidentified.length}]`;
  const props = node.componentProperties
    ? ` {${Object.entries(node.componentProperties).map(([k, v]) => `${k}=${String(v.value)}`).join(', ')}}`
    : '';
  const line = `${prefix}- **${node.name}** (${node.type}, depth ${node.depth}) ${counts}${props}`;
  const childLines = node.children.map(c => renderNodeTreeLines(c, indent + 1));
  return [line, ...childLines].join('\n');
}

function renderTokenUsageByNode(node: NodeWithClassifications): string {
  const lines = ['## Token Usage by Node', ''];
  collectTokenUsage(node, lines);
  lines.push('');
  return lines.join('\n');
}

function collectTokenUsage(node: NodeWithClassifications, lines: string[]): void {
  const tc = node.tokenClassifications;
  const hasTokens = tc.semanticIdentified.length + tc.primitiveIdentified.length + tc.unidentified.length > 0;
  if (hasTokens) {
    lines.push(`### ${node.name} (${node.type}, depth ${node.depth})`);
    lines.push('');
    for (const t of tc.semanticIdentified) {
      const delta = t.delta ? ` (${t.delta})` : '';
      lines.push(`- ✅ \`${t.property}\`: ${t.semanticToken ?? t.primitiveToken} → ${t.primitiveToken} (${t.matchMethod}, ${t.confidence}${delta})`);
    }
    for (const t of tc.primitiveIdentified) {
      const delta = t.delta ? ` (${t.delta})` : '';
      lines.push(`- ⚠️ \`${t.property}\`: ${t.primitiveToken} (${t.matchMethod}, ${t.confidence}${delta})`);
    }
    for (const u of tc.unidentified) {
      const closest = u.closestMatch ? ` — closest: ${u.closestMatch.token} (${u.closestMatch.delta})` : '';
      lines.push(`- ❌ \`${u.property}\`: ${String(u.rawValue)} (${u.reason}${closest})`);
    }
    lines.push('');
  }
  for (const child of node.children) {
    collectTokenUsage(child, lines);
  }
}

function renderCompositionPatterns(patterns: CompositionPattern[]): string {
  if (patterns.length === 0) return '';
  const lines = ['## Composition Patterns', ''];
  for (const p of patterns) {
    lines.push(`### ${p.componentName} × ${p.count} (depth ${p.depth})`);
    lines.push('');
    if (Object.keys(p.sharedProperties).length > 0) {
      lines.push('**Shared Properties**:');
      for (const [k, v] of Object.entries(p.sharedProperties)) {
        lines.push(`- ${k}: ${String(v)}`);
      }
      lines.push('');
    }
    if (p.propertyVariations.length > 0) {
      lines.push('**Property Variations**:');
      for (const v of p.propertyVariations) {
        const props = Object.entries(v.properties).map(([k, val]) => `${k}=${String(val)}`).join(', ');
        lines.push(`- × ${v.count}: ${props}`);
      }
      lines.push('');
    }
  }
  return lines.join('\n');
}

function renderUnresolvedBindings(bindings: UnresolvedBinding[]): string {
  if (bindings.length === 0) return '';
  const lines = ['## Unresolved Bindings', ''];
  for (const b of bindings) {
    lines.push(`- \`${b.variableId}\` on \`${b.property}\` at **${b.nodeName}** (${b.ancestorChain.join(' → ')}) — ${b.reason}`);
  }
  lines.push('');
  return lines.join('\n');
}

const VALIDATION_DISCLAIMER =
  '⚠️ **Validation Required**: This analysis is based on Figma component structure. The optimal code structure may differ.';

const VALIDATION_PROMPTS = [
  '',
  '**Domain Specialist Validation**:',
  '- **Ada** (Token Specialist): Are token classifications correct? Should new semantic tokens be created?',
  '- **Lina** (Component Specialist): Does the component architecture match Stemma patterns?',
  '- **Thurgood** (Governance): Does this meet spec standards and test coverage requirements?',
  '',
];

function renderRecommendations(recs: ComponentAnalysis['recommendations']): string {
  const hasAny = recs.variantMapping || (recs.componentTokens && recs.componentTokens.length > 0) ||
    recs.modeValidation || recs.platformParity;
  if (!hasAny) return '';

  const lines = ['## Recommendations', ''];

  if (recs.variantMapping) {
    lines.push('### Variant Mapping');
    lines.push('');
    lines.push(VALIDATION_DISCLAIMER);
    lines.push('');
    const vm = recs.variantMapping;
    lines.push(`**Component**: ${vm.componentName}`);
    lines.push(`**Classification**: ${vm.behavioralClassification}`);
    lines.push('');
    for (const r of vm.recommendations) {
      const marker = r.recommended ? '✅ Recommended' : '';
      lines.push(`**${r.option}** ${marker}`);
      lines.push(`- ${r.description}`);
      lines.push(`- Rationale: ${r.rationale}`);
      if (r.alignsWith.length > 0) lines.push(`- Aligns with: ${r.alignsWith.join(', ')}`);
      if (r.tradeoffs.length > 0) lines.push(`- Trade-offs: ${r.tradeoffs.join(', ')}`);
      lines.push('');
    }
    if (vm.conflicts.length > 0) {
      lines.push('**Conflicts**:');
      for (const c of vm.conflicts) {
        lines.push(`- Family: ${c.familyRecommendation} vs Behavioral: ${c.behavioralRecommendation} — ${c.explanation}`);
      }
      lines.push('');
    }
    lines.push(...VALIDATION_PROMPTS);
  }

  if (recs.componentTokens && recs.componentTokens.length > 0) {
    lines.push('### Component Token Suggestions');
    lines.push('');
    lines.push(VALIDATION_DISCLAIMER);
    lines.push('');
    for (const ct of recs.componentTokens) {
      lines.push(`- **${ct.illustrativeSuggestion}** ← \`${ct.primitiveToken}\` (used ${ct.usageCount}× in ${ct.locations.join(', ')})`);
      lines.push(`  - ${ct.rationale}`);
    }
    lines.push('');
    lines.push(...VALIDATION_PROMPTS);
  }

  if (recs.modeValidation) {
    lines.push('### Mode Validation');
    lines.push('');
    lines.push(VALIDATION_DISCLAIMER);
    lines.push('');
    const mv = recs.modeValidation;
    if (mv.discrepancies.length === 0) {
      lines.push('No mode discrepancies detected.');
    } else {
      for (const d of mv.discrepancies) {
        const icon = d.category === 'unexpected' ? '⚠️' : 'ℹ️';
        lines.push(`- ${icon} \`${d.variableName}\`: light=${String(d.lightValue)}, dark=${String(d.darkValue)} (${d.category})`);
      }
    }
    lines.push('');
    lines.push(...VALIDATION_PROMPTS);
  }

  if (recs.platformParity) {
    lines.push('### Platform Parity');
    lines.push('');
    lines.push(VALIDATION_DISCLAIMER);
    lines.push('');
    const pp = recs.platformParity;
    if (pp.interactions.length === 0) {
      lines.push('No platform parity concerns detected.');
    } else {
      for (const i of pp.interactions) {
        lines.push(`- **${i.interaction}**: ${i.platforms.join(', ')} — ${i.recommendation}`);
      }
    }
    lines.push('');
    lines.push(...VALIDATION_PROMPTS);
  }

  return lines.join('\n');
}

function renderUnidentifiedValues(node: NodeWithClassifications): string {
  const values: Array<{ node: string; value: UnidentifiedValue }> = [];
  collectUnidentified(node, values);
  if (values.length === 0) return '';

  const lines = ['## Unidentified Values', ''];
  for (const { node: nodeName, value: u } of values) {
    const closest = u.closestMatch ? ` — closest: ${u.closestMatch.token} (${u.closestMatch.delta})` : '';
    const binding = u.boundVariableId ? ` [binding: ${u.boundVariableId}]` : '';
    const suggested = u.suggestedToken ? ` — suggested: \`${u.suggestedToken}\`` : '';
    lines.push(`- **${nodeName}** → \`${u.property}\`: ${String(u.rawValue)} (${u.reason}${closest}${binding}${suggested})`);
  }
  lines.push('');
  return lines.join('\n');
}

function collectUnidentified(node: NodeWithClassifications, out: Array<{ node: string; value: UnidentifiedValue }>): void {
  for (const u of node.tokenClassifications.unidentified) {
    out.push({ node: node.name, value: u });
  }
  for (const child of node.children) {
    collectUnidentified(child, out);
  }
}

function renderScreenshots(screenshots: ScreenshotMetadata[]): string {
  if (screenshots.length === 0) return '';
  const lines = ['## Screenshots', ''];
  for (const s of screenshots) {
    const caption = s.variant
      ? `${s.variant} (${s.format}, ${s.scale}x, captured ${s.capturedAt})`
      : `Component screenshot (${s.format}, ${s.scale}x, captured ${s.capturedAt})`;
    lines.push(`![${caption}](${s.filePath})`);
    lines.push(`*${caption}*`);
    lines.push('');
  }
  return lines.join('\n');
}
