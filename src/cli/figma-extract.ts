#!/usr/bin/env node

/**
 * CLI command for extracting Figma component analyses.
 *
 * Orchestrates the full component analysis workflow:
 * 1. Parse CLI arguments (--file, --node [repeatable], --output-dir)
 * 2. Load DTCG tokens from dist/DesignTokens.dtcg.json
 * 3. Run stale port cleanup
 * 4. Connect to figma-console-mcp
 * 5. Run DesignExtractor.extractComponentAnalysis() per node
 * 6. Generate ComponentAnalysis JSON + Markdown files
 * 7. Report classification summary and exit
 *
 * Usage:
 *   npm run figma:extract -- --file <file-key> --node <node-id>
 *   npm run figma:extract -- --file <key> --node <id1> --node <id2> --output-dir ./analysis
 *
 * @spec 054d-hierarchical-design-extraction
 * @requirements Req 10 (CLI and Workflow Updates)
 */

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { ConsoleMCPClientImpl } from '../figma/ConsoleMCPClientImpl';
import { TokenTranslator } from '../figma/TokenTranslator';
import { VariantAnalyzer } from '../figma/VariantAnalyzer';
import { DesignExtractor } from '../figma/DesignExtractor';
import { generateComponentAnalysisJSON, generateComponentAnalysisMarkdown } from '../figma/ComponentAnalysisGenerator';
import { checkDesktopBridge } from '../figma/preflight';
import { cleanupStalePorts } from '../figma/portCleanup';
import type { DTCGTokenFile } from '../generators/types/DTCGTypes';
import type { MCPDocClient } from '../figma/VariantAnalyzer';
import type { ComponentAnalysis } from '../figma/ComponentAnalysis';

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

/** Parsed CLI arguments for figma-extract. */
export interface FigmaExtractArgs {
  file: string | undefined;
  nodes: string[];
  outputDir: string;
  fileUrl: string | undefined;
}

/**
 * Parse a Figma design URL into fileKey, nodeId, and fileUrl.
 * Returns null if the URL is not a valid Figma design URL.
 *
 * Example: https://www.figma.com/design/yU7908VXR1khQN5hZXC6Cy/DP?node-id=1230-112
 *   → { fileKey: 'yU7908VXR1khQN5hZXC6Cy', nodeId: '1230:112', fileUrl: 'https://www.figma.com/design/yU7908VXR1khQN5hZXC6Cy/DP' }
 */
export function parseFigmaUrl(url: string): { fileKey: string; nodeId?: string; fileUrl: string } | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  // Match /design/<fileKey> or /design/<fileKey>/<name>
  const match = parsed.pathname.match(/^\/design\/([^/]+)/);
  if (!match) return null;

  const fileKey = match[1];
  const fileUrl = `${parsed.origin}${parsed.pathname}`;

  const nodeIdParam = parsed.searchParams.get('node-id');
  const nodeId = nodeIdParam ? nodeIdParam.replace(/-/g, ':') : undefined;

  return { fileKey, nodeId, fileUrl };
}

/**
 * Parse process.argv into structured arguments.
 *
 * Supports:
 *   --file <file-key>       Figma file key (required unless --url provided)
 *   --node <node-id>        Figma component node ID (required, repeatable)
 *   --output-dir <path>     Output directory for analysis files (default: ./analysis)
 *   --url <figma-url>       Full Figma URL (alternative to --file + --node)
 */
export function parseArgs(argv: string[]): FigmaExtractArgs {
  const args: FigmaExtractArgs = {
    file: undefined,
    nodes: [],
    outputDir: './analysis',
    fileUrl: undefined,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--file') {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        console.error('❌ --file requires a Figma file key');
        process.exit(1);
      }
      args.file = next;
      i++;
    } else if (arg === '--node') {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        console.error('❌ --node requires a Figma node ID');
        process.exit(1);
      }
      args.nodes.push(next);
      i++;
    } else if (arg === '--output-dir') {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        console.error('❌ --output-dir requires a directory path');
        process.exit(1);
      }
      args.outputDir = next;
      i++;
    } else if (arg === '--url') {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        console.error('❌ --url requires a Figma URL');
        process.exit(1);
      }
      const parsed = parseFigmaUrl(next);
      if (!parsed) {
        console.error('❌ Invalid Figma URL. Expected: https://www.figma.com/design/<key>/...');
        process.exit(1);
      }
      args.file = parsed.fileKey;
      args.fileUrl = parsed.fileUrl;
      if (parsed.nodeId) args.nodes.push(parsed.nodeId);
      i++;
    }
  }

  return args;
}

// ---------------------------------------------------------------------------
// Token loading
// ---------------------------------------------------------------------------

/** Default path to the DTCG token file. */
const DTCG_INPUT_PATH = path.resolve('dist', 'DesignTokens.dtcg.json');

/**
 * Load and parse the DTCG token file.
 * Exits with code 1 if the file is missing or invalid.
 */
