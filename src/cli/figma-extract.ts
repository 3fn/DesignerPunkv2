#!/usr/bin/env node

/**
 * CLI command for extracting Figma designs to design-outline.md.
 *
 * Orchestrates the full design extraction workflow:
 * 1. Parse CLI arguments (--file, --node, --output)
 * 2. Load DTCG tokens from dist/DesignTokens.dtcg.json
 * 3. Run stale port cleanup (lesson from 054c ISSUE-4)
 * 4. Connect to figma-console-mcp
 * 5. Run DesignExtractor.extractDesign()
 * 6. Generate design-outline.md with confidence flags
 * 7. Report results and exit with appropriate code
 *
 * Usage:
 *   npm run figma:extract -- --file <file-key> --node <node-id>
 *   npm run figma:extract -- --file <key> --node <id> --output ./my-outline.md
 *
 * @see Design: .kiro/specs/054b-figma-design-extract/design.md
 * @requirements Req 10 (CLI Command)
 */

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { ConsoleMCPClientImpl } from '../figma/ConsoleMCPClientImpl';
import { TokenTranslator } from '../figma/TokenTranslator';
import { VariantAnalyzer } from '../figma/VariantAnalyzer';
import { DesignExtractor } from '../figma/DesignExtractor';
import type { NoMatchEntry } from '../figma/DesignExtractor';
import { checkDesktopBridge } from '../figma/preflight';
import { cleanupStalePorts } from '../figma/portCleanup';
import type { DTCGTokenFile } from '../generators/types/DTCGTypes';
import type { MCPDocClient } from '../figma/VariantAnalyzer';

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

/** Parsed CLI arguments for figma-extract. */
export interface FigmaExtractArgs {
  file: string | undefined;
  node: string | undefined;
  output: string;
}

/**
 * Parse process.argv into structured arguments.
 *
 * Supports:
 *   --file <file-key>   Figma file key (required)
 *   --node <node-id>    Figma component node ID (required)
 *   --output <path>     Output path for design-outline.md (default: ./design-outline.md)
 */
export function parseArgs(argv: string[]): FigmaExtractArgs {
  const args: FigmaExtractArgs = {
    file: undefined,
    node: undefined,
    output: './design-outline.md',
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
      args.node = next;
      i++;
    } else if (arg === '--output') {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        console.error('❌ --output requires a file path');
        process.exit(1);
      }
      args.output = next;
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

/**
 * Stub MCPDocClient that returns null for all queries.
 *
 * In CLI mode, the DesignerPunk MCP documentation server may not be
 * available. The VariantAnalyzer handles null responses gracefully,
 * flagging missing docs with ⚠️ confidence instead of failing.
 */
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

/**
 * Print a summary of extraction results to stdout.
 */
function reportResults(
  outline: {
    extractionConfidence: {
      overall: string;
      exactMatches: number;
      approximateMatches: number;
      noMatches: number;
      requiresHumanInput: boolean;
      reviewItems: string[];
    };
  },
  noMatchEntries: NoMatchEntry[],
): void {
  const conf = outline.extractionConfidence;

  console.log('');
  console.log('📊 Extraction Results:');
  console.log(`   Overall confidence: ${conf.overall}`);
  console.log(`   ✅ Exact matches:       ${conf.exactMatches}`);
  console.log(`   ⚠️  Approximate matches: ${conf.approximateMatches}`);
  console.log(`   ❌ No matches:          ${conf.noMatches}`);

  if (conf.reviewItems.length > 0) {
    console.log('');
    console.log('📋 Items requiring review:');
    for (const item of conf.reviewItems) {
      console.log(`   - ${item}`);
    }
  }

  if (noMatchEntries.length > 0) {
    console.log('');
    console.log('❌ Unmatched values requiring human decision:');
    for (const entry of noMatchEntries) {
      const closest = entry.closestMatch
        ? `closest: ${entry.closestMatch}${entry.delta ? ` (${entry.delta})` : ''}`
        : 'no close match';
      console.log(`   • ${entry.property}: ${entry.figmaValue} — ${closest}`);
      for (const option of entry.options) {
        console.log(`     → ${option}`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main workflow
// ---------------------------------------------------------------------------

/**
 * Run the Figma design extraction workflow.
 *
 * Exported for testing — the default invocation calls this via the
 * bottom-of-file bootstrap.
 */
export async function run(argv: string[] = process.argv.slice(2)): Promise<void> {
  const args = parseArgs(argv);

  // Validate required arguments
  if (!args.file) {
    console.error('❌ Missing required argument: --file <file-key>');
    console.error('');
    console.error('Usage: npm run figma:extract -- --file <file-key> --node <node-id> [--output <path>]');
    process.exit(1);
  }

  if (!args.node) {
    console.error('❌ Missing required argument: --node <node-id>');
    console.error('');
    console.error('Usage: npm run figma:extract -- --file <file-key> --node <node-id> [--output <path>]');
    process.exit(1);
  }

  // 1. Load DTCG tokens
  console.log('📦 Loading DTCG tokens…');
  const dtcgTokens = loadDTCGTokens(DTCG_INPUT_PATH);

  // 2. Clean up stale ports (lesson from 054c ISSUE-4)
  cleanupStalePorts();

  // 3. Connect to figma-console-mcp
  console.log('🔌 Connecting to figma-console-mcp…');
  const consoleMcp = new ConsoleMCPClientImpl();
  await consoleMcp.connect();

  try {
    // 4. Pre-flight: wait for Desktop Bridge (same as figma:push)
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

    // 6. Run extraction
    console.log(`🔍 Extracting design from file ${args.file}, node ${args.node}…`);

    // Debug: dump raw getComponent response to see figma_execute results
    try {
      const rawComponent = await consoleMcp.getComponent(args.file, args.node);
      fs.writeFileSync(path.resolve('./debug-component-response.json'), JSON.stringify(rawComponent, null, 2), 'utf-8');
      console.log(`🔬 Debug: wrote response to debug-component-response.json`);
    } catch (e) {
      console.log(`🔬 Debug: getComponent failed: ${e instanceof Error ? e.message : String(e)}`);
    }

    const outline = await extractor.extractDesign(args.file, args.node);

    // 7. Generate markdown
    const markdown = extractor.generateDesignOutlineMarkdown(outline);

    // 8. Write output
    const outputPath = path.resolve(args.output);
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, markdown, 'utf-8');
    console.log(`✅ Wrote design outline: ${outputPath}`);

    // 9. Format no-match report for CLI output
    const noMatchEntries = extractor.formatNoMatchReport(outline.tokenUsage);

    // 10. Report results
    reportResults(outline, noMatchEntries);

    // 11. Exit with appropriate code
    if (outline.extractionConfidence.requiresHumanInput) {
      console.log('');
      console.log('⚠️  Human input required — review the design outline before proceeding.');
      process.exit(1);
    }

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