export function loadDTCGTokens(filePath: string): DTCGTokenFile {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ DTCG token file not found: ${filePath}`);
    console.error('   Run the DTCG generator first to produce this file.');
    process.exit(1);
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as DTCGTokenFile;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed to parse DTCG token file: ${message}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Stub MCPDocClient for CLI usage
// ---------------------------------------------------------------------------

class StubMCPDocClient implements MCPDocClient {
  async getDocumentFull(_path: string): Promise<string | null> {
    return null;
  }
  async getSection(_path: string, _heading: string): Promise<string | null> {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Result reporting
// ---------------------------------------------------------------------------

function reportResults(analyses: ComponentAnalysis[]): void {
  console.log('');
  console.log('📊 Classification Summary:');
  for (const a of analyses) {
    const s = a.classificationSummary;
    const total = s.semanticIdentified + s.primitiveIdentified + s.unidentified;
    console.log(`   ${a.componentName} (${total} values):`);
    console.log(`     ✅ Semantic:    ${s.semanticIdentified}`);
    console.log(`     ⚠️  Primitive:   ${s.primitiveIdentified}`);
    console.log(`     ❌ Unidentified: ${s.unidentified}`);
    if (a.screenshots.length > 0) {
      console.log(`     📸 Screenshots:  ${a.screenshots.length}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Main workflow
// ---------------------------------------------------------------------------

/**
 * Run the Figma component analysis workflow.
 *
 * Exported for testing — the default invocation calls this via the
 * bottom-of-file bootstrap.
 */
export async function run(argv: string[] = process.argv.slice(2)): Promise<void> {
  const args = parseArgs(argv);

  if (!args.file) {
    console.error('❌ Missing required argument: --file <file-key> or --url <figma-url>');
    console.error('');
    console.error('Usage: npm run figma:extract -- --file <file-key> --node <node-id> [--output-dir <path>]');
    console.error('       npm run figma:extract -- --url <figma-url> [--node <extra-node-id>] [--output-dir <path>]');
    process.exit(1);
  }

  if (args.nodes.length === 0) {
    console.error('❌ Missing required argument: --node <node-id> (or use --url with node-id in URL)');
    console.error('');
    console.error('Usage: npm run figma:extract -- --file <file-key> --node <node-id> [--output-dir <path>]');
    console.error('       npm run figma:extract -- --url <figma-url> [--node <extra-node-id>] [--output-dir <path>]');
    process.exit(1);
  }

  // 1. Load DTCG tokens
  console.log('📦 Loading DTCG tokens…');
  const dtcgTokens = loadDTCGTokens(DTCG_INPUT_PATH);

  // 2. Clean up stale ports
  cleanupStalePorts();

  // 3. Connect to figma-console-mcp
  console.log('🔌 Connecting to figma-console-mcp…');
  const consoleMcp = new ConsoleMCPClientImpl();
  await consoleMcp.connect();

  try {
    // 4. Pre-flight check
    console.log('🔍 Running pre-flight checks…');
    const preflight = await checkDesktopBridge(consoleMcp);
    if (!preflight.ready) {
      console.error(preflight.error);
      process.exit(1);
    }
    console.log('✅ Desktop Bridge is available');

    // 5. Initialize components
    const translator = new TokenTranslator(dtcgTokens);
    const analyzer = new VariantAnalyzer(new StubMCPDocClient());
    const extractor = new DesignExtractor(consoleMcp, translator, analyzer);

    // 6. Extract each component
    const baseOutputDir = path.resolve(args.outputDir);
    if (!fs.existsSync(baseOutputDir)) fs.mkdirSync(baseOutputDir, { recursive: true });
    const baseImagesDir = path.join(baseOutputDir, 'images');
    const analyses: ComponentAnalysis[] = [];
    for (const nodeId of args.nodes) {
      console.log(`🔍 Extracting component ${nodeId}…`);
      // Ensure temp images dir exists for downloads
      if (!fs.existsSync(baseImagesDir)) fs.mkdirSync(baseImagesDir, { recursive: true });

      const analysis = await extractor.extractComponentAnalysis(args.file, nodeId, baseOutputDir, args.fileUrl);
      analyses.push(analysis);

      // Build component-specific output directory
      const safeName = analysis.componentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const componentDir = path.join(baseOutputDir, `analysis-${safeName}`);
      const imagesDir = path.join(componentDir, 'images');
      if (!fs.existsSync(componentDir)) fs.mkdirSync(componentDir, { recursive: true });
      if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

      // Move downloaded screenshots to component dir
      if (fs.existsSync(baseImagesDir)) {
        for (const file of fs.readdirSync(baseImagesDir)) {
          fs.renameSync(path.join(baseImagesDir, file), path.join(imagesDir, file));
        }
        try { fs.rmdirSync(baseImagesDir); } catch { /* may not be empty */ }
      }

      // Write JSON + Markdown
      const jsonResult = generateComponentAnalysisJSON(analysis, { outputDir: componentDir });
      const mdResult = generateComponentAnalysisMarkdown(analysis, { outputDir: componentDir });
      console.log(`   ✅ ${analysis.componentName}: ${jsonResult.filePath}`);
      console.log(`   ✅ ${analysis.componentName}: ${mdResult.filePath}`);
    }

    // 8. Report results
    reportResults(analyses);

    // 9. Exit 0 — unidentified values do NOT cause failure
    process.exit(0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Extraction failed: ${message}`);
    process.exit(1);
  } finally {
    await consoleMcp.disconnect();
  }
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

/* istanbul ignore next — CLI entry point */
if (require.main === module) {
  run().catch((error) => {
    console.error('❌ Unhandled error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
